# Nhà hàng / 外食業 — checkpoint 5, 2026-10-27

Toàn bộ mô-đun CHƯA hoàn tất. Base remote đã xác minh WORK PERSISTENCE PASS cho46files: `7fb919bb54ae98dfbd0e5b10568926a78b09e221`. Nhánh riêng `feature/restaurant-20261026`; snapshot này cần commit/ref/fetch/persistencegate trước khi công bố lưu bền vững.

- ĐỦ496/496câu1号 cho TẤT CẢ12locale:400practice+96weekly. Tổng7968/11808bản câu, thêm6012trongphiên. Còn3840cặp câu2号.120bài Nhật/1440bản dịch bài/73nhãnUI×12 giữ đủ.
- Số câu mỗi locale:en/vi624;hi/bn744;id/tl624;my/ne504;th/km504;zh-CN/zh-TW984. Glossary2768/8304: en,vi,zh-CN,zh-TW mỗi locale đủ692term+definition; còn5536cặp cho8locale khác.
- Rà sâu phát hiện objective bị dịch thànhtopic chung dù hashkhớp. Sửa1360objective hi/bn/my/ne bằng EXACT Japanese text match và lesson sourceHash; không suy diễn theotopic/không gắn lại hash. Tác giả sửa200objective th/km121–220. Scriptalign-question-objectives.py có7regressionPASS; dry-run12locale sau sửa báo0changes. Mỗi locale có120lessonobjective khác nhau, bảo toàn120sự phân biệt nguồn.
- Sửa myq156 để tránh nhập nhằng『bên nào/bên trái』; neq400 giữ đúng nghĩa『không tránh kính mà chạy』. Sửa dấu cách công thức en/viq102 để100và160,000không bị đọc thành100.160. Khôi phục lookupkey有効照射 bị thay nhầm ởhi/bn, giữ nguyên bản dịch. Không đổi Japanese/đápán/hash.
- Ghép88weekly+80practice mới mỗi th/km từ3map disjoint của3AI; không ghi đè giữaAI. Toàn bộ các lônháp đã tíchhợp.
- Numeric7968câu+2768glossary+1440bài PASS; signedCelsius386trường PASS.77đối chiếu số mới khớp exactfieldhashes. Lựa chọn không rỗng/trùngNFKC; không replacement/private-usechars. Kiểm1956recordgốc từ8aba: chỉ12stem/hashq034thay đổi có chủđích; bài/UI/cácfieldgốc khác giữ nguyên.
- TypeScript nhà hàng0lỗi, browser4viewports/12locale và glossary24cases đã PASS ởcheckpoint4; lô5chỉ sửa data/Python, không tuyên bốnative/productionExpo. JLPT UI giữ khóa.

Còn3840cặp câu2号,5536cặp glossary; source590partial, toàn văn furigana/hình nhận dạng/productionExpo/native chưa hoàn tất. Giữ acceptanceflags chưa đạt ởfalse. SáuAI đã dừng ghi. Không có cam kết chạy nền sau phản hồi.

Tiếp theo:2号en/vi/id/tl từq121;hi/bn từq241;my/ne/th/km từq001;weekly2号tuần02–11 của10locale;glossary8locale vàsource/hình/furigana/thiếtbị. Objective phải dịch đúng canonical text:120/125câu nguồn trùngexactlessonobjective,5câu tổng quát riêng; tuyệt đối không thay bằngtopic.

---

# Nhà hàng / 外食業 — checkpoint 4, 2026-10-27

Toàn bộ mô-đun CHƯA hoàn thành. Base đã xác minh remote và WORK PERSISTENCE PASS35files: `e429ff6949ed871c2b3206c94def5304ff660d78`, nhánh riêng `feature/restaurant-20261026`. Snapshot này chỉ thành checkpoint bền vững sau GitAPI commit/ref khôngforce, fetch và persistencegate.

