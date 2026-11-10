# Manufacturing physical-device acceptance

The isolated QA app uses the repository's actual ManufacturingCourse, AppBackdrop, SafeAreaProvider and native navigation stack. It bypasses the unrelated Expo Router entry. It does not replace product components, storage, image rendering or grading with mocks. It starts in English with learner `device-manufacturing-qa`; change only the generated App.tsx language prop to repeat target-language checks.

## Recreate and export

From the repository root:

```sh
node scripts/manufacturing/create-device-qa.cjs /absolute/outside-repository/manufacturing-device38
node scripts/manufacturing/device-preflight.cjs /absolute/evidence/preflight.json
```

From that generated directory:

```sh
NODE_OPTIONS=--max-old-space-size=3072 EXPO_OFFLINE=1 CI=1 node node_modules/expo/bin/cli export --platform android --max-workers 1 --output-dir export-android
NODE_OPTIONS=--max-old-space-size=3072 EXPO_OFFLINE=1 CI=1 node node_modules/expo/bin/cli export --platform ios --max-workers 1 --output-dir export-ios
node node_modules/expo/bin/cli start --lan --port 8032
```

Exports verify native JavaScript and assets only; they are not APK/IPA installations or hardware tests. For an SDK54-compatible Expo Go installation, open the LAN QR/URL on each physical phone. Record the Expo Go version. For standalone native testing, create and sign a development build using normal local Android/iOS tooling; iOS installation requires a Mac and an authorized provisioning identity. Do not substitute a simulator for the requested physical phone.

## Physical preflight

Android: enable USB debugging, authorize this workstation, then run `adb devices -l`. Select the explicit physical serial; record model and OS using `adb -s SERIAL shell getprop ro.product.model` and `adb -s SERIAL shell getprop ro.build.version.release`. A serial marked unauthorized/offline is blocked. Use `adb -s SERIAL shell screencap -p /sdcard/manufacturing-qa.png` then `adb -s SERIAL pull /sdcard/manufacturing-qa.png EVIDENCE.png` for evidence. Do not publish serials or personal notifications.

iPhone: on an authorized Mac run `xcrun devicectl list devices`; record the physical device model/iOS version. Pair and trust it, enable Developer Mode if required by the chosen development build, and open the QA app. For a signed local build, `xcrun devicectl device install app --device DEVICE_ID PATH.app` followed by `xcrun devicectl device process launch --device DEVICE_ID org.japanapp.manufacturingqa` provides repeatable installation and launch. Capture screenshots directly on the phone and transfer only the application view. A listed device alone is not an acceptance pass.

## Record on both phones

Record app/source revision, device model/OS, viewport/orientation, locale, time, result and evidence filename for each step. Mark unperformed steps BLOCKED, never PASS.

1. Cold launch the actual course; open all three specialties and all fifteen recognition packs. Verify every image loads and captions remain legible in portrait and landscape, with no clipping at system insets.
2. Read each gallery at normal size and enlarged if supported. Verify panel codes, mathematical signs, μm/mm values and SVG-derived geometry are readable. Confirm the quiz does not reveal computed answers or instrument names in its image/caption before answering.
3. For every pack, choose an answer, move forward/back, close and reopen the pack, and restart the app. Confirm the exact selection and question position resume. Submit and verify the score and all four reasons appear only at the appropriate submitted stage.
4. Confirm explicit restart requires confirmation: cancel preserves the attempt; confirm creates a clean attempt. Use the existing automated stale-revision tests as additional evidence, not as a replacement for device behavior.
5. Repeat translation visibility in each of the twelve target locales; verify option order, formulas, line wrapping and captions. Pay particular attention to Bengali, Devanagari, Myanmar, Thai and Khmer glyphs. Record missing glyphs rather than declaring native-language approval.
6. Exercise Android back and iOS navigation gestures, background/foreground, larger system text and screen-reader focus/labels for image/option/submit controls. Confirm no accidental submission or hidden controls.

## Current environment result

The captured Linux preflight has neither `adb` nor `xcrun`; no authorized physical device was discovered. Parent-reported CUA access and headless browser download attempts did not provide physical hardware. Native export results are recorded separately. Physical Android and iPhone acceptance remains BLOCKED pending actual devices and the above evidence. No human, native-language, hardware or release certification is claimed.
