# Khôi phục tích hợp40 bằng ảnh chụp mã nguồn chính xác

`manifest.json` khóa bốn tệp dùng chung bằng SHA-256 trước/sau; chín snapshot là toàn bộ byte đã ghi nhận từ HEAD `dfb2af5120b963aaa3f6f22e79a251fd6d00ebae` và bản triển khai40. Đây là mã nguồn ứng dụng, không phải bản sao nội dung PDF.

`python scripts/manufacturing/apply-implementation40.py` xác minh toàn bộ snapshot và cả bốn phiên bản hiện tại trước khi ghi. Course còn chấp nhận đúng snapshot upstream87a64c6c (hash50cad14c) làm tiền nhiệm bổ sung; các tệp khác giữ nguyên tiền nhiệm dfb2af51. Chỉ chấp nhận đúng hash trước hoặc sau; chạy lần hai không ghi. Phiên bản không nhận diện hoặc snapshot hỏng bị từ chối. Assembler gọi replay40 sau replay39.

Các biên nhận lịch sử22/25/32 và bộ kiểm tra thuật ngữ35 chiếu duy nhất byte40 khớp hash về snapshot tiền nhiệm, rồi tiếp tục toàn bộ kiểm tra lịch sử cũ. Sửa39 nhận đúng hash40 của SupplementalManufacturingDiagrams dưới dạng no-op sau khi kiểm tra snapshot tiền nhiệm chính là hash39 đã sửa. Không bỏ qua bảo vệ hash lịch sử.

`python scripts/manufacturing/check-implementation40-replay.py` PASS: phục hồi4 tệp, lần hai không ghi, phiên bản lạ ở tệp cuối từ chối trước mọi ghi, snapshot hỏng bị từ chối, phép chiếu Course và no-op39 cho40. Các tình huống thay byte chạy trong thư mục tạm, không ghi đè runtime đang cộng tác.

Lệnh manufacturing:check với NODE_PATH của visualqa-deps đã qua các lỗi lịch sử40; lần chạy của luồng này dừng vì checkout chưa có tệp theo dõi `src/i18n/languages.ts`. Luồng gốc bổ sung checkout và ghi kết quả toàn bộ riêng. Không suy diễn PASS toàn bộ từ các fixture này.
