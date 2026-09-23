# N5 2010–2011 source audit checkpoint

```text
BASE HEAD: eece8a133f01a2f533b38080e11f4b287186b61b
CATALOG TARGET: n5-2011-12
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2011-12-exam-01
STATUS: incomplete; identity unresolved; not structured_ready
DATE: 2026-09-23 (Asia/Tokyo)
```

## Direct sources

- PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2011/N5-2010-2011年-1.pdf`
- PDF SHA-256: `6277e9ba5b18e43a572ec93a6b7cadced911b8744c5605ff661632a0247cf6a6`
- Source audio: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2011/Nghe N5-2010-2011年.m4a`
- Audio SHA-256: `880f22485b45ed6970182799ca4567ea6645972b42923a166f3d29a9ac9f62ae`
- Source duration: `1712.900998` seconds = `1,712,900.998` milliseconds; ceiling `1,712,901 ms`.

The PDF cover prints `2010-2011年 日本語能力試験 N5`. It does not isolate December 2011. The enclosing directory says `N5 12-2011`, but that label is not treated as authoritative. The audio introduction identifies N5 and its question content follows the supplied PDF transcript, but it does not state a period. The target identity therefore remains unresolved.

## Completed source audit

- All 21 PDF pages were directly inspected.
- Written structure: 33 vocabulary plus 32 grammar/reading responses, exactly 65 unique written audit IDs.
- Listening structure: 24 responses in `7 + 6 + 5 + 6` order, exactly 24 unique listening audit IDs.
- Page 13 supplies answers for all 89 response IDs; every stored answer was checked against that table.
- Simplified Chinese analysis/translation is present for all 33 vocabulary responses, grammar responses 1–14, and reading responses 27–32: 53/65 written records. Grammar responses 15–26 have no supplied explanation page.
- Pages 19–21 supply Japanese transcript material for all 24 listening responses. Section markers and recognized question content align with the audio, but no character-level runtime transcript is claimed.
- Runtime MP3: `assets/jlpt/n5/2011-12/audio/n5-2011-12.mp3`; SHA-256 `24f7d28b1265d92fa02f79c0b4bc0b4efe5e3452c9c12ce937813cc97858e88f`; measured duration `1712.900998` seconds = `1,712,900.998` milliseconds; ceiling `1,712,901 ms`.
- Local Whisper `small` was used only as a navigation aid. Its JSON SHA-256 is `a5578082b7175a9e0c626ff9bfed8c7d00654002a69b552ac0c161184ec24ba2`; model SHA-256 is `9ecf779972d90ba49c06d968637d720dd632c55bbf19d441fb42bf17a411e794`.
- Twenty-four question ranges were derived from section/question markers. Seconds were mechanically multiplied by 1000 and rounded to integer milliseconds. Every range remains `candidate_unverified`, `humanReviewed: false`, `perceptualApproval: false`, and `needs_later_review`.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- The exact administration is not established by the supplied PDF or audio.
- Chinese explanations/translations are missing for grammar responses 15–26; no app-locale translations are supplied.
- Written questions/options and the Japanese transcript are not yet character-level verified runtime transcriptions.
- No authoritative timing exists; all 24 boundaries still require listening/perceptual review.

The catalog target remains `incomplete`. It is not registered as `structured_ready`.

## Validation evidence

- Per-exam integration: PASS for exactly 65 written records, 24 listening records, 89 unique audit IDs, all answer mappings, exact explanation-presence counts, runtime audio hash, and 24 ordered in-range candidate timings.
- Catalog completeness: PASS at exactly 66 entries. Inventory integration: PASS with 45 structured official exams, 16 visible incomplete N4/N5 candidates, and five ready mocks.
- Structured-exam, no-scanned-runtime, navigation-contract, and protected N1 12/2012 checks: PASS.
- JLPT Approved UI Lock: PASS 10/10 byte-locked files; no locked file is in the change set.
- `git diff --check`: PASS.
- TypeScript retains only the pre-existing unchanged N2/N3 adapter failures: missing `./n1-2012-12-trial` and non-exported `TrialQuestion` from `n1-2013-07-trial.ts`. No N5 file produced a diagnostic.
