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

## Page 4 durability record — 2026-09-20

- Source transcription commit `fbf9207430721a343ab54fbdcd77fe93adc31493` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 5.

## Written question page 5 transcription — 2026-09-20

- Transcribed the complete sentence-composition question 40 and grammar-text questions 41–45 to `written-page-05.review.json`.
- Question 40 preserves its page 4–5 source boundary; the first reading passage is retained verbatim once with question 41.
- Visually checked answers 40–45 against the verified official key: `2,3,1,2,3,2`.
- Page image SHA-256: `995f6287570f37d0944e4a058f1b4043a903a6f6ba0244e231f6bb9ce4d3564d`.
- Backup before editing: `.jlpt-backups/n1-2014-12-written-page-05-20260920-001500/`.

Next: validate and durably persist page 5, then transcribe question page 6.

## Page 5 durability record — 2026-09-20

- Source transcription commit `5e879f334d89784a12736225cb5bc20e432dd385` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 6.

## Written question page 6 transcription — 2026-09-20

- Transcribed complete reading-comprehension questions 46–48 from `question/page-06.jpg`; question 46 retains its page 5–6 passage boundary.
- Question 49 begins on this page and remains deferred to page 7.
- Visually checked answers 46–48 against the verified official key: `1,2,2`.
- Page image SHA-256: `3c5cceb05203cfeb1f19119f506935fc05ec8a08f70c407f2d8f821735fd2699`.

Next: validate and durably persist page 6, then transcribe question page 7.

## Page 6 durability record — 2026-09-20

- Source transcription commit `7f9ca2fd7c58f83ae203a193286fcfb2f10023b6` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 7.

## Written question page 7 transcription — 2026-09-20

- Transcribed complete questions 49–52 from `question/page-07.jpg`; question 53 remains deferred to page 8.
- Visually checked official answers: `4,2,1,2`.
- Page image SHA-256: `a96f5930a550ff660f6b6422cf6a9d25ce38ddd6f3619d620c2d0c4b10f20af5`.

Next: validate and durably persist page 7, then transcribe question page 8.

## Page 7 durability record — 2026-09-20

- Source transcription commit `cac0846834172821669520c571829dbd47884fe5` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 8.

## Written question page 8 transcription — 2026-09-20

- Transcribed complete questions 53–55 from `question/page-08.jpg`; the next passage continues to page 9.
- Visually checked official answers: `2,3,1`.

Next: validate and durably persist page 8, then transcribe question page 9.

## Page 8 durability record — 2026-09-20

- Source transcription commit `c42a9cf5907e2b723207eb7b62045183ebd51f58` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 9.

## Written question page 9 transcription — 2026-09-20

- Transcribed complete questions 56–59 from `question/page-09.jpg`.
- Visually checked official answers: `2,4,2,3`.

Next: validate and durably persist page 9, then transcribe question page 10.

## Page 9 durability record — 2026-09-20

- Source transcription commit `0ba2de6436a5bf7f23ddee5b8cb67b553c945f98` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 10.

## Written question page 10 transcription — 2026-09-20

- Transcribed complete questions 60–64 from `question/page-10.jpg`; question 65 remains deferred to page 11.
- Visually checked official answers: `2,4,2,4,3`.

Next: validate and durably persist page 10, then transcribe question page 11.

## Page 10 durability record — 2026-09-20

- Source transcription commit `47d797d843f0333588029bec1213bbbb6c15fed9` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 11.

## Written question page 11 transcription — 2026-09-20

- Transcribed complete questions 65–68 from `question/page-11.jpg`; schedule questions 69–70 continue to page 12.
- Visually checked official answers: `2,4,3,1`.

Next: validate and durably persist page 11, then transcribe question page 12.

## Page 11 durability record — 2026-09-20

- Source transcription commit `2618bcba1c0286b16f6e188634d489ae15f131a6` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 12.

## Written question page 12 transcription — 2026-09-20

- Transcribed complete schedule-reading questions 69–70 from `question/page-12.jpg`.
- Listening instructions/options begin on this page and are deferred to the listening-source workflow.
- Visually checked official answers: `1,1`.

Next: validate and durably persist page 12, then begin listening source transcription.

## Page 12 durability record — 2026-09-20

- Source transcription commit `bc1ecc747c245061f71d40fc1c5778d397ddbaf0` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: begin listening source transcription from question page 12.

## Listening question page 12 transcription — 2026-09-20

