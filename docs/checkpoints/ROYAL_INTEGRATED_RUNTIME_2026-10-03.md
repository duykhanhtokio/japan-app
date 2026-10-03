# Royal UI continuation with integrated runtime evidence — 2026-10-03

Status: incomplete acceptance. Do not mark the eight-item request or native platforms PASS.

## Verified continuation

Started from `b9a97b3938542cb90332b7d7e728bd5588cfb273` on `recovery/jlpt-n3-n1`, origin `https://github.com/duykhanhtokio/japan-app.git`. Fetch, clean-tree verification, work-persistence verification and JLPT lock 10/10 succeeded before editing. Read the startup document, AGENTS, lock rules and the prior Royal repair/follow-up checkpoints. The more recent UI commits `3ebfc8e2` and `042990ff` supersede the older conversation report of `48a692b9`. Preserved all dialogue progress and approved UI changes. Other surviving checkouts have unfinished dialogue work and were left untouched. Original source hashes are in the evidence directory.

## Additional findings and changes

- **Home artwork regression:** the prior repair separated artwork from text padding but gave the sibling React Native Image only `absoluteFillObject`. In the complete Expo Web app at 430×932, all three images had natural **2172×724** DOM bounds while their allocated cards were **406×135**. Their right/bottom portions were clipped, and the subjects were outside the visible cards. Added explicit `width: '100%', height: '100%'` to the artwork in the unpadded Pressable. The text overlay retains its own padding, and the border-only raster remains on top. This measured full-app defect was absent from the previous component harness's acceptance claims. After correction all three images have 406×135 bounds, with visible subjects and text. At 360/768/1366 widths, card artwork is 336×124 / 744×248 / 960×320. `cover` preserves source aspect ratio. The user's 23:32 simulator screenshot was retrieved and inspected; its native right/bottom gaps remain a separate unverified native acceptance item. The historical padded ImageBackground regression is documented in the previous checkpoint; native behavior was not reproduced here.
- **Learn font fallback:** the plain JLPT 学習 title and removal of its Royal frame were already implemented. Integrated screenshots additionally exposed missing Japanese glyphs in the level labels and qualification title because those Text styles did not use the loaded Japanese font. Applied the existing Royal JP font to those labels and help title/close label; no text or qualification rule changed. Removed the unused RoyalNavyFrame import. Final Learn screenshots were recaptured at four widths.
- **Care panel:** `CropCarePanel` used RoyalContentPanel but retained a three-pixel CSS border, shadow/elevation and green icon circle in its passed styles. Removed those styles. The normal feeding action still showed a water emoji; it now uses the same approved rice image as its feed header. The boost/ad glyphs rendered as missing-font boxes in the actual browser. Removed those unsupported temporary glyphs, retaining their text labels, handlers and action layout. This does **not** recover missing approved boost/ad/water/fertilizer artwork.
- **Warehouse inner surfaces:** its quantity/price boxes still had CSS outlines/solid fills despite the parent row being converted to raster. Converted them to RoyalContentPanel and used the existing coin image instead of a coin emoji. Quantity remains the original static display; no purchase behavior was introduced. WarehousePanel is not currently mounted by the five-area Game route, so these inner surfaces have source/TypeScript verification only, not an integrated screenshot.

## Integrated evidence

Directory: `docs/ui-workspace/royal-integration-2026-10-03/`.

