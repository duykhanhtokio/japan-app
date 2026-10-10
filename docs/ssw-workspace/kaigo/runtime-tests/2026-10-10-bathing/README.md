# Focused bathing check

Build the actual KaigoCourse and existing Royal components with `2026-10-08-six-mocks/build.cjs`; set KAIGO_ESBUILD_MODULE, KAIGO_BROWSER_PUBLIC and, for sparse checkouts, KAIGO_ASSET_FALLBACK_ROOT to exact repository assets. Run executed-browser-check.mjs with KAIGO_CHROMIUM_MODULE, KAIGO_PLAYWRIGHT_MODULE, KAIGO_CHROMIUM_PATH and KAIGO_BROWSER_PUBLIC.

Checks 35 chapter points (12 appended), 12 mock catalog entries, self-check answer hiding/reveal/reload, 239 report rows and three viewports. Evidence hashes the runtime. Screenshots contain authored app text only. This harness uses an expo-image shim and does not certify full Expo Router, native devices or release readiness.

Initial build lacked old image assets; its browser attempt failed on the new point. Exact assets were recovered from the previous bundle and verified against repository blob hashes (including reconstructed canonical LFS pointers), then a fresh build and check were run. Only the successful fresh check produces evidence.json.
