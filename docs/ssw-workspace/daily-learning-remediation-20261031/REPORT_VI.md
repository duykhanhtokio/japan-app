# Đã sửa khối lượng ngày học và bổ sung minh họa —2026-10-31

Đã triển khai các vấn đề được phát hiện trong lần rà soát trước, bằng sáu phạm vi tác giả riêng. Không kiểm tra nội dung chéo. Các bổ sung tận dụng kiến thức và bản dịch đã có, đưa vào đúng ngày học; không kéo dài bằng lời lặp hoặc tự đặt thêm điều kiện kỹ thuật.

## Nội dung đã sửa

| Ngành | Điều chỉnh khối lượng | Minh họa theo ngày |
|---|---|---|
| Nông nghiệp |21bài ngắn thêm đoạn nền liên quan; ngày ngắn nhất1号/2号từ103/116→343ký tự Nhật; không còn ngày dưới300 |141/141ngày1号,228/228ngày2号có liên kết hình;24sơ đồ mới và ánh xạ ảnh đúng chủ đề |
| Sản xuất |144ngày thêm phần đọc/hoạt động liên quan;28ngày từng dưới300ký tự đều được bổ sung |262/262ngày;88hình dùng trong ngày, gồm64sơ đồ mới |
| Xây dựng |Gom phần bổ sung cùng chủ đề: Kiến trúc163→128ngày, Dân dụng152→123; ngày ngắn nhất84→347ký tự; không còn tuần8ngày |440/440ngày riêng sau gom có hình thực;111hình kỹ thuật mới,5ảnh bối cảnh mới; không tính thẻ chữ là minh họa |
| Kaigo |18ngày ngắn từ354–502→747–1.197ký tự; chuyển11đoạn từ ngày quá dày sang6ngày liên quan, có điều hướng |173ngày học có liên kết mục tiêu–ảnh;17sơ đồ mới dùng ở29ngày,144ảnh bối cảnh cũ có căn cứ dùng lại |
| Nhà hàng |75ngày bổ sung phần đọc liên quan; thân bài+phần bổ sung1号min/trung vị/max555/680/955;2号610/794/1.412 |120/120ngày,59nhóm sơ đồ hình học mới |
| Thực phẩm |94ngày bổ sung;1号min/trung vị/max474/565/785;2号530/642/1.055 |96/96ngày,35WebP sơ đồ mới, tổng khoảng783KB |

Tổng cộng310nhóm sơ đồ mới và5ảnh bối cảnh sinh mới. PNG/SVG/WebP của cùng một hình không được tính thành nhiều hình. Số ngày dùng chung giữa cấp/mảng không phải số kiến thức độc lập, không cộng bảng thành số bài riêng toàn app.

Số ký tự là chỉ số kiểm tra tải đọc; phần bổ sung có nguồn và hoạt động vẫn cần thời gian học thực tế để đánh giá. Không tuyên bố mọi ngày bằng nhau từng chữ hoặc đều đã đo đúng30phút. Các phần tham khảo dài ở Kaigo vẫn truy cập được; không xóa kiến thức để làm bài ngắn đi.

## Tiến độ học và ngôn ngữ

Giữ ID nguồn, bản Nhật, bản dịch, câu hỏi và khóa lưu hiện có. Xây dựng vẫn giữ484IDbài nguồn dù lịch gom thành440ngày; trạng thái một ngày gộp được tính từ các thành viên gốc, giữ cách truy cập bằng ID cũ. Đã kiểm8.126liên kết nguồn kiểm tra không bị mồ côi. Kaigo giữ176IDngày gồm3ngày luyện đề;11đoạn chuyển vị trí vẫn giữ ID và bản dịch, có đường dẫn đến vị trí đọc.

Phần đọc liên quan được ràng buộc phiên bản nguồn và bản dịch. Chú thích/alt mới tái sử dụng mục tiêu, tiêu đề hoặc đoạn nguồn có bản dịch tương ứng; ghi chú thiết kế riêng không dịch được giữ trong hồ sơ tác giả. Nhãn trong hình dùng tiếng Nhật. Không đánh dấu bản dịch AI là duyệt bản ngữ.

## Kiểm tra đã thực hiện

