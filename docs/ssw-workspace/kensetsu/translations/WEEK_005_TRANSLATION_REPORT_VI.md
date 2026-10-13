# Bản dịch Kensetsu — tuần 5

Phạm vi bài 029–035: nguồn và nơi xả nước, chất lượng nước, cấp nước và phòng cháy, khí đốt/điện, viễn thông và vô tuyến, vật thể cao với an toàn hàng không, đăng ký/điều kiện bay drone, bãi đỗ xe và phối hợp giữa các hệ thống. Đây là bản dịch nguồn Nhật đã có, không cập nhật quy định hoặc thêm hướng dẫn thao tác.

Tuần này có 207 đơn vị nguồn × 12 ngôn ngữ = 2.484 chuỗi, gồm 90 đoạn đầy đủ × 12 = 1.080 bản dịch đoạn. Ngôn ngữ: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl; tiếng Nhật giữ nguyên. Tổng năm tuần: 35 bài, 1.017 đơn vị nguồn, 12.204 chuỗi, 432 đoạn với 5.184 bản dịch đoạn.

Sáu nhóm ngôn ngữ dịch đủ cả tuần rồi đổi người rà soát. Bước ghép kiểm tra đúng bài/ID, nguyên văn Nhật hiện tại và đủ 12 ngôn ngữ trước khi ghi; từ chối ghi đè bản đã có khác nội dung. Giữ nguyên nguồn Nhật, revision học tập, khóa hoàn thành, ảnh, giao diện và 10 đề ôn tập. Ký hiệu khoa học pH có thể được giữ nguyên trong từ khóa; kiểm tra chữ viết cho phép đúng trường hợp này, không nới kiểm tra đoạn văn.

## Kiểm tra

Rà soát AI độc lập đã đối chiếu đủ 207 đơn vị trong cả 12 ngôn ngữ (2.484 chuỗi). Đã sửa các điểm điện áp và mạch đang mang điện, khí sinh ra do cháy, phạm vi thiết bị phòng cháy, cả hai loại bảo vệ cách điện, lựa chọn OR trong điều 339, phủ định dừng/di chuyển, ngày giờ lấy mẫu, mốc đo độ cao, người nhận báo cáo và điều kiện không suy ra quyền bay. Danh sách chi tiết nằm trong manifest.

Ghép dữ liệu và kiểm tra cấu trúc: PASS, gồm exact source/ID, đủ ngôn ngữ, nguồn bất biến, revision/khóa hoàn thành và loại bỏ bản dịch khi nguồn đổi. TypeScript cho adapter/index: PASS với khai báo ảnh tối thiểu, không phải build Expo đầy đủ. Bộ 10 đề/200 câu và hash nguồn: PASS, giữ nguyên.

Trình đọc thực tế trong bộ thích nghi web: PASS 7 bài × 12 ngôn ngữ = 84 tổ hợp. Đã kiểm tra các trường hiện có (title, clusterTitles, paragraphs, prompts, keyTerms, illustrationAlt), bật/tắt dịch, giữ tiếng Nhật, không tự dùng ngôn ngữ thay thế, hoàn thành thủ công và tải lại; không lỗi JavaScript. Ảnh Nhật–Việt ở 320×568, 768×1024 và 932×430 đã kiểm tra trực quan, không tràn ngang. Build cô lập cảnh báo thiếu expo/tsconfig.base. Lưu bền vững chỉ được chốt sau khi commit được xác nhận trên nhánh recovery/jlpt-n3-n1.

Bản dịch AI chưa được người bản ngữ hoặc chuyên gia lĩnh vực duyệt; không dùng dịch vụ dịch công cộng/API dịch lúc chạy. Kiểm tra trình đọc web dùng các bộ thích nghi cho React Native, bộ lưu trữ, safe area và lớp trang trí/ảnh. Chưa chứng nhận iOS/Android hoặc hiển thị mọi bộ chữ. Activity/reflection nếu có chưa có vùng hiển thị riêng.

Mốc tiếp theo: tuần 6, bài 036–042; còn 350 bài trong giáo trình 385 bài.
