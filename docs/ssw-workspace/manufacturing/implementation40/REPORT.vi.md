# Thực hiện các mục 2–6 — 31/10/2026

Phạm vi: triển khai các sửa đổi đã xác định trong đợt đối chiếu nguồn39. Đợt này không chứng nhận hoàn tất phân rã toàn bộ574 trang; biên bản nguồn39 vẫn giữ nguyên giới hạn đó. Sáu luồng dùng chung mã bài, mã câu và hash nguồn, không cộng trùng quyết định kế thừa.

## 2. Giải thích đáp án

Đã tích hợp116 giải thích riêng cho từng lựa chọn của29 câu (8 câu thước cặp,21 câu nhận diện cơ khí). Có1.392 trường lý do ở12 ngôn ngữ đích; giữ mã câu và đáp án đúng. Đối chiếu với ảnh đang dùng và nguồn được ghi trong assessment/. Không chèn đáp án vào chú thích ảnh trước khi nộp.

## 3. Câu hỏi trùng

Đã viết lại3 nhiệm vụ: sai số thước cặp và thiếu tiêu chí chấp nhận; mất điện/khôi phục điện ở mạch tự giữ; đổi dấu điện tích trong tương tác Coulomb. Hai cặp khác giữ lại có lý do sư phạm trong final-authoring.json. Bản dịch3 câu có324 trường ở12 ngôn ngữ. Ba mã câu xuất hiện trong4 đề mô phỏng nên4 phiên làm bài cũ bị từ chối; các phiên không đổi được bảo toàn. Sửa lý do đơn thuần không xóa đáp án đã lưu.

## 4. Hình theo ngày học

262/262 ngày lõi có hình gắn với trọng tâm bài: cơ khí91, điện–điện tử98, xử lý bề mặt73. Có252 cặp SVG/PNG kỹ thuật mới và10 hình hiện hữu được tái sử dụng. Hình mới có kích thước1400×900; nguồn dựng SVG được lưu để kiểm tra và chỉnh sửa. Không dùng bảng chữ thay cho hình thiết bị/sơ đồ. Giữ các hình bổ sung hiện hữu, hỗ trợ phóng lớn tối thiểu bằng bề rộng nguồn. Tổng PNG được liên kết17.334.729 byte; tải theo bài thay vì nạp toàn bộ khi import.

Chú thích và mô tả thay thế tái sử dụng chính xác tiêu đề/tóm tắt đã dịch có đối chiếu hash:6.288 trường ở12 ngôn ngữ. Chữ kỹ thuật nằm bên trong ảnh vẫn là tiếng Nhật; đây chưa phải bộ ảnh được bản địa hóa toàn bộ nhãn.

## 5. Thuật ngữ và dịch thuật

Đã đối chiếu12.924 định nghĩa, đủ1.077 mục mỗi ngôn ngữ, không còn mục chưa đọc trong phạm vi thuật ngữ. Đã áp dụng124 bản sửa có điều kiện (gồm3 nghĩa Nhật và121 giá trị ở ngôn ngữ đích); biên bản hợp nhất nằm trong language/ cùng term-corrections.json. Đối chiếu từng định nghĩa với tiếng Nhật và ngữ cảnh bài; mỗi thay đổi kiểm tra mã bài, chỉ số thuật ngữ, nguồn, câu chữ trước/sau. Các mục cần làm rõ được giữ thành danh sách riêng; không tự xem là đã được chuyên gia duyệt.

Phạm vi kiểm tra ngữ nghĩa đợt này là1.077 mục thuật ngữ ×12 ngôn ngữ, cùng bản dịch mới của32 câu sửa đổi. Không tuyên bố đã đọc lại toàn bộ207.600 trường văn xuôi đã có. Ba định nghĩa Nhật được làm rõ theo ngữ cảnh (端数,質量,ビッカース硬さ), có bản điều chỉnh tương ứng ở12 ngôn ngữ.

## 6. Kiểm thử và giới hạn nghiệm thu

Bộ kiểm tra manufacturing tổng thể và kiểm tra tái áp dụng snapshot đạt PASS. Các receipt tái chạy nằm trong qa/ và integration/. Kiểm thử dùng component Reader/Attempt/MockAttempt thật với bộ chuyển đổi React Native, lưu trữ và trang trí được khai báo rõ. Đã kiểm tra3.406 tổ hợp ngày/ngôn ngữ,39 luồng bài kiểm tra và39 luồng đề mô phỏng,377 luồng lý do,39 luồng câu mới;384 bản dịch câu và1.280 trường hợp từ chối hash/nội dung/ngôn ngữ sai. Liên kết hình được kiểm tra bytes, kích thước, hash, tải lười và4.978 trường hợp từ chối dữ liệu sai. Các con số mô tả những phép kiểm tra khác nhau, không cộng thành số người dùng hoặc số bài độc lập.

Kiểm tra pixel độc lập lấy mẫu36 hình; tác giả hình có biên bản rà soát riêng. Đây chưa phải chứng nhận chuyên gia cho cả262 hình hoặc hình thiết bị thật. Mạch song song surface-042 đã được sửa và xem lại sau khi phát hiện nhánh hở.

Không có nghiệm thu trên điện thoại thật, của chuyên gia hoặc người bản ngữ. adb/xcrun không có; Chromium thất bại trước khi tạo trang do quyền socket; CUA thất bại do hệ thống tệp bwrap chỉ đọc. Không dùng SSR thay cho kiểm tra bố cục trình duyệt/thiết bị. Trạng thái phát hành và nghiệm thu con người tiếp tục là chưa đạt.

## Truy xuất và tái dựng

- assessment/: nguyên bản/câu sửa, lý do và biên bản đối chiếu.
- mechanical/, electrical/, surface/: liên kết ngày–bài–ảnh–nguồn và kiểm tra hình.
- terminology-*/ và language/: quyết định ngữ nghĩa, đề xuất trước/sau và biên bản hợp nhất.
- integration/: đầu ra compiler, snapshot tái áp dụng có kiểm tra hash.
- qa/: kiểm thử và giới hạn môi trường.

Dữ liệu nguồn và mã tiến độ lõi được giữ nguyên; các revision mới chỉ áp dụng khi nguyên bản khớp hoàn toàn. Các PDF gốc không được đưa vào kho công khai.

## Hợp nhất cập nhật song song

Đã tiếp nhận commit87a64c6c (khối lượng học và minh họa nghề) trong khi đang xuất bản. Giữ phần bổ sung có đối chiếu nguồn ở144 ngày, cùng toàn bộ dữ liệu và tài sản của các ngành khác. Hình trọng tâm hiện tại dùng bộ262 liên kết40; bộ hình ngày học trước được giữ làm phương án dự phòng khi không có liên kết40 hợp lệ, không hiển thị hai hình trọng tâm trùng nhiệm vụ. Biên bản browser38 ca ở daily-fix-20261031 thuộc phiên trước; không dùng để chứng nhận renderer hợp nhất hiện tại. Các kiểm thử component của đợt40 đã chạy lại sau hợp nhất, gồm1.872 trường hợp phần bổ sung và1.728 trường hợp dịch phần bổ sung. Kiểm tra109 tệp gốc và bộ kiểm tra manufacturing tổng thể đều đạt lại; replay chấp nhận chính xác cả tiền nhiệm cũ và tiền nhiệm upstream.
