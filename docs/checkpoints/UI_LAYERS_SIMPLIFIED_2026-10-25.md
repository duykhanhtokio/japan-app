# Layer simplification and laptop alignment — 2026-10-25

Publisher scope: remove B/C/D/F, merge E, optimize A/G; remove Home dimming,
covered map/farm backgrounds, covered reader/modal backgrounds, and repeated
JLPT study decoration. Align the location mission screen shown in the supplied
laptop screenshot. No exam-taking UI redesign or content changes.

## Implementation

- Location: replace the 49% desktop scenario column with one centered column,
  maximum 880px including gutters; guide, mission, Start and history share its axis.
- Press controls: remove depth/spring/translation/scale feedback from world cards,
  map markers, Royal buttons and other named pressed styles. Retain static opacity
  feedback, callbacks, disabled behavior, audio and recording status feedback.
- Remove decorative shadows in unlocked app/shared components and Home dimming.
- Disable lighting even when old preferences had enabled it. Light components render null.
- Paper/HUD/open frames use generated merged bitmaps instead of 8–9 separate image
  children. Web uses one CSS border-image surface; native uses one Image with capInsets.
  HUD retains its original rail scaling on web. Tiny generated assets are ordinary Git
  blobs, so renderer changes and images arrive in the same checkout.
- Root backdrop is suppressed while a focused map, opaque reader or full-screen
  profile detail modal covers it. Game scenes own their backdrop. Ownership cleanup
  restores the shared backdrop when returning to the previous screen.
- The root backdrop mounts one image and prepares replacements before changing its
  displayed source. Local background renderers also avoid old/new image stacks.
- Grammar articles use flat separators; farm tool windows use flat paper panels.
- Navigation waits at most 180ms for artwork, retaining required state/credit checks
  and latest-intent cancellation. Shared controls warm separately. Remove the large
  transitive route-artwork inventory from this preparation path. Focused dynamic
  scenes publish their actual background before paint to avoid a fallback backdrop.
- Correct the pre-existing empty-Set inference in Kaigo figure review metadata with
  Set<string>; runtime data and learning content are unchanged.

## Verification

- TypeScript: `NODE_OPTIONS=--max-old-space-size=8192 npx tsc --noEmit` passed.
  Initial default-heap attempts exhausted memory; a later run identified and then
  corrected one newly introduced Image prop type and the existing Kaigo Set type.
- Changed-file ESLint: 0 errors, 13 warnings (unused imports/values, existing hook
  dependency warnings and duplicate imports). No lint warnings are claimed fixed.
- `node scripts/check-jlpt-approved-ui-lock.mjs`: PASS, all 10 locked files unchanged.
- `node scripts/check-lean-navigation.cjs`: PASS: bounded artwork wait, required
  state guard, cancellation and latest-intent behavior.
- `git diff --check`: PASS.
- Chromium harness mounted the actual Location, Royal frame/button, safe-area,
  focused image and AppBackdrop components, with fixture content/navigation.
  Sizes: 1440×900, 1920×1080, 390×844 and 844×390. Guide/Start/history center axes
  differ by less than 0.01px. Holding Start does not change its position or width.
  Root backdrop count changes from 1 to 0 under an opaque surface, then restores.
  The mission panel has one border surface and zero old slice-image children.
  The original background, controls and fonts were downloaded from this repository
  and verified against their LFS SHA-256 before the final captures.
- Evidence is in `ui-layers-2026-10-25/`. Its screenshots are a component harness,
  not a full Expo end-to-end run. No iOS Simulator, Android, Firefox-on-Mac or
  device frame-rate measurements were performed. Native capInsets rendering and
  the complete live navigation flow still require device review.
