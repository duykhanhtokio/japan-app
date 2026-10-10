# Lịch học Kaigo 26 tuần · 2026-10-10

Đã triển khai lịch và điều kiện hoàn thành theo yêu cầu mới. Yêu cầu ảnh riêng cho toàn bộ đoạn **chưa hoàn tất**; không coi bản này là hoàn thiện toàn bộ Kaigo.

## Giao diện và tiến trình

- 26 ô tuần luôn hiện theo thứ tự, dùng khung giấy kem/viền vàng, nền navy và font của app. Số cột tự thích nghi chiều rộng.
- Chọn tuần hiện bảng 7 ngày bên dưới. Giữ 176 buổi; ngày 177–182 làm mờ và vô hiệu hóa. Ngày trống không tính nhiệm vụ.
- Chọn ngày mở một trang giấy dài: đề mục lớn, in đậm, hoa văn phân đoạn. Có 231 đề mục kiến thức nền tự biên tập, không dùng câu bị cắt dở làm đề mục. Từ, cách nói, hội thoại, văn bản và 8 tình huống bổ sung cũ được trình bày liền mạch, không biến mỗi ý thành một ô.
- Không có ô nhập câu hoặc kiểm tra xen kẽ trong trang học. Xem tới cuối trang mới mở nút “Hoàn thành ngày học”; bấm và lưu thành công mới ghi ✓ xanh. Đây là xác nhận của người học, không đo mắt đọc hay mức hiểu.
- Đánh giá cuối tuần là mục riêng sau bảng ngày. Trả lời đủ câu, nộp, rồi bấm “Hoàn thành kiểm tra”; không yêu cầu điểm đạt. Dấu kiểm tra gắn với ngày cuối có nội dung. Tuần có ✓ khi các ngày có nội dung và đánh giá đều được xác nhận. Không tự nâng tiến trình từ việc mở bài hoặc đáp án cũ.
- Lưu riêng ngày học và đánh giá; tải lại khôi phục dấu ✓, đáp án đánh giá và tuần đang chọn. Mục Thi thử vẫn có đủ 12 đề đầy đủ với lượt lưu riêng cũ.

## Câu hỏi và nội dung

Tổng 687 câu đánh giá có 4 lựa chọn: 310 câu trắc nghiệm do dự án đã viết (bài nền và tình huống bổ sung), cùng 377 chuyển đổi nhận diện từ ca/tự giải thích/bài đọc của dự án. Giải thích đúng giữ nguyên ý đối chiếu cũ; ba nhiễu là giải thích thuộc bối cảnh khác của chính dự án, không tự tạo chỉ dẫn y tế sai. Không gọi đây là 687 câu thi mới độc lập, không chứng nhận đánh giá nhận diện tương đương nói/viết tự do. Tải câu hỏi cuối tuần chưa đo trên người học; không khẳng định mọi đánh giá này hoàn tất trong 30 phút. 30 phút là ngân sách dự kiến của từng buổi học cũ.

Các câu có ID riêng cho đánh giá tuần. Chữ ký nội dung tuần nằm trong khóa lưu để tránh dùng lại đáp án khi phương án hoặc nội dung đổi. Không đổi 7 tệp JSON runtime cũ: content, atomic, language, gap, depth, completeness và daily-plan. Toàn bộ SHA trước/sau được kiểm; mã bài, revision, câu và kho lưu cũ không bị xóa. Controller đề thi đầy đủ và styles cũ của nó được giữ nguyên byte; giao diện học cũ không còn là export đang chạy. Không sửa UI JLPT.

Bản reader có 176 buổi và 866 mục trình bày (gồm các tình huống bổ sung). Đây là số mục UI, không phải số nguyên tử kiến thức nguồn hoặc bằng chứng đủ 100% sách.

## Minh hoạ: phần đã có và còn thiếu

