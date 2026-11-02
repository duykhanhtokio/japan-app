# Xây dựng — cơ chế nguồn → kiến thức → app v2

## Nguồn và census

Đủ 17 PDF đã được đối chiếu byte/hash và số trang. Hai cặp trùng hoàn toàn được lưu qua alias, còn 15 nguồn/530 trang duy nhất từ 604 trang danh nghĩa. File text1k có source ID riêng vì khác hash; giống chữ chính với text1l không làm mất ảnh, chú thích hoặc bìa khỏi danh mục.

Mọi trang có artifact gzip gồm nguyên các khối chữ/ruby/nhãn nhỏ, vị trí ảnh và đối tượng vector dưới dạng hash/box/metadata; không đưa chữ hay ảnh nguồn vào repository. 115.623 phần tử vật lý là mẫu kiểm kê, không phải mẫu số kiến thức. 580 bằng chứng bài cũ và các ứng viên nối theo trang được giữ dưới dạng liên kết lịch sử/candidate, không tự chuyển thành direct.

## Tự kiểm ngữ nghĩa có giới hạn

Nguồn leader PDF89–100 đã đọc chữ và xem trang; các bảng/ảnh trên89/90/94/99/100 được xem lớn. 71 mục độc lập được ghi trong canonical ledger với điều kiện, ngoại lệ, trạng thái trước/sau và JSON-pointer/hash tới app. Mỗi hàng bảng tham chiếu raster gốc chứa đúng bảng đó; việc cùng tham chiếu một raster không đồng nghĩa đóng cả bảng. Mọi phần tử vẫn giữ pending nơi chưa chứng minh đã kiểm hết nội dung của phần tử.

6 mục đủ bằng chứng dạy/đánh giá ở mức AI; 6 mục về mô hình ý thức/độ tin cậy giữ blocked. Sau tự rà, các đề xuất đóng về tra mức rủi ro, tự phát hiện nguy hiểm, tạo biện pháp và thao tác chỉ tay đã được hạ về partial: hoạt động cùng chủ đề không kiểm hết năng lực đó. Không trang nào được đánh dấu hoàn tất mọi ý, không tính phần trăm nguồn.

Các trạng thái unknown chỉ có nghĩa chưa có mapping được chấp nhận trong phạm vi đã rà, không chứng minh app thiếu kiến thức đó. Phạm vi tự rà ở đây là đoạn và hoạt động cụ thể của 職長016–019; chưa rà hết ngân hàng câu hoặc mọi bài khác. Có 11 liên kết đánh giá chỉ đủ một phần. Locator quản lý/保護具 được sửa về đúng016-c2-p1; riêng chi tiết hạn chế ra vào vẫn partial.

## Nội dung app thực sự thay đổi

017/018/019 thêm 3 hoạt động có kana và 12 ngôn ngữ, giữ 112 đoạn/50 prompt cũ và mọi dịch cũ. Hoạt động017 dùng dữ kiện tự tạo2/3/4 để phân biệt phép cộng9 và phép nhân24, không cấp quyền thao tác thật. Hoạt động018 dạy rõ mục tiêu chất lượng/năng suất/nguyên giá rồi yêu cầu kiểm bằng chứng ngoài ảnh kệ. Hoạt động019 dùng trường hợp cửa nhận hàng/xe đẩy mới để phân biệt quan sát, trọng tâm, biện pháp và mục tiêu hành động.

## Kiểm tra

- Shared canonical validator: PASS 15 nguồn/530 trang, đủ reciprocal page–element–knowledge links và hash bằng chứng hiện tại.
- Authored-data validator: PASS 28 bài/112 đoạn, 10 hoạt động tăng chiều sâu/120 cặp locale hiện có; ba bài001–003 giữ byte.
- Actual KensetsuDayReader host: PASS72 trường hợp3bài×12locale×ngày/đêm, giữ thân bài cũ, ẩn dịch ban đầu, mở đúng locale, cuộn cuối trước hoàn thành, từ chối revision cũ. Đây là host có adapter, không phải browser/native.
- Kiểm riêng bảo toàn: 3 bài cũ sau bỏ phần bổ sung khớp dữ liệu trước sửa; 11 pack chỉ thêm đúng3entry. Kana mới ghép đúng và không để kanji thiếu chú âm.
- So260chuỗi Nhật và bản bỏkana với nguồn chính ở ngưỡng22ký tự:0ứng viên; không thay duyệt bản quyền/ngữ nghĩa.

## Còn mở

Phân rã ngữ nghĩa đầy đủ530trang; 136trang chưa có liên kết trực tiếp ở sổ trước phải được rà vai trò/ý cụ thể. Cần đối chiếu các bảng/hình/đơn vị còn chưa đủ bằng chứng, đầy đủ năng lực2号 ngoài việc dùng lại1号, thực hành/an toàn, hình nhận diện, âm thanh, chuyên môn/bản ngữ/quyền, Expo/native và thời lượng người học. Tất cả cờ chấp nhận ngoài phạm vi kiểm AI giữ false.

Các file nguồn riêng nằm ngoài repo; builder tái tạo được từ directory17PDF đã pin hash. Điều phối lưu từ xa theo đợt và xác minh remote.
