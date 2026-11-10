# Đối chiếu nguồn vệ sinh cấp2

Đã đọc văn bản42trang và xem bản dựng42trang trong7tờ tổng quan; xem riêng trang6,17,30,39,40 và phóng to phần cuối biểu mẫu trang40. Bản PDF, văn bản trích xuất và hình trang nguồn nằm ngoài Git. SHA nguồn được đối chiếu với source-lock; nguồn có42trang. Tài liệu phát hành tháng12/2023, không phải bản xác nhận pháp luật hiện hành.

Packet đóng băng có192đơn vị:43đối chiếu nội dung hiện có,101đơn vị có bổ sung câu hỏi/giải thích và48đơn vị tổng hợp có danh sách con cụ thể. Không chuyển các mục tổng hợp thành tuyên bố mọi chi tiết đã được thi.310mệnh đề được gắn nguồn, đoạn dạy, bổ sung và câu hỏi;4cặp trùng nghĩa được hợp nhất bằng alias.18đoạn tiếng Nhật mới dùng ID bài gốc, không đổi sourceHash của bài.47câu mới có4lựa chọn, một đáp án và4lý do riêng; các câu tính toán nêu đủ dữ kiện.

Hai trục học và đánh giá được tách rõ.229mệnh đề có kiểm tra trực tiếp hoặc đại diện được ghi nhận;81mệnh đề được dạy nhưng chưa kiểm tra từng chi tiết riêng. `testedFactIds` là phạm vi thực sự kiểm tra; `relatedFactIds` chỉ là ngữ cảnh. Không suy ra toàn bộ bảng hay từng mốc năm đã được kiểm tra từ một câu đọc biểu đồ. Danh sách81mệnh đề có trong assessmentSummary.

Nội dung đã có trong22bài vệ sinh, phần bổ sung completion30 và các câu hỏi nguồn được đọc lại. Một bản nháp về tính chất nước thải đã bỏ vì đoạn detail-waste-routing hiện có đã dạy đúng nội dung. Những liên kết không đủ chính xác đã sửa: thời điểm ăn sau giao hàng được bổ sung riêng, quy trình xử lý dụng cụ dùng đoạn dạy thực sự có bước làm khô và bảo quản. Các bản ghi liên kết câu theo chủ đề rộng chỉ ở relatedAssessmentEvidence, không được coi là kiểm tra từng mệnh đề.

Các điểm thời gian và điều kiện được phân biệt:

- Bảng dị ứng2023 được giữ như tư liệu lịch sử. Nguồn chính thức CAA2026 xác nhận chuyển hạt điều sang nhóm bắt buộc, thời gian chuyển tiếp đến31/03/2028 và bổ sung hồ trăn vào nhóm khuyến nghị. Có giải thích và câu kiểm tra riêng.
- Quy định hiện hành về cung cấp thông tin của sản phẩm thông thường được phân biệt với nhánh thực phẩm chuyên biệt; không biến mọi phản ánh thành cùng một nghĩa vụ khai báo.
- Các ví dụ nhiệt độ theo loại thực phẩm và quy trình được nêu đúng bối cảnh. Không áp15–25°C cho salad cần bảo quản lạnh; không coi khoảng2cm là ranh giới khe hở an toàn.
- Thống kê2003–2022 lấy đúng20dòng tổng số từ bảng MHLW2022, không cộng các dòng nội số một người. Không đoán giá trị từ pixel của biểu đồ. Biểu đồ nguyên nhân giữ tỷ lệ làm tròn của nguồn và ghi rõ mẫu số là số vụ.

Có4loại thông tin loại trừ được giải thích rõ trong sourceExclusions: quy định chuyển tiếp về người đã được chọn trong tài liệu cũ; thời gian3–4giờ sau xông thuốc không áp dụng chung cho mọi sản phẩm; các trị số quy chuẩn nước chế biến không được trang nguồn cung cấp; học thuộc điểm cố định của biểu mẫu tham khảo. Năng lực chọn điều kiện áp dụng, hỏi đúng cơ quan, dùng biểu mẫu và tính mẫu số đã có giải thích/câu hỏi. Đây không phải loại bỏ cả đơn vị để tăng tỷ lệ.

5hình độc lập được dựng và xem pixel: chuỗi thống kê hai trục, tỷ lệ nguyên nhân trên một thang chung, khe quanh ống, phạm vi tường1m và bài tập biểu mẫu3hàng. Hai nhãn/chi tiết hình đã sửa sau xem pixel: độ lớn chú giải đồ thị và đường kích thước khe trỏ đúng khoảng mở; chữ trên hình tường không bị chân bàn che. Biểu mẫu có40hàng dẫn tới kiến thức đã dạy, có nhận diện trường đầu/cuối; bài tập dùng điểm giả định để tránh tuyên bố điểm chính thức. Hình chỉ dùng khi dạy, không dùng như hình câu hỏi tiết lộ đáp án.

Chạy `python .../hygiene2/validate.py` kiểm tra ID, đủ192đơn vị/42trang, hash nguồn và PNG, kích thước ảnh, liên kết bài/đoạn, dữ kiện tính toán, phạm vi câu hỏi,40hàng biểu mẫu và cờ nghiệm thu. Đây là kiểm tra cấu trúc kết hợp biên nhận đọc nguồn của AI, không phải chứng nhận chuyên gia, người bản ngữ, trình duyệt hay thiết bị thật. Dịch thuật và tích hợp runtime do luồng gốc thực hiện sau đóng băng.
