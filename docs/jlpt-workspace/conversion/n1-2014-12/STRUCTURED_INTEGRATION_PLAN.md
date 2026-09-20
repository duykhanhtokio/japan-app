# N1 2014-12 source-to-structured integration plan

## Preconditions

- Keep the exam out of the runtime registry and preserve the locked JLPT UI.
- Treat all `*.review.json` files as the authoritative Japanese/source-image transcription inputs.
- Keep `audio-alignment-candidates.json` and `whisper/n1-2014-12.json` as timing evidence only. No candidate timing may enter runtime data until perceptual audio review changes its status from `candidate_alignment_requires_audio_review`.
- Do not create translations during this integration phase. Any later AI translation must remain `translated_ai_unreviewed` with `generatedBy: AI` and `reviewedByNativeSpeaker: false`.

## Planned structured input mapping

| Runtime section | Source review inputs | Expected scored questions |
| --- | --- | ---: |
| Written | `written-page-02.review.json` through `written-page-12.review.json` | 70 |
| Listening 問題1 | `listening-transcript-q01.review.json` through `q06` | 6 |
| Listening 問題2 | `listening-transcript-p2-q01.review.json` through `q07` | 7 |
| Listening 問題3 | `listening-transcript-p3-q01.review.json` through `q06` | 6 |
| Listening 問題4 | `listening-transcript-p4-q01.review.json` through `q14` | 14 |
| Listening 問題5 | `listening-transcript-p5-q01.review.json`, `q02`, `q03` | 4 |

The completed structured candidate must therefore have 107 independently scored questions: 70 written and 37 listening. 問題5 question 3 must create two independent question IDs with equal audio metadata and the verified source keys `4` and `1`; this uses one of the 36 unique audio segments.

## Builder and validation sequence

1. Add a deterministic, source-only builder patterned after `scripts/build-n1-2014-07-structured.mjs`; it must read source-review JSON rather than retyping source text.
2. Produce an unregistered `src/data/jlpt-official/n1-2014-12/exam.candidate.json` and adapter. Do not edit the approved UI or exam registries at this stage.
3. Validate 70/37 counts, continuous question numbers, answer keys against `n1-2014-12-official.ts`, source asset hashes, source-page attribution, and the shared 問題5 segment invariant.
4. Add audio metadata only after perceptual timing review; validate 36 non-overlapping ranges, exact audio-duration bounds, and ffmpeg decoding.
5. Run the conversion/integration checks and the JLPT UI-lock check; checkpoint, commit narrowly, push, fetch, and require `WORK PERSISTENCE PASS` for each completed unit.

## Current blocker

The local model and source-script anchors establish candidate timing and signal-boundary consistency, but cannot substitute for perceptual audio approval. Runtime audio integration remains intentionally blocked until that approval is recorded.
