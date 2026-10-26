# Food manufacturing implementation checkpoint

Validated isolated preview on `feature/food-manufacturing-batch07-20261026`; integration target is `feature/food-manufacturing-20261026`. Read IMPLEMENTATION_REQUEST.md, progress.json, source-review.md, source-map.json and batch-07-review.json. AI checks are not native, expert or release certification.

## Current content

- 78 canonical Japanese lessons: 42 for 1号 in seven weeks; 36 for 2号 in six weeks. All 12 lesson locales have 78 entries (936 pairs).
- 20 mock forms, ten per level with 40 questions each (800 total), plus 13 weekly checks of three questions (39 total). All 839 Japanese items and 33 assessment revisions remain unchanged from batch02.
- Four exact color concept diagrams have all 12 caption locales (48 pairs).
- All weekly questions are translated into all 12 locales (468 pairs). Mock01–03 of BOTH levels are translated into all 12 (2,880 pairs); 1号 mock04 additionally into EN/VI (80 pairs). Total: 3,428 question-locale pairs; 319 questions/20 titles each in EN/VI and 279 questions/19 titles each in the other ten locales. Four choices, four reasons, explanations and titles are source-revision bound.
- All authored content remains AI-unreviewed by native/domain specialists. Missing or stale translations have explicit notices and never count as completed fallback.

## Validation and review

check-content.py and check-question-translations.cjs PASS for 3,428 pairs; 6,640 mock question-locale pairs remain missing without fallback. check-state.mjs covers persistence/scoring; food runtime bytes remain unchanged. Approved JLPT UI lock: 10/10 PASS.

Batch07 numerical audit has 64 equivalent formatting/wording candidates, all AI-resolved: locale decimal/thousands separators, clocks, worded seven/first and Japanese five/four quantities. No numeric values were changed to silence flags. Eleven arithmetic/conditional references verify source-answer alignment. Run audit-question-numbers.py with a fresh --output basename for a new batch, preserving prior resolutions.

Independent AI peer review covered 273 unique locale-question units: 20 critical IDs per locale, MY q341 and 32 additional incoming Indonesian questions. All reported corrections were rechecked. These include responsible-person actor wording in EN q174, possibility rather than absolute visibility in MY q344, speech/action direction in BN/MY q209, BN root-cause-removal grammar/out-of-spec clarity, and general nonconformance rather than upper-only exceedance in KM q254. Capacity interruptions used preserved-file handoffs and smaller stages; no valid content was restarted. Actual ownership/review counts are recorded in batch-07-review.json, excluding self-authored content from independent review.

browser-qa.json verifies 839 Japanese items; browser-locales-qa.json completes evidence for 936 lesson-locale pairs. Historical assessment reports verify 548 pairs, then 1,508, then 2,468 at common baseline 77a84b5fcec06a2a7d68aa1734bbdd91a0d8fd0e. browser-assessments-batch07-qa.json adds 960 new pairs, 960 pre-submission explanation checks and 3,840 viewport cases. Prior entries/titles, all other source data and runtime bytes are checked exactly before inheriting evidence. Cumulative assessment evidence: 3,428 pairs and 13,712 viewport cases.

## Browser QA invocation

Batch07 used FOOD_QA_ASSESSMENTS_ONLY=1, FOOD_QA_ASSESSMENT_DELTA_BASE=77a84b5fcec06a2a7d68aa1734bbdd91a0d8fd0e, FOOD_QA_ASSESSMENT_BASELINE_REPORT=browser-assessments-batch06-qa.json and FOOD_QA_DELTA_BATCH=batch07. Run groups with FOOD_QA_DELTA_GROUP=a, b or c and FOOD_QA_EXPECTED_NEW_QUESTION_PAIRS=320:

- a: en,vi,id,tl; FOOD_QA_EXPECTED_QUESTION_PAIRS=1196.
- b: zh-CN,zh-TW,hi,ne; FOOD_QA_EXPECTED_QUESTION_PAIRS=1116.
- c: bn,my,th,km; FOOD_QA_EXPECTED_QUESTION_PAIRS=1116.

Set FOOD_QA_TEST_LOCALES per group and FOOD_QA_SCREENSHOT_EXAM=food-2-mock-03. For a future batch, pin its actual parent commit and cumulative baseline report (currently browser-assessments-batch07-qa.json), choose a new batch name and derive exact pair totals. Use exact canonical form membership; question IDs are not sequential ranges.

All JSON freezes before bundling. merge-assessment-browser-reports.cjs rejects overlapping/incomplete locale coverage, differing baseline reports/snapshots and changed post-QA input. Keep historical reports and images. Browser checks use react-native-web with explicit Royal artwork, background, safe-area and storage adapters. They are not full Expo/native checks. Required output/Chromium/Japanese-font environment variables are enforced; FOOD_QA_SCRIPT_FONT_DIR supplies qa-hi/bn/my/th/km.woff2 (Nepali uses Devanagari). Twelve batch07 phone WebP screenshots are under runtime-tests; glyph samples were inspected.

## Next work

Next 960 pairs: 1号 mock04 into the remaining ten locales, 2号 mock04 into all 12, and 1号 mock05 into EN/VI. Continue remaining forms, verified full-body furigana, detailed competency/source visual review, original illustrations and optional audio, then full Expo/native and expert/native review.

The 153/158 TOC candidate mappings and 96 range-review candidates remain unverified for full mastery/coverage. Source PDFs/images are not redistributed. Preserve unrelated work and the approved JLPT UI; keep this worktree independent from agriculture, restaurant and other manufacturing work.

## Concurrent contribution retained

Remote c643abfc457dcc2bb81a79ccb32aa33ac7494782 independently completed Indonesian 1号 mock03 in commits b3f43f54 and21a74f5a. Integration retains all239 of its ID question objects and18titles verbatim, appending our remaining40 level2 questions and title. The complete incoming40-question Indonesian form receives renewed semantic/browser review. Merge-parent histories retain its progress notes and our independently authored alternative. Counts above are cumulative from the common77a84b5f baseline;40 of the960 new pairs were already saved by the concurrent contribution.

The shared branch advanced again to a6b0a913fcb5006c1b2ccac8a6ce95d289e828e5 with overlapping HI/KM/MY/NE/TH/TL variants during validation. This candidate is published separately; those latest variants remain untouched on the shared branch. Reconcile the draft PR before choosing a single continuation branch. Do not overwrite either dataset or count this candidate as merged into the shared sector branch.
