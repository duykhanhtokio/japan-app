# Tokutei — hồ sơ kiểm chứng phát hành 2026-11-03

Mốc đầu đợt: `f72e3e6cc36c1b407aace4b0e47a23a63ca7cdaa`. Commit chứa thư mục này xác định mốc bàn giao. Sổ chuẩn từng ngành vẫn là nguồn trạng thái nghiệm thu duy nhất. Báo cáo kiểm cấu trúc, tự rà ngữ nghĩa, render host, export và nghiệm thu người thật có phạm vi riêng.

## Kết quả mã nguồn và dữ liệu

- Sáu luồng tự rà bảy ngành, sửa bài/câu/bản dịch/hình có sai khác cụ thể, cập nhật các bằng chứng theo phiên bản Nhật. Không rà chéo nội dung giữa các luồng.
- Nông nghiệp sửa hình nhóm cây ươm giống; Sản xuất sửa các điều kiện bị thiếu trong bản dịch; Khách sạn bổ sung quy trình theo tài liệu cơ sở và điều kiện động đất. Nhà hàng giữ riêng điều kiện mô hình cửa hàng và căn cứ ngoài PDF; Thực phẩm loại yêu cầu tổng hợp lịch sử không có trong nguồn, giữ cảnh báo hiện còn thiếu căn cứ. Điều dưỡng bổ sung quyết định cá nhân và cách giao tiếp phù hợp; Xây dựng giữ mâu thuẫn nguồn trong trạng thái bị chặn.
- Xây dựng hoãn 385 overlay dịch đến lúc truy cập bài. Toàn bộ 385 bài cho kết quả JSON giống cách tải cũ; bài/mã tiến độ, cache đối tượng và quy tắc từ chối bản dịch cũ được kiểm riêng. Host đọc khoảng 37,7→7,9 MB JSON ban đầu. Đây là chẩn đoán module với filesystem ấm, không phải thời gian khởi động điện thoại; chi phí giải nén Metro nằm ngoài phép đo này.
- Metro nén JSON lớn của bảy ngành, `dialogue-content`, `generated` và dữ liệu tự soạn trong `docs/ssw-workspace` khi chúng thuộc đồ thị import. File nguồn giữ nguyên; giải nén đồng bộ khi module được dùng, không có mạng/filesystem/Buffer trên thiết bị. `fflate/browser` được chốt 0.8.2. Các module `jlpt-official`/`jlpt-original` tiếp tục dùng worker Expo mặc định.
- Kiểm tương đương 10.168 module chọn được: 871.082.004 byte JSON nguồn → 234.125.575 byte mã wrapper. Hai số này không phải kích thước APK/IPA hoặc bundle cuối. Giá trị, Unicode và số liệu giữ nguyên. Kiểm worker Expo thực/minify/factory trên web/iOS/Android đạt; đó là phép thử module, không chứng minh app native đã chạy.

## Các điều kiện chưa có bằng chứng đạt

1. Toàn bộ danh mục ý nguồn của cả bảy ngành còn mở; các tỷ lệ bao phủ toàn tài liệu vẫn null. Có kiểm kê/ánh xạ cơ học rộng không đồng nghĩa đã đọc ngữ nghĩa tất cả các ý hoặc mọi bản dịch.
2. Ngữ nghĩa 12 ngôn ngữ được tự rà trong phạm vi receipt từng nhóm; chưa có người bản ngữ hoặc chuyên gia nghiệm thu toàn phạm vi. Furigana mới được kiểm theo ngữ cảnh; lịch sử toàn bộ và phần body Nông nghiệp chưa có bằng chứng hoàn thiện.
3. Các reader/packs đã rà chưa có đủ âm thanh gắn phiên bản để nghiệm thu. Không suy có giọng đọc từ dependency `expo-speech`, số từ, script hoặc JSON. Cần tích hợp audio thực, xác nhận văn bản/giọng/thời lượng và nghe kiểm trước khi đóng.
4. Các ngày được kiểm số liệu/ảnh theo phạm vi ngành; chưa có phiên học thật để chứng minh thời lượng hoặc độ đồng đều. Không dùng số chữ/estimatedMinutes làm số phút đo được.
5. Host Linux không có adb/xcrun hoặc thiết bị thật kết nối. Chromium trong harness bị chặn socket; cloud browser không truy cập được máy chủ cục bộ. Không có bằng chứng pixel trên iOS/Android/web cho đợt này. Checkout này còn 3.511 file pointer LFS; cần materialize binary đúng phiên bản trước khi duyệt hình/âm thanh. Tình trạng file trên Mac phải được kiểm riêng.
6. Các lần export toàn app và kết quả cuối được ghi trong `expo-attempts.json`. Đợt này cả năm lần export đều chưa thành công; đã dừng thử lại tự động. Chỉ trường exportPassed=true kèm snapshot trước/sau khớp mới là export thành công; export JS vẫn không thay cho build cài native, tương tác, âm thanh hoặc máy thật.

