# Kaigo: phần chỉnh trang và 12 đề luyện thi — 2026-10-10

Đã thực hiện yêu cầu tiếp tục nội dung kế tiếp và tăng số đề. Bộ hiện hành có **12 đề, 360 câu**: 6 đề kỹ năng × 45 câu/60 phút và 6 đề tiếng Nhật × 15 câu/30 phút. Sáu đề mới thêm 180 câu tự biên soạn, 720 giải thích phương án và 15 hình sơ đồ độc lập. Đây là lựa chọn biên tập để tăng cơ hội luyện và chữa lỗi; chưa có thử nghiệm chứng minh số lượng này bảo đảm hiệu quả học hay đỗ thi.

## Phần nội dung kế tiếp

Đã đọc và xem hình từng trang in 170–184 (trang PDF 172–186) của tài liệu chuẩn 276 trang, SHA-256 `997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54`. Bảng đối chiếu mới có 195 bản ghi, nối tới nội dung app. Tám ý mới nâng tổng từ 497 lên **505 ý**, giữ 87 mục, 87 ca tự giải thích và lịch 144 ngày × 30 phút.

Nội dung thêm gồm ý nghĩa chỉnh trang đối với sinh hoạt, giới hạn khi diễn giải lợi ích; lựa chọn dụng cụ cạo râu; quan sát và báo bất thường móng; phân biệt phía đứng của người hỗ trợ với trình tự thay đồ; hỗ trợ rửa mặt; vệ sinh toàn khoang miệng khi có răng giả; tư thế và giới hạn dùng dụng cụ vệ sinh miệng.

Có **một sửa chữa trong ý cũ**, `kaigo-atomic-oral-details-6`: điều kiện bảo quản răng giả cần theo vật liệu, sản phẩm và hướng dẫn nha khoa, thay cho khẳng định tuyệt đối không để khô. Các ID cũ, ca tự giải thích, nội dung mục ngoài phần bổ sung/revision, và phân bố ngày giữ nguyên. Bằng chứng ở `grooming-append-audit.json`. Các khẳng định tư thế hoặc lợi ích trong nguồn được giới hạn theo tình trạng và chỉ định, không biến thành hướng dẫn thao tác áp dụng cho mọi người.

## Chất lượng đề mới

