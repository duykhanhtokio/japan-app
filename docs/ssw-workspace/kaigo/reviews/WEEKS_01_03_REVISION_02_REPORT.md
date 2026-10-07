# Hoàn thiện nội dung Kaigo tuần1–3 — phiên bản2, 07/10/2026

## Kết quả trong phạm vi đã duyệt

Đã sửa và hoàn thiện trọn21bài ở mức bản thảo biên tập để trình kiểm duyệt. **Các lỗi A01–A05 đã sửa; chất lượng phát hành vẫn CHƯA ĐƯỢC CHỨNG NHẬN.** Đây không phải lời khẳng định chuyên gia đã duyệt hay app đã tích hợp. Báo cáo rà phiên bản1 được giữ làm lịch sử, không bị thay bằng báo cáo PASS.

Chủ dự án duyệt: sửa lỗi và hoàn thiện ba tuần trước, giữ30phút/ngày và cân đối lại kiến thức/giao tiếp/câu hỏi. Phạm vi lần này là nội dung biên soạn, hồ sơ và kiểm tra liên kết; không thay UI hay tự chuyển sang tuần4.

| Thành phần | Phiên bản1 | Phiên bản2 |
|---|---:|---:|
| Bài/tuần | 21/3 | 21/3 |
| Phần kiến thức | 1–2ý/bài | 4phần giải thích/bài,84phần;21bộ khác nhau |
| Hội thoại Nhật–Việt | 176lượt | 176lượt; ngày12 luyện trực tiếp với người sử dụng |
| Bài đọc | 21 | 21, sửa đồng bộ dữ kiện và bản Việt |
| Câu hỏi | 69 | 105;5câu/bài |
| Rubric lượt người học | 88 | 88, tách ý bắt buộc/tùy chọn và cách xử lý |
| Ca đánh giá/hỏi lại có dữ liệu cụ thể | Chưa có bộ21scenario | 84ca,4ca/scenario |
| Bài chuyển giao | Chưa cụ thể từng ngày | 21trường hợp riêng |
| Thuật ngữ khái niệm dùng chung | Chưa có | 14mục, cách đọc mới chỉ AI rà |

Có36câu áp dụng mới. Cải thiện phương án nhiễu của20câu cũ ở cuối bài, sửa thêm lệnh hỏi/phương án ngày10 và câu hỏi chủ thể ngày16. Giữ các câu đọc hiểu đơn giản để kiểm chi tiết thông tin; không tuyên bố mọi câu đều có độ khó tương đương thi thật. Thứ tự lựa chọn được sắp lại một lần ở dữ liệu luyện bài, luôn đi cùng đáp án và giải thích; chưa quyết định thuật toán cho đề thi thử hoặc runtime.

## Các lỗi đã xử lý

| Mã | Sửa cụ thể | Bằng chứng kiểm lại |
|---|---|---|
| A01 | Tanaka là người kiểm lối phải; Kishimoto giải thích đổi đường và báo nơi nhận. Sửa vai player, bài đọc Nhật/Việt, câu move-q09, giải thích, knowledge/rubric và responsePolicy. | Chủ thể khớp giữa thoại/bài đọc/đáp án; checker riêng có hồi quy ngày16. |
| A02 | Lượt2, expression, mẫu/biến thể ngày19 đều giữ 今は/bây giờ. | Không còn 今日は参加 trong các trường đó; ca mẫu phân biệt từ chối hiện tại với cả ngày. |
| A03 | Hai literal escape ngày18/20 đổi thành ký tự khoảng trắng thực U+3000. | Kiểm sau parseJSON không có chuỗi literal backslash-u trong phần hiển thị. |
| A04 | Bối cảnh ngày13 chỉ ghi đã thấy nước, đã liên hệ, chưa nhận báo cáo và chưa kiểm toàn bộ. | Không còn cung cấp dữ kiện “chưa ai té” như sự thật đã biết. |
| A05 | Nêu hướng đứng đối diện quầy để xác định bên phải; đồng bộ thoại, đọc Nhật/Việt, đáp án và rubric. | Đọc lại bản dịch phát hiện thiếu mốc và đã bổ sung trước kiểm cuối. |

## Nội dung và tải học