Các câu bổ sung Nhà hàng tạo revision/key mới cho đề bổ sung; bản ghi lượt cũ được giữ, chưa có tuyên bố tự động chuyển lượt đang làm sang revision mới. Các câu và ngân hàng nền được kiểm riêng theo receipt.

## Đo một phiên học có người quan sát

`scripts/tokutei-release/learning-session.cjs` ghi thời điểm bắt đầu/tạm dừng/tiếp tục/kết thúc tại máy thử bằng đồng hồ monotonic (kèm thời gian lịch, không cộng sai khi đồng hồ lịch đổi giờ), gắn ngành/ngày/mã người học/mã người quan sát/thiết bị/build SHA và hash nội dung. Công cụ không ghi vào service tiến độ app, không gửi dữ liệu và không tự bật cờ nghiệm thu. Bộ kiểm thử dùng phiên tổng hợp; các kết quả đó không phải thời lượng người học.

Sao chép `learning-session-config.example.json` ra thư mục ghi nhận riêng. Điền mã ẩn danh, SHA40 của build thực sự đang chạy, đúng ngày học và file nội dung hiện hành. Chỉ đặt synthetic=false cho phiên thật được quan sát; giữ đủ thông tin các nội dung bổ sung trong ghi chú. Dùng cùng file phiên cho các lệnh:

```bash
node scripts/tokutei-release/learning-session.cjs start /tmp/observed-session.json /tmp/observed-session-config.json
node scripts/tokutei-release/learning-session.cjs pause /tmp/observed-session.json
node scripts/tokutei-release/learning-session.cjs resume /tmp/observed-session.json
node scripts/tokutei-release/learning-session.cjs finish /tmp/observed-session.json
node scripts/tokutei-release/learning-session.cjs attest /tmp/observed-session.json /tmp/observer-notes.txt
node scripts/tokutei-release/learning-session.cjs summary /tmp/observed-session.json
```

Người quan sát ghi hoạt động đã thực hiện, phần bỏ qua, thời gian gián đoạn, việc dùng dịch/furigana/audio và các file bổ sung đã dùng. Tổng hợp nhiều ngày/người học theo mục tiêu hợp đồng ngành; điều chỉnh nội dung nếu thời lượng lệch. Một phiên đạt không chứng minh mọi ngày đã đồng đều. File ghi nhận chỉ đủ điều kiện đưa ra rà soát, các cờ nghiệm thu vẫn false đến khi có bằng chứng được kiểm đúng phạm vi.

## Kiểm chứng trên Mac và thiết bị

Đồng bộ bằng `scripts/sync-tokutei-mac.sh`, rồi chạy `npm ci` vì đợt này thêm dependency giải nén. Giữ dữ liệu học cũ và dùng hồ sơ người học thử riêng. Chạy export từng platform với một worker, lưu log/môi trường và SHA build. Tiếp tục chạy app trên iPhone/Android thật, kiểm mở ngành/ngày, hình, đổi ngôn ngữ, furigana, trả lời/nộp/mở lại, âm thanh và lưu/khôi phục tiến độ. Ghi thiết bị/OS và ảnh minh chứng theo từng phép thử; build/export không đủ để đóng máy thật.

Người bản ngữ/chuyên gia dùng `human-review-template.json`: điền năng lực người rà, ID ý/bài/ngôn ngữ, hash nội dung, ngày và phát hiện/kết luận. Template trống không phải bằng chứng. Không nâng một kết luận trong phạm vi hẹp thành nghiệm thu toàn ngành. Chỉ cập nhật reviewEvidence trong sổ chuẩn sau khi có chứng cứ thực sự và validator chấp nhận.

Log chẩn đoán được lưu nguyên byte và SHA-256, gồm khoảng trắng do Node/Metro phát ra; kiểm whitespace được miễn riêng cho thư mục log sinh tự động này. Kiểm mã nguồn và các thay đổi còn lại vẫn áp dụng bình thường.
