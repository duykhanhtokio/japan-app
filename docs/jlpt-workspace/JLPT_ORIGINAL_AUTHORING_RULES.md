# HƯỚNG DẪN BẮT BUỘC — SOẠN NỘI DUNG JLPT MỚI CHO JAPAN APP

Phiên bản 2 — yêu cầu tổng hợp của nhà phát hành, ngày 06/10/2026.

## 1. Phạm vi và thứ tự bắt buộc đọc

AI phải đọc toàn bộ tài liệu này trước khi tạo hoặc sửa câu hỏi, bài đọc, kịch bản nghe, lựa chọn, đáp án, hình minh họa hoặc audio JLPT mới. Không chỉ đọc tiêu đề hoặc bản tóm tắt. Sau đó đọc `JLPT_LEVEL_BLUEPRINTS.md`, `src/data/jlpt-original/authoring-blueprints.json`, checkpoint hiện hành, cấu hình giọng, master và QA của đúng đề đang làm.

Repository: `duykhanhtokio/japan-app`. Nhánh: `recovery/jlpt-n3-n1`.

Thứ tự: `docs/AI_SESSION_START_HERE.md` → `AGENTS.md` → tài liệu này → `JLPT_ORIGINAL_AUTHORING_CHECKPOINT.md` → quy tắc khóa UI và bản khóa mới nhất → dữ liệu/checkpoint của đề đang xử lý. Quy định biên soạn mới này thay thế quy trình phục hồi/chép đề gốc đối với công việc hiện tại. Không tự chạy vòng phục hồi đề cũ.

Yêu cầu trực tiếp mới nhất của người dùng có ưu tiên cao hơn tài liệu. Khi có mâu thuẫn hoặc chưa rõ, nêu chính xác và xác nhận; không suy đoán thành quyết định của người dùng.

## 2. Mục tiêu, quy mô và trách nhiệm

- Soạn đề mô phỏng độc lập cho N5–N1, có mục tiêu đo thời gian và luyện theo cấu trúc thi.
- Quyết định mới nhất: **tạo trước 6 đề mỗi cấp N5–N1, tổng 30 đề**. Mục tiêu 20 đề/cấp trước đây chỉ là hướng mở rộng tương lai, không phải khối lượng của đợt này.
- Triển khai lần lượt N5 đề 01–06, N4 đề 01–06, N3 đề 01–06, N2 đề 01–06, N1 đề 01–06. Hoàn thành và lưu bền vững từng đề trước khi sang đề kế tiếp. Không chờ người dùng duyệt bản nháp giữa các bước hoặc trước đề 02.
- Nhà phát hành/người quyết định cuối cùng: người dùng. Không diễn giải việc chọn giọng hoặc yêu cầu tiếp tục thành duyệt toàn bộ học thuật, quyền sử dụng hay bản phát hành.
- **Soạn bộ hoàn chỉnh dùng để làm bài và tích hợp luôn đủ câu hỏi, hình, audio, chấm điểm và kết quả**. Không dừng ở kịch bản hoặc tài nguyên nháp. Người dùng tự mở từng đề trên app để kiểm tra sau khi hoàn thành, sai đâu sửa đó. “Chính thức” ở đây là phiên bản hoàn chỉnh của Japan App, không phải đề thi chính thức của tổ chức JLPT.
- Lưu provenance AI biên soạn và trạng thái kiểm duyệt trung thực trong dữ liệu nội bộ; không dùng gate duyệt bản nháp để chặn triển khai đã được cho phép. Trước kiểm tra của người dùng, publisherReviewed vẫn false. Không tự nhận đề được tổ chức JLPT chứng nhận.

## 3. Nguyên tắc soạn mới và giới hạn tham khảo

Toàn bộ nội dung JLPT cũ lấy từ đề gốc; không được dùng làm nội dung sản xuất mới. Chỉ lấy bố cục, số câu, dạng kỹ năng, mức độ kiến thức và đặc điểm tổ chức bài làm làm căn cứ.

Không lấy câu hỏi, phương án trả lời, đáp án, đoạn đọc, lời thoại, bản ghi âm hoặc hình minh họa cũ. Không dịch/paraphrase hoặc giữ logic cũ rồi đổi tên, số tiền, địa điểm, thời gian, từ đồng nghĩa hay trật tự từ. Không biến một câu cũ thành bộ khung để viết lại từng câu tương ứng.

