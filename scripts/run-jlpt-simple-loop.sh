#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel)"
readonly ACTIVE_PROGRESS="$REPO_ROOT/docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json"
readonly TARGET_BRANCH="recovery/jlpt-n3-n1"

fail() {
  printf 'JLPT SIMPLE LOOP ERROR: %s\n' "$*" >&2
  exit 1
}

progress_value() {
  node -e '
    const fs = require("fs");
    const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const value = data[process.argv[2]];
    if (value === undefined || value === null) process.exit(2);
    process.stdout.write(typeof value === "string" ? value : JSON.stringify(value));
  ' "$ACTIVE_PROGRESS" "$1"
}

file_sha() {
  shasum -a 256 "$1" | awk '{print $1}'
}

check_cli_contract() {
  local help_text
  command -v codex >/dev/null 2>&1 || fail "codex is not installed or not on PATH"
  command -v node >/dev/null 2>&1 || fail "node is not installed or not on PATH"
  command -v git >/dev/null 2>&1 || fail "git is not installed or not on PATH"
  help_text="$(codex exec --help 2>&1)"
  grep -q -- '--sandbox' <<<"$help_text" || fail "this codex exec does not support --sandbox"
  grep -q -- '--config' <<<"$help_text" || fail "this codex exec does not support config overrides"
}

check_repository() {
  test -f "$REPO_ROOT/package.json" || fail "package.json is missing from $REPO_ROOT"
  test -d "$REPO_ROOT/src" || fail "src is missing from $REPO_ROOT"
  test -d "$REPO_ROOT/assets" || fail "assets is missing from $REPO_ROOT"
  test -f "$ACTIVE_PROGRESS" || fail "active progress file is missing"
  test "$(git -C "$REPO_ROOT" branch --show-current)" = "$TARGET_BRANCH" ||
    fail "run this script on $TARGET_BRANCH"
  git -C "$REPO_ROOT" rev-parse --abbrev-ref '@{upstream}' >/dev/null 2>&1 ||
    fail "the current branch has no configured upstream"
}

sync_commits_before_work() {
  local ahead behind
  if ! git -C "$REPO_ROOT" fetch origin "$TARGET_BRANCH" >/dev/null 2>&1; then
    fail "cannot fetch origin/$TARGET_BRANCH; no new exam work was started"
  fi
  behind="$(git -C "$REPO_ROOT" rev-list --count HEAD..'@{upstream}')"
  ahead="$(git -C "$REPO_ROOT" rev-list --count '@{upstream}'..HEAD)"
  test "$behind" -eq 0 ||
    fail "local branch is behind or diverged from origin/$TARGET_BRANCH; refusing to overwrite work"
  if test "$ahead" -gt 0; then
    if ! git -C "$REPO_ROOT" push origin "$TARGET_BRANCH" >/dev/null 2>&1; then
      fail "cannot push existing local commit(s); they remain local and no new exam work was started"
    fi
    if ! git -C "$REPO_ROOT" fetch origin "$TARGET_BRANCH" >/dev/null 2>&1; then
      fail "push succeeded but remote verification fetch failed; stop safely and rerun later"
    fi
  fi
  test "$(git -C "$REPO_ROOT" rev-parse HEAD)" = "$(git -C "$REPO_ROOT" rev-parse '@{upstream}')" ||
    fail "local and remote-tracking HEAD differ after synchronization"
}

verify_completed_commit() {
  sync_commits_before_work
  node "$REPO_ROOT/scripts/check-work-persistence.mjs" >/dev/null ||
    fail "WORK PERSISTENCE PASS was not obtained"
}

check_cli_contract
check_repository

if test "${1:-}" = "--smoke"; then
  test "$#" -eq 1 || fail "--smoke accepts no additional arguments"
  checkpoint_path="$(progress_value checkpointPath)"
  test -f "$REPO_ROOT/$checkpoint_path" || fail "current checkpoint does not exist: $checkpoint_path"
  progress_value activeExamId >/dev/null
  progress_value activeLevel >/dev/null
  printf 'JLPT SIMPLE LOOP SMOKE PASS: no data changed and no batch was started.\n'
  exit 0
fi

test "$#" -eq 0 || fail "usage: bash scripts/run-jlpt-simple-loop.sh [--smoke]"
sync_commits_before_work

