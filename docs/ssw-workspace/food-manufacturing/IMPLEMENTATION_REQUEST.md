Hãy xây dựng và tích hợp đầy đủ nội dung học tập **Tokutei Ginō ngành sản xuất thực phẩm, đồ uống — 飲食料品製造業**, gồm **特定技能1号 và 特定技能2号**, vào app học tiếng Nhật hiện có.

Thực hiện toàn bộ quy trình: đọc tài liệu → lập bản đồ kiến thức → thiết kế chương trình → viết bài học tiếng Nhật → biên soạn bài kiểm tra → tạo hình minh họa → dịch → tích hợp → kiểm tra → lưu tiến độ.

## 1. Tài liệu nguồn và xác định đúng ngành

Sử dụng hai PDF được đính kèm:

- `2026特定技能1号テキストVer5.1-0518（労働安全動画リンク追加）.pdf`.
- `2026特定技能2号学習用テキスト第3.01版-2.pdf`.

Đây là tài liệu **飲食料品製造業**, phục vụ công việc tại nhà máy sản xuất thực phẩm và đồ uống. Đặt tên ngành, đường dẫn, dữ liệu và giao diện đúng lĩnh vực này.

Không trộn với **外食業** như phục vụ khách tại nhà hàng, nhận gọi món, đặt bàn hoặc thanh toán.

Đọc toàn bộ hai PDF, gồm bảng biểu, sơ đồ, hình minh họa, chú thích và phụ lục. Với trang trích xuất chữ bị lỗi do furigana, phải xem lại trang gốc; không suy đoán nội dung từ văn bản lỗi.

Ghi nhận phiên bản tài liệu. Mọi đơn vị kiến thức phải truy ngược được tới tài liệu, chương/mục, trang PDF và số trang in nếu có.

## 2. Làm độc lập với tiến trình nông nghiệp

Kiểm tra mã nguồn, hướng dẫn trong repository và trạng thái Git trước khi sửa.

Tạo worktree và nhánh riêng cho ngành sản xuất thực phẩm. Không chuyển nhánh, reset, xóa, ghi đè hoặc dừng tiến trình đang làm nông nghiệp.

Phân vùng rõ:

- Dữ liệu bài học, bài kiểm tra và bản dịch.
- Hình minh họa và âm thanh.
- Báo cáo nguồn, tiến độ và kiểm tra chất lượng.
- Các thay đổi mã dùng chung cần tích hợp.

Nếu cần sửa component dùng chung, ghi rõ lý do, kiểm tra ảnh hưởng các ngành khác và tích hợp có kiểm soát. Không tự thay đổi giao diện JLPT đã được duyệt.

Không khẳng định phiên khác đang chạy nếu chưa có bằng chứng kiểm tra được.

## 3. Nguyên tắc biên soạn

Dùng PDF làm nguồn kiến thức để **viết nội dung mới**, không chép nguyên chương, câu hỏi, ví dụ hoặc hình ảnh.

Bắt buộc:

- Giữ đúng kiến thức, thuật ngữ, điều kiện áp dụng và trình tự thao tác.
- Viết lại cách giải thích, ví dụ, tình huống và câu hỏi.
- Không thay vài từ để tạo ra nhiều bài gần giống nhau.
- Không tự bổ sung thông số kỹ thuật, quy định pháp luật hoặc tiêu chuẩn an toàn khi chưa có nguồn.
- Không biến một ví dụ của tài liệu thành quy tắc áp dụng cho mọi sản phẩm hoặc nhà máy.
- Phân biệt kiến thức trong tài liệu, quy trình riêng tại nơi làm việc và ví dụ giả định dùng để học.

Các thông số như nhiệt độ, thời gian, nồng độ, đơn vị đo, công thức và giới hạn kiểm soát phải được kiểm tra trực tiếp với nguồn.

Nếu cần khẳng định quy định hiện hành ngoài nội dung PDF, kiểm chứng bằng nguồn chính thức và ghi ngày kiểm tra. Nếu chưa kiểm chứng được, đánh dấu chờ xử lý.

