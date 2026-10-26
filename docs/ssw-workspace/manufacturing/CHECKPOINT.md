# Manufacturing SSW1 — batch02 integrated checkpoint

Date: 2026-10-26 (Asia/Tokyo). Branch: recovery/jlpt-n3-n1. Baseline:1ac615db.
Scope remains ONLY the three uploaded SSW1 textbooks. No SSW2 attachment or content used.

## Current verified authored/integrated scope

- 63 original Japanese lessons:21per specialty (24retained +39new). Three complete preview weeks per specialty; these are not the full curriculum duration. Approximately30minutes with written practice perlesson is an unmeasured target.
- 9 formative weekly checks:12questions each,108total (36retained +72new). Every taught lesson in each represented week has a question. Answers balanced3eachposition/check, no triple; new6checks have distinct answersequences. Source and crossbatch semantic reviews performed; two new questions were rewritten to avoid repeated reasoning. This is NOT30official mockexams; completed mock count remains0/30.
- Vietnamese and English cover all63lessons and108questions as explicit AI drafts. Indonesian covers the first8lessons andfirstweeklycheck ofeach specialty only:24/63lessons,36/108questions. Missing target translations remain explicit, with no runtime machine-translation API or English fallback.
- Totals:150lesson–locale pairs and252question–locale pairs. Other9targetlocales have UI labels only; Indonesian also has39lessons/72questions still untranslated.35UIlabels have draft translations for all12targets (plusJapanese).
- Five original2D-color diagrams are now used: Ohm, QC control information, surface process controls, series/parallel quantities and g/L versus mol/L. Small-screen enlargement opens a960px-minimum image with horizontal/vertical scrolling and a fixed close control. No new lesson/image is a source-page reproduction.
- Existing Japanese-first reader, week calendar, ivory/day-night surfaces, learner/specialty progress keys, revision-bound quiz resume and post-submission explanations retained. Dev-preview/public-release gate preserved.

## Source audit and revisions

- Three SHA-bound sources remain169+198+207=574physical pages,487TOC entries.
- New structural page-object inventory enumerates every574page and487TOC link. Printed footers checked with0offset mismatches; frontmatter and colophon pages remain unnumbered.35source-chapter groups are provisional planning units, not35weeks.
- Machine image/table/formula/vector candidates are NOT verified semantic objects. Full page-object semantic inventory, source knowledge coverage and full curriculum allocation remain incomplete; source-gap-review.json explicitly retains544body-page gaps.
- Preserve July2026 textbook identities and October1errata overlays. Additional source printed98normality prose contradicts its example; no normality formula from that passage was taught. Surface lesson012uses corrected acidic/basic oxide definitions.
- Precise current-density formula source printed147/PDF157 added to old surface lesson006 and formative003. Their learner text/answers are unchanged; dependent source hashes/quizrevision rebound. Other old learner text/answers protected, see batch02-baseline-compatibility.json.

## QA and tests

- IndependentAI review: all39newJapanese lessons and72newJapanese questions;78EN/VI lessonpairs+144EN/VI questionpairs (222pairs,2570fields). Separate review of24Indonesian lessonpairs+36questionpairs (60pairs,708fields). Identified technical/meaning/fluency issues were corrected; current runtime/source hashes are in the two batch02QA reports. These are not native/domain/release certificates.
- `scripts/manufacturing/check.cjs`: source/offset/574page inventory,487knowledge IDs, hashes, global unique question IDs/stems, weekly taught coverage, answer distribution, translations and progress/session behavior PASS at63lessons/108questions/150lessonpairs/252questionpairs.
- Browser test:41checks PASS,21screenshots generated across five sizes320x568,390x844,768x1024,1440x900,932x430. Includes150available translated-reader visits,6newweeklychecks, existing resume/submission/save-failure behavior, missing-translation display and answer-rationale concealment before submission. Actual PNGs loaded with natural-width checks; selected new screenshots retained in browser/.
- Focused image test:6enlarge/load/horizontal-pan/close checks PASS at320and932widths. Selected expanded-phone screenshot retained; see browser/batch02-zoom-result.json.
- Browser runs actual manufacturing React Native Web components with storage/safe-area/Royal-backdrop adapters. They do NOT certify full Expo navigation/backdrop, native devices or whole-app startup performance.
- Three changed TS source files syntax-transpile PASS; JLPT byte-lock10/10PASS. Full semantic TypeScript, Expo build and repository lint remain unrun: this sparse checkout lacks the Expo/TypeScript dependencies and ordinary full-app assets. Esbuild's missing expo/tsconfig.base warning is recorded, not counted as full-build success.

## Next work

1. Resolve remaining page-level semantic objects/source ambiguities and full curriculum allocation; structural page coverage is not full taught coverage.
2. Continue remaining source units for each specialty, associated illustrations and week checks; retain deliberate prerequisites/common-foundation mapping.
3. Complete10original official-format forms per specialty (30total). Implement30true/false theory/40minutes and10practical MCQ/40minutes, independent section thresholds/timers. Four-choice formative checks are not this runner.
4. Finish Indonesian missing39/72 and the other9languages across all authored content, then remaining content/UI. Keep source revisions and explicit partial locale manifests.
5. Perform full Expo/build/type/lint and actual whole-app/device verification in a complete checkout. Preserve JLPT UI and other sectors.

Resume from progress.json, knowledge-matrix.json, page-object-inventory.json, source-gap-review.json, course-manifest.json and validators. No background worker is implied by this checkpoint. All native/domain/release flags remain false; wholeCurriculumComplete remains false.
