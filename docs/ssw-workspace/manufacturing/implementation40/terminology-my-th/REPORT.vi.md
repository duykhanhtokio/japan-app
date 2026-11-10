# Rà soát thuật ngữ Myanmar và Thái — implementation40

Đủ **2.154 quyết định duy nhất**: Myanmar 1.077, Thái 1.077; không còn trường chưa đọc trong phạm vi bảng thuật ngữ.

Độ phủ bao gồm **49 trường kế thừa** có biên nhận đọc thực tế từ luồng surface_coverage (Myanmar 0–18, Thái 0–29) và **2.105 trường mới đọc** trong luồng này. Các bản chụp biên nhận bất biến và khóa chính xác nằm trong `provenance.json` và `inherited-*.json`. Không cộng trùng 11 trường Thái đã đọc trong nhóm đầu.

Có **7 đề xuất sửa** có giá trị trước/sau và hash chính xác: Myanmar 6, Thái 1. Myanmar có các lỗi phạm vi bị dịch thành khoảng cách, giới hạn chữa cháy an toàn bị thu hẹp thành khoảng cách an toàn, và thiếu quá trình oxy hóa anot trong định nghĩa anodizing cứng. Thái có câu kiểm tra điểm không dễ hiểu thành tắt dụng cụ thay vì đóng hai mỏ đo caliper. Chi tiết nằm trong `correction-proposals.json`.

Có 6 quyết định nguồn/ngữ cảnh cần xác nhận thêm, tách riêng trong `context-review-pending.json`; không tự động sửa. Bao gồm định nghĩa tiếng Nhật 端数 chưa rõ, cách gọi dòng sự cố, môi chất tôi, dung sai hình học và nhám so với độ sóng. Giữ các từ đồng nghĩa hợp lý và điều kiện giới hạn của nguồn.

Phạm vi đọc: nghĩa tiếng Nhật được cung cấp và từng định nghĩa Myanmar/Thái hiệu lực, giữ khóa bài và hash nguồn; không đọc lại toàn bộ văn xuôi bài học. Không chứng nhận người bản ngữ, chuyên gia hoặc mọi câu hỏi/bản dịch. Không chỉnh dữ liệu chạy ứng dụng.

Tái lập bản ghi và kiểm tra:

```sh
python docs/ssw-workspace/manufacturing/implementation40/terminology-my-th/record_batch.py
python docs/ssw-workspace/manufacturing/implementation40/terminology-my-th/check.py
```

Kiểm tra PASS: 2.154 khóa/ngôn ngữ duy nhất, hash đầu vào và giá trị trước/sau đúng, 0 chưa đọc. Kiểm thử tự động xác nhận tính toàn vẹn; không thay thế việc đọc ngữ nghĩa. Khi tích hợp, đối chiếu chính xác `targetField`, `before`, `targetSha256`, `lessonSourceHash`; không thay thuật ngữ hàng loạt.
