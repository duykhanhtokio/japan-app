# Tuần 2 · 90 ảnh đoạn hoàn chỉnh

Ngày 8–14 có đủ 90 ảnh riêng, lần lượt 11/11/14/12/10/12/20. Giữ nguyên 73 ảnh tuần 1; tổng 163/866 đoạn có ảnh riêng, còn 703 đoạn chờ. Không chứng nhận hoàn tất toàn khóa.

Phục hồi 55 ảnh đã được tạo trong phiên trước và tạo 35 ảnh cho phần còn thiếu. Có 16 sửa có mục tiêu sau kiểm tra: bảy cảnh Onodera, bảy cảnh Morikawa, một cảnh chỉ vai phải và một hình hô hấp. Hai cảnh hộp thư đã sửa để bác vẫn ngồi trong phòng và chỉ hỏi vị trí, chưa đi tới quầy. Bộ cuối không dùng bản sai nhân vật, sai bên hoặc sai nơi. Nhân vật lặp trong tình huống nối tiếp là có chủ ý; 90 tệp có hash riêng, không dùng một tệp chung để tính nhiều đoạn. Prompt gốc của các ảnh phục hồi không có trong dữ liệu tải về, nên metadata để null thay vì dựng lại lịch sử. Các mã provenance chỉ nằm trong hồ sơ soạn thảo.

Ảnh 2D màu do image_gen tạo; không dùng ảnh sách nguồn. Chú thích Việt mô tả cảnh và phần cần xác nhận, không tự thêm kết quả đo/chẩn đoán hoặc thao tác điều trị. Mô hình thần kinh và não chỉ là cảnh học khái niệm, không thay sơ đồ giải phẫu. Hình hô hấp có mũi tên dễ hiểu sai đã thay bằng cảnh trao đổi với đồng hồ chưa dùng. Tất cả WEBP quality90 chỉ mã hóa, không đổi kích thước hoặc cắt ảnh. Registry dùng exact sectionId và tỷ lệ lấy từ kích thước tệp thật. Ảnh mở đầu ngày 8–14 dùng lại summary của ngày tương ứng, không cộng vào 90 ảnh.

Kiểm tra cuối trên actual WeeklyKaigo/RoyalPanels qua RNWeb: 390×844, 768×1024, 844×390; 270 lượt giải mã/đối chiếu kích thước/tỷ lệ/chú thích; 21 kiểm tra chú thích ảnh mở đầu; không tràn ngang, không pageErrors. Có 21 screenshot đã xem. Harness dùng expo-image shim sang RN Image, storage shim; không phải full ExpoRouter hoặc native device. Fonts và Royal assets được lấy từ LFS trước bản build cuối.

Calendar model PASS: 26 tuần, 176 ngày có nội dung, 6 ô trống, 687 câu hỏi, 866 đoạn; bảy runtime JSON giữ nguyên. JLPT approved UI lock 10/10 và whitespace PASS. Validator catalog-art cũ không đạt vì inventory mười cover không bao gồm cover đã thêm trước tuần 2; ghi riêng, không dùng làm bằng chứng PASS. Không chạy full-repo TypeScript và không tuyên bố human/domain/rights/release approval.

Trong quá trình QA, ba WEBP bị phát hiện rỗng; đã khôi phục từ PNG gốc và xác minh cả 90 hash trước khi build/chạy bản cuối. Download Chromium thông thường lỗi archive; môi trường cuối dùng Chromium từ gói @sparticuz/chromium. Các lần lỗi không được tính làm PASS.

Các tệp `runtime-tests/2026-10-11-week2-art/asset-review.json`, `evidence.json`, `executed-browser-check.mjs` chứa danh sách ảnh, hash đầu vào và kết quả từng viewport. Coverage/prompts được cập nhật cùng registry. GitHub persistence phải được xác minh sau publication trước bàn giao; không suy ra durability từ ảnh ở máy cục bộ. Tuần tiếp theo là tuần 3; công việc rà nguồn sâu và source195 ambiguity vẫn còn riêng.
