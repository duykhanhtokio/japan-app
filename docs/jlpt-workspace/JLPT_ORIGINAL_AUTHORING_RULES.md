# HƯỚNG DẪN BẮT BUỘC — SOẠN NỘI DUNG JLPT MỚI CHO JAPAN APP

Phiên bản 5 — bản chính thức tổng hợp theo nội dung nhà phát hành gửi ngày 06/10/2026. Thay thế các phiên bản trước trong mã nguồn.

**Mỗi khi bắt đầu một phiên soạn JLPT mới, AI phải đọc lại toàn bộ bản hiện hành này và `JLPT_LEVEL_BLUEPRINTS.md` trước khi soạn. Không dùng trí nhớ phiên trước thay cho việc đọc.**


## 1. Phạm vi và thứ tự bắt buộc đọc

AI phải đọc toàn bộ tài liệu này trước khi tạo hoặc sửa câu hỏi, bài đọc, kịch bản nghe, lựa chọn, đáp án, hình minh họa hoặc audio JLPT mới. Không chỉ đọc tiêu đề hoặc bản tóm tắt. Đây là bản quy tắc biên soạn chính; phải đọc đồng thời toàn bộ `docs/jlpt-workspace/JLPT_LEVEL_BLUEPRINTS.md` trong mỗi phiên. Hai tài liệu đều bắt buộc, không dùng một bản thay cho bản còn lại. Nếu có mâu thuẫn ảnh hưởng đến triển khai, dừng phần liên quan và xác nhận với nhà phát hành; không tự đoán. Sau đó đọc `src/data/jlpt-original/authoring-blueprints.json`, checkpoint hiện hành, cấu hình giọng, master và QA của đúng đề đang làm. Metadata máy phải đồng bộ với bản này; checkpoint chỉ ghi tiến độ, không được dùng chỉ dẫn lịch sử để thay bản hiện hành.
Repository: duykhanhtokio/japan-app. Nhánh: recovery/jlpt-n3-n1.
Thứ tự: docs/AI_SESSION_START_HERE.md → AGENTS.md → tài liệu này → JLPT_LEVEL_BLUEPRINTS.md → JLPT_ORIGINAL_AUTHORING_CHECKPOINT.md → quy tắc khóa UI và bản khóa mới nhất → dữ liệu/checkpoint của đề đang xử lý. Quy định biên soạn mới này thay thế quy trình phục hồi/chép đề gốc đối với công việc hiện tại. Không tự chạy vòng phục hồi đề cũ.
Yêu cầu trực tiếp mới nhất của người dùng có ưu tiên cao hơn tài liệu. Khi có mâu thuẫn hoặc chưa rõ, nêu chính xác và xác nhận; không suy đoán thành quyết định của người dùng.

## 2. Mục tiêu, quy mô và trách nhiệm

- Soạn đề mô phỏng độc lập cho N5–N1, có mục tiêu đo thời gian và luyện theo cấu trúc thi.
- Quy mô đã duyệt: **6 đề mỗi cấp N5–N1, tổng 30 đề**.
- Ưu tiên soạn và tích hợp đủ cả 30 đề, gồm câu hỏi, hình, audio đầy đủ, chấm điểm, lưu bài và kết quả. Người dùng kiểm tra toàn bộ sau khi 30 đề đã nạp vào app; không đặt bước duyệt bản thí điểm hoặc duyệt nháp làm điều kiện để tiếp tục. Triển khai N5 01–06 → N4 01–06 → N3 01–06 → N2 01–06 → N1 01–06; lưu bền vững từng đề trước khi sang đề kế tiếp.
- Nhà phát hành/người quyết định cuối cùng là người dùng. “Bản chính thức” của Japan App không có nghĩa là đề chính thức do JLPT phát hành.
- AI phải làm đủ chất lượng từng câu; số file, số câu và kiểm tra kỹ thuật không thay thế kiểm duyệt nội dung.
- Gắn nhãn nội dung AI biên soạn/chưa kiểm duyệt. Không tự nhận đây là đề chính thức hoặc đã được JLPT chứng nhận.

## 3. Nguyên tắc soạn mới và giới hạn tham khảo

