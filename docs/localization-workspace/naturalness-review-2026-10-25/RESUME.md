# Natural-language revision — 2026-10-25

Status: IN_PROGRESS. This checkpoint does not certify the corpus.

Publisher scope: all 7,128 Japanese scenarios and all 12 target locales,
including dialogue, task hints, scenario metadata, other learning content and
localized UI. Construction assessment translation additions remain excluded.
Japanese, stable IDs, approved UI and native-review flags must be preserved.

Baseline: 4feb7db94b5d1e304b65a78d7831e57520e57ab7 on recovery/jlpt-n3-n1.

## Verified technical coverage

All 714 indexed batches pass exact-source, speaker, stable-ID and task binding
checks. Each target locale has 78,408 sentences and 35,640 task hints across
7,128 scenarios: 1,368,576 target fields in total. inventory.json records the
aggregate source and final target path/hash inventory digests. These are technical checks only.

The actual application loader passes exhaustive corpus coverage. A separate
integration assertion verifies that all 41 edited fields resolve to the exact
new text through that loader. No visual/device validation has been performed.
The 10 approved JLPT UI locks pass unchanged.

## Applied targeted repair

SC-LOC-ISK-KOMATSU-03-001, batch150: read the full canonical Japanese exchange
and premise about making a pair of craft items. One is for the learner, one a
gift for the learner's older sister. Clarified the first NPC question and first
task hint in all12locales; revised all16Vietnamese sentence/task fields and
three additional Khmer sentences with omitted/ambiguous objects.

komatsu-03-repairs.json contains exact before/after text, Japanese bindings,
per-locale change counts and two unresolved Japanese authoring issues.
This is targeted repair, not full scenario/locale semantic certification.
Preserve translated_ai_unreviewed/nativeReviewed:false.

## Resume scope

1. Finish contextual sentence/task review of this scenario in all12locales;
   review its title, situation, task and other displayed metadata.
2. Continue an explicit per-scenario/per-locale contextual review queue across
   all7,128scenarios. Record reviewed source/target hashes and unresolved issues;
   do not promote earlier structural screening into semantic approval.
3. Inventory/review learning-content and UI source-to-target translations too.
4. Inspect selected-language output on representative device/browser screens,
   including wrapping, panel clipping and fallback behavior. Loader checks do
   not establish those visual properties.
5. Reconcile any earlier review/progress hashes for edited files through the
   repository's normal revision process; historical receipts are immutable.

The full contextual audit, metadata audit, learning/UI audit and visual checks
remain unfinished. No background review or automatic refresh is scheduled.
