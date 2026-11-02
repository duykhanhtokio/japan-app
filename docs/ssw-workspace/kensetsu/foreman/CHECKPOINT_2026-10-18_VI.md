# 職長 — mốc tiếp nối 2026-10-18

Theo yêu cầu chuyển sang hoàn thiện 職長, bản học được mở rộng từ ba bài lên 28 bài Nhật–Việt, bốn tuần, 56 cụm và 112 đoạn mỗi ngôn ngữ. Có 50 câu vận dụng mới không chấm điểm và bốn sơ đồ gốc: mạng tiến độ, thứ tự giảm rủi ro, ba quản lý vệ sinh, vai trò các hồ sơ. Các bài004–028 có cả tiêu đề, câu vận dụng và chú thích hình bằng tiếng Việt.

Nội dung có bài nháp cho cả năm chương: vai trò/chỉ đạo/đối thoại; chuẩn bị và quản lý QCDSE, PDCA/OODA, nguyên giá, chất lượng, môi trường, sức khỏe; rủi ro,5S,KY/KYT, sai sót và quấy rối; thiết kế/thi công/kế hoạch/thủ tục; ngành xây dựng và vai trò pháp lý. Ví dụ tiến độ dùng tình huống tự tạo2+max(4,2)+3=9ngày; không dùng lại số liệu hoặc hình nguồn.

Nguồn là leader.pdf,131trang, bản2025-01-15, SHA256 `fa094327913a14047de32ad734b552d6911af281566076ec327e50608c5106f7`. Đã đọc phần chữ chính trích xuất PDF7–131 và xem29trang chọn lọc có hình/bảng. Đây không phải kiểm tra trực quan tất cả131trang. PDF và hình nguồn nằm ngoài kho mã. `coverage-ledger.json` ghi phạm vi đọc, liên kết theo khoảng trang của bài, vấn đề nguồn và việc còn lại.56hàng mục tiêu chưa phải mẫu số toàn bộ từng ý nguồn.

Không dạy các mức tiền, năm sửa luật, số người hoặc ngưỡng WBGT cũ như quy định hiện hành. Đã đối chiếu trang chính thức về giấy phép xây dựng, nhiệt và quấy rối; URL nằm trong ledger, không hiển thị trong bài học. Bài phân biệt職長 với các chức danh pháp định, điều kiện hợp đồng và vai trò kiểm tra; không tự cấp quyền thi công từ ví dụ học.

Ba bài001–003 giữ nguyên từng byte, ID và revision1; baseline SHA256 nằm trong `preservation-baseline.json`. Không đổi câu hỏi, dữ liệu 学科・実技, khóa tiến độ hoặc giao diện JLPT.職長 chỉ ở2号, cùng28bài tham chiếu cho utilities/building/civil. Không tạo hoặc gắn nhãn bộ đề2号chính thức. Tiêu đề tuần001 được mở rộng để chứa đủ bảy bài; tuần002–004 mới. Thời lượng chưa đo, không cam kết mỗi bài đủ30phút.

Kiểm tra được lưu trong `content-qa-2026-10-18.json`, `scope-host-qa-2026-10-18.json` và `browser-qa-2026-10-18.json`. Browser sử dụng component thật với React Native Web/Chromium; adapter riêng cho khung Royal, safe area và lưu trữlocalStorage; bốn sơ đồ dùng ảnh thật. Đây không phải chạy Expo production hoặc kiểm thử thiết bị native.21ảnh kiểm tra bao gồm ba kích thước320×568,768×1024,932×430 trên bảy bài đại diện. Xem danh sách và kết quả chính xác trong báo cáo; không suy ra duyệt chuyên môn từ kiểm tra kỹ thuật.

`expression-screen.json` đối chiếu250chuỗi Nhật của28bài với chữ nguồn, chuẩn hóaNFKC và tìm chuỗi trùng liên tiếp22ký tự: không có ứng viên. Chữ hình/raster có thể thiếu trong trích xuất; kiểm tra này không chứng nhận quyền tác giả hoặc phát hiện mọi cách diễn đạt gần giống.

