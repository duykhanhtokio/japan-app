# Ba cụm tính toán nguồn48 — sản xuất1号, 02/11/2026

Đã nối vào bộ đọc và danh mục kiểm tra đang dùng của app: **3 phần dạy bổ sung tiếng Nhật +12 ngôn ngữ**, **12 câu mới/144 cặp câu–ngôn ngữ**, tổng48 giải thích riêng cho từng phương án. Đây là bài luyện bổ sung, không phải đề thi chính thức hay chứng nhận hoàn thiện ngành.

| Cụm | Nguồn đã đọc trực quan | Năng lực mới được dạy và hỏi |
|---|---|---|
| Mật độ | Cơ khí123, in115, mục tính chất vật lý | Phân biệt thể tích vật liệu với thể tích bao ngoài có khoang rỗng; tính khối lượng; so mật độ; suy ngược thể tích rỗng từ khối lượng |
| Điện trở suất | Điện127, in118, công thức và đơn vị diện tích | Đổi mm² sangm²; tínhR=ρℓ/S; so đồng thời chiều dài/diện tích; phân biệt đường kính với diện tích tiết diện tròn |
| Faraday | Bề mặt118/121, in108/111 | Đổi phút sang giây; dùng hiệu suất như phân số; suy ngược hiệu suất/thời gian; phân biệt tổng khối lượng với mật độ dòng khi diện tích đổi trong mô hình đã cố định điều kiện |

**Ảnh nguồn điện ghi đúngS[m²].** Phần trích xuất chữ đã làm mất số mũ2; đây là lỗi trích xuất, không phải lỗi tài liệu gốc. Đã ghi điều này trong bài và hồ sơ để không truyền tiếp kết luận sai.

Các số bài tập là mô hình tự soạn: vật liệu đồng nhất giả định2,5 g/cm³; dây giả địnhρ=3,0×10⁻⁸ Ω·m; hệ số điện hóa giả định0,20 mg/C. Không gán chúng cho một vật liệu/nguyên tố/bể thực. Phép suy dẫn toán học được tách khỏi khẳng định trong tài liệu, không sao chép câu hỏi hoặc hình trang nguồn.

## Tích hợp và giữ dữ liệu người học

- Mở đúng bài023 cơ khí,068 điện đoạn1 hoặc028 bề mặt mới tải phần dữ liệu tương ứng. Bài không liên quan không tải ba payload này.
- Đoạn Nhật, nguyên văn dịch trước sửa và hash bài phải khớp; không dùng bản dịch ngôn ngữ khác làm fallback. Câu chỉ hiện khi phiên bản dạy Nhật còn khớp; câu/bản dịch bị lệch nguồn bị từ chối.
- Ba bài kiểm tra có ID và revision riêng. Ngân hàng lõi, thứ tự đáp án/câu cũ, ID ngày và dữ liệu hoàn thành bài cũ giữ nguyên; việc giữ hoàn thành cũ không chứng minh người học đã đọc phần vừa bổ sung.
- Phương án và giải thích tính toán dùng số, phương trình và ký hiệu SI, giống nhau ở mọi ngôn ngữ; các đại lượng được giải thích trong đoạn dạy và câu hỏi tương ứng. Đây là lời giải toán học, không phải prose tiếng Anh dùng thay bản dịch. Mỗi phương án có phép tính/đối chiếu riêng.

## Bằng chứng kiểm tra

- Tính độc lập bằng phân số chính xác: thể tích vật liệu20 cm³, khối lượng50 g, khoang suy ngược6 cm³; diện tích5×10⁻⁷ m²; điện trở0,6 Ω và tỉ lệ đường kính cho0,3 Ω; lượng45 mg, hiệu suất60%, thời gian600 giây=10 phút.
- Ba cổng riêng PASS:39 đoạn–ngôn ngữ,144 cặp câu dịch,1.008 trường hợp từ chối câu lệch,156 trường hợp từ chối nguồn/đoạn lệch,144 bản dịch có hash cũ bị từ chối; chấm4/4 và khôi phục/loại revision cũ của từng bộ đạt. Cả ba bộ có bốn vị trí đáp án cân bằng, mỗi vị trí một lần.
- **Thành phần Reader/Attempt thật**, chỉ xuất nội bộ trong bộ nhớ qua harness có sẵn:39 lượt bài–ngôn ngữ và156 lượt câu–ngôn ngữ PASS. Đã bật dịch, chọn đáp án, xác nhận lưu, mở lại đúng vị trí/đáp án, kiểm lời giải ẩn trước nộp và hiện sau nộp. Không thay bằng màn chấm điểm khác. Có adapter được khai báo cho native primitives, storage, appearance, safe-area, Royal và ảnh trang trí.
- Các cổng47, energy, tolerance, dimension, QC-plan và sequential Kirchhoff đạt. Kiểm tra QC-plan được chỉnh từ đòi toàn danh mục chỉ có ba bộ cũ sang đối chiếu chính xác ba ID cũ trong danh mục mở rộng; nội dung và cổng riêng của các bộ cũ được giữ. Bộ48 kiểm thêm mỗi bộ mới xuất hiện đúng một lần.
- ESLint ba tệp runtime:0 lỗi,1 cảnh báo cũ tại require sequential trong dispatcher; không có lỗi mới. Không gọi đây là lint0 cảnh báo.
- TypeScript strict helper mới `calculation48.ts`:PASS0 chẩn đoán, sử dụng nguyên các khai báo kiểu xuất từ `index.ts`/`translations.ts` qua AST. Kiểm hẹp này không tải JSON và implementation phụ thuộc toàn app; schema/đường dữ liệu đã kiểm riêng qua guard và thành phần thật. Không nhận là typecheck toàn app.

Kiểm tra thành phần dùng `react-test-renderer19.1.0` với React19.1.0 trong phụ thuộc QA riêng; không sửa `package.json` hoặc lockfile. `component-validation.json` và ba `runtime-*.json` ghi phạm vi thực thi.

## Phạm vi chưa được nghiệm thu

Chưa có kiểm trình duyệt về bố cục/tải ảnh, Expo production cho riêng khối48, thiết bị vật lý, thời lượng người học đo thực hoặc xác nhận người bản ngữ/chuyên gia. Các lượt render/harness không thay thế các bằng chứng này. Không phát hành chứng nhận an toàn vận hành.

Mỗi trang nguồn còn nhiều vùng chưa đóng trong khối này: các mô tả tính chất khác ở cơ khí123; xếp hạng dẫn điện, mã màu/ảnh điện trở và cuộn dây ở điện127; toàn bộ bán phản ứng/điện cực trên118 và nhãn/hình8-7 trên121. Bốn lượt trang đọc có thể trùng lịch sử, không được tính là bốn trang mới hoàn toàn. Cờ `whole574KnowledgeClosed`, `wholeSourceClosed`, `nativeReviewed`, `domainReviewed` và `physicalDeviceVerified` đều false.

Không mở khối49. Việc lưu từ xa và `WORK PERSISTENCE PASS` do điều phối xác minh sau khi gom tệp.
