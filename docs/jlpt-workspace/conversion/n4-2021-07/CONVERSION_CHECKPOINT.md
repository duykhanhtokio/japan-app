# N4 2021-07 conversion checkpoint

```text
BASE HEAD: 344e533d7bff8922b3d32c68b5db96d9cdf3bf2c
EXAM ID: n4-2021-07-exam-08
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2021/N4-2021年7月.pdf`
- PDF SHA-256: `013be0c7c32574334a7da76236747466827e2e820e05956fccb429053009632b`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2021/Nghe N4 T7-2021.mp3`
- Audio SHA-256: `8f9c61b59b6e6dde9ad4bba9cb47acfb74400288159f76a3ccbd95128e9c4309`
- Source duration: `2376.019500` seconds = `2,376,019.500` milliseconds; ceiling `2,376,020 ms`.

The written and listening covers print `(2021-1)`, and the answer-key heading explicitly prints `2021年7月` and `N4`. The folder and filenames agree. PDF metadata records a later February 2022 print operation, and the audio album tag records `2021/6/24`; neither is used as independent exam-period evidence.

## Completed source audit

- All 31 PDF pages were directly inspected.
- Pages 1–17 contain 57 written response positions: 28 vocabulary and 29 grammar/reading. Pages 18–30 contain 28 listening response positions. Page 31 contains the exact answer key for all 85 responses.
- The source contains no written explanations, translations, or Japanese listening transcript.
- `written.audit.json` and `listening.audit.json` preserve exactly 85 unique response IDs, question-page provenance, page-31 answer provenance, and explicit source-absence flags.
- The full audio was processed locally to confirm the four listening sections and `8 + 7 + 5 + 8` response order. It does not print or announce a trustworthy period independently.
- Runtime MP3 SHA-256: `dda7130941a41e0a64456763d3e21cd035c49841b65b42499f3271f8942188eb`; measured duration `2376.019592` seconds = `2,376,019.592` milliseconds; ceiling `2,376,020 ms`.
- Candidate boundaries for all 28 listening responses were derived from local Whisper `small` word timestamps and independently recognized section/question markers. Because the source has no transcript and no official timing, every boundary remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- Whisper output is a navigation aid only. It is not recorded as a verified transcript.
- No full PDF page is used as a runtime question and no UI-lock file is changed.

## Remaining blockers

- The supplied source contains no written explanations or translations.
- The supplied source contains no Japanese listening transcript.
- The source supplies no authoritative per-question timing, and the candidate boundaries have no perceptual human approval.
- Written questions/options and listening content have not completed character-by-character runtime transcription and verification.

The package therefore remains `incomplete` and is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 57 written records, 28 listening records, 85 unique expected audit IDs, exact answer mappings, explicit absence flags, and 28 ordered in-range timing candidates.
- Catalog completeness: PASS at exactly 59 entries. Inventory integration: PASS with 45 structured official exams, 8 incomplete N4 packages, 1 scanned-only N4 package, and 5 ready mocks.
- N4 2018 identity-mismatch regression, structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript was run and retains only the pre-existing unchanged N2/N3 trial-adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. These files are outside this N4 scope and were not modified.
