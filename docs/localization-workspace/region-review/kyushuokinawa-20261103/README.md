# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**487/1.064 bài** có receipt/hash hợp lệ. Còn **577 bài**; chưa hoàn tất vùng.

Giữ nguyên byte mọi receipt cũ; khôi phục thêm25 bài có bằng chứng hợp lệ từ checkpoint cục bộ409, không rà lại. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Điều phối chỉ kiểm quyền sở hữu, cấu trúc, guard và hash. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|86/245|159|
|2|Saga + Nagasaki|98/210|112|
|3|Kumamoto|78/125|47|
|4|Oita + Miyazaki|73/218|145|
|5|Kagoshima|79/165|86|
|6|Okinawa|73/101|28|

Tiếp tục từ pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Nạp toàn bộ worker-N*.json của đúng AI và giữ đủ reviews/changes trước khi tích hợp. check-region.cjs kiểm12×16 trường/bài, hash và queue riêng vùng. Không tính sàng lọc là rà ngữ nghĩa.
