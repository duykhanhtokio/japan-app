# Yêu cầu biên soạn AI — kiểm tra 建設, 10 đề × 40 câu

Chỉ thị chủ dự án ngày 2026-10-15: lưu bền vững và tích hợp giáo trình, sau đó dùng phần tiếng Nhật để tạo 10 bài kiểm tra, mỗi bài 40 câu trắc nghiệm, bao phủ nội dung đã tạo và không trùng câu. Chỉ thị này thay quy mô nháp 10×20; không thay đổi hoặc xóa bản nháp lịch sử.

## Nguồn và phạm vi

- Nguồn biên soạn duy nhất là tiếng Nhật của 385 bài hiện có, 55 tuần; dùng đúng ID cụm/đoạn, revision và SHA-256.
- Không dịch ngược từ các bản dịch; không đọc, chép, diễn đạt lại câu hỏi chính thức hoặc ngân hàng nháp cũ làm đầu vào sáng tác.
- Đọc toàn bộ các đoạn Nhật của từng bài được giao. Chọn mục tiêu kiến thức cụ thể, không suy diễn kiến thức mới, thông số, quy trình nguy hiểm hoặc quy định hiện hành ngoài giáo trình.
- Kiểm tra cả 385 bài có câu hỏi, phân bố 10 đề. 385 câu gắn bài chính; 15 câu vận dụng bổ sung có mục tiêu khác biệt.
- Liên kết chỉ những đoạn thực sự được đánh giá bởi câu hỏi/đáp án/phương án nhiễu. Không đánh dấu tất cả đoạn là đã kiểm tra chỉ vì chúng cùng bài.
- Lập bảng riêng toàn bộ đoạn và cụm: được đánh giá trực tiếp hay chưa. Độ phủ 385 bài không tự chứng minh bao trọn mọi ý kiến thức hoặc toàn bộ tài liệu tham khảo.
- Giữ phạm vi kiến thức chung đang có trong sáu lộ trình. Không tự công nhận đánh giá đủ năng lực nâng cao 2号 hoặc đủ mọi chuyên ngành.

## Nội dung mỗi câu

Bằng tiếng Nhật: câu hỏi, bốn phương án, một đáp án đúng duy nhất, lời giải, mục tiêu đánh giá, khẳng định kiến thức được kiểm tra và lý do từng phương án sai. Câu hỏi có dữ kiện đủ để trả lời, các phương án cùng miền kiến thức và không chồng lấn điều kiện.

Ưu tiên hiểu, phân biệt khái niệm, đọc tình huống và vận dụng. Có thể kết hợp các cụm trong một bài khi phù hợp. Không chỉ lặp “kiểm tra thông số/xác nhận thêm” với tên vật khác. Không dùng phương án vô lý, đáp án lộ do dài hơn rõ rệt, phủ định kép, hoặc tuyệt đối hóa điều kiện vốn có ngoại lệ.

Không trùng nguyên văn, câu chuẩn hóa, hoặc mục tiêu hỏi cùng một khẳng định chỉ thay danh từ/bối cảnh. Câu bổ sung trong cùng bài phải kiểm tra ý khác. Tác giả tự đối chiếu từng câu và cả ba phương án nhiễu với nguồn Nhật, ghi điều chỉnh cụ thể. Kiểm trùng toàn bộ 400 câu sau ghép; công cụ tương đồng chỉ tạo ứng viên để đọc, không được tự chứng nhận khác ý.

Mỗi đề có đúng 40 câu, 1 điểm/câu; vị trí đúng 1–4 mỗi vị trí 10 lần, không có ba đáp án liên tiếp giống nhau kể cả ranh giới đề. Hoán vị phương án phải giữ đúng đáp án và lý do tương ứng.

## Tích hợp và kiểm tra

- Ngân hàng mới có ID/revision riêng, giữ bản nháp cũ để tham chiếu lịch sử.
- Dùng màn kiểm tra riêng trong phần 建設 hiện có, không sửa giao diện thi JLPT đã khóa.
- Danh sách 10 đề; chọn đáp án, trước/sau và chọn số câu; lưu và tiếp tục đúng vị trí.
- Khóa đáp án/lời giải trước nộp. Xác nhận khi còn câu trống; kết quả phân biệt đúng/sai/chưa trả lời. Chỉ sau nộp mới xem đáp án, lời giải và bài nguồn.
- Tiến độ độc lập theo người học/cấp/mảng/đề, tách khỏi đánh dấu hoàn thành học. Làm lại cần xác nhận; lỗi đọc/lưu phải hiển thị và không ghi đè im lặng.
- Không tự đặt thời gian, điểm đỗ, thưởng/phạt EXP/credit hoặc chứng nhận thi chính thức.
- Kiểm dữ liệu/nguồn/độ phủ/chấm điểm/lưu trạng thái, TypeScript phạm vi thay đổi; kiểm reader học không hồi quy và ảnh kiểm tra ở điện thoại/máy tính bảng/ngang.
- Giữ cờ AI biên soạn, chưa duyệt chuyên môn/bản ngữ/quyền/phát hành. Tích hợp bản phát triển không đồng nghĩa cấp phép phát hành.
- Commit phạm vi hẹp, lưu lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1, fetch và yêu cầu WORK PERSISTENCE PASS.

## Hồ sơ bắt buộc

Blueprint 400 vị trí; bản tác giả; tự rà; dữ liệu runtime; ma trận câu–bài–cụm–đoạn và danh sách chưa đánh giá; kiểm trùng/các trường hợp đã xem; kết quả kiểm dữ liệu; kiểm hành vi giao diện; checkpoint cuối và giới hạn còn lại.
