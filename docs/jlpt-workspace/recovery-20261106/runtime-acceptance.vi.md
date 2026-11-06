# Nghiệm thu kỹ thuật JLPT — 06/11/2026

Mốc kiểm tra: `ae3d93ee10badecd06f66b97fa0769143f3a5596`. Không sửa mã app, nội dung đề hoặc tài nguyên. Đây là nghiệm thu một phần, chưa phải chốt phát hành hoặc nghiệm thu bộ audio sửa mới.

## Đã thực thi

- 30/30 lệnh `check-jlpt-original-*-adapter.mjs` PASS. Lần đầu bị thiếu file do sparse checkout; đã lấy đúng 84 ảnh được adapter tham chiếu và `listening-start-overrides.json` từ Git, sau đó chạy thành công. Không tải toàn bộ assets.
- Khóa UI: 10/10 file khớp hash, registry structural policy PASS.
- Chạy chính hàm `calculateResult` của runner, trích bằng TypeScript AST: 120 trường hợp trên 30 đề PASS, gồm toàn đúng, toàn sai, toàn bỏ trống và một đúng/một sai/còn lại bỏ trống.
- Chạy export thật của `learning-economy.ts` với AsyncStorage bộ nhớ: 9 kiểm tra PASS. 79% không đạt; 80% đạt; 5 đề khác nhau chưa lên cấp; làm lại cùng đề không thành đề thứ sáu; đủ 6 đề khác nhau lên cấp; cấp cao đã đạt không bị hạ.
- TypeScript 5.9.2: transpile cú pháp của 30 adapter không có lỗi. Đây **không phải** semantic typecheck `tsc --noEmit`.

Lệnh tái chạy kiểm tra chấm điểm/lên cấp:

```bash
JLPT_QA_DEPENDENCY_ROOT=/tmp/jlpt-qa-deps node docs/jlpt-workspace/recovery-20261106/runtime-scoring-check.cjs
```

Khi repo có TypeScript trong `node_modules`, có thể bỏ biến môi trường. Harness chỉ đọc mã sản xuất, ghi báo cáo JSON; không thay đổi phiên làm bài thật.

## Chưa nghiệm thu được

Đã chạy script browser hiện có `check-jlpt-original-n5-01-browser-audio.cjs` bằng Chromium hệ thống. Chromium dừng trước khi mở trang:

```text
FATAL:chrome/browser/process_singleton_posix.cc:297
Check failed: . socket() failed: Operation not permitted (1)
```

Do đó không nhận PASS cho phát nghe, tự tiếp tục sau nhạc, decode ảnh bằng browser, ảnh chụp giao diện, full router, iOS hoặc Android. Không tự mở luồng browser khác chỉ để tạo bằng chứng tương đương giả.

Full-app TypeScript và lint chưa chạy vì checkout không có dependency Expo/React/ESLint/config Expo. Chỉ dùng chung gói TypeScript tối thiểu với worker kiểm tra resume; không cài toàn bộ cây dependency để tiết kiệm tài nguyên.

## Để đóng mục này

Sau khi đủ audio sửa mới và đã tích hợp: chạy lại kiểm thử liên quan bản thu mới; semantic typecheck/lint với dependency của app; kiểm tra runner thực tế trên browser/iOS/Android với phát/ngừng/tiếp tục/nghỉ 60 giây/nộp bài và ảnh giao diện. Sáu bản audio N1 sửa mới chưa tìm được vẫn là chặn riêng của việc hoàn tất đợt audio, không phải mất 30 đề đang dùng.

Bằng chứng máy: `runtime-acceptance.json`, `runtime-scoring-promotion.json`. Coordinator chịu trách nhiệm commit/push và xác minh remote; các file này chưa tự chứng minh đã lưu bền vững.
