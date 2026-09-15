# JLPT Batch 01 workspace

This directory preserves the complete working state for N1 12/2012, N1 07/2013 and N1 12/2013.

- `approved-sources/`: approved absolute source paths and SHA-256 values. Original PDFs/audio remain outside the repository.
- `written/`: verified written data. `n1-2012-12-written-70.verified.json` is canonical for the completed written section.
- `listening/`: listening data under review. Files containing `.review.` are not production-ready.
- `audio-review/`: human-reviewed audio boundaries.
- `ocr/`: existing OCR used only to navigate source images. It is not an official content source.
- `whisper/`: existing Whisper output used only to locate audio. It is not an official transcript source.
- `reports/rendered-pdf/`: previously rendered source-page images and stage reports used for direct visual verification.
- `extraction-status/`: machine-readable completion state.
- `manifests/`: approved-source, OCR/audio and handoff reports.
- `checkpoint/`: earlier session checkpoint retained for history.
- `PROGRESS_MANIFEST.json`: hashes of the files preserved here.

Continue with the `in_progress` entry in `docs/checkpoints/JAPAN_APP_JLPT_BATCH_01_WORKING_CHECKPOINT.md`. Do not rerun inventory, OCR or Whisper. Do not use review data as verified app data. Do not ask the user to upload these files again if `npm run jlpt:checkpoint:check` passes.