- Transcribed printed answer choices for listening 問題1 questions 1–3 into `listening-page-12.review.json`.
- Audio transcript and segment boundaries remain a separate, later source-verification unit; no transcript was inferred.
- Visually checked official answers: `2,1,2`.
- Page image SHA-256: `a0a74c67e9bd19a2fc35309b16e55d0f0a989a2c3d7fc0411f826c9b65f3e501`.

Next: validate and durably persist listening page 12 choices, then transcribe remaining listening choices on page 13.

## Listening page 12 durability record — 2026-09-20

- Source-choice transcription commit `5357ec07298e3ee8125a912f26074a0311344a02` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe remaining listening choices on question page 13.

## Listening page 13 durability record — 2026-09-20

- Source-choice transcription commit `5f65c1c48a63c50d641853e9a4781c5f75865201` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe listening source from question page 14.

## Listening question page 14 transcription — 2026-09-20

- Transcribed the printed 問題5 question 3 choices as two distinct scored responses, 36 and 37.
- Preserved the official split keys: `4,1`; no transcript or audio boundary was inferred.
- The Chinese mini-program advertisement at the bottom is non-exam source material and was excluded.

Next: validate and durably persist listening page 14 choices, then start answer/script source transcription.

## Listening page 14 durability record — 2026-09-20

- Source-choice transcription commit `de5b4c34efbd61fa1cebf036b0226097f79af654` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: start answer/script source transcription from page 2.

## Answer/script source page 2 transcription — 2026-09-20

- Transcribed source explanations for questions 1–13 into `explanations/source-page-02.json`.
- Source image SHA-256: `614ae5fbd99db2baf0b7f0e9a98465cbd220bab900d095855178c79ae25b2b96`.
- No translation records were created.

Next: validate and durably persist answer/script page 2, then transcribe page 3.

## Answer/script page 2 durability record — 2026-09-20

- Source-explanation transcription commit `5a34274df40fc3386047db01cf63516c273d2172` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe answer/script page 3.

## Answer/script source page 3 transcription — 2026-09-20

- Transcribed source explanations for questions 14–24 into `explanations/source-page-03.json`.
- Source image SHA-256: `e94f4cb942c9666e2623c328c1589e997a6f09b1e03990645483584be769e587`.
- No translation records were created.

Next: validate and durably persist answer/script page 3, then transcribe page 4.

## Answer/script page 3 durability record — 2026-09-20

- Source-explanation transcription commit `50155cf0d6652161bf959c4fe14473af7e8e9f27` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe answer/script page 4.

## Answer/script source page 4 transcription — 2026-09-20

- Transcribed source explanations for questions 25–33 into `explanations/source-page-04.json`.
- Source image SHA-256: `3db6b1786a984a82020b5f9bce4cb0e18985aa7c89229c76fc6e9430582639b1`.
- No translation records were created.

Next: validate and durably persist answer/script page 4, then transcribe page 5.

## Answer/script page 4 durability record — 2026-09-20

- Source-explanation transcription commit `cb97b224897202943e652a6a9773e2a9e3e37675` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe answer/script page 5.

## Answer/script source page 5 transcription — 2026-09-20

- Transcribed source explanations for questions 34–45 into `explanations/source-page-05.json`.
- Source image SHA-256: `e373461680d2a5f8f6b13f09bb1fd6247fb55e578d5cd3cde88951399f4f8808`.
- No translation records were created.

Next: validate and durably persist answer/script page 5, then transcribe page 6.

## Answer/script page 5 durability record — 2026-09-20

- Source-explanation transcription commit `18fdf93bb216d92e7ee7173d9d797596e5367020` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe answer/script page 6.

## Answer/script source page 6 transcription — 2026-09-20

- Transcribed source explanations for questions 46–60 into `explanations/source-page-06.json`.
- Source image SHA-256: `b1b2a39fca12395a21d55d9f8e26ef3c54e2b90faa8163904707f81570770510`.
- No translation records were created.

Next: validate and durably persist answer/script page 6, then transcribe page 7.

## Page 6 answer-key correction — 2026-09-20

- Rechecked `N1_2014_12_WRITTEN_KEY` directly after detecting an indexing error in the prior validation helper. Questions 46–48 are `3,4,1`, not `1,2,2`.
- Corrected source review commit `8da205585cb29d5f6c700610009d78caf7f7b34c` was pushed to `origin/recovery/n1-2013-12`, fetched, and exact-HEAD verified with `check-work-persistence.mjs` (`WORK PERSISTENCE PASS`).

Next: transcribe question page 7.