Toàn bộ nội dung JLPT cũ trong đề gốc tuyệt đối không được dùng làm nội dung sản xuất mới. Chỉ lấy bố cục, số câu, dạng kỹ năng, mức độ kiến thức và đặc điểm tổ chức bài làm làm căn cứ.
Không lấy câu hỏi, phương án trả lời, đáp án, đoạn đọc, lời thoại, bản ghi âm hoặc hình minh họa cũ. Không dịch/paraphrase hoặc giữ logic cũ rồi đổi tên, số tiền, địa điểm, thời gian, từ đồng nghĩa hay trật tự từ. Không biến một câu cũ thành bộ khung để viết lại từng câu tương ứng.
Mỗi câu mới phải xuất phát từ mục tiêu học tập và tình huống được nghĩ độc lập, có dữ kiện, quan hệ nhân vật, nhiệm vụ, hướng suy luận và phương án nhiễu riêng. Các chủ đề thông dụng có thể xuất hiện, nhưng không lấy sự thông dụng làm lý do để giữ cách diễn đạt hoặc chuỗi dữ kiện đặc thù của đề cũ.
Chia tham khảo thành hai luồng:

1.	Luồng cấu trúc: chỉ xuất số lượng, thứ tự dạng bài, số lựa chọn, đặc điểm hiển thị.
2.	Luồng nhịp nghe: chỉ xuất thống kê thời lượng, tốc độ tham chiếu, điểm chuyển dạng, hướng dẫn/ví dụ, thời gian xem hình, đọc lựa chọn, trả lời và khoảng nghỉ. Không xuất nội dung lời thoại, đáp án hoặc audio mẫu sang đầu vào tạo nội dung mới; không chép các khoảng audio/âm báo cũ vào bản mới.
Không tự so sánh nội dung câu mới với câu cũ trong phiên biên soạn. Nếu cần kiểm tra tương đồng ngoài ý muốn, phải xác nhận trước mục đích/phạm vi và tách thành bước kiểm tra, không dùng kết quả để tái tạo câu gốc. Không đưa phần trăm tương đồng hoặc cam kết an toàn bản quyền khi chưa có căn cứ đo/kiểm tra phù hợp.

### 3.1. Hai nguồn công khai — chỉ dùng metadata

- `https://www.jlpt.jp/e/guideline/testsections.html`: chỉ lấy bảng thời lượng, tên các phần và bảng kỹ năng theo cấp.
- `https://www.jlpt.jp/e/samples/sampleindex.html`: chỉ lấy bảng phân loại dạng nghe và cấp độ áp dụng trên trang HTML. Trang này cũng liên kết đề mẫu, đáp án, transcript và audio có bản quyền; việc dẫn URL không cho phép sử dụng các nội dung đó.
- Không mở/tải PDF câu hỏi, đáp án, bài đọc, kịch bản, hình hoặc audio được liên kết trên hai trang để đưa vào đầu vào soạn mới. Không dùng công cụ tìm kiếm để trích các nội dung ấy thay cho tải trực tiếp.
- Nguồn 第3回 trong repo cũng chỉ được đọc bằng bộ trích metadata có danh sách trường cho phép: cấp, phần, dạng, số câu, số lựa chọn, cách hiển thị/đọc và thống kê thời lượng. Không in toàn bộ JSON/PDF, prompt, lựa chọn, đáp án, transcript hoặc hình cũ vào ngữ cảnh tác giả.
- Đầu vào tác giả gồm mục tiêu kỹ năng, mức độ, cấu trúc và thống kê tổng hợp đã tách sạch nội dung. Không đưa câu mẫu làm ví dụ cho AI bắt chước, không ánh xạ câu mới một-một theo câu gốc.
- Nếu chưa có metadata nhịp nghe/hiển thị đủ đáng tin, ghi phần thiếu và xác nhận cách xử lý; không tự mở audio/transcript cũ để suy ra nội dung. Việc phân tích nguồn cũ riêng để tạo thêm metadata cần xác nhận phạm vi trước, giữ tách khỏi phiên tác giả.
- Lưu đường dẫn nguồn, ngày đối chiếu, trường đã lấy và hash khi có; nguồn tham khảo không phải giấy phép tái sử dụng. Không tuyên bố tỷ lệ sao chép bằng 0 hoặc bảo đảm pháp lý chỉ vì dùng AI.

