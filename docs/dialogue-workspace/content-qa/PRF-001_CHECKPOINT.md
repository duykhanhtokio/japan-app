# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — SEMANTIC AUDIT IN PROGRESS**.

Branch: `recovery/jlpt-n3-n1`. This continuation started from remote-verified `f687aed169babf8e40ca85659273bc0687d3a964` (251/299), preserving all existing data. Original input: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`.

## Current authoritative state

All 299 canonical exchanges in 35 cities have individual editorial sources under `scripts/dialogue-authoring/prf-001-*.json`: 3289 alternating turns and 1495 separately specified player tasks. The last 48 are Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto (eight each). Runtime IDs, location IDs, turn order, next links and UI are preserved. All changed utterances clear stale translations/furigana. No translations authored.

Full player answers and task descriptions are unique across the 299 sources. Structural audit has zero errors, exact or place/quantity-normalized duplicate groups and zero near-duplicate script candidates. These are screening results and do not award CONTENT PASS.

## Next action

All 299 have been rewritten. The four previously pending comparison groups have now been read in full and their distinct information gaps, decisions and outcomes documented in `PRF-001_SEMANTIC_REVIEW.json`. This closes those groups only. Thirteen identified overlaps have been replaced. The latest is Furano park (-08): its path-closure resolution repeated Akabira; it now concerns observation counts and possible repeated sightings of the same flock.

119/299 complete exchanges have had their five player instructions manually rewritten into natural Japanese in this checkpoint (595 tasks): the twelve replacement scenarios, eleven scenarios from the four comparison groups, all eight Nemuro exchanges, and the other 25 exchanges from Chitose, Takikawa, Sunagawa and Fukagawa, all eight Utashinai exchanges, the seven remaining Furano exchanges, and all eight each from Noboribetsu, Eniwa, Date, Kitahiroshima, Ishikari and Hokuto. Source and runtime goals/hints/evaluation notes match; the audit now checks that parity for every declared editorial source. Corrected Takikawa bicycle-search chronology, Fukagawa capacity/external-size explanation, and Chitose police closing courtesy. Mikasa and Utashinai NPCs no longer mention the learning simulation inside their speech. Utashinai's patient directly answers the question about recent urgent symptom changes. Noboribetsu's hearing/privacy exchange now asks consistently for written communication. Date's NPC supplies the requested station reading (official JR reference recorded), and its payment-record reply includes the required name. No operating hours, staffed-counter availability or train services are certified by these edits. The editorial apply tool now notices task/premise-only changes, and backup directories use microseconds to avoid overwriting manifests between batches.

Remaining: full-turn semantic/naturalness audit across all 299, instruction review for the other 180, and canonical title/goal alignment for the other 244. The 55 newly reviewed exchanges have distinct concise canonical titles, matching situations and player goals in `scenario-overrides.json`; parsed before/after checks prove only those 55 records changed. No level or grammar/vocabulary cap was introduced. Also review whether repeated NPC referrals are justified and responsive before awarding content approval. **Next: Abashiri all eight** (`SC-LOC-JP-01211-01-001` through `SC-LOC-JP-01211-08-001`), then remaining Akabira, Ashibetsu and Bibai sets. Do not regenerate completed exchanges or award CONTENT PASS from the zero duplicate counts.

`PRF-001_LOCATION_LABEL_REPAIRS.json` records 240 PRF-001-only record changes: ambiguous Monbetsu/Mikasa/Utashinai/Ishikari/Date/Hokuto station-like names become transport learning enquiries; fictitious hospital/bank/police/post/park labels explicitly describe simulations; synthetic operating hours removed. IDs, categories and other prefectures preserved. This is honest labelling rather than certification that real staffed counters or services exist. Named Sapporo/special venues still need operational-data review. Official JR reference URLs are recorded in the report.

Effective canonical difficulty is None for all 299; all shared rewritten turns have unrestricted grammar/vocabulary targets. No UI/route/loader changes. Native-speaker review is not claimed. Translation remains deferred. Do not begin PRF-002 until full content QA and remote verification.

## Durability

Direct shell push lacks credentials; use the authenticated GitHub connection to create tree/commit and fast-forward the required branch with force=false. Fetch, verify the local staged tree matches the remote commit, merge fast-forward, and require `node scripts/check-work-persistence.mjs` to report WORK PERSISTENCE PASS. Original utterances remain in Git history and timestamped backups.
