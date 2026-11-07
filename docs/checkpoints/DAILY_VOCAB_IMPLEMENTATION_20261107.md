# Nhiệm vụ 10 từ, chìa khóa, vé 7 ngày và quyền JLPT — 2026-11-07

## Đã triển khai trong mã nguồn

- Chặn `/game` và mọi route con bằng layout không mount farm, giữ toàn bộ mã và save game. Chuẩn bị artwork route game chuyển sang tài nguyên nhiệm vụ thay vì tải nông trại.
- `/tasks` chỉ còn nhiệm vụ ghép 10 từ, ba cột từ/kana/nghĩa và vùng 10 nhóm, không ScrollView/phân trang trong board. Màn ngang chia thành hai khối 5 nhóm, tất cả lựa chọn vẫn có mặt. Khi chưa có đăng nhập/máy chủ, cho luyện tập có nhãn rõ và giữ bài trên thiết bị, không cấp thưởng.
- Máy chủ chọn từ từ chính kho 8.350 từ và các bản dịch/repair hiện có, tránh lặp chuỗi nhìn thấy, ưu tiên từ chưa hoàn thành nhiệm vụ rồi từ từng sai. Bài trong ngày giữ ổn định cả cấp/ngôn ngữ khi đã cấp; thay đổi cấp áp dụng ngày sau. Ngày thưởng dùng JST cố định từ giờ máy chủ.
- Ghi nhận một lần/ngày; đủ mỗi 7 ngày cộng dồn nhận một chìa. 4 chìa đổi một vé, chủ động đổi. ID giao dịch giữ khi mất kết nối và dùng lại khi thử lại, các thao tác được khóa hàng DB trong một transaction.
- Một đề lịch sử duy nhất tại cấp ban đầu miễn phí; ID cố định trong tài khoản máy chủ. Đề tự soạn nhận diện bằng catalog, chỉ Premium. Premium giá cấu hình hiện tại 3.000¥/tháng, quyền lấy từ bảng entitlement đã xác minh, không lấy cờ trên máy.
- Vé chỉ mở đề gốc, một vé cho đúng 7×24 giờ, không trừ lại khi quyền còn hạn, không gia hạn khi làm lại. Hết hạn chặn cả bài dở; giữ đáp án, dừng playback; kiểm tra khi mở, foreground, theo kỳ và tại hạn đã nhận từ máy chủ.
- Lượt bắt đầu bằng Premium có grant riêng cho phép nộp sau hết thuê bao. Lượt bắt đầu bằng vé không được hưởng ngoại lệ này.
- Lưu bản nộp riêng, cho xem lại khi không còn quyền, không có nút làm lại trong chế độ xem. Giữ chính sách không lộ lời giải/transcript. Server giữ bản nộp theo run ID; client khôi phục kho bài nộp mà không ghi đè bài dở.
- Session/attempt/archive và ledger công nhận cấp được tách theo tài khoản sau khi tích hợp đăng nhập. Legacy device histories được giữ riêng, không tự gán cho người đầu tiên đăng nhập. Catalog xóa nội dung đang chọn khi thay đổi identity provider.
- Không gọi trừ CREDIT trong luồng thi mới. Cơ chế CREDIT/hội thoại và ví điểm tiền không được chuyển thành chìa/vé.

## Các mốc đã lưu trước checkpoint này

- `b6c384bd`: khóa game và hợp đồng yêu cầu.
- `5cac0a90`: quy tắc nhiệm vụ, thưởng và grant phía máy chủ.
- `51101220`: giao diện ghép từ, luyện tập, đồng bộ.
- `55f4e78e`: tích hợp quyền thi, lưu bài nộp, hiệu ứng xác nhận và kiểm tra.

Các thay đổi Tokutei đồng thời được hợp nhất, không ghi đè hoặc force-push.

## Kiểm tra thực sự đã chạy

