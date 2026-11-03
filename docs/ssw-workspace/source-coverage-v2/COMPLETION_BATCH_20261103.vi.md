# Tokutei — đợt đối chiếu và sửa thực tế 03/11/2026

Đã tiếp tục trên nhánh recovery/jlpt-n3-n1, bảo toàn các commit Hội thoại được đẩy đồng thời. Sổ chuẩn từng ngành là nguồn trạng thái; các tổng bên dưới chỉ mô tả danh mục hiện có, chưa phải toàn bộ kiến thức nguồn.

| Ngành | covered_ai trước → sau | Kết quả đợt này |
|---|---:|---|
| Nông nghiệp |112 → 121|Ba nhóm cây giống/ghép/quan sát; sửa lời giải Nhật q25 và revision đề, giữ ID/câu khác.|
| Sản xuất |113 → 121|Ba câu bổ sung, 36 cặp locale; tái dùng ba đánh giá phù hợp, kiểm runtime và chặn revision cũ.|
| Thực phẩm |114 → 117|Ba ý về dấu hiệu biểu đồ và tiêu chuẩn ghi checksheet, có ánh xạ chính xác.|
| Nhà hàng |55 → 56|Sửa 96 trường giải thích/12 ngôn ngữ; thêm dạy và câu kiểm thời điểm trao coupon khi thanh toán.|
| Khách sạn |165 → 175|Ba nhóm lễ tân và câu kiểm cửa thoát hiểm/đường sơ tán; sửa hai cụm phồn thể, năm span furigana; 456/456 cặp dịch đúng revision.|
| Xây dựng |72 → 72|Không thêm tuyên bố đóng nguồn. Bộ kiểm phạm vi còn lỗi giả định ngày học cũ.|
| Điều dưỡng |66 → 66|Chặn bản dịch lệch Nhật cho 22 hoạt động × 12 locale; 1.377 phép thử dữ liệu sai và host 12 locale.|

Tăng 31 ý, hiện 728 covered_ai; 3.038 đơn vị đã biết còn mở. Tất cả mẫu số nguồn còn mở, tỷ lệ bao phủ toàn nguồn vẫn null. Bốn ý compound Thực phẩm, bốn ý consent Kaigo và bảy blocker Xây dựng không được hợp thức hóa bằng hash hay số đếm.

Kiểm chung: bảy sổ chuẩn đạt; 30 ca đối kháng coverage đạt; snapshot report isolation đạt; 32 region artifact/508.877 element không có payload PDF thô; khóa JLPT 10/10 đạt. Kiểm host Điều dưỡng đã cập nhật theo lịch hiện hành: 176 ngày, 902 section, tiếng Nhật trước/dịch theo thao tác, lưu thành công/lỗi lưu, giữ đoạn gốc. Fixture này không chứng minh pixel hay thiết bị thật. Kiểm source-scope Xây dựng còn thất bại ở giả định có tile ngày24 độc lập sau khi gộp ngày; không ghi PASS. Nhật ký và receipt tích hợp đi kèm.

Đã xem mẫu năm hình hiện có (tỉa cây, vai trò buff, chuỗi biểu đồ, rửa tay, giao tuyến vận chuyển), không suy ra nghiệm thu toàn ảnh hoặc bố cục thiết bị. Chưa chạy export Expo toàn app trong môi trường này, chưa đo khởi động/chuyển mục, chưa kiểm iOS/Android thật, thời lượng người học hay duyệt chuyên môn/bản ngữ. Dữ liệu runtime được sửa không đồng nghĩa đã cập nhật clone Mac của người dùng.

Tiếp tục từ từng sổ chuẩn và receipt ngành. Kiểm nguồn → app và app → nguồn còn mở trên toàn bộ kho; dùng các audit reverse-binding để ưu tiên, không xem số trường chưa gắn trực tiếp là số kiến thức bị thiếu. Chốt Nhật trước, cập nhật mọi phụ thuộc bị ảnh hưởng; không thay review hash để che bản dịch hoặc đánh giá chưa xác minh. Bản ghi này chưa phải nghiệm thu phát hành.

Đính chính phạm vi: âm thanh không phải tiêu chí bắt buộc của Tokutei theo xác nhận của người dùng. Nội dung runtime đã tích hợp trong commit b91265dc; đồng bộ Git trên Mac và khởi động lại Metro để test, không suy đã cài lên thiết bị từ trạng thái remote.
