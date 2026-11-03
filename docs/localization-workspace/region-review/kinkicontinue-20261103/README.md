# Kinki/Kansai — tiếp tục rà ngữ cảnh đủ 12 ngôn ngữ

Mốc đầu lượt: 100/1.115 bài đã có bằng chứng hợp lệ, còn 1.015 bài.
`assignment.json` loại 100 bài đó khỏi phạm vi mới và giao độc quyền từng
locale batch cho sáu worker. Một batch biên có thể chứa bài của hai tỉnh;
quyền sở hữu file được giữ nguyên, không kiểm chéo ngữ nghĩa.

Mỗi bài mới phải được đọc ngữ cảnh Nhật, 11 câu thoại và 5 gợi ý trong đủ
12 ngôn ngữ. `workerN-partNNNN.json` lưu từng nhóm đã thực đọc;
`worker-N.json` tổng hợp các phần của chính worker đó. Bộ kiểm tra chỉ cộng
aggregate, không cộng lại từng part. Giữ các part để helper tiếp tục đúng
ID, không đọc lại bài hoàn tất. Các lỗi nguồn chưa chốt được ghi riêng.

```bash
export DIALOGUE_REVIEW_SESSION=docs/localization-workspace/region-review/kinkicontinue-20261103
python scripts/dialogue-region-review.py status 1
python scripts/integrate-kinki-context-review.py --session "$DIALOGUE_REVIEW_SESSION" --baseline 8c8464e6e25233afdab6c354501c8b7ce5547f4b --comparison-ref origin/recovery/jlpt-n3-n1 --write
```

`progress.json` là kết quả đối chiếu hash và tích hợp của checkpoint hiện
hành. Sàng lọc tự động không thay cho rà ngữ cảnh; rà AI không đồng nghĩa
duyệt bản ngữ, nghiệm thu nguồn, phát âm hoặc thiết bị.
