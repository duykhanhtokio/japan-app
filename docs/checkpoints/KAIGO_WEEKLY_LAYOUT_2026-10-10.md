# Kaigo weekly learning and examination layout — 2026-10-10

Publisher requested clear learning/examination separation and explicit weekly lesson assignments.

The existing176 stable daily entries are presented in26weeks:25weeks of7sessions and a final1session,30minutes each. A collapsed week selector, week/day range and seven daily cards replace12-entry pages. Each card distinguishes study/examination; scheduled mock parts retain existing session IDs and timing. Topic search remains available. Examination catalog groups six skills forms and six Japanese forms. Eight existing practice cases now appear within their related lesson's transfer practice block, within the allotted practice time, rather than a separate extras tab. No authored knowledge, answer key, exam duration, IDs or saved-session keys change.

Validation: daily plan/link validator PASS; catalog/art validator PASS; approved JLPT UI lock10/10 PASS; RN-web production component430px: week1 and26 navigation,12mock buttons/two groups, no page errors PASS. Native simulator not tested. Domain/native/rights review and full source inventory certification remain unconfirmed.

## Continued layout completion

Two primary sections HỌC/THI; week/topic views are subordinate learning navigation. Week summaries list actual topics and counts of study/examination/review sessions. Topic/search pagination says page rather than week. The weekly examination cards distinguish skills part1/part2 and retain the selected day when reopening an examination from the last-opened card. Lesson-day headers use the scheduled day (including review day57), not the historical base-day number. Lesson practice is labeled “Thực hành tình huống”; five-question lesson checks are distinguished from timed mock examinations. Each of the eight existing practice cases has a return-to-parent-lesson button. A last-opened lesson is shown only under learning; a last-opened mock only under examination. All original lesson/atomic/language/mock IDs and examination/session services remain unchanged.

Browser evidence is recorded under `docs/ssw-workspace/kaigo/runtime-tests/2026-10-10-weekly-layout/`. The production KaigoCourse component runs in an isolated React Native Web harness, with the existing panel artwork and a Japanese-capable QA font. This is not a native Simulator test or a full Expo Router test. Full TypeScript reports only the existing `life-content-repository.ts:47` TS2352 missing-type error on the Hakodate index item; no Kaigo diagnostics.
