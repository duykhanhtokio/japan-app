# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — SEMANTIC AUDIT IN PROGRESS**.

Branch: `recovery/jlpt-n3-n1`. This continuation started from remote-verified `f687aed169babf8e40ca85659273bc0687d3a964` (251/299), preserving all existing data. Original input: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`.

## Current authoritative state

All 299 canonical exchanges in 35 cities have individual editorial sources under `scripts/dialogue-authoring/prf-001-*.json`: 3289 alternating turns and 1495 separately specified player tasks. The last 48 are Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto (eight each). Runtime IDs, location IDs, turn order, next links and UI are preserved. All changed utterances clear stale translations/furigana. No translations authored.

Full player answers and task descriptions are unique across the 299 sources. Structural audit has zero errors, exact or place/quantity-normalized duplicate groups and zero near-duplicate script candidates. These are screening results and do not award CONTENT PASS.

## Next action

Do not restart the 299-file rewrite. Continue semantic and location-label audit. Premise review identifies overlapping learning goals despite lexical uniqueness, including Asahikawa/Fukagawa postal deadline distinction, Wakkanai/Sunagawa set-price shopping, Sapporo/Takikawa unit-price shopping, and several park fatigue/return-route enquiries. Inspect complete exchanges and replace overlapping developments rather than synonym edits. Some medical certificate enquiries and household-move scope enquiries also need cross-city comparison.

Correct historic/fictitious venue display labels while preserving IDs. Earlier corrected labels: Asahikawa Shinkansen transfer, Yubari and Rumoi transport. Pending examples: Monbetsu, Mikasa, Utashinai, Ishikari, Date and Hokuto station-like labels. Learning simulations must not imply verified operating stations, hospitals, banks or staffed desks. Source-backed facts remain distinct from simulated dialogue.

After repairs, read candidate pairs, audit all 299 for causal progression/task-answer alignment/location role, run shared and legacy validators plus `git diff --check`, then persist. `contentPass=false`, `nativeSpeakerReviewed=false`, translations deferred until all Japanese work is complete. Do not begin PRF-002 before prefecture semantic approval and remote verification.

## Durability

Direct shell push lacks credentials; use the authenticated GitHub connection to create tree/commit and fast-forward the required branch with force=false. Fetch, verify the local staged tree matches the remote commit, merge fast-forward, and require `node scripts/check-work-persistence.mjs` to report WORK PERSISTENCE PASS. Original utterances remain in Git history and timestamped backups.
