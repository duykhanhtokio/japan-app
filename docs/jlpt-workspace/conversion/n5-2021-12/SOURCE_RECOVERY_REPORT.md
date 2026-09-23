# N5 December 2021 source-recovery report

```text
BASE HEAD: 7b78a0e2cb284c5c9f2c08c2a186267b864b584a
BRANCH: recovery/jlpt-n3-n1
RECOVERY DATE: 2026-09-23 (Asia/Tokyo)
CATALOG TARGET: n5-2021-12
RESULT: source material recovered, but verification remains incomplete
STRUCTURED_READY: false
```

## Conclusion

A nine-page answer-and-script PDF was recovered from a public direct URL. It matches the supplied package strongly: its title is `Đáp án đề N5 T12-2021`, it carries the same `Tôi Yêu Ngoại Ngữ Group / Yuuki Bùi` provenance visible on the supplied question sheets and named in the supplied audio filename, its written structure is exactly `21 + 22 = 43`, and its listening structure is exactly `7 + 6 + 5 + 6 = 24`.

The recovered PDF contains one selected answer for every written response, a 24-response listening answer table, and Japanese script text for all 24 listening responses. It does **not** contain answer rationales, translations, or timing boundaries. It is an unofficial, single-origin answer document rather than an organizer-issued key. The official JLPT FAQ states that exact past tests are not published; consequently there is no official 2021-12 answer key in the official material checked during this recovery.

The recovered answers and script are therefore recorded as `candidate_unverified` evidence only. They have not been copied into `written.audit.json` or `listening.audit.json`, no explanation or translation work has started, all 24 existing timing ranges remain `candidate_unverified`, and the exam remains `incomplete`.

## Durable startup evidence

- Repository root: `/Users/doduykhanh/Desktop/japan-app99/japan-app`.
- Initial local and remote-tracking HEAD: `7b78a0e2cb284c5c9f2c08c2a186267b864b584a`.
- Initial branch: `recovery/jlpt-n3-n1`, configured remote `origin`.
- Initial working tree: clean.
- Initial `WORK PERSISTENCE PASS` confirmed the exact commit on `origin/recovery/jlpt-n3-n1`.
- Initial JLPT Approved UI Lock result: `PASS 10/10`.
- The three recovery-report paths did not exist before this recovery, so there was no prior file content to back up.

## Exhaustive local-source search

The complete source tree `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5` was searched directly, without copying or repacking it.

- 51 non-`.git` files: 7 PDFs, 37 MP3s, 4 M4As, 2 `.DS_Store` files, and 1 `.gitattributes` file.
- No ZIP, RAR, 7z, TAR, or GZIP archive exists in the tree.
- Both hidden `.DS_Store` files contain Finder metadata, not an answer, transcript, explanation, or translation document.
- The source Git repository has one commit (`9b34683afe8fcde6b6b52100e4b717678ea3de07`) and no unreachable historical object reported by `git fsck`; its tree contains no omitted N5 12/2021 answer file.
- All seven PDFs were metadata-scanned and text-searched. None of the other six PDFs is another copy of the N5 12/2021 answer/script document.
- The supplied N5 12/2021 question PDF has 17 pages, one full-page image per page, and zero embedded attachments. Direct inspection of page 17 confirms that it ends with listening 問題4 question material, not an answer page.
- The question PDF metadata says Adobe Acrobat 21.1 Image Conversion Plug-in, creation/modification `2022-06-30`; it does not embed an answer key.
- Extended metadata records separate Google Drive download IDs for the supplied PDF and MP3. It does not identify a parent folder or an answer-file ID.
- The supplied MP3 has only a `track=1` tag and a Lavf encoder tag. It contains no embedded transcript, chapters, answer tags, or timing sheet.

Local source hashes and detailed coverage are recorded in `source-evidence.json`.

## Recovered public source

Direct URL (accessed 2026-09-23):

`https://www.tiengnhatdongian.com/wp-content/uploads/2023/04/Dap-anScrip-N5-12-2021.pdf`

