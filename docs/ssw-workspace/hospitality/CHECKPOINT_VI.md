# Tiến độ khách sạn —2026-10-31

## Phạm vi đã triển khai

- Hai nguồn Nhật52+65=117trang; đã rà văn bản và trực quan117/117. 94trang thuộc phạm vi kiến thức, các trang khác có lý do phân loại riêng trong page-audit.json.
-38ngày học;474mã kiến thức;621liên kết kiến thức–nguồn. Đây là bằng chứng biên soạn AI, không phải nghiệm thu chuyên gia hay chứng nhận không còn thiếu ý.
-166câu kiểm tra độc lập và2bài tổng hợp25câu/cấp (chọn lại từ ngân hàng đã dạy, không tính thêm thành câu mới). Không tuyên bố cấu trúc đề thi chính thức.
-38PNG tự dựng có byte thật, đăng ký theo ngày. Đã kiểm tra contact sheet; trình đọc có nút phóng to. Chưa duyệt chuyên môn hình ảnh.
-Tích hợp thẻKhách sạn→route riêng→chọn1号/2号→bài/ngày→kiểm tra→nộp→giải thích→hoàn thành; chế độ nội bộ __DEV__, chưa mở phát hành.
-Tiếng Nhật trước, bản dịch bámrevision. Snapshot hiện có233/456cặp bài–ngôn ngữ; chi tiết ở translation-status.json. Dịch AI chưa duyệt bản ngữ.

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
