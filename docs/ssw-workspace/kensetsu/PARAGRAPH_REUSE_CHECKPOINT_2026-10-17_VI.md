# Đối chiếu và dùng lại kiến thức theo đoạn — 2026-10-17

Điểm tiếp nối mới nhất:79bài đã có hồ sơ đối chiếu có giới hạn; nhóm302–308đã bổ sung3đoạn và qua QA theo mục cuối.145bài còn lại và rà ngược toàn bộ ý/hình/bảng nguồn chưa hoàn tất.

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

## Nhóm trộn/che phủ/vận chuyển/nâng kéo/làm cao274–301 — sáu việc sửa đã xác định

Đã đọc thêm224đoạn của28bài, thân bài và toàn bộ hình/chú thích của5kPDF44–49,5dPDF42–47. Hồ sơ `SHARED_TOOLS_REUSE_AUDIT_274_301_2026-10-17.json` ghi224điểm kiểm có giới hạn và tách sáu ý còn phải sửa, chưa coi là đã tích hợp:

1.275: ví dụ máy trộn điện100V/động cơ; không biến100Vthành điện áp mọi máy. Đã đọc văn bản bảng catalogue hãng về các cấu hình; chưa duyệt thao tác đổi động lực/đấu điện.
2.291: quan hệ dụng cụ chul-hooru với ứng dụng kéo/định vị trong khai thác gỗ; bài cũ chỉ nhắc để loại trừ hướng dẫn thao tác. Đã đọc danh sách ứng dụng hãng; không soạn cách đốn cây, hướng kéo hay lực.
3.294: nối rõ tên lever block/hoist với ví dụ chỉnh độ thẳng đứng khung thép; bài cũ giải thích công việc và dụng cụ ở hai nơi riêng.
4.295: góc tham khảo khoảng75độ trong nguồn và checklist chính thức; bài cũ chưa dạy con số này. Giữ điều kiện hỗ trợ/cố định, không suy góc đúng là toàn bộ lắp đặt an toàn.
5.296: thêm ý không ngồi trên天板của loại cấm dùng mặt trên và chỉnh giới hạn câu cũ; FAQhãng có loại nhỏ/踏台được cho đứng theo thiết kế. Không dùng ngoại lệ thành cho phép ngồi/đứng ở mọi dụng cụ. Riêng296cluster3p1được ghi `needs_content_correction` ở cả hai nhánh, chưa tính xác nhận đúng có giới hạn.
6.299: giải thích mốc2mtrong phạm vi nguồn/quy định bằng chiều cao sàn tối đa; không lẫn với độ cao đang làm, tầm với hoặc ngưỡng đào tạo. Đã đọc đoạn liên quan trong văn bản Bộ; chưa nhận đã rà toàn bộ luật hoặc ngoại lệ.

Thuật ngữノロđã có trong 学科131dùng chung, không soạn lại hoặc kéo ví dụ rò cốp pha vào bài vệ sinh. Một ảnh minh họa không thay việc kiểm từng tính năng hoặc sản phẩm.

Cộng bốn nhóm:72bài/576đoạn gốc+1đoạn đã bổ sung/596điểm kiểm có giới hạn. Có1.152ràng buộc đoạn–nhánh xác nhận phần giải thích hiện có,2ràng buộc cần sửa điều kiện; ngoài ra11liên kết từng đoạn 実技 và4vị trí từ 学科071đã sửa trước vẫn giữ.152bài chưa có hồ sơ nhóm tương đương; vẫn chưa có mẫu số đầy đủ mọi ý nguồn, nên không báo phần trăm bao phủ.

Đợt này chỉ thêm hồ sơ/sổ đối chiếu, chưa đổi bài/runtime. Bước tiếp theo là thực hiện sáu sửa cụ thể trên, dịch các phần thật sự thêm/đổi, bảo toàn phần cũ và lượt làm đề, kiểm các tuyến ảnh hưởng rồi lưu. Sau đó tiếp tục302–385và162–229. Không bỏ sáu việc này để chỉ tăng số bài đã rà.

## Đã thực hiện sáu sửa274–301

Đã thêm5đoạn tại275cluster1p3,291cluster1p3,294cluster1p3,295cluster2p3,299cluster2p3; sửa296cluster3p1. Tất cả6bài lênrevision2, giữIDvà mã hoàn thànhr1trong lịch sử nhưng không tự hoàn thànhr2. Có72giá trị dịch mới/sửa cho12locale, dùng cùng dữ liệu cả3nhánh và2cấp. Không thêm ngày/bài/câu hỏi.

