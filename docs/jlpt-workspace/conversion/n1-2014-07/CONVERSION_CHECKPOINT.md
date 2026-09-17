# N1 2014-07 conversion checkpoint

## Current state — 2026-09-17

User requested “tiếp tục” after final N1 12/2013 approval; interpreted as the next pending N1 exam in catalog order, July 2014. Continue on the user-designated `recovery/n1-2013-12` branch; preserve all completed exams and locked UI.

- Exam ID: `n1-2014-07-exam-05`.
- Source inventory: 15 question JPEGs, 13 answer/script JPEGs and one real MP3, all readable; exact hashes/dimensions/bytes in `source-manifest.json`.
- Audio SHA-256: `f534896b9c9962ce3ff1eae69f49b7afb1a0e93438ab437d63d3a55032937309`, matching the repository source declaration.
- Answer/script page 1 visually checked; all 70 written and 37 listening answers match `src/data/jlpt-mock/n1-2014-07-official.ts`.
- Listening counts: 6 + 7 + 6 + 14 + 4 = 37. Problem 5 item 3 has two responses (4, 1); expected 36 unique segments. Do not copy the 2013 exam's 36-response / 35-segment counts.
- Status: `structured_ready`; registered once. The user accepted the requested Simulator/runtime and audio review gate on 2026-09-17 (“đã duyệt ok. Tiếp tục tiến trình”). Exact reviewed hashes are bound in `runtime-review/approval.json`.
- Written: 70/70 responses complete, including the full CPJ card table and continuation footnote on pages 12-13. Listening problems 1-5: 37/37 transcripts/options/prompts verified against source images. Audio: 36 unique ranges mapped to 37 responses; all ranges decode and were accepted at the user runtime/audio review gate.
- Explanation transcription/translation: pending, outside the inventory unit. Use only approved repository sources. Translate in Codex with `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`; never use public translation services or runtime translation APIs/dependencies.
- All nine startup validators passed. UI lock 10/10, catalog 50 = 5 structured official + 40 pending + 5 mocks.

## Durable checkpoint

- Runtime/audio approval finalization: `d0e9c93c09d1d6b4ce42e886b3febdf0985e52c9`; pushed, fetched and exact-HEAD verified by `check-work-persistence.mjs` on `origin/recovery/n1-2013-12`, clean working tree, 2026-09-17. Reviewed HEAD `0bd3e2dd8cd2e097a4086a42d128909a244d9f83`; reviewed candidate commit `22296850301ed5941c9ed50ab22dc090a721a57a`; reviewed dataset SHA-256 `729e680533a5660b56a223abfa209fcef98ade9eb21162cd3c921fd2318fc273`.

- Integrated Simulator review candidate: `22296850301ed5941c9ed50ab22dc090a721a57a`; pushed to origin/recovery/n1-2013-12, fetched and exact-HEAD verified by `check-work-persistence.mjs`, clean working tree. Candidate is awaiting user runtime/audio approval; explanations/translations pending.

- Audio alignment: `66b38b49eab5b39eeba954314dfe239a47bc585a`; push/fetch/exact remote HEAD verified, working tree clean.

- Listening complete 37/37: `9448e63fb8d6591f1ee0f99faf63b395f90aa2d7`; push/fetch/exact remote HEAD verified, working tree clean.

- Listening problem 4: `b5ec5c0f9743b0ae1d60ad43c3d07b44ca1d0a98`; push/fetch/exact remote HEAD verified, working tree clean.

- Listening problem 3: `d48b01aeb811be5317f8a9d21159e74d8954882e`; push/fetch/exact remote HEAD verified, working tree clean.

- Listening problem 2 transcripts: `ab896cda14e553973f946684e0c78e3e78a272f3`; push/fetch/exact remote HEAD verified, working tree clean.

- Listening problem 1 transcripts: `d1051f79b54fb854157dae8568cffc9ceaf998d5`; push/fetch/exact remote HEAD verified, working tree clean.

- Written complete 70/70: `dd5ad7b4c25a8f03d2d4664cc8bec7f5c4ee806e`; push/fetch/exact remote HEAD verified, working tree clean.

- Questions 65-68: `1f296e7bbeeafde69c76c72f03fee2163b4a7291`; push/fetch/exact remote HEAD verified, working tree clean.

- Questions 63-64: `37e56cf1ede881e9104385f885a16cbdbe093368`; push/fetch/exact remote HEAD verified, working tree clean.

- Questions 59-62: `5f8fb2766c3c3bf8d993a329b6f5b5c4310970d5`; push/fetch/exact remote HEAD verified, working tree clean.

- Questions 53-58: `fe1d9e9687ae405b7ad28dbe4ed06b3fc57610a5`; push/fetch/exact remote HEAD verified, working tree clean.

- Questions 50-52: `90d640b46c30a99e04ae53636141adead9577ac6`; push/fetch/exact remote HEAD verified, working tree clean.

- Short reading questions 46-49: `05da9735d4aef76df783725b5dd1fd239179e56a`; push/fetch/exact remote HEAD verified, working tree clean.

- Written page 5 / questions 38-45: `6d7f93dd046aaf547824ef18e8e7c3787cf917c8`; push/fetch/exact remote HEAD verified, working tree clean.

- Written page 4: `426828c208c0b1c009f35e15e6f8f8f93b456925`; push/fetch/exact remote HEAD verified, working tree clean.

- Written page 3: `3e301fb920a36235571ce7cd351e04d248810952`; push/fetch/exact remote HEAD verified, working tree clean.

