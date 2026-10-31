# Kiểm kê nguồn điện–điện tử 1号 — 31/10/2026

Đã kiểm tra đúng PDF 198 trang bằng SHA-256 `b846a05aa2c33a490e2bb706fe14ad55d587e7fd60718a4e09ab1cd28033bdcf`. Danh mục bao gồm trang bìa, cả tám trang mục lục, 188 trang nội dung và trang xuất bản. Không bỏ trang theo mật độ văn bản. PDF, bản trích văn bản và ảnh trang chỉ dùng trong vùng làm việc riêng, không đưa vào mã nguồn hay gói ứng dụng.

## Kết quả có thể xác nhận

- `page-index.json`: đủ 198 trang, loại trang, số/ID đối tượng trích được, liên kết TOC, bài/câu hỏi dẫn trực tiếp trang đó, bằng chứng lịch sử và việc cần làm tiếp từng trang.
- `objects.json`: 36.216 **lần xuất hiện đối tượng máy trích**, gồm 13.334 khối văn bản, 19.653 nhãn hoặc mảnh văn bản ngắn, 162 vùng có ký hiệu/công thức/đơn vị, 101 ứng viên bảng với 1.836 ô, 490 vị trí ảnh và 640 cụm vector. Số này chứa rất nhiều mảnh furigana, đường trang trí và đối tượng chồng lấn, **không phải 36.216 đơn vị kiến thức**. Không dùng tổng này làm mẫu số tính phần trăm bao phủ học thuật.
- Mỗi đối tượng có trang, bbox, hash và vị trí trong bộ trích. 19.031 lần lặp có cùng hash văn bản/ảnh được gắn `duplicateOf`, nhưng vẫn giữ từng lần xuất hiện vì ngữ cảnh có thể khác nhau. Không tự coi một ảnh lặp là kiến thức thừa.
- `knowledge-units.json`: 39 khẳng định nhỏ được AI đối chiếu mới với nguồn và đoạn bài hiện có, trải trên 24 trang. Có 22 khẳng định gắn câu hỏi đúng mục tiêu và 21 khẳng định gắn thuật ngữ Nhật hiện có. Đây là đối chiếu liên kết mục tiêu; **không thay thế rà toàn bộ đáp án và ba phương án nhiễu**. 17 khẳng định còn thiếu liên kết câu hỏi riêng đã vào hàng đợi.
- Nguồn đã được đọc văn bản mới có phạm vi 29 trang ưu tiên; chín trang được xem ảnh toàn trang ở mức tổng quan. Các bảng ký hiệu, biểu thức và hình quá trình chưa được chứng nhận đủ từng chi tiết hình học.

## Các điểm nguồn phải giữ điều kiện

1. Trang 99 và 152 mô tả khả năng đo dòng AC với phạm vi khác nhau. Bài `l073/section-2` đã diễn đạt theo chức năng, cổng vào và định mức từng máy; không chuyển câu khái quát trang 152 thành lệnh cấm cho mọi DMM.
2. Trang 105: khoảng nhiệt độ ghi cho K-type không phải phạm vi đảm bảo của mọi cảm biến. Giữ lớp điều kiện sản phẩm và hồ sơ errata hiện có; không tạo câu hỏi bắt buộc chọn khoảng đó như quy tắc phổ quát.
3. Trang 151 chỉ nêu tên phương pháp cầu và giải thích phương pháp điện áp–dòng điện; không suy rằng trang đã dạy cấu tạo/cân bằng của mọi mạch cầu. Bài bổ sung hiện có đã giới hạn nội dung đúng phạm vi này.
4. Trang 161 có cả hai dạng phân phối trong logic nhị phân. Liên kết phải tới **đoạn hiệu lực sau overlay** `boolean-editorial.json`, không chỉ đoạn lịch sử thiếu dạng thứ hai. Ledger ghi hash cả đoạn gốc và đoạn hiệu lực.
5. Bảng so sánh hợp kim hàn, mô hình diode không có dòng ngược, sơ đồ tự giữ và quy trình ảnh khắc PCB đều có giới hạn mô hình/vật liệu/cấu hình. Không biến thành quy trình vận hành hay tiêu chuẩn chấp nhận chung.

## Hai trang chưa được dẫn trực tiếp

Trang 38 là bài phân loại QCDS/PDCA/4M/ba hiện/5S; trang 97 là ví dụ đọc micrometer. Chưa có bài hoặc câu hỏi dẫn trực tiếp hai trang này. Điều đó **không chứng minh toàn bộ kiến thức của chúng chưa dạy**: các bài `l045/l050/l051` và `l004` có những năng lực liên quan. Bảng công việc ghi cần đối chiếu từng năng lực. Loại trừ việc chép nguyên biểu đạt, ảnh và bộ số của bài tập nguồn; không loại trừ kỹ năng nền.

## Phần chưa thể đóng

Cả 198 trang vẫn chưa đạt trạng thái đóng toàn bộ đơn vị kiến thức. Máy trích có thể làm vỡ công thức, xen furigana, nhận nhầm bảng hoặc bỏ bảng trong ảnh. Mọi vùng ảnh/vector/bảng vẫn có hàng đợi rà ý nghĩa, kể cả trang không có nhiều đoạn văn. Các liên kết tự động theo trang hay TOC chỉ là ứng viên, không nâng thành “đã dạy/đã kiểm tra”.

Ưu tiên tiếp theo trong `remaining-work.json`: ký hiệu và mạch; dụng cụ, thang đo và sai số; dây–đầu nối; hàn; linh kiện và bán dẫn; logic/timer/điều khiển; kiểm tra và QC. Cần liên kết nốt từng câu khẳng định với đoạn giải thích, thuật ngữ và mục tiêu kiểm tra; trường hợp không dùng phải có lý do riêng. Không tự thêm câu tính nếu dữ kiện và điều kiện không đủ.

Không sửa bài học, ngân hàng đề, UI, bản dịch hoặc đánh dấu nghiệm thu chuyên gia/người bản ngữ/thiết bị thật trong luồng kiểm kê này. Chỉ luồng tích hợp của phiên làm việc mới ghi trạng thái chung sau khi hợp nhất bằng chứng.

## Tái lập

Chạy `build_inventory.py --pdf <PDF đúng hash> --scratch <thư mục riêng ngoài repo>`, sau đó `build_reviewed_units.py --pdf <PDF đúng hash>`, và `PYTHONDONTWRITEBYTECODE=1 python validate.py`. Trình kiểm tra xác nhận đủ trang/ID, hash nguồn và liên kết hiện tại; không tự chứng nhận ý nghĩa học thuật hay thiết bị thật.
