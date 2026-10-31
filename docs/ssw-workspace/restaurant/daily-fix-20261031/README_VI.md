# Sửa khối lượng ngày học và hình minh họa Nhà hàng —2026-10-31

Nhánh đích: `feature/restaurant-20261026`, nền `475625ae550dd60e976997d8b482aee43d80a96e`. Đây là thay đổi trên nhánh ngành, không có nghĩa đã hợp nhất vào nhánh tích hợp chính.

## Thay đổi thực tế

- Giữ nguyên120IDbài, lịch tuần/ngày, nguồn Nhật,12bản dịch, câu hỏi/đáp án và sourceHash đang dùng cho tiến độ.
- Bổ sung75ngày có phần đối chiếu với hai đoạn cùng chủ đề đã biên soạn ở bài liên quan. Đoạn bổ sung hiển thị ngay trong trang đọc, có tên bài gốc, furigana và12bản dịch đã gắn đúng nguồn; không chỉ đặt một đường dẫn sang thư viện khác. Không tự đánh dấu bài nguồn là đã hoàn thành.
-59họ hình mới bằng hình học kiểm soát được, gắn tường minh vào120ngày học. Hình mô tả cấu trúc/đối tượng/quan hệ như tâm thực phẩm và đầu dò, mặt làm việc tách sống/chín, kho lạnh, dụng cụ, bố trí bàn ăn, sổ đối chiếu, khoảng lao động–nghỉ hoặc cấu phần chi phí. Không dùng ảnh nền, icon chung hoặc sơ đồ ô chữ thay ảnh.
- Hình của các mục chung được dùng lại chỉ ở các ngày có cùng đối tượng quan sát. Không có lựa chọn bằng từ khóa hay hình mặc định: ID/nguồn không khớp thì không hiển thị.
- Chú thích và alt hiển thị lấy từ mục tiêu Nhật cùng bản dịch đã có.59ghi chú riêng về phạm vi hình chỉ là metadata biên soạn, không chèn nguyên văn Nhật không dịch vào phần dịch. Các tiêu đề mới và lời nhắc hình khái quát có12ngôn ngữ.

| Cấp | Thân bài trước: ít nhất/trung vị/nhiều nhất | Nội dung thực hiển thị sau, gồm đoạn đối chiếu |
|---|---|---|
|1号|360/496/955ký tự|555/680/955ký tự|
|2号|424/611/1.412ký tự|610/794/1.412ký tự|

Số ký tự không tính bản dịch, tiêu đề hoặc lời nhắc chung; bổ sung là đoạn chuyên môn thực có nguồn. Đây là cân đối tải đọc, không phải chứng nhận30phút/ngày, độc lập kiến thức mới hoặc hết trùng lặp toàn ngành. Bài dài không bị lược bỏ hay mất kiến thức.

## Bảo toàn và bằng chứng

`validation.json` kiểm120liên kết,59họ hình có hình học thật nằm trong khung,75bài bổ sung/900liên kết bản dịch, nguồn mục tiêu và so byte18tệp kinh điển với commit nền. `after-days.json` ghi từng ngày. Bộ kiểm trạng thái Nhà hàng hiện có kiểm khóa người học/cấp, hoàn thành theo nguồn, khôi phục và phiên bản bài thi.

`browser-qa.json` ghi số trang đọc thật được chạy, kích thước màn hình và ngôn ngữ đã kiểm. Harness sử dụng chính `RestaurantLessonReader` của app với React/react-native-web và bộ adapter Royal/safe-area/storage công khai; không thay nội dung trang đọc bằng HTML giả. Chuyển bài trong một SPA để không tải lại bundle nhiều ngôn ngữ120lần. Hai lần thử trước dùng reload toàn khóa gặp đóng Chromium giữa chừng do môi trường; chỉ kết quả cuối thành công được dùng làm bằng chứng.

Ảnh mới là hình giải thích có kiểm soát, không phải ảnh chụp thực tế hoặc tranh nhận dạng chi tiết. Các tỉ lệ/đồ thị không có số không được đọc thành kích thước, thống kê, điều kiện an toàn hay giới hạn pháp luật. Ngưỡng/sản phẩm/quy định phải đọc trong nội dung đã có nguồn. Không tuyên bố duyệt bản ngữ/chuyên môn, đo thời gian học, kiểm Expo sản xuất hay thiết bị thật.

## Tệp và lệnh

- `src/data/restaurant/daily-learning.json`:binding theo sourceHash, mục tiêu/knowledge ID, đoạn liên quan và lý do dùng hình.
- `src/components/restaurant/RestaurantDailyLearning.tsx`:59họ hình và phần đọc đối chiếu.
- `scripts/restaurant/check-daily-learning.cjs`:kiểm binding/hình học/bảo toàn.
- `scripts/restaurant/check-daily-reader.cjs`:trang đọc thật, dùng các biến `RESTAURANT_QA_OUTPUT`, `RESTAURANT_QA_BROWSER_MODULES`, `RESTAURANT_QA_JAPANESE_FONT`, `RESTAURANT_QA_SCRIPT_FONT_DIR`.
- `scripts/restaurant/tsconfig-daily.json`:strict TypeScript cho thành phần mới và các phụ thuộc đọc/dữ liệu thực. Phạm vi không chứng nhận toàn app.

Commit/push/fetch và xác nhận remote do bước hợp nhất thực hiện; tài liệu này không tự chứng minh đã lưu bền vững.
