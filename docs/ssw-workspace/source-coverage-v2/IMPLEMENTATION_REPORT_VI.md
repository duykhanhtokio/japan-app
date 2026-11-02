# Triển khai yêu cầu nguồn → app phiên bản2 — 02/11/2026

Điểm bắt đầu: `5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a`. Yêu cầu gốc được lưu nguyên nội dung tại PUBLISHER_REQUIREMENTS_VI.md. Đây là đợt triển khai cơ chế và sửa nội dung có bằng chứng, chưa phải nghiệm thu toàn bộ bảy ngành.

## Cơ chế đã thực thi

- Một registry và một ledger chuẩn cho mỗi ngành. Sổ cũ được giữ làm lịch sử/provenance; không cộng tổng cha/con vào mẫu số.
- Tách kiểm kê file/trang/vùng, phân rã kiến thức và bằng chứng app. Giữ chữ nhỏ/ruby/chú thích trước phân loại. Không biến bbox hoặc từ khóa thành kiến thức đã nghiệm thu.
- Bằng chứng có vị trí nguồn cụ thể, liên kết ngược, JSON pointer/hash hiện hành và ghi chú tự kiểm ngữ nghĩa. Thay nội dung làm hash cũ bị từ chối.
- Không nhận covered_ai khi thiếu nguồn chính xác, dạy/đánh giá, kiểm điều kiện, kiểm biểu đạt hoặc còn blocker. Cờ người thật/chuyên môn/bản ngữ/thiết bị/thời lượng cần evidence riêng khi bật.
- Mẫu số mở thì tỷ lệ=null. PASS hợp đồng dữ liệu không đồng nghĩa ngành hoàn tất. `npm run ssw:coverage:require-complete` là cửa riêng.
- Quét payload vùng nguồn để chặn vô tình lưu raw PDF text, ảnh hoặc lệnh vector. Giữ PDF/ảnh trang/chữ trích nguồn ngoài kho công khai. Việc quét này không phải chứng nhận pháp lý.
- Đã sửa trạng thái chưa có mapping thành unknown ở những nơi chưa đủ bằng chứng kết luận app thiếu. Không gọi candidate/unknown là thiếu kiến thức thực sự.

## Số liệu đã lưu — đợt tiếp tục

Mốc dữ liệu đã lưu: `04186871758b3eaaabcf0537c0d3937250da2fbf`. Bảng này đọc từ ledger trong commit, không cộng nội dung các luồng đang soạn. Tỷ lệ toàn nguồn của cả7ngành vẫn `null`; mẫu số chưa đóng. `current-status.json` ghi riêng `committedSnapshot` và hash từng ledger. Báo cáo máy đã làm mới từ commit04186871758b3eaaabcf0537c0d3937250da2fbf; không dùng byte đang sửa của sáu luồng.

32 nguồn chuẩn hóa,2.256trang và508.877vùng. Không coi số vùng là số ý kiến thức.

| Ngành | Trang census | Ý đang theo dõi | covered_ai có phạm vi | Trang đã phân loại đủ, gồm loại trừ | Trang kiến thức có đủ bằng chứng app |
|---|---:|---:|---:|---:|---:|
| agriculture | 237 | 1398 | 42 | 2 | 2 |
| manufacturing | 574 | 100 | 68 | 33 | 3 |
| food | 251 | 102 | 58 | 4 | 3 |
| restaurant | 271 | 1478 | 29 | 2 | 1 |
| hospitality | 117 | 382 | 92 | 15 | 15 |
| construction | 530 | 72 | 27 | 29 | 1 |
| kaigo | 276 | 55 | 55 | 10 | 9 |

Các ý kế thừa và ý đọc trực tiếp có phạm vi khác nhau, không dùng số hàng làm tỷ lệ hoàn thành. Riêng68mục covered_ai của Sản xuất gồm51mục hướng dẫn tham khảo và17mục năng lực nghề; không đánh đồng hai loại. Unknown/candidate không chứng minh app thiếu nội dung.

## Thay đổi app đã lưu trong lượt tiếp tục

