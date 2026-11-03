# Nông nghiệp — đối chiếu và bổ sung nursery v9

Mốc kiểm tra: `f72e3e6cc36c1b407aace4b0e47a23a63ca7cdaa`. Sổ chuẩn vẫn là `agriculture.json`; các tệp v9 chỉ là bằng chứng và báo cáo dẫn xuất.

## Nội dung thực sự đã bổ sung

- Ba hoạt động tự kiểm: tình trạng cây khi tỉa và bốn dấu hiệu trong hình; năm nhóm cây được nêu làm ví dụ ươm giống; tên gọi 定植/移植栽培, khác biệt với gieo trực tiếp và phạm vi cây giống/khoảng cách. Có 36 câu dẫn dịch, đáp án đúng revision ở 12 ngôn ngữ và ruby theo ngữ cảnh. Đây là ôn tập không chấm điểm, không chứng nhận kỹ năng ngoài hiện trường.
- Một phần giải thích Nhật mới luôn hiển thị về đọc hình tỉa cây, kèm 12 bản dịch. Các câu dẫn mới được giới hạn đúng điều nguồn cho biết; bỏ yêu cầu giải thích nguyên nhân mà nguồn không nêu và bỏ từ chỉ tuổi cây bổ sung ngoài phạm vi.
- Sửa ảnh sai mục tiêu của ngày `agr-f40-general-nursery-examples`: ảnh cũ nói về luống/khay/chậu, không thể hiện năm nhóm cây. Ảnh mới là sơ đồ độc lập có hình cây và nhóm tương ứng, nguồn vẽ bằng công cụ kiểm soát, không dùng ảnh PDF. Đăng ký vào bộ đọc hiện tại, nối đúng hash/bài/cấp/mục tiêu; bỏ liên kết dự phòng cũ để ảnh không hiện hai lần.
- Bản nháp v8 cũ được giữ nguyên và đối chiếu lại thành v9 riêng. Hai nhãn lịch sử trùng nội dung đã có trong v8 được ghi rõ là duplicate, không tăng số nghiệm thu lần thứ hai.

## Mức kiểm tra đạt

Kiểm kê cơ học hai chiều: 237 trang nguồn; 241 bài/1.363 đoạn hiện tại; 2.892 cặp bài–ngôn ngữ đúng revision; 1.227 liên kết câu hỏi (12 hash cũ có chính sách tương thích rõ); 23 hoạt động đọc/tự kiểm; tái dựng 1.820 token ruby. 187 bản ghi ảnh và 43 bản ghi sơ đồ đã được đối chiếu byte/hash/kích thước và giải mã 211 tệp ảnh duy nhất.

Rà ngữ nghĩa trong đợt này chỉ bao gồm năm trang nguồn đã đọc trực quan (1号:12–13;2号:14–16), 12 đoạn Nhật, 11 câu cũ với mọi lựa chọn/giải thích, ba hoạt động mới và 36 cặp ngôn ngữ của chúng. Không suy rằng toàn bộ 1.363 đoạn hoặc toàn bộ bản dịch đã được nghiệm thu ngữ nghĩa từ kiểm tra hash.

Bộ đọc/Course/tiến độ thực sự được chạy với bộ thích nghi host: 240 trường hợp tự kiểm và 96 trường hợp ngày có ảnh mới, gồm 12 ngôn ngữ, các cấp phù hợp và bốn kích thước điện thoại dọc/ngang, tablet, desktop. Ảnh mới hiển thị một lần, mở/thu phóng; đáp án đóng trước khi mở; mở đáp án không ghi điểm/tiến độ; hoàn thành bài giữ và khôi phục dữ liệu trước đó. Host không phải ảnh chụp native hay nghiệm thu thiết bị thật. Năm trường hợp dữ liệu sai được bộ kiểm chuẩn từ chối.

369 ngày trong lịch (141 ngày 1号,228 ngày 2号) có liên kết ảnh hiện hành. Thân bài/đoạn bổ sung thật sự hiển thị được kiểm riêng; không cộng đáp án đang ẩn để tăng độ dài. Không có ngày dưới nửa trung vị cùng cấp. Đây là tín hiệu sàng lọc, không phải bằng chứng đủ kiến thức hoặc thời lượng.

## Phần vẫn mở

Sổ hiện có 112 ý `covered_ai`,2 duplicate và1.329 ý còn mở. Mẫu số nguồn chưa chốt, tỷ lệ bao phủ vẫn null; không đóng trang hoặc toàn ngành từ kết quả này. Còn phải đối chiếu từng vùng/ý nguồn ngoài nhóm vừa rà, kể cả bảng/hình/chú thích.

Ngữ nghĩa các bản dịch và ảnh ngoài phạm vi v9, chuyên môn/bản ngữ, hiển thị pixel/native và thời lượng người học thật vẫn chưa được xác nhận. Caption/alt trong hệ thống ảnh hiện tại vẫn là tiếng Nhật; bản dịch bài học giải thích ý nghĩa tương ứng, không thay cho metadata ảnh được dịch riêng.

Bộ đọc Nông nghiệp hiện chưa có âm thanh đọc bài hay bộ điều khiển audio; không có tài sản thu âm bị sửa bởi v9. Không được diễn giải việc không tìm thấy audio là đã kiểm giọng/phát âm. Thân bài chính vẫn dùng Text Nhật thường cộng phần đọc thuật ngữ; ruby của các hoạt động mới đầy đủ, nhưng furigana toàn thân bài chưa được triển khai trong đường đọc này.

Giữ nguyên toàn bộ bài Nhật/hash,12 tệp bản dịch bài,1.227 câu ngân hàng,20 hoạt động cũ, lịch học và khóa tiến độ. Không tuyên bố đã lưu từ xa trước khi điều phối đẩy và xác minh persistence.
