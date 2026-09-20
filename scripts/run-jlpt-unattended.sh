#!/usr/bin/env bash
# One sandboxed child produces working-tree changes and strict JSON. This outer
# supervisor alone owns staging, commits, network operations, and persistence.
set -euo pipefail

MAX_TURNS=100
MAX_NO_PROGRESS=3
RATE_RETRY_DELAYS=(60 180 300)
PUSH_RETRIES=3
PUSH_RETRY_DELAY=30
DRY_RUN=0

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

TEST_MODE=${JLPT_UNATTENDED_TEST_MODE:-0}
if [[ $TEST_MODE == 1 ]]; then
  RATE_RETRY_DELAYS=(0 0 0)
  PUSH_RETRY_DELAY=0
fi

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "STOP: not a Git repository" >&2; exit 2; }
cd "$root"
required_paths=(
  AGENTS.md package.json src assets scripts docs/AI_SESSION_START_HERE.md
  docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md
  docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md
  docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md
  scripts/jlpt-unattended-result.schema.json
  scripts/validate-jlpt-unattended-result.mjs
  scripts/check-work-persistence.mjs
  scripts/check-jlpt-approved-ui-lock.mjs
)
for required in "${required_paths[@]}"; do
  [[ -e $required ]] || { echo "STOP: missing required path: $required" >&2; exit 2; }
done
if [[ $TEST_MODE != 1 ]]; then
  node -e "const p=require('./package.json'); if(p.name!=='japan-app') process.exit(1)" || {
    echo "STOP: checkout is not the intended Japan App repository" >&2; exit 2;
  }
fi

branch=$(git branch --show-current)
[[ -n $branch ]] || { echo "STOP: detached HEAD is not supported" >&2; exit 2; }
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null) || {
  echo "STOP: branch $branch has no configured upstream" >&2; exit 2;
}
remote=${upstream%%/*}
remote_branch=${upstream#*/}
[[ $remote != "$upstream" && -n $remote_branch ]] || { echo "STOP: cannot parse upstream: $upstream" >&2; exit 2; }

if [[ -n $(git status --porcelain --untracked-files=all) ]]; then
  echo "STOP: working tree is not clean; every existing change is preserved" >&2
  git status --short >&2
  exit 2
fi