- **Nông nghiệp:** giữ35–55% theo chỉ thị, không tạo mẫu số. Bốn bài tự kiểm độ ẩm mới và câu mock có sẵn đóng sáu ý độ ẩm. Tiếp tục đóng đủ hai trang60/80:42ý có dạy và đánh giá, gồm14ô nhiệt độ cây trồng và điều kiện ánh sáng; tổng7Readerchecks đủ12ngôn ngữ. Tách bảy nhóm cũ, giữ hồ sơ gốc và sửa các nguồn gán cả cụm trang để tránh đếm cha/con hoặc dẫn sai trang. Không đổi ngân hàng câu tuần/mock.
- **Sản xuất:** đọc và đóng riêng ba trang hướng dẫn điện, thêm ba đoạn vào bài043 đủ12ngôn ngữ/furigana. Ánh xạ12năng lực tính khối lượng riêng, điện trở suất và Faraday với bài/câu có sẵn. Thêm hai câu về điều kiện dòng điện–thời gian đồng thời và cấu tạo bimetal, đủ12ngôn ngữ, lưu/khôi phục/chấm và ẩn giải thích trước nộp được kiểm trênhost. Mốc33đã phân loại đầy đủ:30trang bìa/mục lục/cuối sách loại trừ có lý do và3trang hướng dẫn tham khảo; không coi đây là33trang năng lực kỹ thuật.
- **Thực phẩm:** thêm bốn cụm51–54 về sáu mẫu biểu đồ kiểm soát còn thiếu, chi phí–kế hoạch, tỷ lệ/thời gian chuẩn/đồ thị và vận hành. Có bốn phần dạy, năm tự kiểm,23ý đáp án,12ngôn ngữ và hai hình mới có caption/alt.58ý có bằng chứng, ba trang93/99/101đóng mứcAI và trang94loại trừ có lý do. Giữ848câu và96ngày.
- **Nhà hàng:** ba đợt vệ sinh/chế biến/phục vụ thêm16câu, một phần dạy, đủ12ngôn ngữ/furigana. Giữ toàn bộ260câu source31trước lượt này và core. Khoảng trống đánh giá cũ315→302;21mục tham khảo được tách riêng. Có29ý covered_ai và một trang chế biếnp13đóng toàn bộ chữ/hình/nhãn. Các câu có liên kết cũ nhưng chỉ kiểm một phần cũng đã được sửa bằng chứng hoặc bổ sung câu đúng năng lực.
- **Khách sạn:** ba bài front06/07/08đủ36/36cặp dịch, valid173→209/456, còn247thiếu/cũ. Thêm một mục nguồn SNS–giao tiếp với khách–thương hiệu ngoài danh mục cũ, bổ sung Nhật/câu/12ngôn ngữ và đóng đúngý; tổng327câu,382ý theo dõi,92covered_ai,15trang kiến thức đóng mứcAI. Giữ38IDbài, đáp án cũ và bản dịch ngoài phạm vi. Các bài planning02/03/05đang soạn tiếp, chưa tính vào209.
- **Xây dựng:** mở rộng ba cụm職長017–019,36cặp dịch mới,36caption và hai sơ đồ độc lập gắn đúng ba ngày. Thêm ma trận ba nhóm1号→2号 và dùng câu cũ khi kiểm đúngý.27ý covered_ai,28trang điều hướng loại trừ và trang92đóng toàn bộ vùng. Sửa locator bị lệch; ghi riêng mâu thuẫn mức độ rủi ro nguồn.136trang cũ đã phân loại vai trò,108trang kiến thức vẫn cần đối chiếu từngý. Giữcompletionrevision2và dữ liệu người học.
- **Kaigo:** mở rộng từ14ý/trang119–120thành55ý/trang112–120, thêm haiReaderchecks ghi chép/5W1Hvà chínchecks giao tiếp tiếp cận đủ12ngôn ngữ, kết hợp câu tuần có sẵn. Hiện18checks; chín trang kiến thức đóng mứcAI và một trang phân cách loại trừ. Giữ nguyên687câu tuần,ID,lựa chọn,đáp án,giải thích và cách chấm. Một ý dạy rõ cách nói chậm khi hỗ trợ người mất ngôn ngữ được thêm trước bài tự kiểm, không đổi master hoặc ngân hàng tuần.

## Kiểm tra và giới hạn

- Bộ thử sai chung30case đạt: mất trang/vùng so với kiểm kê, con trỏ/hash cũ, candidate/keyword, thiếu điều kiện/đánh giá/biểu đạt, loại an toàn, duplicate, false100%, thiếu bằng chứng reviewer và raw-source payload.
- Cả7ledger đạt hợp đồng; quét32region artifacts đạt vệ sinh payload. Không có wholeSourceKnowledgeCovered=true.
- Có kết quả tự kiểm riêng của từng luồng cho renderer/đáp án ẩn/12locale/ruby/preservation/replay. Nhiều phép thử dùng RN/host/SSR adapters; không thay cho bố cục trình duyệt hoặc điện thoại.
- Root chạy full Kaigo host trước phần Readerchecks:26tuần/176ngày/5.378đoạn/687câu; luồng chạy thêm7checks×12locale sau tích hợp. Bảo toàn ngân hàng tuần được xác nhận riêng.
- Chưa có nghiệm thu native/domain, full Expo production, thiết bị thật hoặc thời lượng người học trong đợt này. Không đổi estimatedMinutes thành đo thực.

## Việc còn tiếp tục theo các luồng đang thực thi

Đọc và phân rã phần nguồn chưa được xác minh ngữ nghĩa; đóng từng đơn vị bằng dạy/đánh giá phù hợp, không tạo câu/bài trùng khi đã có bằng chứng. Ưu tiên các vùng bảng/hình/cảnh báo/điều kiện chưa được phân loại và các partial đã xác định phạm vi. Hoàn thiện302gap nhà hàng,247cặp dịch khách sạn, năng lực2号 và các blocker quyền/nguồn đã ghi. Sau đó nghiệm thu thời lượng, âm thanh, hình/bố cục và thiết bị bằng bằng chứng đúng loại.
