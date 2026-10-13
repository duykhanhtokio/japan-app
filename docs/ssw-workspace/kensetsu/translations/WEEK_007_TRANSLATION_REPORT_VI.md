# Bản dịch Kensetsu — tuần 7

Phạm vi bài 043–049: công năng và kết cấu nhà, công trình tạm và khảo sát đất, cọc/đào đất/thoát nước, kết cấu chịu lực và các nghề liên quan, hoàn thiện, ba cách bảo vệ trước động đất, bảo trì/cải tạo và vật liệu hiện có. Dịch từ bản Nhật của dự án, không cập nhật quy định hoặc thêm hướng dẫn thao tác.

Tuần này có 191 đơn vị nguồn × 12 ngôn ngữ = 2.292 chuỗi, gồm 84 đoạn đầy đủ × 12 = 1.008 bản dịch đoạn. Ngôn ngữ: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl; tiếng Nhật giữ nguyên. Tổng bảy tuần: 49 bài, 1.399 đơn vị nguồn, 16.788 chuỗi, 600 đoạn với 7.200 bản dịch đoạn.

Sáu cặp ngôn ngữ dịch cả tuần bằng văn xuôi đầy đủ rồi đổi người rà soát. Bản dịch phải giữ từng mệnh đề, danh từ kỹ thuật, điều kiện, phủ định và giới hạn vai trò; không thay đoạn bằng ghi chú hoặc tóm tắt. Bộ ghép kiểm tra mọi đầu vào với nguồn Nhật hiện tại trước khi ghi bundle và từ chối ghi đè bundle khác nội dung. Nguồn Nhật, revision, khóa hoàn thành, ảnh và bộ 10 đề/200 câu được giữ nguyên.

## Kiểm tra

Rà soát AI độc lập đã đọc đủ 191 đơn vị trong cả 12 ngôn ngữ (2.292 chuỗi), gồm từng đoạn, prompt, tiêu đề, thuật ngữ và alt; đọc lại các sửa có mục tiêu. Các bản rút gọn được thay bằng văn xuôi đầy đủ. Ba bản vá theo session/ID được kiểm và ghép trước rà cuối: MY191 đơn vị, HI116 đơn vị, NE114 đơn vị. Các trường HI/NE ngoài phạm vi sửa và toàn bộ nguồn Nhật được giữ nguyên; ghép MY giữ nguyên BN.

Đã khôi phục các ý bị thiếu về xếp block, rào phân khu, thông tin cấu trúc cũ/ống chôn, từng lượng đất, underground/aboveground, cửa và cửa sổ, mục tiêu giảm chấn, “không nhất thiết giống”, trạng thái nền, vai trò chuyên trách và các danh từ chống thấm/cải tạo. Đã giữ đúng S/RC/SRC, Shindo 5 mạnh/6 mạnh–7 là cường độ rung Nhật (không magnitude), độ ngàm cọc, dưỡng hộ, ba tầng chỉ là ví dụ, curtain wall, amiăng và neo sau khi bê tông cứng. Danh sách đầy đủ trong manifest.

Ghép và kiểm tra cấu trúc PASS: nguồn/ID chính xác, đủ ngôn ngữ/mọi trường, nguồn bất biến, revision/khóa hoàn thành, loại bỏ overlay khi nguồn đổi, không ảnh hưởng bài khác và không chữ Hàn lẫn khi nguồn không có. TypeScript cho adapter/index PASS với khai báo ảnh tối thiểu, không phải build Expo đầy đủ. Bộ 10 đề/200 câu cùng hash nguồn PASS, giữ nguyên.

Trình đọc thực tế trong bộ thích nghi web PASS 7 bài × 12 ngôn ngữ = 84 tổ hợp. Kiểm các trường hiện có (title, clusterTitles, paragraphs, prompts, keyTerms, illustrationAlt), bật/tắt dịch, giữ Nhật, không tự dùng ngôn ngữ thay thế, hoàn thành thủ công và tải lại; không lỗi JavaScript. Ảnh Nhật–Việt ở 320×568, 768×1024 và 932×430 đã kiểm trực quan, không tràn ngang. Build cô lập cảnh báo thiếu expo/tsconfig.base. Bản dịch AI chưa được người bản ngữ hoặc chuyên gia lĩnh vực duyệt. Không dùng dịch vụ/API dịch công cộng. Kiểm tra trình đọc web dùng bộ thích nghi cho React Native, bộ lưu trữ, safe area và lớp trang trí/ảnh; không chứng nhận iOS/Android hoặc mọi bộ chữ. Activity/reflection khi có chưa có vùng hiển thị riêng.

Mốc tiếp theo: tuần 8, bài 050–056; còn 336 bài trong giáo trình 385 bài. Lưu bền vững chỉ được xác nhận sau commit từ xa trên recovery/jlpt-n3-n1.
