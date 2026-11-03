# Kyushu & Okinawa — rà ngữ cảnh12 ngôn ngữ

Đã rà **296/1.064 bài** ở đủ12 bộ câu/gợi ý, **56,832 trường**, **1260 sửa đổi** tích lũy. Còn **768 bài**; chưa hoàn tất vùng.

Phiên hiện tại tiếp tục từ202 bài đã xác minh trên GitHub, bổ sung94 bài ở checkpoint này. Bằng chứng hợp lệ được giữ nguyên và không rà lại; kiểm hash bằng máy không được tính là lượt rà ngữ nghĩa mới. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa; điều phối kiểm quyền sở hữu, nguồn/đích, guard trước/sau, queue, manifest và hash.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
| 1 | Fukuoka | 41/245 | 204 |
| 2 | Saga + Nagasaki | 59/210 | 151 |
| 3 | Kumamoto | 61/125 | 64 |
| 4 | Oita + Miyazaki | 50/218 | 168 |
| 5 | Kagoshima | 47/165 | 118 |
| 6 | Okinawa | 38/101 | 63 |

`progress.json` là danh sách ID còn lại; `worker-1.json` đến `worker-6.json` là bằng chứng từng trường và nhật ký sửa đổi. Vấn đề nguồn Nhật ghi riêng; không tự chốt bằng dịch. Rà AI câu/gợi ý không thay cho duyệt bản ngữ, metadata, phát âm, thiết bị hoặc phát hành.

`check-region.cjs` kiểm riêng vùng. `runtime-qa.json` giữ snapshot technical-only toàn corpus; phải chạy lại sau khi gộp nhánh đồng thời. Lỗi JSON Shikoku và lỗi dịch vụ Kumamoto ở phiên trước là lịch sử, không được coi là trạng thái chặn mặc định của lượt này. `session-003.json` theo dõi các checkpoint của phiên.

Tiếp tục đúng pendingScenarioIds và trừ mọi ID đã có receipt all12 đầy đủ trong staging. Mỗi AI đọc Nhật/metadata một lần cho từng bài, rồi đọc đầy đủ mọi giá trị đích cả12 ngôn ngữ; chỉ bỏ phần nguồn lặp lại, không dùng sàng lọc để thay rà ngữ nghĩa.

Tích hợp: `python docs/localization-workspace/region-review/kyushuokinawa-20261103/integrate.py <worker_outputs>`. Công cụ xác minh đầy đủ trước khi ghi, ngăn mất bài/sửa đổi cũ, ghi nguyên tử từng file, đồng bộ queue và hash manifest. Lưu GitHub, so SHA tree cục bộ/từ xa và xác minh persistence trước khi dọn bản sao có thể tái tạo.

Bộ kiểm tra toàn corpus hiện nhận mọi receipt worker-N với N dương, gồm các lượt7–12, thay vì bỏ qua lượt sau6. Chỉ mở rộng tìm hồ sơ; mọi kiểm tra nguồn/đích,16trường,12ngôn ngữ,queue và cờ bản ngữ vẫn giữ nguyên. Ở môi trường này dùng `NODE_OPTIONS=--max-old-space-size=768` khi chạy technical-only để bộ gom rác hoạt động trong giới hạn RAM.