- Giữ120bài Nhật,984câu (800practice+184weekly),1440bản bài và73UI×12locale. Thêm2360bản câu từ checkpoint3; tổng6616/11808, tăng4660trongphiên. Còn5192cặp câu chưa dịch.
- Theo locale: en/vi600;hi/bn624;id/tl504;ne/my360;th/km236;zh-CN/zh-TW984. Toàn bộ1号 đã đủ cho8locale:en,vi,id,tl,hi,bn,zh-CN,zh-TW. Hai bản Trung đã đủ toàn984câu.
- Thêm2768bản thuật ngữ+định nghĩa, đủ692mục cho mỗi en,vi,zh-CN,zh-TW. Còn5536cặp glossary cho8locale khác. Mọi hash khớp định nghĩa Nhật hiện hành; không có chứng nhận người bản ngữ/chuyên gia.
- Làm rõ stem câu rst-1-q034: hỏi nội dung sửa lời giải thích sai, giữ nguyên4lựa chọn/đáp án/giải thích. Cả12bản dịch stem đã đối chiếu và gắn hash mới. Exam revision thay đổi đúng thiết kế; không gắn lại hash mù cho nội dung dịch cũ.
- Đưa ruby căn chỉnh của487tiêuđề đoạn vào renderer hiện có; thêm4cụm tiêuđề đọc nguyên cụm. Mọi hash ngữ nghĩa bài học giữ nguyên. Tổng150cụm đọc mới trongphiên;7358trường ruby có4348trường còn kanji chưa được phủ, không coi fullfurigana hoàn tất.
- Mở rộng sàng lọc số/nhiệtđộ sang glossary;3ca regression gồm phát hiện đổi75→74và mất dấuâmPASS. Numeric6616câu+2768glossary+1440bài PASS, signedCelsius328trường PASS.26trường ký hiệu số mới có adjudication gắn exactsource/translationhash.
- Bắt lỗi lựa chọn dịch rỗng/trùng theoNFKC/casefold; toàn kho hiện không cóflag. Giữ lựa chọn Nhật khi chính khác biệt hình thức kínhngữ là đối tượng câu hỏi, thay vì dịch mất sự phân biệt.
- TypeScript phạmvi0lỗi; browser4viewports/12locale/calendar/submission/results/8raster/4diagram PASS sau bổ sung ruby. Glossarybrowser24cases/692entries/3308assertions/92paginationclicksPASS. Dùngadapter chrome/storage/background, chưa productionExpo/native; ảnhQA chỉ ởscratch.
- Kiểm toàn bộ record cũ theo base: chỉ12stem/hash q034 thay đổi có chủđích; mọi bài/UI/câu cũ khác giữ nguyên; không đổi đáp án hoặc thứtự lựa chọn Nhật. JLPT UI giữ khóa.

Còn5192cặp câu,5536cặp glossary, nguồn590partial, fullcontextfurigana, hình nhận dạng và productionExpo/native. Không nâng các cờ acceptance chưa đủ chứng cứ. SáuAI đã tạm dừng ghi để qua cổng lưu; một số lônháp2号 đang ởscratch, chưa tíchhợp không được cộng số liệu. Điểm tiếp tục: câu2号 củaen/vi/id/tl/hi/bn; hoàn1号củamy/ne/th/km; glossary8locale còn lại; ràsource/hình/furigana/thiếtbị.

---

# Nhà hàng / 外食業 — checkpoint 3, 2026-10-27

Trạng thái toàn bộ: CHƯA HOÀN THÀNH. Nhánh riêng `feature/restaurant-20261026`, base remote đã kiểm chứng `8aba68bf58b1e8c503e3ab569c58f96831edc8b2`. Bản ghi này cần qua Git API commit, cập nhật nhánh không force, fetch và WORK PERSISTENCE PASS mới là bằng chứng lưu remote.

- Giữ120bài Nhật,800câu luyện tập+184câu tuần,1440bản dịch bài và73nhãnUI×12locale.
- Thêm2300bản dịch câu hỏi; tổng4256/11808, còn7552. en/vi416; zh-CN/zh-TW904; hi/bn296; id/tl236; ne/my160; th/km116 mỗi locale. Tất cả1956bản câu cũ và1440bản bài cũ bảo toàn nguyên vẹn theo so sánh toàn record.
- Bổ sung146cách đọc nguyên cụm/dạng chia động từ. Không dùng fallback『行った/行って』vì có hai cách đọc; dùng cụm đủ ngữ cảnh.6871trường ruby căn chỉnh, số trường còn kanji chưa có cách đọc giảm4625→4207.23ca self-test PASS. Nội dung Nhật, hash, đáp án và thứ tự lựa chọn không đổi ngoài furigana.
- Sàng lọc số và Celsius PASS;14trường en/vi có đối chiếu ký hiệu số theo exact field hashes. Đây không phải chứng nhận toàn bộ nghĩa/an toàn.
- Browser React/NativeWeb dùng adapter:4kích thước,8caảnh thật,4sơđồ,12locale đọc bài và12luồng lịch/nộp/kết quả PASS. Phát hiện thiếu font gây ôvuông ở harness, bổ sung đủ5fontscript để kiểm tra và bắt buộc script dừng nếu thiếu font. Kiểm cmap5ngônngữ không thiếu glyph trong tập ký tự được kiểm. Hình chụp QA ở scratch; không công bố là native/productionExpo.
- TypeScript phạm vi nhà hàng và dependency:0lỗi; loading13nhóm,state10nhóm,hook scope3nhóm PASS; JLPT UIlock10/10 PASS.
- Còn7552cặp dịch câu hỏi,8304cặp định nghĩa glossary,590mục nguồn partial, toàn văn furigana/hình/productionExpo/native và rà soát chuyên môn/người bản ngữ. Giữ mọi cờ duyệt thật ởfalse.

Điểm tiếp theo: hoàn tất80câu tuần2号 còn thiếu cho mỗi bản Trung, rồi glossary; tiếp tục câu thiếu của10locale khác. SáuAI tạm dừng ghi để checkpoint, chỉ tiếp tục sau khi root xác minh lưu remote.

---

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
