# Nhà hàng — tích hợp nguồn31 từng phần, 2026-10-31

Đã nối 5 gói Nhật đã có từ phiên trước vào trang học thực tế của 75 bài: 104 phần giải thích, 149 câu luyện tập riêng, 58 hình kỹ thuật và 1 thuật ngữ. Không thay 120 bài gốc, 984 câu gốc, bản dịch gốc, hash hoàn thành hoặc dịch vụ lưu tiến độ. Bài tập mới có ID và revision riêng, dùng khóa phân biệt người học/cấp; chỉ hiện đáp án và lý do sau nộp. Đóng bằng nút Back hoặc nút hệ thống đều bảo vệ thao tác đang lưu/lỗi lưu.

Crosswalk kế thừa bằng chứng đối chiếu của 5 gói nguồn: 219/271 trang, 547/639 mục phân cấp và 1070 fact. Đây không phải tỷ lệ bao phủ kiến thức độc lập hay tuyên bố mới đọc lại toàn bộ PDF trong phiên tích hợp. Còn 92 mục/52 trang Chế biến–Tiếp khách2号 chưa có packet hoàn chỉnh. Bản làm dở và page-notes được giữ nguyên. Trong 547 mục đã quyết định còn 88 mục blocked hoặc có fact/image gap; xem từng mục trong unit-crosswalk.json. Coverage ledger cũ được giữ làm lịch sử, chưa thay bằng trạng thái đóng toàn bộ.

Phần bổ sung chỉ có Nhật; 12 locale mới đều translation_pending và không có bản dịch giả. Giao diện dùng thông báo đang chuẩn bị dịch. Chưa duyệt toàn văn furigana cho phần mới. 58 hình mới là hình kỹ thuật độc lập kế thừa; kiểm byte/hash/dimensions/đăng ký và render RNW phía server, chưa chứng nhận hình trên thiết bị thật.

Kiểm thử: 150 trường hợp render React/RNW; chặn supplement khi bài gốc đổi nội dung/hash; chặn bản dịch câu đã đổi; kiểm đủ bốn lựa chọn và lý do; bảo toàn ngân hàng và tiến độ gốc; kiểm lưu/khôi phục10 nhóm; cấu trúc ngành PASS, complete=false; JLPT lock10/10. Chưa có full TypeScript/Expo/browser tương tác/thiết bị vì phụ thuộc Expo/TypeScript chưa sẵn trong checkout. Không có chứng nhận chuyên môn, bản ngữ hoặc phát hành.

Tiếp tục: hoàn thiện packet cooking-service2 từ bản làm dở và nguồn đã tải; xử lý88 gap theo crosswalk; rà nghĩa, hình nhận diện và furigana; dịch phần Nhật đã chốt đủ12locale; đo lại khối lượng ngày sau bổ sung; kiểm Expo/thiết bị và thời lượng học. Không đưa gói chưa chốt vào app hay tự đánh dấu thiếu sót là đã đóng.
