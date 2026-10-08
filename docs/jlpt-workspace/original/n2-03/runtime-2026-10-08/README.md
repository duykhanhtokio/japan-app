# N2 03 runtime evidence

Production `N1OfficialTrial` and shared exam UI ran unchanged in an isolated RN-web harness at 430×932. Real Expo audio/asset/image, AsyncStorage, approved Japanese font and Back artwork were used. Focus/backdrop context is supplied by the harness; this is not full-router or native-device validation. Headless Chrome runs in one process because this environment restricts Unix sockets.

PASS: start, save one correct and two wrong choices (including both independent answers to the shared dialogue), audio from opening, pause, Back/reopen/resume, submit with103 unanswered, results1 correct/2 wrong/103 unansweredof106, review; no page errors. The three screenshots were visually inspected.

Asset-only browser QA decoded the full recording, tested pause/resume and automatic music-end/announcement continuation. PCM/ffmpeg checks confirm30 dialogue recordings,31 response mappings and exactly1440000 music frames at24000Hz. Not a full human perceptual listening review.

Harness scripts are stored for reproducibility. Set `JLPT_QA_BROWSER` to an installed headless shell and install esbuild at `/tmp/n203-harness-deps`; dependencies come from the repo. Run `build03.cjs`, `test03.cjs` and `assets.cjs` from the repo root. Temporary bundle defaults to `/tmp/n203-qa-www`.
