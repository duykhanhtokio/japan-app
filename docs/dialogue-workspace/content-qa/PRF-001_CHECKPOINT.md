# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — SEMANTIC AUDIT IN PROGRESS**.

Branch: `recovery/jlpt-n3-n1`. This continuation started from remote-verified `f687aed169babf8e40ca85659273bc0687d3a964` (251/299), preserving all existing data. Original input: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`.

## Current authoritative state

All 299 canonical exchanges in 35 cities have individual editorial sources under `scripts/dialogue-authoring/prf-001-*.json`: 3289 alternating turns and 1495 separately specified player tasks. The last 48 are Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto (eight each). Runtime IDs, location IDs, turn order, next links and UI are preserved. All changed utterances clear stale translations/furigana. No translations authored.

Full player answers and task descriptions are unique across the 299 sources. Structural audit has zero errors, exact or place/quantity-normalized duplicate groups and zero near-duplicate script candidates. These are screening results and do not award CONTENT PASS.

## Next action

All 299 have been rewritten. The four previously pending comparison groups have now been read in full and their distinct information gaps, decisions and outcomes documented in `PRF-001_SEMANTIC_REVIEW.json`. This closes those groups only. Fourteen identified overlaps have been replaced. Latest: Abashiri station (-01) now concerns pickup of an already-found case, storage location, proxy conditions and deadline rather than repeating Takikawa’s lost-object/photo-timing search.

172/299 complete exchanges have had their five player instructions manually rewritten into natural Japanese (860 tasks). This batch adds 53 complete exchanges: Abashiri eight, remaining Akabira six and Ashibetsu seven, Bibai eight, Asahikawa eight, Ebetsu eight and Hakodate eight. Source/runtime goals, hints and evaluation notes match. Concrete fictional child ages and family-remittance destination replace unspecified references. Abashiri’s re-delivery consultation matches labeled fields rather than claiming a universal number format. Asahikawa’s unidentified cleaning bottle remains untouched pending responsible-person confirmation. Workplace exchanges close courteously; Hakodate openings explicitly offer assistance. No medical, machinery or chemical operating instructions, actual fares, transfer availability, proxy conditions or holding periods are certified.

Canonical titles, situations and initial player goals now align for 108/299 scenarios. Parsed before/after checks confirm only the 53 current-batch records changed and preserve all other records. No JLPT or grammar/vocabulary cap was introduced.

Remaining: full-turn semantic/naturalness audit across all 299, instruction review for the other 127, canonical title/goal alignment for the other 191, and global comparison of NPC referrals and resolution patterns. **Next: Iwamizawa all eight**, then remaining Kitami. Determine exact source IDs from the editorial source before editing. Do not regenerate completed exchanges or award CONTENT PASS from zero duplicate counts.

`PRF-001_LOCATION_LABEL_REPAIRS.json` records 240 PRF-001-only record changes: ambiguous Monbetsu/Mikasa/Utashinai/Ishikari/Date/Hokuto station-like names become transport learning enquiries; fictitious hospital/bank/police/post/park labels explicitly describe simulations; synthetic operating hours removed. IDs, categories and other prefectures preserved. This is honest labelling rather than certification that real staffed counters or services exist. Named Sapporo/special venues still need operational-data review. Official JR reference URLs are recorded in the report.

Effective canonical difficulty is None for all 299; all shared rewritten turns have unrestricted grammar/vocabulary targets. No UI/route/loader changes. Native-speaker review is not claimed. Translation remains deferred. Do not begin PRF-002 until full content QA and remote verification.

## Durability

Direct shell push lacks credentials; use the authenticated GitHub connection to create tree/commit and fast-forward the required branch with force=false. Fetch, verify the local staged tree matches the remote commit, merge fast-forward, and require `node scripts/check-work-persistence.mjs` to report WORK PERSISTENCE PASS. Original utterances remain in Git history and timestamped backups.
