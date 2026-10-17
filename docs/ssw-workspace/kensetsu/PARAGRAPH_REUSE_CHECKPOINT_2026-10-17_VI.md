# Đối chiếu và dùng lại kiến thức theo đoạn — 2026-10-17

Yêu cầu chủ dự án: đối chiếu từng ý của toàn bộ224bài 実技 gốc với nguồn 建築・土木, gồm bảng/hình/chú thích/điều kiện; dùng lại toàn phần hoặc theo cụm/đoạn, chỉ soạn phần riêng, không làm đều số bài. Sau khi sửa xong mới bàn giao bước kiểm thực tế trên app.

## Nguyên nhân chưa liên kết

Cấu hình cũ chỉ có danh sách108/104bài dùng chung nguyên bài. Phần cắt đoạn `deltaViews` chỉ áp dụng cho bài bổ sung của từng nhánh; chưa có cơ chế lấy một số đoạn của bài gốc utilities gắn vào bài hiện có của nhánh khác. Vì vậy, các bài trộn nhiều nhóm kiến thức như348/369 bị để ngoài cả bài, dù một phần có căn cứ trong nguồn của hai nhánh. Đây là thiếu sót thực tế của lượt lọc trước, không phải kết luận mọi bài chưa gắn đều riêng ngành.

Riêng bài bổ sung 建築:32mục đã dùng chung với土木; không chuyển hàng loạt phần còn lại, vì nhiều mục thuộc hoàn thiện như mộc, mái, tường, gạch, chống thấm. Mỗi quyết định vẫn phải có căn cứ nguồn, không dùng tên nghề làm chứng nhận đã kiểm đủ.

## Các đoạn đã sửa trong đợt đầu

| Bài gốc | Đoạn được dùng lại | Bài nhận | Nhánh | Nguồn đã đọc/kiểm hình |
|---|---|---|---|---|
|348|cluster2p1;cluster3p1–p2: phạm vi chuyển động của cần; tiếp xúc/phóng điện; ảnh không thay đo khoảng cách|building011: bộ phận bơm bê tông|建築・土木|6kPDF16/in160;6dPDF28/in170|
|369|cluster1p1–p2: tải treo và không đi dưới tải|common366: ngã/vật rơi|建築・土木|7kPDF5/in183;7dPDF5/in179|
|332|cluster1p1: nhận diện hạ tầng ngầm hiện hữu|civil009: đào đất|土木|6dPDF16/in158|

Sáu đoạn nguồn được dùng ở11vị trí theo nhánh. Giữ cùng đối tượng đoạn Nhật và bản dịch12ngôn ngữ; không viết lại hoặc sao chép thành bài mới. Nội dung liên quan dây điện/kiểm điện riêng ngành trong phần khác của348/369 và các ví dụ chỉ thay hệ thống viễn thông của332 không được kéo theo. Ví dụ về khí độc trong hầm không tự cho phép chuyển toàn bộ bài vềH2S/manhole sang: đối tượng khí và điều kiện khác nhau, cần xác minh riêng.

Không tăng số bài:224utilities,163building,152civil. Số đoạn hiển thị tăng từ1.016lên1.021ởbuilding và972lên978ởcivil. Hai cấp1号/2号nhận cùng phần sửa theo nhánh. Utilities giữ nguyên toàn văn.

Có cơ chế `scopeRevision` cho bài được bổ sung. Hoàn thành cũ vẫn giữ nhưng không tự hoàn thành phần mở rộng. Khi đổi tập đoạn sau này, phải nâng scopeRevision và đưa mã hoàn thành cũ vào danh sách lưu trữ trước khi thay policy. Không xóa lịch sử.

Xem bản đồ nguồn/hash/IDđoạn tại `src/data/kensetsu/paragraph-reuse-policy.json`. Bộ lọc câu hỏi giờ kiểm cácIDđoạn thật trong phạm vi thay vì chỉ kiểmIDbài. Không soạn thêm câu hỏi trong đợt này; không tuyên bố ngân hàng hiện có đã kiểm đủ mọi ý mới.

## Bằng chứng kiểm

- Host/component thật:65tuyến đọc;143lượt đối chiếu dịch (132 ở1号cho12ngôn ngữ và11 ở2号cho tiếng Việt); đoạn gốc và dịch giữ cùng đối tượng; phần không chọn không hiện; lưu mã hoàn thành cũ/mới; hai cấp dùng cùng view.
- Chromium/RNWeb có adapter:10tuyến đọc (5vị trí theo nhánh ×2cấp);22lượt đoạn dịch Việt; yêu cầu bấm hoàn thành mới; giữ lịch sử cũ; không có lỗi runtime ghi nhận. Ba kích thước màn hình đã chụp/xem.
- Bộ kiểm dùng chung trước đó vẫn đạt: các phạm vi10đề×40câu, không lẫn bài riêng ngành, giữ844đầu vào cũ.
- Chưa phải Expo sản xuất/thiết bị thật hay duyệt chuyên môn/bản ngữ/quyền.

## Phần chưa xong — không được đổi thành “đã kiểm đủ224bài”

Đã tạo danh sách đầy đủ224bài/1.912đoạn Nhật để theo dõi từng đoạn và từng nhánh trong `PARAGRAPH_REUSE_REVIEW_REGISTER_2026-10-17.json`. Một đoạn có thể chứa nhiều ý nên đây vẫn không phải mẫu số ý kiến thức. Mới có11ràng buộc đoạn–nhánh được xác nhận mới trong đợt này; các hàng còn lại, kể cả những bài đã dùng chung từ trước, vẫn mang trạng thái chờ rà từng ý. Chưa xác nhận hết các bảng/hình/chú thích/ngoại lệ của194trang nguồnk/d.

Bước tiếp: tiếp tục từng hàng pending, ghi ý/điều kiện và nguồn tương ứng; rà ngược bài đã liên kết; kiểm phần trùng đã được dạy tại bài nhận trước khi bổ sung; chỉ chốt ứng viên giữ riêng khi có căn cứ nội dung. Không biến so khớp từ khóa hay kiểm kê1.912đoạn thành hoàn tất yêu cầu đối chiếu kiến thức.

Chưa đến mốc báo hoàn tất toàn bộ đối chiếu. Các thay đổi của đợt đầu là một mốc kỹ thuật có thể kiểm lại, không phải yêu cầu chủ dự án chấp nhận phần còn dở.
