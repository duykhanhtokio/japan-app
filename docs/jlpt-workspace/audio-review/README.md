# JLPT listening batch preparation (N5–N1)

The source audio and the existing question data are authoritative. The batch tool does not modify question timing. Its silence analysis is a review queue, never a transcript alignment or proof that a question is correct.

## One exam first

```bash
node scripts/prepare-jlpt-listening.mjs --exam=n1-2012-07-exam-01 --convert --output=docs/jlpt-workspace/audio-review/N1_2012_07_REVIEW.json
```

This verifies the source hash when supplied in the dataset, builds an indexed AAC `.m4a` alongside the original MP3, rejects a duration difference over 100 ms, and reports the nearest pause to every existing start/end. It leaves the app audio source unchanged. After listening in the app and accepting the conversion, add `--apply-source` to switch only that exam's source adapter to the indexed file. The approved exam UI stays byte locked.

## Batch inventory and preparation

```bash
node scripts/prepare-jlpt-listening.mjs --all --output=docs/jlpt-workspace/audio-review/ALL_LISTENING.json
node scripts/prepare-jlpt-listening.mjs --all --convert --output=docs/jlpt-workspace/audio-review/ALL_LISTENING.json
```

Use `--all --convert --apply-source` only after confirming the converted audio works in the app on the target platforms. The command prints one line per exam. `source_audio_not_materialized` means the source file is missing from this checkout or is only a Git LFS pointer; `audio_source_only` means audio exists without a structured listening dataset. Neither status is a verified exam. The tool does not invent boundaries for source-only exams.

The tool requires at least 1 GiB of free space before each new conversion and pauses with `disk_space_blocked` if the disk fills. A completed indexed file is retained; an incomplete temporary file is removed. Re-run the same command after freeing space to reuse completed conversions. `source_duration_mismatch` is a separate source issue: for example, N2 12/2017 has MP3 metadata claiming about 3,020 seconds, while its decodable audio runs about 614 seconds. Do not publish an indexed substitute or shift question boundaries until that source is independently resolved. Inspect `df -h .` and the sizes of `assets/jlpt/*/*/audio/*-indexed.m4a` before deciding what to remove; retain the original source and any indexed audio already in use by the app.

For each structured exam, use `reviewQueue`: it includes every flagged boundary and the beginning, middle, and end of each 問題. Inspect the report's `flags` and listen to these samples in the app. Prioritize a boundary whose `startSilence` or `endSilence` is absent, a boundary more than 500 ms outside a nearby pause, overlaps, and items around opening instructions. Short response items may have no detected silence; this is a cue to listen, not a reason to move them automatically. Preserve the complete opening instructions. Shared segments, such as the two responses in N1 7/2012 問題5 問3, appear once in the boundary report.

All automatically derived or unreviewed positions remain `candidate_unverified` and `needs_runtime_review`. Do not mark the whole exam verified from silence analysis. Run `node scripts/check-jlpt-approved-ui-lock.mjs` and `node scripts/check-jlpt-structured-exams.mjs` after changing an audio mapping. Save the indexed asset through Git LFS with the adapter change and report after runtime confirmation; push and run `node scripts/check-work-persistence.mjs` before considering the work durable.
