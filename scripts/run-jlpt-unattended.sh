#!/usr/bin/env bash
set -euo pipefail
root=$(git rev-parse --show-toplevel 2>/dev/null) || { echo 'STOP: not a Git repository' >&2; exit 2; }
exec node "$root/scripts/jlpt-unattended-supervisor.mjs" "$@"
