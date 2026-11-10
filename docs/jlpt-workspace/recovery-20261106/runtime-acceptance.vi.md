# Nghiệm thu kỹ thuật JLPT — 06/11/2026

Mốc nền kiểm tra: `b64460e79d43a6e85075659b7fcc0b3fd94019d6`, cùng các thay đổi đang hợp nhất của sáu worker. Đây là nghiệm thu kỹ thuật; chưa phải nghiệm thu thiết bị hoặc bộ audio sửa mới. Có ba sửa kỹ thuật ngoài JLPT được coordinator giao để gỡ chặn kiểm tra toàn app, không sửa nội dung câu hỏi/bài học/audio.

## Đã thực thi

- 30/30 lệnh `check-jlpt-original-*-adapter.mjs` PASS. Lần đầu bị thiếu file do sparse checkout; đã lấy đúng 84 ảnh được adapter tham chiếu và `listening-start-overrides.json` từ Git, sau đó chạy thành công. Không tải toàn bộ assets.
- Khóa UI: 10/10 file khớp hash, registry structural policy PASS.
- Chạy chính hàm `calculateResult` của runner, trích bằng TypeScript AST: 120 trường hợp trên 30 đề PASS, gồm toàn đúng, toàn sai, toàn bỏ trống và một đúng/một sai/còn lại bỏ trống.
- Chạy export thật của `learning-economy.ts` với AsyncStorage bộ nhớ: 9 kiểm tra PASS. 79% không đạt; 80% đạt; 5 đề khác nhau chưa lên cấp; làm lại cùng đề không thành đề thứ sáu; đủ 6 đề khác nhau lên cấp; cấp cao đã đạt không bị hạ.
- **Semantic TypeScript toàn app PASS**: `NODE_OPTIONS=--max-old-space-size=4096 npx --no-install tsc --noEmit --pretty false`, exit 0, không có lỗi. Lần chạy mặc định hết heap khoảng 2 GiB; sau khi tăng giới hạn lên 4096 MiB đã chạy được và phát hiện ba lỗi nền ở WeeklyKaigo. Sau sửa kỹ thuật hẹp, lần chạy cuối PASS.
- **Lint toàn app PASS**: `npm run lint`, exit 0, **0 lỗi, 135 cảnh báo**. Không chạy `--fix` hàng loạt.
- Semantic TypeScript riêng 35 file JLPT/chấm điểm/credits/settings PASS với dependency thật. Transpile cú pháp 30 adapter cũng không lỗi, nhưng không dùng kết quả transpile thay typecheck.

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

Đã giải quyết dependency bằng **một** `npm ci --ignore-scripts --no-audit --no-fund --prefer-offline` dùng chung: 961 package/22 giây, khoảng 522 MiB; hash `package.json` và `package-lock.json` không đổi. Chỉ lấy mã nguồn và JSON tham chiếu trực tiếp cho compiler, không tải toàn bộ media.

Ba sửa kỹ thuật để toàn app qua gate: WeeklyKaigo thêm hai testID ổn định và ánh xạ đúng route mock/day; HospitalityCourse chuyển cùng payload children từ prop sang JSX; restaurant/index.ts xuất tường minh 13 type và giữ đúng một export giá trị phiên bản. Không đổi văn bản, đáp án, hình hoặc audio.

## Để đóng mục này

Sau khi đủ audio sửa mới và đã tích hợp: chạy kiểm thử liên quan bản thu mới; chỉ lặp typecheck/lint nếu đầu vào thay đổi; kiểm tra runner thực tế trên browser/iOS/Android với phát/ngừng/tiếp tục/nghỉ 60 giây/nộp bài và ảnh giao diện. Sáu bản audio N1 sửa mới chưa tìm được vẫn là chặn riêng của việc hoàn tất đợt audio, không phải mất 30 đề đang dùng.

Bằng chứng máy: `runtime-acceptance.json`, `runtime-scoring-promotion.json`, `runtime-full-tsc.txt`, `runtime-full-lint.txt`. Coordinator chịu trách nhiệm commit/push và xác minh remote; các file này chưa tự chứng minh đã lưu bền vững.
