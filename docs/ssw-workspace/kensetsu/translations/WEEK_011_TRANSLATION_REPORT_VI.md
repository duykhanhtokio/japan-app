# 建設 — Bản dịch tuần 011

Đã bổ sung bản dịch AI cho bài 071–077 trong 12 ngôn ngữ của app: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl. Có 191 mục/2.292 chuỗi, gồm 84 đoạn đầy đủ/1.008 bản dịch đoạn. Sáu AI dịch theo cặp; toàn bộ chuỗi được so sánh độc lập với bản Nhật, 35 sửa đổi giới hạn đã gộp và đọc lại. Phân biệt dưỡng hộ/che chắn theo ngữ cảnh, vật liệu trát chung/vữa vôi, vật liệu nền, nhiệt độ không khí, số hiệu cấu kiện, dẫn nước mưa, khí thải đốt cháy và hút khói cháy. Chi tiết trong WEEK_011_AI_REVIEW.json.

Đã nối vào adapter hiện có. Kiểm đầy đủ locale, khớp nguồn, ngăn bản dịch cũ, giữ nguồn và mã tiến độ đạt; 457 file canonical/bản dịch cũ/trình đọc không đổi. Kiểu dữ liệu index/adapter đạt bằng khai báo ảnh tối thiểu, không phải build Expo toàn bộ. Bộ 10 bài kiểm tra/200 câu giữ hash bài học.

Bộ kiểm web được sửa bước chọn nhóm tuần để vào nhóm 11–20, giữ nguyên UI sản phẩm. Trình đọc thật qua bộ chuyển đổi web đạt 84 tổ hợp bài–ngôn ngữ; mở/đóng dịch, giữ Nhật, không lấy nhầm locale, hoàn thành thủ công/tải lại đạt. Không lỗi JavaScript hoặc tràn ngang tại ba kích thước. Ảnh điện thoại 320×568, tablet 768×1024 và phần ôn ngang 932×430 đã xem trực quan. Royal/ảnh được thay trong bộ kiểm, safe-area giả lập và localStorage; chưa kiểm bản cài iOS/Android hoặc chứng nhận mọi hệ chữ. Build cô lập cảnh báo thiếu expo/tsconfig.base.

Lũy kế 11/55 tuần, 77/385 bài, 25.956 chuỗi; còn 308 bài. Tiếp theo tuần 012, bài 078–084. Bản dịch vẫn là AI chưa duyệt bản ngữ/chuyên môn/phát hành. Lưu bền cần commit trên remote và WORK PERSISTENCE PASS.
