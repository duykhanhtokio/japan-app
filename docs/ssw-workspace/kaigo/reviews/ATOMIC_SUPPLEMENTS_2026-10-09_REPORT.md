# Kaigo — đối chiếu dữ kiện và nội dung tự viết

Chưa chứng nhận đủ mọi kiến thức của tài liệu 276 trang. Tỷ lệ kiến thức gốc vẫn chưa xác định vì danh mục từng dữ kiện toàn sách chưa hoàn tất. Không dùng số trang, số thẻ hoặc số nội dung hiện trong app làm tỷ lệ kiến thức gốc.

## Phần bổ sung hiện hành

79 thẻ gồm 351 ý giải thích và 79 ca tự giải thích, rải trong 40 buổi bổ sung dự kiến 30 phút. Đợt tiếp tục bổ sung 37 ý vào các thẻ nền tảng, giữ mã các ý trước và giữ 40 buổi. Nội dung đã đổi có revision riêng, nên phần tự kiểm của thẻ đổi được lưu theo revision mới; bài lõi và các lượt thi cũ giữ nguyên.

Các bổ sung gồm tác hại hạn chế thân thể, vai nha sĩ và phối hợp gia đình, tên ví dụ dịch vụ, vòng phản hồi chăm sóc, dữ kiện quan sát và phanh, hướng kiểm soát lây, nguồn/phơi nhiễm/PPE, động tác tiếp cận từng vùng tay, cơ học/dụng cụ/sức khỏe nhân viên và nhóm đồ chuẩn bị thảm họa. Có giới hạn áp dụng; không biến ví dụ thành chỉ dẫn chung cho mọi người.

## Bảng ý nhỏ

`foundation-source-atoms-2026-10-09.json` đăng ký 309 dữ kiện/nhãn/quan hệ ở trang in 10–40 và nối từng dòng với mã ý, trường nội dung và buổi trong app. 53 dòng ghi điều kiện hoặc hiệu chỉnh khái quát nguồn. Đây là đánh giá nghĩa ở mức AI biên tập, chưa là xác nhận chuyên môn.

31 trang nền tảng đã xem trực quan; trang 15 không có nội dung dạy mới. Tổng số trang có bằng chứng xem hình chọn lọc trong sổ toàn tài liệu tăng từ 63 lên 94. Hai chi tiết còn mở: ranh giới từng vùng màu với hai mức bỏ sót trên hình tay trang 31; xác nhận từng vật không nhãn trong hình đồ thảm họa trang 40. Đã dạy các vùng tay và nhóm chức năng đồ dùng, nhưng không dùng điều đó để tự đóng hai mục này.

Sổ toàn tài liệu có 276 dòng trang, 159 liên kết mục, 52 mục tiêu ngôn ngữ, 287 bản ghi từ nguồn, 351 dòng ý giải thích, 309 dòng đối chiếu nhỏ và hai mục hình còn mở. Bản ghi từ có alias, không phải 287 khái niệm độc lập. Các trang ngoài phạm vi ý nhỏ nêu trên vẫn cần phân rã và chứng minh tương đương từng dữ kiện.

## Biểu đạt mới và nguồn kiểm bổ trợ

Tự viết giải thích và ca học, dùng giao diện app hiện có. Không đưa PDF, văn bản trích xuất hoặc hình nguồn vào app/repo. Những điểm khái quát chưa đúng ở mọi hoàn cảnh được giới hạn hoặc hiệu chỉnh, thay vì sao chép tuyệt đối: kéo/ma sát, găng cho mọi việc, đối giao cảm/mồ hôi, động mạch và lượng oxy, NREM/REM, tuổi và nguy cơ sức khỏe.

Sàng lọc 588 trường bằng cửa sổ đúng 60 ký tự đã chuẩn hóa với bản trích xuất riêng: không có khớp. Kết quả này chỉ kiểm giống chữ, không chứng nhận bản quyền hoặc duyệt chuyên môn/ngôn ngữ.

Nguồn chính thức bổ trợ đã đọc cho các điểm mới:

