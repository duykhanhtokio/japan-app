# Full local dialogue translation continuation — 2026-10-18

Publisher instruction: finish all dialogue translations with six independent AI workers; no overlapping file ownership and no semantic cross-review. A validated/persisted batch is a checkpoint, not a stopping point.

## Scope and source

- Canonical active corpus:7,128 scenarios,11 turns each,6 NPC sentences and5 player answers. Translate all Japanese NPC/player text and the five Japanese player task hints into all12 supporting languages.
- Durable baseline before this run:15d4e5f6. Baseline sentence coverage is11 scenarios, while full source-bound sentence+task coverage is10. The original first scenario needs the remaining task-hint bindings.
- `DIALOGUE_TRANSLATION_QUEUE.json` records all712 remaining ten-scenario batches (002–713; the final batch has7). Sources are extracted on demand from the canonical Japanese data, using the stored start/count; preserve Japanese and stable turn/scenario IDs.
- Special batch000 preserves the first scenario's already translated sentences byte-for-byte and supplies all five exact-source task hints per locale. Existing batch001 is preserved.

## Independent ownership through batch029

| Worker | Exclusive languages |
|---|---|
| dialogue_en_vi | en,vi |
| dialogue_id_tl | id,tl |
| dialogue_zh | zh-CN,zh-TW |
| dialogue_hi_bn | hi,bn |
| dialogue_ne_my | ne,my |
| dialogue_th_km | th,km |

From batch030 onward, each worker owns all12 locale files for disjoint scenario batches. The owner slot is `(integer(batch)-30)%6`: en_vi=0, id_tl=1, zh=2, hi_bn=3, ne_my=4, th_km=5. Each group advances by six batches through its final assigned batch (708–713). Finish the original language-pair assignments through029 before starting the new assigned queue. `DIALOGUE_TRANSLATION_OWNERSHIP.json` is the machine-readable authority. This balances differing translation lengths while preserving exclusive files and no semantic cross-review.

Readiness requires full natural target utterances retaining every Japanese clause, condition and detail. Structural nonempty/source checks alone do not establish this. Workers author and self-compare one or two scenarios at a time in scratch, then publish the completed locale file; never shorten content to fit a batch or context. All future markers include `fullUtteranceFidelityChecked:true`. `DIALOGUE_TRANSLATION_AUTHOR_HOLDS.json` records author-withdrawn files and own corrections; held batches are excluded from completion counts until their authors re-confirm full fidelity with matching final hashes. Source-bound technical coverage remains reported separately. AI-unreviewed means no native/domain certification, never permission for summaries or fragments.

Workers read canonical Japanese and their own translations only. Coordinator integration/coverage/source-binding checks are technical, not semantic cross-review. All new material remains AI-unreviewed; no native/domain approval is implied.

## Integration and durability

1. Each worker completes editorial and source QA in its own scratch files, publishes one complete `locale-batches/LOCALE/NNN.json` atomically, then writes an explicit final SHA256 ready marker at `dialogue-ready/LOCALE/NNN.json` in the coordinator scratch directory. Marker fields are owner, language, batch, relative repository path and sha256. A complete JSON file appearing on disk is not a readiness signal. The file and marker are immutable after this handshake. Never commit placeholders or partial JSON.
2. Coordinator selects only files with hash-matching final owner-ready markers, then checks exact scenario/turn IDs, Japanese sentence, speaker, task source and all nonempty values. Existing committed clean files are trusted; modified tracked files are preserved and reported for explicit recovery. New batch000 additionally verifies existing sentence translations were preserved.
3. Persist completed locale files in narrow commits, with GitHub branch leases and exact tree/blob verification. Keep other workers' unrelated unfinished files untouched.
4. `node scripts/check-work-persistence.mjs --paths FILE ...` verifies completed files exist in HEAD, are clean, and HEAD exactly matches the fetched and advertised remote. It explicitly reports unrelated unfinished work as preserved. The no-argument gate still requires the entire working tree clean. This scoped gate supports the publisher's parallel-worker instruction; it does not count unfinished files as saved.
5. All six workers continue their exclusive language queues without waiting at arbitrary batch boundaries. Each completed locale file is immutable; the coordinator persists completed files while workers translate later batches. A worker never stages or commits. Unpersisted files remain explicitly unfinished until the scoped remote gate passes. Only add a batch to `locale-batch-index.json` after all12 locale files pass `check-dialogue-translation-batches.cjs --batches NNN --integrate`.
6. `DIALOGUE_TRANSLATION_PROGRESS.json` is derived from validated integrated batches. Sentence-only coverage is separate from full sentence+task coverage. `check-dialogue-localization.cjs` checks all indexed batches through the real loader.
7. Continue until every canonical scenario has every sentence and task in every supported locale, then perform the full corpus audit and the global clean-tree persistence gate. Do not mark the corpus complete based on an English/Vietnamese fallback, placeholder, partial batch or count alone.

## 2026-10-19 explicit handover

For batch094 only, dialogue_zh exclusively authors the previously absent my/th/km locale files after completing batch098. dialogue_ne_my retains hi/bn/ne and its already published id/tl/Chinese files. The exact three transferred paths are recorded in DIALOGUE_TRANSLATION_OWNERSHIP.json. No file ownership overlaps, and no semantic cross-review is introduced. Construction assessment translations are outside the publisher's required translation scope and excluded from backlog reporting.


## 2026-10-19 checked continuation and pending remote approval

- Rechecked all1,104 previously integrated locale files against the stored final SHA256 hashes: no mismatch. Baseline remote-verified HEAD was525c0de1625f4002a1423a04835eae6c2266990b, with911 complete scenarios.
- Seven existing author-ready locale files were preserved in local commit99da3a70 after exact-source/ID/speaker/task and owner-marker hash checks. GitHub push was rejected by automatic approval review. This commit and subsequent local work must not be reported as remote-saved until explicit approval, push, fetch and scoped persistence verification succeed.
- Six independent assignments filled missing km089, my091, my094, my096, km096. All five published complete files have immutable matching owner-ready markers and full own-language fidelity checks. Batches089/091/096 are integrated after all12-locale checks; the actual app loader validates941 scenarios,124,212 translated turn bindings and56,460 task-hint bindings. Complete scenarios941/7,128; remaining6,187. Native/domain review remains unconfirmed; no semantic cross-review was performed.
- km094 did not publish: its author encountered model capacity errors. Preserve the unfinished author script at /workspace/scratch/3014ed9128c9/km094-author/author.py (six scenarios drafted according to the author). It has no final owner-ready marker, is not runtime-integrated and is not included in completion counts. Do not replace or certify this unfinished translation. Source and completed eleven locale files remain intact.
- Next: obtain approval for the concrete pending dialogue commits to duykhanhtokio/japan-app, recovery/jlpt-n3-n1; push/fetch and pass the scoped work-persistence gate. Then resume the same km094 author, finish own fidelity QA and all12-locale integration; continue093 (ne/my/th/km), then unstarted095/097 and subsequent exclusive queues. Construction assessment translations remain excluded.
