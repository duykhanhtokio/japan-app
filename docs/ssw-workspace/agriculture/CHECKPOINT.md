# Agriculture authoring — 2026-10-25

Status: IN_PROGRESS. Full publisher requirements are preserved in AUTHORING_REQUIREMENTS_VI.md.

Source inventory accounts for both supplied PDFs (105 + 132 = 237 pages), source hashes, printed/PDF offsets and all chapter starts. This is extraction/accounting, NOT a claim to have read or reviewed every page. 11 specific page images have been checked; fields distinguish extraction from partial semantic mapping. PDF binaries, source text and source images were not published.

Implemented: 6 independently written Japanese introductory lessons (3 shared by 1go/2go, 3 chapter1 extensions for2go), 36 linked learning units, 20 new weekly questions (8 for1go,12 for2go), 1 original native process diagram. Rice lesson has direct Japanese-to-12-locale drafts; the other5lessons have60locale drafts pending. Term readings remain Japanese. All native/domain/human flags remain false. 30minutes is a planning target, not measured learning time.

Runtime: development-only Agriculture route from the existing sector menu. Uses approved Tokutei header/day cards, reading appearance and Royal components. Independent learner/level/revision-bound progress and test keys. Explicit completion saves then returns to calendar. Reader pairs Japanese and selected-language draft; absent/stale translation is stated, never replaced by another language. Weekly tests hide explanations until submission, preserve answers/current question, confirm submission/restart, and show completion on the list. No production unlock and no fake full-course or mock entries.

Validation: source/data/state check, Chromium reader for12locales, four widths/orientations, completion failure/retry/reload,1go/2go isolation, weekly attempt resume, cancelled submission and answer hiding. Browser uses explicit Royal/background/safe-area/storage adapters; it does NOT certify native artwork, native fonts, Expo build or device behavior. browser-qa.json records limits.

No complete mock exams exist yet:0/20 forms,0/800questions. Full knowledge denominator, lesson calendar length, source semantic coverage, remaining translations, recognition imagery and source-domain review remain open. Do not turn page counts into coverage percentages. No AI authoring background process or automatic continuation has been started.

Resume from progress.json: complete missing chapter1detail mapping, then source1PDF8/printed2 and source2PDF9/printed7, chapter耕種農業一般. Current quarantine for historical entry/biosecurity instructions and variety-rights rules blocks those topics only; verify current authoritative sources before teaching them as current rules. Do not copy the old source instructions as legal advice.

Only Agriculture files and the narrow Agriculture development-menu entry belong to this unit. Preserve audio factory, translations and other sector work. Persist the checked unit to recovery/jlpt-n3-n1 and verify the exact remote commit before claiming durable completion.


## Batch02 — continuation 2026-10-25

Added9source-bound Japanese lessons across14new page images: source1PDF8–13 and source2PDF9–16. Six shared foundation lessons cover organs/growth, plant processes, flower buds, crop plans, germination and nursery/transplanting. Three2go-specific extensions cover use-based crop classification, light saturation/water responses and sowing patterns/row spacing. Reused one24-question weekly bank across1go/2go while preserving separate attempt keys; added12questions for2go extensions. Original first-week revisions and source hashes remain stable.

Current totals:15Japanese lessons,90mapped units,56distinct weekly questions,3original concept diagrams,24lesson-locale drafts (rice and organs each12locales),25page images checked. The remaining13authored lessons need156locale drafts. No full mock forms or800-question bank have been created. No fixed total weeks, measured30minute learning time, full source coverage or human/native/domain/device certification is claimed.

Source differences explicitly retain the2go saturation-point boundary and row spacing. Shared text does not turn increasing light into an unlimited rule, short-day into universal fixed hours, or hand planting into a blanket zero-cost guarantee. Dot sowing diagram is schematic, not a real spacing/seed-count prescription. Source2PDF15F1biology and legal seed-saving questions remain unfinished.

Resume at source1PDF14/printed8 and source2PDF17/printed15 (watering), while keeping chapter1detail and F1holds in progress.json. No background authoring was launched.


## Parallel03 — six AI, 2026-10-25

