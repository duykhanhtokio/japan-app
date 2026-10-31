# Khách sạn — hợp đồng triển khai

Yêu cầu người dùng2026-10-31: bao phủ hai PDF tiếng Nhật1号52trang và2号65trang. Quét từng đơn vị kiến thức bao gồm hình/bảng/chú thích; giữ trạng thái trước/sau và bằng chứng đoạn dạy, câu hỏi, hình. Sổ chuẩn duy nhất là knowledge-ledger.json; ledger từng nhóm là đầu vào tác giả, không có hiệu lực nghiệm thu riêng.

Tiếng Nhật là bản gốc biên soạn mới; giữ nguyên thuật ngữ nghề, viết lại giải thích/ví dụ/câu hỏi. Không phân phối PDF/OCR/ảnh gốc trong app. Thông tin nguồn nằm trong hồ sơ biên soạn. Sai khác luật/an toàn giữ rõ phiên bản và xác minh nguồn chính thức; không mặc định nguồn2024 luôn đúng hiện hành.

Lộ trình1号 có các ngày chung;2号 học lại phần chung và có ngày nâng cao riêng. Mỗi ngày có mục tiêu, giải thích, ví dụ, hoạt động, thuật ngữ/cách đọc, hình trọng tâm và kiểm tra. Thời gian25phút là dự kiến thiết kế, chưa đo. Không ép số tuần hoặc tăng khối lượng bằng nội dung lặp. Chính sách DAILY_LEARNING_AND_IMAGE_REQUIREMENTS_VI.md và daily-learning-policy.json áp dụng tương tự cho ngành mới này.

12ngôn ngữ dịch theo cấu hình app: en,vi,id,zh-CN,zh-TW,hi,bn,ne,my,th,km,tl. Dịch sau khi chốt Nhật, giữ sourceRevision; không tính fallback là dịch. Thiếu ghi missing, đã dịch AI ghi translated_ai_unreviewed. Không tự đánh dấu duyệt chuyên gia/bản ngữ/thực máy.

Mở nội bộ __DEV__ theo các ngành hiện có, chưa phải phát hành công khai. Phải kiểm tra đăng ký mục ngành→chọn cấp→ngày→bài→kiểm tra→nộp→giải thích→hoàn thành→khôi phục. Bảo vệ dữ liệu người học bằng ID ổn định và revision. Lỗi đọc không tự ghi đè; lỗi ghi chặn điều hướng và có retry.

Thêm ngoại lệ .gitattributes riêng assets/app/hospitality/*.png để lưu byte ảnh thật trong Git, không phụ thuộc tải LFS.

Phạm vi thay đổi: thư mục hospitality trong src/data, src/components, scripts, docs/ssw-workspace, assets/app; route hospitality.tsx; service hospitality-study-state.ts; chỉ thêm đăng ký khách sạn ở src/data/specified-skills-routes.ts, giữ màn hình index hiện có. Không thay giao diện JLPT đã khóa. Git làm việc riêng nhánh feature/hospitality-20261031 từ đầu tích hợp74df35d91; ngoại lệ nhánh chuyên ngành nằm trong phạm vi người dùng yêu cầu, tránh thay nhánh đang có công việc khác.

Kiểm thử mã/build/web không thay kiểm thử iPhone/Android thật. Phân biệt dữ liệu được tạo, được tích hợp, được kiểm chứng. Chỉ báo hoàn thiện toàn ngành khi các phần yêu cầu có bằng chứng thực tế; mọi tồn tại phải giữ trong CHECKPOINT_VI.md.
