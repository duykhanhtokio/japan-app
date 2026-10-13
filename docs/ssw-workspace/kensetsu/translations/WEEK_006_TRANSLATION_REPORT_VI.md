# Bản dịch Kensetsu — tuần 6

Phạm vi bài 036–042: công trình điều tiết nước và ven nước, đường bộ, đường hầm NATM/đào hở, shield/đẩy ống, cầu, cảng và công trình biển, hạ tầng phối hợp và khôi phục sau thiên tai. Dịch từ bản Nhật của dự án, không cập nhật quy định hoặc thêm hướng dẫn thao tác.

Tuần này có 191 đơn vị nguồn × 12 ngôn ngữ = 2.292 chuỗi, gồm 84 đoạn đầy đủ × 12 = 1.008 bản dịch đoạn. Ngôn ngữ: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl; tiếng Nhật giữ nguyên. Tổng sáu tuần: 42 bài, 1.208 đơn vị nguồn, 14.496 chuỗi, 516 đoạn với 6.192 bản dịch đoạn.

Sáu cặp ngôn ngữ dịch đủ cả tuần rồi đổi người rà soát. Bộ ghép kiểm tra mọi đầu vào với nguồn Nhật hiện tại trước khi ghi bundle và từ chối ghi đè bundle khác nội dung. Nguồn Nhật, revision, khóa hoàn thành, ảnh và bộ 10 đề/200 câu được giữ nguyên.

## Kiểm tra

Rà soát AI độc lập đã đọc đủ 191 đơn vị trong cả 12 ngôn ngữ (2.292 chuỗi), rồi đọc lại các sửa có mục tiêu. Các bản rút gọn được mở rộng thành đoạn văn đầy đủ. Hai bản vá riêng MY039–042 (64 đơn vị) và KM037–042 (97 đơn vị) được kiểm đúng ID nguồn, ghép vào sáu đầu vào chính và rà lại trước khi ghép bundle. Đã sửa các thuật ngữ tuyến kỹ thuật trong hầm, thông số kỹ thuật, phân biệt hệ thống đường sắt với đường ray, lực kích với thiết bị tạo lực, lắp dựng cầu bằng chống tạm, sóng đi vào cảng, vai trò có điều kiện của thợ lặn, cấp đường Nhật Bản, cảnh quan và thiên tai thứ cấp. Danh sách đầy đủ trong manifest.

Ghép và kiểm tra cấu trúc PASS: nguồn/ID chính xác, đủ ngôn ngữ và mọi trường, nguồn bất biến, revision/khóa hoàn thành, loại bỏ overlay khi nguồn đổi và không ảnh hưởng bài khác. Kiểm tra chữ viết bổ sung chặn chữ Hàn lẫn vào bản dịch khi nguồn không có. TypeScript cho adapter/index PASS với khai báo ảnh tối thiểu, không phải build Expo đầy đủ. Bộ 10 đề/200 câu cùng hash nguồn PASS, giữ nguyên.

Trình đọc thực tế trong bộ thích nghi web PASS 7 bài × 12 ngôn ngữ = 84 tổ hợp. Đã kiểm tra các trường hiện có (title, clusterTitles, paragraphs, prompts, keyTerms, illustrationAlt), bật/tắt dịch, giữ Nhật, không tự dùng ngôn ngữ thay thế, hoàn thành thủ công và tải lại; không lỗi JavaScript. Ảnh Nhật–Việt ở 320×568, 768×1024 và 932×430 đã kiểm trực quan, không tràn ngang. Sau khi chỉnh thêm hai trường VI040 cho rõ nghĩa trên màn hình, đã rà độc lập và chạy lại kiểm tra dữ liệu/trình đọc để khớp bản cuối. Build cô lập cảnh báo thiếu expo/tsconfig.base. Bản dịch AI chưa được người bản ngữ hoặc chuyên gia lĩnh vực duyệt. Không dùng dịch vụ/API dịch công cộng. Kiểm tra trình đọc web dùng bộ thích nghi cho React Native, bộ lưu trữ, safe area và lớp trang trí/ảnh; không chứng nhận iOS/Android hoặc mọi bộ chữ. Activity/reflection khi có chưa có vùng hiển thị riêng.

Mốc tiếp theo: tuần 7, bài 043–049; còn 343 bài trong giáo trình 385 bài. Lưu bền vững chỉ được xác nhận sau commit từ xa trên recovery/jlpt-n3-n1.
