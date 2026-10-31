# Đối chiếu nguồn xử lý bề mặt — 31/10/2026

Đã xác minh byte PDF gốc bằng SHA-256 `08d7e9d6ae5fc5a442af227bbc690ed54cde06681ee8806eb7aadf87748b2eae` và số trang thực tế **207**. Chỉ phạm vi 1号. Không sửa ngân hàng, bài học hay giao diện; đây là lớp hồ sơ truy xuất nguồn dùng chung.

| Kết quả | Số lượng / trạng thái |
|---|---|
| Trang có phân loại và thử trích xuất đủ năm nhóm đối tượng | 207/207 |
| Phân loại | 1 bìa, 9 mục lục, 196 trang nội dung, 1 thông tin xuất bản |
| Vùng ứng viên được phân theo tọa độ | 3.676; chưa phải 3.676 đơn vị kiến thức đã hoàn tất |
| Ứng viên đoạn / tiêu đề | 2.128 / 561 |
| Ảnh nhúng / vùng vector | 212 / 632 |
| Bảng / công thức hoặc đơn vị kỹ thuật | 49 / 93 ứng viên |
| Dấu hiệu trùng văn bản chuẩn hóa | 239; cần xem ngữ cảnh trước khi hợp nhất |
| Đơn vị kiến thức được đối chiếu có phạm vi | 45 trên 24 trang |
| Đơn vị có liên kết mục tiêu câu hỏi đã so sánh | 16; chưa phải chứng nhận mọi đáp án nhiễu |
| Vấn đề thiếu giải thích / cần xác minh nguồn bổ sung | 1 đã ghi rõ tại trang179 |
| Trang phóng to đọc trực tiếp trong phiên | 10 |
| Trang đóng toàn bộ kiến thức | 0; chưa chứng nhận bao phủ toàn nguồn |

## Không bỏ qua trang ít chữ

Hai trang ít chữ theo ngưỡng trích xuất là **70 và201**. Đã đọc riêng ảnh phóng to: trang70 chứa hình thang đo điện áp, trang201 chứa giải thích bài luyện về hoàn thiện. Cả hai có vùng đối tượng và liên kết mục tiêu học riêng. Loại biểu đạt câu hỏi/đáp án gốc khỏi việc tái sử dụng không đồng nghĩa loại kiến thức nền ra khỏi phạm vi. Cả49 bảng máy nhận diện và212 lần đặt ảnh đều giữ lại; các bảng ở dạng ảnh như trang141 không phụ thuộc riêng bộ dò đường kẻ.

## Phân biệt các tầng bằng chứng

`page-index.json` kiểm kê trang thực; `object-candidates.json` kiểm kê hình học và hash của vùng trích xuất; `knowledge-units.json` chứa45 ý đã viết lại độc lập và liên kết tới đúng ID đoạn trong bài Nhật; `prior-facets-and-exclusions.json` bảo tồn196 nhận xét cấp trang từ lô33. Không đổi nhãn nhận xét cũ thành bằng chứng vừa đọc mới. Toàn văn nguồn, ô bảng nguyên văn và ảnh trang chỉ nằm ngoài mã nguồn. Không chép nguồn vào app.

Mỗi liên kết đoạn có hash văn bản. Những câu nhận diện được gắn theo mục tiêu thực sự tương ứng, không chỉ do cùng số trang nguồn. Đối chiếu đầy đủ từng phương án và 12ngôn ngữ thuộc các luồng được giao riêng. Những đơn vị chưa gắn được câu hỏi được đánh dấu rõ; không coi một bài đã dẫn trang là đã kiểm tra mọi kiến thức trên trang đó.

## Điểm cần xử lý trước

Trang179 gộp mô tả khí hydro và sương kiềm theo cách cần giải thích chính xác hơn. Đoạn môi trường hiện có mới liên quan chung, chưa đủ để xác nhận đã dạy phân biệt này. Cần nguồn kỹ thuật chính thức và nội dung Nhật phù hợp trước khi tạo câu hỏi.

Các phạm vi cần giữ điều kiện: khả năng áp dụng của thiết bị đo tại71; điều kiện thử ăn mòn tại76; lỗi oxide đã có lớp sửa tại106; mâu thuẫn quy định độ tại108; ký hiệu điện tích/chỉ số tại176; nhiệt độ/sau xử lý tại179/182; bảng tham khảo grit–Ra tại197. Không tự chuyển các giá trị ví dụ thành giới hạn sản xuất hoặc đề tính thiếu dữ kiện.

## Hướng hoàn thiện

Ưu tiên xử lý các vùng thuộc tiền xử lý/tẩy dầu/tẩy gỉ, nồng độ/nhiệt độ/đo, điện hóa, màng phủ, mài/đánh bóng, khuyết tật và môi trường theo `remaining-work.json`. Mỗi vùng phải được duyệt để hợp nhất các chữ nhỏ, nhãn, khung hoặc ruby thành đối tượng thực; sau đó tách ý và gắn đoạn, thuật ngữ, câu hỏi. Các biểu đạt và bài luyện gốc có lý do không tái sử dụng, còn kiến thức nền vẫn phải được phủ bằng nội dung độc lập.

Kết quả tự động: `python docs/ssw-workspace/manufacturing/source-closure-20261031/surface/validate_surface.py` kiểm tra đủ207trang, ID/tọa độ/khóa ngoại/hash, liên kết45đoạn và câu hỏi, giữ hai trang ít chữ. Đây là kiểm tra tính nhất quán hồ sơ, không phải chứng nhận chuyên môn/bản ngữ hay thiết bị thật. Các cờ đóng toàn nguồn/phát hành/chuyên gia/người bản ngữ/điện thoại thật vẫn false.


## Cập nhật hash theo phiên bản tài nguyên

Bốn PNG đo lường được mã hóa lại từ SVG giữ nguyên; các hash câu hỏi gắn hình thay đổi theo biên nhận `../asset-revision-applied.json`. Hồ sơ này cập nhật đúng8 liên kết câu hỏi bị ảnh hưởng, không thay câu chữ, lựa chọn, đáp án, lý do, bản dịch hoặc mở rộng phạm vi đã kiểm ngữ nghĩa. Các liên kết giữ cả hash trước đó và lý do cập nhật.
