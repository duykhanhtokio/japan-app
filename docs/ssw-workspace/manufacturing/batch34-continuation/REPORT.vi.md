# Sản xuất 1号 — tiếp tục lô 34, ngày 29/10/2026

Đã đưa bản sửa bài cơ khí 076 vào bộ đọc thực tế, gồm tiếng Nhật và 12 ngôn ngữ đích. Đã kiểm SHA-256 và đọc ảnh trang vật lý 137 (trang in 129) của PDF cơ khí gốc. Đoạn sửa làm rõ: trong phần nguồn này, rò từ thông là hiện tượng liên quan đến nguyên lý kiểm tra bằng bột từ; phân biệt với nguyên lý kiểm tra bằng dòng điện xoáy. Không bổ sung quy trình thao tác hoặc biến phạm vi nguồn thành phân loại phổ quát.

## Cách tích hợp

Sửa cách diễn đạt khi hiển thị đúng đoạn `section-3` của bài 076. Lớp sửa yêu cầu đồng thời đúng ID bài/đoạn, hash nguồn, nguyên văn tiếng Nhật và nguyên văn bản dịch trước sửa. Nếu dữ liệu lệch, không áp sửa, không thay thế bằng ngôn ngữ khác. Các bản Nhật/dịch nguyên thủy vẫn giữ làm lịch sử. Câu mới là diễn đạt độc lập; không chép đoạn nguồn hoặc đưa ảnh PDF vào app.

Đây là làm rõ mục tiêu đã có, không thêm bài hay yêu cầu năng lực mới. 262 bài, 456 câu tuần, 33 đề luyện, 12 guides, 22 hình, các hash nguồn/ngân hàng gốc và khóa lưu tiến độ được giữ nguyên. Không coi giữ nguyên hash ngân hàng là chứng nhận toàn bộ nguồn hay bản dịch. Hồ sơ `mechanical-076-staged-repair.json` của phiên trước được giữ lại; bản Nhật đề xuất nay đã hiển thị trong reader cùng 12 bản dịch.

## Kiểm tra đã chạy

- Bộ dữ liệu/trạng thái ngành đạt; đã bổ sung kiểm lớp sửa vào cổng kiểm tra chính.
- Guard đạt 13 đoạn, 13 trường hợp nguồn cũ, 13 trường hợp nguyên văn đích đổi và 7 trường hợp đầu vào ngoài phạm vi. Không mutate dữ liệu nguồn/dịch.
- Reader React Native Web thực tế đạt 26 luồng: 13 ngôn ngữ giao diện × 320×568/932×430; câu Nhật và câu dịch mới hiện đúng, câu cũ vắng mặt, bật/tắt dịch đúng, không tràn ngang, lưu/hoàn thành/mở lại giữ tiến độ, lỗi ghi/thử lại đạt; 0 lỗi trang. Đã xem ảnh VI dọc và EN ngang. Các adapter Royal/storage/safearea/ảnh trang trí và font QA Nhật được khai báo; không chứng nhận hiển thị mọi hệ chữ hoặc thiết bị native.
- TypeScript strict của helper đạt; TSX reader biên dịch cú pháp đạt. Kiểm semantic toàn reader bị chặn bởi phụ thuộc Expo/navigation/effects thiếu trong bản sparse; không gọi đây là typecheck toàn app đạt.
- Chỉ bản reader trước/sau có hash được chỉ định mới được chiếu về đúng snapshot lịch sử. Sửa byte tùy ý bị từ chối. Gate nguồn batch25 đạt 57 trường hợp từ chối; UI JLPT khóa 10/10 đạt; `git diff --check` đạt.

## Còn lại

Chưa hoàn tất ngành. Các chi tiết/hình còn thiếu trong ledger cơ khí và surface, định nghĩa surface062, phần prose/lựa chọn/lời giải chưa được đọc đầy đủ, đối chiếu thuật ngữ nguồn dịch chính thức, duyệt chuyên môn/bản ngữ và Expo/native/thiết bị thật vẫn còn. Chưa đọc thêm trang duy nhất mới hoặc đóng toàn bộ đối tượng nguồn nào. Chưa chạy full assembler/full Expo trong lượt này. `wholeCurriculumComplete`, `releaseReady`, `nativeReviewed`, `domainReviewed`, `humanReviewed` và `physicalDeviceVerified` vẫn false.
