# Return to corresponding city after reward — 2026-10-06

User requested returning to the city location-card list shown in their screenshot after collecting the NPC card.

The shared dialogue reward close handler now dismisses to `/world/city/<cityId>`, using the current location's city ID and then the scenario's city ID. It retains the prepared-artwork navigation path and keeps the reward covering the dialogue until destination preparation succeeds. Missing city metadata falls back to the location screen, then normal Back. This covers both progress and unlock reward buttons; rewards, scoring and other Back buttons are unchanged.

Production browser validation completed a real dialogue, recorded its reward, clicked Continue, and returned to the corresponding Sapporo city list at 430×932 and 932×430, with no page errors. UI lock and route contracts pass; scoped ESLint has no errors and one existing hook dependency warning. TypeScript retains only the known TS2352 in life-content-repository.ts:41. Native simulator acceptance remains pending.
