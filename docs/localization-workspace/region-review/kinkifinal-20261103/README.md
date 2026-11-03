# Kinki/Kansai — phân bổ cân bằng phần chưa rà

Mốc vào: 366/1.115 bài đã có bằng chứng; 749 bài chưa đọc được đưa vào
`assignment.json`. Tất cả bài đã đạt ở các phiên trước bị loại khỏi danh
sách mới. Chia lô theo tổng byte văn bản cần đọc của đủ 12 ngôn ngữ để
cân bằng khối lượng; tính dung lượng không phải rà ngữ nghĩa.

Mỗi locale batch chỉ có một worker được ghi file. Giữ assignment bất biến
và không dùng assignment cũ khi tiếp tục phiên này. Helper đọc/ghi:

```bash
export DIALOGUE_REVIEW_SESSION=docs/localization-workspace/region-review/kinkifinal-20261103
python scripts/dialogue-region-review.py status 1
python scripts/integrate-kinki-context-review.py --session "$DIALOGUE_REVIEW_SESSION" --baseline 3360d67197355f1612a71f0f92df9433f0df6ecb --comparison-ref origin/recovery/jlpt-n3-n1 --write
```

Chỉ record sau khi thực đọc ngữ cảnh Nhật và trọn 11 câu/5 gợi ý trong đủ
12 ngôn ngữ. Worker tự rà; không kiểm chéo. Aggregate `worker-N.json` là
tổng hợp chính xác các `workerN-partNNNN.json`; bộ kiểm tra không cộng
trùng part và aggregate. Giữ cờ chưa duyệt bản ngữ và ghi riêng vấn đề nguồn.
