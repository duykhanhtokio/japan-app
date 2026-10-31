# Rà soát thuật ngữ Khmer — 2026-10-31

Đã đối chiếu 1.077 khóa thuật ngữ với định nghĩa tiếng Nhật: kế thừa 280 mục thực đọc từ luồng surface và tự đọc tiếp 797 mục còn lại. Không còn mục chưa đọc. Đây là rà soát ngữ nghĩa bằng AI, chưa có xác nhận người bản ngữ hoặc chuyên gia.

- 1.066 mục giữ nguyên sau đối chiếu.
- 11 mục đề xuất sửa nghĩa/thuật ngữ cụ thể, có nguyên văn trước/sau.
- Không sửa runtime, ngân hàng câu hỏi hoặc bản dịch nguồn trong luồng này.

`review.json` là receipt chính; mỗi khóa có locale, targetSha256, lessonSourceHash, targetField, decision, contextNote và provenance. Các mục kế thừa ghi rõ nguồn receipt đã đóng băng SHA256 `1ecfec04070c037f78b59c5ae2d6b77fc0c72d66827284fce3bcebd7f91289c3`. Tám tệp `read-*.json` chứa ghi chú từng mục mới thực đọc; script chỉ kết hợp các quyết định đã viết, không tự duyệt theo hash hoặc từ khóa.

Các đề xuất sửa gồm: field effect của FET; từ chỉ xử lý công nghiệp trong số lượng còn lại; mọi tổ hợp đầu vào của bảng chân trị; contactor trong khởi động từ; hai định nghĩa near-miss phân biệt nguy hiểm với tai nạn; động cơ chuyển điện năng thành cơ năng; sinh vật thủy sinh không chỉ động vật; điện trở tương đương của toàn bộ mạch; chất đóng rắn trong sơn hai thành phần; hạt mài phân tán trong chất lỏng.

`validation.json` xác nhận đủ 1.077 khóa duy nhất, hash khớp mục đầu vào, nguyên văn trước sửa chính xác, mục giữ nguyên không đổi và tất cả cờ người bản ngữ/chuyên gia vẫn false. Receipt đầu vào SHA256 `e5a6866b28dc5bcd60903000642ff2bf292bb5500bab2d0cbcb93cf75ebfc5c8`.

Tái tạo receipt từ các quyết định đã đọc:

```sh
python docs/ssw-workspace/manufacturing/implementation40/terminology-km/build-review.py
```

Luồng dịch thuật tổng hợp đã nhận thông báo đường dẫn đóng băng để tích hợp các đề xuất với guard hash hiện hành. Những mô tả RoHS/REACH và phạm vi tai nạn lao động chỉ được đối chiếu ngôn ngữ với nguồn đã cung cấp, không phải xác minh quy định pháp luật hiện hành.