- 8 test server/policy đạt: 6 test nhiệm vụ/vé/DB handler và 2 test telemetry cũ. DB handler thử với pg-mem; chưa chứng nhận PostgreSQL thật hoặc cạnh tranh phân tán.
- 65 tổ hợp cấp/ngôn ngữ (5 cấp × 13 ngôn ngữ) chọn đủ 10 từ không trùng từ/kana/nghĩa trong lô kiểm tra.
- React component test: 30 card được render, hơn 200 lần sai vẫn thử tiếp, ghép đúng 10 nhóm, chuyển ngang vẫn 30 card. Đây không phải bằng chứng không tràn/đọc tốt trên màn hình thật.
- Kiểm tra giữ archive khi clear/restart; giữ accessRunId; không tự tạo auth; gộp thao tác bấm đồng thời; giữ ID giao dịch sau lỗi mạng; tách lịch sử Alice/Bob.
- Bộ đếm JLPT đạt; UI lock cập nhật đúng phạm vi được cho phép; kiểu dáng màn thi giữ nguyên. Không sửa câu hỏi, đáp án hoặc audio.
- Các file TS/TSX thay đổi đã được transpile kiểm cú pháp. Chưa chạy full Expo/native build hoặc full TypeScript project trong checkout sparse.

Lệnh tái kiểm tra (sau npm install/npm ci phù hợp):

```bash
node scripts/check-daily-learning.cjs
node scripts/check-jlpt-exam-progress.cjs
node scripts/check-jlpt-approved-ui-lock.mjs
cd server/economy
npm install
npm test
npm run check
```

## Thiết kế cũ

Đã tìm, xem và tái sử dụng `assets/app/ui/royal-af/mission-key-v1.png` cho thông báo nhận chìa. Vé vàng cũ và hiệu ứng cũ chưa được xác định qua danh mục tài nguyên, lịch sử Git khả dụng, tìm kiếm hồ sơ trước đó và tìm kiếm ảnh. Không kết luận file lịch sử không tồn tại.

Hiện thông báo nhận vé là phần trình bày bằng chữ/màu có hiệu ứng opacity/scale, chỉ chạy sau xác nhận giao dịch; KHÔNG phải mẫu vé cũ đã phục hồi hoặc mẫu artwork được duyệt. Cần tìm/nhận đúng asset để hoàn tất mỹ thuật này.

## Chặn phát hành còn thực tế

1. Hiện app chỉ có hồ sơ local, chưa có nguồn đăng nhập bảo mật. Cần nối nhà cung cấp auth thật bằng `configureLearningIdentityProvider` và gọi lại khi đăng nhập/đăng xuất/đổi tài khoản. Không mint token trong client. Token phải do issuer đáng tin cậy cấp, khớp hợp đồng HMAC trong server; backend cần URL HTTPS, secret/issuer và PostgreSQL.
2. Chạy `schema.sql`, `migration-002.sql`, `migration-003.sql` trên PostgreSQL triển khai; bảng riêng tư chỉ cho server. Cần kiểm tra rollback, replay và giao dịch đồng thời trên DB thật. Repo đã có handler, chưa có bằng chứng đã triển khai.
3. Cần nối sản phẩm thuê bao và xác minh Apple/Google, mua/khôi phục/hủy/hoàn tiền, cập nhật `economy_entitlements`. Chưa có thanh toán thật trong lượt này; không dựng trạng thái Premium giả.
4. Cần quy trình gắn hồ sơ đăng ký ban đầu và import lịch sử legacy đúng chủ khi có auth thật. Dữ liệu cũ vẫn còn riêng trên thiết bị; không âm thầm chuyển vào một tài khoản mới.
5. Kiểm tra iPhone/Android/landscape và cỡ chữ thực tế. Chromium local bị từ chối socket; tải headless shell không thành công; trình duyệt cloud không truy cập được localhost. Chưa có screenshot hợp lệ và chưa xác nhận board không tràn ở mọi kích thước. Không gắn cờ native/device/release PASS.
6. Tìm đúng mẫu vé vàng cũ, giao diện/hiệu ứng đã duyệt. Tài nguyên chìa đã xác minh; tài nguyên vé chưa xác minh.

Khi auth/backend chưa cấu hình: quyền thi mới không được giả lập mở, số dư chìa/vé hiển thị chưa xác minh, nhiệm vụ chỉ luyện tập. Do đó chưa thể coi phiên bản này đủ điều kiện phát hành tính năng thương mại.
