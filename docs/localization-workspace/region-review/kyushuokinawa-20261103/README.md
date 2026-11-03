# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ

**462/1.064 bài** có receipt/hash hợp lệ. Còn **602 bài**; chưa hoàn tất vùng.

Giữ nguyên bằng chứng248 bài đã lưu tại038728741. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Điều phối chỉ kiểm quyền sở hữu, cấu trúc, guard và hash. Không tính sàng lọc tự động. Rà AI không thay cho duyệt bản ngữ, nguồn Nhật, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
|1|Fukuoka|86/245|159|
|2|Saga + Nagasaki|82/210|128|
|3|Kumamoto|72/125|53|
|4|Oita + Miyazaki|70/218|148|
|5|Kagoshima|79/165|86|
|6|Okinawa|73/101|28|

Bằng chứng mới nằm trong `worker-N-part-NNNN.json`; giữ nguyên byte các file cũ. Khi tiếp tục, nạp TOÀN BỘ `worker-N*.json` của AI tương ứng vào input, giữ đủ reviews và changes. Integrator kiểm bằng chứng cũ không mất/đổi trước khi ghi phần mới.

Tiếp tục từ pendingScenarioIds. SourceIssues ghi riêng. `check-region.cjs` kiểm12×16 trường/bài, hash và queue của vùng; không thay cho kiểm toàn corpus. `runtime-qa.json` là mốc lịch sử theo đúng file.

Lưu lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1 đã được người dùng cho phép. Chỉ xác nhận lưu sau check-work-persistence.mjs.
