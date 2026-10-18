# 職長 — mốc tiếp nối 2026-10-18

Theo yêu cầu chuyển sang hoàn thiện 職長, bản học được mở rộng từ ba bài lên 28 bài Nhật–Việt, bốn tuần, 56 cụm và 112 đoạn mỗi ngôn ngữ. Có 50 câu vận dụng mới không chấm điểm và bốn sơ đồ gốc: mạng tiến độ, thứ tự giảm rủi ro, ba quản lý vệ sinh, vai trò các hồ sơ. Các bài004–028 có cả tiêu đề, câu vận dụng và chú thích hình bằng tiếng Việt.

Nội dung có bài nháp cho cả năm chương: vai trò/chỉ đạo/đối thoại; chuẩn bị và quản lý QCDSE, PDCA/OODA, nguyên giá, chất lượng, môi trường, sức khỏe; rủi ro,5S,KY/KYT, sai sót và quấy rối; thiết kế/thi công/kế hoạch/thủ tục; ngành xây dựng và vai trò pháp lý. Ví dụ tiến độ dùng tình huống tự tạo2+max(4,2)+3=9ngày; không dùng lại số liệu hoặc hình nguồn.

Nguồn là leader.pdf,131trang, bản2025-01-15, SHA256 `fa094327913a14047de32ad734b552d6911af281566076ec327e50608c5106f7`. Đã đọc phần chữ chính trích xuất PDF7–131 và xem29trang chọn lọc có hình/bảng. Đây không phải kiểm tra trực quan tất cả131trang. PDF và hình nguồn nằm ngoài kho mã. `coverage-ledger.json` ghi phạm vi đọc, liên kết theo khoảng trang của bài, vấn đề nguồn và việc còn lại.56hàng mục tiêu chưa phải mẫu số toàn bộ từng ý nguồn.

Không dạy các mức tiền, năm sửa luật, số người hoặc ngưỡng WBGT cũ như quy định hiện hành. Đã đối chiếu trang chính thức về giấy phép xây dựng, nhiệt và quấy rối; URL nằm trong ledger, không hiển thị trong bài học. Bài phân biệt職長 với các chức danh pháp định, điều kiện hợp đồng và vai trò kiểm tra; không tự cấp quyền thi công từ ví dụ học.

Ba bài001–003 giữ nguyên từng byte, ID và revision1; baseline SHA256 nằm trong `preservation-baseline.json`. Không đổi câu hỏi, dữ liệu 学科・実技, khóa tiến độ hoặc giao diện JLPT.職長 chỉ ở2号, cùng28bài tham chiếu cho utilities/building/civil. Không tạo hoặc gắn nhãn bộ đề2号chính thức. Tiêu đề tuần001 được mở rộng để chứa đủ bảy bài; tuần002–004 mới. Thời lượng chưa đo, không cam kết mỗi bài đủ30phút.

Kiểm tra được lưu trong `content-qa-2026-10-18.json`, `scope-host-qa-2026-10-18.json` và `browser-qa-2026-10-18.json`. Browser sử dụng component thật với React Native Web/Chromium; adapter riêng cho khung Royal, safe area và lưu trữlocalStorage; bốn sơ đồ dùng ảnh thật. Đây không phải chạy Expo production hoặc kiểm thử thiết bị native.21ảnh kiểm tra bao gồm ba kích thước320×568,768×1024,932×430 trên bảy bài đại diện. Xem danh sách và kết quả chính xác trong báo cáo; không suy ra duyệt chuyên môn từ kiểm tra kỹ thuật.

`expression-screen.json` đối chiếu250chuỗi Nhật của28bài với chữ nguồn, chuẩn hóaNFKC và tìm chuỗi trùng liên tiếp22ký tự: không có ứng viên. Chữ hình/raster có thể thiếu trong trích xuất; kiểm tra này không chứng nhận quyền tác giả hoặc phát hiện mọi cách diễn đạt gần giống.

Việc còn lại: lập mẫu số nguồn đầy đủ từng ý và rà hình còn lại; bổ sung ý thiếu nếu có; đo thời gian và điều chỉnh nhóm bài; dịch11ngôn ngữ còn lại; duyệt chuyên môn, tiếng Nhật, tiếng Việt và quyền; kiểm traExpo/native. Tất cả cờ duyệt và releaseReady vẫnfalse. Các công việc thực hành trước đó được giữ nguyên tại commit nền8e694f3a, không coi việc chuyển sang職長 là hoàn tất cuộc rà224bài.