Việc còn lại: lập mẫu số nguồn đầy đủ từng ý và rà hình còn lại; bổ sung ý thiếu nếu có; đo thời gian và điều chỉnh nhóm bài; dịch11ngôn ngữ còn lại; duyệt chuyên môn, tiếng Nhật, tiếng Việt và quyền; kiểm traExpo/native. Tất cả cờ duyệt và releaseReady vẫnfalse. Các công việc thực hành trước đó được giữ nguyên tại commit nền8e694f3a, không coi việc chuyển sang職長 là hoàn tất cuộc rà224bài.

## Tiếp nối 2026-11-02

Đã lấy lại đúng byte nguồn leader131trang với SHA256 đã ghi, đọc và xem trực quan PDF17–24. Mốc chỉ đọc7–16 trong SOURCE_INTAKE_2GO là lịch sử; mốc28bài ở trên vẫn giữ. Không soạn lại nội dung đã có. Bài004 lên revision2, giữ ID và toàn bộ đoạn/câu vận dụng cũ; thêm một hoạt động không chấm điểm giúp người học nối mục tiêu coaching, hỗ trợ, thời điểm kiểm tra và phản hồi vào tình huống bỏ sót bản sửa đổi bản vẽ. Hoạt động có12bản dịch trực tiếp từ Nhật, chưa duyệt bản ngữ. Không thêm yêu cầu kỹ thuật/pháp lý mới.

Kiểm dữ liệu và bảo toàn ba bài001–003 PASS; chạy chính foreman data/locale adapter bằng esbuild đạt28bài,12ngôn ngữ hoạt động mới, giữ thứ tự tuần và từ chối bản dịch khi Nhật không khớp. Rà chuỗi chuẩn hóa22ký tự trên251chuỗi Nhật và131trang nguồn không có ứng viên; không thay duyệt quyền hoặc kiểm diễn đạt gần. Tổng trang từng xem trực quan trong ledger là35; không có nghĩa131trang đã duyệt. Chi tiết COACHING_DEPTH_20261102.json. Bao phủ ý nguồn đầy đủ, thời lượng người học, duyệt chuyên môn/bản ngữ/quyền vàExpo/native vẫn chưa nghiệm thu. Root cần commit/push/fetch và xác minh đúng remote trước tuyên bố lưu bền.

## Tiếp nối 2026-11-02 — vận dụng tiến độ có điều kiện

Bài010 lên revision2, giữ nguyên đoạn, prompt, hình tiến độ, ID và khóa tiến độ. Thêm một hoạt động không chấm điểm gồm ba điều kiện độc lập trên ví dụ gốc do dự án viết: kiểm vật tư tăng2→3ngày vẫn9ngày; gia công tăng4→5ngày thành10ngày; giả định hạn chế nhân lực buộc làm lần lượt thành11ngày. Giải thích rõ dùngmaxkhi song song và cộng khi làm tuần tự, không cộng dồn ba thay đổi. Có12bản dịch trực tiếp và cách đọc kana ngay sau toàn bộkanji/counter mới. Không cấp phép đổi nhân lực hoặc khởi công từ phép tính.

Đọc chữ và xem nguồnPDF49–53; nguồn131trang/hashfa094...khớp. Không tái dùng số10/6/3/5hoặc sơ đồ nguồn. Kiểm39đẳngthức từ chính nội dung Nhật và12bản dịch, adapter thực tế, bảo toàn dữ liệu cũ và từ chối overlay cũPASS. Hai hoạt động tăng chiều sâu hiện có24cặphoạtđộng–locale;252đơnvị dịch/locale,112đoạn gốc vẫn giữ. Rà252chuỗi Nhật và thêm bản bỏkana của hoạt động mới không có ứng viên22ký tự; không chứng nhận quyền hoặc ngữ nghĩa. Khôngbrowser/device hoặc đo thời lượng mới. Chi tiết SCHEDULE_REASONING_DEPTH_20261102.json; toànnguồn và cổng chuyênmôn/bảnngữ/quyền vẫn chưa nghiệmthu. Root cầncommit/push/fetch/remoteproof trước tuyênbốlưubền.

