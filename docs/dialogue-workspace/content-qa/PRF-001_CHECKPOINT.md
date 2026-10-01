# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — SEMANTIC AUDIT IN PROGRESS**.

Branch: `recovery/jlpt-n3-n1`. This continuation started from remote-verified `f687aed169babf8e40ca85659273bc0687d3a964` (251/299), preserving all existing data. Original input: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`.

## Current authoritative state

All 299 canonical exchanges in 35 cities have individual editorial sources under `scripts/dialogue-authoring/prf-001-*.json`: 3289 alternating turns and 1495 separately specified player tasks. The last 48 are Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto (eight each). Runtime IDs, location IDs, turn order, next links and UI are preserved. All changed utterances clear stale translations/furigana. No translations authored.

Full player answers and task descriptions are unique across the 299 sources. Structural audit has zero errors, exact or place/quantity-normalized duplicate groups and zero near-duplicate script candidates. These are screening results and do not award CONTENT PASS.

## Next action

All 299 have been rewritten. The four previously pending comparison groups have now been read in full and their distinct information gaps, decisions and outcomes documented in `PRF-001_SEMANTIC_REVIEW.json`. This closes those groups only. Fourteen identified overlaps have been replaced. Latest: Abashiri station (-01) now concerns pickup of an already-found case, storage location, proxy conditions and deadline rather than repeating Takikawa’s lost-object/photo-timing search.

271/299 complete eleven-turn exchanges have now had their five player instructions manually rewritten into grammatical, answer-independent Japanese (1355 tasks). Canonical titles, situations and initial player goals now align for 207/299 scenarios. This continuation directly read Obihiro eight, remaining Otaru seven, Rumoi six, Shibetsu seven, Tomakomai eight and Wakkanai six. The latter 27 are the latest batch. Rumoi transport NPC no longer mentions the learning simulation; Tomakomai bank NPC asks to check each holder's address-change requirements instead of asserting one universal procedure. No translations authored and no grammar/vocabulary caps introduced.

Remaining: full-turn/global causal and referral-pattern comparison, instruction review for Sapporo 20 and Yubari eight, canonical metadata alignment for the other 92, and named operational metadata audit. **Next: Yubari eight, then Sapporo 20**. Do not regenerate completed exchanges or award CONTENT PASS from zero duplicate counts. Parsed source/runtime audits must pass before persistence.

`PRF-001_LOCATION_LABEL_REPAIRS.json` records 240 PRF-001-only record changes: ambiguous Monbetsu/Mikasa/Utashinai/Ishikari/Date/Hokuto station-like names become transport learning enquiries; fictitious hospital/bank/police/post/park labels explicitly describe simulations; synthetic operating hours removed. IDs, categories and other prefectures preserved. This is honest labelling rather than certification that real staffed counters or services exist. Named Sapporo/special venues still need operational-data review. Official JR reference URLs are recorded in the report.

Effective canonical difficulty is None for all 299; all shared rewritten turns have unrestricted grammar/vocabulary targets. No UI/route/loader changes. Native-speaker review is not claimed. Translation remains deferred. Do not begin PRF-002 until full content QA and remote verification.

## Durability

Direct shell push lacks credentials; use the authenticated GitHub connection to create tree/commit and fast-forward the required branch with force=false. Fetch, verify the local staged tree matches the remote commit, merge fast-forward, and require `node scripts/check-work-persistence.mjs` to report WORK PERSISTENCE PASS. Original utterances remain in Git history and timestamped backups.
