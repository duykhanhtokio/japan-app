# Food manufacturing implementation checkpoint

Internal development preview on feature/food-manufacturing-20261026. Read IMPLEMENTATION_REQUEST.md, progress.json, source-review.md, source-map.json and batch-02-review.json. Authored counts and structural checks are not expert/native or release certification.

## Current content

- 78 canonical Japanese lessons: 42 for 1号 in 7 weeks and 36 for 2号 in 6 weeks. Source hashes preserved.
- 20 mock forms: 10 for each level, 40 questions each (800 total).
- 13 independent weekly checks: 3 questions each (39 total).
- Full EN,VI,ID,zh-CN,zh-TW lesson packs: 78 each, 390 lesson-locale pairs. Four precise color diagrams have captions in all five locales.
- Vietnamese translations of all 39 weekly questions, their four choices/reasons, and 13 weekly assessment titles. Translation source revisions are checked; explanations appear only after submission. Missing/stale translations return no fallback.

The prior 17 assessment objects were preserved exactly. New forms03–10 per level use chapter-stratified independent author pools; every new 2号 form covers all six source chapters. Option/explanation pairs remain aligned after answer-position balancing. Source references use original printed/PDF pages; source PDFs/images are not redistributed.

## Validation and resume

Run scripts/food-manufacturing/check-content.py, check-state.mjs, check-question-translations.cjs and check-browser.cjs as documented by their environment checks. Full browser QA freezes all JSON inputs before bundling to avoid races with parallel authors. It uses react-native-web with explicit Royal artwork, background, safe-area and storage adapters; it is not a full Expo build or native-device certification. Consult browser-qa.json hashes and actual counts.

Remaining:seven lesson locales (hi,bn,ne,my,th,km,tl), remaining assessment translations, verified full-body furigana, detailed competency mapping, complete source visual review, original illustrative assets as needed, optional prerecorded audio, full Expo/native validation and expert/native review. This preview must not be treated as a completed production release.

Worktree is independent from agriculture. Preserve unrelated work and the approved JLPT UI. Native/expert review flags remain false. Source subsection end pages inferred from the TOC can omit continuation text; 96 candidate reference ranges require detailed mapping review and are explicitly recorded, not silently certified.
