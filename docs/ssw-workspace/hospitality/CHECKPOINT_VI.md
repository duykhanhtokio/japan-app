# Đối chiếu nguồn độc lập — cập nhật tiếp ngày 01/11/2026

Đã bổ sung từ nguồn; **chưa đóng toàn bộ từng ý của 117 trang**. Mốc mới là 379 ý có bằng chứng AI trên 94 trang kiến thức, 38 ngày học và 290 câu hỏi. Có 637 liên kết nguồn trong sổ cũ; không dùng chúng làm mẫu số kiến thức. Chưa dịch mới trước khi chốt tiếng Nhật.

## Kết quả thực tế

- Kiểm kê độc lập toàn bộ 117 trang từ hai PDF đúng hash: 4.047 khối chữ native, gồm chữ nhỏ, furigana, số và nhãn. Mỗi khối có ID, trang, tọa độ, hash và trạng thái. Hình raster và các nét vẽ vector được kiểm kê riêng. Đây là đơn vị bố cục, **không phải 4.047 ý kiến thức**. Chưa đánh dấu nghiệm thu ý nghĩa hàng loạt.
- Đầu vào `source-fragments-authoring.json` được hợp vào **sổ chuẩn knowledge-ledger.json, schema 3**. Các khối lặp có số lần xuất hiện; không tự loại vì trùng. Giữ lý do loại 23 trang ngoài phạm vi kiến thức. Không đóng độ bao phủ từ số trang đã kiểm kê.
- Bổ sung 10 ý chi tiết: lý do người phụ trách vắng mặt; khung giờ sử dụng phòng; ngoại lệ trứng/sữa trong mục chứng nhận của tài liệu năm 2024; nguyên liệu động vật không phải heo; khuyên khách đi khám và phân biệt với thông báo cấp cứu; lưới/băng buộc tóc; lưu ý về trang trí móng; thuật ngữ Hospitality; xu hướng bố trí concierge theo quy mô; ý nghĩa của inbound đối với kinh tế địa phương và giao lưu văn hóa. Mỗi ý mới có vị trí khối nguồn/hash, trạng thái trước, đoạn dạy, câu hỏi và revision. Ngoại lệ trứng/sữa không được diễn giải thành bảo đảm halal cho mọi món.
- Bổ sung tiếng Nhật vào chín bài, thêm 14 câu hỏi, giữ toàn bộ ID cũ. Sửa bốn nhóm liên kết kiểm tra quá rộng: vệ sinh định kỳ; phòng cháy và đường thoát nạn; ba loại hình kinh doanh; vị trí **và** cách dùng các thiết bị an toàn. Bằng chứng câu hỏi cũ được giữ trong `assessmentRepairHistory`.
- Thân bài Nhật đạt 35.675 ký tự. Đã dựng lại furigana đúng revision cho 38 bài và hai bài tổng hợp: 3.058 lượt văn bản, 25.831 lượt đoạn kanji. Đây chưa phải chứng nhận duyệt cách đọc/ngữ nghĩa bởi người bản ngữ.
- Bản dịch hợp lệ: 32/456 cặp; 207 cặp cũ và 217 cặp chưa có. Năm cặp vừa trở nên cũ do câu hỏi Nhật của safety01 được bổ sung. Không hợp thức hóa chúng bằng cách chỉ đổi `sourceRevision`.
- Các kiểm tra cấu trúc, ý nguồn, khối chữ nguồn, furigana, bộ nạp và trạng thái học đều PASS. Kết quả web mới ở `source-remediation-browser-qa-20261101.json`; không phải Expo/native hoặc thiết bị thật.

Hồ sơ thay đổi: `source-remediation-20261101-evidence.json` và `source-remediation-extra-20261101-evidence.json`. Công cụ index/check-source-fragments cần PDF đúng hash bên ngoài repository; không đưa OCR, PDF hoặc hình nguồn vào ứng dụng. Script áp dụng từ chối thực hiện lại các ID đã có.

