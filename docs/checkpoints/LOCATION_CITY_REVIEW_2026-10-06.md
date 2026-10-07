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


## Akita continuation — 2026-10-07, in progress

Recovered the latest remote branch after the transient workspace expired; preserved its 44 existing place mappings rather than replacing completed Sapporo/Aomori/Morioka/Sendai work. An unused regenerated Nijo market preview is not integrated because the remote already contains the selected scene.

LOC-005-08 now has `akita-senshu-kubota-gate.png`, generated with built-in Imagegen: portrait 1024x1536 polished semi-realistic anime environment, Kubota Castle reconstructed two-storey timber main gate, dark tiled roof, white plaster panels, stairs, leafy Akita garden and open foreground. No invented main castle keep, Osaka/Matsumoto/Himeji tower or Tokyo skyline. Source-resolution image inspected. Identity reference: https://www.akita-yulala.jp/selection/5000014051 .

Geographic/name repairs preserve stable location/scenario IDs:
- LOC-005-09 corrupted 男鹼館 / English Namahage Museum becomes なまはげ館 and moves from Akita city to CTY-JP-05206 Oga. Canonical city membership, scenario city and scenario index are synchronized. Official address: 秋田県男鹿市北浦真山字水喰沢. https://namahage.co.jp/namahagekan/information/ .
- LOC-005-15 mixes Akita with Aomori Nebuta; corrected to 秋田竿燈まつり会場（竿燈大通り）. https://www.akita-yulala.jp/festival/335 .
- LOC-005-16 corrected to 川反, the Akita entertainment district, not an invented 川端 shopping street. https://www.akita-yulala.jp/see/691 .
- LOC-005-19 typo corrected to きりたんぽ鍋専門店, retaining the generic restaurant scene.

LOCAL unresolved identity: LOC-005-10, corrupted 秋田カンティール賢郸寝屋 / English Akita Sake Museum Yamatake-ya. Exact-name searches did not establish a corresponding real venue. Do not generate or mark this place verified from a guessed interpretation. Continue other locations.

City-membership verification covers every city's location list. All current 7,112 role/scene mapping checks pass. Two pre-existing unrelated scenario city mismatches were observed for SC-TKY-CON-001 and SC-TKY-CON-002; they are not silently fixed by this patch. Akita and whole-catalog remediation remain incomplete. Native visual acceptance remains pending.

`oga-namahage-museum.png` generated using built-in Imagegen and inspected: Oga Namahage museum exhibit row, varied red/blue folk masks, straw cloaks on museum mannequins, warm timber hall and empty visitor foreground; same portrait anime environment style, no Aomori Nebuta floats or unrelated landmarks. Collection reference https://namahage.co.jp/namahagekan/exhibits/ . Layout/count are illustrative rather than a current survey.

`akita-kanto-avenue.png`: built-in Imagegen, inspected portrait anime environment of Kanto Odori summer festival setting, tall bamboo poles and tiers of rice-bale paper lanterns, modern Akita avenue and empty sidewalk foreground; exclude Aomori Nebuta floats and unrelated skyline. Depiction is an illustrative festival setting, not actual current event staging.

`akita-kawabata.png`: built-in Imagegen, inspected portrait anime environment of 川反 district, local restaurant signage and Asahikawa riverside setting at blue hour, empty foreground; no Osaka Glico/crab or Tokyo skyline. An original illustrative viewpoint, not a current storefront survey.

`akita-museum-water-garden.png`: built-in Imagegen and a targeted image edit; inspected second-floor concrete lounge and water garden looking toward Senshu Park moat. Removed the first output’s invented castle towers before integration. Portrait anime environment with empty floor foreground; no reproduced paintings. Architectural reference https://www.akita-museum-of-art.jp/contents/contents_show.php?contents_id=22 .

The optional fictional-location choice returned no answer. For the unidentifiable LOC-005-10, use the best-judgment real-place option within the user's full geography repair scope: replace its unsupported corrupted identity with 秋田市民俗芸能伝承館（ねぶり流し館）, at 秋田市大町1-3-30. This is a deliberate venue replacement, not a claimed decoding of Yamatake-ya. Keep stable IDs and its generic post-visit questionnaire scenario. Official identity and exhibit reference: https://www.akita-yulala.jp/see/693 . The earlier unresolved-identity entry above records the investigation, not the current resolved venue choice.

`akita-komachi-platform.png`: built-in Imagegen then targeted edit, inspected red/white E6 Komachi at an Akita-labelled platform. Removed invented close snowy mountains before integration. Same facility viewpoint legitimately serves 秋田駅 and 秋田新幹線ホーム; not an exterior station facade claim or current platform-layout/timetable survey. E6 service reference https://www.jreast.co.jp/train/shinkan/e6.html and documented Akita station service https://media.jreast.co.jp/articles/6571 .

