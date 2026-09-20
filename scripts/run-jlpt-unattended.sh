#!/usr/bin/env bash
# Supervises one local JLPT unit per sandboxed Codex invocation. Network durability
# is owned by this outer shell, never by the child Codex process.
set -euo pipefail

MAX_TURNS=100
DRY_RUN=0
RATE_RETRY_DELAYS=(60 180 300)
PUSH_RETRIES=3
PUSH_RETRY_DELAY=30

usage() { echo "usage: $0 [--dry-run] [--max-turns N]" >&2; }
while (($#)); do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --max-turns)
      [[ ${2:-} =~ ^[1-9][0-9]*$ ]] || { usage; exit 64; }
      MAX_TURNS=$2; shift 2 ;;
    *) usage; exit 64 ;;
  esac
done

if [[ ${JLPT_UNATTENDED_TEST_MODE:-0} == 1 ]]; then
  RATE_RETRY_DELAYS=(0 0 0)
  PUSH_RETRY_DELAY=0
fi

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "not a Git repository" >&2; exit 2; }
cd "$root"
for required in package.json src assets scripts docs/AI_SESSION_START_HERE.md \
  docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md scripts/check-work-persistence.mjs \
  scripts/check-jlpt-approved-ui-lock.mjs; do
  [[ -e $required ]] || { echo "missing required path: $required" >&2; exit 2; }
done

branch=$(git branch --show-current)
[[ -n $branch ]] || { echo "detached HEAD is not supported" >&2; exit 2; }
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null) || {
  echo "branch $branch has no configured upstream" >&2; exit 2;
}
remote=${upstream%%/*}
remote_branch=${upstream#*/}
[[ $remote != "$upstream" && -n $remote_branch ]] || { echo "cannot parse upstream: $upstream" >&2; exit 2; }

if [[ -n $(git status --porcelain) && $DRY_RUN -eq 0 ]]; then
  echo "working tree is not clean; preserving all files and refusing to start" >&2
  git status --short >&2
  exit 2
fi

repo_key=$(printf '%s' "$root" | shasum -a 256 | awk '{print substr($1,1,12)}')
log_base=${JLPT_UNATTENDED_LOG_DIR:-${TMPDIR:-/tmp}/japan-app-jlpt-unattended-logs}
log_dir="$log_base/$repo_key"
lock_dir="$log_dir/supervisor.lock"
mkdir -p "$log_dir"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "another supervisor is active: $(sed -n '1p' "$lock_dir/pid" 2>/dev/null || echo unknown)" >&2
  exit 3
fi
printf '%s\n' "$$" > "$lock_dir/pid"
cleanup_lock() { rm -f "$lock_dir/pid"; rmdir "$lock_dir" 2>/dev/null || true; }
trap cleanup_lock EXIT INT TERM

run_ui_lock() { node scripts/check-jlpt-approved-ui-lock.mjs; }

push_with_retry() {
  local log=$1 attempt
  for ((attempt=1; attempt<=PUSH_RETRIES; attempt++)); do
    if git push "$remote" "HEAD:refs/heads/$remote_branch" >>"$log" 2>&1; then return 0; fi
    printf 'push attempt %s/%s failed; local commit preserved\n' "$attempt" "$PUSH_RETRIES" >>"$log"
    if ((attempt < PUSH_RETRIES)); then sleep "$PUSH_RETRY_DELAY"; fi
  done
  return 1
}

persist_head() {
  local log=$1
  if ! push_with_retry "$log"; then
    echo "STOP: push failed 3 times; local commit and files preserved; log=$log" >&2
    return 1
  fi
  git fetch "$remote" "$remote_branch" >>"$log" 2>&1 || {
    echo "STOP: fetch failed after push; local commit preserved; log=$log" >&2; return 1;
  }
  node scripts/check-work-persistence.mjs >>"$log" 2>&1 || {
    echo "STOP: persistence verification failed; local commit preserved; log=$log" >&2; return 1;
  }
}

