# Phân tích nhịp nghe N5 第３回 — chỉ metadata

Người dùng xác nhận ngày 06/10/2026: cho phép phân tích, không lấy nội dung.

Đã xử lý tín hiệu cục bộ bằng ffprobe và FFmpeg. Không nhận dạng lời nói, không tạo transcript, không đọc câu hỏi/đáp án, không phát hoặc xuất đoạn audio gốc, không gửi dịch vụ ngoài. Bộ trích chỉ lấy bốn trường mốc câu có sẵn và các số đo tín hiệu. Mã nguồn và SHA-256 giúp kiểm tra lại quy trình.

Thời lượng container của nguồn: **1779435 ms ≈ 29 phút 39 giây**. Bản mới tại checkpoint trước: **796387 ms ≈ 13 phút 16 giây**. Mục tiêu app: 1800000 ms, bao gồm nghỉ nhạc và thông báo.

| Dạng | Số câu | Trung vị cửa sổ câu | Ngắn nhất | Dài nhất |
|---|---:|---:|---:|---:|
| 問題１ | 7 | 63.90 s | 56.06 s | 80.86 s |
| 問題２ | 6 | 63.05 s | 57.26 s | 123.62 s |
| 問題３ | 5 | 36.46 s | 32.78 s | 38.60 s |
| 問題４ | 6 | 30.31 s | 21.10 s | 42.60 s |

Các mốc câu là candidate chưa được kiểm tra ngữ nghĩa. Đặc biệt câu cuối 問題２ dài 123.62 s, có thể gộp phần chuyển tiếp; đây là điểm cần kiểm tra, không phải bằng chứng câu thoại dài như vậy. Không sao chép mốc từng câu sang đề mới.

Ngoài các cửa sổ câu, còn các vùng trước dạng 1/2/3/4 dài lần lượt 207.72 / 122.96 / 94.96 / 82.30 giây, và đuôi 6.655 giây. Phân tích tín hiệu không xác định chính xác vùng nào là hướng dẫn, ví dụ, nhạc hoặc lời chuyển; không ghi số ví dụ khi chưa có bằng chứng.

Ngưỡng phân tích chính -35 dB, khoảng thấp tín hiệu tối thiểu 250 ms, có kiểm tra độ nhạy ở -40 và -45 dB. “Tín hiệu thấp” không đồng nghĩa toàn bộ là thời gian trả lời; “tín hiệu cao” không đồng nghĩa toàn bộ là lời nói. Không suy ra tốc độ âm tiết hoặc trọng âm từ các số đo này.

Đã lập ngân sách tổng hợp 1800000 ms trong `listening-timing.plan.json`. Đây là kế hoạch soạn độc lập, chưa phải bản thu đạt 30 phút. Phải phát triển nội dung N5 tự nhiên, thiết kế nhịp chuẩn bị/trả lời có mục đích, rồi đo bản hoàn chỉnh. Cấu trúc ví dụ chưa được xác minh bằng phương pháp tín hiệu; không tự thêm hoặc lặp ví dụ để lấp ngân sách.
