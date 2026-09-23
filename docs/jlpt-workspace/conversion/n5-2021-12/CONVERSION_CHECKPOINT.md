# N5 December 2021 source audit checkpoint

```text
BASE HEAD: 075356ef64e9c2595bfc0a71fcac68354135271b
CATALOG TARGET: n5-2021-12
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2021-12-exam-07
STATUS: incomplete; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources and identity

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2021/Đề N5 T12-2021 Mark.pdf`; SHA-256 `284c73e4cf4b55f6bd1f6b2d1fb7579beb5cf1002fe36d28ed1e242d48669a67`; 17 pages.
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2021/Nghe N5 T12-2021 bản chuẩn Yuuki Bùi.mp3`; SHA-256 `f33f2ef39098d309e5f0373e25af376afb204fd9c166ace64b5e58d21dd28020`; `1747.200000` seconds = `1,747,200.000 ms`.

Every PDF page explicitly prints `2021年12月・日本語能力試験・N5`. The audio introduction identifies the 2021 second administration and N5 listening; its question order and recognized content align with the supplied sheets. Identity confidence is strong.

## Completed source audit

- All 17 PDF pages were directly inspected.
- Exactly 43 written IDs in the supplied post-format-change paper: 21 vocabulary and 22 grammar/reading. Exactly 24 listening IDs in `7 + 6 + 5 + 6` order; total 67.
- The package supplies all written question sheets and the listening visuals needed for problems 1–3. Listening problem 4 is audio-only by design.
- No answer key, written explanation/translation, or Japanese listening transcript is supplied. No answer is inferred from question or audio content.
- Runtime MP3: `assets/jlpt/n5/2021-12/audio/n5-2021-12.mp3`; SHA-256 `1fe7d00c92ff084474d4aefe405fc027d612db23b52a39c2ca19bcbf3d6a7637`; `1747.200000` seconds = `1,747,200.000 ms`; ceiling `1,747,200 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `a28db0803899c3c189f53919e2542d14af8c1293e0df3d217a8e4ca23deadcd0`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- Recognized audio content aligns with all 24 supplied listening questions, but automated recognition is not claimed as a source transcript.
- All 24 derived ranges remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`; every seconds-to-milliseconds conversion is asserted.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- Answers are absent for all 67 responses.
- Written explanations/translations, app-locale translations, and Japanese transcript are absent.
- Written questions/options are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries require human listening/perceptual review.

The catalog target remains `incomplete`; it is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration must validate 43 written records, 24 listening records, 67 unique IDs, exact absence of answers/explanations/transcript, runtime audio hash, strong identity evidence, and 24 ordered candidate timings.
- Catalog completeness and truthful inventory must remain exact at 66 entries.
- Structured-exam, no-scanned-runtime, navigation-contract, protected N1 12/2012, and JLPT Approved UI Lock checks must pass.
- TypeScript diagnostics must be separated into pre-existing N2/N3 adapter failures versus any N5 diagnostic.

## Independent candidate validation and human review packet

```text
VALIDATION BASE HEAD: 3c5c46542f9df22664d40c3d03953bc7842fc2c7
MACHINE CROSS-CHECKED: true
HUMAN REVIEWED: false
PERCEPTUAL APPROVAL: false
TIMING VERIFICATION STATUS: candidate_unverified
STATUS: incomplete; not structured_ready
```

- Direct source-page review produced 43 written validation records. Candidate and independently re-derived answers agree 43/43; the candidate key had already been seen during source recovery, so this is explicitly not claimed as blind validation.
- Decoded-audio, recovered-transcript, and local Whisper `small` evidence produced 24 listening validation records. Candidate and machine-derived answers agree 24/24; 23 transcript comparisons are `audio_supported_candidate` and `listening-p1-q2` is `minor_uncertainty`.
- All 24 candidate timing ranges contain detected speech and remain ordered/non-overlapping; no adjustment is proposed. This is machine evidence only: every timing remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- The human review checklist contains exactly 67 unchecked items: 43 written and 24 listening.
- The packet is under `review/`. It applies no candidate answer, transcript, or timing to runtime data.
- No external page sharing the Yuuki Bùi provenance was counted as an independent source. The recovered key remains non-official under the JLPT publication policy.
- The exam remains `incomplete`; candidate validation does not satisfy the human review, official transcript, explanation/translation, or structured-runtime requirements.

### Candidate-validation gate evidence

- Catalog completeness: PASS, exactly 66 entries.
- Truthful inventory: PASS, including 7 exact N5 candidate periods.
- N5 12/2021 integration: PASS with the official audit still truthfully recording absent answers, explanations, and source transcript; the review packet is non-runtime evidence only.
- Navigation contract and no-scanned-runtime: PASS.
- JLPT Approved UI Lock: PASS 10/10.
- TypeScript: the repository-wide command still exits 2 only for the pre-existing N2/N3 adapter diagnostics (`n2-2012-12-trial.ts` missing `./n1-2012-12-trial`, plus N2/N3 imports of non-exported `TrialQuestion`); no N5 diagnostic was emitted and no out-of-scope adapter was changed.
