# Tokutei Home tab position

Base: 47b6ea4bf14675e8f0f7424bb3f36c623ea75ebe. User reports a Home button background briefly appearing above its current position in the Tokutei screen.

Changes: specified-skills anchors the existing BottomNav outside the scrolling SafeAreaView at the bottom safe-area inset; content reserves exactly the existing responsive nav height plus that inset. The nav height formula, artwork, icon sizes, crop, labels and callbacks remain unchanged. Horizontal safe-area insets are retained. BottomNav does not render tab images/controls when its owning route is unfocused; it reserves layout space while that outgoing screen remains mounted.

Evidence: production Expo Web export succeeded. Actual Chromium completed four Home/Tokutei/Back visits at each of 430x932 and 768x1024 without page errors. Tokutei nav bounds stayed (0,848,430,84) and (0,934,768,90), respectively; exactly one Home button existed in each visit. Inspected phone-size screenshot: header, six industry cards and original nav artwork are present.

JLPT lock PASS 10/10; diff whitespace PASS. TypeScript reports only the existing SC-HKD-HAKODATE-001 / TS2352 at life-content-repository.ts:41. No asset, learning-content, locked-exam or economy changes.

Native simulator/device recording is still required to determine whether this resolves the user's transient ghost. These stable browser bounds and screenshots do not certify native frame timing. Safe-area rotation and focus-event timing are not native-verified here.
