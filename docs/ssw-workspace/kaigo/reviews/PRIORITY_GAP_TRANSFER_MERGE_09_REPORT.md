# Transfer merge09 — ghép hai nhánh luyện vào candidate
Ngày2026-10-08 (Asia/Tokyo). Baseline remote2240b9dfc3eaf64ec761da28be2300b6b2f561cd.
Trạng thái: APPLIED_TO_DRAFT_VARIANTS_NOT_REPLACEMENT_APPROVAL.

## Kết quả và phạm vi
Hai phương án08 đã nối vào transferPractice của infection01/ngày42 và care-process01/ngày50 bằng rehearsalPlan09, chưa chọn thay bài gốc trong curriculum hoặc tích hợp app. Mỗi lần luyện chọn một variant trong slot hiện có, không giao cả cũ+mới bắt buộc.

Infection: nhánh khăn mặc định liên kết đúng proposal08 bằng path/pointer/exactGitblob, không sao chép thêm toàn thoại. Hasebe tự lau tay, chỉ nhờ mặt; hỏi khăn, chưa thấy trong giỏ được phép, khăn không viền chưa rõ chủ, bác chọn chờ; báo Kawase và không suy đồng ý toàn thân. Nhánh lược/xin phép mở hộp/màn hình-găng giữ nguyên mọi trường cũ và rubric, được chọn thay nhánh khăn khi ôn các năng lực đó. Dữ liệu nhiều nhánh chưa chứng minh người học được luyện đủ mọi năng lực trong thời lượng cho phép.

Care-process: rút phương án08 thành bốn bước có thẻ trả lời cố định, tổng8phát ngôn:
1. Hỏi Morikawa về hỗ trợ và14:25; thẻ bác giữ điều kiện nếu không về được giờ đó thì không tham gia.
2. Báo Kawase trước hoạt động, hỗ trợ/giờ chưa xác nhận; sau đáp mới mở thẻ xác nhận Kishimoto hỗ trợ14:25.
3. Báo kết quả cho bác và hỏi quyết định. Dù giờ phù hợp, bác quyết định hôm nay không tham gia, chỉ chọn bài nhạc.
4. Báo lựa chọn thực tế cho Kawase, tách chọn bài/hoạt động chưa bắt đầu/không tự kết luận mục tiêu đạt hoặc phê duyệt kế hoạch.
Kết quả hỗ trợ tương lai không phải đã đưa bác về. Thẻ14:35 của08 vẫn là lựa chọn luyện thay kết quả phù hợp, không thêm hai nhánh bắt buộc. Nhánh ít gợi ý cũ giữ nguyên như phương án thay thế, không cộng vào bốn bước mặc định.

## Những phần giữ nguyên
Chỉ thêm rehearsalPlan09, replacementPlan.transferMergeRef và marker editorialTransferMerge ở mỗi bundle. Exactprojection xóa đúng ba field này phục dựng haiGitblob5ebd71e0bf3e19e7ac6df731cf15b288e13a0911 và4abbf7d2dc0a712d160081494fa47f49df442137. Vì vậy toàn bộ trường cũ, kiến thức/main/reading/từ/cách nói/tất cả20câu/16mainrubric và worker-health/services nguyên byte; không tự sửa nội dung cũ để kiểm cũ qua.

Q05infection vẫn kiểm nhánh lược/màn hình được giữ; nhánh khăn được đánh giá bằng4rubric liên kết08. Q05care-process kiểm đúng bước trước bắt đầu và quyền quyết định sau biết kết quả, không cần sửa stem/lựa chọn/khóa/lý do. Không tuyên bố q05infection kiểm được khăn hoặc mọi kỹ thuật vệ sinh.

Quotalõi54bài/270câu bài/60câu đề,8candidate và main68lượt/40câu/32rubric96caspec không đổi. Bốn rubric khăn liên kết08 và bốn rubric care mới có23ý nghĩa/24caspec;16phát ngôn nhánh mới. Không cộng chúng thành bài/câu/đề mới. Cộng library thực hành hiện có8legacytransfer-rubric24caspec+8variant-rubric24caspec, khác120caspec của snapshot audit07. Không phải tất cả variants được giao bắt buộc hoặc ca được evaluator chạy.

