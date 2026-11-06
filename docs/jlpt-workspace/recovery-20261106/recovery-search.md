# Six N1 revised recordings: recovery search — 2026-11-06

Status: **blocked_missing_prior_output**, not an assertion of irreversible loss.

Scope: locate the six completed N1 prosody revisions reported on 2026-11-05, without synthesizing replacement audio or modifying exam content. This search worker did not start an engine, render audio, change an exam, fetch binary release assets, or repeat the earlier full-pack fsck.

## Findings from additional sources in this pass

| Source inspected | Method and result |
| --- | --- |
| Local history of the two normalized-v2 N1 candidate paths | `git log --all --reflog` for `docs/jlpt-workspace/audio-prosody-candidates/20261103-normalized-v2/{assets,src/data}/jlpt-original/n1` returned no historical commits. This concerns refs/reflogs available in the current checkout only. |
| GitHub complete branch inventory | `GET /repos/duykhanhtokio/japan-app/branches?per_page=100` and `git ls-remote --heads` both returned 53 heads. No dedicated 2026-11-05 JLPT/prosody recovery branch was present. |
| Branch-head metadata outside the locally available commit set | Queried GitHub Git commit metadata for 39 branch heads (37 distinct SHAs); every query succeeded, all committer dates precede 2026-11-05. The latest among these is Kanto evidence on 2026-11-03. This does not by itself prove that an older-dated commit could never contain a later file; it supplies no positive source for the reported 2026-11-05 recordings. |
| Locally available remote-head metadata | 14 branch heads were already in the local object database. Their metadata was inspected without fetching media; the only head dated 2026-11-05 or later was the active recovery branch containing the current recovery edits. |
| GitHub release collection | `GET /repos/duykhanhtokio/japan-app/releases?per_page=100` returned one release, `npc-audio-40181116462`, published 2026-10-25. Its 144 assets are NPC voice clips and worker JSON, not a JLPT bundle or six revised N1 exam recordings. No release asset was downloaded. |
| Accessible archive paths | Filename search under `/mnt`, `/tmp` and `/workspace` found only the newly created `jlpt-n1-audio-resume-20261106.tar.gz`; no prior JLPT bundle/archive or completed-prosody archive was found. |

## Earlier evidence reused, not rerun

The coordinator had already inspected 4,350 local commit objects across the two available checkouts and searched Library, the old workspace paths, workflow inventory and the three commit identifiers. The original `80e37f19`, `4615a710`, `0b1b975c` objects and 704 MiB bundle/18 parts were not found in those accessible sources. Repeated whole-pack hashing or re-synthesis would not constitute recovery of the old bytes.

## What remains available

- All 30 original exam masters and all 30 earlier canonical continuous recordings remain represented in Git.
- 24 normalized-v2 revised candidates for N5 through N2 remain available; their validation/integration is owned by the integration worker.
- The recent N1-01 partial render/cache is explicitly a new incomplete attempt, not recovery of the six prior completed recordings. Its durable archive identifier is `libfile_fde3_f-f71dbde9a7c48191aae4b6b3f5bb04d4_252bef5e177c819185eb1e5d741ef4b5`.

## Exact blocker and next admissible input

No accessible source examined so far supplies the prior six completed revised N1 recordings or their full manifests. Closing this recovery item requires actual bytes from the prior workspace/object database, a complete bundle/archive, or a remote tree/blob reference that supplies the same outputs and permits hash verification. Until then, mark the old-output recovery **unresolved**. Do not claim absolute deletion, full recovery, six revised recordings installed, or user approval to regenerate them. Preserve the existing canonical recordings and valid 24 candidates.

This report is a source-search receipt, not audio acceptance, perceptual review, or full JLPT completion. Remote persistence is the coordinator's responsibility after integration.