while :; do
  if test "$(progress_value allTargetExamsComplete 2>/dev/null || printf false)" = "true"; then
    exit 0
  fi

  active_exam="$(progress_value activeExamId)"
  active_level="$(progress_value activeLevel)"
  checkpoint_path="$(progress_value checkpointPath)"
  test -f "$REPO_ROOT/$checkpoint_path" || fail "current checkpoint does not exist: $checkpoint_path"

  head_before="$(git -C "$REPO_ROOT" rev-parse HEAD)"
  checkpoint_before="$(file_sha "$REPO_ROOT/$checkpoint_path")"
  progress_before="$(file_sha "$ACTIVE_PROGRESS")"

  printf 'JLPT START %s\n' "$active_exam"

  set +e
  codex exec \
    --sandbox workspace-write \
    -c 'approval_policy="never"' \
    -c 'sandbox_workspace_write.network_access=true' \
    -C "$REPO_ROOT" \
    - <<EOF
Complete all remaining repository-backed work for exactly the active exam $active_exam ($active_level), then stop. Work directly in the current checkout; do not launch another Codex process or any background process.

AGENTS.md is already in context. For this loop iteration, do not reread the full docs/AI_SESSION_START_HERE.md and do not run any legacy multi-process automation. Read only:
- docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json
- $checkpoint_path
- the active exam WORK_MANIFEST.json when present
- docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md
- source assets and existing same-exam data/validators needed to finish this exam

Requirements:
1. Preserve all verified work. N1 12/2015 written questions 1-70 are remote-verified at cd6614e7362b1fbe7b855c4b66a9e68e6899c7b7; if this is that exam, begin with listening and never redo written.
2. An exam unit for this loop includes complete written data and integrated listening with status candidate_unverified. Every AI-derived timing must have humanReviewed=false, perceptualApproval=false, and review disposition needs_later_review. Defer multilingual explanations/translations.
3. Verify source text and answers against repository images/keys. Validate every seconds-to-milliseconds conversion explicitly. Record unreadable items as LOCAL blockers and continue every other available item. At the end of each level, return to its LOCAL blockers before advancing to the next level.
4. Integrate through data/adapters compatible with the locked JLPT UI. Do not edit locked UI files or approved hashes.
5. Preserve legitimate unfinished working-tree data and continue it; do not reset, checkout, clean, stash, delete, or overwrite it.
6. Run only active-exam validation, git diff --check, and the UI-lock check. Update the exam checkpoint and docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json.
7. When this exam is finished, advance active progress to the oldest incomplete exam in this order: remaining N1 oldest-to-newest, then N2 oldest-to-newest, then N3 oldest-to-newest. If every N1-N3 exam and level-end LOCAL blocker is complete, set allTargetExamsComplete=true.
8. Create exactly one narrow commit containing the completed exam, push it to origin/$TARGET_BRANCH, fetch that branch, and require scripts/check-work-persistence.mjs to print WORK PERSISTENCE PASS. Do not create a second SHA-only commit.
9. If network access or rate limits prevent completion, stop safely without retrying forever. Keep any valid local commit or unfinished data intact so the next script run can push/continue it before new work.
10. Do not ask the user for established Git or validation permissions. Do not return after a partial batch while safe repository-backed work remains for this exam.
EOF
  codex_status=$?
  set -e

  head_after="$(git -C "$REPO_ROOT" rev-parse HEAD)"
  checkpoint_after="$(file_sha "$REPO_ROOT/$checkpoint_path")"
  progress_after="$(file_sha "$ACTIVE_PROGRESS")"

  if test "$head_after" != "$head_before"; then
    verify_completed_commit
  fi

  test "$codex_status" -eq 0 ||
    fail "codex exec stopped for $active_exam with status $codex_status; valid local data was preserved"
  test "$head_after" != "$head_before" ||
    fail "$active_exam returned successfully without changing HEAD"
  test "$checkpoint_after" != "$checkpoint_before" ||
    fail "$active_exam changed HEAD but did not advance its checkpoint"
  test "$progress_after" != "$progress_before" ||
    fail "$active_exam changed HEAD but did not advance active progress"

  next_exam="$(progress_value activeExamId 2>/dev/null || printf '')"
  all_complete="$(progress_value allTargetExamsComplete 2>/dev/null || printf false)"
  if test "$all_complete" != "true" && test "$next_exam" = "$active_exam"; then
    fail "$active_exam did not advance to another exam after its single full-exam run"
  fi

  printf 'JLPT DONE %s %s\n' "$active_exam" "$head_after"
done
