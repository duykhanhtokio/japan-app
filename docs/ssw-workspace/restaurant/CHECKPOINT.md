# Nhà hàng / 外食業 — checkpoint 19, 2026-10-28

Module chưa hoàn tất. Base 53dd16e3e31f5f59c1f89ec41daa8d3968f8a380 đã xác minh remote. Lô này cần qua commit/ref/fetch/persistence gate trước khi báo đã lưu bền vững.

- Năm AI đề xuất 600 cách đọc, rà chéo toàn bộ. Sửa cách đọc 担う, mở rộng một cụm bị tiền tố che, loại một cụm dư và ba cụm không phát sinh token thực tế. Thêm 596 cách đọc có dùng; trường còn kanji chưa đọc 3333→3080/7358, thêm253trường phủ đầy đủ. Số token có đọc 37976→37739 do cụm dài gộp token cũ; không dùng số token làm tỷ lệ hoàn thành. 23self-tests PASS.
- Rà nguồn riêng cho q033: áp dụng hai liên kết chủ đề cùng cấp rst-2-hygiene-k005/k006 theo nguồn2hyg7–8. 120/120bài và984/984câu nay có metadata hai chiều hợp lệ,1401lesson edges+1039question edges. Không chứng nhận mọi chi tiết câu; phần tổng hợp nguy cơ hóa học và các đề xuất liên cấp được ghi riêng,không âm thầm đổisourceRefs/hashes.
- Thêm check-knowledge-links.py vàknowledge-link-report.json: kiểm tra ID,level,liên kết xuôi/ngược,primarylesson vàtổngstatus. Dữ liệu thực PASS;2fixture lỗi ID/thiếu chiều ngược được phát hiện trong bộ nhớ,không sửa dữ liệu đểtest.
- Không nâng coverage:639unit vẫn10covered/590partial/39structural. Rà egg/liver vàAnisakis cho thấy các unit rộng còn chi tiết chưa dạy đủ;không đánh dấu xong chỉ vì tiểu mục đã có. Ghi rõ4câu có giới hạn căn cứ hẹp. Nguồn hãng Testo xác nhận phân biệt nhiệt kế bề mặt/tâm;Osaka Prefecture hỗ trợ quản lý ngày pha chế/hạn dùng,nhưng kết luận không đoán lịch sử là suy luận biên tập được ghi rõ. Xemcompletion19-source-review.json.
- Structural PASS;toàn bộ Nhật ngoài furigana/knowledgeIds,sourceHash,đáp án/options và12file dịch giữ nguyên. Chưa productionExpo/native/device vàchưa duyệt bản ngữ/chuyên môn. Không thayUI/ngànhkhác.
- Tiếp theo:3080trường furigana,đối chiếu590partial vàhình/thiết bị/nghiệmthu. Liên kết chủ đề đầy đủ không phải bao phủ100%kiến thức. Không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 18, 2026-10-28

Yêu cầu đóng cả7hạng mục trongphiên: CHƯA đạt toàn bộ;không nâng cờ nghiệm thu khi thiếu bằng chứng. Base ca6885f5f823d612356cd2e7aecd5b075a3ba260 đã remote-verified. Lô này cần commit/ref/fetch/persistence gate.

