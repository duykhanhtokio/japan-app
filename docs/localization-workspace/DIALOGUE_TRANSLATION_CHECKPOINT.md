# Full local dialogue translation continuation — 2026-10-18

Publisher instruction: finish all dialogue translations with six independent AI workers; no overlapping file ownership and no semantic cross-review. A validated/persisted batch is a checkpoint, not a stopping point.

## Scope and source

- Canonical active corpus:7,128 scenarios,11 turns each,6 NPC sentences and5 player answers. Translate all Japanese NPC/player text and the five Japanese player task hints into all12 supporting languages.
- Durable baseline before this run:15d4e5f6. Baseline sentence coverage is11 scenarios, while full source-bound sentence+task coverage is10. The original first scenario needs the remaining task-hint bindings.
- `DIALOGUE_TRANSLATION_QUEUE.json` records all712 remaining ten-scenario batches (002–713; the final batch has7). Sources are extracted on demand from the canonical Japanese data, using the stored start/count; preserve Japanese and stable turn/scenario IDs.
- Special batch000 preserves the first scenario's already translated sentences byte-for-byte and supplies all five exact-source task hints per locale. Existing batch001 is preserved.

## Independent ownership

| Worker | Exclusive languages |
|---|---|
| dialogue_en_vi | en,vi |
| dialogue_id_tl | id,tl |
| dialogue_zh | zh-CN,zh-TW |
| dialogue_hi_bn | hi,bn |
| dialogue_ne_my | ne,my |
| dialogue_th_km | th,km |

Workers read canonical Japanese and their own translations only. Coordinator integration/coverage/source-binding checks are technical, not semantic cross-review. All new material remains AI-unreviewed; no native/domain approval is implied.

## Integration and durability

1. Each worker writes one complete `locale-batches/LOCALE/NNN.json` and self-checks it. Never commit placeholders or partial JSON.
2. Coordinator checks exact scenario/turn IDs, Japanese sentence, speaker, task source and all nonempty values. New batch000 additionally verifies existing sentence translations were preserved.
3. Persist completed locale files in narrow commits, with GitHub branch leases and exact tree/blob verification. Keep other workers' unrelated unfinished files untouched.
4. `node scripts/check-work-persistence.mjs --paths FILE ...` verifies completed files exist in HEAD, are clean, and HEAD exactly matches the fetched and advertised remote. It explicitly reports unrelated unfinished work as preserved. The no-argument gate still requires the entire working tree clean. This scoped gate supports the publisher's parallel-worker instruction; it does not count unfinished files as saved.
5. Allow that worker to continue immediately after its files pass the scoped remote gate. Only add a batch to `locale-batch-index.json` after all12 locale files pass `check-dialogue-translation-batches.cjs --batches NNN --integrate`.
6. `DIALOGUE_TRANSLATION_PROGRESS.json` is derived from validated integrated batches. Sentence-only coverage is separate from full sentence+task coverage. `check-dialogue-localization.cjs` checks all indexed batches through the real loader.
7. Continue until every canonical scenario has every sentence and task in every supported locale, then perform the full corpus audit and the global clean-tree persistence gate. Do not mark the corpus complete based on an English/Vietnamese fallback, placeholder, partial batch or count alone.
