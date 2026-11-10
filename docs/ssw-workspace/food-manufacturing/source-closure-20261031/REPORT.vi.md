# Thực phẩm — đối chiếu và bổ sung nguồn, 31/10/2026

Đây là checkpoint thực thi, chưa phải chứng nhận hoàn tất sáu bước hoặc bao phủ toàn nguồn.

## Đã thực hiện

1. Hợp nhất sáu hồ sơ lịch sử thành `ledger.json`: 381 bản ghi và 251 trang, giữ riêng `before`, `after`, nguồn, bằng chứng bài/câu và đề xuất bổ sung. Không suy diễn đã phủ từ khoảng trang. Một số bản ghi lịch sử vẫn ở mức tổng hợp theo trang, đặc biệt phần5; chưa hoàn tất phân rã nguyên tử toàn nguồn. `fullAtomicSourceDecompositionComplete=false`.
2. Tải lại đúng hai PDF từ bản người dùng cung cấp; SHA256 khớp nguồn1号5.1 (86trang) và2号3.01 (165trang). Render và xem76trang trước đây chưa có bằng chứng:26trang bìa/mục lục/phân cách/chỉ mục,50trang nội dung hoặc tình huống. `visual-review.json` ghi từng trang, hash render và nhận xét. Phương pháp xem là bảng ghép4trang, mỗi trang890px, kết hợp đọc nội dung; không gọi đây là duyệt chuyên môn mọi pixel.175trang còn lại kế thừa bằng chứng lịch sử, không tuyên bố đã xem lại trong lượt này. Không đưa PDF, bản trích hay ảnh trang nguồn vào Git.
3. Soạn4phần độc lập và gắn vào Reader thật, với hash bài nền: người sử dụng/sau mở (`food-2-012`), khả năng xảy ra theo bảo vệ (`047`), luồng/ranh giới/CCP (`041`), thứ tự và phân công vệ sinh (`040`). Giữ toàn bộ nội dung/hash bài gốc,848câu, đề và dịch vụ lưu tiến độ. Phần rủi ro phân biệt rõ bài tập phép nhân độc lập với bảng tra của tài liệu gốc.
4. Đọc lại18bài bổ sung/68đoạn; xác nhận được nạp qua supplemental.ts và index.ts. Ghi80quyết định cụ thể cho những thiếu sót lịch sử:67đã rà lại phần dạy,9còn kiểm tra hình,4có phần mới nhưng vẫn cần đối chiếu hình/câu kiểm tra. Các quyết định này không có nghĩa đóng80trang hay chứng nhận toàn bộ kiến thức của mục nguồn.301bản ghi khác vẫn chờ kết luận rà lại; phần lớn kế thừa mục đã phủ hoặc tham chiếu, không đồng nghĩa301thiếu sót.
5. Kiểm kê và kiểm tra cấu trúc848câu: ID, bốn lựa chọn khác nhau, chỉ số đáp án, bốn lý do, nguồn/trang và hash nội dung. `question-audit.json` cố ý giữ duyệt nghĩa câu dẫn/đáp án/tất cả phương án theo nguồn là pending. Rà18mục thiếu tag trực tiếp: ghi9nhóm câu liên quan có đọc nội dung và giới hạn của từng quan hệ;9mục chưa xác định được liên kết đúng hoặc là tham chiếu video. Không sửa primary knowledgeId chỉ để tăng số phủ. q363đã được sửa từ trước, không tạo lại sửa đổi giả.
6. Bốn phần mới có48cặp dịch (12ngôn ngữ),8trường furigana tiêu đề/thân, nguồn và revision riêng. Dịch chỉ được hiện khi hash khớp; phần bổ sung bị ẩn nếu hash bài nền đổi. Cách đọc do Janome sinh và được kiểm tra đủ ký tự/không mất chữ; sửa âm còn thiếu của「渣」thành「さ」. Không coi kiểm tra khớp chữ là chứng nhận phát âm/bản ngữ. Chưa tạo thêm hình cho các khoảng trống nhận diện còn mở; giữ nguyên các ảnh theo ngày và sơ đồ hiện có.

## Kiểm tra

- Bộ kiểm tra nội dung ngành:96bài,848câu,12ngôn ngữ PASS trong phạm vi cấu trúc.
- Adapter thật:10.176cặp dịch câu và10.176trường hợp hash cũ bị từ chối PASS;432tên bài kiểm tra hợp lệ.
- Phần mới:4section,48cặp dịch,8trường ruby khớp nguyên văn và đầy đủ đọc cho chữ Hán;4tệp dữ liệu/tiến độ gốc giữ byte.
- Browser kiểm Reader thật với adapter được khai báo cho Royal/safe-area/backdrop/localStorage:208trường hợp (4section×13ngôn ngữ×4viewport), không pageerror/overflow. Chỉ xác nhận nội dung dịch xuất hiện và hình học; không chứng nhận mọi glyph/ngữ nghĩa12ngôn ngữ. Ảnh điện thoại tiếng Việt đã xem trực tiếp.
- Kiểm tra daily Reader cũ sau tích hợp:4ngày đại diện,32viewport/ngôn ngữ,zoom và callback hoàn thành PASS.
- TypeScript phạm vi ngành chưa đạt: checkout thiếu type/module dùng chung (japanese-ruby, EffectPressable, dialogue/life dữ liệu). Không có chẩn đoán ở component mới; không coi đó là toàn phạm vi PASS. Chi tiết typecheck.json.
- JLPT lock10/10 PASS; không sửa JLPT.
- Không có nghiệm thu chuyên gia/người bản ngữ, điện thoại thật hoặc production Expo trong lượt này.

## Còn phải làm, theo thứ tự đã giao

1. Hoàn tất phân rã các bản ghi còn tổng hợp theo trang thành từng năng lực/ý; bổ sung binding hình ở mức ý, không dùng ảnh của ngày để tự đóng mọi ý trong ngày.
2. Đã đóng hàng đợi76trang về bằng chứng xem trực quan cấp trang. Những bảng/hình cần đánh giá chi tiết vẫn phải có quyết định nội dung riêng.
3. Đóng các khoảng trống thực hành hình còn lại: đồ bảo hộ/trang phục, tổ chức/OJT, đồ thị cột chồng–radar, tám mẫu quản lý, tiến độ có biên cho phép và thời gian dừng, kiểm tra x̄-R, thiết kế giảm nguy cơ. Tái sử dụng ảnh hiện có khi thực sự dạy được đúng năng lực.
4. Rà301bản ghi chưa có kết luận mới;9mục hình và4mục mới còn mở. Không diễn giải con số thành tỷ lệ thiếu kiến thức.
5. Rà nghĩa848câu cùng từng distractor với nguồn; giải quyết18liên kết ở mức năng lực, chỉ thêm câu khi đã xác định thiếu. Các số liệu/điều kiện và câu có nhiều cách hiểu được ưu tiên.
6. Cập nhật dịch/ruby/hình theo từng nội dung đã chốt; kiểm tra Reader và tiến độ sau mỗi lô. Giữ cờ human/native/domain/device/release chưa đạt nếu chưa có bằng chứng.