- Written page 2: `5dde91640544db25b0e20f0ff540d55340b9ac5c`; push/fetch/exact remote HEAD verified, working tree clean.

- Source inventory: `3ba17f8415d581c1b8327f2b8d4c80d381850eaa`; push/fetch/exact remote HEAD verified, working tree clean.

- Starting HEAD: `ab7c7d4692dc9479334688287b9a0f5ec83b8225`, exact remote HEAD verified on origin/recovery/n1-2013-12 with clean working tree. Commit/push access established in preceding units.

## Backup

.jlpt-backups/n1-2014-07-inventory-20260917-065926/ (files list and SHA-256 before/after).

Page 3 source anomaly: question 22 has a printed answer key of 2, although option 1 appears natural. The source key is preserved as required; this is not an inferred correction. Revisit the approved explanation source when that unit begins.

Source declaration page grouping is historical and inaccurate: written material actually continues through question page 13 (CPJ footnote), while listening begins on that same page. Conversion follows actual images rather than the old WRITTEN_PAGES/LISTENING_PAGES arrays.

Listening problem 1 transcript unit: question page 13 and answer/script pages 7-9 visually compared. No audio boundaries guessed; mappings remain absent until local alignment output is inspected. No external service is used.

Listening problem 2: seven responses compared with question pages 13-14 and answer/script pages 9-10. Printed transcript omissions/awkward phrases retained (e.g. q2/q6 repeated prompt); prompt field remains the complete question.

Listening problem 3: six full transcripts and spoken choices compared with answer/script pages 10-12. Source wording retained, including printed 終演 and ストーリ in item 2. Local Whisper finished successfully; its output is an alignment aid only and does not replace source transcription.

Listening problem 4: all 14 prompts and exactly three spoken choices per item visually checked against answer/script page 12. Printed anomalies such as 急い出る, 思わしくないだ and 勝手出て retained without editorial correction.

Listening source transcription complete: 37 responses. Problem 5 item 3 retains two independent responses (suffix a/b, answer 4/1) sharing the complete source transcript and later one audio segment. Original Japanese transcripts remain distinct from future translated explanations.

Audio alignment: full source duration 2979.900023 s. `audio-alignment.tsv` is local Whisper small output, not authoritative text. Full-pass timing hallucinations around problem 4 items 5-8 were resolved by a fresh local run on seconds 2138-2288 (`audio-alignment-p4-recheck.tsv`, relative times +2138 s). Candidate starts for these four items: 2152.7, 2188.7, 2221.7, 2251.7 seconds. Ranges include inter-question silence and exclude the following item. Final range ends at 2979900 ms. All timing statuses remain pending runtime review.

## Candidate integration

Builder `scripts/build-n1-2014-07-structured.mjs` deterministically assembles 107 responses and deduplicates passages. `--check` detects drift from reviews. Adapter has independent exam/session/question IDs; final shared listening item is question 3 / suffix a and b. Underlined vocabulary targets are preserved and shown as 対象 in the existing instruction field, since locked UI renders plain text. No UI changes. Registry replaces one pending entry, maintaining 50 entries: 5 structured official (including this pending-review candidate), 40 pending, 5 mocks. Explanations and translations remain pending until runtime approval, following the prior exam workflow.

Candidate validation: all nine preservation/startup validators and new N1 2014-07 integration validator PASS; 36 audio segments decode; deterministic source rebuild and adapter exercised. TypeScript PASS; lint 0 errors / 16 existing warnings. Clean-cache iOS bundle PASS (15288 ms, 6002 modules) using Expo on port 8083. Simulator screenshot `runtime-review/n1-2014-07-catalog-20260917.png` shows the fifth entry with 107 responses. It verifies catalog loading only. `runtime-review/candidate-review.json` binds the pending review to exact candidate, review-input and audio hashes. Existing optional ExpoSpeechRecognition warning remains unrelated to JLPT. No answers were cleared or automatically submitted.

## Runtime/audio approval — 2026-09-17

The user confirmed “đã duyệt ok. Tiếp tục tiến trình” after the N1 July 2014 Simulator/audio review request. `runtime-review/approval.json` binds that acceptance to the exact reviewed HEAD, candidate commit, candidate dataset, all 16 source-review inputs, the candidate review record and the source MP3. The builder rejects drift in those inputs. The stable `exam.candidate.json` filename is retained; its authoritative status is now `structured_ready`. All 36 timing ranges use `timingVerificationStatus: verified` with the user-runtime-approval basis. This acceptance does not approve future explanation translations and does not correct printed source anomalies.

Resume: transcribe source explanations from answer/script page 2, validate the complete page unit, commit/push/remote-verify it, then continue page by page. Translate only in Codex after source transcription, retain Japanese terms as needed, and mark every target `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`. No public translation service, runtime translation API, or translation dependency.

## Explanation conversion progress

- Answer/script page 2 visually transcribed: source explanations 1-13 in `explanations/source-page-02.json`. The source validator checks unique questions, answer-key agreement, source-image hashes, locale completeness and required AI-unreviewed translation metadata. Translation coverage remains 0/840 because translation is outside this source-page unit. Commit `3fb867bbb1e1adde7466a7da5abe3eb47973b4e6` was pushed, fetched and exact-HEAD verified by `check-work-persistence.mjs`, clean working tree. Next: answer/script page 3, beginning with explanation 14.

Integration backup: `.jlpt-backups/n1-2014-07-integration-20260917-201858/`.

Runtime approval backup: `.jlpt-backups/n1-2014-07-runtime-approval-20260917-205100/`.
