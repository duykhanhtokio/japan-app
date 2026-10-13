# Bản dịch Kensetsu — tuần 8

Phạm vi bài 050–056: điện và các tuyến cấp điện; trạng thái và vai trò trong cấp gas đô thị; cấp nước, xử lý nước và thiết bị vệ sinh; tín hiệu viễn thông và công trình chứa cáp; điều hòa không khí; cách nhiệt, giữ nóng/lạnh và chống ngưng tụ; báo cháy và thiết bị chữa cháy dùng nước. Dịch từ bản Nhật do dự án viết, không tự cập nhật quy định hoặc bổ sung hướng dẫn thao tác.

Tuần này có 191 đơn vị nguồn × 12 ngôn ngữ = 2.292 chuỗi, gồm 84 đoạn đầy đủ × 12 = 1.008 bản dịch đoạn. Ngôn ngữ: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl. Tổng tám tuần: 56 bài, 1.590 đơn vị nguồn, 19.080 chuỗi, 684 đoạn với 8.208 bản dịch đoạn.

Sáu cặp ngôn ngữ dịch cả tuần bằng văn xuôi đầy đủ rồi đổi người rà từng đơn vị. Không thay đoạn giải thích bằng ghi chú hoặc tóm tắt. Bộ ghép kiểm tra mọi ID, tiếng Nhật và khóa locale với nguồn hiện tại trước khi ghi bundle, từ chối ghi đè bundle khác nội dung. Bản Nhật, revision, khóa hoàn thành, ảnh và bộ 10 đề/200 câu giữ nguyên.

## Kiểm tra và sửa nội dung

Rà soát AI độc lập đọc đủ 191 đơn vị trong cả 12 ngôn ngữ (2.292 chuỗi), gồm từng tiêu đề, đoạn, prompt, thuật ngữ và alt; đọc lại các trường đã sửa. Ba bản sửa văn xuôi theo session/ID đã kiểm và ghép: MY191, TH114 và KM122 đơn vị. KM gồm 114 đoạn/prompt/alt và 8 tiêu đề/thuật ngữ. Các sửa cuối MY2, TH14 và KM4 được ghép rồi đọc lại độc lập. Phần Bengali bài050 được viết lại đầy đủ và đọc lại cùng sáu sửa thuật ngữ/từ Nhật còn sót.

Đã giữ đúng đường điện trên không khác ví dụ giả định; lịch cắt điện khác xác nhận trạng thái điện; LNG lỏng khác khí cấp; nhiệt trị khác nhiệt độ; cấp nước khác xử lý nước thải; hiểu phân nhánh không đồng nghĩa được khoan ống; cáp quang vẫn cần điện cho thiết bị; UPS không bảo đảm mọi điều kiện. Điều hòa giữ đủ nhiệt độ/độ ẩm/độ sạch/luồng khí, phân biệt môi chất lạnh với nước tuần hoàn; cách nhiệt giữ đúng hướng truyền nhiệt và nguồn nước ngưng tụ khác rò nước. Báo động trong nhà khác thông báo119, đầu sprinkler kín thông thường phản ứng nhiệt tại vị trí đó, không suy mọi đầu phun hoạt động đồng thời vì khói. Chi tiết sửa và phạm vi rà trong manifest.

Ghép và kiểm cấu trúc PASS: nguồn/ID chính xác, đủ12 locale/mọi trường, nguồn bất biến, revision/khóa hoàn thành, loại bỏ bản dịch cũ khi nguồn đổi, không ảnh hưởng bài khác và không chữ Hàn lẫn. Kiểm thêm các bản cuối không có từ Nhật/CJK sót trong10 locale ngoài tiếng Trung và giữ119 trong đủ12 bản dịch liên quan. TypeScript adapter/index PASS với khai báo ảnh tối thiểu, không phải build Expo đầy đủ. Bộ10 đề/200 câu cùng hash nguồn PASS, giữ nguyên.

Trình đọc thực tế trong bộ thích nghi web PASS7 bài×12 ngôn ngữ=84 tổ hợp. Kiểm đúng các trường hiện có: title, clusterTitles, paragraphs, prompts, keyTerms, illustrationAlt; mở/thu dịch, giữ tiếng Nhật, locale không hỗ trợ không lấy nhầm bản khác, hoàn thành chỉ do người học bấm và tải lại vẫn giữ tiến độ; không lỗi JavaScript. Đã xem ảnh Nhật/Việt tại320×568,768×1024,932×430 và không tràn ngang. Royal trang trí/ảnh, safe-area và storage được thích nghi; không gọi đây là kiểm thiết bị iOS/Android hoặc chứng nhận glyph của mọi hệ chữ. Build kiểm riêng cảnh báo không có expo/tsconfig.base. Activity/reflection nếu có trong dữ liệu không có vùng riêng trong trình đọc.

Bản dịch vẫn là AI chưa được người bản ngữ/chuyên gia duyệt; quyền và phát hành chưa được chứng nhận. Không dùng dịch vụ dịch công cộng. Tiếp theo: tuần9, bài057–063; còn329/385 bài. Hoàn tất lưu bền chỉ khi commit chứa cả đợt được xác minh trên nhánh recovery/jlpt-n3-n1; giữ công việc đồng thời ngoài phạm vi.
