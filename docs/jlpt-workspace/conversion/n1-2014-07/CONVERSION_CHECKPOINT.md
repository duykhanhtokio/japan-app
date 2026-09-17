# N1 2014-07 conversion checkpoint

## Current state — 2026-09-17

User requested “tiếp tục” after final N1 12/2013 approval; interpreted as the next pending N1 exam in catalog order, July 2014. Continue on the user-designated `recovery/n1-2013-12` branch; preserve all completed exams and locked UI.

- Exam ID: `n1-2014-07-exam-05`.
- Source inventory: 15 question JPEGs, 13 answer/script JPEGs and one real MP3, all readable; exact hashes/dimensions/bytes in `source-manifest.json`.
- Audio SHA-256: `f534896b9c9962ce3ff1eae69f49b7afb1a0e93438ab437d63d3a55032937309`, matching the repository source declaration.
- Answer/script page 1 visually checked; all 70 written and 37 listening answers match `src/data/jlpt-mock/n1-2014-07-official.ts`.
- Listening counts: 6 + 7 + 6 + 14 + 4 = 37. Problem 5 item 3 has two responses (4, 1); expected 36 unique segments. Do not copy the 2013 exam's 36-response / 35-segment counts.
- Status: source_inventory_verified; not structured-ready or registered.
- Written: 70/70 responses complete, including the full CPJ card table and continuation footnote on pages 12-13. All options/keys and complete 1-70 sequence pass validation. Next: listening problem 1, question page 13 and answer/script pages. Listening problems 1-5: 37/37 transcripts/options/prompts verified against source images, keys match. Audio alignment pending; local Whisper small is processing the approved MP3 as a navigation aid. Next: inspect local Whisper boundaries and add all 36 unique audio segments.
- Explanation transcription/translation: pending, outside the inventory unit. Use only approved repository sources. Translate in Codex with `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`; never use public translation services or runtime translation APIs/dependencies.
- All nine startup validators passed. UI lock 10/10, catalog 50 = 4 structured official + 41 pending + 5 mocks.

## Durable checkpoint

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