record_durable_unit() {
  local unit_sha=$1 exam_id=$2 unit=$3 log=$4
  local matches checkpoint record_sha
  matches=$(rg -l -F "$exam_id" docs/jlpt-workspace/conversion \
    --glob 'CONVERSION_CHECKPOINT.md' || true)
  if [[ $(printf '%s\n' "$matches" | sed '/^$/d' | wc -l | tr -d ' ') != 1 ]]; then
    echo "STOP: cannot uniquely resolve checkpoint for $exam_id; unit commit is remote-safe; log=$log" >&2
    return 1
  fi
  checkpoint=$matches
  if rg -q -F "$unit_sha" "$checkpoint"; then return 0; fi
  printf '\n- Supervisor durable unit: `%s` | `%s` | `%s`\n' \
    "$unit_sha" "$unit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >>"$checkpoint"
  git add -- "$checkpoint"
  git commit -m "docs(jlpt): record $exam_id durable unit" >>"$log" 2>&1 || {
    echo "STOP: could not commit durable checkpoint record; files preserved; log=$log" >&2; return 1;
  }
  record_sha=$(git rev-parse HEAD)
  git diff --check HEAD^..HEAD >>"$log" 2>&1 || {
    echo "STOP: durable checkpoint diff failed; commit $record_sha preserved; log=$log" >&2; return 1;
  }
  run_ui_lock >>"$log" 2>&1 || {
    echo "STOP: UI lock failed after checkpoint record; commit $record_sha preserved; log=$log" >&2; return 1;
  }
  persist_head "$log"
}

if ((DRY_RUN)); then
  run_ui_lock >/dev/null
  printf 'DRY RUN PASS | branch=%s | upstream=%s | max-turns=%s | log=%s | model=not-called\n' \
    "$branch" "$upstream" "$MAX_TURNS" "$log_dir"
  exit 0
fi

startup_log="$log_dir/startup-$(date +%Y%m%d-%H%M%S).log"
git fetch "$remote" "$remote_branch" >>"$startup_log" 2>&1 || {
  echo "STOP: initial fetch failed; no model invoked; log=$startup_log" >&2; exit 5;
}
local_head=$(git rev-parse HEAD)
remote_head=$(git rev-parse "$upstream")
if [[ $local_head != "$remote_head" ]]; then
  if git merge-base --is-ancestor "$remote_head" "$local_head"; then
    persist_head "$startup_log" || exit 6
    printf 'RECOVERY | prior local SHA %s | remote PASS\n' "$local_head"
  elif git merge-base --is-ancestor "$local_head" "$remote_head"; then
    echo "STOP: local branch is behind $upstream; no files changed" >&2; exit 6
  else
    echo "STOP: local branch diverged from $upstream; no files changed" >&2; exit 6
  fi
fi
run_ui_lock >>"$startup_log" 2>&1
node scripts/check-work-persistence.mjs >>"$startup_log" 2>&1

prompt_file=docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md
codex_bin=${JLPT_UNATTENDED_CODEX_BIN:-codex}
has_repository_next_action() {
  rg -q '(^|[`[:space:]])(Next:|nextAction|NEXT_ACTION|next unit|Next action)' \
    docs/jlpt-workspace/conversion --glob 'CONVERSION_CHECKPOINT.md'
}