Còn tiếp tục: rà ý nghĩa từng đoạn, bảng, hình chưa được giải quyết; tách các ý gộp và sửa câu hỏi gán quá rộng; sau đó chốt tiếng Nhật theo nhóm và cập nhật bản dịch. Chưa tuyên bố bao phủ tuyệt đối mọi ý hoặc hoàn thiện ngành.

---

# Checkpoint mới nhất —2026-11-01, Asia/Tokyo

Phạm vi yêu cầu mới: đối chiếu từng ý117trang, bổ sung Nhật/câu/hình,12ngôn ngữ/furigana, rà khối lượng và ngữ nghĩa. **Chưa hoàn tất toàn bộ yêu cầu.** Số liệu dưới đây thay thế snapshot cũ; các đoạn lịch sử phía sau được giữ để truy vết.

- Đã xác minh đúng byte/hash của hai PDF52+65trang. Hồ sơ `editorial-review-20261101.json` ghi từng trang, hash văn bản trích xuất, phân loại94trang kiến thức/23trang khác và các sourceAtom liên quan. Đây là kiểm kê và bằng chứng hiện tại, không biến369ýAI-candidate thành nghiệm thu không còn thiếu ý. Bằng chứng trực quan nguồn2026-10-31 được dẫn rõ là lịch sử, không nhận là mới xem lại117hình trong phiên này.
-38ngày,276câu độc lập; giữ tất cảIDcũ. Thêm3câu riêng kiểm tra đồng phục, móng tay, biểu cảm; sửa các liên kết assessment tương ứng. Bổ sung một tình huống đọc sơ đồ A/B và1câu vận dụng cho service04. Phần Nhật cũ giữ nguyên; không tăng độ dài bằng diễn đạt lặp.
-Service04 từ554→835ký tự thân bài,3→4câu. Tình huống phân biệt mong muốn gần cửa với yên tĩnh phía trong, yêu cầu xác minh ghế/lối đi; không dạy kỹ thuật trợ giúp cơ thể hoặc quy chuẩn ghế chung. Thay hình khái quát bằng ba tình huống không gian cụ thể, caption/alt khớp; đã xemPNG mới và contact sheet38ảnh.
-Service04 đã có đủ12bản dịch đúngrevision, gồm6bản đầy đủ mới hi/bn/ne/my/th/km và12delta nội dung bổ sung. Giữ nguyên thuật ngữ/cách đọcNhật,IDvà vị trí đáp án. Toàn ngành37/456cặp hợp lệ, còn419cặp thiếu/đãcũ;202cặp cũ tiếp tục bị chặn. Không nângrevision bản dịch cũ nếu chưa dịch phần thay đổi.
-Furigana ngoại tuyến cho38bài và2bài tổng hợp:2.976lượt văn bản,24.773lượt đoạnkanji có cách đọc, không có đoạnkanji bị bỏ đọc trong phạm vi bộkiểmtra. Dữ liệu tải theo nhóm, khoảng780KB; tokenizer không đưa vàoapp. Sửa các mặc định sai theo ngữ cảnh như一日、室、乳、鏡、四本、二本、何. Trình đọc có nút bật/tắt, áp dụng phần thân/mục tiêu/thuậtngữ/vídụ/thựchành/câu hỏi/lựa chọn/giải thích. Đây vẫn là ứng viên đọc từ từđiển có hiệuđínhAI, chưa duyệt bảnngữ toànbộ.
- Khối lượng thân bài thực tế:34.147ký tự, nhỏ nhất584, trung vị835, lớn nhất2.097. Thống kê riêng từng ngày/track, mục tiêu, ví dụ, thực hành, câu hỏi và ảnh. Không suy25phút từ số chữ. Ngày safety07 dài hơn rõ rệt và vẫn cần đo thời gian người học; chưa đánh dấu lịch đã cân bằng hoàn toàn hoặc durationMeasured=true.
- Check cấu trúc/nguồn/bản dịch hiện có/loader/state/furigana PASS. Kiểm thửbrowser riêng dùng reader thật, adapter nền tảng; bằng chứng mới nằm ở `browser-qa-20261101.json`. Không phải Expo/native hay thiết bị thật.

