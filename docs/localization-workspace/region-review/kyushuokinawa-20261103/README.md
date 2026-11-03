# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**286/1.064 bài** có receipt/hash hợp lệ. Còn **778 bài**; chưa hoàn tất vùng.

Giữ nguyên bằng chứng248 bài đã lưu tại038728741. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Điều phối chỉ kiểm quyền sở hữu, cấu trúc, guard và hash. Không tính sàng lọc tự động. Rà AI không thay cho duyệt bản ngữ, nguồn Nhật, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|47/245|198|
|2|Saga + Nagasaki|55/210|155|
|3|Kumamoto|53/125|72|
|4|Oita + Miyazaki|44/218|174|
|5|Kagoshima|47/165|118|
|6|Okinawa|40/101|61|

Bằng chứng mới nằm trong `worker-N-part-NNNN.json`; giữ nguyên byte các file cũ. Khi tiếp tục, nạp TOÀN BỘ `worker-N*.json` của AI tương ứng vào input, giữ đủ reviews và changes. Integrator kiểm bằng chứng cũ không mất/đổi trước khi ghi phần mới.

Tiếp tục từ pendingScenarioIds. SourceIssues ghi riêng. `check-region.cjs` kiểm12×16 trường/bài, hash và queue của vùng; không thay cho kiểm toàn corpus. `runtime-qa.json` là mốc lịch sử theo đúng file.

Lưu lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1 đã được người dùng cho phép. Chỉ xác nhận lưu sau check-work-persistence.mjs.
