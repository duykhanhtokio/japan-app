# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**502/1.064 bài** có receipt/hash hợp lệ tại checkpoint cục bộ. Còn **562 bài**; chưa hoàn tất vùng.

Mốc GitHub đã xác minh trong phiên:462 bài tại2696054ec. Lượt này khôi phục25 bài có bằng chứng hợp lệ từ checkpoint cục bộ409, không rà lại;6 AI độc lập rà mới15 bài,184 sửa đổi. Giữ nguyên byte mọi receipt cũ. Không kiểm chéo ngữ nghĩa; điều phối chỉ kiểm quyền sở hữu, cấu trúc, guard và hash. Push bị auto-review từ chối quyền; chưa xác minh lưu GitHub cho kết quả mới.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|89/245|156|
|2|Saga + Nagasaki|102/210|108|
|3|Kumamoto|79/125|46|
|4|Oita + Miyazaki|77/218|141|
|5|Kagoshima|81/165|84|
|6|Okinawa|74/101|27|

Tiếp tục từ pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Nạp toàn bộ worker-N*.json của đúng AI và giữ đủ reviews/changes trước khi tích hợp. check-region.cjs kiểm12×16 trường/bài, hash và queue riêng vùng. Không tính sàng lọc là rà ngữ nghĩa. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành.
