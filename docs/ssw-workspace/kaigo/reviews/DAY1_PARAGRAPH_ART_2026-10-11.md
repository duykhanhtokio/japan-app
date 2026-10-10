# Minh hoạ riêng ngày 1 · 2026-10-11

Đã bổ sung 9 ảnh riêng bằng built-in image_gen và gắn vào 9 mục còn thiếu của ngày 1. Giữ ảnh nhóm chuyên môn đã có: ngày 1 hiện đủ **10/10 mục có ảnh riêng**. Toàn bộ lịch có **10/866 mục có ảnh riêng, 856 mục còn chờ**; chưa hoàn tất yêu cầu ảnh toàn Kaigo.

## Nội dung và phong cách

Ảnh 2D màu, nét mảnh, bóng cel mềm, nội thất kem/gỗ, trang phục teal/navy và nhân vật trưởng thành. Dùng duy nhất ảnh tự sản xuất `assets/kaigo/lessons/choice-v1.webp` để tham chiếu phong cách. Không dùng ảnh, OCR hoặc bố cục hình tài liệu nguồn.

| Mục | Tệp trong assets/kaigo/paragraphs |
|---|---|
| Tổng quan vai chăm sóc | foundation-01-overview-v1.webp |
| Dinh dưỡng, kế hoạch và nguồn lực | foundation-01-resources-v1.webp |
| Giới thiệu vai và phối hợp điều dưỡng | foundation-01-role-boundary-v1.webp |
| Lần đầu gặp tại phòng ở | foundation-01-first-meeting-v1.webp |
| Từ/cách nói về chào hỏi và vai phụ trách | foundation-01-vocabulary-v1.webp |
| Hội thoại chào hỏi ngắn | foundation-01-short-greeting-v1.webp |
| Giới hạn thời gian trước cuộc gọi | foundation-01-phone-time-v1.webp |
| Ghi chép và bàn giao yêu cầu xưng hô | foundation-01-handoff-note-v1.webp |
| Chọn rau và xác nhận phần việc | foundation-01-vegetable-choice-v1.webp |

Đã xem từng ảnh về phong cách, vai, hành động, vật thể và bố cục. Nhân vật của các cảnh liên quan được giữ nhất quán; từng ảnh minh hoạ một sự kiện khác nhau. Cảnh áp dụng trước cuộc gọi dùng người sử dụng khác. Ảnh dinh dưỡng chỉ là trao đổi; ảnh phối hợp chỉ là giới thiệu/liên hệ, không mô tả khám hay điều trị. Không coi hình là quy trình kỹ thuật. SHA khác nhau chỉ kiểm tra không trùng tệp; đánh giá khác biệt tình huống là rà biên tập AI, không chứng nhận quyền hay chuyên môn.

Prompt đầy đủ và metadata: [paragraph-art-prompts-2026-10-10.json](paragraph-art-prompts-2026-10-10.json). Bảng theo từng mục: [paragraph-art-coverage-2026-10-10.json](paragraph-art-coverage-2026-10-10.json). Kích thước/hash và rà ảnh: [asset-review.json](../runtime-tests/2026-10-11-day1-art/asset-review.json).

PNG được mã hoá WEBP quality90, giữ nguyên kích thước; không resize hoặc crop. Registry dùng chính tỷ lệ từng tệp, gồm các sai khác kích thước 1619×971/1618×972 do công cụ xuất ảnh. Không ép mọi ảnh thành cùng một tỷ lệ xấp xỉ.

## Kiểm chứng

- RN Web chạy component KaigoCourse/WeeklyKaigo thật: 390×844, 768×1024, 844×390; 10 mục/10 ảnh mỗi viewport, 30 ảnh decode thành công với đúng kích thước và tỷ lệ. Màn ngang giữ giới hạn chiều cao ảnh; không tràn ngang; 0 page errors.
- Chụp và xem 9 screenshot trong runtime-tests/2026-10-11-day1-art. Kết quả máy: evidence.json và script executed-browser-check.mjs.
- TypeScript tập trung Kaigo PASS; mô hình lịch PASS: 26 tuần/176 buổi/6 ô trống/687 câu/866 mục, 7 JSON runtime cũ giữ hash. JLPT approved UI lock 10/10 PASS; git diff --check PASS.
- Lần build đầu trỏ nhầm thư mục fallback thiếu font; đã chạy lại với font thật trong checkout và đạt. Cảnh báo thiếu expo/tsconfig.base vẫn có trong focused build; không gọi đây là kiểm full Expo Router hoặc toàn repo.

Không đổi nội dung kiến thức, câu hỏi, đáp án, ID/revision/lưu tiến trình, lịch học hoặc controller/UI. Đây là bổ sung ảnh cho nội dung có sẵn, không tăng tỷ lệ bao phủ kiến thức nguồn. Native, chuyên môn, bản ngữ, quyền và release vẫn chưa được chứng nhận.

## Điểm tiếp tục

Tiếp tục ảnh riêng ngày 2 theo thứ tự bảng mục, đọc nội dung app trước tạo prompt, xem từng ảnh rồi tích hợp/kiểm viewport/lưu remote. Không dùng lại bìa để đánh dấu đủ. Sau công việc bố cục/ảnh, lượt rà nguồn tiếp theo vẫn là trang in 51–70; không lặp trang đã xử lý để tăng số. Không làm lại ảnh ngày 1 đã kiểm.
