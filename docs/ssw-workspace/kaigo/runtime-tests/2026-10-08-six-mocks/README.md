# Focused browser evidence: six Kaigo forms

The executed test uses the actual KaigoCourse, session/storage modules and existing Royal components/art. Only expo-image is mapped to React Native Web Image for the focused harness. This is not a full Expo Router or installed native binary test.

`browser-evidence.json` records all six forms. Images show the new catalog and two new visual judgement cards.

Re-run in a full repository checkout with esbuild, Playwright and a Chromium executable available. Set `KAIGO_ESBUILD_MODULE` and `KAIGO_PLAYWRIGHT_MODULE` to installed module paths if these are outside normal module resolution. Set `KAIGO_CHROMIUM_PATH` to the executable and `KAIGO_BROWSER_PUBLIC` to a temporary output directory outside Git. Run build.cjs then executed-browser-check.cjs. Japanese font is the project-licensed NotoSansJP-Medium.ttf. `KAIGO_ASSET_FALLBACK_ROOT` optionally supplies the identical repository assets for a sparse checkout.

The build output is temporary; screenshots, test source and JSON evidence are durable. The scripts require no source textbook bytes.
