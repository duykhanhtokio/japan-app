# Food manufacturing implementation checkpoint

Internal development preview on `feature/food-manufacturing-20261026`. Read IMPLEMENTATION_REQUEST.md, progress.json, source-review.md, source-map.json and batch-06-review.json. AI checks do not certify native, expert or release quality.

## Current content

- 78 canonical Japanese lessons: 42 for 1号 in 7 weeks; 36 for 2号 in 6 weeks. All 12 target lesson locales have 78 entries each (936 pairs).
- 20 mock forms: 10 per level, 40 questions each (800 total), plus 13 weekly checks of 3 questions (39 total). All 839 Japanese items and 33 assessment revisions are unchanged from batch02.
- Four exact color concept diagrams have all 12 caption locales (48 pairs).
- All 39 weekly questions are translated into all 12 locales (468 pairs). Mock01 and mock02 of BOTH levels are translated into all 12 (1,920 pairs); 1号 mock03 additionally into EN/VI (80 pairs). Total: 2,468 question-locale pairs, with 239 each in EN/VI and 199 each in the other ten locales. Titles: 18 each in EN/VI and 17 each in the others. Each question includes all four choices/reasons and an explanation, bound to canonical sourceHash.
- All AI-authored content remains unreviewed by native/domain specialists. Missing/stale translations have explicit notices and never count as completed fallback.

## Validation and review

Use check-content.py and check-question-translations.cjs under scripts/food-manufacturing; check-state.mjs covers persistence/scoring (runtime unchanged). Current structure/adapter checks PASS for 2,468 pairs; 7,600 pairs remain missing without fallback. Audit numbers with `python3 scripts/food-manufacturing/audit-question-numbers.py --output batch-06-numeric-audit.json`; use a new output name for a new batch, preserving prior reviews. Seven candidates are equivalent worded numbers or clock formats, AI-resolved. Five calculation references independently verify arithmetic and source-answer alignment. Mixed-script validation permits shared Indic punctuation while rejecting accidental foreign letters/marks/digits.

AI peer review covered 200 unique locale-question units: 16 critical IDs across all 12 locales, plus eight additional correction-context units. Corrected collective output wording in q031, Latin word-number spacing, worker/instructor action in TL q003, TW object/scope/consumer false friends, BN advice-seeker/frequency/resource-use/extraneous-matter wording, MY wear-part wording and KM general CL deviation. All reported corrections were rechecked. These remain AI reviews, not native/domain certification.

Browser baseline browser-qa.json verifies 839 Japanese items; browser-locales-qa.json completes evidence for 936 lesson-locale pairs. browser-assessments-qa.json at 854bfc43 verifies 548 old question-locale pairs. browser-assessments-batch05-qa.json at c94e38b422b15a3b2582d098bcedfca57b29f80f adds 960 pairs (1,508 cumulative). New browser-assessments-batch06-qa.json adds another 960 pairs, 960 pre-submission explanation checks and 3,840 viewport cases. Prior entries/titles, all other source data and food runtime bytes are checked exactly before inheriting evidence. Cumulative assessment evidence: 2,468 pairs and 9,872 viewport cases. Approved JLPT UI lock: 10/10 PASS.

## Browser QA invocation

Batch06 used FOOD_QA_ASSESSMENTS_ONLY=1, FOOD_QA_ASSESSMENT_DELTA_BASE=c94e38b422b15a3b2582d098bcedfca57b29f80f, FOOD_QA_ASSESSMENT_BASELINE_REPORT=browser-assessments-batch05-qa.json and FOOD_QA_DELTA_BATCH=batch06. Run groups with FOOD_QA_DELTA_GROUP=a, b or c and FOOD_QA_EXPECTED_NEW_QUESTION_PAIRS=320:

- Group a: en,vi,id,tl; FOOD_QA_EXPECTED_QUESTION_PAIRS=876.
- Group b: zh-CN,zh-TW,hi,ne; FOOD_QA_EXPECTED_QUESTION_PAIRS=796.
- Group c: bn,my,th,km; FOOD_QA_EXPECTED_QUESTION_PAIRS=796.

Set FOOD_QA_TEST_LOCALES per group and FOOD_QA_SCREENSHOT_EXAM=food-2-mock-02. All JSON freezes before bundling. For a future batch, pin its actual parent commit and cumulative baseline report (currently browser-assessments-batch06-qa.json), choose a fresh batch name, and derive exact selected pair totals from actual data. Do not infer question IDs from numeric ranges; use exact canonical form membership.

merge-assessment-browser-reports.cjs rejects overlapping/incomplete locale coverage, mismatched baseline reports or snapshots, and changed post-QA input. Cumulative baseline loading verifies the prior merged groups and pair counts before inheritance. Keep historical reports and screenshots.

The browser uses react-native-web with explicit Royal artwork, background, safe-area and storage adapters; it is not a full Expo or native-device check. FOOD_QA_SCRIPT_FONT_DIR supplies qa-hi/bn/my/th/km.woff2; Nepali uses the Devanagari face. Required output, Chromium and Japanese-font environment variables are enforced. Twelve batch06 phone WebP screenshots are under runtime-tests; glyph samples were inspected. Native/full Expo validation remains pending.

## Next work

Next 960 pairs: translate 1号 mock03 into the remaining ten locales, 2号 mock03 into all 12, and 1号 mock04 into EN/VI. Then continue the remaining mock forms (7,600 question-locale pairs pending overall). Preserve all existing Japanese/translation entries and 33 assessment revisions. Continue verified full-body furigana, detailed competency mapping and complete source visual review, original illustrative assets and optional prerecorded audio, then full Expo/native and expert/native review.

The 153/158 TOC candidate mappings and 96 range-review candidates remain explicit; they do not certify mastery or full source coverage. Source PDFs/images are not redistributed. Keep this worktree independent from agriculture, restaurant and other sectors; preserve unrelated changes and approved JLPT UI.
