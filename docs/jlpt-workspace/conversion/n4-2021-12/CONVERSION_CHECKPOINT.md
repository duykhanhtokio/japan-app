# N4 2021-12 conversion checkpoint

```text
BASE HEAD: 01e0333c9016f72b977554b366f33971f7f7f2e2
EXAM ID: n4-2021-12-exam-09
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2021/Đề N4 T12-2021 Mark.pdf`
- PDF SHA-256: `2224d3381bfdd399721ae646cb862f8f1ddf56212304772de53afcdf923a24e5`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2021/Nghe N4 T12-2021 bản chuẩn Yuuki Bùi.mp3`
- Audio SHA-256: `ee1d6e27c114736c2d2d66c87f3d4889b281d10c3d9978b2fc78366edc4365a6`
- Source duration: `2327.196625` seconds = `2,327,196.625` milliseconds; ceiling `2,327,197 ms`.

PDF page 1 explicitly prints `2021年12月・日本語能力試験・N4`; the folder and filenames agree. PDF metadata records a later June 2022 image-conversion operation and is treated as packaging metadata only.

## Completed source audit

- All 20 PDF pages were directly inspected.
- The expected written structure is 28 vocabulary plus 29 grammar/reading response IDs. Only 56 of those 57 written response positions are present: the vocabulary sequence jumps from overall question 11 directly to 13, so overall question 12 is explicitly recorded as `source_missing`.
- Pages 13–20 contain all 28 listening response positions in `8 + 7 + 5 + 8` order.
- The source contains no answer key, written explanations, translations, or Japanese listening transcript. No correct answer was inferred.
- `written.audit.json` and `listening.audit.json` preserve 85 expected unique IDs: 84 observed question positions plus the one missing written source position. Every answer field is `null` with `answerAudit: source_absent`.
- The full audio was processed locally to confirm the four listening sections and response order. It does not independently state a trustworthy period.
- Runtime MP3 SHA-256: `4f51258f5a87596d53847e5a983f9c7a016860eb8acbf603d7aa10144f4d6009`; measured duration `2327.196735` seconds = `2,327,196.735` milliseconds; ceiling `2,327,197 ms`.
- Candidate boundaries for all 28 listening responses were derived from local Whisper `small` word timestamps and independently recognized section/question markers. Every boundary remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- Whisper output is a navigation aid only. It is not recorded as a verified transcript.
- No full PDF page is used as a runtime question and no UI-lock file is changed.

## Remaining blockers

- Vocabulary overall question 12 is absent from the supplied PDF.
- No written or listening answer key is present.
- No written explanations, translations, or Japanese listening transcript are present.
- The source supplies no authoritative per-question timing, and the candidate boundaries have no perceptual human approval.
- Written questions/options and listening content have not completed character-by-character runtime transcription and verification.

The package therefore remains `incomplete` and is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 85 expected unique IDs, 84 observed source positions, the exact missing `vocabulary-p2-q5` source record, all-null/source-absent answer fields, and 28 ordered in-range timing candidates.
- Catalog completeness: PASS at exactly 59 entries. Inventory integration: PASS with 45 structured official exams, all 9 N4 packages incomplete, 0 scanned-only packages, and 5 ready mocks.
- N4 2018 identity-mismatch and N4 07/2021 regressions, structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript was run and retains only the pre-existing unchanged N2/N3 trial-adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. These files are outside this N4 scope and were not modified.
