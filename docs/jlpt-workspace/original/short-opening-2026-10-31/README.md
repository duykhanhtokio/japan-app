# Original JLPT listening opening — 2026-10-31

Publisher-requested edit applied to all 30 original forms only. Historical real exams, locked UI and unrelated content are unchanged.

Opening, two sound-check voices and general instruction follow the supplied wording. An independently synthesized 2-second two-note bell follows the general instruction. Problem 1 reads the actual question count, permits notes, gives the supplied instructions and starts question 1 directly. Its old example and explanation are omitted from playback/display; historical example source data remains. All later orientations/examples and the exact 60-second music break remain.

| Level | Forms | Problem 1 responses | First question (seconds) | Reduction range (seconds) |
|---|---:|---:|---:|---:|
| N5 | 6 | 7 | 50.225 | 108.629–143.294 |
| N4 | 6 | 8 | 50.236 | 65.112–84.761 |
| N3 | 6 | 6 | 50.215 | 56.770–82.180 |
| N2 | 6 | 5 | 50.097 | 54.177–80.524 |
| N1 | 6 | 6 | 50.215 | 69.955–85.761 |

Validation: 30 executed production data adapters remain ready; 3018 scored responses, passages, keys, IDs and session keys equal the baseline. Full generated MP3s decode to the expected PCM frame count. Scored tail was preserved byte-for-byte before same-bitrate re-encoding, with first-story waveform correlation verified; per-story assets are unchanged. Hashes, shifted timelines, unchanged answer pacing, exact 60000ms break and the 10-file UI lock pass. No old recording or bell was sampled.

Baseline: `e45d14a8858ca17cf8b6881ff358d0263b2e7bc6`. Reproduce the focused check with `node scripts/check-jlpt-original-short-opening.mjs e45d14a8858ca17cf8b6881ff358d0263b2e7bc6`. Regenerate with `python scripts/shorten-jlpt-original-opening.py --engine /path/to/approved/0.25.2/run`. Full generators now honor the omitted first example and synthesized bell.

Shorter total durations are intentional. No padding, speed change or scored-content change was introduced to restore old targets. The original exam registry accepts the applied publisher opening revision rather than claiming the old duration target still matches.

Native device, full-router playback and perceptual/native-language approval were not performed in this session. Those flags remain false. The learner app uses baked audio and has no VOICEVOX runtime dependency.
