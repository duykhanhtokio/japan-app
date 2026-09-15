# JAPAN APP — JLPT BATCH 01 WORKING CHECKPOINT

- Updated: 2026-09-13
- Source app: `/Users/doduykhanh/Desktop/japan-app99/japan-app`
- Status: `in_progress`

## Approved scope

- `n1-2012-12-exam-02`
- `n1-2013-07-exam-03`
- `n1-2013-12-exam-04`
- Only the three approved source files for each exam may be used. Source hashes and absolute paths are stored in `docs/jlpt-workspace/batch-01/approved-sources/00_APPROVED_SOURCE_MANIFEST.json`.
- Do not use aggregate PDFs or ZIP archives as content sources.

## N1 12/2012

- Written: `70/70 verified`.
- Written problems: `13`.
- Passages: `13`.
- Audio timing: `35/35 verified`.
- Listening answer units: `36`.
- Listening answer keys linked: `36/36`.
- `問題5・3番` contains two answer units sharing `n1-2012-12-p5-q03`.
- Listening transcripts: `36/36 verified`; không còn transcript needs_review.
- This is not yet a complete exam and must not be integrated as verified app data.
- Detailed explanations are not yet completely linked.

## N1 07/2013 and N1 12/2013

- Approved source manifest: `completed`.
- PDF rendering: `completed`.
- Existing OCR: `completed` as support data only.
- Existing local Whisper: `completed` as navigation support only.
- Question verification, audio boundary review, answer/explanation integration and app integration: `pending`.

## Current work

`in_progress`: Dịch ngoại tuyến 70 lời giải nguồn tiếng Trung đã verified sang 12 locale còn lại; giữ nguyên tiếng Nhật, không gọi API runtime.

## Rules

- Do not rerun inventory, OCR or Whisper.
- Do not silently promote `needs_review` to `verified`.
- Do not modify, move, rename or delete source materials.
- Do not request the user to upload these saved files again when this checkpoint check passes.
- Do not claim completion before transcript, explanations, app integration, TypeScript, bundle and Simulator review all pass.

## Continue command for the next session

Tiếp tục Japan App tại /Users/doduykhanh/Desktop/japan-app99/japan-app từ docs/checkpoints/JAPAN_APP_JLPT_BATCH_01_WORKING_CHECKPOINT.md. Trước tiên chạy npm run jlpt:checkpoint:check. Không yêu cầu tôi gửi lại file nếu kiểm tra xác nhận dữ liệu vẫn còn trong source. Không chạy lại kiểm kê, OCR hoặc Whisper. Tiếp tục đúng mục in_progress.

