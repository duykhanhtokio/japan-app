#!/usr/bin/env bash
# Update this clone only when a fast-forward preserves all local work.
set -euo pipefail

target_branch='recovery/jlpt-n3-n1'
project_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo 'Run this from your Japan App Git repository.' >&2
  exit 2
}
cd "$project_root"
remote_url="$(git remote get-url origin)"
case "$remote_url" in
  https://github.com/duykhanhtokio/japan-app|https://github.com/duykhanhtokio/japan-app.git|git@github.com:duykhanhtokio/japan-app.git|ssh://git@github.com/duykhanhtokio/japan-app.git) ;;
  *) echo 'Stopped: origin is not duykhanhtokio/japan-app.' >&2; exit 2 ;;
esac
current_branch="$(git symbolic-ref --quiet --short HEAD)" || {
  echo 'Stopped: this checkout has a detached HEAD.' >&2
  exit 2
}
if [[ "$current_branch" != "$target_branch" ]]; then
  echo "Stopped: current branch is $current_branch; expected $target_branch." >&2
  exit 2
fi
if ! git diff --quiet --ignore-submodules=none || ! git diff --cached --quiet --ignore-submodules=none; then
  echo 'Stopped: there are local tracked changes. Nothing was overwritten or stashed.' >&2
  git status --short
  exit 3
fi
git fetch origin "$target_branch"
target_sha="$(git rev-parse FETCH_HEAD)"
if ! git merge-base --is-ancestor HEAD "$target_sha"; then
  echo 'Stopped: local commits diverge from the remote. No local commits were removed.' >&2
  exit 4
fi
git merge --ff-only "$target_sha"
test "$(git rev-parse HEAD)" = "$target_sha"
echo "Mac checkout updated to $target_sha"
echo 'No application build or device test is implied by this Git update.'
