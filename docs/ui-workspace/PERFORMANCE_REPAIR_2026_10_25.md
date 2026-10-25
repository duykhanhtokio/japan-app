# Stability repair — 2026-10-25

Publisher reports that the new effects do not improve appearance, cause flashing/stutter and accompany slow loading. This repair supersedes the visual-effects implementation described in EFFECTS_2026_10_25.md.

Changes:
- Remove the animated opacity/translation wrapper around the entire web navigator and restore animation:none on the native stack. Keep navigator identity and screen state stable.
- Unmount the new rays/particles on Home/maps and the hint-lantern glow. Remove their lighting/motion switches from settings; keep optional UI sound/music switches. Old persisted lighting preferences cannot re-enable the removed renderers.
- Prepare the real first route (/home for the development redirect), including its correct backdrop. Home's curated manifest contains 22 actual displayed assets instead of the 62-asset transitive route inventory (62 unique entries after common-control deduplication in the previous route preparer). Shared-module imports are not evidence that every asset is displayed.
- Prepare destination controls and artwork in one pass; do not wait for all controls before starting the background. Publish the selected backdrop before awaiting decode, so the navigation timeout cannot choose a generic backdrop and swap it afterwards.
- Do not preload every city in a prefecture or every location in a city. City/prefecture preparation does not initialize the location-art/NPC catalogs; dialogue still prepares its own background and NPC.
- Bound explicit web decoded-image references to 24 images and 12 million pixels. Release evicted references and allow re-preparation. On web, avoid Asset.downloadAsync's additional image load before the explicit decode. Preserve native asset download and both existing native renderer caches.
- Only mount the welcome-music player on eligible onboarding routes when enabled/foreground; do not allocate/download welcome music on Home, development root redirect or dialogue routes. Preserve lightweight exam audio-session restoration after recording.

Validation:
- node scripts/check-scene-performance.cjs: PASS. Exercises real TypeScript preparation helpers with controlled image/cache/navigation interfaces: shared concurrent decode, web single-decode path, cache count/pixel limits, eviction/retry, native download, early target-backdrop publication, 22 Home assets, parallel preparation, no neighbour preload, lazy location-art imports, own dialogue NPC/background, latest-navigation-wins, removed root fades/ambient mounts, and welcome-player gating.
- ESLint changed TS/TSX and regression script: PASS, no warnings.
- Approved JLPT UI lock: PASS, 10/10. No content/scoring/session/UI-lock changes.
- Repository TypeScript check, 6500 MB heap: unchanged KaigoCourse.tsx:169 string-to-never error remains; no errors reported for changed files.
- git diff --check: PASS.

Limits:
No full-app device/browser runtime, cold-start timing, frame-rate measurement or native-audio audition was possible in this checkout, which lacks the artwork set. These checks verify implementation/logic, not a claim that all device-specific stutter is eliminated. On the publisher's Mac, validate cold start and Home -> map -> city -> dialogue -> Back with this revision; profile any remaining delay against actual logs. Retain approved artwork/layout and learner data.
