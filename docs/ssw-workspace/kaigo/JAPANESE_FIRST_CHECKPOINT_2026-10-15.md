# 介護 — Japanese source and explicit translations

Publisher instruction, 2026-10-15: align the Kaigo learning UI with construction. The original lesson must be Japanese; display other languages only after an explicit translation action. Japanese knowledge, terminology and grammar must be accurate. This supersedes the former always-visible Vietnamese teaching presentation, but does not certify existing Japanese fields.

## Implemented UI scope

- Common Back anchor: safe-area inset plus shared Royal `screenGutter=12`, `backSafeTop=8`; 44px Back hitbox unchanged.
- Separate week selector, day list and reader; full-width Royal day cards. Construction and Kaigo use the same header/day-card components.
- A successful completion write returns to the week. A failed write leaves the reader open. Completion keys/IDs and existing progress remain unchanged.
- Warm reading appearance: automatic day 07:00–18:59 / night 19:00–06:59 in device local time; explicit Auto/Day/Night preference is stored. Re-evaluate at foreground and each minute. Day source ivory, translated panel warm beige; night source charcoal brown, translated panel dark warm brown. Existing raster assets are retained.
- Construction and Kaigo exam controls sit outside question scroll views. Remove bottom question grids; review one question at a time. Preserve saved answers, position, grading, timer and submit/restart confirmations.
- Japanese reader renders genuine existing Japanese text, vocabulary and dialogue. Vietnamese is behind `翻訳を見る`; unsupported translation languages display an explicit unavailable message rather than Vietnamese fallback.

## Content is NOT complete

Actual inventory: 176 study days, 866 reading sections. 166 have complete Japanese fields for their current section representation; 700 have missing full Japanese teaching content/context. This is a field-presence screen, not a linguistic or professional certification. A generic line such as `知識を確かめて、理由を説明しましょう。` is excluded as a substitute for lesson text. Some source fields contain only Japanese summaries while detailed knowledge exists only in Vietnamese.

No source JSON was rewritten. Every existing teaching paragraph, section ID, lesson and saved-progress key is preserved. The UI marks missing Japanese explicitly and makes the existing Vietnamese available only through translation. Do NOT report the 700 missing sections as translated, complete, native-reviewed or release-ready.

Detailed per-day IDs: `reviews/japanese-source-audit-2026-10-15.json`.

Next content work: produce and verify complete Japanese text for the listed missing section IDs using the original knowledge/source contract, then bind each language's translations to that Japanese master. Read the full Kaigo authoring rules and relevant source pages before substantive authoring. Do not replace missing content with summaries, noun substitutions or runtime translation. Preserve every existing paragraph during reconciliation and rerun the audit. Native/professional review remains outstanding for all 866 sections; no source-book coverage percentage is established by this audit.

## Validation boundaries

`node scripts/check-tokutei-course-flow.cjs` uses isolated native host/image fixtures, the real hooks/storage logic and all actual Kaigo curriculum data; construction uses a bounded content fixture. Covers save-success return, save-failure retention in both sectors, explicit translation, native Text ancestry, fixed exam controls, restart and submitted answer lock. Requires `react`, `react-test-renderer` and `esbuild`; `TOKUTEI_QA_MODULES` can point to an isolated dependency folder.

Scoped TypeScript check uses real React Native declarations and lightweight declarations for unrelated shared UI/context dependencies. This is not a whole-app typecheck. Browser layout harness uses actual component styles/events with fixture raster art and construction questions. Neither test substitutes for iPhone/iPad/Android native screenshots or native-speaker/professional approval.

All human/native/domain/device/release approval flags remain false. This checkpoint records an incomplete Japanese content migration, not completion of publisher item 7.