Đề kỹ năng giữ cơ cấu 10 cơ bản + 6 tâm thể + 4 giao tiếp + 20 hỗ trợ sinh hoạt + 5 tình huống có hình. Mỗi đề tiếng Nhật có 5 từ + 5 hội thoại + 5 văn bản mới. Cơ cấu tham chiếu: [MHLW](https://www.mhlw.go.jp/stf/newpage_000117702.html), [Prometric](https://www.prometric-jp.com/ssw/test_list/archives/2).

Câu hỏi và phương án được viết riêng trong sáu file `drafts/mock-expansion-12/*.authored.txt`; script chỉ phân tích, sắp vị trí đáp án và thêm furigana. Không lấy câu hỏi thi nguồn hoặc dùng mẫu đổi danh từ. Đã sửa 54 phương án riêng để giảm dấu hiệu chọn đáp án dài nhất và tăng độ hợp lý của phương án sai. Sau sửa, đáp án đúng dài nhất riêng biệt là 15/45, 14/45, 14/45 ở ba đề kỹ năng mới và 5/15, 5/15, 4/15 ở ba đề Nhật mới. Các con số này không thay cho thẩm định tâm trắc hoặc chuyên môn.

Có furigana ở câu, phương án, hội thoại/văn bản và mô tả hình. Đã lưu bảng 1.099 bề mặt từ để tiếp tục rà bản ngữ. Tiếng Việt và lý giải chỉ xuất hiện sau nộp. Vị trí đúng tổng bộ cân bằng 90/90/90/90; từng đề lệch tối đa một; không có ba đáp án cùng vị trí liên tiếp. Mỗi lượt dùng khóa lưu riêng.

15 sơ đồ mới được vẽ bằng SVG và xuất PNG bằng Chromium, đã xem trực quan. Chúng minh họa dữ kiện so sánh, nhận diện và điều kiện của câu hỏi; không phải minh họa quy trình thao tác lâm sàng. Nhãn ngắn A/B/C và một số nhãn tiếng Anh có dữ kiện tương ứng trong đề/mô tả tiếng Nhật và phần chữa tiếng Việt. Không sao chép ảnh sách.

Sáu đề cũ và toàn bộ trường ngoài mock trong `content.json` khớp baseline; ID và revision của đề cũ không đổi, tránh làm mất lượt học. Dòng giới thiệu đề trong app lấy số lượng từ dữ liệu. Generator sáu đề lịch sử được chặn để không ghi đè bộ 12 đề.

## Kiểm tra đã thực hiện

- Validator 12 đề: 360 câu, 1.440 lý giải, 30 hình, 12 khóa lưu riêng; 8 đối chứng lỗi bị từ chối; toàn bộ 360 câu draft/runtime khớp; sáu đề cũ và dữ liệu ngoài mock giữ nguyên.
- Validator phần chỉnh trang: 195 bản ghi/15 trang/505 ý; 4 đối chứng lỗi bị từ chối. Lịch 144 ngày/30 phút và khóa giao diện JLPT 10/10 đạt.
- Kiểm tra React Native Web dùng KaigoCourse và các thành phần Royal thật: làm cả sáu đề mới, 180 câu; khôi phục đáp án và thời gian; hủy nộp sớm; nộp/chấm; kiểm 720 giải thích và tải 15 hình; kiểm tám ý mới và một ý sửa. Danh mục 12 đề hiển thị ở ba kích thước, không tràn ngang hoặc lỗi trang. Bằng chứng: `runtime-tests/2026-10-10-twelve-mocks-grooming/browser-evidence.json`.
- Sàng đối chiếu chuỗi 60 ký tự chuẩn hóa với bản trích nguồn riêng: 2.580 trường đề mới, không có chuỗi khớp; phần atomic 766 trường không có chuỗi khớp. Đây chỉ là sàng chữ, không chứng nhận nguyên tác ngữ nghĩa/quyền sử dụng.

Bản kiểm tra web có shim expo-image. Chưa kiểm toàn bộ Expo Router hoặc binary Android/iOS; không đánh dấu đã thử thiết bị thật. Chưa được người học thử, chuyên gia Kaigo/bản ngữ duyệt hoặc chứng nhận quyền. `releaseReady`, `humanReviewed`, `nativeDeviceTested` vẫn false. Không công bố tỷ lệ bao phủ toàn sách; các khoảng đối chiếu chưa xong vẫn giữ trong ledger.

## Cách dùng để ôn

Mỗi cặp đề kỹ năng + Nhật có thể dùng khoảng năm buổi 30 phút: hai buổi làm kỹ năng có lưu tiếp; một buổi chữa câu sai/chưa chắc; một buổi làm Nhật; một buổi chữa Nhật và tự nói lại lý do. Nếu chưa chữa xong, tiếp tục buổi sau. Sau vài ngày, làm lại câu sai và giải thích vì sao loại từng phương án trước khi xem đáp án. Chia đề kỹ năng là chế độ luyện, không mô phỏng thi liên tục 60 phút. Lịch luyện đề này là tùy chọn và không tự tăng nhiệm vụ của 144 ngày hiện hành.

Bước nội dung tiếp theo: trang in 186–197. Tiếp tục đối chiếu chi tiết; chưa gọi toàn bộ tài liệu hoàn tất.

Patch được ghép trên cây remote mới nhất có công việc JLPT đồng thời, với lease đầu nhánh và đối chiếu từng blob, giữ nguyên các thay đổi ngoài phạm vi Kaigo. Không đưa PDF chuẩn, bản trích chữ hoặc ảnh nguồn riêng vào repository.
