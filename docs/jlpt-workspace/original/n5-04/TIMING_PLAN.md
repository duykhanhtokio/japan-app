# N5 04 listening timing plan

Independent skill-first authoring, no source content. Nominal target 1800000ms, not a fixed acceptance tolerance. VOICEVOX 0.25.2, four approved voices, speedScale .9. Lead-in 2000ms; turns 500ms; responses 12000/12000/10000/8000ms. No whole-dialogue replay.

| Component | Count | Initial budget ms |
|---|---:|---:|
| Task comprehension | 7 | 504000 |
| Key point | 6 | 426000 |
| Situational utterance | 5 | 210000 |
| Quick response | 6 | 210000 |
| Original instructions, sound check, 4 examples, closing | 1 | 375000 |
| Music plus two announcements | 1 | 75000 |
| Total | | 1800000 |

Per-item objectives are in master timingBudget. Music exactly 60000ms, 1440000 frames, after problem 2 response pause, before any problem 3 instructions. All durations remain estimates until actual generation and decode. Do not fill shortfall with silence or change approved speed/pacing.

Actual final MP3 decoded duration: **1798375ms = 29:58.375**, delta −1625ms from nominal target. Initial PCM 1798652ms; editorial/casting fixes final PCM rounds to 1798375ms, same decoded round. No new tolerance, speed/pause changes, silent padding or full-dialogue replay. See duration-revision.json and audio.manifest.json for per-group and per-item measured times. Reproduce with `python scripts/generate-jlpt-original-audio.py --engine /path/to/voicevox/run --exam-number 4 --cache-dir /path/to/cache --continuous-bitrate-kbps 48`.
