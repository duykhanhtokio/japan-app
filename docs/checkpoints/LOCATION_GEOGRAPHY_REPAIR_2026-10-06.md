# Location geography audit and Osaka corrections — 2026-10-06

User reported Tsutenkaku and Dotonbori showing Tokyo and requested reviewing all location images.

## Root cause and audit scope

All 7,112 locations were audited against the assignment metadata and effective role corrections. There were no location-specific geographic mappings. 2,680 source assignments cycle category illustrations across 10 variants; 4,432 later rows use a deterministic category hash. This verifies functional category only, never city/place identity. The Landmark base illustration visibly depicts Tokyo Skytree. Its variants can be selected by 117 Landmark locations; 116 locations other than the named Tokyo Skytree therefore have cross-place risk. Other scenic categories also lack place-specific provenance.

The 26 category base images were visually inspected together. Indoor workplaces are representative functional illustrations, not verified interiors of their named actual branches. They must not be described as exact-place imagery. 1,153 Landmark/Castle/Shrine/Nature/Park/Amusement Park rows need geographic/place review; no claim is made that all are visually wrong. Several source place names are visibly garbled or inconsistent with their city, so inventing artwork from those strings would repeat the error.

## Implemented concrete corrections

- LOC-027-02 / CTY-027 / 通天閣: dedicated Shinsekai/Tsutenkaku illustration, reviewed identifiable tower silhouette.
- LOC-027-03 / CTY-027 / 道頓堀グリコサイン: dedicated Dotonbori canal/Ebisubashi/Glico sign illustration.

Geographic overrides now use stable location IDs and reviewed city/name/category metadata. They run before category/season fallback, so city cards, location detail, dialogue and pre-navigation image preparation select the same place image. No global Landmark image was replaced with Osaka: Tokyo and other cities keep their existing entries pending review. Images are stylized illustrations rather than photographic records of current facade signage. Built-in image generation used, outputs copied unchanged to assets/app/life/location-backgrounds/places/.

Primary references: https://www.osaka-info.jp/en/spot/tsutenkaku/ ; https://www.osaka-info.jp/en/spot/dotonbori/

## Generation prompts

Use case stylized-concept. New Japan App dialogue environment illustration. Input image STYLE REFERENCE ONLY, replace its entire PLACE and architecture. Subject: Tsutenkaku in Shinsekai, Osaka: recognizable low steel lattice observation tower with large broad square observation head, slender spire, four splayed lattice supports, viewed from Shinsekai shopping street, low-rise lively Osaka storefronts, not a skyscraper. Actual Tsutenkaku silhouette, not Eiffel Tower and not Tokyo Skytree. Match polished semi-realistic anime environmental painting, fine architectural detail, soft warm clear-morning lighting, restrained colors. Portrait 2:3 1024x1536 full-bleed composition with generous pedestrian foreground for NPC overlay; essential landmark in upper-middle so landscape/card crops still identify it. Real place visual landmarks, not an invented hybrid. No Tokyo Skytree, Tokyo Tower, generic Tokyo skyline, temple framing borrowed from reference, UI, ornate frame or watermark. No foreground close-up people. Do not reproduce source image or scenery; only match painterly style.

Use case stylized-concept. New Japan App dialogue environment illustration. Input image STYLE REFERENCE ONLY, replace its entire PLACE and architecture. Subject: Dotonbori Osaka: recognizable Dotonbori canal and Ebisubashi bridge, pedestrian riverside promenade, dense Osaka commercial facades, the famous Glico billboard of a running athlete raising both arms against blue running-track background beside the canal. Accurate broad low canal-side composition, no tower. Match polished semi-realistic anime environmental painting, fine architectural detail, soft warm clear-morning lighting, restrained colors. Portrait 2:3 1024x1536 full-bleed composition with generous pedestrian foreground for NPC overlay; essential landmark in upper-middle so landscape/card crops still identify it. Real place visual landmarks, not an invented hybrid. No Tokyo Skytree, Tokyo Tower, generic Tokyo skyline, temple framing borrowed from reference, UI, ornate frame or watermark. No foreground close-up people. Do not reproduce source image or scenery; only match painterly style.

## Validation and remaining work

Full location/role checks and scene-mapping checks pass for 7,112 locations; geographic metadata checks assert the two Osaka city IDs, names, categories, distinct images and file existence. Other location IDs cannot select these two overrides. Route transition contract PASS; JLPT UI lock 10/10 PASS; scoped ESLint and whitespace PASS. Generated images inspected at source resolution. Native simulator visual acceptance pending.

IMPORTANT: Whole-catalog geography remediation is not complete. After these two corrections, 1,151 priority scenic locations still require exact-place review and 7,110 rows remain unverified as exact geographic artwork. Full inventory/checkpoint is LOCATION_GEOGRAPHY_AUDIT_2026-10-06.json. Do not mark them complete merely because their category is correct. Next work should verify factual names/cities, then add reviewed per-location assets in the same registry, prioritizing the remaining 114 Landmark rows susceptible to generic Skytree images.

