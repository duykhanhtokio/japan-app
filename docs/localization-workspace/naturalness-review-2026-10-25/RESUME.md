# Natural-language revision — 2026-10-25

Status: IN_PROGRESS. This checkpoint does not certify the corpus.

Active resume authority: `prefecture-queue.json`. Work by prefecture, then city,
then complete scenario sets across all 12 target locales. Ishikawa PRF-017 has
101 scenarios across 11 cities; Kaga, Komatsu, Nanao and Wajima now have all
32 sentence/task sets context-reviewed. Metadata, Japanese author issues and
visual/native review are distinct and unfinished. Next: SC-LOC-017-01-001,
batch 034 (Kanazawa).

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

Historical resume after pass02: SC-LOC-ISK-KOMATSU-05-001 (batch150), all12locales, then the remaining
unreviewed batch150scenarios and the canonical batch order, excluding the two
reviewed sentence/task sets. Keep source/metadata issues separate from target
review status. Only2of7,128scenario sentence/task sets have this pass's complete
12locale contextual review; neither is a native-certified/release-approved item.

## Prefecture pass03 — complete Kaga–Komatsu sentence/task cluster

Publisher requested a larger amount per turn and grouping by prefecture.
Membership is now derived from the actual city.prefectureId mapping and effective
scenario overrides, rather than matching scenario-name prefixes. The queue
contains all 7,128 scenarios exactly once across all 47 prefectures.

This pass adds 14 scenarios, 168 scenario/locale sets, and 2,688 reviewed fields
(seven times pass02's review volume). It repairs 653 fields in all 12 target
locales, leaving unrelated scenarios, Japanese source, metadata and approved UI
untouched. `prefecture-pass-03.json` records every edited before/after value,
every reviewed Japanese/target hash and the exact source issues left open.

The three touched batches are 149, 150 and 151. Source/ID/speaker/task checks
pass for all 12 locales. The real application loader verifies all 3,072 reviewed
fields across the combined 16 Kaga/Komatsu scenarios, including the two preserved
pass02 scenarios. Full technical coverage still resolves 7,128 scenarios;
structural coverage is not an additional semantic-review count.

The existing translation-coverage manifest's 36 affected file hashes are also
synchronized with the reviewed data; coverage counts and native/semantic-review
flags are preserved. The separate manifest-sync receipt records old/new hashes.

Notable corrections retain reference-item checks on measuring equipment,
distinguish each postcard's writing date from its mailing date, avoid portraying
flower containers as being carried on their side, distinguish baggage storage
from parcel collection, preserve current ID documents as documents, and correct
the Hindi photograph line that said other customers would not come rather than
that they would be kept out of the photo. Instructions now identify the intended
speech/action where the earlier wording was abstract or confusing.

Ishikawa sentence/task context review: Kaga 8/8, Komatsu 8/8, total 16/101;
85 scenarios remain in the prefecture. Next city: Nanao, then Wajima, then
Kanazawa and the other Ishikawa cities. The wider app learning/UI translation
scope and scenario metadata audit remain open. Native review and actual
device/browser visual validation have not been performed.

Work for this pass is isolated in `japan-app-prefecture-review` so concurrent
ambient-lighting/UI changes in the earlier checkout remain untouched. Commit
only the 36 locale data files and this review's documents; do not piggyback
unpublished changes from another checkout.

## Prefecture pass04 — Nanao and Wajima sentence/task cluster

Read all 16 complete Japanese premises, exchanges and task hints and all 12
target languages. Reviewed 3,072 additional fields and corrected 484: vi253,
en14, id21, tl22, zh-CN19, zh-TW23, hi32, bn20, ne17, my16, th22, km25.
Exact edits and all reviewed source/target hashes are in prefecture-pass-04.json.
Corrections distinguish an eight-month-old baby from a newborn, clarify who
asks to view ferry registration, distinguish a festival welcome desk from
administrative intake, preserve unfinished quantities inside a production box,
and clarify whose contact number replaces a previous lost-property inquiry.
Retail, food ordering, care-home clothing and bank-letter dialogue now give
clearer objects, actors and speech tasks without adding real-world policies.

Two Japanese ambiguities remain recorded: 叔母 does not specify the maternal/
paternal branch, and one wagashi task says box count while the response asks
box capacity. The existing Vietnamese aunt term remains unresolved pending
author clarification. No Japanese source or approved UI was changed.

Exact patch replay, source/ID/speaker/hint bindings, reviewed loader hashes,
full technical loader coverage and approved UI locks are checked separately.
The 24 changed translation-file hashes are synchronized with the existing
coverage manifest; no native or semantic-certification flags are promoted.

Ishikawa sentence/task context review is now 32/101; 69 remain. Kaga, Komatsu,
Nanao and Wajima each have 8/8 sets reviewed. Next: Kanazawa 21 scenarios,
starting SC-LOC-017-01-001, then the other six Ishikawa cities (48 scenarios).
Corpus sentence/task progress is 32/7,128. Metadata, other learning/UI content,
source issues, native review and device/browser visual validation remain open.
This checkpoint is not a statement that the prefecture or corpus is finished.
