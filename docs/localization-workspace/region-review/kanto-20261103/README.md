# Kanto — hoàn tất rà ngữ cảnh bằng sáu AI

Đã đọc thực **1.681/1.681 hội thoại**, mỗi bài đủ **11 lượt +5 hint Nhật và12locale**: vi,en,id,tl,zh-CN,zh-TW,hi,bn,ne,my,th,km. Tổng **322.752 trường** được kiểm bằng hash và loader thực. Không còn bài pending; không kiểm chéo ngữ nghĩa. Bằng chứng hợp lệ từ mọi checkpoint/cập nhật đồng thời được giữ, không đếm hoặc rà lại.

| Chủ phạm vi | Bài đã rà | Trường đã kiểm | Pending |
|---|---:|---:|---:|
| 1 | 291 | 55,872 | 0 |
| 2 | 250 | 48,000 | 0 |
| 3 | 240 | 46,080 | 0 |
| 4 | 340 | 65,280 | 0 |
| 5 | 250 | 48,000 | 0 |
| 6 | 310 | 59,520 | 0 |

Tích lũy sửa **6.361 trường dịch**, **696 metadata hintJa**, **58 hint Nhật**, **116 goal/evaluationNotes** và **58 task authoring**. Đồng bộ60hint mirrors từ patch/bằng chứng chủ phạm vi. Không thay lời thoại nói, IDs hoặc audio. Chỉ chuyển nguyên lô chưa được đọc để cân bằng; mọi lần chuyển có artifact riêng, gồm [ownership-transfer-final-tail.json](ownership-transfer-final-tail.json).

## Bằng chứng và kiểm tra

- [integration-qa.json](integration-qa.json): quyền sở hữu, đủ12locale/16fields, hashes hiện tại, reverse replay tới baseline, source-hint/runtime/authoring amendments.
- [loader-qa.json](loader-qa.json): dữ liệu dịch và metadata qua loader thực.
- [global-technical-qa.json](global-technical-qa.json): kiểm tra kỹ thuật toàn kho và queue hợp các bằng chứng; không đồng nghĩa nghiệm thu phát hành.
- [source-issues-open.json](source-issues-open.json): **7 ghi chú nguồn do chủ phạm vi báo**, trong đó4 mục được chính chủ phạm vi đánh dấu chặn nghiệm thu đầy đủ. Coordinator giữ và tổng hợp, không tự kết luận lại ngữ nghĩa. Các thay đổi spokenJA nếu cần phải đồng bộ nguồn, bản dịch/ruby và audio.
- [resume.json](resume.json): sáu phạm vi đã dừng, mỗi phạm vi pending0.

Receipt đầy đủ nằm trong worker-N.evidence.json.gz; worker-N.json là wrapper có SHA256 của cả archive và nguyên bản. Python validator, loader và thư viện global kiểm hashes rồi giải nén. [receipt-transport-normalization.json](receipt-transport-normalization.json) xác minh roundtrip byte-for-byte, không bỏ reviews/notes/before-after. Nếu cần tiếp chỉnh sửa, chỉ coordinator chạy python scripts/kanto-receipt-transport.py expand khi toàn bộ worker đã ngừng; không reset các thay đổi biểu diễn sau expand.

Sau lần môi trường bị làm mới, bằng chứng được cứu từ GitHub, gói còn giữ và nguyên văn/ghi chú/sửa đổi của đúng AI đã đọc, không dựng review từ số đếm. Những mục thiếu bằng chứng đã được phục hồi hoặc đọc đủ trước khi tính vào1.681. Các gói dự phòng ở nhánh recovery/kanto-evidence-20261103; mốc1.497 đã WORK PERSISTENCE PASS. Mốc main trước đó1.403: fa836e81d75c6e8daf0ad4af18bee929eab092bb.

Baseline target portable tại [baseline-file-hashes.json](baseline-file-hashes.json); authoring có [authoring-input-baselines.json](authoring-input-baselines.json) và [authoring-input-integration.json](authoring-input-integration.json). Giữ các lịch sử Git và bằng chứng đồng thời; không force push. Native review, phát âm/nghe, thiết bị và release approval chưa được chứng nhận bởi đợt rà AI này.