Đã được người dùng xác nhận riêng ngày 06/10/2026: phân tích audio 第３回 N5 để lấy metadata nhịp/thời gian, **không lấy nội dung**. Không hỏi lại quyền này cho cùng phạm vi đã xác nhận. Quyền đó không mở rộng thành cho phép lấy lời thoại, câu hỏi, đáp án hoặc audio vào đề mới, cũng không tự cho phép phân tích nội dung của cấp khác.

## 4. Chuẩn cấu trúc đề thi giống đề mẫu — đủ N5–N1

Mẫu đã chọn cho **N5, N4, N3, N2 và N1 đều là 第３回 của đúng cấp đó**. Trước khi soạn một cấp, đối chiếu ID mẫu và metadata cấu trúc của cấp đó với bảng dưới; xác nhận các điểm chưa rõ hoặc mâu thuẫn thực sự, không tự áp bảng N5 sang cấp khác. Dùng metadata cấu trúc 第3回 hiện có của từng cấp; sáu đề cùng cấp giữ số câu từng dạng, không chỉ tổng số câu. Đây là chuẩn dự án, không phải tuyên bố mọi kỳ JLPT có số câu cố định. Metadata máy phải đồng bộ với các bảng dưới đây. Không áp số câu 120 của yêu cầu cũ cho các đề có tổng khác.

Đếm đơn vị chấm điểm, không đếm file audio. Với N1/N2 統合理解, một hội thoại tổng hợp có thể phục vụ nhiều câu phụ; giữ quan hệ hội thoại và ID/đáp án riêng, không biến thành các câu ngắn độc lập để đủ số lượng.

### N5

Thời gian: vocabulary 20 phút / grammarReading 40 phút / listening 30 phút. Tổng 67 câu viết + 24 câu nghe = **91 câu chấm điểm**.

| Phần | 問題 | Kỹ năng | Số câu chấm điểm | Lựa chọn/câu |
|---|---:|---|---:|---:|
| vocabulary | 1 | 漢字読み | 12 | 4 |
| vocabulary | 2 | 表記 | 8 | 4 |
| vocabulary | 3 | 文脈規定 | 10 | 4 |
| vocabulary | 4 | 言い換え類義 | 5 | 4 |
| grammar_reading | 1 | 文の文法1 | 16 | 4 |
| grammar_reading | 2 | 文の文法2・並べ替え | 5 | 4 |
| grammar_reading | 3 | 文章の文法 | 5 | 4 |
| grammar_reading | 4 | 内容理解・短文 | 3 | 4 |
| grammar_reading | 5 | 内容理解・中文 | 2 | 4 |
| grammar_reading | 6 | 情報検索 | 1 | 4 |
| listening | 1 | 課題理解 | 7 | 4 |
| listening | 2 | ポイント理解 | 6 | 4 |
| listening | 3 | 発話表現 | 5 | 3 |
| listening | 4 | 即時応答 | 6 | 3 |

Dữ liệu tham chiếu cấu trúc: `src/data/jlpt-official/n5-2013-07/written.candidate.json`, `src/data/jlpt-official/n5-2013-07/listening.candidate.json`.

### N4

Thời gian: vocabulary 25 phút / grammarReading 55 phút / listening 35 phút. Tổng 70 câu viết + 28 câu nghe = **98 câu chấm điểm**.

| Phần | 問題 | Kỹ năng | Số câu chấm điểm | Lựa chọn/câu |
|---|---:|---|---:|---:|
| vocabulary | 1 | 漢字読み | 9 | 4 |
| vocabulary | 2 | 表記 | 6 | 4 |
| vocabulary | 3 | 文脈規定 | 10 | 4 |
| vocabulary | 4 | 言い換え類義 | 5 | 4 |
| vocabulary | 5 | 用法 | 5 | 4 |
| grammar-reading | 1 | 文の文法1 | 15 | 4 |
| grammar-reading | 2 | 文の文法2・並べ替え | 5 | 4 |
| grammar-reading | 3 | 文章の文法 | 5 | 4 |
| grammar-reading | 4 | 内容理解・短文 | 4 | 4 |
| grammar-reading | 5 | 内容理解・中文 | 4 | 4 |
| grammar-reading | 6 | 情報検索 | 2 | 4 |
| listening | 1 | 課題理解 | 8 | 4 |
| listening | 2 | ポイント理解 | 7 | 4 |
| listening | 3 | 発話表現 | 5 | 3 |
| listening | 4 | 即時応答 | 8 | 3 |

