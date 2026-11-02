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

## Số liệu máy đã kiểm

32 nguồn chuẩn hóa theo phạm vi từng ngành; tổng2.256 trang và508.877 vùng. Không coi số vùng là số ý kiến thức. Danh mục ý của mọi ngành còn mở.

| Ngành | Trang census | Ý đang theo dõi | covered_ai có phạm vi | Trang đã phân rã đủ | Trang kiến thức có đủ bằng chứng app |
|---|---:|---:|---:|---:|---:|
| agriculture | 237 | 1369 | 1 | 0 | 0 |
| manufacturing | 574 | 57 | 3 | 0 | 0 |
| food | 251 | 96 | 16 | 1 | 0 |
| restaurant | 271 | 1478 | 5 | 1 | 0 |
| hospitality | 117 | 381 | 74 | 0 | 0 |
| construction | 530 | 71 | 6 | 0 | 0 |
| kaigo | 276 | 14 | 14 | 2 | 2 |

Các số ý đang theo dõi có phạm vi khác nhau: một số là các ý đã đọc trực tiếp, một số là dữ liệu kế thừa chờ đối chiếu vùng. Không so sánh hay cộng ngang để tạo tỷ lệ hoàn thành chung. Nguồn sự thật là các ledger; current-status.json chỉ là báo cáo dẫn xuất kèm hash đầu vào.

## Thay đổi app thực tế

- **Nông nghiệp:** giữ quyết định55mục và35–55%; đọc lại tiểu mục độ ẩm của hai tài liệu,6ý có bằng chứng dạy và1đánh giá đúng. Không thêm mẫu số hay công thức tưới.
- **Sản xuất:** sửa4mặt còn thiếu của bảo vệ nhiệt/reset/bimetal, đủ Nhật+12ngôn ngữ. Đoạn mới có furigana qua đường render hẹp,198segment/66reading. Giữ core và các bổ sung47/48. Không nhận47ý chưa đối chiếu câu thành thiếu câu toàn app.
- **Thực phẩm:** thêm2phần dạy,2tự kiểm và1hình độc lập cho pattern quản đồ/năng suất;12ngôn ngữ/ruby. Giữ848câu/96ngày. Bảng/điều kiện còn chưa đủ đánh giá giữ partial/unknown.
- **Nhà hàng:** thêm5câu và1bài độc lập, đủ12ngôn ngữ,52trườngruby; giữ255câu source31cũ và core. Đóng thêm4gap cũ:319→315. Đọc đủ từng vùng trang衛生p5 và phát hiện2ý ngoài sổ1.476; hiện1.478ý. Quan hệ người ăn–triệu chứng đã có bài/câu mới; nguyên tắc biện pháp theo nguyên nhân có bằng chứng từng phần, không coi đã kiểm hết bảng.
- **Khách sạn:** sửa3liên kết/đánh giá, thêm3câu; viết lại ví dụ planning độc lập. Hai bài planning được hoàn thiện đủ12locale; valid149→173/456, còn283. Giữ38IDbài và đáp án cũ; ví dụ/câu cần độc lập được sửa có phạm vi.
- **Xây dựng:** thêm3hoạt động職長017–019,36cặp dịch, giải thích5S theo mục tiêu. Rà71ý có phạm vi; chủ động hạ các liên kết đánh giá quá rộng.136trang chưa có liên kết và năng lực2号toàn diện vẫn chưa đóng.
- **Kaigo:** chứng minh hash tuần3/4 lệch do metadata hình;127câu giữ nguyên. Sửa2đoạn truyền đạt/bảo mật,12locale/ruby. Thêm7short-answerchecks ngày169 theo style hiện hữu,ẩn đáp án trước mở. Kết hợp7câu tuần đã có với7check mới để14ý của PDF119–120 có bằng chứng; giữ toàn bộ687câu/IDs/đáp án/giải thích/scoring. Hai trang này đạt phạm vi đối chiếu AI, không suy ra276trang hoàn tất.

## Kiểm tra và giới hạn

- Bộ thử sai chung30case đạt: mất trang/vùng so với kiểm kê, con trỏ/hash cũ, candidate/keyword, thiếu điều kiện/đánh giá/biểu đạt, loại an toàn, duplicate, false100%, thiếu bằng chứng reviewer và raw-source payload.
- Cả7ledger đạt hợp đồng; quét32region artifacts đạt vệ sinh payload. Không có wholeSourceKnowledgeCovered=true.
- Có kết quả tự kiểm riêng của từng luồng cho renderer/đáp án ẩn/12locale/ruby/preservation/replay. Nhiều phép thử dùng RN/host/SSR adapters; không thay cho bố cục trình duyệt hoặc điện thoại.
- Root chạy full Kaigo host trước phần Readerchecks:26tuần/176ngày/5.378đoạn/687câu; luồng chạy thêm7checks×12locale sau tích hợp. Bảo toàn ngân hàng tuần được xác nhận riêng.
- Chưa có nghiệm thu native/domain, full Expo production, thiết bị thật hoặc thời lượng người học trong đợt này. Không đổi estimatedMinutes thành đo thực.

## Việc còn tiếp tục

Đọc và phân rã phần nguồn chưa được xác minh ngữ nghĩa; đóng từng đơn vị bằng dạy/đánh giá phù hợp, không tạo câu/bài trùng khi đã có bằng chứng. Ưu tiên các vùng bảng/hình/cảnh báo/điều kiện chưa được phân loại và các partial đã xác định phạm vi. Hoàn thiện315gap nhà hàng,283cặp dịch khách sạn, năng lực2号 và các blocker quyền/nguồn đã ghi. Sau đó nghiệm thu thời lượng, âm thanh, hình/bố cục và thiết bị bằng bằng chứng đúng loại.