Việc còn phải làm: nghiệm thu độc lập mức chia từng ý nguồn và ngữ nghĩa;419cặp dịch; duyệt ngữ cảnhfurigana toànbộ; nhãn trongảnh/alt theo ngônngữ và đánh giá ngữ nghĩa ảnh sâu hơn; đo thời gian/cân đối ngày thực tế. Các cờ expert/native/device và allSourceKnowledgeCovered vẫnfalse. Không gọi hoàn thiện toàn ngành.

Công cụ tái lập: `build-readings.py` cần fugashi1.5.2 và unidic-lite1.0.8; `check-readings.cjs` kiểm tra căn chỉnh/revision/kanji. Hai script bổ sung service04 là thao tác migration đã áp dụng một lần; không dùng để ghi đè chỉnh sửa về sau. Nguồn PDF và render chỉ dùng đối chiếu, không phân phối trongapp.

---

# Tiến độ khách sạn —2026-10-31

## Phạm vi đã triển khai

- Hai nguồn Nhật52+65=117trang; đã rà văn bản và trực quan117/117. 94trang thuộc phạm vi kiến thức, các trang khác có lý do phân loại riêng trong page-audit.json.
-38ngày học;475IDlegacy;622liên kết kiến thức–nguồn. Bộ nguồn độc lập mới có369ýđược đối chiếu riêng, không cộng với IDlegacy để suy ra tổng ý nguồn. Đây là bằng chứng biên soạn AI, không phải nghiệm thu chuyên gia hay chứng nhận không còn thiếu ý.
-272câu kiểm tra độc lập và2bài tổng hợp25câu/cấp (chọn lại từ ngân hàng đã dạy, không tính thêm thành câu mới). Không tuyên bố cấu trúc đề thi chính thức.
-38PNG tự dựng có byte thật, đăng ký theo ngày. Đã kiểm tra contact sheet; trình đọc có nút phóng to. Chưa duyệt chuyên môn hình ảnh.
-Tích hợp thẻKhách sạn→route riêng→chọn1号/2号→bài/ngày→kiểm tra→nộp→giải thích→hoàn thành; chế độ nội bộ __DEV__, chưa mở phát hành.
-Tiếng Nhật trước, bản dịch bámrevision. Snapshot hiện có31/456cặp bài–ngôn ngữ hợp lệ;202cặp đã cũ sau sửa Nhật; chi tiết ở translation-status.json. Dịch AI chưa duyệt bản ngữ.

## Bằng chứng kiểm tra

-Check cấu trúc bài/câu/ảnh/ledger PASS; state restoration, tách người học, táchrevision, lưu lịch sửrevision và route nội bộ PASS.
-TypeScript phần mới PASS với adapter khai báo cho nền tảng/giao diện dùng chung; đây không phải typecheck toànrepository.
-Web harness dùng trình đọc và dữ liệu thật, adapter Royal/header/safe-area/localStorage:38bài,12trường hợp responsive và27cặp dịch lấy mẫu PASS; kiểm tra giữ kín đáp án, hoàn thành/khôi phục, lỗi ghi dữ liệu và bài tổng hợp25câu PASS. Không phải Expo/native hoặc thiết bị thật.
-JLPT UI lock PASS10/10; giữ toàn bộ UI đã khóa.

## Chưa đạt / không được gọi hoàn thiện toàn ngành

