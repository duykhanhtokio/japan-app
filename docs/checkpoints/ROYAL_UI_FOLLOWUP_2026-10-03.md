# Royal UI follow-up — 2026-10-03

This is an implementation checkpoint, not complete visual acceptance. The eight-item request remains partially fulfilled. Continues the repair recorded in ROYAL_UI_REPAIR_2026-10-03.md and preserves independently published Ibaraki dialogue progress.

## Additional verified source defects and corrections

- `src/app/game/index.tsx` passed literal `0` as HUD diamonds although FarmGameState has its own diamonds balance. It now passes `resolvedState.diamonds`; gold and keys retain their corresponding balances.
- `FarmCosmeticPreview.tsx` ignored equipped `barn_set` and `barn_roof`, reading only `barn_light`. It now chooses the actual equipped building asset in that order. Building previews reserve a larger stage and display the original artwork. Empty previews show an instruction rather than an unrelated emoji. Multiple simultaneously equipped building layers are not yet composited in the preview.
- Cosmetic assets carry transparent scene-sized canvases. `cow_barn_japanese.png` is 853×1844, with meaningful alpha bounds (13,385)–(836,1388); residual alpha below 8 extends outside these bounds. Added measured bounds for 194 original cosmetic assets and a clipping component that applies one uniform scale to both axes. Shop thumbnails and building previews fit visible artwork instead of empty canvas. No raster asset was redrawn or stretched out of proportion.
- Farm HUD now shows readable EXP percentage and a progress indicator below the level in its own text column. Full exact EXP remains accessible. Avatar, copy and resource cells keep independent layout slots. Icons and resource callbacks retain the previous repair.
- The orchard harvest button still had a flat CSS board and occupied normal flow above absolute scene layers. It now uses the existing raster content frame, stays at the bottom with safe-area spacing, and retains its harvest callback. Developer controls are reserved above the button in development builds.
- Active chicken/cow feed, care and timer surfaces and plot number/status badges now use existing raster frames, keeping click handlers and urgent text color. Their Japanese text explicitly uses the loaded royal font. Removed unregistered generic crop-state emoji rather than substitute unrelated artwork. Removed unreachable legacy AnimalWorld fallback from the five-area Game route; the historical file remains available.
- The Game clock previously ran an interval throughout the mounted route lifetime. It now starts on focus, stops on blur, and resolves actual current time immediately on return. This removes that verified background render source; it does not prove the user's complete stutter symptom resolved.

## Verification and limits

- Ran real React Native Web components in the browser harness at 360×800, 430×932, 768×1024 and 1366×768. Rechecked HUD, shop and equipped Japanese barn after the final artwork edits. Scene/badge component checks use a React Native Image shim for expo-image, so they cannot validate native caching or transitions. Images and measurements are under `docs/ui-workspace/royal-repair-2026-10-03/`.
- HUD seam centers remain exactly half of each viewport (180, 215, 384, 683px). Coin and diamond button callbacks and cosmetic equip callback succeeded at every size. Screenshots show different character thumbnails and the selected Japanese barn.
- These component screenshots use sample state, router/safe-area shims and zero insets. They do not certify the full app, actual safe areas or native platform behavior.
- Full Expo app trials returned HTTP 200 but rendered no body content by 180 seconds; a separate attempt using two Metro workers also timed out after 60 seconds. No repeated-navigation video or whole-app performance acceptance was obtained. iOS/iPadOS/Android simulators are unavailable here.
- TypeScript still reports the pre-existing TS2352 at `life-content-repository.ts:41` concerning scenario entries missing `type`. No new diagnostics from this repair. Full TypeScript is not PASS.
- JLPT approved UI lock: 10/10 unchanged. `git diff --check` succeeded.

## Eight-item acceptance status

1. Home: explicit full-bounds artwork separated from text padding; web coverage checked at four widths. Native screenshot regression not reproduced; native acceptance remains open.
2. JLPT 学習: plain royal navy title, frame removed; web component verified.
3. Transitions: known green fallbacks, image readiness and hidden Game timer addressed. Exact observed flash/stutter source and end-to-end absence remain unverified.
4. Vocabulary: opaque search, explicit colors and plain vocabulary/example surfaces; web component verified. Native acceptance open.
5. Game HUD: separate layout, centered seam, resource images, real balances and EXP indicator implemented; web component verified. Native acceptance open.
6. Icons: original royal rice/area images reused. Additional title searches found the rice file and no standalone food/feed file. Three August design sheets were materialized and visually inspected: カラフルな動物農場ゲーム素材シート.png, かわいい農場ゲーム素材シート.png, のんびりファームUIアセットシート.png. They contain chicken/cow feed illustrations, but no proof establishes them as the approved royal icon set; none was silently substituted. Individual fruit/tool icons and their emoji remain unresolved.
7. Character shop: each unlocked row uses its own assetKey and measured artwork bounds; equip/purchase logic retained. Missing mapping never uses a generic character.
8. Panels: prior raster conversion covers the shop, preview, warehouse, crop/orchard pickers, care/economy and restaurant instructions; this follow-up adds orchard harvest. The unused legacy AnimalWorld branch is removed, and active status/timer/feed/care badges use raster artwork. Developer-only controls and small semantic alert/progress indicators still use CSS surfaces. Integrated native visual acceptance is not PASS.

Do not mark all eight items complete. Resume with integrated native coverage, safe-area checks, repeated-navigation video/performance tracing, approved missing icon recovery and the remaining Game surfaces.
