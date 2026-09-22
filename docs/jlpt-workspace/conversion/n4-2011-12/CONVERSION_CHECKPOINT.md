# N4 2011-12 conversion checkpoint

```text
BASE HEAD: fa2897c500aecf0e94b16f8d26077f9fc4717596
EXAM ID: n4-2011-12-exam-01
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-22 (Asia/Tokyo)
```

## Direct source inventory

- Question/answer/explanation/transcript PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2011/N4-2010-2011年.pdf`
- PDF SHA-256: `877317c38a13548e310f941d11274a789c47ba10cbff69ea374bc05b07f91526`
- Source audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2011/Nghe N4-2010-2011年.m4a`
- Audio SHA-256: `cbdb8251c13c5260fddc136e99b7206759aa43dec90a2f6401d69ea663beebfa`
- Measured duration: `2154.188005` seconds = `2,154,188.005` milliseconds; integer runtime ceiling is `2,154,188 ms` after explicit rounding.
- PDF pages: 23. Pages 2–9 contain 70 written response units; pages 10–12 contain 27 listening response units; page 13 contains the written/listening answer keys; pages 14–19 contain Chinese explanations/translations; pages 20–23 contain the Japanese listening transcript.

The package title says `2010-2011年`; the enclosing source folder identifies it as `N4 12-2011`. This provenance distinction must remain recorded and must not be silently rewritten.

## Readiness policy

This exam must remain pending and must not be marked `structured_ready` until all 70 written and 27 listening responses, answer mappings, source explanations/translations, Japanese transcript, runtime audio, and audio timing have passed the per-exam validator. Automatically derived timing remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review` until a later perceptual review.

## Planned exam-scoped files

- `src/data/jlpt-official/n4-2011-12/exam.candidate.json`
- `src/data/jlpt-official/n4-2011-12-trial.ts`
- `src/data/jlpt-mock/n4-2011-12-official.ts`
- `assets/jlpt/n4/2011-12/audio/n4-2011-12.mp3`
- question-specific visual assets only (no PDF-page runtime questions)
- `scripts/prepare-n4-2011-12.mjs`
- `scripts/build-n4-2011-12-structured.mjs`
- `scripts/check-n4-2011-12-integration.mjs`
- exam-scoped review/manifest files in this directory

No byte-locked UI file is in scope.

## Completed source-audit work

- Visually inspected the complete 23-page package and counted 70 written plus 27 listening responses.
- Confirmed the answer key, Chinese explanations/translations, Japanese listening transcript, and source audio are present.
- Transcoded a runtime MP3 without altering or copying the original M4A; measured runtime duration is `2154.187755` seconds.
- Extracted only question-specific listening illustrations; no PDF page is used as a runtime question.
- Ran local Whisper `small` with word timestamps as navigation evidence only. Its support JSON SHA-256 is `23fc761f9eee5f57f52d3b9be2681fd887f484ada8d1ccc1d7c9033d1e486dbd`; it is not authoritative transcript evidence.

## Local blockers

1. The PDF title identifies only `2010-2011年`; only the enclosing folder says `N4 12-2011`. An authoritative in-document period label is unavailable.
2. The source provides no authoritative or perceptually approved per-question timing. Derived timing is not sufficient for `structured_ready` under the user-approved gate.
3. The 70 written responses, source explanations/translations, and 27 source transcripts remain available but have not completed character-by-character runtime transcription and verification. No OCR/ASR output is promoted as source truth.

Therefore this exam remains `incomplete`; it is deliberately absent from the structured registry and cannot open the approved exam runner.

## Validation evidence

- Per-exam integration audit: PASS; the observed 70 written/27 listening counts, hashes, pending state, review flags, and blockers are enforced.
- Catalog completeness: PASS; exactly 59 entries and exactly nine authorized N4 periods.
- Catalog integration: PASS; 45 structured official, nine pending N4, five mocks.
- Approved UI Lock: PASS, 10/10 byte-locked files unchanged.
- TypeScript was run. It continues to report only the pre-existing unchanged N2/N3 adapter failures recorded in the catalog-expansion checkpoint; no N4 2011-12 or catalog file produced a TypeScript diagnostic.
