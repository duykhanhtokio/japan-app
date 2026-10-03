# Home frame sizing, actual exam safe area and render audit

2026-10-03. User requested fitting frames to the three Home images, restoring actual JLPT Back/header and removing obsolete UI layers.

## Concrete causes and changes

All three source images are 2172 × 724 (3:1). The old frame used an outer 3:1 ratio plus a 124-pixel minimum, although its gold edges reduce the image opening by different amounts horizontally and vertically. Compute the outer height from the opening instead: (width − left − right)/3 + top + bottom. Remove the minimum height. Artwork and frame share numeric bounds on their first render; unchanged source artwork fills an exact 3:1 opening. At width 360 the card shrinks from 124 to about 114 pixels; wider frames use the exact opening-derived size rather than an arbitrary reduction. Text padding is adjusted to fit.

Home previously waited for onLayout both for artwork and for border images. Its border now uses eight pixel-identical cropped source slices immediately, preloaded at startup. The immediate-border option applies only to Home: narrow energy/EXP frames retain their existing geometry.

The V13 safe-area removal affected the selected exam too. Restore a single ivory SafeAreaView around the approved runner. The brown catalog still extends through the full screen. Controller/session/audio/answer/result files remain unchanged.

Import/render audit: active route loads ApprovedJlptExamCatalog and its selected branch renders only N1OfficialTrial. Catalog and exam branches are mutually exclusive. Legacy N1ExamCatalog has no caller in app routes; its historical children have no active caller beyond that orphan module. No evidence that two exam UIs run simultaneously. Do not delete historical source/data to remedy an unverified theory. Stack animations remain none; freezeOnBlur prevents inactive native screens from continuing updates. Paper cards already use the single immediate sliced renderer.

## Validation

Production web export PASS. Targeted ESLint PASS. UI lock 10/10 PASS. Four browser sizes: 360×800, 430×932, 768×1024, 1366×768. Home opening ratio within 0.005 of 3, image containment/coverage and clipping PASS; visual screenshot inspection at 430×932. Exam start/safe-area wrapper/Back PASS. Grammar/vocabulary frames, lazy grammar loading, vocabulary search, transparent catalog, resume/restart confirmation/cancel PASS. Browser page errors: zero. Three grammar/vocabulary round trips at each size: observed ready times 58–141 ms including automation waits; no >50 ms JavaScript long tasks. This is browser evidence, not a native performance guarantee.

Native simulator/device unavailable. Notch alignment requires user device acceptance. Actual N5 running-question web compatibility is outside this change; its existing Image.resolveAssetSource dependency remains unchanged. TypeScript still reports the pre-existing life-content-repository.ts:41 missing scenario type, unrelated to UI; no changed-file diagnostics.

Evidence: docs/ui-workspace/royal-safearea-1205-2026-10-03/runtime.json and screenshots. Reproduction: scripts/capture-royal-safearea-1205.cjs against the production web export on port 8119. Prior source backup/hashes: .jlpt-backups/ui-frame-safearea-1205-2026-10-03.