## 4. Bản đồ kiến thức và phân biệt 1号/2号

Lập ma trận bao phủ toàn bộ mục lục hai tài liệu trước khi viết hàng loạt.

Mỗi mục cần có:

- Mã kiến thức ổn định.
- Tài liệu và vị trí nguồn.
- Chuẩn đầu ra.
- Thuộc 1号, 2号 hoặc kiến thức chung.
- Bài học, hình minh họa và câu hỏi liên quan.
- Trạng thái biên soạn và kiểm tra.

**Lộ trình 1号** tập trung vào người trực tiếp thao tác, gồm:

- Tổng quan ngành và kỹ năng cần thiết.
- 食品衛生.
- 危害要因: vật lý, hóa học và sinh học.
- 一般衛生管理, 5S.
- Vệ sinh cơ sở, thiết bị, dụng cụ và người lao động.
- Quản lý nguyên liệu và thực phẩm.
- HACCP, 7 nguyên tắc, điểm kiểm soát quan trọng, giới hạn kiểm soát, sai lệch, biện pháp khắc phục và ghi chép.
- 労働安全.
- Trang phục, quy trình thao tác, sử dụng máy và hóa chất.
- Xử lý bất thường, tai nạn, ヒヤリ・ハット và KYT.
- Các dạng tai nạn, cách phòng ngừa và biển báo trong tài liệu.

**Lộ trình 2号** phải thể hiện vai trò 職長/班長/リーダー, gồm đầy đủ sáu chương:

1. 職長として働くための基本.
2. 食品衛生.
3. 品質管理.
4. 生産管理.
5. 労働安全.
6. 社会の変化と会社の方針.

Bao phủ cả các mục nhỏ: chỉ đạo, đào tạo, giao tiếp, phòng ngừa harassment, HACCP ở mức quản lý, PDCA, kiểm tra, truy xuất nguồn gốc, thống kê và QC, kế hoạch sản xuất, chi phí, tiến độ, năng suất và các nội dung còn lại trong tài liệu.

Không chỉ tăng độ khó tiếng Nhật để biến bài 1号 thành bài 2号. Bài 2号 phải yêu cầu người học phân tích, phân công, hướng dẫn, giám sát, đánh giá và xử lý nguyên nhân.

Kiến thức nền chung dùng chung dữ liệu khi phù hợp; phần mở rộng 2号 phải có mục tiêu riêng.

## 5. Thiết kế chương trình học

Áp dụng cách tổ chức theo tuần/ngày đã dùng cho các mảng Tokutei trước đây, với mục tiêu khoảng **30 phút/ngày**.

Không mặc định ngành này cũng có 55 tuần. Xác định số tuần theo khối lượng thực tế của hai PDF và độ bao phủ kiến thức.

Mỗi lộ trình có:

- Tuần và ngày học rõ ràng.
- Mục tiêu theo tuần.
- Bài học theo ngày.
- Ôn tập và kiểm tra tuần.
- Ôn tập tổng hợp và thi thử.

Không kéo dài chương trình bằng nội dung lặp, cũng không rút ngắn đến mức bỏ mất kiến thức. Những ngày chưa có bài phải hiển thị đúng trạng thái; không tạo bài trống để lấp lịch.

## 6. Cấu trúc bài học hằng ngày

Mỗi bài cần có:

1. Tiêu đề tiếng Nhật.
2. Mục tiêu học tập cụ thể.
3. Giải thích kiến thức theo từng ý.
4. Thuật ngữ chuyên ngành.
5. Ví dụ thực tế tại nhà máy thực phẩm.
6. Hình hoặc sơ đồ khi giúp hiểu thao tác.
7. Điểm cần chú ý và sai sót thường gặp.
8. Tóm tắt nội dung.
9. Nút hoàn thành.

Tách kiểm tra tuần khỏi trang bài học; không đặt cả danh sách câu hỏi vào giữa phần lý thuyết.

