# Cơ chế đối chiếu nguồn → app, phiên bản2

Áp dụng yêu cầu người dùng ngày02/11/2026. `registry.json` xác định đúng một sổ nghiệm thu chuẩn cho mỗi ngành. Các sổ cũ giữ vai trò lịch sử/nguồn bằng chứng; không cộng các tổng cha/con, vùng hình học và ý kiến thức với nhau.

## Ba lớp riêng

1. **Kiểm kê nguồn:** đủ file/hash/trang và vùng chữ, kể cả font nhỏ/ruby/chú thích, ảnh, vector, bảng. Vùng chưa rõ vẫn được giữ.
2. **Danh mục kiến thức:** tự đọc nguồn chữ+hình, tách ý/điều kiện/ngoại lệ; phân loại trùng/loại/bị chặn có lý do. Kiểm kê hình học không tự tạo lớp này.
3. **Bằng chứng app:** đoạn dạy/câu/hoạt động/hình cụ thể, phiên bản hiện tại và kết quả tự kiểm ngữ nghĩa. Không chấp nhận từ khóa hay cùng chủ đề làm bằng chứng trực tiếp.

PDF, chữ trích xuất và ảnh trang nguồn nằm ngoài kho công khai. Sổ công khai chỉ giữ định vị/hash, phát biểu kiến thức độc lập và bằng chứng do app tự biên soạn. Không diễn giải việc này thành bảo đảm pháp lý; biểu đạt/tài sản cần quyền vẫn phải xử lý riêng.

## Chạy kiểm tra

```
node scripts/source-coverage-v2/check.test.cjs
node scripts/source-coverage-v2/check.cjs
node scripts/source-coverage-v2/check.cjs --require-covered
```

Lệnh thường kiểm cấu trúc và độ hiện hành của bằng chứng. `PASS_REGISTRY_CONTRACT` KHÔNG phải ngành hoàn tất. Lệnh `--require-covered` còn yêu cầu mẫu số đã được rà, tất cả trang/vùng đã phân loại và mọi kiến thức bắt buộc có bằng chứng đủ. Khi mẫu số còn mở, phần trăm bao phủ là null.

Các lỗi được chặn gồm: thiếu trang/vùng so với bản kiểm kê đã ghi, artifact đổi byte, bằng chứng app đổi nội dung, con trỏ JSON không tồn tại, tham chiếu cùng trang thay cho vùng cụ thể, từ khóa/candidate được tính là dạy trực tiếp, thiếu kiểm điều kiện, chưa rà biểu đạt, thiếu đánh giá, loại ý an toàn, vòng trùng lặp và tuyên bố100% khi mẫu số còn mở.

Kiểm máy không chứng nhận ngữ nghĩa, bản ngữ, chuyên môn, quyền, bố cục, thiết bị hay thời lượng. Mỗi mức phải có hồ sơ riêng. Không đưa sổ nguồn hoặc PDF vào dependency khởi động ứng dụng.

Bộ kiểm tra không tự đọc được ý nghĩa trang PDF từ các hash. Việc xác nhận trích xuất đầy đủ vẫn cần nguồn thật và receipt của tác giả; phân rã kiến thức vẫn cần đọc chữ/hình. Các kiểm tra máy là rào chắn chống đóng sai, không thay cho công việc đọc nguồn.