Giữ 10 ảnh bìa cũ; thêm **1 ảnh riêng mới** cho “Vai trò của các chuyên môn chăm sóc”, tại `assets/kaigo/paragraphs/foundation-01-team-v1.webp`. Tạo bằng built-in image_gen, tham chiếu phong cách duy nhất là ảnh do dự án tự sản xuất `assets/kaigo/lessons/choice-v1.webp`. Không dùng ảnh sách, OCR, bố cục hình nguồn hoặc tracing. Đã kiểm trực quan phong cách 2D màu, nhân vật trưởng thành, nét mảnh/màu ấm và không mô tả thao tác điều trị. Chuyển WEBP quality90 không đổi kích thước/cắt ảnh; tỷ lệ1619/972. [Prompt và phương pháp](paragraph-art-prompts-2026-10-10.json).

[Bảng kiểm ảnh theo đoạn](paragraph-art-coverage-2026-10-10.json) ghi 866 ID riêng; **865 mục còn chờ ảnh riêng**. Không lặp ảnh bìa ở mọi đoạn rồi báo đủ. Registry chỉ đăng ký ảnh riêng đã tạo và kiểm; chưa có ảnh thì chưa ghi covered. Yêu cầu bổ sung minh hoạ toàn bộ vẫn còn công việc, không có blocker nguồn hoặc yêu cầu xin phép mới cho việc này.

Ảnh học giữ tỷ lệ gốc và `cover` trong chính khung ảnh. Với màn hình ngang, chiều rộng khung bị giới hạn theo chiều cao khả dụng; ảnh có thể nhỏ hơn trang giấy nhưng không có dải trắng bên trong ảnh, không phóng méo hoặc cắt mất chủ thể để lấp toàn trang. Ảnh bìa và sơ đồ học cùng dùng helper này. Còn cần kiểm native và các kích thước/scale chữ khác.

## Bằng chứng kiểm tra

- PASS mô hình: 26 tuần,182 ô,176 ngày hoạt động,6 ngày trống;687 câu/4 lựa chọn,ID và đáp án hợp lệ;866 ID mục không trùng;7 JSON cũ giữ SHA;5 trường hợp tiến trình sai bị từ chối.
- PASS TypeScript tập trung bằng `runtime-tests/2026-10-10-weekly-calendar/tsconfig.focused.json`; không phải noEmit toàn repo/Expo.
- JLPT approved UI lock10/10 PASS; không đổi hash khóa.
- [Browser thực thi component thật](../runtime-tests/2026-10-10-weekly-calendar/evidence.json): đủ176 ngày đúng thứ tự,6 ô không mở được; hoàn thành ngày/tuần và đáp án khôi phục sau tải lại; đánh giá làm sai vẫn có thể hoàn thành theo yêu cầu; không có input/câu hỏi xen vào reader;866 mục/nội dung đoạn hiển thị và12 đề còn có trong danh mục. Không có page error.
- Bố cục được kiểm ở390×844,768×1024,844×390, không tràn ngang. Tỷ lệ ảnh riêng được đo và ảnh ngang nằm trong giới hạn chiều cao. Ảnh chụp cuối gồm lịch, tuần26, reader và đánh giá ở ba kích thước, cùng ảnh đầu trang. Các lượt lỗi harness/ARIA trước đã sửa, không được coi là PASS.

Chưa kiểm iPhone/Mac native, Expo Router đầy đủ, người học thực tế, chuyên môn/bản ngữ/quyền hay release-ready. Đợt này không xử lý thêm trang nguồn và không tăng phần trăm bao phủ. Diễn giải lâm sàng trang195 vẫn chờ chuyên gia/nhà xuất bản; mẫu số toàn nguồn chưa xác minh, tỷ lệ vẫn null.

## Tiếp tục

Hoàn thiện ảnh riêng theo bảng866 mục, kiểm từng ảnh và bổ sung registry theo đúng nội dung, rồi kiểm lại ảnh ở các viewport. Không bỏ việc còn thiếu hoặc công bố đủ chỉ vì lịch đã chạy. Sau công việc bố cục/ảnh, lượt rà nguồn tiếp theo vẫn là trang in51–70; không lặp trang31–50 để tăng số trang đã xử lý. Lưu patch riêng Kaigo trên recovery/jlpt-n3-n1 và bảo toàn mọi thay đổi JLPT đồng thời. Baseline phiên này: abd7f40a2d65a3cbe70c403a5944fae52e051729.