Tình huống thực tế phải có bối cảnh, vấn đề, hành động và kết quả. Ưu tiên những tình huống như kiểm tra trước ca, phát hiện dị vật, hồ sơ nhiệt độ bất thường, nhãn sai, nguyên liệu chưa đạt, máy gặp sự cố và hướng dẫn nhân viên mới.

Nếu có hội thoại, dùng lời nói tự nhiên, vai trò rõ ràng và phù hợp công việc. Không áp dụng máy móc quy tắc 11 lượt của hệ thống 7.128 hội thoại cho mọi bài học ngành nghề.

## 7. Ngôn ngữ, furigana và bản dịch

**Tiếng Nhật là nội dung chính.** Hoàn thiện và kiểm tra bản Nhật trước khi dịch.

Yêu cầu:

- Không trộn tiếng Việt vào phần nội dung Nhật.
- Diễn đạt rõ ràng cho lao động nước ngoài nhưng giữ đúng thuật ngữ.
- Furigana đúng ngữ cảnh, nhất là thuật ngữ chuyên ngành, từ nhiều cách đọc, số và đơn vị.
- Kiểm tra cách hiển thị furigana theo component hiện có, tránh chồng chữ hoặc cắt dòng.

Đọc cấu hình và dữ liệu thực tế để xác định đủ **12 ngôn ngữ đích** của app; không đoán danh sách.

Bản dịch phải:

- Đối chiếu trực tiếp bản Nhật.
- Tự nhiên, đầy đủ và đúng ngữ cảnh nhà máy.
- Giữ nguyên phủ định, điều kiện, mức độ bắt buộc, số liệu và cảnh báo.
- Thống nhất thuật ngữ trong toàn ngành.
- Bao phủ tiêu đề, mục tiêu, nội dung, chú thích hình, câu hỏi, lựa chọn, giải thích và hướng dẫn.
- Không dùng tiếng Nhật hoặc tiếng Anh thay thế rồi tính là bản dịch hoàn thành.

Hiển thị Nhật trước, bản dịch mở bằng nút chọn ngôn ngữ. Phần thi thử ngành thực phẩm có bản dịch hỗ trợ học tập; không áp dụng nhầm ngoại lệ bản dịch đã thống nhất riêng cho bài kiểm tra xây dựng.

## 8. Bài kiểm tra và thi thử

Tạo hai hệ thống riêng:

- **1号: 10 đề × 40 câu = 400 câu.**
- **2号: 10 đề × 40 câu = 400 câu.**

Tổng cộng **800 câu thi thử mới**, chưa tính kiểm tra tuần. Đây là cấu hình luyện tập của app; không tự gọi là cấu trúc chính thức của kỳ thi.

Mỗi câu gồm:

- Mã câu và mã kiến thức.
- Cấp 1号/2号.
- Câu hỏi tiếng Nhật.
- Bốn lựa chọn, chỉ một đáp án đúng.
- Giải thích đáp án đúng và lý do các lựa chọn còn lại sai.
- Tham chiếu nguồn.
- Bản dịch và hình minh họa nếu cần.

Các đề phải có ma trận bao phủ. Không tạo câu trùng bằng cách đổi tên người, đổi thứ tự lựa chọn hoặc thay vài con số.

1号 ưu tiên hiểu kiến thức, nhận diện nguy cơ và chọn thao tác đúng.  
2号 tăng câu tình huống quản lý, đọc hồ sơ, phân tích dữ liệu, tính toán và lựa chọn biện pháp xử lý.

Câu tính toán phải có đủ dữ kiện, đơn vị, quy tắc làm tròn và lời giải kiểm chứng được.

Phân bố đáp án mỗi đề: 10 câu ở mỗi vị trí 1–4; không có ba đáp án cùng vị trí liên tiếp. Kiểm tra lại logic sau khi sắp xếp lựa chọn.

Tạo kiểm tra tuần riêng theo kiến thức đã học; không lấy nguyên câu thi thử để lấp vào.

