# Sản xuất — cơ chế nguồn → app v2

Ngày 02/11/2026; nền `5ff65af0`. Sổ chuẩn của ngành là `manufacturing.json`. Các sổ cũ được giữ làm nguồn gốc bằng chứng, không cộng thành một mẫu số kiến thức mới.

## Cơ chế đã thay đổi

- Kiểm lại byte/hash của ba PDF đúng 169 + 198 + 207 = 574 trang.
- Trích xuất không dùng bộ lọc loại font nhỏ: giữ 121.195 span chữ, trong đó 50.056 span font dưới 10pt, 82.560 khối chữ, 871 vị trí ảnh, vector của 572 trang và ba đối tượng liên kết. Tổng 84.006 vùng. Font nhỏ có thể là ruby, nhãn, chú thích hoặc đơn vị; không coi tất cả là kiến thức bị mất và không tự loại chúng.
- Các tệp region chứa tọa độ, font metadata, số lượng và hash; không chứa văn bản nguồn, PDF, pixel hoặc ảnh trang nguồn. Gzip xác định (`mtime=0`) để giảm dung lượng; không đưa các receipt vào runtime app.
- Mọi vùng chưa phân loại được giữ trạng thái pending. Một vùng hình học, từ khóa, dòng bảng hoặc số trang không tự trở thành một ý đã dạy.
- 57 ý nhỏ đã có hồ sơ atomic47 được nối vào sổ mới. 267 hàng cũ có phạm vi lớn hơn nằm trong `legacyCandidateIndex`, ngoài số đếm ý đang nghiệm thu, tránh cộng cha/con và đếm lại cùng nội dung.
- Đã đọc lại ảnh toàn trang cơ khí89, điện165 và bề mặt103; chỉ gắn vùng chính xác cho các ý đã tự đối chiếu. Phần còn lại của cả ba trang vẫn chưa được đóng toàn trang.

## Sửa nội dung thật, không chỉ thêm sổ

Đối chiếu điện165 phát hiện bốn mặt kiến thức cần nói rõ trong bài094:

1. Mục đích phòng ngừa động cơ cháy hỏng do quá tải.
2. Tài liệu mô tả phục hồi tín hiệu bằng tay, sau khi kiểm tra an toàn.
3. Điều kiện dòng điện đạt/vượt giá trị đặt **và** thời gian kéo dài đạt/vượt khoảng thời gian nêu trong nguyên lý.
4. Cấu tạo hai tấm kim loại có độ giãn nở khác nhau được ghép dính.

Đã đưa đủ bốn mặt vào đoạn hiển thị qua `source49-thermal-clarification.json`, Nhật +12 bản dịch trực tiếp. Câu chữ mới giữ rõ phạm vi tài liệu; không chỉ dẫn đổi cài đặt hoặc thao tác trên thiết bị thật. Nội dung bổ sung có revision và fingerprint Nhật riêng; ngân hàng lõi, ID và dữ liệu tiến độ cũ được bảo toàn.

Toàn bộ đoạn Nhật hiệu dụng có 198 segment/66 segment chú âm; đường render furigana chỉ kích hoạt ở bài094/đoạn2 đúng hash và nguyên văn. Các đoạn khác giữ đường Text cũ. Không tải payload cho bài không liên quan.

## Kết quả được chấp nhận và phần còn mở

- Ba ý có đủ bằng chứng nguồn/đoạn dạy/câu kiểm đúng năng lực, được ghi `covered_ai`: vị trí tham khảo của dụng cụ bằng 想像線, vai trò中心線 và phân công chức năng ngắt/nhận biết quá tải.
- Không nâng những câu chỉ liên quan chủ đề thành bằng chứng đánh giá toàn bộ ý. Ví dụ câu hỏi phân công thiết bị không kiểm được cả hai dấu ngưỡng; câu đúng/sai về giãn nở khác nhau không tự kiểm cấu tạo hai tấm ghép dính.
- Bốn mặt kiến thức đã bổ sung có bằng chứng dạy mới; phần đánh giá riêng vẫn là chưa xác minh/một phần khi liên kết câu cũ chưa đủ. Chỉ rà các mapping source47 và ba năng lực đã đối chiếu trực tiếp; chưa tìm hết ngân hàng câu hỏi. 47 ý chưa có mapping không đồng nghĩa app thiếu câu.
- Mẫu số toàn bộ ý của574 trang vẫn mở; tỷ lệ bao phủ là null. Không có trang nào được đóng hoàn chỉnh chỉ từ census. Không suy nghiệm thu chuyên gia/bản ngữ/thiết bị/thời lượng.

## Kiểm tra

- Cổng registry v2:574 trang/census đầy đủ, liên kết hai chiều, hash và JSON pointer hiện hành; PASS cấu trúc bằng chứng, không phải PASS toàn bộ kiến thức.
- Source49:13 locale,55 ca sai hash/nguyên văn/phạm vi bị từ chối,13 đoạn Text SSR, giữ nguyên ngân hàng lõi.
- Furigana:198 segment ghép đúng nguyên văn, mọi kanji có chú âm, bảy cách đọc kỹ thuật kiểm ngữ cảnh, năm ca lệch bị loại; hai lượt component SSR ngày/đêm.
- Trình Reader thật qua harness:13 locale, chú âm và bật bản dịch; adapter native/storage/decorative/Royal khai báo rõ, không phải bố cục trình duyệt/thiết bị.
- TypeScript strict helper mới:0 diagnostic. Component TSX đã được bundle và thực thi trong kiểm tra Reader.
- Main manufacturing check PASS; số trang đọc ngữ nghĩa30 trong output của bộ kiểm cũ là phạm vi lịch sử, không phải30 trang mới của phiên này. Source47 và ba mô hình calculation48 hồi quy PASS.
- Việc thêm ruby làm strict historical reader gate từ chối đúng byte mới. Đã thêm một phép replay/inverse hẹp với hai thay đổi literal và SHA trước/sau cố định; byte không biết hoặc thêm newline bị từ chối, không ghi đè. Nối replay vào cuối assembler, giữ nguyên chuỗi snapshot lịch sử.
- Không có nguồn PDF, trang chụp, câu hỏi nguồn hay ảnh nguồn được đưa vào Git.

## Tiếp tục

Phân loại mọi vùng còn pending theo tài liệu gốc; tách đủ ý, điều kiện, ngoại lệ và quan hệ bảng/hình; kiểm từng ý với đoạn dạy và năng lực đánh giá. Chỉ nhập một hàng legacy vào mẫu số sau khi xác định phạm vi và xử lý trùng. Tiếp tục hình nhận diện, thuật ngữ, ngữ nghĩa12 ngôn ngữ, âm thanh, thiết bị và thời lượng theo hợp đồng ngành.