- 16 complete Expo React Native Web captures: Home, Learn, N5 vocabulary and Game at 360×800, 430×932, 768×1024 and 1366×768. No router, safe-area, state or image shims. Development Game uses the repository's existing fixture balances/level. These remain browser viewports, not iPhone/iPad/Android devices.
- Shop modal captured at the same four sizes; care panel and vegetable scene exercised through actual Game controls. Feeding/time-advance tests used the existing developer fixture. Modal close and map return work.
- Measured two HUD panel widths and gap centers directly from the integrated DOM: 164/199/368/446 pixels per panel; seam centers **180/215/384/683** pixels, exactly viewport width/2. Asset icons remain in independent resource cells and do not overlap the avatar/EXP column in inspected screenshots. Actual native insets are not tested.
- Cosmetic catalog audit: **144/144** entries have a registered existing file. All **88** character avatar assets have different SHA-256 hashes. Visible first and second shop entries use different characters. No purchase rule, equipped selection or cosmetic pricing changed.
- Three complete navigation cycles: Home → Learn → actual Back → Game tab → chicken → actual Back to map → cosmetic shop/close → actual Back to Home. 18 measured navigation actions; 0 JavaScript errors. See `navigation-runtime.json` and `navigation-web.mp4`. The recording captures every screencast paint event, with recorded timestamps encoded as variable-frame-rate video. It is not a native recording or a guarantee about unrecorded frames.
- Measured action waits are 51–245ms. Recording/instrumented development runtime still reports long tasks **51–125ms**, and requestAnimationFrame gaps up to **100ms**. Thus **no stutter-free PASS** is claimed. Recorded navigation does not show the old solid-green fallback in the inspected frames; this does not establish the exact source of the user's native flash or its native elimination. Do not classify the legitimate green farm artwork as a fallback flash.
- The full app now renders. Initial failures in this new checkout were traced to unmaterialized Git LFS image pointers (`vegetable_map_landscape_v1.png`, then an N1 visual-option JPG), and were resolved by retrieving their real bytes. This explains those current bundling failures only; it does not prove the previous session's HTTP-200 blank-body cause. An overlapping test run also crashed its Chromium renderer; it was stopped and all 16 views rerun sequentially, producing the final JSON with no page errors.

## Eight-item acceptance status

| Item | Verified here | Still open |
| --- | --- | --- |
| 1 Home images | Full-app Web image/card bounds, subjects and text at four sizes; additional intrinsic-size regression fixed | Native screenshot regression, portrait/landscape on real platforms |
| 2 JLPT title | Plain approved navy title with no frame; four-size Web screenshots | Native visual acceptance |
| 3 Navigation | Real tab/subpage/Back cycles, video, measured runtime; existing fallback/cache/focus-timer repairs preserved | Native flash root cause and complete performance acceptance; Web long tasks remain |
| 4 Vocabulary | Opaque search and readable input/placeholder; plain word/example surfaces in full app | Actual native platforms and active search-icon recovery if a separate icon is required |
| 5 HUD | Integrated gap exactly centered; avatar/copy/resources separated at four widths | Native safe areas, actual devices, native landscape |
| 6 Icons | Original rice reused for feed; original area/currency artwork preserved; additional obsolete glyphs removed | Approved standalone fruit/tool/feed/boost/ad/water/fertilizer assets not found; remaining item emoji elsewhere not fully migrated |
| 7 Character shop | 144 mappings, 88 unique avatar files, actual four-size shop screenshots | Native platform visual checks; exhaustive interaction with every item not performed |
| 8 Raster panels | Actual shop/care/scene screenshots; remaining care CSS shell removed; warehouse inner boxes corrected | Warehouse is inactive and not runtime-tested; full native sweep and developer-only CSS controls remain |

## Asset search and missing work

Searched repository filenames and existing asset mappings, prior Git-backed repair reports, and saved-image titles/contents. The original rice and approved area icons are already present. Additional searches for royal food/feed/fruit/tool assets returned historical August guide collages, the existing cow and coin designs, and unrelated map/UI assets; no confirmed approved standalone missing icon set. The August collages do not establish approval as the current Royal set and were not substituted. This search is evidence of what was found, not proof that no unseen asset exists. Do not create different artwork and describe it as restored original artwork.

## Checks and exact limits

- Scoped ESLint: no errors or warnings after removal of the unused import.
- Capture scripts: Node syntax checks succeed. They require Playwright and an available Chromium executable (`JAPAN_UI_BROWSER_PATH`). Start Metro and capture in the same network namespace in this managed environment.
- JLPT approved lock: unchanged 10/10. `git diff --check`: clean.
- TypeScript remains blocked by the pre-existing TS2352 at `src/services/life-content-repository.ts:41`: generated `SC-HKD-HAKODATE-001` lacks `type`. No new UI diagnostics. Do not report full TypeScript PASS.
- No macOS/iOS/iPadOS simulator or Android runtime is available. Cloud Browser localhost is blocked; the successful evidence comes from a locally launched Chromium in the execution namespace. No native platform PASS.

Next unfinished work: profile remaining full-app navigation under a production/native runtime, identify and reproduce the user's native flash, verify native safe areas and coverage in both orientations, recover the exact missing approved icons, and finish the remaining Game surface sweep. Keep all completed content work and JLPT locked files intact.
