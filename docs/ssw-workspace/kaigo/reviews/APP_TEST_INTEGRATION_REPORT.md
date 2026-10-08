# Kaigo internal app testing integration — 2026-10-08

User authorized integration and durable GitHub storage after checkpoint dd83c9ec1f1ecd0ad7dc02d884805b62190fa05c. Earlier authoring-only restrictions are superseded only for this internal app testing step. Professional approval, candidate selection and production release are not implied.

## What is now connected

In an Expo development build, open 特定技能学習 → 介護. The new route is guarded by __DEV__. Existing sector artwork and JLPT locked screens remain intact. The runtime contains the original 56-day schedule, 54 core lessons, 270 lesson questions, 167 terms, 8 NPC profiles and two mock forms (45 skills questions / 60 minutes; 15 Japanese questions / 30 minutes). Eight optional candidate lessons and their 40 questions appear separately and do not replace the core curriculum.

Each lesson exposes knowledge, terms, staged typed dialogue, one chosen transfer scenario and five checks. Dialogue models and fixed replies follow an attempt and explicit self-check. This is not automatic semantic evaluation. Practice and quiz state are stored locally. Mock state restores answers, question position and remaining time; the timer runs while this screen is active, and pauses outside it. Review, Vietnamese explanations and answers appear after submission, with confirmation for early submission. Five original authoring SVG diagrams have deterministic PNG runtime copies. Content revisions isolate stale saved sessions.

The converter whitelists runtime fields from 39 immutable inputs, preserving core text and answer order while excluding private source bytes, source references and authoring review metadata. Source drafts, historical evidence, approval flags and curriculum are unchanged.

## Checks actually performed

- `node scripts/check-kaigo-app-test.mjs`: PASS, 39 immutable inputs, 1177 IDs and 26 behavioral assertions. This validates technical state transitions, not the unexecuted clinical case specifications.
- Focused ESLint over the new Kaigo files and modified route files: PASS, zero warnings/errors.
- `node scripts/check-jlpt-approved-ui-lock.mjs`: PASS, 10/10 byte-locked files.
- Full repository `tsc --noEmit`: FAIL at unchanged `src/services/life-content-repository.ts:47`, TS2352 (existing scenario index entry lacks required `type`). No Kaigo diagnostics. This unrelated data contract was not modified.
- Focused React Native Web bundle and actual KaigoCourse browser interaction: PASS. Catalog, typed main dialogue/self-check/fixed reply/next stage, mock reload at question 2 with saved answer, hidden pre-submit Vietnamese review, cancel/confirm early submission, and practical diagram rendering tested. No page errors or non-HMR console errors. Screenshots cover 430×932, 820×1180 and 932×430; no horizontal overflow in the tested practical screen.
- `git diff --check`: PASS before commit.

Evidence and screenshots are in `../runtime-tests/2026-10-08/`. The browser harness uses existing Royal components, fonts and artwork; it does not certify the complete Expo Router app or native devices. The archived browser script records executed assertions, rather than claiming a standalone packaged harness.

## Remaining limits

No iOS/Android device installation or native runtime test occurred. Voice capture/recognition, generated NPC voice/artwork and automatic semantic or clinical scoring are not implemented by this integration. Dialogue uses typing and self-check. Domain/native Japanese review, measured lesson timing, candidate equivalence/selection and professional content gaps remain open. This is a development testing checkpoint, not a release approval or a claim that all Kaigo authoring is complete.

## Resume

Use `scripts/build-kaigo-test-content.mjs` to regenerate runtime data, then `scripts/check-kaigo-app-test.mjs`. Pull this branch and open the Kaigo entry in an Expo development build for native verification. Keep optional candidate lessons separate until their existing review gates are resolved.