1. Hoàn tất12ngôn ngữ cho mọi bài/câu/ảnh và kiểm tra đầy đủ sau dịch; các nhóm vẫn đang thực hiện.
2. Duyệt ngữ nghĩa chuyên môn/bản ngữ, furigana toàn thân bài và phát âm/âm thanh nếu phát hành. Hiện mới có cách đọc tên bài và thuật ngữ, chưa có ruby toàn bộ câu.
3. Kiểm tra từng nội dung ảnh với toàn bộ alt/caption. Một số hình là sơ đồ quá trình khái quát, chưa đủ minh họa mọi chi tiết trong bài.
4. Đo thời lượng học thật;25phút/ngày là dự kiến, không phải bằng chứng đã cân bằng theo thời gian.
5. Full typecheck đã thất bại doV8 hết bộ nhớ khoảng2GB. Expo iOS export --no-bytecode --max-workers2 bị hệ thống kill exit137 khi Metro đang xử lý toànapp (chưa hoàn tất). Không ghi build iOS PASS; Android/native/thiết bị thật chưa kiểm tra.
6. Nghiệm thu độ bao phủ từng ý còn là AI-candidate: có source/page/section/question liên kết, không đóng toàn trang chỉ vì có chủ đề gần nhau. Các điều kiện luật, quyền sử dụng và sai khác nguồn có hồ sơ; chưa có chứng nhận pháp lý hoặc quyền toàn bộ tài liệu.
7. Nội dung giao diện riêng và phần tổng hợp vẫn cần hoàn thiện dịch nhất quán; không tính các nhãn Nhật còn lại là đã dịch.

## Tiếp tục

Giữ ID bài/câu vàrevision; không tạo lại phần đã có. Hoàn tất locale thiếu theo translation-status.json, chạy build.cjs để đồng bộ registry/ledger/daily-workload, build-mocks.cjs sau khi Nhật thay đổi, check.cjs +check-translations.cjs --require-complete. Sau đó chạy browser harness toàn bộ cặp dịch, tiếp tục kiểm tra Expo/thiết bị thật trong môi trường đủ tài nguyên.

Git làm việc tại nhánh feature/hospitality-20261031 từ74df35d91. GitCLI không có thông tin đăng nhập push; sử dụng GitHub connector để lưu snapshot, không bắt người dùng làm thao tácGit lặp lại. Chỉ công bố SHA sau khi tạo commit/ref và xác minh remote.

## Tiếp tục — sửa tải bản dịch và bổ sung lễ tân

- Kiểm kê trực tiếp trước sửa:213/456cặp, khác snapshot197cặp cũ. Có file `ne/front` (4bài) và `tl/restaurant` (9bài) nhưng loader chưa đăng ký, nên13bản dịch không truy cập được từ trình đọc. Đã chạy build để đồng bộ loader, sổ đối chiếu và khối lượng học.
- Bổ sung Tagalog đầy đủ cho hotel-front-07 và hotel-front-08: mục tiêu, nội dung, thuật ngữ, ví dụ, thực hành,11câu hỏi có giải thích và caption/alt. Giữ ID, đáp án vàsourceRevision; translated_ai_unreviewed. Tagalog lễ tân đạt8/8, tổng Tagalog23/38; toàn bộ215/456, còn241cặp.
- Validator nay từ chối file dịch có thật nhưng không được đăng ký trong loader; cũng kiểm tra key/path khớp và loader không trỏ tới file thiếu.
- Bằng chứng phiên: check.cjs PASS38bài/166câu/621liên kết/117trang; check-translations.cjs PASS phần hiện có, complete=false; kiểm thử trực tiếp bộ nạp215/215 và từ chối revision cũ; kiểm thử hồi quy bỏ đăng ký tl/restaurant bị validator chặn đúng. git diff --check PASS.
- Không chạy lại Expo/native. check-state.cjs chưa chạy được ở workspace mới vì thiếu esbuild; kết quả PASS ở phiên trước giữ là bằng chứng lịch sử, không nhận là kiểm thử mới. Nghiệm thu chuyên môn/bản ngữ/thiết bị và các thiếu sót đã nêu vẫn còn.

## Tiếp tục — hoàn tất nhóm ăn uống cho hai locale Trung

