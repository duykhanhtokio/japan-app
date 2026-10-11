# Ngày 4 — Riêng tư, bảo mật và phạm vi đồng ý

Bổ sung 10 ảnh 2D màu riêng cho 10 mục ngày 4. Tổng 40/866 mục có ảnh riêng; 826 mục còn thiếu. Đợt này là một phần tiếp tục của yêu cầu, chưa hoàn thành toàn bộ.

| ID mục | Ý của cảnh |
| --- | --- |
| kaigo-foundation-04-summary | Lắng nghe trong phòng riêng, tôn trọng mong muốn |
| kaigo-foundation-04-knowledge-0 | Xác nhận phạm vi đồng ý, hồ sơ đóng và điện thoại chưa sử dụng |
| kaigo-foundation-04-knowledge-1 | Nhận diện hạn chế môi trường và trao đổi hỗ trợ thay thế |
| kaigo-foundation-04-knowledge-2 | Báo quan ngại, ghi sự việc và hỗ trợ người sử dụng |
| kaigo-foundation-04-knowledge-3 | Bác đề nghị vào phòng, không hỏi chi tiết ở hành lang |
| kaigo-foundation-04-words | Hành lang, trao đổi riêng, hồ sơ và liên lạc |
| kaigo-foundation-04-dialogue | Cùng xác nhận phần nội dung trước khi chia sẻ cần thiết |
| kaigo-foundation-04-transfer-legacy | Chỉ xác nhận giờ thăm được phép báo |
| kaigo-foundation-04-reading | Ghi mong muốn trao đổi riêng và giới hạn chia sẻ |
| kaigo-language-transfer-256 | Mong muốn tắm, còn chờ kiểm tra và trao đổi phương án |

Ảnh gắn chính xác theo ID trong paragraph-illustrations.ts, dưới tiêu đề từng mục. Chú thích Việt nối hành động với ý học. Phần năm dạng lạm dụng dùng ảnh bước báo cáo/bảo vệ, không giả định ảnh thể hiện đủ cả năm dạng. Cảnh ràng buộc không hướng dẫn thao tác, cảnh tắm không thể hiện thực hiện hay đã duyệt an toàn. Chưa đo hiệu quả ghi nhớ trên người học.

Dùng built-in image_gen, choice-v1.webp tham chiếu phong cách; ảnh tổng quan mới làm tham chiếu nhân vật cho các cảnh tiếp theo. Không dùng ảnh sách hay tái tạo bố cục sách. Nội dung cảnh lấy từ bài độc lập đã có của dự án, không viết kiến thức hay quy trình lâm sàng mới. Rà trực quan cả 10 ảnh về vai, hành động, vật thể và sắc thái; sửa một áo tím thành rose cho nhân vật ngày 4 nhất quán. WEBP quality90 chỉ mã hóa, giữ kích thước/tỷ lệ, không crop/resize. Prompt, edit prompt, kích thước và SHA256 nằm trong inventory và asset-review.json.

Trong QA phát hiện bìa ngày 4 chọn cảnh hoạt động do nhóm dignity. Sửa riêng parentDay===4 sang ảnh privacy-v1 hiện có và chú thích xin phép trước khi vào; không tính bìa này thành ảnh riêng mới. Giao diện, dữ liệu kiến thức/câu hỏi, lịch, ID/revision và tiến trình không đổi.

Lượt cuối chạy actual WeeklyKaigo/RoyalPanels RNWeb tại390×844,768×1024,844×390: 10 mục/10 ảnh mỗi viewport; 30 ảnh decode đúng kích thước/tỷ lệ; giới hạn chiều cao ngang, không tràn ngang, 0pageErrors. Xác nhận chú thích bìa riêng tư có mặt và chú thích chọn hoạt động vắng mặt. Chụp và xem9screenshots. Harness dùng expo-image shim qua RNWebImage, font/back image thật xác minh hashLFS. Không chạy fullExpoRouter hay thiết bị native.

Các lượt trung gian không dùng làm PASS: kiểm bìa theo tiêu đề riêng tư chưa đủ vì tiêu đề catalog dùng tên kiến thức; sửa ánh xạ theo parentDay. Một tệp WEBP từ vựng trung gian trở thành0byte; mã hóa lại từ PNG gốc, kiểm decode/hash cả10asset rồi build và chạy lại. Chỉ evidence.json và9screenshots của lượt cuối được dùng làm bằng chứng.

Calendar model PASS26tuần/176buổi/6ngàytrống/687câu/866mục,7runtimeJSON giữ hash. JLPT approved UIlock10/10PASS; git diff --check PASS. Không tuyên bố fullrepoTypeScript, human/domain/rights review, native hay release ready.

Remote có thay đổi JLPT không trùng các tệp Kaigo trong lúc làm; fetch và fast-forward giữ nguyên. Lưu qua kết nối GitHub được ủy quyền bằng expected-head lease, sau đó fetch và kiểm persistence. Điểm tiếp tục: ngày5, không làm lại ngày1–4; còn826mục ảnh. Rà nguồn51–70 là công việc riêng sau ảnh; đợt này không tăng tỷ lệ bao phủ nguồn.
