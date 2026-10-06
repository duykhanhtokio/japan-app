# City-by-city geography repair

User scope clarified 2026-10-06: shared ordinary service scenes are permitted for restaurants, cafes, laundries and convenience stores. Geographic attractions, famous districts and streets require correct place imagery. Category alone cannot identify a place.

The companion JSON enumerates all 814 cities and 7,112 locations. `scripts/audit-location-geography.cjs --write` regenerates it from canonical IDs, corrected categories and the exact place registry. `--require-complete` fails while any individual review remains pending. Shared-service permission is not a claim of exact real-branch photography. The conservative pending list includes stations, shopping venues, museums and baths for individual review. Generic city-named parks are still pending, rather than silently treated as verified tourist landmarks.

Sapporo first pass: Clock Tower has its own artwork; Odori Park and TV Tower legitimately share a scene showing the tower from the park. Other Sapporo entries remain pending where individual review is required. Whole-catalog remediation remains in progress. Existing two Osaka mappings are preserved.

## Image generation

Built-in imagegen; final assets under `assets/app/life/location-backgrounds/places/`. Prompts:

- `sapporo-clock-tower.png`: geographically faithful Sapporo Clock Tower, white timber clapboard drill hall, red pitched roofs and square clock belfry, trees and Sapporo office buildings; portrait 1024x1536; polished semi-realistic anime 2D/2.5D, fine lines, soft cel shading, centered safe composition and empty foreground; no Tokyo observation tower, characters or UI.
- `sapporo-odori-tv-tower.png`: Sapporo TV Tower seen from Odori Park, red steel lattice, rectangular observation cabin/digital clock, park fountain, lawns and flower beds, local city blocks; same style and portrait composition; no Tokyo/Osaka skyline substitutions.

Official identity references are recorded per location in `src/data/location-place-artwork.json`. Artwork is an illustration, not a current photographic record. No dialogue, microphone, backdrop blur, card geometry or JLPT UI changes.

- `sapporo-hokkaido-shrine.png`: Hokkaido Jingu main worship hall in Maruyama forest, broad copper-green roof, central timber gabled entrance, stone courtyard, same portrait anime environment style; no Fushimi Inari tunnel, pagoda or waterfront shrine.

## Sapporo continuation — 2026-10-06

Seven additional original illustrated scenes are bound to stable city/location IDs: Sapporo Station south facade (star clock/JR Tower), Ganso Ramen Yokocho (covered ramen alley), Susukino (Nikka crossing), Nijo Market (seafood market sidewalk), Jozankei Onsen (Futami suspension bridge), Maruyama Zoo (polar-bear underwater visitor tunnel), and AEON Mall Sapporo Hassamu (striped low-rise facade/glazed AEON panel). Existing Clock Tower, Odori/TV Tower and Hokkaido Shrine artwork is preserved. Common service scenes remain shared according to the user policy.

Built-in imagegen generated the seven new portrait 1024x1536 assets. Prompts specify the factual local architecture or facility, polished semi-realistic anime environment style, full-bleed framing and empty foreground for the dialogue NPC; exclude unrelated city landmarks, UI and borders. Zoo scene depicts its documented polar-bear pavilion rather than pretending to reproduce an unverified entrance. Mall facade features were inspected from a dated exterior reference; the scene uses a new pedestrian viewpoint and is an illustration, not a current storefront photographic record. Source photos are not shipped in the app.

Identity/feature references:
- Station: https://www.jr-tower.com/about
- Ramen alley: https://www.visit-hokkaido.jp/en/spot/detail_11224.html
- Susukino: https://visit.sapporo.travel/discover/city/susukino/
- Nijo: https://visit.sapporo.travel/itineraries/02/
- Jozankei: https://jozankei.jp/spot/105/
- Zoo pavilion: https://www.city.sapporo.jp/zoo/b_f/b_18/hottukyoku.html
- Mall identity: https://www.aeon-hokkaido.jp/aeon/shop/hassamu/
- Mall facade feature reference (2012): https://commons.wikimedia.org/wiki/File:AEON_MALL_Sapporo_Hassamu.jpg

All 21 Sapporo locations now have an assigned place illustration or an allowed shared service scene. This means artwork assignment coverage, not on-device visual acceptance or exact reproduction of every architectural detail. Source-resolution new images were inspected. Native simulator verification remains pending. No dialogue layout, NPC anchoring, microphone, blur, transitions or JLPT files were edited. Whole-catalog work remains incomplete; next city is CTY-002 Aomori, starting with its pending individual-review rows in the companion JSON.
