# NPC reward overlay repair — 2026-10-06

User authorized fixing the overlapping reward card shown over the Sapporo clock-tower dialogue. Base: 1c9808912b1eb09004a1e5d1094a1633cc4ac782, recovery/jlpt-n3-n1.

The reward modal now covers the underlying mission, NPC and dialogue with the existing Royal lacquer color. Removed the rotating spring reveal. Card dimensions follow viewport and safe-area bounds; landscape uses a card/copy row. A scroll fallback preserves access to the close control with larger text or short viewports. The card uses its own image background rather than inheriting the dialogue backdrop. Reward calculation, category artwork, unlock state and the caller's return navigation are unchanged.

Validation: production web preview of the actual component at 430×932, 932×430 and 320×568, both progress and unlock states; viewport-sized opaque modal, loaded card images, close action and no page errors. Screenshots inspected. Scoped ESLint, diff whitespace, all-route contract, generated artwork inventory and JLPT UI lock pass. TypeScript has the existing TS2352 in life-content-repository.ts:41 (SC-HKD-HAKODATE-001 missing type), no diagnostic in the reward component.

The preview route is temporary and is not shipped. Native iOS/Android visual acceptance remains pending; browser evidence does not establish native zero-flicker.
