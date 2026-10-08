# Follow-up10 — báo sau hỏi bác và kết quả hẹn trao đổi

Ngày2026-10-08. Baseline remote `7aab6562764e6367b8406e3585501bcc25e85fab`, nhánh `recovery/jlpt-n3-n1`. Hai candidate ngày14/49 thêm practice cụ thể, chưa chọn thay bài và vẫn **NOT_READY_FOR_REPLACEMENT**.

## Thay đổi và bảo toàn

| Candidate | Nhánh mới | Ý cần phân biệt |
|---|---|---|
| worker-health01, ngày14 | Báo9:15 → hỏi bác9:20 → báo lại lời bác → nhắc lại liên lạc/điểm chưa xong | Chưa hỏi đau lúc9:15 khác bác nói không đau9:20; lời bác khác số đo/chẩn đoán; đã liên lạc điều dưỡng khác đã đến/kiểm xong. |
| services01, ngày49 | Đề xuất18/10 → bác muốn19/10 không mời Megumi → kiểm với Kawase → báo bác/hỏi lại → bàn giao sự đồng ý giờ hẹn | Giờ đề xuất khác giờ có thể bố trí và khác bác đồng ý. Hẹn trao đổi không là chọn/giao đồ hoặc đăng ký/bắt đầu dịch vụ. |

Mỗi nhánh có4lượt người học và4thẻNPC cố định sau đáp,4rubric với2cách nói chấp nhận/1cách sai và3caspec mỗi rubric. Tổng16phát ngôn,8rubric,18mụcý,24caspec **chưa chạy evaluator**. Đây là dữ liệu nháp offline, chưa runtime thẻ/đánh giá.

Chỉ thêm `transferPractice.rehearsalPlan10`, `replacementPlan.followupRepairRef` của worker/services và marker `editorialFollowup10` của hai bundle. Exactprojection xóa đúng3field phục dựng bundle09:

- bundle01: `1b60463b7af66d5b9403fd29924d81dd831e0639`.
- bundle02: `7c354e19832f981f4ab89e8090d7d3e864bdb898`.

Toàn knowledge/main/reading/expressions/vocab/20câu và legacy transfer của01–02 giữ byte; nhánh khăn/care09 nguyên. Workerq04 vẫn kiểm lời bác so với chưa hỏi, q05 vẫn kiểm dụng cụ/chưa đào tạo. Servicesq04 giữ giai đoạn phiếu và q05 giữ ngày bắt đầu dịch vụ chưa kiểm. Câu cũ không được gọi là kiểm đủ flow mới; từng flow có rubric riêng.

Selector chỉ cho một variant/lần, nhánh cũ luyện ở lần riêng. Không giao cũ+mới bắt buộc hoặc cộng phút. Támcandidate chưa chọn, quota54bài/270câu/60câu mock và curriculum56ngày nguyên. Candidate main vẫn68turn/40câu/32rubric96caspec. Thư viện transfer hiện có8legacy+8variant09+8variant10=24rubric/72caspec, không phải giao tất cả; tổng168caspec trong thư viện chưa evaluator. Không sửa số liệu snapshot07.

## Kiểm tra thực hiện

`node scripts/check-kaigo-followup-10.mjs` PASS cấu trúc/link/343ID/51immutableblob/2exactprojection/core54/270/60/2sheet thời gian chưa chạy;13negativecontrols đều bị bác đúng lý do. 50baseline immutableblob đã đối chiếu remote; evidence09 thêm được pin riêng. Kiểm tra không là duyệt chuyên môn/bản ngữ hay xác nhận chất lượng toàn repo.

Tám checker lịch sử merge09/repair06/05/04/C02batch03/C06batch04/audit07/proposal08 PASS. Helper10 kiểm afterhash rồi phục dựng exact09, helper09 phục dựng predecessor tiếp. Checker09 in `historicalSnapshotValidation:true`; evidence04–09 không được viết lại thành đã rà nội dung10. Hai file helper/checker09 sửa chỉ để replay nhánh mới.

Đọc lại đầy đủ startup/AGENTS/rules/checkpoint/approvedplan/quy tắc tác giả độc lập. Nguồn chuẩn SHA256 `997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54`,276trang recompute; đọc text in12/16/115/118, xem ảnh in12/115/118. Không thêm kỹ thuật khám, chẩn đoán, điều kiện pháp lý dịch vụ hoặc nguồn ngoài; không công bố privatebytes. Giao tiếp tự lựa chọn/nguồn lời bác/báo đúng sự thật dựa nguyên tắc nguồn, không chép ví dụ nguồn.

Rà AI toàn JA/VI của4stage mỗi nhánh, thẻ trả lời, hai cách chấp nhận, ca thiếu/ca sai, người nhận và selector. Screen120languagefield mới,77field đủ60codepoint,0exact60window với toàn textlayer276trang. Đây chỉ là kiểm trùng chữ dài, chưa semantic/hình/external/rightsapproval.

## Tải và phần còn mở

| Flow | JA gồm mẫu người học + thẻNPC | JA mẫu người học | Mục ý |
|---|---:|---:|---:|
| worker10 |597|389|10|
| services10 |656|414|8|

Đơn vị là Unicodecodepoint sauNFKC/bỏ whitespace, **không phút**. Hai sheet10 pin afterblob/defaultvariant hiện tại; ngày14 giữ3/8/5/9/5, ngày49 giữ5/5/5/10/5,total30dự kiến. Tất cả trường đo/người tham gia/quyết địnhnull. Cần đo đọc cả thẻ, suy nghĩ, nói lại và feedback; chưa chứng minh hiểu hoặc hoàn tất trong30phút. Không dùng sheet07/09 cho10.

Các partial worker/services đã có lượt thực hành mới, chưa chứng nhận tương đương hoặc thay bài. C02 mốc treo/hiệu lực và thông báo pháp định, C06 dữ kiện riêng/khẩn cấp vẫn mở. Bước tiếp là sửa/kiểm các partial đó với phạm vi rõ rồi rà ma trận current; đo và duyệt trước chọn. Không tự tuần9/đề mới/tích hợp/phát hành.

Không app/fullrepo/runtime/evaluator/device/timing hoặc WORK PERSISTENCE script PASS: đây là snapshot cô lập không gitcheckout. Lưu9file hẹp qua connector, lease và đọc lại remote. Domain/native/publisher/rights/runtime/release đềufalse.
