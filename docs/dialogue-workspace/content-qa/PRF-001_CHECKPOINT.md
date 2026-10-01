# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — SEMANTIC AUDIT IN PROGRESS**.

Branch: `recovery/jlpt-n3-n1`. This continuation started from remote-verified `f687aed169babf8e40ca85659273bc0687d3a964` (251/299), preserving all existing data. Original input: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`.

## Current authoritative state

All 299 canonical exchanges in 35 cities have individual editorial sources under `scripts/dialogue-authoring/prf-001-*.json`: 3289 alternating turns and 1495 separately specified player tasks. The last 48 are Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto (eight each). Runtime IDs, location IDs, turn order, next links and UI are preserved. All changed utterances clear stale translations/furigana. No translations authored.

Full player answers and task descriptions are unique across the 299 sources. Structural audit has zero errors, exact or place/quantity-normalized duplicate groups and zero near-duplicate script candidates. These are screening results and do not award CONTENT PASS.

## Next action

All 299 have been rewritten. The four previously pending comparison groups have now been read in full and their distinct information gaps, decisions and outcomes documented in `PRF-001_SEMANTIC_REVIEW.json`. This closes those groups only. Fourteen identified overlaps have been replaced. Latest: Abashiri station (-01) now concerns pickup of an already-found case, storage location, proxy conditions and deadline rather than repeating Takikawa’s lost-object/photo-timing search.

All 299 complete eleven-turn exchanges now have five manually reviewed grammatical, answer-independent Japanese instructions (1495 tasks). Canonical Japanese titles, situations and initial player goals align for all 299. The latest continuation directly read and repaired the remaining Yubari eight and Sapporo twenty; the other 64 metadata records were compared against their already-reviewed editorial premises/task sets, without claiming a second full-turn read for that metadata-only operation. No translations authored, no grammar/vocabulary caps added. Runtime IDs, chains and other prefectures preserved.

Additional NPC repairs remove fourth-wall wording in Yubari transport and Sapporo restaurant speech, correct the final izakaya courtesy, and avoid implying that the allergic customer should independently certify safety. Screening now also reports complete player-task, player-answer and title duplicate groups and canonical source/goal mismatches. Zero duplicate counts never award CONTENT PASS.

**Next: audit named operational location metadata, then global causal-development and NPC referral/resolution-pattern comparison across all 299.** Instruction review and canonical alignment are complete; prefecture semantic content approval is still pending. Do not begin PRF-002 or translate until the full Japanese scope and its QA gates are met.

`PRF-001_LOCATION_LABEL_REPAIRS.json` records 240 PRF-001-only record changes: ambiguous Monbetsu/Mikasa/Utashinai/Ishikari/Date/Hokuto station-like names become transport learning enquiries; fictitious hospital/bank/police/post/park labels explicitly describe simulations; synthetic operating hours removed. IDs, categories and other prefectures preserved. This is honest labelling rather than certification that real staffed counters or services exist. Named Sapporo/special venues still need operational-data review. Official JR reference URLs are recorded in the report.

Effective canonical difficulty is None for all 299; all shared rewritten turns have unrestricted grammar/vocabulary targets. No UI/route/loader changes. Native-speaker review is not claimed. Translation remains deferred. Do not begin PRF-002 until full content QA and remote verification.

## Durability

Direct shell push lacks credentials; use the authenticated GitHub connection to create tree/commit and fast-forward the required branch with force=false. Fetch, verify the local staged tree matches the remote commit, merge fast-forward, and require `node scripts/check-work-persistence.mjs` to report WORK PERSISTENCE PASS. Original utterances remain in Git history and timestamped backups.
