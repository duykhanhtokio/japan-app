# Bộ đọc — kiểm hoạt động mới và giới hạn hiển thị

Snapshot `873e5c9919498a42aef60939abd2af9207ab4558`. Không mở lại bằng chứng cũ hoặc chạy lại 26 luồng học không đổi.

## 1. Hình và cách đọc trong đúng ngày học

Đã kiểm riêng các ngày chứa ba hoạt động CO2, thu hoạch và so sánh củ mới tích hợp. Liên kết hình có hash hiện hành được ghi trong `focused-reader-gaps.json`; đây không phải duyệt pixel hoặc kết luận hình minh họa mọi chi tiết mới. CO2 dùng được ruby nguyên đoạn p2/p3 đã có. Câu trả lời thu hoạch chỉ tương ứng một phần đoạn; câu so sánh củ tổng hợp bốn đoạn, nên không dùng token của đáp án để phủ lên toàn bộ thân bài. Không tìm thấy token nguyên đoạn nào có thể nối thêm vào phần đọc liên quan mà không suy diễn. Không sinh ruby mới hoặc thay khẳng định chuyên môn ngoài phạm vi luồng này.

## 2. Browser theo kích thước thiết bị

Chưa chạy được. Hai lần thử giới hạn với Chromium có sẵn đều dừng trước khi mở trang vì `process_singleton_posix.cc: socket() failed: Operation not permitted (1)`. Không tìm thấy package/binary Sparticuz còn dùng được trong các runtime hiện có. Đã dừng thử và không cài mới. Hồ sơ `browser-blocker.json` giữ riêng giới hạn này; không có ảnh chụp, kiểm responsive, Expo hoặc thiết bị thật được nghiệm thu.

## 3. Tương tác hoạt động mới

`activity-host-check.cjs` chỉ nhận danh sách ID rõ qua `--ids`, kiểm component `MoistureReaderChecks` thực với React test-renderer. Ba ID CO2/thu hoạch/củ đã đạt 48 trường hợp ngôn ngữ/cấp: đáp án không tồn tại trước thao tác mở, các phần dịch prompt/teaching/answer khớp dữ liệu đích, token ghép lại đúng bản Nhật, đóng đáp án sau lần bấm thứ hai, không hiện ở bài hoặc cấp khác, nguồn/đoạn gốc còn đúng phiên bản. Native Text/View, appearance và Button được thay bằng host fixture; không thay bằng chứng browser.

```bash
TOKUTEI_QA_MODULES=/workspace/scratch/adcba77e47ae/qa-deps/node_modules node docs/ssw-workspace/agriculture/continuation-20261103d/daily/activity-host-check.cjs --ids agr-reader-facility-co2-two-shortage-contexts,agr-reader-harvest-hand-mechanical-scope,agr-reader-tubers-organ-material-climate
```

Điều phối có thể chạy riêng các ID được bổ sung tiếp theo sau tích hợp; không dùng số trường hợp ở đây để tính thêm ý nguồn đã đóng. Không sửa file dùng chung, nội dung nguồn, bản dịch hoặc tiến độ. Không có tiến trình còn chạy.

### Kiểm sau tích hợp đợt d

Đã chạy đúng một lần cho năm hoạt động mới: `agr-reader-summer-source-wording`, `agr-reader-winter-warm-morning`, `agr-reader-organic-microbes-humus`, `agr-reader-facility-mechanical-ventilation-conditions`, `agr-reader-flower-duration-five-groups`. Đạt 96 trường hợp cấp/ngôn ngữ và sáu phần nguồn hiện hành. Báo cáo đóng băng: `activity-host-validation-d5.json`; báo cáo ba hoạt động trước giữ riêng trong `activity-host-validation-c3.json`. Không chạy lại 26 luồng học cũ. Tất cả tiến trình đã kết thúc.
