#!/usr/bin/env bash
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo 'FAIL setup: not a Git repository' >&2; exit 2; }
cd "$root"
initial_status=$(git status --porcelain=v1 --untracked-files=all)

step() {
  local name=$1
  shift
  printf 'STEP %s\n' "$name"
  if "$@"; then
    printf 'PASS %s\n' "$name"
  else
    local code=$?
    printf 'FAIL %s (exit=%s)\n' "$name" "$code" >&2
    exit "$code"
  fi
}

syntax_checks() {
  local shell_file node_file
  for shell_file in \
    scripts/run-jlpt-unattended.sh \
    scripts/jlpt-codex-worker-wrapper.sh \
    scripts/test-run-jlpt-unattended.sh \
    scripts/test-support/fake-jlpt-codex.sh \
    scripts/test-jlpt-unattended-production.sh \
    scripts/persist-jlpt-unattended-maintenance.sh; do
    bash -n "$shell_file"
  done
  for node_file in \
    scripts/jlpt-unattended-supervisor.mjs \
    scripts/jlpt-unattended-worker-io.mjs \
    scripts/test-jlpt-unattended-fixtures.mjs \
    scripts/validate-jlpt-unattended-result.mjs \
    scripts/verify-jlpt-unattended-live-smoke.mjs; do
    node --check "$node_file"
  done
}

jlpt_regression() {
  node scripts/validate-jlpt-automation-state.mjs
  node scripts/jlpt-automation-state.mjs digest-check
  node scripts/check-jlpt-approved-ui-lock.mjs
  node scripts/check-jlpt-catalog-completeness.mjs
  node scripts/check-jlpt-structured-exams.mjs
  node scripts/check-jlpt-no-scanned-runtime.mjs
  node scripts/check-jlpt-navigation-contract.mjs
  node scripts/check-jlpt-50-exams-integration.mjs
  node scripts/check-n1-2012-12-integration.mjs
  node scripts/check-n1-2013-07-integration.mjs
}

step 'syntax' syntax_checks
step 'production lifecycle fixture' bash scripts/test-run-jlpt-unattended.sh
step 'real Codex live smoke' bash scripts/run-jlpt-unattended.sh start --smoke
step 'live smoke evidence' node scripts/verify-jlpt-unattended-live-smoke.mjs
step 'JLPT regression and rule digest' jlpt_regression
step 'TypeScript' npx tsc --noEmit
step 'lint' npm run lint
step 'Git whitespace' git diff --check
step 'supervisor stopped status' bash scripts/run-jlpt-unattended.sh status
final_status=$(git status --porcelain=v1 --untracked-files=all)
[[ $final_status == "$initial_status" ]] || { printf 'FAIL repository unchanged\n' >&2; exit 1; }
printf 'PASS repository unchanged\n'
printf 'JLPT UNATTENDED PRODUCTION TEST PASS\n'
