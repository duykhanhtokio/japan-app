# Nhà hàng — hoàn thiện ba nhóm và tiếp quản r5/r6,03/11/2026

Mốc đối chiếu bảo toàn: `4832f53f8407298126fa43c104a266972f2a3831`. Tiếp quản phần r5 đã sinh, tự đọc nguồn chữ/ảnh2号店舗運営trang7/12/20; hash nguồn33trang khớp `6c9d1d11108cb4bc114cdf653f2c1061a7f6606dfd4933119a15bc599a98225f`.

- Nhóm1: hoàn thiện3câu nguyên giá còn dở: bù nguyên giá–tỷ suất lãi gộp; nguyên giá chuẩn từng món/giá bán; tổng nguyên giá tháng có trọng số/chính doanh thu tháng đó.
- Nhóm2: thêm1câu tính200khách/40giờ công và xét thời gian phục vụ tại bàn; không đánh đồng chỉ số thấp với kém hiệu quả khi khác hình thức phục vụ.
- Nhóm3: thêm1câu tính lũy kế doanh thuX/Y/Z và phân nhómABC theo ngưỡng luyện tập; giữ rõ ngưỡng tùy doanh nghiệp.
- Đủ5câu mới,60cặp dịch theo revision và660trường dịch;50trường ruby mới được căn chỉnh, kiểm từ theo ngữ cảnh. Bảo toàn nguyên282câu cũ, thứ tự câu, đáp án, ruby, mọi bài/ảnh/thuật ngữ cũ và dịch cũ. Dịch AI chưa duyệt bản ngữ.
- Sổ v2 hiện1479mục,55covered_ai,1excluded,1423mục còn mở; mẫu số nguồn vẫn mở, không có tỷ lệ bao phủ. Một mục loại và phân vùng trang12 là phần tiếp quản cuối phiên cũ, không tính thành ý đóng mới của r6. Tự kiểm mới đóng5ý, từ50lên55.
- Source31 biên dịch639hierarchy units/1478facts/136sections/287supplement questions;580canonical items và6960bản ghi ngôn ngữ với44916trường dịch. Đây là số biên dịch, không phải bằng chứng toàn nguồn đã nghiệm thu.

Bằng chứng hẹp: `restaurant-r5-cost-assessment-review-20261103.json`, `restaurant-r6-labor-abc-review-20261103.json`, `restaurant-r5-r6-validation-20261103.json`; giữ nguyên receipt r5 phiên cũ và trạng thái trước/sau. V2contract và strict12locale gate PASS. Kiểm render dùng mốc bảo toàn hiện hành qua `RESTAURANT_SOURCE31_BASE_REF`; mốc lịch sử8a0ebfe5không có trong clone nông hiện tại. Kiểm render không chứng minh thiết bị thật hoặc thời lượng học.

Tiếp theo: f034 thiếu bước phát phiếu tại thanh toán; rà các ý/bảng/hình chưa đủ bằng chứng, đặc biệt các mục an toàn/nhãn chính thức/うぐいす骨–ほほ骨. Không đóng toàn trang vì một công thức đạt. Chưa có chuyên gia, bản ngữ, thiết bị thật hay thời lượng đo thực. Root xử lý commit/push và xác minh persistence; chưa tự nhận đã lưu từ xa.

---

# Nhà hàng — tiếp ba nhóm vận hành,03/11/2026

Tự đọc chữ/ảnh PDF2号店舗運営trang7/8/12/20/21, xác minh hash6c9d1d… đúng nguồn33trang. Rà18ý trong3nhóm: nhân thời; công thức nguyên giá; kênh bán/tái ghé.8ý đủ bằng chứng trực tiếp,10ý giữpartial với khoảng trống cụ thể (không chỉ cùng chủ đề). Sổ hiện50covered_ai/1478known,1428ý còn mở; mẫu số chưa chốt. Các mốc5covered_ai/315gaps bên dưới là lịch sử cũ, không dùng làm số hiện hành.

