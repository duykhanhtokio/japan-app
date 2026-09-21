#!/usr/bin/env bash
set -euo pipefail
root=$(git rev-parse --show-toplevel)
node "$root/scripts/test-jlpt-unattended-fixtures.mjs"
