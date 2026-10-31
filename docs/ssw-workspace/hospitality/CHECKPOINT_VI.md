# Tiến độ khách sạn —2026-10-31

## Phạm vi đã triển khai

- Hai nguồn Nhật52+65=117trang; đã rà văn bản và trực quan117/117. 94trang thuộc phạm vi kiến thức, các trang khác có lý do phân loại riêng trong page-audit.json.
-38ngày học;474mã kiến thức;621liên kết kiến thức–nguồn. Đây là bằng chứng biên soạn AI, không phải nghiệm thu chuyên gia hay chứng nhận không còn thiếu ý.
-166câu kiểm tra độc lập và2bài tổng hợp25câu/cấp (chọn lại từ ngân hàng đã dạy, không tính thêm thành câu mới). Không tuyên bố cấu trúc đề thi chính thức.
-38PNG tự dựng có byte thật, đăng ký theo ngày. Đã kiểm tra contact sheet; trình đọc có nút phóng to. Chưa duyệt chuyên môn hình ảnh.
-Tích hợp thẻKhách sạn→route riêng→chọn1号/2号→bài/ngày→kiểm tra→nộp→giải thích→hoàn thành; chế độ nội bộ __DEV__, chưa mở phát hành.
-Tiếng Nhật trước, bản dịch bámrevision. Snapshot hiện có215/456cặp bài–ngôn ngữ; chi tiết ở translation-status.json. Dịch AI chưa duyệt bản ngữ.

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
