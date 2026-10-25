Hãy sử dụng hai tài liệu đính kèm 「耕種農業全般 特定技能1号」 và 「耕種農業全般 特定技能2号」 để xây dựng mô-đun học và kiểm tra **Tokutei Gino Nông nghiệp — 耕種農業** trong Japan App.

Áp dụng quy trình đã dùng cho Tokutei Gino Xây dựng: kiểm kê nguồn → lọc và đối chiếu kiến thức → biên soạn độc lập bằng tiếng Nhật → xây dựng bài học → tạo hình minh họa → xây dựng bài kiểm tra → dịch → tích hợp → kiểm thử → lưu tiến độ.

Đây là yêu cầu thực hiện đầy đủ, không chỉ lập kế hoạch hoặc tạo vài bài mẫu.

### 1. Kiểm tra dự án và giữ nguyên công việc đã có

- Đọc AGENTS.md, hướng dẫn khởi động phiên, các quy định giao diện và checkpoint hiện hành trước khi sửa.
- Kiểm tra mã nguồn thực tế của mô-đun Xây dựng để tái sử dụng thành phần lịch học, trang bài học, bộ chạy bài thi, dịch, lưu tiến độ và hoàn thành.
- Xác định phần Nông nghiệp hiện có; giữ nội dung hợp lệ, không tạo mô-đun trùng.
- Giữ nguyên giao diện đã được duyệt và các thay đổi của phiên khác.
- Không sửa nội dung Xây dựng, Kaigo, JLPT hoặc hội thoại địa phương ngoài những thay đổi dùng chung thực sự cần thiết.
- Không áp đặt 55 tuần của Xây dựng lên Nông nghiệp. Số tuần phải xuất phát từ khối lượng kiến thức của hai tài liệu.

### 2. Kiểm kê đầy đủ hai tài liệu

Đọc toàn bộ hai PDF, bao gồm phần mở đầu, chú thích, bảng, hình, ảnh nhận dạng, đơn vị và các cảnh báo.

Lập danh mục nguồn với:

- ID tài liệu, tên, phiên bản/ngày xuất bản nếu xác định được.
- SHA-256, tổng số trang.
- Số trang PDF và số trang in trong sách, ghi riêng để tránh lệch.
- Chương, mục, tiểu mục, bảng, hình và nhóm kiến thức tương ứng.

OCR và văn bản trích xuất chỉ hỗ trợ tìm kiếm. Những chỗ có furigana, chữ nhỏ, số liệu, công thức, bảng hoặc nhãn hình phải đối chiếu trực tiếp trang PDF. Không dùng lỗi OCR làm nội dung bài học.

Phạm vi phải xét gồm:

- 日本農業一般.
- 耕種農業一般.
- 安全衛生.
- 稲作作業.
- 畑作・野菜作業.
- 施設園芸作業.
- 果樹栽培作業.
- 農作業の用語.
- Các ảnh, bảng và phần nhận dạng liên quan.
- 花き栽培作業 trong tài liệu 2号.
- Các mục khác phát hiện khi đọc đầy đủ, kể cả nội dung nằm ngoài danh sách trên.

Phạm vi này là trồng trọt. Không tự bổ sung giáo trình 畜産農業 chỉ vì cùng thuộc ngành Nông nghiệp.

### 3. Lọc nội dung bằng bảng đối chiếu kiến thức

Tách nội dung thành các đơn vị kiến thức có thể kiểm tra được. Mỗi đơn vị phải ghi:

- ID ổn định.
- Tài liệu, trang, mục nguồn.
- Khái niệm, thao tác hoặc năng lực cần học.
- Điều kiện áp dụng, trình tự, ngoại lệ.
- Số liệu, đơn vị, công thức và cảnh báo liên quan.
- Thuộc 1号, 2号 hoặc dùng chung.
- Bài học, hình và câu hỏi sẽ sử dụng.
- Trạng thái: đã xử lý, còn thiếu, cần xác minh hoặc loại khỏi giáo trình có lý do.

“Lọc” nghĩa là bỏ lặp và tổ chức lại, không phải tóm tắt đến mức mất kiến thức.

Được loại khỏi bài học các trang bìa, thông tin xuất bản và nội dung hành chính không phục vụ mục tiêu học, nhưng phải ghi nhận quyết định. Không bỏ phần an toàn, bảng điều kiện, chú thích hoặc ảnh nhận dạng chỉ vì khó xử lý.

Không báo “bao phủ 100%” dựa trên số trang đã đọc hoặc số bài đã tạo. Chỉ tính tỷ lệ khi đã có danh mục kiến thức đầy đủ và đối chiếu từng mục.

### 4. Phân biệt chính xác 1号 và 2号

So sánh hai tài liệu theo từng khái niệm:

