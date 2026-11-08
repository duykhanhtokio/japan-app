#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$project_dir"
node - <<'JS'
const {execFileSync}=require('node:child_process');
const git=args=>execFileSync('git',args,{encoding:'utf8'}).trim();
console.log(JSON.stringify({kind:'YOKOSO_PERF_ENV',node:process.version,commit:git(['rev-parse','HEAD']),branch:git(['branch','--show-current']),dirty:!!git(['status','--porcelain']),expo:require('expo/package.json').version,reactNative:require('react-native/package.json').version,expoRouter:require('expo-router/package.json').version}));
JS
# One foreground process. Ctrl+C stops the server; no background worker/daemon.
# Use --lan for an iPhone on the same Wi-Fi; --localhost for this Mac's simulator.
exec env EXPO_PUBLIC_PERF_TRACE=1 npx expo start "$@"
