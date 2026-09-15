# JLPT mock-test + full JMdict dictionary pack (N1–N5)

## Cách chèn

1. Giải nén gói này tại thư mục gốc của dự án Japan App.
2. Cho phép ghi đè các tệp trùng tên trong `src/`.
3. Đảm bảo dự án đã có `expo-speech` và `@react-native-async-storage/async-storage` (mã nguồn gốc đang dùng cả hai).
4. Cài SQLite đúng phiên bản Expo của dự án: `npx expo install expo-sqlite`.
5. Chạy kiểm tra TypeScript/build của dự án đầy đủ, rồi mở `/{level}/test` với `level` là `N1` đến `N5`. Từ màn `JLPT 学習`, chọn thẻ `日本語辞書` để mở từ điển.

Gói chứa phần thay đổi và cơ sở dữ liệu JMdict SQLite đầy đủ. Sau khi giải nén, `assets/jmdict/jmdict.db` có dung lượng khoảng 96 MB; file ZIP nhỏ hơn nhờ nén.

## Kho từ điển đầy đủ

- 218.577 mục JMdict tiếng Anh, ngày dữ liệu 2026-08-24.
- Tìm theo kanji, kana hoặc nghĩa tiếng Anh; kết quả tải từng trang 50 mục.
- SQLite + FTS5: không nạp toàn bộ từ điển vào RAM và không nhúng JSON 118 MB vào JavaScript bundle.
- Mỗi mục giữ `JMdict sequence`, các biến thể cách viết/cách đọc, nhiều nghĩa, loại từ, lĩnh vực và nhãn sử dụng.
- Kho học JLPT 8.350 mục được giữ riêng. JMdict không tự gán N5–N1 nên kết quả từ điển không bị gắn cấp độ giả.
- Nguồn và giấy phép hiển thị trong màn hình từ điển; xem `JMDICT-LICENSE.md`.

Để cập nhật định kỳ, tải bản `jmdict-eng-*.json.zip` mới rồi chạy:

```bash
python3 scripts/build-jmdict-database.py /đường/dẫn/jmdict-eng-*.json.zip
```

Sau đó build/phát hành lại app. Script từ chối bản `common-only` và ghi ngày, phiên bản, số mục mới vào database.

## Phạm vi

- Một đề mẫu cho mỗi cấp N1, N2, N3, N4, N5.
- Số câu theo `構成.pdf`: 108, 107, 102, 98, 91.
- Mỗi câu nghe đọc chính câu hỏi in đậm (`question.prompt`) trước, nghỉ đúng 3 giây rồi mới đọc hội thoại (`audioScript`); transcript chỉ xuất hiện sau khi nộp.
- Cuộn dọc và tải dần câu hỏi.
- Khi chuyển môn, danh sách được đưa về đầu phần mới.
- Nút `前の試験科目へ` quay lại đúng vị trí cuộn đã rời khỏi; thời gian của phần cũ không bị đặt lại.
- Vị trí đáp án đúng được cân bằng 1–4 ở mức xấp xỉ 25% mỗi vị trí.
- Có đáp án, giải thích, điểm từng phần và điều kiện đỗ.
- Kết quả từng kỹ năng dùng ngôn ngữ mẹ đẻ trong `LanguageContext` và hiển thị số câu đúng/tổng câu; không hiển thị `基準`.
- Điểm hiển thị là điểm quy đổi ước tính theo tỉ lệ đúng. JLPT không công bố dữ liệu hiệu chỉnh câu hỏi nên không phần mềm ngoài nào có thể tái tạo chính xác điểm scale chính thức.

## Tệp chính

- `src/data/jlpt-mock/official-structure.ts`: cơ cấu từng cấp.
- `src/data/jlpt-mock/sample-exam-factory.ts`: tạo đề N1–N4 từ ngân hàng có sẵn.
- `src/data/jlpt-mock/n5-test-01-*.ts`: đề N5 biên soạn chi tiết.
- `src/components/jlpt/JlptMockTest.tsx`: luồng thi, thời gian, nộp và kết quả.
- `src/components/jlpt/JlptQuestionFeed.tsx`: giao diện cuộn dọc.
- `src/components/jlpt/JlptAudioButton.tsx`: phát bài nghe.

## Kết quả kiểm tra trước khi đóng gói

