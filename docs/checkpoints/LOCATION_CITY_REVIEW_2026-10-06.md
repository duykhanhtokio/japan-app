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

## Morioka continuation — 2026-10-06

CTY-003 artwork assignments cover all 21 locations: **10 individual place illustrations and 11 permitted shared service scenes**. The ten exact-ID mappings are Morioka Station east entrance, Morioka Castle Ruins Park, AEON Mall Morioka (Maegata), Iwate Bank Red Brick Building, Ishiwari-zakura, Hoonji Rakando, Tsunagi/Gosho lakeshore, Koiwai Farm, Iwayama Parkland, and Morioka Odori district. The characteristic-name rule correctly requires Odori imagery despite its Izakaya category. Whole-catalog review remains unfinished; the next city is **CTY-004 Sendai**, with 10 pending individual-review locations. Pending catalog total after this unit: 2,406.

Six erroneous addresses corrected from official sources: AEON Maegata (前潟4丁目7番1号), Hoonji (名須川町31-5), Koiwai (雫石町丸谷地36-1), Iwayama (新庄16字貝田53-1), Kogensha (材木町2-18), and Iwate Medical University Hospital (矢巾町医大通2丁目1番1号). The farm and hospital are nearby destinations rather than places within Morioka city. Their displayed names now explicitly append 雫石町 and 矢巾町, descriptions explain this, and matching generated scenario name/situation references are updated. Existing authored dialogue, stable IDs and grouping/navigation are preserved; this is explicit nearby-destination grouping, not a claim that the administrative boundaries changed.

Address sources:
- https://morioka.aeonmall.jp/access
- https://iwatetabi.jp/spots/4788/
- https://www.koiwaifarm.com/guide/access/
- https://iwatetabi.jp/spots/4689/
- https://www.morioka-kogensya.sakura.ne.jp/
- https://www.iwate-med.ac.jp/education/school_life/yahaba-campus/

Built-in imagegen created ten original portrait 1024x1536 assets in `assets/app/life/location-backgrounds/places/`. Shared prompt: polished semi-realistic anime 2D/2.5D environment, natural proportions, full bleed, center-safe subject, empty lower foreground for the existing NPC, no people/UI/borders/watermarks or unrelated city landmarks. Per-asset subject prompts:
- `morioka-station-east.png`: pale panel station facade, JR/盛岡駅 signs, FESAN, bus canopy and forecourt. Identity: JR East station 1565; dated feature reference https://commons.wikimedia.org/wiki/File:盛岡駅東口_2014-05-18_14-10.JPG .
- `morioka-castle-ruins.png`: granite ramparts, stairs and park trees; prohibit a standing castle keep. https://www.city.morioka.iwate.jp/kurashi/midori/koen/1010491.html
- `morioka-redbrick-bank.png`: red brick, white stone bands, slate roof and corner tower. First output had three storeys; edited and inspected to retain only two. https://www.iwagin-akarengakan.jp/redbrick/
- `morioka-stone-splitting-cherry.png`: old pale-blossomed cherry growing from a split granite boulder at the district court. https://www.city.morioka.iwate.jp/kankou/kankou/1037103/1037212/sakura/1007959.html
- `morioka-maegata-aeon.png`: low two-storey cream/grey mall, glass upper facade, curved canopy, AEON sign. Dated exterior feature reference https://deepacid.la.coocan.jp/travels/maegataaeonmall.html .
- `morioka-hoonji-rakan.png`: timber Rakando visitor aisle, seated central Buddha and tiered rakan collection; illustration does not purport to reproduce/count all 499 statues. https://iwatetabi.jp/spots/4788/
- `morioka-tsunagi-gosho.png`: Gosho Lake, wooded low ridges and lakeside resort area, not an invented private hotel bath. https://www.tsunagionsen.com/
- `koiwai-farm-iwate.png`: Shizukuishi farm pasture, dairy cattle, white fences and broad Mount Iwate; prohibit Mount Fuji. https://www.koiwaifarm.com/guide/access/
- `morioka-iwayama-parkland.png`: wooded hill setting and documented Ferris wheel/family dragon coaster; original viewpoint, not precise current ride-layout photography. https://iwatetabi.jp/spots/4689/
- `morioka-odori.png`: open-to-sky local city street, awnings, restaurant signs, evening lighting. Removed first output's invented mountain and oversized billboards, changed cobbled alley to asphalt street. https://www.odori.or.jp/

All selected source-resolution outputs were visually inspected. These are geographically informed illustrations, not surveys or exact current architectural/storefront replicas. Reference photographs are not shipped. Mapping/role checks PASS for all 7,112 locations; JLPT UI lock PASS 10/10. Device/browser runtime portrait/landscape visual acceptance remains pending. No dialogue layout, NPC anchoring, microphone, blur, transitions or JLPT UI files changed.

## Sendai continuation — 2026-10-06

