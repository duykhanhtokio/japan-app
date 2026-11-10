# Lưu kết quả và thu gọn môi trường — yêu cầu ngày 2026-11-03

Áp dụng cho mọi phiên và mọi worker của Japan App. GitHub là nơi lưu mã nguồn, nội dung và bằng chứng cần duy trì; ổ làm việc là nơi xử lý.

1. Khi bắt đầu: kiểm tra `df -h`, đúng repository/nhánh/upstream và thay đổi chưa lưu. Đọc checkpoint hiện hành; không làm lại bằng chứng hợp lệ.
2. Dùng một checkout chung cho sáu AI, giao độc quyền file/lô. Không tạo sáu bản clone, bộ dependency hoặc bản sao media giống nhau. Worktree riêng chỉ khi thật sự cần.
3. Dùng shallow/partial clone và sparse checkout theo đúng file cần xử lý. Không tải cả `docs/`, lịch sử bundle, thư mục sao lưu hay toàn bộ assets cho một việc nhỏ. Mở rộng có chọn lọc khi validator thực sự cần.
4. Hoàn tất từng nhóm hợp lý: kiểm tra phần thay đổi, commit hẹp, push lên nhánh đã được phép; fetch và chạy `node scripts/check-work-persistence.mjs` (hoặc `--paths` cho nhóm đã hoàn tất khi worker khác còn sửa). Chỉ báo đã lưu sau `WORK PERSISTENCE PASS`. Không force push; giữ công việc đồng thời.
5. Sau khi xác minh: dọn file tải/giải nén/render trung gian có thể tạo lại do chính phiên tạo; thu gọn sparse checkout khi không còn worker sử dụng. Bản clone/worktree dư chỉ được xóa khi đã kiểm tra cả file tracked/untracked/ignored và mọi commit cần giữ đã có trên remote. Không xóa checkout đang dùng.
6. Giữ lại checkpoint, receipt gắn hash, nội dung hoàn tất, lỗi/chặn chưa giải quyết và hướng tiếp tục. Không xóa bằng chứng cũ hay dữ liệu độc nhất chưa lưu. Không sửa lịch sử Git để giảm dung lượng theo quy trình thông thường.
7. Không commit `node_modules`, cache/build, bản PDF/ảnh trích nguồn riêng tư hoặc toàn bộ file trung gian. File nguồn riêng tư phải nằm ở nơi lưu bền vững được phép trước khi xóa bản duy nhất; GitHub không thay thế nơi lưu nguồn riêng tư.
8. Cuối phiên: kiểm tra lại dung lượng, dừng tiến trình do phiên khởi chạy, ghi nhận commit đã xác minh và phần còn dở. Nếu thiếu quyền push/mạng hoặc chưa xác minh được, giữ dữ liệu và báo chặn; không xóa kết quả để lấy chỗ.

Push không tự giải phóng ổ đĩa. Việc dọn là bước riêng sau xác minh. Không tự dọn thư mục thuộc phiên/người khác chỉ vì dung lượng lớn.

9. Khi lưu bằng GitHub connector thay Git push: chia nhỏ dữ liệu truyền, ghép đủ rồi parse/kiểm hash trước khi gửi; không dùng output có dấu cắt ngắn hoặc head/tail thay cho file gốc. Sau khi tạo tree trên GitHub, SHA tree phải bằng đúng SHA tree cục bộ đã kiểm chứng trước khi cập nhật ref. Mã commit có thể khác do metadata, nhưng nội dung tree không được khác. Nếu phát hiện JSON bị cắt giữa chừng, chỉ khôi phục từ bản đầy đủ có đối chiếu hash/dấu vết rõ ràng rồi chạy lại validator trước khi lưu.

10. Bản clone `--shared` có thể không kế thừa cấu hình partial clone của bản nguồn. Trước fetch lớn, kiểm `remote.origin.promisor` và `remote.origin.partialclonefilter`; dùng `git fetch --filter=blob:none --no-tags origin recovery/jlpt-n3-n1` với promisor/filter cấu hình đúng để chỉ lấy metadata trước. Chỉ materialize blob cần cho sparse scope/validator, tránh kéo toàn bộ media JLPT khi rà hội thoại. Không coi tải hết blob là điều kiện lưu/push nội dung đã kiểm chứng.

## Khi ổ đĩa dùng chung đầy nhưng vùng nhớ tạm còn đủ chỗ

Có thể chuyển checkout tạm của chính tác vụ sang tmpfs đã kiểm tra dung lượng, giữ một đường dẫn thay thế nếu worker cần. Dừng ghi trước khi chuyển, sao chép và đối chiếu hash toàn bộ file trước khi thu gọn bản cũ; giữ nguyên thay đổi chưa commit. Dùng vùng nhớ đó cho input và snapshot thay vì tiếp tục ghi vào ổ đầy. Vẫn phải lưu từng nhóm lên GitHub và xác minh; tmpfs không phải nơi lưu bền vững. Không chuyển hoặc xóa dữ liệu của phiên khác. Sau xác minh, dọn snapshot và chỉ giữ một checkout gọn.
