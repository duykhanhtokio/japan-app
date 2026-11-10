# Mốc hoàn tất phần sửa ảnh Tokutei đang có

Kho: `duykhanhtokio/japan-app`, nhánh `recovery/jlpt-n3-n1`.

Phạm vi là các hình minh họa hiện có, ảnh cần thay/bổ sung đã xác định, vị trí gắn với kiến thức và các luồng hiển thị ảnh liên quan. Ảnh nghề nghiệp được thay bằng minh họa Royal A+F 2.5D có đối tượng rõ ràng; sơ đồ kỹ thuật chính xác được giữ khi phù hợp. Hồ sơ nguồn và kiểm tra hình hợp lệ được giữ lại, không tạo lại ảnh chỉ vì tệp vắng trong checkout thưa.

| Nhóm | Kết quả trong phạm vi ảnh |
| --- | --- |
| Nông nghiệp | 189 mục minh họa chính có hồ sơ nguồn/hình tương ứng. Rà 91 liên kết tái sử dụng; sửa 34 liên kết sai vị trí hoặc không phù hợp, tích hợp các sơ đồ bổ sung và sửa lựa chọn đoạn kiến thức, lịch canh tác, ngữ cảnh đọc tiếng Nhật. |
| Sản xuất công nghiệp | 331 tệp ảnh đang dùng: 330 trong bài và 1 bổ sung chỉ có trong câu hỏi. Giữ hồ sơ kiểm tra hình gắn đúng dữ liệu; không còn đường dẫn ảnh đang dùng chưa có bằng chứng trong kiểm kê này. |
| Chế biến thực phẩm | 105 ảnh đang hiển thị trong 96 bài. Đã xử lý ảnh bảo hộ, kiểm soát kỹ thuật và ảnh trùng; kiểm tra lại 1.248 ngữ cảnh bài/ngôn ngữ không còn lỗi trong bộ kiểm tra. |
| Nhà hàng | 120 minh họa chính: 110 ảnh và 10 native; 95 hàng nguồn với 142 hình dạy học và 3 hình câu hỏi trung tính. Các nhóm dụng cụ, cắt thái, hướng dẫn và hình cũ đang dùng đã có hồ sơ xử lý. |
| Khách sạn | 38 minh họa chính Royal, các hình nguồn chuyên biệt và 16 liên kết native đã được kiểm tra trong luồng bài đang dùng. |
| Xây dựng | 55 tuần; các nhóm hình bài ngày, đối chiếu và 職長 đã được xử lý. Thay các hình dụng cụ/máy còn quá sơ lược, giữ sơ đồ phân tích đúng kiến thức; toàn bộ 405 ngữ cảnh bài ngày ban đầu vẫn được bao phủ. |
| 介護 | 152 ảnh bài học qua 176 ngày, cùng nhóm ảnh đề và bảng native đã được xử lý. Kiểm tra lại đúng dữ liệu ảnh hiện hành, phóng to và các điều kiện ngăn ảnh sai ngữ cảnh. |

Các mẫu số trên khác nhau và có dùng lại hình; không cộng thành một tổng ảnh chung.

## Kiểm tra cuối phần tích hợp

- Xây dựng: 1.801 trường hợp chọn ảnh, 483 trường hợp chạy component ảnh thật; không còn ảnh trùng trong 1.711 lượt bài học được kiểm tra.
- Nông nghiệp: 11 ngữ cảnh native xuất hiện đúng một lần; 11 trường hợp chọn thiếu đoạn bị chặn; một luồng companion thật; 120 trường hợp ngữ cảnh/đọc/lịch/đoạn đạt và 16 điều kiện loại bỏ đạt.
- Nông nghiệp: kiểm tra TypeScript tại nơi gọi thật đạt 0 lỗi; thử cố ý thiếu màu bắt buộc bị báo lỗi tại đúng nơi gọi. Ba kiểm tra nho, dâu tây và thuật ngữ nguồn đều đạt sau khi tích hợp nhãn đọc mới.
- 介護: xác minh và giải mã đúng 152 Git blob hiện hành; 2.288 lượt hiển thị lớp minh họa theo ngôn ngữ, 33 trường hợp phóng to, không có yêu cầu đọc minh họa không gắn được nguồn.
- Nhà hàng: 80 liên kết hiện hành đạt; 640 trường hợp metadata cũ bị chặn qua 5 bộ chọn thật.

Bằng chứng phần tích hợp Nông nghiệp cuối: [daily91-objective-source-routing-integration-qa.json](../agriculture/royal-weekly-20261107/daily91-objective-source-routing-integration-qa.json).

Mốc kiểm tra điều phối trước phần tích hợp cuối: [root-current-runtime-checkpoint.json](root-current-runtime-checkpoint.json). Hồ sơ chi tiết theo ngành nằm trong các thư mục tương ứng ở `docs/ssw-workspace/`.

Đây là mốc đóng phạm vi ảnh và tích hợp đã xử lý, không phải xác nhận phát hành toàn app. Các kiểm tra component sử dụng bộ chuyển đổi React Native có khai báo; chưa chứng nhận bố cục pixel trên trình duyệt hoặc thiết bị thật, cũng không suy ra toàn bộ văn bản/dịch/ngữ âm đã được chuyên gia nghiệm thu.
