# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**248/1.064 bài** có receipt/hash hợp lệ trong checkout hiện tại. Còn **816 bài**. Người dùng đã cho phép lưu lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1; xác minh GitHub bằng check-work-persistence.mjs.

Phiên này rà mới46 bài,220 sửa đổi; giữ nguyên202 bài cũ. Sáu phạm vi độc lập không kiểm chéo ngữ nghĩa. Điều phối kiểm cấu trúc, quyền sở hữu và hash. Không tính sàng lọc tự động. Không thay cho duyệt bản ngữ, nguồn Nhật, metadata, phát âm, thiết bị hoặc phát hành.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|38/245|207|
|2|Saga + Nagasaki|49/210|161|
|3|Kumamoto|45/125|80|
|4|Oita + Miyazaki|41/218|177|
|5|Kagoshima|41/165|124|
|6|Okinawa|34/101|67|

Tiếp tục từ pendingScenarioIds; giữ nguyên worker receipts và log cũ. Tất cả worker đã báo dừng, không có tiến trình chạy ngầm. Các sourceIssues được ghi riêng.

`check-region.cjs` kiểm hash đủ12×16 trường/bài và queue trong vùng; không phải kiểm toàn corpus. `runtime-qa.json` giữ kết quả lịch sử theo đúng checkpoint ghi trong file.
