# Nhà hàng / 外食業 — checkpoint 2, 2026-10-26

Yêu cầu toàn bộ CHƯA hoàn thành. Nhánh `feature/restaurant-20261026`; parent remote đã đối chiếu `fbd2cb2752cc909bbb98618a38d9fc8c95d74921`. Snapshot này phải qua push/fetch/persistence gate; không coi bản ghi này tự nó là chứng cứ remote.

- 120 bài Nhật; 800 câu luyện tập trong 20 bộ và184 câu tuần trong23 tuần. 692 định nghĩa thuật ngữ Nhật.
- Đủ 1440/1440 bản dịch bài (120 cho mỗi12 ngôn ngữ), tăng 530 so với parent. Câu hỏi 1956/11808 bản dịch, tăng 1764. Đủ73 nhãn UI/ngôn ngữ, gồm template đếm có placeholder được kiểm tra.
- en/vi246 câu mỗi ngôn ngữ; zh-CN/zh-TW504; hi/bn96; tl/id76; ne/my40; th/km16. Bản Trung đủ496 câu1号 mỗi ngôn ngữ. Bản dịch được gắn sourceHash chính xác; AI tự rà, không có chứng nhận người bản ngữ/chuyên gia.
- Sửa18 trường dịch Anh/Việt từ rà số liệu/nghĩa, khôi phục điều kiện bị rút gọn, giữ nguyên lựa chọn Nhật khi câu hỏi kiểm tra khác biệt cách nói. Bổ sung156 cách đọc cụm từ; furigana toàn ngữ cảnh vẫn chưa đủ.
- Cấu trúc PASS, numeric screen1440 bài +1956 câu PASS; signed-Celsius184 trường PASS (không chứng nhận toàn bộ an toàn/nghĩa). Rà12 phép tính và nguồn PDF11–16 của運営, vẫn giữ reference unit partial.
- TypeScript phạm vi restaurant và các import:0 lỗi với Expo54/ReactNative0.81.5. Loading13 ca; state10 nhóm; hook scope3 ca PASS. Browser4 kích thước,12 locale,12 luồng lịch/nộp/kết quả dịch PASS. Dùng adapter cho chrome/storage/nền; chưa productionExpo/native. JLPT UI-lock10/10 PASS.
- 6 AI cùng phiên làm trên bản cô lập sau khi phát hiện phiên trước vẫn ghi thư mục cũ; đã giữ/merge các bản cũ khớp hash. Không ghi đè phiên nông nghiệp/thực phẩm.

Còn 9852 cặp dịch câu hỏi,8304 cặp dịch thuật ngữ; rà bao phủ nguồn (590 mục partial), hình nhận dạng, toàn văn furigana và kiểm thử Expo/native. Không nâng acceptance-review thành hoàn thành từ số lượng. Điểm tiếp tục: phần questions thiếu theo locale; glossary692×12; xem validation-report.json và completion2-*.json. Các AI đang tạm dừng ghi để qua cổng lưu bền vững.

---
## Checkpoint trước (lịch sử)

# Nhà hàng / 外食業 — tiếp tục hoàn thiện toàn bộ

Base đã WORK PERSISTENCE PASS: `bb9060f48d994c8e12f30f42f89d88fd3db16c66`; branch `feature/restaurant-20261026`. Người dùng yêu cầu6AI và hoàn thiện toàn bộ trong phiên; snapshot này CHƯA hoàn tất toàn bộ.

- Snapshot01 thêm368bản bài, tổng910; số theo locale và exactrecordhash ở completion-snapshot-01.json. Đang dịch các bài còn thiếu; câu hỏi vẫn192bản, glossary chưa dịch.
- Giữ mọi bản dịch cũ/questions/ui; bản Nhật svc21 sửa8phút mỗi vai thành8phút tổng hai vai, hoạt động7+8+8+7=30phút; tác giả đọc lại và dịch theohashmới.
- Tích hợp glossary translation theohash định nghĩa hiện hành; từ chối bản cũ/thiếu. Loading9casesPASS; glossary24browsercases/692entriesPASS, không phát hiệnreadingcandidatecơ học. Sửa falsepositive punctuationreading trongvalidator.
- Rà4mụcnguồn trướcđây chưa liên kết với bài hygiene15/16 và câu tương ứng. Tổng10mục covered,590partial,39structural; toànnguồn chưa hoàn tất. 7PDFbytehash khớpnguồn cũ, PDF2hygiene11 đọc bằnghình.
- Native/domain/human false; chưa productionExpo/native. Fullcontextfurigana/hình/12locale/câu hỏi/UI/semanticcoverage chưa hoàn thành. Không tuyên bốfullcomplete từ số lượng.
- Các reportcompletion củaAI là bản ghi tăng dần; snapshot01 cố định dữ liệu staging, chưa phải independentpeerreview toàn bộ.

Điểm tiếp tục: dịch đủ mọi bài/câu/692thuật ngữ vàUI cho12locale; rà độc lập các bảnmới, số liệu vàresponsive; hoàn thiện nguồn/hình/furigana/native. Không có tác vụ được cam kết chạy ngầm saukhi phiên kết thúc.

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
