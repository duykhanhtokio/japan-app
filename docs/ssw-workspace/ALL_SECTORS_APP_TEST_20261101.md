# All-sector app test access — 2026-11-01

User requested all authored sectors in the app for testing. Target: recovery/jlpt-n3-n1, based on remote-verified 09d7d8b39917ba4c2163a93e2445f47c842b8045.

All seven catalogue entries now open their own real course in development and non-development builds: agriculture, construction, restaurant, food manufacturing, kaigo, hospitality, manufacturing. Existing profile-loading guards, focused-state handling, learner identities, progress keys and language selection are retained. Unknown sectors remain unavailable. This does not certify content or change review flags.

Restaurant and food manufacturing were already accessible on this branch; their source31/source37 supplements remain integrated. Manufacturing includes completion37, recognition38 and daily40/implementation40 extensions. Compared with feature/restaurant-20261026 (8b8f4756), feature/food-continue-20261029 (e8476569) and work/manufacturing-completion (0c0fb0a8), the integrated sector data/component trees contain added files and modifications with no missing branch files. Older sector trees were not copied over the integrated versions.

Validation:
- Actual seven route wrappers rendered with __DEV__=false using mocked course components: 7/7 registered catalogue/routes, correct course selection, learner/language props, six profile-loading guards, focused kaigo prop and unknown-sector rejection passed.
- Separate esbuild linkage checks bundled each real route, reader and its data; external platform/UI packages remained external and media were represented by test modules after checking file existence. Agriculture 210 media references, manufacturing 413, restaurant 122, food manufacturing 90, kaigo 461, construction 304, hospitality 38. All seven passed. This is not an Expo/Metro or physical-device test.
- Agriculture structural checker passed: 241 lessons, 1363 knowledge units, 427 weekly questions, 800 mock questions.
- Manufacturing checker passed: 262 lessons, 456 weekly questions, 30 mocks, completion37 and recognition38 checks passed.
- Restaurant structural checker passed: 120 core lessons, 984 core questions; source31 remains linked by the real reader bundle.
- Food content checker passed: 96 core lessons, 848 core questions.
- Kaigo weekly-calendar model passed: 26 weeks, 176 active days, 687 questions and 866 sections. Daily-plan/link checker passed: 176 planned days. Measured learner timing remains unverified.
- Hospitality progress checker and JLPT approved UI lock (10/10) passed.

Unresolved existing validation drift:
- check-kaigo-app-test.mjs stops at its frozen runtime hash: actual 8a9bdb375c74a1867902fa28a8732d81711b4fbe4148828ca1f7318ad4205508, historical expected a3785348d396e3896a906a1832dc1143843e4781808e8aea5bcfe7a4e8b5ab45. No runtime data or frozen checksum was changed to bypass this.
- check-kensetsu-app-test.mjs expects 3856 paragraphs; current data has 3871. No count or source data was changed to force a pass.
- check-source31.cjs cannot finish its historical-service comparison in this shallow clone because commit 8a0ebfe5 is absent. Its separate real-reader/data linkage and restaurant structural checks passed.
- Updated only the old route-gate assertions in the kaigo/construction test scripts to reflect publisher-authorized test access and the shared route registry.

Physical iPhone/Android testing, full-app Metro export, performance, full source completeness and native/domain acceptance are not claimed. Existing incomplete review flags remain unchanged.