## 2026-11-02 — hai đơn vị liên tiếp012/013

012revision2 thêm so sánh hồ sơA/B/C để phân biệt có ảnh, xác định đối tượng ảnh và kết quả kiểm tra.013revision2 thêm ca phản ánh bụi, tách lời người dân, quan sát hiện trường và suy đoán nguyên nhân; không tự hứa kết quả hoặc phán định trách nhiệm. Mỗi đơn vị có12bản dịch trực tiếp vàkana; giữ toàn bộ đoạn/prompt/hình cũ vàID. Đọc vàxem nguồn56–60rồi61–66, không đưa luật/số ngưỡng mới vào bài. Cảhai đã qua actualKensetsuDayReader host48trườnghợp locale–ngày/đêm, kiểm ẩn/hiện dịch, nội dung cũ, điều kiện cuộncuối trước hoànthành và loại overlay cũ. Adapter khung/ảnh/scope được ghi rõ; khôngchứngnhận native/pixel.

Toànbộ254chuỗi Nhật vàhai bản bỏkana được so nguồn131trang không có ứng viên22ký tự; không thay duyệt quyền.112đoạn/50prompt gốc giữ nguyên; bốn hoạt động tăng chiều sâu hiện có48cặp locale,254đơnvị dịch/locale. Báo cáo DEPTH_UNITS_012_013_20261102.json vàhai reader reports. Chưa đủ mẫu số toànnguồn, duyệtchuyênmôn/bảnngữ/quyền/thời lượng/Expo-native;root phải xác minhremote.

## Tiếp nối2026-11-02 — ba đơn vị014/015/016 và chỉ mục vùng nguồn

Ba bài lên revision2, giữ ID và toàn bộ thân bài, prompt, hình, nguồn và metadata cũ. Mỗi bài thêm một hoạt động không chấm điểm có kana và12bản dịch trực tiếp đúng chuỗi Nhật:014phân biệt ba quản lý và lỗi suy từ khám sức khỏe sang môi trường an toàn;015phân biệt nhật báo với công việc thực tế còn diễn ra;016phân biệt nhắc chú ý, đề xuất ngăn tiếp xúc và bằng chứng biện pháp đã thực hiện/có hiệu quả. Không thêm ngưỡng pháp lý/y tế/kỹ thuật hay quyền cho phép thi công.

Đã lấy byteleader131trang đúnghashfa094327...; đọc chữ chính và xem toàn trangPDF67–88 theo ba nhóm67–74,75–81,82–88.26hàng đối chiếu cụ thể ghi cả phần đã có và phần chưa đóng; không coi là toàn bộ mẫu số ý của22trang. Các nhãn nhỏ/giá trị biểu đồ chưa nghiệm thu riêng. Danh mục phép đo, điều kiện pháp lý, từng loại tai nạn dùng lại từ1号và bảng chấm rủi ro tiếpPDF89vẫn mở. Báo cáoTHREE_SOURCE_BOUND_UNITS_20261102.json.

Scriptbuild-foreman-source-region-register.py tạo chỉ mục131/131trang,1.921vùng chữ/hình cóbox/hash, kèm số đối tượng vector và ứng viên liên kết bài theo trang. Chữ ruby/đầu/chân trang giữ trong nhóm hình học để phân loại tiếp; không xuất văn bản/ảnh nguồn vào kho. Đây là chỉ mục cơ học, không phải1.921ý kiến thức hay bằng chứng đủ131trang. Mẫu số kiến thức vẫnnull,wholeSourceCompletevẫnfalse.

