# Sửa ngày học Nông nghiệp —2026-10-31

Đã bổ sung trực tiếp vào trang đọc của ngày, không chỉ cập nhật yêu cầu. Không thay nội dung kỹ thuật đã xác minh, không đổi lịch/ID hoặc đặt lại tiến độ.

## Cân đối ngày quá ngắn

21 kế hoạch bổ sung theo chủ đề đã gắn vào các bài ngắn. Trong lịch thực tế,13ngày1号 và16ngày2号 được mở rộng. Mỗi ngày có ba đoạn cơ sở có liên quan được trích từ bài do dự án đã biên soạn, kèm đúng bản dịch trực tiếp từ Nhật theo hash. Đây là phần ôn/nền để hiểu bổ sung, không phải ba đoạn viết lặp cho đủ chữ.

- Thân bài thực tế của ngày ngắn nhất1号 tăng từ103lên343ký tự Nhật.
- Thân bài thực tế của ngày ngắn nhất2号 tăng từ116lên343ký tự Nhật.
- Không còn ngày dưới300ký tự trong hai lịch sau khi tính phần đọc liên quan.
- Số chữ là chỉ báo sàng lọc, không phải chứng nhận30phút; không ép mọi ngày bằng nhau.

Các đoạn liên quan được chọn bằng ID đoạn rõ ràng, không mở cả bài dài một cách tự động. Chỉ dùng bài có trong đúng cấp đang học. Ví dụ bài giới hạn ánh sáng nối với ba đoạn về quang hợp–hô hấp; bài phẩm chất rau nối với nguồn gốc giốngF1; bài ghi chú phân loại nối với nhóm rau; ghi chú bao hoa nối với xử lý hoa sau thu hoạch.

## Hình minh họa thực sự trong trang ngày

Đã tạo24hình mới bằng hình họcSVG có kiểm soát, xuất PNG1160×660để hiển thị native và web qua bộ phóng to/pan sẵn có. Các hình gồm dòng vật chất qua cây; khác biệt khí hậu mùa đông; nguyên lý quang chu kỳ;pH; thành phần phân bón và tính lượng; thời điểm bón; bộ phận củ hành; quan hệ laiF1; cấu trúc cấp–thoát nước ruộng; bảo quản lạnh; bao hoa và đóng hộp; phân loại thực vật; hình thức sử dụng hoa; phân biệt thời tiết và thiệt hại; lịch thu hoạch; các biểu đồ số liệu lịch sử có căn cứ.

43bài có liên kết hình mới theo hash nguồn.100bài khác có ánh xạ tường minh tới hình hiện có phù hợp đối tượng trong bài, kèm mục tiêu và lý do dùng lại. Đây không phải cơ chế dò tên rồi dùng một ảnh chung cho mọi bài. Một số ánh xạ mở phạm vi đọc của cùng khái niệm sang cấp còn thiếu; phần quan sát được giới hạn ở đối tượng, vị trí và điều kiện của bài tương ứng, không biến điều kiện nguồn2号 thành chỉ dẫn chung1号.

| Phạm vi | Trước: ngày có raster đủ điều kiện | Sau: ngày có hình minh họa được liên kết vào trang |
|---|---:|---:|
|1号|76/141|141/141|
|2号|93/228|228/228|

Hình học mới và hình được dùng lại đều có đường dẫn, byte thực, SHA và điều kiện phiên bản.186tệp ảnh cũ đã kiểmSHA và giải mã ảnh, không chỉ kiểm `exists`; không tính GitLFS pointer là ảnh thật.24PNGmới có SVGnguồn cùng bộ sinh để tái tạo. Chỉ thư mục ảnh mới dùng `.gitattributes` cục bộ để giữ bytePNGtrực tiếp khi xuất bản; không đổi các ảnh cũ.

Đây là kết quả tích hợp và kiểm tra cấu trúc bằngAI; không phải chứng nhận duyệt độc lập chuyên môn hoặc bản ngữ. Ảnh bối cảnh chung, khối chữ có mũi tên và ảnh không đúng đối tượng không được dùng làm fallback.

## Chính xác và giới hạn

Biểu đồ dùng số liệu đã có trong bản Nhật hiện hành: tự cung cấp theo trọng lượng2019; cơ cấu sản xuất2019; tỷ lệ diện tích giống2017; tiêu thụ gạo bình quân1962/2021; lịch thu hoạch theo thượng/trung/hạ tuần. Không dùng năm chú thích lịch sử đang bị loại, không phục hồi tỷ lệ70–80%bệnh do nấm, không biến35–55%thành ngưỡng tưới. Biểu đồ chi phí/lao lực là phân loại tương đối có ghi rõ, không suy ra số tiền hoặc số giờ. Sơ đồ khí hậu, nước ruộng, bón phân và bảo quản không đặt thêm liều lượng, mực nước, thời điểm hay nhiệt độ chung.

241bài gốc,2892bản dịch, lịch học, các khóa tương thích tiến độ và1227câu hỏi được giữ nguyên từng byte. Người học chỉ hoàn thành bài đang chọn; các bài được đọc làm nền không bị tự đánh dấu hoàn thành. Người đã hoàn thành bài ngắn vẫn giữ kết quả và có thể mở lại phần bổ sung.

## Kiểm tra

- `check-daily-learning-20261031.py`:đối chiếu nguyên trạng bài/lịch/dịch/câu hỏi với commit2639e56; kiểm hash bài–đoạn–hình, byte và giải mã ảnh; kiểm từng ngày hai cấp và các số liệu trước/sau.
- `check.cjs` và TypeScriptphạm vi Nông nghiệp đạt.
- Pha đọc đầu đã kiểm46trang Nhật và12ngôn ngữ, lưu88ảnh chụp trước khi trình duyệt đóng ở cuối phần responsive. Lần chạy responsive riêng hoàn thành32/32trường hợp (`reader-browser-qa.json`). Lần kiểm hình riêng hoàn thành3trang Nhật,1trang Việt và8trường hợp kích thước/chế độ, có bấm mở rộng và pan hình (`figure-browser-qa.json`); đã xem ảnh điện thoại ban đêm của lịch thu hoạch.
- Sửa kiểu dữ liệu cũ của `RecognitionImages.lessonSourceHashes` để cho phép khóaJSONkhông có giá trị; đây là thay đổi kiểu TypeScript, không đổi runtime. `post-qa-type-correction.json` chứng minh đúng một khác biệt kiểu sauQA. TypeScriptcho bộ đọc thật đạt, bên cạnh kiểm dữ liệu. Các adapterRoyal/safe-area/storage/font được ghi rõ; không thay thế kiểm thửExpo production hoặc thiết bị thật.

Không có thay đổi câu hỏi, cách chấm điểm, lịch, mã lưu trạng thái hoặc tệpUIcủa ngành khác trong phạm vi này. Không có tiến trình chạy ngầm sau khi bàn giao.