## Kiểm thực thi và lịch sử
Newvalidator09 PASS:50immutableGitblob,281ID bài/thực hành (sourceID chung không đếm trùng),liên kết branch mặc định, đúng người nhận/bước/trạng thái,projectionexacthai bundle,quota,2sheet thời lượng khóa bản mới/null.10negativecontrols bác chọn sớm,releaseapproval,giao hai nhánh bắt buộc,linkdefault sai,linkkhăn sai,giờ kết quả sai,người nhận sai,thiếu ý rubric,bỏ permission cũ,sửa kiến thức ngoài phạm vi.

Bảy kiểm liên quan repair06/05/04,C02batch03,C06batch04,audit07,proposal08 đều PASS. Helper scripts/kaigo-transfer-merge-09-lineage.mjs chỉ bỏ các field09 đã xác minh exactafterhash rồi yêu cầu exactbeforehash; script06/07/08 nối helper. Không sửa evidence04–08 hoặc biến báo cáo lịch sử thành kiểm nội dung mới. Audit07 chạy trên predecessor được phục dựng; dữ liệu partial/metric/count của audit07 vẫn thuộc bản cũ. Kiểm nội dung mới là09 và rà AI riêng.

Rà AI đọc toàn bộ4bước mới Nhật–Việt,thẻ,biến thể,24caspec (12mới care+12khăn liên kết đã đọc08),metadata chọnnhánh,q05/phạmvi/ýrubric cũ cần giữ. Không chạy semantic evaluator,app/fullrepo,thiết bị hoặc đo người học. Mọi human/domain/native/publisher/rights/runtime/releasefalse.

## Tải học
| Nhánh mặc định | Toàn thoại Nhật | Câu mẫu người học Nhật |
|---|---:|---:|
| Khăn, liên kết08 | 384 | 258 |
| Quá trình, ghép09 | 490 | 310 |

Đơn vị NFKC/bỏ khoảng trắng/Unicodecodepoint, không là phút. Nhánh care có cả hỏi/trao đổi trước bắt đầu nên khác349codepoint của phần sau kiểm trong08. Không giả rằng số lượt thấp bảo đảm vừa30phút. Tải Việt/thẻ/biến thể/suy nghĩ/retry/feedback chưa đo.

Hai timingSheets09 nằm trong evidence, khóa exactbundle mới và proposal08, giữ5/5/5/10/5. Các số quan sát/người/ngày/kếtquả/quyếtđịnh đều null. Đo một variant/lần và các bước/thẻ/feedback đầy đủ; xem cả retrieval năng lực nhánh cũ trước quyết định thay bài. Sheet07 nguyênlịch sử, không áp dữ liệu đo cũ cho09.

## Nguồn và độc lập
RecomputeSHA chuẩn997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54 và276trang. Rereadtextin12/16/115/118/196/197 (PDF14/18/117/120/198/199),xemảnhin12/118/196. Dùng quyền tự lựa chọn,phối hợp,tách dữ kiện,phần/toàn thân; không kỹthuật lau/nhiệtđộ/áp lực/thứtự/chẩnđoán mới. Giờ/nhân vật/thẻ là hư cấu. Nội dung găng/màn hình giữ nguyên, không claim nguồn ngoài mới đã reread.

Screen126languagefields mới/khăn liên kết,52eligible>=60,0exact60window với fulltext-layer276trang. Rà logic AI: thêm quyếtđịnh thật sau kết quả,không chỉ đổi danh từ. Không chứng nhận semantic/hình/nguồnngoài/quyền; khôngcôngbố privatePDF/OCR/ảnh.

## Lưu và bước tiếp
Công bố10tệp hẹp trên remotehead hiện tại bằngconnector/expected-headlease,đọc exactcontent/Gitblob và commitparent/scope. Snapshot không gitcheckout trênmáyngườidùng,khôngclaimWORKPERSISTENCEscriptPASS.

Hai gap nay có directpractice trong candidate nháp, nhưng tươngđương/tải vẫnpartial và candidateNOT_READY. Bước tiếp: rà các partial khác (worker báo kết quả sau kiểm,services hẹn trao đổi,C02 ngàytreo/ngàyhiệulực,C06 dữkiện chưa rõ) và cập nhật ma trận snapshot hiện tại; đo tải/duyệt trước chọn. Không tựtuần9/đềmới/tíchhợp/pháthành.