- Nội dung giống nhau: dùng chung bản ghi hoặc tham chiếu.
- Nội dung 2号 mở rộng: giữ phần nền tảng và bổ sung bài riêng.
- Nội dung chỉ có ở một tài liệu: đặt đúng khóa học.
- Nội dung có khác biệt về số liệu, điều kiện hoặc cách trình bày: kiểm tra và ghi rõ, không tự hợp nhất.

Không sao chép toàn bộ khóa 1号 sang 2号 rồi thay tiêu đề. Không tự suy diễn nội dung quản lý, chỉ đạo hoặc kỹ thuật nâng cao khi tài liệu không cung cấp căn cứ.

Nếu cần bổ sung năng lực ngoài hai PDF để đáp ứng kỳ thi hiện hành, ghi thành phạm vi thiếu. Chỉ dùng nguồn chính thức phù hợp, ghi rõ nguồn và ngày kiểm tra; không bịa kiến thức để lấp khoảng trống.

### 5. Biên soạn nội dung mới bằng tiếng Nhật

Tiếng Nhật là bản chính. Nội dung phải được viết lại độc lập dựa trên kiến thức đã kiểm chứng:

- Không chép nguyên đoạn, bảng, câu hỏi, ảnh hoặc bố cục trang của sách vào app.
- Giữ đúng thuật ngữ kỹ thuật, ý nghĩa, số liệu và điều kiện.
- Giải thích ngắn gọn, đầy đủ, tự nhiên và phù hợp người lao động nước ngoài.
- Không đơn giản hóa đến mức sai chuyên môn hoặc mất cảnh báo.
- Không trộn tiếng Việt hay ngôn ngữ khác trong bản Nhật.
- Không tạo hàng loạt đoạn giống nhau chỉ thay tên cây trồng.

Với thông tin thống kê có năm tham chiếu, phải giữ năm đó; không trình bày số liệu lịch sử thành tình hình hiện tại.

Những nội dung phụ thuộc loại cây, giống, vùng, mùa, thiết bị hoặc sản phẩm phải nêu đúng điều kiện. Không biến ví dụ thành quy tắc áp dụng cho mọi trường hợp.

### 6. Thiết kế chương trình học

Thiết kế hai lộ trình 1号 và 2号, dùng chung kiến thức nền khi thích hợp.

Mục tiêu dự kiến là khoảng 30 phút/ngày. Xác định số tuần sau khi hoàn thành kiểm kê kiến thức; không kéo dài bằng nội dung lặp và không nhồi kiến thức để đủ một số tuần cố định.

Mỗi ngày học cần có:

1. Tiêu đề và mục tiêu năng lực cụ thể.
2. Kiến thức chính, chia thành các đoạn dễ đọc.
3. Cách quan sát hoặc thao tác theo trình tự.
4. Điều kiện, sai sót thường gặp và điểm cần chú ý.
5. Ví dụ thực tế được viết mới.
6. Hình minh họa khi cần để hiểu hoặc nhận dạng.
7. Thuật ngữ Nhật quan trọng kèm cách đọc.
8. Tóm tắt cuối bài.
9. ID liên kết với các đơn vị kiến thức nguồn.

Nếu có hội thoại, phải phù hợp bối cảnh nông trại và phân vai rõ ràng. Không bắt mọi bài phải có hội thoại khi bảng so sánh hoặc hình giải thích hiệu quả hơn.

Chủ đề an toàn phải được dạy thành kiến thức cụ thể, không chỉ lặp câu “hãy chú ý an toàn”.

### 7. Hình minh họa và kiến thức nhận dạng

Tạo hình mới khi cần, theo phong cách 2D màu thống nhất với app.

Phải phân biệt:

- Sơ đồ giải thích khái niệm hoặc trình tự.
- Hình nhận dạng cây, dụng cụ, vật liệu, máy móc.
- Hình phân biệt triệu chứng, sâu bệnh hoặc trạng thái sinh trưởng.

Không dùng sơ đồ trang trí thay thế hình nhận dạng thực tế. Với sâu bệnh hoặc triệu chứng dễ nhầm, phải có đặc điểm phân biệt và giới hạn nhận định; không khẳng định chẩn đoán chỉ từ một biểu hiện chung.

Yêu cầu:

- Nhãn chính bằng tiếng Nhật; mô tả thay thế có thể dịch.
- Không dùng lại cùng hình nếu nội dung hình không phù hợp bài.
- Không sao chép ảnh trong PDF khi chưa có quyền phù hợp.
- Bảng và sơ đồ cần độ chính xác phải dựng bằng công cụ kiểm soát được chữ, số và vị trí; không dựa vào ảnh AI để tạo số liệu chính xác.
- Hình phải hiển thị rõ trên điện thoại, tablet và laptop; không méo, cắt mất nhãn hoặc làm lựa chọn trả lời nằm ngoài màn hình.
- Mỗi hình có ID, mục đích, bài sử dụng, trạng thái kiểm tra và thông tin nguồn/quyền cần thiết.

