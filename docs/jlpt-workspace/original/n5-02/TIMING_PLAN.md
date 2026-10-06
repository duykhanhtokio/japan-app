# N5 02 timing plan

Independently authored exam: 35 vocabulary, 32 grammar/reading, 24 listening responses. Four listening examples are ungraded.

| Component | Internal plan | Purpose |
|---|---:|---|
| Problem 1: 7 scored items | 504000 ms | Task comprehension, four printed choices |
| Problem 2: 6 scored items | 432000 ms | Key detail comprehension, four printed choices |
| Problem 3: 5 scored items | 200000 ms | New illustrations and three spoken expressions |
| Problem 4: 6 scored items | 192000 ms | Short utterance and three spoken replies |
| Instrumental rest after problem 2 | Exactly 60000 ms | Publisher-requested break, original procedural music |
| Opening, sound check, four examples, instructions, transitions, closing and two break announcements | About 412000 ms | Orient learner and demonstrate each task |
| Whole track | Nominal 1800000 ms | Approximately 30 minutes; final measurement required |

Use the publisher-approved N5 pace: speedScale 0.9, 2000 ms after intro, 500 ms between dialogue turns, answer intervals 12000/12000/10000/8000 ms. No dialogue replay or arbitrary silence padding. Per-item targets and orientation estimate are internal planning aids, not publisher acceptance tolerances. Actual rendered PCM and MP3 decode must be recorded. Human/native/perceptual/rights review remains pending.

## Reproduction and encoding

`python scripts/generate-jlpt-original-n5-02-audio.py --engine /path/to/VOICEVOX/run --cache-dir /temporary/turn-cache`

The N5 02 entry point selects exam 02 and 48 kbps for the continuous MP3 to fit the connector 16 MiB request limit. The complete track is 10869987 bytes; item MP3s remain 96 kbps. PCM content, voice settings, pauses and duration are unchanged. The general generator defaults to 96 kbps, preserving N5 01. Encoded audio quality still awaits perceptual review.
