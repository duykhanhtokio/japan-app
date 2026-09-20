#!/usr/bin/env bash
set -euo pipefail

result=
schema=
while (($#)); do
  case "$1" in
    --output-last-message) result=$2; shift 2 ;;
    --output-schema) schema=$2; shift 2 ;;
    *) shift ;;
  esac
done
[[ -n $result && -f $schema ]]

write_result() {
  local status=$1 changed=$2 next=$3 blockers=${4:-'[]'} commit=${5:-''}
  printf '{"status":"%s","examId":"n1-test-exam-01","unit":"unit-test","commitMessage":"%s","changedFiles":%s,"validations":[{"name":"fixture","status":"PASS","evidence":"deterministic"}],"nextAction":"%s","blockers":%s}\n' \
    "$status" "$commit" "$changed" "$next" "$blockers" >"$result"
}

make_allowed_changes() {
  printf '%s\n' 'unit child change' > src/data/jlpt-official/n1-test/unit.json
  printf '%s\n' 'Exam ID: n1-test-exam-01' 'Next: next unit' 'Child updated checkpoint.' > docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md
}

case "${FAKE_SCENARIO:-}" in
  success|validation_fail|commit_fail|push_fail|persistence_fail)
    if [[ -f src/data/jlpt-official/n1-test/unit.json ]]; then
      write_result COMPLETE_ALL_AVAILABLE '[]' ''
    else
      mkdir -p src/data/jlpt-official/n1-test
      make_allowed_changes
      write_result LOCAL_CHANGES_READY '["docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md","src/data/jlpt-official/n1-test/unit.json"]' 'next unit' '[]' 'feat(jlpt): add deterministic fixture unit'
    fi
    ;;
  invalid_json)
    printf '%s\n' 'not-json' >"$result"
    ;;
  mismatch)
    mkdir -p src/data/jlpt-official/n1-test
    make_allowed_changes
    write_result LOCAL_CHANGES_READY '["docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md"]' 'next unit' '[]' 'feat(jlpt): add mismatched fixture unit'
    ;;
  outside_allowlist)
    printf '%s\n' '{"name":"unexpected"}' > package.json
    printf '%s\n' 'Exam ID: n1-test-exam-01' 'Next: next unit' > docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md
    write_result LOCAL_CHANGES_READY '["docs/jlpt-workspace/conversion/exam/CONVERSION_CHECKPOINT.md","package.json"]' 'next unit' '[]' 'feat(jlpt): change unexpected file'
    ;;
  rate_then_continue|rate_error_then_continue)
    count_file="$result.count"
    count=0
    [[ ! -f $count_file ]] || count=$(<"$count_file")
    ((count+=1))
    printf '%s\n' "$count" >"$count_file"
    if ((count <= 2)) && [[ $FAKE_SCENARIO == rate_error_then_continue ]]; then
      echo '429 too many requests: rate limit' >&2
      exit 75
    elif ((count <= 2)); then write_result RATE_LIMITED '[]' 'retry';
    else write_result NO_CHANGE_CONTINUE '[]' 'next available unit'; fi
    ;;
  no_progress)
    write_result NO_CHANGE_CONTINUE '[]' 'next available unit' '[{"scope":"LOCAL","code":"SOURCE_UNREADABLE","details":"fixture local blocker","evidence":"fixture"}]'
    ;;
  interrupt)
    mkdir -p src/data/jlpt-official/n1-test
    make_allowed_changes
    kill -INT "$PPID"
    sleep 1
    exit 130
    ;;
  *) exit 2 ;;
esac
