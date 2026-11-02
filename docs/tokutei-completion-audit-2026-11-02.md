# Tokutei Gino completion audit — 2026-11-02

Status: OPEN. This is a work ledger, not evidence of completion. Never mark coverage complete based on page counts alone.

## Parallel work allocation (six independent lanes)
1. Agriculture: reconcile 55 flagged source units; validate units and numeric agronomy claims against authoritative references; audit 16 x 40 = 640 questions; plant/equipment images; daily lesson lengths.
2. Manufacturing: source inventory 574/574 pages including 33 previously pending; 15 visual-recognition groups; formulas, tables, units, terminology, practical questions.
3. Food manufacturing: visually inspect 76 unverified pages; reconcile 18 added lessons, 18 links and 848 questions; risk tables, process diagrams, sanitation; freeze Japanese before translation.
4. Restaurant: audit 639 hierarchical units and specifically 439 previously flagged units; translations, furigana, audio, daily duration.
5. Hospitality: audit 52 + 65 = 117 pages; deepen Japanese lessons and scenarios; questions/explanations, illustrations, furigana and 12 languages.
6. Construction and care: construction 1/2-gou source coverage, practical and safety; care weeks 6–26, weekly tests, communication/safety visuals.

## Evidence ledger schema
sector | source_document | page | unit_id | source_topic | japanese_lesson_path | question_ids | illustration_path | translations_12_status | furigana_status | audio_status | semantic_review | device_test | evidence_link | status

Allowed status: NOT_STARTED, IN_PROGRESS, BLOCKED, VERIFIED.
VERIFIED requires traceable source evidence, authored Japanese teaching content, tested question(s) where relevant, media review and no outstanding semantic issues.
Never treat missing evidence as zero or VERIFIED. Do not silently overwrite original source facts; record source conflicts and authoritative verification.

## Completion gates
- All source pages inventoried and each substantive text/table/formula/figure mapped to atomic knowledge units.
- All knowledge units either VERIFIED or explicitly excluded with a written rationale.
- Question counts and answer keys validated; no duplicated or unsupported numeric claims.
- Japanese editorial approval precedes translations; all 12 languages checked.
- Furigana/audio/media verified; each lesson meets agreed duration and illustration standard.
- Expo bundle, iOS and Android smoke tests passed on the integration branch.
