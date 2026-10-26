# Manufacturing SSW1 — first integrated authoring batch

Date: 2026-10-26 (Asia/Tokyo). Branch: recovery/jlpt-n3-n1.
Scope: only the three uploaded SSW1 textbooks. All SSW2 attachments remain excluded.

## Verified work in this batch

- Three source inventories: mechanical169, electrical198, surface207 physical PDF pages (574 total); source hashes, printed/physical page offsets, July2026 edition metadata retained.
- Current official SSW1 structure and October1 errata checked. Corrections are explicit overlays; uploaded sources were not replaced or redistributed.
- Full table-of-contents mapping: mechanical135, electrical160, surface192 (487 entries). This is NOT a complete page-by-page inventory of every diagram/table/formula or proof of full knowledge coverage. All unfilled authoring/week/image/translation fields remain explicit.
- 24 original Japanese lessons, eight per specialty. Activities support an approximate30-minute learning target; learner completion times are not measured. Content source references, revision hashes, vocabulary readings and independent AI editorial/safety reviews are retained.
- Three first-week formative checks,12 questions each. All21 first-week lessons have question coverage. The three eighth lessons have no second-week check yet. These checks are NOT official mock exams; completed official-format mock count remains0/30.
- 48 lesson–locale pairs (all24 lessons in Vietnamese and English) and72 question–locale pairs (all36 questions in both languages). Revision-bound explicit translations; no runtime translation API. Other10 target languages have zero lesson/question translations so far.33 UI labels have draft translations in all12 target languages; this is not full UI/content translation completion.
- Three original2D-color technical diagrams created; Ohm's-law and surface-process diagrams are used in current lessons. QC diagram is registered for a later quality lesson, not falsely assigned to unrelated safety lessons.
- Dev-preview route `/specified-skills/manufacturing` and catalog entry, three specialties, seven-slot weekly calendar with blank days, separate readers and weekly checks, Japanese-first translation toggle, day/night appearance, completion save and return to calendar, revision-bound answer/session persistence and post-submission explanations. Own learner/specialty namespaces; no SSW2 route.
- Existing public-release preview gate is preserved. This is not a production-ready publication.

## Validation and limits

- `scripts/manufacturing/check.cjs`: validates source offsets, lesson hashes/links,487 unique TOC mappings, assessments, answer distribution, translation coverage/revisions and progress/session isolation/corruption behavior.
- `scripts/manufacturing/check-browser.cjs`: actual React Native Web manufacturing component, with storage/safe-area/Royal background adapters. Five viewports320x568,390x844,768x1024,1440x900,932x430; fifteen reader screenshots; completion-save failure/retry/auto-return; quiz answer/position restoration and submit/review;48 translated-reader visits; missing-translation notice; translated quiz rationales hidden until submit. See browser/result.json.
- Browser evidence is scoped. It does NOT certify full Expo navigation/backdrop fidelity, native device rendering, iPhone/Android operation or startup performance of the full app.
- Seven changed/new TypeScript source files transpile. Full semantic `tsc`, Expo build and repository lint remain unrun because this sparse checkout lacks Expo/TypeScript project dependencies and ordinary app assets. Esbuild warns that `expo/tsconfig.base` is unavailable. Do not call this a full build pass.
- JLPT approved UI lock10/10 passes. No JLPT files changed.
- Source QA selected-page visual review and AI text checks are not specialist/native certification. All release/native/domain flags remain false.

## Next work, in order

1. Complete source page-object atomization, especially diagrams/tables/formulas; overlay every erratum and resolve source ambiguities before affected authorship. Determine a full curriculum/week allocation from this evidence rather than extrapolating the first batch.
2. Author remaining units from each TOC matrix, with proper prerequisites and shared-foundation revision identity. Complete second-week checks and relevant illustrations; do not mark mapped headings as fully taught.
3. Build10 original official-format SSW1 forms per specialty,30 total. Preserve30 true/false theory items/40minutes and10 practical multiple-choice items/40minutes; separate section thresholds/timers. Existing four-choice weekly-check helper does not implement the two-choice theory mock runner.
4. Complete all12 target-language lesson/question/UI translations; maintain source revisions and independently check completeness, numbers, negation and terminology. Current VI/EN are drafts, not native-certified.
5. Run full Expo semantic/build/lint and actual device/whole-app integration checks in a complete checkout. Preserve source/UI locks and other sectors' work.

## Continuation files

`approved-scope.json`, `knowledge-matrix.json`, three `*-inventory.json`, `source-qa-report.json`, `authored-content-qa.json`, `runtime-source-bindings.json`, `illustration-register.json`, `src/data/manufacturing/course-manifest.json` and both validators are the resume point. No background worker is implied by this checkpoint.
