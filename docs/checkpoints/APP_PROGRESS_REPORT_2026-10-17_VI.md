Báo cáo tiến độ Japan App — kiểm kê ngày 17/10/2026

Báo cáo này đối chiếu dữ liệu đang được app nạp, registry thực thi và kết quả kiểm tra. “Đủ số lượng dữ liệu”, “đạt kiểm tra kỹ thuật” và “sẵn sàng phát hành” là ba trạng thái khác nhau. Toàn bộ app chưa hoàn tất để phát hành; không có cơ sở quy đổi tiến độ chung thành một tỷ lệ phần trăm.

Phần vừa xử lý trong phiên

- Rà 4.018 đoạn Nhật đang dùng của 454 bản ghi bài học xây dựng với 13 PDF nguồn, tổng 387 trang. Kiểm tra chuỗi trùng từ 22 ký tự chuẩn hóa tìm được hai ứng viên. Giữ tên kỹ thuật chuẩn của PF管; viết lại độc lập một đoạn về dụng cụ cốp pha và cập nhật trực tiếp từ Nhật sang đủ 12 ngôn ngữ. Không thêm câu hỏi trùng hoặc kiến thức để tăng số lượng.
- Cập nhật hash tham chiếu nguồn của câu hỏi liên quan; giữ nguyên câu hỏi, lựa chọn, đáp án, ID đề, phiên bản bài làm và dấu hoàn thành. Thay đổi chỉ về cách diễn đạt.
- Kiểm tra hiển thị bản mới trong Chromium ở cả 建築 và 土木: hai tuyến, sáu đoạn Nhật và sáu bản dịch Việt. Kiểm tra host của toàn bộ phần bổ sung đạt 1.944 lượt đoạn dịch ở 12 ngôn ngữ.
- Sửa bộ fixture kiểm tra Kaigo bị lệch sau khi API đề Tokutei chuyển sang phân chia phạm vi. Chạy lại kiểm kê bản dịch tuần và đề; sửa báo cáo đề cũ còn ghi 0/144 thành kết quả hiện hành 144/144.
- Sửa lỗi TS2352 ở chỉ mục hội thoại: các mục cũ thiếu trường loại tình huống được bổ sung từ dữ liệu kịch bản hiệu lực. Giữ nguyên các trường đã có, kể cả giá trị null có chủ ý. Kiểm tra kiểu dữ liệu riêng mô-đun hội thoại và dữ liệu xây dựng đạt; không gọi đây là kiểm tra toàn bộ bản build Expo.

Tình trạng từng mô-đun

