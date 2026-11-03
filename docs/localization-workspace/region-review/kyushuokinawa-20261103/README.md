# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**542/1.064 bài** có receipt/hash hợp lệ ở checkpoint này. Còn **522 bài**; chưa hoàn tất vùng.

Giữ nguyên byte mọi receipt cũ. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Điều phối kiểm quyền sở hữu, cấu trúc, guard và hash. Chỉ nhận ID pending chưa có receipt hợp lệ; bản ghi trùng từ staging cũ không thay đổi bằng chứng đã chốt.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|93/245|152|
|2|Saga + Nagasaki|114/210|96|
|3|Kumamoto|81/125|44|
|4|Oita + Miyazaki|81/218|137|
|5|Kagoshima|93/165|72|
|6|Okinawa|80/101|21|

Tiếp tục đúng pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Nạp toàn bộ worker-N*.json của đúng phạm vi, giữ reviews và changes. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành. Không tính sàng lọc là rà ngữ nghĩa. Check-region kiểm12×16trường/bài, hash và queue riêng vùng.