Dữ liệu tham chiếu cấu trúc: `src/data/jlpt-official/n4-2013-07/exam.candidate.json`.

### N3

Số 問題 viết trong bảng là chỉ số metadata liên tục: 1–5 thuộc vocabulary, 6–12 thuộc grammar/reading. Khi dựng phiên thi, tách đúng hai phần thời gian; giữ ánh xạ ID rõ ràng.

Thời gian: vocabulary 30 phút / grammarReading 70 phút / listening 40 phút. Tổng 74 câu viết + 28 câu nghe = **102 câu chấm điểm**.

| Phần | 問題 | Kỹ năng | Số câu chấm điểm | Lựa chọn/câu |
|---|---:|---|---:|---:|
| written | 1 | 漢字読み | 8 | 4 |
| written | 2 | 表記 | 6 | 4 |
| written | 3 | 文脈規定 | 11 | 4 |
| written | 4 | 言い換え類義 | 5 | 4 |
| written | 5 | 用法 | 5 | 4 |
| written | 6 | 文の文法1 | 13 | 4 |
| written | 7 | 文の文法2・並べ替え | 5 | 4 |
| written | 8 | 文章の文法 | 5 | 4 |
| written | 9 | 内容理解・短文 | 4 | 4 |
| written | 10 | 内容理解・中文 | 6 | 4 |
| written | 11 | 内容理解・長文 | 4 | 4 |
| written | 12 | 情報検索 | 2 | 4 |
| listening | 1 | 課題理解 | 6 | 4 |
| listening | 2 | ポイント理解 | 6 | 4 |
| listening | 3 | 概要理解 | 3 | 4 |
| listening | 4 | 発話表現 | 4 | 3 |
| listening | 5 | 即時応答 | 9 | 3 |

Dữ liệu tham chiếu cấu trúc: `src/data/jlpt-official/n3-2013-07/exam.candidate.json`.

### N2

Phần viết dùng chung một phiên thời gian: 問題1–6 từ vựng, 7–9 ngữ pháp, 10–14 đọc hiểu.

Thời gian: languageKnowledgeReading 105 phút / listening 50 phút. Tổng 75 câu viết + 31 câu nghe = **106 câu chấm điểm**.

| Phần | 問題 | Kỹ năng | Số câu chấm điểm | Lựa chọn/câu |
|---|---:|---|---:|---:|
| written | 1 | 漢字読み | 5 | 4 |
| written | 2 | 表記 | 5 | 4 |
| written | 3 | 語形成 | 7 | 4 |
| written | 4 | 文脈規定 | 5 | 4 |
| written | 5 | 言い換え類義 | 5 | 4 |
| written | 6 | 用法 | 5 | 4 |
| written | 7 | 文の文法1 | 12 | 4 |
| written | 8 | 文の文法2・並べ替え | 5 | 4 |
| written | 9 | 文章の文法 | 5 | 4 |
| written | 10 | 内容理解・短文 | 5 | 4 |
| written | 11 | 内容理解・中文 | 9 | 4 |
| written | 12 | 統合理解 | 2 | 4 |
| written | 13 | 主張理解 | 3 | 4 |
| written | 14 | 情報検索 | 2 | 4 |
| listening | 1 | 課題理解 | 5 | 4 |
| listening | 2 | ポイント理解 | 6 | 4 |
| listening | 3 | 概要理解 | 5 | 4 |
| listening | 4 | 即時応答 | 11 | 3 |
| listening | 5 | 統合理解 | 4 | 4 |

Dữ liệu tham chiếu cấu trúc: `src/data/jlpt-official/n2-2013-07/exam.candidate.json`.

### N1

Phần viết dùng chung một phiên thời gian: 問題1–4 từ vựng, 5–7 ngữ pháp, 8–13 đọc hiểu.

Thời gian: languageKnowledgeReading 110 phút / listening 55 phút. Tổng 70 câu viết + 36 câu nghe = **106 câu chấm điểm**.