- [MHLW — hướng dẫn ngăn hạn chế thân thể, tháng 3/2025](https://www.mhlw.go.jp/content/12304250/001643323.pdf): nguy cơ cho chức năng và tình trạng tinh thần, cách tiếp cận người sa sút trí tuệ.
- [WHO — kỹ thuật vệ sinh tay](https://cdn.who.int/media/docs/default-source/integrated-health-services-%28ihs%29/infection-prevention-and-control/hand-hygiene/gpsc-handrub-wash.pdf): bao phủ các bề mặt, ngón cái/đầu ngón, xả/làm khô hoặc chà tới khô. Không sao chép hình hay bố cục WHO.

## Kiểm chứng và giới hạn

Bộ kiểm dữ liệu bổ sung, liên kết ý nhỏ, bài lõi/session, chiều sâu, sáu đề và khóa giao diện JLPT đều đạt kiểm cấu trúc/hành vi tương ứng. `content.json` byte nguyên so baseline: 56 ngày lõi, 54 bài, 270 câu, sáu đề/180 câu giữ nguyên. Không sửa UI JLPT.

Bằng chứng chạy trình duyệt nằm tại `runtime-tests/2026-10-09-atomic`: KaigoCourse thật qua React Native Web, mọi ý so đúng văn bản, đáp án ẩn trước trả lời, mở đối chiếu, lưu sau tải lại, bài liên quan, bài lõi và thẻ Nhật, ba kích thước màn hình. Bộ kiểm projection xác minh cả bảng HTML và lọc. Đây không phải bản cài Android/iOS hay kiểm toàn Expo Router. Không suy kiểm hiển thị thành chứng minh hiểu đủ kiến thức nguồn.

Duyệt con người, chuyên môn, Nhật/bản ngữ, tải học thực tế và native chưa hoàn tất; `releaseReady=false`. Tài liệu quốc gia 155 trang/713 câu chưa đối chiếu toàn bộ và không là mẫu số của sách chính.

## Điểm tiếp tục

Khép hai chi tiết hình còn mở bằng kiểm trực quan từng vùng/vật, sau đó phân rã khối tinh thần/cơ thể trang 42–66 và tiếp mọi phần còn lại. Chỉ tính tỷ lệ toàn sách sau khi có mẫu số toàn bộ ý gốc và bằng chứng app cho từng ý. Quyền đẩy lên nhánh GitHub đã được người dùng xác nhận; không mở lại yêu cầu quyền cho phạm vi này.


### Đợt tiếp tục phần cơ thể
Đã bổ sung 12 ý, nâng tổng lên 363. Có 40 liên kết dữ kiện/quan hệ nguồn mới, ngoài 309 liên kết nền tảng. Đây là phần thiếu vừa xử lý, chưa là danh mục đầy đủ trang 42–66. Hai chi tiết hình trang 31 và 40 vẫn mở. Chưa tính được phần trăm kiến thức gốc. Kiểm hiển thị bản mới được ghi riêng trong final-projection-evidence.json; kiểm ba viewport, lưu và bài nền trước đó là bằng chứng lịch sử.


### Quyết định bỏ giới hạn tám tuần và phần cơ thể
Lịch hiện hành:136 ngày dự kiến,30phút/ngày,4080phút. Ngày cuối sẽ tăng theo nội dung thiếu; đây chưa là thời gian đủ toàn tài liệu. Một thẻ kiến thức chi tiết mỗi ngày,79buổi. Đề kỹ năng trong lịch chia hai buổi30,tiếp tục cùng lượt; không xem là thi mô phỏng60phút liên tục.
377ý giải thích/79thẻ/79ca. Bảng phần cơ thể42–66 có368dòng,ngoài309dòng nền;40dòng body-gap là lịch sử có trùng phạm vi.108trang đã xem chọn lọc. Không chứng nhận toàn bộ ý sách hoặc tính phần trăm. Hai chi tiết hình31/40 vẫn mở.

- Kiểm thực thi cuối: browser hiển thị đủ377ý/79ngày chi tiết/52nhiệm vụ tiếng Nhật, báo cáo2006dòng; đề chia hai buổi khôi phục câu và đáp án đã chọn; ba kích thước màn hình không tràn,0lỗi JS. Foundation --require-browser PASS309liên kết với hash hiện tại. Đây là bằng chứng hiển thị, không phải chứng nhận toàn sách hoặc chuyên môn.
