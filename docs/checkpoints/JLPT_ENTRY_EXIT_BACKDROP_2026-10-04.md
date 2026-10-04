# JLPT entry/exit backdrop correction — 2026-10-04

User authorization: after reporting a leftover background when selecting/exiting a JLPT exam, the user asked “sửa được không”. This authorizes the narrow background correction below; it does not authorize exam content, scoring, audio, or session changes.

## Final behavior

- ApprovedJlptExamCatalog keeps one JlptStudyBackground mounted across catalog, asynchronous session loading, start, resume, and pre-exam restart confirmation.
- Nested study-background consumers inherit that owner and create no image. The pre-exam SafeAreaView, header, start ScrollView, and start paper are transparent.
- Before exam content is painted, the existing `started` state reports through a layout effect. The parent removes the image for answering, results, and review, retaining the approved paper exam presentation, including the SafeArea background. Exiting resets the phase and shows the catalog artwork in the same state update.
- Pre-exam restart confirmation renders inline on that existing background, without a transparent Modal, dimmer, or old paper rectangle. Confirmation and submission modals inside an active exam retain their existing behavior.
- FocusedImageBackground keeps its outer View and content stable but conditionally mounts the real native Image. It no longer leaves an empty ImageBackground/Image mounted on inactive routes. FocusedArtwork similarly unmounts hidden farm/map artwork.

## Validation

- Before modification: approved UI lock PASS 10/10.
- Actual catalog/controller/UI component regression with mocked native hosts and audio/storage: PASS for catalog -> loading -> start -> cancel; saved session -> inline restart -> cancel -> resume -> exit; fresh exam -> answer -> submit -> results -> exit; route blur/refocus. Preflight preserves the same single image instance, inline restart creates no Modal, active exam/results have zero page-backdrop Images, and exiting restores exactly one.
- Saved answer and listening resume position retained; scoring fixture records one correct answer.
- Generic focus regression: hidden native Image/expo-image artwork unmounts; child state is preserved on both focus transitions.
- AST/source comparison: 11 critical answer/session/exit/restart/submission/scoring functions are unchanged.
- ESLint: zero errors, two pre-existing effect-dependency warnings in N1OfficialTrial (unchanged effects).
- TypeScript: only the existing TS2352 in life-content-repository.ts:41, unchanged by this work.
- git diff --check: PASS.
- Device screenshots/full iPhone visual validation remain pending. Component regression is not device visual approval.

Only the three explicitly affected JLPT visual/controller files are relocked. The other seven hashes, theme tokens, session-storage code, answers, registries, and exam content remain unchanged.

| File | Previous SHA-256 | New SHA-256 |
|---|---|---|
| src/components/jlpt/N1OfficialTrial.tsx | d9fb6ccb033cf4d2349fcc52c73d14ef3b6000194557867d6d031b24c5de124a | cf997285d69027ae5c563a8d2fe9b887672a438ffe1eca85d718f99c67e53d55 |
| src/components/jlpt/ApprovedJlptExamCatalog.tsx | cb86ae494b2bbee7e9e8fe8cd045cb534798c6ad6e93103d537b838fbb8bb010 | f404f0365b32f93d3b146562e876b8782b84695c8d2b0aa5e9881a4adbc264da |
| src/components/jlpt/ui/JlptExamUI.tsx | 6612924f9b155762d44fdfb18b0e8cb315c76a4bb3fecaefa90a8fb71d9530e6 | 097fab56f46a4ef99579a0dcaf741f90b99450351ffa8f9b04602ae606de6f93 |