- Thêm đầy đủ9bài restaurant cho zh-CN và9bài cho zh-TW:18cặp bài–ngôn ngữ,72đoạn nội dung,72câu hỏi kèm giải thích và18cặp caption/alt, cùng mục tiêu, thuật ngữ, ví dụ và thực hành. Không đổi nội dung Nhật, ID, đáp án hoặc sourceRevision.
- Trung giản thể và phồn thể đều38/38bài. Tổng mới233/456cặp (51,1%), còn223cặp. Năm locale đủ số bài:en,vi,id,zh-CN,zh-TW; đây là độ đầy đủ dữ liệu, không phải chứng nhận bản ngữ/chuyên môn.
- Bản phồn thể chuyển phần văn xuôi bằng OpenCC rồi hiệu đính AI các cách dùng như菜單,數據và tên giống nho. Giữ nguyên thuật ngữ/cách đọc tiếng Nhật; hồ sơ và hash tại zh-restaurant-translation-evidence.json.
- Đồng bộ loader/ledger/daily-workload. Thêm check-translation-loaders.cjs chạy chính hàm nạp trong app, kiểm233cặp tải đúng,223cặp thiếu trảnull, revision cũ và locale không hỗ trợ trảnull. Không có fallback được tính thành bản dịch.
- Check cấu trúc38bài/166câu/621liên kết/117trang PASS; check bản dịch hiện có PASS, complete=false; kiểm tra đủ bốn lựa chọn khác nhau, ID/đáp án/revision và thuật ngữ Nhật được giữ nguyên. git diff --check PASS.
- Chưa chạy lại browser/Expo/native hoặc đo thời gian học. Toàn bộ bản dịch mới translated_ai_unreviewed; các thiếu sót nghiệm thu và nội dung đã liệt kê phía trên vẫn còn.

## Cảnh báo độ bao phủ — tái kiểm tra theo phản ánh người dùng

- Ưu tiên chuyển từ mở rộng dịch sang kiểm tra nguồn độc lập và bổ sung Nhật. Không dùng233/456(51,1%) làm tỷ lệ bao phủ kiến thức: đó chỉ là số cặp dịch hiện có.
- Đo lại38phần thân bài:30.559ký tự Nhật, tối thiểu554, trung vị780, tối đa1.203ký tự/ngày; chưa tính mục tiêu/thuật ngữ/ví dụ/thực hành/câu hỏi.25phút chưa đo. Số ký tự thấp là dấu hiệu cần kiểm tra, không tự suy ra phần trăm thiếu.
- Sổ có621liên kết nguồn,474ID,361chuỗi tóm tắt khác nhau. Cấp độ chia ý không đồng nhất;73dòng dùng tóm tắt dài trên100ký tự, có dòng lặp nguyên đoạn tự soạn. Vì vậy chưa có mẫu số đơn vị nguồn độc lập để chốt%phủ.
- Hồ sơSOURCE_COVERAGE_RECHECK_20261031.json ghi5phát hiện có bằng chứng, gồm thiếu kiểm tra thoát nạn hai hướng(2号tr59), lược chi tiết giám sát/bảo trì báo cháy(2号tr60), câu hỏi chắn cửa chống cháy gắn nhầm cho năng lực diễn tập/bảo trì, chi tiết báo tình trạng người bệnh chưa rõ(2号tr59), và định nghĩa twin chủ yếu xuất hiện trong đáp án thay vì đoạn dạy(1号tr7).
- Đây là rà mục tiêu, không phải nghiệm thu mới117/117trang. Không sửa hàng loạt trạng thái thànhcovered. Các sửa đổi liên quan quy định/an toàn phải giữ đúng điều kiện hiện hành; không khôi phục máy móc sai khác của nguồn2024.
- Bước kế tiếp: lập nguyên tử nguồn từ câu/bullet/bảng/hình của PDF trước, rồi liên kết bằng chứng dạy và kiểm tra riêng. Giữ ID học viên; mọi thay đổiNhật cần revision mới và cập nhật lại các bản dịch tương ứng.

## Bổ sung Nhật theo ý nguồn — đợt1

Chỉ thị mới: đối chiếu từng ý nguồn và bổ sung Nhật trước khi dịch tiếp. Chưa dịch mới trong đợt này.

