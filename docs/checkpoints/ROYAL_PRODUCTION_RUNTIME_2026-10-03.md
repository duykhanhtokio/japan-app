# Royal continuation: recovered persistence and production runtime — 2026-10-03

Acceptance remains incomplete. Native platforms, exact green flash cause and missing approved artwork remain open.

## Persistence recovery

Recovered the interrupted UI commit `a9cff6dd` in the surviving checkout. Direct Git push lacked credentials. Preserved the new Ibaraki commits and transferred all 38 UI/evidence files through the authenticated GitHub connector. PNG evidence is stored as ordinary Git blobs with a narrowly scoped .gitattributes exception, preserving app asset LFS rules. The recovered checkpoint is remote-verified at `6383b0affc305545949aa17527dda9f800f77b1e`; the fresh branch checkout reported WORK PERSISTENCE PASS and the JLPT lock remained 10/10. Original surviving checkout and its local merge remain intact.

## Production navigation measurements

Exported the complete Expo application with `__DEV__=false`, served it locally with SPA fallback, and navigated actual Home, Learn, Game and vegetable controls. No state, router, image or safe-area shims. The repository's initial game state itself contains level 30, 9,999,999 EXP and large balances; those are not proof of realistic newly installed account behavior, and this UI work does not alter them. The earlier development fixture distinction does not remove these base-state values.

430×932 final run: 15 measured actions across three cycles, zero page errors. Initial ready time 980 ms; measured navigation actions 51–273 ms. First Home→Learn has a 168 ms long task and a 150 ms RAF gap. The pre-picker run recorded 178 ms and 166.6 ms respectively. These are separate runs, not proof that the picker repair improves transition performance. Map return was exercised between vegetable and Home but not separately timed. The 360×800 run also completed 15 measured actions with zero page errors; its first Learn task was 188 ms with a 166.6 ms RAF gap. No stutter-free claim. This production run proves long tasks are not exclusively a development-build artifact; it does not identify their complete root cause or prove the user's native flash absent.

The production entry bundle is approximately 128.8 MB uncompressed. 7,561 generated dialogue JSON files total 86.8 MB; Metro's require.context includes them in the bundle even though loadDialogueTurns accesses a scenario only on demand. Bundle size is a concrete packaging concern, not proven causal attribution for the measured Home→Learn task. Do not change content storage or delete authored dialogues based solely on these figures. The local export includes unresolved audio LFS pointers outside this visual/navigation scope and is not a release package.

## Picker repair and evidence

CropPlantPanel still passed a CSS background, border and shadow to its raster parent. Removed those redundant shell styles. Gold balance now uses the same raster panel and approved original coin, with minHeight explicitly zero to preserve a compact badge. Replaced unsupported lock/price glyphs with approved original lock/coin images. Growth time, yield and EXP use Japanese labels with unchanged values. Wheat retains the approved rice artwork; other crop icons have no verified approved mapping here, so their broken glyphs were removed without inventing replacement art. Their empty icon slots remain an incomplete artwork item. Purchase, planting, lock and close handlers and all economy values are unchanged.

Opened the real crop picker through a plot, captured it, checked its parent has 0px border, transparent CSS background and no box shadow, and closed it through the real close control. Raster frame remains visible. Screenshots inspected at 430×932 and 360×800; these are browser viewports, not native devices. Script and JSON are in docs/ui-workspace/royal-production-2026-10-03/.

## Validation and next work

Scoped ESLint and capture script syntax checks pass. Production export and full-app navigation succeed. JLPT lock stays 10/10. TypeScript still reports only the pre-existing TS2352 in life-content-repository.ts:41 (SC-HKD-HAKODATE-001 lacks type); full TypeScript is not PASS. Diff whitespace check is clean.

Next: CPU trace attribution for first Learn render, native reproduction of the green flash and safe areas, recovery of approved individual crop/fruit/tool/care art, remaining orchard picker inner CSS sweep. Native simulator and device access remain unavailable in this environment. Do not mark the eight-item request complete.
