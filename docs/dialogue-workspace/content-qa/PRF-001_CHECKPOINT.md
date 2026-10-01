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

- Abashiri: `SC-LOC-JP-01211-01-001` through `SC-LOC-JP-01211-08-001` (8).
- Rumoi: `SC-LOC-JP-01212-01-001` through `SC-LOC-JP-01212-08-001` (8).

- Tomakomai: `SC-LOC-JP-01213-01-001` through `SC-LOC-JP-01213-08-001` (8).
- Wakkanai: `SC-LOC-JP-01214-01-001` through `SC-LOC-JP-01214-08-001` (8).
- Bibai: `SC-LOC-JP-01215-01-001` through `SC-LOC-JP-01215-08-001` (8).
- Ashibetsu: `SC-LOC-JP-01216-01-001` through `SC-LOC-JP-01216-08-001` (8).

- Ebetsu: `SC-LOC-JP-01217-01-001` through `SC-LOC-JP-01217-08-001` (8).
- Akabira: `SC-LOC-JP-01218-01-001` through `SC-LOC-JP-01218-08-001` (8).
- Monbetsu: `SC-LOC-JP-01219-01-001` through `SC-LOC-JP-01219-08-001` (8).
- Shibetsu: `SC-LOC-JP-01220-01-001` through `SC-LOC-JP-01220-08-001` (8).

- Nayoro: `SC-LOC-JP-01221-01-001` through `SC-LOC-JP-01221-08-001` (8).
- Mikasa: `SC-LOC-JP-01222-01-001` through `SC-LOC-JP-01222-08-001` (8).

Total: 219 individual exchanges / 2409 turns / 1095 separately specified player tasks. Each exchange has a manually authored premise and eleven Japanese utterances. The application script only installs those supplied utterances; it does not generate exchanges from a recipe. Scenario IDs, location IDs, dialogue IDs, order and next links remain unchanged. Existing originals are retained at the input commit and in local timestamped backups. Stale translations and furigana are cleared for changed utterances; no translations are authored. Unchanged scenarios and their existing translations are preserved.

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
- `scripts/dialogue-authoring/prf-001-abashiri.json`
- `scripts/dialogue-authoring/prf-001-rumoi.json`
- `scripts/dialogue-authoring/prf-001-tomakomai.json`
- `scripts/dialogue-authoring/prf-001-wakkanai.json`
- `scripts/dialogue-authoring/prf-001-bibai.json`
- `scripts/dialogue-authoring/prf-001-ashibetsu.json`
- `scripts/dialogue-authoring/prf-001-ebetsu.json`
- `scripts/dialogue-authoring/prf-001-akabira.json`
- `scripts/dialogue-authoring/prf-001-monbetsu.json`
- `scripts/dialogue-authoring/prf-001-shibetsu.json`
- `scripts/dialogue-authoring/prf-001-nayoro.json`
- `scripts/dialogue-authoring/prf-001-mikasa.json`

Simulation premises do not certify an actual business's prices, hours, facilities, policies or service availability. Next action is to audit and rewrite Sunagawa (CTY-JP-01226), then continue the remaining PRF-001 cities. There are 80 scenarios not yet individually rewritten. Do not begin PRF-002 or translation.

Before CONTENT PASS, finish all 299 exchanges, review near and normalized duplicate candidates, compare causal developments and player tasks semantically across the entire master, verify location relevance and natural Japanese, and run compatibility checks. The 195 rewrites have not been declared prefecture-wide CONTENT PASS. Native speaker review is not claimed.

Persistence transport: direct shell `git push` lacks an HTTPS credential in this workspace. The authenticated GitHub connection identifies `duykhanhtokio`, grants repository admin/push permission, and successfully creates a blob and updates the required branch to its unchanged input SHA. Use that connection for durable commits, then shell fetch and the repository persistence validator. No new prefecture may begin before remote verification.

