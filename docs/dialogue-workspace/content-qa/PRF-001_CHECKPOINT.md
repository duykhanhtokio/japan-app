# PRF-001 editorial rewrite checkpoint

Status: **FAIL CONTENT QA — IN PROGRESS**. This checkpoint is unfinished work, not prefecture completion and not a Japanese master lock.

Input remote checkpoint: `dd1ecd44cc9537efc79b578ac636d5f68792ceff`, branch `recovery/jlpt-n3-n1`. Initial fetch, branch comparison and `check-work-persistence.mjs` passed with a clean tree.

Canonical inventory: 299 scenarios in 35 cities. Initial audit found 100% file coverage, no structural errors, no exact full-script duplicates, 34 groups of place/quantity-normalized duplicates, and 542 near-duplicate candidates. These are screening results; neither JSON validity nor uniqueness implies content approval. The original cluster manifest explicitly documents recipe adaptation and reuse.

Individually rewritten so far:

- Sapporo: `SC-LOC-001-01-001` through `SC-LOC-001-21-001` (21).
- Hakodate: `SC-HKD-HAKODATE-001` and `SC-LOC-HKD-HAKODATE-02-001` through `SC-LOC-HKD-HAKODATE-08-001` (8).
- Asahikawa: `SC-HKD-ASAHIKAWA-001` and `SC-LOC-HKD-ASAHIKAWA-02-001` through `SC-LOC-HKD-ASAHIKAWA-08-001` (8).
- Otaru: `SC-HKD-OTARU-001` and `SC-LOC-HKD-OTARU-02-001` through `SC-LOC-HKD-OTARU-08-001` (8).
- Obihiro: `SC-HKD-OBIHIRO-001` and `SC-LOC-HKD-OBIHIRO-02-001` through `SC-LOC-HKD-OBIHIRO-08-001` (8).
- Muroran: `SC-LOC-JP-01205-01-001` through `SC-LOC-JP-01205-08-001`, plus `SC-LOC-JP-01205-01-002` and `SC-LOC-JP-01205-06-002` (10).

Total: 63 individual exchanges / 693 turns / 315 separately specified player tasks. Each exchange has a manually authored premise and eleven Japanese utterances. The application script only installs those supplied utterances; it does not generate exchanges from a recipe. Scenario IDs, location IDs, dialogue IDs, order and next links remain unchanged. Existing originals are retained at the input commit and in local timestamped backups. Stale translations and furigana are cleared for changed utterances; no translations are authored. Unchanged scenarios and their existing translations are preserved.

Editorial sources:

- `scripts/dialogue-authoring/prf-001-editorial-rewrites.json`
- `scripts/dialogue-authoring/prf-001-sapporo-rest.json`
- `scripts/dialogue-authoring/prf-001-hakodate.json`
- `scripts/dialogue-authoring/prf-001-asahikawa.json`
- `scripts/dialogue-authoring/prf-001-otaru.json`
- `scripts/dialogue-authoring/prf-001-obihiro.json`
- `scripts/dialogue-authoring/prf-001-muroran.json`

Simulation premises do not certify an actual business's prices, hours, facilities, policies or service availability. Next action is to audit and rewrite Kushiro, then continue the remaining PRF-001 cities. There are 236 scenarios not yet individually rewritten. Do not begin PRF-002 or translation.

Before CONTENT PASS, finish all 299 exchanges, review near and normalized duplicate candidates, compare causal developments and player tasks semantically across the entire master, verify location relevance and natural Japanese, and run compatibility checks. The 63 rewrites have not been declared prefecture-wide CONTENT PASS. Native speaker review is not claimed.

Persistence transport: direct shell `git push` lacks an HTTPS credential in this workspace. The authenticated GitHub connection identifies `duykhanhtokio`, grants repository admin/push permission, and successfully creates a blob and updates the required branch to its unchanged input SHA. Use that connection for durable commits, then shell fetch and the repository persistence validator. No new prefecture may begin before remote verification.

Location-data issue: `SC-LOC-HKD-ASAHIKAWA-06-001` retains canonical ID and location ID, but its canonical name is `旭川新幹線乗換口`. Actual geography/label correction has not been verified. The rewritten learning scene concerns generic delayed-train connections and explicitly does not assert an Asahikawa Shinkansen terminal. Resolve this location label with official evidence before prefecture CONTENT PASS.