- Khôi phục trích xuất7nguồn/271trang;không đồng nghĩa kiểm tra ảnh/toàn bộ ngữ nghĩa. Rà AI chủ đề và ghép metadata hai chiều:120/120bài,983/984câu;1401lesson edges+1037question edges. Giữ nguyên trạng thái639ledger:10covered/590partial/39structural. rst-2-q033 chưa có liên kết hẹp đủ chắc. Metadata section sai lệch và các ngoại lệ nguồn nằm trong report;không sửa nội dung chỉ để khớp nguồn cũ.
- Thêm300furigana candidates đã peer review;readKanjiTokens37240→37976;trường chưa phủ3674→3333/7358. Không chứng nhận đọc đúng toàn bộ.
- Screen984câu:không exact/cosmetic stem duplicate hoặc duplicate options,đáp án246mỗi vị trí;rà16near-duplicatepairs. Chưa duyệt an toàn/toàn ngữ nghĩa. All12locale fields/hashes/ID complete;numeric110868fields PASS,Celsius396fields PASS. Sửa3quote Nhật zh-TW q222 options1–3 註文→注文;không đổi hashnguồn/đápán/thứtự.
- Bổ sung original8vegetablePNG1536×1024 vàcaption12locale,gắn2bài. Xác nhận trướcđây có16cuttingcards ởRestaurantCuttingGuide,báocáotrước đã bỏsót. Hiện3raster+4conceptdiagrams+1cuttingmodule;không fullsourceimagecoverage. Một dòng.gitAttributes chỉ dànhnewassetpersistasordinaryblob.
- Original loading/state assertions PASS quaNodeTypeScriptadapter riêng:23cases.23furigana selftests PASS,structural PASS. Adapter không kiểm tra bundler/browser/productionExpo/native/device/performance. DependenciesExpo/React/esbuild vàbrowserkhôngsẵnsàng;không báo đã test.
- Bảo toàn Nhật ngoài furigana/knowledgeIds,toàn bộsourceHash/đápán/options;11filedịchbyte-identical,zh-TW chỉ3quoteđãrà. Không thayUIlayout/ngànhkhác;renderer chỉthêmassetrequire.
- Hồ sơ7mục:closure-status.json;source-links/audits,question/translation/imageQA vàscopedruntimeevidence. Khôngcopy nguyênPDFtextvàoGit. Sourcequotes trongevidence đượcthaydigest. acceptancefullflags vẫnfalse;native/domain/human review cầnngườiđủchuyênmôn. Còn3333furiganafields,source590partial,hình,thiết bị vànghiệmthu. Không camkết chạyngầmsauphảnhồi.

---