| Khối | Phút/ngày | Việc người học thực hiện |
|---|---:|---|
| Ôn/gợi nhớ | 3 | Tự trả lời một câu có đáp án kiểm; ngày1 là đầu vào. |
| Kiến thức | 8 | Đọc4phần, so sánh case đúng/vượt phạm vi, giải thích lý do, sửa hiểu nhầm. |
| Từ/cách nói | 5 | Kiểm nghĩa trong bài, che mẫu và nói lại, chọn điểm yếu để ôn. |
| NPC | 9 | Đọc vai, nói lại ít gợi ý, luyện nhánh hỏi lại đã viết và case chuyển giao. |
| Văn bản/câu hỏi | 5 | Đọc, trả lời5câu trước xem đáp án, ghi điểm cần ôn. |
| Tổng | 30 | 210phút/tuần;630phút/3tuần là lịch hoạt động dự kiến. |

Không dùng số phút để chứng minh thời lượng thực tế. `durationMeasured=false` ở tất cả21bài. Nếu người học chưa xong phần câu hỏi trong khối5phút thì ghi phần cần tiếp tục; không tự coi đã đạt. Nhắc ôn1/3/7/14/30ngày vẫn là kế hoạch, chưa có scheduler chạy trong app.

Tuần1 làm rõ tôn nghiêm, tự quyết, đồng ý có phạm vi, tự lập thể chất/tinh thần, riêng tư/bảo mật, từ chối một phần và bàn giao. Tuần2 bổ sung bộ phận/cơ-xương-khớp ở mức khái niệm, dấu hiệu sinh tồn, nhóm tư thế, khác biệt lão hóa, giao tiếp thị giác, sa sút trí tuệ/triệu chứng cốt lõi/BPSD, nguy cơ và báo thay đổi. Tuần3 phân biệt ADL/IADL, mục đích di chuyển, đường đi/dụng cụ, kế hoạch cá nhân, giảm hoạt động kéo dài/tì đè ở mức nhận biết, lựa chọn theo thời điểm, hạn tham gia và thông tin cập nhật.

Không dạy thao tác chuyển người, kê tư thế, dùng phanh/đặt tay hoặc chọn phương tiện thay chuyên môn. Kiến thức về sức khỏe không được biến thành lời chẩn đoán hoặc phác đồ. Bộ từ khái niệm ghi rõ14mục có cách đọc AI, chưa kiểm trực quan/bản ngữ;16từ di chuyển đã có hồ sơ kiểm nguồn từ trước giữ trạng thái riêng.

## NPC và đánh giá theo ý nghĩa

88lượt có danh sách `requiredMeaningVi`, phần tùy chọn, mẫu/biến thể và mô tả complete/partial/unsafe/clarification/ASR. Không yêu cầu câu trả lời trùng mẫu, không để kính ngữ tốt bù hành động sai. Gợi ý sửa không đưa ngay cả câu trả lời.

84ca gồm: biến thể đủ ý; câu thiếu ý cụ thể; câu suy đoán hoặc sai phạm vi; nhánh NPC hỏi lại/đổi yêu cầu có phản hồi player được viết. Nhánh có `inputSpeaker=npc` để tránh nhầm câu hỏi của người sử dụng thành lời người chăm sóc. Nhánh kết thúc hoặc đổi mong muốn không bị ép quay lại việc người sử dụng đã từ chối.

**Đây là ca mẫu/đặc tả biên tập; không phải84kết quả chạy bộ chấm.** Máy phân loại ý nghĩa, ASR và router NPC chưa được triển khai/kiểm thử. Ngày12 giờ dùng NPCMorikawa trong bối cảnh giả định hồ sơ chuyên môn đã xác nhận, không gán sa sút trí tuệ cho mọi tình huống có nhân vật đó.

## Ma trận21ngày đã hoàn thiện