for ((turn=1; turn<=MAX_TURNS; turn++)); do
  turn_started=$(date +%Y%m%d-%H%M%S)
  log="$log_dir/turn-${turn}-${turn_started}.log"
  result="$log_dir/turn-${turn}-${turn_started}.result"
  before_sha=$(git rev-parse HEAD)
  prompt=$(<"$prompt_file")
  codex_rc=1
  rate_attempt=0

  while :; do
    rm -f "$result"
    set +e
    "$codex_bin" exec --sandbox workspace-write -C "$root" \
      --output-last-message "$result" "$prompt" >"$log" 2>&1
    codex_rc=$?
    set -e
    after_attempt_sha=$(git rev-parse HEAD)
    if [[ -n $(git status --porcelain) || $after_attempt_sha != "$before_sha" ]]; then break; fi
    marker_text=$(sed -n '1p' "$result" 2>/dev/null || true)
    if [[ $marker_text == RATE_LIMITED ]] || rg -qi \
      'rate.?limit|capacity|too many requests|resource exhausted|temporarily unavailable' "$log" "$result" 2>/dev/null; then
      if ((rate_attempt >= ${#RATE_RETRY_DELAYS[@]})); then
        echo "STOP: rate/capacity limit after retries; tree clean; log=$log" >&2; exit 10
      fi
      sleep "${RATE_RETRY_DELAYS[$rate_attempt]}"
      ((rate_attempt+=1))
      continue
    fi
    break
  done

  after_sha=$(git rev-parse HEAD)
  dirty=$(git status --porcelain)
  if [[ -n $dirty ]]; then
    { echo "uncommitted files left by child Codex:"; printf '%s\n' "$dirty"; } >>"$log"
    echo "STOP: child left uncommitted files; everything preserved; log=$log" >&2
    printf '%s\n' "$dirty" >&2
    exit 7
  fi

  marker=$(sed -n '1p' "$result" 2>/dev/null || true)
  if [[ $after_sha != "$before_sha" ]]; then
    if ! git merge-base --is-ancestor "$before_sha" "$after_sha"; then
      echo "STOP: child rewrote history; current state preserved; log=$log" >&2; exit 7
    fi
    commit_count=$(git rev-list --count "$before_sha..$after_sha")
    [[ $commit_count == 1 ]] || {
      echo "STOP: child created $commit_count commits instead of one; state preserved; log=$log" >&2; exit 7;
    }
    git diff --check "$before_sha..$after_sha" >>"$log" 2>&1 || {
      echo "STOP: committed diff check failed; commit preserved; log=$log" >&2; exit 7;
    }
    run_ui_lock >>"$log" 2>&1 || {
      echo "STOP: UI lock failed; commit preserved locally and was not pushed; log=$log" >&2; exit 7;
    }

    exam_id=context-recovered
    unit=committed-unit
    if [[ $marker =~ ^LOCAL_UNIT_READY[[:space:]]+([0-9a-f]{40})[[:space:]]+([^[:space:]]+)[[:space:]]+(.+)$ ]]; then
      [[ ${BASH_REMATCH[1]} == "$after_sha" ]] || {
        echo "STOP: LOCAL_UNIT_READY SHA does not match HEAD; commit preserved; log=$log" >&2; exit 8;
      }
      exam_id=${BASH_REMATCH[2]}
      unit=${BASH_REMATCH[3]}
    elif ((codex_rc == 0)); then
      echo "STOP: successful child commit lacks a valid LOCAL_UNIT_READY marker; commit preserved; log=$log" >&2
      exit 8
    fi

    persist_head "$log" || exit 6
    record_durable_unit "$after_sha" "$exam_id" "$unit" "$log" || exit 6
    printf 'TURN %s | %s | %s | local %s | remote PASS\n' "$turn" "$exam_id" "$unit" "$after_sha"
    [[ $marker == COMPLETE_ALL_AVAILABLE ]] && exit 0
    continue
  fi

  if ((codex_rc != 0)); then
    echo "STOP: child failed without a local commit; tree clean; log=$log" >&2; exit 4
  fi

  case "$marker" in
    NO_LOCAL_CHANGE_CONTINUE\ *)
      read -r _ exam_id unit <<<"$marker"
      [[ -n ${exam_id:-} && -n ${unit:-} ]] || {
        echo "STOP: malformed NO_LOCAL_CHANGE_CONTINUE marker; log=$log" >&2; exit 8;
      }
      has_repository_next_action || {
        echo "STOP: continue marker has no checkpoint next action; log=$log" >&2; exit 8;
      }
      printf 'TURN %s | %s | %s | local %s | no-change CONTINUE\n' "$turn" "$exam_id" "$unit" "$after_sha"
      ;;
    COMPLETE_ALL_AVAILABLE)
      if has_repository_next_action; then
        echo "STOP: COMPLETE_ALL_AVAILABLE contradicts a checkpoint next action; log=$log" >&2; exit 9
      fi
      exit 0 ;;
    BLOCKED_GLOBAL\ *)
      if has_repository_next_action; then
        echo "STOP: BLOCKED_GLOBAL rejected because a checkpoint still has next action; log=$log" >&2; exit 9
      fi
      echo "$marker"; exit 0 ;;
    RATE_LIMITED)
      echo "STOP: RATE_LIMITED after retries; tree clean; log=$log" >&2; exit 10 ;;
    *) echo "STOP: missing or invalid machine-readable marker; log=$log" >&2; exit 11 ;;
  esac
done

echo "STOP: reached safety limit of $MAX_TURNS; latest=$(git rev-parse HEAD)" >&2
exit 12