`akita-neburi-nagashi.png`: built-in Imagegen, inspected portrait anime environment of the documented first-floor Kanto display/demo hall, lantern poles, panels and open visitor floor; no Nebuta floats or Namahage masks. Museum layout/count is illustrative. Preserved questionnaire has zero references to sake breweries or the unverified old venue name.

`akita-aeon-mall.png`: built-in Imagegen using an operator-published facade photo for architecture reference only, original closer pedestrian viewpoint, portrait anime environment. Preserved cream/peach low-rise mass, triangular-gabled arched glazing, broad glass entrance and round blue clock/emblem. Selected source-resolution output inspected; reference photo is not shipped. Source: https://space-media.aeonmall.com/buildings/akita .

Akita artwork assignment now covers all 20 retained city locations: 8 exact-ID place illustrations and 12 allowed shared service scenes. LOC-005-09 is now correctly assigned and illustrated in Oga, not omitted. Whole-catalog remediation remains incomplete. This is mapping/illustration coverage, not exact photographic reproduction or native visual acceptance. Next city: CTY-006 Yamagata.

## Yamagata CTY-006 — 2026-10-07

Reviewed all 21 locations: 9 place-specific illustrations integrated, 12 generic service interiors retained. Full catalog remains incomplete: 62 mapped place IDs, 4,672 shared-service-permitted rows, 2,378 pending individual reviews. Shared permission is not an assertion that every venue name is verified.

| ID | Place | Artwork / authoritative reference |
| --- | --- | --- |
| LOC-006-01 | 山形駅 | yamagata-station-tsubasa.png; JR East Yamagata Shinkansen route https://www.jreast.co.jp/multi/routemaps/yamagatashinkansen.html; illustrated platform, no claim of exact platform layout |
| LOC-006-08 | 山寺（立石寺） | yamagata-yamadera-godaido.png; https://yamagatakanko.com/attractions/detail_2352.html; Godaido interior reference photo 2352_4_m.jpg |
| LOC-006-09 | 霞城公園（山形城跡） | yamagata-kajo-moat.png; https://keikan.pref.yamagata.jp/vp_062/; stone rampart, moat, blossom and adjacent rail corridor, no invented castle keep |
| LOC-006-10 | 蔵王温泉 | yamagata-zao-onsen.png; https://yamagatakanko.com/attractions/detail_2766.html; hillside winter neighborhood reference 2766_3_m.jpg |
| LOC-006-13 | エスパル山形 | yamagata-spal-entrance.png; https://www.s-pal.jp/wp-content/uploads/2017/11/345631c92564ef486c68b36955cc8a50.pdf; 2017 operator entrance rendering, original illustrated interpretation, not current tenant layout |
| LOC-006-15 | 蔵王スキー場 | yamagata-zao-juhyo.png; https://yamagatakanko.com/attractions/detail_11062.html; Zao juhyo snow-covered firs and ropeway |
| LOC-006-16 | 七日町商店街 | yamagata-nanokamachi-gotenzeki.png; https://yamagatakanko.com/attractions/detail_2280.html; actual Gotenzeki shopping quarter, not Bunshokan grounds mislabeled as street |
| LOC-006-17 | 山形県立博物館 | yamagata-prefectural-museum.png; https://www.yamagata-museum.jp/about/outline; outline1.jpg is MAIN modern concrete museum, not Western-style branch outline2.jpg |
| LOC-006-18 | 山交ビルバスターミナル | yamagata-yamako-bus-terminal.png; https://www.yamako.co.jp/ybill/; official main-img01.jpg reference, vertical facade fins and red terminal canopy |

All final assets inspected before activation. All are original semi-realistic anime illustrations with clear lower foreground and portrait framing; official photographs were reference-only and are not shipped. Rejected first Yamadera exterior for invented roof cupola; replaced with verified timber lookout interior. Reframed first museum landscape output into portrait.

Corrected corrupted LOC-006-19 label to 山形いも煮専門店 and synchronized two scenario mentions; kept generic restaurant image. Resolved ambiguous 山形バスターミナル to verified 山交ビルバスターミナル (same stable ID), address 山形県山形市香澄町3-2-1, synchronized two scenario mentions. No changes to dialogue waist placement, microphone, city blur, or approved JLPT UI.

Generation specifications: original 1024×1536 portrait, detailed soft semi-realistic anime travel background, no people/UI/watermark; preserve source-confirmed defining architecture; leave lower standing space for existing NPC overlay; exclude Tokyo landmarks and invented castle keeps. Museum portrait generation retained the verified central entrance/low roof planes. Station is a regional Tsubasa platform illustration, not a survey of present station equipment.

