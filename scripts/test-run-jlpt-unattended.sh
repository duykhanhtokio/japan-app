#!/usr/bin/env bash
set -euo pipefail

project_root=$(git rev-parse --show-toplevel)
supervisor="$project_root/scripts/run-jlpt-unattended.sh"
tmp_root=$(mktemp -d "${TMPDIR:-/tmp}/jlpt-supervisor-test.XXXXXX")
trap 'rm -rf "$tmp_root"' EXIT
fail() { echo "SUPERVISOR TEST FAILED: $*" >&2; exit 1; }

if rg -n 'git[[:space:]]+(reset|checkout|clean|stash)' "$supervisor"; then
  fail 'supervisor contains a forbidden destructive Git command'
fi
if rg -n 'git[[:space:]]+(add|commit|push|fetch)|check-work-persistence' "$project_root/scripts/test-support/fake-jlpt-codex.sh"; then
  fail 'fake child performs supervisor-owned Git/persistence work'
fi

new_fixture() {
  local name=$1
  fixture="$tmp_root/$name"
  remote_repo="$tmp_root/$name.git"
  mkdir -p "$fixture/scripts/test-support" "$fixture/docs/jlpt-workspace/conversion/exam" "$fixture/docs/checkpoints" "$fixture/src/data/jlpt-official" "$fixture/assets"
  cp "$supervisor" "$fixture/scripts/run-jlpt-unattended.sh"
  cp "$project_root/scripts/check-work-persistence.mjs" "$fixture/scripts/check-work-persistence.mjs"
  cp "$project_root/scripts/jlpt-unattended-result.schema.json" "$fixture/scripts/jlpt-unattended-result.schema.json"
  cp "$project_root/scripts/validate-jlpt-unattended-result.mjs" "$fixture/scripts/validate-jlpt-unattended-result.mjs"
  cp "$project_root/scripts/test-support/fake-jlpt-codex.sh" "$fixture/fake-codex"
  chmod +x "$fixture/fake-codex"
  printf '%s\n' '# rules' > "$fixture/AGENTS.md"
  printf '%s\n' '{"name":"japan-app"}' > "$fixture/package.json"
  printf '%s\n' '# session start' > "$fixture/docs/AI_SESSION_START_HERE.md"
  printf '%s\n' '# UI rules' > "$fixture/docs/jlpt-workspace/JLPT_UI_LOCK_RULES.md"
  printf '%s\n' '# runbook' > "$fixture/docs/jlpt-workspace/JLPT_UNATTENDED_RUNBOOK.md"
  printf '%s\n' '# prompt' > "$fixture/docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md"
  printf '%s\n' '# lock checkpoint' > "$fixture/docs/checkpoints/JLPT_APPROVED_EXAM_UI_LOCKED.md"
  printf '%s\n' 'Exam ID: n1-test-exam-01' 'Next: available unit' > "$fixture/docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md"
  printf '%s\n' 'console.log("JLPT APPROVED UI LOCK PASS")' > "$fixture/scripts/check-jlpt-approved-ui-lock.mjs"
  printf '%s\n' '#!/usr/bin/env bash' '[[ ${JLPT_TEST_VALIDATION_FAIL:-0} != 1 ]]' > "$fixture/scripts/jlpt-test-validation.sh"
  chmod +x "$fixture/scripts/jlpt-test-validation.sh"
  git init -q --bare "$remote_repo"
  git -C "$fixture" init -q -b recovery/test
  git -C "$fixture" config user.name 'Supervisor Test'
  git -C "$fixture" config user.email supervisor-test@example.invalid
  git -C "$fixture" add .
  git -C "$fixture" commit -qm initial
  git -C "$fixture" remote add origin "$remote_repo"
  git -C "$fixture" push -qu origin recovery/test
  git -C "$fixture" branch --set-upstream-to=origin/recovery/test >/dev/null
  fake_codex="$fixture/fake-codex"
}

run_supervisor() {
  local name=$1 scenario=$2 max_turns=${3:-1}
  shift 3 || true
  set +e
  output=$(cd "$fixture" && env JLPT_UNATTENDED_TEST_MODE=1 FAKE_SCENARIO="$scenario" \
    JLPT_UNATTENDED_CODEX_BIN="$fake_codex" JLPT_UNATTENDED_LOG_DIR="$tmp_root/logs-$name" \
    "$@" bash scripts/run-jlpt-unattended.sh --max-turns "$max_turns" 2>&1)
  status=$?
  set -e
}

new_fixture dry_run
set +e
output=$(cd "$fixture" && JLPT_UNATTENDED_TEST_MODE=1 JLPT_UNATTENDED_LOG_DIR="$tmp_root/logs-dry-run" \
  bash scripts/run-jlpt-unattended.sh --dry-run 2>&1)
status=$?
set -e
[[ $status == 0 && $output == *'DRY RUN PASS'* && $output == *'child=not-called'* ]] || fail "dry run: status=$status output=$output"

