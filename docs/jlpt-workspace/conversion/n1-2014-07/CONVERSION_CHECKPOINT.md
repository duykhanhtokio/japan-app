# N1 2014-07 conversion checkpoint

## Current state — 2026-09-17

User requested “tiếp tục” after final N1 12/2013 approval; interpreted as the next pending N1 exam in catalog order, July 2014. Continue on the user-designated `recovery/n1-2013-12` branch; preserve all completed exams and locked UI.

- Exam ID: `n1-2014-07-exam-05`.
- Source inventory: 15 question JPEGs, 13 answer/script JPEGs and one real MP3, all readable; exact hashes/dimensions/bytes in `source-manifest.json`.
- Audio SHA-256: `f534896b9c9962ce3ff1eae69f49b7afb1a0e93438ab437d63d3a55032937309`, matching the repository source declaration.
- Answer/script page 1 visually checked; all 70 written and 37 listening answers match `src/data/jlpt-mock/n1-2014-07-official.ts`.
- Listening counts: 6 + 7 + 6 + 14 + 4 = 37. Problem 5 item 3 has two responses (4, 1); expected 36 unique segments. Do not copy the 2013 exam's 36-response / 35-segment counts.
- Status: source_inventory_verified; not structured-ready or registered.
- Written: 70/70 responses complete, including the full CPJ card table and continuation footnote on pages 12-13. All options/keys and complete 1-70 sequence pass validation. Next: listening problem 1, question page 13 and answer/script pages. Listening transcription and audio alignment remain pending.
- Explanation transcription/translation: pending, outside the inventory unit. Use only approved repository sources. Translate in Codex with `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`; never use public translation services or runtime translation APIs/dependencies.
- All nine startup validators passed. UI lock 10/10, catalog 50 = 4 structured official + 41 pending + 5 mocks.

## Durable checkpoint

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
