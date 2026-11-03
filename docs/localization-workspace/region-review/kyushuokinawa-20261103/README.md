# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**804/1.064 bài** có receipt/hash hợp lệ trong cây dữ liệu này. Còn **260 bài**; chưa hoàn tất vùng. **Okinawa101/101** giữ nguyên.

Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Fukuoka chia hai tập ID không giao nhau; các phạm vi khác là Saga–Nagasaki, Kumamoto, Oita–Miyazaki và Kagoshima. Giữ nguyên byte receipt cũ; điều phối chỉ kiểm sở hữu, cấu trúc, guard và hash.

| Phạm vi | Đã rà/tổng | Còn |
|---|---:|---:|
|Fukuoka|197/245|48|
|Saga + Nagasaki|154/210|56|
|Kumamoto|99/125|26|
|Oita + Miyazaki|127/218|91|
|Kagoshima|126/165|39|
|Okinawa|101/101|0|

Tiếp tục đúng pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Trước khi chuyển nhóm mới phải xác minh GitHub bằng check-work-persistence; commit cục bộ không thay thế bằng chứng lưu từ xa. Người dùng đã cho phép đẩy các kết quả Kyushu & Okinawa tiếp theo lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1.

Check-region kiểm12×16trường/bài, hash và queue riêng vùng. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành. Không tính sàng lọc là rà ngữ nghĩa. Khi kết thúc phiên phải dừng mọi worker, không chạy ngầm.
