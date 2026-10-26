# Food manufacturing implementation checkpoint

Internal development preview on `feature/food-manufacturing-20261026`. Read IMPLEMENTATION_REQUEST.md, progress.json, source-review.md, source-map.json and batch-05-review.json. AI checks do not certify native, expert or release quality.

## Current content

- 78 canonical Japanese lessons: 42 for 1号 in 7 weeks; 36 for 2号 in 6 weeks. All 12 target lesson locales have 78 entries each (936 pairs).
- 20 mock forms: 10 per level, 40 questions each (800 total), plus 13 weekly checks of 3 questions (39 total). All 839 Japanese items and 33 assessment revisions are unchanged from batch02.
- Four exact color concept diagrams have all 12 caption locales (48 pairs).
- All 39 weekly questions are translated into all 12 locales (468 pairs). 1号 mock01 and mock02 are translated into all 12 (960 pairs); mock03 additionally into EN/VI (80 pairs). Total: 1,508 question-locale pairs, with 159 each in EN/VI and 119 each in the other ten locales. Each question includes all four choices/reasons and an explanation, bound to canonical sourceHash. Titles are translated too.
- All AI-authored content remains unreviewed by native/domain specialists. Missing/stale translations have explicit notices and never count as completed fallback.

## Validation and resume

Use check-content.py and check-question-translations.cjs under scripts/food-manufacturing; check-state.mjs covers persistence and scoring. Current structure/adapter checks PASS for 1,508 pairs; 8,560 pairs remain missing without fallback. The numeric audit has one EN worded-number equivalence (two-minute = 2分), resolved by AI. Mixed-script validation rejects foreign letters/marks/digits while permitting shared Bengali danda punctuation. Three Khmer fragments containing Thai characters were corrected; an in-memory regression reproduces and rejects the former q024 corruption.

Browser baseline browser-qa.json verifies 839 Japanese items; browser-locales-qa.json completes evidence for 936 lesson-locale pairs. browser-assessments-qa.json at commit 854bfc43e6ee0c074ab0de60efc787aa2faa98ba verifies 548 old question-locale pairs. New browser-assessments-batch05-qa.json merges three disjoint locale runs covering 960 new pairs, 960 pre-submission explanation checks and 3,840 viewport cases. The old 548 pairs/titles, all other data and food runtime bytes are verified identical before inheriting their evidence. Combined assessment evidence covers 1,508 pairs and 6,032 viewport cases. Approved JLPT UI lock: 10/10 PASS.

New QA invocation uses FOOD_QA_ASSESSMENTS_ONLY=1 and FOOD_QA_ASSESSMENT_DELTA_BASE=854bfc43e6ee0c074ab0de60efc787aa2faa98ba. Run three groups with FOOD_QA_DELTA_GROUP=a, b or c and FOOD_QA_EXPECTED_NEW_QUESTION_PAIRS=320:

- Group a: en,vi,id,tl; FOOD_QA_EXPECTED_QUESTION_PAIRS=556.
- Group b: zh-CN,zh-TW,hi,ne; FOOD_QA_EXPECTED_QUESTION_PAIRS=476.
- Group c: bn,my,th,km; FOOD_QA_EXPECTED_QUESTION_PAIRS=476.

Set FOOD_QA_TEST_LOCALES per group. All input JSON freezes before bundling. merge-assessment-browser-reports.cjs rejects overlapping/incomplete locale coverage, differing snapshots and changed post-QA input. Keep prior reports. A future delta baseline needs support for its own cumulative report; do not silently treat the batch05 report as the old 548-pair report.

The browser uses react-native-web with explicit Royal artwork, background, safe-area and storage adapters; it is not a full Expo or native-device check. FOOD_QA_SCRIPT_FONT_DIR supplies qa-hi/bn/my/th/km.woff2; Nepali uses the Devanagari face. Required output, Chromium and Japanese-font environment variables are enforced. Twelve batch05 phone WebP screenshots are under runtime-tests; glyph samples were inspected. Native/full Expo validation remains pending.

## Next work

Translate 2号 mock01 into all 12 locales, then the remaining mock forms (8,560 question-locale pairs pending overall). Preserve all existing Japanese/translation hashes and 33 assessment revisions. Continue verified full-body furigana, detailed competency mapping and complete source visual review, original illustrative assets and optional prerecorded audio, then full Expo/native and expert/native review.

The 153/158 TOC candidate mappings and 96 range-review candidates remain explicit; they do not certify mastery or full source coverage. Source PDFs/images are not redistributed. Keep this worktree independent from agriculture, restaurant and other sectors; preserve unrelated changes and the approved JLPT UI.
