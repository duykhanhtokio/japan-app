# N4 2017-07 conversion checkpoint

```text
BASE HEAD: 52d135aef6d489a967d1419e89cbeba6f3530396
EXAM ID: n4-2017-07-exam-06
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2017/N4-2017年-7月.pdf`
- PDF SHA-256: `45cc992d3653474a7f940dbd68b6092a13f840c987edd5542299b48c958fee9f`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2017/Nghe N4 2017年7月.mp3`
- Audio SHA-256: `2de3b7a0f65888ff77c4ac8b4f08e4956359f5b996fb9cc471b2e2627b06dbf5`
- Source duration: `2192.508000` seconds = `2,192,508.000` milliseconds; runtime ceiling `2,192,508 ms`.

The cover explicitly prints `2017年7月` and `N4`; the folder, PDF filename, and audio filename agree. PDF metadata identifies a 2012 InDesign/Distiller production date, which conflicts with the printed exam date and is treated only as stale packaging metadata, not exam-identity evidence.

No byte-locked UI file is in scope. The exam remains incomplete unless every structured-readiness requirement is verified.

## Completed source audit

- All 54 PDF pages were directly inspected.
- The source contains 69 written response positions (34 vocabulary and 35 grammar/reading), 28 listening response positions, an exact answer key on pages 43–44, and Japanese listening transcripts on pages 45–54.
- No written explanations or translations are present in the supplied PDF.
- `written.audit.json` and `listening.audit.json` preserve every response's question, answer, and transcript provenance. Character-by-character runtime transcription remains unfinished.
- The audio introduction identifies N4 but does not state a period. Its complete question order/content was cross-checked against the PDF question sheets, answer key, and transcript.
- Source audio was transcoded without modifying the source. Runtime MP3 SHA-256: `8f5d6084e5d79dcd628f545866abd0bc3608530bf9124b66cec417f0aa0ca38f`; measured duration `2,192.496979` seconds.
- Candidate boundaries for all 28 listening responses were derived with local Whisper `small` word timestamps, question/section markers, and PDF transcript cross-reference. They remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- No full PDF page is used as a runtime question and no UI-lock file is changed.

## Remaining blockers

- The supplied source contains no written explanations or translations.
- The source supplies no authoritative per-question timing and the candidate boundaries have no perceptual human approval.
- Written questions/options and transcript have not completed character-by-character runtime verification.

The package therefore remains `incomplete` and is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 69 written records, 28 listening records, 97 unique expected audit IDs, exact answer mappings, explicit source-absence flags for explanations/translations, and 28 exact ordered in-range timing candidates.
- Catalog completeness: PASS at exactly 59 entries. Inventory integration: PASS with 45 structured official, 9 visible pending N4 packages, and 5 mocks; N4 2017-07 is one of six audited `incomplete` packages.
- Structured-exam, no-scanned-runtime, navigation-contract, protected N1 12/2012, and N1 07/2013 regressions: PASS.
- JLPT Approved UI Lock: PASS 10/10; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript was run and retains only the pre-existing unchanged N2/N3 trial-adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. These files are outside this N4 scope and were not modified.
