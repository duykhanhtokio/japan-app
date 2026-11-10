# Hospitality app test integration — 2026-11-01

Integrated authored content from feature/hospitality-20261031 at 079b46dd into recovery/jlpt-n3-n1. Entry: 特定技能 → 宿泊 → 1号 / 2号. Hospitality is accessible in development and release builds for user testing.

Includes 38 study days, 321 unique questions, 38 original figures, offline furigana, and two 25-question synthesis practices drawn from the question bank. Stable learner/revision-aware progress keys are preserved.

Validation: content, source-atom bindings, reading alignment, semantic review record integrity, progress isolation, revision-bound translation loaders, and approved JLPT UI lock passed. Route/reader browser harness passed 38 readers, 20 responsive cases, 22 current translation pairs, eight ruby cases, save/restore, failed-save protection and submission answer secrecy. Browser harness adapts platform chrome/profile/storage; it is not a full Expo/native-device test. Physical device testing remains pending.

This is a test integration, not source-completeness or native Japanese certification. Source checks still report allSourceKnowledgeCovered=false; expert/native review flags remain false. Twelve locales are configured; only 22/456 lesson-locale pairs are current. Stale/missing translations remain unavailable rather than mismatching revised Japanese.
