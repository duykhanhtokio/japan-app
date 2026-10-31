# Ngôn ngữ – triển khai 40

Đã soạn 1.716 trường bản dịch mới từ bộ tiếng Nhật đã đóng băng: 1.392 lời giải theo từng lựa chọn của 29 câu và 324 trường cho ba câu thực hành viết lại. Mỗi câu gắn hash tiếng Nhật và phiên bản nguồn trước sửa. Đã kiểm tra đơn vị, số liệu, quan hệ đúng/sai và các trường hợp số được viết bằng chữ; chưa có xác nhận người bản ngữ hoặc chuyên gia.

262 hình theo ngày dùng nguyên văn tiêu đề và tóm tắt bài học làm nhãn thay thế/chú thích. 6.288 trường ở 12 ngôn ngữ được tái sử dụng đúng từ bản dịch hiện hành, không tính là bản dịch mới. Cả 262 liên kết đã đối chiếu với kế hoạch hình của ba chuyên ngành. Việc đối chiếu hình thật và khả năng đọc trên điện thoại được ghi ở luồng hình ảnh.

Luồng này đã thực sự đọc 1.077 định nghĩa tiếng Việt và 1.077 định nghĩa tiếng Anh cùng nghĩa tiếng Nhật; 600 định nghĩa Indonesia đầu được đọc trước khi bàn giao phần còn lại cho luồng riêng. Bộ hợp nhất giữ nguyên xuất xứ từng quyết định để không cộng trùng các lượt bàn giao. `vi-en-corrections.json` có 14 đề xuất sửa có nguyên văn trước/sau; các trường hợp chỉ cần làm rõ nguồn/ngữ cảnh được ghi riêng. Ba làm rõ nghĩa tiếng Nhật có đủ 12 bản dịch tương ứng: phần lẻ của số đọc, khối lượng phân biệt lượng chất/lực, và diện tích vết lõm của phép thử Vickers.

`compile-term-corrections.py` chỉ tạo dữ liệu chạy khi đủ 12.924 quyết định duy nhất, không còn bản ghi chưa đọc, mọi hash nguồn và nghĩa đích đều khớp. Không thay thế từ toàn cục. `check-term-runtime.mjs` đối chiếu với các getter biên tập thực tế, kể cả tài liệu hướng dẫn và các sửa đã có trước; kiểm tra từng sửa mới hoạt động và bị từ chối khi hash nguồn hoặc nguyên văn cũ sai.

Phạm vi rà soát ngữ nghĩa đầy đủ ở đợt này là các định nghĩa thuật ngữ, không phải toàn bộ 207.600 trường văn xuôi/câu hỏi đã kiểm kê cấu trúc trước đây. Định nghĩa đã được AI so sánh không đồng nghĩa với nghiệm thu người bản ngữ, chuyên gia, hay đọc lại từng trang PDF làm bằng chứng nguyên tử. Các điểm nguồn còn chờ được giữ trong hồ sơ từng luồng và không tự chuyển thành bản sửa.

Kết quả hợp nhất cuối: 12.924 quyết định duy nhất (1.077 × 12 ngôn ngữ), không còn mục chưa đọc trong phạm vi định nghĩa thuật ngữ. Đã tích hợp 124 bản sửa có điều kiện, gồm 39 giá trị cho ba làm rõ nguồn Nhật và 85 sửa nghĩa đích khác. Kiểm tra thực tế: 12.924 nghĩa trước sửa khớp getter đang chạy; cả 124 sửa hoạt động; 248 trường hợp nguồn hoặc nguyên văn cũ sai đều bị từ chối. Biên bản: `term-compilation-receipt.json`, `term-runtime-validation.json`.