ActualKensetsuDayReaderhostđạt72trường hợp3bài×12locale×2chế độ; ẩn dịch ban đầu, mở đúnglocale, giữ thân bài cũ, yêu cầu cuộn cuối trước hoàn thành và từ chốioverlaycũ. Đó không phảiExpo/native/pixel. Validator dữ liệu đạt28bài/112đoạn/50promptgốc/bốn sơ đồ; bảy hoạt động tăng chiều sâu hiện có84cặp locale. So257chuỗi Nhật và bản bỏkana với chữ nguồn>=10pt: không có ứng viên22ký tự; không chứng nhận quyền hoặc ngữ nghĩa. Không có duyệt chuyên môn/bản ngữ/thiết bị thật/thời lượng mới. Điều phối phảicommit/push/fetchvà xác minhremote trước tuyên bố lưu bền.


## Source coverage v2 — 2026-11-02

Áp dụng yêu cầu mới về đối chiếu từ nguồn tới app. Sổ nghiệm thu chuẩn là `docs/ssw-workspace/source-coverage-v2/construction.json`; các sổ cũ chỉ còn vai trò nguồn gốc bằng chứng. Đã xác minh lại đủ 17 PDF/604 trang danh nghĩa, 15 hash/530 trang duy nhất; text1k khác hash vẫn có source ID riêng, không tự nhập chung vì giống chữ chính. Census giữ 115.623 phần tử vật lý: 109.643 khối chữ kể cả ruby/nhãn nhỏ, 1.901 vị trí ảnh và 4.079 đối tượng vector. Chúng không phải số ý kiến thức; source text/ảnh/PDF không đưa vào Git.

Đọc và xem PDF89–100 của leader, tách 71 mục kiến thức/điều kiện/tham khảo với liên kết vùng nguồn chính xác. Chỉ 6 mục đạt bằng chứng dạy và đánh giá ở mức tự kiểm AI; 6 mục mô hình ý thức/độ tin cậy giữ bị chặn vì chưa xác minh cơ sở và phạm vi áp dụng. Những bảng điểm, quan hệ tra mức rủi ro, kỹ năng tự phát hiện nguy hiểm hoặc đầy đủ thao tác chỉ tay chưa được đóng bằng một bài cùng chủ đề. Không trang nào được nâng thành đầy đủ mọi ý, mẫu số toàn ngành vẫn mở.

Ba bài017/018/019 lên revision2, giữ nguyên toàn bộ đoạn, prompt và metadata cũ ngoài revision; thêm hoạt động độc lập có kana và 36 cặp dịch: so thang cộng/nhân với dữ kiện tự tạo; kiểm bằng chứng hiệu quả 5S, có dạy rõ mục tiêu chất lượng/năng suất/nguyên giá; kiểm bản ghi KY theo giai đoạn và giới hạn của hô khẩu hiệu. Không đưa ví dụ điểm9/24 thành quyền bắt đầu hoặc tiếp tục công việc. Actual day-reader host72 trường hợp PASS, ẩn/hiện đúng ngôn ngữ, giữ nội dung cũ, cuộn cuối trước hoàn thành và chặn overlay cũ.

Bảo toàn 112 đoạn/50 prompt cũ và mọi bản dịch cũ; 260 chuỗi Nhật được so trùng đoạn liên tiếp22ký tự với chữ nguồn chính, không có ứng viên; đây không phải duyệt quyền hoặc phát hiện mọi cách diễn đạt tương tự. Source region/element/hash gate PASS, thời lượng/chuyên môn/bản ngữ/thiết bị thật vẫn chưa đạt. Root phải lưu và xác minh remote trước khi tuyên bố bền vững.

Phạm vi trạng thái v2 được làm rõ: unknown là chưa có mapping trong các đoạn/hoạt động 職長016–019 đã rà, không phải đã chứng minh thiếu toàn app. Mười một liên kết hoạt động chỉ đủ một phần; chi tiết quản lý hạn chế ra vào chưa rõ trong đoạn đã chọn. Các ngân hàng khác chưa được quét ngữ nghĩa toàn bộ cho71mục này.


