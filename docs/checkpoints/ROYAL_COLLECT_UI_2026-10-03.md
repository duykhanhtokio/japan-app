# Royal collection labels and shop notice — 2026-10-03

Continuation of ROYAL_FINAL_UI_2026-10-03.md, whose implementation/evidence is remote verified at 44e8e70875b923973da7474f7b211633034ec8ad. Native and original-artwork acceptance blockers remain.

Chicken and cow ready-state collection labels were still CSS cream pills. Both now use existing FarmBadgeFrame raster artwork; text colors, press handlers, product images, collection rewards and timing stay unchanged. A first ready-state visual check exposed two-line Japanese labels on small widths. The final badge has minimum width 52 and a single-line label; recorded text is 30×21 px at every tested viewport.

The cosmetic shop footer instruction now uses RoyalExplanationPanel with pale-gold text. Inventory, prices, artwork mappings and equip/purchase logic are unchanged. Other CSS matches in the sweep include scene fallback colors, modal scrims, progress fills, status dots, selected-slot highlights, ordinary inline labels and unused legacy components; their presence alone does not justify replacing gameplay overlays indiscriminately.

## Explicit fixture limitation

These new collection screenshots are from a scratch COPY of the production export. scripts/prepare-animal-ready-fixture.mjs validates exactly six initial idle slot declarations, copies the export outside the repository, and sets only those slots to ready in the copy. It refuses an existing output, an output inside the source export or repository, or an unexpected slot count. Source initial state, production engine, economy, timers, actual routes, image rendering and button handlers are untouched. This tests ready rendering and actual collect→feed behavior; it does not verify natural elapsed production or later care timing. Do not combine these fixture screenshots with the preceding unmodified production navigation timing as though they were one run.

After exporting web, run the preparation script with export and new scratch-copy arguments. Serve the COPY with SPA fallback, then run capture-animal-ready-fixture.cjs with JAPAN_UI_BASE_URL, JAPAN_UI_BROWSER_PATH and optional JAPAN_UI_OUTPUT_DIR. The capture script checks transparent raster badges, single-line text and collect returning to feed. Its Playwright dependency uses CODEX_PRIMARY_RUNTIME_NODE_MODULES.

## Validation

Final capture at 360×800, 430×932, 768×1024 and 1366×768: zero page errors; eight actual collection actions return to feed. Both badges report transparent CSS background, 0px border, no CSS shadow and nine raster images. Shop instruction is visible with rgb(255,244,207) text at all four sizes. Inspected final phone chicken, desktop cow and phone shop screenshots directly; earlier wrapped-label capture was superseded after repair. The full export succeeds. Capture/preparation syntax and whitespace checks pass. Scoped ESLint has zero errors and two existing FarmCosmeticPanel unused-symbol warnings (FarmAreaIcon, getCosmeticIcon). JLPT byte lock stays 10/10. Existing full TypeScript blocker is unchanged; no native-device validation or full-request completion claim.

Source backup SHA-256 before this unit:
- ChickenWorld.tsx: e16d8f417f0cd85af74c1f1c238fcc501d33d7d92d5f2366c3b5d8b4be1acfe6
- CowWorld.tsx: 25e28bed88b8b48bc9799f53fe64b1260cee6d3567d1cd855b4f6a7fe49b9697
- FarmCosmeticPanel.tsx: 027ecc9670f8e5a1e2a46219033c9d9f353517c8b7a62e8235c85249fb448975

Concurrent dialogue commits were fast-forwarded without modifying their content. Require WORK PERSISTENCE PASS before relying on this unit.
