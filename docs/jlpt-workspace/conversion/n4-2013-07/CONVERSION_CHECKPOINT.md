# N4 2013-07 conversion checkpoint

```text
BASE HEAD: 0bf714b9f0fd63f54a7d13011869ae5be8f319c8
PROVISIONAL EXAM ID: n4-2013-07-exam-03
EXAM ID: n4-2013-07-exam-03
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-22 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2013/N4-2013年7月.pdf`
- PDF SHA-256: `070ed98c44f5e2db88885e681cd6879b6b61a430cd8b4fbd96bab76df8fc0d53`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 7-2013/Nghe N4-2013年7月.m4a`
- Audio SHA-256: `e7e022baa2fdb50820c15bca39bee099b9834bc0f4daa7b6aa92556f4834fb86`
- Source duration: `2316.957007` seconds = `2,316,957.007` milliseconds; rounded runtime ceiling `2,316,957 ms`.

The enclosing folder, PDF filename, and audio filename consistently identify July 2013, but the PDF cover itself does not print a date. PDF metadata identifies a RICOH scanner and 2021/2022 scan timestamps only. The audio introduction explicitly says `2013年第1回日本語能力試験 聴解N4`; in combination with the July filenames and the mutually consistent question, answer-key, transcript, and audio structure, this supports a high-confidence July 2013 identity. This confidence is not attributed to the cover.

## Completed source audit

- Directly audited all 70 written response positions on PDF pages 2–9 and all 28 listening response positions on pages 10–13. Page 14 supplies the answer key; pages 15–19 supply Chinese explanations/translations; pages 20–23 supply the Japanese transcript.
- `written.audit.json` and `listening.audit.json` preserve per-response question, answer, explanation/translation or transcript page provenance. The source text is not promoted to runtime structured question text because character-by-character verification is unfinished.
- The source audio was transcoded without changing the source file. Runtime MP3 SHA-256: `8690342076a249c4ea74e1de9f7e0730bf453339d2ec1043528ac7e5bd5c0e5f`; duration `2,316.956735` seconds.
- Candidate boundaries for all 28 listening responses were derived using local Whisper `small` word timestamps, question-number markers, section markers, and cross-reference to the source transcript. They are alignment evidence only: `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, `needs_later_review`.
- No full PDF page is used as a runtime question, and no UI-lock file is changed.

## Remaining blockers

- The source provides no authoritative per-question timing, and candidate boundaries have not received perceptual human approval.
- Written questions/options, explanations/translations, and the listening transcript have not completed character-by-character runtime transcription and verification.

The catalog therefore records this package as `incomplete`; it is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration audit: PASS for 70 written records, 28 listening records, exact answer mappings, and 28 ordered in-range candidate boundaries.
- Catalog validation: PASS at exactly 59 entries; inventory integration: PASS.
- JLPT Approved UI Lock: PASS 10/10; no locked file changed.
- TypeScript was run and retains only the pre-existing unchanged N2/N3 trial-adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. They are outside this N4 scope and were not modified.