- Sổ chuẩn knowledge-ledger.json đã lênschema2: giữ nguyên unitslegacy và bổ sung sourceAtoms độc lập từ nguồn. source-atoms-authoring.json chỉ là đầu vào tác giả.76ýnguồn,15trang có đối chiếu (13trang chương an toàn/vệ sinh/cơ sở/môi trường của hai cấp +1号tr7/2号tr11). Mỗi ý cósource/page/hash, trạng thái trước, câu bằng chứng trong đoạn dạy, snapshotcâu hỏi/đáp án đúng vàrevision đã rà. Không đánh dấu toàn trang hay toàn117trang đã đủ ý.
- Sửa6bàiNhật:front01,safety02,04,05,07,08. Thêm25câu kiểm tra, tổng191câu; giữ toàn bộIDcũ. Bổ sung rõsingle/twin trước câu hỏi, thông tin người bệnh khi119, hai hướng thoát nạn, ba loại diễn tập, giám sát/bảo trì báo cháy, trình tự xử lý吐物và tên薬剤, ví dụ nguyên nhân食中毒. Thêm câu kiểm tra thực sự cho các năng lực vệ sinh/cơ sở/môi trường trước đó thiếu.
- Sửa liên kết sai: câu chắn cửa chống cháy không còn là bằng chứng cho tần suất diễn tập và giám sát/bảo trì. Có câu hỏi riêng cho diễn tập, giám sát, xử lý警報và可燃物.
- Hìnhsafety07đã thay bằng sơ đồ kiểm soát được về hai hướng thoát nạn và bàn giao giám sát. Đã xemPNGđể kiểm tra nhãn/vịtrí; không nhận là testtrong trình đọc hay thiết bị thật.
- Giữ ghi chú khác biệt nguồn2024với hướng dẫn chính thức: không áp tần suấtthông báo đồng nhất; không phục hồi chỉ dẫn tiếp tục chữa cháy sau khi lửa lên trần; không áp nhiệt độ/tình trạng thể chất một cách phổ quát; không chép nguyên trình tự xử lý吐物rút gọn. Nguồn chính thức bổ trợ ghi trongsourceAudit.
-199cặp dịch còn hợp lệ;34cặp cũ bịloaderchặn đúngrevision,223cặp chưa có. Không xóa filedịch, không tự sửa sourceRevision để biến bản cũ thành hợp lệ.
- Check cấu trúcPASS38bài/191câu/622liên kết;source-atomsPASS76bằng chứngvàsnapshotcâu hỏi;loaderPASS199hợp lệvà257thiếu/đãcũ trảnull. Tiếp tục giữdomain/native/device=falsevàdurationMeasured=false.
- Phạm vi chưa xong:79trang kiến thức ngoài15trang đợt này chưa được đối chiếu lại theo sổ nguyên tử;15trang đã làm cũng chưa được nghiệm thu chuyên gia hoặc chứng nhận mẫu số đầy đủ tuyệt đối.23trang điều hướng/xuất bản giữ phân loại cũ để rà kiểm kê, không tính là kiến thức đã dạy. Tiếp tục chương lễ tân từsource1tr5/2tr8 và các phần chưa đối chiếu, rồi企画/広報、接客、飲食。 Không dịch tiếp trước khiNhậtổn định.

## Đợt2 — chương lễ tân

- Đối chiếu thêm73ýcủa hai chương lễ tân, cộng149ý/41trang có bằng chứng nguồn. Thêm10câuNhật, tổng201câu.76ýđợt1giữ nguyên bằng chứng, không tạo lại.
- Bổ sung ví dụ giờcheck-in/outcủa nguồn dưới đúng điều kiện không phải quy định toàn quốc; thêm tênキャッシャーvà宿泊台帳. Thêm câu hỏi cho các trường thông tin đặt phòng/no-show, vai tròドアマン・仲居・レストラン, thứ tự明細/領収書, thuế theo điều kiện, riêng tưVIPvà bảo quản忘れ物. Không tự bịa thời hạn pháp lý cho đồ thất lạc.
- CanonicalsourceAtomsgiữ trạng thái trước/sau vàreviewedLessonRevision;check-source-atomsPASS149bằng chứng/snapshotcâu hỏi. Checkcấu trúcPASS38bài/201câu;148bản dịch còn hợp lệ,85bản cũ bị chặn,223bản chưa có. Không dịch mới.
-41trang có ý được đối chiếu không có nghĩa đã nghiệm thu đầy đủ mọi ý hoặc mọi hình. Tiếp tục các phần企画/広報、接客、飲食và mở đầu旅館業法; không tuyên bố xong117trang.

