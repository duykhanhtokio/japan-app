# N1 2015-07 conversion checkpoint

- Exam ID: `n1-2015-07-exam-07`.
- Scope: full available exam recovery. Automated listening timing/data is authorized only as candidate/unverified; it must not claim human, perceptual, or audio verification.
- Official sources: `assets/jlpt/n1/2015-07/question/page-02.jpg` and `answer-script/page-01.jpg` were visually read. Their SHA-256 values are recorded in `.jlpt-backups/n1-2015-07-written-page-02-20260920-164059/SHA256-SOURCE.txt`.
- Written page 2: questions 1–17 transcribed into `written-page-02.review.json`; each has four options and matches `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Written page 3: questions 18–25 transcribed into `written-page-03.review.json`; each has four choices and matches the official answer table.
- Questions 26–28 and 30 were source-transcribed from pages 3–4 into `written-page-03-q26-q28.review.json`. Question 29 is not visibly numbered on the available page transition and has not been inferred from the answer key.
- Questions 31–35 were source-transcribed from page 4 into `written-page-04-q31-q35.review.json`.
- Questions 36–38 were source-transcribed from pages 4–5 into `written-page-04-q36-q38.review.json`.
- Status: `WRITTEN_IN_PROGRESS` (37/70, with question 29 blocked). This is not full-exam `structured_ready`.
- Durable checkpoint: written questions 1–28 and 30–38 exist on remote commit `8ba37fdf0fb6ef1283231f592b669b62ef35f690`.
- Unattended full-recovery supervisor/rules are remote-persisted at `1420130d835b15db7258c1cd070f1a691e42b855`; no question 39 content was started in that unit.

Next: continue source transcription with questions 39–45 from `assets/jlpt/n1/2015-07/question/page-05.jpg`. Keep question 29 `BLOCKED_SOURCE_UNREADABLE`; do not infer it from the answer key. After available written units, continue listening candidate, sourced explanations/translations, and candidate integration under the current unattended rules.
