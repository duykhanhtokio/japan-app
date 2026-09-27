# N4 2018-07 source identity checkpoint

```text
BASE HEAD: f49736b509ad8869bc3b0539498734dedcb2b569
TARGET EXAM ID: n4-2018-07-exam-07
STATUS: incomplete; supplied package is not verified as the July 2018 exam
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2018/N4-2018年.pdf`
- PDF SHA-256: `694022621a697f32633c30d69680a00167607984af7f975c47e2e661b8426fc4`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2018/Nghe N4-2018年.m4a`
- Audio SHA-256: `ba81cfbc6265384a0f8992367efbfaa4175bff17c965610bf1671ffc0dd9bed5`
- Audio duration: `2302.432993` seconds = `2,302,432.993` milliseconds.

## Identity finding

- All 23 PDF pages were directly inspected. The cover prints only `N4`; it does not print a month or year.
- The PDF and audio filenames identify only 2018. Only the containing folder supplies `7-2018`.
- PDF metadata reports a 2021 Ricoh scan and a 2022 modification, so it provides no exam-period evidence.
- The written passages (including `黒い消しゴム`), listening illustrations, question sequence, and transcripts match the JLPT official `sample2018` N4 practice workbook published at `https://www.jlpt.jp/samples/sample2018/pdf/N4R.pdf` and `https://www.jlpt.jp/samples/sample2018/pdf/N4L.pdf`.
- The user confirmed this package should be treated as Official Practice Workbook 2018, not asserted to be the July 2018 examination.

## New URL audit (2026-09-27)

- Audited `https://www.jlptzhen.com/精品真题-n4真题在线做2018年07月日本语能力试验/` across all 98 numbered positions: 70 written and 28 listening, in the workbook's 15 expected problem groups.
- The page title claims July 2018, but its first written item, all 98 embedded answer flags, written structure, listening sequence, illustrations, Japanese transcripts, and audio identify it as the N4 Official Practice Workbook Vol. 2 material published in 2018.
- All 98 page answers match the official workbook answer PDF. Two independent July 2018 answer tables instead give vocabulary position 1 as option 4, while the page/workbook give option 3; the cleaner independent July table differs from the workbook at 30 of 35 vocabulary positions.
- Downloaded and decoded all 28 page audio tracks. Every track occurs in the matching official workbook audio in order; envelope correlation is at least `0.935723`. The page tracks total `1569.776284` seconds, and `1569.776284 × 1000 = 1569776.284` milliseconds exactly.
- Compared all 28 Japanese transcript blocks with the official workbook script. They follow the same dialogues and responses. Position 89 has a concrete source transcription discrepancy: choice 1 uses `が` where the official script uses `を`; the official script remains authoritative. Chinese translations and explanations were not copied.
- Visually checked all supplied images against the official workbook PDFs. The page omits the required listening illustrations at positions 73 (problem 1 question 3) and 78 (problem 1 question 8); the official workbook PDF contains them. This omission is recorded rather than filled from the mislabeled page.
- Detailed hashes, per-part provenance, counts, independent identity evidence, and runtime decision are recorded in `SOURCE_URL_AUDIT.json`.

## Audited source contents

- The practice package contains 70 written responses, 28 listening responses, an answer key on page 14, Chinese explanations/translations on pages 15–19, and Japanese listening transcripts on pages 20–23.
- These contents belong to the identified practice workbook and are not promoted into `n4-2018-07-exam-07`.
- No runtime audio or structured exam data was created from the mismatched package. No timing was generated.
- No full PDF page is used as a runtime question and no UI-lock file is changed.

## Remaining blocker

The actual N4 July 2018 question content, audio, and complete image set have not been supplied or independently identified. The newly supplied URL is a second copy of the workbook, not the target administration. The catalog entry remains `incomplete` and is not `structured_ready`; no timing was generated and the exam was not registered in the runner.

## Validation evidence

- Source audit: PASS; the supplied files are classified as Official Practice Workbook 2018 and no runtime data, audio, or timing was created for the target exam.
- Catalog completeness: PASS; exactly 59 entries, including the exact nine expected N4 periods.
- Truthful inventory/integration: PASS; 45 structured official exams, 5 ready mocks, 7 incomplete sources, and 2 scanned-only sources. `n4-2018-07` is `incomplete` with `audio: false`.
- Structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 integration checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files.
- `git diff --check`: PASS.
- TypeScript integration check still reports only the pre-existing out-of-scope N2/N3 adapter failures: missing `./n1-2012-12-trial` and `TrialQuestion` not exported by `n1-2013-07-trial.ts`. No N4 failure was introduced.
