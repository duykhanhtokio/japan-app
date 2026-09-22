# N4 2014-07 conversion checkpoint

```text
BASE HEAD: 14d51d701f4cc1a18f05516d9020180102711b6e
EXAM ID: n4-2014-07-exam-05
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2014/N4-2014年7月.pdf`
- PDF SHA-256: `741b3972e89f790ec41611c917394edc49447788e3c6b417fc56bb54af33438c`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2014/Nghe N4-2014年7月.m4a`
- Audio SHA-256: `80ce92d3503b10457843aa15de0c02a343ab67e8a94460c8109f5c121cf0af9c`
- Source duration: `2298.906009` seconds = `2,298,906.009` milliseconds; rounded runtime ceiling `2,298,906 ms`.

The cover explicitly prints `2014年7月 日本語能力試験 N4`; the folder, PDF filename, and audio filename agree. PDF creation metadata is from a later 2022 Foxit production step and is not used as exam-date evidence.

No byte-locked UI file is in scope. The exam remains incomplete unless every structured-readiness requirement is verified.

## Completed source audit

- Directly audited all 70 written response positions on PDF pages 3–11 and all 28 listening response positions on pages 12–14. Page 15 supplies the exact answer key; pages 16–20 supply Chinese explanations/translations; pages 21–24 supply the Japanese transcript.
- `written.audit.json` and `listening.audit.json` preserve each response's question, answer, explanation/translation or transcript page provenance. Character-by-character runtime transcription remains unfinished, so source text is not promoted to a structured-ready exam.
- Source audio was transcoded without modifying the source. Runtime MP3 SHA-256: `74110b6e7eb9d66ee73c7d4e20b56e3137d17f21570391a00ffdeaf5284dbafb`; measured duration `2,298.906009` seconds.
- Candidate boundaries for all 28 listening responses were derived with local Whisper `small` word timestamps, question/section markers, and PDF transcript cross-reference. They remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- No full PDF page is used as a runtime question and no UI-lock file is changed.

## Remaining blockers

- The source supplies no authoritative per-question timing and the candidate boundaries have no perceptual human approval.
- Written questions/options, explanations/translations, and transcript have not completed character-by-character runtime verification.

The package therefore remains `incomplete` and is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 70 written records, 28 listening records, 98 unique expected audit IDs, exact answer mappings, and 28 exact ordered in-range timing candidates.
- Catalog completeness: PASS at exactly 59 entries. Inventory integration: PASS with 45 structured official, 9 visible pending N4 packages, and 5 mocks; N4 2014-07 is one of five audited `incomplete` packages.
- Structured-exam, no-scanned-runtime, navigation-contract, protected N1 12/2012, and N1 07/2013 regressions: PASS.
- JLPT Approved UI Lock: PASS 10/10; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript was run and retains only the pre-existing unchanged N2/N3 trial-adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. These files are outside this N4 scope and were not modified.