- Máy trộn: giữ100Vlà ví dụ của động lực điện, phân biệt động cơ và không suy vật liệu/dung tích từ nguồn lực.
- Kéo cây và chỉnh khung: nối tên dụng cụ với ứng dụng nguồn, tách khỏi kế hoạch/khả năng điều khiển kết quả hoặc thao tác thực địa.
- Thang tựa: dạy mốc tham khảo khoảng75độso với mặt phẳng ngang; bổ sung nguy cơ quá dốc đổ sau/quá thoải trượt theoFAQhãng, không chép khẳng định thang luôn gãy khi góc nhỏ. Góc không thay kiểm hỗ trợ/cố định hoặc góc chân脚立.
- 天板: câu được giới hạn theo loại có nhãn cấm; bổ sung việc ngồi, phân biệt một số loại nhỏ/踏台được thiết kế cho đứng, không biến cho đứng thành cho ngồi hoặc dạng chân.
- Xe làm cao: nêu2mtrong phạm vi phân loại theo sàn ở vị trí cao nhất; không lẫn độ cao đang dùng, tầm với hoặc ngưỡng đào tạo.

Công cụ kiểm nguồn thay đổi đối chiếu trực tiếp vớiGit nền: tổng hai đợt263và sáu sửa này có6đoạn thêm,1đoạn Nhật sửa,55đoạn cũ còn nguyên và163mục dịch cũ còn nguyên. Ba mươi hash trích bài được đổi, còn nội dung/thứ tự/đáp án/revision đề không đổi. Sổ hash gốc844tệp vẫn giữ:829tệp nguyên byte,15tệp trong sổ sửa có chủ đích; ngân hàng bổ sung thứ16nằm ngoài sổ gốc. Hồ sơ giữ cả hash nền và từng mốc trước–sau, không ghi đè sổ gốc để làm kiểm tra đạt.

Host sáu bài đạt234tuyến (12locale×3nhánh×6bài ở1号vàViệt×3nhánh×6bài ở2号). Chromium/RNWeb đạt18tuyến,159đoạn Nhật/159đoạn Việt,18trường hợp lưu lịch sửr1và hoàn thànhr2chủ động. Đã xem6ảnh của295/296ở320×568,768×1024,932×430. Ngân hàng10×40của mỗi phạm vi vẫn đạt; TypeScript liên quan, kiểm bảo toàn và khóa UI JLPT đạt. Chi tiết tại `SOURCE_GAP_REPAIRS_HOST_QA_2026-10-17.json`, `SOURCE_GAP_REPAIRS_BROWSER_QA_2026-10-17.json`, `SOURCE_GAP_REPAIRS_SCOPE_QA_2026-10-17.json`. Chưa phải Expo sản xuất/thiết bị thật hoặc duyệt chuyên môn/bản ngữ/quyền.

Mốc hiện tại:72bài đã có hồ sơ;576IDđoạn gốc(trong đó1đoạn đã chỉnh giới hạn)+6đoạn thêm;614điểm kiểm có giới hạn;1.164ràng buộc đoạn–nhánh đã đối chiếu phần giải thích. Sổ 実技 gốc224bài có1.918đoạn, mẫu số ban đầu1.912được giữ riêng. Số đoạn hiển thị:utilities1.918,building1.029,civil986; số bài224/163/152giữ nguyên. Không còn sáu việc sửa cụ thể của nhóm này ở trạng thái chưa tích hợp.152bài chưa có hồ sơ nhóm tương đương, rà ngược toàn bộ ý/bảng/hình/điều kiện và mục tiêu nhận dạng vẫn mở. Tiếp tục302–385và162–229; chưa bàn giao như đã hoàn tất toàn bộ224bài.

## Nhóm quản lý thi công302–308 — ba bổ sung đã tích hợp

Đã đọc56đoạn gốc, đối chiếu6k/6dPDF1–5và bảng ba loại墨出しởPDF5của cả hai nguồn. PDF1–4không có đối tượng hình nhúng hoặc vector; không suy rộng thành đã duyệt hình ở trang khác. Hồ sơ `CONSTRUCTION_METHOD_REUSE_AUDIT_302_308_2026-10-17.json` ghi59đoạn hiện hành,65điểm kiểm có giới hạn và118ràng buộc đoạn–nhánh.

Ba thiếu sót được bổ sung đúng bài:303cluster3p3giải thíchQCDSE;307cluster3p3phân biệt hồ sơ có bằng/chứng chỉ với mang giấy tờ cần thiết khi làm công việc thuộc diện yêu cầu;308cluster3p3giải thíchガラリtrong bảng vị trí lắp đặt. Có36giá trị dịch mới cho12locale; giữ nguyên mọi đoạn và bản dịch cũ. Ba bài lênr2, lưu hoàn thànhr1trong lịch sử, không tự hoàn thànhr2. Dùng chung qua tham chiếu ở cả3nhánh và2cấp; không thêm bài/câu hỏi.10hashtrích dẫn ngân hàng được cập nhật; nội dung câu hỏi/thứ tự/đáp án/revisionđề giữ nguyên.

