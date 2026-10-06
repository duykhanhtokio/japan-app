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

## Aomori continuation — 2026-10-06

Ten original portrait 1024x1536 illustrated scenes are assigned to Aomori's individually reviewed locations: Aomori Station east entrance (&LOVINA / 2024 east building), Nebuta Museum Wa Rasse, A-FACTORY, Sunroad Aomori, Aomori Gyosai Center, ASPAM, Asamushi coast/Yunoshima, Hakkoda summit wetlands boardwalk, Gappo Park coast, and Showa Daibutsu at Seiryuji. Remaining eleven ordinary service locations retain shared service backgrounds. This is artwork assignment coverage, not exact photography or native-device acceptance. The entire catalog remains unfinished; next city is CTY-003 Morioka.

Geography correction: LOC-002-06 previously named AEON Mall Shimoda, whose official address is Oirase rather than Aomori city. It now represents Sunroad Aomori at 青森市緑3丁目9-2, preserving the stable location and scenario IDs. The canonical location name/address/description/hours and its two generated scenario place-name mentions are corrected. Existing authored dialogue remains unchanged. The audit now recognizes 魚菜センター as a characteristic market name even when its category is Restaurant.

Built-in imagegen prompts specify each site's architecture or geographical features, an empty dialogue foreground, portrait full-bleed composition and semi-realistic anime environment style. Wa Rasse uses its red ribbon facade; ASPAM its triangular mass; A-FACTORY its six gabled units and Aomori Bay Bridge; Sunroad its silver sloping panel and sunburst tower; Gyosai its seafood-topping market aisle; Asamushi its wooded offshore Yunoshima; Hakkoda its rounded ridges/wetland boardwalk; Gappo its coastal pines/cherry trees; Showa Daibutsu its crowned bronze seated figure with hands resting together in the lap. A-FACTORY's missing bridge and the Buddha's initially incorrect raised hands were corrected before integration. Station facade follows JR East's dated architectural plan; the illustration is not a claim of a current photographic storefront survey. Reference photos/plans are used for feature inspection only and are not shipped with the app.

Per-place official sources remain in the artwork registry. Additional source details:
- Station exterior plan: https://prtimes.jp/a/?c=17557&f=d17557-689-705d9328a1758afb1b6720c17a606efa.pdf&r=689
- Station opening identity: https://www.jreast.co.jp/press/2023/morioka/20240226_mr01.pdf
- Shimoda municipality: https://www.aeonmall.com/facility/detail/1221/
- Sunroad address/hours: https://www.sunroad.or.jp/sunroad.html
- Sunroad service counter: https://www.sunroad.or.jp/servicecounter/

Source-resolution generated images inspected. Native simulator/device portrait and landscape screenshots remain pending. No approved dialogue layout, NPC anchor, microphone, blur, route, or JLPT UI changes.
