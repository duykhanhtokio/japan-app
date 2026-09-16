# N1 2013-12 conversion checkpoint

## Source identity

- Planned exam ID: `n1-2013-12-exam-04`.
- Question image pages: 15 real JPEG files. Pages 1 and 15 are 1240x1754; pages 2-14 are 1276x1719.
- Question-page manifest SHA-256: `f1a74efda8474f079acf652255ea79a2457c23e7bdd094c5db433a7d789229f1`.
- Answer/script image pages: 13 real JPEG files, 1241x1754.
- Answer/script-page manifest SHA-256: `4d624d1baa2fca1283d1d80e0e4fb5c4042fe1c013ca9ceeafe7ce0912220bd9`.
- Audio file: `assets/jlpt/n1/2013-12/audio/n1-2013-12.mp3`.
- Audio SHA-256: `ff577435f993cbf20c85d83b8851e4059a423412b91c027d4801103508a0835b`.
- Audio duration: `2861.191837` seconds.
- Audio size: `29,058,645` bytes.
- The Git LFS assets were fetched and verified as actual JPEG/MP3 files rather than pointer text.

## Expected response inventory

- Written responses: 70.
- Listening responses: 36.
- Listening counts: 問題1=6, 問題2=7, 問題3=5, 問題4=14, 問題5=4.
- Expected unique listening segments: 35.
- 問題5 source question 3 has two scored responses (answers `1`, `3`) sharing one segment.

## Verified source key

Answer/script page 1 was inspected directly. The following keys match `src/data/jlpt-mock/n1-2013-12-official.ts`.

- Written key contains 70 continuous responses, questions 1-70.
- Written key: `4, 3, 1, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2, 3, 2, 4, 1, 4, 1, 3, 4, 4, 1, 1, 3, 2, 3, 3, 1, 4, 2, 1, 4, 2, 3, 1, 2, 3, 1, 2, 4, 1, 1, 4, 2, 4, 3, 4, 1, 3, 1, 3, 2, 3, 4, 4, 2, 2, 2, 3, 4, 1, 1, 2, 2, 3`.
- Listening 問題1: `3, 3, 4, 2, 3, 2`.
- Listening 問題2: `2, 1, 3, 4, 1, 1, 4`.
- Listening 問題3: `3, 3, 2, 4, 1`.
- Listening 問題4: `3, 1, 2, 3, 3, 1, 1, 3, 2, 1, 2, 3, 1, 2`.
- Listening 問題5: `1, 3, 1, 3`.

## Durable checkpoint

- Translation questions 46-47: `cf968981707c19eafc724ca44d932a36910e77e3`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 41-45: `ad31aa306e6735339ab94e6a141832764145e703`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 39-40: `54897c9480c488bb2220d55341cc543d1acacf7e`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 36-38: `7fef55378258f2403e136dc2c9c62b0e6f410d83`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 33-35: `bfd48e1f70c20fdd3ff2523815d087aa4aa77822`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 30-32: `6bd05bcbdd18a9ec7b1cfc26becbb019308f28b3`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 26-29: `75dbf1a502ac42316a71006739a1f603f5cfefaf`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 23-25: `f0c69ba4244e9e16daa03db166d22a3b9bcdc3e1`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 20-22: `3dfbb70ef0ecb9429ac1731105698d334054b52e`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 15-19: `dca1db74f1f4b1f8e86a380ad5b58b40a5fe696d`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 11-14: `097f86080d81bbb0c9bf919fb56f25b5270ad723`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 7-10: `272cf86848ed6434f28347c07db98af06f362975`; remote persistence PASS, clean working tree, 2026-09-17.

- Translation questions 1-6: `8ef115b339e9781a844e12ad675829e1dfe39489`; remote persistence PASS, clean working tree, 2026-09-17.

- Explanation source page 7 / source complete: `4f44fbf6b788c5133526062a2d0e0d5ad860c232`; remote persistence PASS, clean working tree, 2026-09-17.

- Explanation source page 6: `69c61569bd8f9cc8e2b959e3413dc546d856057d`; remote persistence PASS, clean working tree, 2026-09-17.

- Explanation source page 5: `5f10c6cd8bc174f329e7036ef06b85656c2c66c0`; remote persistence PASS, clean working tree, 2026-09-17.

- Explanation source page 4: `e62dc9499a14ef7287bf9b772dee931956209ecf`; remote persistence PASS, clean working tree, 2026-09-17.