| Cấp | Tổng câu | ID duy nhất | Câu nghe có script/transcript |
|---|---:|---:|---:|
| N1 | 108 | 108 | 37/37 |
| N2 | 107 | 107 | 32/32 |
| N3 | 102 | 102 | 28/28 |
| N4 | 98 | 98 | 28/28 |
| N5 | 91 | 91 | 24/24 |

Kiểm tra TypeScript cho toàn bộ lớp dữ liệu: đạt. Kiểm tra bundle màn hình thi: đạt.

## Thời gian

- N5: 20 + 40 + 30 = 90 phút.
- N4: 25 + 55 + 35 = 115 phút.
- N3: 30 + 70 + 40 = 140 phút.
- N2: 105 + 50 = 155 phút.
- N1: 110 + 60 = 170 phút.

Màn hình hiển thị đồng thời thời gian còn lại của môn hiện tại và toàn bài.

## Ngôn ngữ kết quả

Màn hình kết quả tự đọc lựa chọn ngôn ngữ đã lưu tại `@japan_app_language`. Bản dịch đã có cho toàn bộ mã ngôn ngữ hiện tại: `ja`, `en`, `vi`, `id`, `zh-CN`, `zh-TW`, `hi`, `bn`, `ne`, `my`, `th`, `km`, `tl`. Cả thẻ điểm lẫn các nhãn đúng/sai, câu trả lời của bạn, đáp án đúng, chưa trả lời và nội dung bài nghe đều dùng ngôn ngữ này.

## Kiểm tra hồi quy bản sửa v8

- Trình tự audio bằng driver giả lập: `stop hoàn tất → prompt in đậm → pause 3000 ms → audioScript`: đạt.
- Hợp đồng bản dịch: 13 ngôn ngữ × 15 trường bắt buộc, không có trường rỗng: đạt.
- `LanguageProvider` bọc toàn bộ router và màn đăng ký gọi `setLanguage`: đạt.
- Bundle toàn bộ màn hình JLPT: đạt.
- 25/25 câu lắp ghép có ★ tại vị trí 1–3; số câu đặt ★ cuối chuỗi: 0.
- Câu điền ngữ pháp thiếu ngoặc: 0; câu còn lộ đáp án trong thân đề: 0.
- Điểm nửa số câu đúng được quy đổi khoảng 88–89/180 thay vì dùng raw correct count.
- Đã loại bỏ 1.650 cụm động từ sinh tự động của v7; không còn tính cụm ghép máy là từ độc lập.
- 単語 học JLPT: giữ 8.350 mục có phân cấp hiện tại và tự tải khi cuộn.
- 日本語辞書: 218.577/218.577 entry, 498.621 dạng chữ/cách đọc, 218.577 bản ghi tìm kiếm tiếng Anh.
- `PRAGMA integrity_check`: `ok`; tìm kiếm thử bằng `日本`, `にほん` và từ khóa tiếng Anh: đạt.
- Bundle màn danh sách từ điển, chi tiết từ điển, màn học và màn thi: đạt.
- 文法: 540 mẫu; số mẫu thiếu nghĩa/cấu trúc/ví dụ sau bổ sung: 0.
- 聴解: câu hỏi thay đổi theo 課題理解・ポイント理解・概要理解・発話表現・即時応答・統合理解.

## Khóa đáp án và thang điểm

Khóa đáp án không còn dùng phép chia dư `questionIndex % 4`. Xem báo cáo đầy đủ trong `ANSWER-KEY-REPORT.md`. Điểm tổng được khóa ở thang 0–180; cấu hình từng phần phải cộng đúng 180, nếu sai ứng dụng sẽ báo lỗi khi kiểm định.

## Giọng đọc đính kèm

Tệp MP3 26,67 giây là một bản ghi âm tham chiếu, không phải mô hình tổng hợp giọng và không thể tự đọc các script mới. Bản này đã hoàn thiện thứ tự “đọc câu hỏi → nghỉ 3 giây → đọc nội dung” bằng bộ đọc hệ thống. Muốn phát đúng giọng MP3 tham chiếu cho mọi câu, cần tạo riêng tệp âm thanh hoàn chỉnh cho từng câu bằng dịch vụ/engine nhân bản giọng có sự đồng ý của chủ giọng, rồi thay lớp phát âm thanh hệ thống bằng các asset đó.
