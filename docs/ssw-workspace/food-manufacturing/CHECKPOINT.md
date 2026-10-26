# Food manufacturing implementation checkpoint

Internal development preview on feature/food-manufacturing-20261026. Read IMPLEMENTATION_REQUEST.md, progress.json, source-review.md, source-map.json and batch-02-review.json and batch-03-review.json. Authored counts and AI checks are not native, expert or release certification.

## Current content

- 78 canonical Japanese lessons: 42 for 1号 in 7 weeks and 36 for 2号 in 6 weeks. Japanese source hashes preserved.
- 20 mock forms: 10 per level, 40 questions each (800 total), plus 13 weekly checks of 3 questions (39 total). The entire 839-item bank and all 33 assessment revisions are unchanged from batch02.
- All 12 target lesson locales complete at 78 entries each:en,vi,id,zh-CN,zh-TW,hi,bn,ne,my,th,km,tl (936 lesson-locale pairs).
- Four precise color diagrams have all 12 caption locales (48 diagram-locale pairs).
- All 39 weekly questions have complete EN and VI translations (78 question-locale pairs), including four options/reasons and 13 assessment titles per locale. Source revisions are checked; explanations appear only after submission. Missing/stale translations return no fallback.

## Validation and resume

Use check-content.py, check-state.mjs and check-question-translations.cjs under scripts/food-manufacturing. check-browser.cjs freezes JSON before bundling. Full mode tests the whole course. FOOD_QA_TRANSLATIONS_ONLY=1 with FOOD_QA_LOCALES=hi,bn,ne,my,th,km,tl and FOOD_QA_TEST_LOCALES=en tests the new batch, requires the prior 839-question baseline and old lesson locales to remain byte-identical, and writes browser-locales-qa.json separately. FOOD_QA_SCRIPT_FONT_DIR must provide qa-hi/bn/my/th/km.woff2 for script-specific glyph/shaping checks; Nepali uses the Devanagari face. Other required browser environment variables are enforced by the script.

The browser uses react-native-web with explicit Royal artwork, background, safe-area and storage adapters; these are not full Expo or native-device checks. See baseline browser-qa.json and new browser-locales-qa.json for exact source hashes and tested counts. QA evidence is under runtime-tests. Nepali/Khmer bounded parts were merged without replacing prior entries; integrate-locale-parts.py records the deterministic process.

Remaining: 800 mock items × 12 target locales and 39 weekly items × 10 remaining locales (9990 question-locale pairs); verified full-body furigana; detailed competency mapping and complete source visual review; original illustrative assets as needed; optional prerecorded audio; full Expo/native validation; expert/native review. This preview is not a completed production release.

Worktree is independent from other sectors. Preserve unrelated work and approved JLPT UI. Source PDFs/images are not redistributed. TOC-derived subsection end pages can omit continuation text; the 96 range-review candidates remain explicit, not silently certified.