CTY-004 artwork assignments now cover all 21 locations: **11 individual place illustrations and 10 permitted shared service scenes**. Exact-ID assets cover Sendai Station west facade, Jozenji-dori, Sendai Castle ruins / Date Masamune equestrian statue, Zuihoden, THE MALL Sendai Nagamachi, Sendai Asaichi, Kokubuncho, Umino-Mori Aquarium main tank, Akiu Onsen / Rairaikyo public gorge, Akiu Great Falls and Sendai Mediatheque. Asaichi is a named geographic market, not an ordinary interchangeable supermarket. Added 朝市 to the characteristic-name matcher; ordinary services remain shared. Whole catalog: 44 place mappings, 4,672 shared services, **2,396 still pending**. Next city: **CTY-005 Akita**. Several Akita names are visibly corrupted; verify identities before generating imagery.

Recovered unfinished Sendai location/scenario corrections and image outputs from the prior session, preserving that source workspace. Corrected 定禪寺通 to 定禅寺通; the stated 長町7-20-3 address belongs to ザ・モール仙台長町 (not an AEON mall), with specialty-shop hours 10:00–21:00. Police address: 五橋1丁目3番19号. Tax office: 若林区卸町3丁目8番5号. Mediatheque: 春日町2-1. Falls: 秋保町馬場大滝地内; aquarium: 中野4丁目6番地. Ambiguous Chinese-labelled cafe becomes the explicit generic scene 仙台のカフェ with no invented branch/address/hours. East-station construction is an illustrative work scene with no unsupported current redevelopment/address claim. Removed uniform bathing hours for the entire Akiu area. Scenario place-name references are synchronized; existing dialogue text and stable IDs remain preserved.

References for metadata corrections:
- https://themallsendai.com/
- https://www.police.pref.miyagi.jp/tyuou/
- https://www.nta.go.jp/about/organization/sendai/location/miyagi/naka/index.htm
- https://www.smt.jp/
- https://www.miyagi-kankou.or.jp/theme/detail.php?id=9815
- https://www.uminomori.jp/umino/

Final original artwork is stored under `assets/app/life/location-backgrounds/places/`; all eleven selected files are 1024x1536 portrait full-bleed. Built-in Imagegen was used in the previous/current sessions. Common prompt: polished semi-realistic anime 2D/2.5D environment, fine lines, soft shading, identifying subject and empty lower foreground for existing NPC, no characters/UI/borders/watermarks or unrelated city landmarks. Subject prompt set:
- `sendai-station-west.png`: broad brown/orange tiled JR west facade, horizontal glazing, station lettering and facade clock, pedestrian deck; no separate clock tower. Rejected the new grey generic station output; recovered the inspected prior brown facade. Dated exterior feature reference: https://note.com/yamabuki_archi/n/n0179e068671b .
- `sendai-jozenji-dori.png`: zelkova-lined central median promenade with roads and Sendai city blocks at both sides. https://www.sentabi.jp/spots/83
- `sendai-aoba-castle-ruins.png`: bronze Date Masamune equestrian statue with crescent helmet on stone pedestal, ruins terrace and Sendai panorama, no standing castle keep. https://www.sentabi.jp/spots/60
- `sendai-zuihoden.png`: small black lacquer, gold and polychrome mausoleum among tall cedars, stone steps. https://www.zuihoden.com/
- `sendai-nagamachi-mall.png`: beige mall with angular glazed corner and horizontal parking floors, green THE MALL lettering and SEIYU; corrected the prior rounded corner/red-sign output. Dated exterior feature reference: https://commons.wikimedia.org/wiki/Category:The_Mall_Sendai_Nagamachi .
- `sendai-asaichi.png`: open-air urban produce/seafood market street and awnings, not a supermarket aisle. https://sendaiasaichi.com/
- `sendai-kokubuncho.png`: open-to-sky asphalt nightlife street, medium-rise restaurants/bars, warm signs at blue hour; no invented overhead gate/canal/Osaka billboard. https://www.sentabi.jp/nightlife
- `sendai-uminomori.png`: documented main tank いのちきらめくうみ, silver sardine school, rays and rocky Sanriku marine environment, empty visitor hall foreground. https://www.uminomori.jp/umino/guide/1f.html
- `sendai-akiu-rairaikyo.png`: public rocky Natori River gorge, wooded slopes and hot-spring settlement, not an invented private hotel bath. https://www.akiuonsenkumiai.com/areainfo/
- `sendai-akiu-great-falls.png`: narrow concentrated vertical waterfall, wooded rocky gorge and pool, not a broad cascade. https://www.miyagi-kankou.or.jp/theme/detail.php?id=9815
- `sendai-mediatheque.png`: seven-storey transparent glass cube, thin floor plates and irregular lattice tube supports, zelkova sidewalk. https://www.smt.jp/info/about/character/

Source-resolution selected illustrations inspected. These are geographically informed illustrations, not exact current photographic architecture/storefront surveys. Reference photographs are not shipped. Mapping/role and byte-lock verification are required before publication; native simulator/browser runtime portrait/landscape acceptance remains pending. Approved dialogue layout, NPC anchoring, microphone, blur and routes are unchanged.
