# Evidence

`audit.json` checks required image mappings and source asset hashes, all master option texts and keys, and illustrative example alternatives. `adapter-checks.json` records the 30 existing adapter validators. `runtime-report.json` records 150 browser layout checks. PNGs show separate examples and scored sections at 430 px.

Reproduction: with project dependencies available, set `JLPT_QA_WWW`, `JLPT_QA_FONT` and run `node build.cjs` from the repository root using this file's full relative path. Then set `JLPT_QA_PLAYWRIGHT` (Playwright module path) and `JLPT_QA_CHROMIUM` (Chromium executable), and run `runtime.cjs` using its full relative path. This is React Native Web verification, not an iOS/Android simulator test.
