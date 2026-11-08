# Tokutei — đồng bộ lịch học và hình minh họa, 2026-11-08

## Thay đổi

- Cả bảy ngành dùng `StudyCalendar`: nông nghiệp, sản xuất, thực phẩm, nhà hàng, khách sạn, xây dựng và介護. Gom ngày học theo thứ tự thành tuần 7 ngày; không thay ID, hash, nội dung bài gốc hay khóa lưu hoàn thành của từng ngành.
- Tuần cuối thiếu bài mới có ngày ôn tập/thực hành được ghi rõ. Bài ôn tập yêu cầu viết lại kiến thức, trình tự và chú ý an toàn của những bài thực sự có trong tuần; không tạo nội dung nghề nghiệp giả hoặc ghi “không có bài học”. Lưu bài viết và kết quả riêng theo người học/ngành/cấp độ.
- Mỗi tuần có nút kiểm tra. Chỉ lấy câu hỏi được liên kết với nội dung đã học trong tuần; không lấy câu hỏi về bài chưa học để đủ số lượng. Nếu chưa có câu hỏi liên kết chắc chắn thì dùng bài viết tự đối chiếu, ghi rõ không tự chấm điểm. Đây không phải đề mô phỏng chính thức hay bằng chứng ngân hàng trắc nghiệm đã đầy đủ.
- Giữ nguyên bài thi tuần介護 và kết quả cũ thông qua callback. Giữ nguyên các đề tổng hợp, ngân hàng kiểm tra và màn hình đọc chuyên ngành.
- `StudyFigure`/`StudyFigureViewer` dùng tỷ lệ ảnh gốc, vùng màn hình được đo thực tế và safe-area. Ảnh đơn mặc định giới hạn chiều cao 260 pt; sơ đồ có thể dùng khung lớn hơn. Khi mở, ảnh vừa màn hình; chỉ phóng 2 lần và cuộn khi người dùng yêu cầu. Các lớp che đáp án, đánh dấu ảnh nông nghiệp và nhãn native介護 vẫn đi cùng ảnh gốc.
- Nối các renderer ảnh chính của cả bảy ngành vào thành phần chung. Giữ các bảng/sơ đồ native cần nhiều chữ ở dạng nội dung cuộn; không ép bảng thành ảnh nhỏ hoặc cắt chữ để vừa khung.
- Header và thẻ ngày dùng cùng lựa chọn tự động/ngày/đêm, cùng palette và khóa lưu có sẵn. Chuẩn hóa lề đọc 16 pt, chiều rộng tối đa 900 pt ở các màn hình khóa học chính. Phân trang danh sách tuần theo nhóm 12 để không dựng toàn bộ lịch dài cùng lúc.
- Khai báo `react-native-svg` đúng Expo SDK 54 (`15.12.1`), `expo-dev-client` và `sharp` kèm lockfile. Cài lại từ đầu sẽ có những phụ thuộc đã gây lỗi trên Mac. Thay đổi native cần build lại trên Mac; không có bằng chứng simulator mới trong phiên này.
- Bổ sung quy tắc Git thường cho thư mục 18 ảnh nông nghiệp đã sửa, tránh đánh dấu chúng thành LFS pointer.

## Một số số liệu đối chiếu lịch

| Phạm vi | Số bài gốc | Tuần cũ | Tuần 7 ngày mới |
|---|---:|---:|---:|
| Nông nghiệp 1号 | 141 | 40 | 21 |
| Nông nghiệp 2号 | 228 | 59 | 33 |
| Nhà hàng 1号 | 59 | 12 | 9 |
| Nhà hàng 2号 | 61 | 11 | 9 |
| Khách sạn 1号 | 25 | Chưa chia tuần | 4 |
| Khách sạn 2号, gồm kiến thức chung | 38 | Chưa chia tuần | 6 |

