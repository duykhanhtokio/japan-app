# Kiểm thử thiết bị thật — trạng thái và cách nối tiếp

**Chưa chạy được trên thiết bị thật.** Môi trường kiểm tra là Linux, không có cầu nối Android/iOS, không có USB được chuyển vào và không tìm thấy công cụ điều khiển thiết bị từ xa phù hợp đang được cung cấp. Các kết quả React Native Web trước đây không được đổi tên thành kết quả iPhone/Android thật.

## Điều kiện cần xử lý trước

- Khôi phục dữ liệu nhị phân thật của ảnh/font Git LFS ở bản clone dùng để build. Không dùng ảnh thay thế để vượt kiểm tra. Danh sách kiểm tra byte hiện tại ở `environment-and-assets.json`; danh sách này chỉ là closure xấp xỉ của import tĩnh/động có điều kiện, không phải khẳng định tất cả ảnh đó đều hiển thị trong ngành sản xuất.
- Bản tải trong phiên còn thiếu hai tài nguyên đã được Git theo dõi: `assets/game/backgrounds/tokyo/cafe/tokyo_cafe_01.jpg` và `assets/game/characters/cafe_staff_01/normal.png`. Chúng bị kéo vào qua code chuẩn bị backdrop dùng chung. Bản clone đầy đủ phải có chúng trước khi dựng toàn app.
- Dùng development build thực của dự án. Gói `expo-speech-recognition` đã cài yêu cầu development build; không coi mở trang web hoặc chỉ quét Expo Go là bằng chứng chạy đúng native dependencies.
- Route `/specified-skills/manufacturing` hiện cố ý chỉ mở khi `__DEV__` là true. Bản Release hiển thị thông báo đang chuẩn bị, nên chưa thể dùng bản Release này để chứng nhận luồng sản xuất; không tự bỏ gate đó.

## Trên Mac có iPhone được kết nối

Tại bản clone đúng nhánh `recovery/jlpt-n3-n1`, ghi `git rev-parse HEAD` và `git status --short`, giữ nguyên mọi thay đổi đang có. Kết nối iPhone thật, xác nhận Trust/Developer Mode và thiết bị trong cửa sổ Devices and Simulators của Xcode. Chọn thiết bị vật lý khi chạy:

```bash
npx expo run:ios --device
```

Cú pháp `--device` đã được xác nhận từ `expo run:ios --help` của bản Expo CLI đang cài trong phiên. Việc build/chọn thiết bị chưa được thực hiện trên Mac trong phiên này. Lệnh có thể tạo/cập nhật dự án native và yêu cầu cấu hình ký mã của bản clone thực.

## Trên máy có Android thật được kết nối

Bật USB debugging và chấp nhận máy tính trên điện thoại, kiểm tra:

```bash
adb devices -l
npx expo run:android --device
```

Chọn điện thoại vật lý, không chọn emulator. Cú pháp `--device` đã được xác nhận từ CLI đã cài; chưa có lần cài APK hay mở ứng dụng nào trong môi trường hiện tại.

## Bằng chứng phải ghi

Dùng `physical-test-matrix.json` gồm 12 nhóm kiểm tra cho cả iPhone và Android, dọc/ngang và 13 ngôn ngữ giao diện. Trạng thái hiện tại của tất cả các nhóm là `not_run`.

Mỗi lượt phải có model, phiên bản OS, bản build native, commit nội dung, thời gian, kết quả thực, ảnh/video/log liên quan. Serial/UDID và log có dữ liệu cá nhân giữ riêng; báo cáo công khai dùng tên thiết bị thay thế và hash bằng chứng. Tạo ma trận hoặc chọn ô PASS không thay thế bằng chứng kiểm thử thật.

Đặc biệt kiểm: ảnh kỹ thuật thật giải mã được; các hệ chữ không thành ô vuông; lưu/mở lại đúng câu và đáp án; không lộ giải thích trước khi nộp; deadline không được làm mới sau đưa app xuống nền; 30 đề gốc và 3 đề tuyển chọn có session riêng; kiểm tra bổ trợ thước cặp có 8 câu đủ bản dịch. Không bịa ngưỡng thời gian khởi động: ghi số đo và so với mục tiêu đã được duyệt nếu có.

`runtime-preflight.py` có thể chạy lại để kiểm kê cầu nối/asset. Khi chạy trên máy có thiết bị, ghi đầu ra vào vị trí riêng vì công cụ hệ thống có thể chứa serial:

```bash
python docs/ssw-workspace/manufacturing/batch33-full-review/device/runtime-preflight.py --output /tmp/japan-app-physical-device/private-inventory.json
```

Script này luôn giữ `physicalDeviceVerified: false`: nó chỉ kiểm kê và không thực hiện kiểm thử UI trên điện thoại.