| Phần | Dữ liệu/xử lý hiện có | Còn thiếu hoặc chưa được xác nhận |
|---|---|---|
| JLPT mới | Đủ 30/30 đề: sáu đề mỗi N5–N1; 3.018 câu tính điểm; 30 khóa lưu độc lập; thực thi registry xác nhận đủ. | Chưa kiểm lại toàn bộ nghe thực tế, phát âm và thao tác trên bản cài iOS/Android trong phiên này; chưa có duyệt bản ngữ/quyền/phát hành toàn bộ. |
| JLPT cũ | Giữ các đề và tài nguyên lịch sử; registry đang nạp chung 88 đề có cấu trúc, gồm cả 30 đề mới. | 88 là số đăng ký có cấu trúc hiệu lực, không phải tổng mọi mục lịch sử/pending. Không dùng bộ kiểm danh mục cũ để suy ra số đề mới. |
| Hội thoại theo địa phương | 7.128/7.128 kịch bản, 814 địa phương có dữ liệu, 78.408 lượt; tất cả 11 lượt và NPC kết thúc. Không có nhóm câu trả lời Player trùng sau chuẩn hóa. Checkpoint Okinawa ghi hoàn tất bản Nhật toàn bộ 47 tỉnh. | Bản dịch toàn bộ hội thoại chưa bắt đầu; kiểm tra ngữ nghĩa, bản ngữ, chính sách địa điểm, hình ảnh và thiết bị chưa được xác nhận hoàn tất. NPC kết thúc không tự chứng minh mọi lời kết đều đã được duyệt ngữ nghĩa. |
| Hội thoại công việc riêng | Mô-đun cũ riêng có hai tình huống mẫu về cốt thép và trồng trọt, mỗi tình huống tám node; có cơ chế định tuyến ngành. | Không tính hai mẫu này là một giáo trình công việc hoàn chỉnh hay nhập chung với 7.128 kịch bản theo địa phương. Chưa đủ tình huống chuyên biệt cho các nhóm nghề. |
| Kaigo học | 26 tuần, 176 bài theo ngày; 866 mục nội dung và 5.372 bản ghi đoạn Nhật trong phạm vi lịch đã chốt. | Số đoạn có lặp thuật ngữ/ngữ cảnh, không phải số ý nguồn độc nhất. Chưa chứng nhận bao phủ mọi ý của nguồn hoặc thời gian học thực tế 30 phút. |
| Kaigo kiểm tra | 687 câu kiểm tra theo tuần; 12 đề đầy đủ gồm sáu đề kỹ năng ×45 câu và sáu đề tiếng Nhật ×15 câu, tổng 360 câu của bộ đề. | Chưa có duyệt chuyên môn/bản ngữ và nghiệm thu thiết bị thật toàn bộ. Không suy tổng số ý kiến thức từ số câu. |
| Kaigo bản dịch | 312/312 cặp tuần-ngôn ngữ và 144/144 cặp đề-ngôn ngữ: đủ 12 ngôn ngữ đích. Kiểm tra hash và liên kết nguồn Nhật đạt. | Đây là dữ liệu dịch AI hoàn tất trong phạm vi đã chốt, chưa phải 12 ngôn ngữ đã được người bản ngữ duyệt. |
| Kaigo hình | Báo cáo thay ảnh xác nhận 16 ảnh mới nhãn Nhật, giữ khóa hình; không còn nhãn Việt/Anh đang chờ thay trong nhóm yêu cầu. Lịch có 176 phân bổ hình theo ngày. | Chưa nghiệm thu chuyên môn và hiển thị mọi ảnh trên thiết bị thật. Phân bổ hình không có nghĩa mỗi ngày có một ảnh độc nhất. |
| Từ vựng học JLPT | 8.350 mục; 8.350 nghĩa Việt; 6.506 nghĩa Anh; 298 mục có ví dụ Nhật ngay trong dữ liệu từ vựng. | Còn 1.844 mục thiếu nghĩa Anh và 8.052 mục chưa có ví dụ Nhật trong bộ này. Không có trường nghĩa đa ngôn ngữ bổ sung trong các bản ghi đã kiểm. Chưa thể nói toàn bộ từ đã đủ ví dụ/furigana/romaji/giọng đọc và mọi ngôn ngữ. |
| Ngữ pháp | 540 mẫu hiệu lực; mỗi ngôn ngữ hỗ trợ có đủ 540 trường nghĩa, gồm Nhật và 12 ngôn ngữ hỗ trợ. | Kiểm kê đủ trường nghĩa chưa xác nhận toàn bộ sắc thái, ví dụ, cách đọc và chất lượng bản ngữ. |
| JMdict | Đã có màn hình, bộ truy vấn và tệp DB được quản lý bằng Git LFS, kích thước đối tượng ghi nhận 100.143.104 byte. | DB chưa được tải vào checkout gọn này để mở và đếm mục. Không kết luận thiếu DB trong dự án, cũng không đoán số mục hoặc gọi 8.350 từ JLPT là toàn bộ JMdict. |
| HUD/bản đồ/nền/Back | Có các thành phần dùng chung, sửa cover/responsive và các bằng chứng web theo từng phần; khóa giao diện JLPT đạt 10/10. | Chưa có kiểm tra thiết bị thật hiện hành đủ để đóng toàn bộ phản ánh chậm/đơ/khởi động, khoảng hở hình hoặc nháy màn hình. Kiểm tra từng phần không thay cho chạy toàn bộ app. |
| Credit/EXP/xếp hạng | Mã nguồn có sức chứa 100, phí đề 10, phí hội thoại 5, yêu cầu ≥80% và sáu đề khác nhau để đạt cấp; chống ghi nhận trùng bằng ID. | Chưa chứng minh luồng hoàn credit đã được nối và nghiệm thu với nhà cung cấp quảng cáo thật; API hoàn credit hiện có chưa đồng nghĩa quảng cáo đã hoạt động. |
| Các nhánh Tokutei khác | Trang chọn có Nông nghiệp, Nhà hàng, Sản xuất thực phẩm, Khách sạn bên cạnh Kaigo và Xây dựng. | Bốn nhánh này đang bị khóa ở trang chọn. Kaigo/Xây dựng chỉ mở kiểm tra nội bộ khi __DEV__; chưa phải nội dung đã phát hành sản xuất. |

Chi tiết 建設1号

| Phạm vi | Bài học đang hiển thị | Đề kiểm tra |
|---|---:|---:|
| 学科 dùng chung ba nhánh | 161 | 10 đề ×40 câu, cùng một ngân hàng được dùng lại |
| 実技 ライフライン・設備 | 224 | 10 đề ×40 câu |
| 実技 建築 | 162 | 10 đề ×40 câu |
| 実技 土木 | 151 | 10 đề ×40 câu |

Không cộng số bài của các nhánh để suy ra số bài độc lập: có 454 bản ghi học hiệu lực toàn cục, gồm nội dung dùng lại. Các phần bổ sung có 69 mục, 162 đoạn Nhật, đủ 12 bản dịch và 69 sơ đồ khái niệm. Câu hỏi dùng chung cũng được tham chiếu lại; sáu màn hình đề ×400 không có nghĩa 2.400 câu hoàn toàn độc lập.

