# Kanto — rà ngữ cảnh 12 ngôn ngữ

Phạm vi 1.681 bài, 7 tỉnh/thành (PRF-008 đến PRF-014). Sáu AI có quyền sở hữu độc lập theo lô: 291/260/240/340/250/300 bài; tổng 178 lô. Không kiểm chéo ngữ nghĩa. Mốc đầu vào `7dfefea18ca037b06798b1e03154b3f175b5eceb`; giữ nguyên bằng chứng trước đó. Kanto chưa có bài đã rà đủ ở mốc đầu vào.

Chỉ bài đã thực đọc tiếng Nhật và đủ 12 ngôn ngữ, có receipt hash từng câu/gợi ý và ghi chú riêng, mới tính rà ngữ cảnh bằng AI. Các bài chưa đọc vẫn nằm trong assignment; phân công không chứng minh hoàn tất. `worker-1.json` đến `worker-6.json` được ghi tăng dần, không thay cho chứng nhận bản ngữ, phát âm, thiết bị hoặc phát hành. Các điểm chưa rõ trong nguồn Nhật được ghi riêng, không tự sửa nguồn để che vấn đề.

Khi worker đã ngừng ghi, chạy `python scripts/check-kanto-context-review.py --sync` để kiểm chứng quyền sở hữu, độ đủ 12 ngôn ngữ, hash và mọi thay đổi, rồi đồng bộ queue/manifest. Chạy `TOKUTEI_QA_MODULES=<dependencies> node scripts/check-kanto-context-loader.cjs` để kiểm văn bản qua loader thực. Chỉ chốt vùng khi đủ 1.681 bài có bằng chứng hợp lệ.

## Checkpoint hiện tại

Đã hoàn tất rà ngữ cảnh bằng AI **1.681/1.681 bài ×12 ngôn ngữ**, **20.172 receipt ngôn ngữ**, **322.752 trường**. **Không còn bài chưa rà**. Giữ nguyên bằng chứng hợp lệ trước đó; lượt cuối thêm270bài, sửa346trường. Cả sáu phạm vi đã dừng. Prefix, quyền sở hữu, hash, replay thay đổi và loader thực đềuPASS. Tích lũy sửa **6,252 trường dịch/gợi ý**; các sửa metadata từmốc trước được giữ nguyên.

Rà AI đầy đủ không thay cho nghiệm thu nguồn Nhật/bản ngữ/phát âm/thiết bị/phát hành. Còn **43 mục nguồn chưa chốt thuộc42bài**, xem `source-issues-open.json`; giữ `sourceAccepted:false`, `nativeReviewed:false`, `semanticCrossReview:false`. Lượt cuối không sửa spokenJA/audio. `all-1681-review-checkpoint.json` ghi bằng chứng tổng hợp; `resume.json` ghi cả sáu phạm vi0pending.

Sau sự cố làm mới môi trường, hợp và khôi phục bằng chứng từ bản GitHub, gói truyền còn giữ và đúng chủ phạm vi còn actual context. Chỉ phục hồi với nguyên văn/ghi chú/sửa đổi khớp và replay baseline, không dùng số đếm để tạo review. Tám bài worker5 từng thiếu đã được phục hồi bằng hồ sơ đầy đủ khớp hash; nay thuộc1.681bài. Gói raw và gzip dự phòng đã lên nhánh recovery/kanto-evidence-20261103, mốc1339 đã WORK PERSISTENCE PASS.

Ở mốc1.403, đã chuyển sáu lô chưa có review hợp lệ để cân bằng phần còn lại **48/50/50/46/43/41**; hiện cả sáu phạm vi đều0pending. Không chuyển bài đã có bằng chứng. Xem ownership-transfer-checkpoint-1388.json, ownership-transfer-checkpoint-1403.json và resume.json. Ownership tổng hiện291/260/240/340/250/300.

Receipt đầy đủ được nén gzip losslessly, small JSON wrapper giữ hashes của archive và nguyên bản. Cả validator Python, loader và thư viện global tự kiểm hash rồi giải nén. Trước khi cho worker ghi tiếp, sau persistence chạy python scripts/kanto-receipt-transport.py expand. Không dùng receipt wrapper như bằng chứng hash-only: mọi reviews/notes/before-after nguyên bản vẫn nằm đầy đủ trong archive.

Chủ phạm vi đọc JP và đủ12locale, tự sửa và tự kiểm; coordinator chỉ tích hợp/kiểm hash, không kiểm chéo ngữ nghĩa. Các hint lệch lượt được đồng bộ nguồn Nhật, runtime,12bản dịch và mục tiêu đánh giá. Hai cảnh báo cũ được đóng bằng toàn ngữ cảnh, không sửa tùy tiện. Patch do người rà gốc đã phê duyệt được phiên thay thế áp dụng kỹ thuật với before/hash khớp, không đếm lại.

Còn một vấn đề số tờ giấy ở NPC `SC-LOC-TKY-005-001` cần chốt canonical spoken Japanese đồng thời audio. `SC-LOC-CHB-NARITA-06-001` lưu mơ hồ thông tin tài khoản trên giấy, chưa khẳng định là lỗi chắc chắn; mọi thay spokenJA nếu cần đều phải đồng bộ audio. Thêm câu Nhật chưa tự nhiên `まだ券を受け取りましたか` ở `SC-LOC-JP-14210-01-001`, turn03; chưa sửa spokenJA/audio. Các mục local này không chặn rà các bài khác, không được coi đã nghiệm thu nguồn sạch. Bản ngữ/phát âm/thiết bị/phát hành vẫn riêng biệt.

`baseline-file-hashes.json` bảo vệ toàn bộ kịch bản Kanto được giao trong2.136tệp locale: replay ngược mọi thay đổi rồi so owned-scope hash và metadata, không phụ thuộc Git object cũ. Bài của vùng khác trong lô giáp ranh được kiểm bằng receipt riêng. `sourceHintAmendments` và `runtimeMetadataAmendments` xác minh thay đổi hint và đúnghai field đánh giá được phép. Sharedhint mirrors chỉ coordinator đồng bộ từ patch chủ phạm vi đã duyệt.

Dùng một checkout chung, sáu phạm vi độc lập. Fetch partial `blob:none` để không kéo media JLPT ngoài scope. GitHub connector cần truyền từng phần và bắt buộc treeSHA bằng chính xác local tree đã kiểm. Giữ mọi commit đồng thời, không force push; chỉ xác nhận lưu sau fetch và WORK PERSISTENCE PASS.

Nhập thêm15bài đã có bằng chứng đầy đủ từ commit công bố đồng thời, không rà lại hoặc cộng trùng. Các phương án public đã duyệt được giữ theo quy tắc cơ học, lưu cả hai lịch sử; không kiểm chéo ngữ nghĩa.
