#!/bin/bash
set -euo pipefail

PROJECT_DIR="${1:-$(cd "$(dirname "$0")" && pwd)}"
cd "$PROJECT_DIR"

if ! command -v xcrun >/dev/null 2>&1; then
  echo "ERROR: This verification must run on a Mac with Xcode and iOS Simulator installed."
  exit 1
fi

node scripts/check-jlpt-approved-ui-lock.mjs
node scripts/check-jlpt-catalog-completeness.mjs
node scripts/check-jlpt-structured-exams.mjs
node scripts/check-jlpt-no-scanned-runtime.mjs
node scripts/check-jlpt-navigation-contract.mjs
node scripts/check-jlpt-50-exams-integration.mjs
node scripts/check-n1-2012-12-integration.mjs
node scripts/check-n1-2013-07-integration.mjs
npx tsc --noEmit
npm run lint

open -a Simulator
echo "Opening Expo in iOS Simulator. Verify N1 2013年7月: answer selection, persistence, Back, submit, review transcript, and all audio segments."
npx expo start -c --ios