Số tuần mới gồm ngày ôn tập cuối khóa khi số bài không chia hết cho 7. Sản xuất đưa cả phần hướng dẫn/bổ sung đang có vào lịch, giữ ID và tiến độ cũ. Số liệu trên không khẳng định mọi ngày đều đủ 30 phút; thời lượng thực tế và độ đầy đủ nguồn là một hạng mục kiểm chứng khác.

## Kiểm tra đã thực hiện

- `npm run tokutei:study:check`: đạt. 35 tổ hợp kích thước/tỷ lệ ảnh; lịch 0/1/3/6/7/8/14/17/176 bài; đúng 7 ô mỗi tuần; không mất ID; loại câu hỏi yêu cầu bài chưa học; cú pháp 179 module thuộc bảy ngành và thành phần chung; phụ thuộc native có trong cài đặt.
- Kiểm tra tương tác React với native host giả lập: đạt. Chọn tuần/ngày; ID bài giữ nguyên; không lộ đáp án trước nộp; lưu kết quả; ngày ôn tập tuần cuối; ảnh vừa vùng hiển thị; phóng chủ động và đóng modal. Không phải kiểm tra UI trên iPhone.
- TypeScript cho các thành phần chung với kiểu React Native thật và stub ở biên Royal: đạt. Không phải TypeScript toàn bộ ứng dụng.
- Kiểm tra 18 ảnh nông nghiệp: đạt, 18 ảnh / 6 hình câu hỏi / 11 câu / 54 chú thích / 216 bản dịch.
- `git diff --check`: đạt.

## Giới hạn còn phải kiểm chứng

- Toàn bộ `tsc` không thể kết luận trong sparse checkout: nhiều module dữ liệu không được materialize. Không coi lỗi thiếu module tại checkout này là lỗi của bản GitHub đầy đủ, cũng không báo toàn bộ app đã build đạt.
- Thử mở Chromium cho harness responsive bị môi trường chặn `socket()` trước khi dựng màn hình. Không có ảnh chụp trình duyệt hoặc simulator đạt để tuyên bố hoàn tất kiểm thử thiết bị.
- Cần build lại iOS/Android, mở ngành sản xuất, rồi kiểm tra các reader/thao tác phóng ảnh trên điện thoại và tablet. Không được nhận là đã chạy trên Mac của người dùng.
- Chưa chứng nhận mọi tuần có ngân hàng trắc nghiệm đầy đủ, mọi bản dịch/furigana của phần điều khiển mới hoặc mọi ngày đủ thời lượng mục tiêu. Những tuần chỉ có bài viết phải tiếp tục được thể hiện đúng như vậy.


## Sửa theo phản hồi tiếp theo — 2026-11-08

