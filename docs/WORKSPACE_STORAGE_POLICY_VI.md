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
