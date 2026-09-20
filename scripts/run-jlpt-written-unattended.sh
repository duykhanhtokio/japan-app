#!/usr/bin/env bash
# Runs one durable written-recovery unit per Codex invocation.  It deliberately
# does not bypass project rules, use full-auto, or grant danger-full-access.
set -euo pipefail

MAX_TURNS=50
SLEEP_SECONDS=10
DRY_RUN=0
if [[ ${1:-} == "--dry-run" ]]; then DRY_RUN=1; fi
if [[ $# -gt 0 && ${1:-} != "--dry-run" ]]; then
  echo "usage: $0 [--dry-run]" >&2; exit 64
fi

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "not a Git repository" >&2; exit 2; }
cd "$root"
branch=recovery/n1-2013-12
[[ $(git branch --show-current) == "$branch" ]] || { echo "wrong branch: $(git branch --show-current)" >&2; exit 2; }
if [[ -n $(git status --porcelain) && $DRY_RUN -eq 0 ]]; then
  echo "working tree is not clean; refusing to start" >&2; exit 2
fi

log_dir="$root/.jlpt-unattended-logs"
lock_dir="$log_dir/supervisor.lock"
mkdir -p "$log_dir"
if ! mkdir "$lock_dir" 2>/dev/null; then
  echo "another supervisor is active: $(cat "$lock_dir/pid" 2>/dev/null || echo unknown)" >&2; exit 3
fi
echo $$ > "$lock_dir/pid"
cleanup() { rm -f "$lock_dir/pid"; rmdir "$lock_dir" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

checkpoint=$(find docs/jlpt-workspace/conversion -name CONVERSION_CHECKPOINT.md -print | sort | tail -1)
[[ -n $checkpoint ]] || { echo "no conversion checkpoint found" >&2; exit 2; }
if (( DRY_RUN )); then
  printf 'DRY RUN PASS: branch=%s checkpoint=%s pid=%s log=%s\n' "$branch" "$checkpoint" "$$" "$log_dir"
  exit 0
fi

latest_sha=$(git rev-parse HEAD)
for ((turn=1; turn<=MAX_TURNS; turn++)); do
  stamp=$(date +%Y%m%d-%H%M%S)
  log="$log_dir/turn-${turn}-${stamp}.log"
  result="$log_dir/turn-${turn}-${stamp}.result"
  prompt=$(cat docs/jlpt-workspace/JLPT_WRITTEN_UNATTENDED_PROMPT.md)
  ok=0
  for attempt in 1 2 3; do
    if codex exec --sandbox workspace-write -C "$root" --output-last-message "$result" "$prompt" >"$log" 2>&1; then ok=1; break; fi
    echo "attempt=$attempt exit=failed" >>"$log"
    sleep "$SLEEP_SECONDS"
  done
  if (( ! ok )); then echo "STOP: codex exec failed after 3 attempts; log=$log" >&2; exit 4; fi
  marker=$(grep -Eo '^(CONTINUE|COMPLETE|BLOCKED_GLOBAL|RATE_LIMITED)$' "$result" | tail -1 || true)
  git fetch origin "$branch" >>"$log" 2>&1 || { echo "STOP: fetch failed; log=$log" >&2; exit 5; }
  if ! node scripts/check-work-persistence.mjs >>"$log" 2>&1; then
    echo "STOP: persistence failed; working tree preserved; log=$log" >&2; exit 6
  fi
  [[ -z $(git status --porcelain) ]] || { echo "STOP: dirty tree after turn; preserved; log=$log" >&2; exit 7; }
  latest_sha=$(git rev-parse HEAD)
  checkpoint=$(find docs/jlpt-workspace/conversion -name CONVERSION_CHECKPOINT.md -print | sort | tail -1)
  next=$(rg -n '^Next:' "$checkpoint" | tail -1 || true)
  printf 'turn=%s marker=%s sha=%s %s\n' "$turn" "${marker:-MISSING}" "$latest_sha" "${next:-no-nextAction}"
  case "$marker" in
    CONTINUE) [[ -n $next ]] || { echo "STOP: CONTINUE without checkpoint nextAction" >&2; exit 8; }; sleep "$SLEEP_SECONDS" ;;
    COMPLETE) [[ -z $next || $next == *'no remaining written'* ]] && exit 0; echo "STOP: COMPLETE contradicts checkpoint: $next" >&2; exit 9 ;;
    RATE_LIMITED) echo "STOP: rate/capacity limit; checkpoint preserved" >&2; exit 10 ;;
    BLOCKED_GLOBAL) echo "STOP: no globally available work: $next"; exit 0 ;;
    *) echo "STOP: missing machine-readable marker; log=$log" >&2; exit 11 ;;
  esac
done
echo "STOP: reached safety limit of $MAX_TURNS; latest=$latest_sha" >&2
exit 12
