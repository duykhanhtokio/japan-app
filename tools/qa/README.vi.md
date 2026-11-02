# Ghi kiểm thử vật lý và thời lượng học

Chạy từ clone Japan App trên máy quan sát:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory tools/qa
```

Mở `http://127.0.0.1:8765/physical-study-session.html` trên chính máy đó. Dùng điện thoại vật lý khác để chạy development build Japan App; nhập đúng commit của bản app cài trên điện thoại, không tự dùng HEAD của máy quan sát nếu khác. Mỗi phiên ghi một ngành/cấp/ngày/ngôn ngữ và các ID đã thực sự học. Không nhập thông tin nhận dạng cá nhân hoặc serial thiết bị.

1. Ghi model/OS, build native hoặc web, mã người thử ẩn danh, ngày học và ngôn ngữ. `nativeApp`, `mobileWeb`, `desktopWeb`, `simulator` là các mục tiêu riêng, không quy đổi kết quả cho nhau.
2. Người thử bắt đầu học thì bấm Bắt đầu đúng hoạt động. Đổi phần, nghỉ, xuống nền hoặc dừng quan sát thì Tạm dừng; sau đó chọn hoạt động mới và bắt đầu lại. Trang quan sát bị ẩn sẽ tự tạm dừng; mở lại trang không cộng khoảng mất quan sát.
3. Thực hiện tám nhóm kiểm tra trên thiết bị đích. Ghi kết quả cụ thể và tên bằng chứng. Đo mở lạnh/chuyển trang riêng bằng timestamp/video/log; thời gian thao tác tự động không phải thời lượng học.
4. Người học báo mức hiểu, phần chưa hoàn tất và chỗ khó. Kết thúc để tải JSON. Chọn ảnh/video/log sẽ chỉ đưa tên, dung lượng và hash vào JSON; giữ các tệp thật riêng cùng bản ghi. Không tự tải lên hoặc công bố.
5. Rà bằng chứng trước khi đưa kết quả vào sổ chuẩn của ngành. Bản ghi luôn giữ `physicalDeviceVerified: false` và `learnerDurationAccepted: false`: nó hỗ trợ thu số đo thật, không tự cấp nghiệm thu. Không sửa cờ để lấp chỗ trống.

Mỗi lộ trình cần thử các ngày đại diện ngắn/trung bình/dài và các ngày vừa sửa; tiếp tục đủ từng ngày theo hợp đồng trước khi chốt thời lượng. Một người thử/một ngày không chứng minh toàn ngành hoặc mọi người học cần cùng số phút. Đối chiếu mục tiêu theo hợp đồng của chính lộ trình; không mặc định mọi ngành có cùng mục tiêu. Nơi đã quy định 30 phút thì đó là mục tiêu, không phải số đo tự điền. Bộ ghi để `targetMinutes: null` vì chỉ thu thời gian thực tế, chưa xác nhận hợp đồng từng bài. Chỉ sửa nội dung/lịch khi kết quả quan sát và phạm vi kiến thức hỗ trợ, giữ ID và tiến độ người học.

Yêu cầu native: dự án dùng `expo-speech-recognition`, cần development build phù hợp. Trên Mac đã cấu hình Xcode/ký mã và kết nối iPhone: `npx expo run:ios --device`. Trên máy đã cấu hình Android SDK và điện thoại USB debugging: `adb devices -l`, rồi `npx expo run:android --device`. Giữ serial trong bản kiểm kê riêng; không đưa lên Git. Đây là lệnh nối tiếp trên máy có thiết bị, chưa phải bằng chứng đã chạy ở môi trường Linux hiện tại.

Kiểm bộ đếm: `node tools/qa/study-observation.test.cjs`. Dữ liệu kiểm thử tổng hợp không được nhập làm phiên học thật. Bản ghi cục bộ chỉ chứa khoảng hoạt động đã chốt khi tạm dừng; nếu tab/crash bị đóng đột ngột, khoảng đang chạy chưa chốt bị bỏ, không suy đoán cộng bù.

Không tạo đè phiên chưa kết thúc: mở lại bản ghi và tiếp tục. Phiên đã kết thúc có thể mở để tải lại; khi tạo phiên khác sau đó, bản cũ được giữ thêm trong kho cục bộ của trình duyệt. Vẫn tải JSON và giữ bằng chứng thật riêng; bộ nhớ trình duyệt có thể bị xóa. Kiểm UI bằng Chromium hiện bị chặn trong môi trường phiên này; chỉ kiểm logic bộ đếm và cú pháp đã chạy đạt, chưa nhận nghiệm thu giao diện trình duyệt của công cụ.
