GÓI CÀI ẢNH THÀNH PHỐ V1

Gói này chứa 129 ảnh JPEG đã tối ưu, ánh xạ theo đúng mã CTY-* mà app đang dùng.

Cách 1 — giải nén trực tiếp vào thư mục gốc japan-app:
  unzip -o city-images-app-install-v1.zip -d /Users/doduykhanh/japan-app

Cách 2 — chạy trình cài đặt sau khi giải nén gói:
  sh scripts/install-city-images.sh /Users/doduykhanh/japan-app

Sau đó chạy:
  cd /Users/doduykhanh/japan-app
  npx expo start --clear

Gói cài đặt tự cập nhật city-images.generated.ts, bao gồm 95 ánh xạ CTY-JP-* còn thiếu trong code cũ.
Các thành phố chưa có ảnh mới trong phiên này tiếp tục dùng ảnh JPEG cũ đang có trong app.
