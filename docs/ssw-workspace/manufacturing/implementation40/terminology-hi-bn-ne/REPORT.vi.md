# Rà soát thuật ngữ Hindi, Bengali và Nepali — implementation40

Đã đọc và so sánh ngữ nghĩa từng định nghĩa đích với thuật ngữ và định nghĩa tiếng Nhật được cung cấp: **3.231/3.231 trường**, mỗi ngôn ngữ 1.077; không còn trường chưa đọc trong phạm vi này.

| Ngôn ngữ | Đã đọc | Đề xuất sửa có giá trị trước/sau chính xác |
|---|---:|---:|
| Hindi | 1.077 | 9 |
| Bengali | 1.077 | 15 |
| Nepali | 1.077 | 4 |

Các lỗi cụ thể gồm nhầm tần suất QC với mật độ; bỏ tỷ lệ trong tỷ lệ lỗi; đồng pha thành cùng chu kỳ; bỏ chênh lệch điện thế trong định luật điện áp; dùng áp suất thay cho độ dôi lắp ghép; chức năng đo nhiệt độ của cặp nhiệt điện; nhầm bám dính với sự trung thành; bỏ sức khỏe trong OSHMS; định nghĩa đơn vị SI và tái chế bị cắt cụt. Danh sách đầy đủ và giá trị sửa nằm trong `correction-proposals.json`.

`semantic-decisions.json` có một quyết định cho mỗi khóa/ngôn ngữ, SHA-256 giá trị đích, đường dẫn trường, hash bài nguồn và ghi chú ngữ cảnh. `read-batches.json` ghi rõ các nhóm thực sự đã đọc. Những trường không tìm thấy sai lệch cụ thể được ghi nhận đúng mức đó, không coi là chuyên gia phê duyệt. Các trường mơ hồ hoặc cần xác nhận chuyên ngành nằm riêng trong `context-review-pending.json`; không tự sửa chúng.

Phạm vi: định nghĩa trong bảng thuật ngữ và điều kiện tiếng Nhật được cung cấp; giữ liên kết bài nguồn. Không đọc lại toàn bộ văn xuôi bài học, không chứng nhận mọi câu hỏi/bản dịch khác, không xác nhận bởi người bản ngữ hoặc chuyên gia. Đặc biệt, định nghĩa tiếng Nhật của 端数 cần làm rõ; không sửa ngôn ngữ đích để che điểm mơ hồ của nguồn. Giữ nguyên các điều kiện giới hạn theo bài học, đơn vị, tính phân biệt thí nghiệm và từ đồng nghĩa hợp lý.

Không sửa dữ liệu chạy của ứng dụng. Khi tích hợp 28 đề xuất, đối chiếu chính xác `targetField`, `before`, `targetSha256` và `lessonSourceHash`; tránh thay hàng loạt từ đồng nghĩa.

Tái lập kiểm tra cấu trúc:

```sh
python docs/ssw-workspace/manufacturing/implementation40/terminology-hi-bn-ne/record_batch.py
python docs/ssw-workspace/manufacturing/implementation40/terminology-hi-bn-ne/check.py
```

Kết quả kiểm tra: PASS; đủ 3.231 khóa/ngôn ngữ duy nhất, hash khớp đầu vào và giá trị trước/sau, 28 đề xuất sửa. Kiểm thử tự động chỉ kiểm chứng tính toàn vẹn và độ phủ bản ghi; không thay thế việc đọc ngữ nghĩa.
