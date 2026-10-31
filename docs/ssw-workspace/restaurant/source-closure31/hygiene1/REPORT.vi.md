# Vệ sinh nhà hàng 1号 — source closure31

Gói Nhật đã hoàn tất đối chiếu và biên soạn trong phạm vi AI: **45 trang, 91 đơn vị nguồn, 131 mệnh đề kiến thức**. Có **23 đoạn bổ sung**, **22 câu mới với 88 giải thích riêng cho từng lựa chọn**, và **8 hình đã xem pixel thực tế**. Chưa tích hợp vào ứng dụng hoặc xác nhận người bản ngữ/chuyên gia/thiết bị thật.

91 quyết định gồm 42 đơn vị đã có nội dung phù hợp, 45 đơn vị được đáp ứng sau bổ sung và 4 mục tổng hợp có liên kết con/mệnh đề rõ ràng. Không lấy chủ đề hoặc số trang trùng nhau làm bằng chứng đủ nội dung. Mỗi mệnh đề có nguồn trang cụ thể, đoạn dạy hiện có hoặc đoạn bổ sung, cùng câu hỏi chính xác khi phù hợp. Có 113 mệnh đề có liên kết câu hỏi và 18 mệnh đề đã dạy nhưng chưa có câu riêng. Câu hỏi đại diện đánh giá năng lực áp dụng; không tuyên bố kiểm tra riêng 100% mệnh đề.

Đã đọc văn bản của đủ 45 trang và xem đủ 45 trang ảnh qua bảng ảnh; xem chi tiết trang 21, 24, 29, 30 và các biểu mẫu 35–38 sau khi xoay đúng chiều. Trang 30 còn được xem chi tiết ở tỷ lệ 2,5 lần để xác nhận thành phần và cách phân nhóm. Không bỏ qua trang 24 chỉ có hình hoặc các mẫu biểu ít văn bản. Các trang bìa, mục lục, trang chia chương, chỉ mục, lời cảm ơn và quyền sử dụng được phân loại riêng. Không đưa PDF, bản trích xuất hay ảnh nguồn vào Git.

Các bổ sung giải quyết phân loại nguyên nhân, nơi tồn tại và đường lây từng vi sinh vật, xử lý riêng cho khăn/dao/thớt, thứ tự vệ sinh toilet, điều kiện không trực tiếp xử lý thực phẩm khi có triệu chứng, vị trí rửa tay và phạm vi rửa hai lần, nhóm món theo thành phần, thời gian–nhiệt độ có điều kiện, năm cột quy trình và cách đọc/điền biểu mẫu.

Ba điểm nguồn cũ cần phân biệt rõ:

- Ví dụ 75℃/1 phút không được áp dụng như điều kiện riêng cho nhuyễn thể có nguy cơ norovirus; đối chiếu Q&A Bộ Y tế Nhật, điều kiện hướng dẫn là tâm 85–90℃/90 giây trở lên.
- Hết triệu chứng không tự động có nghĩa có thể trở lại công việc trực tiếp chạm thực phẩm; đối chiếu hướng dẫn hiện hành và quyết định của người phụ trách/cơ sở y tế.
- Cách diễn đạt “thêm 1 giờ” trong ví dụ làm nguội của tài liệu không được cộng thành 90 phút. Nguyên bản hướng dẫn bếp ăn số lượng lớn nói tâm khoảng 20℃ trong 30 phút **hoặc** khoảng 10℃ trong 60 phút. FDA Food Code 2022 có điểm bắt đầu 57℃ và tổng thời gian 6 giờ cho nhóm thực phẩm áp dụng; không gọi đó là luật chung của mọi nhà hàng Nhật.

Nguồn cơ quan chính thức, ngày kiểm tra và đoạn áp dụng nằm trong `primaryVerifications`; sai khác nguồn nằm trong `sourceErrata`. Ví dụ phế thải cá nóc được giữ như nội dung tài liệu có giới hạn địa phương/phạm vi công việc, không suy thành giấy phép xử lý cá nóc hoặc quy định quốc gia mới.

Tám hình độc lập gồm sơ đồ đường nhiệt; bảng kế hoạch năm quy trình; ví dụ ghi chép thường/quan trọng; hai bảng tháng đủ 31 ngày; bộ 12 khung thao tác rửa tay; bộ sáu khung món ăn và thành phần. Sáu hình số liệu/biểu mẫu được dựng bằng mã có kiểm soát. Hai bộ tranh dùng công cụ imagegen tích hợp, không cung cấp tranh PDF làm đầu vào. Đã sửa khung chà lòng bàn tay bị sai tư thế, xem lại tranh cuối; tranh món ăn được sửa đúng món đậu phụ Tứ Xuyên sau khi xem chi tiết nguồn. Nhãn bước/quy trình được biên soạn riêng, không tin chữ sinh trong ảnh. Tranh món không chứng minh an toàn chỉ bằng ngoại hình. Hình tháng cần phóng to trên điện thoại; chưa xác nhận giao diện thực tế.

Tệp chính: `packet.json`. `build.py` tái lập các cạnh kiến thức và gói Nhật; `artwork.py` tái lập sáu hình chính xác bằng SVG/PNG; `imagegen-receipt.json` giữ bộ prompt và biên nhận xem/sửa hai tranh. `check.py` kiểm tra nguồn băm, đủ 91 ID, cạnh hai chiều, 4 lựa chọn/4 giải thích, khóa và pixel hash. Kết quả PASS trong `validation.json`. Kiểm thử tự động không thay thế đọc ngữ nghĩa hoặc xem hình.

Chỉ ghi trong thư mục shard và tài sản riêng; không sửa bài/câu cũ, giao diện, ma trận chung hoặc Git commit. Root cần tích hợp các bổ sung theo phiên bản riêng, biên dịch furigana/nhãn dịch, cân lại vị trí đáp án rồi mới chốt dữ liệu dịch. Cờ người/chuyên gia/người bản ngữ/thiết bị thật vẫn false.
