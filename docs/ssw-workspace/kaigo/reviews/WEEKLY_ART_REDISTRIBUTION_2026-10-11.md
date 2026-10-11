# Phân bổ lại ảnh Kaigo — 2026-10-11

Chỉ thị: dừng tạo ảnh vì quá nhiều cảnh trùng; dùng ảnh đã có trên đủ lịch26tuần.

- 396ảnh giữ nguyên byte, không tạo thêm/xóa/ghi đè. Chọn129ảnh cho176buổi;267ảnh còn lại giữ trong kho.
- 1ảnh ngữ cảnh/buổi. Tuần1–25:7ảnh/7buổi; tuần26:1ảnh/ngày176. Sáu ngày trống không được thêm bài hoặc ảnh.
- Không lặp ảnh trong một tuần, không hiện lại ảnh bìa dưới mỗi đoạn. Có thể dùng lại ở tuần khác khi ôn cùng mục tiêu.
- Phân bổ bằng đối chiếu chủ đề, hình và chú thích. Các mục thiếu cảnh kỹ thuật riêng dùng cảnh xin phép/chuẩn bị/riêng tư để hỗ trợ nguyên tắc; không coi cảnh chung là mô tả thao tác. Hình kỹ thuật trong nội dung giữ nguyên.
- Toàn bộ866đề mục, dữ liệu/ID/revision/lượt thi, lịch và lưu hoàn thành giữ nguyên. Kiểm hash7tệp runtime và396ảnh so với checkpoint đã lưu.
- Lịch26tuần và JLPT UI lock10/10 đạt. Kiểm dữ liệu phân bổ đạt176ngày/129ảnh/396ảnh nguyên byte. Báo cáo browser riêng kiểm trang thật, không thay cho kiểm native.
- TypeScript toàn repo vẫn có lỗiTS2352 sẵn có tại src/services/life-content-repository.ts: mục SC-HKD-HAKODATE-001 thiếu type trong index. Tệp này không thay đổi; không gọi toàn repo TypeScript là PASS. Lần đầu thiếu các tệp Kensetsu do sparse checkout; đã lấy đủ trước chạy lại và xác định lỗi thực tế còn lại.
- Bộ kiểm browser lần đầu thiếu MIME JavaScript ở máy chủ QA; đã sửa máy chủ và chạy lại. Chỉ kết quả chạy hoàn tất mới được dùng làm bằng chứng.

Nguồn phân bổ: src/data/kaigo/weekly-art-allocation.json. Chỉ thị dừng tạo mới đã lưu tại hướng dẫn v11 và approved-plan.json. Kiểm chuyên môn/bản ngữ/quyền/native/phát hành chưa được chứng nhận.

Browser chạy lại đạt:176ngày,228lượt/3viewport,15ảnhchụp,0JSerrors; xác nhận hash nguồn ảnh, tỷ lệ gốc và không tràn. Đã xem ảnh giao diện điệnthoại/tablet/ngang và contact sheets176vịtrí. Native chưa kiểm.