Nếu chưa xác minh thời gian thi hoặc ngưỡng đỗ chính thức, sử dụng cấu hình luyện tập có nhãn rõ ràng.

## 9. Hình minh họa và video

Tạo hình **2D màu**, thống nhất phong cách, mô tả đúng môi trường nhà máy thực phẩm.

Ưu tiên minh họa:

- Rửa tay, thay đồ bảo hộ.
- Phân vùng sạch/bẩn và ngăn nhiễm chéo.
- Dị vật và nguy cơ hóa học, sinh học.
- Bảo quản, kiểm tra và ghi chép.
- HACCP và xử lý sai lệch.
- Máy móc, dao, hóa chất và các tình huống tai nạn.
- Sơ đồ quy trình, biểu mẫu và công cụ quản lý ở 2号.

Thông tin chính xác như biểu đồ, công thức, bảng số liệu và sơ đồ có nhãn phải dựng bằng công cụ phù hợp; không phụ thuộc vào chữ do AI tạo ảnh.

Không dùng ảnh trùng để trang trí hàng loạt. Không để placeholder xuất hiện trong bản hoàn thiện. Ảnh phải đọc được trên điện thoại, tablet, laptop và màn hình ngang.

Với video an toàn được liên kết trong PDF: lưu nguồn và tiêu đề đúng, kiểm tra liên kết khi có thể, không tự tải lại hoặc tái phân phối khi chưa có quyền.

## 10. Giao diện tích hợp

Kế thừa thiết kế Tokutei đã được duyệt:

- Chọn ngành → chọn 1号/2号 → chọn tuần → lịch ngày học → trang bài học riêng.
- Bộ chọn tuần dạng lưới, nhóm khoảng 10 tuần khi phù hợp.
- Không thêm lại nút “Học tiếp” đã bỏ.
- Trang học dùng nền ivory theo màu hiện có; trang danh sách dùng nền mờ theo thiết kế app.
- Tiêu đề rõ, phân cách gọn, nút dịch ở đầu trang.
- Kiểm tra tuần ở tab riêng.
- Nút quay lại thống nhất.
- Hoàn thành bài thì lưu trạng thái và tự về lịch.
- Phân biệt dấu hoàn thành ngày học và kiểm tra tuần.
- Khôi phục tiến độ sau khi đóng/mở app.

Kiểm tra safe area, cuộn trang, cỡ chữ lớn, chế độ tối và màn hình ngang. Không để nút trả lời ngoài màn hình, khung nội dung quá lớn, khoảng trống bất hợp lý hoặc chuyển trang nháy trắng.

## 11. Âm thanh

Nếu bổ sung nghe bài hoặc hội thoại, tái sử dụng cơ chế âm thanh và bốn giọng đã được chốt trong mã nguồn.

Kiểm tra cấu hình thực tế trước khi gán giọng. Giọng phù hợp vai trò, giới tính và độ tuổi nhân vật; đọc đúng thuật ngữ, số và đơn vị.

Âm thanh phải được tạo sẵn và tích hợp theo kiến trúc app để người học không cần cài VOICEVOX. Không đánh dấu có âm thanh khi mới chỉ có tên file hoặc đường dẫn chưa tồn tại.

## 12. Tổ chức sáu AI làm song song

Nếu môi trường hỗ trợ, chia sáu AI với phạm vi sở hữu rõ ràng:

1. Đọc nguồn, lập ma trận bao phủ và kiểm tra chuyên môn.
2. Viết lộ trình 1号.
3. Viết lộ trình 2号.
4. Soạn kiểm tra tuần và 800 câu thi thử.
5. Hình minh họa, thuật ngữ và bản dịch sau khi bản Nhật đạt kiểm tra.
6. Tích hợp app, kiểm thử, tổng hợp và lưu tiến độ.

Khởi tạo chung cấu trúc dữ liệu, mã định danh và quy ước trước khi chia việc. Không để nhiều AI sửa cùng file.

