# N1 2015-12 conversion checkpoint

- Exam ID: `n1-2015-12-exam-08`.
- Scope: full available exam recovery. Automated listening timing/data may only be recorded as candidate/unverified and must not claim human, perceptual, or audio verification.
- Written page 2: questions 1–19 were visually transcribed from `assets/jlpt/n1/2015-12/question/page-02.jpg` into `written-page-02.review.json`. Every item has four options; its answer matches `N1_2015_12_WRITTEN_KEY` and the official answer table in `assets/jlpt/n1/2015-12/answer-script/page-01.jpg`.
- Written page 3: questions 20–29 were visually transcribed from `assets/jlpt/n1/2015-12/question/page-03.jpg` into `written-page-03.review.json`. Question 30 begins on page 3 but its choices continue on page 4, so it is deferred to the next source unit. Every completed item has four options; its answer matches `N1_2015_12_WRITTEN_KEY` and the official answer table.
- Source SHA-256: question page 2 `c5318f40788403c0525c1de2670c8ba6f71efae6b2f77c7d82ccf9b6fe027085`; question page 3 `96ea603c719feb91d99a2a36be112fd42824d796b98a070019f25c1c624ec429`; answer-key page 1 `36857fcd2d5987b0ce37b4dbab1dfd95e957a57552c542bb379291ef62b88529`; source declaration `817145cefd066d55fe4edcf1fa8fe5cf430a93a3fb4a3a3434ba37a47bb6127b`.
- Status: `WRITTEN_RECOVERY_IN_PROGRESS` (29/70 written questions source-transcribed; listening, explanations, translations, and integration not started).
- Durable checkpoint: page-02 questions 1–19 are remote-verified at supervisor unit `68e354b7f6a19a2aefdeca531670972f8695138d`; page-03 questions 20–29 await outer-supervisor commit, push, fetch, and remote persistence verification.

Next: after the supervisor remotely persists this unit, continue written question 30 across `assets/jlpt/n1/2015-12/question/page-03.jpg` and `page-04.jpg`. Do not register an incomplete candidate or change the locked UI.

- Supervisor durable unit: `68e354b7f6a19a2aefdeca531670972f8695138d` | `written source page 02, questions 1–19` | `2026-09-20T23:33:46Z`
