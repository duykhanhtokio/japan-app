# N1 2014-12 conversion checkpoint

```text
EXAM ID: n1-2014-12-exam-06
CATALOG STATUS: scanned_only; not registered as a structured runtime exam
WORK STATUS: source inventory verified; conversion not started
```

## Verified source inventory — 2026-09-19

- Question pages: 15 JPEG files, `assets/jlpt/n1/2014-12/question/page-01.jpg` through `page-15.jpg`.
- Answer/script pages: 13 JPEG files, `assets/jlpt/n1/2014-12/answer-script/page-01.jpg` through `page-13.jpg`.
- Audio: `assets/jlpt/n1/2014-12/audio/n1-2014-12.mp3`, SHA-256 `67b7c3ec66872fea9eee3dce0d5addc3edd1d18c3cb281dbee125f8cebec4671`, matching `src/data/jlpt-mock/n1-2014-12-official.ts`.
- Source declaration records 70 written key entries and 37 listening key entries; 問題5 item 3 has two scored responses (`4`, `1`).
- Declared source PDF hashes: question `2c3629a05eedc5afa94c83f65e0aa8e362177140eca077569c2cb815cb01af53`; answer/script `a7ab7cfdf121882f67eddad7c81e178c77fc66271c4384fe7ef636f53421f581`.
- Image hashes are recorded in `.jlpt-backups/n1-2014-12-inventory-20260919-232000/SOURCE-IMAGES-SHA256.txt`; this local backup is rollback evidence only, not durable storage.

## Rules for this exam

- Preserve the approved JLPT UI lock; do not alter UI/session files or register the exam until source transcription, validation, and required review gates support integration.
- Treat OCR/ASR only as navigation aids. Visually verify all Japanese text, options, keys, transcripts, and audio boundaries against the repository source images/audio.
- Keep printed anomalies verbatim with source notes. Do not use public translation services. Any later AI translations must use `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`.

## Next action

Inventory commit `8c77e541aa5e9b3cd03de429e0078b96e5ac52c0` was pushed, fetched and exact-HEAD verified by `check-work-persistence.mjs`, clean working tree.

Next: visually inspect answer/script page 1, verify the 70 written and 37 listening answer-key inventory against `n1-2014-12-official.ts`, then record the completed key-verification unit with validation, narrow commit, push/fetch, and `WORK PERSISTENCE PASS` before transcribing page 2.

## Answer-key verification — 2026-09-19

- Answer/script page 1 was inspected directly against the declared source key. All 70 written answers match continuously: 問題1–7 (1–45), 問題8–13 (46–70).
- All 37 listening answers match continuously: 問題1=6, 問題2=7, 問題3=6, 問題4=14, 問題5=4. 問題5’s four printed keys are `2, 4, 4, 1`; the two final values remain separate scored responses as declared.
- No answer-key correction was inferred or made. Commit `9775374d889b248002cc10f1c19cb96723a37c4d` was pushed, fetched and exact-HEAD verified by `check-work-persistence.mjs`, clean working tree. Next: transcribe question page 2.

## Written question page 2 transcription — 2026-09-19

- Transcribed the 17 complete questions from `question/page-02.jpg` to `written-page-02.review.json`.
- Preserved the source-page boundary: question 18 starts on page 2 and remains deferred to page 3, where its stem and choices are complete.
- Visually checked answers 1–17 against the verified official key: `3,4,2,3,1,4,4,2,4,2,1,1,3,3,2,4,1`.
- Page image SHA-256: `4095502aea98dddca9dde4254198d7fcd69a7f5015267e2c333899765f594a3c`.
- Backup before editing: `.jlpt-backups/n1-2014-12-written-page-02-20260919-234500/`.

Next: validate and durably persist page 2, then transcribe question page 3.

## Page 2 durability record — 2026-09-19

- Source transcription commit `0922dbd803bf75c6d4567639e04f6c61b259025a` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 3.

## Written question page 3 transcription — 2026-09-19

- Transcribed questions 18–27 from `question/page-03.jpg` to `written-page-03.review.json`.
- The page-boundary continuation of question 18 is explicitly noted; its source-page attribution follows the page containing its choices.
- Visually checked answers 18–27 against the verified official key: `4,2,2,3,1,2,1,4,4,3`.
- Page image SHA-256: `9f73c9f6ceefb1b715ee08298a0ee44d7d0019a71d318b57aa0ebf86e4ace56d`.
- Backup before editing: `.jlpt-backups/n1-2014-12-written-page-03-20260919-235000/`.

Next: validate and durably persist page 3, then transcribe question page 4.

## Page 3 durability record — 2026-09-19

- Source transcription commit `5820c75a6a5698e71173d8ba93cabed3e05ead61` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 4.

## Written question page 4 transcription — 2026-09-20

- Transcribed the 12 complete questions (28–39) from `question/page-04.jpg` to `written-page-04.review.json`.
- Question 40 begins on this page and remains deferred to page 5, where its complete sentence and choices appear.
- Visually checked answers 28–39 against the verified official key: `2,1,3,3,2,1,4,3,4,1,2,3`.
- Page image SHA-256: `abf5d898b1515879cd8f6d9bb009dc84322a659ee73d0336a6ae47da5593c35c`.
- Backup before editing: `.jlpt-backups/n1-2014-12-written-page-04-20260920-000500/`.

Next: validate and durably persist page 4, then transcribe question page 5.
