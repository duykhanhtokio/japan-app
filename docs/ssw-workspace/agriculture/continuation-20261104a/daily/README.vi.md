# Ngày học, hình và hoạt động — lượt 2026-11-04a

Baseline `bfd4cdeaa5b4abced2c7de2a847f218f57a435b9`. Luồng này kiểm tích hợp kỹ thuật; không đóng ý nguồn và không rà chéo ngữ nghĩa của các luồng biên soạn.

## Nhóm 1 — bộ chặn phiên bản của component ngày học

`check-daily-guards.cjs` chạy component/selector `DailyLearningSupport` thật với React test renderer và fixture native. Chín ca đạt: nhận companion có phiên bản hiện hành; từ chối parent hash cũ, companion hash cũ và cấp không hỗ trợ; hình liên kết và hình controlled hiện khi hash đúng, ẩn khi hash sai; hình liên kết ẩn ngoài cấp cho phép. `daily-guards-result.json` gắn hash các input. Đây không phải kiểm điều hướng toàn bộ màn hình học.

## Nhóm 2 — byte/pixel hình có chọn lọc và phép tính khung

`selected-image-bytes.json` ghi byte/hash/giải mã PNG và kích thước của ba hình đã chọn. Byte được đọc tại checkout hiện hành hoặc checkout cũ chỉ đọc, khớp chính xác metadata hiện hành; không chép asset hay PDF sang thư mục mới.

Đã mở xem pixel thật của hình lưới–mulch–tấm phản quang, tiếp xúc tầng sinh gỗ và so sánh cây giống. `selected-image-pixel-review.json` mô tả quan sát đúng phạm vi caption/alt, kèm giới hạn riêng; không chứng nhận hiệu quả canh tác hay thao tác kỹ thuật. Ảnh cây giống hiện hành chỉ rõ tử diệp nhỏ bằng nhãn `子葉は小形`; không còn nhãn cứng đã sửa ở lượt trước.

`check-selected-image-frames.cjs` chạy `ZoomableFigure` thật với kích thước ba hình trên, sáu viewport, tổng 18 ca. Khung tính toán giữ tỷ lệ, hữu hạn/dương; phóng/thu đúng nhánh, dùng ScrollView ngang và `contain`. Đây là phép tính/component host, không phải xem bố cục pixel trên browser hay thiết bị. Không chạy lại 24 ca tỷ lệ hình cũ hoặc toàn bộ 369 ngày không thay đổi.

## Nhóm 3 — liên kết hình trạng thái nảy mầm

`rice-image-bytes.json`: PNG `rice-pregermination-states-v1.png`, SHA-256 `e1c0485410c4667d62943dd14cc5cc6c4a8abf3d7515eba509560ccc46149e41`, 1600×1500, byte giải mã đúng metadata. `check-selected-days.cjs --lessons agr-ricework-soaking --skip-zoom` đã chạy component ngày thật ở cả hai cấp, hai lượt ngày/bốn image node đạt (`daily-host-changed-result.json`). Hình đăng ký đúng bài, cấp và sourceHash hiện hành. Chủ sở hữu lúa kiểm ngữ nghĩa nguồn/hình; luồng này không thực hiện lại.

## Hoạt động mới sau tích hợp

`activity-host-check.cjs --ids <ID chính xác>` kiểm các hoạt động mới sau khi điều phối tích hợp: ẩn/mở/đóng đáp án, dịch tường minh 12 ngôn ngữ, cách ly bài/cấp, dependency nguồn hiện hành, ghép Nhật từ ruby cho prompt/teaching/answer và readingKana cho token chứa Hán tự. Cần kết quả `activity-host-validation.json` sau lệnh chạy mới được tính là có bằng chứng; script chuẩn bị không tự chứng minh đã đạt.

Không chạy lại Chromium vì điều kiện lỗi cũ chưa thay đổi, không cài dependency hay mở tiến trình nền. Không đo thời lượng học thực tế và không bật cờ bản ngữ/chuyên môn/thiết bị thật. Các fixture dùng host node thay React Native thực; asset path trong host không tự chứng minh tải byte trên thiết bị.

### Kết quả sau tích hợp a

Đã chạy `activity-host-check.cjs` đúng tám ID mới lấy từ `integration.json.newChecks`. `activity-host-validation.json` ghi PASS cho 180 ca cấp–ngôn ngữ và 10 phần nguồn hiện hành. Prompt/teaching/answer ghép ruby chính xác với Nhật hiện hành, token Hán tự có readingKana; 12 bản dịch hiển thị theo ngôn ngữ, đáp án ẩn trước khi mở, mở/đóng đúng và cách ly bài/cấp. Đây là kiểm hành vi/phiên bản; không thay cho rà ngữ nghĩa dịch hoặc phát âm bản ngữ.

Mọi lệnh của luồng đã kết thúc. Không có tiến trình nền. Các stderr tạm do luồng tạo đã dọn, không xóa nguồn hoặc kết quả của luồng khác.

### Sửa phạm vi cấp theo lịch học thực tế

Sau kiểm lịch toàn cục, chủ sở hữu sửa `agr-reader-a-above-below-environment` từ hai cấp về chỉ cấp2, đúng ngày `agr-2-w53`; cấp1 trước đó không có ngày học tương ứng. Đã chạy lại tám ID với runtime cuối cùng: **180 ca đạt**, 10 phần nguồn hiện hành. Kết quả 192 ca trước sửa không còn được dùng làm kết quả nghiệm thu cuối cùng. `activity-host-validation.json` hiện ghi hash runtime và 180 ca sau sửa. Sửa metadata bằng chứng hình lúa không thay đổi component/asset và không cần lặp kiểm hình.
