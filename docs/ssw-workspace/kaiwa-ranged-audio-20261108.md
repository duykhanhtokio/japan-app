# Kaiwa bounded original-recording delivery — 2026-11-08

Implemented after e61a410a, before Tokutei entry work. No speech synthesis or voice replacement.

The existing factory guarantees MPEG-2 Layer III 24kHz mono 48kbps MP3 without ID3/Xing in its packs. All 96 pack sizes equal durationMs × 6. All 42,768 turn start/duration offsets are divisible by 24ms, so each turn maps exactly to independent 144-byte frames. Native playback now downloads only those original bytes to an individual MP3 clip and starts at zero, instead of downloading/seeking within a 10–20MiB pack. Median requested payload: 36,144 bytes; largest: 169,488 bytes. Source text, role, speaker, revision and pack identity checks remain in place. New encodings fail the range contract; no inference for arbitrary VBR files.

The server was observed returning exact HTTP206 Content-Range for seven live samples across all four voice roles, including pack start, far offsets and the longest turn. FFmpeg decoded all samples. Receipts are in the sibling JSON. This host's HTTP samples took around 10–12 seconds including its network/proxy path: these are not iPhone latency measurements and do not establish immediate cold-network playback. Payload size reduction is verified; network round trips still exist. Existing scenario-card warmup, cached native clips and two-at-a-time upcoming-line prefetch address that remaining wait.

The native cache validates HTTP206, exact Content-Range and byte count before publishing a temporary clip. Oversized progress and a 20-second deadline cancel downloads. Completed files are reused after app restarts; failed files are removed. Pruning targets 64MiB/512 clips and protects recently used/current transfers. Web uses bounded fetch/blob URLs with a small in-memory cache. expo-file-system ~19.0.24 is now a direct dependency, matching the version already in Expo's dependency tree.

Validation: scripts/dialogue-voice/check-ranged-clips.cjs checks all metadata ranges, misaligned-offset rejection, response rejection, native-cache reuse and concurrent deduplication; existing dialogue cancellation/prefetch regression. Native device onset and human voice review remain unverified.
