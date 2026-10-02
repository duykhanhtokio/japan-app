# Royal panel repair — 2026-10-02

Status: web runtime visually checked; native acceptance remains pending.

Scope: common Credit rendering, full-image Home cards, common paper panel corners, and the `JLPT 学習` title. No exam controller, scoring, session, audio, exam data, locked hashes, or locked exam screen changed.

## Evidence and diagnosis

Input: the user's 22:00 and 21:58 Simulator screenshots. Startup fetched the required branch; HEAD and remote were `fabbdabc498e6f7800c67cdf71f318649af51450`, working tree clean, WORK PERSISTENCE PASS, UI lock 10/10. Later dialogue-only commits were fast-forwarded through `1907a8123d191bedb161b079e856171d56102a86`, then `9698ac10`, without overwriting them.

Before-edit real Expo/React Native Web screenshots reproduced both defects. The Home image itself already covered its measured View. Paper-filled corner/edge raster slices overlaid that image, exposing ivory strips; border-only corners were also scaled with different X/Y factors. The paper wrapper painted a rectangle behind transparent ornamental corners.

Repair:

- Restore the existing `hud-energy-open-frame-v1.png` found in GameHeader history before `faf80293`; preserve current bar heights and shared Credit logic. Its visible crop is y=156..550 of 2172×724. Reuse its open center rather than paper-filled edge slices.
- Use nine slices with the same scale for both axes of every open-frame corner. Source ornament cuts x=330/1842 and y=300/406; the measured 32px bar gives scale 36/330, corner dimensions 36×15.709. Native `onLayout` supplies the actual width/height. Red and empty fill occupy one clipped View with the exact same geometry. At this scale its inset is left 15.273, right 15.164, top 7.418, bottom 4.473. The inner alpha boundaries were inspected on the existing source raster (center horizontal opening x=140..2033; vertical opening y=224..509). Fill overlap remains under the gold edge.
- Keep common paper/HUD panel wrappers transparent, including when caller styles previously supplied a background. The raster center owns the parchment/navy fill and its alpha owns the outer corners; no painted corner cover or added decorative layer.
- Home retains its original three large images, `cover`, overlay copy, routes and dimensions. All sources are 2172×724 and have full useful image content. Remove the filled-paper border overlay by using the existing transparent open frame; copy is inset by the 36px measured corner extent.
- Put `JLPT 学習` on the existing Royal navy plaque, with gold Royal serif text, controlled 1px shadow, shrink-to-fit and a separate 42px help button.

## Actual DOM layout, before → after

Values are CSS pixels from the running web app, not native device measurements.

| Viewport (portrait) | Credit | First mode card |
|---|---|---|
| 430×932 (iPhone 16 Plus sized) | 406×32 → 406×32 | 406×135 → 406×135 |
| 320×568 (small phone sized) | 296×32 → 296×32 | 296×124 → 296×124 |
| 768×1024 (iPad sized) | 744×32 → 744×32 | 744×248 → 744×248 |
| 1440×900 (desktop) | 1416×32 → 1416×32 | 960×320 → 960×320 |

Landscape counterparts: 932×430, 568×320, 1024×768 and 900×1440. All measured rectangles, source hashes and visible-edge scroll positions are in `royal-panel-runtime-2026-10-02/`.

## Runtime visual verification

Chromium 153 ran the real Expo web bundle. Captured and inspected:

- 16 before and 16 final Home/JLPT learning viewport screenshots.
- 32 downstream viewport screenshots: `/N5`, `/N5/vocabulary`, `/N5/grammar`, `/N5/test`, each at all eight viewport sizes.
- 32 first-panel element screenshots and enlarged corner crops. A small-phone landscape grammar element screenshot is partially clipped by its ScrollView; it is explicitly **not** evidence for its hidden bottom edge.
- 48 actually visible Home top/bottom edge strips (three modes × eight viewports × two edges), plus two actually visible grammar edge strips after scrolling. These resolve the hidden-edge limitation. Inspected at 2× scale; no ivory strips in image interiors, rectangular white corners, exposed slice seams, or visibly deformed corners in the checked web captures.
- Credit screenshots at 100, 75, 25 and 0, enlarged 2×. Red fills the interior at 100; the red/empty boundary moves left as Credit decreases. Text stays centered.
- Final Royal title is legible, stays separate from help and retains the exact label.

Screenshots and original full layout logs are in the saved `japan-app-royal-ui-runtime-2026-10-02.zip` evidence package. Crop sheets are enlarged actual runtime pixels, not generated/reconstructed interface images.

## Validation and limits

- Scoped ESLint: PASS, zero warnings/errors in changed source files. Capture-script syntax: PASS.
- `git diff --check`: PASS.
- JLPT UI lock: PASS 10/10; locked files unchanged.
- TypeScript: FAIL on the already documented `src/services/life-content-repository.ts:41` TS2352 scenario index cast; no diagnostic points at changed files. This unrelated content issue was preserved.
- No macOS/iOS Simulator or Android device exists in this Linux workspace. **No actual iPhone, iPad, or Android visual approval is claimed.** Browser dimensions are not device validation. Native acceptance remains pending.
- Chromium's default font fallback displays some pre-existing Japanese text outside explicitly Royal-font components as missing glyphs. The revised title uses the loaded Royal Japanese font. This does not certify unrelated typography or the whole app's visual quality.

To reproduce: run Expo web, then `JAPAN_UI_BASE_URL=http://127.0.0.1:8081 JAPAN_UI_BROWSER_PATH=/path/to/chromium node scripts/capture-royal-panel-runtime.cjs /tmp/royal-runtime`. Playwright must be installed/available. Inspect screenshots and top/bottom strips; this command captures evidence and does not auto-certify visual acceptance.
