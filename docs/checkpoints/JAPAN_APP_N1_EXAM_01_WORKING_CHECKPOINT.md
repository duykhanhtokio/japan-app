# WORKING CHECKPOINT — JLPT N1 07/2012 exam 01

- Updated: 2026-09-12
- Approved Mac source: `/Users/doduykhanh/Desktop/japan-app99/japan-app`
- Status: **layout/review integration updated; audio review v2 and Mac Simulator QA pending**

## Immutable approved sources

- Question PDF SHA-256: `73f024f8b0fff45ae3e0e7b6546788ed4e79a47fe667729cbf76e9e947e0a8dd`
- Answer/script PDF SHA-256: `1a4d6433625fb90acf9da6c827c64aefd396467403f887dcf321a7abe9d2d175`
- Audio SHA-256: `3921ae53abec4f655342655d7eed4604becee0bebc26ab4909133eb55115832b`

## Verified data

- Written responses: 70/70.
- Listening responses: 36/36.
- Total response records: 106/106, all IDs unique.
- Unique audio segments: 35/35 verified by listener.
- Invalid answer references: 0.
- Combined verified dataset SHA-256: `65b31a10b1c780f9cea6cb314c34a895df3856341a00aa3dced6d09452091904`.
- Listener report SHA-256: `b93543816bd680b62cf09c85ac2068ac11c3fa31df414941b2bea0d9c3280635`.

## Runtime changes

- Replaced the six-question display dataset with an adapter over the verified 106-record JSON.
- Preserved shared reading passages and all five `★` questions.
- Added two cropped visual-option images derived from the approved question PDF for listening 問題1 items 1 and 6; no textual option was invented.
- Listening now plays each of 35 verified ranges independently. 問題5 item 3 shares one range between its two scored responses.
- Exam mode records played segment IDs individually; practice mode retains replay/pause.
- Session schema upgraded to version 4 and uses `jlpt:n1:2012-07:exam-01:session:v1`.
- Submit cancels the range timer and pauses audio before storing the submitted result.
- Active-exam Back cancels the timer and pauses audio before navigation; unmount cleanup only clears JavaScript timers.
- Results remain raw counts. No unofficial scaled score or pass/fail judgment was invented.
- Questions are grouped by `sectionId + problemNumber`; each `問題` heading and shared instruction renders only once.
- A shared reading passage renders only before the first adjacent question that references its `passageId`.
- Listening 問題 headings/instructions render once while each unique segment retains one playback control; 問題5 item 3 retains one control for two responses.
- Audio segment stopping now follows `useAudioPlayerStatus().currentTime`; the timeout is a five-second-late fallback and is invalidated by a playback generation token.
- The prior 35/35 boundary review is preserved as history, but runtime audio status is revoked to `needs_runtime_review` after the product owner observed offset playback.
- Added `audio_review_v2.json` and `audio_runtime_test_v2.json`; all 35 runtime entries remain `CHƯA KIỂM TRA` until actual Mac verification.
- Re-cropped the two visual questions independently from their 1531×2063 page renders and render them with separate aspect ratios.
- Added `n1-2012-07-visual-option-regions.ts` with per-question source page and crop coordinates; both remain `needs_review` until Simulator approval.
- Review mode displays the official answer, the user's choice state, question/answer source pages, and the exact source-PDF transcript for listening items.
- The approved answer/script PDF contains no detailed explanations. Each record therefore remains `explanationStatus: missing`; no AI explanation was invented.

## Checks

- `npx tsc --noEmit`: PASS.
- `npm run lint`: PASS with 0 errors and 15 pre-existing warnings outside changed N1 files.
- iOS export in the collected workspace: BLOCKED by missing unrelated `assets/app/home-cards/writing.jpg` in the collected source package.
- Simulator acceptance test: NOT RUN in this Linux workspace.

## Required next action

Install the second payload into the approved full Mac source, run `npx tsc --noEmit`, `npm run lint`, and `npx expo start --clear`. Visually approve both crop regions. Run the audio-review-v2 utility, return its JSON, then execute and record all 35 in-app runtime checks. Do not label the exam complete until audio v2, bundle and device checks pass.