new_fixture lock
fixture_root=$(git -C "$fixture" rev-parse --show-toplevel)
fixture_key=$(printf '%s' "$fixture_root" | env LC_ALL=C shasum -a 256 | awk '{print substr($1,1,12)}')
mkdir -p "$tmp_root/logs-lock/$fixture_key/supervisor.lock"
printf '%s\n' 99999 > "$tmp_root/logs-lock/$fixture_key/supervisor.lock/pid"
run_supervisor lock no_progress 1
[[ $status == 3 && $output == *'another supervisor is active: 99999'* ]] || fail "PID lock: status=$status output=$output"

new_fixture success
run_supervisor success success 2
[[ $status == 0 && $output == *'COMPLETE_ALL_AVAILABLE'* && $output == *'WORK PERSISTENCE PASS'* ]] || fail "success: status=$status output=$output"
[[ $(git -C "$fixture" rev-parse HEAD) == $(git -C "$fixture" rev-parse origin/recovery/test) ]] || fail 'success was not pushed'
[[ $(git -C "$fixture" log --format=%s --all | rg -c 'deterministic fixture unit') == 1 ]] || fail 'supervisor did not create exactly one unit commit'
rg -q 'Supervisor durable unit:' "$fixture/docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md" || fail 'durable SHA was not checkpointed'

new_fixture invalid_json
run_supervisor invalid_json invalid_json 1
[[ $status == 11 && $output == *'invalid JSON'* ]] || fail "invalid JSON: status=$status output=$output"

new_fixture mismatch
run_supervisor mismatch mismatch 1
[[ $status == 7 && $output == *'changedFiles does not match Git'* && -n $(git -C "$fixture" status --porcelain) ]] || fail "manifest mismatch: status=$status output=$output"

new_fixture outside
run_supervisor outside outside_allowlist 1
[[ $status == 7 && $output == *'forbidden/unexpected path'* && -n $(git -C "$fixture" status --porcelain) ]] || fail "outside allowlist: status=$status output=$output"

new_fixture validation
run_supervisor validation validation_fail 1 JLPT_TEST_VALIDATION_FAIL=1
[[ $status == 7 && $output == *'supervisor validation failed'* && -z $(git -C "$fixture" diff --cached --name-only) ]] || fail "validation failure: status=$status output=$output"

new_fixture commit
printf '%s\n' '#!/usr/bin/env bash' 'exit 1' > "$fixture/.git/hooks/pre-commit"
chmod +x "$fixture/.git/hooks/pre-commit"
run_supervisor commit commit_fail 1
[[ $status == 8 && $output == *'commit failed'* && -n $(git -C "$fixture" diff --cached --name-only) ]] || fail "commit failure: status=$status output=$output"

new_fixture push
mkdir -p "$remote_repo/hooks"
printf '%s\n' '#!/usr/bin/env bash' 'exit 1' > "$remote_repo/hooks/pre-receive"
chmod +x "$remote_repo/hooks/pre-receive"
run_supervisor push push_fail 1
[[ $status == 6 && $output == *'push failed'* ]] || fail "push failure: status=$status output=$output"
[[ $(git -C "$fixture" rev-parse HEAD) != $(git -C "$fixture" rev-parse origin/recovery/test) ]] || fail 'push failure did not preserve local-ahead commit'

new_fixture persistence
printf '%s\n' "import { execFileSync } from 'node:child_process';" \
  "const m=execFileSync('git',['log','-1','--pretty=%s'],{encoding:'utf8'}).trim();" \
  "if(m!=='initial' && m!=='test: persistence checker') process.exit(1);" \
  "console.log('WORK PERSISTENCE PASS');" > "$fixture/scripts/check-work-persistence.mjs"
git -C "$fixture" add scripts/check-work-persistence.mjs
git -C "$fixture" commit -qm 'test: persistence checker'
git -C "$fixture" push -qu origin recovery/test
run_supervisor persistence persistence_fail 1
[[ $status == 6 && $output == *'persistence verification failed'* ]] || fail "persistence failure: status=$status output=$output"

new_fixture rate
run_supervisor rate rate_then_continue 1
[[ $status == 12 && $output == *'no-change 1/3'* ]] || fail "rate limit: status=$status output=$output"

new_fixture rate_error
run_supervisor rate_error rate_error_then_continue 1
[[ $status == 12 && $output == *'no-change 1/3'* ]] || fail "CLI rate-limit error: status=$status output=$output"

new_fixture no_progress
run_supervisor no_progress no_progress 10
[[ $status == 13 && $output == *'no-progress loop detected after 3'* ]] || fail "no-progress: status=$status output=$output"

new_fixture interrupt
run_supervisor interrupt interrupt 1
[[ $status == 130 && $output == *'received SIGINT'* && -n $(git -C "$fixture" status --porcelain) ]] || fail "Ctrl+C: status=$status output=$output"

printf '%s\n' 'SUPERVISOR TEST PASS: startup dry-run; PID lock; child changes+JSON only; supervisor stage/commit/push/persistence; invalid JSON; manifest mismatch; allowlist rejection; validation/commit/push/persistence failures; structured and CLI rate-limit retries; Ctrl+C preservation; no-progress cutoff'