| Phần | 問題 | Kỹ năng | Số câu chấm điểm | Lựa chọn/câu |
|---|---:|---|---:|---:|
| written | 1 | 漢字読み | 6 | 4 |
| written | 2 | 文脈規定 | 7 | 4 |
| written | 3 | 言い換え類義 | 6 | 4 |
| written | 4 | 用法 | 6 | 4 |
| written | 5 | 文の文法1 | 10 | 4 |
| written | 6 | 文の文法2・並べ替え | 5 | 4 |
| written | 7 | 文章の文法 | 5 | 4 |
| written | 8 | 内容理解・短文 | 4 | 4 |
| written | 9 | 内容理解・中文 | 9 | 4 |
| written | 10 | 内容理解・長文 | 4 | 4 |
| written | 11 | 統合理解 | 2 | 4 |
| written | 12 | 主張理解 | 4 | 4 |
| written | 13 | 情報検索 | 2 | 4 |
| listening | 1 | 課題理解 | 6 | 4 |
| listening | 2 | ポイント理解 | 6 | 4 |
| listening | 3 | 概要理解 | 6 | 4 |
| listening | 4 | 即時応答 | 14 | 3 |
| listening | 5 | 統合理解 | 4 | 4 |

Dữ liệu tham chiếu cấu trúc: `src/data/jlpt-official/n1-2013-07/exam.verified.json`.

### Mức độ theo cấp

- N5: tình huống quen thuộc, câu đơn giản, thông tin cụ thể, hội thoại ngắn rõ ràng; không kéo thành hội thoại cao cấp chỉ để đủ phút.
- N4: tình huống đời sống thường ngày, trình tự/điều kiện cơ bản, các đoạn đọc và nghe dài hơn N5 nhưng vẫn có mạch rõ.
- N3: kết nối thông tin đời sống, phân biệt ý chính/chi tiết, theo dõi lý do và diễn biến, đọc dài và nghe khái quát.
- N2: văn bản và hội thoại tự nhiên về đời sống/xã hội/công việc, sắc thái và quan hệ lập luận, tích hợp nhiều nguồn hoặc nhiều người.
- N1: văn bản phức tạp, trừu tượng, hàm ý, lập luận, mục đích và sắc thái; nghe tổng hợp với diễn biến/lựa chọn cần kết nối thông tin. Không dùng ngôn ngữ khó tùy tiện hoặc tình huống đánh đố.

### Cách tổ chức kỹ năng nghe

- 課題理解: xác định hành động/nhiệm vụ tiếp theo từ diễn biến, điều kiện, thay đổi ý.
- ポイント理解: tìm thông tin cụ thể được hỏi, phân biệt thông tin liên quan với thông tin phụ.
- 概要理解: nghe toàn đoạn để hiểu chủ đề, mục đích hoặc ý chính; không thay bằng câu chỉ tìm số/tên.
- 発話表現: hình/tình huống giao tiếp và các phát ngôn; tạo hình mới bằng kỹ năng tạo ảnh.
- 即時応答: một phát ngôn và các phản hồi nghe, chọn phản hồi tự nhiên.
- 統合理解: nối thông tin giữa người nói/điều kiện/quyết định, bao gồm các đơn vị câu hỏi phụ theo mẫu.

Tùy dạng, phương án có thể được in hoặc chỉ đọc. Lập bản đồ hiển thị/đọc từ metadata tổ chức mẫu trước khi xuất đề; không hiện nội dung lựa chọn vốn chỉ nghe trong UI trước khi người chơi trả lời. Không tự thêm lượt phát lại.

### Phân bố đáp án cho mỗi cấp

Cân bằng riêng tập câu có 3 và 4 lựa chọn; mỗi vị trí nhận floor(n/k) hoặc ceil(n/k). Phần dư luân chuyển giữa các đề, không cố định. Toàn bộ yêu cầu chống quy luật trong tài liệu hướng dẫn chính vẫn áp dụng. Cân bằng theo phần khi khả thi, không làm sai quota toàn tập và không áp một quota N5 cho các cấp khác.


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
- Cân bằng riêng từng tập câu có cùng số lựa chọn. Với N5 này: 80 câu có 4 lựa chọn → mỗi vị trí 20 đáp án đúng; 11 câu có 3 lựa chọn → phân bố 4/4/3, luân chuyển vị trí có 3 giữa các đề, không cố định.
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

