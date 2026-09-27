# N5 2010–2011 source audit checkpoint

```text
BASE HEAD: eece8a133f01a2f533b38080e11f4b287186b61b
CATALOG TARGET: n5-2011-12
EXAM ID RESERVED FOR A VERIFIED PACKAGE: n5-2011-12-exam-01
CONTINUATION BASE HEAD: 94c5c765e326cb849a701ace413f8f42845a775b
STATUS: runtime candidate integrated; source identity unresolved; manifest remains incomplete
DATE: 2026-09-27 (Asia/Tokyo)
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
- The original M4A was decoded again locally on 2026-09-27 and transcribed with the repository-cached Whisper `small` model. Its dialogue, question order, and the printed transcript were cross-checked against all 24 completed listening prompts/options.
- The 24 listening response records are complete in `listening.partial.json`; their order and keyed answers match the page-13 key exactly (`7 + 6 + 5 + 6`).
- The 65 previously saved written question payloads remain unchanged at parsed-payload SHA-256 `8e7207ef404257c39684c19ce79062c2828beec5d19bc863e74be62e7f056ae0`.
- Six source crops provide the written and listening illustrations required to keep all 89 response units answerable in the approved shared UI.
- `n5-2011-12-exam-01` is registered with an independent session key and the full runtime MP3. N4/N5 playback remains continuous; per-question ranges are review metadata only.
- No PDF page is used as a runtime question and no approved UI-lock file was changed.

## Remaining blockers

- The exact administration is not established by the supplied PDF or audio.
- Chinese explanations/translations are missing for grammar responses 15–26; no app-locale translations are supplied.
- No authoritative timing exists; all 24 boundaries still require listening/perceptual review.

The source identity remains `incomplete` in the manifest. The complete answerable runtime candidate is registered using the explicit `2010–2011年` label rather than claiming an independently verified December 2011 administration.

## Validation evidence

- Final validation evidence is recorded by the current commit's command output; the active-exam validator, `git diff --check`, and approved UI-lock check must all pass immediately before commit.
- Remote durability is not claimed until push, fetch, and `node scripts/check-work-persistence.mjs` report `WORK PERSISTENCE PASS` for the resulting narrow commit.
