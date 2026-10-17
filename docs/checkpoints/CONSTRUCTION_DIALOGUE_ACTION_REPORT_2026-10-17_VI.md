# Báo cáo xử lý 建設 và Hội thoại địa phương — 2026-10-17

## 1. Vì sao số bài 実技 của 1号 chênh lệch?

Nhận định của chủ dự án có cơ sở: hiện chưa có đối chiếu đầy đủ từng ý nguồn để chứng minh đã lọc hết phần dùng chung. Không thể kết luận tất cả chênh lệch đều hợp lý, cũng không thể coi tất cả bài chưa liên kết là bị bỏ sót.

| Nhánh | Bài 実技 đang hiển thị | Cách ghép | Đoạn Nhật đang hiển thị |
|---|---:|---|---:|
| ライフライン・設備 | 224 | 224 bài gốc | 1.912 |
| 建築 | 163 | 108 bài gốc dùng chung + 55 mục bổ sung | 1.016 |
| 土木 | 152 | 104 bài gốc dùng chung + 48 mục bổ sung | 972 |

Trong 48 mục bổ sung của 土木, có 16 mục riêng và 32 mục dùng chung với 建築. Một mục bổ sung thường chỉ chứa phần kiến thức còn thiếu, ngắn hơn nhiều bài gốc; vì vậy 224/163/152 không phải các đơn vị có tải học tương đương. Số bài không phải tỷ lệ bao phủ kiến thức.

Khi bắt đầu rà: số bài là224/162/151; trước khi lưu, đã hợp nhất các commit từ tiến trình song song, gồm hai mục mới B058/C019 và sửa chín điểm khái niệm đã nhận diện. Số liệu trong bảng là sau hợp nhất, không bỏ phần cập nhật đó.

Đã lập ma trận 224 bài gốc, ghi riêng trạng thái liên kết vào từng nhánh: 建築 còn 116 bài gốc chưa liên kết, 土木 còn 120. Đây là danh sách cần rà, chưa phải số bài phải thêm. Các nội dung riêng về đường ống, điện, truyền thông… không được chuyển hàng loạt sang ngành khác chỉ để làm đều số lượng. Ma trận: `docs/ssw-workspace/kensetsu/PRACTICAL_REUSE_REAUDIT_2026-10-17.json`.

Hướng xử lý:

1. Rà đủ nguồn 5k/6k/7k và 5d/6d/7d, kể cả bảng, nhãn hình, chú thích, điều kiện và ngoại lệ; ghi từng ý có thể kiểm chứng, không chỉ đánh dấu trang đã liên kết.
2. Với mỗi ý, tìm trong toàn bộ 224 bài gốc và các mục bổ sung. Ghi trạng thái: đã đủ, còn nông, thiếu, hoặc riêng ngành và lý do.
3. Nếu cùng ý và cùng điều kiện áp dụng: liên kết tới bài/cụm gốc. Nếu chỉ một phần của bài gốc phù hợp: dùng khung xem theo cụm/đoạn, không kéo cả nội dung riêng ngành sang. Nếu nguồn có kiến thức riêng: soạn mới phần chênh lệch.
4. Rà ngược toàn bộ 224 bài để bắt những ý chung còn chưa gắn vào hai nhánh; kiểm cả 108/104 liên kết hiện có để tránh dùng chung quá rộng.
5. Khi sửa nội dung thật, nâng revision và cập nhật bản dịch/câu hỏi theo nguồn; bảo toàn lịch sử cũ. Kiểm đúng phạm vi, không trùng bài, lịch học và kết quả lưu.
6. Báo số ý đã rà/đủ/thiếu sau khi có mẫu số hoàn chỉnh. Hiện chưa công bố phần trăm kiến thức hoặc trạng thái “đã lọc hết”.

## 2. Quyết định mới cho 特定建設2号

Đã áp dụng yêu cầu ngày 2026-10-17, thay thế quy định cũ “2号 để sau”:

