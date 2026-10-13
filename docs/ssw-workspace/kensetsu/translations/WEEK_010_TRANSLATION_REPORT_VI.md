# 建設 — Bản dịch tuần 010

Đã bổ sung bản dịch AI cho 7 bài 064–070 trong 12 ngôn ngữ: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl. Tổng 191 mục/2.292 chuỗi, gồm 84 đoạn đầy đủ/1.008 bản dịch đoạn. Sáu AI dịch theo cặp, sau đó so sánh độc lập mọi chuỗi với bản Nhật. Các sửa đổi về lớp cứng, số lượng/số hiệu, tiết diện vuông/chữ nhật, vật liệu nền/bổ sung, hướng chiều dài, ren, dung môi và điều kiện phủ định được ghi trong WEEK_010_AI_REVIEW.json.

Dữ liệu đã nối vào app qua adapter hiện có. Bản Nhật, ID và mã hoàn thành giữ nguyên; 450 file canonical/bản dịch cũ/trình đọc không đổi. Kiểm khớp nguồn, đầy đủ locale, ngăn dịch cũ, không biến đổi nguồn và kiểu dữ liệu adapter/index đạt. Bộ 10 bài kiểm tra/200 câu tiếng Nhật giữ nguyên hash bài học.

Trình đọc thật qua bộ chuyển đổi web đạt 84 tổ hợp bài–ngôn ngữ: mở/đóng dịch, giữ bản Nhật, không lấy nhầm locale, hoàn thành thủ công và tải lại. Ảnh Việt/Nhật tại điện thoại 320×568, tablet 768×1024 và ngang 932×430 được lưu; ảnh điện thoại/tablet/phần ôn ngang đã kiểm trực quan, không tràn ngang. Bộ chuyển đổi dùng thành phần Royal/ảnh thay thế, safe-area giả lập và localStorage. Không phải kiểm bản cài iOS/Android hoặc chứng nhận hiển thị mọi hệ chữ; build cô lập có cảnh báo thiếu expo/tsconfig.base.

Lũy kế: 10/55 tuần, 70/385 bài, 23.664 chuỗi dịch; còn 315 bài. Tiếp theo tuần 011, bài 071–077. Bản dịch giữ trạng thái AI chưa duyệt bản ngữ/chuyên môn; không tự xác nhận phát hành. Lưu bền chỉ được xác nhận bằng commit trên remote và WORK PERSISTENCE PASS.
