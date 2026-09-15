# JAPAN APP - JLPT N1 BATCH 01 SESSION CHECKPOINT

Ngày cập nhật: 2026-09-13

## Phạm vi đã duyệt

- `n1-2012-12-exam-02`
- `n1-2013-07-exam-03`
- `n1-2013-12-exam-04`
- Chỉ dùng đúng ba file nguồn đã duyệt trong từng thư mục và đúng SHA-256 trong manifest.
- Không dùng PDF tổng hợp hoặc ZIP làm nguồn nội dung.

## Dữ liệu trung gian đã hoàn thành

| Công đoạn | Trạng thái | Ghi chú |
|---|---|---|
| Kiểm kê/duyệt nguồn | `completed` | Không chạy lại |
| Render ảnh PDF | `completed` | 83 trang |
| Apple Vision OCR | `completed` | 83/83 trang |
| Sao chép audio được duyệt | `completed` | 3 file; nguồn không đổi |
| Whisper cục bộ | `completed` | Đủ 3 đề; không chạy lại |
| Duyệt audio N1 12/2012 | `completed` | 35/35 đạt; `n1-2012-12-p2-q06` đã sửa và nghe xác nhận tại 1331.320s-1396.240s |
| Trích xuất phần viết N1 12/2012 | `completed` | Đủ 70/70 câu, 問題1-13, passage và đáp án đã cấu trúc hóa, đối chiếu ảnh đề và trang đáp án 1 |
| Cấu trúc phần nghe N1 12/2012 | `in_progress` | Đã đủ 36 đơn vị trả lời, 35 segment và đáp án; transcript còn cần đối chiếu nguyên văn |
| Tích hợp app | `pending` | Chỉ làm sau khi dữ liệu đạt kiểm chứng |

## Trạng thái sau lượt tiếp tục mới nhất

- Phần viết N1 12/2012: `70/70 verified`, `問題1-13`, 13 passage.
- File hợp nhất: `n1-2012-12-written-70.verified.json`.
- Audio timing: `35/35 verified`.
- Đã cấu trúc hóa đủ 36 đơn vị trả lời nghe từ 35 segment; `問題5・3番` có hai câu cùng tham chiếu `n1-2012-12-p5-q03`.
- Đã liên kết đủ lựa chọn và 36/36 đáp án; kiểm tra không có đáp án nằm ngoài danh sách lựa chọn.
- File đang duyệt: `n1-2012-12-listening-36.review.json`.
- Mục `in_progress`: chép và đối chiếu nguyên văn transcript từ ảnh PDF đáp án/script trang 7-13. Hiện 36/36 mục còn `transcriptVerificationStatus: needs_review`, vì vậy chưa được gắn nhãn bộ đề hoàn chỉnh.
- Chưa tích hợp vào app vì phần nghe và phần chữa bài chưa hoàn thành.

## Lỗi công cụ duyệt audio và cách sửa

Công cụ cũ dùng `input()` trong Python được truyền bằng heredoc nên `stdin` đã chạm EOF. Lỗi xảy ra ngay tại đoạn:

`1/35 n1-2012-12-p1-q01 | 16.440s -> 106.320s`

Không có đoạn nào được xác nhận. File kết quả có thể tồn tại nhưng phải coi đoạn 1 vẫn là `pending`.

Công cụ thay thế: `DUYET_AUDIO_N1_2012_12_V2.command`.

- Đọc lựa chọn qua `/dev/tty`, không dùng stdin của heredoc.
- Kiểm tra SHA-256 MP3 trước khi chạy.
- Tự lưu nguyên tử sau từng đoạn.
- Tự tiếp tục từ đoạn `pending` đầu tiên.
- Không sửa, cắt hoặc chuyển mã file MP3 nguồn.
- 35 mốc hiện tại chỉ là mốc sơ bộ từ Whisper, bắt buộc nghe duyệt.
- Đã sửa thêm lỗi tương thích `ffplay`: không truyền `-nostdin`; stdin của tiến trình phát được nối với `subprocess.DEVNULL` để không chiếm bàn phím Terminal.

