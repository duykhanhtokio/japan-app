# Original JLPT native image sizing regression

The earlier absolute-fill image style allowed native intrinsic source dimensions to remain. Explicit percentage dimensions override both source dimensions. Source-sized images in this harness include width/height metadata. Native checks inspect the production QuestionBlock React element and merge source dimensions with Image props.style, matching installed iOS/Android Image implementations.

Browser checks cover30forms/84images across7portrait/landscape/desktop viewports. Report and screenshots are evidence of isolated RN-web rendering, not native Simulator or full Expo Router execution. All original source data/audio/assets and session services remain unchanged.

Run from repository root with installed dependencies:

```bash
JLPT_QA_WWW=/tmp/jlpt-native-sizing JLPT_QA_FONT=/path/to/japanese-font.ttf node docs/jlpt-workspace/image-native-sizing-2026-10-10/build.cjs
JLPT_QA_WWW=/tmp/jlpt-native-sizing JLPT_QA_CHROMIUM=/path/to/chromium PLAYWRIGHT_MODULE=/path/to/playwright-core node docs/jlpt-workspace/image-native-sizing-2026-10-10/runtime.cjs
```

Generated harness output belongs in /tmp; the checked-in entry/build/runtime/legacy-contract files reproduce these checks without exporting or changing production QuestionBlock.