Publisher explicitly requested six parallel AI. Three owned disjoint Japanese source packets (water/soil, fertilizer/drainage, crop management/covers/pests), three owned direct translation packets (4+4+5 of the13previously untranslated lessons, all12locales). No worker edited shared canonical files or published. The coordinator validated and integrated results, retaining the original15lesson hashes and all earlier exam revisions.

Added28original Japanese lessons and48weekly questions; added156direct lesson-locale drafts. Current totals are43Japanese lessons,258mapped learning units,104distinct weekly questions,180lesson-locale drafts (the initial15lessons each12locales),76page images checked,3previous concept diagrams. The28new Japanese lessons still need336locale drafts. No mock forms were created:0/20forms and0/800mockquestions. Calendar length,30minute learning time and exhaustive source coverage remain unconfirmed.

Independent AI cross-review is recorded in parallel-03/review-*.json and translation-*-meaning-qa.json. It checked targeted meaning and source scope, not every field in every locale. Coordinator applied31field-level/edit records: plausible distractors, a water sentence punctuation repair with new-lesson hash propagation, evergreen loquat/citrus clarity inEnglish/Thai, and the Indonesian facilitated-light vs required-light qualifier. Correct answer indices remain balanced. Six-worker packet digests and exact applied changes are in parallel-03-manifest.json. Original packet files are retained as authoring evidence; canonical runtime values include coordinator repairs.

Translations now use bounded per-locale JSON shards. translations.json is a schema2index; translations.ts is the runtime adapter. translation-fixture.cjs makes QA read the same files. Old Japanese sources, translated source hashes, existing question cores and all previous persisted keys remain unchanged. Runtime tests show separate1go/2go attempts for shared banks and completion survives reload. Full TypeScript and changed-file ESLint pass; all180translated lesson-locale reader cases load inChromium, plus four viewport cases, failed-save recovery, exam resume/cancel/answer hiding. Royal/background/safe-area/storage browser adapters remain; no native device/build/font certification is implied.

Source problems remain explicit holds: different soil three-phase target ranges/pHcategory descriptions, historical elemental counts, ECthresholdconditions, and drainage headings. External MAFF nutrient resolution is recorded separately, not silently substituted into disputed answer keys. No raw source PDFs/text/images were copied into the public repository. Mechanical48character source-expression scan finds no matching paragraph windows; it is not originality, rights or full semantic certification.

Resume at1goPDF37/printed31(safety),2goPDF48/printed46(remaining general crop content before safetyPDF51/printed49). Revisit detailed older chapter holes and holds in progress/ledger before claiming chapter completion. Six AI finished this batch; no authoring worker is claimed to remain running after the turn.


## Parallel04 — six AI, 2026-10-25

Added30 Japanese lessons (safety, rice work, field/vegetable work),180 mapped units and48 weekly questions. Added336 direct Japanese-to-target translation pairs; first43 lessons now have all12 draft locales. Totals:73 Japanese lessons,438 units,152 distinct weekly questions,516 lesson-locale pairs,133 inspected page images,3 concept diagrams. The30 new lessons need360 more translation pairs. Mock forms remain0/20 and mock questions0/800; exam-authoring-blueprint.json is a provisional allocation, not authored questions or an official exam specification.

Independent targeted AI cross-review produced51 applied source/editorial field repairs. Four water-methods translation bindings were reconciled against current canonical punctuation before integration. Source-specific differences and numeric/legal holds remain explicit, including the sweet-potato source discrepancy. Source-overlap screening found no exact48-character windows across73 lesson paragraphs; this is not semantic, rights or originality certification.

Fixed learner progress validation to accept real lesson IDs containing digits, including2go suffixes; existing stored progress can be restored. Locale translation objects are loaded on selection through explicit local loaders. Data/state checks, TypeScript, ESLint and Chromium checks passed:516 translated lesson-locale cases, four viewports, failed-save retry, completion reload including numeric IDs, level separation, attempt resume and hidden answers before submit. Browser adapters do not certify native device, production Expo build, fonts or artwork.

Resume at1goPDF63/printed57 and2goPDF82/printed80 (facility horticulture), while revisiting source2PDF48–50, F1PDF15, graftingPDF17–19 and older detailed/recognition/regulated holds. Full source semantic coverage, calendar duration, native/domain/human review and release readiness remain false. Six workers completed this batch; no background authoring process remains running.
