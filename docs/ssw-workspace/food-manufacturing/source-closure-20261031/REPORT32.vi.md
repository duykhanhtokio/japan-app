# Thực phẩm — tiếp tục đối chiếu và thực hành hình, 31/10/2026

Checkpoint này tiếp nối9df73ee86; chưa hoàn tất toàn ngành.

## Nội dung đã tích hợp

-8hình tự dựng, mỗi hình có SVG nguồn và WebP, tổng504.296byte WebP. Nguồn kiến thức được đối chiếu trực tiếp với PDF2号 trang4,85,90–93,98–99,109,113. Không sao chép hình nguồn.
- Gắn vào bài037,043,045 theo paragraph và sourceHash: hai tuyến chỉ đạo/báo cáo; cấu trúc tỷ trọng; radar cùng thang đo; xương cá nguyên nhân giả thuyết; tám mẫu quản lý; tiến độ với biên giả định; trục thời gian dừng; trung bình và phạm vi theo nhóm.
- Các dữ liệu và giới hạn của hình là ví dụ học độc lập. Timeline khớp bài hiện có390−20−15=355phút; biểu đồ tiến độ60kg/giờ và±15kg là ví dụ khác, không phải giới hạn vận hành. Không tự lấy công thức/ràng buộc của bài tập làm quy định nhà máy.
- Thêm mở lớn, cuộn ngang/dọc ở bề rộng nguồn cho hình thực hành; giữ các đoạn và bản dịch của sáu hình cũ. Hình mới dùng tiêu đề đoạn đã có furigana và12bản dịch, tránh lặp lại cả thân đoạn cho mỗi hình. Chữ trong ảnh chủ yếu là Nhật và ký hiệu; chưa bản địa hóa mọi nhãn raster.

## Đối chiếu

- Tạo22đơn vị năng lực nhỏ có nguồn, bài/đoạn/hash, hình và liên kết câu phù hợp; không cộng cha/con chồng nhau thành tỷ lệ phủ.
- Ghi thêm8quyết định cho khoảng trống thực hành hình. Sổ381bản ghi hiện còn293chờ rà lại,67phần dạy đã rà,9phần dạy chờ hình,8khoảng trống hình đã rà trong phạm vi,4phần mới còn đối chiếu tiếp. Toàn nguồn vẫn chưa phân rã nguyên tử xong.
- Đọc câu dẫn, bốn lựa chọn, đáp án, lời giải chính và bốn lý do của26câu liên quan QC, công số, năng suất và bảo trì. Tính lại các ví dụ30kg/người-giờ,20+5người-giờ,315phút,90%,50→40kg/người-giờ,6người-giờ chênh lệch,6giờ song song và14người-giờ. Không phát hiện lỗi chặn đáp án; lý do lựa chọn sai thứ4 củaq343có thể giải thích trực tiếp hơn về8người-giờ, giữ làm cải thiện câu chữ chưa thực hiện.
- `question-audit.json` cập nhật đúng26hash đã đọc,822câu khác vẫn pending. Không đánh dấu toàn848câu đã duyệt vì kiểm tra cấu trúc đạt. Không đổi ngân hàng/đáp án/revision/tiến độ người học.

## Kiểm tra

- Đọc lại8hình độc lập và so sánh với năng lực của hình nguồn; không phải duyệt chuyên gia. Kiểm toán học/tổng tỷ trọng/đơn vị/mẫu quản lý và hash/byte/kích thước/tệp nguồn PASS.
- Browser với Reader thật:416trường hợp8hình×13ngôn ngữ×4viewport; ảnh giải mã đúng kích thước;8lần mở lớn có bề rộng ít nhất bằng ảnh nguồn; không lỗi trang hoặc tràn ngang. Adapter QA cho Royal/safe-area/backdrop/localStorage được khai báo. Đây không phải Expo production hoặc máy thật.
- Harness lần đầu bị timeout do trạng thái bật dịch còn giữ khi chuyển giữa nhiều hình cùng bài; sửa khóa fixture để mỗi ca độc lập, rồi chạy lại. Đây là sửa fixture, không thay hành vi lưu của ứng dụng.
- JLPT lock10/10 PASS. TypeScript toàn phạm vi vẫn chưa được chứng nhận; xem typecheck.json của checkpoint trước.

## Phần còn lại

Rà293bản ghi còn mở; hoàn thiện các hình/hoạt động trang phục–PPE, OJT, thiết kế giảm nguy cơ và những năng lực chưa có đánh giá; xử lý18liên kết theo nội dung thực; đọc822câu và từng phương án còn lại; cập nhật dịch/ruby theo nội dung chốt; kiểm tra Expo/thiết bị và thời lượng. Giữ native/domain/human/device/release chưa đạt khi chưa có bằng chứng.
