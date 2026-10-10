# Focused housework check

Use `2026-10-08-six-mocks/build.cjs` with KAIGO_ESBUILD_MODULE, KAIGO_BROWSER_PUBLIC and, for a sparse checkout, KAIGO_ASSET_FALLBACK_ROOT containing exact repository assets. Run executed-browser-check.mjs with KAIGO_CHROMIUM_MODULE, KAIGO_PLAYWRIGHT_MODULE, KAIGO_CHROMIUM_PATH and KAIGO_BROWSER_PUBLIC.

Checks all 15 points in adl-iadl/home-environment, including seven appended points; 12 mock catalog entries; self-check hiding/reveal/reload; 95 report rows and three viewports. evidence.json contains the runtime hash. Screenshots show independently authored app text only. The harness uses actual KaigoCourse/Royal components with an expo-image shim. It does not certify full Expo Router, native devices or release readiness.
