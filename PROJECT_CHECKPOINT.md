# Japan App source checkpoint — Royal A+F V19.3

Checkpoint date: 2026-09-07

This file is the persistent hand-off for future work sessions. Before changing
the UI, read `AGENTS.md` and `docs/ROYAL_AF_DESIGN_SYSTEM.md` completely.

## Current approved direction

- V19.3 rebuilds Home HUD structure to match the approved reference rather
  than approximating it: avatar overlaps an ivory name frame, the compact coin
  frame sits at the right, and Japanese ability/CREDIT rails stack vertically
  across the full width.
- All Step 2 Japanese work-field plaques use the same compact geometry as 国籍;
  the obsolete `wideLabel` override is forbidden there.
- Map marker fill, frame, text and touch area share one outer box. The former
  extra 32 px outer padding is removed, colored fill is clipped inside the gold
  raster rail, and marker text is dark for contrast.
- Prefecture titles occupy their own full-width row. City wrappers explicitly
  use `height = cardWidth / 3`, restoring all city rows while preserving the
  3:1 asset ratio and preventing horizontal overflow.

- V19.2 removes automatic font shrinking from “Choose how you will use the
  app”, keeping it at the same 12 px standard as the English portal rows.
- Registration Step 1 and Step 2 title/explanation frames now share the same
  explicit 132 px minimum, 18 px panel padding, 40 px copy inset and typography.
  This static minimum works even when Step 2 is opened directly and the runtime
  group registry has not yet measured Step 1.

- V19.1 is calibrated from the 18:57 iPhone 16 Plus runtime capture. The top
  HUD grows from 92 to 108 px, its avatar/name and both energy rails are more
  legible, the coin frame is narrower to reserve name space, and the bottom HUD
  grows from 62 to 70 px. The physical top/bottom inset formula is unchanged.
- The Learning Mode heading grows to 22 px while the three cards continue to be
  calculated from the remaining center space, so the larger HUD never pushes a
  card beneath the footer.

- V19.0 implements the compact Home HUD approved on 2026-09-07: shared Back,
  circular player portrait, player name without LV, compact coin counter,
  Japanese ability current/next and a separate CREDIT energy rail.
- The Home footer is fully raster-backed with four equal Japanese-only cells:
  ホーム, ゲーム, ミッション and プロフィール. Top and bottom physical-edge gaps
  share `Math.max(insets.top, insets.bottom) + 8`.
- Purpose selection has falling sakura and one 12 px English standard.
  Registration Step 1 grows around its full title explanation. Step 2 navy
  field plaques are Japanese-only, ivory values remain localized, and 作業
  lists do not display numeric official codes.
- Map titles are anchored to the full centered stage. Map-only marker centers
  use each land's configured color beneath the unchanged gold raster rail.
- Place-row height comes only from the 3:1 raster aspect ratio. Fixed heights
  are forbidden because they expand iPhone rows beyond the right edge.
- Dialogue keeps the microphone visible with transcript text and anchors the
  lantern at the curved lower-right corner.

- All player-facing frames and controls use Royal A+F raster assets. Native
  styles only control geometry, typography, opacity and touch behavior.
- `ROYAL_LAYOUT` in `src/components/ui/RoyalSurface.tsx` is the single source of
  truth for fixed coordinates and dimensions.
- Content-driven Royal surfaces use semantic groups declared in
  `ROYAL_CONTENT_GROUP`. Each surface wraps and grows around its full content;
  surfaces with the same role, relative position and page family adopt the
  largest measured height for the current viewport width.
- Registration headers, form fields, choice rows and final actions are separate
  groups. World header missions, location summaries and scenario explanations
  are also separate groups, so unrelated positions never inherit one another's
  height.
- V18.0 applies the synchronized height to the visible raster frame rather than
  only its wrapper. Absolute navy plaques have their own width/height registry,
  preventing bilingual labels from escaping to the right.
- V18.1 removes the secondary count line everywhere in the `業種` and `職種`
  selectors, including both the closed fields and every expanded list row.
  The UI no longer shows `…職種`/its translation or `…作業`/its translation.
- World-map markers reserve at least 104 px for Japanese plus English.
- `RoyalBackButton` is top-aligned inside every header row; all Royal headers
  retain the shared 12 px horizontal and 8 px safe-area-top offsets.
- Purpose selection and both registration title panels extend to a 2 px
  screen-edge inset.
- Registration Step 1 is Japanese. Step 2 is Japanese plus the language chosen
  by the player on Step 1.
- `PRESS TO START` is centered in a Royal A+F opaque navy frame, hugs its label
  with balanced side insets and uses the welcome title's rainbow color sequence.
- Registration title, guidance, compact fields, bilingual values, expanded
  work-option rows and the final action all constrain text inside safe areas.
- The language selector explains in Japanese that more languages are available
  by swiping upward.
- `#e8e2d6` is the canonical code-rendered ivory background token. All 58 solid
  or translucent code-rendered white backgrounds found in `src/` were migrated
  to this ivory RGB value.
- Locked starter-NPC cards place the grape lock at the upper-right, aligned
  with the unlocked `利用可能` marker.
- The Learning Mode HUD uses only Royal A+F raster surfaces and approved fonts;
  ability and remaining conversation credit are separate energy rails.
- Map labels display Japanese plus English, use enlarged safe text areas, and
  city grids use an 8 px phone inset with a 6 px gap.
- Dialogue NPC feet align with the bottom edge of the `次へ` navigation row.
- The microphone pulses over a three-second cycle and remains visible alongside
  the recognized transcript.
- Current NPC text stays hidden until the red lantern is pressed. Revealing one
  NPC turn is remembered when advancing to later turns.

## Latest changed files

- `src/app/index.tsx`
- `src/app/portal.tsx`
- `src/app/register.tsx`
- `src/app/register/work.tsx`
- `src/app/world/cities.tsx`
- `src/app/world/region/[regionId].tsx`
- `src/app/world/prefecture/[prefectureId].tsx`
- `src/app/world/city/[cityId].tsx`
- `src/app/world/dialogue/[scenarioId].tsx`
- `src/components/ui/RoyalSurface.tsx`
- `src/components/ui/RoyalPositioning.ts`
- `src/components/app/GameHeader.tsx`
- `src/app/home.tsx`
- `src/app/npc-starter.tsx`
- `src/services/progress-storage.ts`
- `src/types/progress.ts`
- `src/data/progression.ts`
- `src/theme/app-design-system.ts`
- `src/constants/theme.ts`
- `src/components/world/ResponsiveWorldMap.tsx`
- `assets/app/ui/royal-af/start-frame-transparent-v1.png`

## Verification status

- `npx tsc --noEmit` and `npm run audit:royal-controls`: passed for V19.0
  after the approved Home HUD and cross-screen fixes.
- Expo Web reaches asset resolution, but this source checkpoint does not contain
  the separately managed complete city/farm/audio asset collection; final export
  must be run after applying V18.1 to the active full project.
- A final visual release still requires inspection on an iPhone-size runtime
  using the production assets.

## Local restore

After extracting this checkpoint:

```bash
cd current-source
npm install
npx tsc --noEmit
npx expo start -c
```

Do not overwrite a newer user project automatically. Compare this checkpoint
with the active `/Users/doduykhanh/japan-app` tree before applying future work.
