# Khối lượng ngày học và ảnh minh họa bắt buộc

Chỉ thị người dùng ngày2026-10-31, Asia/Tokyo. Áp dụng Nông nghiệp, Sản xuất, Thực phẩm, Nhà hàng, Xây dựng và Kaigo, cả nhánh tích hợp và nhánh ngành. Chính sách máy: `daily-learning-policy.json`. Báo cáo hiện trạng: `daily-learning-audit-20261031/REPORT_VI.md`.

## 1. Kiểm tra đúng đơn vị ngày học

- Theo lịch và bộ đọc thực tế: một ngày có thể gồm nhiều bài/đoạn liên quan. Chỉ đếm nội dung người học thật sự mở được trong ngày đó, gồm phần bổ sung nếu đã liên kết vào luồng ngày.
- Tách cấp1号/2号, chuyên ngành và loại ngày. Ngày thi/ôn có hoạt động riêng phải được đánh giá theo hoạt động đó; không lấy lời giới thiệu ngắn của ngày thi để kết luận thiếu bài học.
- Thống kê riêng thân bài Nhật, số mục tiêu, đoạn giải thích, ví dụ, hoạt động áp dụng, thuật ngữ, hình và thời lượng có bằng chứng. Không cộng bản dịch, furigana, tiêu đề, chú thích hành chính hoặc văn bản lặp để nâng khối lượng.
- So sánh trong cùng lộ trình/loại ngày và giữa các ngành. Cờ thân bài dưới nửa trung vị là tín hiệu cần xem xét, không phải thước đo đủ kiến thức. Cũng rà ngày quá dài; không ép tất cả ngày bằng số chữ.
- Mục tiêu thời gian theo hợp đồng ngành hiện hành; nơi đã quy định khoảng30phút vẫn giữ mục tiêu này. Nhãn `estimatedMinutes:30` không chứng minh người học thực tế cần30phút. Không suy phút học từ số chữ rồi ghi là đã đo.

## 2. Tiêu chuẩn cân đối nội dung

Một ngày học hoàn chỉnh phải có mục tiêu rõ, kiến thức đủ giải thích nguyên nhân/điều kiện phù hợp, ví dụ nghề nghiệp hoặc thao tác quan sát và hoạt động áp dụng/tự kiểm tra. Có thể dùng so sánh, tình huống, đọc hình, tính toán đủ dữ kiện hoặc phân tích sai sót; không bắt mọi chủ đề cùng một mẫu.

Bài đính chính nguồn, lưu ý phạm vi hoặc bổ sung chỉ một đoạn cần được gắn với ngày nền cùng chủ đề, hoặc mở rộng bằng kiến thức/ví dụ có căn cứ. Không tự bịa điều kiện kỹ thuật, lặp cảnh báo chung hay đổi cách diễn đạt cùng ý để đủ độ dài. Không nhồi ngày dài để giữ một số tuần cố định.

Khi cân đối lịch: giữ ID bài, câu hỏi, bản dịch, phiên bản và dữ liệu người học; lập ánh xạ ngày cũ→ngày mới, giải thích cách giữ hoàn thành và kiểm tra khôi phục. Báo cáo rà soát này không tự cấp quyền xóa hoặc đặt lại tiến độ. Cập nhật nguồn Nhật phải kéo theo hash, bản dịch, liên kết hình và câu hỏi chịu ảnh hưởng.

## 3. Ít nhất một ảnh minh họa trọng tâm mỗi ngày học

Mỗi ngày học phải có **ít nhất1 ảnh/sơ đồ minh họa trực tiếp một kiến thức quan trọng của ngày đó**, hiển thị được trong trang học của chính ngày. Khung nền, NPC, ảnh bìa ngành, icon, khối chữ có mũi tên hoặc ảnh ở thư viện khác không tự đáp ứng yêu cầu này.