QA: host351lượt đọc cho9bài trong sổ sửa thiếu sót, cộng39lượt riêng263; bộ kiểm toàn bộ phạm vi và12localePASS. Chromium9tuyến của3bài mới,81đoạn Nhật+81đoạn Việt,9ca nângr1→r2; đã xem9ảnh điện thoại/tablet/ngang. Các ảnh là readerRNWebvới adapter kiểm thử, chưa phảiExpohoặc thiết bị native. TypeScriptvà khóaUIJLPT10/10PASS. Kiểm toàn vẹn xác nhận823đầu vào gốc nguyên byte,22tệp sửa có truy vết,40hashtrích dẫn cập nhật cộng dồn và nội dung đề không đổi.

Cộng năm nhóm:79bài/632IDđoạn gốc(trong đó1đoạn đã chỉnh giới hạn)+9đoạn thêm=641đoạn;679điểm kiểm có giới hạn;1.282ràng buộc đoạn–nhánh.224bài gốc có1.921đoạn, giữ riêng mẫu số gốc1.912. Các đoạn hiển thị:utilities1.921,building1.032,civil989; số bài224/163/152không đổi.145bài chưa có hồ sơ nhóm tương đương. Ứng viên hẹp337ケガキtrong bảng6dPDF5để mở tới khi rà đầy đủ337; không coi một từ trong bảng đủ để nhập toàn bài hoặc mọi dụng cụ của bài337. Các mục nhận dạng hình, đối chiếu ngược mọi ý nguồn và bản dịch chuyên gia vẫn mở. Tiếp tục309–385và162–229.

## Tiếp nối nhóm quản lý thi công302–308 — 2026-10-18

Khôi phục phần chưa commit của phiên trước, đối chiếu56đoạn Nhật gốc với cả6k/6dPDF1–5và đọc trực quan đủ10trang, gồm bảng ba nhóm墨出し/墨付け. Giữ các đoạn đã có; bổ sung3đoạn ở303/307/308kèm36giá trị dịch cho12locale. QCDSEđược giải nghĩa đúng năm khía cạnh; giấy tờ phải mang theo được phân biệt với bản ghi có bằng/chứng chỉ và thẻCareerUp;ガラリđược gắn vào mục tiêu vị trí lỗ lấy/thải gió, không suy lưu lượng/tính năng từ dấu vị trí. Mỗi bài sửa lênr2, giữ hoàn thànhr1riêng, không tự hoàn thành phần mới.

Đã kiểm lại Điều61khoản1–4tạiMHLW và mô tả sản phẩm thông gió củaUNIX; phạm vi không phải toàn bộ nghĩa vụ pháp lý hoặc mọi sản phẩm. GLvà基準墨/親墨đã có trong115/119nên không soạn lại. Ứng viên337cluster2p1còn trộn định nghĩaケガキvới dụng cụ riêng; tiếp tục rà tại337, chưa đưa cả bài sang土木từ một từ trùng trong bảng. Quan hệ chất lượng–quá trình thi công an toàn và đầy đủ từng hoạt động quản lý còn thuộc rà ngược nguồn; hồ sơ hiện tại chỉ xác nhận các khẳng định có giới hạn.

Kiểm bảo toàn vớiGit nền đạt:9đoạn thêm tổng cộng,1đoạn sửa,79đoạn cũ và232mục dịch cũ giữ nguyên;40hash trích bài được cập nhật, nội dung/thứ tự/đáp án/revision đề không đổi. Host đọc9bài sửa trên351tuyến (12locale×3nhánh ở1号vàViệt×3nhánh ở2号). Chromium/RNWeb kiểm lại9tuyến cho3bài mới,81đoạn Nhật/81đoạn Việt,9trường hợp giữr1vàhoàn thànhr2chủđộng; ảnhphone/tablet/landscapeđược tạo. Không phảiExpo/thiếtbịthật,duyệtchuyênmôn/bảnngữ/quyền. KhóaUIJLPTđạt10/10.

Tổng79bài có hồ sơ/632IDđoạn gốc+9đoạn thêm/679điểmkiểmcógiớihạn. Sổ224bài có1921đoạn;1282ràngbuộcđoạn–nhánh xácnhậnphầngiảithích và11liênkếttừngđoạnriêng. Sốbài224/163/152khôngđổi. Còn145bài chưa có hồ sơ nhóm tương đương (309–385trừ phần đã rà, và162–229); chưa bàn giao là đã hoàn tất toàn bộ.