N5: 20 phút từ vựng / 40 phút ngữ pháp–đọc / khoảng 30 phút nghe.
Mốc công bố JLPT hiện hành được kiểm tra ngày 06/10/2026: N4 25/55/35 phút; N3 30/70/40 phút; N2 kiến thức–đọc 105 phút, nghe 50 phút; N1 kiến thức–đọc 110 phút, nghe 55 phút. Trước khi làm cấp đó, xác minh lại nguồn và chuẩn người dùng yêu cầu. Không áp mục tiêu nghe 30 phút cho mọi cấp.
Nguồn: https://www.jlpt.jp/e/guideline/testsections.html . Nguồn nêu thời lượng nghe có thể lệch nhẹ tùy bản ghi. Khoảng chấp nhận kỹ thuật của dự án chưa được người dùng chốt; nếu cần một ngưỡng cụ thể, phải xác nhận, không tự ghi 29–31 phút thành quyết định đã duyệt.

## 8. Thiết kế nghe cho toàn bộ N5–N1

Phải bám cấu trúc bài mẫu cả về trình tự và nhịp làm bài, đồng thời tạo nội dung độc lập. Tổng thời lượng gồm hướng dẫn mới, ví dụ mới nếu cấu trúc mẫu có ví dụ, câu hỏi, hội thoại, đọc lựa chọn, thời gian quan sát/đọc, thời gian trả lời, chuyển dạng và nghỉ giữa bài đã xác định. Ví dụ không tính vào số câu chấm điểm của bất kỳ cấp nào. Các gạch đầu dòng dạng 1–4 dưới đây mô tả N5/N4; N3 có 概要理解 tại 問題３, 発話表現 tại 問題４ và 即時応答 tại 問題５; N2/N1 có 概要理解 tại 問題３, 即時応答 tại 問題４ và 統合理解 tại 問題５. Không áp mô tả hình của 問題３ N5 cho 問題３ N3–N1.

Trước khi viết bản cuối, lập bảng ngân sách thời gian cho từng dạng và từng câu. Mỗi thành phần phải có mục đích; tổng cần tiến tới đúng mốc của cấp: N5 1800000 ms; N4 2100000 ms; N3 2400000 ms; N2 3000000 ms; N1 3300000 ms. Ước lượng chỉ là kế hoạch; đo bản thu hoàn chỉnh mới là bằng chứng thời lượng.

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

Không hỏi lại vị trí/thời lượng đã chốt, không chuyển nghỉ sang trước phần nghe hoặc sau 問題３. Nhạc đúng 60 giây không tính hai câu thông báo; hai câu thông báo có thời lượng đo riêng. Cách lập ngân sách hiện có của dự án: **cả nhạc nghỉ và hai thông báo nằm trong tổng thời lượng nghe mục tiêu của cấp**, không thêm 60 giây ngoài mốc. Đây là cách triển khai đang dùng, không được tự ghi là một quyết định riêng đã được nhà phát hành xác nhận; nếu cần thay cách tính hoặc chưa rõ thì xác nhận trước. Phần còn lại phải có nội dung và nhịp làm bài đủ phù hợp để đạt tổng.

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

VOICEVOX 0.25.2; speedScale 0.9; mono 24000 Hz. Gán vai rõ ràng, nhất quán trong câu; không đổi giọng tự ý. Số 4/8/37 trong album thử là số thứ tự mẫu, không phải speaker ID.
Giọng số 7 もち子さん đã bị loại khỏi phân vai chính thức do điều kiện sử dụng riêng. Không tự đưa lại giọng này.
Các khoảng 1.2s sau mở đầu, 0.5s giữa thoại và 5s trả lời chỉ là cấu hình thử hiện tại, không phải chuẩn thời gian thi đã duyệt. Trước khi thay số để dựng bản cuối, trình bảng nhịp/thời gian và xác nhận các chỗ chưa rõ. Không đổi speedScale 0.9 để bù thời lượng.
Kiểm tra phát âm/trọng âm tiếng Nhật chuẩn, tự nhiên và dễ phân biệt; không tự chứng nhận Kantō chuẩn bằng tên giọng hoặc kiểm tra file. TTS có thể cần chỉnh cách đọc.
Credit bắt buộc theo điều khoản hiện hành, gồm VOICEVOX:春日部つむぎ, VOICEVOX:夜語トバリ, VOICEVOX:玄野武宏(CV:ガロ), VOICEVOX:剣崎雌雄. Cần vị trí credit dễ tìm trong app trước phát hành. Quyền giọng, phần mềm, kịch bản và hình nhân vật là các quyền riêng; miễn phí không đồng nghĩa tự do mọi mục đích.
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