- Explanation source page 3: `5149a05d4b75b082946a39f0c39fd171ec1c8951`; remote persistence PASS, clean working tree, 2026-09-17.

- Explanation source page 2: `545c4ba7a51923d07f5167c853ec0dccf06a9904`; remote persistence PASS, clean working tree, 2026-09-17.
- User-approved runtime commit: `601e9fcff653d3f80bbf684fbd1a607287ce9853`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12`, clean working tree, 2026-09-17. Dataset `structured_ready`; 35 audio timing ranges accepted by user review.
- App integration and Simulator screenshot commit: `8482ad1459e63292411a2d11c7a27a3d3be86b4e`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-17. Screenshot LFS object uploaded successfully. This is the durable integrated review candidate, not a final runtime-approved exam.

- Structured candidate commit: `625d7ef867388f32c33849e3267a90e54489d722`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-17.
- Listening problem 5 commit: `d209768e40d6c72051584cce586a8cd50601dd18`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Listening problem 4 commit: `ac6fe433ec0444d33c3ea796f19dcf366b334550`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Listening problem 3 commit: `22e4b6f7643885dbd6cf7469a8a75f5c2261a8ce`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Listening problem 2 commit: `fc68b44ebee03d39a3a26720f380a2380e02c694`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Listening problem 1 commit: `a9e927dd301fd89e69975bb03348505dc90113d9`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 12 commit: `74663d427f868c0e6d8228581e6acf8f0c7ecd09`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16. All 70 written review responses pass sequence/option/key validation; all eight JLPT regression checks pass.
- Written page 11 commit: `ae5a3a8b5ff9225e23c6bb48e471a89d18fcedfe`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 10 commit: `b847c46af79252ffd43b6fab5cf493a01a9f5509`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 9 commit: `e629b6e57b49a09fde8d1a4f76f9a056f6531902`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 8 commit: `7718c1cf6ddadedb9050fec07d06821f30706bd3`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 7 commit: `dbdf0d8f433690a4a0e7ba2ecf5be05b224dfb61`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 6 commit: `06a28b218c1e0512625197193cdf7940ff45817c`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 5 commit: `203898c4b6eb9c45278b1390380d25b4598379f9`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Written page 4 commit: `c241ece16f5476eb6de526a6abe7a87cc25e523b`; `check-work-persistence.mjs` PASS on `origin/recovery/n1-2013-12` after push/fetch, clean working tree, 2026-09-16.
- Source-inventory content commit: `213ab3d0163573540ff6a6fb8ad25b5e783a2a51`.
- Remote verification: PASS on `origin/main` and independently confirmed through the GitHub connector.
- Written page 2 commit: `ca35043300097b8cfc8c9ed2c669248d56828ac3` (remote verified).
- Written page 3 commit: `8b69866d48c4d8e29222b8f8dfc2dd4edf1fd627` (ancestor of the remotely verified recovery branch HEAD).
- Session startup remote HEAD: `c79af863806824ad431294dfb74dd0554805b30b`, verified by `node scripts/check-work-persistence.mjs` on `origin/recovery/n1-2013-12`; clean working tree. Push dry run succeeded.

## Current resume point

Source identity, real asset integrity, page dimensions, audio metadata, response counts, and answer keys are verified.

Question page 2 was inspected directly. Written questions 1-17 were transcribed into `written-page-02.review.json`; their answer IDs match the verified source key:

```text
4, 3, 1, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2
```

Question page 3 was inspected directly. Written questions 18-26 were transcribed into `written-page-03.review.json`; their answer IDs match the verified source key:

```text
3, 2, 4, 1, 4, 1, 3, 4, 4
```

Question page 4 was inspected directly. Complete written questions 27-39 were transcribed into `written-page-04.review.json`. Question 40 starts at the bottom of page 4 and continues on page 5; it is deliberately deferred to the next unit so the complete question can be verified together.

Page 4 backup: `.jlpt-backups/n1-2013-12-page04-20260916-233015/`, with SHA-256 before and after. Source spellings, including `勧める` in question 27 and `一度あって` in question 39, are preserved as printed.

Startup validation on 2026-09-16: all eight section-9 checks passed; UI lock 10/10; catalog 50 (3 structured official, 42 pending official, 5 mocks); N1 2013-07 remains verified at 70 written + 36 listening responses and 35 decoded audio segments.

Question page 5 was inspected directly. Written questions 40-45 are transcribed in `written-page-05.review.json`; question 40 combines pages 4-5, and questions 41-45 include the complete shared passage. The reading passage for question 46 starts on page 5 and is deferred until its question/options on page 6 are inspected. Source wording is preserved, including apparent grammatical omissions in the printed dog-consultation passage.

Page 5 backup: `.jlpt-backups/n1-2013-12-page05-20260916-233301/`.

Question page 6 was inspected directly. Written questions 46-49, including all four short passages, are transcribed in `written-page-06.review.json`. Question 46 combines pages 5-6. The printed question 49 passage has an annotation marker but no annotation text on page 6; page 7 begins problem 9, so no missing note is invented. Preserve printed wording, including question 48 option 4.

Page 6 backup: `.jlpt-backups/n1-2013-12-page06-20260916-233453/`.

Question page 7 was inspected directly. Written questions 50-52 and their complete painting passage are transcribed in `written-page-07.review.json`. The next science passage continues on page 8 and is deferred as one complete unit.

Page 7 backup: `.jlpt-backups/n1-2013-12-page07-20260916-233800/`.

Question page 8 was inspected directly. Written questions 53-58 are transcribed in `written-page-08.review.json`, with the complete science passage from pages 7-8 and individuality passage on page 8. Printed source anomalies are retained.

Page 8 backup: `.jlpt-backups/n1-2013-12-page08-20260916-233812/`.

Question page 9 was inspected directly. Written questions 59-62 and the complete music-research passage are transcribed in `written-page-09.review.json`.

Page 9 backup: `.jlpt-backups/n1-2013-12-page09-20260916-234012/`.

Question page 10 was inspected directly. Written questions 63-64 and both food-safety passages are transcribed in `written-page-10.review.json`. The problem-12 passage continues on page 11 and is deferred intact.

Page 10 backup: `.jlpt-backups/n1-2013-12-page10-20260916-234339/`.

Question page 11 was inspected directly. Written questions 65-68 and their complete communication passage from pages 10-11 are transcribed in `written-page-11.review.json`. Question 69 depends on the information sheet on page 12 and is deferred to that unit.

Page 11 backup: `.jlpt-backups/n1-2013-12-page11-20260916-234510/`.

Question page 12 was inspected directly. Written questions 69-70 and the complete farm-information sheet are transcribed in `written-page-12.review.json`, with question 69 from page 11. The source sheet contains contradictory statements about seed provision in row 2 and cultivation guidance in row 4 versus its footnote; all printed statements are retained rather than silently corrected. The verified key remains 69=2 and 70=3.

Page 12 backup: `.jlpt-backups/n1-2013-12-page12-20260916-234705/`.

Written transcription now covers all 70 responses. Listening problem 1 is transcribed in `listening-problem-01.review.json`: 6 prompts/options/answers and full transcripts, visually checked against question page 13 and answer/script pages 7-9. Six audio ranges decode successfully. Timings are ASR-aligned candidates pending runtime listening review, not verified timings. Whisper omitted the q5/q6 transition in the existing TSV; local Whisper small re-transcription of seconds 470-510 recovered the repeated q5 prompt and q6 introduction.

Listening problem 1 backup: `.jlpt-backups/n1-2013-12-listening01-20260916-234937/`.

Listening problem 2 is transcribed in `listening-problem-02.review.json`: 7 prompts/options/answers and full transcripts, visually checked against question pages 13-14 and answer/script pages 9-10. All seven ASR-aligned candidate audio ranges decode; runtime listening review remains pending.

Listening problem 2 backup: `.jlpt-backups/n1-2013-12-listening02-20260916-235231/`.

Listening problem 3 is transcribed in `listening-problem-03.review.json`: 5 responses with all spoken options and transcripts visually checked against answer/script page 11. All five candidate audio ranges decode; runtime listening review remains pending.

Listening problem 3 backup: `.jlpt-backups/n1-2013-12-listening03-20260916-235403/`.

Listening problem 4 is transcribed in `listening-problem-04.review.json`: 14 responses with exactly three options each, all visually checked against answer/script page 12. OCR omitted question 3 options 1-2; these were recovered directly from the image. Fourteen candidate audio ranges decode; runtime listening review remains pending.

Listening problem 4 backup: `.jlpt-backups/n1-2013-12-listening04-20260916-235525/`.

Listening problem 5 is transcribed in `listening-problem-05.review.json`: 4 responses, visually checked against question page 14 and answer/script pages 12-13. Item 3 has two independent response suffixes (a/b) sharing one segment and transcript; answers are 1 and 3. All three candidate audio ranges decode. Full listening inventory is now 36 responses / 35 unique candidate audio segments; runtime listening review remains pending.

Listening problem 5 backup: `.jlpt-backups/n1-2013-12-listening05-20260916-235657/`.

Structured candidate work: `scripts/build-n1-2013-12-structured.mjs` builds all 106 responses with runtime-compatible families, deduplicated shared passages and independent question/session IDs. `src/data/jlpt-official/n1-2013-12-trial.ts` adapts the candidate to the existing approved UI; no UI file changes.

Current ffprobe reports 2861.165714 seconds for the same hash-verified audio, versus the historical checkpoint duration 2861.191837. The final candidate segment was reduced to 2861165 ms to remain inside the measured duration. This is a timing-bound correction, not proof of perceptual boundary verification.

Candidate backup: `.jlpt-backups/n1-2013-12-candidate-20260916-235928/`.

Candidate validation on 2026-09-17: `check-n1-2013-12-integration.mjs` PASS for 70 written / 36 listening / 35 decoded ranges; source hashes, exact answer keys, family mapping, shared passage lookup, and distinct problem-5 response labels pass. TypeScript PASS; lint 0 errors / 16 pre-existing warnings. UI lock remains 10/10. Candidate status stays `needs_runtime_review`; explanation conversion is not included (same missing/not_generated adapter contract as N1 2013-07).

Recovery-branch integration: the user-requested app integration registers the source-reviewed structured candidate once and replaces its pending entry, solely for final runtime review. Dataset status remains `needs_runtime_review`, not `structured_ready`; audio boundaries are not promoted to verified. Catalog remains 50 entries (4 structured official, 41 pending official, 5 mocks). Two inventory validators now read the actual registry rather than hard-coding 3/42. All nine validators pass; post-integration TypeScript passes; lint remains 0 errors / 16 pre-existing warnings.

Integration backup: `.jlpt-backups/n1-2013-12-integration-20260917-000417/`.

`npx expo start -c --port 8082` could not bind inside the sandbox (ERR_SOCKET_BAD_PORT after port probing); rerunning outside the sandbox started Metro successfully. iOS bundle built successfully (5997 modules). Booted device: iPhone 16 Plus, iOS 18.4, D079E542-BB48-40D3-B00B-0E35DEE2E31F.

Simulator evidence: `runtime-review/n1-2013-12-simulator-20260917.png` captures the running N1 2013-12 candidate (questions 2-3 match the dataset, 1/106 answered, selected option visible). This proves initial rendering only, not a full interaction or listening review. No automated touch tool was used; no user answers were cleared. Expo Go reports the existing optional ExpoSpeechRecognition native module unavailable; no JLPT-specific runtime error was logged.

## Runtime approval — 2026-09-17

The user confirmed: “đã duyệt ổn, làm tiếp .” in response to the Simulator/audio review gate. Runtime status is now `structured_ready`; all 35 audio timing ranges are accepted on the basis of that user review. This does not claim a second automated interaction test or change printed source anomalies. The prior review candidate and its original pending statuses above are historical records.

`runtime-review/approval.json` records the reviewed HEAD, candidate SHA-256, every review input hash, audio hash and existing screenshot. Builder and validator enforce those hashes so changed source data cannot inherit this approval silently. The stable `exam.candidate.json` filename is retained to avoid needless import churn; its status is authoritative.

Backup: `.jlpt-backups/n1-2013-12-runtime-approval-20260917-001643/`.

Next: convert source explanations from answer/script pages 2-7 and their 12 translations, preserving the source text and marking AI translations `translated_ai_unreviewed`. Integrate through the existing registry explanation callback only; do not change locked UI or rework question pages 2-3.

## Explanation conversion progress

- Answer/script page 2 visually transcribed: source explanations 1-14 in `explanations/source-page-02.json`. Printed source wording is retained, including questionable dictionary glosses (e.g. question 12 手前); this is source transcription, not an editorial correction.
- Source validator: `node scripts/check-n1-2013-12-explanations.mjs`. Translation count: 0/840. Next: source page 3, from explanation 15.

- Answer/script page 3 visually transcribed: explanations 15-28 in `explanations/source-page-03.json`. Explanation 29 continues on page 4 and is deferred intact. Printed inconsistencies in 20/22/24/25 are preserved as source text; no question data or answer is changed. Next: source pages 3-4, explanation 29 onward.

- Answer/script page 4 visually transcribed: explanations 29-39 in `explanations/source-page-04.json`. Inspection confirms explanation 29 ends on page 3 (prior continuation assumption corrected); explanation 40 continues on page 5 and is deferred intact. Source typos in 37/39 are retained. Next: explanation 40 onward.

- Answer/script pages 4-5 visually transcribed: explanations 40-52 in `explanations/source-page-05.json`. Source misprints retained, including question 45 referring to options 1 and 4 as inference while its answer is 4. Explanation 53 continues on page 6. Next: explanation 53 onward.

- Answer/script pages 5-6 visually transcribed: explanations 53-62 in `explanations/source-page-06.json`. Printed explanation 56 is misnumbered 54; metadata records the anomaly, and its content/key match question 56. Next: explanation 63 onward (page boundary verification pending).

- Answer/script pages 6-7 visually transcribed: explanations 63-70 in `explanations/source-page-07.json`. Explanation 63 ends on page 6; question 67 has an incorrect printed heading, retained with a note. All 70 source explanations now exist; translations remain 0/840. Next: full 12-locale translation batches and registry callback integration.

## Translation execution constraint — 2026-09-17

User explicitly prohibits sending exam/questions/answers/transcripts/explanations to Google Translate or any public translation service. Translate within the Codex session using approved repository sources only. Every target record must retain `generatedBy: AI`, `reviewedByNativeSpeaker: false`, `status: translated_ai_unreviewed`. No runtime translation API or translation dependency. The attempted sandbox request failed DNS; its escalated retry was canceled by the user. No translation service script or dependency was created. Current unit is explanation translation, authorized by the runtime-approval checkpoint above.

- Codex-authored translation batch questions 1-6: 72/840 target translations, all 12 target locales per question. Japanese terms preserved; every record has AI/unreviewed metadata and its source-text SHA-256. `--complete-translations` enforces 840 targets at final integration; partial validation explicitly reports pending coverage. No external translation service used for this batch. Next: questions 7-14.

- Codex-authored translations 7-10: cumulative 120/840 targets, 12 locales per completed question, full source meanings and option glosses retained. Next: questions 11-14.

- Codex-authored translations 11-14: cumulative 168/840 targets. Question 12 preserves the questionable printed 手前 gloss, with an explicit source caveat in all 12 translations. All target records remain AI-unreviewed. Next: questions 15-19.

- Codex-authored translations 15-19: cumulative 228/840 targets, all 12 locales for every completed question. Next: questions 20-25, including printed-source inconsistencies that require explicit caveats.

- Codex-authored translations 20-22: cumulative 264/840 targets. Explicit localized notes preserve the unresolved printed 上并 fragment (20) and inconsistent suggested replacements もちかえる/すいせん (22); no editorial correction is invented. Next: questions 23-25.

- Codex-authored translations 23-25: cumulative 300/840 targets. Localized source notes retain the 当てはまる/当てはめる mismatch (24) and inconsistent kanji/reading/gloss in 25. Next: grammar explanations 26 onward.

- Codex-authored translations 26-29: cumulative 348/840 targets. Grammar forms retained and translated directly from source explanations. Next: questions 30-35.

- Codex-authored translations 30-32: cumulative 384/840 targets. Conditional/passive/causative explanations translated; question 32 retains printed 思いきゃ with an explicit note distinguishing the explained と思いきや form. Next: questions 33-35.

- Codex-authored translations 33-35: cumulative 420/840 targets. Degree expressions, humble/honorific contrasts and deliberative どうしたものか translated with all source option explanations. Next: sentence-composition explanations 36-40.

- Codex-authored translations 36-38: cumulative 456/840 targets. Full sentence meaning, grammar reasoning and option ordering retained. Source school name 四川 retained with a source note. Next: questions 39-40.

- Codex-authored translations 39-40: cumulative 480/840 targets. Source typo 去打扮 is retained as an unresolved quoted fragment with localized notes; no place-name correction is guessed. Full しか scope explanation and both orderings retained. Next: questions 41-45.

- Codex-authored translations 41-45: cumulative 540/840 targets. Question 45 retains its source contradiction (answer 4 versus rejecting 1 and 4) with an explicit localized caveat. No answer-key change. Next: reading explanations 46 onward.

- Codex-authored translations 46-47: cumulative 564/840 targets, full source reasoning retained. Next: questions 48-49.

- Codex-authored translations 48-49: cumulative 588/840 targets. Medical passage quotation retained verbatim; diary explanation notes inconsistent 四人记录 and grounds private-record rendering in the same source’s explicit 私人记录. Next: questions 50-52.
