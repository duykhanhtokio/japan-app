# Chubu — hoàn tất phần còn lại

Mục tiêu toàn vùng là rà ngữ cảnh Nhật và đủ 12 bộ câu/gợi ý của cả 993 bài còn thiếu. Giữ nguyên 439 bài Chubu đã có bằng chứng; không chuyển sang vùng khác. Assignment chia 166/166/166/165/165/165 bài và giao độc quyền file lô dịch. Assignment là snapshot bất biến; tiến độ ghi riêng, không sửa file assignment sau khi đã phát sinh receipt.

Mỗi AI chịu trách nhiệm toàn bộ hàng đợi của mình. Nhóm đọc nhỏ (thường hai bài) là đơn vị trích xuất/lưu bằng chứng, không phải giới hạn số bài hay lý do dừng. Tiếp tục tự động đến khi hàng đợi rỗng hoặc có trở ngại thực tế. Nếu cần đổi phiên do giới hạn ngữ cảnh, bàn giao ID đang đọc và tiếp tục từ status, không đọc lại các phần đã hoàn tất.

## Công cụ

```bash
python3 scripts/dialogue-region-review.py status 1
python3 scripts/dialogue-region-review.py context 1
python3 scripts/dialogue-region-review.py targets 1 --locales en,vi,id
python3 scripts/dialogue-region-review.py targets 1 --locales tl,zh-CN,zh-TW
python3 scripts/dialogue-region-review.py targets 1 --locales hi,bn,ne
python3 scripts/dialogue-region-review.py targets 1 --locales my,th,km
```

Chỉ sau khi thực sự đọc hết ngữ cảnh Nhật và cả 12 bộ đích của các ID đang đọc, tạo input nhỏ:

```json
{"scenarios":[{"scenarioId":"ID_DA_DOC","contextRead":true,"reviewedLocales":["en","vi","id","tl","zh-CN","zh-TW","hi","bn","ne","my","th","km"],"reviewNotes":"Nhận xét riêng của bài: chủ thể, phạm vi hành động, phủ định, tình huống và gợi ý đã đối chiếu.","sourceIssues":[]}],"fixes":[]}
```

Nếu có lỗi thực, thêm từng sửa vào `fixes` với `scenarioId`, `locale`, `turn` (1–11), `field` (`translation` hoặc `hintTranslation`), `before`, `after`, `reason`. Không sửa Nhật, ID, vai nói, giọng hoặc cờ bản ngữ.

```bash
python3 scripts/dialogue-region-review.py record 1 --input /tmp/worker1-read-group.json
```

`record` kiểm ownership, giá trị trước sửa, đủ 12 attestation và lưu phần bằng chứng bất biến `worker1-part0001.json`. Định dạng gọn tách 16 hash nguồn chung khỏi 12×16 hash đích; không thay việc đọc thật bằng hashing. Kiểm tra triển khai mở rộng lại đúng từng trường và đối chiếu nội dung hiện hành, metadata Nhật, ownership và độ phủ. Test fixture chỉ chạy trong bộ nhớ, không được lưu hoặc tính là bài đã rà.

Không sửa receipt cũ và không tính lại bài đã có bằng chứng. Intent PREPARED phải được phục hồi có kiểm tra, không ghi đè bỏ dở. Điều phối viên chốt các mốc lưu có kiểm tra trong khi mục tiêu toàn vùng vẫn mở; chỉ ghi hoàn tất Chubu khi có đủ 1.432/1.432 bài có receipt hợp lệ, pending=0. Rà AI, nguồn chưa rõ, duyệt bản ngữ, thiết bị và nghiệm thu phát hành là các trạng thái riêng.
