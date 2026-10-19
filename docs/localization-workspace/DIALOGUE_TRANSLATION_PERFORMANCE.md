# Dialogue translation throughput workflow

Publisher requested higher throughput on2026-10-19. Preserve full Japanese meaning, natural target language and independent own-language fidelity QA. AI-only structural checks never certify native/domain approval.

## Author loop

Six exclusive language-pair queues process100–105 continuously (60 scenarios across12 locales). A ten-scenario pack is an atomic save unit, not a session stopping boundary. An author publishes one completed language immediately, then continues; it never waits for the other eleven locales or coordinator reports. File ownership remains disjoint. Future workload handovers require explicit acknowledgement before authoring; never overlap an in-progress file or semantically cross-review another author's translations.

Read each Japanese source once with `node scripts/dialogue-translation-worker.cjs extract BATCH`. N/P/H preserve NPC, player and task context; scenario grouping/order is retained. Author only160 complete translated strings per locale in a scratch JSON array. Retain every clause, number, condition and task instruction; no summaries or reusable dialogue substitutions.

Save scratch drafts after each one or two scenarios (16–32 ordered values), then continue appending in source order. Partial arrays stay outside the repository and cannot pass the160-value publication gate. This limits lost generation if a user continuation interrupts a worker. Read source once and never publish partial packs.

After full own fidelity QA, run:

```bash
node scripts/dialogue-translation-worker.cjs publish BATCH LOCALE /absolute/strings.json --fidelity-checked --ready-dir /absolute/dialogue-ready
```

The helper assembles exact IDs/Japanese source, resolves machine ownership/transfers, validates technical bindings, atomically publishes the complete pack without overwriting existing work, and creates a matching immutable SHA256 owner-ready marker. It refuses missing author confirmation, wrong counts, empty values, placeholders, unsupported locales and conflicting existing files.

## Coordinator cadence

- Source/ID/speaker/hint and final marker/hash checks remain mandatory for every new pack. Preserve existing committed work and unrelated drafts.
- Collect completed files into publication groups (normally8 or more new files, or at most5 minutes since the last content publication). Publish independently of incomplete batches, using GitHub branch leases and exact tree/blob/ref readback verification. Do not defer persistence to the end of a large queue.
- Integrate only full twelve-locale author-ready batches. Use scoped changed-pack checks during authoring; avoid rerunning unchanged UI, whole-app or whole-corpus checks at every ten-scenario boundary.
- Refresh the large whole-app coverage reports and perform full real-loader/indexed-corpus verification at the larger cohort checkpoint, or earlier when a failure/source drift/integration change warrants it. Report pending individual files separately from complete scenarios.
- Continue safe assigned work after a checkpoint. A progress report is not a stop instruction. Preserve and report a genuine service/network/capacity blocker without model switching or indefinite retries.

## Measured change and limits

On canonical batch100, the compact author view is19,362 UTF-8 bytes versus32,408 for the previous formatted source JSON:40% fewer input bytes. It removes repeated structural metadata, not Japanese content. The helper round-trip checks all160 ordered source-turn/task bindings, exclusive owner resolution, transfer handling, invalid-input rejection and immutable publication. No fixture translation is published.

This is an input-size measurement, not a claim of40% less total translation time or sixfold throughput. Record actual completed scenarios and authenticated persistence evidence at each larger checkpoint. Keep native/domain review false until independently established.
