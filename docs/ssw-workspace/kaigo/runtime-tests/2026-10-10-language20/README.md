# Executed 20-page reading batch checks

Printed source pages 209–228 were read and visually checked privately. This folder contains authored app screenshots only, not source page images.

Build the actual KaigoCourse and existing Royal components with `../2026-10-08-six-mocks/build.cjs`. Set KAIGO_ESBUILD_MODULE, KAIGO_ASSET_FALLBACK_ROOT and KAIGO_BROWSER_PUBLIC. Run executed-browser-check.mjs with KAIGO_CHROMIUM_MODULE, KAIGO_PLAYWRIGHT_MODULE, KAIGO_CHROMIUM_PATH and KAIGO_BROWSER_PUBLIC. Use exact repository fonts/assets if the checkout is sparse.

The executed test renders all 16 new cards and their readings, 95 existing lexical links and the new notes; verifies answer hiding, reveal, reload and editing; checks a retained atomic answer and the 12-form catalog; inspects four groups at 390×844, 768×1024 and 844×390 and the HTML report's 16 new task rows. Evidence hashes the new runtime file. Three screenshots were visually inspected. This is a focused React Native Web build with the expo-image shim, not installed Android/iOS or full Expo Router.

The first run completed card, vocabulary, resume and viewport checks but its final report assertion mistakenly expected 32 rows: the report has 16 new-task rows, and registry rows do not display those IDs. The corrected harness was rerun completely. Only the completed rerun may be cited as PASS.
