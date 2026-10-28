# Tổng kết thực phẩm — 28/10/2026

Phạm vi: **飲食料品製造業**, cấp **特定技能1号 và 2号**. Đã bổ sung nội dung và hoàn thành kiểm thử web có giới hạn nêu dưới đây. Trạng thái vẫn là **bản xem trước nội bộ**, chờ nghiệm thu chuyên môn, ngôn ngữ và thiết bị thật; chưa phát hành production.

## Nội dung hiện có

| Hạng mục | Kết quả |
|---|---:|
| Bài học Nhật | 78: cấp 1 có 42 bài, cấp 2 có 36 bài |
| Bản dịch bài học | 936/936 lượt bài–ngôn ngữ |
| Thi thử | 20 đề × 40 câu = 800 câu |
| Kiểm tra tuần | 13 bài, 39 câu |
| Tổng câu hỏi | 839 câu |
| Bản dịch câu hỏi | 10.068/10.068, đủ 12 ngôn ngữ |
| Tiêu đề bài kiểm tra | 396/396 bản dịch |
| Phần bổ sung từ đối chiếu nguồn | 20 phần, có 240 bản dịch |

12 ngôn ngữ: Việt, Anh, Indonesia, Tagalog, Bengali, Thái, Hindi, Nepal, Myanmar, Khmer, Trung giản thể và phồn thể. Các bản dịch và nội dung mới giữ cờ AI biên soạn, chưa được người bản ngữ/chuyên gia duyệt.

## Đã hoàn thiện trong lượt này

**Furigana và cách đọc.** Tích hợp dữ liệu ngoại tuyến gắn phiên bản nguồn cho 788 trường bài học, 8.390 trường câu hỏi và 52 trường bổ sung: tổng **9.230 trường nội dung chính**, với 64.017 đoạn có cách đọc. Người học có thể bật/tắt. Dữ liệu lệch nguồn trở về chữ Nhật nguyên bản; không dùng cách đọc cũ sai phiên bản. Đã sửa các lỗi đọc theo ngữ cảnh và bộ đếm qua kiểm tra chéo. Điều này không phải xác nhận phát âm bởi người bản ngữ, cũng không khẳng định mọi nút/chữ nhỏ trong SVG đều có furigana.

**Đối chiếu tài liệu.** Đã xem trực quan tổng quan toàn bộ **251 trang** của hai PDF 2026, kiểm tra riêng **44 trang** trọng điểm ở độ phóng lớn hơn. Cả **96 tham chiếu từng bị đánh dấu** đều có nội dung nguồn hỗ trợ; 27 mục được ghi rõ phần tiếp tục trên trang chung. Không phải sửa kiến thức hay mã câu hỏi. Đã ghi nhận ba lỗi số liệu/đơn vị trong nguồn, bao gồm phép làm tròn 350÷395 thành 88,7% thay vì 88,6%; không sao chép số sai vào bài học.

**Bổ sung kiến thức và thực hành.** Thêm 20 phần vào 18 bài liên quan: trình tự chuẩn bị, vệ sinh tay, phân biệt bảo hộ, đọc kết quả kiểm nghiệm, tư thế nâng vật, biển báo/KYT/video; quản lý phiên bản tài liệu, hồ sơ nhiệt độ, nhánh luồng sản xuất, CL/OL, lấy mẫu và phân bố, histogram, quản đồ, công cụ QC, thời gian–năng suất, giá trị gia tăng, ma trận rủi ro và phạm vi hệ thống quản lý. Có dữ kiện, bảng/biểu đồ và đáp án đóng/mở riêng, không đưa đáp án bài thi ra trước khi nộp. Những thông số luyện tập được ghi rõ là giả định, không phải quy trình vận hành cho mọi nhà máy.

**Minh họa.** Thêm sáu hình 2D màu nguyên bản, 15 thẻ nhận diện biển báo bằng vector và 19 sơ đồ/biểu đồ dữ liệu mới. Các bảng và đồ thị hiển thị dữ kiện thật của bài luyện tập; đồ thị rộng được kéo ngang trong khung riêng để chữ còn đọc được trên điện thoại. Hình rửa tay chỉ là tổng quan một phần; hình hóa chất có ví dụ bảo quản sai và được ghi rõ bằng chú thích. Bốn sơ đồ khái niệm cũ được giữ nguyên.