Đúng phạm vi nguồn: 学科1–4 chung cho cả ba nhánh; 実技5l/6l/7l dành cho ライフライン・設備; phần khác biệt 建築 dùng5k/6k/7k, 土木 dùng5d/6d/7d. Nội dung chung được dùng lại bằng ID, không soạn hay dịch lại chỉ để lấp lịch.

Các bằng chứng kỹ thuật đã có: 60 tuyến đề trên Chromium, 2.400 lượt câu hỏi, 9.600 nhãn lựa chọn, 60 lần tải lại giữa bài; kiểm lỗi lưu/đọc, hủy nộp, làm lại và khôi phục kết quả. Có 101 tuyến bài đọc đã kiểm và 36 ảnh chụp theo ba khổ màn hình; sau sửa diễn đạt có kiểm bổ sung hai tuyến liên quan. Bộ kiểm host kiểm tra đủ 12 ngôn ngữ và giữ 844 đầu vào gốc. Các kiểm tra Chromium có adapter hình/Royal/storage/safe-area, không phải bản Expo sản xuất hoặc thiết bị thật.

Các mục 建設1号 vẫn mở:

1. Đối chiếu từng ý, số liệu, điều kiện và nhãn hình của toàn bộ nguồn. Đã có liên kết cho 370 trang nội dung; 17 trang còn lại là bìa/mục lục. Liên kết trang không chứng minh đã dạy hết mọi ý; chưa có mẫu số kiến thức đầy đủ để báo phần trăm.
2. Hoàn thiện bộ hình nhận dạng vật lý của dụng cụ/thiết bị. 69 sơ đồ khái niệm chưa thay thế được toàn bộ bộ nhận dạng này.
3. Duyệt chuyên môn xây dựng/an toàn, bản ngữ và quyền. Rà chuỗi chữ chỉ là bước sàng lọc của AI, không thay cho các duyệt này.
4. Kiểm toàn bộ luồng trên bản build sản xuất và iOS/Android thật, gồm phóng chữ, hình, dịch và lưu trạng thái.

建設2号 có nguồn riêng JAC 131 trang, bản15/01/2025 đã kiểm kê; chưa hoàn thiện giáo trình chuyên sâu hoặc đề2号. Đang giữ hoãn theo phạm vi1号trước. Không đổi nhãn bài1号thành2号để báo hoàn tất.

Lịch Kaigo26tuần có182ô lịch nhưng176buổi học;6ô không có bài không phải6bài bị thiếu. Mốc30phút/ngày là dự kiến, chưa đo thời gian học thực tế.

Chi tiết số lượng theo JLPT

| Cấp | Đề mới | Câu tính điểm | Từ vựng trong bộ học | Mẫu ngữ pháp |
|---|---:|---:|---:|---:|
| N5 | 6 | 546 | 909 | 86 |
| N4 | 6 | 588 | 804 | 106 |
| N3 | 6 | 612 | 1.716 | 94 |
| N2 | 6 | 636 | 3.078 | 105 |
| N1 | 6 | 636 | 1.843 | 149 |
| Tổng | 30 | 3.018 | 8.350 | 540 |

Ngôn ngữ đang kiểm kê: Nhật là bản chính;12ngôn ngữ hỗ trợ gồm Việt, Anh, Indonesia, Trung giản thể, Trung phồn thể, Hindi, Bengali, Nepal, Myanmar, Thái, Khmer và Filipino/Tagalog. Mức hoàn tất khác nhau theo mô-đun: Kaigo và nội dung xây dựng đã đủ dữ liệu dịch; hội thoại theo địa phương chưa có bộ dịch toàn cục; từ vựng chưa đủ tương đương.

Thứ tự công việc còn lại

- Với 建設1号: chốt đối chiếu từng ý nguồn và bộ hình nhận dạng, rồi thực hiện các duyệt và nghiệm thu thiết bị còn thiếu. Không tạo thêm đề để tăng chỉ tiêu vì ngân hàng hiện đã đủ10×40cho mỗi phạm vi.
- Với phần học chung: hoàn thiện ví dụ/ngôn ngữ từ vựng, dịch hội thoại và mở rộng các tình huống công việc thực sự còn thiếu.
- Sau khi kết thúc phạm vi1号theo yêu cầu: tiếp tục2号bằng nguồn riêng và từng mục tiêu năng lực đã đối chiếu.
- Trước phát hành: chạy full build/router trên checkout có đủ LFS, kiểm hiệu năng/khởi động/iOS/Android, nghe thực tế và tích hợp quảng cáo; giữ các cờ duyệt chưa có bằng chứng ở trạng thái chưa đạt.

Bằng chứng kiểm kê và kiểm tra của báo cáo nằm trong docs/checkpoints/app-progress-2026-10-17/. Dữ liệu nguồn PDF, OCR và ảnh tài liệu không được chép vào app hoặc hồ sơ công khai này.
