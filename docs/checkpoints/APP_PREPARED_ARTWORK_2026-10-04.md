# Prepare the complete destination artwork before navigation

Base: b5afac16a59f46679391e3edaf8d39f1d3081fd1, the exact rollback of 5154a632. Branch: recovery/jlpt-n3-n1.

User instruction: do not assemble the background, approved overlays, Royal frames and content pictures progressively after navigation. Keep the restored design and prepare the destination resources together before revealing that route.

Implementation:
- Keep React Native Image, expo-image, FocusedImageBackground, FocusedArtwork, RoyalPaperPanel, all background ownership rules, approved overlays and layout calculations unchanged.
- Download assets and populate both the original React Native source URI cache and expo-image's URI/local-file cache. No ImageRef substitution, hidden image views, CSS renderer replacement, new wash, or background removal.
- Deduplicate preparation by module ID; remove failed promises so the next user tap can retry.
- Prepare 47 existing common control images plus per-screen static artwork. Prepare the selected map variant, city cards, location cards, location background and NPC when required by the destination.
- Gate push/replace at existing navigation call sites. Keep the current screen while preparation is pending. The latest tap wins; a navigation state change cancels obsolete pending work. A preparation failure logs an error and does not navigate.
- Prepare both renderer caches for in-route farm area changes before switching state.
- Startup keeps the existing splash until fonts and image preparation succeed. A startup asset failure stays on that splash and reports the failure in Metro logs; restart after resolving asset/network availability. No timed fade or layer reveal was introduced.
- Locked JLPT exam and catalog route files are unchanged. Internal exam start/resume/results state transitions remain unchanged; their static backdrop and controls were already prepared at startup.

Validation:
- Production Expo Web export succeeded with the actual assets restored by Git LFS.
- Real Chromium at 430 x 932 completed 13 UI actions without page errors: Home, learning, N5, grammar, Back to Home, Japan map, Kanto, Tokyo, Chiyoda, station, dialogue. Inspected Home/map/dialogue screenshots: HUD, bottom navigation, map imagery, NPC, controls and frames are present. These are stable screen inspections, not proof of identical compositor-frame timing.
- Mocked async tests passed: defer navigation until preparation finishes, latest tap wins, cancellation, failed load stays, retry, deduplication, original native URI and both renderer caches. These do not certify native image decoding.
- JLPT UI lock PASS 10/10; navigation contract PASS; diff whitespace check PASS.
- TypeScript reports only the existing TS2352 at src/services/life-content-repository.ts:41 (SC-HKD-HAKODATE-001 lacks type). No new errors.
- No assets, dialogue content, audio, scoring, economy or image geometry changed.

Native iOS/Android runtime verification remains pending. This Linux environment has no connected native simulator/device. Prefetch readiness does not guarantee that the OS compositor paints every layer in one physical frame; verify cold/warm navigation and rapid Back in the user's Simulator before acceptance. Do not report whole-app or native visual approval from the web and async checks.

If screen assets are added later, update common-artwork.ts / route-artwork.ts and the dynamic destination preparation alongside the original screen references. Do not convert the renderer or delete visible layers to improve background-count metrics.