**Video nguồn.** Tích hợp 88 liên kết chính thức theo 11 ngôn ngữ của tài liệu. Cả 88 trang đích phản hồi HTTP hợp lệ tại kiểm tra. Không tải lại, lưu lại hay tái phân phối video; chưa xác minh phát video thực tế.

**Tiến độ học.** Vì 18 bài có kiến thức mới, dấu hoàn thành cũ của các bài đó cần được cập nhật sau khi học bổ sung. Dữ liệu cũ không bị xóa; phiên bản hoàn thành của 60 bài khác và toàn bộ phiên bản đề thi giữ nguyên.

## Kiểm thử đã thực hiện

- PASS cấu trúc bài học/đề, đáp án, liên kết phiên bản và bộ nạp 10.068 bản dịch câu hỏi.
- PASS toàn bộ dữ liệu furigana, 20 phần bổ sung/240 bản dịch, chữ Nhật nguyên gốc, số liệu, hash nội dung và điều kiện từ chối dữ liệu cũ.
- PASS trình duyệt: 78 trang học Nhật; 839 câu trước và sau nộp; 33 xác nhận nộp; 20 phần bổ sung và 12 lần mở đáp án; 15 biển báo với 180 lượt chú thích ngôn ngữ; sáu PNG và 19 SVG thực sự tải được.
- Có mẫu hiển thị bản dịch cho đủ 12 ngôn ngữ: 12 bài học, 12 câu hỏi và 14 phần bổ sung. **Không tuyên bố toàn bộ 10.068 bản dịch đã được thử giao diện.**
- PASS bốn kích thước 390×844, 844×390, 768×1024, 1440×900; ngày/đêm, 16 trường hợp bố cục; không tràn ngang toàn trang. Việc kéo ngang bảng/đồ thị trong khung riêng được kiểm tra thực tế.
- Có tám ảnh chụp đã xem lại; lỗi JavaScript trang là 0. Khóa giao diện JLPT đạt 10/10, không thay đổi các tệp khóa.

Kiểm thử web dùng bộ chuyển tiếp cho Royal/background/safe area/lưu trữ và ảnh SVG. Các khác biệt này được ghi rõ; kết quả không thay thế full Expo hoặc kiểm thử native. Hai sửa tên riêng nhỏ trong bản Trung được kiểm tra bổ sung, có bằng chứng mọi trường còn lại giữ nguyên.

Bằng chứng đầy đủ: [báo cáo web hiện tại](runtime-tests/ruby-source-20261028/final-combined-report.json), [tổng hợp máy đọc được](readiness-current.json), [nguồn tạo ảnh và đường dẫn tài sản](image-generation-provenance.json).

## Phần còn cần nghiệm thu

1. **Chuyên gia/người bản ngữ:** đối chiếu sâu từng chuẩn đầu ra, thuật ngữ, phát âm và cả 12 ngôn ngữ. Sáu ngôn ngữ chưa có tài liệu thuật ngữ chuẩn vẫn cần nguồn đối chiếu. 153/158 mục có tham chiếu bài học và 95 mục có câu hỏi là bằng chứng liên quan; chưa phải chứng nhận bao phủ trọn năng lực. Cờ xác nhận trọn năng lực 158 mục vẫn chưa được nâng lên.
2. **Full Expo và thiết bị thật:** khôi phục tài nguyên/thư viện với đủ dung lượng rồi nghiệm thu iOS/Android/tablet, bố cục native, cách đọc và hành vi ảnh. Bằng chứng web dùng bộ chuyển tiếp không thay thế bước này.
3. **Kỹ năng thao tác và thị giác:** bảng, hình, lời giải và kiểm tra tự động không chứng minh người học đã thực hiện được thao tác nhà máy, KYT hoặc xử lý tình huống thật. Âm thanh thu sẵn là hạng mục tùy chọn riêng.

**Kết luận:** phần nội dung AI và kiểm thử web đã tiến thêm rõ ràng theo bằng chứng trên. Chưa có cơ sở để gọi toàn ngành hoàn tất 100% hoặc nghiệm thu phát hành production. `scopeComplete=false`, `productionRelease=false`.
