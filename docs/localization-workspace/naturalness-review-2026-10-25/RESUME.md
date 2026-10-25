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

1. Context pass02 has now reviewed all sentence/task fields of Komatsu03 and
   Komatsu04 in all12locales (see the new section below). Their metadata and
   unresolved Japanese source issues remain pending.
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

## Context pass02 — 2026-10-25

Base: 8b24294265354983600c5796401275adee6ab374.

- Read the complete Japanese craft-item and tea-tasting exchanges and premises.
  Reviewed 384 sentence/task fields across both scenarios and all12locales;
  corrected334fields (including natural speech instructions, omitted objects,
  fragments, comparison order and unjustified gendered first-person forms).
- context-pass-02.json binds every reviewed source and final target to SHA256,
  records exact before/after edits and the three pending Japanese source issues.
  Japanese, IDs, speaker/turn structure, and native-review flags are unchanged.
- Actual loader validation compares all384reviewed source/target hashes with
  the actual loaded translations/hints. Exhaustive loader coverage remains
  7,128scenarios with940,896sentences and427,680hints; these totals are technical
  coverage, not a count of semantically reviewed fields. Batch150 source/ID/
  speaker/task checks pass. All10approvedUIlocks pass.
- 374unique target locations have changed across both passes; the334changes
  this pass include one further refinement of a previously edited location.
- The metadata-gap record documents that the mission builder constructs
  Japanese text without a locale. Sentence/task batch coverage does not cover
  these metadata strings. Their translations and display integration are pending.
- No Chromium, React Native Web or script-font dependency set is available in
  this checkout's test environment; no device/browser visual check is claimed.

Next: SC-LOC-ISK-KOMATSU-05-001 (batch150), all12locales, then the remaining
unreviewed batch150scenarios and the canonical batch order, excluding the two
reviewed sentence/task sets. Keep source/metadata issues separate from target
review status. Only2of7,128scenario sentence/task sets have this pass's complete
12locale contextual review; neither is a native-certified/release-approved item.