repo_key=$(printf '%s' "$root" | env LC_ALL=C shasum -a 256 | awk '{print substr($1,1,12)}')
log_base=${JLPT_UNATTENDED_LOG_DIR:-${TMPDIR:-/tmp}/japan-app-jlpt-unattended-logs}
case "$log_base/" in "$root"/*) echo "STOP: log/PID directory must be outside the repository" >&2; exit 2 ;; esac
log_dir="$log_base/$repo_key"
lock_dir="$log_dir/supervisor.lock"
mkdir -p "$log_dir"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "STOP: another supervisor is active: $(sed -n '1p' "$lock_dir/pid" 2>/dev/null || echo unknown)" >&2
  exit 3
fi
printf '%s\n' "$$" > "$lock_dir/pid"
cleanup_lock() { rm -f "$lock_dir/pid"; rmdir "$lock_dir" 2>/dev/null || true; }
current_log="$log_dir/startup.log"
on_signal() {
  local signal_name=$1
  echo "STOP: received $signal_name; working tree and any staged/local commits are preserved; log=$current_log" >&2
  exit 130
}
trap cleanup_lock EXIT
trap 'on_signal SIGINT' INT
trap 'on_signal SIGTERM' TERM

run_startup_validations() {
  local output_log=$1 validator
  if [[ $TEST_MODE == 1 ]]; then
    node scripts/check-jlpt-approved-ui-lock.mjs >>"$output_log" 2>&1
    return
  fi
  for validator in \
    scripts/check-jlpt-approved-ui-lock.mjs \
    scripts/check-jlpt-catalog-completeness.mjs \
    scripts/check-jlpt-structured-exams.mjs \
    scripts/check-jlpt-no-scanned-runtime.mjs \
    scripts/check-jlpt-navigation-contract.mjs \
    scripts/check-jlpt-50-exams-integration.mjs \
    scripts/check-n1-2012-12-integration.mjs \
    scripts/check-n1-2013-07-integration.mjs; do
    node "$validator" >>"$output_log" 2>&1
  done
}

run_unit_validations() {
  local output_log=$1 exam_id=$2 validator exam_key
  git diff --check >>"$output_log" 2>&1
  run_startup_validations "$output_log"
  if [[ $TEST_MODE == 1 ]]; then
    if [[ -x scripts/jlpt-test-validation.sh ]]; then scripts/jlpt-test-validation.sh >>"$output_log" 2>&1; fi
    return
  fi
  exam_key=${exam_id%-exam-*}
  while IFS= read -r validator; do
    [[ -z $validator ]] || node "$validator" >>"$output_log" 2>&1
  done < <(find scripts -maxdepth 1 -type f -name "check-${exam_key}*.mjs" -print | sort)
}

push_with_retry() {
  local output_log=$1 attempt
  for ((attempt=1; attempt<=PUSH_RETRIES; attempt++)); do
    if git push "$remote" "HEAD:refs/heads/$remote_branch" >>"$output_log" 2>&1; then return 0; fi
    printf 'push attempt %s/%s failed; state preserved\n' "$attempt" "$PUSH_RETRIES" >>"$output_log"
    if ((attempt < PUSH_RETRIES)); then sleep "$PUSH_RETRY_DELAY"; fi
  done
  return 1
}

persist_head() {
  local output_log=$1 persistence_start
  persistence_start=$(wc -l <"$output_log")
  if ! push_with_retry "$output_log"; then
    echo "STOP: push failed after $PUSH_RETRIES attempts; local state preserved; log=$output_log" >&2
    return 1
  fi
  git fetch "$remote" "$remote_branch" >>"$output_log" 2>&1 || {
    echo "STOP: fetch failed after push; local state preserved; log=$output_log" >&2; return 1;
  }
  node scripts/check-work-persistence.mjs >>"$output_log" 2>&1 || {
    echo "STOP: persistence verification failed; local state preserved; log=$output_log" >&2; return 1;
  }
  tail -n "+$((persistence_start + 1))" "$output_log" | grep -q 'WORK PERSISTENCE PASS' || {
    echo "STOP: persistence checker did not emit WORK PERSISTENCE PASS; log=$output_log" >&2; return 1;
  }
}

is_allowed_child_path() {
  local file_name=$1
  case "$file_name" in
    .git|.git/*|.env|.env.*|*/.env|*/.env.*|*.pem|*.key|*[Cc][Rr][Ee][Dd][Ee][Nn][Tt][Ii][Aa][Ll]*|*[Ss][Ee][Cc][Rr][Ee][Tt]*) return 1 ;;
    src/app/'[level]'/'[section].tsx'|src/components/jlpt/N1OfficialTrial.tsx|src/components/jlpt/N1ExamPicker.tsx|src/components/jlpt/ui/JlptExamUI.tsx|src/services/jlpt-trial-session-storage.ts|src/theme/jlpt-exam-design-system.ts|src/components/jlpt/ApprovedJlptExamCatalog.tsx|src/components/jlpt/ApprovedScannedExam.tsx|src/components/jlpt/ApprovedMockExam.tsx|src/data/jlpt-official/approved-scanned-exams.generated.ts) return 1 ;;
    assets/jlpt/*|src/data/jlpt-official/*|src/data/jlpt-mock/*|docs/jlpt-workspace/conversion/*|scripts/check-jlpt-*.mjs|scripts/check-n1-*.mjs) return 0 ;;
    *) return 1 ;;
  esac
}

validate_commit_message() {
  local message=$1
  [[ ${#message} -le 120 && $message != *$'\n'* && $message =~ ^(feat|fix|docs|test|chore)\(jlpt\):[[:space:]].+ ]]
}

record_durable_sha() {
  local unit_sha=$1 checkpoint=$2 exam_id=$3 unit=$4 output_log=$5 record_sha staged
  if grep -q -F "$unit_sha" "$checkpoint"; then return 0; fi
  printf '\n- Supervisor durable unit: `%s` | `%s` | `%s`\n' \
    "$unit_sha" "$unit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" >>"$checkpoint"
  run_unit_validations "$output_log" "$exam_id" || return 1
  git add -- "$checkpoint"
  staged=$(git diff --cached --name-only)
  [[ $staged == "$checkpoint" ]] || {
    echo "STOP: durable-record staged set is unexpected: $staged; state preserved; log=$output_log" >&2; return 1;
  }
  git commit -m "docs(jlpt): record $exam_id durable unit" >>"$output_log" 2>&1 || {
    echo "STOP: durable-record commit failed; state preserved; log=$output_log" >&2; return 1;
  }
  record_sha=$(git rev-parse HEAD)
  persist_head "$output_log" || return 1
  printf 'DURABLE RECORD | %s | unit %s | record %s | WORK PERSISTENCE PASS\n' "$exam_id" "$unit_sha" "$record_sha"
}

startup_log="$log_dir/startup-$(date +%Y%m%d-%H%M%S).log"
current_log=$startup_log
{
  printf 'root=%s\nbranch=%s\nupstream=%s\n' "$root" "$branch" "$upstream"
  env LC_ALL=C shasum -a 256 AGENTS.md docs/AI_SESSION_START_HERE.md docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md \
    docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED*.md docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md \
    docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md
} >>"$startup_log"
git fetch "$remote" "$remote_branch" >>"$startup_log" 2>&1 || {
  echo "STOP: initial fetch failed; no child invoked; log=$startup_log" >&2; exit 5;
}
local_head=$(git rev-parse HEAD)
remote_head=$(git rev-parse "$upstream")
[[ $local_head == "$remote_head" ]] || {
  echo "STOP: local HEAD $local_head does not equal remote HEAD $remote_head; no child invoked" >&2; exit 6;
}
run_startup_validations "$startup_log" || {
  echo "STOP: startup validation failed; no child invoked; log=$startup_log" >&2; exit 5;
}
node scripts/check-work-persistence.mjs >>"$startup_log" 2>&1 || {
  echo "STOP: startup persistence gate failed; no child invoked; log=$startup_log" >&2; exit 5;
}

if ((DRY_RUN)); then
  printf 'DRY RUN PASS | branch=%s | upstream=%s | HEAD=%s | log=%s | child=not-called\n' \
    "$branch" "$upstream" "$local_head" "$startup_log"
  exit 0
fi

prompt_file=docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md
schema_file=scripts/jlpt-unattended-result.schema.json
result_validator=scripts/validate-jlpt-unattended-result.mjs
codex_bin=${JLPT_UNATTENDED_CODEX_BIN:-codex}
no_progress=0
if [[ $TEST_MODE != 1 ]]; then
  codex_help=$("$codex_bin" exec --help 2>&1) || {
    echo "STOP: cannot inspect codex exec capabilities; log=$startup_log" >&2; exit 5;
  }
  printf '%s\n' "$codex_help" >>"$startup_log"
  [[ $codex_help == *'--output-schema'* && $codex_help == *'--output-last-message'* ]] || {
    echo "STOP: installed codex exec lacks --output-schema/--output-last-message; log=$startup_log" >&2; exit 5;
  }
fi

for ((turn=1; turn<=MAX_TURNS; turn++)); do
  turn_started=$(date +%Y%m%d-%H%M%S)
  current_log="$log_dir/turn-${turn}-${turn_started}.log"
  result="$log_dir/turn-${turn}-${turn_started}.result.json"
  baseline_head=$(git rev-parse HEAD)
  baseline_upstream=$(git rev-parse "$upstream")
  [[ $baseline_head == "$baseline_upstream" && -z $(git status --porcelain --untracked-files=all) ]] || {
    echo "STOP: pre-child baseline is not clean and remote-aligned; state preserved; log=$current_log" >&2; exit 6;
  }
  printf 'baseline HEAD=%s upstream=%s turn=%s\n' "$baseline_head" "$baseline_upstream" "$turn" >>"$current_log"
  rate_attempt=0

  while :; do
    rm -f "$result"
    attempt_log="$current_log.attempt-$rate_attempt"
    set +e
    "$codex_bin" exec --sandbox workspace-write -C "$root" \
      --output-schema "$schema_file" --output-last-message "$result" - \
      <"$prompt_file" >"$attempt_log" 2>&1
    child_rc=$?
    set -e
    cat "$attempt_log" >>"$current_log"
    after_head=$(git rev-parse HEAD)
    if [[ $after_head != "$baseline_head" ]]; then
      echo "STOP: child changed Git HEAD despite its contract; state preserved; log=$current_log" >&2; exit 7
    fi
    if ! node "$result_validator" validate "$result" >>"$current_log" 2>&1; then
      actual_dirty=$(git status --porcelain --untracked-files=all)
      if ((child_rc != 0)) && [[ -z $actual_dirty ]] && grep -Eqi \
        'rate.?limit|capacity|too many requests|resource exhausted|temporarily unavailable' "$attempt_log" "$result" 2>/dev/null; then
        if ((rate_attempt >= ${#RATE_RETRY_DELAYS[@]})); then
          echo "STOP: rate limit retry budget exhausted; tree clean; log=$current_log" >&2; exit 10
        fi
        sleep "${RATE_RETRY_DELAYS[$rate_attempt]}"
        ((rate_attempt+=1))
        continue
      fi
      if ((child_rc != 0)); then
        echo "STOP: child exited $child_rc without valid JSON; all working-tree changes preserved; result=$result log=$current_log" >&2
        [[ -z $actual_dirty ]] || printf '%s\n' "$actual_dirty" >&2
        exit 4
      fi
      echo "STOP: child returned invalid JSON; all working-tree changes preserved; result=$result log=$current_log" >&2; exit 11
    fi
    status=$(node "$result_validator" field "$result" status)
    actual_dirty=$(git status --porcelain --untracked-files=all)
    if ((child_rc != 0)); then
      echo "STOP: child exited $child_rc; all working-tree changes preserved; result=$result log=$current_log" >&2
      [[ -z $actual_dirty ]] || printf '%s\n' "$actual_dirty" >&2
      exit 4
    fi
    if [[ $status == RATE_LIMITED ]]; then
      if [[ -n $actual_dirty ]]; then
        echo "STOP: RATE_LIMITED child changed files; state preserved; result=$result log=$current_log" >&2; exit 7
      fi
      if ((rate_attempt >= ${#RATE_RETRY_DELAYS[@]})); then
        echo "STOP: rate limit retry budget exhausted; tree clean; log=$current_log" >&2; exit 10
      fi
      sleep "${RATE_RETRY_DELAYS[$rate_attempt]}"
      ((rate_attempt+=1))
      continue
    fi
    break
  done

  exam_id=$(node "$result_validator" field "$result" examId)
  unit=$(node "$result_validator" field "$result" unit)
  next_action=$(node "$result_validator" field "$result" nextAction)

  case "$status" in
    LOCAL_CHANGES_READY)
      node "$result_validator" compare "$result" "$root" >>"$current_log" 2>&1 || {
        echo "STOP: changedFiles does not match Git; changes preserved; result=$result log=$current_log" >&2; exit 7;
      }
      changed_files=()
      checkpoint_files=()
      while IFS= read -r file_name; do
        changed_files+=("$file_name")
        is_allowed_child_path "$file_name" || {
          echo "STOP: child changed forbidden/unexpected path '$file_name'; all changes preserved; log=$current_log" >&2; exit 7;
        }
        case "$file_name" in docs/jlpt-workspace/conversion/*/CONVERSION_CHECKPOINT.md) checkpoint_files+=("$file_name") ;; esac
      done < <(node "$result_validator" paths "$result")
      [[ ${#checkpoint_files[@]} == 1 ]] || {
        echo "STOP: child unit must update exactly one authoritative checkpoint; changes preserved; log=$current_log" >&2; exit 7;
      }
      commit_message=$(node "$result_validator" field "$result" commitMessage)
      validate_commit_message "$commit_message" || {
        echo "STOP: unsafe/non-narrow commitMessage; changes preserved; result=$result log=$current_log" >&2; exit 8;
      }
      run_unit_validations "$current_log" "$exam_id" || {
        echo "STOP: supervisor validation failed; unstaged changes preserved; log=$current_log" >&2; exit 7;
      }
      for file_name in "${changed_files[@]}"; do git add -- "$file_name"; done
      node "$result_validator" compare "$result" "$root" >>"$current_log" 2>&1 || {
        echo "STOP: staged manifest mismatch; staged/working changes preserved; log=$current_log" >&2; exit 7;
      }
      staged_files=()
      while IFS= read -r file_name; do [[ -z $file_name ]] || staged_files+=("$file_name"); done < <(git diff --cached --name-only)
      expected_sorted=$(printf '%s\n' "${changed_files[@]}" | sort)
      staged_sorted=$(printf '%s\n' "${staged_files[@]}" | sort)
      [[ $expected_sorted == "$staged_sorted" && -z $(git diff --name-only) ]] || {
        echo "STOP: staged files are not exactly the verified manifest; state preserved; log=$current_log" >&2; exit 7;
      }
      git diff --cached --check >>"$current_log" 2>&1 || {
        echo "STOP: staged diff check failed; state preserved; log=$current_log" >&2; exit 7;
      }
      git commit -m "$commit_message" >>"$current_log" 2>&1 || {
        echo "STOP: commit failed; staged changes preserved; log=$current_log" >&2; exit 8;
      }
      unit_sha=$(git rev-parse HEAD)
      persist_head "$current_log" || exit 6
      record_durable_sha "$unit_sha" "${checkpoint_files[0]}" "$exam_id" "$unit" "$current_log" || exit 6
      printf 'TURN %s | %s | %s | unit %s | WORK PERSISTENCE PASS\n' "$turn" "$exam_id" "$unit" "$unit_sha"
      no_progress=0
      ;;
    NO_CHANGE_CONTINUE)
      [[ -z $(git status --porcelain --untracked-files=all) ]] || {
        echo "STOP: NO_CHANGE_CONTINUE included file changes; state preserved; result=$result log=$current_log" >&2; exit 7;
      }
      ((no_progress+=1))
      printf 'TURN %s | %s | no-change %s/%s | next=%s\n' "$turn" "$exam_id" "$no_progress" "$MAX_NO_PROGRESS" "$next_action"
      if ((no_progress >= MAX_NO_PROGRESS)); then
        echo "STOP: no-progress loop detected after $no_progress consecutive turns; log=$current_log" >&2; exit 13
      fi
      ;;
    BLOCKED_GLOBAL)
      [[ -z $(git status --porcelain --untracked-files=all) ]] || {
        echo "STOP: BLOCKED_GLOBAL included file changes; state preserved; result=$result log=$current_log" >&2; exit 7;
      }
      echo "BLOCKED_GLOBAL: result=$result log=$current_log" >&2
      exit 14
      ;;
    COMPLETE_ALL_AVAILABLE)
      [[ -z $(git status --porcelain --untracked-files=all) ]] || {
        echo "STOP: COMPLETE_ALL_AVAILABLE included file changes; state preserved; result=$result log=$current_log" >&2; exit 7;
      }
      run_startup_validations "$current_log" || {
        echo "STOP: final validation failed; log=$current_log" >&2; exit 5;
      }
      node scripts/check-work-persistence.mjs >>"$current_log" 2>&1 || {
        echo "STOP: final persistence gate failed; log=$current_log" >&2; exit 6;
      }
      tail -n 20 "$current_log" | grep -q 'WORK PERSISTENCE PASS' || {
        echo "STOP: final gate lacked WORK PERSISTENCE PASS; log=$current_log" >&2; exit 6;
      }
      printf 'COMPLETE_ALL_AVAILABLE | HEAD=%s | WORK PERSISTENCE PASS\n' "$(git rev-parse HEAD)"
      exit 0
      ;;
    *) echo "STOP: unsupported child status after validation: $status" >&2; exit 11 ;;
  esac
done

echo "STOP: reached safety limit of $MAX_TURNS; latest=$(git rev-parse HEAD)" >&2
exit 12
