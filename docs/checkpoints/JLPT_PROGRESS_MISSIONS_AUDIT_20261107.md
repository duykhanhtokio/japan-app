# Bộ đếm JLPT và tab Nhiệm vụ — 2026-11-07

## Sửa bộ đếm N5–N1

Đếm số đề khác nhau đã nộp / số đề trong chỉ mục catalog đang dùng. Không dùng số từ vựng/ngữ pháp đã đánh dấu học; không dùng các mẫu số cố định 24/30/40/45/50. Thi lại tính một đề; đã nộp dù chưa đạt vẫn tính; bài dở không tính. Đạt 80% và công nhận cấp qua 6 đề vẫn thuộc bộ đếm x/6 riêng.

| Cấp | Tổng đề trong catalog/chỉ mục |
|---|---:|
| N5 | 12 |
| N4 | 13 |
| N3 | 23 |
| N2 | 19 |
| N1 | 21 |

Nguồn nhẹ: `src/data/jlpt-qualification-metadata.json`, đã kiểm tra ID và cấp khớp từng mục của `APPROVED_N1_EXAMS`. Màn đầu không tải ngân hàng câu hỏi/audio. Cập nhật khi màn hình nhận focus; không đổi dữ liệu đáp án, session hoặc màn thi đã khóa.

Kiểm tra: `node scripts/check-jlpt-exam-progress.cjs` PASS (cài mới, thi lại, điểm thấp, bài dở, history sau reset session, đủ mọi đề); `git diff --check` PASS; approved UI lock 10/10 PASS. Chưa chạy bản mới trên Simulator của người dùng, chưa kiểm chứng hình ảnh hay build native.

## Ngân hàng Nhiệm vụ hiện tại

Phạm vi: route `/tasks` và các module mà route này mở trực tiếp, tại nền mã a66a34ef. Không gộp ngân hàng hội thoại vùng hay bài Tokutei khác vào số nhiệm vụ đã tích hợp tại tab này.

| Nhóm | Số mục | Nội dung hiển thị | Tình trạng |
|---|---:|---|---|
| Ngày | 4 | Hội thoại ×1; từ vựng ×10; tưới nông trại; thu hoạch ×3 | Chuỗi giao diện, ghi Đang chuẩn bị |
| Tuần | 5 | Hội thoại ×5; học viết ×5; địa điểm ×3; thu hoạch ×30; đăng nhập ×5 | Chuỗi giao diện, ghi Đang chuẩn bị |
| Tháng | 6 | Nói ×20; viết ×20; từ vựng ×100; kanji ×10; địa điểm ×10; hoàn thành tuần ×3 | Chuỗi giao diện, ghi Đang chuẩn bị |
| Công việc | 10 mẫu riêng + 1 mẫu chung | Cá nhân hóa theo operationCode | Có đường mở hội thoại, chưa thành ngân hàng ngày hoàn chỉnh |
| Golden Key | 1 bảng điều kiện | City + tuần + tháng + công việc | Có hàm tính điều kiện, tab chỉ hiển thị khóa |

15 mục ngày/tuần/tháng chưa phải 15 nhiệm vụ có ID và vòng đời hoạt động: tab không nối bộ đếm sự kiện, chu kỳ ngày/tuần/tháng, xác nhận hoàn thành, nhận thưởng hay chống nhận lại. Checkbox là View tĩnh. Không có ngân hàng luân phiên/độ khó được dùng tại tab này.

10 mẫu công việc riêng: trồng trọt, chăn nuôi, cốt thép, cốp pha, giàn giáo, chăm sóc, khách sạn, chế biến thực phẩm, máy móc và sân bay. Có 18 loại route khai báo; 8 loại còn lại dùng mô tả chung. Mẫu chung không tự tạo kịch bản hội thoại.

`src/data/work-dialogues.ts` chỉ có 2 kịch bản: `WORK_REBAR_DAILY_001` và `WORK_AGRI_CROP_001`. Mỗi kịch bản 8 lượt (4 NPC + 4 người học), tổng 16 lượt. Bộ chọn luôn lấy kịch bản đầu tiên, chưa luân phiên theo ngày. Các route ngoài cốt thép/trồng trọt chưa có kịch bản trong bộ chọn này, nên thẻ mô tả có thể tồn tại nhưng màn đích không có hội thoại.

Thẻ công việc luôn hiện 0/1 và hàm dựng mẫu luôn trả progress=0/completed=false. ID DAILY_operationCode không có ngày. Thẻ hứa +50 XP/+30 coin, nhưng runner dùng max(20, 100 − 10 × số gợi ý), hoặc 0 khi xem đáp án làm mission thất bại; coin thành công là 30 trong cả 2 kịch bản. Có lưu lịch sử và chống thưởng lặp theo missionRunId, nhưng missionRunId mới theo lượt chạy, chưa phải giới hạn một lần/ngày.

Mô tả tab có 5 ngôn ngữ riêng (ja/vi/en/id/zh-CN), ngôn ngữ khác fallback English; 15 nhãn công việc ngày/tuần/tháng trộn Nhật/Anh. 10 mẫu công việc đều có Nhật/Việt, nhưng chỉ trồng trọt có thêm en/id/zh-CN/zh-TW/hi và cốt thép có thêm en/id/zh-CN; 8 mẫu còn lại chỉ có bản dịch Việt.

`src/data/missions.ts` có thêm 1 nhiệm vụ mẫu quán cà phê `CAFE_ORDER_001`, rewardXp=50, dùng bởi route `/game/mission/[missionId]`; chưa được tab Nhiệm vụ liệt kê như một ngân hàng ngày/tuần/tháng.

Backend economy có activity daily/weekly/monthly, nhưng endpoint learning-sessions hiện nhận rồi trả pending_verification/creditedPoints=0; đây không phải engine tự kiểm chứng hoàn thành nhiệm vụ. README backend ghi chưa triển khai. Tab `/tasks` không gọi economy client để nhận thưởng thực.

Kết luận: đã có khung giao diện, mục tiêu dự kiến và hai kịch bản công việc; chưa có ngân hàng nhiệm vụ vận hành hoàn chỉnh. Phần cần hoàn thiện là định nghĩa nhiệm vụ có ID/chu kỳ/điều kiện/phần thưởng, nối sự kiện học/game, reset theo kỳ, nhận thưởng chống lặp, đồng bộ trạng thái thẻ, bổ sung kịch bản công việc và sửa phần thưởng không khớp. Báo cáo này không triển khai thêm nhiệm vụ.