- SHA-256 of downloaded bytes: `032ba077eb65417d6e26404fe48775448bcb69b87629888fbcb02d5ac09cae98`.
- PDF metadata: 9 pages, 1,890,866 bytes, producer `iLovePDF`, modified `2023-04-06 11:42:58 JST`.
- Pages 1–3: all 43 written selections, grouped as vocabulary `7 + 5 + 6 + 3 = 21` and grammar/reading `9 + 4 + 4 + 2 + 2 + 1 = 22`.
- Page 3: listening answer table grouped as `7 + 6 + 5 + 6 = 24`.
- Pages 4–9: Japanese listening script covering all 24 response units in the same four-problem order.
- Direct page rendering and extracted text were both checked. The first and last written groups, all section transitions, the listening answer table, and the first/last transcript groups are present; no question-number shift was found.
- OCR of all 17 supplied question pages confirms that the recovered selected-answer sentences correspond to the supplied question content and that the written group boundaries match. This establishes package/content alignment, not independent proof that each selected option is correct.

## Reliability decision

The recovered PDF is a strong content match but not an independent or official key:

1. It attributes both answers and script to Yuuki Bùi / Tôi Yêu Ngoại Ngữ Group, the same provenance already attached to the supplied source package.
2. The official JLPT FAQ says exact past test questions are not published, and the official site does not provide a 2021-12 N5 key or transcript.
3. Other public pages inspected either reproduce the same material or show an incompatible pre-change structure of 67 written responses (`35 + 32`) rather than this paper's verified 43 (`21 + 22`). They cannot independently validate this package.
4. No full manual, line-by-line audio review of the recovered transcript was performed in this source-recovery unit. Automated recognition remains navigation evidence only.

Accordingly:

- Written answers recovered: 43/43 candidate values; verification status `candidate_unverified`; not applied.
- Listening answers recovered: 24/24 candidate values; verification status `candidate_unverified`; not applied.
- Japanese transcript recovered: 24/24 response units; verification status `candidate_unverified`; not treated as organizer-issued or audio-reviewed.
- Audio boundaries: 24/24 existing derived candidates; `humanReviewed: false`, `perceptualApproval: false`, `needs_later_review`.
- Written explanations: 0/43. A selected answer and completed sentence are not an explanation.
- Source translations: none.

## Rejected or non-independent web material

- TryNihongo's page titled for N5 December 2021 was downloaded and hashed, but its displayed section numbering is the old 67-written-response structure and its answer cells are empty in the delivered HTML. It does not match the supplied 43-response paper and was rejected.
- Hikari Academy's December 2021 page was downloaded and hashed. Its N5 section also uses the old `35 + 32` written structure and does not supply the 43-response answer mapping; it was rejected.
- A Studocu search result exposes a preview of the same Yuuki Bùi document. It is a duplicate of the recovered single-origin material, not independent corroboration, and no login-gated download was attempted.
- Search results for listening videos were not used as transcript or answer evidence because their provenance is unclear and they do not provide a stable organizer-issued document.

## Required next evidence

The exact missing items and acceptable forms of supplementary evidence are in `missing-data.json`. In summary, advancement requires an independently attributable answer key for the exact 43+24 package or a recorded human verification of every candidate answer, full human audio comparison of the recovered 24-item transcript, and perceptual review of all 24 audio boundaries. Explanations and translations must be sourced or authored only after the answers are verified.

No UI, route, registry, adapter, runtime data, audit data, or UI-lock file is changed by this recovery report.

## Validation result

Run after the three recovery documents were created:

- Catalog completeness: PASS, exactly 66 entries.
- Inventory: PASS, 45 structured official + 16 pending official + 5 mocks; exact seven N5 candidate periods; scanned/Royal runtime count zero.
- N5 12/2021 integration: PASS with the repository audit remaining at 43 written, 24 listening, no applied answers/transcript, and 24 unverified timings.
- Structured-exam contract: PASS.
- Navigation contract: PASS.
- No-scanned-runtime: PASS.
- JLPT Approved UI Lock: PASS 10/10.
- `git diff --check`: PASS.
- TypeScript: exit 2 only for pre-existing N2/N3 adapter diagnostics. `n2-2012-12-trial.ts` cannot resolve `./n1-2012-12-trial`; the other reported N2/N3 adapters import a locally declared but unexported `TrialQuestion` from `n1-2013-07-trial.ts`. There is no N5 diagnostic, and none of those source files is changed by this recovery.
