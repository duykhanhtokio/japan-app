# 介護 — Japanese source and explicit translations

Publisher instruction, 2026-10-15: align the Kaigo learning UI with construction. The original lesson must be Japanese; display other languages only after an explicit translation action. Japanese knowledge, terminology and grammar must be accurate. This supersedes the former always-visible Vietnamese teaching presentation, but does not certify existing Japanese fields.

## Implemented UI scope

- Common Back anchor: safe-area inset plus shared Royal `screenGutter=12`, `backSafeTop=8`; 44px Back hitbox unchanged.
- Separate week selector, day list and reader; full-width Royal day cards. Construction and Kaigo use the same header/day-card components.
- A successful completion write returns to the week. A failed write leaves the reader open. Completion keys/IDs and existing progress remain unchanged.
- Warm reading appearance: automatic day 07:00–18:59 / night 19:00–06:59 in device local time; explicit Auto/Day/Night preference is stored. Re-evaluate at foreground and each minute. Day source ivory, translated panel warm beige; night source charcoal brown, translated panel dark warm brown. Existing raster assets are retained.
- Construction and Kaigo exam controls sit outside question scroll views. Remove bottom question grids; review one question at a time. Preserve saved answers, position, grading, timer and submit/restart confirmations.
- Japanese reader renders genuine existing Japanese text, vocabulary and dialogue. Vietnamese is behind `翻訳を見る`; unsupported translation languages display an explicit unavailable message rather than Vietnamese fallback.

## Content baseline on 2026-10-15 — NOT complete

Baseline inventory before the 2026-10-16 migration: 176 study days, 866 reading sections. 166 have complete Japanese fields for their current section representation; 700 have missing full Japanese teaching content/context. This is a field-presence screen, not a linguistic or professional certification. A generic line such as `知識を確かめて、理由を説明しましょう。` is excluded as a substitute for lesson text. Some source fields contain only Japanese summaries while detailed knowledge exists only in Vietnamese.

No source JSON was rewritten. Every existing teaching paragraph, section ID, lesson and saved-progress key is preserved. The UI marks missing Japanese explicitly and makes the existing Vietnamese available only through translation. Do NOT report the 700 missing sections as translated, complete, native-reviewed or release-ready.

Detailed per-day IDs: `reviews/japanese-source-audit-2026-10-15.json`.

Next content work: produce and verify complete Japanese text for the listed missing section IDs using the original knowledge/source contract, then bind each language's translations to that Japanese master. Read the full Kaigo authoring rules and relevant source pages before substantive authoring. Do not replace missing content with summaries, noun substitutions or runtime translation. Preserve every existing paragraph during reconciliation and rerun the audit. Native/professional review remains outstanding for all 866 sections; no source-book coverage percentage is established by this audit.

## Validation boundaries

`node scripts/check-tokutei-course-flow.cjs` uses isolated native host/image fixtures, the real hooks/storage logic and all actual Kaigo curriculum data; construction uses a bounded content fixture. Covers save-success return, save-failure retention in both sectors, explicit translation, native Text ancestry, fixed exam controls, restart and submitted answer lock. Requires `react`, `react-test-renderer` and `esbuild`; `TOKUTEI_QA_MODULES` can point to an isolated dependency folder.

Scoped TypeScript check uses real React Native declarations and lightweight declarations for unrelated shared UI/context dependencies. This is not a whole-app typecheck. Browser layout harness uses actual component styles/events with fixture raster art and construction questions. Neither test substitutes for iPhone/iPad/Android native screenshots or native-speaker/professional approval.

All human/native/domain/device/release approval flags remain false. This checkpoint records an incomplete Japanese content migration, not completion of publisher item 7.

## Interrupted-session recovery and all-day text regression

The publisher's 23:21 screenshot shows a disconnected ChatGPT session and a native warning, `Text strings must be rendered within a <Text>`. On resumption, the working tree was clean at `de890a1e`; the configured remote independently advertised that same commit and the persistence validator passed. The screenshot alone does not identify the Mac's running source revision, nor prove that the warning remains in that commit.

