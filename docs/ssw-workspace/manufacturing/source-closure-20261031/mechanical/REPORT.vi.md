# Cơ khí — kiểm kê nguồn và truy xuất kiến thức, 31/10/2026

Đã kiểm tra trực tiếp đúng PDF SHA `35096524ce12c830ce7765311f536b5d1d0a8bde7268e5385f90588abba04622` gồm **169 trang vật lý**. Bộ mới phân loại đủ 169/169 trang: bìa 1, mục lục 7, thân tài liệu 160, xuất bản 1. Các trang ít chữ vẫn giữ nguyên và kiểm kê hình/bảng/đường vector. Đã trích xuất biên hình học, mã băm nội dung và loại đối tượng; không đưa nguyên văn/ảnh PDF vào mã nguồn ứng dụng hoặc hồ sơ Git.

## Kết quả có bằng chứng

- **5885 vùng/đối tượng trích xuất sơ bộ**, gồm {'main_text_line_candidate': 3435, 'heading_region_candidate': 307, 'paragraph_region_candidate': 1118, 'image_placement': 169, 'vector_cluster_candidate': 471, 'table_candidate': 32, 'table_row_candidate': 251, 'formula_or_unit_line_candidate': 102}. Đây là các dòng, vùng đoạn, hàng bảng, vị trí ảnh và cụm vector do máy tìm được; không phải số đơn vị kiến thức đã nghiệm thu. Các mảnh ruby đã được gom lại theo đường cơ sở của chữ chính trước khi lập danh mục.
- **183 đơn vị kiến thức có phạm vi giới hạn**: 107 lần ghi nhận chi tiết từ hồ sơ cũ và **76 đơn vị đối chiếu mới** giữa PDF đúng phiên bản và các đoạn bài hiện tại. Các lần ghi nhận trùng có thể cùng nói về một thực thể; không cộng thành số kiến thức độc lập đã hoàn tất.
- Đọc mới văn bản ở **47 trang ưu tiên**, kiểm tra ảnh thực tế ở **25 trang** về đọc thước, dụng cụ so sánh, bảng đường nét, phép chiếu, mặt cắt, dung sai/ký hiệu, ghi nhám, mối hàn và bộ phận máy. Không chuyển bằng chứng cũ thành lời khẳng định đã đọc lại toàn bộ 169 trang trong phiên này.
- Đã gắn mã bài và đoạn cụ thể, hash đoạn và thuật ngữ chính xác khi có. Liên kết câu hỏi từ hồ sơ trang vẫn đánh dấu **ứng viên cần luồng câu hỏi đối chiếu**; không tự xác nhận các đáp án/nhiễu.
- Toàn bộ 169 trang có phân loại, nhưng **0 trang được chứng nhận đã đóng toàn bộ tri thức**. Có 113 trang thân chưa có đơn vị chi tiết trong tập 183 hiện tại; chúng vẫn có đầy đủ danh mục trích xuất để xử lý tiếp. Chưa biết mẫu số các đơn vị kiến thức ngữ nghĩa toàn tài liệu nên không đưa tỷ lệ phần trăm bao phủ giả.

## Các điểm quan trọng cần xử lý

1. **Trang 73:** mô tả cũ “18.45mm” trong ledger không khớp nguyên bản. Phần giải thích của PDF ghi 30.35mm và hình có thang chính quanh 30. Ghi đính chính metadata; ví dụ tự soạn 18.20mm của app là ví dụ độc lập, không cần đổi thành số liệu nguyên bản.
2. **Trang 107:** ledger cũ gán ví dụ hàn gián đoạn 80mm/bước150mm vào trang này, nhưng nguồn thực tế ở đây nói hướng mở mép và bài tập. Hình, chữ trang105–107 được đọc lại; không có bằng chứng cho nguồn gán đó. Khái niệm chiều dài/bước hàn được tìm ở **nguồn sơ cấp riêng của Hiệp hội Hàn Nhật Bản**, không giả thành nội dung sách đang dùng.
3. **Bài bổ sung 006, đoạn2:** các tên toàn/half/partial section cần nguồn bổ sung. Tài liệu169 trang chỉ hỗ trợ phần cắt/hatching chung; JEED xác nhận danh mục loại mặt cắt nhưng trang chương trình học chưa đủ để xác nhận mọi định nghĩa/hình học.
4. **Điều kiện cắt:** nguồn hiện có hỗ trợ vai trò máy, chuyển động và chất lỏng cắt; chưa thấy bảng tốc độ/tiến dao/chiều sâu cắt. Thuật ngữ đã có nguồn nhà sản xuất riêng. Không tạo thông số vận hành hay bài tính thiếu đầu vào.
5. **Trang94, bài046 đoạn2:** điều kiện vuông góc của đường gióng trong ví dụ cơ bản chưa được nói rõ ở đoạn hiện tại. Cần ghi chú có phạm vi hoặc quyết định loại trừ có lý do.
6. **Trang97:** điều kiện “lớn hơn180°” trong bảng ký hiệu phải giữ giới hạn; không suy ra trường hợp bằng180° hoặc định luật ngược. Nếu chưa đối chiếu tiêu chuẩn mới, không biến nó thành quy tắc đánh giá chung.
7. **Trang131–132:** sửa cách hợp nhất dữ liệu để dùng đúng hình mâm cặp/máy phay và máy khoan; không suy từ các tiêu đề khái quát cũ rằng có ảnh máy tiệnNC hay ảnh máyMC ngang ở đó.

## Cách hoàn thiện tiếp theo

Ưu tiên các vùng chưa có đơn vị chi tiết trong `coverage-summary.json`, từng trang một, kể cả trang bài tập chỉ có hình. Từ mỗi vùng dòng/đoạn/bảng/hình, xác định mệnh đề kỹ thuật nhỏ, đọc nhãn/đơn vị/điều kiện, ghép đoạn giải thích và thuật ngữ, rồi chuyển câu hỏi cùng ba phương án nhiễu sang luồng câu hỏi. Bài tập gốc chỉ dùng để nhận biết mục tiêu kiến thức; không sao chép đề, lựa chọn, lời giải hoặc hình. Nội dung chưa sử dụng phải có quyết định riêng; không coi thiếu liên kết trang trực tiếp là chắc chắn chưa dạy.

Các tên nguồn bổ sung, URL, ngày đọc, điều được hỗ trợ và phần chưa được hỗ trợ nằm trong `supplemental-sources.json`. Các ứng viên trùng nằm trong `duplicate-candidates.json` và chưa bị loại tự động. `findings.json` ghi rõ từng vấn đề và phạm vi sửa. Hồ sơ cũ và dữ liệu chạy app không bị ghi đè.

`validation.json` xác nhận cấu trúc/truy xuất/binding có thật. Đây chưa phải nghiệm thu chuyên gia, bản ngữ, độ chính xác thiết bị thật hay phát hành toàn ngành. Các cờ tương ứng giữ false.
