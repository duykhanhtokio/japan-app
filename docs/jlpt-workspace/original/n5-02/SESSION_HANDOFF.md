# Tiếp tục biên soạn JLPT — N5 02 đã tích hợp

Repository duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1. Fetch, xác minh HEAD/upstream, đọc đầy đủ AGENTS.md, AI_SESSION_START_HERE.md, AUTHORING_RULES, LEVEL_BLUEPRINTS, checkpoint, authoring-blueprints, voice-casting và khóa UI trước khi làm. Không dùng nội dung đề nguồn để soạn hoặc coi đường dẫn scratch cũ là tài nguyên bền vững.

N5 02: 67 câu viết + 24 câu nghe = 91, năm hình câu hỏi, bốn ví dụ ngoài điểm. Audio liền mạch decode 1824002ms = 30:24.002; MP3 48kbps xuất trực tiếp từ PCM gốc, mono 24000Hz, 24 tệp câu và nhạc giữ 96kbps. Bốn giọng/speedScale 0.9/nhịp 2/.5 giây/trả lời 12/12/10/8 giây được giữ; nhạc đúng 60000ms sau 問題２ trước hướng dẫn 問題３. Bảng PRACTICE / QUESTION 1 là cảnh được mời trà và găng tay rơi ở công viên.

Adapter/catalog đã đăng ký, session riêng, audio start 0ms. Cấu trúc/hash/PCM/adapter/UI lock PASS. Chromium audio từ đầu/pause/resume/qua cuối nhạc/decode năm hình và production runner web mở/chọn/lưu/Back/resume/nộp/chấm điểm/review PASS. Xem audio.manifest.json, qa.json, authoring-audit.json, runtime-2026-10-06/ và checkpoint. Chưa có native/iPhone/full-router/full TypeScript hoặc human/native/perceptual/rights/release approval; releaseReady false.

Bộ nháp khác cùng ID của commit ac47373 được bảo toàn đầy đủ trong previous-draft-ac47373/, kèm handoff cũ tại SESSION_HANDOFF-at-3dcbe26.md. EDITORIAL_PROGRESS.json và validation.json cũ mô tả bộ nháp đó, không mô tả bản tích hợp hiện tại. Không ghép hai bộ câu/hình/kịch bản/audio khác nhau.

Bước kế tiếp: xác minh fetch và scripts/check-work-persistence.mjs, rồi soạn N5 03 đầy đủ nội dung/hình/audio, kiểm tra và lưu từng đề. Còn 28 đề trong phạm vi 30 đề. Không đặt cổng duyệt nháp; người dùng test khi đủ bộ. Giữ UI, đề cũ và các cờ phê duyệt con người false; không xóa đề cũ trước gate thay thế.

## Current consolidation

The active final N5 02 is the 1811532ms version with QA in qa.json. The b27fc9d1 completed variant is preserved under concurrent-complete-b27fc9d1; it overlaps this exam and is not a new exam. The different unused ac473732 draft is preserved under concurrent-draft-ac473732 and may be reviewed and allocated to N5 03 only after durable persistence. Four selected VOICEVOX models are working at /dev/shm/jlpt-voicevox-test/engine/run in this temporary session; rediscover or reinstall if absent later.