- 学科: dùng cùng 161 bài với 1号, chung ba nhánh.
- 実技: dùng toàn bộ bài của đúng nhánh 1号 tương ứng: utilities 224, building 163, civil 152. Cùng đối tượng dữ liệu/ID bài, không nhân bản nội dung. Khi sửa bài chung, cả hai cấp nhận cùng nội dung.
- Lưu tiến độ theo người học/cấp/nhánh; học xong 1号 không tự đánh dấu 2号.
- Các bộ xác nhận kiến thức hiện có được truy cập tại 2号 với cùng câu hỏi theo nhánh; ID lượt làm tách riêng. Đây là bài kiểm tra nội bộ dựa trên bài học chung, không phải chứng nhận cấu trúc đề thi 2号 chính thức.
- 職長: mục học riêng chỉ có ở 2号, chung cả ba nhánh; chưa có bài kiểm tra 職長.

Đã tiếp nhận 17 PDF, lưu số trang và SHA-256 trong `SOURCE_INTAKE_2GO_2026-10-17.json`. Hai cặp text3k/text3l và text4k/text4l giống byte; điều này không tự chứng minh mọi tài liệu của hai cấp giống nhau. Quyết định dùng chung 学科・実技 là yêu cầu rõ của chủ dự án.

職長 mới có ba bài nháp đầu, sáu cụm, 12 đoạn Nhật và 12 đoạn dịch tiếng Việt: vai trò tổ trưởng và phối hợp; kế hoạch gắn với chất lượng; báo cáo/liên lạc/trao đổi xin ý kiến. Đã đọc và kiểm hình trang PDF7–16 (trang in1–10) của leader.pdf; không tuyên bố mọi ý trong các trang đó đã dạy đủ. Toàn bộ tài liệu 131 trang chưa được soạn xong. Chưa có bản dịch 11 ngôn ngữ còn lại, hình mới, đo thời gian hay duyệt chuyên môn/bản ngữ cho các bài 職長. Lịch tuần đầu đang dở, không gọi là tuần hoàn chỉnh.

Thứ tự tiếp: hoàn thiện ma trận nguồn 職長 năm chương; soạn tiếp vai trò/năng lực, quản lý hiện trường, hoạt động an toàn, hồ sơ bản vẽ, ngành xây dựng; dịch đủ ngôn ngữ, minh họa theo mục tiêu, rồi kiểm duyệt và QA. Không đặt số tuần bằng cách chia đều 131 trang.

## 3. Hội thoại địa phương

Lỗi có thật: kho 7.128 hội thoại Nhật đã có 78.408 lượt, nhưng chưa có bản dịch đầy đủ của câu NPC và câu trả lời mẫu. Một số gợi ý ý định cho người dùng không thay thế bản dịch của câu trả lời.

Đã thêm cơ chế nạp bản dịch riêng theo hội thoại. Mỗi bản dịch ràng buộc ID hội thoại, ID lượt, người nói và nguyên văn câu Nhật; câu gốc hoặc người nói thay đổi thì không áp bản dịch cũ. Không gọi dịch trực tuyến và không lấy ngôn ngữ khác lấp vào ngôn ngữ đang thiếu. Luồng hiện có dùng dữ liệu này cho khung NPC, phần nghĩa câu trả lời người dùng và lịch sử hội thoại.

| Phạm vi | Đã làm | Còn thiếu |
|---|---:|---:|
| Hội thoại đủ 12 ngôn ngữ đích | 1 | 7.127 |
| Lượt có bản dịch đủ 12 ngôn ngữ | 11 | 78.397 |
| Bản dịch lượt × ngôn ngữ | 132 | 940.764 |

Hội thoại đã dịch: `SC-LOC-001-01-001`, phân biệt “hướng Otaru” và “đi Otaru”, gồm sáu câu NPC và năm câu người dùng. 12 ngôn ngữ: en, vi, id, zh-CN, zh-TW, hi, bn, ne, my, th, km, tl. Bản Nhật/ID/liên kết lượt giữ nguyên. Tất cả bản dịch mới là AI chưa được người bản ngữ duyệt. Đây là đợt đầu có dữ liệu thật, chưa phải đã sửa xong toàn kho.

Tiếp tục theo đơn vị hội thoại đầy đủ 11 lượt, kiểm ngữ cảnh và vai người nói, không dùng từ điển câu chung thay cho dịch riêng. Đếm thiếu tự động theo từng ngôn ngữ và ràng buộc câu gốc. Cần kiểm thêm độ vừa khung của hội thoại trên các màn hình, đặc biệt các chữ phức tạp và bản dịch dài.

## 4. Kết quả kiểm tra của đợt này

