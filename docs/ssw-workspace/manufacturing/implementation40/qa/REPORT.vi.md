# Kiểm định tích hợp manufacturing40 — 2026-10-31

Kết quả kỹ thuật hiện tại: PASS các kiểm tra dữ liệu, ràng buộc ảnh và các luồng React thực tế được mô tả dưới đây. Chưa nghiệm thu trình duyệt, điện thoại thật, chuyên gia thiết bị hoặc người bản ngữ.

## Phạm vi và bằng chứng mới

Baseline được chụp khi HEAD/origin cùng `dfb2af5120b963aaa3f6f22e79a251fd6d00ebae`, trước khi tích hợp40; `baseline.json` lưu lịch262ngày, ID/hash/objective của bài, ID/đáp án của câu hỏi và revision đề. Không suy diễn số tiến độ từ báo cáo cũ.

| Kiểm tra thực chạy | Kết quả | Bằng chứng |
|---|---:|---|
| Ngày học đã lập lịch / PNG liên kết hiện hữu | 262 / 262 | daily-bindings.json |
| Cặp chú thích ảnh–ngôn ngữ đích | 3.144 | daily-bindings.json |
| Từ chối hash, nội dung, ID hoặc locale sai | 4.978 | daily-bindings.json |
| Tổng byte của262PNG phân biệt | 17.334.729 | daily-bindings.json |
| Reader thực tế:262ngày × Nhật+12ngôn ngữ | 3.406 | daily-reader.json |
| Ảnh dùng component cũ,10ngày ×13locale | 130 | daily-reader.json |
| Ảnh mới, bật chú thích/alt dịch,252×12 | 3.024 | daily-reader.json |
| Mở zoom ảnh mới, chiều rộng ≥ nguồn | 252 | daily-reader.json |
| Luồng bài kiểm tra tuần / mô phỏng | 39 / 39 | controller-flows.json |
| 29câu sửa giải thích ×13locale | 377 | revision-rendering.json |
| 3câu mô phỏng soạn lại ×13locale | 39 | revision-rendering.json |
| Cặp bản dịch câu hỏi sửa đổi | 384 | revision-state.json |
| Guard câu hỏi/hash/nội dung/locale âm tính | 1.280 | revision-state.json |
| Đáp án đã lưu còn hợp lệ sau sửa giải thích | 29 | revision-state.json |
| Đề mô phỏng đổi revision / giữ state hợp lệ | 4 / 29 | revision-state.json |

262PNG gồm252ảnh mới và10ảnh cũ tái sử dụng theo mục tiêu bài; không tính10ảnh đó thành ảnh vẽ mới. Registry ảnh mới chỉ khởi tạo module PNG khi chọn đúng ảnh, metadata không tải PNG, locale chưa chọn không khởi tạo JSON tương ứng. Đây là quan sát khởi tạo module qua bundler harness, không phải đo mạng/bộ nhớ thiết bị hay chứng nhận toàn bộ asset cũ đều lazy.

Reader test dùng **private Reader thực trong ManufacturingCourse**, không dựng reader thay thế. Harness chỉ thêm export trong bộ nhớ, dùng React test renderer với RN primitive, storage, appearance, safearea, header và phần trang trí được thay thế rõ ràng trong `runtime-harness.cjs`. Kiểm tra source URI, alt, chú thích, bật dịch và hành vi zoom của component thực. PNG được giải mã/đối chiếu byte/hash/kích thước ở kiểm tra dữ liệu; test renderer không giải mã ảnh và không đo clipping/layout. Đây không phải SSR/RNWeb hay trình duyệt thực.

Luồng tuần thực kiểm tra chọn đáp án, chuyển câu, mở lại đúng vị trí/đáp án, ghi lỗi và thử lại, chặn nộp khi chưa lưu, hủy/xác nhận nộp, chấm điểm, bản dịch và không ghi đè state sai revision. Luồng mô phỏng kiểm tra bắt đầu phần, lưu/khôi phục, hai phần, chấm điểm và xem giải thích sau hoàn tất. Các giải thích mới đều vắng trước khi nộp và đủ bốn giải thích Nhật/dịch sau nộp. Các ảnh câu hỏi nhận diện vẫn xuất hiện sau sửa hash phần giải thích.

Ba ID câu hỏi mô phỏng sửa nội dung làm đổi revision **bốn đề**: electrical-mock03,08,09 và electrical-reference-practice-2025-01 (đề tham khảo dùng lại hai câu đã sửa). Test chứng minh state cũ của cả4đề bị từ chối;29đề còn lại vẫn khôi phục. ID/đáp án đúng32câu được giữ nguyên. Thay giải thích của29câu giữ đáp án đã lưu hợp lệ.

## Lỗi tích hợp đã phát hiện và kiểm tra lại

