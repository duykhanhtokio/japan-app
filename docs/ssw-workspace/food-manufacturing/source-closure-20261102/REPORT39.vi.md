# Thực hành khoảng3σ và quyết định của tổ trưởng —02/11/2026

Nguồn2号PDF81–82/trang in72–73 đã được đọc trực quan, đúng bản3.01/hash `a2949e7f8e5282ee163e5015baacc39b0a4aeddf8ffb9b05cb93fb93ea116e57`. Đây là lượt bổ sung kiến thức/thực hành thực tế, không mở lại76trang đã có bằng chứng hoặc tình huống màu38.

Khoảng trống: `food-2-020`, tuần4ngày2, đã dạy khái niệm trung bình, phạm viR và điều kiện3σ. Tuy nhiên,42bài tự kiểm tra34/35/38 chưa có bài tính khoảng3σ và dùng kết quả để xử lý đề xuất quản lý sai. Bài gốc có ví dụ tínhR; chưa có bài tập hai quá trình cùng trung bình nhưng khácσ.

Đã tích hợp một tình huống độc lập và hai bài tự giải thích, tổng7ý trả lời, vào chính ngày học này. Dữ kiện giả định: quy cách38.0–42.0g; hai quá trình ổn định, phân phối chuẩn, cùng trung bình40.0g;σA=0.2g,σB=0.8g. Người học tính được:

| Quá trình | Khoảng trung bình±3σ | Độ rộng |
|---|---|---:|
| A |39.4–40.6g|1.2g|
| B |37.6–42.4g|4.8g|

B vượt cả hai đầu quy cách. Chỉ dịch tâm không thể đưa khoảng rộng4.8g vào quy cách rộng4.0g; cần phân biệt giảm biến động với dịch trung bình. Bài tập thứ hai yêu cầu bác bỏ việc bảo đảm mọi sản phẩm đạt chỉ từ3σ: khoảng99.7% trong giả định phân phối chuẩn ổn định không phải100%; quy cách, kiểm tra, phê duyệt và thẩm quyền thay đổi quy trình vẫn phải được xác nhận riêng. Không biến ví dụ thành thông số vận hành chung hoặc tự cho phép điều chỉnh thiết bị.

Bản Nhật được chốt trước khi dịch12ngôn ngữ. Có12cặp bản dịch phần dạy+24cặp bài tập,84ý trả lời dịch và13trường ruby khớp nguyên văn. Các bản dịch/cách đọc vẫn là ứng viên AI. Tình huống và cấu trúc câu hỏi được viết mới; không lấy ví dụ tối ưu giảm khối lượng của một quá trình ở nguồn82 rồi chỉ đổi số.

`source-closure39.json` được nạp qua Reader thật và component bài tự kiểm tra hiện có; đáp án vẫn ẩn đến khi mở. Giữ nguyên96ID/ngày học,848câu thi, thứ tự đáp án, revision và khóa tiến độ. Hình hiện có của ngày được giữ nguyên; lượt39không tạo hình hoặc chứng nhận hình mới.

Kiểm tra thực chạy:

- `check-source39.cjs`: PASS,26view SSR của component thật (Nhật+12ngôn ngữ ×trạng thái mở/đóng),52trạng thái bài tập,2ca bài/hash sai bị loại;13trường ruby và96đối chiếu số liệu theo ngôn ngữ. Kiểm toán số học độc lập bằng đơn vị0.1g nguyên trong validator; biên soạn dùng Decimal.
- `check-source38.cjs`: PASS hồi quy tình huống màu cũ.
- `check-question-review.py`: PASS848biên nhận câu hỏi hiện hành,0thiếu.
- `check-daily-learning.cjs`: PASS96ngày/hình và76file được bảo vệ.
- `git diff --check`: PASS.

SSR dùng adapter component dịch và tiêm trạng thái mở đáp án chỉ trong test; không phải chứng nhận trình duyệt/thiết bị. Cảnh báo thiếu `expo/tsconfig.base` vẫn tồn tại, scoped bundle đã chạy xong. Chưa có đo thời lượng, nghiệm thu người bản ngữ/chuyên gia, Expo production hoặc máy thật. `fullAtomicSourceDecompositionComplete` và `fullSourceCoverageCertified` vẫnfalse. Hồ sơ trước/sau trong `sigma39.json`, kết quả chạy trong `validation39.json`. Root cần commit/push/fetch xác minh lưu bền.
