# Chốt đợt rà nội dung chữ JLPT — 07/11/2026

Đã rà đủ 24 đề tự soạn N4–N1 trong lượt này: 2.472 câu, gồm 1.734 câu viết và 738 đơn vị kịch bản nghe. Giữ kết quả sáu đề N5 trước đó; bộ 30 đề có tổng 3.018 câu đã được rà văn bản. Đề thi thật các năm trước nằm ngoài phạm vi đợt này và được giữ nguyên.

| Cấp | Đề đã rà | Câu đã rà | Câu được sửa hoặc làm rõ |
|---|---:|---:|---:|
| N4 | 6/6 | 588 | 31 |
| N3 | 6/6 | 612 | 14 |
| N2 | 6/6 | 636 | 12 |
| N1 | 6/6 | 636 | 16 |
| Tổng lượt này | 24/24 | 2.472 | 73 |

Sáu người rà AI phụ trách phạm vi độc lập, tự kiểm tra nội dung của mình; coordinator kiểm tra tích hợp và lưu trữ, không rà chéo ngữ nghĩa. Mỗi đề có biên bản riêng, danh sách đủ ID câu đã đọc, hash nguồn/kết quả, phát hiện và cách sửa. Công việc gồm đọc trực tiếp câu hỏi, tất cả phương án, lý do đúng/sai, bài đọc liên quan và toàn bộ kịch bản nghe; giải và đối chiếu đáp án tốt nhất.

Các thay đổi xử lý phương án có cách hiểu hợp lệ cạnh tranh, kết hợp từ của đáp án được chọn bị sai, thiếu điều kiện để suy ra đáp án, lý do mâu thuẫn hoặc thêm dữ kiện không có trong bài. Tổng 73 câu bao gồm cả bổ sung chỉ dẫn chọn câu đồng nghĩa, không phải 73 khóa đáp án sai. Không thay ID hoặc khóa đáp án chấm điểm.

Hai phương án nghe chỉ in trên màn hình được chỉnh lại cho khớp kịch bản: N3-02 listening-1-05 và N3-03 listening-1-06. Biên bản xác nhận các phương án đó không được đọc trong bản thu. Không thay lời thoại, phương án đã ghi âm, manifest.items, hash audio hoặc bytes audio. Không dựng lại audio trong đợt này.

Kiểm tra tích hợp: đủ ID trong 24 biên bản; hash master/manifest/QA hiện có khớp; đáp án tham chiếu hợp lệ; không trùng phương án; nghiệm sắp xếp và dấu sao khớp câu hoàn chỉnh; ID/khóa đáp án và dữ liệu ghi âm giữ nguyên. Kiểm tra bằng mã toàn bộ 30 đề/3.018 câu/882 đơn vị nghe không có lỗi trong phạm vi phép kiểm. Bộ kiểm tra có thể chạy lại theo từng đề bằng `python scripts/check-jlpt-learner-text-review-unit.py n4-01` và tương tự cho 23 đề còn lại.

Các phát hiện ngữ nghĩa đã xác định trong đợt đọc này đã được xử lý; không coi đây là bảo đảm không còn bất kỳ lỗi chưa phát hiện nào. Kết quả là nghiệm thu rà văn bản của AI. Chưa nghe đối chiếu bản thu thực tế, chưa xác nhận phát âm, hình ảnh, người bản ngữ hoặc phê duyệt phát hành; các cờ tương ứng vẫn false. Đối chiếu lời thoại với manifest không thay thế kiểm tra âm thanh.

Mỗi đề được lưu bằng commit riêng trên nhánh đã cho phép và kiểm tra `WORK PERSISTENCE PASS`; báo cáo tổng được lưu sau khi các đề đã xác minh. Chi tiết máy đọc: `progress.json` và 30 biên bản cùng thư mục.
