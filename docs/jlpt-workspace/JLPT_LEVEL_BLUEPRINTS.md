# BỐ CỤC CHI TIẾT N5–N1 — 6 ĐỀ ĐẦU MỖI CẤP

**Bắt buộc đầu mỗi phiên soạn JLPT:** đọc lại toàn bộ `docs/AI_SESSION_START_HERE.md`, `AGENTS.md`, `docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_RULES.md` và bản cấu trúc này trước khi tạo hoặc sửa nội dung. Không thay việc đọc bằng trí nhớ, bản tóm tắt hoặc chỉ đọc một tài liệu. Bản quy tắc chính và bản cấu trúc là hai tài liệu biên soạn bắt buộc đọc đồng thời. Nếu có mâu thuẫn ảnh hưởng đến triển khai, dừng phần liên quan và xác nhận với nhà phát hành; không tự đoán.

Chuẩn triển khai: cấu trúc 第3回 của từng cấp trong dữ liệu hiện có, chỉ lấy metadata. Giữ nguyên số câu của mẫu dự án; không tuyên bố đây là số câu cố định của mọi kỳ JLPT hiện hành. Sáu đề mới của mỗi cấp dùng cùng blueprint, nội dung được nghĩ độc lập.

Đếm đơn vị chấm điểm, không đếm số file audio: một hội thoại tổng hợp có thể phục vụ nhiều câu hỏi độc lập. Không tự tách hoặc gộp để đổi số câu. Với N1/N2 統合理解, phải soạn tình huống tổng hợp, giữ các câu phụ có liên quan và ID/đáp án riêng; không biến thành các câu ngắn độc lập.

Nguồn thời gian và kỹ năng: https://www.jlpt.jp/e/guideline/testsections.html ; nguồn loại bài nghe: https://www.jlpt.jp/e/samples/sampleindex.html . Hai nguồn chỉ được dùng để phân tích metadata về thời gian, phần thi và loại kỹ năng. Không lấy câu hỏi, lựa chọn, đáp án, bài đọc, kịch bản nghe, hình hoặc audio; không dùng nội dung các PDF hay tài nguyên đề mẫu liên kết làm đầu vào soạn đề. Chỉ được phân tích tín hiệu/thời gian của audio tham chiếu trong phạm vi đã được nhà phát hành cho phép riêng, không lấy nội dung. Các giá trị máy đọc dùng `src/data/jlpt-original/authoring-blueprints.json`.

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

## Mức độ theo cấp

- N5: tình huống quen thuộc, câu đơn giản, thông tin cụ thể, hội thoại ngắn rõ ràng; không kéo thành hội thoại cao cấp chỉ để đủ phút.
- N4: tình huống đời sống thường ngày, trình tự/điều kiện cơ bản, các đoạn đọc và nghe dài hơn N5 nhưng vẫn có mạch rõ.
- N3: kết nối thông tin đời sống, phân biệt ý chính/chi tiết, theo dõi lý do và diễn biến, đọc dài và nghe khái quát.
- N2: văn bản và hội thoại tự nhiên về đời sống/xã hội/công việc, sắc thái và quan hệ lập luận, tích hợp nhiều nguồn hoặc nhiều người.
- N1: văn bản phức tạp, trừu tượng, hàm ý, lập luận, mục đích và sắc thái; nghe tổng hợp với diễn biến/lựa chọn cần kết nối thông tin. Không dùng ngôn ngữ khó tùy tiện hoặc tình huống đánh đố.

## Cách tổ chức kỹ năng nghe

- 課題理解: xác định hành động/nhiệm vụ tiếp theo từ diễn biến, điều kiện, thay đổi ý.
- ポイント理解: tìm thông tin cụ thể được hỏi, phân biệt thông tin liên quan với thông tin phụ.
- 概要理解: nghe toàn đoạn để hiểu chủ đề, mục đích hoặc ý chính; không thay bằng câu chỉ tìm số/tên.
- 発話表現: hình/tình huống giao tiếp và các phát ngôn; tạo hình mới bằng kỹ năng tạo ảnh.
- 即時応答: một phát ngôn và các phản hồi nghe, chọn phản hồi tự nhiên.
- 統合理解: nối thông tin giữa người nói/điều kiện/quyết định, bao gồm các đơn vị câu hỏi phụ theo mẫu.

Tùy dạng, phương án có thể được in hoặc chỉ đọc. Lập bản đồ hiển thị/đọc từ metadata tổ chức mẫu trước khi xuất đề; không hiện nội dung lựa chọn vốn chỉ nghe trong UI trước khi người chơi trả lời. Không tự thêm lượt phát lại.

## Phân bố đáp án cho mỗi cấp

Cân bằng riêng tập câu có 3 và 4 lựa chọn; mỗi vị trí nhận floor(n/k) hoặc ceil(n/k). Phần dư luân chuyển giữa các đề, không cố định. Toàn bộ yêu cầu chống quy luật trong tài liệu hướng dẫn chính vẫn áp dụng. Cân bằng theo phần khi khả thi, không làm sai quota toàn tập và không áp một quota N5 cho các cấp khác.

## Nhịp nghe N5 đã được nhà phát hành chốt — 06/10/2026 21:10 JST

Áp dụng cho N5: 2 giây sau lời mở đầu mỗi câu; giữa lượt thoại giữ 0.5 giây; trả lời sau 問題１/２/３/４ lần lượt 12/12/10/8 giây. Bốn giọng và speedScale 0.9 giữ nguyên. Đây là quyết định thiết kế app từ bảng nhịp đã trình, không phải xác nhận bản nghe nguồn bởi con người. Cấu hình thử 1.2/.5/5 giây được giữ làm lịch sử/default cho cấp chưa có nhịp chốt; N5 dùng override `voice-casting.json.levelPacing.n5`. Không áp tự động lịch N5 cho N4–N1. Khoảng chấp nhận thời lượng tổng vẫn chưa có tolerance cố định; phải đo và báo thời lượng thật.

## Nhịp nghe N4 đã chốt — 07/10/2026

Nhà phát hành đã chọn lịch đề xuất trong phiên tiếp tục N4: sau giới thiệu 2 giây; giữa lượt thoại 0.5 giây; trả lời 問題１/２/３/４ lần lượt 12/12/10/8 giây. Giữ speedScale 0.9 và bốn giọng. Override N4 trong voice-casting.json là cấu hình hiện hành cho N4; ghi chú N4 chưa chốt trước đây là lịch sử. Quyết định này là thiết kế app, không phải xác minh nhịp nguồn hay tolerance thời lượng. Không tự áp cho N3–N1.