| Ngày | Trọng tâm kiến thức | NPC | Câu hỏi | Nguồn trang in đã liên kết |
|---|---|---|---:|---|
| 1 | Tôn nghiêm và vai trò | kaigo-npc-resident-a | 5 | 10, 16, 20, 102 |
| 2 | Đồng ý có phạm vi | kaigo-npc-resident-b | 5 | 10, 12, 13, 103 |
| 3 | Tự lập thể chất và tự quyết | kaigo-npc-resident-c | 5 | 12, 13, 129 |
| 4 | Riêng tư và bảo mật | kaigo-npc-resident-a | 5 | 16, 102, 104 |
| 5 | Từ chối một phần và thương lượng | kaigo-npc-resident-c | 5 | 10, 12, 16, 104 |
| 6 | Nghe lại và trách nhiệm tiếp theo | kaigo-npc-care-peer | 5 | 104, 115, 118 |
| 7 | Ôn tổng hợp: lựa chọn và mức hỗ trợ | kaigo-npc-resident-b | 5 | 10, 12, 13, 16, 118 |
| 8 | Cơ thể, dấu hiệu và lời than | kaigo-npc-resident-b | 5 | 24, 46, 48, 122, 204, 207 |
| 9 | Tư thế và dữ kiện quan sát | kaigo-npc-nurse | 5 | 24, 115, 118, 123, 124, 206 |
| 10 | Lão hóa có khác biệt cá nhân | kaigo-npc-resident-a | 5 | 68, 69, 70, 105 |
| 11 | Hạn chế thị giác và định hướng | kaigo-npc-resident-c | 5 | 102, 108, 109 |
| 12 | Nhận thức, cảm xúc và sa sút trí tuệ | kaigo-npc-resident-a | 5 | 42, 88, 93, 94, 95, 102, 104 |
| 13 | Mối nguy, sự cố và trạng thái thông tin | kaigo-npc-care-peer | 5 | 24, 25, 115, 118 |
| 14 | Ôn tuần2: thay đổi và báo cáo | kaigo-npc-nurse | 5 | 24, 46, 68, 70, 115, 118, 129 |
| 15 | Ý nghĩa di chuyển và ADL | kaigo-npc-resident-a | 5 | 120, 121, 129 |
| 16 | Đường đi, dụng cụ và kiểm tra | kaigo-npc-care-peer | 5 | 25, 118, 128, 129 |
| 17 | Kế hoạch cá nhân và hỗ trợ tự lập | kaigo-npc-care-lead | 5 | 13, 118, 129 |
| 18 | Giảm hoạt động và thay đổi khi di chuyển | kaigo-npc-nurse | 5 | 115, 118, 126, 127, 129 |
| 19 | Thời điểm lựa chọn và tham gia | kaigo-npc-resident-c | 5 | 10, 12, 103, 129 |
| 20 | Bàn giao hai trạng thái độc lập | kaigo-npc-care-peer | 5 | 115, 118, 129 |
| 21 | Ôn tuần3: thông tin cập nhật | kaigo-npc-care-lead | 5 | 115, 118, 120, 129 |

## Rà lại và kiểm chứng

Đã đọc lại105câu hỏi/đáp án sau sắp lựa chọn và phần dữ kiện thay đổi. Lần đọc phát hiện hai vấn đề bổ sung: lệnh hỏi ngày10 không còn khớp một phương án cũ; responsePolicy ngày16 còn mẫu phản hồi của vai chưa thống nhất. Cả hai đã sửa. Bản Việt ngày11 được bổ sung hướng đứng để khớp Nhật.

Ba validator tuần kiểm cấu trúc,ID/link/lượt/đáp án/rubric. `check-kaigo-content-revision.mjs` thêm kiểm hồi quy lỗi chủ thể, bây giờ/hôm nay, escape sau parse, mốc hướng nhìn, vai trực tiếp ngày12,21bộ kiến thức khác nhau,105câu,88rubric,84ca, ngày/lịch/nguồn và cờ kiểm duyệt. JSON kết quả ghi hash đầu vào. Script không chứng minh chuyên môn hoặc xác định mọi câu hỏi đều không mơ hồ; kết luận biên tập dựa thêm vào đọc nội dung.

Quét806trường kiến thức/thoại/bài đọc/lệnh hỏi/lựa chọn với cửa sổ60ký tự liên tục sau bỏ khoảng trắng, so với text riêng của sách chuẩn: không phát hiện trùng dài theo phép kiểm này. Phép kiểm có thể bỏ sót do furigana/lớp văn bản, không đo tương đồng ý nghĩa/hình và không chứng nhận quyền sử dụng. Không công bố PDF/OCR nguồn. Nguồn chuẩn được kiểm lại hash khớp phiên bản3/2025.

## Gate và bước tiếp theo

- Sửa lỗi dữ kiện/hiển thị A01–A05: hoàn thành ở bản thảo, có kiểm lại.
- Hoàn thiện21bài theo phạm vi sửa đã duyệt: hoàn thành phần biên tập và hồ sơ hoạt động; chờ kiểm chuyên môn/ngôn ngữ/quyền.
- Độ khó tương đương thi thật, hai đề45/15câu, thao tác thực hành: chưa chứng nhận; không gọi105câu kiểm cuối bài là đề đầy đủ.
- Đo30phút trên người học, runtime/audio/thiết bị: chưa thực hiện.
- Các cờ domain/native/rights/runtime/release vẫn false.

Trước tích hợp/phát hành cần duyệt chuyên môn/bản ngữ/quyền và kiểm thực tế thời lượng/cách chấm. Các quyết định ngôn ngữ đề kỹ năng, furigana, thuật toán đáp án thi thử, chấm điểm/resume vẫn mở, không cản hoàn thành phần sửa bài đã được phép. Không tự viết tuần4 trong đơn vị này.
