# JLPT UI lock V14 — restore actual exam safe area

2026-10-03. User explicitly requested restoration of the shifted actual exam Back/header. The V13 route removed its outer SafeAreaView to extend the brown catalog background. The selected exam branch then returned an ivory runner without any safe-area wrapper, putting the header under the device status bar.

Restore one SafeAreaView with the existing ivory page color around the selected runner only. The catalog retains its independent brown full-screen background and safe-area content. All exam controller, session, audio, questions, answers, results and callbacks remain byte-identical. Only ApprovedJlptExamCatalog is relocked.

Old SHA-256: 02041d560d2a9b197c2e7fc6b3027cc5e6f08490172e901c697b98daaf043e9a
New SHA-256: cb86ae494b2bbee7e9e8fe8cd045cb534798c6ad6e93103d537b838fbb8bb010

Web start/Back and wrapper checks: see ROYAL_SAFEAREA_1205_2026-10-03.md. Native notch alignment requires device acceptance; do not label browser screenshots as iPhone simulator results.
