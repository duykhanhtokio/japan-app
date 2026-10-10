# Focused care-Japanese check

Build with `2026-10-08-six-mocks/build.cjs`; set KAIGO_ESBUILD_MODULE, KAIGO_BROWSER_PUBLIC and, for sparse checkouts, KAIGO_ASSET_FALLBACK_ROOT to exact repository assets. Run executed-browser-check.mjs with KAIGO_CHROMIUM_MODULE, KAIGO_PLAYWRIGHT_MODULE, KAIGO_CHROMIUM_PATH and KAIGO_BROWSER_PUBLIC.

Checks 32 points in four units (12 appended), 110 existing vocabulary records with their actual reading/gloss, 12 mock catalog entries, self-check hiding/reveal/reload, 216 report rows and three viewports. Base lessons are reached through their group from daily-plan.json; the initial attempt omitted that navigation and timed out, then the corrected harness passed. evidence.json hashes the runtime. Screenshots show authored app text only. Actual KaigoCourse/Royal components with expo-image shim; no full Expo Router/native/release certification.
