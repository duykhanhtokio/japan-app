# Thực phẩm — nguồn → bài → kiểm tra, 2026-11-02

Đã thay cơ chế đóng theo chủ đề bằng sổ nguồn có ba lớp tách biệt: trang/vùng trích xuất, ý kiến thức được đọc và bằng chứng bài/đánh giá hiện hành. Sổ chuẩn duy nhất: `docs/ssw-workspace/source-coverage-v2/food.json`.

| Hạng mục | Kết quả thực tế |
|---|---|
| Nguồn | Phục hồi và kiểm SHA hai PDF, 86 + 165 = 251 trang |
| Census | 251 trang, 88.031 đối tượng; giữ chữ nhỏ/ruby, ảnh, vector, liên kết/chú thích hỗ trợ bởi bộ trích xuất |
| Đọc trực quan đợt này | 2号 trang PDF 92–101; trang 94 chỉ phân chương, 9 trang còn lại vẫn partial |
| Ý theo dõi | 96: 52 ý mới đọc trực tiếp + 44 mục cũ giữ candidate |
| Nghiệm thu hẹp AI | 16 covered_ai, 36 partial, 44 candidate; 33 bằng chứng dạy trực tiếp và 16 bằng chứng đánh giá trực tiếp |
| Nội dung bổ sung | 2 phần dạy, 2 bài tự trả lời, 4 ý đáp án, 12 ngôn ngữ, 12 trường ruby, 1 hình gốc |
| Bảo toàn | 848 câu và 96 ngày; không đổi tiến độ học hay bài thi gốc |

Bài 49 trình bày đủ tám mẫu tín hiệu biểu đồ trong phạm vi ví dụ tài liệu, giữ điều kiện liên tiếp/cửa sổ mẫu và phân biệt nhận xét với nguyên nhân. Hai dãy số tự xây giúp kiểm tra trường hợp còn nằm trong giới hạn nhưng có chín điểm cùng phía và sáu điểm tăng liên tiếp. Bài 50 bổ sung so sánh năng suất khi cả đầu vào/đầu ra tăng hoặc cùng giảm; phép tính 132/12 = 11 và 90/8 = 11,25 được kiểm độc lập. Hình được vẽ bằng dữ liệu giả định, không chép bố cục hình nguồn.

Đã tự loại các liên kết rộng không đủ nghĩa: phép cộng tổng chi phí không kiểm tra định nghĩa từng loại chi phí; câu nhắc bản ghi không kiểm tra tính đầy đủ; câu biểu đồ chung không nghiệm thu mọi mẫu riêng. Các hàng này giữ partial/candidate với giới hạn bằng chứng rõ ràng. Vùng tọa độ chỉ định danh phần nguồn đã đọc, không tự quyết định đạt.

Kiểm tra: hợp đồng v2 PASS; SSR thành phần thật 52 lượt/12 ngôn ngữ, 4 ca sai bài/hash cũ bị chặn; đáp án ẩn trước khi mở; số học, ruby, hash hình và ánh xạ PASS. Hồ sơ runtime ghi rõ đây là SSR, chưa phải Expo production/thiết bị thật. Kiểm hồi quy cũ, census tái lập và các lệnh cuối xem `verification.json`.

Chưa đạt: chưa phân rã đủ từng ý của 251 trang; census không chứng minh đủ bảng/hình/chú thích về nghĩa. 44 mục cũ cần gắn vùng chính xác, 36 ý partial cần dạy/kiểm tra tương ứng. Cần tiếp tục đối chiếu ngược app→nguồn, thuật ngữ chuẩn, nhãn hình, phát âm/âm thanh, rà dịch bởi người bản ngữ/chuyên môn, Expo production, thiết bị thật và đo thời lượng. Mẫu số ý kiến thức còn mở, tỷ lệ bao phủ để null; không tuyên bố hoàn tất toàn ngành.

Hiệu chỉnh trạng thái đánh giá: 19 ý chưa có bằng chứng kiểm tra được chấp nhận chuyển từ `missing` sang `unknown`, vì chưa đối chiếu hết phạm vi câu hỏi trong app nên chưa đủ kết luận app thiếu. Tổng trạng thái đánh giá hiện tại: unknown 63, missing 0, partial 12, present 21. Không nới điều kiện covered_ai (vẫn 16); bằng chứng chưa rà không được đổi thành thiếu thật.
