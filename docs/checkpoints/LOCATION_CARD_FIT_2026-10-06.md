# Location card scene fit — 2026-10-06

User approved the new laundry NPC and requested shared-code integration, correct occupational placement and smaller correctly fitted scene imagery across all locations. Attachment 2026-10-06 17.23の画像.jpeg was available and inspected: it shows city-list cards with greatly magnified scene contents.

## Cause and fix

RoyalLocationCard applied left/right offsets and height directly to a static React Native Image without overriding its width. Both Image.ios.js and Image.android.js insert the bitmap's intrinsic width/height ahead of the caller's style. The intended narrow artwork window could therefore retain the 1,024-pixel source width. This explains the excessive crop seen on iOS.

The shared card now sizes a View window using the existing frame coordinates (8% sides/top, 61% height), clips at its edge, and places the Image at explicit 100% width and height inside it. Cover uses a uniform scale to fill the window; there is no nonuniform stretch, added background, letterbox or onLayout pass. Existing frame art, card proportions, text, controls and navigation remain unchanged. All city-list location cards use this shared component.

Laundry was already integrated in remote commit 3b085af4: NPC sprite, scene, collectible card, Japanese label and progression role. The audit remains valid: 7,112 stable location IDs, 85 role corrections, 26 distinct category NPC images, all nine laundries mapped to Laundry. No unnecessary duplicate characters or alternative scene assets were created in this fix.

## Validation

- Scoped ESLint passes.
- Location/NPC audit passes for 7,112 locations and all 26 category cards/scenes.
- Route transition contract passes: 58 templates and 145 TSX files.
- JLPT approved UI lock passes 10/10.
- Actual shared RoyalLocationCard and real scene registry exported in an isolated Expo preview. Chromium checks all 26 categories at 390×844, 430×932, 932×430, 768×1024 and 1366×768. Scene Image bounds equal the clipped window bounds, cover is active, all images decode and no page errors occur. Portrait and landscape screenshots inspected. Detailed geometry: LOCATION_CARD_FIT_BROWSER_2026-10-06.json.
- This is component browser validation; full-app navigation and native simulator acceptance are not claimed.

Pre-edit RoyalSurface.tsx SHA-256: f57a7619c211c0b1eea739646ac34dec76315d03ffa33970109ac55305e00572. Original backed up in the existing backup workspace.
