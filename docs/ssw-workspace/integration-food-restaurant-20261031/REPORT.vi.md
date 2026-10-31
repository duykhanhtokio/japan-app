# Tích hợp Nhà hàng và Sản xuất thực phẩm —31/10/2026

Đã đưa hai ngành vào nhánh ứng dụng recovery/jlpt-n3-n1, đối chiếu đúng các bản nguồn: Nhà hàng8b8f4756281dc2d092348da010a24d46b7a16a70; Thực phẩm e847656988041b8f1c4ab0497b89911ef0e3a090. Bản tích hợp xuất phát từ9bf2d858b2ed318b0bbd80462c3adaefc74ecb32. Không dùng kết quả trên nhánh riêng để khẳng định đã có trên nhánh tích hợp.

## Nội dung người học mở được

| Ngành | Cấp | Ngày/bài học | Câu hỏi | Bản dịch câu/ngôn ngữ |
|---|---|---:|---:|---:|
| Nhà hàng 外食業 |1号/2号|120|984|11.808|
| Sản xuất thực phẩm 飲食料品製造業 |1号/2号|96|848|10.176|

Mỗi cấp có10 đề luyện40 câu; bài kiểm tra tuần được giữ riêng. Giữ nguyên mã bài/câu hỏi, phiên bản, bản dịch, khóa lưu và các tài liệu chuyên ngành của hai nhánh. Bảng đếm là nội dung hiện có, không phải chứng nhận bao phủ hết nguồn.

Màn chọn ngành nay có ánh xạ tuyến rõ ràng cho sáu ngành; không dùng Kaigo làm tuyến dự phòng cho Nhà hàng/Thực phẩm. Hai thẻ mới và route mở được trong cả DEV và bản không-DEV theo yêu cầu tích hợp. Giữ cổng DEV của bốn ngành cũ và khóa những ngành chưa hỗ trợ. Bỏ chặn chuẩn bị ở route Thực phẩm; đây không phải phát hành App Store hoặc xác nhận cài đặt trên máy người dùng.

## Rà lại trên cây mã tích hợp

- Nhà hàng:12 nhóm kiểm tra chuyên biệt đạt sau khi bổ sung đường dẫn phụ thuộc trong môi trường kiểm tra;120 ngày có liên kết hình,75 ngày có phần đọc bổ sung. Kiểm tra trạng thái hook thêm3 trường hợp đạt. Ghi cả lần chạy lỗi môi trường và lần chạy lại trong restaurant-checks.json.
- Thực phẩm:9 nhóm kiểm tra đạt;96 ngày có hình,94 ngày có phần bổ sung. Đối chiếu10.176 bản dịch câu; kiểm tra ruby và hiển thị câu trả lời trước/sau nộp. Xem food-checks.json.
- Luồng ứng dụng thật qua React Test Renderer:28 trường hợp đạt. Thẻ ngành, hai route, hai cấp, vào tuần/ngày, hình, dịch tiếng Việt, hoàn thành/mở lại và16 luồng kiểm tra tuần/đề luyện. Bộ chuyển đổi native/giao diện/lưu trữ/profile/router được khai báo trong harness; giữ JapaneseRuby thực của nhánh tích hợp. Đây không phải browser hoặc thiết bị thật.
- Khôi phục đúng2 PNG gốc của Nhà hàng từ con trỏ LFS, đối chiếu SHA-256 và số byte, không tạo ảnh thay thế.65 tệp ảnh runtime của hai ngành đều giải mã được.59 họ hình Nhà hàng được dựng bằng component;35 sơ đồ ngày học Thực phẩm dùng ảnh WebP. Không cộng các bản định dạng thành nhiều hình kiến thức.
- Bộ kiểm tra Sản xuất đạt lại và khóa JLPT10/10 đạt; không sửa các tệp JLPT khóa hoặc nội dung các ngành hiện hữu.

## Phạm vi hợp nhất và phần chưa nghiệm thu

Nhập các thư mục dữ liệu, component, hình, tài liệu, script, service trạng thái và route riêng của hai ngành; ghép màn chọn ngành vào bản mới nhất. Không thay cấu hình Metro, package hay tối ưu dữ liệu dùng chung bằng phiên bản cũ trên nhánh Thực phẩm: đó không phải phụ thuộc chức năng của hai ngành; không báo đã kiểm thử production Expo/Metro từ các kiểm tra này.

Các biên nhận browser cũ giữ nguyên và chỉ là lịch sử. Browser hiện tại bị chặn trước khi tạo trang do quyền socket; chưa chạy simulator/thiết bị thật, full Expo build, đo thời gian học hoặc nghiệm thu chuyên gia/người bản ngữ. Nhà hàng vẫn có264 đơn vị nguồn phủ một phần và39 mục cấu trúc trong ma trận639 mục; không đổi thành complete chỉ vì tích hợp thành công. Các cờ nghiệm thu còn thiếu của từng ngành được giữ nguyên.

source-plan.json khóa toàn bộ đường dẫn và Git blob của hai bản nguồn. Các khác biệt sau nhập chỉ gồm route Thực phẩm được mở, byte ảnh gốc được khôi phục và chuẩn hóa khoảng trắng cuối dòng ở ba tệp được nhập; nội dung Nhật, câu hỏi và bản dịch không được biên soạn lại trong đợt tích hợp này.
