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
