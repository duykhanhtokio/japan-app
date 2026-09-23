# N5 December 2021 human review summary

## Result

- Written: 43/43 candidate answers agree with independently re-derived answers from direct inspection of the original PDF.
- Listening: 24/24 candidate answers agree with answers re-derived from the recovered transcript and decoded-audio/Whisper cross-check.
- Answer conflicts: 0.
- Material transcript mismatches: 0.
- Minor transcript uncertainties: 1 (`listening-p1-q2`).
- Timing adjustments proposed: 0. All 24 ranges contain detected speech and are ordered/non-overlapping in the machine check.
- Checklist: 67/67 items are present and intentionally unchecked.

## Limits and status

This is not a blind validation: the candidate key had already been inspected during source recovery. Written answers were nevertheless re-derived question by question from the original rendered source pages with documented reasoning.

The listening comparison is machine-assisted. Audio was decoded and aligned against local Whisper `small` output and the recovered candidate transcript, but Codex is not a human listener and does not provide perceptual approval. Therefore:

- `machineCrossChecked: true`
- `humanReviewed: false`
- `perceptualApproval: false`
- `timingVerificationStatus: candidate_unverified`
- review disposition remains `needs_later_review`

The JLPT FAQ states that actual test questions and answers are not officially published. The recovered Yuuki Bùi-derived candidate key is not described as an official answer key, and mirrors with the same provenance are not independent corroboration.

No candidate answer, transcript, or timing from this packet is applied to runtime data. The exam remains `incomplete` and must not be marked `structured_ready` until an actual human reviewer completes all 67 checklist items and the remaining source requirements are resolved.

## Evidence pointers

- Original source PDF: `/Users/doduykhanh/Desktop/Nội dung đưa vào app/N5/N5 12-2021/Đề N5 T12-2021 Mark.pdf`
- Existing runtime audio used for machine comparison: `assets/jlpt/n5/2021-12/audio/n5-2021-12.mp3`
- Written validation: `review/written-candidate-validation.json`
- Listening validation: `review/listening-candidate-validation.json`
- Detailed exceptions: `review/answer-conflicts.json`, `review/transcript-differences.json`, and `review/timing-adjustment-proposals.json`