## Mục in_progress cần tiếp tục

1. Tiếp tục từ `n1-2012-12-listening-36.review.json`.
2. Chép transcript chính thức từ ảnh PDF đáp án/script trang 7-13, không lấy Whisper hoặc OCR làm nguồn chính thức.
3. Đối chiếu từng prompt/lựa chọn với trang đề 13-14 và từng đáp án với trang đáp án 1.
4. Chỉ sau khi 36/36 transcript đạt `verified`, tạo canonical `n1-2012-12-listening-36.verified.json`.
5. Liên kết phần giải đáp; nếu nguồn không có lời giải cho nghe thì phải ghi trạng thái thiếu, không tự sinh lời giải.
6. Sau khi N1 12/2012 hoàn tất, mới tích hợp app rồi chuyển lần lượt sang N1 07/2013 và N1 12/2013.

### Điểm tiếp tục chính xác của phần viết

- File dữ liệu từng phần: `n1-2012-12-written-verified-part-01.json`.
- File phần 1: `n1-2012-12-written-verified-part-01.json` (câu 1-19).
- File phần 2: `n1-2012-12-written-verified-part-02.json` (câu 20-40).
- File phần 3: `n1-2012-12-written-verified-part-03.json` (passage `大人時間`, câu 41-45).
- File phần 4: `n1-2012-12-written-verified-part-04.json` (問題8-9, câu 46-58).
- File phần 5: `n1-2012-12-written-verified-part-05.json` (問題10-13, câu 59-70).
- Đã hoàn thành và đánh dấu `verified`: câu 1-70.
- Điểm tiếp tục mới: đối chiếu nguyên văn transcript cho 36 record trong `n1-2012-12-listening-36.review.json`.
- Không trích xuất lại câu 1-70 trừ khi kiểm tra tự động phát hiện mâu thuẫn.

## Kết quả audio người dùng gửi lại

- JSON đúng `examId`, đúng SHA nguồn, đủ 35 ID duy nhất và không có mốc số học bất hợp lệ.
- 35 record mang trạng thái `verified`, nhưng record `n1-2012-12-p2-q06` còn ghi chú `lệch đầu lệch cuối`.
- Vì nội dung ghi chú mâu thuẫn với trạng thái, checkpoint không được coi audio là 35/35 hoàn tất.
- Mốc cũ của record này: `1271.060s -> 1422.320s`.
- Đối chiếu kết quả Whisper hiện có với script PDF cho thấy câu 6 bắt đầu gần `1331.320s`, câu hỏi lặp kết thúc gần `1396.240s`, và câu 7 bắt đầu ở `1422.320s`.
- Dùng `SUA_RIENG_AUDIO_N1_2012_12_P2_Q06.command` để nghe xác nhận đúng một record; 34 record khác không bị chạy lại.

## Xác nhận cuối audio N1 12/2012

- File nhận lại: `N1_2012_12_AUDIO_REVIEW(1).json`.
- `examId`: `n1-2012-12-exam-02`.
- SHA-256 audio nguồn: khớp manifest đã duyệt.
- Segment: 35/35 `verified`, 35 ID duy nhất, không có mốc đầu-cuối bất hợp lệ.
- `n1-2012-12-p2-q06`: `1331320ms -> 1396240ms`, đã nghe và xác nhận lại.
- Phần audio N1 12/2012 đủ điều kiện chuyển sang `completed`.

## Lệnh tiếp tục ở phiên sau

`Tiếp tục Japan App từ JAPAN_APP_JLPT_BATCH_01_SESSION_CHECKPOINT_2026-09-13.md. Không chạy lại kiểm kê, OCR hoặc Whisper. Tiếp tục đúng mục in_progress.`

## Điều kiện không được báo hoàn thành

- Chưa đủ câu viết được đối chiếu ảnh nguồn.
- Chưa đủ audio segment được nghe và xác nhận đầu/cuối.
- Còn `pending`, `flagged`, `needs_review` hoặc `unreadable`.
- Chưa tích hợp và chưa kiểm thử thực tế trên Simulator.
