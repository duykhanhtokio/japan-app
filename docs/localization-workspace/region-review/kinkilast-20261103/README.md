# Kinki/Kansai — 201 bài chưa rà sau mốc 914

Assignment chỉ gồm bài chưa có bằng chứng hợp lệ; mỗi locale batch có một
worker sở hữu. Các receipt của 914 bài trước giữ nguyên trong các session
trước. Đọc trọn ngữ cảnh Nhật và 11 câu/5 gợi ý trong đủ 12 ngôn ngữ rồi
mới record. Không kiểm chéo ngữ nghĩa; nativeReviewed giữ false.

```bash
export DIALOGUE_REVIEW_SESSION=docs/localization-workspace/region-review/kinkilast-20261103
python scripts/dialogue-region-review.py status 1
python scripts/integrate-kinki-context-review.py --session "$DIALOGUE_REVIEW_SESSION" --baseline df80e9c61d57bb8ad41484a574b7723625c0284c --comparison-ref origin/recovery/jlpt-n3-n1 --write
NODE_OPTIONS=--max-old-space-size=384 node scripts/check-kinki-context-loader.cjs --out docs/localization-workspace/region-review/kinkilast-20261103/runtime-kinki-qa.json
```

Giữ part để tiếp tục không trùng; aggregate worker-N.json là hợp nhất chính
xác các part của worker đó. Các điểm nguồn cần làm rõ được ghi riêng trong
sourceIssues, phân biệt với rà AI, nghiệm thu bản ngữ, phát âm và thiết bị.