## Source coverage v2 — đợt2 từ d38397e, 2026-11-02

Tiếp ba cụm017/018/019 bằng bài áp dụng quản lý thực sự: phân loại/ưu tiên biện pháp và phân công theo dõi thay đổi; năm vai trò5S và đánh giá→cải tiến; KY→thực hiện→báo cáo kinh nghiệm suýt tai nạn. Giữ completion revision2 và112đoạn/50prompt cũ; dùng contentRevision3, mở rộng36cặp dịch và thêm36cặp caption. Hai sơ đồ gốc có bytePNG1200×720, nối trực tiếp ba ngày này qua registry thật, không phải thiết kế công trường hoặc quy chuẩn an toàn.

Sửa lỗi builder lấy nhầm hash nguồn cuối khi tra ứng viên bài. Tự xem vai trò đủ136trang cũ:28bìa/mục lục loại có lý do,108trang học còn phải đối chiếu ý. Pixel144dpi của text1k/text1l trang2–12giống nhau nhưng không nhập hai hash nguồn; chỉ phục hồi candidate. Không gọi108trang này là app thiếu kiến thức.

Page92được xem và đối chiếu lại mọi vùng, sửa bbox bốn định nghĩa vốn lệch lên sơ đồ/đoạn trước; giữ đủ chữ nhỏ/ruby, sơ đồ bốn bậc và các mũi nối. Đây là trang instructional đầu tiên có semantic inventory và các ý đủ current evidence ở mức AI. Các trang89–100khác còn mở; riêngPDF90có mâu thuẫn severity6trong bảng với mô tả重症(hạng4ởPDF89), ghi blocker chứ không tự sửa.

Canonical hiện72mục/27covered_ai/7blocked; một câu cũq18được tái dùng sau kiểm cả lựa chọn và đáp án cho hai điều kiện pháp lý/PPE, không thêm câu trùng. Ma trận1号→2号ghi rõ nền tảng dùng lại và phần trách nhiệm giám sát tăng thêm; không nhận đủ năng lực2号riêng cho ba nhánh. Nguồn toàn ngành vẫn mở, phần trămnull. Host72trường hợp kiểm cả hình mount qua registry; browserRNWebbuild đạt nhưng Chromium bịchặn socket, chưa cópixelruntime/native/Expo/thời lượng. Điều phối phải lưu và xác minhremote cho đợt này.


## Source coverage v2 — đợt3 sau959bdb2a, 2026-11-02

Đợt2đã được điều phối xác minh lưu959bdb2a8a78e0d2baf14af883aa82d444fa43d8. Tiếp đọc/xemleader101–108và111–115, thêm46đơn vị theo nguồn; canonicalhiện118mục/43covered_ai/7blocked, vẫn chưa có mẫu số đóng. Page104đủ danh mục năm nhóm/nguyên nhân và phân loại mọi phần tử, nhưng đánh giá đơn điệu còn mở nên không gọi đã bao phủ trang. Page92vẫn là một trang instructionalđủ dạy/đánh giá AI;28bìa/mục lục đã loại có lý do.

Ba cụm19/20/22nối trực tiếp reader: xử lý near-misslặp lại/kiểm thực hiện/hiệu quả/phản hồi; chọn hỗ trợ theo nguyên nhân, kiểm năng lực người mới trước giao việc và hiểu đúng bàn giao; phối hợp bản vẽ cũ/mới, câu trả lời chưa cập nhật và giao diện với chuyên môn khác. Thêm36cặp dịch hoạt động,24cặp caption, haiPNGgốc cho20/22. Giữ112đoạn/50prompt, revisiontiến độ19=2/20=1/22=1; contentRevisionlần lượt4/2/2. Tổng12hoạt động/144cặp locale và9vị trí hình/8assetgốc, chưa đủ mọi ngày.

