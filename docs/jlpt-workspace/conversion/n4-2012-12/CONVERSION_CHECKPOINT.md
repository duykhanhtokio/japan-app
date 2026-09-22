# N4 2012-12 conversion checkpoint

```text
BASE HEAD: b15afdee2eef2af2751d281ec3032913bf8ced0d
EXAM ID: n4-2012-12-exam-02
STATUS: incomplete; catalog remains pending and is not structured_ready
DATE: 2026-09-22 (Asia/Tokyo)
```

## Direct source audit

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2012/N4-2012年12月.pdf`
- PDF SHA-256: `6e15a1e181540bb0d79d1e72a0eb2458e7aec47d9482a2f4364c7d5792153a19`
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N4/N4 12-2012/Nghe N4-2012年12月.m4a`
- Audio SHA-256: `bea051f318f4cf532138a152bac32707b9c9e4298342545da80f9437a3d53d68`
- Source duration: `2156.137007` seconds = `2,156,137.007` milliseconds; rounded runtime limit `2,156,137 ms`.
- Package: 24 pages with an explicit `2012年12月` cover; 70 written responses; 28 listening responses; answer key on page 15; Chinese explanations/translations on pages 16–21; Japanese listening transcript on pages 22–24.

## Completed work and blockers

- Directly inspected the question, answer, explanation, and transcript sections; no PDF page is used as a runtime question.
- Transcoded the source audio to the exam-scoped runtime MP3. Runtime SHA-256 is `49fafabb8243f21faf5fb4739f759c00ce8d3fe667e1bfeec97ddc03154a0278`; measured duration is `2156.136984` seconds.
- The source contains no authoritative/perceptually approved per-question timing. Character-by-character runtime transcription and source verification are also unfinished. The exam therefore remains `incomplete` and absent from the structured registry.
- Any later derived timing must remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review` until reviewed.

## Validation evidence

- Per-exam audit, catalog, inventory integration, UI Lock, TypeScript, Git, and persistence evidence are recorded by the completing commit workflow. TypeScript retains the same pre-existing unchanged N2/N3 adapter failures documented by the preceding checkpoints.
