# Transfer proposals 08 — khăn/phạm vi hỗ trợ và kết quả tham gia
Ngày: 2026-10-08, Asia/Tokyo. Baseline: c1de4ae6d6a9025f3517275eefddc32699ba4ce3.

Hai phương án tự viết đã được rà AI và kiểm cấu trúc. Đây là đề xuất chưa ghép vào candidate, chưa chọn trong curriculum, chưa đủ điều kiện thay bài hoặc phát hành. Chưa có người kiểm chuyên môn/bản ngữ/quyền, timing hay runtime.

## Nội dung cụ thể
- Ngày42/infection01: Hasebe muốn tự lau tay, chỉ nhờ hỗ trợ mặt; hỏi khăn mong muốn. Không thấy khăn viền xanh trong giỏ được phép không đồng nghĩa mất. Khăn không viền chưa rõ chủ không dùng. Bác chọn chờ; người học báo Kawase cả nhu cầu/phạm vi kiểm/lựa chọn/chưa lau. Kết quả tìm của phụ trách vẫn chưa có; không coi đồng ý mặt là đồng ý toàn thân.
- Ngày50/care-process01: chỉ mở thẻ sau xác nhận điều kiện/báo phụ trách của transfer hiện có. Thẻ xác nhận Kishimoto hỗ trợ về phòng14:25 là kế hoạch, chưa đưa bác về. Người học báo kết quả cho Morikawa và hỏi; dù giờ phù hợp, bác quyết định không tham gia. Người học xác nhận rồi báo lựa chọn thực tế với Kawase. Chọn bài nhạc khác tham gia/đạt mục tiêu.
- Một thẻ thay thế14:35 và hai mẫu báo theo thẻ cho luyện khi không đáp ứng14:25. Chỉ chọn một thẻ cho một lần luyện, không giao hai nhánh bắt buộc.

Tổng16lượt Nhật–Việt,8rubric với biến thể/ý bắt buộc và24ca đặc tả. Các ca là đầu vào/kết quả mong đợi, chưa chạy bộ chấm ngữ nghĩa. Không thêm bài/câu ôn/đề/NPC/từ bắt buộc. Tám candidate hiện có và quotalõi54bài/270câu bài/60câu đề giữ nguyên.

## Phạm vi sửa và giới hạn ghép
Tệp mới drafts/priority-gap-transfer-proposals-08.json trỏ đúng hai module/bundle/base/day và exactGitblob trước sửa. Bundle01/02, câu q05, kiến thức chính, mọi bài gốc, lịch và audit07/timing07 không đổi. Vì vậy các gap trong audit07 chưa tự chuyển thành đã đóng.

Khi áp dụng đề xuất phải ghép vào slot transfer và giữ các mục sau:
1. Infection: lựa chọn lược và xin phép mở phạm vi cụ thể; chưa thấy khác mất; không dùng đồ chưa rõ chủ; báo vùng màn hình đã chạm bằng găng và xử lý còn chờ. Không đơn giản xóa bài lược để đổi sang khăn.
2. Care-process: hỏi14:25/hỗ trợ rời sớm, báo phụ trách trước hoạt động, sau đó mới dùng kết quả và hỏi quyết định. Giữ chọn bài khác đạt mục tiêu và không tự phê duyệt kế hoạch.
3. Rà đồng bộ q05/rubric và chứng cứ giữ năng lực; cập nhật lineage/hash nếu bundle thay đổi. Không viết lại lịch sử các evidence04–07 thành đã kiểm nội dung mới.
4. Đo sau ghép trong khối NPC10phút của mỗi ngày5/5/5/10/5. Không cộng transfer cũ và mới thành hai bài bắt buộc. 0phút cộng là ý định bố trí, chưa chứng minh vừa30phút.

## Kiểm đã thực thi
Validator scripts/check-kaigo-transfer-proposals-08.mjs PASS ở mức cấu trúc/liên kết/nhất quán trường dữ kiện:22immutableGitblob, đúng2module/ngày/bài gốc,16lượt,8rubric,24caspec, flagsfalse, planned30 và đo thực tếnull. Bảy negativecontrols bị bác đúng lý do: áp dụng sớm, release approval, fake1800giây, lau toàn thân, sai giờ thẻ kết quả, thiếu ý rubric, sai người nhận.

Rà AI đọc toàn bộ lời Nhật/Việt mới, biến thể, ca đặc tả, thẻ kết quả và người nhận; tách kế hoạch/thực hiện và đã báo/sẽ báo. Không claim chuyên môn hoặc evaluator dựa trên validator.

| Đề xuất | Nhật: toàn thoại | Nhật: câu mẫu người học | Thẻ thay thế: báo bác/phụ trách |
|---|---:|---:|---:|
| Khăn/phạm vi | 384 | 258 | 0/0 |
| Kết quả về phòng | 349 | 241 | 83/84 |

Metric NFKC/bỏ khoảng trắng/Unicodecodepoint, không là phút; chưa tính đủ thẻ Việt/biến thể/suy nghĩ/retry/feedback. Số liệu timing đều chưa đo. Khi ghép phải đo lại, không dùng timing sheet07 vốn khóa bundle cũ như bằng chứng cho đề xuất08.

Nguồn riêng chuẩn3/2025: SHA256 recompute khớp997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54,276trang. Đọc text và xem ảnh trang in12/16/115/118/196/197, PDF14/18/117/120/198/199. Chỉ dùng quyền lựa chọn, phối hợp, tách dữ kiện, phân biệt phần/toàn thân; không soạn kỹ thuật/nhiệt độ/áp lực/thứ tự lau. Các giờ/nhân vật/kết quả là dữ kiện hư cấu, không phải nguồn xác nhận.

Lexicalscreen toàntext-layer276trang:148trường ngôn ngữ mới/61trường>=60codepoint/0trường có exact60window. Tám mẫu người học không exactnormalizedmatch với mọi trường chuỗi trong8bundlebài gốc+4bundlecandidate. Rà quyết định/bối cảnh AI: khăn luyện lựa chọn chờ và phạm vi hỗ trợ; hoạt động luyện quyết định sau kết quả phù hợp/không phù hợp. Không chứng nhận semantic similarity, hình, nguồn ngoài hoặc quyền. Không công bố PDF/text/ảnh nguồn.

## Lưu và bước tiếp
Snapshot cô lập, không gitcheckout trên máy người dùng. Công bố hẹp bằng GitHub connector có expected-head lease, sau đó đọc exactcontent/Gitblob của5tệp và commit parent/scope. Không chạy/claim script WORKPERSISTENCE, fullrepo, thiết bị hoặc app.

Bước tiếp: ghép hai phương án vào transfer với các năng lực phải giữ, tối giản tải và đồng bộ q05/rubric/lineage; rà lại audit07 ở snapshot mới. Chưa chọn thay bài, không tự tuần9/đề mới/tích hợp/phát hành.
