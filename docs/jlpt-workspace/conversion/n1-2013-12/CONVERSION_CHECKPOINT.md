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

Next, inspect question page 6 directly and continue from question 46, including its passage on page 5. Preserve any question or passage that continues onto the next page intact rather than guessing or splitting it. Do not register the exam until all written content, listening content, audio timing, TypeScript, catalog, runtime, and remote-persistence checks pass.