- Kiểm host dùng component và dữ liệu thật: nội dung 1号/2号 bằng nhau cho sáu phạm vi; ID bài dùng cùng đối tượng; ID lưu kết quả tách cấp; 職長 chỉ ở 2号, chung cả ba nhánh.
- Chromium với adapter RN Web: sáu tuyến kiểm tra 2号, lưu lựa chọn/khôi phục/nộp; chín tuyến đọc 職長 (ba bài × ba nhánh); 36 cặp đoạn Nhật–Việt; lưu hoàn thành 2号 không ghi tiến độ 1号. Không có lỗi runtime được ghi nhận.
- Đã chụp và xem ba kích thước màn hình cho trang đọc 職長. Adapter Royal/ảnh/storage được dùng; chưa phải kiểm Expo sản xuất hay thiết bị thật.
- Kiểm nạp bản dịch qua loader thật đạt 132 bản dịch; loại được bản dịch khi câu gốc, người nói hoặc hội thoại không khớp; giữ Nhật/ID/liên kết; kiểm ưu tiên nghĩa câu trả lời theo ngôn ngữ.
- Kiểm TypeScript phạm vi xây dựng, dữ liệu đời sống và khóa UI JLPT đạt. Bài kiểm cũ `check-dialogue-paired-flow.cjs` chưa dùng làm bằng chứng: môi trường không có TypeScript tại đường dẫn cố định; khi cấp dependency ngoài, fixture cũ còn thiếu `speech.finalTranscript` của giao diện hiện hành. Kiểm loader/bản dịch độc lập nêu trên đã đạt, nhưng không thay thế QA toàn màn hình hội thoại. Các giới hạn duyệt nội dung và nguồn không được thay thế bằng kết quả kỹ thuật.

## 5. Tổng quan toàn app để tiếp nối

Các số dưới kế thừa kiểm kê đã lưu trong `APP_PROGRESS_REPORT_2026-10-17_VI.md`; phần thay đổi trong đợt này được nêu riêng bên trên.

| Phần | Hiện trạng có bằng chứng | Chưa được coi là hoàn tất |
|---|---|---|
| JLPT nguyên tác | 30/30 đề tích hợp; 3.018 câu chấm điểm; giữ đề cũ | Duyệt người/bản ngữ và cảm nhận nghe không tự đạt nhờ QA dữ liệu |
| Hội thoại địa phương | 7.128 hội thoại × 11 lượt, 814 địa phương; 1 hội thoại mới đủ dịch 12 ngôn ngữ | Dịch 7.127 hội thoại còn lại; QA ngôn ngữ và thiết bị |
| 建設1号 | 161 học khoa; 実技224/163/152; mỗi sáu phạm vi có10×40 câu kiểm tra nội bộ | Đối chiếu đủ từng ý nguồn; rà lại dùng chung; duyệt chuyên môn/bản ngữ/quyền |
| 建設2号 | Đã dùng lại toàn bộ 学科・実技 theo nhánh; 職長 ba bài Nhật–Việt mới | Phần còn lại của 職長, ngôn ngữ/hình/duyệt; chưa phải bộ đề 2号 chính thức |
| 介護 | 26 tuần, 176 ngày học, 687 câu theo tuần; 12 đề thử/360 câu; gói dịch tuần và đề đủ12ngôn ngữ | Duyệt chuyên môn/bản ngữ, đo tải học và thiết bị thực tế |
| Từ vựng | 8.350 mục có nghĩa Việt; 6.506 nghĩa Anh; 298 ví dụ Nhật | Ngôn ngữ/ví dụ chưa đủ trên toàn kho |
| Ngữ pháp | 540 mục có nghĩa trên13ngôn ngữ gồm Nhật | Độ đúng/ngữ dụng và độ sâu bài học chưa được chứng nhận chỉ bằng số ô có dữ liệu |
| Từ điển | DB JMdict theo Git LFS, đã kiểm kích thước và hash trong báo cáo trước | Chưa xác nhận tổng số mục từ trong DB |

Không báo phần trăm toàn app vì các mục đang ở các giai đoạn khác nhau và mẫu số kiến thức chưa hoàn chỉnh. Công việc đã lưu là các thay đổi và bằng chứng nêu trên; những phần còn thiếu được giữ rõ để tiếp tục.
