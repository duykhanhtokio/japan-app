# 建設 — checkpoint khởi động 2026-10-11

## Công việc thực sự đã làm

Đọc toàn bộ hướng dẫn chủ dự án gửi; AGENTS.md; AI_SESSION_START_HERE.md; quy tắc Tokutei Gino độc lập; chỉ mục nguồn; Kaigo rules v10. Đọc Stage A handoff, Stage B2 handoff, báo cáo xác minh B1 và tự kiểm B2 trực tiếp từ repo xây dựng. Kiểm cây repo xây dựng main bằng GitHub: không có PDF nguồn. Các số B1 trong báo cáo có ngày kiểm 2026-09-23, chưa tái xác minh trong phiên này, không phải chứng nhận hiện hành.

Repo app kiểm trước thay đổi: recovery/jlpt-n3-n1; HEAD và remote được quảng bá cùng là 5b052d9a5dffdfd89d72b551a2e995e5aff6d1b0. UI Lock PASS 10/10. Bảo toàn thay đổi Kaigo đang có; chỉ thêm hồ sơ trong thư mục kensetsu.

Mục 建設 trong src/app/specified-skills/index.tsx đang disabled. Không tìm thấy route hay giáo trình 建設 chuyên biệt trong src. Không mở nội dung chưa kiểm duyệt vào app. Catalog B2 đọc được ghi sample_draft, appIntegrationReady false; hồ sơ tự kiểm cho biết 30 bài cũ còn nông và chưa duyệt. Không tạo lại hoặc tính chúng là bài đã hoàn tất.

## Hồ sơ mới

Hướng dẫn được lưu nguyên byte. authoring-plan.json xác lập đúng sáu ID lộ trình; lịch, số tuần và mẫu số kiến thức để trống chờ kiểm kê. source-inventory.json ghi nguồn chưa truy cập; knowledge-coverage.csv là cấu trúc đối chiếu, chưa có hàng kiến thức. Đây là khung biên soạn, không phải giáo trình đã tạo.

## Blocker cụ thể

- SRC-1: chưa truy cập được Nội dung đưa vào app/Tokuteigino-kensetsu/01-特定技能1号.
- SRC-2: chưa truy cập được Nội dung đưa vào app/Tokuteigino-kensetsu/02特定技能2号.

Đã tìm thư mục trong /workspace và tìm tên/nội dung liên quan trong Library; chưa có kết quả xác định được hai kho. Không suy ra kho rỗng. Cần cung cấp hai thư mục qua upload hoặc một kết nối có quyền đọc; nếu chỉ nằm trên Mac, thực hiện phiên trong Codex tại máy đó. Không dùng chỉ mục/handoff thay cho đọc trang thật.

## Trạng thái QA

Chưa đọc trang nguồn, chưa kiểm trực quan hình/bảng. Chưa sản xuất bài Nhật, bản dịch, ảnh hoặc runtime. Chuyên môn/bản ngữ/quyền/tương đồng: chưa kiểm. Chưa đạt cổng tích hợp/phát hành. Không tính tỷ lệ bao phủ. 13 locale app đã xác định từ src/i18n/languages.ts; phạm vi ngôn ngữ phát hành chưa đạt nên releaseLocales rỗng. Không sản xuất phần thi.

## Bước tiếp theo

Khi SRC-1/SRC-2 mở được: kiểm kê byte/hash/phiên bản/trang và trùng bản; đọc nguồn đầy đủ, phân rã từng ý gồm nhãn hình/bảng/chú thích; đối chiếu bản nháp B2 trước khi sửa; lập kế hoạch khoảng 30 phút/buổi riêng cho sáu lộ trình; làm buổi mẫu trọn Nhật–dịch–ảnh trước mở rộng. Mọi hướng dẫn an toàn phải qua gate tương ứng trước phát hành.

Commit chứa hồ sơ này không ghi SHA của chính nó. Xác minh push/fetch/WORK PERSISTENCE trong bằng chứng thực thi, không tạo commit chỉ để cập nhật SHA.
