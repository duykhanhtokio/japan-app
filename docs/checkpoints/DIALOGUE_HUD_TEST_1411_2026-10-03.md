# Tighter dialogue leading, lower-left lanterns, temporary NPC access and immediate bars

2026-10-03, user14:11JST; screenshot14:06 read successfully. Basea2d7034f preserves concurrent Ibaraki content audit and UI91602b62. Exact files/hashes backed up before edits at .jlpt-backups/dialogue-hud-test-1411-2026-10-03. Approved Back, Home artwork/frame dimensions, NPC source-waist anchors, JLPT UI and credit/qualification rules remain unchanged.

## Changes and causes

- src/app/world/dialogue/[scenarioId].tsx: body leading1.30→1.15×font size; translation margin7→3px; fit estimate follows tighter leading. Lanterns move from right8/bottom4 to left8/bottom-8: their touch box extends8px beneath the panel edge. Bottom bubble padding2→12 reserves space for that extension before the next speaker plate. NPC-only before TTS completion and microphone reveal remain unchanged.
- src/components/world/JapaneseRuby.tsx: base/answer leading1.24→1.15. Only consumer is this dialogue route. Authored furigana and readings remain intact.
- src/components/app/GameHeader.tsx: EnergyBar previously mounted text first, waited its own onLayout for fill, then waited RoyalPaperPanel's separate onLayout for border. There were two measurement/state passes. Remove both dependencies. Fixed approved32px and royal22.5px heights determine the same original ornament scale/insets; all supported bar hosts are wider than the two corners. Render the existing eight cropped gold-border sources directly in padding-free cells, no fade. Retain only necessary track+progress fill, gold frame and text. Fold the redundant ivory View into track backgroundColor. Remove the former energyBorder/energyIvory/unused energyOrnament styles. Red Credit direction, qualification count/tints, labels, dimensions and Back callbacks stay unchanged. ReferenceIdentity's unrelated measurement is unchanged.
- src/data/npc-progression.ts: NPC_TEST_UNLOCK_ALL=true, one reversible test switch.
- src/services/npc-progression-storage.ts: loadSavedNpcCollection reads real state; exported loadNpcCollection overlays all25 categories and a starter only for testing. chooseStarterNpc/recordNpcScenario continue reading and writing real state, so test access does not persist fake unlocks or override reward/duplicate guards. Set NPC_TEST_UNLOCK_ALL=false later to restore stored locks.
- src/app/npc-starter.tsx: all25 cards display normally with test access enabled; guide says allNPCs can be tried. Normal station-first logic is preserved when the flag is false.
- scripts/check-npc-test-access.cjs: tests empty storage, all25 access without writes, real station/next-category progress, duplicate completion guard and restoring stored locks with flag off.
- scripts/capture-dialogue-hud-test-1411.cjs: bounded runtime capture/measurements.
- .gitattributes and docs/ui-workspace/dialogue-hud-test-1411-2026-10-03/: raw Git screenshots and runtime evidence.

## Shared consumers

EnergyBar is private to GameHeader, which is used by Home, Learn, Profile and Tasks. Back/avatar/layout of its surrounding header are unchanged. RoyalPaperPanel is not edited; other cards/borders therefore retain their renderer. JapaneseRuby is used only by life dialogue. Temporary NPC read view is used by city access and dialogue history; completedScenarioIds/history eligibility stay real. The starter/card presentation uses the same one switch.

## Validation

Production-web export PASS. Targeted ESLint zero errors/warnings (npm environment warning is separate). Existing paired-flow test PASS, including NPC/player pairing, boundary text, lantern hints, last turn, Back replay and stale callbacks. NPC access regression PASS. JLPT UI lock10/10 and navigation contract PASS. git diff --check PASS. TypeScript still reports only existing life-content-repository.ts:41 / SC-HKD-HAKODATE-001 missing type; no changed-file diagnostics.

Runtime at360×800,430×932,768×1024,1366×768,932×430: Home first/return via Profile plus Learn/Tasks bars keep identical bounds over500ms. Earliest DOM mount contains three essential layer groups and eight stroke cells, without component measurement gates. Browser image nodes/pixels are decoded asynchronously by the image renderer (imagesAtMount=0 recorded honestly); screenshots wait for image availability. This evidence does not certify that every native asset pixel is present on its first draw or prove all device frame-time performance. Existing common startup asset preparation already includes these source crops; no loading screen/timer/animation is added.

Fresh storage enters city without starter redirection and no locked category labels. Formerly locked hospital is opened through the city card at430×932. Starter screenshot has visible unlocked cards; service test verifies all25 IDs. Station dialogue runs atfive sizes; cafe/hospital additionally at430. NPC-only then player reveal remains tested. Both lanterns have left=frame.left+8,bottom=frame.bottom+8, with gold/red hints and answer stages exercised. Actual screenshots inspected for Home bars, city/starter and portrait/landscape dialogue. Native Simulator unavailable; device leading/glyph clipping, touch, image decoding, voice and performance remain pending. Very short landscape dialogue remains compact with small fitted text; do not claim universal readability. Starter's existing full-source footer artwork is oversized on web (also present in prior checkpoint captures); it is not changed by this NPC test-access patch.

Evidence: docs/ui-workspace/dialogue-hud-test-1411-2026-10-03/runtime.json and JPGs. User attachment is read-only. Source/backups/checkpoints preserve all previously approved work.