1. Đọc lại toàn bộ bản hướng dẫn hiện hành; fetch, kiểm tra branch, HEAD và thay đổi chưa lưu; giữ nguyên công việc khác.
2. Đọc checkpoint, xác định đúng phần chưa xong; không làm lại đơn vị đã lưu bền vững.
3. Đối chiếu blueprint đúng cấp: số câu, kỹ năng, độ khó, hình, nhịp/thời lượng và phân bố đáp án.
4. Xác nhận các điểm chưa hiểu; tiếp tục phần độc lập không cần câu trả lời. Không đoán để đủ file. Không hỏi lại quyết định đã chốt hoặc quyền đã cấp trong cùng phạm vi.
5. Soạn mới theo mục tiêu; tự kiểm tra tiếng Nhật, logic, đáp án duy nhất và nhiễu. Sửa lỗi đã phát hiện ngay; việc người dùng kiểm tra sau không cho phép AI bỏ qua lỗi đã biết.
6. Hoán vị lựa chọn; kiểm tra quota và chuỗi; đồng bộ dữ liệu, nghiệm sắp xếp, hình và audio sau hoán vị.
7. AI tự kiểm tra học thuật và kỹ thuật. **Không chờ nhà phát hành duyệt bản thí điểm hoặc bản nháp trước khi tích hợp hay trước đề kế tiếp.** Người dùng kiểm tra sau khi đủ 30 đề trong app. Không tự đặt các cờ duyệt con người thành true.
8. Tạo đủ hình mới bằng imagegen, audio bằng bốn giọng đã chốt, hướng dẫn/ví dụ độc lập theo cấu trúc đã xác minh, và đoạn nghỉ nhạc đúng 60 giây. Trình bảng nhịp/thời gian và xác nhận các chỗ chưa rõ trước khi thay cấu hình thử để dựng bản cuối. Đo và kiểm tra tài nguyên thật; sửa lỗi thực tế. Cho phép tạo/tích hợp không đồng nghĩa duyệt phát hành.
9. Kiểm tra cấu trúc, đáp án, phân bố, liên kết, hash, thời lượng, lựa chọn được đọc và quyền/credit. Báo rõ phần chưa xác minh; giữ các cờ đúng thực tế.
10. Tích hợp toàn bộ đề và phần nghe đầy đủ qua adapter tương thích UI, registry/catalog, chấm điểm, resume, kết quả và tài nguyên. Kiểm tra trên app và ghi bằng chứng. Không đưa ô đề giả hoặc audio thiếu. Giữ khóa UI; nếu cần sửa file khóa, nêu rõ và xác nhận trước.
11. Cập nhật checkpoint trong chính commit công việc; commit hẹp, push không ghi đè, fetch, chạy `node scripts/check-work-persistence.mjs`. Chỉ báo lưu bền vững khi PASS. Không tạo commit riêng chỉ để ghi SHA.
12. Sau khi lưu bền vững, tiếp tục đề kế tiếp theo thứ tự đến đủ 30 đề. Không tự dừng để chờ duyệt nháp.

## 13. Điều kiện nghiệm thu và cách báo cáo

Một đề hoàn thiện để nạp vào app phải có đủ câu/hình/audio, đáp án duy nhất, nhiễu hợp lý, phân bố không dễ đoán, thời lượng và nhịp nghỉ theo chuẩn đã xác nhận, kiểm tra nội dung/kỹ thuật của AI và tích hợp được kiểm tra. Các điểm quyền/credit chưa xác minh phải ghi riêng; không tự nhận được phép phát hành khi còn thiếu căn cứ.

Không dùng “người dùng chưa kiểm tra” làm gate chặn soạn/tích hợp đã được cho phép. Kiểm tra của người dùng diễn ra sau khi đủ 30 đề. Việc tích hợp không thay thế duyệt phát hành; publisherReviewed/nativeReviewed/perceptualApproval vẫn false cho đến khi có kiểm tra thực tế tương ứng.

