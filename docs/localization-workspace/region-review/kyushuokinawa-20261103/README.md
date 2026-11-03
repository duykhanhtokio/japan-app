# Kyushu & Okinawa — rà ngữ cảnh12 ngôn ngữ

Đã rà **409/1.064 bài** ở đủ12 bộ câu/gợi ý, **78,528 trường**, **2644 điều chỉnh** tích lũy. Còn **655 bài**; chưa hoàn tất vùng.

Phiên hiện tại tiếp tục từ202 bài đã xác minh trên GitHub, bổ sung207 bài ở checkpoint này. Bằng chứng hợp lệ được giữ nguyên và không rà lại; kiểm hash bằng máy không được tính là lượt rà ngữ nghĩa mới. Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa; điều phối kiểm quyền sở hữu, nguồn/đích, guard trước/sau, queue, manifest và hash.

| AI | Phạm vi | Đã rà/tổng | Còn |
|---|---|---:|---:|
| 1 | Fukuoka | 54/245 | 191 |
| 2 | Saga + Nagasaki | 98/210 | 112 |
| 3 | Kumamoto | 78/125 | 47 |
| 4 | Oita + Miyazaki | 66/218 | 152 |
| 5 | Kagoshima | 56/165 | 109 |
| 6 | Okinawa | 57/101 | 44 |

`progress.json` là danh sách ID còn lại; `worker-1.json` đến `worker-6.json` là bằng chứng từng trường và nhật ký sửa đổi. Vấn đề nguồn Nhật ghi riêng; không tự chốt bằng dịch. Rà AI câu/gợi ý không thay cho duyệt bản ngữ, metadata, phát âm, thiết bị hoặc phát hành.

`check-region.cjs` kiểm riêng vùng. `runtime-qa.json` giữ snapshot technical-only toàn corpus; phải chạy lại sau khi gộp nhánh đồng thời. Lỗi JSON Shikoku và lỗi dịch vụ Kumamoto ở phiên trước là lịch sử, không được coi là trạng thái chặn mặc định của lượt này. `session-003.json` theo dõi các checkpoint của phiên.

Tiếp tục đúng pendingScenarioIds và trừ mọi ID đã có receipt all12 đầy đủ trong staging. Mỗi AI đọc Nhật/metadata một lần cho từng bài, rồi đọc đầy đủ mọi giá trị đích cả12 ngôn ngữ; chỉ bỏ phần nguồn lặp lại, không dùng sàng lọc để thay rà ngữ nghĩa.

Tích hợp: `python docs/localization-workspace/region-review/kyushuokinawa-20261103/integrate.py <worker_outputs>`. Công cụ xác minh đầy đủ trước khi ghi, ngăn mất bài/sửa đổi cũ, ghi nguyên tử từng file, đồng bộ queue và hash manifest. Lưu GitHub, so SHA tree cục bộ/từ xa và xác minh persistence trước khi dọn bản sao có thể tái tạo.

Bộ kiểm tra toàn corpus hiện nhận mọi receipt worker-N với N dương, gồm các lượt7–12, thay vì bỏ qua lượt sau6. Chỉ mở rộng tìm hồ sơ; mọi kiểm tra nguồn/đích,16trường,12ngôn ngữ,queue và cờ bản ngữ vẫn giữ nguyên. Ở môi trường này dùng `NODE_OPTIONS=--max-old-space-size=768` khi chạy technical-only để bộ gom rác hoạt động trong giới hạn RAM.

Hợp nhất đồng thời: giữ nguyên byte của worker-1.json đến worker-6.json (248 bài hợp lệ ở main), bổ sung161 bài riêng trong worker-7.json đến worker-12.json. Số hiệu receipt là lịch sử, không phải số AI chạy đồng thời. Mỗi bài chỉ được đếm một lần. Công cụ tích hợp hiện chỉ nhận ID chưa có bằng chứng hợp lệ và thêm receipt bất biến; không phát lại đề xuất cũ vào các bài đã được main xác minh. Các phương án trước khi ghép được giữ ở nhánh checkpoint/kyushu-review-409-20261103.

Xác minh phiên bản đích thay đổi:1.012 trường thực sự khác phiên bản đã đọc được kiểm theo6 nhóm độc lập; các giá trị bản nháp đã có bản sửa hợp lệ không bị áp dụng lại. Không tăng số bài cho việc này. Nguồn Nhật không đổi. Input/result khóa hash được giữ trong revision-version-check và current-version-field-evidence.json; đây là rà AI, không phải chứng nhận bản ngữ.
