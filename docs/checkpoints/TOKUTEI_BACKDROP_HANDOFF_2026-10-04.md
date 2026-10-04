# Home → Tokutei backdrop handoff experiment — 2026-10-04

User requested testing the suspected empty-background interval when opening the Tokutei industry list.

Home and Tokutei now use their existing approved full-screen artwork in a persistent root layer outside the navigator. Keep the outgoing bitmap mounted while loading the destination; remove it only after destination Image onLoad. Stable image keys retain the destination native view during removal. Ignore stale callbacks after rapid Back. On load failure keep outgoing artwork and log the error. Only these two routes opt into this handoff. No artwork, blur strength (40), cards, frames, HUD, BottomNav positions, exam UI or data changed.

The two routes use transparent navigator theme background so the persistent artwork remains visible. Other routes keep DefaultTheme and their original background ownership. Explicit full-parent image dimensions prevent React Native Web intrinsic image dimensions overriding cover geometry.

Checks: Expo web export passes; JLPT UI lock 10/10 and navigation contract pass. Chromium 430×932 and 768×1024: four Home → Tokutei → Back visits each, 115 sampled animation frames in total, zero frames without at least one loaded backdrop image, zero page errors. Background bounds equal viewport. BottomNav retains bounds (0,848,430,84) and (0,934,768,90); one visible Home button. Screenshots inspected, background covers the frame. DOM sampling is not a native compositor or pixel-flicker measurement.

TypeScript retains the existing TS2352 at src/services/life-content-repository.ts:41 (SC-HKD-HAKODATE-001 missing type); no additional reported errors.

Native iPhone/Android unavailable here. This is a targeted experiment, not confirmation that the reported iPhone flash is fixed. Test the exact Home tile → industry-list interval in Simulator after pulling this branch.
