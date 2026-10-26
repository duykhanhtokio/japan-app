# Nhà hàng / 外食業 — checkpoint 2026-10-26

## Lô10 —5 bài nấu ăn11–15 ×12ngôn ngữ,6AI song song

Nhánh được người dùng cho phép: `duykhanhtokio/japan-app`, `feature/restaurant-20261026`. Base đã WORK PERSISTENCE PASS: `d7335160d9ac33e189f112eb5e6bb2b54e4e072b`. Lô10 chỉ lưu bền sau khi commit remote được fetch và đối chiếu thành công.

- Thêm60 bản dịch cook11–15 đủ12locale,264đoạn và toàn bộ tiêu đề/mục tiêu/thuật ngữ/tóm tắt/hoạt động. Bài12 và14 có5đoạn; các bài khác4đoạn. SáuAI tác giả và rà chéo độc lập;60hash toàn bộ bản dịch khớp review cuối.
- Rà chéo đã làm rõ tên máy đóng gói chân không Nepal, dụng cụ đánh trứng Khmer, tray chữ nhật/vuông Indonesia, display Filipino và vật liệu dụng cụ. Giữ đủ danh mục máy/dụng cụ,6nhóm máy,3mục mỗi nhóm và300gram; giữ các điều kiện an toàn/nhiệtđộ/khối lượng/dung tích. Native/domain/human false.
- Tổng482 bản dịch bài:12locale mỗi40;hi/bn41. Giữ192 bản dịch câu. Toàn kho120bài/984câu vẫn chưa dịch đủ. Mỗi shard chỉ thêm đúng5bài; mọi record cũ/questions/ui giữ nguyên.
- Cấu trúc PASS;complete FALSE; sàng lọc số5260trường PASS. Các số viết bằng chữ đã được peer review; numeric screen không chứng nhận nghĩa.
- Browser PASS:60cặp mới ×2kích thước=120trường hợp, ngoài mẫu12locale; ảnh chụp chọn cook14, báo cáo locale-browser-qa.json. Dùng presentation/storage adapters; chưa Expo/native/thiết bị thật.
- Giữ120 bài Nhật (59/61),800 câu luyện tập và184 câu tuần (96/88). Glossary692/692 có giải nghĩa;うぐいす骨 chỉ có định nghĩa hẹp theo nguồnふぐ, quan hệ sơ đồ cá chung còn chưa rõ.
- Không đổi UI JLPT/ngành song song. Còn độ bao phủ nguồn, phần lớn bản dịch, hình/furigana và native QA. Không có tác vụ chạy ngầm sau phiên.

Điểm tiếp tục: cook16trởđi theo12ngôn ngữ; vệ sinh16 cho10locale còn thiếu (hi/bn đã có); rà bao phủ nguồn, hình/furigana và app thật. Không coi số bản dịch là chứng nhận chuyên môn/người bản ngữ.

---
## Checkpoint lịch sử trước lô tiếp nối

## Kiểm tra tiếp nối — 2026-10-26 (lô chưa commit)

Đã xác minh bằng GitHub connector: remote `feature/restaurant-20261026` có commit `3ebe00fb0ce6b57891e3c0377e06564d8a579d56`. Các số liệu bên dưới của checkpoint ban đầu thuộc commit này; dòng “chưa đẩy” bên dưới là lịch sử đã lỗi thời đối với riêng commit này.

Working tree chứa lô tiếp nối chưa commit: 120 bài (59/61), 20 bộ luyện tập ×40 =800 câu, 104 câu tuần (96/8). Không coi lô này là đã lưu remote. Đã chuẩn hóa lại hash của bản Nhật và manifest bằng normalize.py; không gắn lại hash bản dịch. Kiểm tra cấu trúc PASS, completeness FALSE (19 nhóm thiếu); sàng lọc số 252 bản dịch bài +192 bản dịch câu/3360 trường PASS, không chứng nhận ngữ nghĩa. Fixture chuẩn bị API PASS 6 trường hợp; JLPT UI lock PASS 10/10; git diff --check PASS.