Mỗi câu mới phải xuất phát từ mục tiêu học tập và tình huống được nghĩ độc lập, có dữ kiện, quan hệ nhân vật, nhiệm vụ, hướng suy luận và phương án nhiễu riêng. Các chủ đề thông dụng có thể xuất hiện, nhưng không lấy sự thông dụng làm lý do để giữ cách diễn đạt hoặc chuỗi dữ kiện đặc thù của đề cũ.

Chia tham khảo thành hai luồng:

1. **Luồng cấu trúc:** chỉ xuất số lượng, thứ tự dạng bài, số lựa chọn, đặc điểm hiển thị.
2. **Luồng nhịp nghe:** chỉ xuất thống kê thời lượng, tốc độ tham chiếu, điểm chuyển dạng, hướng dẫn/ví dụ, thời gian xem hình, đọc lựa chọn, trả lời và khoảng nghỉ. Không xuất nội dung lời thoại, đáp án hoặc audio mẫu sang đầu vào tạo nội dung mới; không chép các khoảng audio/âm báo cũ vào bản mới.

Không tự so sánh nội dung câu mới với câu cũ trong phiên biên soạn. Nếu cần kiểm tra tương đồng ngoài ý muốn, phải xác nhận trước mục đích/phạm vi và tách thành bước kiểm tra, không dùng kết quả để tái tạo câu gốc. Không đưa phần trăm tương đồng hoặc cam kết an toàn bản quyền khi chưa có căn cứ đo/kiểm tra phù hợp.

## 4. Chuẩn cấu trúc triển khai toàn bộ N5–N1

Bảng N5 dưới đây và các bảng N4–N1 trong `JLPT_LEVEL_BLUEPRINTS.md` là một bộ hướng dẫn chung. Metadata máy đọc: `src/data/jlpt-original/authoring-blueprints.json`. Dùng 第3回 hiện có của từng cấp làm chuẩn cấu trúc; sáu đề mới cùng cấp giữ nguyên blueprint đó. Chỉ đọc metadata, không dùng nội dung câu gốc.

Mẫu cấu trúc N5 đã chọn: N5「第３回」hiện tại, ID `n5-2013-07-exam-03`. Giữ số câu từng dạng, không chỉ giữ tổng số câu. Đây là chuẩn của dự án, không tự tuyên bố mọi kỳ thi hiện hành có cùng số câu.

| Phần | Dạng | Số câu | Kỹ năng |
|---|---:|---:|---|
| Từ vựng | 1 | 12 | Đọc chữ Hán |
| Từ vựng | 2 | 8 | Chọn cách viết |
| Từ vựng | 3 | 10 | Từ vựng theo ngữ cảnh |
| Từ vựng | 4 | 5 | Diễn đạt tương đương |
| Ngữ pháp/đọc | 1 | 16 | Chọn ngữ pháp |
| Ngữ pháp/đọc | 2 | 5 | Sắp xếp câu |
| Ngữ pháp/đọc | 3 | 5 | Ngữ pháp trong văn bản |
| Ngữ pháp/đọc | 4 | 3 | Đọc ngắn |
| Ngữ pháp/đọc | 5 | 2 | Đọc vừa |
| Ngữ pháp/đọc | 6 | 1 | Tìm thông tin |
| Nghe | 1 | 7 | Hiểu nhiệm vụ |
| Nghe | 2 | 6 | Nắm thông tin chính |
| Nghe | 3 | 5 | Phát ngôn theo tình huống |
| Nghe | 4 | 6 | Phản hồi nhanh |

Tổng: 35 từ vựng + 32 ngữ pháp/đọc + 24 nghe = **91 câu**. Câu viết có 4 lựa chọn; nghe dạng 1/2/3/4 lần lượt có **4/4/3/3** lựa chọn. Không áp số câu 120 từ yêu cầu phân bố đáp án trước đây vào đề 91 câu này.

