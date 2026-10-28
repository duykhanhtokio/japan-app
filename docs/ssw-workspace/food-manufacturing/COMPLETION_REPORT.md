# Tổng kết ngành chế biến thực phẩm — 28/10/2026

Phạm vi: **飲食料品製造業**, gồm 特定技能1号 và2号. Trạng thái: bản xem trước nội bộ; **chưa nghiệm thu toàn bộ và chưa phát hành production**. Không gán tỷ lệ hoàn thành chung vì độ sâu kiến thức và thử nghiệm thiết bị chưa được xác nhận.

## Nội dung và ngôn ngữ

| Hạng mục | Kết quả kiểm kê |
|---|---|
| Bài học Nhật |78: cấp1 có42 bài/7 tuần; cấp2 có36 bài/6 tuần|
| Bản dịch bài học |936/936 lượt bài–ngôn ngữ, đủ12 ngôn ngữ|
| Thi thử |20 đề ×40 câu =800 câu; mỗi cấp10 đề|
| Kiểm tra tuần |13 bài ×3 câu =39 câu|
| Tổng câu hỏi |839 câu, có4 lựa chọn, đáp án và giải thích|
| Bản dịch câu hỏi |10068/10068 lượt câu–ngôn ngữ;396/396 tiêu đề|
| Chuẩn thuật ngữ cung cấp |VI, EN, ID, zh-CN, KM, MY;1338 vị trí sửa ở mốc trước, có kiểm tra chéo AI và16 đề xuất bị loại vì đổi/hẹp nghĩa|

12 ngôn ngữ: Việt, Anh, Indonesia, Tagalog, Bengali, Thái, Hindi, Nepal, Myanmar, Khmer, Trung giản thể và phồn thể. Đủ bản dịch không đồng nghĩa mọi câu đã được người bản ngữ/chuyên gia duyệt.

## Phần hoàn thiện trong lượt này

- **Sửa câu Nhật food-1-q204**: bổ sung đối tượng bị lược bỏ bằng “衛生上の対応が必要なのはなぜですか”. Giữ đáp án, lựa chọn, giải thích, kiến thức và toàn bộ chữ của12 bản dịch. Cập nhật liên kết sourceHash. Bản lịch sử nằm trong `exams.1.03-06.ja.json`, có thứ tự đáp án khác bản chính; đã giữ nguyên từng thứ tự.
- **Sửa2 cách ghi cách đọc**: 健康チェック→けんこうちぇっく; 食品ロス→しょくひんろす. Hai cách đọc cũ chứa katakana nên bộ hiển thị ruby từ chối. Nay238/238 mục từ qua được điều kiện cấu trúc của bộ hiển thị; không coi đây là xác minh phát âm hoặc hình ảnh trên thiết bị thật. Cập nhật hash2 bài Nhật và24 bản dịch tương ứng, không sửa chữ bản dịch.
- **Đồng bộ chuẩn vào sơ đồ đang hiển thị**: màn hình dùng bản nhúng trong `diagrams.json`, không tự đọc tệp chú thích riêng. Đồng bộ13 vị trí đã được duyệt ở tệp riêng và10 vị trí bổ sung có nguồn/kiểm tra chéo (gồm3 bản riêng tương ứng); tổng23 vị trí. Không thay layout hoặc nguồn kiến thức.
- **Làm rõ báo cáo kiểm thử**: tách bằng chứng trình duyệt lịch sử khỏi kiểm tra hiện tại. Không kế thừa nhãn PASS cũ thành chứng nhận cho chữ đã sửa.

## Bao phủ kiến thức và bằng chứng nguồn

Nội dung có vệ sinh thực phẩm; mối nguy vật lý/hóa học/sinh học; dị ứng, vi sinh, ngộ độc; vệ sinh cá nhân, cơ sở/thiết bị; quản lý nguyên liệu, bảo quản, xử lý; HACCP; an toàn lao động. Cấp2 bổ sung vai trò tổ trưởng, chỉ đạo/đào tạo, giao tiếp, quản lý chất lượng, dữ liệu/QC, sản xuất, chi phí, năng suất, rủi ro và phương hướng doanh nghiệp.