Actual RoyalLocationCard and placeBackground browser fixture passed for 9 cards at 390×844, 430×932, 768×1024, 1024×768 and 1366×768: all scene/frame images decoded, image bounds matched clipped scene windows, and no page errors. Inspected phone and tablet screenshots: defining features retained, no stretched imagery or blank scene bands. Preview fixture lacks Japanese fonts (labels display missing glyph boxes), so text typography is not validated by this fixture. Native simulator and full app route validation remain pending.

## Fukushima CTY-007 / Aizuwakamatsu CTY-FKS-AIZUWAKAMATSU — 2026-10-07

Reviewed the original 21 Fukushima rows. Moved LOC-007-15 鶴ヶ城（会津若松） and LOC-007-17 福島県立博物館 to their actual city Aizuwakamatsu, preserving stable IDs and synchronizing canonical city membership, scenario cityId and scenario-index cityId. Fukushima retains 19 rows: 7 exact-place illustrations and 12 shared-service interiors. Aizuwakamatsu now has those two moved locations plus an exact-image override for its existing castle-guide row. Its other synthetic workshop/orchard/station rows remain pending; this is not completion of all Aizuwakamatsu.

| ID | Correct place / city | Asset / source |
| --- | --- | --- |
| LOC-007-01 | 福島駅 / Fukushima | fukushima-station-yamabiko.png; https://www.jreast.co.jp/estation/station/info.aspx?StationCd=1352 and https://www.jreast.co.jp/train/shinkan/e5.html; original regional platform/service/sign illustration, not exact present platform survey |
| LOC-007-08 | 花見山公園 / Fukushima | fukushima-hanamiyama.png; https://www.f-kankou.jp/spot/1660; flowering cultivated hillside mosaic, not generic urban park |
| LOC-007-09 | 飯坂温泉 / Fukushima | fukushima-iizaka-sabakoyu.png; https://www.f-kankou.jp/spot/33016; actual Sabakoyu wooden bathhouse neighborhood, not generic hotel lobby |
| LOC-007-10 | 福島稲荷神社 / Fukushima | fukushima-inari-shrine.png; https://www.f-kankou.jp/spot/14875; dark timber worship hall, shimenawa and stone komainu, not Kyoto Fushimi torii tunnel |
| LOC-007-13 | イオン福島店 / Fukushima | fukushima-aeon-food-court.png; https://space.aeontohoku.co.jp/spaces/211/event; actual operator first-floor Food Court corridor reference, annotation polygons removed, current tenant names not asserted |
| LOC-007-16 | 中町商店街福島 / Fukushima | fukushima-nakacho-yamada.png; https://maido.fukushima.jp/shoplist/%e5%b1%b1%e7%94%b0%e9%87%91%e7%89%a9%ef%bc%88%e6%a0%aa%ef%bc%89/; illustrated view at verified Yamada hardware frontage, 中町2-7, 2016 association reference; not an exact survey of every storefront |
| LOC-007-18 | 飯坂温泉駅 / Fukushima | fukushima-iizaka-station.png; official tourism 2023 walking-map PDF https://www.f-kankou.jp/wp-content/uploads/2023/03/%E9%A3%AF%E5%9D%82%E6%98%A5%E3%81%AE%E3%81%BE%E3%81%A1%E6%AD%A9%E3%81%8D%E3%83%9E%E3%83%83%E3%83%972023.3.pdf; station gable photo extracted from embedded original bytes, no reference photo shipped |
| LOC-007-15; LOC-FKS-AIZUWAKAMATSU-01 | 鶴ヶ城 / Aizuwakamatsu | aizuwakamatsu-tsurugajo.png; https://www.tsurugajo.com/tsurugajo/; same actual castle, legitimate reuse across two stable IDs, white keep with reddish ceramic tiles |
| LOC-007-17 | 福島県立博物館 / Aizuwakamatsu | aizuwakamatsu-fukushima-museum.png; https://www.j-muse.or.jp/introduction/detail/?mid=680 and museum homepage https://general-museum.fcs.ed.jp/; broad dark stepped roofs, white low wings and forecourt |

Corrected corrupted 福島稲荽神社 to 福島稲荷神社 and synchronized scenario mentions. Replaced non-existent/misidentified イオンモール福島 with actual city store イオン福島店 (address 南矢野目字西荒田50-17) and synchronized scenario mentions. AEON MALL Date is a different venue in 伊達市, with official announced November 27, 2026 opening: https://www.aeonmall.com/open_renewal/search/ ; it is not substituted into Fukushima city. Changed ambiguous 飯坂線終点駅 to 飯坂温泉駅, synchronized mentions. Museum/castle scenarios contain no leftover Fukushima-city place assertion.

Audit characteristic-name rule now catches a name ending in 温泉 so 飯坂温泉 cannot be silently classified as a shared hotel. Retained its existing functional NPC category; no dialogue UI changes. Full catalog: 72 mapped place IDs, 4,671 shared-service-permitted, 2,369 still pending individual geographic reviews. Pending rows are not called incorrect without evidence and are not counted complete.

