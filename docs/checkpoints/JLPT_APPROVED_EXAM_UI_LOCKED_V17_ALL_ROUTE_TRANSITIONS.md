# V17 — all-route transition preparation and stable safe-area layout

User authorization: 2026-10-06, comprehensively repair every forward/back branch, using Tokutei. Base: 7109b9fcae1b29b8d1cde023522b4688071c59ca, recovery/jlpt-n3-n1.

## Narrow protected-file changes

- Study route: prepared Back/fallback navigation, stable safe-area and no Android image entry fade.
- Catalog: stable safe-area, prepare selected illustrations and saved session before replacing the catalog; internal exit still clears selected state exactly once.
- Trial: optional already-loaded session initializes the first start/resume/results offer; direct consumers keep their existing asynchronous lookup guard. Existing answers, scoring, resume position, audio and save callbacks remain in place. Disable native image entry fades; resolve question illustration dimensions through expo-asset on web where RN has no resolveAssetSource. Native sizing stays unchanged.
- Exam UI: use the same React-computed safe-area geometry in the resume prompt.
- Historical scanned component: same safe-area / image-entry defaults only; remains unregistered in runnable catalog.

## Relocked SHA-256

- `src/app/[level]/[section].tsx`
  - Before: `83ad6544a560bda8b08eaa83e25dc2a51d9246cf980e92b4edfa025973c2e5bf`
  - After: `8766dd0457955ae2c110a6f1dbe6d61ec1d35e5fc126c6ab04bff9df7c953acf`
- `src/components/jlpt/N1OfficialTrial.tsx`
  - Before: `b007dce70ab8a5a5ce5160e804614f326c87b31c1c1d0f0c7324faf542629daf`
  - After: `65f584d660cc852cbd2a37deddec4a088c414d44aa40335686d91dfcade9b943`
- `src/components/jlpt/ui/JlptExamUI.tsx`
  - Before: `fe165bc8c31b96251b932e60d53836d63cfa450cfbd5641fb0f40b108b502c1b`
  - After: `5bdfbf27a8653d8d9153c4211987f8c100d5b72f611e1bdb7343d44bfa6545e6`
- `src/components/jlpt/ApprovedJlptExamCatalog.tsx`
  - Before: `24de357c855e5e22f52965309f3602778ac6e5a67c2638ac3d7dc7eb1bb2349e`
  - After: `5d937daad922ea391203d17d727cccfcf876d33e65a3258914407ca3f207b3bf`
- `src/components/jlpt/ApprovedScannedExam.tsx`
  - Before: `efa9b3abdcd3097b96415ecf731fe1400433dbdd53e38b606d3a6324aba728a9`
  - After: `e3e7a158bb11815af53a0658df0513efb2fda12bca823eee1067456c9cf0dd5d`

Theme tokens, session-storage implementation, exam datasets and protected N1 2012-12 audio/explanations remain unchanged. This lock records the authorized implementation scope; native visual acceptance remains pending. See TAB_ALL_ROUTES_2026-10-06.md for validation and coverage.
