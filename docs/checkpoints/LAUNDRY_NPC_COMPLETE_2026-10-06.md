# Laundry NPC completion — 2026-10-06

User authorized new function-specific NPCs using the old NPC art rules.

## Scope and design

The previous audit's nine missing laundry locations now have a dedicated Laundry role (Laundry Attendant / ランドリー店員). Existing 25 roles have distinct imagery; no extra replacements are needed for those roles. Runtime corrections now total 85 of 7,112 locations. Laundry is appended as role 26, preserving existing IDs and unlock order. Test access remains temporary; stored unlocks are not rewritten.

Recovered old rule: full-body semi-realistic anime/2D–2.5D Japanese mobile game art, fine linework, controlled soft shading, natural proportions, restrained colors, occupationally distinct clothing/accessories/identity, true-alpha PNG, no real logos. Existing bank is the baseline; supermarket provides secondary style reference. Built-in image generation used. Generated originals copied byte-for-byte; no image postprocessing.

Assets:
- assets/app/life/npcs/laundry.png — 1024×1536 RGBA full-body male laundry attendant, pale-blue shirt, navy apron, folded towels.
- assets/app/life/location-backgrounds/laundry/01-clear-morning.png — dedicated morning laundry interior. One base scene; no claim of ten weather/season variants.
- assets/app/life/rewards/cards/laundry.png — matching Royal collector card, Japanese job plaque, five gem sockets.

NPC, scene, Japanese category label, collectible card and progression registries are integrated. Obsolete convenience-store background assignments are bypassed only for Laundry. Static route artwork preparation regenerated so new images join the existing pre-navigation preparation. PNGs use narrow Git LFS exclusions, storing actual image bytes in this commit for connector publication.

## Final prompts

### NPC
Use case: stylized-concept. Asset type: Japan App full-body occupational NPC sprite, transparent PNG. The two input images are STYLE references only: match the established bank and supermarket NPC set, not their faces/identity. Create ONE distinct Japanese male laundry shop attendant/owner age about 38, short neat dark hair, gentle approachable smile, natural stylized human proportions, moderate anime semi-realistic polished Japanese mobile game 2D/2.5D illustration, delicate clean linework, soft controlled cel shading, restrained harmonious colors, soft studio light, matching reference detail. Neutral standing pose facing viewer with subtle three-quarter angle. Pale blue work shirt with sleeves neatly rolled, navy practical apron, charcoal trousers and plain comfortable dark shoes. Hold a modest stack of neatly folded white towels at waist height in one hand; the other hand gently gestures as explaining a washing machine. Clearly a laundry attendant, no scanner, shopping basket or groceries. Entire character including hair, fingertips and BOTH shoes fully visible, centered with transparent margin, portrait 2:3 canvas ideally 1024x1536, same full-body framing as bank reference, usable both in dialogue and collectible cards. Real RGBA transparent background, no room, no colored backdrop, no floor, no cast background shadow, no labels, text, real logos, frame or watermark. Preserve established art style; new distinct face.

### Scene
Use case: stylized-concept. Asset type: Japan App occupational dialogue scene. Input image is a STYLE reference only: same polished semi-realistic Japanese anime environment illustration, fine architectural detail, warm restrained colors and soft natural light. Generate a different location: clean neighborhood Japanese coin laundry interior in clear morning. Rows of stainless front-loading washers and dryers along both sides, practical folding counter, small laundry baskets and folded towels, tiled floor, windows near entrance. Eye-level perspective with spacious unobstructed center aisle and generous foreground floor for an overlaid full-body NPC. No foreground character, no large faces; no people needed. Machines visibly circular washer doors, not refrigerators or shopping shelves. Portrait 2:3 composition matching reference ideally1024x1536, artwork fills entire frame edge to edge. No text, signs, logos, brands, UI, frame, watermark. Consistent warm photopainterly anime background supporting reference NPCs.

### Card
Use case: compositing. Asset type: Japan App collectible NPC card. Input 1 is EDIT target/template: existing ornate black navy gold Japanese royal card. Input2 is the new laundry attendant to insert, preserve his face, hair, shirt and navy apron identity exactly. Input3 is correct laundry setting. Produce ONE portrait 2:3 card matching template overall frame silhouette, delicate gold filigree, mother of pearl accents, top flower medallion, bottom FIVE dark empty round gem sockets, cream Japanese name plaque. Replace ONLY convenience store portrait with chest-up laundry attendant from image2 holding folded towels, replace setting with soft focus image3 laundry machines. Keep frame design/style. Plaque exact Japanese text 'ランドリー店員', smaller English text 'LAUNDRY'. No convenience store uniform, scanner, grocery, receipt. Character polished semi-realistic anime art consistent with input2. Full ornate border visible within canvas, no clipping, no UI or watermark.

## Validation

Actual repository audit: 7,112 locations, 85 corrections, 26 distinct NPC images; all nine laundries have correct role, image and scene. Every registered role has a collectible card and matching category scene. NPC progression duplicate guard and temporary access preservation pass. UI lock 10/10 and route transition contract pass. Scoped ESLint passes. TypeScript retains only pre-existing scenario-index SC-HKD-HAKODATE-001 missing type at line47. Browser inspection uses an isolated Expo asset preview importing the real asset registries, with the dialogue's existing NPC box geometry; it is not full-app flow acceptance. The isolated Expo web export succeeds. Chromium asset inspection passes at 390×844, 430×932, 932×430 and 768×1024: all images decode, scene covers viewport, NPC/card stay inside viewport, no page errors. Detailed results: LAUNDRY_NPC_BROWSER_2026-10-06.json. Native simulator acceptance remains pending.

