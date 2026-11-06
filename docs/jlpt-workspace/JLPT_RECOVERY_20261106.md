# JLPT recovery — 2026-11-06

Base: b4113fe3ebfefe0226b0bbbf0cd65779f00a6e2d.
The former bundle and commits 80e37f19/4615a710/0b1b975c are unavailable; this is new recovery work, not an exact recreation.

## Actual repair
N1-03 medium reading: questions 9-01 through 9-03 now reference the existing delivery passage medium-3. Questions 9-07 through 9-09 previously asked about skilled-worker training absent from their attached delivery passage; they now assess the existing tree-preservation passage medium-1. Six questions repaired. Correct option positions, IDs, question counts, all listening text and audio are preserved. Updated currentMasterSha256 without claiming new audio generation.

Validation executed: N1-03 written validator PASS (70 written/36 listening, 12 passages, balanced positions); approved UI lock PASS 10/10; git diff --check PASS. AI editorial review only; human/native/perceptual/release approval remains false.

## Remaining work
24 normalized-v2 candidate manifests/full tracks for N5/N4/N3/N2 were found in the remote-backed source. Their existence is not a new validation or installation claim. All six N1 normalized recordings are absent from that candidate collection. Existing checkpoint prose understates the candidate inventory. Validate preserved candidates, reconstruct missing N1 audio on an engine-capable host, review remaining N1-04/N1-05/N3-03 reported written issues and saved-session/audio-revision behavior, then install only a complete validated batch. Do not mark 30 new recordings installed.