1. `MockAttempt` ban đầu chỉ gọi getter bản dịch cũ nên ba câu soạn lại mất bản dịch do hash mới. Chủ tích hợp thêm `questionTranslation40(...) ?? getter cũ`;39luồng13locale của3câu sau đó PASS.
2. Ảnh surface042 ban đầu vẽ điện trở3Ω không nối vào hai thanh cái mạch song song. Đã gửi tác giả sửa; ảnh cuối được xem trực tiếp, hai nhánh6Ω/3Ω nối hai nút chung với nguồn12V; không có dây nối tắt. Bằng chứng trước/sau/hash tại `surface-042-rejection-before.json`.
3. Yêu cầu kiểm lại sign-warning: PNG hiện có và SVG gốc render lại trùng byte/pixel, đã có A–J và10tam giác. Không sửa hoặc tạo revision giả. Receipt: `sign-warning-pixel-receipt.json`.

## Kiểm tra hình và các giới hạn

Đã xem trực tiếp36PNG chọn từ nhiều nhóm: đo/kích thước/dung sai, OJT/QC, vật liệu/độ cứng, sơn/đùn, dây/đầu nối, dao động ký, relay tự giữ, lực điện từ, chiếu hình, PCB, pH/oxit/xử lý nước, mạch điện, từ trường, đo màng, meniscus, anot hóa và bảng thông số kim loại. Checklist từng ảnh/lesson/objective/hash/trạng thái ở `pixel-review-sample.json`. Các ảnh thay encoding sau contact sheet (mechanical089,surface022,042) đã xem lại PNG cuối. Không thấy sai hình học/mục tiêu rõ ràng còn lại trong mẫu này. Không coi36ảnh là chứng nhận chuyên môn của toàn bộ262ảnh.

Đọc cả ba generator: từng ngày được ánh xạ scene/family rõ ràng; trường hợp không có scene bị raise, không có fallback chung chỉ hộp chữ/mũi tên được tính thành ảnh đạt. Electrical có10tái sử dụng được khai báo riêng. Khẳng định này kiểm tra đường đi generator; không thay thế rà soát ý nghĩa từng ảnh còn lại. Các hình là sơ đồ học tập tự dựng; chưa đối chiếu thiết bị vật lý thật. Text raster gốc chủ yếu tiếng Nhật;12locale có caption/alt ngoài ảnh, không tuyên bố mọi chữ nhúng trong PNG đã được dịch.

Các cửa nghiệm thu còn mở:

- Chuyên gia đối chiếu262mục tiêu/ảnh, độ giống thiết bị, dụng cụ dễ nhầm, cấu trúc/công thức/thang đo/đơn vị; ưu tiên lại hình mạch, điện hóa, đo lường và hình dung sai.
- Người bản ngữ kiểm ngữ nghĩa12ngôn ngữ; test chỉ kiểm hash, cấu trúc, xuất hiện đúng nội dung được cung cấp.
- Điện thoại Android/iOS thật: mở Reader mỗi họ hình, kích thước màn hình nhỏ, pinch/scroll/zoom, chữ/thang đo/đơn vị, font, accessibility, ảnh chưa cache và mạng chậm, màn hình làm bài không lộ đáp án/chú thích trước nộp.
- Trình duyệt thực: layout, ảnh decode, focus/ARIA và tải asset chưa được xác nhận trong môi trường này.

## Khả năng trình duyệt và thiết bị

Đã chạy preflight thật: `adb` và `xcrun` đều ENOENT; không có thiết bị được cấp quyền. Chromium/Playwright hiện tại thất bại trước khi tạo trang do `socket() failed: Operation not permitted (1)`; log và capability receipt được lưu. Chủ tích hợp cũng báo hai lần CUA thất bại trước khi có surface (kernel exit; bwrap filesystem chỉ đọc). Không có screenshot điện thoại/trình duyệt hợp lệ mới trong đợt này. Các kết quả793SSR/historical export của đợt39 là lịch sử, không cộng vào số test mới ở trên.

## Tái chạy

Từ gốc repo, cung cấp React19.1.0, react-test-renderer19.1.0, esbuild0.25.9 qua NODE_PATH (receipt môi trường này dùng `/workspace/scratch/8c34e3cace7a/visualqa-deps/node_modules`). Chạy lần lượt:

```sh
node docs/ssw-workspace/manufacturing/implementation40/qa/check-daily-bindings.cjs
node docs/ssw-workspace/manufacturing/implementation40/qa/check-daily-reader.cjs
node docs/ssw-workspace/manufacturing/implementation40/qa/check-controller-flows.cjs
node docs/ssw-workspace/manufacturing/implementation40/qa/check-revision-rendering.cjs
node docs/ssw-workspace/manufacturing/implementation40/qa/check-revision-state.cjs
```

Mỗi script chỉ viết receipt thuộc thư mục QA; harness không sửa source production. Không viết bài, dịch thuật, ngân hàng câu hỏi hoặc component chung trong luồng QA.

## Kiểm tra sau hợp nhất87a64c6c

Đã chạy lại cả năm script trên Course hợp nhất (giữ phần bổ sung144ngày). Reader kiểm thêm1.872 trường hợp có đúng khối bổ sung và nguyên văn Nhật, cùng1.728 trường hợp có bản dịch đoạn được chọn; đều PASS. Marker hình ngày học được giữ quanh cả hình40 và các hook hình cũ. Không thừa nhận receipt browser lịch sử là nghiệm thu renderer mới.