# Nhà hàng / 外食業 — checkpoint 17, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Checkpoint16 đã qua WORK PERSISTENCE PASS 9d4075e71dfd460367814846a3038d1be27a4e1c. Lô17 phải qua commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Sáu AI tiếp tục sáu tập bài/câu, rà chéo480đề xuất và6replacement. Loại6suffix đa nghĩa 時は/時に/物を/物と/後は/後に,thay6cụm đầy đủ đã rà lại;khử trùng vàloại4lexicon đã có,thêm470dictionary candidates theo ngữ cảnh. Không phải duyệt người bản ngữ/chuyên gia.
- readKanjiTokens36729→37240;trường còn kanji chưa đọc3938→3674 trên7358trường;thêm264trường phủ đầy đủ. Không tự đoán kanji đơn đa nghĩa.
- 23self-tests PASS;structural PASS. Đối chiếu Git bảo toàn toàn bộ Nhật ngoài furigana,sourceHash,đáp án/thứ tự lựa chọn;12file dịch byte-identical. Giữ đủ1440bài/11808câu/8304glossary dịch.
- completion17-reading-review.json lưu đề xuất/peer review/rejected suffix/replacements/preservation. nativeReviewed/contextualReviewComplete vẫn false. Chưa productionExpo/native/device;không thayUI/ngànhkhác.
- Còn3674trường furigana,source590partial,hình nhận dạng,thiết bị/hiệu năng và duyệt bản ngữ/chuyên môn. Không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 16, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Checkpoint15 đã qua WORK PERSISTENCE PASS b6e0fec198d061e7ea342e59049c4f71bb3111e2. Lô16 phải qua commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Sáu AI tiếp tục sáu tập bài/câu, rà chéo360đề xuất.354cụm duy nhất,loại3cách đọc lexicon đã có,thêm351dictionary candidates theo ngữ cảnh. Không phải duyệt người bản ngữ/chuyên gia.
- readKanjiTokens36513→36729;trường còn kanji chưa đọc4076→3938 trên7358trường;thêm138trường phủ đầy đủ. Không tự đoán kanji đơn đa nghĩa.
- 23self-tests PASS;structural PASS. Đối chiếu Git bảo toàn toàn bộ Nhật ngoài furigana,sourceHash,đáp án/thứ tự lựa chọn;12file dịch byte-identical. Giữ đủ1440bài/11808câu/8304glossary dịch.
- completion16-reading-review.json lưu đề xuất/peer review/preservation. nativeReviewed/contextualReviewComplete vẫn false. Chưa productionExpo/native/device;không thayUI/ngànhkhác.
- Còn3938trường furigana,source590partial,hình nhận dạng,thiết bị/hiệu năng và duyệt bản ngữ/chuyên môn. Không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 15, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Checkpoint14 đã qua WORK PERSISTENCE PASS 2ddcfa543c26cadf21e3a459e28e9da7bce03d39. Lô15 phải qua commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Sáu AI tiếp tục sáu tập bài/câu, rà chéo300đề xuất.299cụm duy nhất,loại5cách đọc lexicon đã có,thêm294dictionary candidates theo ngữ cảnh. Không phải duyệt người bản ngữ/chuyên gia.
- readKanjiTokens36363→36513;trường còn kanji chưa đọc4180→4076 trên7358trường;thêm104trường phủ đầy đủ. Không tự đoán kanji đơn đa nghĩa.
- 23self-tests PASS;structural PASS. Đối chiếu Git bảo toàn toàn bộ Nhật ngoài furigana,sourceHash,đáp án/thứ tự lựa chọn;12file dịch byte-identical. Giữ đủ1440bài/11808câu/8304glossary dịch.
- completion15-reading-review.json lưu đề xuất/peer review/preservation. nativeReviewed/contextualReviewComplete vẫn false. Chưa productionExpo/native/device;không thayUI/ngànhkhác.
- Còn4076trường furigana,source590partial,hình nhận dạng,thiết bị/hiệu năng và duyệt bản ngữ/chuyên môn. Ổ làm việc báo100%,không xóa dữ liệu người dùng/ngànhkhác. Không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 14, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Checkpoint13 đã qua WORK PERSISTENCE PASS a751ce9c607490d61d8f5c3cb28fb7038ae22480 sau khi khôi phục môi trường. Lô14 phải qua commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Sáu AI tiếp tục sáu tập bài/câu, rà chéo180đề xuất;178cụm duy nhất,loại2cách đọc lexicon đã có,thêm176dictionary candidates theo ngữ cảnh. Không phải chứng nhận người bản ngữ/chuyên gia.
- readKanjiTokens36228→36363;trường còn kanji chưa đọc4248→4180 trên7358trường,thêm68trường phủ đầy đủ. Tính cả lô13 vừa cứu và lô14:419cách đọc mới,168trường phủ đầy đủ thêm từ4348→4180. Kanji đơn đa nghĩa chưa được đoán cách đọc.
- 23self-tests PASS;structural PASS. Đối chiếu Git bảo toàn toàn bộ Nhật ngoài furigana,sourceHash,đáp án/thứ tự lựa chọn;12file dịch byte-identical. Giữ đủ1440bài/11808câu/8304glossary dịch.
- completion14-reading-review.json lưu đề xuất,peer review và preservation. nativeReviewed/contextualReviewComplete vẫn false. Không productionExpo/native/device. Không thayUI/ngànhkhác.
- Ổ làm việc báo100% ởđầuphiên;không xóa dữ liệu người dùng/ngànhkhác. Ưu tiên checkpoints nhỏ đã kiểm chứng. Còn4180trường furigana,source590partial,hình nhận dạng,thiết bị/hiệu năng và duyệt bản ngữ/chuyên môn. Không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 13, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Tiếp từ checkpoint12 đã xác minh remote 4db50a8f2c68461bc0eee04f0f47cc5042f3cf4f. Lô này cần commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Sáu AI làm sáu tập bài/câu và rà chéo toàn bộ 261 đề xuất; hợp nhất 248 cụm duy nhất, loại 5 cách đọc đã có trong lexicon, thêm 243 dictionary candidates theo ngữ cảnh. Không phải duyệt bản ngữ/chuyên gia.
- Chạy lại bộ dựng furigana hiện hữu: readKanjiTokens 35928 → 36228; trường còn kanji chưa đọc 4348 → 4248 trên 7358 trường. 100 trường được phủ đầy đủ thêm. Kanji đơn đa nghĩa vẫn không đoán cách đọc.
- 23 self-tests PASS; structural PASS. Bảo toàn toàn bộ nội dung Nhật ngoài furigana, sourceHash, đáp án và thứ tự lựa chọn; 12 tệp bản dịch byte-identical với checkpoint12. Vẫn đủ1440bài/11808câu/8304glossary dịch.
- Evidence: completion13-reading-review.json gồm đề xuất/rà chéo và preservation. nativeReviewed/contextualReviewComplete vẫn false. Chưa productionExpo/native/device.
- TIẾP THEO: còn4248trường cần furigana theo ngữ cảnh,source590partial,hình nhận dạng,kiểm thử thiết bị/hiệu năng và duyệt bản ngữ/chuyên môn. Không dịch lại phần đã đủ,không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 12, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Checkpoint11 đã qua WORK PERSISTENCE PASS `f6a4ece13acef2032bc4575ed17d4d6f40e7b80a`. Lô cuối cần commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- ĐỦ số lượng bản dịch12locale:1440/1440 bài,11808/11808 câu,8304/8304 glossary,73UI×12. Mỗi locale120bài+984câu+692thuật ngữ và định nghĩa. Không đồng nghĩa được người bản ngữ/chuyên gia duyệt.
- Phiên này thêm4152glossary chohi/bn/my/ne/th/km:1560đãlưucheckpoint11,2592còn lại trongcheckpoint12. Bảo toàn18276record từ39c522f6 và1560glossary trung gian; mọi dữ liệu ngoài glossary giữ nguyên.
- SourceHash4152bản mới khớp định nghĩa Nhật; tất cả692ID glossary có đủ ở12locale. Structural PASS;numerics110868trường PASS;signedCelsius396trường PASS,không có flag mới cần đối chiếu.
- Rà AI độc lập:692ID/hash/trường mỗi6locale và38mục quan trọng mỗi locale(228bản):phủ mẫu phủ định/an toàn,dị ứng,halal,khuyết tật,tuổi20 và công thức tổngdoanhthu/lãigộp.3field mới được làm rõ:termxe lăn tựđẩy hi/bn và mẫu số tổngdoanhthu bn;peer xác nhận đã sửa. Lưu đầy đủ report ởcompletion12-peer-review.json. Không coi đây là duyệt bản ngữ/chuyên môn/toàn bộ ngữ nghĩa.
- Chưa đổi Nhật,đáp án,thứ tự lựa chọn,UI. Chưa chạyproductionExpo/native. Kiểm kê furigana hiện hữu vẫn4348/7358trường còn kanji chưa có cách đọc đầy đủ; không đoán cách đọc đơn lẻ đa nghĩa.
- TIẾP THEO:không dịch lại phần văn bản đã đủ;rà nguồn590partial,hình nhận dạng,furigana theo ngữ cảnh,productionExpo/native/hiệu năng và duyệt chuyên môn/người bản ngữ. Giữ acceptance chưa có bằng chứng ởfalse. Không cam kết tác vụ chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 11, 2026-10-28 (trung gian)

