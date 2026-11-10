#!/usr/bin/env bash
# Read existing Git objects; never fetch, prune, reset, checkout, or push.
set -euo pipefail
target="${TOKUTEI_RECOVERY_TARGET:-d72833f84}"
case "$target" in ''|*[!0-9a-fA-F]*) echo 'Invalid commit prefix' >&2; exit 1;; esac
if [ "$#" -eq 0 ]; then
  set -- "$HOME/Desktop" "$HOME/Documents" "$HOME/Downloads"
fi
output_parent="${TOKUTEI_RECOVERY_OUTPUT:-$HOME/Desktop}"
mkdir -p "$output_parent"
output_dir=$(mktemp -d "$output_parent/tokutei-recovery-XXXXXX")
log="$output_dir/RESULT.txt"
printf 'Target: %s\n' "$target" | tee "$log"
found=0
inspect_repo() {
  local repo="$1" tip base ref bundle
  if ! tip=$(git -C "$repo" rev-parse --verify "${target}^{commit}" 2>/dev/null); then
    printf 'Not found: %s\n' "$repo" >> "$log"
    return
  fi
  printf '\nFOUND: %s\nCOMMIT: %s\n' "$repo" "$tip" | tee -a "$log"
  # Export only work after the common ancestor already available on GitHub.
  if ! base=$(git -C "$repo" merge-base "$tip" b4113fe3ebfefe0226b0bbbf0cd65779f00a6e2d 2>/dev/null); then
    base=""
  fi
  if [ "$tip" = "$base" ]; then base=""; fi
  ref="refs/recovery-export/tokutei-$tip"
  # A dedicated immutable export ref preserves an otherwise unreachable commit.
  if git -C "$repo" show-ref --verify --quiet "$ref"; then
    [ "$(git -C "$repo" rev-parse "$ref")" = "$tip" ] || return 1
  else
    git -C "$repo" update-ref "$ref" "$tip" ""
  fi
  bundle="$output_dir/tokutei-$tip.bundle"
  if [ -n "$base" ]; then
    git -C "$repo" bundle create "$bundle" "$ref" "^$base"
  else
    git -C "$repo" bundle create "$bundle" "$ref"
  fi
  git -C "$repo" bundle verify "$bundle" >> "$log" 2>&1
  git -C "$repo" bundle list-heads "$bundle" | tee -a "$log"
  if command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$bundle" | tee -a "$log"
  else
    sha256sum "$bundle" | tee -a "$log"
  fi
  printf 'Bundle: %s\n' "$bundle" | tee -a "$log"
  found=1
}
for search_root in "$@"; do
  [ -d "$search_root" ] || continue
  if git -C "$search_root" rev-parse --show-toplevel >/dev/null 2>&1; then
    inspect_repo "$(git -C "$search_root" rev-parse --show-toplevel)"
  else
    while IFS= read -r -d '' marker; do
      inspect_repo "${marker%/.git}"
    done < <(find "$search_root" -maxdepth 7 \( -name node_modules -o -name .Trash \) -prune -o -name .git -print0 -prune 2>/dev/null)
  fi
done
if [ "$found" -eq 0 ]; then
  printf '\nNOT FOUND in inspected local repositories. No source or branch changed.\nLog: %s\n' "$log" | tee -a "$log"
  exit 2
fi
printf '\nRecovery export verified. Send the .bundle file from: %s\n' "$output_dir" | tee -a "$log"
