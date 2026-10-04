# Screen background cleanup — 2026-10-04

User authorization: remove redundant backgrounds for 文法/JLPT and apply the same cleanup throughout the app while retaining the current visible artwork.

- 文法, JLPT catalog/loading/restart, vocabulary, and all RoyalPageBackground consumers now use one precomposited artwork; the separate full-screen color-wash View is removed.
- Learning overview, registration, work registration, N5 journey, profile, and profile details use artwork with the existing color wash baked in. Source dimensions, cover geometry, and runtime blur are preserved. Original source images remain available for scene/card reuse.
- The welcome screen no longer mounts a blurred duplicate behind a contain image. Its one primary image covers the viewport. Welcome camera/button loops and petals stop when the route loses focus.
- Every current ImageBackground import in app/components passes through FocusedImageBackground. Five expo-image farm/map backdrops use FocusedArtwork. Hidden routes release their image source without unmounting screen content. The stack permits focus updates (`freezeOnBlur: false`) so hidden sources actually clear.
- The opaque profile details modal disables the background of the profile behind it.
- The empty transparent NPC sky View is removed.
- Remaining city/prefecture/location dimmers and card frames are part of the currently visible design; they are not duplicate page artwork. Their scene image sources now follow the same focus rule. No global scene dimmer or NPC/card art is deleted.

Validation:

- JLPT approved UI lock: PASS 10/10, before and after. Locked exam-taking files unchanged.
- Focus lifecycle regression with the real React Navigation useIsFocused hook and mocked native image hosts: PASS. Grammar -> exam -> grammar clears hidden sources and restores active ones; child saved state stays mounted across both transitions. Covers ImageBackground and expo-image artwork.
- Six precomposited assets: same dimensions; maximum channel difference from the original image plus existing wash <= 1/255.
- ESLint for new background components, root layout, welcome, and learning overview: no errors/warnings.
- git diff --check: PASS.
- Full TypeScript check remains blocked by existing TS2352 in src/services/life-content-repository.ts:41 (legacy SC-HKD-HAKODATE-001 index lacks type). That service is byte-identical to HEAD and outside this cleanup.
- No iPhone simulator or full-app visual approval claimed. Browser QA could not run: no installed browser, and the available Chromium download returned an invalid archive. Runtime focus validation above is a component regression, not a device screenshot check.

Rebuild flattened backgrounds with `python scripts/bake-page-backgrounds.py` after obtaining the original LFS assets (Pillow required only for this development script).