Toàn bộ mô-đun CHƯA hoàn tất. Base remote đã qua WORK PERSISTENCE PASS `39c522f604c6ab45ddc4c897d812a88e8ab986b4`, nhánh `feature/restaurant-20261026`. Lô này phải qua commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Thêm1560 bản dịch glossary:hi360,bn240,my240,ne240,th360,km120. Tổng5712/8304, còn2592 tại snapshot này. Sáu locale en/vi/id/tl/zh-CN/zh-TW đủ692 giữ nguyên.
- Giữ nguyên11808/11808 bản dịch câu,1440 bản bài và73UI×12. Bảo toàn18276 record cũ; mọi dữ liệu ngoài glossary không đổi. Hash1560 glossary mới khớp định nghĩa Nhật.
- Structural PASS; numeric105684 trường PASS; signedCelsius396 trường PASS. Không có flag số cần đối chiếu mới. Các bản mới AI chưa được người bản ngữ/chuyên môn duyệt.
- Sáu child tiếp tục trên fragment riêng theo canonicalindex; dữ liệu chưa ghép không cộng vào snapshot. Điểm tiếp của kho đã ghép:hi/th từ360;bn/my/ne từ240;km từ120. Hợp nhất phần mới theoID/hash, không ghi đè record đã ghép.
- Còn glossary,source590partial,fullfurigana/hình và productionExpo/native. Giữ acceptance chưa đạt ởfalse; không cam kết chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 10, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Base remote đã qua scoped WORK PERSISTENCE PASS `b41bbc29401f1c447903effc9ee41d84f7014c58`, nhánh `feature/restaurant-20261026`. Lô này cần commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- ĐỦ toàn bộ 11808/11808 bản dịch câu cho12locale,984 câu mỗi locale. Thêm1520: en/vi q381–400+weekly02–11;id/tl q341–400+weekly02–11;my/ne/th/km q221–400+weekly02–11. Các ngôn ngữ hi/bn/zh-CN/zh-TW giữ nguyên phần đã đủ.
- Thêm384 thuật ngữ+định nghĩa:192 mỗi id/tl, hiện đủ692/692 mỗi locale. Tổng glossary4152/8304:en,vi,id,tl,zh-CN,zh-TW đủ;hi,bn,my,ne,th,km còn692 mỗi locale.
- Bảo toàn16372 record cũ và metadata ngoài phạm vi.1520hash câu mới+384hash glossary mới khớp nguồn;1520objective chỉ dùng exact objectiveJa với sourceHash bài/câu cũ hợp lệ. Toàn bộ tập984ID câu đầy đủ cho cả12locale.
- Structural PASS; numeric102564 trường PASS;signedCelsius396 trường PASS.146 rà số mới gắn exactfieldhashes, gồm77 trường rà độc lập. Không chứng nhận toàn bộ ngữ nghĩa/người bản ngữ.
- Rà độc lập384glossary của root:hash/trường/không ghi đè và mẫu an toàn/công thức đạt; sửa5field từ ngữ/khoảng trắng (gin,lên men,tuổi20). Làm rõ3field phép năm Việt và đơn vị mỗi suất trong1stem Khmer mới. Không thay nội dung Nhật,đáp án,thứ tự lựa chọn hoặcUI.
- Các child dùng lô40 để vượt giới hạn phiên; phần hợp lệ được giữ và tiếp nối. Tách tên intermediate theo nhiệm vụ sau một va chạm source-extract ởscratch; xác minh cuối theo canonical IDs/hashes, không ghép dựa trên tên tạm.
- Chưa productionExpo/native;giữ acceptance chưa đạt ởfalse. Source590partial,fullfurigana/hình nhận dạng và rà chuyên môn/người bản ngữ vẫn còn dở.
- Điểm tiếp:KHÔNG dịch lại câu hỏi/bài/UI đã đủ. Bổ sung glossary692×6locale hi/bn/my/ne/th/km (4152cặp);rá nguồn/hình/furigana/thiết bị. Không cam kết tác vụ chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 9, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Base remote đã qua scoped WORK PERSISTENCE PASS `9a450967e5fb623bc4d960253355ae98679ed0e9`, nhánh `feature/restaurant-20261026`. Lô này cần commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Thêm 1040 bản dịch câu 2号: en/vi q281–380; id/tl q241–340; my/ne/th/km q121–220; hi/bn q361–400 và weekly02–11. Tổng 10288/11808, còn 1520 cặp.
- Hindi và Bengali đã đủ 984/984 câu mỗi locale, gồm luyện tập và kiểm tra tuần. Nhật/đáp án/thứ tự lựa chọn/UI giữ nguyên.
- Thêm 200 thuật ngữ+định nghĩa mỗi id/tl, hiện 500/692 mỗi locale. Tổng glossary 3768/8304, còn 4536 cặp.
- Bảo toàn 14932 record cũ cùng metadata ngoài phạm vi. Cả 1040 hash câu và 400 hash glossary mới khớp nguồn; 1040 mục tiêu chỉ tái sử dụng qua exact objectiveJa và sourceHash hợp lệ của bài/câu cũ, không thay bằng topic.
- Structural PASS; numeric 91156 trường PASS; signed Celsius 390 trường PASS. Thêm 41 rà soát theo exact field hashes cho chữ số viết bằng từ, đơn vị mỗi suất/đĩa/kg/ngày, dấu thập phân/hàng nghìn và 8割=80% giữ điều kiện tối thiểu. Không chứng nhận toàn bộ ngữ nghĩa.
- Root bổ sung 32 câu weekly10–11 hi/bn, child phụ trách 208 câu còn lại; rà độc lập 32 câu đạt trong phạm vi cấu trúc/số liệu/điều kiện. Sửa từ chỉ đặt chỗ Bengali trong một record mới. Không có duyệt bản ngữ/chuyên gia.
- Chưa production Expo/native; giữ acceptance chưa đạt ở false. Source590partial, full furigana/hình nhận dạng và rà chuyên môn vẫn còn dở.
- Điểm tiếp: en/vi q381; id/tl q341; my/ne/th/km q221 và weekly02–11. Hi/bn đã đủ câu, không làm lại. Glossary id/tl còn192 mỗi locale; sáu locale khác còn692 mỗi locale. Không cam kết tác vụ chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 8, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Base remote đã qua scoped WORK PERSISTENCE PASS `fa4d7f4b8306c5dd8b09e4a8b67e30f4ce39ae61`, nhánh `feature/restaurant-20261026`. Lô này cần commit/ref/fetch/persistence gate trước khi công bố lưu bền vững.

