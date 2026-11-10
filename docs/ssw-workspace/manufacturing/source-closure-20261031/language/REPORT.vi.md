# Rà soát thuật ngữ và 12 ngôn ngữ — 31/10/2026

Phạm vi chỉ sản xuất 1号. Không sửa dữ liệu bài học, ngân hàng câu hỏi, mã nguồn chạy hoặc kết quả/nghiệm thu cũ. Ma trận thuật ngữ dùng đúng dữ liệu hiện tại cùng các lớp hiệu đính đang chạy, không đánh giá nhầm nội dung cũ được cố ý giữ nguyên trong ngân hàng gốc.

## Đã thực hiện

| Phần | Số lượng thực tế | Ý nghĩa |
|---|---:|---|
| Bản ghi bài học/hướng dẫn | 296 | 262 bài lõi + 22 bài bổ sung + 12 hướng dẫn, không phải 296 bài mới |
| Câu hỏi có ID riêng | 1.809 | 456 câu tuần + 1.200 câu của 30 đề tự soạn + 80 câu bổ sung + 61 câu nhận diện + 8 câu thước cặp + 4 câu Boolean |
| Bản ghi chú thích hình | 42 | 22 chú thích cũ + 5 sơ đồ bổ sung + 15 nhóm nhận diện; 7 bảng bổ sung dùng phần tổng kết đã dịch của bài học, không đếm lại |
| Vị trí thuật ngữ trong bài/hướng dẫn | 1.077 | Mỗi vị trí giữ định nghĩa Nhật, hash bài và đường dẫn trường dịch |
| Cách viết thuật ngữ Nhật khác nhau | 854 | Không gộp mọi định nghĩa đồng chữ thành một nghĩa |
| Trường đích đã kiểm tra cấu trúc | 207.600 | 17.300 trường/ngôn ngữ × 12 ngôn ngữ; hiện diện, kiểu chuỗi, cấu trúc, thứ tự, hash và ID được kiểm |
| Lỗi thiếu trường/hash/ID phát hiện | 0 | Đây là kiểm tra cấu trúc, không phải chứng nhận ngữ nghĩa |
| Đối chiếu ngữ nghĩa mới trong phiên | 204 | 17 vị trí thuật ngữ trọng yếu × 12 ngôn ngữ, so với định nghĩa Nhật đã biên soạn |

Thứ tự rà soát: Việt → Anh → Indonesia → Trung giản thể/phồn thể → Hindi/Bengali/Nepal → Myanmar/Thái/Khmer/Philippines. Nhóm trọng yếu đã đọc gồm dung sai/sai lệch cho phép; anôt/catôt; mật độ dòng; mạ không dùng dòng ngoài; dòng điện xoáy; chất bán dẫn/cách điện; thiếu vật liệu hàn và tính thấm ướt; tôi/ram/ủ; tẩy dầu/tẩy axit; độ bám dính.

`terminology-map.json.gz` có đường dẫn chính xác tới từng vị trí Nhật và 12 nghĩa đích. Phần câu hỏi có 10.971 vị trí xuất hiện thuật ngữ Nhật được định vị; 735/854 cách viết xuất hiện trong những trường này, 119 không có khớp chuỗi trực tiếp. **119 không có khớp không đồng nghĩa thiếu câu kiểm tra**: câu hỏi có thể dùng biến thể, tình huống hay cách diễn đạt khác. Có 171 nhóm thuật ngữ lặp ở nhiều bài cần xét đúng ngữ cảnh, không tự sửa cho giống hệt nhau.

## Kết quả ngữ nghĩa và xử lý

Không xác nhận lỗi bắt buộc mới trong 204 định nghĩa đã đọc. Năm nghi vấn khi chỉ nhìn ngân hàng cũ đã được giải quyết từ trước bằng lớp hiệu đính có kiểm tra hash và câu chữ: mật độ dòng tiếng Nepal; vật liệu cách điện và ram thép tiếng Hindi; dòng điện xoáy tiếng Hindi/Nepal. Đã chạy chính hàm hiệu đính của sản phẩm để xác nhận 204 giá trị đích hiện hành khớp hồ sơ rà soát. Không tạo bản sửa trùng.

