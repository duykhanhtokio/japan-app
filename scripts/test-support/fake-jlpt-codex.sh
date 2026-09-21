#!/usr/bin/env bash
set -euo pipefail

if [[ ${1:-} == exec && ${2:-} == --help ]]; then
  printf '%s\n' '--output-schema <FILE>' '--output-last-message <FILE>' '--sandbox <MODE>'
  exit 0
fi

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
[[ -z ${FAKE_INVOCATION_LOG:-} ]] || printf '%s\n' "worker ${FAKE_SCENARIO:-complete}" >>"$FAKE_INVOCATION_LOG"

thread_id=00000000-0000-4000-8000-000000000001
printf '{"type":"thread.started","thread_id":"%s"}\n' "$thread_id"
printf '%s\n' '{"type":"turn.started"}'

write_result() {
  local status=$1 next=$2
  printf '{"status":"%s","examId":"n1-2015-12-exam-08","unit":"fixture:transport","commitMessage":"","changedFiles":[],"validations":[{"name":"fixture-transport","status":"PASS","evidence":"production producer-consumer path"}],"nextAction":"%s","blockers":[],"sourceChecksum":"","toolVersion":"fake-codex-v2","examComplete":false,"contextHandoff":""}\n' "$status" "$next" >"$result"
}

case "${FAKE_SCENARIO:-complete}" in
  complete)
    write_result COMPLETE_ALL_AVAILABLE 'fixture complete'
    printf '%s\n' '{"type":"item.completed","item":{"id":"fixture-message","type":"agent_message","text":"structured result written"}}'
    printf '%s\n' '{"type":"turn.completed","usage":{"input_tokens":1,"cached_input_tokens":0,"output_tokens":1}}'
    ;;
  no_change)
    write_result NO_CHANGE_CONTINUE 'fixture no change'
    printf '%s\n' '{"type":"item.completed","item":{"id":"fixture-message","type":"agent_message","text":"structured result written"}}'
    printf '%s\n' '{"type":"turn.completed","usage":{"input_tokens":1,"cached_input_tokens":0,"output_tokens":1}}'
    ;;
  hold)
    trap 'exit 130' INT TERM HUP
    while :; do sleep 1; done
    ;;
  schema_error)
    message='{"type":"error","error":{"type":"invalid_request_error","code":"invalid_json_schema","message":"Invalid schema for response_format"},"status":400}'
    printf '{"type":"error","message":%s}\n' "$(printf '%s' "$message" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(JSON.stringify(s)))')"
    printf '{"type":"turn.failed","error":{"message":%s}}\n' "$(printf '%s' "$message" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>process.stdout.write(JSON.stringify(s)))')"
    exit 1
    ;;
  invalid_result)
    printf '%s\n' 'not-json' >"$result"
    printf '%s\n' '{"type":"turn.completed","usage":{"input_tokens":1,"cached_input_tokens":0,"output_tokens":1}}'
    ;;
  *) exit 2 ;;
esac
