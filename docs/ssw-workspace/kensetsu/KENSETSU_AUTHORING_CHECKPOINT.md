# 建設 — checkpoint 2026-10-11, nguồn đã nhận

Chủ dự án xác nhận bảy PDF vừa tải lên dùng làm lý thuyết chung cho cả 1号/2号 và ba mảng ライフライン・設備、建築、土木. Quyết định này thay điều kiện chờ xác nhận phạm vi trong checkpoint trước. Biên soạn một bộ dữ liệu rồi liên kết sáu lộ trình; tiến độ vẫn tách theo người học/cấp/mảng/buổi. Không tuyên bố bảy file đủ toàn bộ yêu cầu chứng chỉ hai cấp.

## Kết quả thực hiện

Kiểm kê byte/hash/số trang của cả 7 PDF: 193 trang, không trùng hash. Đây là kiểm kê tập tải lên; chưa xác nhận là toàn bộ hai thư mục gốc. Hai bìa text1l/text5l ghi Ver.20220908. Đọc văn bản toàn bộ text1l, 12 trang PDF; đã kiểm trực quan trang PDF 6 (trang in 1), bao gồm sơ đồ. Các trang khác chưa được kiểm hết hình/bảng, không báo đã đọc hoàn chỉnh bằng OCR. Nội dung nguồn chỉ dùng riêng để kiểm, không tải PDF/OCR vào GitHub/app.

Đã soạn mới shared-session-001.json: một buổi dự kiến 30 phút, 5 cụm Nhật–Việt, 7 thuật ngữ/cách đọc; mục tiêu phân biệt vai trò, phối hợp và bàn giao. Ví dụ phòng nghỉ/nhóm lắp tủ–gắn biển do dự án tạo mới. Đây là bản nháp biên tập, chưa gắn vào runtime; không phải một buổi đã hoàn tất. Các liên kết draftSessionIds không phải lessonIds phát hành.

Nguồn buổi mẫu: text1l PDF 6–7/trang in 1–2, mục 1.1–1.2. Nguồn đã đọc thêm CCUS/朝礼 nhưng chưa viết thành bài. Không dùng mốc CCUS 645 ngày hoặc khẳng định pháp lý/thao tác an toàn năm 2022 như quy tắc hiện hành chưa kiểm. Mẫu số kiến thức toàn phạm vi còn null; không báo tỷ lệ bao phủ.

## QA và phần còn thiếu

Kiểm JSON/ID/thời lượng dự kiến/bản dịch Việt theo paragraph ID bằng script: đã chạy. Chưa kiểm chuyên gia, bản ngữ, quyền, tương đồng đầy đủ, hình minh họa hoặc runtime. 11 locale khác ngoài tiếng Việt/chính Nhật chưa có bản dịch của buổi này. appIntegrationReady false. Không tạo thi/câu hỏi chấm điểm. Không sửa UI JLPT/Kaigo.

## Tiếp tục

Rà trực quan các trang còn lại text1l; đọc sáu file tiếp theo và tách từng ý, gồm nhãn/bảng/chú thích; ghi ma trận kiến thức riêng theo ý thay vì lấy số trang làm tỷ lệ. Kiểm khẳng định vai trò/thuật ngữ với nguồn chính thức và B1; đối chiếu diễn đạt buổi mẫu; hoàn thiện bản dịch theo locale phát hành, hình mới và runtime trước đánh dấu hoàn tất. Cập nhật lịch sau phân tích toàn nguồn, không áp số tuần Kaigo.

## Lưu

Nội dung lưu trong commit hẹp chỉ dưới docs/ssw-workspace/kensetsu; nguồn PDF không lưu repo. Bằng chứng remote được kiểm qua GitHub trong phiên; không tự ghi WORK PERSISTENCE PASS khi clone dùng chung vẫn có thay đổi Kaigo của phiên khác.
