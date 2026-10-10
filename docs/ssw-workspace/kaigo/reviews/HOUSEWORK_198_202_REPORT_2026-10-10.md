# Kaigo: việc nhà và môi trường sống

Đợt 2026-10-10 đối chiếu trang in 198–202 (PDF 200–204). Hash PDF chuẩn đã kiểm lại: 997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54. Đã đọc chữ và xem toàn bộ năm trang, gồm các hình và nhãn; 95 bản ghi nối khái niệm với ý hiển thị trong app. Đây là liên kết của khối này, không chứng nhận mọi ý toàn sách đã đủ.

## Thay đổi và bảo toàn

Thêm 7 ý: một ý về IADL và thói quen riêng, sáu ý về mục đích chế biến, món theo văn hóa/mùa/osechi, lựa chọn khi dọn đồ, quần áo và đồ ngủ/giặt–khô, xử lý đồ nhiễm bẩn, môi trường tinh thần–thể chất và nguy cơ vấp thảm. Tổng hiện hành 524 ý/87 mục/87 ca tự giải thích. Tạo diễn đạt mới, không lấy chữ, ảnh hoặc câu thi nguồn làm nội dung app.

Append audit xác nhận 517 ý cũ giữ nguyên cùng ID, ca và lịch. content.json (12 đề/360 câu), daily-plan.json và KaigoCourse.tsx giữ nguyên byte. Lịch vẫn 144 ngày × 30 phút; chưa đo thời gian với người học. home-environment có 607 đơn vị chữ tách bằng khoảng trắng; đây không phải phép đo phút học. Người học dừng khi hết 30 phút và tiếp tục phần còn lại buổi sau.

## Kiểm tra

- Validator housework: 95 bản ghi/5 trang, hash runtime, chữ tương đương, ngày, revision và 4 đối chứng lỗi đạt; daily plan/5 đối chứng và khóa JLPT 10/10 đạt.
- RNWeb tập trung dựng từ KaigoCourse thật và Royal component; 15 ý ở hai mục (8 cũ/7 mới) khớp DOM. Danh mục 12 đề; đáp án tự giải thích ẩn trước trả lời, hiện sau đối chiếu, câu trả lời và trạng thái phục hồi sau tải lại.
- HTML lọc 95 dòng; 390×844, 768×1024, 844×390 không tràn ngang và 0 pageerror. Đã xem cả ba ảnh. Evidence ở `../runtime-tests/2026-10-10-housework/evidence.json`.
- 785 trường sàng với text-layer nguồn: không trùng cửa sổ chuẩn hóa 60 ký tự. Kết quả chỉ là sàng chữ; không chứng nhận bản quyền hay độc lập ngữ nghĩa.

Runtime SHA256: `1443d7ec98180a99ce5555cb173d7e4acaceb4310bfb02347ca5244969a21a42`.

## Giới hạn và bước kế tiếp

Kiểm nguyên tắc đồ bẩn với [CDC](https://www.cdc.gov/infection-control/hcp/environmental-control/laundry-bedding.html), nguy cơ thảm và lối đi với [Guy’s and St Thomas’ NHS](https://www.guysandstthomas.nhs.uk/health-information/falls/staying-safe-home). CDC ở đây là hướng dẫn cho cơ sở y tế; không áp quy định Hoa Kỳ thành luật Nhật hoặc quy trình giặt tại nhà. App không thêm nồng độ hóa chất, nhiệt giặt hoặc chỉ định điều trị. Hình minh họa không chứng minh giặt tay/phơi khử khuẩn hay mọi thảm đều an toàn.

Human/domain/native/rights/release còn false. Harness có expo-image shim; không full Expo Router hoặc thiết bị native. Điểm nguồn trang 195 và các điểm hình cũ 31/40/72 vẫn theo báo cáo trước. Tỷ lệ toàn sách null. PDF, chữ trích xuất, ảnh nguồn, tệp kiểm tạm và dependencies không đưa lên repo.

Bước tiếp: trang in 203–208, tiếng Nhật chăm sóc; kiểm từ/đọc/nghĩa/nhãn với kho hiện hành trước khi thêm ví dụ mới độc lập.
