# Sản xuất: mốc 33 trang và ba cụm đối chiếu nguồn, 02/11/2026

Đã tải ba PDF nguồn, tính lại hash và số trang, khớp đúng **169 + 198 + 207 = 574 trang**. Các PDF và ảnh trang dùng để đọc không được đưa vào mã nguồn. Đã đọc trực quan bảng đường nét cơ khí trang89, điện trang10–12 và165, hóa học bề mặt trang103; xem lại 33 trang lịch sử theo ảnh ghép và danh mục trang.

## Mốc 33 trang được xác định chính xác

Đây là 33 hàng thiếu cờ phóng chi tiết ở `batch33-full-review/review-index.json`, không phải 33 trang kiến thức chưa từng xử lý. Cơ khí có9, điện13, bề mặt11. Tách riêng:

| Loại | Trang |
|---|---:|
| Bìa | 3 |
| Mục lục | 24 |
| Cuối sách | 3 |
| Hướng dẫn thi/học của điện, trang10–12 | 3 |

Ba trang hướng dẫn điện có bảng và nội dung dạy thật, nên **không loại cùng bìa/mục lục**. Đã phân rã thêm21 ý của chúng: dạng/số câu, thời gian, ngưỡng đạt, học tiếng Nhật, đọc văn cuối câu, phạm vi công việc, chống gian lận và các chi tiết tham chiếu còn thiếu. Thông tin thi giữ nhãn nguồn tháng7/2026; không gọi đây là xác minh quy định hiện hành. Bảng danh sách từng công việc và một số điều kiện dự thi/mức xử lý vẫn chưa có ánh xạ chi tiết đầy đủ. Không đánh dấu nghiệm thu toàn bộ33 trang.

## Ba nhóm đã xử lý liên tiếp

1. **Bảng7-1 cơ khí, trang89:** tách17 ý, gồm từng loại nét, hình dạng và sáu mục đích riêng của 想像線. Tìm được8 chi tiết chưa được nói rõ trong đoạn đang chỉ đích danh. Đã bổ sung vào đoạn2 của bài080 đang hiển thị: vị trí tham khảo của dụng cụ; biểu diễn phần lặp/phía trước mặt cắt; vai trò đường gióng; hai độ dày đường khuất; hình dạng đường ngắt; đầu và chỗ đổi hướng của đường chỉ vị trí cắt; cấu trúc nét gạch mặt cắt. Bản Nhật và đủ12 ngôn ngữ kích hoạt bằng hash nguồn, nguyên văn Nhật và nguyên văn dịch trước sửa. Giữ ngân hàng lõi và dữ liệu người học; không tạo câu trùng để tăng số lượng.
2. **Điện, trang165 và ba trang hướng dẫn:** tách30 ý. Đối chiếu tiếp xúc đóng/cắt, phát hiện quá tải, dòng–thời gian–nhiệt, lưỡng kim và việc phục hồi. Giữ riêng các khoảng trống còn lại: chế độ reset thủ công nói rõ trong nguồn nhưng đoạn đang dạy chỉ ghi phục hồi được phê duyệt; mục đích chống cháy hỏng chưa diễn đạt rõ ở đoạn chỉ định; nhận diện chi tiết ảnh thiết bị chưa đóng. Không suy phép thao tác từ ảnh ví dụ hoặc khẳng định một trang chứng nhận toàn bộ bảo vệ ngắn mạch.
3. **Hóa học bề mặt, trang103:** tách10 ý về dung chất/dung môi/dung dịch, ví dụ nước muối, kết tủa, phân tích định lượng và hai ví dụ phản ứng. Xác nhận phần BaSO₄ đã có trong bài bổ sung37-002, tránh viết lặp. Giữ ghi chú dấu điện tích chloride bị thiếu ở bản in, không chép máy móc thành công thức đúng. Ghi riêng chi tiết màu của từng ví dụ và việc cần đối chiếu toàn bộ hình/nhãn.

Tổng **57 so sánh ý nguồn giới hạn**, không phải57 ý mới hay mẫu số đầy đủ của574 trang. Hồ sơ giữ cả trạng thái trước bổ sung và liên kết phụ lục mới. Các nhãn `partial`/`gap` chỉ nói đến đoạn/bằng chứng được chỉ định, không khẳng định đã chứng minh thiếu trong toàn bộ app.

## Câu hỏi và kiểm tra

Đã đọc lại **6 câu hiện hữu và22 phía lựa chọn/lời giải**, chỉ đích danh đoạn dạy và ý nguồn: đường tâm, 想像線, phân công接触器/サーマル, lưỡng kim, AgCl và BaSO₄. Câu và bản dịch không bị thay đổi; không biến các cạnh điều hướng cùng trang thành bằng chứng ngữ nghĩa. Chi tiết ngắn mạch trong một phương án dựa vào giới hạn nêu trong bài, không được coi là chứng nhận toàn bộ nguồn kỹ thuật từ trang165.

- `audit-source-atoms47.py`: PASS hash ba nguồn/số trang,33 hàng chính xác,57 ý và6 liên kết câu–đoạn; kiểm ID, hash Nhật và đoạn hiện có.
- `check-source47.cjs`: PASS13 ngôn ngữ của đoạn,13 bản dịch hiệu dụng khớp trước sửa,55 trường hợp từ chối dữ liệu lệch;13 đoạn render qua React Native Web Text SSR. Đoạn không liên quan không tải payload mới. Ngân hàng lõi giữ nguyên.
- Hồi quy dispatcher: kiểm tra dimension/tolerance/QC-plan/energy/sequential Kirchhoff đều PASS. ESLint tệp dispatcher:0 lỗi,1 cảnh báo `no-require-imports` ở lời gọi sequential cũ dòng18; không gọi đây là lint0 cảnh báo.
- SSR chỉ kiểm đường văn bản thực thi; **chưa phải** kiểm bố cục trình duyệt, Expo production, thiết bị vật lý, phát âm hay thời lượng học đo thực.

## Còn phải làm

Toàn bộ574 trang vẫn chưa có mẫu số ý nguồn đầy đủ và chưa đóng mọi bảng/hình/công thức. Ba cụm này không thay thế phần còn lại. Tiếp tục hàng đợi nguồn, các mục giới hạn ở trên, ánh xạ từng đáp án và nghiệm thu ngữ nghĩa12 ngôn ngữ. Giữ `whole574KnowledgeClosed`, `wholePageClosed`, `domainReviewed`, `nativeReviewed` và các cờ thiết bị/thời lượng ở false. Việc lưu commit từ xa do điều phối kiểm tra; báo cáo này không tự chứng nhận đã push.
