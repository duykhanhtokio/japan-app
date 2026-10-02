# PRF-004 Japanese editorial recovery

Status: **FAIL CONTENT QA / rewrite in progress**. No CONTENT PASS, translation or native-speaker approval.

Input remote: `206da6362d61bda9136aa0d63dad4cb4b46b1794`. PRF-003 is complete at `edc11dc7733d19af5b07f42f5da0f7257ab9fbb7`; do not restart Iwate or Nemuro.

53/133 Miyagi exchanges have individually authored replacement scripts: Sendai 21, Ishinomaki 8, Shiogama 8, Kesennuma 8, Matsushima 8. 583 Japanese turns and 265 distinct player instructions. Runtime and canonical metadata are updated together; all IDs, ordering, turn links and location assignments remain unchanged. No existing translations were present in the replaced subset; no translations added. All source files are under `scripts/dialogue-authoring/prf-004-*.json`.

Current automated prefecture screening: 133/133 coverage, zero structural errors, zero exact whole-dialogue duplicate groups; 29 place-normalized duplicate groups and 101 near-duplicate candidates remain among the unrevised city scripts. JLPT UI lock PASS 10/10. Screening is not semantic approval.

Next: Shiroishi, Natori, Kakuda, Tagajo, Iwanuma, Tome, Kurihara, Higashimatsushima, Osaki and Tomiya, eight exchanges each (80 remaining). Read actual runtime location and content first, author complete independent causal exchanges with five individually specified speaking tasks, and preserve canonical/runtime parity. Review all 133 Miyagi exchanges against hash-bound PRF-001, PRF-002 and PRF-003 corpora before any final decision. Japanese remains first; translation deferred.

Durability requires remote fetch and WORK PERSISTENCE PASS. Direct CLI push in this environment lacks credentials; the authorized GitHub connector can create a tree/commit and fast-forward the required branch. Preserve the earlier local baseline commit in its existing workspace.
