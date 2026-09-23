# N5 December 2012 source audit checkpoint

```text
BASE HEAD: 8ea732050bc2160ed9782e49d1fad9e80f5b3ac3
CATALOG TARGET: n5-2012-12
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2012-12-exam-02
STATUS: incomplete; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2012/N5-2012年12月.pdf`
- PDF SHA-256: `4320847c1f89415c21169ad9e24dfec3b4d534c5c2594726125ccacded5facab`
- Source audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2012/Nghe N5-2012年12月.m4a`
- Audio SHA-256: `88afeee93f0bb0b4311f016fa4d1f19a0035c7f5c1cece1ed88dffa3d9345557`
- Source duration: `1843.958005` seconds = `1,843,958.005` milliseconds; ceiling `1,843,959 ms`.

The PDF cover explicitly prints `2012年12月 日本語能力試験 N5`. The audio identifies JLPT N5 and follows the supplied listening sheets and transcript, although it does not independently state a period. This is strong period/content evidence, not a claim based on the folder name.

## Completed source audit

- All 22 PDF pages were directly inspected.
- Written structure: 35 vocabulary plus 32 grammar/reading responses, exactly 67 unique written audit IDs.
- Listening structure: 24 responses in `7 + 6 + 5 + 6` order, exactly 24 unique listening audit IDs.
- Page 13 supplies answers for all 91 response IDs; every stored answer was checked against that table.
- Simplified Chinese analysis/translation is present for vocabulary responses 13–35 and all 32 grammar/reading responses: 55/67 written records. Vocabulary responses 1–12 have no supplied explanation page.
- The supplied question scan skips the source material for reading responses 27–29: problem 3 ends on page 6 and problem 5 begins on page 7. The answer table and Chinese explanation still cover those three IDs, so their absence is recorded rather than reconstructed.
- Pages 20–22 supply Japanese transcript material for all 24 listening responses. Section markers and recognized question content align with the audio, but no character-level runtime transcript is claimed.
- Runtime MP3: `assets/jlpt/n5/2012-12/audio/n5-2012-12.mp3`; SHA-256 `c3e99d9445a54f00268d323e1179c38e26cc59f1581c250818e11c92ab00b9dd`; measured duration `1843.957551` seconds = `1,843,957.551` milliseconds; ceiling `1,843,958 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `f4365758372ed3d6e272d605c5c9c614233ab9997312f48ae2721ef4b1ce6a47`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- Twenty-four question ranges are derived from section/question markers. Seconds are mechanically multiplied by 1000 and rounded to integer milliseconds. Every range remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- Question/passages for reading responses 27–29 are absent from the supplied scan.
- Chinese explanations/translations are missing for vocabulary responses 1–12; no app-locale translations are supplied.
- Written questions/options and the Japanese transcript are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries still require listening/perceptual review.

The catalog target remains `incomplete`. It is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 67 written records, 24 listening records, 91 unique audit IDs, all answer mappings, exact explanation/source-absence counts, runtime audio hash, and 24 ordered in-range candidate timings.
- Catalog completeness: PASS at exactly 66 entries. Inventory integration: PASS with 45 structured official exams, 16 visible incomplete N4/N5 candidates, and five ready mocks.
- Structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript retains only the pre-existing unchanged N2/N3 adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. No N5 file produced a diagnostic.
