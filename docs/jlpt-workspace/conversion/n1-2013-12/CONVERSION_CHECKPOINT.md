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

- Source-inventory content commit: `213ab3d0163573540ff6a6fb8ad25b5e783a2a51`.
- Remote verification: PASS on `origin/main` and independently confirmed through the GitHub connector.

## Current resume point

Source identity, real asset integrity, page dimensions, audio metadata, response counts, and answer keys are verified.

Question page 2 was inspected directly. Written questions 1-17 were transcribed into `written-page-02.review.json`; their answer IDs match the verified source key:

```text
4, 3, 1, 3, 1, 2, 3, 4, 1, 2, 1, 3, 2, 1, 1, 4, 2
```

Next, inspect question page 3 directly and continue written transcription from question 18. Preserve any question or passage that continues onto the next page intact rather than guessing or splitting it. Do not register the exam until all written content, listening content, audio timing, TypeScript, catalog, runtime, and remote-persistence checks pass.
