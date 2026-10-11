# Ngày 3 — Tự lập và mức hỗ trợ

Bổ sung 10 ảnh 2D màu riêng cho 10 mục ngày3. Tổng30/866mục đã có ảnh riêng,836mục còn thiếu. Đây là một đơn vị tiếp tục, không hoàn thành toàn bộ yêu cầu.

Ảnh gắn theo ID mục trong paragraph-illustrations.ts; chú thích nêu quan hệ giữa hành động và nguyên tắc: tự quyết/tự làm, hỗ trợ đúng phần, mục đích xã hội, hỏi lại mức giúp, tự viết thiệp/nhân viên đọc địa chỉ, tự ghi lịch, tự kiểm và đóng góp kinh nghiệm gấp túi. Không dùng ảnh sách, không tạo kiến thức hay quy trình lâm sàng mới; chỉ đọc nội dung do dự án đã viết để xây dựng cảnh độc lập. Dữ liệu kiến thức, câu hỏi, ID/revision/tiến trình và UI giữ nguyên.

Dùng built-in image_gen; choice-v1.webp tham chiếu phong cách. Rà toàn bộ ảnh về hành động, vai, vật thể, khác biệt cảnh. Năm ảnh được sửa vì chi tiết trang trí dễ gợi hoạt động vẽ hoặc áo nhân vật chưa nhất quán. Phiên bản cuối làm rõ mặt viết thiệp/giấy địa chỉ/bút viết; cảnh từ vựng chuyển sang cận cảnh đồ vật. Các cảnh cùng bác Onodera giữ áo ochre; các ca khác có trang phục/bối cảnh riêng. Full prompt/edit prompt, kích thước, SHA256 nằm trong paragraph-art-prompts-2026-10-10.json và asset-review.json.

WEBPquality90, chỉ mã hoá; giữ nguyên kích thước và tỷ lệ, không resize/crop. Mỗi ảnh có chú thích Việt phục vụ liên hệ ý học; chưa đo hiệu quả ghi nhớ trên người học.

Kiểm thực tế WeeklyKaigo/RoyalPanels RNWeb ở390×844/768×1024/844×390:10mục/10ảnh mỗi kích thước;30ảnh decode đúng kích thước/tỷ lệ; màn ngang giữ giới hạn chiều cao; không tràn ngang;0pageErrors. Chụp/xem9screenshots. Harness dùng expo-image shim qua RNWebImage và font thật xác minh hashLFS; không chạy fullExpoRouter/native. Hình bìa chung cũ vẫn tồn tại phía đầu bài, không tính vào30ảnh riêng.

Mô hình lịch PASS26tuần/176buổi/6ngàytrống/687câu/866mục,7runtimeJSONcũ giữhash. JLPT approved UIlock10/10PASS. git diff --check PASS. Không tuyên bố fullrepoTypeScript/chuyênmôn/bảnngữ/quyền/pháthành.

Lượt chạy thử đầu thất bại ở cấu hình alias/decompress Chromium của môi trường QA; đã sửa trong scratch, lượt hoàn tất ghi evidence.json. Chỉ lượt cuối được dùng làm bằng chứng. GitCLI không có credential đẩy; lưu qua kết nối GitHub đã được ủy quyền, dùng expected-head lease, sau đó fetch/kiểm persistence.

Điểm tiếp tục sau xác minh remote: ngày4, theo mục chưa có ảnh trong coverage. Không làm lại ngày1–3. Rà nguồn51–70 là công việc riêng sau ảnh; không tăng tỷ lệ bao phủ nguồn từ đợt ảnh này.
