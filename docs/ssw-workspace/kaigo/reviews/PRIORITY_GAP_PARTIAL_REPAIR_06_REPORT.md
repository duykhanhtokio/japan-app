# Sửa partial mapping06 — hỏi lựa chọn và xin phép tìm đồ

Ngày2026-10-08. Baseline `e18a5fb76b8bab2dab06459a8b90c7d1a0547f90`. Điểm tiếp tục là replacement-capability-08 của hygiene07. Chỉ sửa transferPractice trong infection01; không thêm candidate, câu kiểm tra hay ngày học.

Bài transfer trước đã cho sẵn lựa chọn và quyền kiểm hộp rồi yêu cầu báo phụ trách. Bản mới yêu cầu người học **hỏi trực tiếp** trước: bác muốn dùng lược nào, sau lời bác thì xin phép kiểm đúng hộp. Thẻ lời bác/kết quả được mở theo thứ tự sau lần đáp; đây là đặc tả ngoại tuyến, chưa có runtime điều khiển.

Hai người nhận tách rõ: Hasebe nghe câu hỏi, Kawase nhận báo cáo; NPC main Kishimoto vẫn là đồng nghiệp. Quyền kiểm chỉ hộp này, không các ngăn khác. Hỏi cách tìm với phụ trách không thay quyền của bác; muốn kiểm nơi khác phải hỏi lại. Chưa thấy tại hộp không thành mất, tìm lược không thành tóc đã chỉnh. Tình huống chạm màn hình bằng găng đã dùng vẫn là sự việc sau đó, giữ nguyên giới hạn báo/không tiếp tục việc sạch/xác nhận xử lý.

## Phạm vi sửa

- Giữ nguyên knowledge/main/reading/cách nói/từ, toàn20câu và khóa đáp án,16mainrubric của01/02; ba module worker-health/care-process/services bất biến. Bundle02 giữ đúng Gitblob.
- Một transfer-rubric được sửa từ6thành9mục ý, gồm2mục hỏi bác và7mục báo phụ trách. Ba case đặc tả có hai trường người nhận thay ba case cũ, **không cộng thành6case hoặc gọi đã chạy evaluator**.
- Thêm2thẻ lời bác,2câu hỏi mẫu và biến thể,thẻ kết quả; không thêm hội thoại main. Row08 có thực hành trực tiếp nháp nhưng chưa chứng nhận tương đương/đủ tải; transfer khăn của bài gốc và các partial khác vẫn cần kiểm.
- Thêm validator06; bốn validator04/05/C02/C06 chỉ bổ sung replay qua06 để dùng đúng snapshot lịch sử. Không sửa evidence04/05/C02/C06 thành được duyệt.

## Kiểm tra đã chạy

Sáu Node checker PASS ở mức structure/hash/link/lineage: permission-repair06,partial-repair05,applied-repair04,bundle02,C02bundle03,C06bundle04. Checker06 kiểm47input Gitblob bất biến,khôi phục đúng blob predecessor01 `5d2417e76fc36dfeeb89c48c1998d8adbaa19213`,bundle02bất biến,lịch/quota54/270/60 và127ID. Năm negative control bị bác đúng lý do: thiếu phần hỏi bác, bỏ hỏi lựa chọn, mở quyền ra mọi ngăn, tự chọn candidate, sửa knowledge ngoài phạm vi.

C02/C06 nhận dạng bundle01 hiện tại bằng hash06 rồi dựng lại baseline01 đúng hash trước chạy kiểm lịch sử. Replay không có nghĩa01 hiện tại còn cùng blob với trước sửa; không hạ độ chính xác kiểm hash. Các output của validator lịch sử vẫn nói về đặc tả/snapshot lịch sử.

Nguồn sách chuẩn tháng3/2025,276trang,SHA-256 recompute khớp; đọc và xem ảnhin12/16 (PDF14/18). Nguyên tắc tự lựa chọn/riêng tư được đối chiếu; phạm vi hộp-only là dữ kiện case, không trình như pháp luật. Không thêm/sửa kỹ thuật nhiễm khuẩn và không tuyên bố đã đọc lại nguồn web cũ.

Quét hai bundle01/02 hiện tại:771fields,181trường dài ít nhất60codepoint,0exact60window theoNFKC/bỏkhoảngtrắng. Không chứng nhận semantic/hình/nguồnngoài/quyền.

## Tải học và phần còn mở

Mẫu báo Nhật143→179codepoint; thêm46codepoint hai câu hỏi và48codepoint hai thẻ lời bác. Đây không là phút. Toàn bộ thay slot transfer cũ/0phút cộng nhưng chưa đo; mốc5/5/5/10/5,total30chỉbốtrí. Cần đo thẻ,hai câu hỏi,báo,retry/feedback trước chọn. Nếu quá tải phải rút hoặc giữ gốc, không giao bắt buộc cả gốc vàcandidate.

Támcandidate01–04 vẫn chưa chọn/NOT_READY_FOR_REPLACEMENT. Không app/fullrepo/thiếtbị/runtime/evaluator/timing/WORKPERSISTENCEscriptPASS; không hình/voice. Mọi human/domain/native/publisher/rights/runtime/releasefalse. Không UI/JLPT/plan/curriculum/mock đổi.

Bước tiếp: rà hợp nhất các partial mapping và độ sâu của cả támcandidate, kiểm tải thực tế trước chọn; C06 và kỹ thuật hỗ trợ vẫn chờ chuyên môn. Không thêm tuần9/đề mới hoặc tự tích hợp/phát hành.