Các bước phụ thuộc phải đi đúng thứ tự: không dịch bản Nhật chưa ổn định; không hoàn thiện đề trước khi có ma trận kiến thức; không báo tích hợp khi chỉ có file nội dung.

Nếu không có khả năng chạy sáu AI, nói rõ và thực hiện theo các luồng công việc tương ứng; không giả lập tiến độ.

## 13. Kiểm tra chất lượng và tiêu chí nghiệm thu

Kiểm tra tự động kết hợp đọc nội dung và thử giao diện.

Bắt buộc đạt:

- Toàn bộ mục kiến thức nguồn đã được ánh xạ; không bỏ sót âm thầm.
- Đúng phạm vi ngành, phân biệt rõ 1号/2号.
- Không có nội dung rỗng, placeholder hoặc mã trùng.
- Không có câu hỏi nhiều đáp án đúng hoặc thiếu dữ kiện.
- Số liệu, công thức và quy trình an toàn đã được đối chiếu.
- Đủ 10 đề × 40 câu cho từng cấp.
- Đủ bản dịch cho 12 ngôn ngữ thực tế, có kiểm tra chất lượng.
- Hình và âm thanh tham chiếu tồn tại và sử dụng được.
- Lưu/khôi phục tiến độ và chấm điểm đúng.
- Không gây lỗi các ngành hiện có.
- Các kiểm tra mã nguồn liên quan, build và thử giao diện đã chạy; ghi rõ phần chưa thể chạy.

Một mục chỉ được tính hoàn thành khi có nội dung thật, vượt kiểm tra tương ứng và được tích hợp ở nơi người học sử dụng được.

## 14. Lưu tiến độ và báo cáo

Lưu checkpoint theo lô đủ lớn, ghi:

- Commit, nhánh và trạng thái đồng bộ.
- Số bài hoàn thành/tổng dự kiến theo từng cấp.
- Số mục kiến thức đã phủ/tổng mục.
- Số câu hỏi đạt kiểm tra.
- Tiến độ từng ngôn ngữ.
- Hình, âm thanh và tích hợp đã hoàn thành.
- Lỗi còn lại và công việc tiếp theo cụ thể.

Tách trạng thái “đã viết”, “đã kiểm tra”, “đã tích hợp” và “đã đồng bộ”.

Tuân thủ phạm vi cho phép Git đã có; không trộn thay đổi của nông nghiệp hoặc các phiên khác vào commit ngành thực phẩm.

Làm liên tục theo khả năng thực thi, báo cáo ngắn tại mốc có ý nghĩa. Không hứa tác vụ tự chạy sau khi kết thúc phiên nếu không có hệ thống chạy nền được xác nhận.

Bắt đầu bằng việc kiểm tra repository, đọc đầy đủ hai PDF, lập ma trận kiến thức và thiết kế chương trình. Sau đó triển khai từng lô đến khi đạt các tiêu chí nghiệm thu, không dừng ở một bản kế hoạch.

## Cập nhật thuật ngữ được người dùng yêu cầu — 2026-10-28

Dùng sáu bản dịch giáo trình đính kèm làm chuẩn thuật ngữ cho VI, EN, ID, zh-CN, KM và MY trong bài học, bài kiểm tra, bảng thuật ngữ và chú thích. Trước mọi sửa đổi/dịch mới, đọc `terminology-standard.json` và báo cáo ngôn ngữ tương ứng `terminology-20261028-{locale}.json`. Các PDF bản 2024 chỉ là chuẩn thuật ngữ; giữ kiến thức, số liệu và điều kiện của nguồn Nhật2026. Giữ phân biệt 管理基準/許容限界(CL)/OL, 改善措置/修正/是正処置 và các ngoại lệ ngữ cảnh đã ghi. Sáu ngôn ngữ chưa được cung cấp nguồn chuẩn được để rà soát sau. Không coi việc đối chiếu AI là xác nhận người bản ngữ/chuyên gia.
