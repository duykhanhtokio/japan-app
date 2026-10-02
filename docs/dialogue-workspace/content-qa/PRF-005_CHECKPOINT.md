# PRF-005 Akita Japanese editorial recovery

Status: **FAIL CONTENT QA / rewrite in progress**. No translation or native-speaker approval. PRF-004 Miyagi has hash-bound AI content PASS and remote-verified WORK PERSISTENCE PASS at `b8ed1142de71df0030cbb3e74734cd8e7b86a584`; do not redo Miyagi.

Canonical corpus: 117 exchanges across 13 cities. Individually authored and integrated: Akita city 21, Yokote 8 and Odate 8, total 37 exchanges / 407 turns / 185 player tasks. Existing runtime utterances were read before replacement. Source files: `scripts/dialogue-authoring/prf-005-akita.json`, `prf-005-yokote.json` and `prf-005-odate.json`. Runtime/source/canonical metadata agree; learner-level caps and grammar/vocabulary restrictions are cleared only for the replaced records.

Next: Semboku, Yuzawa, Noshiro, Oga, Kazuno, Yurihonjo, Katagami, Daisen, Kitaakita, Nikaho, eight exchanges each (80). Continue within this prefecture before PRF-006. Current screening: 117/117 coverage and zero structural errors; 32 normalized duplicate groups and 41 near candidates remain among old scripts. Whole-prefecture causal/task/closure review and comparison against PRF-001 through PRF-004 are pending. In particular, review the new refill-detergent and returned-parcel scenes against prior Aomori counterparts rather than treating low text similarity as approval.

Some original Akita city location labels contain corrupted characters (`男鹼館`, `秋田カンティール賢郸寝屋`, `秋田㇠んにゅた大太鼓演舞会場`, `きりたんぽ鴯専門店`). Location IDs and labels are preserved; the authored dialogues describe the existing location roles as fictional facilities. Real location identity and policy verification remain unclaimed.

Preservation check against the incoming remote: invariant IDs, ordering, speaker and next-turn links retained; no translations were present in the replaced runtime subset and none are added; unrelated canonical records unchanged. Persistence requires remote fast-forward, fetch and WORK PERSISTENCE PASS. This is an intermediate durability save during a continuous whole-prefecture rewrite, not a completed-prefecture decision.