Bố cục chi tiết, đánh số 問題, số câu, số lựa chọn và mô tả kỹ năng cho **từng cấp N5–N1** đã chốt trong `JLPT_LEVEL_BLUEPRINTS.md`; không hỏi lại chuẩn cấp khác, không tự áp bảng N5 cho N4–N1. Tổng số câu chấm điểm lần lượt: N5 91, N4 98, N3 102, N2 106, N1 106. Nếu dữ liệu tham chiếu cấu trúc bị hỏng hoặc kiểm tra metadata cho thấy mâu thuẫn thật, báo đúng mâu thuẫn; không dùng nội dung cũ để giải quyết.

## 5. Tiêu chuẩn học thuật cho từng câu

- Tiếng Nhật tự nhiên; từ vựng, chữ Hán, ngữ pháp, chiều dài và lượng thông tin phù hợp cấp độ.
- Mỗi câu có đúng một đáp án tốt nhất, được suy ra từ dữ kiện thực sự có trong đề.
- Phương án nhiễu cùng loại, hợp lý, phản ánh hiểu nhầm có thể xảy ra; không cố tình tạo câu vô nghĩa để lộ đáp án.
- Không lộ đáp án qua chiều dài, độ lịch sự, chữ viết, cách dùng dấu câu, mức độ chi tiết hoặc kiểu diễn đạt nhất quán riêng của đáp án đúng.
- Câu sắp xếp phải có nghiệm đã kiểm chứng; vị trí dấu sao, thứ tự mảnh và đáp án thống nhất.
- Bài đọc có logic, dữ kiện và tham chiếu đầy đủ; câu hỏi chỉ dùng thông tin người làm bài được cung cấp.
- Kịch bản nghe phải có lý do tự nhiên để các nhân vật nói, hỏi, sửa ý hoặc ra quyết định; không thêm thông tin vô dụng chỉ để kéo dài.
- Lưu mục tiêu kiểm tra, đáp án và lý do đúng/sai của mỗi phương án để kiểm duyệt nội bộ. Không đưa lý do hoặc transcript vào giao diện thi.

## 6. Vị trí đáp án — cân bằng nhưng không có quy luật

Mục tiêu: người chơi phải hiểu nội dung, không thể đoán chuỗi đáp án. Kế thừa yêu cầu chia đều vị trí và không có ba đáp án cùng vị trí liên tiếp, điều chỉnh theo số lựa chọn thật.

- Cân bằng riêng từng tập câu có cùng số lựa chọn. Với N5 này: **80 câu có 4 lựa chọn → mỗi vị trí 20 đáp án đúng**; **11 câu có 3 lựa chọn → phân bố 4/4/3**, luân chuyển vị trí có 3 giữa các đề, không cố định.
- Trong từng phần thi, cân bằng tối đa trong phạm vi khả thi (chênh không quá một giữa các vị trí hợp lệ). Phối hợp phần có số dư để vẫn đạt tổng 20/20/20/20 của 80 câu. Không ép cân bằng cứng từng nhóm nhỏ nếu làm lộ quy luật.
- Không có ba đáp án cùng vị trí liên tiếp; kiểm tra cả đoạn nối các dạng trong cùng phần và toàn chuỗi số của đề.
- Cấm chu kỳ dễ thấy như 1–2–3–4 lặp lại, 1–2–1–2 kéo dài, 1–1–2–2–3–3–4–4 lặp lại, hoặc lặp cùng chuỗi ở nhiều dạng/đề. Kiểm tra chu kỳ ngắn lặp đủ dài để có thể dự đoán; không cấm mọi sự trùng ngắn ngẫu nhiên.
- Không dùng cùng một chuỗi đáp án cho mọi đề/cấp; không cố định câu đầu/câu cuối hoặc vị trí thiếu một đáp án khi số câu không chia hết.
- Cân bằng tổng không có nghĩa mỗi khối bốn câu phải chứa đủ 1–4. Cách đó tạo quy luật mới và bị cấm.
- Viết nội dung/đáp án theo ý nghĩa trước; sau đó hoán vị lựa chọn có kiểm soát, kiểm tra phân bố và các chuỗi dễ đoán. Nếu chưa đạt, chọn hoán vị khác, không sửa đáp án đúng để chạy theo quota.
- Mỗi lần hoán vị phải cập nhật đồng bộ ID đáp án, thứ tự phương án, lý do, vị trí sao/nghiệm sắp xếp, audio đọc lựa chọn, hình lựa chọn, manifest, bản kiểm duyệt và bộ chấm điểm. Không để audio giữ thứ tự cũ.
- Thứ tự đã chốt của một phiên bản phải ổn định khi làm bài và xem kết quả. Không tự thêm xáo trộn lúc chạy vì sẽ ảnh hưởng UI, âm thanh và trạng thái lưu.
- Báo cáo kiểm tra phải có số lượng từng vị trí theo tập 3/4 lựa chọn, theo phần và kết quả kiểm tra chuỗi; không chỉ báo “random”.

