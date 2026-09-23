# N5 2018 year-only source audit checkpoint

```text
BASE HEAD: 80f2bbec5b10b2a5efdccffc3218b4e912690c42
CATALOG TARGET: n5-2018-12
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2018-12-exam-05
STATUS: incomplete; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources and identity

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2018/N5-2018年.pdf`; SHA-256 `604220381a3cbdbf89647b2d315b0f72af870a789779b8cd85a14516078c900e`; 24 pages.
- Audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2018/Nghe N5-2018年.m4a`; SHA-256 `d09cb4f18006cca4350bec478341683353f897b4cbdf570a482e39be90ee98f1`; `1730.592993` seconds = `1,730,592.993 ms`.

The cover proves only year 2018 and level N5. Neither the PDF body, metadata, audio metadata, nor spoken introduction proves an administration month. The `2018年1月1日` date on physical page 8 is inside a reading-question notice and is not exam-identity evidence. The folder/catalog target remains an inventory hint, so December identity is unresolved.

## Completed source audit

- All 24 PDF pages were directly inspected.
- Exactly 67 written IDs: 35 vocabulary and 32 grammar/reading. Exactly 24 listening IDs in `7 + 6 + 5 + 6` order; total 91.
- Physical page 15 supplies answers for all 91 IDs; every stored answer was checked against its table.
- Physical pages 16–20 supply Simplified Chinese analysis/translation for all 67 written responses.
- Physical pages 21–24 supply Japanese transcript material for all 24 listening responses; audio section order and recognized question content align, but no character-level runtime transcript is claimed.
- Runtime MP3: `assets/jlpt/n5/2018-12/audio/n5-2018-12.mp3`; SHA-256 `2130c71a21873be5afed12818fcdffee74540327da818d32ee4a32dc77f629eb`; `1730.592993` seconds = `1,730,592.993 ms`; ceiling `1,730,593 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `a2955e546623a119c925e11e86fa9f69c3d8157b236552504fa495fd780c16fc`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- All 24 derived ranges remain `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`. Every decimal seconds-to-milliseconds conversion is asserted in the preparation script.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- December 2018 identity is not proven by the direct sources.
- App-locale translations are absent; available explanations are Simplified Chinese.
- Written questions/options/explanations and the Japanese transcript are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries require human listening/perceptual review.

The catalog target remains `incomplete`; it is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration must validate 67 written records, 24 listening records, 91 unique IDs, answer mappings, full source explanation coverage, runtime audio hash, and 24 ordered candidate timings.
- Catalog completeness and truthful inventory must remain exact at 66 entries.
- Structured-exam, no-scanned-runtime, navigation-contract, protected N1 12/2012, and JLPT Approved UI Lock checks must pass.
- TypeScript diagnostics must be separated into pre-existing N2/N3 adapter failures versus any N5 diagnostic.
