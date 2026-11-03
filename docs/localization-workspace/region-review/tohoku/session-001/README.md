# Tohoku — rà ngữ cảnh đủ 12 ngôn ngữ

Yêu cầu tiếp tục của người dùng: 6 AI độc lập, không kiểm chéo ngữ nghĩa; giữ mọi receipt hợp lệ. Queue hiện hành có 702 bài chưa có receipt đủ ngữ cảnh. Assignment bất biến chia theo lô dịch độc quyền, không theo tỉnh vì có lô chứa nhiều tỉnh. Không sửa bài ngoài scenarioIds được giao dù cùng file.

Dùng `DIALOGUE_REVIEW_SESSION=docs/localization-workspace/region-review/tohoku/session-001 python3 scripts/dialogue-region-review.py status 1` và các lệnh context/targets/record như session Chubu. Chỉ record sau khi thực sự đọc ngữ cảnh Nhật và đủ 12 bộ câu/gợi ý. Hash không thay việc đọc. Tiếp tục đến hết phạm vi hoặc chặn thực tế; mỗi phần nhỏ là mốc lưu, không phải hoàn tất vùng. AI review không phải native/source/device approval. Không sửa assignment sau receipt đầu tiên. Điều phối kiểm tra tích hợp/persistence, không kiểm chéo nội dung.
