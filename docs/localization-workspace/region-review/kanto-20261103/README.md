# Kanto — rà ngữ cảnh 12 ngôn ngữ

Phạm vi 1.681 bài, 7 tỉnh/thành (PRF-008 đến PRF-014). Sáu AI có quyền sở hữu độc lập theo lô: 281/280/280/280/280/280 bài; tổng 178 lô. Không kiểm chéo ngữ nghĩa. Mốc đầu vào `7dfefea18ca037b06798b1e03154b3f175b5eceb`; giữ nguyên bằng chứng trước đó. Kanto chưa có bài đã rà đủ ở mốc đầu vào.

Chỉ bài đã thực đọc tiếng Nhật và đủ 12 ngôn ngữ, có receipt hash từng câu/gợi ý và ghi chú riêng, mới tính rà ngữ cảnh bằng AI. Các bài chưa đọc vẫn nằm trong assignment; phân công không chứng minh hoàn tất. `worker-1.json` đến `worker-6.json` được ghi tăng dần, không thay cho chứng nhận bản ngữ, phát âm, thiết bị hoặc phát hành. Các điểm chưa rõ trong nguồn Nhật được ghi riêng, không tự sửa nguồn để che vấn đề.

Khi worker đã ngừng ghi, chạy `python scripts/check-kanto-context-review.py --sync` để kiểm chứng quyền sở hữu, độ đủ 12 ngôn ngữ, hash và mọi thay đổi, rồi đồng bộ queue/manifest. Chạy `TOKUTEI_QA_MODULES=<dependencies> node scripts/check-kanto-context-loader.cjs` để kiểm văn bản qua loader thực. Chỉ chốt vùng khi đủ 1.681 bài có bằng chứng hợp lệ.

## Checkpoint hiện tại

Đã thực đọc 57/1.681 bài × 12 ngôn ngữ, 10.944 trường; sửa 653 trường trong 88 tệp lô dịch. Còn 1.624 bài, vùng chưa hoàn tất. Sáu worker đã dừng ghi. `resume.json` ghi điểm tiếp tục; 494 bài có bằng chứng trước đó được giữ nguyên. Hash/phạm vi và loader thực đạt; chưa nghiệm thu bản ngữ/thiết bị. Một điểm chưa rõ của nguồn Nhật ở `SC-LOC-008-07-001` được giữ riêng. Commit chỉ có cục bộ do bộ duyệt tự động chặn đẩy GitHub; chưa có bằng chứng lưu từ xa cho lượt Kanto.
