# N5 05 runtime evidence

Run from repository root: `node scripts/check-jlpt-original-n5-05.mjs`, `node scripts/check-jlpt-original-n5-audio.mjs 05`, `node scripts/check-jlpt-original-n5-05-adapter.mjs`, `node scripts/check-jlpt-approved-ui-lock.mjs`, and with Chromium path `JAPAN_UI_BROWSER_PATH=/tmp/chromium node scripts/check-jlpt-original-n5-browser-audio.cjs 05`.

The three saved harness sources use esbuild, Playwright, React Native Web, actual production runner/shared UI, Expo audio/asset/image and AsyncStorage, plus real SafeAreaProvider. Adjust absolute repository/harness paths when reproducing. Restore the actual Back bitmap matching its LFS SHA and provide NotoSansJP.ttf for QA typography. QA focus/backdrop context and image intrinsic-metadata resolver are supplied outside production. Compile build05 then run test05. Audio uses actual Audio objects and Range-capable HTTP streaming, no mocked playback.

Select wrong option 2 in first question (correct 3), save, play from zero, pause, capture answer/image, Back/reopen/resume and verify chosen color, submit with 90 unanswered, score 0 correct/1 wrong/90 unanswered, open review. No pageerror. Three final screenshots at 430x932 were inspected. Browser asset report also verifies pause/resume across music end and all five image decodes.

Not a full Expo Router build, native/iPhone test or human perceptual approval. TypeScript output has the existing non-JLPT TS2352 and no JLPT diagnostic.
