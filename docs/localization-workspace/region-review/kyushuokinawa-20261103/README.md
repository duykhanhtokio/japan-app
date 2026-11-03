# Kyushu & Okinawa — rà ngữ cảnh 12 ngôn ngữ

Đã rà **135/1.064 bài**, **25,920 trường**, **853 sửa đổi**. Còn **929 bài**. Chưa hoàn tất vùng.

Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Điều phối chỉ kiểm cấu trúc, quyền sở hữu, giá trị trước/sau, nguồn/đích và hash. Receipt chỉ bao gồm bài đã đọc đủ tiếng Nhật và 12 bộ câu/gợi ý; không thay cho duyệt bản ngữ, metadata, thiết bị hoặc phát hành. Các vấn đề nguồn Nhật ghi riêng trong receipt, chưa được giải quyết bằng việc dịch.

| AI | Phạm vi | Đã rà / tổng | Còn |
|---|---|---:|---:|
| 1 | Fukuoka | 21/245 | 224 |
| 2 | Saga + Nagasaki | 29/210 | 181 |
| 3 | Kumamoto | 31/125 | 94 |
| 4 | Oita + Miyazaki | 22/218 | 196 |
| 5 | Kagoshima | 17/165 | 148 |
| 6 | Okinawa | 15/101 | 86 |

`progress.json` ghi đầy đủ ID chưa rà cho từng AI. `worker-1.json` đến `worker-6.json` giữ bằng chứng từng trường và sửa đổi chính xác. Nguồn Nhật, ID, thứ tự lượt, giọng/hình và cờ chưa duyệt bản ngữ được giữ nguyên. Bằng chứng hợp lệ ngoài vùng được giữ lại và kiểm tra qua release-readiness technical-only.

Tiếp tục: đọc `progress.json`, giao đúng pendingScenarioIds cho sáu AI; không đọc lại bài đã có receipt hợp lệ. Công cụ tích hợp có thể gọi `python docs/localization-workspace/region-review/kyushuokinawa-20261103/integrate.py <thư_mục_worker_outputs>`; chỉ nhận receipt đầy đủ, kiểm 16 trường ×12, guard trước/sau và nguồn/đích trước khi cập nhật queue/manifest. Chạy validator rồi lưu GitHub và xác minh checkpoint.

## Kiểm tra sau tích hợp đồng thời

`check-region.cjs` xác minh 20 lô liên quan, đủ 25.920 hash nguồn/đích và queue vùng: PASS. `runtime-qa.json` là snapshot toàn corpus đạt trước khi gộp Shikoku; lần chạy toàn corpus sau mốc `4196b82f` bị chặn bởi 4 receipt Shikoku lỗi JSON. `integration-qa.json` ghi rõ các file lỗi; phiên này không sửa nội dung/bằng chứng vùng khác và không tuyên bố toàn nhánh đạt.