- Hai PDF Nhật có86+165=251 trang. Mục lục có158 mục (54 cấp1,104 cấp2).
-153 mục có tham chiếu bài học dự kiến;95 mục có tham chiếu câu hỏi dự kiến. Cả839 câu đều có mã kiến thức hợp lệ và đúng tham chiếu dự kiến: thiếu/lỗi thời/trùng/mồ côi đều0.
-5 mục không có cả hai loại tham chiếu là chỉ mục/thông báo/tài liệu tham khảo.63 mục không có câu hỏi gắn trực tiếp; nhiều mục là mục cha/chương, nên không tự suy ra63 lỗ hổng kiến thức độc lập.
-**0/158 mục được xác nhận chính thức là bao phủ trọn năng lực**. Đây là trạng thái chưa kiểm chứng, không phải kết luận các bài không có kiến thức. Tham chiếu trang hoặc mã kiến thức chưa chứng minh mọi ý nhỏ đã được dạy/kiểm tra đủ.
- Bằng chứng lịch sử ghi nhận đọc phần nội dung dạng chữ và kiểm tra trực quan30 trang ưu tiên (10 cấp1,20 cấp2). Chưa kiểm tra hình/bảng/chú thích toàn bộ251 trang.96 ứng viên lệch khoảng trang mục lục còn cần ánh xạ chi tiết;4 đã có hỗ trợ dạng chữ theo phạm vi hẹp,92 còn mở. Không tự coi lệch khoảng là sai kiến thức.

## Kiểm tra hiện tại

Xem `completion-editorial-qa.json` và `completion-summary.json` cho kết quả máy đọc được. Kiểm tra cấu trúc/bộ nạp bản dịch và khóa UI được chạy sau thay đổi. Kiểm tra thực tế bộ nạp và lưu bài làm xác nhận hash cũ bị từ chối, hash mới dùng được, bài làm cũ của đề sửa bị vô hiệu hóa đúng, bài làm mới khôi phục/chấm40/40 được và32 phiên bản đề khác giữ nguyên.

Không chạy mới trình duyệt, fullExpo hoặc thiết bị native. Bằng chứng trình duyệt lịch sử không được gắn lại với toàn bộ bản hiện tại.

## Phần còn thiếu trước nghiệm thu

| Ưu tiên | Công việc | Điều kiện hoàn thành |
|---|---|---|
|1|Đối chiếu chi tiết năng lực và toàn bộ hình/bảng nguồn|Từng ý nhỏ có bài/câu/hình phù hợp, giải quyết92 ứng viên phạm vi còn mở, có bằng chứng nguồn cụ thể|
|2|Furigana toàn bài và bài test|Hiện788 trường chữ chính trong bài học chưa có ruby; bổ sung cách đọc theo ngữ cảnh và kiểm tra trên màn hình thật|
|3|Minh họa và thông tin đa phương tiện|Hiện4 sơ đồ khái niệm gắn10/78 bài; chưa đủ bộ minh họa2Dmàu theo nội dung. Không có âm thanh học tích hợp; âm thanh thu sẵn tùy chọn tách riêng|
|4|Thuật ngữ và ngôn ngữ|Rà6 ngôn ngữ chưa có nguồn chuẩn và thuật ngữ riêng cấp2 không nằm trong tài liệu1号đã cung cấp; chuyên gia/người bản ngữ kiểm tra|
|5|Khôi phục môi trường, build và thử thực tế|Thiếuexpo/react/react-native/esbuild và thư viện liên quan;5545 tài nguyên Git đang bị bỏ qua bởi sparse checkout, không bị xóa khỏi Git. Đĩa chỉ còn khoảng170–192 MiB tại kiểm tra; cần đủ dung lượng trước khôi phục/cài đặt|
|6|Nghiệm thu chất lượng|Kiểm tra điện thoại/tablet/desktop, dọc/ngang, font, furigana, cuộn/nút, lưu tiến trình và chấm điểm; xác nhận chuyên môn và ngôn ngữ|

Mốc này hoàn tất phần sửa lỗi cụ thể và kiểm kê tổng kết nêu trên. **Toàn dự án thực phẩm vẫn `scopeComplete=false`, `productionRelease=false`.** Không có tác vụ chạy nền được hứa sau báo cáo.
