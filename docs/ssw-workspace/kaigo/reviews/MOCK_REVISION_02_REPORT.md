# Hai đề Kaigo đầu tiên — sửa bản thảo 2, 2026-10-07

Trạng thái: **NOT_READY_FOR_INTEGRATION**. Đã rà AI cả 60 câu và sửa thân câu hoặc lựa chọn ở 57 câu: 42 câu kỹ năng, 15 câu tiếng Nhật. Đây là bản 2 của hai đề đầu tiên, không phải hai đề mới. Ba câu kỹ năng q15, q16, q22 giữ nội dung; furigana của 一時的 ở q15 được sửa theo ngữ cảnh.

Giữ 60 ID, thứ tự, vị trí đáp án đúng, điểm luyện tập 1/0, cơ cấu phần thi, thời gian dự kiến và chính sách đã chốt. Kỹ năng vẫn 45 câu/60 phút, quota 10/6/4/20/5; tiếng Nhật vẫn 15 câu/30 phút, quota 5/5/5. Mỗi đề có phân bố vị trí đúng chênh tối đa một và không ba vị trí giống liên tiếp. Chính sách resume, chấm điểm và nộp bài vẫn là đặc tả; chưa có runtime thực thi. Khi tích hợp, phải khóa snapshot/version của phiên làm bài để không ghép đáp án bản 1 vào nội dung bản 2.

## Nội dung thay đổi

| Câu | Thay đổi và mục đích |
|---|---|
| Kỹ năng q03 | Chuyển câu chọn áo sang nhận biết bước đánh giá trong quá trình chăm sóc. |
| Kỹ năng q05 | Chuyển câu riêng tư sang vệ sinh tay sau tháo găng chăm sóc bài tiết; không hướng dẫn kỹ thuật thay tã hoặc chọn thuốc. |
| Kỹ năng q33 | Kiểm chức năng quần áo đối với thân nhiệt và bảo vệ da, giảm lặp năng lực chọn áo. |
| Kỹ năng q40 | Thu hẹp câu môi trường chung thành kiểm chất liệu và ký hiệu trước giặt. |
| Kỹ năng q07/q14/q23/q26/q38 | Viết nhiễu trong cùng nhóm khái niệm: loại lạm dụng, chức năng nhận thức, tình trạng cơ thể, giai đoạn ăn và ADL/IADL. |
| Nhật q10/q15 | Tách suy luận “chưa xác nhận” lặp lại sang đọc thứ tự công việc và phân công người phụ trách. |
| Nhật q14 | Đọc thực đơn dự kiến tự soạn: món tinh bột, món chính, món phụ; không suy ra đã phục vụ hoặc phù hợp từng cá nhân. |

Những câu còn lại được sửa lựa chọn để bám cùng ngữ cảnh, giữ nghĩa đáp án độc nhất ở mức rà AI và giảm tín hiệu từ độ dài/từ tuyệt đối. Câu lạm dụng không coi các loại lạm dụng khác là được phép. Câu nhận biết tình trạng cơ thể không chẩn đoán một người. Những câu chuẩn tắc vẫn có nguy cơ dễ loại nhiễu; chưa có thử nghiệm chứng minh độ khó hay độ phân biệt.

## Dấu hiệu độ dài

Đếm Unicode codepoint của lựa chọn Nhật sau bỏ khoảng trắng. “Cùng độ dài” nghĩa có lựa chọn khác bằng độ dài đáp án đúng, không nhất thiết cùng cực trị. Không dùng bảng này làm chứng nhận chất lượng đề.

| Đề | Đúng dài nhất duy nhất trước → sau | Đúng ngắn nhất duy nhất sau | Ở giữa sau | Cùng độ dài sau |
|---|---:|---:|---:|---:|
| Kỹ năng, 45 câu | 27 → 10 | 4 | 6 | 25 |
| Tiếng Nhật, 15 câu | 12 → 5 | 4 | 2 | 4 |

Đã kiểm cả phía ngắn nhất để tránh tạo dấu hiệu đoán mới khi rút ngắn đáp án đúng. Các câu dài nhất còn lại được giữ theo nhu cầu diễn đạt; cần kiểm bằng người học. Không sửa vị trí đúng để đạt bảng này.

