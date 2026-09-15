# Farm cosmetic assets

- 45 PNG assets mapped to the current `farm-cosmetics.ts` asset keys.
- Canvas: 512 x 512 pixels.
- Format: RGBA PNG with transparent background processing.
- Source art: `item(1).png` and `item2.png` supplied by the project owner.
- `cosmetics-manifest.json` maps every `assetKey` to its project-relative path.
- `cosmetics-contact-sheet.jpg` is the visual QA overview.

Copy the `assets` directory into the root of `japan-app` while preserving paths.

The source boards are flattened catalog images. These crops are suitable for
shop thumbnails and prototyping. Before final production animation, inspect
alignment of face/head overlays against the exact chicken and cow base sprites.