## 7. Thời gian thi theo cấp

N5: **20 phút từ vựng / 40 phút ngữ pháp–đọc / khoảng 30 phút nghe**.

Mốc công bố JLPT hiện hành được kiểm tra ngày 06/10/2026: N4 25/55/35 phút; N3 30/70/40 phút; N2 kiến thức–đọc 105 phút, nghe 50 phút; N1 kiến thức–đọc 110 phút, nghe 55 phút. Dùng bảng thời gian và cấu trúc đã chốt của từng cấp trong blueprint; chỉ cần báo khi nguồn thay đổi hoặc có mâu thuẫn thật. Không áp mục tiêu nghe 30 phút cho mọi cấp.

Nguồn: https://www.jlpt.jp/e/guideline/testsections.html . Nguồn nêu thời lượng nghe có thể lệch nhẹ tùy bản ghi. Mặc định triển khai của dự án: nhắm đúng thời lượng mục tiêu của cấp; sai lệch tổng tối đa ±60 giây cho bản mô phỏng và phải báo thời lượng thực tế. Đây là dung sai kỹ thuật, không phải quy định chính thức JLPT. Đoạn nhạc nghỉ phải đúng 60 giây, không áp dung sai này cho nhạc nghỉ.

## 8. Thiết kế nghe N5 khoảng 30 phút

Phải bám cấu trúc bài mẫu cả về trình tự và nhịp làm bài, đồng thời tạo nội dung độc lập. Tổng thời lượng gồm hướng dẫn mới, ví dụ mới nếu cấu trúc mẫu có ví dụ, câu hỏi, hội thoại, đọc lựa chọn, thời gian quan sát/đọc, thời gian trả lời, chuyển dạng và nghỉ giữa bài đã xác định. Ví dụ không tính thêm vào 24 câu chấm điểm.

Trước khi viết bản cuối, lập bảng ngân sách thời gian cho từng dạng và từng câu. Mỗi thành phần phải có mục đích; tổng cần tiến tới 1800 giây = 1800000 ms. Ước lượng chỉ là kế hoạch; đo bản thu hoàn chỉnh mới là bằng chứng thời lượng.

- Dạng 1–2: tổ chức câu hỏi trước/sau hội thoại và khoảng chuẩn bị theo cấu trúc mẫu được xác minh. Không đọc thêm phương án vốn chỉ xuất hiện trên giấy nếu mẫu không yêu cầu.
- Dạng 3: đủ hình mới, hướng dẫn tình huống và ba phát ngôn được đọc. Đảm bảo hình không viết sẵn đáp án.
- Dạng 4: đọc phát ngôn rồi ba phản hồi; người làm chọn theo âm thanh, không được nhìn nội dung phản hồi trước khi làm.
- Hướng dẫn và ví dụ phải tự viết mới, rõ ràng, đúng chức năng, không sao chép lời dẫn, âm báo hoặc bản thu cũ.
- Không mặc định nghe hai lần, lặp hội thoại/câu hỏi hoặc thêm ví dụ ở mọi dạng; xác minh cấu trúc trước.
- Không kéo dài câu đến mức vượt N5, không đọc chậm khác tốc độ đã chốt, không thêm các khoảng im lặng lớn hoặc lặp audio chỉ để đủ 30 phút.
- Khoảng xem hình, suy nghĩ, đánh dấu đáp án và chuyển dạng là thời gian hợp lệ nếu phù hợp cấu trúc và đã được hiệu chỉnh; không được loại bỏ mọi khoảng nghỉ vì gọi chúng là “im lặng”.
- Phải nghe thử toàn bản, kiểm tra người học có đủ thời gian làm từng dạng và cảm giác nhịp thi phù hợp, không chỉ cộng số giây.

## 9. Nhịp nghỉ giữa bài nghe — yêu cầu mới của người dùng

