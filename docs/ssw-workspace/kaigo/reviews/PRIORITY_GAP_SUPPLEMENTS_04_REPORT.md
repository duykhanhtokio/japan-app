# C06 — bản nháp nhận biết và gọi hỗ trợ khẩn cấp

Ngày 2026-10-08, baseline remote `31403b511e00f6d0a64ebf710db285c0909c3cb3`. Hai candidate chưa chọn, không thêm ngày hoặc quota vào lịch 8 tuần. Bài gốc giữ nguyên; chưa giao học bắt buộc cả gốc và candidate.

Trước lưu, nhánh đã tiến tới `157681e6c49870e567cc834c0cbe9d6d78d498ca` ở phần khác. Đọc lại xác nhận 18 input Kaigo và checkpoint không đổi, năm đường dẫn mới chưa tồn tại. Dùng tree hiện tại và cập nhật ref có expected SHA để bảo toàn thay đổi song song.

| Candidate | Ngày/bài gốc | Trọng tâm |
| --- | --- | --- |
| emergency-handover-01 | 47 / housework-05 | Khó thở đột ngột, gọi ngay, bàn giao sau gọi; tách lời bác/quan sát/việc đã kiểm |
| emergency-call-state-01 | 53 / review-04 | Yếu tay một bên đột ngột, gọi bằng máy khác khi chưa kết nối, địa điểm và trạng thái |

Tổng: 8 phần kiến thức, 16 lượt Nhật–Việt, 2 bài đọc, 10 câu với 40 lý do lựa chọn, 4 cách nói, 8 main rubric và 2 transfer rubric. 30 trường hợp rubric là **đặc tả chưa chạy evaluator**. Bốn ghi chú thuật ngữ nhận biết chỉ kiểm cách đọc bằng AI; không có từ bắt buộc mới.

Hội thoại thứ nhất là luyện bàn giao sau gọi trợ giúp; thứ hai là thẻ diễn tập ngoại tuyến, không gọi thật119. Không cho người học chờ ghi xong, xác định bệnh hoặc điều dưỡng tới mới gọi. Chưa kết nối không phải đã báo xong. Đã kết nối không phải xử lý xong: tiếp tục phối hợp theo hướng dẫn sơ cứu. Đồng nghiệp không đóng tổng đài; địa chỉ/cơ sở là hư cấu.

Case sách rơi giữ thời gian/tầm nhìn, biện pháp đã xác nhận và nguyên nhân chưa rõ. Case miệng/cổ giữ hỏi không dẫn dắt, lời bác khác quan sát và chưa nhìn khác bình thường. Hai case này tách khỏi tình huống khẩn cấp. Sáu dòng đối chiếu năng lực gốc vẫn **partial**, không chứng minh tương đương.

## Kiểm tra thực sự đã chạy

`node scripts/check-kaigo-priority-gap-supplements-04.mjs`: PASS ở mức cấu trúc/ID/link/hash. 99 ID, 18 Gitblob đầu vào bất biến; lịch vẫn trỏ bài gốc. Quota gốc 54 bài, 270 câu bài học và 60 câu mock giữ nguyên. Kiểm trùng câu hỏi với lõi, mock và ba bundle trước; 10 đáp án có phân bố 2/3/3/2, không ba vị trí giống liên tiếp.

Năm negative control được bác bỏ: tự chọn candidate, mở release, đổi đồng nghiệp thành điều dưỡng, coi chưa kết nối là đã báo, chuyển nội dung thành ghi xong mới gọi. Identity candidate kiểm ngoài validator để các control này không bị bác chỉ vì hash thay đổi.

Sách chuẩn được kiểm SHA-256, 276 trang. Đọc in24/26/40/115/118 (PDF26/28/42/117/120), xem ảnh in24/40. FDMA PDF cấp cứu là bản tháng12/2025 (9 trang), kiểm text PDF2/6; kiểm HTML MHLW dấu hiệu/người cao tuổi và FDMA119. Không xác nhận hash nguồn web hay đã xem ảnh dấu hiệu trong PDF web.

Quét nguồn sách:350 trường JA/VI,67 trường dài ít nhất60 codepoint,0 exact match theo NFKC/bỏ khoảng trắng/cửa sổ60 mỗi trang. Không kiểm lexical nguồn web, semantic/hình hoặc chứng nhận quyền sử dụng.

## Tải học và phần còn mở

| Chỉ số JA (NFKC bỏ khoảng trắng) | Day47 gốc → candidate | Day53 gốc → candidate |
| --- | --- | --- |
| Bài đọc | 103 → 223 | 69 → 208 |
| Năm câu hỏi + lựa chọn | 394 → 507 | 364 → 544 |
| Mẫu transfer mới | 98 | 102 |

Không quy số chữ thành phút. Khối 5/5/5/10/5 =30 phút chỉ là bố trí chưa đo, transfer thay slot cũ/0 phút cộng; cần đo đọc, diễn tập, hai output của transfer53, retry và feedback. Chưa ký worklist nào, chưa chọn thay. Nếu quá tải phải sửa hoặc giữ gốc, không cộng bài bắt buộc.

C06 mới bổ sung nhận biết/gọi/bàn giao ở mức khái niệm, chưa hoàn tất kỹ thuật khẩn cấp. Chưa kiểm chuyên môn, bản ngữ, publisher, quyền, evaluator, runtime, app, timing hoặc full repository. Tất cả gate đó false; không sửa UI/JLPT/plan/curriculum/mock và không tạo art/voice. Furigana và dịch sau nộp của mock giữ yêu cầu cũ, không triển khai renderer.

Tiếp theo: xử lý partial mapping còn mở (đặc biệt hỏi đồ mong muốn/xin phép tìm trực tiếp) và đánh giá độ sâu/tải học trước chọn candidate; kiểm chuyên môn C06. Không tự tuần9, thêm đề, tích hợp hay phát hành.