- Thêm800 bản dịch câu2号: en/vi q201–280; id/tl q161–240; hi/bn q281–360; my/ne/th/km q041–120. Tổng9248/11808, còn2560 cặp.
- Thêm200 thuật ngữ+định nghĩa mỗi id/tl, hiện300/692 mỗi locale. Tổng glossary3368/8304, còn4936 cặp.
- Bảo toàn13732 record cũ (bài/câu/UI/glossary);800 hash câu mới và400 hash glossary mới khớp nguồn. Cả800 objective tái sử dụng chỉ từ exact Japanese objectiveJa và sourceHash hợp lệ của bài HOẶC câu cũ; nhóm generic q041–120 không có exact lesson match, không thay bằng topic.
- Structural PASS; numeric83076 trường PASS; signedCelsius386 trường PASS. Thêm7 đối chiếu exact field hashes cho đơn vị mỗi suất/đĩa và dấu thập phân. Rà độc lập hi/bn,my/ne về cấu trúc/số liệu/mục tiêu; không chứng nhận bản ngữ.
- Một child id/tl gặp service capacity; giữ80 dòng Indonesia và phiên tiếp nối hoàn thiện80 Filipino, không khởi tạo lại dữ liệu hợp lệ. Các fragment rời được ghép không ghi đè.
- Không đổi Nhật/đáp án/thứ tự lựa chọn/UI. Chưa kiểm thử productionExpo/native; giữ acceptance chưa đạt ởfalse. Source590partial, fullfurigana/hình nhận dạng và duyệt chuyên môn/người bản ngữ vẫn còn dở.
- Điểm tiếp: en/vi q281; id/tl q241; hi/bn q361; my/ne/th/km q121; weekly2号tuần02–11 và glossary8locale. Không có cam kết tác vụ chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 7, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Tiếp tục từ base remote đã qua scoped WORK PERSISTENCE PASS `a1720c6827029b288beb107d73562593bd303d55`, nhánh `feature/restaurant-20261026`. Checkpoint này chỉ lưu bền vững sau commit/push/fetch/persistence gate.