Phần nghe phải có nhịp nghỉ giữa bài để người làm bài ổn định và tiếp tục, theo tổ chức bài mẫu đã xác minh. Tách rõ:

1. Nghỉ ngắn giữa lượt thoại.
2. Thời gian quan sát/đọc và trả lời từng câu.
3. Khoảng chuyển dạng bài.
4. Nhịp nghỉ giữa bài nghe người dùng yêu cầu.
5. Nghỉ giữa các phần thi, nằm ngoài bản nghe.

Không coi năm loại này là cùng một khoảng; không tự thêm một nghỉ dài ở giữa từng câu.

**Đã chốt cho mọi cấp N5–N1:** ngay sau khi kết thúc câu cuối và thời gian trả lời của 問題２, trước mọi hướng dẫn/ví dụ/câu hỏi của 問題３. Trình tự bắt buộc:

1. Báo nghỉ bằng giọng dẫn đã chốt, câu mới: `問題二はここまでです。これから一分間休みます。`
2. Phát nhạc nhẹ **không lời đúng 60000 ms = 60 giây**. Không có giọng hát, lời nói, quảng cáo hoặc âm thanh gây giật mình; âm lượng dễ chịu và không lấn giọng thông báo.
3. Khi nhạc kết thúc, báo tiếp tục: `休み時間は終わりです。問題三を始めます。`
4. Bắt đầu hướng dẫn/ví dụ mới của 問題３ rồi vào câu chấm điểm.

Không hỏi lại vị trí/thời lượng đã chốt, không chuyển nghỉ sang trước phần nghe hoặc sau 問題３. Nhạc đúng 60 giây không tính hai câu thông báo; hai câu thông báo có thời lượng đo riêng. Mặc định thiết kế của dự án: **cả nhạc nghỉ và hai thông báo nằm trong tổng thời lượng nghe mục tiêu của cấp**, không thêm 60 giây ngoài mốc. Phần còn lại phải có nội dung và nhịp làm bài đủ phù hợp để đạt tổng.

Đây là đoạn nghỉ riêng do nhà phát hành yêu cầu cho app; không tuyên bố JLPT thật có nghỉ nhạc như vậy. Không cần tìm một đoạn nhạc từ đề gốc để sao chép. Tự sáng tác/tổng hợp nhạc không lời độc lập, hoặc dùng nguồn có giấy phép đã xác minh cho app thương mại và phân phối file âm thanh; không dùng giai điệu được bảo hộ, nhạc nghe miễn phí trên mạng hoặc giấy phép chỉ cho video nếu không bao phủ app. Lưu nguồn/quyền/credit và hash.

Manifest phải lưu breakAfterProblem=2, breakBeforeProblem=3; mốc báo nghỉ, nhạc, báo tiếp tục; durationMs của nhạc chính xác 60000. Với PCM 24000 Hz, nhạc có 1440000 frame. Xác minh đầu/cuối sau ghép và mã hóa, không chỉ cắt nhạc theo tên file; tính cả giới hạn/padding của codec. Cần fade-in/out nằm bên trong 60 giây, không thêm vào ngoài.

Các khoảng giữa lượt, quan sát/đọc, trả lời và chuyển dạng phải được thiết kế theo độ dài và kỹ năng từng câu; không dùng nghỉ nhạc 60 giây thay cho các khoảng đó. Lưu blueprint thời gian và chạy nghe liên tục tự phát hết nhạc rồi trở lại bài, không bắt người dùng bấm để tiếp tục.

## 10. Giọng đọc và tài nguyên mới

Cấu hình duy nhất: `src/data/jlpt-original/voice-casting.json`.

| Vai | Giọng | Speaker ID |
|---|---|---:|
| Nữ học sinh | 春日部つむぎ / ノーマル | 8 |
| Nữ trưởng thành | 夜語トバリ / ノーマル | 118 |
| Nam thanh niên | 玄野武宏 / ノーマル | 11 |
| Nam trưởng thành | 剣崎雌雄 / ノーマル | 21 |

VOICEVOX 0.25.2; speedScale **0.9**; mono 24000 Hz. Gán vai rõ ràng, nhất quán trong câu; không đổi giọng tự ý. Số 4/8/37 trong album thử là số thứ tự mẫu, không phải speaker ID.

Giọng số 7 もち子さん đã bị loại khỏi phân vai chính thức do điều kiện sử dụng riêng. Không tự đưa lại giọng này.

