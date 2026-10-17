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

## Đợt rà ứng viên tiếp theo

Đã đối chiếu thêm sáu ứng viên theo ngữ cảnh. Hai ý giữ bài đang có để tránh lặp:flux ởbuilding040(dùng chungcivil),và hệ treo/trục stud ởbuilding018. Bốn so khớp từ ngữ không được dùng làm bằng chứng chuyển kiến thức:ống đồng/thép uốn;CO2tạo bọt/CO2chữa cháy;cáp quang được ngắt trước phá dỡ/cáp quang truyền dẫn;khoảng cách cần bơm–đường điện/khoảng cách tuyến ngầm. Xem `REUSE_CANDIDATE_DECISIONS_2026-10-17.json`; đây là quyết định hẹp theo ý/cặp nguồn, chưa phải đã loại trừ toàn bộ mọi ý trong sáu bài đó khỏi hai nhánh. Không có thay đổi runtime trong đợt này.

## Rà lại nhóm dụng cụ230–249 và nối 学科→実技

Đã đọc lại toàn bộ160đoạn Nhật của20bài230–249, đối chiếu thân bài xuyên trang và hình/chú thích của5kPDF33–37,5dPDF31–36. Hồ sơ `SHARED_TOOLS_REUSE_AUDIT_230_249_2026-10-17.json` ghi172điểm khái niệm có điều kiện,80cụm,hash từng đoạn và căn cứ riêng cho mỗi nhánh. Giữ các bài đang dùng chung; không thêm bài hoặc viết lại/dịch lại. Những giới hạn đã có về tốc độ/torque, loại đĩa, tuổi thọ lưỡi, máy đóng đinh, cuộn dây, xẻng/cào, máy đầm và kính nhìn laser được giữ nguyên. Đoạn ví dụ do dự án soạn được rà như vận dụng, không đếm thành sự kiện nguồn mới.

Phát hiện một liên kết hiển thị còn thiếu: nguyên lý đầm bê tông có trong 学科071 nhưng bài 実技building008 chỉ nhắc phần cũ ở hồ sơ biên soạn. Đã gắn cùng hai đối tượng đoạn071cluster3p1–p2 vào bài008 của cả建築・土木 ở1号và2号. Đi cùng ý rung/độ đặc là điều kiện giảm không khí cuốn vào không mong muốn; không diễn giải thành loại bỏ toàn bộ không khí hay rung càng lâu càng tốt. Các đoạn khác của071 không kéo theo. Không tăng số bài.

Tổng phần dùng lại theo đoạn hiện có8đoạn nguồn tại15vị trí theo nhánh; trong đó2đoạn mới này thuộc 学科, nằm ngoài kiểm kê1.912đoạn 実技 gốc. Số đoạn hiển thị:building1.023,civil980;utilities giữ1.912. Bộ sinh sổ rà soát giờ đọc quyết định cóhash từ hồ sơ kiểm, không làm mất320ràng buộc đoạn–nhánh đã rà khi chạy lại; bài đổi nội dung sẽ bị báo hồ sơ cũ thay vì âm thầm giữ chứng nhận.

Host/component đạt91tuyến đọc và195lượt đối chiếu dịch; vẫn dùng cùng đối tượng Nhật/dịch12ngôn ngữ, giữ lịch sử cũ và yêu cầu hoàn thành phần mở rộng. Các bài gốc/ngân hàng/ảnh và844đầu vào cũ giữ nguyên. Chromium/RNWeb đạt14tuyến đọc và30lượt đối chiếu đoạn dịch Việt. Đã xem ảnh bài008 tại320×568,768×1024,932×430. Giữ lịch sử cũ và yêu cầu bấm hoàn thành mới; không có lỗi runtime ghi nhận. Chi tiết trong `PARAGRAPH_REUSE_BROWSER_QA_2026-10-17.json`; chưa phải Expo/thiết bị thật. TypeScript phần liên quan và khóa UI JLPT đều đạt.

Đây là đối chiếu các khẳng định có giới hạn của nhóm đã chọn, chưa chứng nhận đầy đủ mọi ý nguồn hay đủ hình nhận biết thiết bị. Mẫu số ý kiến thức toàn nguồn vẫn chưa lập đủ;204bài còn lại chưa có hồ sơ nhóm tương đương, ngoài những quyết định hẹp đã ghi trước. Duyệt chuyên môn/bản ngữ/quyền và thiết bị thật vẫn chưa có. Không được báo đã hoàn tất224bài. Tiếp theo: nhóm đo/kiểm250trở đi và rà ngược các ý trong bảng/hình nguồn sang bài thật.

## Nhóm đo/kiểm250–259

Đã đọc80đoạn Nhật của10bài250–259 và thân bài/hình/chú thích tương ứng5kPDF38–39,5dPDF36–38. Ghi85điểm kiểm có điều kiện tại `SHARED_TOOLS_REUSE_AUDIT_250_259_2026-10-17.json`: máy thủy bình và bù đường ngắm, laser/độ dốc/bộ nhận, góc/khoảng cách/tọa độ, dây tham chiếu/độ võng, bọt nước/đơn vị, quả dọi từng mặt, thang thước vuông, tỉ lệ3:4:5và đầu móc bù điểm0. Giữ nguyên10bài đã dùng chung, không sửa runtime hoặc soạn dịch/ảnh/câu hỏi lặp. Nguồn hãng/chính thức được kiểm chọn lọc; hồ sơ phân biệt rõ phần thân bài và phần chỉ lấy được trích tìm kiếm. Không nhận đã đọc toàn bộ hướng dẫn thiết bị.