### 8. Xây dựng bài kiểm tra

Áp dụng định dạng học tập đã dùng cho Xây dựng:

- **1号: 10 đề × 40 câu.**
- **2号: 10 đề × 40 câu.**
- Tổng cộng 800 câu trắc nghiệm mới.
- Kiểm tra tuần đặt ở tab riêng; số câu phù hợp kiến thức tuần, tránh lặp không cần thiết với bộ đề tổng hợp.

Đây là định dạng luyện tập trong app. Không gọi là đề mô phỏng đúng cấu trúc chính thức nếu chưa đối chiếu quy định kỳ thi hiện hành.

Trước khi viết câu hỏi, lập ma trận phân bổ theo chương, năng lực, mức độ và nội dung an toàn. Toàn bộ bộ đề phải bao phủ các nhóm kiến thức; không tuyên bố mỗi đề 40 câu kiểm tra được mọi chi tiết trong sách.

Mỗi câu phải có:

- ID, cấp 1号/2号, chủ đề và mục tiêu kiểm tra.
- Câu hỏi Nhật rõ ràng.
- Bốn lựa chọn, chỉ một đáp án đúng.
- Giải thích đáp án và lý do các lựa chọn sai.
- Liên kết bài học và đơn vị kiến thức nguồn.
- Phiên bản nội dung và hash liên kết cần thiết.

Yêu cầu chất lượng:

- Không sao chép câu hỏi có sẵn trong tài liệu.
- Không tạo câu trùng ý chỉ bằng thay từ hoặc đảo lựa chọn.
- Các phương án sai phải hợp lý với lỗi người học thường mắc.
- Không dùng lựa chọn vô lý để làm câu hỏi dễ một cách giả tạo.
- Câu tính toán phải đủ dữ kiện, đúng đơn vị và kiểm tra lại phép tính.
- Không để đáp án lộ qua độ dài, ngữ pháp hoặc mẫu lặp.
- Mỗi đề có 10 đáp án ở từng vị trí 1–4; không có ba đáp án liên tiếp cùng vị trí.
- Đề 2号 phải kiểm tra phần kiến thức khác biệt thực sự, không chỉ đổi tên từ đề 1号.
- Nếu số đơn vị kiến thức độc lập chưa đủ để tạo 800 câu đạt chất lượng, báo rõ trước khi tạo câu lặp để đủ chỉ tiêu.

Không tự đặt thời gian thi, điểm đỗ hoặc quy tắc thăng cấp theo danh nghĩa kỳ thi chính thức. Tái sử dụng cấu hình luyện tập hiện có khi phù hợp và ghi rõ đó là cấu hình của app.

### 9. Dịch sang các ngôn ngữ hỗ trợ

Sau khi bản Nhật của từng cụm đã ổn định, dịch trực tiếp từ Nhật sang đủ 12 ngôn ngữ được xác định từ cấu hình thực tế.

- Không dịch nối tiếp qua tiếng Việt hoặc tiếng Anh.
- Áp dụng phong cách dịch đã được duyệt trong Kaigo: tự nhiên, dễ hiểu, đủ ý, đúng vai và đúng ngữ cảnh.
- Giữ nguyên số, đơn vị, phủ định, điều kiện, trình tự và mức độ bắt buộc.
- Dùng bảng thuật ngữ thống nhất, nhưng không thay từ máy móc.
- Lưu bản dịch theo phiên bản/hash của nguồn Nhật; nguồn thay đổi phải đánh dấu bản dịch cần cập nhật.
- Kiểm tra toàn bộ ngôn ngữ, không chỉ một vài ngôn ngữ đại diện.
- Với thuật ngữ chuyên môn, giữ tiếng Nhật kèm giải thích bằng ngôn ngữ đích khi cần.

Bài học phải hỗ trợ chuyển bản dịch. Với bài thi, giữ chính sách Nhật là chính như phần Xây dựng; không tự bổ sung bản dịch đề thi nếu chưa có yêu cầu riêng.

Không đánh dấu bản dịch AI là đã được người bản ngữ duyệt.

### 10. Tích hợp vào app

Tái sử dụng kiến trúc và giao diện Xây dựng hiện hành:

