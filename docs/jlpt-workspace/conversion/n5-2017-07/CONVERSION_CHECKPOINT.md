# N5 July 2017 source audit checkpoint

```text
BASE HEAD: a9156aa271546ab4aae4475a246c9f0421d90647
CATALOG TARGET: n5-2017-07
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2017-07-exam-04
STATUS: incomplete; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources and identity

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 7-2017/N5-2017年-7月.pdf`; SHA-256 `00abb65816b435fd153054902c8b059ad5a842e9b15f80aed8f75443dada136b`; 49 pages.
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 7-2017/Nghe N5-2017年7月.m4a`; SHA-256 `7c8f8d2827b19a1e34e2271fe50f0513989dbac3f69606a804d600fb0a49e5d1`; `1709.950000` seconds = `1,709,950.000 ms`.

The cover and body explicitly print `2017年7月`. The answer table and transcript match the supplied questions, and recognized audio content follows those sheets. The 2012 InDesign creation metadata is stale packaging metadata and is not used as administration evidence.

## Completed source audit

- All 49 PDF pages were directly inspected.
- Exactly 65 written IDs: 33 vocabulary and 32 grammar/reading. Exactly 24 listening IDs in `7 + 6 + 5 + 6` order; total 89.
- Physical pages 40–41 supply answers for all 89 IDs; every stored answer was checked against those tables.
- No written explanation/translation section exists in the supplied package: coverage is 0/65.
- Physical pages 42–49 supply Japanese transcript material for all 24 listening responses; audio section order and recognized question content align, but no character-level runtime transcript is claimed.
- Runtime MP3: `assets/jlpt/n5/2017-07/audio/n5-2017-07.mp3`; SHA-256 `118ec4a892b0287f419e05f8562b164397536b7732e3b6b96711829de4646a3e`; `1709.949388` seconds = `1,709,949.388 ms`; ceiling `1,709,950 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `a4cf4751d036fb370ae722090e048de307cd76fe95f768ae8ed2adee30f891d0`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- All 24 derived timing ranges remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- Written explanations/translations and app-locale translations are absent.
- Written questions/options and the Japanese transcript are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries require listening/perceptual review.

The catalog target remains `incomplete`; it is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for 65 written records, 24 listening records, 89 unique IDs, answer mappings, exact zero explanation coverage, runtime audio hash, and 24 ordered candidate timings.
- Catalog completeness and inventory integration: PASS at exactly 66 entries; 45 structured official exams, 16 incomplete candidates, and five mocks.
- Structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files; no locked file is changed.
- `git diff --check`: PASS.
- TypeScript retains only the pre-existing N2/N3 adapter failures (missing `./n1-2012-12-trial` and non-exported `TrialQuestion`); no N5 diagnostic exists.
