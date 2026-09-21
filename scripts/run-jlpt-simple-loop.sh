#!/usr/bin/env bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly REPO_ROOT="$(git -C "$SCRIPT_DIR/.." rev-parse --show-toplevel)"
readonly ACTIVE_PROGRESS="$REPO_ROOT/docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json"
readonly EXAM_REGISTRY="$REPO_ROOT/src/data/jlpt-official/approved-scanned-exams.generated.ts"
readonly TARGET_BRANCH="recovery/jlpt-n3-n1"
readonly PRIMARY_MODEL="gpt-5.6-terra"
readonly FALLBACK_MODEL="gpt-5.6-sol"

fail() {
  printf 'JLPT ERROR: %s\n' "$*" >&2
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

file_sha_or_missing() {
  if test -f "$1"; then
    shasum -a 256 "$1" | awk '{print $1}'
  else
    printf 'missing'
  fi
}

source_id_from_exam_id() {
  printf '%s\n' "$1" | sed -E 's/-exam-[0-9]+$//'
}

exam_id_from_source_id() {
  node -e '
    const fs = require("fs");
    const sourceId = process.argv[1];
    const file = `${process.argv[2]}/src/data/jlpt-mock/${sourceId}-official.ts`;
    const match = fs.readFileSync(file, "utf8").match(/EXAM_ID\s*=\s*[\x27\x22](n[123]-\d{4}-\d{2}-exam-\d+)[\x27\x22]/);
    if (!match) process.exit(2);
    process.stdout.write(match[1]);
  ' "$1" "$REPO_ROOT"
}

next_source_id() {
  node -e '
    const fs = require("fs");
    const text = fs.readFileSync(process.argv[1], "utf8");
    const progress = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
    const ids = [...text.matchAll(/\{ id: [\x27](n[123]-\d{4}-\d{2})[\x27]/g)].map((m) => m[1]);
    const sourceOf = (value) => String(value || "").replace(/-exam-\d+$/, "");
    const current = process.argv[2];
    let cursor = ids.indexOf(current);
    for (const unit of progress.completedUnits || []) {
      const index = ids.indexOf(sourceOf(typeof unit === "string" ? unit : unit.examId));
      if (index > cursor) cursor = index;
    }
    if (cursor < 0 || cursor + 1 >= ids.length) process.exit(2);
    const candidate = ids[cursor + 1];
    const level = current.split("-")[0];
    if (!candidate.startsWith(`${level}-`)) {
      const blocker = (progress.blockedUnits || []).find((unit) => {
        if (!unit || typeof unit !== "object") return false;
        return sourceOf(unit.examId).startsWith(`${level}-`) && unit.status === "LOCAL" && unit.revisitStatus !== "attempted";
      });
      if (blocker) {
        process.stdout.write(sourceOf(blocker.examId));
        process.exit(0);
      }
    }
    process.stdout.write(candidate);
  ' "$EXAM_REGISTRY" "$1" "$ACTIVE_PROGRESS"
}

check_cli_contract() {
  local help_text
  command -v codex >/dev/null 2>&1 || fail "codex is not installed or not on PATH"
  command -v node >/dev/null 2>&1 || fail "node is not installed or not on PATH"
  command -v git >/dev/null 2>&1 || fail "git is not installed or not on PATH"
  help_text="$(codex exec --help 2>&1)"
  grep -q -- '--sandbox' <<<"$help_text" || fail "codex exec lacks --sandbox"
  grep -q -- '--model' <<<"$help_text" || fail "codex exec lacks --model"
  grep -q -- '--config' <<<"$help_text" || fail "codex exec lacks config overrides"
}

check_repository() {
  test -f "$REPO_ROOT/package.json" || fail "package.json is missing"
  test -d "$REPO_ROOT/src" || fail "src is missing"
  test -d "$REPO_ROOT/assets" || fail "assets is missing"
  test -d "$REPO_ROOT/scripts" || fail "scripts is missing"
  test -f "$ACTIVE_PROGRESS" || fail "active progress is missing"
  test -f "$EXAM_REGISTRY" || fail "exam registry is missing"
  test "$(git -C "$REPO_ROOT" branch --show-current)" = "$TARGET_BRANCH" || fail "run this script on $TARGET_BRANCH"
  test "$(git -C "$REPO_ROOT" config --get branch.$TARGET_BRANCH.remote)" = "origin" || fail "$TARGET_BRANCH must track origin"
  git -C "$REPO_ROOT" rev-parse --abbrev-ref '@{upstream}' >/dev/null 2>&1 || fail "the current branch has no configured upstream"
}

sync_commits_before_work() {
  local ahead behind
  git -C "$REPO_ROOT" fetch origin "$TARGET_BRANCH" >/dev/null 2>&1 || fail "cannot fetch origin/$TARGET_BRANCH; stopped before new exam work"
  behind="$(git -C "$REPO_ROOT" rev-list --count HEAD..'@{upstream}')"
  ahead="$(git -C "$REPO_ROOT" rev-list --count '@{upstream}'..HEAD)"
  test "$behind" -eq 0 || fail "local branch is behind or diverged; no work was overwritten"
  if test "$ahead" -gt 0; then
    git -C "$REPO_ROOT" push origin "$TARGET_BRANCH" >/dev/null 2>&1 || fail "existing local commit remains local; stopped before new exam work"
    git -C "$REPO_ROOT" fetch origin "$TARGET_BRANCH" >/dev/null 2>&1 || fail "push succeeded but verification fetch failed; stop safely"
  fi
  test "$(git -C "$REPO_ROOT" rev-parse HEAD)" = "$(git -C "$REPO_ROOT" rev-parse '@{upstream}')" || fail "local and remote-tracking HEAD differ"
}

has_infrastructure_failure() {
  grep -Eiq 'rate.?limit|too many requests|network|connection (reset|refused|failed)|stream disconnected|transport error|timed? out|service unavailable|temporarily unavailable|internal server error|server error|bad gateway|gateway timeout|dns|could not resolve|failed to fetch|error sending request|request failed' "$1"
}

completion_ready() {
  local head_before="$1" active_exam="$2" checkpoint="$3" checkpoint_before="$4" progress_before="$5"
  test "$(git -C "$REPO_ROOT" rev-parse HEAD)" != "$head_before" || return 1
  test "$(git -C "$REPO_ROOT" rev-list --count "$head_before"..HEAD)" -eq 1 || return 1
  test -z "$(git -C "$REPO_ROOT" status --short)" || return 1
  test "$(file_sha_or_missing "$checkpoint")" != "$checkpoint_before" || return 1
  test "$(file_sha_or_missing "$ACTIVE_PROGRESS")" != "$progress_before" || return 1
  node -e '
    const fs = require("fs");
    const p = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const exam = process.argv[2];
    const marked = Array.isArray(p.completedUnits) && p.completedUnits.some((unit) =>
      unit === exam || (unit && unit.examId === exam && unit.status === "exam_complete")
    );
    if (p.activeExamId !== exam || p.phase !== "exam_complete" || !marked) process.exit(1);
  ' "$ACTIVE_PROGRESS" "$active_exam"
}

verify_completed_commit() {
  sync_commits_before_work
  node "$REPO_ROOT/scripts/check-work-persistence.mjs" | grep -F 'WORK PERSISTENCE PASS' || fail "WORK PERSISTENCE PASS was not obtained"
}

run_model() {
  local model="$1" role="$2" active_exam="$3" active_level="$4" source_id="$5" checkpoint_path="$6" manifest_path="$7" log_file="$8"
  printf 'JLPT MODEL %s %s\n' "$active_exam" "$model"
  codex exec \
    --model "$model" \
    --sandbox workspace-write \
    -c 'approval_policy="never"' \
    -c 'sandbox_workspace_write.network_access=true' \
    -C "$REPO_ROOT" \
    - >"$log_file" 2>&1 <<EOF
Finish exactly one exam: $active_exam ($active_level, source $source_id). This is the $role attempt. Work in the current checkout and do not launch Codex, background jobs, or legacy automation.

Compact context contract:
- Do not open AGENTS.md or docs/AI_SESSION_START_HERE.md; their loop rules are fully restated here.
- Read only docs/jlpt-workspace/JLPT_ACTIVE_PROGRESS.json, $checkpoint_path when it exists, $manifest_path when it exists, docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md, and exact same-exam sources/data/builders/validator needed for $source_id.
- Do not scan the repository. Reuse the nearest completed exam's builder, validator, and schema only where needed. Never query remote-verified data again.
- Read required source pages once as a batch. Reuse extracted content; do not reopen the same image/file unless resolving a specific discrepancy.
- Do not print a full diff, JSON, transcript, source file, or generated dataset. Allowed Git inspection is only: git status --short, git diff --stat, git diff --name-only, and git diff --check. Keep output short.

One-exam deliverable:
1. Preserve valid existing work. If Terra left valid partial changes, continue them; do not restart or discard them. As the first write, set active progress to THIS exam and its phase/checkpoint/manifest if it still names the previously persisted exam, so an interruption still resumes the exam actually in progress. Never point it past this exam. Create the missing checkpoint/manifest narrowly if this new exam does not have them yet.
2. Produce all repository-backed written questions and integrated listening as candidate_unverified. Set AI timing fields to humanReviewed=false, perceptualApproval=false, and needs_later_review. Defer multilingual explanations and translations.
3. Verify text and answers against repository sources. Record unreadable items precisely in blockedUnits with examId, status="LOCAL", the exact source/question/facts needed, and revisitStatus="pending". Finish every other available item. On a level-end revisit, preserve the exam and change revisitStatus to "attempted" after the one revisit so the loop can continue. Do not guess unreadable content.
4. Use local scripts for sorting, counts, seconds-to-milliseconds conversion, IDs, hashes, and range checks. Verify timing conversion mechanically. Do not reason record-by-record for mechanical work.
5. Integrate through existing data/adapters. Never edit locked JLPT UI, behavior, routes, hashes, or protected N1 12/2012 assets.
6. Do not reset, checkout, clean, stash, delete, or overwrite unfinished work. Do not use git diff without an allowed flag. Do not run repository-wide validation.
7. At the end, run the active-exam validator exactly once, then git diff --check exactly once, then node scripts/check-jlpt-approved-ui-lock.mjs exactly once. If final validation fails, leave valid work for fallback and do not commit.
8. Only after all checks pass, update $checkpoint_path and active progress for THIS exam. Keep activeExamId=$active_exam; never point it to the next exam. Set phase="exam_complete" and add $active_exam once to completedUnits as {"examId":"$active_exam","status":"exam_complete"}. The shell derives the next exam only after remote persistence.
9. Create exactly one narrow commit for this exam. If an incomplete unpushed Terra commit exists, Sol must amend it instead of creating a second one. Do not push or fetch; the shell owns the single push, fetch, and persistence check.
10. Rate limit, network loss, or service failure must stop immediately without retrying or switching models. Do not ask for established Git or validation permission.
EOF
}

check_cli_contract
check_repository

active_exam="$(progress_value activeExamId)"
source_id="$(source_id_from_exam_id "$active_exam")"

if test "${1:-}" = "--smoke"; then
  test "$#" -eq 1 || fail "--smoke accepts no additional arguments"
  test -f "$REPO_ROOT/src/data/jlpt-mock/$source_id-official.ts" || fail "active source declaration is missing"
  exam_id_from_source_id "$source_id" >/dev/null || fail "active exam ID cannot be resolved"
  printf 'JLPT SIMPLE LOOP SMOKE PASS: %s; no model called and no data changed.\n' "$active_exam"
  exit 0
fi

test "$#" -eq 0 || fail "usage: bash scripts/run-jlpt-simple-loop.sh [--smoke]"
sync_commits_before_work

while :; do
  active_level="$(printf '%s' "$source_id" | cut -d- -f1 | tr '[:lower:]' '[:upper:]')"
  checkpoint_path="docs/jlpt-workspace/conversion/$source_id/CONVERSION_CHECKPOINT.md"
  manifest_path="docs/jlpt-workspace/conversion/$source_id/WORK_MANIFEST.json"
  head_before="$(git -C "$REPO_ROOT" rev-parse HEAD)"
  remote_before="$(git -C "$REPO_ROOT" rev-parse '@{upstream}')"
  checkpoint_before="$(file_sha_or_missing "$REPO_ROOT/$checkpoint_path")"
  progress_before="$(file_sha_or_missing "$ACTIVE_PROGRESS")"
  terra_log="$(mktemp /tmp/jlpt-terra.XXXXXX)"

  printf 'JLPT START %s\n' "$active_exam"
  if run_model "$PRIMARY_MODEL" primary "$active_exam" "$active_level" "$source_id" "$checkpoint_path" "$manifest_path" "$terra_log"; then terra_status=0; else terra_status=$?; fi

  if completion_ready "$head_before" "$active_exam" "$REPO_ROOT/$checkpoint_path" "$checkpoint_before" "$progress_before"; then
    verify_completed_commit
  else
    has_infrastructure_failure "$terra_log" && fail "$PRIMARY_MODEL stopped on rate limit, network, or service failure; valid work was preserved"
    test "$(git -C "$REPO_ROOT" rev-parse '@{upstream}')" = "$remote_before" || fail "$PRIMARY_MODEL changed the remote without a complete exam; stopped safely"

    sol_log="$(mktemp /tmp/jlpt-sol.XXXXXX)"
    if run_model "$FALLBACK_MODEL" fallback "$active_exam" "$active_level" "$source_id" "$checkpoint_path" "$manifest_path" "$sol_log"; then sol_status=0; else sol_status=$?; fi
    if ! completion_ready "$head_before" "$active_exam" "$REPO_ROOT/$checkpoint_path" "$checkpoint_before" "$progress_before"; then
      has_infrastructure_failure "$sol_log" && fail "$FALLBACK_MODEL stopped on rate limit, network, or service failure; valid work was preserved"
      fail "$active_exam is incomplete after Terra status $terra_status and Sol status $sol_status; valid work was preserved"
    fi
    verify_completed_commit
  fi

  head_after="$(git -C "$REPO_ROOT" rev-parse HEAD)"
  printf 'JLPT DONE %s %s\n' "$active_exam" "$head_after"
  if ! source_id="$(next_source_id "$source_id")"; then
    printf 'JLPT COMPLETE all configured N1-N3 exams\n'
    exit 0
  fi
  active_exam="$(exam_id_from_source_id "$source_id")" || fail "cannot resolve the next exam ID for $source_id"
done
