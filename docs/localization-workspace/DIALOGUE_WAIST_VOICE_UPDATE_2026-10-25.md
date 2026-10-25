# Dialogue waist boundary and approved voices — 2026-10-25

Publisher report: oversized dialogue panels cover the NPC's face/torso; use the
four previously selected voices instead of the device's rough default speech.

## Layout

- The computed NPC source-image waist is now a hard minimum panel top. The
  renderer never borrows space above it. Two panels remain ordered NPC, Player;
  narrow/short viewports may place them side by side below that same boundary.
- Use compact inner padding and realistic ruby row height. Size the frames to
  their copy, cap them at the lower-screen budget, and page overflow inside the
  frame without scrolling or dropping source text. Ordinary fitting copy has no
  page controls. Preserve source-aligned furigana groups on each page.
- Japanese/native hints alternate within the same frame instead of stacking both
  languages. Keep the existing Royal artwork; hints attach to the bottom left.

## Voice behavior and operational requirement

The offline coverage remains 24 clips / 33 current NPC turn bindings. The current
source-bound planner still finds 7,128 scenarios / 42,768 NPC turns, so 42,735
turns require synthesis. This update does NOT claim 42,768 offline recordings.

Reuse the original four role definitions and category-to-visual-character mapping:
春日部つむぎ/8, 夜語トバリ/118, 玄野武宏/11, 剣崎雌雄/21. These are actual engine
speaker IDs, not the audition numbers. Do not change JLPT casting or test content.

Exact-source recordings play first. Missing or broken recordings request matching
VOICEVOX speech through a local development bridge; its cache identity includes
source, speaker, settings and configured engine version. It serves 24kHz mono WAV
with speedScale0.9 and accepts only those four approved speakers. The bridge is
local to the development Mac, not an external text-to-speech service.

The runtime no longer falls back to expo-speech. When the bridge/engine cannot be
reached, reveal the Japanese text, enable retry, and report audio unavailability;
do not claim approved-voice playback or silently substitute an unrelated voice.
Interrupted and failed players cannot advance a later/replacement utterance.

### Run on the publisher's Mac

VOICEVOX must be installed on the Mac with all four selected voices available.
Open it before testing live synthesis. This environment cannot install or launch
software on the publisher's Mac.

```bash
cd ~/Desktop/japan-app99/japan-app
open -a VOICEVOX
npm run dev:voice
```

`dev:voice` starts Expo and the local voice bridge together; Ctrl+C stops both.
Press i for Simulator and w for web. The bridge uses port50130 and calls VOICEVOX
at http://127.0.0.1:50021. Expo clients discover the Mac from the Metro host (web
uses its current hostname). The phone and Mac must be on the same local network.

Optional configuration: VOICEVOX_URL sets the bridge's engine address;
EXPO_PUBLIC_NPC_VOICE_URL sets the app's bridge URL. Restart Expo after changing
its environment variable. A bridge address reachable by the phone is required;
localhost on a physical phone points to that phone.

Check readiness:

```bash
curl http://127.0.0.1:50130/health
```

A successful response reports ready:true and speakerIds8,118,11,21. If the app is
not installed or those IDs are absent, setup is incomplete. Without the engine,
the 33 valid bundled bindings remain usable, and missing audio is unavailable.
This development bridge is not a deployed production service or an offline
whole-corpus release. Complete offline generation/distribution remains separate.

## Validation

- TypeScript with 8GB heap; changed TypeScript files pass ESLint without warnings.
- 84 geometry/paging cases: hard waist boundary, lower-screen bounds, full source
  reconstruction and preserved aligned ruby.
- Chromium mounted the actual dialogue route/frames with fixture data, source
  character image and waist metadata at390x844,430x932,1440x900,844x390,375x568.
  Normal and long copy: two panels; top>=waist within subpixel rounding; player
  copy remains inside its frame and reconstructs fully across pages.
- Runtime audio mocks: all four roles,33 exact-source binding guards, stale callback
  cancellation, failed-recording recovery through the same approved role, offline
  error and no default-device-TTS import.
- Synthetic local engine fixture: approved IDs/settings, cache isolation and reuse,
  WAV delivery, and excluded speaker20 rejection. Tests stop both HTTP servers.
- JLPT approved UI lock and git diff --check pass.
- No native-device visual/playback, independent pronunciation or naturalness review
  was performed. No new real speech files or unattended generator are claimed.
