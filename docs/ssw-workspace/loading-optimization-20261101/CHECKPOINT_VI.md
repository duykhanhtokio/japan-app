# Tối ưu tải app — 2026-11-01

Nhánh recovery/jlpt-n3-n1; nền trước sửa b2eb1999551b78b1b34b6a749ef61366ae7d7a6f.

Thứ tự tải:
1. Khi mở app: font dùng chung, ảnh nền đúng hướng màn hình hiện tại, giao diện điều hướng. Bật Metro inlineRequires và Expo Router asyncRoutes=development.
2. Khi chọn một trong 7 ngành: route nhẹ hiển thị trạng thái chờ trước; import riêng ngành sau hai frame. Có quay lại, hủy tác vụ chưa bắt đầu khi rời trang, thử lại sau lỗi và dùng lại module đã tải thành công.
3. Khi học Nông nghiệp: không nạp đề tuần/đề tổng hợp trên tab học. Chỉ nạp đúng loại đề khi mở tab tương ứng.
4. Khi vào Thực phẩm: không nạp sẵn ngân hàng đề và 12 gói bản dịch. Chỉ tạo dữ liệu đề khi yêu cầu; chỉ đọc bản dịch của ngôn ngữ đang được yêu cầu. Sáu gói authoring bổ sung được tách thành tiếng Nhật, furigana và từng ngôn ngữ cho runtime.
5. Khi xem bản dịch đề Sản xuất: đọc gói ngôn ngữ riêng thay vì khối mock-translations.json 13.78 MiB.
6. Khi vào 特定技能: chỉ làm ấm 11 ảnh khung/nút của selector; không làm ấm HUD game và khung hội thoại. Ảnh nội dung bài vẫn do màn hình sử dụng tải khi hiển thị.

Đo trên host qua trace JSON (không phải tốc độ điện thoại):
- Food adapter lúc evaluate: 22,544,243 → 579,046 byte JSON, 34 → 7 file.
- Lần yêu cầu đầu bản dịch mock Sản xuất (kèm dữ liệu đề cần dùng): 15,503,640 → 1,067,103 byte; không còn đọc monolith 12 ngôn ngữ.
- Thời gian Node ở báo cáo chỉ là số đo phiên đó, không dùng để quảng cáo tốc độ khởi động.

Bảo toàn dữ liệu:
- Các JSON authoring gốc, ID, sourceHash, revision và khóa lưu tiến độ không sửa.
- script split-runtime-locale-packs.py --check xác minh chính xác 40 file runtime sinh từ nguồn; tái sinh bằng cùng script không có --check.
- Đối chiếu trước/sau: 1.152 cặp bài-ngôn ngữ Thực phẩm, toàn bộ câu hỏi/tên đề Thực phẩm và 5.280 cặp câu mock cơ khí-ngôn ngữ Sản xuất trùng nhau.
- Bộ kiểm tra Node-only Thực phẩm: 10.176 bản dịch câu hỏi hợp lệ, 10.176 stale bị chặn, 432 tên đề hợp lệ.
- Bộ kiểm tra Sản xuất và Nông nghiệp đạt. Historical loader projection Sản xuất được mở rộng theo đúng SHA mới và tái dựng nguyên byte tiền nhiệm; không bỏ qua kiểm tra lịch sử.
- Kiểm tra liên kết/bundle bằng esbuild của 7 reader/dữ liệu đạt, các gói nền tảng để external; không tương đương full Metro/native export.
- TypeScript kiểm riêng helper, suy luận props, adapter Food và Agriculture đạt với platform type stubs; không phải full-app typecheck.
- Browser helper: đạt chờ/trở lại/cache/thử lại/hủy trước import. Browser Food: 16 trường hợp, 2 cấp, sáng/tối, 4 kích thước, dịch Việt và lưu/khôi phục đạt. Bộ smoke cũ đếm đúng số ruby cố định đã lỗi thời do companion paragraphs; bản chạy phiên này đếm đủ số ruby gốc và chấp nhận các khối ruby bổ sung, vẫn kiểm nội dung gốc/overflow/lưu tiến độ.
- Metro inlineRequires plugin thực được kiểm deferred require; merge option giữ các option trước. Kiểm bảo vệ điều hướng 180ms/state/latest-intent đạt qua cùng fixture, dùng esbuild transpile do runtime host TypeScript 7 không có transpileModule.
- JLPT UI lock: 10/10 đạt; không đổi giao diện JLPT đã khóa.

Giới hạn:
- Native production vẫn chứa toàn bộ nội dung offline trong app; deferred evaluation không đồng nghĩa chia tải mạng cho native release. Expo async route trong commit này chỉ bật ở development.
- Chưa chạy full Expo/Metro export hoặc đo khởi động iPhone/Android thật. Lần đầu mở route trong Expo vẫn có thời gian biên dịch, các lần sau dùng cache.
- Khối dữ liệu của một số ngành như Kaigo/Kensetsu vẫn còn các module gộp lớn khi ngành đó thực sự được sử dụng; commit này không chứng nhận toàn bộ nội dung đã chia tới từng ngày.

Sau pull, dừng Metro cũ rồi chạy npx expo start -c để áp dụng cấu hình mới.
