# Restore original frames — 2026-10-25

The publisher rejected the merged frames after an iOS Simulator screenshot showed
stretched rails and misplaced borders throughout the app.

Restored the exact pre-merge RoyalPaperPanel, shared/Home frame inventories and
GrammarCatalog from 923b13817429acd6dcbba06ee040b362e6ae8449. Restored the original
HUD energy rail renderer, retaining the separately requested removal of shadows.
FarmPanel is now a compatibility alias for the original RoyalContentPanel.
There are no active merged bitmap, border-image or edgeScale references in src.
Existing unused merged asset files are retained, not loaded by these renderers.

Kept the laptop alignment, static button feedback, removal of decorative lighting
and shadows, backdrop occlusion and navigation loading improvements.

Validation: TypeScript passed with 8GB heap; six changed components/inventories
passed ESLint with no errors or warnings; JLPT UI lock passed; navigation guard
checks passed; git diff --check passed. The four restored frame/catalog source
files match their pre-merge Git blobs byte for byte. A Chromium component harness
still passes alignment, stationary-button and backdrop-occlusion checks at
1440x900, 1920x1080, 390x844 and 844x390. No new iOS Simulator rendering claim is
made; the publisher's screenshot is the evidence for reverting the native renderer.

This corrective checkpoint supersedes the frame-merging and flat-panel portions
of UI_LAYERS_SIMPLIFIED_2026-10-25.md.
