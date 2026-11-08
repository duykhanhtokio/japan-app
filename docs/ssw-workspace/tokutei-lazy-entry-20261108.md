# Tokutei entry performance — 2026-11-08

## Implemented

Six sector route shells (agriculture, food manufacturing, restaurant, hospitality, manufacturing, construction) now show the existing level/specialty choice before importing the reader. Only the selected reader is requested; its initial selection is passed through, avoiding a second selection step. Learner identity and existing storage keys remain unchanged. Shared Royal controls remain in use.

Five shared calendars defer question-bank collection until weekly review opens. Manufacturing defers assembling its supplemental assessment banks. Hospitality no longer loads every lesson merely to collect questions while entering the calendar. The selected reader may still contain sizable static imports: this is not a complete per-lesson bundle split.

Kaigo defers its unchanged question/distractor construction until assessments are used. Calendar titles use an exact generated snapshot of all 176 Japanese lesson metadata entries; full Japanese master sections and translation batches load on first use. The snapshot generator checks all 26 source hashes and exact metadata equality. No curriculum, translations, questions, answers, progress keys or completion rules are rewritten.

## Validation

- Six entry shells: no reader import before choice; selected level/specialty/field and learner identity preserved; Back returns to selector.
- Kaigo fixed-fixture question output matches the previous eager implementation SHA-256; zero assessment construction during calendar import. Metadata access does not read full masters or translations.
- Shared calendar runtime: no question loader call before weekly review; seven days, saved results, final-week review, no answers before submission.
- All three manufacturing specialties: selector → week 1 → day 1 with real source/data and a mocked native host. Metro dependency collection passes.
- Approved JLPT UI lock: 10/10 unchanged.
- Full TypeScript check remains blocked by missing unrelated files in this sparse checkout; no diagnostics for the changed entry/calendar/course/Kaigo/lazy-record files.

These checks do not measure an iPhone or simulator. Development Metro on-demand compilation, network latency, and the selected reader module can still delay first use. No zero-latency claim is made. Confirm cold and warm navigation on the target device and a release build.
