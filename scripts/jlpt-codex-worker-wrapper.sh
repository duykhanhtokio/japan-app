#!/usr/bin/env bash
set -euo pipefail

stderr_path=$1
shift
exec "$@" 2>>"$stderr_path"