## Nguồn, bản dịch và cách đọc

PDF giáo trình tháng 3/2025 khớp SHA-256 `997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54`. Đọc text-layer các đoạn khái niệm phụ thuộc của câu; đọc lại phần bị thiếu do hiển thị batch bị cắt. Trang in/PDF giữ chênh +2. Không ghi đã xem hình toàn bộ sách hoặc dùng bộ câu hỏi gốc. Câu q05 còn đối chiếu [hướng dẫn MHLW bản thứ ba, tháng 9/2023](https://www.mhlw.go.jp/content/12300000/001155694.pdf), trang in 28/PDF 30; metadata lưu URL, ngày truy cập và phạm vi sử dụng.

Đối chiếu toàn bộ 60 câu Nhật–Việt, 240 lựa chọn và 240 lý do theo đúng vị trí. Sửa 食器 ở q27 thành “đồ đựng”, sửa những lý do không còn khớp nhiễu và trình bày lại các đoạn đọc Việt. Dịch, lý do và chú giải chỉ được hiển thị sau nộp theo đặc tả; chưa có app kiểm cổng hiển thị.

Inventory bản 2 có 638 surface, đã rà AI trong ngữ cảnh. Kiểm phục hồi đúng text, mọi run có kanji đều có kana và những cụm dễ sai: 十月二十九日, 一日, 一時的, 使用後, 終了後, 移動後, 到着後, 長時間, 手指衛生, 歯磨き粉, 田中, 岸本. Chưa có duyệt phát âm/ngữ pháp bởi người bản ngữ.

## Bằng chứng và kiểm tra

`mock-revision-02-changes.json` lưu 57 câu trước/sau, hash canonical của câu hiện tại, baseline ID/khóa/chính sách và ba câu giữ nội dung. Hash của hai đề, hỗ trợ Việt, inventory và báo cáo tuần 8 được khóa vào manifest. Có 30 hash nội dung giữ nguyên, gồm các file bài học liên quan và năm SVG; không ghi đã render lại hình trong lần này. Không thêm bài học: toàn khóa vẫn 54 bài thường, 270 câu kiểm bài và 60 câu đề.

Các lệnh kiểm tra:

```sh
node scripts/check-kaigo-week8-draft.mjs --write-report
node scripts/check-kaigo-mock-revision-02.mjs
node scripts/check-kaigo-course-review-package.mjs
git diff --check
```

Các kiểm tra đầu xác nhận cấu trúc, chính sách, vị trí đáp án, liên kết, hash, cổng duyệt và furigana; không tự chứng minh diễn đạt đúng chuyên môn. Không cần kiểm UI/JLPT vì cụm này không sửa phần đó.

Screen hiện tại: 12.162 trường ngôn ngữ, 2.890 trường có ít nhất 60 ký tự chuẩn hóa, 0 trường khớp cửa sổ 60 ký tự với text-layer 276 trang PDF nêu trên. Đây là so trùng chữ NFKC/bỏ khoảng trắng, không kiểm trùng ý, hình, nguồn khác hoặc quyền sử dụng. Các số của screen bản trước là lịch sử.

## Việc còn lại

Ma trận vẫn có 28 nhóm tổng hợp AI; thêm q03/q05 không tạo bài về quá trình chăm sóc hoặc kiểm soát nhiễm khuẩn. Các khoảng trống về sức khỏe nhân viên, dịch vụ, khẩn cấp, cơ chế và kỹ thuật hỗ trợ vẫn phải xử lý trong tám tuần với kiểm nguồn, chiều sâu và tải học. q29/q43 vẫn cùng năng lực riêng tư ở hai dạng; q20/q32/Nhật q12 vẫn có phần suy luận dữ kiện gần nhau.

114 đơn vị trong worklist chưa có người ký; bản sửa hiện tại được nhận diện bằng version/hash và snapshot audit mới. Human/domain/native/publisher/rights/runtime/release giữ false. Thời gian làm bài 60/30 phút và tổng lịch 1.710 phút chưa được đo. Bước tiếp theo là bổ sung những khoảng trống ưu tiên trong lịch tám tuần và chuẩn bị duyệt; không tự thêm tuần 9, đề mới hoặc phát hành.
