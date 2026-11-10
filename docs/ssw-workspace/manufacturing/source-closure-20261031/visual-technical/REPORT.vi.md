# Luồng 6 — hình ảnh, truy xuất dữ liệu và kỹ thuật

Phạm vi: hình tự biên soạn của ngành sản xuất 1号, không phải kiểm kê tất cả hình trong 574 trang PDF. Kiểm kê ảnh của nguồn thuộc ba luồng chuyên ngành; danh mục ở đây giúp nối ảnh đang dùng trong app với bài học và trang tham chiếu. Không có xác nhận của chuyên gia con người, người bản ngữ hoặc điện thoại thật.

## Kiểm kê hiện tại

| Nhóm | PNG riêng biệt | Ghi chú |
|---|---:|---|
| Hình lõi trước đây | 22 | Có hồ sơ đăng ký hình và liên kết bài |
| Hình bổ sung lô 36 | 5 | Kiểm tra hash bài liên quan |
| Hình bổ sung lô 37 | 7 | 9 lần gắn bài; không đếm thành 9 hình |
| Hình nhận diện lô 38 | 29 | 15 nhóm, 61 câu gắn hình |
| Tổng | **63** | **65 lần đăng ký**, 63 SVG nguồn, không có PNG nằm ngoài danh mục |

Kiểm tra hiện tại xác nhận đủ **63/63 tệp PNG thật**, đúng kích thước khai báo; 29 hình nhận diện khớp hash đăng ký hiện hành. Trang nguồn được kiểm tra về ID tài liệu, giới hạn số trang và liên kết tới bài hiện hành. Đây là kiểm tra truy xuất dữ liệu, không tự suy thành xác nhận tất cả kiến thức hoặc hình của 574 trang đã có trong app. Xem `artwork-audit.json` và `image-by-image-checklist.csv`.

## Hai lỗi thực tế đã phát hiện và xử lý

**Rò chú thích qua thuộc tính hỗ trợ đọc màn hình.** `SupplementalFigure` đã ẩn chú thích nhìn thấy khi `hideCaption=true`, nhưng vẫn đưa nội dung chú thích vào `Image accessibilityLabel` và tên nút phóng to/đóng. Kiểm thử thành phần thật với câu giải thích đánh dấu cho thấy nội dung vẫn xuất hiện trong HTML trợ năng. Root đã sửa hẹp: hình trong câu hỏi dùng nhãn trung tính, các nút không nối phần giải thích; hình học vẫn giữ chú thích. Bằng chứng trước/sau nằm trong `accessibility-before.json` và `accessibility-after.json`. Kiểm tra này không chứng nhận toàn bộ trải nghiệm đọc màn hình.

**PNG nhận diện chỉ còn con trỏ LFS trong bản làm việc.** Ban đầu cả 29 PNG nhận diện là tệp con trỏ 130–131 byte, không phải ảnh. Lần lấy LFS có giới hạn thời gian không hoàn tất; thử một URL media công khai trả 404. Điều đó không chứng minh mọi đối tượng LFS từ xa đều không tồn tại. Đã khôi phục **25/29 ảnh trùng byte hoàn toàn** từ SVG đã có: 21 bằng Inkscape, 4 bằng CairoSVG. Bốn ảnh còn lại không tái tạo đúng mã hash cũ nên không được gọi là khôi phục nguyên bản. Root đã áp dụng một **phiên bản mã hóa PNG mới** cho bốn ảnh này từ SVG không đổi, cập nhật nguyên tử các hash ảnh/câu hỏi/bản dịch liên quan và giữ nguyên lời bài, đáp án, lý do, ID và lời dịch. Hồ sơ ứng viên nằm trong `replacement-png-candidates.json`; hồ sơ tích hợp thuộc root ở `../asset-revision-applied.json`. Root cũng chuyển phạm vi PNG nhận diện này sang blob Git thường để tránh phụ thuộc LFS cho các ảnh đang sửa.

## Kiểm tra đã thực hiện trong phiên

| Kiểm tra | Kết quả | Giới hạn |
|---|---|---|
| Tệp, PNG header/kích thước, SVG và hash hiện hành | **63/63 PASS** | Không chứng minh giống thiết bị thật |
| Liên kết hình/câu hỏi và từ chối thay đổi nguồn, lựa chọn, đáp án, lý do hoặc ảnh | **488 trường hợp PASS** | Kiểm tra API, không thay cho thao tác điện thoại |
| Render thành phần câu hỏi thật qua RNWeb SSR | **793 trường hợp PASS**, 61 câu × 13 ngôn ngữ giao diện | Có adapter khai báo cho hình, màu, safe-area/header; không kiểm tra tải PNG hay bố cục trình duyệt |
| Giấu giải thích trong ảnh/nhãn trợ năng khi làm câu hỏi | **PASS sau sửa**, hình học giữ chú thích | Kiểm thử thành phần có trường đánh dấu; không chứng nhận mọi nội dung trên ảnh đều không thể gợi ý |
| Toán hình học của bốn mô hình đọc thước | **PASS**: 14.73; 20.12; 9.990; 24.988 mm | Tái chạy phép kiểm độc lập đã có trên hình SVG; không chứng nhận độ chính xác dụng cụ thật |
| Diện tích mẫu 60 × 40 × 2 mm | **PASS**: hai mặt rộng 4800 mm²; sáu mặt 5200 mm² | Chỉ áp dụng mô hình có đủ dữ kiện đã cho |
| Trình duyệt hiện tại | **BLOCKED** trước khi tạo trang | Chromium không được tạo Unix socket; không có luồng thao tác trình duyệt mới được tính PASS |
| Thiết bị thật | **Chưa thực hiện** | Không có cầu nối Android/iPhone được ủy quyền |

