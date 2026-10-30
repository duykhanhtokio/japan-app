# Sản xuất 1号 — tiếp tục lô 36, ngày 30/10/2026

Đã tiếp tục bằng sáu AI trên commit c1d231be81e1a02823b06c4bfc7ddc2e1db11db1, nhánh recovery/jlpt-n3-n1. Khôi phục ba PDF gốc trong scratch và kiểm SHA-256 khớp manifest. PDF/ảnh trang nguồn không đưa vào repository hoặc app. Không mở rộng sang 2号.

## Nội dung đã đưa vào app

1. Năm hình kỹ thuật độc lập: LCR, nhiệt điện đôi, quan hệ ba phương của hiệu ứng Hall, bộ phận thước cặp và hai đường chéo vết lõm Vickers. Mỗi hình có SVG nguồn, PNG1400×1000, generator, giới hạn áp dụng, liên kết đúng ID/hash bài học và 12 chú thích dịch. Giữ nguyên22 hình cũ; hiện22+5=27 hình,264+60=324 cặp chú thích–ngôn ngữ. Hình mới là khái niệm, không phải hướng dẫn nối điện/vận hành, thông số dụng cụ hay tiêu chuẩn chấp nhận.
2. Bài điện l075 có thêm luật phân phối đối ngẫu x+(y・z)=(x+y)・(x+z), giải thích tám tổ hợp và phân biệt OR/AND với phép cộng/nhân số học; đủ Nhật +12 bản dịch. Lớp bổ sung chỉ kích hoạt khi hash/đoạn Nhật/nguyên văn dịch cũ khớp; không đổi ngân hàng gốc.
3. Bốn câu luyện mới về luật phân phối được tích hợp qua bộ kiểm tra tuần hiện có, đủ48 cặp câu hỏi–ngôn ngữ/432 trường dịch,20 trường furigana hiển thị ở câu hỏi/lựa chọn. Đề bổ sung có ID/revision/khóa lưu riêng và chỉ hoạt động khi phần giảng đúng phiên bản đang có hiệu lực. Giữ nguyên8 câu bổ sung thước cặp/96 bản dịch cũ và456 câu tuần lõi. Không gộp các bổ sung vào số câu của30 đề mô phỏng lõi.

## Đối chiếu và kiểm tra

- Đọc trực tiếp ảnh trang nguồn sau xác minh hash: điện104/105/161, cơ khí72, xử lý bề mặt184. Đây là đọc lại các trang đã có hồ sơ, không tăng số trang duy nhất hoặc suy thành đóng toàn bộ574 trang. AI khác đối chiếu hình/đoạn Nhật,60 chú thích và bốn câu hỏi; không gán thành duyệt người bản ngữ/chuyên gia.
- Kiểm dữ liệu/trạng thái ngành PASS; bảng chân trị tám dòng, đáp án/distractor, hash nguồn/nguyên văn,48 bản dịch,furigana và các trường hợp dữ liệu lệch đều đạt. Lưu/khôi phục đáp án,vị trí,nộp bài,revision và chấm4/4 đạt; đề thước cặp cũ giữ nguyên.
- Registry và10 hash SVG/PNG khớp đúng hồ sơ kiểm độc lập; đổi hình dù giữ kích thước cũng làm mất hiệu lực kiểm tra.
- Render thật component ReactNativeWeb phía máy chủ PASS104 trường hợp hình/chú thích và192 lựa chọn có bản dịch; kiểm bật/tắt dịch và ẩn phiên bản cũ. Adapter appearance/safearea/image được khai báo. Đây không phải trình duyệt, tải ảnh thực, tương tác zoom, bố cục hay thiết bị native.
- ESLint các TS/TSX sửa trong lô PASS0 lỗi/0 cảnh báo. TypeScript toàn app heap6GiB còn đúng1 lỗi đã có ở agriculture/RecognitionImages.tsx:202 TS2322;0 chẩn đoán manufacturing. UI JLPT khóa10/10 PASS;git diff --check PASS.
- Hook cuối assembler khôi phục đúng reader và loader đề đã duyệt, giữ các sửa lô35/36 khi lắp lại bản nháp lịch sử. Kiểm replay trên snapshot cô lập PASS2 tệp, lặp ổn định và từ chối byte lạ trước mọi ghi. Không chạy full assembler hoặc full Expo trong lô này.

## Phạm vi còn lại

262 bài lõi,456 câu tuần,30 đề gốc +3 bộ tuyển chọn,12 hướng dẫn đều giữ nguyên định danh. Năm thiếu sót minh họa được bổ sung ở mức khái niệm đã nêu; không coi đây là đóng toàn bộ đối tượng nguồn. Bốn chi tiết hình còn cần câu hỏi kiểm tra trực tiếp được ghi trong diagram-assessment-mapping.json: nguyên lý nhiệt điện đôi,ba phương Hall,nhận diện bộ phận thước cặp,ý nghĩa hai đường chéo Vickers. Rà toàn bộ ngữ nghĩa bản dịch,kiến thức chi tiết từ574 trang,Expo/native/thiết bị thật và nghiệm thu chuyên môn/bản ngữ vẫn còn. wholeCurriculumComplete/releaseReady/nativeReviewed/domainReviewed/humanReviewed/physicalDeviceVerified vẫn false.

Không có tiến trình ngầm tiếp tục sau khi chốt phiên. Khôi phục từ GitHub/checkpoint này; không cần khởi động lại phần đã qua kiểm tra.
