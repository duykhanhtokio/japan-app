# PRF-003 Japanese editorial checkpoint

Status: **FAIL CONTENT QA — rewrite/reconciliation in progress**. This checkpoint supersedes earlier claims of all 125 runtime exchanges rewritten and zero structural errors. No translation and no PRF-004.

The fetched base is `733d71c7b69656171265155a012290a4b6518749` on `recovery/jlpt-n3-n1`. Input `b15474bc` resolves to `b15474bc19ecd5c0b8ec662606c2ed3529bc6ff9`; PRF-001 (299) and PRF-002 (93) were rechecked against current runtime hashes and retain their AI Japanese editorial CONTENT PASS. Do not restart Nemuro.

A fresh audit of the exact base tree found source/runtime/canonical/hint/evaluation mismatches in 125 scenarios. This is not 125 broken turn chains. `prf-003-all-reviewed.json` is not the actual runtime source for most records; candidate content must not be mistaken for integrated content. Repeated interior NPC reply sequences remain in actual runtime. Evidence is in PRF-003_RECONCILIATION_AUDIT.json and the semantic review continuation record.

This continuation individually replaces 25 runtime exchanges: Morioka -05 through -21 and all eight Rikuzentakata records. They have 275 alternating turns and 125 player tasks. Their actual source, canonical title/premise/initial goal, hints and evaluation notes align and clear the structural gate. The other 100 runtime files remain byte-identical to the fetched base. Scenario IDs, locations, turn IDs and links are preserved. Their source is `scripts/dialogue-authoring/prf-003-semantic-repairs.json`; the unused all-reviewed candidate is preserved unchanged. No UI edits.

Whole-prefecture audit still fails for 100 unreconciled records and duplicate titles. Candidate comparison also identifies two new overlaps requiring repair: Morioka -07 versus Noboribetsu -02 (night-shift Japanese participation) and Morioka -09 versus Hirosaki -08 (two diners selecting separate meals). The 25 replacements are not a final semantic approval. No native-speaker, real-policy, venue or translation approval.

Next: `SC-LOC-003-01-001`, then Morioka -02/-03/-04; resolve the two flagged replacements; continue the remaining source/runtime reconciliation and individualized causal rewrites by city. Review all 125 against PRF-001/PRF-002 before setting CONTENT PASS. Historical review counts in the semantic file are retained but this current checkpoint and fresh audit control continuation.

Persistence must be proved by commit/push or authenticated GitHub tree/commit fast-forward, fetch, exact-tree comparison and WORK PERSISTENCE PASS. A local edit is not durable evidence.
