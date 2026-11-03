# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**654/1.064 bài** có receipt/hash hợp lệ. Còn **410 bài**; chưa hoàn tất vùng. **Okinawa101/101** đã rà AI đủ12ngôn ngữ.

Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Điều phối kiểm quyền sở hữu, cấu trúc, guard và hash. Giữ nguyên byte mọi receipt cũ; không nhận bản ghi trùng để thay đổi bằng chứng đã chốt. Phiên AI hết dung lượng được thay bằng phiên mới cùng phạm vi. Lượt này dừng sau khi phiên thay thế mới báo không đủ dung lượng xử lý; mọi worker đã dừng, không chạy ngầm.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|117/245|128|
|2|Saga + Nagasaki|138/210|72|
|3|Kumamoto|91/125|34|
|4|Oita + Miyazaki|93/218|125|
|5|Kagoshima|114/165|51|
|6|Okinawa|101/101|0|

Tiếp tục đúng pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Check-region kiểm12×16trường/bài, hash và queue riêng vùng. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành. Không tính sàng lọc là rà ngữ nghĩa.