- Nông nghiệp: dữ liệu/hash, giải mã186ảnh cũ và24ảnh mới, TypeScript bộ đọc thực; đủ32ca responsive và12ca phóng/kéo ảnh. Pha đầu46trang Nhật/12ngôn ngữ bị đóng trình duyệt ở cuối responsive, giữ bằng chứng rồi chạy riêng đủ32ca đạt; không ghi pha gián đoạn là PASS toàn bộ.
- Sản xuất:262ngày/88hình có byte thực;4.872liên kết ngôn ngữ,668ca chống sai phiên bản,262khôi phục hoàn thành,38ca bộ đọc thực. Bộ kiểm toàn ngành đạt sau khi giữ nguyên cập nhật nguồn từ phiên khác. TypeScript phần mới đạt; kiểm toàn cây Course từng vượt giới hạn bộ nhớ, không tự gán PASS cho lần đó.
- Xây dựng:2.128trường hợp giữ thành viên,239.304cặp đoạn dịch,21.060cặp chú thích–ngôn ngữ;8.126liên kết nguồn kiểm tra;15ca đọc thực, phóng900px/kéo ngang và hoàn thành. TypeScript dữ liệu đạt. Hình chữ thuần túy bị loại khỏi điều kiện đủ ảnh.
- Kaigo:226ca bộ đọc,173ngày Nhật,30ca phần đọc dịch,16ca responsive/phóng hình và6luồng chuyển ngày;564liên kết dịch; TypeScript dữ liệu đạt.
- Nhà hàng:120ngày bộ đọc,16ca responsive,12ca ngôn ngữ;900liên kết dịch bổ sung;18tệp canonical giữ byte; TypeScript và kiểm tiến độ đạt.
- Thực phẩm:96bài/94gói bổ sung và32ca responsive trước delta nhãn; bản cuối kiểm thêm4bài đại diện/32ca responsive, phóng hình và hoàn thành.1.152cặp chú thích,1.128cặp bổ sung,36nhãn UI;76tệp nguồn/tiến độ giữ byte. Parent chạy tuần tự TypeScript toàn phạm vi với heap4096MB, exit0; hồ sơ giữ các lần thiếu bộ nhớ trước đó.
- JLPT:10/10tệp giao diện khóa giữ nguyên. Không đổi giao diện thi, câu trả lời hay lịch sử học của ngành khác.

Các ca Chromium/RNWeb có adapter được ghi rõ trong từng hồ sơ, không thay thế kiểm iPhone/Android thật. Với144ảnh Kaigo giữ lại, căn cứ liên quan dùng lại dựa trên kiểm hình trước và chú thích nguồn; không tuyên bố vừa kiểm pixel lại toàn bộ144ảnh. Không tuyên bố duyệt chuyên môn, bản ngữ hoặc phát hành công khai; các gate `__DEV__` hiện có được giữ nguyên.

## Nhánh đã lưu và hồ sơ tiếp tục

Nông nghiệp/Sản xuất/Xây dựng/Kaigo nằm trên `recovery/jlpt-n3-n1`. Tiếp nhận145đường dẫn upstream từ `dfb2af5120b963aaa3f6f22e79a251fd6d00ebae`, không có giao với thay đổi cục bộ. Giữ nguyên cả29PNG nhận diện Sản xuất đã được phiên khác khôi phục. Xem từng `../<ngành>/daily-fix-20261031/manifest.json` và `manufacturing/.../upstream-reconciliation.json`.

Hai ngành ở nhánh riêng, không được tuyên bố đã nhập vào nhánh chính:

- Nhà hàng: `feature/restaurant-20261026`, commit `8b8f4756281dc2d092348da010a24d46b7a16a70`, đã xác minh remote và working tree sạch.
- Thực phẩm: `feature/food-continue-20261029`, commit `e847656988041b8f1c4ab0497b89911ef0e3a090`, đã xác minh remote và working tree sạch.

Ảnh bối cảnh mới dùng built-in imagegen; sơ đồ chính xác dựng bằng công cụ kiểm soát chữ/vị trí. Prompt và mục đích ở `generated-raster-prompts.json`; nguồn PNG và WebP giao diện ở `assets/kensetsu/daily-fix-20261031/`. Các hình mới nhỏ có quy tắc Git riêng trong thư mục để lưu byte thật, tránh pointer LFS không có dữ liệu. Giao diện chỉ nạp hình của bài đang đọc, không nhập hàng loạt byte ảnh vào lúc mở app.

Các snapshot `daily-learning-audit-20261031/` là hiện trạng trước sửa, giữ nguyên để đối chiếu. Dùng manifest phiên sửa này và hồ sơ từng ngành trước khi mở lại các mục đã xử lý. Lưu bền phần nhánh chính chỉ được xác nhận bằng commit được fetch lại và WORK PERSISTENCE PASS, không suy từ báo cáo này.