Expanded the course-flow validator to open all 176 real study days and all 866 sections through the actual Kaigo reader. For every day it checks native-host text ancestry before translation, after explicit translation and after closing translation; checks that each existing Vietnamese teaching paragraph is preserved; checks that no Vietnamese text leaks before translation; and returns to the selected week. The isolated fixture run passes for all 176/866. This does not reproduce or certify the iOS runtime: shared Royal panels/backgrounds and native hosts remain fixtures. Do not report the screenshot's device warning as fixed from this result alone. Obtain its native component stack and running revision if it persists after updating the Mac.

The curriculum remains unchanged: 166 complete Japanese representations and 700 sections missing full Japanese content. No Japanese authorship or source-coverage claim was made in this recovery unit. The canonical source PDF is accessible by its existing Library ID; the source-dependent authoring contract and relevant pages still apply to subsequent content work.


## 2026-10-16 — Japanese-master migration, week1 draft

Publisher approved Japanese as the canonical content language, with direct translations into all 12 supported non-Japanese languages. Rules v12 / plan v16 supersede the former Vietnamese-first explanations.

- Baseline commit:7091e33b3304111040846f9fb1c7186fb6d1c1f5, independently fetched and WORK PERSISTENCE PASS before edits. Source PDF bytes match997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54.
- Week1:73 section masters /246 Japanese paragraphs, including goals, concepts,25 Japanese glossary definitions, preserved Japanese dialogue and readings, completed Japanese situation contexts and transfer responses, three depth sections. They are AI editorial drafts, not human/domain/native approved.
- New adapter overlays by stable section IDs. Original runtime JSON, weekly questions, IDs, old storage/revision keys and image assets remain unchanged. One source-master field-presence count rises from166 to225;641 sections still lack full Japanese representations. This is not knowledge or review coverage.
- Seven existing day artworks visually inspected in this session; new Japanese contextual captions, no new images. No native device/layout certification.
- One section (day1 goals) has12 direct-from-Japanese AI translation drafts, bound to its content revision. Every other week1 section remains pending translation. Original Vietnamese is retained as explicitly unaligned legacy reference. Unsupported languages do not fall back to Vietnamese. A Japanese edit invalidates translations.
-59 Japanese question/answer/rationale drafts are stored outside runtime.35 retain existing Japanese questions;24 replace Vietnamese-only converted question drafts. Structural checks pass; individual option-rationale quality and assessment storage migration still need review before replacing runtime assessments. Existing687 weekly questions and12 full mocks untouched.
- Whole-curriculum inventory:176days/866sections and52880 language-bearing field records, including legacy content, explanations and image captions. Source trace ledger:246 paragraph rows. Source-concept links do not assert the book contains the invented practice events or establish an exhaustive book denominator.
- Next: finish week1 option-level editorial QA, align revised assessments with preserved attempts, translate remaining72 sections directly from Japanese into all12 languages, finish source-point reconciliation and real device/layout QA. Week1 is NOT complete. Do not begin week2 as if the week1 full-cycle gate passed.

Review flags remain false; source-book knowledge coverage percentage remains null.


## 2026-10-16 — Vietnamese clarity revision after user testing

The user reported fragmented, unnatural Vietnamese. Replaced all week1 legacy reader references with73 aligned Vietnamese translations/246paragraphs,7lesson titles and7image captions, directly bound to the unchanged Japanese master (SHA256e306f96c8f491ecf4cd1662cebaba012230da2bc497bc1c3e33353199b217c70). Vietnamese source remains a translation; Japanese master remains canonical. Paragraphs now pair Japanese then translation; old data remains preserved but no duplicate legacy text is displayed in the revised week.

Translation registry now contains84 AI translation drafts:73Vietnamese and11other-language pilot drafts. Only the original first goals section has all12languages; other72sections still lack the other11translations.59question drafts remain outside runtime. Whole-week completion, human/domain/native/release flags stay false;225Japanese representations/641missing remain unchanged.

