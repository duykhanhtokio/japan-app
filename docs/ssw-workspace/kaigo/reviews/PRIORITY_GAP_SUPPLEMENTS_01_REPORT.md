# Kaigo — cụm khoảng trống ưu tiên 1, 2026-10-07

Trạng thái: **NOT_READY_FOR_INTEGRATION**. Hai phương án thay khối ôn đã được soạn và rà AI; chưa được chọn trong curriculum, chưa duyệt chuyên môn/bản ngữ/quyền hoặc đo thời lượng. Không tạo tuần 9 hoặc đề mới.

| Phương án | Ngày/bài gốc | Trọng tâm | Phân bổ giữ nguyên |
|---|---|---|---|
| kaigo-gap-worker-health-01 | 14 / kaigo-week2-07 | Báo đau lưng trước hỗ trợ, giảm tải và điều phối theo phương án/đào tạo | 3/8/5/9/5 phút |
| kaigo-gap-infection-01 | 42 / kaigo-hygiene-07 | Nguy cơ qua tay/đồ, găng đã dùng, vệ sinh tay và báo vật đã chạm | 5/5/5/10/5 phút |

Thứ tự cột thời gian: ôn, kiến thức, từ/cách nói, NPC, kiểm tra. Đây là phương án **thay các khối trong 30 phút**, không cộng thêm một bài bắt buộc vào cùng ngày. Dữ liệu bài gốc được giữ. Có đối chiếu sơ bộ các mục tiêu ôn với bài khác; chưa chứng nhận toàn bộ năng lực bài gốc được giữ ở cùng chiều sâu hoặc vừa tải. Hai phương án cần được duyệt cùng lịch trước thay bản đang chọn.

## Nội dung cụm

Hai mô-đun gồm tám đoạn kiến thức có nguồn/giới hạn, hai câu gợi nhớ, 18 lượt hội thoại Nhật–Việt, hai văn bản mới, 10 câu hỏi với 40 lý do từng lựa chọn, bốn cách nói và hai tình huống chuyển giao. Tám lượt người học có rubric theo hai ý nghĩa và hai cách nói chấp nhận; 24 ca accept/clarify/correct là đặc tả chưa chạy bộ chấm. ASR không chắc yêu cầu nói lại hoặc sửa chữ, không suy lỗi kiến thức.

Sáu thuật ngữ khái niệm được giải thích trong bài, không tạo quota ghi nhớ từ mới cho ngày ôn. Nghĩa Việt tự biên tập, cách đọc chỉ rà AI, chưa duyệt bản ngữ hoặc kiểm hình nguồn Nhật. Tái sử dụng ID từ cũ; kiểm không trùng sáu mục mới với kho từ hiện tại.

Đối chiếu AI toàn bộ 18 lượt, hai văn bản, 10 thân câu/40 lựa chọn/40 lý do và tám biến thể: người học không tự chẩn đoán đau; chưa bắt đầu khác đã hoàn tất; điều phối chưa xác nhận khác đã có người thay; không bỏ bác một mình. Case nhiễm khuẩn phân biệt găng nguyên với găng sạch, thay găng với xử lý màn hình và chưa có ghi nhận với chưa làm. Hướng dẫn thao tác chuyển người, vận hành thiết bị, PPE, rửa tay và khử khuẩn không được suy ra từ lời thoại; cần đào tạo/kiểm trực tiếp.

## Nguồn và sửa tham chiếu

Sách chuẩn tháng 3/2025 khớp SHA-256 `997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54`. Đọc text-layer trang in 24–40, xem trực tiếp trang in 29/34/39 (PDF31/36/41). Chỉ dùng kiến thức/thuật ngữ; không nhập hội thoại, hình hoặc thao tác nguồn vào nội dung mới.

Đối chiếu thêm hai nguồn chính MHLW ngày 2026-10-07: [感染対策の手引き 第3版](https://www.mhlw.go.jp/content/12300000/001155694.pdf), và [保健衛生業における腰痛の予防](https://www.mhlw.go.jp/stf/newpage_31197.html). Trang in 24/26/27/28 của hướng dẫn nhiễm khuẩn lần lượt là PDF27/29/30/31, đếm từ 1. Offset của tài liệu MHLW là +3, không phải +2 của sách học. Không khẳng định thao tác hoặc tài liệu này tự chứng nhận kỹ năng nhân viên.

Sửa metadata nguồn phụ câu kỹ năng q05 từ in28/PDF30 thành **in27/PDF30**; cập nhật hash câu và snapshot liên quan. Giữ nguyên stem, lựa chọn, correctIndex, lời giải, furigana, ID, quota và chính sách cả hai đề. Báo cáo bản sửa đề được chỉnh locator; checkpoint cũ giữ lịch sử và có bản đính chính mới. Không tạo phiên bản câu hỏi mới chỉ cho metadata nguồn.

## Bằng chứng kiểm tra

`priority-gap-supplements-01-evidence.json` khóa file mới, 30 hash dữ liệu gốc được bảo toàn và hai đơn vị duyệt chưa ký. Các validator kiểm liên kết ngày/NPC/từ/rubric, 30 phút, không gán hai bài bắt buộc cùng ngày, trường ngôn ngữ, stem/lời người học trùng nguyên văn với bài/đề cũ, cổng duyệt và sửa cặp trang MHLW. Kiểm đề sửa bản2 và gói review toàn khóa xác nhận hash được đồng bộ.

Screen phần mới: 341 trường ngôn ngữ; 58 trường dài ít nhất 60 ký tự chuẩn hóa; 0 trường khớp cửa sổ 60 ký tự với text-layer sách chuẩn. Không kiểm trùng ý, hình, nguồn khác hoặc quyền pháp lý. Những tình huống mới khác tình huống tham khảo đã đọc ở mức nhận định biên tập AI; chưa có người ký xác nhận.

Toàn khóa gốc vẫn 54 bài / 270 câu kiểm bài / 60 câu thi thử. 10 câu ở hai candidate là nội dung thay thế dự kiến, không cộng vào quota khóa chính. Worklist cũ 114 đơn vị chưa ký được giữ, hai candidate có worklist riêng chưa ký. Không đổi `approved-plan`/curriculum, app/UI/JLPT, hình NPC/audio hoặc các câu thi.

## Phần còn dở

C04/C05 mới được bổ sung một phần ở mức khái niệm/giao tiếp. Cơ học cơ thể thực hành, dụng cụ, phòng thiên tai, PPE, thao tác vệ sinh tay, khử khuẩn và phản ứng ổ dịch vẫn còn khoảng trống. Cần rà chuyên môn, bản ngữ, quyền, tải học và quyết định chọn phương án trước tích hợp. Chưa đo 30 phút hoặc thời gian thi, chưa có runtime evaluator.

Bước tiếp sau lưu bền: xử lý C03 về quá trình chăm sóc/dịch vụ trong tám tuần và ma trận giữ độ bao phủ khi chọn các phương án ôn thay thế; không tự mở rộng số đề hoặc tuần học.
