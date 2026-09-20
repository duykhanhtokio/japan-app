# N1 2015-07 conversion checkpoint

- Exam ID: `n1-2015-07-exam-07`.
- Scope: full available exam recovery. Automated listening timing/data is authorized only as candidate/unverified; it must not claim human, perceptual, or audio verification.
- Official sources: `assets/jlpt/n1/2015-07/question/page-02.jpg`, `question/page-05.jpg`, `question/page-06.jpg`, `question/page-07.jpg`, `question/page-08.jpg`, and `answer-script/page-01.jpg` were visually read. The page 2 and answer-key SHA-256 values are recorded in `.jlpt-backups/n1-2015-07-written-page-02-20260920-164059/SHA256-SOURCE.txt`; the page 5 SHA-256 is recorded in `.jlpt-backups/n1-2015-07-written-q39-q45-20260920-174306/SHA256-BEFORE.txt`; page 6 has SHA-256 `896eb237c1084db6bd9d19775b73614b00b0406634cc51b792ac314cbcfe6215`; page 7 has SHA-256 `d6923d9de633f5bfab829146100a3bd0e564fa9d4dbe8385c4ed0806a5921cd4`; page 8 has SHA-256 `c8a4bfeb10740aca082273d62165b1feffe466daf1f5410f59b02960015f93cf`.
- Written page 2: questions 1–17 transcribed into `written-page-02.review.json`; each has four options and matches `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Written page 3: questions 18–25 transcribed into `written-page-03.review.json`; each has four choices and matches the official answer table.
- Questions 26–28 and 30 were source-transcribed from pages 3–4 into `written-page-03-q26-q28.review.json`.
- Local blocker `BLOCKED_SOURCE_UNREADABLE` — question 29: direct visual inspection of `question/page-03.jpg` and `question/page-04.jpg` shows page 3 ending inside question 28, page 4 completing that item, and the following item also printed with the visible number `28` before question 30. The answer table has a question-29 slot with key `3`, but it does not establish which duplicated-number source item is question 29. The unresolved fact is the authoritative numbering/content mapping; no question-29 record has been inferred from the answer key.
- Questions 31–35 were source-transcribed from page 4 into `written-page-04-q31-q35.review.json`.
- Questions 36–38 were source-transcribed from pages 4–5 into `written-page-04-q36-q38.review.json`.
- Questions 39–45 were source-transcribed from page 5 into `written-page-05-q39-q45.review.json` and checked against `N1_2015_07_WRITTEN_KEY`.
- Questions 46–48 were source-transcribed from pages 5–6 into `written-page-06-q46-q48.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 49 was source-transcribed across pages 6–7 into `written-page-06-07-q49.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 50 was source-transcribed from page 7 into `written-page-07-q50.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 51 was source-transcribed from page 7 into `written-page-07-q51.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 52 was source-transcribed from page 7 into `written-page-07-q52.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 53 was source-transcribed across pages 7–8 into `written-page-07-08-q53.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 54 was source-transcribed from page 8 into `written-page-08-q54.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 55 was source-transcribed from page 8 into `written-page-08-q55.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Question 56 was source-transcribed from page 8 into `written-page-08-q56.review.json` and checked against `N1_2015_07_WRITTEN_KEY` and the official answer table.
- Status: `WRITTEN_IN_PROGRESS` (55/70, with question 29 blocked). This is not full-exam `structured_ready`.
- Durable checkpoint: written questions 1–28 and 30–38 exist on remote commit `8ba37fdf0fb6ef1283231f592b669b62ef35f690`; questions 39–45 exist on remote commit `d2c8e17e05632978366ecdedf21b0e923665ae8d`; questions 46–48 exist in the startup remote-tracking history at commit `cf50bfc4e13f92be6af8ad2e666ff321c3393087`.
- Unattended full-recovery supervisor/rules are remote-persisted at `1420130d835b15db7258c1cd070f1a691e42b855`; no question 39 content was started in that unit.

Next: continue source transcription with question 57 on `assets/jlpt/n1/2015-07/question/page-08.jpg`, continuing to page 9 if required by the source. Keep question 29 `BLOCKED_SOURCE_UNREADABLE`; do not infer it from the answer key. After available written units, continue listening candidate, sourced explanations/translations, and candidate integration under the current unattended rules.

- Supervisor durable unit: `e4487abefb371f1498a9606b9ef2f3fd6907813b` | `written question 49 across source pages 6–7` | `2026-09-20T09:54:40Z`

- Supervisor durable unit: `281c899cd7742820c0713eaabdb6142daa759e5c` | `written question 50 from source page 7` | `2026-09-20T09:58:22Z`

- Supervisor durable unit: `16686157949425e0705c54f566ece184fe09dc51` | `written question 51 from source page 7` | `2026-09-20T10:03:07Z`

- Supervisor durable unit: `f39d14140a07004061b22b6f24d2a4fff5014bcc` | `written question 52 from source page 7` | `2026-09-20T10:07:54Z`

- Supervisor durable unit: `b88f4a54c54642cfffea1828bab746a153408441` | `written question 53 across source pages 7–8` | `2026-09-20T10:11:43Z`

- Supervisor durable unit: `e5607d54c4e34ec8222132b25c6721eb77f36dfa` | `written question 54 from source page 8` | `2026-09-20T10:14:48Z`

- Supervisor durable unit: `6970eab910a4faf1499d2294fe6e6474becd865c` | `written question 55 from source page 8` | `2026-09-20T10:18:32Z`

- Supervisor durable unit: `4043146f9bc405c8492459aa2cac9bcb826d85db` | `written question 56 from source page 8` | `2026-09-20T10:21:42Z`
