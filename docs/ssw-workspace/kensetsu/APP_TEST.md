# 建設 — bản test trong app

Mở 特定技能学習 → 建設 → chọn 1号/2号 → chọn ライフライン・設備、建築 hoặc 土木 → tuần → ngày. Bản test chỉ mở trong Expo development / Simulator, giống phần 介護. Có 5 tuần nháp, 35 bài tiếng Nhật; lịch chưa xác nhận thời lượng 30 phút/ngày.

Đọc tới cuối và bấm 完了 để lưu dấu ✓. Đổi mảng hoặc 1号/2号 để kiểm tra tiến độ được tách riêng. Nút dịch đang ẩn trong khi bản dịch chưa sẵn sàng. Tuần 2 đã được rà biên tập AI; tuần 3–5 còn chờ rà sâu; phần thi chưa được thiết kế.

Trong clone trên Mac:

```bash
cd ~/Desktop/japan-app99/japan-app
git switch recovery/jlpt-n3-n1
git pull --ff-only origin recovery/jlpt-n3-n1
npx expo start --clear
```

Nếu Git báo có thay đổi cục bộ, giữ chúng và xử lý thông báo đó trước khi pull; không reset. Màn hình được kiểm tra bằng browser adapter, chưa chạy Simulator trong phiên này. TypeScript toàn dự án hiện có lỗi có sẵn TS2352 tại life-content-repository.ts:47; không có diagnostic ở các file 建設 mới.
