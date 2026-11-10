# Sửa khối lượng ngày học và minh họa Xây dựng —2026-10-31

Đã sửa lịch và bộ đọc thực tế. Giữ nguyên484ID bài nguồn, toàn bộ đoạn Nhật, bản dịch và ngân hàng câu hỏi. Những bổ sung ngắn cùng đối tượng/công đoạn được ghép thành ngày chủ đề; không kéo dài bằng cách viết lại hay lặp bài nền.

- Thực hành kiến trúc:163→128ngày; dân dụng:152→123ngày. Học khoa161, thực hành hạ tầng224, tổ trưởng28bài giữ nguyên. Các cấp/mảng dùng chung dữ liệu nhưng lưu tiến độ riêng.
- Tổng440ID ngày học riêng;2.000lượt ngày theo cấp/mảng. Thân bài ngắn nhất84→347ký tự, trung vị688→742. Đây là lượng nội dung, chưa đo phút học.
- Không còn tuần8ngày; mỗi tuần tối đa7ngày. Bộ đọc của một ngày ghép hiển thị nguyên các cụm Nhật và bản dịch gốc, kèm nguồn gốc được giữ ở dữ liệu.
- Giữ hoàn thành theo từng ID/revision/phạm vi gốc. Ngày ghép chỉ hoàn thành khi đủ các thành viên; kết thúc ngày ghi đúng các khóa gốc. Lịch sử đã học không bị xóa, và thành viên đã học không tự hoàn thành thành viên chưa học. Vị trí đọc cũ được chuyển bằng ID về ngày chủ đề, không lấy số thứ tự ngày để đoán. `day-migration.json` ghi vị trí cũ/mới và các khóa hoàn thành.
-111hình kỹ thuật mới bằng hình học có kiểm soát,5cảnh minh họa mới và1ảnh nóng/điều kiện làm việc cũ được liên kết lại đúng chủ đề. Các hình thể hiện bộ phận, cấu tạo, vị trí và cơ chế; không lấy khối chữ làm ảnh. Cả440ngày đều có ảnh mục tiêu đủ byte và đăng ký hiển thị;2.000liên kết ngày/cấp/mảng được ghi ở `daily-visual-bindings.json`. Hình cũ phù hợp được giữ, hình dạng thẻ chữ không được tính cho yêu cầu tối thiểu.
- Có thể phóng hình lên ít nhất900pixel và kéo ngang để đọc nhãn trên điện thoại; giữ tỷ lệ và khả năng xem toàn hình. Năm cảnh dùng bảnWebP để tải trong bài; nguồnPNG được giữ riêng theo hồ sơ tạo ảnh.

Kiểm tra đạt:2.128lượt thành viên nguồn không mất/trùng;239.304cặp đoạn-bản dịch giữ nguyên;8.126liên kết nguồn câu hỏi còn mở được từ lịch ngày mới;kiểu dữ liệu giới hạn phạm vi;15trường hợp bộ đọc thật trongChromium/RNWeb trên390×844,844×390,768×1024, bật dịch, ảnh thật, phóng/kéo/đóng và hoàn thành sau đọc cuối bài. AdapterRoyal/nền/safearea/storage được ghi rõ;không gọi đây làExpo sản xuất hoặc thiết bị thật.

Việc chọn độ phù hợp là quyết định của AI biên soạn trong phạm vi này, không có kiểm tra nội dung chéo hay chứng nhận chuyên môn/bản ngữ. Nhãn bên trong hình bằng Nhật. Chú thích/alt hiển thị dùng nguyên tiêu đề Nhật của bài nguồn và đủ12bản dịch đã có; các ghi chú Nhật mới về thiết kế/phạm vi hình chỉ nằm ở hồ sơ biên soạn. Các bản dịch bài học gốc không thay đổi. Không sửa luật, điều kiện kỹ thuật, phương pháp thi công, giá trị an toàn hay ngưỡng số để cân đối lượng học. Hình là minh họa có giới hạn, không tự cấp phép thao tác từ hình.