Bổ sung mapping thật tới runtime source31 thay vì chỉ canonical-ja đầu vào; f013 có thêm nguồntrang8 cho vai trò coarseprofit làm nguồn nhân công. f014/f015/f016 vẫn chưa kiểm đủ bước/công thức; f007 chỉ kiểm số học chưa kiểm khác biệt fullservice; f030 chưa kiểm tích lũy/phân lớp; f034 thiếu đoạn dạy chính xác thời điểm phát coupon; cácfacetkhác ghi trongreceipt. Không biến việc viết lại vấn đề thành đã hoàn tất.

Sửa1ruby thật ởq110: “積” trong phép nhân人数×時間 phải đọcせき, không phảiつ. Giữ nguyên mọi chữNhật/ID/đápán/sourceHash và dữ liệu dịch; thêm exact-field context override để lầnbuildsau không tái phát. Hash evidence thayđổi chỉ vìbytefurigana được ghi rõ, không biến candidate thành đã duyệt. Receipt restaurant-operations-review-20261103.json giữ trạng thái trước/sau từngý; không đưa nguồnPDF/chữ/ảnh vàoGit. Chưa códomain/native/device/duration. Root điều phối lưu; chưa tự nhận persistence.

---

# Nhà hàng — cơ chế nguồn → ứng dụng, 2026-11-02

Base: `5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a`. Chưa commit/push. Không thay đổi luồng giao diện.

## Đã triển khai

- Khôi phục và xác minh SHA-256/số trang cả 7 PDF gốc: 271 trang. Tài liệu gốc không đưa vào Git.
- Kiểm kê 58.052 vùng: 54.230 text spans, 3.363 vector paths, 357 image placements, 102 table candidates. Giữ 39.313 spans nhỏ hơn 10pt, bao gồm furigana. Không lọc nội dung theo cỡ chữ.
- Region census giữ vị trí, loại và fingerprint; không đưa văn bản/ảnh nguồn vào repo. Bảng ứng viên có thể chồng lên text/vector; số vùng không phải số ý kiến thức.
- Di chuyển 1.476 facts cũ sang ledger v2, giữ liên kết 639 hierarchy units như provenance. Không cộng cha/con thành số ý duy nhất; mẫu số ngữ nghĩa vẫn mở.
- Giữ toàn bộ evidence cũ như candidate, kể cả glossary/guide/interactive, không bỏ chỉ vì khác kiểu lesson paragraph. Các evidence có JSON pointer thật và hash được kiểm tra.
- Đọc nguồn và rà trực quan 4 phạm vi giới hạn: nhà cung cấp (hygiene 1号 p5), 3 mục đích 5S (p17), 3 đường nhiệt độ (p21), quan hệ trường trong bảng ghi chép (p37). Chỉ 4 knowledge units đạt covered_ai; 3 trang còn semantic partial; riêng p5 đã có thêm whole-page inventory, tách biệt với app acceptance.
- Soạn độc lập 5 câu mới, 20 lựa chọn, giải thích đúng/sai, liên kết trực tiếp tới từng fact; dịch đầy đủ 12 ngôn ngữ (60 records câu hỏi và 12 records bài mới). Không tái dùng nguyên câu hỏi/đáp án nguồn.
- Hoàn thiện 52 trường furigana mới (50 câu hỏi + 2 bài), kiểm tra căn chỉnh và cách đọc theo ngữ cảnh; 0 đoạn kanji thiếu reading trong 5 câu mới và bài mới. Câu cũ trong shard sửa được giữ nguyên.
- Tổng source31: 260 câu; 551 canonical items; 6.612 localized records; 41.304 trường dịch có nội dung.

## Chưa đạt và không được suy diễn hoàn thành

