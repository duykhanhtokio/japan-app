# Chugoku — independent six-worker context review

Publisher request: focus all six workers on Chugoku, divide exclusive scopes, do not cross-review semantics, and retain valid prior receipts.

`assignment.json` fixes the scenario and locale-batch ownership at the recorded baseline. The canonical queue contains 479 scenarios across Tottori (40), Shimane (64), Okayama (133), Hiroshima (125), and Yamaguchi (117). At assignment time none had an all-twelve-locale context receipt in the canonical queue. Worker scopes contain 82, 80, 79, 79, 80, and 79 scenarios respectively. A batch may span a prefecture boundary; ownership covers writes to that batch, while review remains limited to assigned Chugoku scenarios.

Each worker reads Japanese context, all eleven turns, five tasks, and all twelve target sets. Compact receipts bind the actual source, context, target fields and immutable assignment to SHA-256 values. Hash generation alone does not constitute semantic review. Corrections have explicit before/after values and reasons. Workers self-check their own work; coordinator checks mechanical integration, original-source bindings and actual app-loader results.

Run `node scripts/integrate-chugoku-context-review.cjs` to validate receipts and packs. Add `--write` to merge only recorded reviewed IDs into the canonical queue and refresh affected translation manifest hashes. Run `TOKUTEI_QA_MODULES=<existing dependency root> node scripts/check-chugoku-context-loader.cjs` to verify current reviewed fields through the real loader without installing another dependency copy.

`progress.json` and `loader-qa.json` describe the last integrated checkpoint, not necessarily all currently written receipts. `workerN-intent.json` records local transaction recovery state. Completed receipts remain independent of subsequent batches.

Keep `nativeReviewed: false`, `translated_ai_unreviewed`, source issues and device/audio acceptance distinctions. Full AI context review does not certify native wording, source correctness, pronunciation, perceptual audio approval or real-device behavior. Open `sourceIssues` require a separate source-authoring decision; faithful translation does not close those issues.

Git CLI push is unavailable in this environment. Checkpoints are written through the connected GitHub API with an expected-head lease and verified against fetched remote blobs. Concurrent region work must be preserved by merging the canonical queue, plan and manifest rather than replacing those files with stale copies. Local HEAD/index synchronization was rejected by automatic review while workers were mutating files; keep their unfinished changes intact.