QA:7days/73sections/246paired paragraphs, titles/captions, explicit show/hide, no legacy duplicates, rejected incomplete/stale bindings; all12selected pilot languages; full isolated-host176day/866section sweep; focused data TypeScript; JLPTlock10/10; whitespace check. Tests use fixtures, not actual native devices. See japanese-master/VIETNAMESE_WEEK_01_REVISION_2026-10-16.md and reviews/vietnamese-week1-revision-2026-10-16.json.


## 2026-10-16 — publisher-approved multilingual style baseline
The publisher explicitly approved the Vietnamese week1 address/tone and requested the same editorial and presentation approach across every Kaigo language from now on. Rules v13, approved-plan v17, KAIGO_LANGUAGE_STYLE_GUIDE.md v1 and language-style-policy.json v1 record the binding convention. AGENTS.md and the session entry guide now require these readings before future Kaigo language/display batches. Vietnamese benchmark:3bed1485; known older-resident scenes use cháu–bác, peer colleagues mình–bạn, explanations người được chăm sóc. Other languages preserve the respectful/contextual intent using their own appropriate forms and recorded locale profiles.
This unit changes documentation/policy only, not runtime content/layout or progress. Approval covers style, not whole-course completion, every translation, specialist/native/device/release review. Existing remaining authoring/translation/assessment work is unchanged.


## 2026-10-16 — week1 English translation under the shared style contract

Added the shared English locale profile before this batch. Translated the unchanged Japanese week1 reader directly into natural English:73sections/246paragraphs,7lesson titles and7art captions. Warm adult I/you, stable professional terms, no invented age/gender/family address; Haruko-san is preserved where the requested Japanese address is the learning target. Japanese SHA256e306f96c8f491ecf4cd1662cebaba012230da2bc497bc1c3e33353199b217c70 and the approved Vietnamese content hash remain unchanged. No image replacements or layout changes.

Runtime registration now merges explicit locale batches; English uses the existing Japanese-first button and paragraph pairs with revision checks. Complete reader translations:vi73 +en73; other10languages still have only one pilot section each (156translation drafts total). This count excludes question/answer translations and is not whole-week or source-book coverage.59Japanese question drafts are still outside runtime; option-level rationale review and attempt-preserving assessment migration remain outstanding. Whole-course641Japanese representations still missing. Week1 is NOT complete; do not advance to week2 as though its full-cycle gate passed.

QA: actual reader host-fixture checks for all7English days/73sections/246paragraph pairs, titles/captions, explicit opening and source-revision rejection; Vietnamese regression and12selected-language pilot checks; focused data TypeScript; Japanese preservation check; full176day/866section course flow and JLPT UI lock. Fixtures are not native-device screenshots. English has AI editorial comparison only; human/domain/native/release flags remain false. Evidence:WEEK_01_ENGLISH_PROGRESS_2026-10-16.json and reviews/english-week1-revision-2026-10-16.json. Persist this unit and verify the remote before the next batch.


## 2026-10-16 — week1 question option-rationale editorial pass

Reviewed all59Japanese question drafts against their Japanese week1 lessons/scenarios and rewrote236option rationales. Each option now has its own reason, replacing repeated generic incorrect-option explanations. Compared against remote baseline279c658e:all59IDs, prompts, options and correct indices are unchanged. The source master and approved Vietnamese/English reader data are unchanged. Review metadata is bound to the Japanese source hash and question-core hash; a future edit requires renewed editorial review.

The draft remains outside runtime. This is an AI editorial pass, not independent Japanese/domain/native approval. No release, coverage or whole-week completion claim. Validator verifies counts, distinct non-empty rationales, review bindings and original-runtime byte preservation; those checks do not prove professional correctness. Evidence:reviews/week1-question-option-rationales-2026-10-16.json. Next assessment work:version/integrate the Japanese questions with preserved old attempts, then direct-from-Japanese question translations. Reader work:complete the other10languages (72remaining sections each), source reconciliation and device/layout QA. Week1 remains incomplete.


## 2026-10-16 — Japanese-first parallel production, batch01

