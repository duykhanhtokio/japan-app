# JLPT N1-N5 content correction v10

Bản vá này dùng trên dự án đã cài bản v8 và bản sửa N3 v9. Giải nén tại thư
mục gốc của Japan App, cho phép ghi đè, rồi chạy `npx expo start -c`.

## Chuẩn áp dụng cho cả năm cấp

- 言い換え類義・用法: lựa chọn hoàn toàn bằng tiếng Nhật, có câu dẫn và giải
  thích tiếng Nhật; không dùng nghĩa tiếng Việt làm đáp án.
- 文の文法1: mỗi câu có ngữ cảnh; bộ lựa chọn trong cùng cấp không trùng hoàn
  toàn. Riêng bộ N5 trùng trước đây đã được tách lại.
- 文章の文法: mỗi cấp dùng một bài văn thống nhất với năm vị trí 【1】-【5】,
  thay cho năm câu đơn rời rạc.
- 読解: mọi câu có passage, bốn lựa chọn và giải thích; độ dài được mở rộng theo
  từng cấp và từng loại bài trong `構成.pdf`.
- Cơ cấu số câu, section, thời gian, thang điểm 180 và khóa đáp án cân bằng được
  giữ nguyên.

## Kiểm tra phát hành

| Cấp | Tổng câu | Phân bố đáp án 1/2/3/4 | 文法1 bộ đáp án duy nhất |
|---|---:|---:|---:|
| N1 | 108 | 27/27/27/27 | 10/10 |
| N2 | 107 | 26/27/27/27 | 12/12 |
| N3 | 102 | 26/25/25/26 | 13/13 |
| N4 | 98 | 25/24/24/25 | 15/15 |
| N5 | 91 | 23/23/22/23 | 16/16 |

- Lựa chọn có tiếng Việt trong toàn bộ 506 câu: 0.
- 文章の文法 có passage thống nhất: 5/5 cấp đạt.
- Câu đọc thiếu passage hoặc thiếu bốn lựa chọn: 0.
- ID câu hỏi và đáp án đúng: hợp lệ.
- Bundle màn thi: đạt.