## Đợt3 — mở rộng rà toàn bộ các chương kiến thức, giữ trạng thái nghiệm thu trung thực

- SổsourceAtomshiện369ýđộc lập, cóliên kếtđến94trang kiến thức của haiPDF.23trang điều hướng/xuất bản có lý do loại riêng. Đây là đối chiếu AI ở cấp đoạn/bullet/thuật ngữ, không phải chứng nhận mẫu số không còn một ý nào thiếu; allPageIdeasAccepted và allSourceKnowledgeCovered vẫnfalse.
- Thêm71câuNhật so vớiđợt2; tổng272câu, tăng106so với166banđầu. Trongtoànphiên32/38bài córevisionmới (có bài chỉ thêm kiểmtra). Giữ tất cảIDbài/câu cũ và lịch sửrevision; không tăng thời lượng bằng việc lặp nội dung. Phần thân bài tăng từ30.559lên33.866ký tựNhật, chưa tínhthuật ngữ/tình huống/thực hành/câu hỏi. Đây không phải bằng chứng25phút.
- Bổ sung cụ thể: tênレセプション/リザベーション係; ví dụ企画,計算手数料và tiềnデポジット; câu xin lỗi/gọi đáp; kiểmtra các loại敬語・おじぎ・姿勢・電話・対応;バタースプレッダー; mối liên hệ nguyên liệu/dị ứng,八品目nguồn2024và thay đổiカシューナッツ2026theo消費者庁; ví dụ mùa đôngノロvẫn đi kèm vệsinh cả năm; các chi tiết giữ sạch/các bước chuẩn bị bàn và quảnlýF＆B.
- Không dùng câu hỏi gầnchủđề làm bằng chứng: đã chỉnh riêng liên kết cho truyềnthông/ưuđãi/chi phí, câu chào/đáp/chuẩnbị điệnthoại/cúp máy, cáchbàybàn/cầm dụngcụ, dịứng, phạmvi quảnlývà luật. Snapshotcâu hỏi/đápán được gắn với từngý vàrevisionNhật đã rà. Cần duyệtngữnghĩa chuyênmôn/bảnngữ độc lập; testmáy chỉ xác minh liên kết vànội dung snapshot.
- Đã mở thêm hình nguồn1号tr31/40,2号tr37/51 để đối chiếu gócおじぎ, tưthế và bốtrí/tiếntrình mónNhật/Tây; hồsơsourceFigureDetailRechecks nằm trongsổ chuẩn. Không đưa ảnh nguồn vào app.
- Ngừng dịch mới:31cặp còn đúngrevision,202cặp cầncậpnhật,223cặp chưa có. Các bản cũ vẫn được giữ và bị bộnạp chặn. Không đổi sourceRevision để hợp thức hóa bảncũ.
- ChecksourceAtomsPASS369/94; cấu trúcPASS38bài/272câu/622liênkếtlegacy; loaderPASS31cặphợp lệ,425cặpthiếu/đãcũ trảnull. Chỉ sốlegacy475IDkhông được sử dụng làm mẫu số nghiệmthu; canonicalledgerđánh dấu rõlegacyCoverageIsNotAcceptance.
- Còn điều kiện nghiệmthu ngoài khả năng checkmáy: chuyênmôn/bảnngữ, độđủ từng hình/ý độc lập, furigana toàn bài, thời gian họcđãđo, fullExpo/nativevà thiếtbịthật. NộidungNhật đã được bổ sung/rà theo AI, chưa được gọi là phát hành hoànthiện hay chứng nhận khôngthiếuý.
