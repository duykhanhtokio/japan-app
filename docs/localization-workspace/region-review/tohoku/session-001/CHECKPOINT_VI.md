# Checkpoint Tohoku — 2026-11-03

Đã rà ngữ cảnh Nhật và đủ 12 bộ câu/gợi ý: **216/702 bài**; còn **486 bài**. Sáu AI độc lập, không kiểm chéo; 118 receipt gắn hash; 274 trường dịch/gợi ý được sửa. Không phải nghiệm thu bản ngữ, nguồn, thiết bị hoặc phát hành.

Đã ghi quy trình lưu GitHub và thu gọn vào `docs/WORKSPACE_STORAGE_POLICY_VI.md`, có liên kết từ AGENTS và hướng dẫn bắt đầu phiên. Checkout chỉ tải dữ liệu cần cho vùng, không tải cả docs/assets hoặc tạo sáu clone.

Đã tạm dừng sau đơn vị hoàn chỉnh khi ổ dùng chung giảm còn khoảng 811MB trống. Không có bài đọc dở chưa ghi receipt. Sau khi điều phối xác minh lưu remote, dọn snapshot tạm; giữ một checkout gọn nếu tiếp tục dùng. Không xóa công việc phiên khác.

Tiếp tục bằng `DIALOGUE_REVIEW_SESSION=docs/localization-workspace/region-review/tohoku/session-001 python3 scripts/dialogue-region-review.py status N` (N=1..6). Không sửa assignment hoặc receipt cũ. Giữ nguyên mọi bài có bằng chứng còn hợp lệ. Đọc source-issues.json trước khi tiếp tục; chưa sửa tiếng Nhật/metadata trong lượt rà bản dịch.

Điều phối chạy `node scripts/integrate-tohoku-context-review.cjs --write` sau khi nhận nhóm mới; hợp nhất các thay đổi remote trước khi ghi tổng hợp và kiểm tra persistence trước khi dọn.