- Sáu AI tạo 400 bản dịch câu 2号 mới: en/vi q161–200; id/tl q121–160; hi/bn q241–280; my/ne/th/km q001–040. Tổng câu 8448/11808, còn 3360 cặp.
- Thêm 100 thuật ngữ+định nghĩa mỗi id/tl: tổng glossary 2968/8304, còn 5336 cặp. Giữ mọi record có sẵn, không đổi Nhật, đáp án, thứ tự lựa chọn hoặc UI.
- Structural PASS, numeric PASS 76676 trường, signed Celsius PASS 386 trường. Đối chiếu 10 trường khác ký hiệu hàng nghìn/đơn vị mỗi đĩa bằng exact field hashes; không chứng nhận ngữ nghĩa toàn kho.
- SourceHash khớp tất cả 400 câu mới; mọi record bài/câu/UI/glossary cũ bảo toàn. completion7-preservation-qa.json lưu số liệu.
- Chưa kiểm thử Expo/native trong phiên, chưa duyệt người bản ngữ/chuyên gia. Không nâng acceptance false. Source590partial, full furigana và hình nhận dạng vẫn còn dở.
- Điểm tiếp: en/vi từ q201; id/tl q161; hi/bn q281; my/ne/th/km q041, weekly2号tuần02–11; thuật ngữ8locale còn thiếu. Không có cam kết tác vụ chạy nền sau phản hồi.

