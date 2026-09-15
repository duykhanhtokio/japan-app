#!/bin/sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PACKAGE_DIR=$(dirname -- "$SCRIPT_DIR")
APP_DIR=${1:-.}
TARGET="$APP_DIR/assets/app/life/cities"
mkdir -p "$TARGET"
cp -f "$PACKAGE_DIR"/assets/app/life/cities/*.jpg "$TARGET"/
MAPPING_TARGET="$APP_DIR/src/components/world/city-images.generated.ts"
mkdir -p "$(dirname -- "$MAPPING_TARGET")"
cp -f "$PACKAGE_DIR/src/components/world/city-images.generated.ts" "$MAPPING_TARGET"
printf 'Installed %s optimized city images and updated city mapping in %s\n' "129" "$APP_DIR"