- Chọn mục tiêu quan trọng nhất trước khi tạo ảnh: bộ phận/thiết bị cần nhận diện, đặc điểm phân biệt, thao tác, quy trình hoặc mối quan hệ cần hiểu. Lưu `keyObjectiveId` và giải thích ảnh giúp học điều gì.
- Kiểm kê ảnh phù hợp hiện có. Nếu thiếu, tạo ảnh mới; nếu đã có ảnh đúng nội dung, gắn đúng ngày và kiểm tra thực tế. Có thể dùng chung ảnh cho kiến thức thực sự dùng chung, nhưng không rải một ảnh chung cho mọi ngày chỉ để đủ chỉ tiêu. Ghi lý do tái sử dụng và rà độ lặp.
- Ảnh bối cảnh chỉ đạt khi bối cảnh minh họa trực tiếp mục tiêu học; cuộc trò chuyện chung không thay thế hình giải phẫu, chi tiết máy, nhận dạng cây hoặc lỗi kỹ thuật.
- Dùng image generation cho ảnh/illustration phù hợp; số liệu, thước đo, sơ đồ điện, công thức và hình cần vị trí/chữ chính xác phải dựng bằng công cụ kiểm soát được. Không lấy số hoặc nhãn AI sinh ra làm căn cứ kỹ thuật.
- Hình độc lập về biểu đạt, có quyền sử dụng; không chép ảnh PDF chưa được phép. Nhãn chính bằng Nhật, có chú thích và văn bản thay thế; bản dịch tương ứng theo chính sách ngôn ngữ ngành. Không nhúng đáp án bài thi vào ảnh trước khi nộp.
- Liên kết ID ngày/bài, cấp/chuyên ngành, mục tiêu/knowledge ID, asset ID/path/hash, phiên bản nguồn, chú thích, alt, nguồn/quyền, mục đích và kết quả kiểm tra. Phải xác nhận đường dẫn được đăng ký, tệp có byte thực và đủ điều kiện hiển thị; không tính bản ghi metadata hoặc Git LFS pointer là ảnh đã có.
- Kiểm tra trên trang học với điện thoại dọc/ngang, tablet và desktop; cho phóng to khi cần, không cắt mất chi tiết/nhãn. Tải theo nhu cầu và tối ưu dung lượng để không kéo toàn bộ ảnh/ngành vào lúc mở app.

Yêu cầu mới này thay thế các quy định cũ cho phép ảnh là tùy chọn hoặc cấm tạo thêm ảnh bối cảnh trong phạm vi phục vụ minh họa ngày học. Các giới hạn về chính xác chuyên môn, quyền và giao diện đã duyệt vẫn giữ nguyên. Ngày thi thuần túy được theo dõi riêng; nếu có bài học kiến thức đi kèm thì phần bài học đó vẫn phải có ảnh.

## 4. Hồ sơ nghiệm thu theo ngày

Mỗi ngày ghi: ngành/nhánh/commit, cấp/chuyên ngành, tuần/ngày, ID bài, mục tiêu chính, phần nội dung thật sự hiển thị, các chỉ số khối lượng, hoạt động áp dụng, ảnh được chọn và lý do phù hợp, nguồn/phiên bản, tình trạng dịch, kết quả kiểm tra hiển thị và thời lượng dự kiến/đã đo.

Tách các trạng thái: thiếu liên kết ảnh; có liên kết nhưng chưa rà độ phù hợp; đã rà nội dung ảnh; đã kiểm tra hiển thị; đã đo thời lượng. Không coi kiểm tra tệp tồn tại là duyệt chuyên môn hoặc thiết bị thật. Không đánh dấu toàn ngành đạt chỉ vì tổng ảnh lớn hơn tổng ngày.

Rà soát2026-10-31 mới hoàn thành kiểm kê và cập nhật yêu cầu; chưa tạo toàn bộ ảnh thiếu, chưa phân phối lại lịch và chưa đo thời gian học. Các ngành/nhánh không có trong bản đang kiểm tra phải ghi rõ phạm vi, không cộng vào lượng đã tích hợp.
