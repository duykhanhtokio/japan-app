# N5 catalog target December 2020 source-mismatch audit checkpoint

```text
BASE HEAD: 3e6fefaeeb4c7f6160e788222386d9e220479919
CATALOG TARGET: n5-2020-12
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2020-12-exam-06
STATUS: incomplete; source mismatch; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources and identity

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2020/De thi N5.pdf`; SHA-256 `18a47a85016ad0ab09277f2140e20264f651a17f056bd9deafc9d3686633001e`; 32 pages.
- Audio: 35 MP3 files `BPT_N5_2_02.mp3` through `BPT_N5_2_36.mp3`; total `1789.998645` seconds = `1,789,998.645 ms`; ordered SHA-list digest `ca306855466ff7fd40e6d46a434087b592100dc6e793f296edb1dcf53e11ab9e`.

The listening cover and page footers explicitly identify `ベスト模試 N5 第2回`. This is a practice test, not evidence of the official December 2020 administration. The November 2020 PDF creation timestamp and source folder name are not treated as exam identity evidence.

## Completed source audit

- All 32 PDF pages were directly inspected.
- Exactly 67 written IDs: 35 vocabulary and 32 grammar/reading. Exactly 24 listening IDs in `7 + 6 + 5 + 6` order; total 91.
- The PDF supplies all written question sheets and the listening visuals needed for problems 1–3. Listening problem 4 is audio-only by design.
- The package supplies no answer key, written explanations/translations, or Japanese listening transcript. No correct answer is inferred from question content.
- All 35 audio files were inventoried. Their embedded titles explicitly map guidance, examples, the 24 question tracks `Q1_1` through `Q4_6`, the break, and ending. Recognized audio content aligns with the supplied listening visuals, but automated recognition is not claimed as a source transcript.
- Runtime MP3: `assets/jlpt/n5/2020-12/audio/n5-2020-12.mp3`; SHA-256 `8e6f1d344c81632cba2ddc12c94aa5ecbdbdff747bb73daed0ca4bcc5d88f83e`; `1789.998707` seconds = `1,789,998.707 ms`; ceiling `1,789,999 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `8ec391fda0a0227daa149227f6d6c308e29b0207cf762c5f8a669691025dbebb`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- All 24 boundaries derive mechanically from supplied question-track metadata and accumulated file durations. They remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`; every seconds-to-milliseconds conversion is asserted.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- The source is explicitly a practice test and does not match the official December 2020 catalog identity.
- Answers are absent for all 91 responses.
- Written explanations/translations, app-locale translations, and Japanese transcript are absent.
- Written questions/options are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries require human listening/perceptual review.

The catalog target remains `incomplete`; it is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration must validate 67 written records, 24 listening records, 91 unique IDs, exact absence of answers/explanations/transcript, runtime audio hash, source mismatch, and 24 ordered candidate timings.
- Catalog completeness and truthful inventory must remain exact at 66 entries.
- Structured-exam, no-scanned-runtime, navigation-contract, protected N1 12/2012, and JLPT Approved UI Lock checks must pass.
- TypeScript diagnostics must be separated into pre-existing N2/N3 adapter failures versus any N5 diagnostic.
