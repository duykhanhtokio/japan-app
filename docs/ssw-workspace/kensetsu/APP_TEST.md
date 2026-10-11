# 建設 — bản test trong app

Mở 特定技能学習 → 建設 → chọn 1号/2号 → chọn ライフライン・設備、建築 hoặc 土木 → tuần → ngày. Bản test chỉ mở trong Expo development / Simulator, giống phần 介護. Có 6 tuần nháp, 42 bài tiếng Nhật; lịch chưa xác nhận thời lượng 30 phút/ngày.

Đọc tới cuối và bấm 完了 để lưu dấu ✓. Đổi mảng hoặc 1号/2号 để kiểm tra tiến độ được tách riêng. Nút dịch đang ẩn trong khi bản dịch chưa sẵn sàng. Tuần 1–6 đã được rà biên tập AI; các mục thiếu và duyệt chuyên gia vẫn được ghi riêng; phần thi chưa được thiết kế.

Trong clone trên Mac:

```bash
cd ~/Desktop/japan-app99/japan-app
git switch recovery/jlpt-n3-n1
git pull --ff-only origin recovery/jlpt-n3-n1
npx expo start --clear
```

Nếu Git báo có thay đổi cục bộ, giữ chúng và xử lý thông báo đó trước khi pull; không reset. Màn hình được kiểm tra bằng browser adapter, chưa chạy Simulator trong phiên này. TypeScript toàn dự án hiện có lỗi có sẵn TS2352 tại life-content-repository.ts:47; không có diagnostic ở các file 建設 mới.

Tuần 4: 7 bài/28 cụm/87 đoạn tiếng Nhật. Bản test có tổng 368 đoạn; kiểm tra reader qua browser adapter đạt ở ba kích thước, gồm điều kiện đọc hết và bấm hoàn tất, tải lại và tách tiến độ người học/cấp độ/mảng. Có bằng chứng nguồn theo cụm và danh sách thiếu/rà một phần; chưa có duyệt chuyên gia, tiếng Nhật bản ngữ, quyền sử dụng hay kiểm tra thiết bị native.

Tuần 5: 7 bài/28 cụm/84 đoạn tiếng Nhật; tổng 35 bài/396 đoạn. Đã kiểm tra reader qua browser adapter ở ba kích thước, điều kiện đọc hết + bấm hoàn tất, tải lại và tách tiến độ người học/cấp độ/mảng. Hồ sơ có 132 mục đối chiếu nguồn và 28 cụm bằng chứng; điều kiện/ngoại lệ chưa trình bày đầy đủ vẫn để rà tiếp. Chưa duyệt chuyên gia, tiếng Nhật bản ngữ, quyền sử dụng hay thiết bị native.

Tuần 6: 7 bài mới/28 cụm/84 đoạn tiếng Nhật, tổng 42 bài/480 đoạn. Bảng đối chiếu có 147 mục nguồn và 28 cụm bằng chứng, giới hạn ở tài liệu 3 trang PDF1–5/trang in26–30. Một liên kết thiếu lịch sử tuần2 đã được đối chiếu với bài015 tuần3; các mục cần rà chuyên môn vẫn được giữ. Danh mục hiển thị số tuần từ dữ liệu. Kiểm reader qua browser adapter gồm bài36 lưu cùng tiến độ bài1; chưa kiểm native, duyệt chuyên gia/bản ngữ/quyền hoặc đo thời gian học.