Cộng hai nhóm:30bài/240đoạn/257điểm kiểm có giới hạn,480ràng buộc đoạn–nhánh. Ngoài ra giữ11ràng buộc dùng lại từng đoạn 実技 đã sửa trước và4vị trí mới từ hai đoạn 学科071. Đây chưa phải mẫu số mọi ý nguồn.194bài gốc còn lại chưa có hồ sơ nhóm tương đương; các quyết định hẹp của đợt trước vẫn giữ. Chưa xác nhận đủ hình nhận dạng cho tất cả dụng cụ hoặc đầy đủ kiến thức toàn nguồn. Điểm tiếp nối là260: dụng cụ cắt/uốn/đục, sau đó đánh/mài/siết/lắp. Không chạy lại kiểm trình duyệt khi nhóm này chỉ thêm hồ sơ và sổ hash, không đổi dữ liệu học hay runtime.

## Nhóm cắt/đục/đánh/mài/siết260–273 — sửa một ý thiếu

Đã đọc112đoạn gốc của14bài và nguồn5kPDF40–44,5dPDF38–42, gồm hình/chú thích, đoạn nối trang. `SHARED_TOOLS_REUSE_AUDIT_260_273_2026-10-17.json` ghi115điểm kiểm có giới hạn. Giữ phân biệt lưỡi/đối tượng/độ cứng, vật liệu đầu búa không quyết định thứ hạng lực, hạt mài/nền/khả năng chịu nước, đường kính ren/bề rộng hai mặt, đầu nối socket/miệng, socket tay/socket chịu va đập, tạo ren/cắt ren và đường kính/bước ren. Không suy từ tên gọi thành thao tác hoặc công dụng mọi sản phẩm.

Phát hiện tên `目切りたがね` có trong hai nguồn nhưng vắng trong bài đang học. Đã kiểm tên trong danh sách dụng cụ ốp lát củaJAVADA và đọc mô tả một mẫu dụng cụ目切りgia công gạch của người nộp sáng chế. Hai căn cứ chỉ dùng cho tên/ngữ cảnh tồn tại; không sao chép câu, thiết kế hoặc kết luận quyền/an toàn/công dụng mọi sản phẩm. Thêm một đoạn tự soạn263cluster1p3với12bản dịch AI vào bài chung263, dùng cho cả3nhánh và2cấp. Không tăng số bài, không thêm câu hỏi. Tám đoạn Nhật cũ và toàn bộ mục dịch cũ giữ nguyên. Bài lênrevision2; mã hoàn thànhr1được lưu riêng, không tự hoàn thànhr2.

Bảy hash trích bài trong hai tệp ngân hàng được nối sang phiên bản bài mới. Toàn bộ nội dung câu hỏi, thứ tự, đáp án và revision đề giữ nguyên, được kiểm trực tiếp vớiGit nền bằng `scripts/kensetsu-authoring/check-authorized-reuse-input-revisions.py`. Sổ hash gốc844tệp không bị viết đè:841tệp còn nguyên byte,3tệp thuộc sổ có thay đổi chủ đích; tệp ngân hàng bổ sung thứ tư nằm ngoài sổ cũ. Lý do/hash trước–sau tại `AUTHORIZED_REUSE_INPUT_REVISIONS_2026-10-17.json`.

Host bài263 đạt39tuyến:12locale×3nhánh ở1号vàViệt×3nhánh ở2号; giữ cùng bài và lịch sử cũ. Chromium/RNWeb đạt3nhánh,27đoạn Nhật/27đoạn dịch Việt,3trường hợp nângr1→r2; đã xem ảnh320×568,768×1024,932×430. Ảnh minh họa cũ của263đã mở xem: chỉ hai mẫu đục khác bề rộng, không khẳng định nhận dạng được目切り. Không tạo ảnh hoặc nhận đủ mục tiêu nhận dạng từ ảnh này. Host phạm vi/ngân hàng,TypeScript phần liên quan và khóa UI JLPT đạt. Chưa phải Expo/thiết bị thật hoặc duyệt bản ngữ/chuyên môn/quyền.

Cộng ba nhóm:44bài/352đoạn gốc+1đoạn mới/372điểm kiểm có giới hạn/706ràng buộc đoạn–nhánh. Tổng kiểm kê 実技 gốc hiện1.913đoạn trong224bài; giữ mẫu số gốc1.912để phân biệt bổ sung. Các đoạn hiển thị:utilities1.913,building1.024,civil981. Các liên kết theo đoạn071/332/348/369vẫn giữ.180bài chưa có hồ sơ nhóm tương đương; một số ứng viên có quyết định hẹp từ trước. Chưa đối chiếu đủ mọi ý nguồn hoặc đủ hình nhận biết. Tiếp nối274: trộn vật liệu, hộp/sàng, che phủ/lưới/bảo vệ; sau đó quay sang nhóm bài chưa liên kết toàn phần. Không báo toàn bộ224bài đã xong hoặc đưa lệnh kiểm như một bàn giao hoàn tất.