Location-label corrections: Asahikawa's canonical `旭川新幹線乗換口` is replaced with `旭川の乗換案内（学習用）`; the canonical ID is preserved and no Shinkansen terminal is asserted. Yubari's `夕張駅` is replaced with `夕張の交通案内（学習用）`; its exchange explicitly avoids boarding at the former station. JR Hokkaido confirms abolition of the Shin-Yubari–Yubari section on 2019-04-01: https://www.jrhokkaido.co.jp/corporate/region/current.html (checked 2026-09-30). This does not certify a real staffed information desk or its services. Other facility labels across the prefecture still need location QA.

Validation at the 195-rewrite checkpoint: 299/299 file coverage, zero structural errors, zero exact script duplicate groups, 32 normalized duplicate groups and 120 near-duplicate candidate pairs. These groups still require editorial work; similarity is not content certification. Global shared-data validator: 7128 scenarios / 78408 turns / zero errors. The legacy validator previously crashed on object packages (`rows.forEach`); it now selects shared/N5/array formats consistently with the runtime loader and merges canonical scenario overrides before checking. No runtime UI or loader changes.

Location correction: canonical `LOC-JP-01212-01` now has the display label `留萌の交通案内（学習用）` with its ID preserved. The Rumoi exchange explicitly teaches not to use old station rail departures and is a simulated transport enquiry. The former station label was corrected; JR Hokkaido confirms Ishikari-Numata–Rumoi abolition on 2023-04-01 at the official source above. No current rail service or real staffed counter at the former station is asserted. Other fictitious facility names also require review.

Current runtime compatibility remains checked by both the shared-data validator and updated legacy validator. No native speaker review, multilingual completion, full prefecture semantic approval, device screenshots or publication approval is claimed.

At 147 rewrites, lexical screening within the individually rewritten subset finds zero repeated full player answers, zero repeated specified player tasks, and zero near-duplicate script candidate pairs. This is evidence for the rewrite, not prefecture semantic certification. The new exchanges were checked for eleven alternating turns, five separately specified tasks, continuity of the supplied facts, and ending greetings. Runtime and UI files remain unchanged.

At 179 rewrites, the individually rewritten subset still has zero repeated full player answers, zero repeated specified player tasks, and zero near-duplicate script candidate pairs. Global screening remains incomplete content evidence. The 32 latest exchanges were reviewed for speaker alternation, task-to-answer correspondence, consistent actor and time references, and causal response to each preceding utterance; each retains an explicit simulated premise and unreviewed native-speaker status.

Pending geographic label QA includes `LOC-JP-01219-01` / `紋別駅`. Its rewritten exchange concerns a simulated transport enquiry and explicitly requires checking current transport operators rather than claiming real rail departures. The canonical display label still needs source-backed review before prefecture CONTENT PASS, along with remaining historic/fictitious facility labels. Do not treat those labels as verified operating venues.

At 195 rewrites, screening still finds zero repeated player answers/tasks and zero near-duplicate candidates within the rewritten subset. The current canonical count is 299; 104 scenarios remain unrewritten. Next city is Nemuro, CTY-JP-01223. No translations or prefecture content approval have been added.

Pending geographic label QA also includes `LOC-JP-01222-01` / `三笠駅`. The Mikasa exchange explicitly treats transport as travel planning at the actual stations in the learner's itinerary and does not assert current railway boarding in Mikasa. Its display label remains pending source-backed correction before CONTENT PASS.


2026-10-01 continuation: Nemuro (CTY-JP-01223), eight exchanges individually rewritten using `scripts/dialogue-authoring/prf-001-nemuro.json`. Total 203/299; 96 remain. Eleven alternating turns and five separate player tasks per exchange. Exact player-answer/task screening passed across the 203 editorial sources. Simulated learning settings; no current venue/service certification. CONTENT PASS remains false; translation deferred. Next city: Chitose.

2026-10-01 continuation: Chitose and Takikawa, eight exchanges each, authored in `prf-001-chitose.json` and `prf-001-takikawa.json`. Current total 219/299; 80 remain. All editorial sources have eleven turns and five unique player tasks; no repeated full player answers or task descriptions. Reviewed these sixteen for causal continuity, distinct situations, task/answer alignment and ending greetings. Full prefecture semantic/location approval remains pending. Next: Sunagawa (CTY-JP-01226).