- Tách lựa chọn 1号 và 2号.
- Chọn tuần bằng lưới; chia nhóm tuần khi cần.
- Chọn ngày mở trang học riêng.
- Tiêu đề rõ, đoạn dễ đọc, dấu phân cách phù hợp.
- Nút bật/tắt bản dịch ở đầu bài.
- Bài kiểm tra tuần và đề tổng hợp ở khu vực riêng.
- Không chèn câu hỏi kiểm tra vào giữa bài đọc.
- Có nút “Hoàn thành”, lưu trạng thái và trở về lịch theo hành vi đã được duyệt.
- Ngày không có bài phải hiển thị đúng; không tạo bài rỗng để lấp lịch.
- Trang học dùng nền ngà; trang danh sách dùng nền theo thiết kế hiện hành.
- Giữ khung, nút Back, chế độ ngày/đêm và cách hiển thị đã được duyệt.

ID, câu trả lời, kết quả, tiến độ và khóa lưu phải độc lập giữa Nông nghiệp 1号, Nông nghiệp 2号 và các ngành khác.

Không hiện đáp án trước khi nộp. Phải kiểm tra chọn đáp án, hủy nộp, nộp bài, chấm điểm, xem lại, làm lại và khôi phục sau khi đóng app.

### 11. Kiểm tra bắt buộc

Kiểm tra riêng các lớp sau:

- **Nguồn:** đủ trang, bảng, hình và đơn vị kiến thức; mọi mục loại bỏ có lý do.
- **Nội dung:** đúng nghĩa, đúng điều kiện, không bỏ cảnh báo, không tạo kiến thức không có căn cứ.
- **Trùng lặp:** rà cả câu chữ và ý nghĩa; dùng chung bản ghi khi thích hợp.
- **Bài thi:** số lượng, đáp án, tính duy nhất, phép tính, phân bổ và liên kết bài học.
- **Dịch:** đầy đủ ngôn ngữ, đúng nguồn, tự nhiên và không thiếu ý.
- **Kỹ thuật:** schema, kiểu dữ liệu, registry, liên kết hình và lưu tiến độ.
- **Hiển thị:** điện thoại dọc/ngang, tablet và laptop; chữ lớn, bản dịch dài, hình và bốn lựa chọn.
- **Hồi quy:** không làm hỏng Xây dựng, Kaigo, JLPT và hội thoại đang có.

Phân biệt rõ “đạt kiểm tra tự động”, “AI đã rà”, “đã duyệt chuyên môn”, “đã duyệt bản ngữ” và “đã kiểm tra thiết bị thật”. Không dùng trạng thái này thay cho trạng thái khác.

### 12. Lưu tiến độ và cách tiếp tục

Chia công việc thành cụm hoàn chỉnh theo chương hoặc nhóm kiến thức:

kiểm kê → viết Nhật → đối chiếu → hình/câu hỏi → dịch → tích hợp → kiểm tra → commit → lưu và xác minh trên remote.

Mỗi checkpoint ghi:

- Cụm đã hoàn thành và bằng chứng kiểm tra.
- Kiến thức còn thiếu hoặc cần xác minh.
- Bài, hình, câu hỏi và bản dịch đã tích hợp.
- Commit đã được xác minh trên remote.
- Vị trí chính xác để phiên sau tiếp tục.

Không coi tệp tạm hoặc commit chưa đẩy là đã lưu bền vững. Không ghi đè công việc của phiên khác.

Nếu dùng nhiều AI, giao phạm vi và tệp riêng, có một bước hợp nhất và kiểm tra chung; không để nhiều AI sửa đồng thời cùng bản ghi.

Nếu dùng GitHub Actions, phân biệt các bước kiểm tra cơ học với bước cần mô hình AI. Không tuyên bố đang tự chạy khi chưa xác nhận tiến trình thực tế; không đưa khóa API vào mã nguồn hoặc nhật ký.

### 13. Kết quả cần bàn giao

Bàn giao đầy đủ:

1. Danh mục hai tài liệu và bảng đối chiếu kiến thức.
2. Ma trận nội dung dùng chung/khác biệt giữa 1号 và 2号.
3. Chương trình tuần/ngày có căn cứ khối lượng.
4. Bài học tiếng Nhật được biên soạn mới.
5. Bộ hình và bảng theo dõi sử dụng.
6. Kiểm tra tuần và hai bộ 10 đề × 40 câu.
7. Bản dịch bài học đủ ngôn ngữ theo chính sách trên.
8. Mã tích hợp, bộ kiểm tra và bằng chứng chạy.
9. Checkpoint tiếp tục và danh sách phần chưa đạt.

Bắt đầu bằng kiểm tra dự án và kiểm kê toàn bộ hai PDF. Sau đó triển khai liên tục từng cụm hoàn chỉnh. Không dừng sau kế hoạch hoặc vài bài mẫu; chỉ hỏi lại khi có mâu thuẫn quan trọng chưa được quyết định, thiếu nguồn cần thiết hoặc giới hạn quyền truy cập thực sự ngăn công việc.