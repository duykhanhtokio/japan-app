# N5 03 — independent listening timing plan

67 written responses and 24 scored listening responses. The four practice examples are not scored.

| Component | Planning budget | Function |
|---|---:|---|
| Problem 1, seven responses | 500000 ms | Determine the next action from conditions and changes |
| Problem 2, six responses | 430000 ms | Find the requested detail, separating past and current information |
| Problem 3, five responses | 210000 ms | Interpret five independently authored illustrations and spoken alternatives |
| Problem 4, six responses | 200000 ms | Choose a natural spoken response |
| Instrumental music | Exactly 60000 ms | Rest after problem 2, before all problem 3 instructions |
| Opening, sound check, examples, instructions, transitions, closing and break announcements | About 400000 ms | Orient the learner and demonstrate the tasks |
| Whole track | Nominal 1800000 ms | Approximately 30 minutes; actual decoded measurement required |

Publisher-approved N5 settings remain unchanged: speedScale 0.9, 24000 Hz mono, 2000 ms after the introduction, 500 ms between dialogue turns, and answer pauses 12000/12000/10000/8000 ms for problems 1–4. These budgets are editorial estimates, not a fixed acceptance tolerance. Do not stretch pauses, replay conversations, or change speed to fill time.

Reproduce from independently authored content using:

```bash
python scripts/generate-jlpt-original-audio.py --exam-number 3 --engine /path/to/VOICEVOX/run --cache-dir /temporary/turn-cache --continuous-bitrate-kbps 48
```

The existing unused Japan App draft and its imagegen illustrations were preserved in `concurrent-draft-ac473732`; they are independent app authorship, not historical JLPT question sources. Exam 03 assigns independent IDs, rotates answer quotas, updates content and generates a new recording after the option permutation. No source exam content or recording is an input.

Full decoded measurements and technical checks belong in the audio manifest and QA report. Human/native/perceptual/rights/publisher release approval remains false.