Các khoảng 1.2s sau mở đầu, 0.5s giữa thoại và 5s trả lời là cấu hình thử cũ, không phải chuẩn cố định cho 30 đề. AI được phép thiết kế lại các khoảng chuẩn bị/trả lời/chuyển dạng để phù hợp cấu trúc từng cấp và tổng thời lượng, phải ghi số đo và kiểm tra bằng nghe; không cần hỏi lại từng khoảng hợp lý. Riêng đoạn nhạc 60 giây cố định, giọng và speedScale 0.9 giữ nguyên. Không kéo im lặng vô lý hoặc đổi tốc độ để bù thời lượng.

Kiểm tra phát âm/trọng âm tiếng Nhật chuẩn, tự nhiên và dễ phân biệt; không tự chứng nhận Kantō chuẩn bằng tên giọng hoặc kiểm tra file. TTS có thể cần chỉnh cách đọc.

Credit bắt buộc theo điều khoản hiện hành, gồm `VOICEVOX:春日部つむぎ`, `VOICEVOX:夜語トバリ`, `VOICEVOX:玄野武宏(CV:ガロ)`, `VOICEVOX:剣崎雌雄`. Cần vị trí credit dễ tìm trong app trước phát hành. Quyền giọng, phần mềm, kịch bản và hình nhân vật là các quyền riêng; miễn phí không đồng nghĩa tự do mọi mục đích.

**Bắt buộc dùng kỹ năng `imagegen` để tạo hình raster cần thiết trong bài thi**: đọc SKILL.md trước lần dùng đầu, tạo theo brief độc lập gắn question ID, kiểm tra hình thực tế, sửa sai bằng công cụ tạo/chỉnh ảnh và đưa file thật vào assets, manifest và adapter. Không dừng ở visualBrief/placeholder. Dùng bố cục dễ đọc trên điện thoại; không có chữ hoặc chi tiết vô tình lộ đáp án. Nếu là bảng, lịch, sơ đồ cần chữ/số chính xác, dựng lớp chữ/số chính xác bằng mã và đối chiếu dữ kiện; không tin chữ/số AI trong ảnh mà chưa kiểm tra.

Mọi hình/audio phải tạo mới; không dùng tài nguyên đề cũ để lấp phần thiếu. Hình đúng tình huống, không lộ đáp án, đọc được trên điện thoại. Không tự lấy hình nhân vật của thư viện giọng cho NPC.

## 11. Mã nguồn, chấm điểm và giao diện

- ID đề/câu, session key, đáp án và audio độc lập với đề cũ.
- Giữ UI đã duyệt, điều hướng, lưu bài, chấm điểm và nghe liên tục. Không đổi hash khóa hoặc thiết kế vì công việc nội dung.
- Khi nộp bài, chỉ hiện trạng thái đúng/sai/chưa trả lời và phương án đúng theo chính sách V1. Không tự bật giải thích/transcript.
- Điểm luyện tập không được gọi là điểm chuẩn hóa chính thức JLPT khi chưa có mô hình phù hợp.
- Giữ điều kiện lên cấp: sáu đề khác nhau cùng cấp đạt ít nhất 80%.
- App đang sản xuất: không cần giữ tiến độ đề cũ. Chỉ xóa toàn bộ đề/tài nguyên cũ khỏi bundle, API, cache và fallback khi bộ thay thế hoàn thiện theo gate đã duyệt; không xóa trước để che phần thiếu. Không động tới dữ liệu game/học khác hoặc viết lại lịch sử Git.

## 12. Quy trình làm việc bắt buộc

