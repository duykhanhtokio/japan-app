# Tab safe-area and backdrop handoff

User request: fix flashing and displaced layers on tab clicks, using Tokutei as the reference. Base: 6e1823eb96de5e49e1455073758aab61e0a70bfc, recovery/jlpt-n3-n1.

## Implemented

- Learn, Tasks, Profile, Settings, Conversation Log and Game use an ordinary View with safe-area spacing derived from useSafeAreaInsets in the same React render. Preserve existing edge selection and numeric padding/margin. This applies Tokutei's confirmed displaced-text fix without waiting for onLayout or adding a concealment layer.
- The persistent Home/Tokutei backdrop also handles the existing shared study/dark artwork. A shared route change no longer replaces the source of one image immediately: keep the outgoing displayed bitmap until the destination emits expo-image onDisplay. Stable keys preserve the destination image; stale callbacks after rapid navigation cannot select an obsolete destination.
- Navigator theme background stays transparent to avoid reintroducing DefaultTheme's white backdrop on other routes. Each route retains its approved scene/background ownership.
- Existing prepareSceneRoute, blur 40, artwork, cover geometry, HUD/frame geometry, dialogue data, audio and exam behavior are unchanged. The ten byte-locked JLPT files remain untouched.

## Validation and limits

- Clean base verified on the remote with WORK PERSISTENCE PASS before editing.
- Mocked execution of the actual transpiled components passed: inset arithmetic, edge selection, maximum spacing, margin mode, forwarded props, retention until onDisplay, stale callbacks, rapid changes and stable destination keys.
- Targeted ESLint: zero errors; two existing unused-variable warnings in Game and Profile.
- TypeScript: only the previously documented TS2352 at life-content-repository.ts:41 (SC-HKD-HAKODATE-001 lacks type).
- JLPT approved UI lock PASS 10/10; navigation contract PASS; whitespace check PASS.
- No native Simulator/device is connected. No native compositor or visual acceptance is claimed. Prefetch and bitmap handoff do not prove every foreground image paints in the same physical frame. Profile and Game retain their own scene renderer; protected JLPT study/exam safe-area implementations remain unchanged.

Next verification: cold/warm Home -> Tasks -> Profile -> Game -> Home, Home -> Learn, Home -> Tokutei and rapid Back on the user's Simulator. Check first-frame header/nav bounds and whether any approved foreground frame still appears late. Do not declare the device flashing resolved solely from these automated checks.
