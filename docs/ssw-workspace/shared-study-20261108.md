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