Còn thiếu kiểm tra tuần 2号, bản dịch đầy đủ 12 ngôn ngữ, bao phủ kiến thức/hình/furigana và kiểm thử native. Cần rà soát toàn bộ thay đổi đang chờ trước commit/push. Không có tác vụ chạy ngầm sau phiên. Giữ nguyên mọi thay đổi có sẵn.

Trạng thái: ĐANG THỰC HIỆN. Lô này đã được tích hợp và kiểm tra trong nhánh riêng `feature/restaurant-20261026`; chưa được đẩy lên remote, chưa cài vào app trên Mac của người dùng. Không có chứng nhận người bản ngữ hoặc chuyên gia.

## Nội dung hiện có

| Hạng mục | 1号 | 2号 |
|---|---:|---:|
| Bài Nhật đã biên soạn | 55 | 40 |
| Tuần theo lịch hiện tại | 11 | 7 |
| Đoạn kiến thức/quy trình/lỗi/tình huống | 227 | 160 |
| Thuật ngữ có cách đọc | 205 | 120 |
| Bộ luyện tập hoàn chỉnh ×40 câu | 3 | 3 |
| Câu luyện tập | 120 | 120 |
| Kiểm tra tuần đã có | Tuần1,8câu | Tuần1,8câu |

Tổng95 bài,240 câu luyện tập và16 câu tuần. Đây là bài luyện tập của app, không công bố là cấu trúc thi chính thức. Thời lượng30phút/ngày là mục tiêu thiết kế, chưa được đo thực nghiệm với người học.

Đã đối chiếu7PDF/271trang, phân biệt trang PDF/trang in và lưu SHA256.639 mục nguồn có quan hệ phân cấp, không phải639 kiến thức độc lập:6 định nghĩa được xác minh trong phạm vi hẹp;590 còn thiếu chi tiết;39 mục cấu trúc;4 mục chưa có bài tương ứng. Chi tiết tại `source-review.json` và `knowledge-ledger.json`.95 bài đã liên kết ngược tới các mục nguồn theo chủ đề; liên kết này không phải chứng nhận bao phủ đầy đủ.

## Bản dịch

Đã dịch đủ5bài đầu của mỗi cấp cho12 ngôn ngữ.142 bản dịch bài học có đủ tiêu đề, mục tiêu, mọi đoạn, thuật ngữ, tóm tắt và hoạt động; mã băm khớp bản Nhật hiện tại.

| Ngôn ngữ | Bài đã dịch |
|---|---:|
| en,vi,id,zh-CN,zh-TW,ne,my,th,km,tl | Mỗi ngôn ngữ10 |
| hi,bn | Mỗi ngôn ngữ21 |

Còn998 cặp bài/ngôn ngữ đối với95bài hiện tại; chưa có bản dịch câu hỏi. Mục tiêu nguồn có thể cần thêm bài. Chỉ một phần nhãn giao diện đã được dịch. Đã sửa thiếu điều kiện nhiệt độ/thời gian của Anisakis trong ne/my và kiểm tra lại hoạt động bài vi khuẩn. Sàng lọc chữ số142bản/1136trường đạt; kết quả này không thay thế rà soát nghĩa, đơn vị hoặc chuyên môn.

## Hình và furigana

Có4 sơ đồ2D màu bằng mã với nhãn12ngôn ngữ;2 ảnh nguyên bản tạo bằng built-in imagegen (khay thịt và dụng cụ nhà bếp), chú thích12ngôn ngữ. Ảnh được dùng đúng bài và giữ đầy đủ khung bằng contain. Danh mục: `illustration-register.json`, `raster-illustration-register.json`.

Prompt ảnh:3khay riêng chứa gà/bò/lợn trên nền ivory, không chữ;5dụng cụ riêng gồm phới/muôi/kẹp/rây/nhiệt kế tâm với màn hình trống, nét2D màu, không chữ. Nguồn tài sản: `assets/restaurant/meat-trays-v1.png`, `assets/restaurant/kitchen-tools-v1.png`. Không dùng hình gốc PDF. Chưa đủ toàn bộ hình nhận dạng nguyên liệu, bộ phận, dụng cụ và kiểu cắt.

Furigana hiện gồm thuật ngữ do tác giả cung cấp và các ứng viên từ điển offline có căn chỉnh chính xác. Không cắt tùy tiện một cụm kanji chưa biết thành các cách đọc nhỏ có thể sai. Còn nhiều cụm chưa có cách đọc và cần rà ngữ cảnh; tuyệt đối không đánh dấu furigana hoàn thành.

