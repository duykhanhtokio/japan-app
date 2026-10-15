# 建設 — active 10 × 40 Japanese review tests

Publisher update2026-10-15 supersedes10x20 size. New runtime bank src/data/kensetsu/review-tests.ja.json:10tests/400questions; every385lesson represented with exact source hashes. Scope and residual paragraph gaps:ten-by-forty/REPORT_VI.md and coverage-matrix.json. Japanese-only development runner integrated via existing Kensetsu course mode selector; hidden answers untilsubmission, scoped persistent attempts, grading/review/source return. Actual adapted web400questions/1600choices and study84combinations PASS; narrow TypeScript, state and byte-lock checks PASS. Human/native/domain/rights/release approval remains false. No exhaustive knowledge/advanced2/native-device claim. Containing commit must be remote-verified before durable completion is reported.

## Historical 10×20 draft retained unchanged

# 建設 — 10 × 20 Japanese review tests

Publisher instruction, 2026-10-13: continue to assessment authoring; create exactly 10 tests of 20 questions based on existing lessons. This explicit instruction supersedes the historical `examAuthoringEnabled: false` and “no exams yet” authoring-phase restriction, for this bank only. It does not certify the existing lessons or authorize release before review.

Authored 200 new single-answer four-option questions with Japanese explanations and stable IDs. Ten thematic review blocks cover study weeks 1–6, 7–12, 13–18, 19–24, 25–30, 31–35, 36–40, 41–45, 46–50 and 51–55. Every question traces to one existing lesson, its cluster, two paragraphs, revision and SHA-256. References span 55 weeks and 200 distinct lessons; this is sampling, not exhaustive coverage of 385 lessons or all knowledge atoms. All stems/options/explanations are Japanese; numeric values in the two arithmetic items are original teaching examples.

The current learning corpus shares introductory knowledge across six separately identified routes (1号/2号 × utilities/building/civil). This bank follows that shared scope, with no duplicated six-bank claim and no claim to assess advanced 2号 proficiency. Existing level/field routes, learner completion records, lesson content, images and UI are unchanged. The bank is retained under authoring documents and is not yet wired to the app runner.

Official JAC overview checked 2026-10-13: 1号 theory 30 questions/60 minutes, practical 20/40; 2号 theory 40/60, practical 25/40. Only the overview was used for format context; official sample questions and PDFs were not read as creative inputs. The publisher-defined 20-question format is a learning check, not a full official-format simulation. No timer, pass threshold or promotion rule is inferred.

Each test has five correct answers at each position (1–4), with independently shuffled positions and distractors. No run of three identical answer positions occurs, including across test boundaries. All 200 stems and IDs are distinct. Seventy-seven items received a separate manual AI distractor revision to replace unrelated choices with subject misconceptions; no difficulty-calibration or learner trial is claimed.

Files:

- `review-tests-10x20.ja.json`: complete authoring bank and question-to-lesson evidence.
- `KENSETSU_REVIEW_TESTS_10x20_JA.md`: all ten question sets, followed by separate Japanese answer/explanation tables for review.
- `authoring-manifest.json`: scope, basis and official-format distinction.
- `structural-qa.json`: reproducible machine checks from `node scripts/check-kensetsu-review-tests.mjs`.

Status: AI-authored editorial draft; human domain/safety review, native Japanese review, original-source semantic similarity/rights review and runtime integration remain pending. Existing lesson review gaps are retained. Do not set `appIntegrationReady` or `releaseReady` to true from the machine result. Answers/explanations in the review document are authoring material; a future runner must hide them until submission and keep learner/level/field/exam answer state separate from study completion.

Next: review each answer and distractor against the linked teaching claim and its unresolved source/domain issues; then integrate a Japanese-only development test runner with submission/result/review and independent saved state. Retain ten tests and 200 question IDs. Durability requires remote verification of the containing narrow commit, not this checkpoint's prose.