Latest publisher instruction supersedes the previous week-by-week translation gate:use6AI to finish the entire Japanese corpus first; translations are paused until that stage is complete. Rulesv14/planv18/shared style production order record this directive; existing verified Vietnamese/English translations are preserved.

Six independent authors completed weeks2–7:510additional reader masters/3655Japanese paragraph records,407weekly Japanese question drafts/1628option-specific rationales,42day titles/objectives/contexts/art captions. Combined week1–7:49days,583masters,3901paragraph records,466weekly questions/1864rationales. Repeated reference glossary definitions are records, not unique concepts or additional source coverage. Scope and source limits are recorded in each week's editorial review and paragraph ledger; professional/native/human/release flags stayfalse. All42allocated contextual images were inspected by the owning authors.3technical raster diagrams retain fixed Vietnamese labels and are explicitly pending Japanese image labels; captions now have Japanese text. No new image assets.

Integrated the Japanese reader and weekly assessments as an internal learning preview. Original7runtimeJSONfiles, weekly-question generator, IDs/order/completion state and full mocks remain intact. New weekly attempts use a content-dependent revision; old attempt keys are retained unchanged. Japanese questions/options are answerable before opening translations; Japanese option explanations show only after submission. Missing/unbound translations on master content show a preparation notice rather than legacy Vietnamese fallback. Shared Royal/day-night layout is retained.

QA passed49Japanese days/583sections/3901paragraphs/466questions with resume/submission/old-attempt preservation; all176days/866sections host-fixture sweep and original-data preservation; focused data TypeScript; paragraph-ledger pointer audit.649sections have complete Japanese field representations versus217remaining; this includes66legacy sections outside these masters and is NOT source-book knowledge coverage. Native-device layout and independent language/domain approval remain pending.

See japanese-master/JAPANESE_AUTHORING_PROGRESS.json and reviews/JAPANESE_PARALLEL_BATCH_01_{RUNTIME,COURSE_FLOW}.json. Persist and remotely verify this batch before reusing the6authors for weeks8–13. Later cover weeks14–26 and360full-mock Japanese explanations. Do not resume translation or mark all Kaigo/whole Japanese corpus complete from these counts.


## 2026-10-16 — Japanese-first parallel batch02:weeks8–13 and full-mock Japanese explanations

Resumed from remotely verified caba12ce, WORK PERSISTENCE PASS/clean tree. The same6AI independently authored weeks8–13; writers with smaller weeks also completed all6existing mock pairs. No new translations or images. Added130reader masters/514paragraph records,100weekly questions/400option rationales and42day metadata/captions. Combined weeks1–13:91days,713masters,4415paragraph records,566weekly questions/2264rationales. Each new master has a per-paragraph source ledger and a revision-bound assessment draft. Scheduled mock days54/55 use distinct day metadata and remain two30min practice sessions, not a continuous60min exam.

Added1440Japanese option rationales for all360questions in12existing mocks, with Japanese titles and source-core bindings. Ten forms retain exact prompts/options/answers/furigana/version/attempt keys. Two defects were corrected explicitly in a separate overlay:skills05q25 action-selection command and白杖 reading; Japanese04q03 duplicate-meaning distractor plus its rationale/furigana. All correct indices remain unchanged. The2affected forms use new content-dependent revision keys; old source data and old attempt records are retained unchanged. No answers are silently attached to changed alternatives. Root resolution is linked in the two original editorial reviews.

All42allocated lesson images and30mock diagrams were viewed by the owning authors. Existing Japanese descriptions/captions are retained or aligned; no assets regenerated. New image-language finding:13mock diagrams have fixed English labels. These and the previously known3technical diagrams with fixed Vietnamese remain pending Japanese image labels; the reader displays an explicit Japanese notice. Do not call image Japanese localization complete.

QA passed actual host-fixture flows for91Japanese days/713sections/566weekly questions, original176day/866section rendering, source-data preservation, source-ledger pointers, focused data TypeScript, and12mock reviews/360questions with 12selected translation languages, no pre-submit explanations, resume/submission, unchanged10keys and separated2revised keys. Old attempt records and timing are preserved as recorded; revised forms start a separate version. No native-device, human/domain/native/rights/release certification.765sections now have complete Japanese field representations vs101missing;52legacy complete-field sections outside the713masters still need canonical review. Counts are not exhaustive source-book coverage; the source denominator staysnull.