Đã trực tiếp quan sát một tập hình PNG thật và bản xem trước SVG có ghi rõ loại đầu vào: đọc thước, cực tính lớp tiếp giáp, nối dụng cụ đo, hướng dòng điện/từ trường/lực, biểu tượng hóa chất, trình tự mạ, diện tích, khuyết tật, tiếp điểm và chỉ thị màu. Bốn PNG thay thế cũng được quan sát riêng: bản đồ vị trí đo, XRF, dòng điện xoáy và độ thấm ướt. Xem `scoped-visual-review.json`. Những hình khác mới đạt kiểm tra dữ liệu/kích thước/hash, không được tính là đã nghiệm thu chuyên môn toàn bộ.

## Còn phải nghiệm thu

1. Đối chiếu mỗi mô hình với tài liệu của thiết bị hoặc vật mẫu thật có danh tính rõ ràng. Hình tổng hợp về lỗi bề mặt không thay cho khả năng nhận diện ảnh công nghiệp thực tế.
2. Trên cả Android và iPhone thật, kiểm tra ký hiệu, thang đo, đơn vị, những dụng cụ gần giống, quay màn hình, safe-area, phóng to/cuộn/đóng, chữ lớn và trình đọc màn hình. Mọi tệp có hàng kiểm tra riêng trong `acceptance-matrix.json`.
3. Kiểm tra đủ 12 bộ chữ/ngôn ngữ, đáp án trước/sau nộp, ghi nhớ tiến độ và khôi phục ứng dụng. Các trường hợp SSR không thay cho việc này.
4. Kiểm tra kích thước chữ trên điện thoại: ước tính hình thu về rộng 358 px cần phóng to để đọc nhãn nhỏ. Đã phát hiện `batch37-surface-qc.png` có chữ 17 đơn vị SVG; mức phóng to cũ 960 px trên hình rộng 1600 px chỉ đạt khoảng 10.2 px. Root đã sửa `SupplementalFigure` để mức phóng to giữ tối thiểu chiều rộng ảnh nguồn, bên cạnh mức sàn 960 px và chiều rộng cửa sổ. Với mô hình QC này, chiều rộng 1600 px cho chữ 17 px theo tính toán. Đây là biện pháp hình học đã áp dụng, không phải chứng nhận khả năng đọc hoặc cuộn trên điện thoại thật. Hình lõi dùng `ManufacturingDiagram` giữ hành vi phóng to riêng hiện có.
5. Bản xuất Android/iOS ở lô 38 là bằng chứng lịch sử về JavaScript/tài nguyên, không phải APK/IPA đã cài. Sau sửa thành phần và bốn phiên bản PNG này, cần xuất lại gói hiện hành trước khi dùng làm chứng cứ phiên bản mới.
6. Chuyên gia ngành và người bản ngữ cần ký nhận đúng phạm vi. `professionalExpertSignoff`, `physicalDeviceVerified` và xác nhận bao phủ toàn bộ hình nguồn tiếp tục là `false`.

## Tái kiểm tra

Chạy từ thư mục gốc repo:

```sh
python docs/ssw-workspace/manufacturing/source-closure-20261031/visual-technical/audit-artworks.py
python docs/ssw-workspace/manufacturing/source-closure-20261031/visual-technical/check-readout-geometry.py
node docs/ssw-workspace/manufacturing/source-closure-20261031/visual-technical/check-api-image-guards.cjs
node docs/ssw-workspace/manufacturing/source-closure-20261031/visual-technical/check-quiz-accessibility.cjs
node scripts/manufacturing/check-recognition38-render.cjs
```

Các lệnh Node cần `esbuild`, React/ReactDOM và RNWeb. Trong phiên này, dependencies kiểm tra được đặt ngoài repo; không thêm `node_modules` hoặc gói dựng tạm vào mã nguồn. Kiểm tra tổng `scripts/manufacturing/check-recognition38.cjs` do root chạy sau khi tích hợp toàn bộ thay đổi. Các tệp `*-before-final-asset-revision.*` chỉ giữ lần kiểm tra bị chặn trước khi thay bốn ảnh, không phải kết quả cuối.
