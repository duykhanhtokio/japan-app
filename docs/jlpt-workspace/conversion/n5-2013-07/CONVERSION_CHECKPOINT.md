# N5 July 2013 source audit checkpoint

```text
BASE HEAD: 130f8f0570ec714f034b871274a92ddbaf5e7898
CATALOG TARGET: n5-2013-07
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2013-07-exam-03
STATUS: incomplete; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 7-2013/2013年7月N5真题 [Edited].pdf`
- PDF SHA-256: `e1e787b10f29adee65e1fc4e7a165e9a6e6a29e6b521f82d37cb0c2479b0fe05`
- Source audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 7-2013/Nghe N5-2013年7月.mp3`
- Audio SHA-256: `ad43948e6dd89cdff016377488284745e2539879a9d7cf14cab14a2a963aba1d`
- Source duration: `1779.409000` seconds = `1,779,409.000` milliseconds.

The PDF cover explicitly prints `2013年7月` and N5. The audio identifies JLPT N5 and follows the supplied listening sheets and transcript, although it does not independently state a period. This is strong period/content evidence, not a claim based on the folder name.

## Completed source audit

- All 17 physical PDF pages were directly inspected.
- Written structure: 35 vocabulary plus 32 grammar/reading responses, exactly 67 unique written audit IDs.
- Listening structure: 24 responses in `7 + 6 + 5 + 6` order, exactly 24 unique listening audit IDs.
- Physical page 14 (internal page 13) supplies answers for all 91 response IDs; every stored answer was checked against that table.
- The cover says analysis begins at internal page 14, but the edited PDF jumps from internal page 13 to internal page 20. All analysis pages 14–19 are absent, so supplied explanation/translation coverage is 0/67 rather than inferred from the cover.
- Physical pages 15–17 (internal pages 20–22) supply Japanese transcript material for all 24 listening responses. Section markers and recognized question content align with the audio, but no character-level runtime transcript is claimed.
- Runtime MP3: `assets/jlpt/n5/2013-07/audio/n5-2013-07.mp3`; SHA-256 `20e13bd0ce43c581c8f81cd1587e4b5ffa995f70754051339e138ebcd427d151`; measured duration `1779.408980` seconds = `1,779,408.980` milliseconds; ceiling `1,779,409 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `14e78f3474bcbfd75f5def14e82789cae40bb4fc7ebf86722579561ea7336328`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- Twenty-four question ranges are derived from section/question markers. Seconds are mechanically multiplied by 1000 and rounded to integer milliseconds. Every range remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- The supplied edited PDF omits every written analysis/explanation page; no app-locale translations are supplied.
- Written questions/options and the Japanese transcript are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries still require listening/perceptual review.

The catalog target remains `incomplete`. It is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 67 written records, 24 listening records, 91 unique audit IDs, all answer mappings, exact zero explanation coverage, runtime audio hash, and 24 ordered in-range candidate timings.
- Catalog completeness: PASS at exactly 66 entries. Inventory integration: PASS with 45 structured official exams, 16 visible incomplete N4/N5 candidates, and five ready mocks.
- Structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript retains only the pre-existing unchanged N2/N3 adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. No N5 file produced a diagnostic.
