#!/usr/bin/env bash
# Compatibility wrapper. The general supervisor includes written and listening work.
set -euo pipefail

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "not a Git repository" >&2
  exit 2
}
exec bash "$root/scripts/run-jlpt-unattended.sh" "$@"