1. Đọc hướng dẫn; fetch và kiểm tra branch, HEAD, thay đổi chưa lưu; giữ nguyên công việc khác.
2. Đọc checkpoint, xác định đúng phần chưa xong. Không làm lại đơn vị đã lưu bền vững.
3. Lập blueprint: số câu, kỹ năng, độ khó, hình cần có, bảng nhịp/thời lượng và mục tiêu phân bố đáp án.
4. Xác nhận các điểm chưa hiểu; tiếp tục phần độc lập không cần câu trả lời. Không đoán cho đủ file.
5. Soạn mới theo mục tiêu; tự kiểm tra logic, đáp án duy nhất và nhiễu.
6. Hoán vị lựa chọn; kiểm tra quota và chuỗi; đồng bộ mọi dữ liệu/audio sau hoán vị.
7. AI tự kiểm tra học thuật, cấu trúc và logic; sửa đến khi bản hoàn chỉnh đủ để làm bài. **Không yêu cầu nhà phát hành duyệt nháp trước khi tích hợp hoặc trước đề kế tiếp.** Không tự đặt các cờ duyệt con người thành true.
8. Tạo đủ hình bằng imagegen, audio bằng bốn giọng đã chốt, hướng dẫn/ví dụ mới và đoạn nghỉ nhạc đúng một phút cho mỗi đề. Đo và kiểm tra tài nguyên hoàn chỉnh; sửa lỗi thực tế. Việc cho phép tạo/tích hợp không đồng nghĩa người dùng đã duyệt phát hành.
9. Kiểm tra cấu trúc, đáp án, phân bố, liên kết, hash, thời lượng, thứ tự lựa chọn được đọc và quyền/credit. Giữ các cờ chưa duyệt đúng thực tế.
10. Tích hợp **toàn bộ đề hoàn chỉnh và phần nghe đầy đủ** qua adapter tương thích UI, registry/catalog, chấm điểm, resume, kết quả và tài nguyên. Kiểm tra trên app; người dùng mở được ngay từng đề để tự làm và báo lỗi. Không đưa một ô đề giả chỉ có lời hứa sẽ có audio. Giữ khóa UI; nếu có trở ngại thật cần sửa file khóa, nêu rõ trước khi sửa.
11. Commit hẹp, đẩy bằng cập nhật không ghi đè, fetch, chạy `check-work-persistence.mjs`. Chỉ báo lưu bền vững khi PASS.
12. Cập nhật checkpoint nội dung và phần còn thiếu trong chính commit công việc; không tạo commit riêng chỉ để ghi SHA.

## 13. Điều kiện nghiệm thu và cách báo cáo

Một đề hoàn thiện phải có đủ câu/hình/audio, đáp án duy nhất, nhiễu hợp lý, phân bố không dễ đoán, thời lượng/nhịp nghỉ đạt chuẩn đã xác nhận, kiểm duyệt thực tế, quyền/credit phù hợp và tích hợp được kiểm tra.

Báo cáo tách rõ: hoàn thành kỹ thuật; kiểm duyệt học thuật; nghe thực tế; quyền phát hành; tích hợp app. Không đánh đồng “có file” với “đạt”.

Không được tự xác nhận: tỷ lệ tương đồng; an toàn bản quyền 100%; độ khó tương đương đề thật; trọng âm chuẩn; nhà phát hành/người bản ngữ đã duyệt; đủ 30 phút; chạy đúng trên iPhone nếu chưa kiểm tra.

## 14. Trạng thái hiện tại và thứ tự tiếp tục

Hiện có 91 câu nháp, 24 audio riêng và bản liên tục **726456 ms ≈ 12 phút 06 giây**. Bản này chưa đạt khoảng 30 phút; 5 hình còn thiếu; độ khó/nhịp nghỉ/nghe thực tế chưa được duyệt. Validator hiện tại đã kiểm tra không có ba đáp án giống liên tiếp nhưng chưa chứng minh cân bằng theo hướng dẫn mới hoặc không có chu kỳ; cần bổ sung kiểm tra và sửa thứ tự lựa chọn nếu cần.

Không dùng trạng thái cũ làm bằng chứng đạt hướng dẫn này. Hoàn thiện N5 đề 01 thành phiên bản được tích hợp đầy đủ: kiểm toán/sửa phân bố đáp án; phát triển nghe theo blueprint đạt khoảng 30 phút; thêm đoạn nghỉ đã chốt; đồng bộ audio khi đổi lựa chọn; tạo đủ hình bằng imagegen; tích hợp và kiểm tra kỹ thuật/thực tế. Sau khi lưu bền vững, tiếp tục N5 đề 02–06 rồi N4–N1 mỗi cấp 6 đề, không chờ duyệt bản nháp. Người dùng kiểm tra trực tiếp và sửa theo từng đề sau hoàn thành. Không xóa nội dung cũ trước gate thay thế toàn bộ và không tuyên bố bộ 30 đề đã xong khi mới có hướng dẫn.
