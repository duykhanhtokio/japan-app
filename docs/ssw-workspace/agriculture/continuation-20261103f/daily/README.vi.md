# Bộ đọc ngày học — kiểm component và đường hình

Baseline `77af4f21247007bef3bcfa502af34893821a187a`. Phạm vi này không đóng ý nguồn và không rà chéo nội dung của luồng khác.

## Nhóm 1: đường đăng ký hình và pixel có chọn lọc

`check-asset-registry.cjs` đối chiếu literal require của hai component thật với metadata: 230 liên kết/211 đường asset duy nhất, tất cả khớp registry và có trong tree Git. Điều này không chứng minh đủ byte trong checkout sparse hoặc đã nhìn mọi hình.

Đã đọc byte từ checkout cũ chỉ đọc, kiểm SHA-256, giải mã PNG và kích thước, sau đó mở xem ba hình: máy gieo đẩy tay, máy cấy và trồng tay. Đặc điểm ngoại hình nhìn thấy phù hợp phạm vi caption/alt: thùng hạt khác khay cây, thao tác bàn tay khác máy. Không suy cơ cấu bên trong, độ sâu, khoảng cách, số hàng theo thông số hay an toàn thao tác từ hình. Không chuyển hình vào checkout mới, không sao chép PDF và không sửa metadata nghiệm thu cũ. Kết quả: `asset-registry-result.json`.

## Nhóm 2: đường hiển thị component và phóng hình

`check-daily-host.cjs` bundle và chạy component thật `RecognitionImages`, `DailyLearningFigure`, `DailyCompanionReadings` với React test renderer. Cả 369 lượt ngày học có Image node thực trong cây component, tổng 633 lượt hình; source path thuộc registry, resizeMode=contain, alt không trống.

Kiểm thêm component thật `ZoomableFigure` với sáu viewport (điện thoại nhỏ, dọc/ngang, tablet dọc/ngang và desktop) × bốn tỷ lệ hình = 24 ca. Kích thước khung tính toán hữu hạn, dương, giữ tỷ lệ và không vượt bề ngang dự kiến; bật/tắt phóng hình dùng ScrollView ngang đúng nhánh. Không đồng nhất kết quả tính layout với việc đã xem pixel bố cục trên trình duyệt/thiết bị.

Fixture: native Text/View/Image/Pressable/ScrollView là host string; useWindowDimensions nhận viewport định trước; require ảnh trả đường đăng ký, không giải mã byte toàn bộ; selector companion dùng dữ liệu Nhật hiện tại; bản dịch không bật ở nhóm này. Kết quả: `daily-host-result.json`.

Không chạy lại lỗi Chromium đã biết, không cài browser/dependency và không bật cờ thiết bị/thời lượng/bản ngữ/chuyên môn.

## Nhóm 3: hoạt động sau tích hợp

`activity-host-check.cjs --ids <ID mới>` chuẩn bị cho điều phối chạy đúng các hoạt động mới sau khi tích hợp. Chỉ kết quả JSON sinh sau lệnh này mới chứng minh đã chạy; sự có mặt của script chưa phải bằng chứng kiểm đạt. Kiểm phiên bản nguồn, dịch12ngôn ngữ, ghép ruby về Nhật, ẩn/mở/đóng đáp án và cách ly cấp/bài. React Native/appearance/Button vẫn là host fixture.


### Sau tích hợp f

Đã chạy thực tế đúng14 hoạt động mới từ `integration.json.newChecks`:336 ca cấp/ngôn ngữ,14 phần nguồn hiện hành đạt (`activity-host-validation.json`). Không rà chéo ngữ nghĩa bài; kiểm các hành vi/phiên bản ở trên.

Đoạn `agr-facility-env-growth-observation-p4` đã sửa có sourceHash `db0b25aae22d8ba9ab2e8ab1cdeaab27a95461c383ceb5a0e93c689855c9c2a9`. `check-paragraph-ruby-host.cjs` chạy component `AgricultureParagraphRuby` thật:10 ca ở hai cấp xác nhận ruby xuất hiện với bản hiện tại, ghép chính xác thân Nhật; từ chối hash cũ, chữ không khớp, ID đoạn sai và cấp sai, giữ thân Nhật thường. Kết quả `paragraph-ruby-host-result.json`; không chứng nhận phát âm bản ngữ hoặc bố cục pixel.

Kiểm lại riêng hai lượt ngày học của bài nhà kính sau thay phiên bản:8 lượt hình vẫn qua đường component/registry, có alt và contain; không chạy lại367 lượt ngày không thay đổi hoặc24 ca viewport không thay đổi. `daily-host-changed-result.json` gắn hash snapshot sau tích hợp; `daily-host-result.json` vẫn là snapshot ban đầu trước sửa.

Không có tiến trình do luồng này còn chạy. Tệp stderr tạm do luồng tạo đã được dọn, không xóa nguồn hay asset/bằng chứng của phiên khác.