Bốn ứng viên làm rõ cách gọi được ghi riêng, **chưa coi là lỗi đã kết luận và chưa tích hợp**:

- Việt: `はんだ不足` dùng “lượng thiếc”; cân nhắc “vật liệu hàn mềm (thiếc hàn)” để tránh hiểu là kim loại thiếc tinh khiết.
- Khmer: cách gọi vật liệu hàn ở `はんだ不足` và `はんだ濡れ性` có thể là tên nghề thông dụng nhưng dễ bị hiểu thành chì. Cần người bản ngữ/chuyên gia xác nhận ngữ cảnh trước khi sửa.
- Nepal: `無電解めっき` nên diễn đạt chính xác “dòng điện được cấp từ bên ngoài” thay vì từ điện nói chung nếu biên tập lại.

Cách gọi Thái “ตะกั่วบัดกรี” là thuật ngữ hàn thông dụng; chỉ dựa vào nghĩa từng chữ không đủ để kết luận câu đang nói về vật liệu có chì. Không thay toàn bộ các từ thiếc/chì bằng quy tắc máy móc.

## Chưa thể nghiệm thu đầy đủ

- 207.396 trường đích chưa được đối chiếu ngữ nghĩa mới trong phiên này; trong đó 12.720 nghĩa thuật ngữ còn ngoài mẫu 204 vừa đọc. Hồ sơ `field-review-ledger.json.gz` liệt kê từng trường còn lại.
- Hồ sơ cũ báo 12.216 nghĩa thuật ngữ đã rà và 421 sửa chữa, thêm 28 trường an toàn. Phiên này tái sử dụng lớp hiệu đính để lấy đúng giá trị đang chạy; không cộng những số đó thành số mới đã đọc hay suy ra tất cả bản dịch hiện hành được chứng nhận.
- Các trang nguồn gắn với thuật ngữ được kế thừa từ bài học. Chúng là đầu mối truy xuất, **chưa phải bằng chứng từng thuật ngữ đã được đối chiếu nguyên tử với vị trí trong PDF**. Cần hợp nhất với các đơn vị kiến thức do ba luồng chuyên ngành xác lập.
- Khớp thuật ngữ Nhật trong câu hỏi chỉ cung cấp vị trí để rà soát, không chứng minh đáp án hoặc mọi bản dịch đúng cùng nghĩa.
- Chưa có xác nhận của chuyên gia hoặc người bản ngữ. `nativeReviewed`, `domainReviewed`, `humanReviewed`, `releaseReady` vẫn false.

## Tiếp tục theo thứ tự ưu tiên

1. Gắn các vị trí thuật ngữ với unit ID/bbox đã được ba luồng nguồn xác minh; giữ riêng liên kết đang chỉ kế thừa cấp bài.
2. Rà toàn bộ nghĩa, cách dùng trong đoạn giải thích, lựa chọn và lý do đáp án tiếng Việt; sau đó Anh, Indonesia, rồi các nhóm ngôn ngữ còn lại.
3. Đọc các cặp thuật ngữ gần nghĩa và câu hỏi có số liệu theo ngữ cảnh; dùng 171 nhóm lặp và 119 mục chưa khớp chuỗi làm hàng đợi, không tự đánh dấu thiếu/đúng.
4. Khi có lỗi thực sự, tạo bản sửa với `lessonId`/`questionId`, đường dẫn trường, hash nguồn, câu trước/sau và bằng chứng nghĩa. Chỉ tích hợp qua lớp hiệu đính có điều kiện, giữ ID, thứ tự đáp án và tiến độ.
5. Nghiệm thu chuyên gia/người bản ngữ riêng; không biến kiểm tra cấu trúc hay AI rà soát thành duyệt con người.

## Kiểm tra tái lập

```bash
python docs/ssw-workspace/manufacturing/source-closure-20261031/language/audit.py
python docs/ssw-workspace/manufacturing/source-closure-20261031/language/validate.py
node docs/ssw-workspace/manufacturing/source-closure-20261031/language/check-runtime-values.mjs
```

Hai tệp `.json.gz` là dữ liệu JSON nén, đọc bằng `gzip.decompress`; giữ đủ đường dẫn trường nhưng tránh lưu lặp văn bản bài học/nguồn lớn. Không chứa bản PDF hoặc ảnh trang nguồn.
