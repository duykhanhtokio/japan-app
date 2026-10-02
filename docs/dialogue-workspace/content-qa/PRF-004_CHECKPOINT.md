# PRF-004 Japanese editorial recovery

Status: **CONTENT PASS — AI Japanese editorial review** for the exact runtime hashes in `PRF-004_SEMANTIC_REVIEW.json`. Native-speaker approval and real-location/policy verification are not claimed. Translation remains deferred.

All 133/133 Miyagi exchanges have individually authored scripts in the 15 `scripts/dialogue-authoring/prf-004-*.json` sources: 1,463 alternating Japanese turns and 665 individual speaking tasks. The last 56 are integrated, and 18 substantive plot collisions/adaptations were replaced during whole-prefecture comparison, including the earlier Sendai divided-train plot. Task/answer disagreements and incomplete final NPC handoffs were corrected. Fictional-scene provenance stays in metadata rather than NPC speech.

The separate editorial decision contains city-specific causal assessments and every scenarios initial request, final player action, closing NPC and five speaking goals. Cross-prefecture evidence includes 517 reference scenarios, 68,761 screened pairs, reference/target hashes, replaced cases and retained-case reasons. Automated screening alone does not grant CONTENT PASS.

Validation: canonical/source/runtime parity, 133/133 coverage, zero structural errors and zero exact, place-normalized, near-dialogue, task, answer, title or recipe duplicate groups. Exact task and answer collision checks against PRF-001 through PRF-004 pass. Turn IDs, scenario IDs, speaker/order/next links and location assignments are preserved; unrelated canonical records are unchanged. No existing translations were present in edited runtimes; no translations added. JLPT approved UI lock PASS 10/10.

Incoming remote base: `e091d93a528b4f4fc636658a941edd611191a033`, including the separate paired-dialogue UI change. PRF-001, PRF-002 and PRF-003 remain untouched. Durability requires connector fast-forward, remote fetch and WORK PERSISTENCE PASS before starting PRF-005 Akita. Do not redo Miyagi after that gate succeeds.

Publication base also preserves remote compact-foreground dialogue UI update `189b58665a79db7c046fc9186aeaf7528abe5a48`; no dialogue data conflicts.
