# Báo cáo bộ kiểm tra 建設 10×40 — 2026-10-15

Đã tạo mới và tích hợp 10 đề, mỗi đề 40 câu bốn lựa chọn, tổng 400 câu tiếng Nhật. Đường vào trong mã app: 建設 → chọn cấp/mảng → 確認テスト. Phần học 55 tuần/385 bài và 12 bản dịch vẫn giữ nguyên. Cổng bản phát triển hiện có được giữ; chưa mở phát hành công khai.

Nguồn sáng tác là phần Nhật của giáo trình đang có. Mỗi câu có lời giải, mục tiêu riêng, lý do từng phương án nhiễu và ID đoạn nguồn kèm SHA-256/revision. Không dùng đề chính thức, bản dịch hoặc 200 câu cũ làm đầu vào. Năm tác giả tự rà riêng 80 câu; tác giả thứ sáu thực hiện màn kiểm tra. Bản yêu cầu AI chi tiết nằm trong AI_AUTHORING_REQUIREMENTS_10x40_VI.md.

## Độ phủ thực tế

| Chỉ số | Kết quả |
|---|---:|
| Đề/câu | 10/400 |
| Bài học có câu hỏi | 385/385 |
| Tuần có câu hỏi | 55/55 |
| Cụm có đoạn được hỏi | 1124/1548 |
| Đoạn được dẫn trực tiếp trong đánh giá | 1631/3856 |
| Đoạn chưa được hỏi trực tiếp | 2225 |

Độ phủ theo bài không đồng nghĩa bao trọn mọi ý kiến thức. Một đoạn có dẫn nguồn cũng có thể chứa ý khác chưa được hỏi. coverage-matrix.json ghi đầy đủ từng cụm/đoạn và câu tương ứng, kể cả phần chưa được đánh giá. Không chứng nhận đủ mọi tài liệu tham khảo hoặc năng lực nâng cao 2号.

## Kiểm tra

400 ID, câu hỏi chuẩn hóa và mục tiêu đều riêng biệt; không trùng nguyên văn chuẩn hóa với 200 câu lịch sử. Sửa 7 câu mở đầu quá giống nhau; đã đọc 40 cặp gần nhau còn lại, phân biệt mục tiêu kỹ thuật, giữ phần chỉ dẫn trắc nghiệm chung. Đây là kiểm tra AI, không chứng minh tuyệt đối khác nghĩa bằng máy.

Mỗi đề có 10 đáp án đúng tại từng vị trí 1–4; không có ba đáp án liên tiếp giống nhau cả ranh giới đề. Chấm đúng/sai/trống/hỗn hợp, 170 trường hợp dữ liệu lưu không hợp lệ và 240 khóa phạm vi riêng đều đạt. Reader kiểm tra thật trên web thích nghi đạt 400 câu/1.600 lựa chọn, 10 lần nộp/kết quả/tải lại, khóa đáp án trước nộp, tiếp tục đúng câu và đáp án, tách người học/cấp/mảng/đề, làm lại có xác nhận, lỗi đọc không ghi đè, lỗi ghi giữ đáp án và thử lại. Đã sửa trạng thái tiếp cận radio trên web; xem sáu ảnh ổn định trước/sau nộp ở 320×568, 768×1024, 932×430.

Luồng app → đề → bài học nguồn → phần học đạt. Reader học tuần cuối hồi quy 84 tổ hợp bài–ngôn ngữ đạt. 771 tệp giáo trình/bản dịch/ngân hàng cũ giữ nguyên hash; JLPT khóa giao diện 10/10. TypeScript phạm vi dữ liệu/trạng thái/màn mới đạt với khai báo thích nghi; chưa phải bản dựng Expo đầy đủ. Artwork Royal, safe area và storage được thích nghi khi kiểm web; chưa kiểm thiết bị thật.

Chưa có duyệt bản ngữ, chuyên môn, quyền hoặc phát hành. Chưa đặt giờ thi, điểm đỗ, phần thưởng hoặc khấu trừ tài nguyên. Lưu bền vững chỉ được xác nhận khi commit chứa hồ sơ này được fetch và WORK PERSISTENCE PASS.