Evidence:reviews/JAPANESE_PARALLEL_BATCH_02_{RUNTIME,COURSE_FLOW,MOCK_RUNTIME}.json, per-week/per-pair editorial reviews and mock-core-corrections-editorial-review.json. Current source limits include inaccessible2025restraint PDF (accessible2024MHLWprinciples verified instead), some official-page excerpts with direct access blocked, professional review and learner-load measurement. Detailed claim-specific qualifications are preserved.

Next:remote verification of this batch, then6authors for weeks14–19. Japanese-first priority remains binding; weeks14–26, source reconciliation and image labels remain. Translations staypaused until the entire Japanese scope has actually been completed/checked. Do not mark the whole corpus complete from file counts.


## 2026-10-16 — Japanese-first parallel batch03:weeks14–19

Resumed from remote-verified1dae84ec308e8e1a10857e137e5e62f02bbcf983, WORK PERSISTENCE PASS and clean tree. The same6AI independently authored weeks14–19. Each week has7new fullJapanese reader sections,0unchanged/0revised oldJapanese sections and0missing sections within its assigned scope; the oldJapanese paragraph arrays were empty. Paragraph counts by week14–19 are49/55/47/60/49/69,total329. Every week has7Japanese questions and28option-specific rationales,7day titles/objectives/contexts/art captions and a paragraph-level source ledger. No translations or images created. ExistingVI/EN/other-locale data preserved; translation production stayspaused until the entireJapanese scope has been completed and checked.

Combined weeks1–19:133days,755canonical reader masters,4744Japanese paragraph records,608weekly questions and2432option rationales. All42new sectionIDs/questionIDs and originalcorrect indices match inventory. Root read the329Japanese paragraphs and reviewed the question set; week16irrelevant distractors and the finalweek17care-process distractors were revised to the same learning goal, with specific option reasons. These are editorial checks, not professional or native-language approval. All360full-mock Japanese explanations from batch02 remain unchanged.

Sources and corrections are documented per week. Examples: dementia awareness does not exclude dementia; Lewy body explanation is not merely occipital atrophy; urine/diaper numeric examples are not diagnostic or universal product thresholds; transfer/feeding/cleanliness illustrations retain their conditions; PPE is task-based; device-outage preparation does not authorize oxygen-setting changes. Writers inspected all42allocated images; captions identify contextual scenes rather than claiming technical demonstrations. No new image-language completion claim:3technical Vietnamese-label diagrams and13English-label mock figures remain pending. Sourceprinted31small hand-region boundaries/printed40two unnamed kit items and some inaccessible supplemental PDFs remain explicitly qualified in ledgers/reviews.

QA PASS:19weekJapanese host-fixture flows,133days/755sections/608weekly questions with submission/resume/old-attempt retention; whole176day/866section course-flow rendering and preserved originalparagraphs; source/translation-binding preservation;4744paragraph ledger pointers; focused dataTypeScript; JLPT10/10UIlock. The active text-leak checks previously used À–ỹ, which also incorrectly includes Greek: narrowed to accented-Latin/Vietnamese ranges with positiveVietnamese and negativeJapanese/Greek controls, preserving validαシヌクレイン. Test fixtures are not native-device screenshots.

807sections now have completeJapanese field representations,59still missing;52legacy complete-field sections outside the755masters still require canonicalreview. Remaining reader-master scope is111sections in weeks20–26; next6AI batch20–25,thenweek26 and global source reconciliation. Counts are not unique concepts or bookcoverage; whole-source denominator/percentage remainsnull. Allhuman/domain/native/device/rights/release approvals remainpending. Evidence:reviews/JAPANESE_PARALLEL_BATCH_03_{EDITORIAL,RUNTIME,COURSE_FLOW}.json and per-week ledgers/reviews. Persist and remotely verify this batch before starting another; no whole-course completion claim.
