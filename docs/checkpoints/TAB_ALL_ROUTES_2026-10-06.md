# All-route forward/back transition repair — 2026-10-06

User scope: repair deeper-screen flicker throughout every forward/back route and branch, applying the Tokutei approach. Base: 7109b9fcae1b29b8d1cde023522b4688071c59ca on recovery/jlpt-n3-n1. Source backup: .jlpt-backups/all-routes-20261006/sha256.json. No exam datasets, recordings, theme tokens, scoring, session-storage implementation or economy state rules were edited.

## Implementation

- All 145 TSX files audited: screen safe-area spacing is computed in the same React render as content; no native SafeAreaView import remains. Root initial native metrics and profile-modal metrics avoid late inset application.
- Every existing push, replace, dismissTo and Back call goes through artwork preparation. Back resolves the actual nested previous history entry, including encoded dynamic parameters. Static routes take precedence over generic two-segment routes. Newer taps/history changes cancel obsolete pending navigation; failed preparation preserves the current screen.
- Generated import-graph inventory covers all 58 route templates and 206 distinct static images. Selected exam illustrations and dynamic map/city/location/NPC scenes are prepared separately. Both native numeric module IDs and web URI modules are decoded/cached before dispatch.
- The persistent root retains the outgoing bitmap until the incoming image's onDisplay, with stable keys and stale-callback guards. World scenes preserve their original sources, blur settings and full-frame cover geometry. Map canvases retain their own geometry over the original dark root. Blurred local page artwork also uses a display-aware handoff.
- Farm map and five area backgrounds share the persistent compositor. Local background copies are suppressed while their interactive hotspots keep the original cover calculations. Area entry and return prepare artwork first; Android hardware Back inside an area returns to the map before leaving the game.
- Android native image entry fades and modal slide/fade transitions are removed. Navigator animation remains none. Native swipe-back gestures are disabled so navigation uses the prepared button/hardware-Back path.
- Exam selection loads the selected saved session before replacing the catalog, eliminating the header-only lookup view. Existing new/resume/results, answers, scroll/audio continuation, internal Back and save behavior remain. The protected UI changes are relocked in V17.
- Runtime inspection found two existing web crashes: dictionary routes lacked their SQLiteProvider; question illustrations called native-only resolveAssetSource. Web now uses the real bundled SQLite database and expo-asset illustration dimensions. Welcome music waits for a user gesture on web, preserving native playback behavior.

## Evidence

The final production export and Chromium run visited all 58 templates successfully, with 0 blocked templates and 0 page errors. It performed 119 actual UI actions, including:

- Home → Learn → N5 → grammar/characters/vocabulary → word detail, with Back at every depth;
- catalog → selected exam → start → answer → internal Back → catalog → parent screens;
- Home → Tokutei → Back;
- Japan → Hokkaido → prefecture → city → station → dialogue, and Back through all levels;
- outer task/profile/home tabs;
- all four portal-selection branches and return, education new-class/classroom/N5 branches and return;
- profile details modal open/close;
- farm map → each of vegetable/orchard/chicken/cow/restaurant → map.

Deep flows ran at 430×932, 768×1024 and 1024×768. Continuous DOM image audits recorded 1,217 frames across those flows plus portal/farm paths: 0 missing-root frames, 0 wrong root bounds. Representative grammar, character, vocabulary, exam and dialogue screenshots were inspected; the station scene displays its real clear background in landscape. Machine-readable evidence: ../ui-workspace/all-route-transitions-2026-10-06/runtime.json.

Validation passed: all-route transition contract (including actual URI image decode/deduplication), generated-artwork inventory, background ownership, JLPT navigation contract, approved UI lock, catalog completeness, structured exams, no-scanned runtime, 65-item inventory, protected N1 2012-12 integration and N1 2013-07 integration (35 audio segments decoded, audio hash unchanged). The N1 2013-07 validator's two stale UI assertions were aligned with the existing approved policy: feedback is submitted-only; transcripts remain hidden. Dataset/audio gates were preserved.

Scoped ESLint: 0 errors, 24 existing warnings. TypeScript reports only the pre-existing TS2352 at src/services/life-content-repository.ts:41 (SC-HKD-HAKODATE-001 lacks the required type field); there are no new TypeScript diagnostics. git diff --check passed.

## Limits and reproduction

This verifies route-template coverage and the listed actual branches on a production web build. It does not exercise every city/scenario/entity, every saved-state combination, Android hardware input or the native compositor. iOS/Android simulator/device visual acceptance remains pending; no claim of native zero-flicker is made.

Run node scripts/generate-route-artwork.cjs --check, node scripts/check-all-route-transitions.cjs and the UI/navigation lock checks. Export with npx expo export --platform web --output-dir /tmp/japan-app-full-navigation-web. The browser script requires Playwright (available through CODEX_PRIMARY_RUNTIME_NODE_MODULES or normal Node resolution); JAPAN_UI_BROWSER_PATH may select an installed Chromium. Run node scripts/capture-all-route-transitions.cjs. Its server and browser run in the same process; failures, page errors, empty-root frames and wrong bounds produce a nonzero exit. Use JAPAN_UI_BUILD_DIR / JAPAN_UI_OUTPUT_DIR to change directories.

Remote durability must be verified with node scripts/check-work-persistence.mjs after publication. This checkpoint does not substitute for that gate.
