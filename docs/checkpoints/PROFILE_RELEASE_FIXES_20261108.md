# Learner profile release fixes — 2026-11-08

## Scope

- Points/Premium account screen uses explicit copy in all 13 supported languages. Status is stored as a key, so switching language also updates an already displayed error. The free first-release policy is unchanged and is explained on this screen. No simulated authentication, payment or balance was added.
- Shared HUD avatar opens a localized photo menu (camera / album / cancel); the name retains profile navigation. Camera permission is requested on demand. Image-only system picker, square editing, app-owned document storage on native, persistent data URI on web. Changing a photo publishes to mounted HUDs. Cancel, denial and failed save preserve the prior photo; old app-owned files are deleted only after a successful replacement. User album originals are never deleted. Failed image rendering falls back to the original Royal avatar.
- Profile achievements previously hard-coded three unlocked cards plus a dimmed Golden Key card. Tokyo used the map-marker artwork seen as a white square in the report. Remove those unsupported sample cards. Retain the first-conversation achievement, derive its status from saved dialogueCompleted, and show its condition and status visibly. Localize achievements and certificate headings/help text. Other profile sections remain unchanged.

## Verification

`node scripts/check-profile-release.cjs`: passed 13-language key completeness, Premium locale switching after an error, camera unavailable/permission denial/cancel, atomic save failure, replacement cleanup, relaunch persistence, web persistence, avatar-menu camera/album actions, and removal of unsupported achievement cards. Native UI and device APIs are mocked.

`npx expo config --type introspect --json`: native photo/camera usage descriptions present; existing Japanese microphone description retained. Image-picker configuration does not block microphone access needed by Kaiwa.

`node scripts/check-jlpt-approved-ui-lock.mjs`: 10/10 protected files unchanged.

Full TypeScript check remains blocked by absent unrelated files in this sparse checkout. No substantive diagnostics in the new photo service or copy modules; PlayerAvatar's missing RoyalPaperPanel dependency is a sparse-checkout limitation. No camera/photo-library test on a physical device or visual simulator verification was performed.

## Mac update

The SDK54-compatible expo-image-picker ~17.0.11 dependency and config plugin require rebuilding the native development client, not only reloading Metro. After pulling and npm ci, apply `npx expo prebuild --platform ios` without --clean, then `npx expo run:ios --no-bundler`, and restart the acceptance launcher. Camera capture must be tested on a physical device; simulator supports selecting an imported album image.