- Bộ chọn 自動・昼・夜 chỉ do `TokuteiHeader` vẽ. Bỏ bản lặp ở lịch chung và cả hai màn hình thi thử sản xuất; màn hình danh mục ngành không có provider thì ẩn bộ chọn. Thêm kiểm tra để ngăn renderer ngành tự chèn lại bộ chọn.
- `StudyTabs` gom các chức năng học/kiểm tra/luyện tập thành một thanh tab, cùng độ cao và trạng thái chọn; áp dụng cho nông nghiệp, thực phẩm, sản xuất, nhà hàng và介護. Thẻ tuần có một vùng bấm duy nhất với nhãn tuần, chủ đề và tiến độ; bỏ nút viền chữ nhật lồng trong khung Royal. Nút kiểm tra cuối tuần là hành động chính, nút trở về danh sách là liên kết phụ.
- Bài kiểm tra/ôn tập tuần dùng `TokuteiHeader` cố định ngoài vùng cuộn, có `RoyalBackButton` và đúng một bộ chọn chế độ hiển thị. Giữ nguyên câu hỏi, đáp án và cách lưu.
- Tái hiện lỗi tải sản xuất bằng chính `metro/.../collectDependencies`: `Invalid call` tại `source62-bounded.ts`, do `require(row.specialty === ... ? path1 : path2)` không phải đường dẫn tĩnh. Đổi thành các lời gọi `require('./electrical.json')`, `require('./mechanical.json')`, `require('./surface.json')` độc lập; giữ nguyên quy tắc chọn dữ liệu. Đây là lỗi bundler thực tế mà kiểm tra cú pháp/Node trước đó không bắt được.
- Danh mục ngành đã đặt `icon:null` cho sản xuất. Gắn ảnh xưởng/công cụ do dự án đã tạo vào danh mục và phần đầu bộ chọn chuyên ngành, dùng tài sản Git thường đã có, không tạo lại ảnh.
- Kiểm tra Metro: đạt 66 module sản xuất và route, có ca hồi quy xác nhận lời gọi cũ bị từ chối.
- Kiểm tra mở sản xuất: cơ khí, điện và xử lý bề mặt đều mở được bộ chọn → tuần 1 → ngày 1 trong React test renderer, với 117/117/114 tệp nguồn và dữ liệu thật, không có tệp dữ liệu thiếu. Native host và lớp trang trí được mock; đây không phải bằng chứng simulator.
- Kiểm tra tương tác: đạt, gồm đúng một bộ chọn ở màn hình lịch và đúng một Back Royal/bộ chọn trong modal kiểm tra tuần. TypeScript của thành phần chung đạt; kiểm tra toàn app vẫn bị giới hạn bởi sparse checkout như đã ghi phía trên.
- Lần kiểm tra trình duyệt bổ sung không truy cập được server preview nội bộ (`ERR_CONNECTION_REFUSED`). Không ghi nhận hình thức đã được duyệt qua ảnh chụp. Cần mở lại Expo với `--clear` để Metro bỏ trạng thái lỗi bundle cũ; không có thay đổi native dependency trong bản sửa tiếp nối này.


## Sửa theo ảnh chụp 13:36/13:38 — 2026-11-08

- Chủ dự án yêu cầu bỏ toàn bộ chức năng tự động/ngày/đêm. Provider nay dùng cố định nền đọc ivory, không đọc/ghi lựa chọn cũ và không chạy timer theo giờ; không còn bộ chọn trên header hay bài kiểm tra. Header giữ khung navy/viền vàng/chữ sáng, không đổi sang màu giấy do bỏ chế độ đêm.
- Chủ dự án đã chọn hai nút mỗi hàng, dùng đúng mẫu Royal navy/viền vàng/chữ sáng đã có. `StudyTabs` dùng `RoyalButton compact` thông qua `StudyAction`, không tự vẽ thanh nền xám hoặc ô chọn vàng. Nút chức năng Mở/tiếp tục, nộp, điều hướng ở các ngành dùng cùng nút Royal; giữ renderer lựa chọn đáp án/furigana hiện có. `RoyalSurface` chỉ được thêm prop testID, không đổi artwork, bảng màu hoặc font của nút gốc.
- Lỗi thẻ tuần kéo dài gần hết màn hình đến từ `height:'100%'` đặt trên `RoyalContentPanel` trong vùng cuộn. Bỏ chiều cao phần trăm để thẻ dùng chiều cao nội dung; thêm kiểm tra hồi quy.
- Bỏ hình xưởng được chèn riêng bên trong màn hình chọn chuyên ngành sản xuất. Không thay đổi các hình phục vụ kiến thức trong bài.
- Ảnh bìa ngoài danh mục vẫn cần tạo lại theo ảnh bìa các ngành khác. Chưa tạo khi chưa nhìn thấy mẫu: hai ảnh chụp phản hồi là màn hình bên trong khóa học, không phải danh mục bìa; dữ liệu PNG tham chiếu lớn chưa đọc được qua kết nối hiện có. Cần ảnh chụp danh mục hoặc một ảnh bìa mẫu để bám đúng phong cách. Không nhận phần này đã hoàn tất.
- Kiểm tra: cú pháp/thành phần chung và hồi quy chiều cao, không còn điều khiển/timer sáng tối đạt; tương tác và Back Royal đạt; Metro sản xuất và mở ba chuyên ngành đến ngày 1 với dữ liệu thật/native host giả lập đạt. Chưa có xác nhận hình thức trên simulator cho bản sửa này.
