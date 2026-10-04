# App-wide scene display and first-layout safe area — 2026-10-04

The user confirmed the Tokutei branch is fixed, then explicitly requested applying the same approach across all other app branches. Baseline: fb63df017feb93ef998072cc1876ce0cedbcb1f6 on recovery/jlpt-n3-n1.

## Implementation

- DisplayedArtwork keeps the outgoing processed image until expo-image onDisplay. The incoming instance retains its key after handoff. At most outgoing + incoming artwork is mounted; settle to one. Stale display callbacks cannot switch back after a rapid Back or a superseding destination. Failed incoming images leave the outgoing image in place; root errors log the failure.
- AppBackdrop coordinates persistent full-screen artwork outside native-stack detachment. Full-screen scene wrappers register their actual source/blur/fit. Registration uses the screen's own route name/params, retries when the root pathname catches up, and ignores unfocused or mismatched routes. Never register an outgoing screen against the global destination pathname.
- Existing official sources and blur values stay unchanged. Royal page backgrounds, registration, world city/prefecture/location/dialogue backgrounds, responsive Japan/region maps, welcome camera artwork and the five full-viewport farm backgrounds use the shared handoff. Game/world overlay coordinates and cover geometry are unchanged. Welcome camera animation remains tied to its existing animated values.
- Framed card/mission artwork stays local and uses the same onDisplay renderer. A framed mission releases the transitional root image only after its own image displays. It does not stretch its framed scene into a new full-screen image.
- Profile details remain a local modal scene. Transparent modal presentation exposes the already-loaded background during decoding; hide only the underlying profile controls while details are open so they do not bleed through image blur at edges. No cover-up artwork, timer, or onLayout readiness gate is introduced.
- StableSafeAreaView applies existing provider insets in the first React layout. Migrated all 45 native/context SafeAreaView imports in app screens and shared screen components. Preserve context additive/maximum/off modes, existing padding/margin, and legacy core iOS/Android behavior. Tokutei's confirmed explicit-insets layout remains intact.
- Transparent navigator background is applied consistently. No asset, exam data, scoring, audio, economy, dialogue, frame artwork, or hotspot configuration changes.

## Protected JLPT imports

The user's app-wide safe-area instruction authorizes only the same timing fix in JLPT. These three files change imports only, redirecting SafeAreaView to StableSafeAreaView; their non-import TypeScript ASTs match the baseline. Relocked only these three hashes. All other lock entries, the exam controller/session/scoring/audio and UI styles remain unchanged.

| File | Before SHA-256 | After SHA-256 |
|---|---|---|
| src/app/[level]/[section].tsx | 83ad6544a560bda8b08eaa83e25dc2a51d9246cf980e92b4edfa025973c2e5bf | 48a2d0cf21c91aaad3a4f4f243b6e3ed4f4962d3a773d3b4f6d717358b7e6648 |
| src/components/jlpt/ui/JlptExamUI.tsx | fe165bc8c31b96251b932e60d53836d63cfa450cfbd5641fb0f40b108b502c1b | c05a2013de91b552660c9b8618ebc85f8e2ef2f049b75ce6160fcc136d0fecce |
| src/components/jlpt/ApprovedJlptExamCatalog.tsx | 24de357c855e5e22f52965309f3602778ac6e5a67c2638ac3d7dc7eb1bb2349e | f9483fe423780ed8b757894415c581a86d5bc1bdf3407a1516f9733e52b430eb |

## Validation

- Isolated React contract checks pass: delayed display retains the outgoing instance; onDisplay preserves the destination instance; stale/superseded callbacks do not switch back; unavailable destinations keep the previous image; root registration retries after pathname updates; unfocused registration is ignored; first-layout nonzero insets preserve additive/maximum/off and legacy behavior. Reusable check: scripts/check-scene-display-contract.cjs (requires react-test-renderer matching the installed React version; SCENE_RENDERER_MODULE can supply an external tool module).
- Actual web navigation across Home/Tokutei/learn/world/game/tasks/profile at 430×932, 768×1024 and 1024×768 passes. Correct destination asset verified; settled background bounds equal viewport; 589 sampled animation frames, zero without a loaded root image and zero page errors. DOM image-ready sampling is not native/pixel/compositor evidence.
- 75 representative cold routes inspected. Two dictionary routes fail with the same pre-existing missing SQLiteProvider error in the baseline build. The sample lesson/play ID reports its existing not-found state; the harness text-length threshold times out on that short message. All other route captures have a loaded official root image, except the intentionally framed mission that owns its local scene. Evidence is in APP_WIDE_SCENE_DISPLAY_EVIDENCE_2026-10-04.json.
- Five farm areas and return to map pass; profile details open/close passes; N1/N5 exam entry/exit passes without replacing the already-mounted study bitmap. Screenshots inspected for frame coverage, overlays and profile modal ghosting.
- Expo web export passes. JLPT UI lock 10/10 and navigation contract pass; non-import AST comparison passes for the three protected files. Shared-component ESLint passes with zero warnings/errors. git diff --check passes.
- TypeScript reports only the existing TS2352 at src/services/life-content-repository.ts:41 (SC-HKD-HAKODATE-001 missing type).
- No native iPhone/iPad/Android runtime is available here. Tokutei acceptance was supplied by the user. App-wide device acceptance remains pending; do not claim every native branch is visually verified from these web checks.
