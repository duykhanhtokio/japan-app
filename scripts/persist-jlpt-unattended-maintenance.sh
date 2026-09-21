#!/usr/bin/env bash
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo 'STOP: not a Git repository' >&2; exit 2; }
cd "$root"
message=${1:-}
[[ $message =~ ^(fix|test|chore|docs)\(jlpt\):\ .+ ]] || { echo 'usage: scripts/persist-jlpt-unattended-maintenance.sh "fix(jlpt): message"' >&2; exit 64; }

branch=$(git branch --show-current)
[[ $branch == recovery/jlpt-n3-n1 ]] || { echo "STOP: expected recovery/jlpt-n3-n1, got $branch" >&2; exit 2; }
upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}')
remote=${upstream%%/*}
remote_branch=${upstream#*/}

allowed=(
  docs/jlpt-workspace/JLPT_RULE_DIGEST.json
  docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md
  scripts/jlpt-automation-state.mjs
  scripts/jlpt-codex-worker-wrapper.sh
  scripts/jlpt-unattended-result.schema.json
  scripts/jlpt-unattended-supervisor.mjs
  scripts/jlpt-unattended-worker-io.mjs
  scripts/persist-jlpt-unattended-maintenance.sh
  scripts/test-jlpt-unattended-fixtures.mjs
  scripts/test-jlpt-unattended-production.sh
  scripts/test-support/fake-jlpt-codex.sh
  scripts/verify-jlpt-unattended-live-smoke.mjs
)

is_allowed() {
  local candidate=$1 allowed_path
  for allowed_path in "${allowed[@]}"; do
    [[ $candidate == "$allowed_path" ]] && return 0
  done
  return 1
}
while IFS= read -r entry; do
  [[ -z $entry ]] && continue
  path=${entry:3}
  is_allowed "$path" || { echo "STOP: unrelated working-tree change preserved: $path" >&2; exit 2; }
done < <(git status --porcelain=v1 --untracked-files=all)

git diff --cached --quiet || { echo 'STOP: index already contains staged changes' >&2; exit 2; }
git diff --check
git add -- "${allowed[@]}"
git diff --cached --quiet && { echo 'STOP: no maintenance changes to commit' >&2; exit 2; }
git diff --cached --check
git commit -m "$message"
git push "$remote" "HEAD:refs/heads/$remote_branch"
git fetch "$remote" "$remote_branch"
node scripts/check-work-persistence.mjs
git status --short --branch
