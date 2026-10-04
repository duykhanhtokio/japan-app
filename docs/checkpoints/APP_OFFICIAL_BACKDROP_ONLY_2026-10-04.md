# Official backdrop ownership correction — 2026-10-04

User authorization: “ok vậy thực hiện triệt để tại phiên sửa này cho tôi”, following the audit of legacy backgrounds throughout 筆記学習 and the rest of the app. This explicitly authorizes background/style cleanup in the four relocked UI files below. No scoring, answer/session storage, audio mappings, question data, qualification rules, or dialogue data changes.

Base: recovery/jlpt-n3-n1 at 49fb2c7c79f4c0429644857e35b1113ec9bd07ac. Working tree was clean before edits. Source and SHA backups are outside the repository; Git and this checkpoint are the durable record.

## Implemented

- AppBackdrop owns a persistent cover image outside the native stack. All 筆記学習 routes and dictionary routes share the existing official study-light artwork. Native screen content is transparent. Route changes within study do not remount the image.
- Pages without their own scene artwork inherit an existing official image: study-light for light content; profile-details for world directories/history, settings, logs, lessons and education portal pages using light text. All scene routes retain their existing scene source; they do not receive a second root image. No new artwork was created.
- Removed the examStarted/onStartedChange visual handshake and activeExam fill. Starting, resuming, submitting, reviewing and exiting an exam never disables the official backdrop.
- Removed 91 legacy page/dimmer/content fills across 45 source files, captured in scripts/background-layer-contract.json. This includes the neutral exam page/paper/header/audio/results/review fills, old action-button fills, grammar/vocabulary example/normal tab fills, old fallback colors in scenes/farm/map, and modal dimmers in registration/settings/farm/NPC reward.
- Removed mounted empty full-screen wash/tint views in welcome, city, prefecture, location, NPC starter and mission. Welcome native background image actually unmounts when unfocused.
- JLPT navigator and non-inline confirmations use the already approved RoyalContentPanel content frame for readability; no second full-screen backdrop or colored dimmer is introduced. Preflight restart stays inline without a panel frame. Learning help uses the existing official content frame. Transparent actions retain borders and dark text.
- Work/mission/dialogue no-scene result/error branches explicitly render an existing official image so removing their fallback color does not leave a blank screen.
- Preserved functional answer selection, correct/incorrect feedback, progress bars, locks, whiteboard canvas, and existing official raster card/HUD/scene artwork. These are content/state indicators, not extra page backgrounds. Historical unused components, backups and asset files are not deleted; they are not introduced into live routes.

## Verification

- check-background-ownership.cjs PASS: 45 files / 91 removed fills; prevents restoring those legacy fills or the exam backdrop-disable path.
- Real Catalog/N1/UI/AppBackdrop components in a mocked native host PASS: one identical official image instance across catalog/loading/preflight/continue/active exam/results/review/exit and /N5/test -> /N5/grammar; zero root study images upon entering a scene route. Saved answer q1=1, saved listeningPositionMs=1234, correct score=1 preserved. Inline restart has no modal. React-test-renderer host checks are NOT device/visual verification.
- FocusedImageBackground host lifecycle PASS: hidden scene image unmounted and child state retained.
- JLPT navigation contract PASS.
- UI lock PASS 10/10 after the specifically authorized four-file relock; other six locked files unchanged.
- TypeScript: only the pre-existing TS2352 at src/services/life-content-repository.ts:41, missing type on SC-HKD-HAKODATE-001. No additional diagnostics from changed files.
- Web production export attempted; blocked by pre-existing Git LFS pointer assets/app/ui/royal-af/button-wide-v2.png rather than a materialized PNG in this checkout. This is not a successful production build.
- Browser/native screenshots unavailable in this environment (no Chromium/native simulator). No claim that device flashes or visual layout have been fully verified. Runtime visual acceptance remains pending.

## Authorized UI hashes

| File | Previous SHA-256 | New SHA-256 |
|---|---|---|
| `src/app/[level]/[section].tsx` | `133c36b5c993151d80249f37659a220a88ed18c2738fe8a7a3d11acbf007dc87` | `83ad6544a560bda8b08eaa83e25dc2a51d9246cf980e92b4edfa025973c2e5bf` |
| `src/components/jlpt/N1OfficialTrial.tsx` | `cf997285d69027ae5c563a8d2fe9b887672a438ffe1eca85d718f99c67e53d55` | `b007dce70ab8a5a5ce5160e804614f326c87b31c1c1d0f0c7324faf542629daf` |
| `src/components/jlpt/ui/JlptExamUI.tsx` | `097fab56f46a4ef99579a0dcaf741f90b99450351ffa8f9b04602ae606de6f93` | `fe165bc8c31b96251b932e60d53836d63cfa450cfbd5641fb0f40b108b502c1b` |
| `src/components/jlpt/ApprovedJlptExamCatalog.tsx` | `f404f0365b32f93d3b146562e876b8782b84695c8d2b0aa5e9881a4adbc264da` | `24de357c855e5e22f52965309f3602778ac6e5a67c2638ac3d7dc7eb1bb2349e` |
