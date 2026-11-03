# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**762/1.064 bài** có receipt/hash hợp lệ trong cây dữ liệu này. Còn **302 bài**; chưa hoàn tất vùng. **Okinawa101/101** giữ nguyên.

Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Fukuoka chia hai tập ID không giao nhau; các phạm vi khác là Saga–Nagasaki, Kumamoto, Oita–Miyazaki và Kagoshima. Giữ nguyên byte receipt cũ; điều phối chỉ kiểm sở hữu, cấu trúc, guard và hash.

| Phạm vi | Đã rà/tổng | Còn |
|---|---:|---:|
|Fukuoka|174/245|71|
|Saga + Nagasaki|150/210|60|
|Kumamoto|97/125|28|
|Oita + Miyazaki|118/218|100|
|Kagoshima|122/165|43|
|Okinawa|101/101|0|

Tiếp tục đúng pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Trước khi chuyển nhóm mới phải xác minh GitHub bằng check-work-persistence; commit cục bộ không thay thế bằng chứng lưu từ xa. Người dùng đã cho phép đẩy các kết quả Kyushu & Okinawa tiếp theo lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1.

Check-region kiểm12×16trường/bài, hash và queue riêng vùng. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành. Không tính sàng lọc là rà ngữ nghĩa. Khi kết thúc phiên phải dừng mọi worker, không chạy ngầm.
