# Tổng kết tiến trình nông nghiệp — 28/10/2026

**Trạng thái: đang thực hiện; chưa hoàn tất toàn bộ phạm vi và chưa sẵn sàng phát hành.**

Đợt38 đã hoàn thiện và tích hợp sáu bài 2号 về phân loại cây–quan sát cây giống, đất–thoát nước, an toàn, điều kiện rau–hạt giống, vật liệu nhà kính và ví dụ phân loại hoa. Có36 đơn vị nội dung,72 bản dịch trực tiếp từ Nhật và73 mục đối chiếu nguồn mới được thể hiện. Đây không phải73 năng lực độc lập để tạo câu hỏi.

| Hạng mục | Hiện có | Phần chưa hoàn tất |
|---|---:|---|
| Bài Nhật |195|Tiếp tục đối chiếu khoảng trống nguồn|
| Đơn vị nội dung |1170|Chưa có mẫu số kiến thức độc lập đầy đủ|
| Bài × ngôn ngữ |2.340; đủ 12 ngôn ngữ cho 195 bài|Duyệt bản ngữ và chuyên môn|
| Hình raster |62|Nhận diện cây, phương pháp tưới, dụng cụ và triệu chứng chưa đủ|
| Câu hỏi tuần |421|Mở rộng theo mục tiêu học được kiểm chứng|
| Đề thi thử |4/20;160/800 câu|16 đề và640 câu|

Hai tài liệu có237 trang được kiểm kê. Kiểm tra ảnh trang bằngAI không đồng nghĩa đã xử lý ngữ nghĩa đầy đủ. Các đợt bổ sung đã thể hiện455 mục từ danh mục thiếu ban đầu; còn1.104 mục ứng viên thiếu/một phần và301 mục giữ lại để xác minh. Các lần xuất hiện có thể trùng giữa trang/tài liệu, nên chưa thể công bố phần trăm bao phủ kiến thức.

| Nhóm trong danh mục nguồn | Ứng viên thiếu/một phần | Giữ lại từ danh mục nền |
|---|---:|---:|
| Nhà kính, cây ăn quả và nhận diện liên quan | 296 | 38 |
| Hoa và thuật ngữ liên quan | 187 | 48 |
| Kiến thức nền | 115 | 30 |
| Lúa, cây đồng ruộng và rau | 244 | 50 |
| An toàn và bảo vệ thực vật | 130 | 80 |
| Đất, nước và phân bón | 132 | 55 |

Cần tiếp tục đối chiếu ngữ nghĩa các ứng viên: không phải mọi dòng còn mở đều là một kiến thức độc lập thực sự chưa được dạy. Mục tiêu nhận diện qua hình vẫn mở khi mới có văn bản hoặc tên gọi. Các mục có nguồn mâu thuẫn, điều kiện sản phẩm/quy định hoặc cần kiểm định chuyên môn giữ nguyên trạng thái xác minh.

Hàng chờ mock35 có20 ứng viên ngoài app và17 đề xuất đã loại. Chưa đủ căn cứ để chứng nhận toàn bộ800 câu độc lập. Phải đối chiếu cả phương án sai và lý do của581 câu hiện có trước khi hoàn thiện đề mới.

## Kiểm định và phát hành

Đạt kiểm tra dữ liệu/liên kết nguồn, giữ nội dung cũ, bản dịch đủ ngôn ngữ vàhash, kiểm tra trạng thái lưu, kiểm tra hồi quy đánh giá, TypeScript trong phạm vi thay đổi và trình đọc bằng trình duyệt giả lập. Xem `reader-qa.json` và `manifest.json` cho số ca chính xác. Có adapter giao diện/lưu trữ và phông kiểm tra; không thay thế kiểm thử Expo sản xuất hoặc thiết bị thật.

Chưa hoàn tất: duyệt chuyên môn/người bản ngữ; kiểm thử thiết bị thật và bảnbuild sản xuất; đo thời lượng học thực tế; chốt số tuần dựa trên khối lượng nguồn đầy đủ; hoàn thiện hình nhận diện và16 đề còn thiếu. Trạng thái releaseReady vẫn false.

Lưu bền vững chỉ được xác nhận sau commit, fetch và WORK PERSISTENCE PASS. Bằng chứng cổng lưu được xác minh sau khi xuất báo cáo; không tạo commit chỉ để ghi SHA.