Tìm và đọc appcũ trước khi thêm: shared379/382/383/307, q10-32/35/36. Chỉq35/q36được dùng trực tiếp cho các điều kiện khớp; không coiq32đóng mọi cách kiểm nhận diện. Hạ đánh giá đơn vị đọc specificationvềpartialvì câu chọn vật liệu không kiểm đủ yêu cầu phương pháp. Ma trận1号→2号có sáu nhóm trách nhiệm sâu hơn và exacthash, không nhận đủ2号riêng ngành.

MHLWchính thức xác minh source108không được dùng thái độ/lỗi người bị hại để biện minh nhân cách tấn công; app21đã dạy/test đúng nên tái dùng. MHLWchỉ dẫn tuổi/khả năng bản2026áp dụng01-04-2026xác nhận đánh giá theo cá nhân/khối lượng và chuyên môn y tế, không dùng bản2020đã bãi bỏ làm quy định hiện tại. Không thayPDFnguồn. Nội dung đầy đủ lưuconstruction-official-comparisons.json.

Các cờ native/domain/device/timevẫnfalse; browserchưa chạy vì blockerChromiumđã nêu đợt2. Chỉ báo đợt3đã lưu sauACKtừ điều phối.


## 2026-11-02 — bảng bản vẽ nguồn115: người lập, mục đích, người đọc

Đọc và xemtoàntrang115/in109, đặcbiệt sáuôbảng. Bài022 thêm1đoạnđộc lập vàmởrộngprompt c1, đủ12ngônngữ gắnđúngNhật. Giữ112đoạncũ, promptcũ làtiền tố vàrevisiontiếnđộ1; contentRevision3. Tổng113đoạn,50prompt. Sáuýbảng códạy/đánhgiá trực tiếp (nămý mớiđóng), construction48/118covered_ai, mẫu sốmở và7blocker giữ. Khôngđóngtoàntrang115.

Actualhostreader022 đạt24locale/ngàyđêm, đoạnNhật vàdịchđúnglocale, ẩndịch đầu, cuộncuối trước hoànthành, caption/hìnhregistry. Kiểm nguồn-v2 và authoreddata/preservation đạt. Đoạnmới sàng22ký tự chuẩnhoá trên131trang chữ>=10pt:0ứngviên, khôngchứngnhậnquyền. Hồsơconstruction-drawing115-followup-review/reader-validation.json. Khôngkiểmpixel/browser/native/chuyênmôn/bảnngữ/thờilượng. Rootcầnlưuvàxácminhremote.


## 2026-11-02 — tiếp mốcea1b43c95: thiết kế và chỉdẫn kỹthuật

Đọc toànvăn vàxemPDF111–113/in105–107. Haiđợttrongbài022: bổsung toànthể基本設計vàpromptchọn4loạibảnvẽ; bổsung phạmvi共通仕様書/lĩnhvực kỹthuật, vai trò特記仕様書trong積算vàpromptphânbiệt vậtliệu/phươngpháp/phạmvi. Haiđoạn vàhaiprompt cóphầnmới, đủ48cặptrường–locale; kana trongphầnNhật mới. Giữ113đoạn/50prompt, mọi tiền tố cũ, revisiontiếnđộ1; contentRevision4. Nguồn111ghép実施設計với施工図trongngoặc, nhưng115phânbiệt; appgiữphânbiệt đúngvai, khônggộp.

Chíný đãbiết códạy/đánhgiá hiệnhành:57/118covered_ai,7blocker/mẫu sốmởgiữ. Khôngđóngtoàntrang hoặc2号riêngngành. Actualreader022đạt24locale/ngàyđêm, đúngmọiđoạn/promptdịch, ẩndịch đầu, cuộncuối/hoànthành, captionhình. Sàng268chuỗiNhật hiệnhành với131trang chữ>=10pt, bỏinlinekana:0ứngviên22kýtự, khôngchứngnhậnquyền. Source-v2/authoredpreservation đạt; khôngpixel/native/chuyênmôn/bảnngữ/thờilượng. Rootlưuvàxácminhremote.
