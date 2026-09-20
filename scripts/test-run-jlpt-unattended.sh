#!/usr/bin/env bash
set -euo pipefail

project_root=$(git rev-parse --show-toplevel)
supervisor="$project_root/scripts/run-jlpt-unattended.sh"
tmp_root=$(mktemp -d "${TMPDIR:-/tmp}/jlpt-supervisor-test.XXXXXX")
trap 'rm -rf "$tmp_root"' EXIT
fail() { echo "SUPERVISOR SIMULATION FAILED: $*" >&2; exit 1; }

if rg -n 'git[[:space:]]+(reset|checkout|clean)' "$supervisor"; then
  echo 'supervisor contains a destructive Git recovery command' >&2
  exit 1
fi

new_fixture() {
  local name=$1
  fixture="$tmp_root/$name"
  remote_repo="$tmp_root/$name.git"
  mkdir -p "$fixture/scripts" "$fixture/docs/jlpt-workspace/conversion/exam" "$fixture/src" "$fixture/assets"
  cp "$supervisor" "$fixture/scripts/run-jlpt-unattended.sh"
  cp "$project_root/scripts/check-work-persistence.mjs" "$fixture/scripts/check-work-persistence.mjs"
  cp "$project_root/scripts/test-support/fake-jlpt-codex.sh" "$fixture/fake-codex"
  chmod +x "$fixture/fake-codex"
  printf '%s\n' '{"name":"fixture"}' > "$fixture/package.json"
  printf '%s\n' '# session start' > "$fixture/docs/AI_SESSION_START_HERE.md"
  printf '%s\n' '# prompt' > "$fixture/docs/jlpt-workspace/JLPT_UNATTENDED_PROMPT.md"
  printf '%s\n' 'Exam ID: n1-test' 'Next: available unit' > "$fixture/docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md"
  printf '%s\n' 'console.log("JLPT APPROVED UI LOCK PASS")' > "$fixture/scripts/check-jlpt-approved-ui-lock.mjs"
  printf '%s\n' base > "$fixture/work.txt"
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
  set +e
  output=$(cd "$fixture" && JLPT_UNATTENDED_TEST_MODE=1 FAKE_SCENARIO="$scenario" \
    JLPT_UNATTENDED_CODEX_BIN="$fake_codex" JLPT_UNATTENDED_LOG_DIR="$tmp_root/logs-$name" \
    bash scripts/run-jlpt-unattended.sh --max-turns "$max_turns" 2>&1)
  status=$?
  set -e
}

new_fixture local_commit
run_supervisor local_commit commit 1
[[ $status == 12 && $output == *'remote PASS'* ]] || fail "local commit: status=$status output=$output"
[[ $(git -C "$fixture" rev-parse HEAD) == $(git -C "$fixture" rev-parse origin/recovery/test) ]] || fail 'local commit was not pushed'
rg -q 'Supervisor durable unit.*unit-test' "$fixture/docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md" || fail 'durable SHA was not checkpointed'

new_fixture context_commit
run_supervisor context_commit context_commit 1
[[ $status == 12 && $output == *'remote PASS'* ]] || fail "context commit: status=$status output=$output"
[[ $(git -C "$fixture" rev-parse HEAD) == $(git -C "$fixture" rev-parse origin/recovery/test) ]] || fail 'context-exit commit was not pushed'

new_fixture push_failure
mkdir -p "$remote_repo/hooks"
printf '%s\n' '#!/usr/bin/env bash' 'exit 1' > "$remote_repo/hooks/pre-receive"
chmod +x "$remote_repo/hooks/pre-receive"
run_supervisor push_failure commit 1
[[ $status == 6 && $output == *'push failed 3 times'* ]] || fail "push failure: status=$status output=$output"
[[ $(git -C "$fixture" rev-parse HEAD) != $(git -C "$fixture" rev-parse origin/recovery/test) ]] || fail 'failed push did not preserve a local-ahead commit'

new_fixture dirty_tree
run_supervisor dirty_tree dirty 1
[[ $status == 7 && $output == *'child left uncommitted files'* && -n $(git -C "$fixture" status --porcelain) ]] || fail "dirty tree: status=$status output=$output"

new_fixture local_blocker
run_supervisor local_blocker blocker_continue 1
[[ $status == 12 && $output == *'no-change CONTINUE'* ]] || fail "local blocker: status=$status output=$output"

new_fixture local_ahead_recovery
printf '%s\n' local-ahead >> "$fixture/work.txt"
git -C "$fixture" add work.txt
git -C "$fixture" commit -qm 'test: local ahead recovery'
run_supervisor local_ahead_recovery blocker_continue 1
[[ $status == 12 && $output == *'RECOVERY | prior local SHA'* && $output == *'no-change CONTINUE'* ]] || fail "local-ahead recovery: status=$status output=$output"
[[ $(git -C "$fixture" rev-parse HEAD) == $(git -C "$fixture" rev-parse origin/recovery/test) ]] || fail 'local-ahead recovery was not pushed'

new_fixture rate_limit
run_supervisor rate_limit rate_then_continue 1
[[ $status == 12 && $output == *'no-change CONTINUE'* ]] || fail "rate limit: status=$status output=$output"

printf '%s\n' 'SUPERVISOR SIMULATION PASS: local commit; context-exit commit; push failure preservation; dirty-tree preservation; local blocker continuation; local-ahead recovery; rate-limit backoff path; no destructive Git recovery commands'
