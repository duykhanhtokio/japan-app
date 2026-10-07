# N5 06 runtime evidence

Run repository validators check-jlpt-original-n5-06.mjs, check-jlpt-original-n5-audio.mjs 06, check-jlpt-original-n5-06-adapter.mjs and check-jlpt-approved-ui-lock.mjs. Chromium asset check: JAPAN_UI_BROWSER_PATH=/tmp/chromium node scripts/check-jlpt-original-n5-browser-audio.cjs 06.

Saved harness sources use esbuild/Playwright with actual production runner/shared UI, React Native Web, real Expo audio/asset/image, AsyncStorage and SafeAreaProvider. Update absolute repo/harness paths for reproduction, provide NotoSansJP.ttf and Back bitmap matching LFS hash. QA focus/backdrop context and intrinsic-image resolver are external to production. Compile build06 then run test06. Real Audio objects and Range HTTP streaming, no playback mocks.

Wrong option 1 selected in first question, correct option 2; save, play opening, pause, inspect answer/image, Back/reopen/resume and selected color, incomplete submission with 90 unanswered, 0 correct/1 wrong/90 unanswered, review; no pageerror. All final screenshots430x932 inspected. Separate asset check crosses music boundary and decodes all five images.

Not full Expo Router/native/iPhone/perceptual approval. Full TS only existing non-JLPT TS2352. Authoring moved to isolated clone after concurrent written repair changed snapshot during initial synthesis; stable reconciled source was regenerated.
