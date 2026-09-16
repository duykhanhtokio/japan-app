# N1 2014-07 conversion checkpoint

## Current state — 2026-09-17

User requested “tiếp tục” after final N1 12/2013 approval; interpreted as the next pending N1 exam in catalog order, July 2014. Continue on the user-designated `recovery/n1-2013-12` branch; preserve all completed exams and locked UI.

- Exam ID: `n1-2014-07-exam-05`.
- Source inventory: 15 question JPEGs, 13 answer/script JPEGs and one real MP3, all readable; exact hashes/dimensions/bytes in `source-manifest.json`.
- Audio SHA-256: `f534896b9c9962ce3ff1eae69f49b7afb1a0e93438ab437d63d3a55032937309`, matching the repository source declaration.
- Answer/script page 1 visually checked; all 70 written and 37 listening answers match `src/data/jlpt-mock/n1-2014-07-official.ts`.
- Listening counts: 6 + 7 + 6 + 14 + 4 = 37. Problem 5 item 3 has two responses (4, 1); expected 36 unique segments. Do not copy the 2013 exam's 36-response / 35-segment counts.
- Status: source_inventory_verified; not structured-ready or registered.
- Written, listening transcription and audio alignment: pending. Next: question page 2, questions 1-17.
- Explanation transcription/translation: pending, outside the inventory unit. Use only approved repository sources. Translate in Codex with `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`; never use public translation services or runtime translation APIs/dependencies.
- All nine startup validators passed. UI lock 10/10, catalog 50 = 4 structured official + 41 pending + 5 mocks.

## Durable checkpoint

- Starting HEAD: `ab7c7d4692dc9479334688287b9a0f5ec83b8225`, exact remote HEAD verified on origin/recovery/n1-2013-12 with clean working tree. Commit/push access established in preceding units.

## Backup

.jlpt-backups/n1-2014-07-inventory-20260917-065926/ (files list and SHA-256 before/after).
