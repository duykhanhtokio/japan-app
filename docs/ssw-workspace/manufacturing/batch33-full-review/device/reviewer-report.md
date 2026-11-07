# AI 6 — device/runtime review, 2026-10-29

## Result

**Physical-device execution: BLOCKED / NOT RUN.** No physical device, native app launch, simulator run or human/device certification is claimed.

- Host: Linux x86_64. `adb`, `xcrun`, `xcodebuild`, `emulator`, `idevice_id`, `ideviceinfo`, `lsusb`, `flutter`, and `eas` were absent from PATH.
- `/dev/bus/usb` was not exposed; Android SDK environment variables were absent. No Android/iOS device-control tool was present in the exposed tool registry.
- Plugin Management discovery searched `BrowserStack Sauce Labs physical mobile device testing`. Returned results did not contain a relevant device-testing integration; this is not proof that no such integration exists anywhere in the directory. No external account was connected and no paid device session was created.

## Read-only source/asset preflight

`runtime-preflight.py` followed a lexical local import/require closure from the actual manufacturing course and shared backdrop: 98 modules, 1,312 candidate assets. Among those candidates, 1,154 were unresolved Git LFS pointers, 2 were missing from this sparse working tree and 156 had non-pointer bytes. This is an over-approximation including conditional/dynamic imports, not a claim that all assets are used or decoded on the manufacturing screen. Byte presence is not visual approval.

Known farm backdrop, Royal button and Japanese font inputs remained pointers. The two missing tracked cafe assets are listed in the environment ledger and the handoff. No image/font, dependency, app source or common UI was replaced, suppressed or bypassed.

## Native bundle attempt

A temporary smoke project imported the actual `ManufacturingCourse`, actual native dependencies and existing app source without UI/storage/image adapters. It did not install an APK or launch a device.

1. The first Android Metro export failed because the temporary QA resolver disabled hierarchical lookup, hiding a nested dependency that was actually installed. This was a harness configuration mistake; the temporary config was corrected and the initial evidence is marked `BLOCKED_QA_CONFIG`, not a project defect.
2. The corrected Android Metro export failed after 2,360 modules at missing tracked `assets/game/backgrounds/tokyo/cafe/tokyo_cafe_01.jpg`, imported via `game-assets` → `prepareSceneRoute` → `AppBackdrop` → `ManufacturingCourse`. The command exited1; no native-bundle PASS is claimed. Existing unresolved LFS assets remain an additional blocker once sparse omissions are restored.

Exact logs and command metadata are in `android-export-final.txt`/`.json`. No retry is pending and no native build/dev server was intentionally left running.

## Concrete handoff

`physical-test-matrix.json` contains 12 unexecuted native test groups, required physical iPhone/Android evidence, orientations and 13 UI locales. `PHYSICAL_TEST_HANDOFF.vi.md` gives commands verified against the locally installed Expo CLI help and preserves the existing development-only manufacturing route gate. Installed speech-recognition documentation confirms a development build is needed.

`physicalDeviceVerified`, `nativeApplicationLaunched`, `simulatorVerified`, `nativeReviewed`, `domainReviewed`, `humanReviewed` and `releaseReady` remain false. Generated plans/inventory/build failure records are not device execution results.