---

# Nhà hàng / 外食業 — checkpoint 6, 2026-10-28

Toàn bộ mô-đun CHƯA hoàn tất. Tiếp tục từ remote `d0607f088e6c05d80845bf75ff1ab958f218fa51` trên `feature/restaurant-20261026`; base đã qua WORK PERSISTENCE PASS có phạm vi trước khi sửa. Chỉ công bố lưu bền vững sau commit/ref/fetch và persistence gate.

- Thêm 40 câu 2号 q121–160 cho mỗi en/vi, tổng 80 bản dịch câu. Mỗi locale hiện 664/984 câu; toàn kho 8048/11808, còn 3760 cặp câu.
- Mục tiêu học tập được lấy từ bản dịch bài học có objectiveJa trùng nguyên văn; cả 40 câu có đúng một bản dịch mục tiêu tương ứng mỗi locale. Không thay mục tiêu bằng tên chủ đề.
- Giữ nguyên mọi record đã có của cả hai locale; không đổi Nhật, đáp án, thứ tự lựa chọn, bài học, glossary hay UI. Glossary vẫn 2768/8304, còn 5536 cặp.
- Structural PASS; numeric PASS trên 73476 trường; signed Celsius PASS 386 trường; JLPT UI lock 10/10 PASS. Đây là kiểm tra dữ liệu và tự rà AI, chưa chứng nhận người bản ngữ/chuyên môn hoặc kiểm thử Expo/native trong phiên này.
- Tiếp theo en/vi 2号 từ q161; id/tl từ q121; hi/bn từ q241; my/ne/th/km từ q001; weekly 2号 tuần02–11 và glossary8locale. Source590partial, toàn văn furigana, hình nhận dạng, productionExpo/native vẫn chưa hoàn tất. Acceptance chưa đạt giữ false.

---

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
