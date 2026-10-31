# Đối chiếu nguồn vận hành nhà hàng 2号

Đã đọc văn bản cả 33 trang và kiểm tra bản render; mở riêng các bảng/hình ở trang 6, 11, 18, 25, 28, 29. Đã đọc 17 bài vận hành hiện có, 136 câu hỏi, cùng dữ liệu và thành phần hiển thị QSC, tỉ lệ nhân công và đặt hàng.

Gói `packet.json` quyết định đủ 128 đơn vị: 8 mục tổng hợp có liên kết con, 67 mục có bằng chứng hiện hành, 53 mục cần các bổ sung đã soạn. Có 209 đơn vị nghĩa nhỏ; 119 mục kỹ năng có câu hỏi áp dụng/đại diện kèm giới hạn, tám mục tổng hợp liên kết kỹ năng con. Một mục tham chiếu QSC được miễn bài kiểm tra riêng với lý do và 15 mục hành vi cụ thể, không coi dấu kiểm là kết quả thi.

Đã soạn mới 17 đoạn bổ sung, 32 câu hỏi với bốn lý do theo lựa chọn, và ba sơ đồ SVG/PNG độc lập: so sánh nguyên giá/lãi gộp, vị trí damper trong chụp hút, và đường thoát tránh khói. Sơ đồ đã render và xem, chưa nghiệm thu điện thoại.

Năm điểm nguồn cần xử lý đã được ghi rõ: dùng túi trên mặt có nguy cơ ngạt và không thành hướng dẫn phổ quát; phủ vải lên chảo dầu là biện pháp có điều kiện và nguy cơ thất bại; tần suất tập huấn phải đối chiếu quy định hiện hành; giảm oxy bằng khí không đồng nghĩa với ức chế phản ứng hóa học; lấy tài liệu không được ưu tiên hơn thoát nạn. Mười bốn nguồn công khai của cơ quan chính thức được ghi ngày kiểm tra và URL. Các đoạn hiện hành và câu 372 đã cảnh báo đúng; không cần sửa đè một lời khuyên nguy hiểm đang hiển thị. Nguyên văn/hash kiểm tra được giữ trong gói.

Các ví dụ số lịch sử chỉ dùng để đối chiếu nguồn; không coi là luật hay chỉ tiêu bắt buộc. Bài tập mới dùng số độc lập, đầy đủ dữ kiện, phân biệt chênh lệch điểm phần trăm và thay đổi tương đối. Không sao chép bảng/hình nguồn vào tài sản.

`validate.py` PASS: hash PDF và 33 bản văn, liên kết đủ đơn vị/nghĩa/bổ sung/câu hỏi, cấu trúc bốn lựa chọn và lý do, bốn phép tính độc lập, hash ba cặp SVG/PNG và hash tiếng Nhật đã đóng băng. Còn cần tích hợp, dịch 12 ngôn ngữ và kiểm tra trên thiết bị. Không có xác nhận người bản ngữ hoặc chuyên gia.

Đã rà lại từng mệnh đề của cả 209 bản ghi sau phản biện: thêm đúng đoạn hỗ trợ cho các phát biểu nhiều điều kiện và năm đoạn dạy còn thiếu. Không coi bài toán lợi nhuận là kiểm tra toàn bộ QSCA/H. `unit.assessmentEvidence` ghi rõ các nghĩa được liên kết, đáp án thực sự kiểm tra và phạm vi giới hạn. `fact.assessmentEvidence` giữ các ô dữ liệu hay điều kiện chưa được hỏi riêng. Số liệu trước vòng rà lại bị thay thế; dùng bản `validation.json` hiện hành.

Tái tạo gói cuối bằng `python docs/ssw-workspace/restaurant/source-closure31/operations2/build-figures.py`, tiếp theo `python docs/ssw-workspace/restaurant/source-closure31/operations2/freeze-packet.py`, rồi `validate.py`. Các bước dựng trung gian không phải bản đóng băng.
