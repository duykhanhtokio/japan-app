# Kiểm tra bố trí hướng dẫn trực quan Khách sạn trên trình duyệt

Bộ kiểm tra dùng **component production**, `HotelGuideReadingProvider`, React, ReactDOM và React Native Web thật. Bộ dựng dùng `esbuild` đã có trong `devDependencies` của repository; không tự cài gói và không sửa nội dung app. Chỉ lưu mã nguồn bộ kiểm tra trong Git. Bundle, báo cáo và ảnh chụp được tạo tại thư mục tạm bên ngoài repository.

Phạm vi: 9 liên kết bài qua 4 component native; sơ đồ hai lối thoát có đủ Nhật + 12 ngôn ngữ; các hướng dẫn còn lại kiểm Nhật, Việt, Myanmar và Khmer. Ba chiều rộng cửa sổ là 320, 768 và 1280 px. Furigana Nhật kiểm cả bật/tắt. Tổng cộng 162 trường hợp, với kiểm tra tràn ngang, nhãn bị cắt, vị trí nhãn với đường nối và 5 ảnh chụp tiêu biểu.

## Chạy trên Mac hoặc máy có Chromium

Từ thư mục gốc Japan App, bảo đảm đã cài dependency bình thường của repository. Python 3 cần có gói chính thức `playwright`; trình duyệt có thể dùng Google Chrome/Chromium đã cài. Bộ này không tải trình duyệt hoặc cài dependency tự động.

Dựng trang QA từ đúng bản mã đang muốn kiểm:

```bash
node scripts/hospitality/browser-qa/build.cjs --out /tmp/japan-app-hotel-browser-qa
```

Chạy bằng Chrome đã cài trên Mac:

```bash
python3 scripts/hospitality/browser-qa/run-browser.py --build-dir /tmp/japan-app-hotel-browser-qa --browser-executable "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Có thể bỏ `--browser-executable` để dùng Chrome trên Mac, Chromium/Chrome trong PATH hoặc trình duyệt đã được Playwright chuẩn bị trước. Nếu Python báo thiếu `playwright`, cần chuẩn bị gói Python này trong môi trường của máy trước khi chạy lại; runner không tự thay đổi môi trường.

`build-manifest.json` khóa hash bundle và các tệp production. Nếu mã nguồn đổi sau khi dựng, runner yêu cầu dựng lại. `browser-results.json` chứa từng trường hợp, lỗi, hash trước/sau và đường dẫn ảnh. Mã thoát 0 chỉ khi đủ 162 trường hợp và không phát hiện lỗi; 1 là lỗi bố trí/runtime; 2 là chặn khả năng chạy hoặc bản mã thay đổi.

Mở 5 ảnh chụp để rà trực quan trước khi nghiệm thu. PASS của bộ này chứng minh phạm vi trình duyệt đã chạy; không thay kiểm thử iPhone/iPad/Android vật lý, VoiceOver, cỡ chữ hệ điều hành, toàn bộ luồng app hoặc duyệt chuyên môn/bản ngữ.

## Trạng thái đã có bằng chứng ngày 2026-11-07

Chưa thực thi bộ portable này trên Mac. Lần thử Chromium trong workspace bị chặn **trước khi mở trang**: `process_singleton_posix.cc:297`, `socket() failed: Operation not permitted`; đã chạy 0 trường hợp và có 0 ảnh chụp. Cách mở file của trình duyệt cloud cũng bị chính sách từ chối. Không có kết quả kiểm thử trình duyệt hay thiết bị thật được suy ra từ việc dựng bundle, SSR hoặc kiểm tra source.