Generation instructions for these 9 new assets: original 1024×1536 portrait in established detailed semi-realistic anime travel style; authoritative visual references for defining architecture; clear lower standing space for NPC; no people/UI/watermark; exclude Tokyo landmarks and invented towers. References only, exact generated PNG bytes integrated. All final images inspected before activation. Routing/NPC checks pass all 7,112 locations; native full-app testing remains pending.

Fukushima/Aizuwakamatsu isolated actual-component browser fixture passed 10 cards at 390×844, 430×932, 768×1024, 1024×768 and 1366×768: all frame/scene images decoded, scene image bounds matched clipped windows, zero page errors. Inspected phone screenshot: actual shrine, bathhouse, castle, museum, shop and station identities remain visible; no stretching/blank scene bands. Japanese fixture font is absent, so labels show missing-glyph boxes and typography is not claimed validated. Native/full-app route validation remains pending.

## Mito CTY-008 / Bando CTY-IBR-BANDO — 2026-10-07

Reviewed all 21 original Mito rows. Moved LOC-008-17 茨城県自然博物館 to actual 坂東市, 大崎700; preserved stable ID and synchronized cities, scenarios and scenario-index. Mito retains 20 rows: 8 exact-place images and 12 permitted shared-service interiors. Bando and the full catalog remain incomplete.

| ID | Correct place / city | Asset | Primary reference |
| --- | --- | --- | --- |
| LOC-008-08 | 偕楽園 / CTY-008 | mito-kairakuen-kobuntei.png | https://www.ibarakiguide.jp/spot.php?code=660&mode=detail |
| LOC-008-09 | 常磐神社 / CTY-008 | mito-tokiwa-shrine.png | https://www.ibarakiguide.jp/spot.php?code=686&mode=detail |
| LOC-008-13 | イオンモール水戸内原 / CTY-008 | mito-uchihara-aeon-mall.png | https://space-media.aeonmall.com/buildings/mitouchihara |
| LOC-008-15 | 茨城県立歴史館 / CTY-008 | mito-history-mitsukaido-school.png | https://rekishikan-ibk.jp/guide/mitsukaido-school/ |
| LOC-008-17 | 茨城県自然博物館 / CTY-IBR-BANDO | bando-ibaraki-nature-museum.png | https://www.ibarakiguide.jp/spot.php?code=220&mode=detail |
| LOC-008-01 | 水戸駅 / CTY-008 | mito-station-hitachi.png | https://www.jreast.co.jp/train/express/hitachi_tokiwa.html |
| LOC-008-18 | 偕楽園駅（臨時駅） / CTY-008 | mito-kairakuen-seasonal-station.png | https://www.jreast.co.jp/press/2025/mito/20251114_mt03.pdf |
| LOC-008-10 | 水戸芸術館 / CTY-008 | mito-art-tower.png | https://www.arttowermito.or.jp/tower/ |
| LOC-008-16 | 泉町商業地区（京成百貨店前） / CTY-008 | mito-izumicho-keisei.png | https://www.city.mito.lg.jp/page/79938.html |

Corrected corrupted Kairakuen, Tokiwa shrine, Art Tower Mito and seasonal Kairakuen station names; replaced ambiguous AEON Mito with actual AEON MALL Mito Uchihara. Synchronized scenario mentions. Replaced unidentified 水戸中央商店街 with verified 泉町商業地区（京成百貨店前）, explicitly a venue replacement rather than a claimed decoding. Historical museum artwork depicts the relocated Ex-Mitsukaido Primary School within the museum grounds, not its modern main building. Nature museum artwork depicts static dinosaur exhibits inside the actual Bando museum. Station illustrations identify regional E657 Hitachi service, not Shinkansen, and do not claim exact current platform equipment. Seasonal station source confirms the temporary downbound platform.

Nine original portrait PNGs follow the established semi-realistic anime travel style, no people/UI, with room for the existing NPC overlay. Final artwork inspected; Art Tower composition revised to preserve the full faceted tower inside square card cropping. Defining architecture checked against primary references, no Tokyo landmark reuse. Geography inventory now 81 exact place IDs, 4,671 shared-service-permitted and 2,360 pending individual reviews across 814 cities / 7,112 locations. Shared permission does not assert every generic service name is a real surveyed venue. No dialogue, mic, blur or layout changes.

Actual RoyalLocationCard + placeBackground browser fixture passed all 9 Mito/Bando cards at 390×844, 430×932, 768×1024, 1024×768 and 1366×768: every image decoded, scene bounds match clipping windows, no page errors. Phone and tablet screenshots inspected, defining features retained without stretching or blank scene bands. Fixture lacks Japanese font; typography is not validated. Native/full-app route testing remains pending. Routing/NPC checks pass all 7,112 locations; git diff whitespace check passes.
