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
