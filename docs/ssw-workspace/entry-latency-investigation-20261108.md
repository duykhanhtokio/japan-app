# Kaiwa / Tokutei entry latency investigation — 2026-11-08

## Verified causes

1. src/data/dialogue-content/npc-audio-release.json declares 42,768 NPC turns, 7,128 scenarios and 96 MP3 packs. Total packed bytes are 1,512.4 MiB; per-pack min/median/max are 10.67/16.18/19.88 MiB. Pack durations range from 1,864.488 to 3,473.784 seconds. These are release metadata, not new network benchmark measurements.
2. packedRecordingFor selects a long pack plus a start/duration offset. Native dialogue-npc-audio downloads that entire remote asset before local seeking. Cache helps repeat visits but never removes the first large download. A short spoken line currently entails a multi-megabyte cold pack fetch through GitHub Releases.
3. The preceding free-release change made Start await prepareDialogueEntry. It moved the wait out of the dialogue screen but did not reduce bytes; it made the button appear slow. Removed that awaited prerequisite now; scenario-card prefetch remains.
4. prepareSceneRoute previously awaited decorative artwork on navigation, bounded to 180ms. Tokutei dispatch now starts without awaiting artwork; required-state callbacks still gate navigation correctly. This removes this specific delay, not all course loading.
5. Development uses expo-router asyncRoutes. First access may require Metro to build and transfer the route chunk; the publisher screenshot includes a 6500ms iOS Bundled entry. This is bundler timing, not a measured end-to-end UI latency.
6. createDeferredCourse waits two animation frames then starts the course import and caches the result. Course components have large dependency graphs. The manufacturing Metro validation scans 66 source modules. Materialized agriculture source/data is 25.2 MiB and manufacturing is 8.14 MiB; this inventory is not a claim that every byte is evaluated on entry. JSON decode/inflate and catalog/test construction still run synchronously when actually requested.

## Concrete completion plan

Kaiwa: split the existing approved recordings at the already-authored turn offsets, without regenerating voices. Publish a small file per scenario or per turn, with revision/hash metadata; bundle the first utterances needed for offline entry or download a location's small clips before use. Preserve exact text/role/speaker checks. Cache prepared native clips/players; prefetch the next NPC turn during the learner turn. Do not restore remote long-pack seeking as an unverified workaround. The current patch removes the Start network gate; cold voice onset is not yet solved until the audio delivery format changes.

Tokutei: put a small selector/calendar manifest in the entry bundle; defer lesson body, language data, image maps and test questions until that particular lesson/test is selected. Keep catalog route UI independent from the full reader module. Warm only the selected/likely next module while the sector menu is visible, with bounded memory and cancellation; do not preload all seven large courses at startup. Test an installed release build separately from Metro development to remove bundler/network overhead from device acceptance. Measure tap→route paint, route paint→catalog ready, data decode, image download and audio onset separately on cold and warm caches. Proposed goals are visible route feedback within 100ms and a cached small catalog within 300ms; these are targets, not achieved device results.

## Other requested fixes

Removed the redundant profile title/avatar/name/JLPT/work-icon/Other block below the existing HUD; all detail sections, the HUD and bottom Edit remain. Sector subtitles now call uiText with explicit keys, including a new 13-language industrialManufacturing row, so the Vietnamese source string no longer leaks when a different locale is selected.

Validation: stalled-artwork navigation test, preserved required-state gate, no awaited Kaiwa pack in Start, profile/HUD and locale assertions; free release regression; unchanged JLPT UI lock. Native simulator/audio timing remains unverified. No voice/audio payload was regenerated or downloaded during this investigation.
