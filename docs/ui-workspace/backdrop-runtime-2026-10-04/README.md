# Actual backdrop runtime evidence

Read [the full checkpoint](../../checkpoints/APP_BACKDROP_RUNTIME_2026-10-04.md) for observed causes, source changes and limits. All four responsive sizes are **production Chromium web**, not native devices. Native iPhone/Android/iPad acceptance is pending.

[Final build video](publish-final/transitions.mp4) · [Before video](before/transitions.mp4) · [After video](after/transitions.mp4) · Original after compositor JPGs: `after/compositor-frames.zip.part-*`.

Compositor ZIPs contain the original JPEG payloads emitted by CDP `Page.screencastFrame` with `everyNthFrame: 1`; no images were recreated. `paint-frames.json` maps filenames to action and timestamp. MP4 videos were transcoded from actual Playwright recordings. RAF layer data is zipped separately and does not certify CSS decode/physical device frames.

The main after recording performs 63 actions with answer preservation through a real exit/resume/submit/results/review flow. Responsive runs perform another 252 actions. Cold route smoke records 75 URLs; two dictionary URLs fail with the existing SQLite-provider error on web. Saved player/session values come from isolated browser contexts, not a user's signed-in device.

Reproduce outside the repository's dependency installation:

```sh
npx expo export --platform web --output-dir /tmp/japan-backdrop-web
BACKDROP_BUILD_DIR=/tmp/japan-backdrop-web \
BACKDROP_EVIDENCE_DIR=/tmp/japan-backdrop-evidence \
BACKDROP_BROWSER_PATH=/path/to/chromium \
BACKDROP_PLAYWRIGHT_MODULE=/path/to/playwright \
node scripts/capture-backdrop-runtime.cjs
```

Python 3, Playwright, Chromium and Playwright's ffmpeg binary are needed for capture; no project dependency was added. `BACKDROP_VIEWPORT='{"width":768,"height":1024}'` changes size; `BACKDROP_FAST=1` reduces inter-action rest. `scripts/capture-backdrop-routes.cjs` uses the same environment and `scripts/backdrop-route-cases.json`.

A browser opening a new document can show its bootstrap/HTML background before app readiness. Native splash, native screen/window opacity, physical frame timing, background/resume, audio/microphone and all state-dependent rewards/results require device recordings.

Two large ZIPs are stored as ordered binary parts because the publishing transport limits request size. Restore the byte-identical archives from this directory:

```sh
cat after/compositor-frames.zip.part-* > after/compositor-frames.zip
cat cold-routes/screenshots.zip.part-* > cold-routes/screenshots.zip
```
