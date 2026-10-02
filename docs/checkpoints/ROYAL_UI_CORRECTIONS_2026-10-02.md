# Royal UI corrections — 2026-10-02

User authorized corrections based on 17:17 and 17:19 Simulator screenshots.

- Restore the three Home study-mode cards to their prior full-image layout and overlay text. Only their border changes.
- Add border-only raster slicing and an underlay rendered behind the frame. Credit has a solid full-height crimson fill inside the gold border; EXP uses the same framed track. Credit/qualification calculation and bar heights stay unchanged.
- Explicitly constrain all five rank PNGs to 72×72, prevent flex shrinking and clip overflow.
- Profile Detail has its own SafeAreaProvider; statistics wrap when needed and centered labels use the usable frame width. The work icon has explicit dimensions; communication level uses raster artwork instead of the flat CSS badge.
- Apply matching raster frames to daily/weekly/monthly, work, and key Mission panels.
- Keep Farm HUD on one row but separate avatar/level/EXP from gold/diamond/key into two plaques. One Back control goes to the farm map from gameplay and Home from the map.

Validation: web bundle HTTP 200 (137073383 bytes); UI lock PASS 10/10; farm artwork geometry PASS 5 scenes × 7 viewports; split HUD geometry checked at 8 widths; Home layout and single-Back source contracts pass; git diff --check passes. TypeScript reports only the pre-existing life-content-repository.ts(41,9) TS2352 generated-data issue. Actual device/Simulator visual review remains pending; this environment cannot operate the user’s Mac Simulator. Existing dialogue-content commits are preserved by building on the latest remote tree.