## Tích hợp và kiểm thử

Luồng: ngành→cấp→tuần→ngày→bài; tab tuần/luyện tập riêng. Nhật trước, dịch bằng nút, hoàn thành quay về lịch. Khóa lưu riêng theo ngành/người học/cấp/phiên bản; bài thi còn gắn revision. Hỏng bản ghi không bị âm thầm ghi đè. Ghi nối tiếp giữ câu trả lời mới nhất khi bấm nhanh. Chỉ hiển thị kết quả/đáp án sau nộp. Tải dữ liệu khi cần theo cấp/ngôn ngữ thay vì đánh giá toàn bộ kho khi mở màn chọn cấp.

- Cấu trúc nội dung: PASS, hoàn thành toàn bộ: FALSE.
- Trạng thái lưu/khôi phục/chấm điểm:10 nhóm kiểm tra PASS.
- Tải dữ liệu theo nhu cầu và chặn bản dịch cũ:6 nhóm PASS; chưa đo thời gian khởi động thực tế.
- Browser React/ReactNativeWeb:4 kích thước390×844,844×390,768×1024,1440×900;12 ngôn ngữ có bản dịch;8trường hợp hình thật;4sơ đồ; lưu lỗi/thử lại/khôi phục/phân cấp/nộp/chấm điểm PASS.
- Kiểm tra hook khi đổi khóa trong lúc ghi cũ chưa xong: PASS; giữ đúng bản ghi lỗi cần lưu trữ.
- JLPT approved UI lock:10/10 PASS; không đổi tệp khóa.
- Không có chuỗi40ký tự liên tiếp trùng nguồn trong899trường đã sàng lọc; không coi đây là chứng nhận độc lập về cách diễn đạt.
- Chưa chạy full TypeScript/Expo/native Simulator trong môi trường này. Browser dùng adapter cho tranh Royal/nền/safearea/AsyncStorage, có dùng ảnh nhà hàng thật. Không công bố đã kiểm tra app thật trên thiết bị.

Lệnh xác minh chính: `python scripts/restaurant/check.py`; thêm `--complete` phải báo chưa đạt cho tới khi hết thiếu sót. `python scripts/restaurant/check-translation-numerics.py`; `NODE_PATH=<qa-deps>/node_modules node scripts/restaurant/check-state.cjs`; `... node scripts/restaurant/check-loading.cjs`; `... node scripts/restaurant/check-record-scope.cjs`; `... node scripts/restaurant/check-browser.cjs` với biến môi trường đường dẫn Chromium/font/output.

## Điểm tiếp tục

1. Giải quyết quyền đẩy nhánh mới và xác minh remote trước khi làm thêm lô lớn. Automatic approval review đã chặn push vì chưa có quyền rõ ràng cho destination/nhánh nhà hàng; không thử đường vòng.
2. Xử lý4 mục chưa có bài và12 nhóm còn thiếu chi tiết trong source-review, bao gồm người phụ trách vệ sinh,検食, các điều kiện riêng của trứng/gan, nhóm nguyên liệu/thuật ngữ và nội dung pháp lý cần nguồn hiện hành.
3. Bổ sung560 câu luyện tập để đạt800; thêm kiểm tra16tuần còn lại. Liên kết ngữ nghĩa câu hỏi với knowledge-ledger và rà đáp án/tính toán độc lập.
4. Rà nghĩa/độ bao phủ bản Nhật rồi dịch tiếp12ngôn ngữ, gồm câu hỏi/giải thích/toàn bộ nhãn. Không tự gắn hash mới cho bản dịch của nội dung cũ.
5. Bổ sung hình nhận dạng, hoàn thiện furigana đúng ngữ cảnh, kiểm tra native/Expo/thiết bị và hiệu năng thật.

Không có tác vụ được công bố chạy ngầm sau khi phiên kết thúc. Dữ liệu nông nghiệp/thực phẩm ở worktree khác được giữ nguyên. Base của nhánh này: a1c25940a7167cbdf2db2a4df4f317c4ff6dadbe.
