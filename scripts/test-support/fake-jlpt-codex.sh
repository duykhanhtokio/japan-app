#!/usr/bin/env bash
set -euo pipefail

result=
while (($#)); do
  if [[ $1 == --output-last-message ]]; then result=$2; shift 2; else shift; fi
done
[[ -n $result ]]

case "${FAKE_SCENARIO:-}" in
  commit|context_commit)
    printf '%s\n' "unit ${FAKE_SCENARIO}" >> work.txt
    git add work.txt
    git commit -qm "test: ${FAKE_SCENARIO}"
    sha=$(git rev-parse HEAD)
    printf 'LOCAL_UNIT_READY %s n1-test unit-test\n' "$sha" > "$result"
    [[ $FAKE_SCENARIO == commit ]] || exit 124
    ;;
  dirty)
    printf '%s\n' dirty >> work.txt
    printf '%s\n' 'NO_LOCAL_CHANGE_CONTINUE n1-test next-unit' > "$result"
    ;;
  blocker_continue)
    printf '%s\n' 'NO_LOCAL_CHANGE_CONTINUE n1-test next-unit' > "$result"
    ;;
  rate_then_continue)
    count_file="$result.count"
    count=0
    [[ ! -f $count_file ]] || count=$(<"$count_file")
    ((count+=1))
    printf '%s\n' "$count" > "$count_file"
    if ((count <= 3)); then
      printf '%s\n' RATE_LIMITED > "$result"
    else
      printf '%s\n' 'NO_LOCAL_CHANGE_CONTINUE n1-test next-unit' > "$result"
    fi
    ;;
  *) exit 2 ;;
esac
