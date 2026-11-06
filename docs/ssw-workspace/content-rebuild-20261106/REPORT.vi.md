# Tokutei — làm lại để phục hồi nội dung, 06/11/2026

Tiếp tục từ bản GitHub đã xác minh `74af5a75b`. Đây là làm lại để phục hồi nội dung; **chưa khôi phục commit `d72833f84`** và không tái nhận các số nghiệm thu của mốc đã mất. Bảy receipt ngành là bằng chứng từng phạm vi. Sáu luồng tự kiểm nguồn/nội dung; điều phối kiểm tích hợp và lưu từ xa.

| Ngành | Trang nguồn đối chiếu có mục tiêu | Trang kiểm kê đóng mới | Sửa thực tế trong app |
|---|---:|---:|---|
| Nông nghiệp | 3 | 0 | Sửa 3 cách đọc trong 3 bài; thêm 3 tự kiểm và 36 bản dịch đề. |
| Chế tạo | 2 | 0 | Sửa 4 khoảng trống đánh giá bản vẽ bằng 3 câu mới, 36 cặp dịch; tái dùng 2 đoạn dạy đúng sẵn. |
| Thực phẩm | 4 | 0 | Sửa 2 lỗi furigana và đồng bộ 1 cách đọc thuật ngữ với nguồn, tổng 4 trường của 3 câu. |
| Nhà hàng | 10 | 0 | Sửa 1 lỗi gốc cách đọc 柄 tại 1 đoạn bài và 2 phương án; không tính thành 3 lỗi. |
| Khách sạn | 2 | 0 | Sửa 3 lỗi gốc; 16 span/15 entry, ảnh hưởng 17 trường hiển thị trong 3 bài và 2 đề thử. |
| Xây dựng | 1 | 0 | Bổ sung 2 ý thiếu trong bài 039, sửa 1 câu đánh giá; thêm 24 đoạn dịch và 12 mục thuật ngữ. |
| Kaigo, theo dõi riêng | 1 | 0 | Sửa 1 lỗi 火曜日 tại 6 vị trí ruby của 1 câu; đồng bộ bản nháp nguồn để rebuild không tái sinh lỗi. |

Các trang trên chỉ là trang đã đối chiếu cho nhóm sửa, không phải nghiệm thu toàn trang. **Không có trang kiểm kê nào được đóng mới trong đợt này; không suy ra tỷ lệ hoàn thiện app.** Mẫu số kiến thức nguồn của mọi ngành vẫn mở, tỷ lệ bao phủ toàn nguồn vẫn null. Chế tạo tăng 4 ý có đánh giá trực tiếp ở mức tự kiểm AI; những ngành còn lại không tăng số ý nghiệm thu chỉ nhờ sửa cách đọc hoặc cập nhật hash.

Phần thực phẩm về tâm/độ phân tán đã có trong mã hiện tại. Báo cáo cũ còn ghi thiếu được nhận diện là cũ; không tạo lại bài/câu trùng. Các cách đọc đa âm hợp lệ không bị tự động coi là lỗi; 切傷 được ghi riêng là đồng bộ thuật ngữ với ruby nguồn, không khẳng định きりきず luôn sai.

Các kiểm tra theo ngành bao gồm bộ nạp thực tế, binding phiên bản, furigana, bảo toàn câu/đáp án/ID, dịch và chấm/lưu/khôi phục theo phạm vi từng receipt. Kiểm chung kiểm bảy sổ canonical và payload vùng nguồn; PASS cấu trúc không phải nghiệm thu chuyên môn. Các liên kết hash cũ sau sửa phải có bằng chứng bảo toàn trước khi cập nhật, không thay hash để che nội dung chưa đối chiếu.

Lịch sử người học không bị xóa. Nông nghiệp đổi revision của 3 bài và 8 đề liên quan; các bản ghi cũ vẫn giữ nhưng không tự được coi là hoàn thành revision mới. Xây dựng đổi revision bài 039 và đề chịu ảnh hưởng. Các sửa chỉ ở lớp ruby của ngành khác giữ revision nội dung theo receipt.

Chưa có kiểm tra thiết bị thật, đo thời lượng học hoặc duyệt bản ngữ/chuyên môn cho đợt này. Audio không phải điều kiện bắt buộc để chốt đợt. Nguồn PDF/ảnh trích xuất không được đưa vào app hoặc commit.

Trạng thái máy và đường dẫn receipt từng ngành: `manifest.json`. Tiếp tục các ý còn mở từ canonical ledger hiện tại; không dùng báo cáo kiểm kê hoặc bản ghi lịch sử thay cho đối chiếu nguồn → bài → đánh giá.