Báo cáo tách rõ: hoàn thành kỹ thuật; kiểm tra học thuật của AI; nghe thực tế; quyền phát hành; tích hợp app; kiểm duyệt của nhà phát hành. Không đánh đồng “có file” với “đạt”.

Không được tự xác nhận: tỷ lệ tương đồng; an toàn bản quyền 100%; độ khó tương đương đề thật; trọng âm chuẩn; nhà phát hành/người bản ngữ đã duyệt; đủ 30 phút hoặc thời lượng cấp khác; chạy đúng trên iPhone nếu chưa kiểm tra.

## 14. Nhân rộng — ưu tiên đủ 30 đề trước kiểm tra của người dùng

**Soạn và nạp đủ toàn bộ 30 đề theo yêu cầu**, gồm 6 đề mỗi cấp N5–N1 với phần nghe đầy đủ. Nội dung cần chỉnh sửa sẽ được thông báo sau khi đã đủ 30 đề nạp vào app và người dùng sẽ test lại toàn bộ, nếu có sai sót và cần chỉnh sửa thì sẽ sửa khi đó. Hiện tại ưu tiên soạn cho đủ 30 đề cho đủ 5 cấp độ trước.


AI sửa lỗi đã biết và kiểm tra từng đề trước khi nạp; sau khi đủ 30 đề, người dùng test toàn bộ và báo các điểm cần chỉnh sửa. Sửa theo đề và theo lỗi, giữ ID/phiên bản phù hợp để người dùng kiểm tra lại. Không tự ghi là đã hoàn tất 30 đề nếu mới có hướng dẫn, dữ liệu nháp hoặc tài nguyên chưa tích hợp. Tiến độ cụ thể nằm trong checkpoint hiện hành, không chép mốc tiến độ cũ vào yêu cầu lâu dài.

## Nhịp nghe N5 đã được nhà phát hành chốt — 06/10/2026 21:10 JST

Áp dụng cho N5: 2 giây sau lời mở đầu mỗi câu; giữa lượt thoại giữ 0.5 giây; trả lời sau 問題１/２/３/４ lần lượt 12/12/10/8 giây. Bốn giọng và speedScale 0.9 giữ nguyên. Đây là quyết định thiết kế app từ bảng nhịp đã trình, không phải xác nhận bản nghe nguồn bởi con người. Cấu hình thử 1.2/.5/5 giây được giữ làm lịch sử/default cho cấp chưa có nhịp chốt; N5 dùng override `voice-casting.json.levelPacing.n5`. Không áp tự động lịch N5 cho N4–N1. Khoảng chấp nhận thời lượng tổng vẫn chưa có tolerance cố định; phải đo và báo thời lượng thật.

## Nhịp nghe N4 đã chốt — 07/10/2026

Nhà phát hành đã chọn lịch đề xuất trong phiên tiếp tục N4: sau giới thiệu 2 giây; giữa lượt thoại 0.5 giây; trả lời 問題１/２/３/４ lần lượt 12/12/10/8 giây. Giữ speedScale 0.9 và bốn giọng. Override N4 trong voice-casting.json là cấu hình hiện hành cho N4; ghi chú N4 chưa chốt trước đây là lịch sử. Quyết định này là thiết kế app, không phải xác minh nhịp nguồn hay tolerance thời lượng. Không tự áp cho N3–N1.


## Nhịp nghe N3 đã chốt — 07/10/2026

Nhà phát hành đã chọn trực tiếp trong phiên kiểm tra checkpoint: sau giới thiệu 2 giây; giữa lượt thoại 0,5 giây; trả lời 問題１/２/３/４/５ lần lượt 12/12/12/10/8 giây. 問題３ là 概要理解, 問題４ là 発話表現, 問題５ là 即時応答. Giữ bốn giọng, speedScale 0.9, mục tiêu nghe 2400000 ms (40 phút), nhạc không lời đúng 60000 ms sau問題２ trước問題３ và hai thông báo. Đây là nhịp thiết kế app được nhà phát hành chọn, không chứng nhận nhịp nguồn hoặc tolerance. Không tự áp cho N2/N1.
