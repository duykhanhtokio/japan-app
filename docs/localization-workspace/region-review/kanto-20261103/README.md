# Kanto — rà ngữ cảnh 12 ngôn ngữ

Phạm vi 1.681 bài, 7 tỉnh/thành (PRF-008 đến PRF-014). Sáu AI có quyền sở hữu độc lập theo lô: 281/280/280/280/280/280 bài; tổng 178 lô. Không kiểm chéo ngữ nghĩa. Mốc đầu vào `7dfefea18ca037b06798b1e03154b3f175b5eceb`; giữ nguyên bằng chứng trước đó. Kanto chưa có bài đã rà đủ ở mốc đầu vào.

Chỉ bài đã thực đọc tiếng Nhật và đủ 12 ngôn ngữ, có receipt hash từng câu/gợi ý và ghi chú riêng, mới tính rà ngữ cảnh bằng AI. Các bài chưa đọc vẫn nằm trong assignment; phân công không chứng minh hoàn tất. `worker-1.json` đến `worker-6.json` được ghi tăng dần, không thay cho chứng nhận bản ngữ, phát âm, thiết bị hoặc phát hành. Các điểm chưa rõ trong nguồn Nhật được ghi riêng, không tự sửa nguồn để che vấn đề.

Khi worker đã ngừng ghi, chạy `python scripts/check-kanto-context-review.py --sync` để kiểm chứng quyền sở hữu, độ đủ 12 ngôn ngữ, hash và mọi thay đổi, rồi đồng bộ queue/manifest. Chạy `TOKUTEI_QA_MODULES=<dependencies> node scripts/check-kanto-context-loader.cjs` để kiểm văn bản qua loader thực. Chỉ chốt vùng khi đủ 1.681 bài có bằng chứng hợp lệ.

## Checkpoint hiện tại

Đã đọc thực **326/1.681 bài × 12 ngôn ngữ**, **62.592 trường**; lượt tiếp tục thêm **138 bài**, giữ bằng chứng cũ hợp lệ. Còn **1.355 bài**. Tích lũy sửa **1.982 trường dịch**, **168 trường metadata nguồn trong lô dịch**, **14 hint Nhật** và **28 trường goal/evaluationNotes** tương ứng; không thay lời thoại nói, IDs, ruby hay âm thanh. `resume.json` ghi điểm tiếp tục của sáu phạm vi độc lập.

Các hint sai được chủ phạm vi tự đọc và duyệt, đồng bộ bản Nhật/app/12locale/metadata đánh giá; coordinator chỉ tích hợp/kiểm hash, không kiểm chéo ngữ nghĩa. Hai cảnh báo cũ được đóng bằng ngữ cảnh đầy đủ, không sửa tùy tiện. Các sửa nguồn do worker gốc phê duyệt có artifact trước/sau và hash; phiên thay thế chỉ áp dụng kỹ thuật, không đếm lại bài.

Còn một vấn đề local trong `SC-LOC-TKY-005-001`: lời NPC về hai tờ giấy cần chốt đồng thời canonical Japanese và bản thu âm/phụ đề liên quan. Chưa thay spokenJA để tránh bản chữ khác audio. Việc này không chặn tiếp các bài còn lại và không được coi là đã nghiệm thu nguồn. Bản ngữ, phát âm, thiết bị và phát hành vẫn tách riêng.

`baseline-file-hashes.json` lưu dấu vết đầu vào và hash chuẩn của toàn bộ kịch bản Kanto được giao trong 2.136 tệp locale. Validator replay thay đổi ngược và so hash phạm vi sở hữu, kiểm cả metadata tệp; không cần các commit chỉ có trong clone cũ. Một lô giáp vùng có thể chứa bài khác; các bài đó được kiểm bằng receipt riêng. `sourceHintAmendments` bảo vệ thay đổi hint; `runtimeMetadataAmendments` chỉ cho phép goal/evaluationNotes. Shared hint mirrors do coordinator đồng bộ bằng patch chủ phạm vi đã duyệt.

Git trực tiếp ở môi trường này thiếu credential; dùng GitHub connector, chia nhỏ truyền dữ liệu, bắt buộc SHA tree từ xa bằng đúng tree cục bộ đã kiểm chứng. Giữ mọi cập nhật đồng thời. Chỉ xác nhận lưu sau fetch và `WORK PERSISTENCE PASS`.
