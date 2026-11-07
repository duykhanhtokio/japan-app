# Sản xuất 1号 — kết quả phiên 29/10/2026

**Chưa hoàn tất toàn ngành hoặc đủ điều kiện phát hành.** Đã hoàn thiện và tích hợp bộ kiểm tra thước cặp còn dở của phiên trước, đủ 12 ngôn ngữ đích. Đây là nội dung AI ở chế độ xem trước, không phải tài liệu hay đề thi chính thức.

| Hạng mục có trong app | Số lượng |
|---|---:|
| Bài chính tiếng Nhật | 262 |
| Bài bổ trợ nguồn | 12 |
| Kiểm tra tuần / câu hỏi | 38 / 456 |
| Kiểm tra bổ trợ mới / câu hỏi | 1 / 8 |
| Đề gốc / đề luyện tuyển chọn | 30 / 3 |
| Câu hỏi riêng trong ngân hàng đề gốc | 1.200 |
| Hình kỹ thuật | 22 |
| Ngôn ngữ dịch đích cho nội dung hiện có, gồm bộ mới | 12 |

Bộ mới có 96 cặp câu hỏi–ngôn ngữ đích, gồm câu hỏi, bốn lựa chọn và giải thích. Các giá trị số và thứ tự đáp án được giữ thống nhất với tiếng Nhật. Tám câu hỏi phân bố hai đáp án đúng ở mỗi vị trí. Dữ liệu gốc của 262 bài, 456 câu kiểm tra tuần, 33 đề và 12 bài bổ trợ giữ nguyên. Không dùng tài liệu 2号.

## Đã kiểm tra trong phiên

- Dữ liệu và trạng thái bài mới đạt: đáp án, chấm điểm, lưu–khôi phục, tách người học, từ chối phiên bản cũ; ẩn nội dung nếu nguồn bài bổ trợ thay đổi; không dùng ngôn ngữ khác để thay thế bản dịch còn thiếu.
- Giao diện React Native Web thực tế đạt 26 luồng: 13 ngôn ngữ giao diện × hai kích thước 320×568 và 932×430, 208 lượt câu hỏi, 192 lượt câu hỏi dịch. Không ghi nhận lỗi trang, tràn ngang hoặc lộ giải thích trước khi nộp. Có kiểm tra lỗi lưu/thử lại và bảo toàn bản ghi cũ.
- TypeScript của hai mô-đun thay đổi đạt; lint của hai mô-đun đạt, 0 lỗi/0 cảnh báo.
- Kiểm tra dữ liệu ngành, trạng thái đề, 33 đề luyện và nguồn bổ trợ đạt. Kiểm tra lịch sử nguồn batch25 đạt 57 trường hợp từ chối; batch29 đạt 14. Mười tệp UI JLPT khóa vẫn đúng byte.
- Bản giao diện cũ được tái tạo đúng từng byte khi kiểm tra bằng chứng lịch sử; không chấp nhận thay đổi tùy ý ngoài bản bổ sung đã xác định.

Giao diện web kiểm tra dùng các bộ thay thế được khai báo cho khung Royal, lưu trữ, safe area và ảnh trang trí. Font Nhật dùng riêng cho QA; chưa chứng nhận hiển thị mọi hệ chữ, Expo đầy đủ hoặc thiết bị native.

## Các mục thực sự chưa xong

1. **Đối chiếu chi tiết toàn bộ nguồn:** 487 dòng mục lục có liên kết không chứng minh tất cả kiến thức trong 574 trang đã được dạy đủ. Tệp `recorded-source-open-items.json` tổng hợp 43 đối tượng còn giới hạn/thiếu chi tiết trong riêng hai lô22/25; 16 đối tượng có bằng chứng bổ sung phạm vi hẹp ở các lô sau. Không hiểu đây là 43 bài cần viết mới hoặc danh sách đầy đủ mọi thiếu sót. Phiên này chưa đọc thêm trang PDF gốc và chưa đóng bất kỳ đối tượng nguồn nào.
2. **Rà soát độc lập, chuyên môn và bản ngữ:** bộ thước cặp mới và các phần chưa chứng nhận vẫn cần đánh giá đúng vai trò. Tất cả cờ duyệt tương ứng giữ `false`; bản dịch AI không được coi là bản dịch đã được người bản ngữ chứng nhận.
3. **Expo và thiết bị thật:** đã cài phụ thuộc và thử ba lần. Hai lỗi thiếu tài nguyên ban đầu được xử lý bằng mở rộng bản tải. Metro tiếp tục chặn do một số ảnh dùng chung chỉ là con trỏ Git LFS, không phải dữ liệu ảnh thực. Cụ thể gồm `farm_map_master.png` và `farm_map_tablet_landscape_v1.png`, được nhập qua `AppBackdrop` → `prepareSceneRoute` ngay cả trong bài kiểm tra ngành sản xuất. Không thay ảnh bằng ảnh giả và không sửa giao diện dùng chung để che lỗi. Nhật ký: `expo-blocked.txt`. Chưa kiểm thử trên điện thoại thật.

`wholeCurriculumComplete`, `releaseReady`, `nativeReviewed` và `domainReviewed` tiếp tục là `false`. Báo cáo này không xác nhận đã hoàn tất yêu cầu hoàn thiện toàn ngành trong phiên.