- Còn 315 assessment gaps trong sổ cũ, giảm từ 319. Giữ riêng 21 reference-excluded facts; không chuyển chúng sang “đã có câu”.
- 267 trang chưa có visual receipt v2; 1 trang (hygiene 1号 p5) hoàn tất semantic inventory mọi vùng. Census 271/271 không có nghĩa bao phủ kiến thức 271/271.
- 1.472 facts cũ còn candidate; thêm 2 objectives mới được source inventory phát hiện, một đã có bài/câu độc lập, một còn partial assessment. Nguồn/điều kiện/ngoại lệ và app còn cần đọc đối chiếu trực tiếp. 5 covered_ai là tự kiểm AI, không phải nghiệm thu chuyên gia hoặc người bản ngữ.
- Whole-page hygiene 1号 p5 đã phân loại đủ 237 text blocks (gồm ruby), 20 vector paths và 1 table candidate. Phát hiện 2 objectives ngoài 1.476 statements cũ: thực phẩm nhiễm tác nhân → triệu chứng người ăn; chọn biện pháp theo đặc điểm nguyên nhân. Objective thứ hai có exact teaching a-taxonomy nhưng chưa có assessment đầy đủ. Objective thứ nhất đã được bổ sung bằng teaching-delta riêng, q005 độc lập, đủ 12 bản dịch và ruby đúng revision; source→app đã covered_ai. Bảng đã audit từng hàng/ô/nhãn; thống kê 90% giữ điều kiện lịch sử, không dạy như tỷ lệ hiện tại.
- Vẫn mở うぐいす骨/ほほ骨; quyền và hình offline của 5 nhãn chính thức; bài sơ cứu offline. Không bịa hình hoặc chốt chuyên môn.
- Chưa nghiệm thu toàn bộ ngữ nghĩa 12 bản dịch, furigana toàn ngành, âm thanh, thời lượng thực học, Expo production và thiết bị thật.

## Kiểm tra

- `build-source31.py --available-translations --require-complete-locales`: PASS, 639 units / 1.476 facts / 134 sections / 260 questions, giữ 3 unresolved source items.
- `build-source31-matrix.py`: PASS.
- `check-source31-targets.py`: PASS, 551 / 6.612 / 41.304.
- `check-source31.cjs --require-locales`: PASS 1.235 renders, 134 sections, 260 questions, 145 figures; stale translation rejection và core preservation PASS. Chạy sau toàn bộ thay đổi. Guard hẹp xác minh 255 câu source31 cũ và toàn bộ core lessons/exams giữ nguyên; 52 trường ruby mới căn chỉnh và không thiếu reading.
- Shared v2 validator: PASS 7 nguồn, 271 trang, 58.052 vùng, 1.478 units, 1 semantic inventory complete page, 6 teaching direct / 6 assessment direct (1 partial reuse) / 5 covered_ai; sourceCoveragePercent=null, fullyCovered=false.
- Rebuild census yêu cầu 7 PDF byte-matched qua `--source-dir`; artifacts gzip có mtime=0. `--check` dựng lại artifacts rồi so ledger; không dùng như thao tác chỉ đọc trên working tree có thay đổi review chưa lưu.

## Điểm tiếp tục

1. Rà từng trang từ nguồn ra app; phân loại mọi text/table/image/vector/caption. Giữ pending nếu chưa đọc được. Không loại chữ nhỏ.
2. Tách ý, điều kiện, ngoại lệ và nhãn hình trước khi ghép với facts cũ. Phát hiện ý mới thì bổ sung ledger, không ép vào một topic cũ.
3. Rà trực tiếp bài/câu hỏi theo từng ý; chỉ covered_ai khi mọi evidence hiện hành và cùng objective, điều kiện đã kiểm, cách diễn đạt độc lập có receipt.
4. Đóng 315 assessment gaps theo lô có nguồn, Japanese trước rồi 12 locale và reading đúng revision; tiếp tục bảo toàn ngân hàng/ID cũ.
5. Chỉ đóng semantic page inventory khi mọi vùng có quyết định và reciprocal knowledge binding; giữ mẫu số mở cho tới toàn bộ 7 nguồn được rà như vậy.

Bổ sung đã hoàn tất sau inventory p5: compiler nạp teaching-delta riêng, crosswalk/matrix có 1.478 facts; 1 bài Nhật mới và q005 có đủ 12 locale, literal revision, 52 trường ruby cho toàn bộ lô mới. `python scripts/restaurant/check-source-v2-delta.py` PASS. Không thay đổi 255 câu source31 cũ hoặc core lessons/exams.

Cause-specific response tái sử dụng q262 theo evidence trường cụ thể: câu phân biệt dị vật vật lý với hóa chất vì biện pháp khác nhau. Giữ assessment partial vì chưa kiểm chọn biện pháp cho cả bốn nhóm nguyên nhân trong bảng. Không suy diễn từ câu cùng chủ đề sang bao phủ toàn bộ bảng.
