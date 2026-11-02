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

## Six-lane reconciliation of current evidence

Baseline inspected: recovery/jlpt-n3-n1 at dfd0223d45a934eb33a29197f66f3b2e248b7b26. The historical queues above remain the requested scope, not an assertion that every historical deficit is still open. None of the following counts constitutes whole-sector acceptance.

| Sector | Current evidence | Remaining acceptance gap |
|---|---|---|
| Agriculture | Final source-resolution records account for all 55 historical items. Actual bank contains 20 forms/800 questions, including the 16 added forms/640 questions; structural and current lesson/hash links checked. | Full semantic review, native/domain review and measured learner duration. Soil moisture 35–55% remains excluded as a numeric target because its denominator is unresolved. |
| Manufacturing | Three original PDFs recovered and hash-checked, totaling 574 pages. Fifteen recognition groups delivered. | Inventory is not atomic closure: current summary records zero whole-page knowledge closures. Source p94 was addressed by the dimension overlay in commit57ac691; p97 remains subject to source/standard verification. Real equipment identification remains unaccepted. |
| Food manufacturing | Newer source-closure records already report the 76-page visual review. Current scoped checks passed 96 lessons/848 questions/12 locales, 848 current question receipts, 292 source decisions, and translation adapter acceptance/rejection checks. | Exhaustive decomposition and full source coverage remain explicitly false; current validators and independent semantic/device/duration checks are required. Do not reopen the old visual queue solely from its historical count. |
| Restaurant | Source-closure31 accounts for 639 units/1,476 facts, including 198 added questions. | Two blocked facts and one image gap remain; 397 facts lack a dedicated question. Native/audio/device/duration acceptance remains pending. Checkpoint30 status must be reconciled without discarding its history. |
| Hospitality | Feature-branch records inventory all 117 pages, with 38 days; commit57ac691 adds source accounting for the 380th idea while retaining 321 questions. | Full paragraph/table/figure closure is false. Feature-branch translation status has 22/456 current pairs, 217 stale and 217 missing; compare integrated files before authoring. |
| Construction | Current intake contains 17 files; corresponding 1号 theory/practical reuse for 2号 is publisher-authorized. Six bank files/1,148 question objects passed scoped structural checks. Daily remediation records images for 440 days. | Complete source-atom coverage, including atomic verification of the leader source. The newer foreman checkpoint records main-text reading through PDF page131; the older 7–16 intake marker is superseded. Authorized reuse does not certify exhaustive coverage. Native/domain/device/duration acceptance is pending. |
| Care | Direct inspection of week06–26 question files found 367 structurally valid questions with four choices, four rationales and valid answer indices. | Final scope resolution supersedes the six historical pending records: two source errors, two exclusions and two replacements; pendingBlockingSourceDetails is zero. This editorial closure does not prove exhaustive coverage; native/domain/device/duration checks remain pending. |

Source evidence is in each sector's existing source-resolution/source-closure and daily-remediation ledgers. Mechanical checks establish structural properties only. Feature-branch observations must not silently replace newer integrated evidence. No simulator or real-device acceptance was performed by this reconciliation.

## Continuation after commit57ac691

Unfinished work retained: exhaustive source-atom closure (all sectors), semantic acceptance beyond sampled questions, hotel translation backlog, contextual readings/audio review, physical-device checks, image relevance and measured learner duration. Historical resolved items must not be reopened merely because the original work allocation still names them.

Implementation in this continuation is bounded and source-linked: agriculture question wording/distractor remediation; manufacturing tolerance interpretation; restaurant tool-recognition assessments; hotel service03 application dialogue/questions; construction supervisor coaching; and food reader/assessment acceptance including repair of an obsolete baseline guard. Agriculture reviewed160 question texts and repaired2, leaving640 outside that review; four actual images were inspected. Restaurant added2 direct tool-recognition questions with12 translations, reducing397 dedicated-question gaps to395. Hotel added422 Japanese characters, a six-turn dialogue and2 application questions (323 total); the translation backlog remains. Construction added an ungraded coaching activity and12 locale versions in foreman session004, preserving existing paragraphs and learner IDs. Manufacturing added a source-bound tolerance note,4 new questions with16 distinct rationales and48 translated question pairs, preserving independent exam revisions and progress. Food acceptance now includes actual reader/SSR/state checks; its obsolete baseline guard uses18 exact snapshots and rejects byte drift. Per-sector evidence records specify actual completed checks and exclusions. No change here certifies whole-sector coverage or real learner duration.
