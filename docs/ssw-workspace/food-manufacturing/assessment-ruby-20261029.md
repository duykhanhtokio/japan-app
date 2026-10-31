# Assessment ruby — 2026-10-29

Base: `6088974449798cbac1dbdb5c8e83197a23ce51e4`.
Branch: `feature/food-continue-20261029`.

Added explicit offline readings for the first weekly check of both levels: six questions, 60 fields (stems, all four options, explanations and all four option reasons). Canonical Japanese, ordering, answers, translation hashes, exam revisions and storage keys are preserved. Readings are AI-authored candidates, not native-reviewed pronunciation.

The food assessment screen now uses a sector-local ruby renderer. Option buttons retain their plain Japanese accessibility label, selection and disabled behavior. Explanations/reasons remain inside the existing submitted-only branch. Missing, stale, malformed or incomplete readings fall back to the canonical plain text. No shared Japanese or JLPT component was changed.

Validation executed:
- Actual reading loader: 60 fields, 120 stale/text-change rejections, 240 malformed/incomplete rejections, 833 uncovered-question fallbacks PASS.
- Actual new component and course TSX transform, bundled loader PASS. The Expo base tsconfig is unavailable; this is not a full TypeScript/Expo build.
- State persistence, invalidation, resume, scoring and namespace isolation PASS.
- Actual translation adapter: 10068 current pairs accepted, 10068 stale pairs rejected, zero missing pairs PASS.
- Content structural check and approved JLPT lock 10/10 PASS.
- Diff whitespace check PASS.

No new browser/native/device verification was performed: Chromium is unavailable in this environment. Existing historical screenshots do not certify this change. Answer visibility was preserved in source structure, not re-certified through a live browser.

Remaining: 33 weekly and 800 mock questions still need full reading authoring (833/839); complete source competency/visual verification, 92 source-range candidates, remaining illustrations/terminology/native review, full Expo/device/accessibility/performance acceptance. `scopeComplete=false`, `productionRelease=false`.
