# Kyushu & Okinawa — rà ngữ cảnh đủ12 ngôn ngữ

**202/1.064 bài** đã rà; **38,784 trường**, **1019 sửa đổi** tích lũy. Còn **862 bài**. Chưa hoàn tất vùng.

Phiên tiếp tục từ135 bài, bổ sung67 bài. Tất cả135 bài có bằng chứng hợp lệ được giữ nguyên nội dung/nguồn/đích; không rà lại và không tăng số đếm cho việc sàng lọc tự động. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa; điều phối chỉ kiểm quyền sở hữu, cấu trúc, guard trước/sau và hash. Rà AI câu/gợi ý không thay cho duyệt bản ngữ, metadata, phát âm, thiết bị hoặc phát hành.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
| 1 | Fukuoka | 29/245 | 216 |
| 2 | Saga + Nagasaki | 42/210 | 168 |
| 3 | Kumamoto | 37/125 | 88 |
| 4 | Oita + Miyazaki | 36/218 | 182 |
| 5 | Kagoshima | 33/165 | 132 |
| 6 | Okinawa | 25/101 | 76 |

`progress.json` giữ đầy đủ ID còn lại theo từng AI. `worker-1.json` đến `worker-6.json` chứa receipt từng trường và nhật ký sửa đổi. Các vấn đề nguồn Nhật được ghi riêng, không tự chốt bằng bản dịch.

AI phụ trách Kumamoto dừng do dịch vụ báo **Selected model is at capacity**. Phần đã ghi receipt hợp lệ vẫn được giữ lại; không thay mô hình hoặc tính bài chưa đọc là đã rà.

`check-region.cjs` kiểm tra đủ12×16 nguồn/đích, canonical Nhật, queue và các lô liên quan; không tuyên bố đã chạy toàn corpus. `runtime-qa.json` là kết quả technical-only toàn corpus tại mốc tích hợp được ghi trong nhật ký phiên. Lỗi JSON Shikoku của phiên trước đã được phiên khác khôi phục; baseline hiện tại đã chạy lại toàn corpus thành công.

Tiếp tục từ pendingScenarioIds, không từ số đếm trong chat. Công cụ tích hợp: `python docs/localization-workspace/region-review/kyushuokinawa-20261103/integrate.py <worker_outputs>`. Nó xác minh đầy đủ trước khi ghi, giữ mọi bài và sửa đổi cũ, rồi cập nhật queue/hash manifest. Chạy validator, commit hẹp, lưu GitHub và xác minh persistence trước khi dọn file có thể tái tạo.
