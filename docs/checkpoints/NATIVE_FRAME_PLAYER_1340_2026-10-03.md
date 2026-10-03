# Native plaque bounds, NPC-first reveal, separate industry art

2026-10-03; user screenshots13:35,13:36,13:40JST. Baseline remote871e021a; prior UIb1d8a1e7. Fetch and fast-forward preserve the concurrent Ibaraki content audit. Exact pre-edit backups/hashes: .jlpt-backups/native-frame-player-1340-2026-10-03. This follow-up does not change JLPT locked files, Back positions, approved Home image/frame geometry, rewards or dialogue content.

## Proven causes and scope

The previous UI editb1d8a1e7 set100% width/height directly on images in padded native hosts. RN0.81.5 uses Yoga YGErrataAll (YogaLayoutableShadowNode.cpp:603), including AbsolutePercentAgainstInnerSize. The supplied React Native ImageBackground implementation also proxies explicit host width/height and otherwise retains intrinsic-image behavior. The Home heading's padded RoyalNavyFrame therefore had a narrower image than its separate blue underlay; RoyalButton background percentage sizes shrank both axes. The user's native screenshots show these exact symptoms. C++ regression compiled against this checkout's actual Yoga sources reproduces padded148×62→92×26,220×62→164×26 and300×52→232×52. Isolating the image in an absolute-fill padding-free View restores all three full bounds. This proves native layout math, not a simulator screenshot acceptance claim.

RoyalNavyFrame: remove unnecessary flat navy underlay and place cropped artwork in an absolute-fill unpadded layer. RoyalButton: replace padded ImageBackground with separate artwork/content layers. Remaining wide plaques (RoyalField label, RoyalLabelPlaque, RoyalCapsule, RoyalTitlePanel, RoyalInfoPanel label) use the same isolated image layer. Production-web screenshot inspection caught an intrinsic oversized RoyalInfoPanel label before this last fix; final location screenshot has the expected label bounds and text. The same padding-free image layer also wraps the RoyalField body: its intrinsic-size underlay was covering the work registration page in the shared-consumer screenshot. No parent sizing, padding, onLayout group measurement, callbacks, disabled/press feedback or navigation are changed.

Dialogue previously derived playerTurn from the upcoming PLAYER while index still pointed at NPC, so both player frame and microphone mounted before TTS completion. Mount playerTurn only when current turn is PLAYER. Existing onDone advance controls reveal. Reserve the upcoming player's allocation without mounting its UI, keeping NPC panel position stable. OnStopped/onError do not reveal the player automatically. Use a full-stage View instead of native SafeAreaView for absolute sprite/panel coordinates; header explicitly keeps top safearea+approved headerTop, controls keep bottom insets. Sprite box uses numeric bounds identical to the contain/waist calculation. Initialize from actual useWindowDimensions, avoiding the shared positioning hook's480px minimum in short landscape. Per-NPC source waist anchors remain unchanged. Text, translations, hint stages, speech callbacks, pairing and rewards are preserved.

Specified-skills reused life/rewards/cards NPC portraits. Replace all six with industry-specific original raster assets depicting workplaces/equipment, no NPCs. Set title pale gold, subtitle ivory and dark text shadows. Explicit existing Royal Japanese fonts also fix missing-glyph boxes found in headless screenshot review. Home card Japanese text gets a dark shadow only; artwork and stroke fit remain approved.

## Files changed

- src/components/ui/RoyalSurface.tsx
- src/app/world/dialogue/[scenarioId].tsx
- src/app/specified-skills/index.tsx
- src/app/home.tsx (text shadow only)
- assets/app/industries/{agriculture,construction,food-service,food-manufacturing,caregiving,hospitality}-v1.png
- scripts/check-dialogue-paired-flow.cjs (assert initial player/mic absent, post-completion present)
- scripts/check-native-royal-frame-layout.cpp
- scripts/capture-native-frame-player-1340.cjs
- .gitattributes (raw Git delivery for new PNG/JPG evidence)
- this checkpoint and docs/ui-workspace/native-frame-player-1340-2026-10-03/ evidence.

## Shared consumers

Navy/Buttons: Home, life dialogue, work-operation labels, registration, portal, learning, profile, farm and world. Additional wide plaque consumers: register/work fields; city/prefecture/region/city-list headers; portal/starter titles; farm crop/info; life location scenario labels. Historical unused JLPT components import these too, but the approved runner does not use them; UI byte lock remains10/10. Only their background rendering is corrected, with parent geometry and actions preserved. Runtime captures cover Home, location, dialogue, skills, profile/details, farm/crop-picker, work, grammar, vocabulary, catalog, plus register/work,portal,NPCstarter andcity at430×932 and1366×768. Region/prefecture/city-list route-specific navigation is not exhaustively exercised; their shared header renderer is exercised through city.

## Validation and limits

Production-web export, changed-source ESLint, paired-flow regression, native Yoga reproduction/fix, JLPT UI lock10/10, navigation contract and git diff --check PASS. TypeScript still fails only at pre-existing life-content-repository.ts:41 missing type in SC-HKD-HAKODATE-001; no changed-file diagnostic.

Runtime web:360×800,430×932,768×1024,1366×768,932×430. Controlled SpeechSynthesis callbacks prove NPC-only before completion, player+microphone aftercompletion, stable NPC placement across reveal and NPC-only on the next pair. Station runs atfive sizes and cafe/bank/hospital/restaurant additionally at430. Gold/red hints exercised. Six skills images have no NPC-card source; heading color verified. Actual screenshots inspected for Home,location,skills,portrait/landscape dialogue and shared controls. Background images are compared with their padding-free host bounds. This does not prove native rendering, safearea, actual audio/recognition, or readability on every device. Compact landscape dialogue still uses small fitted text; native acceptance remains pending. The farm map still has pre-existing fragmented plot decorations, and a profile detail symbol has a pre-existing unsupported glyph; neither is caused by these background-layer changes and neither is edited in this scope. No loading/entry animation is added.

Evidence: runtime.json and JPG captures under docs/ui-workspace/native-frame-player-1340-2026-10-03/. User screenshot paths are read-only and not copied into the repository.

## Industry asset generation

Built-in imagegen used; all six1254×1254 output PNGs copied unchanged into assets/app/industries/. Prompt template: square polished realistic2.5D workplace miniature, warm natural lighting, navy/brass accents, tactile materials, centered objects legible at54px, no humans/NPC portraits/frame/text/logo/watermark. Subjects: vegetable field/greenhouse/tractor; excavator/crane/materials; restaurant stove/pot/knife/meal; stainless food conveyor/sealedcontainers/mixer; care room/wheelchair/bed/nursecall/blanket; hotel reception/bell/key/suitcase. Generated source originals remain intact. These are decorative industry illustrations, not authoritative safety procedures.
