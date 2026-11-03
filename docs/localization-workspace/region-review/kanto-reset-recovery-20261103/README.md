# Kanto — rà ngữ cảnh 12 ngôn ngữ

Phạm vi 1.681 bài, 7 tỉnh/thành (PRF-008 đến PRF-014). Sáu AI có quyền sở hữu độc lập theo lô: 281/280/280/280/280/280 bài; tổng 178 lô. Không kiểm chéo ngữ nghĩa. Mốc đầu vào `7dfefea18ca037b06798b1e03154b3f175b5eceb`; giữ nguyên bằng chứng trước đó. Kanto chưa có bài đã rà đủ ở mốc đầu vào.

Chỉ bài đã thực đọc tiếng Nhật và đủ 12 ngôn ngữ, có receipt hash từng câu/gợi ý và ghi chú riêng, mới tính rà ngữ cảnh bằng AI. Các bài chưa đọc vẫn nằm trong assignment; phân công không chứng minh hoàn tất. `worker-1.json` đến `worker-6.json` được ghi tăng dần, không thay cho chứng nhận bản ngữ, phát âm, thiết bị hoặc phát hành. Các điểm chưa rõ trong nguồn Nhật được ghi riêng, không tự sửa nguồn để che vấn đề.

Khi worker đã ngừng ghi, chạy `python scripts/check-kanto-context-review.py --sync` để kiểm chứng quyền sở hữu, độ đủ 12 ngôn ngữ, hash và mọi thay đổi, rồi đồng bộ queue/manifest. Chạy `TOKUTEI_QA_MODULES=<dependencies> node scripts/check-kanto-context-loader.cjs` để kiểm văn bản qua loader thực. Chỉ chốt vùng khi đủ 1.681 bài có bằng chứng hợp lệ.

## Checkpoint hiện tại

Đã đọc thực **1.164/1.681 bài × 12 ngôn ngữ**, **223.488 trường**; còn **517 bài**. Hợp cơ học hai checkpoint830 và889, giữ union scenario và count mỗi bài một lần. Tích lũy sửa **5.286 trường dịch**, **636 metadata hintJa**, **53 hint Nhật**, **106 goal/evaluationNotes** và **53 authoring task**. Không đổi spokenJA/audio. Cả hai lịch sử gốc được giữ; chủ worker4 đã giải quyết7field có phương án khác nhau và lưu alternate evidence, không kiểm chéo.

Assignment được đưa lại quyền sở hữu gốc281/280/280/280/280/280 do các lô trước đó tưởng chưa đọc đã có bằng chứng ở tiếp nối đồng thời. Các lô không bị rà lại. Mốc này được kiểm trong snapshot cố định trong khi sáu worker tiếp tục các bài chưa đọc ở checkout riêng. Receipt truyền losslessly bằng tuple-v1, có roundtrip assertion.

Chủ phạm vi đọc JP và đủ12locale, tự sửa và tự kiểm; coordinator chỉ tích hợp/kiểm hash, không kiểm chéo ngữ nghĩa. Các hint lệch lượt được đồng bộ nguồn Nhật, runtime,12bản dịch và mục tiêu đánh giá. Hai cảnh báo cũ được đóng bằng toàn ngữ cảnh, không sửa tùy tiện. Patch do người rà gốc đã phê duyệt được phiên thay thế áp dụng kỹ thuật với before/hash khớp, không đếm lại.

Còn một vấn đề số tờ giấy ở NPC `SC-LOC-TKY-005-001` cần chốt canonical spoken Japanese đồng thời audio. `SC-LOC-CHB-NARITA-06-001` lưu mơ hồ thông tin tài khoản trên giấy, chưa khẳng định là lỗi chắc chắn; mọi thay spokenJA nếu cần đều phải đồng bộ audio. Hai mục local này không chặn rà các bài khác, không được coi đã nghiệm thu nguồn sạch. Bản ngữ/phát âm/thiết bị/phát hành vẫn riêng biệt.

`baseline-file-hashes.json` bảo vệ toàn bộ kịch bản Kanto được giao trong2.136tệp locale: replay ngược mọi thay đổi rồi so owned-scope hash và metadata, không phụ thuộc Git object cũ. Bài của vùng khác trong lô giáp ranh được kiểm bằng receipt riêng. `sourceHintAmendments` và `runtimeMetadataAmendments` xác minh thay đổi hint và đúnghai field đánh giá được phép. Sharedhint mirrors chỉ coordinator đồng bộ từ patch chủ phạm vi đã duyệt.

Dùng một checkout chung, sáu phạm vi độc lập. Fetch partial `blob:none` để không kéo media JLPT ngoài scope. GitHub connector cần truyền từng phần và bắt buộc treeSHA bằng chính xác local tree đã kiểm. Giữ mọi commit đồng thời, không force push; chỉ xác nhận lưu sau fetch và WORK PERSISTENCE PASS.
