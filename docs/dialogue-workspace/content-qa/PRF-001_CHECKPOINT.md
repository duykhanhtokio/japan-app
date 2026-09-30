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

- Kushiro: `SC-LOC-JP-01206-01-001` through `SC-LOC-JP-01206-08-001`, plus `SC-LOC-JP-01206-01-002` and `SC-LOC-JP-01206-06-002` (10).
- Kitami: `SC-LOC-JP-01208-01-001` through `SC-LOC-JP-01208-08-001`, plus `SC-LOC-JP-01208-06-002` (9).
- Yubari: `SC-LOC-JP-01209-01-001` through `SC-LOC-JP-01209-08-001`, plus `SC-LOC-JP-01209-06-002` (9).
- Iwamizawa: `SC-LOC-JP-01210-01-001` through `SC-LOC-JP-01210-08-001` (8).

Total: 99 individual exchanges / 1089 turns / 495 separately specified player tasks. Each exchange has a manually authored premise and eleven Japanese utterances. The application script only installs those supplied utterances; it does not generate exchanges from a recipe. Scenario IDs, location IDs, dialogue IDs, order and next links remain unchanged. Existing originals are retained at the input commit and in local timestamped backups. Stale translations and furigana are cleared for changed utterances; no translations are authored. Unchanged scenarios and their existing translations are preserved.

Editorial sources:

- `scripts/dialogue-authoring/prf-001-editorial-rewrites.json`
- `scripts/dialogue-authoring/prf-001-sapporo-rest.json`
- `scripts/dialogue-authoring/prf-001-hakodate.json`
- `scripts/dialogue-authoring/prf-001-asahikawa.json`
- `scripts/dialogue-authoring/prf-001-otaru.json`
- `scripts/dialogue-authoring/prf-001-obihiro.json`
- `scripts/dialogue-authoring/prf-001-muroran.json`
- `scripts/dialogue-authoring/prf-001-kushiro.json`
- `scripts/dialogue-authoring/prf-001-kitami.json`
- `scripts/dialogue-authoring/prf-001-yubari.json`
- `scripts/dialogue-authoring/prf-001-iwamizawa.json`

Simulation premises do not certify an actual business's prices, hours, facilities, policies or service availability. Next action is to audit and rewrite Abashiri (CTY-JP-01211), then continue the remaining PRF-001 cities. There are 200 scenarios not yet individually rewritten. Do not begin PRF-002 or translation.

Before CONTENT PASS, finish all 299 exchanges, review near and normalized duplicate candidates, compare causal developments and player tasks semantically across the entire master, verify location relevance and natural Japanese, and run compatibility checks. The 99 rewrites have not been declared prefecture-wide CONTENT PASS. Native speaker review is not claimed.

Persistence transport: direct shell `git push` lacks an HTTPS credential in this workspace. The authenticated GitHub connection identifies `duykhanhtokio`, grants repository admin/push permission, and successfully creates a blob and updates the required branch to its unchanged input SHA. Use that connection for durable commits, then shell fetch and the repository persistence validator. No new prefecture may begin before remote verification.

Location-label corrections: Asahikawa's canonical `旭川新幹線乗換口` is replaced with `旭川の乗換案内（学習用）`; the canonical ID is preserved and no Shinkansen terminal is asserted. Yubari's `夕張駅` is replaced with `夕張の交通案内（学習用）`; its exchange explicitly avoids boarding at the former station. JR Hokkaido confirms abolition of the Shin-Yubari–Yubari section on 2019-04-01: https://www.jrhokkaido.co.jp/corporate/region/current.html (checked 2026-09-30). This does not certify a real staffed information desk or its services. Other facility labels across the prefecture still need location QA.

Validation at the 99-rewrite checkpoint: 299/299 file coverage, zero structural errors, zero exact script duplicate groups, 32 normalized duplicate groups and 480 near-duplicate candidate pairs. These groups still require editorial work; similarity is not content certification. Global shared-data validator: 7128 scenarios / 78408 turns / zero errors. The legacy validator previously crashed on object packages (`rows.forEach`); it now selects shared/N5/array formats consistently with the runtime loader and merges canonical scenario overrides before checking. No runtime UI or loader changes.
