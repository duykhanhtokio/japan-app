# Sửa 18 ảnh nông nghiệp — 2026-11-08

Phạm vi đúng 18 ảnh được chọn trong báo cáo phiên này. Mẫu phong cách: ảnh Royal cây giống `week02/thinning-botanical-comparison-v2.webp`, nền giấy ngà, vàng và chữ xanh đậm.

- 14 ảnh có lớp minh họa mới: cây lúa, cây giống, thủy canh, dáng cây, bộ phận cây, ghép mắt, vị trí cây ghép, nhiệt kế, bao quả và vật chứa ươm cây.
- 4 ảnh kỹ thuật được dựng lại bằng code: tên/vị trí cành, tuổi cành của sáu loại cây, vị trí cắt tỉa và các giai đoạn ghép cành. Chữ, ký hiệu, thứ tự và màu phân biệt được đặt bằng code để tránh lỗi chữ trong ảnh sinh tự động. Đây vẫn là sơ đồ kỹ thuật, không phải ảnh nhận diện thực vật.
- 18 ảnh thay thế được gắn vào resolver thật và dữ liệu bài học; giữ ID bài, ID hình và kiến thức gốc.
- Đồng bộ hash của chú thích, đọc chữ và 12 ngôn ngữ.
- 6 hình thi và 11 liên kết câu hỏi được cập nhật phiên bản và vùng che chữ theo tọa độ mới. Nội dung câu hỏi, phương án và đáp án không đổi.

## Kiểm tra

`node scripts/agriculture/check-royal-repair-18.cjs`: PASS 18 ảnh đọc được, kích thước/hash đúng, resolver trỏ đúng; 6 hình thi che đủ chữ; 11 câu hỏi giữ nguyên nội dung; 54 trường đọc chữ và 216 bản ngôn ngữ vẫn khớp.

Đã xem trực quan bản ảnh và bản che chữ của sáu hình thi. Không nhận là đã kiểm tra trên simulator hoặc thiết bị thật. Bộ kiểm tra render React hiện chưa chạy được vì checkout không có `@babel/core` và các dependency React của app. Không suy ra duyệt chuyên môn/người bản ngữ/phát hành từ các kiểm tra tệp này.

## Tệp và cách dựng lại

- `manifest.json`: đủ 18 ID, đường dẫn cũ/mới, hash, kích thước và tọa độ chữ.
- `assets/agriculture/royal-repair-18-20261108/`: ảnh WebP thay thế, kèm lớp minh họa nguồn trong `source-art/`.
- Dựng: `node scripts/agriculture/render-royal-repair-18.cjs`.
- Đồng bộ sau dựng: `python scripts/agriculture/integrate-royal-repair-18.py`.
- Kiểm tra: `node scripts/agriculture/check-royal-repair-18.cjs`.

Công cụ tạo ảnh tích hợp được dùng cho 14 lớp minh họa. Prompt chung và ảnh tham chiếu được ghi trong manifest; lớp chữ/ký hiệu kỹ thuật được dựng độc lập bằng code. Không có tiến trình tạo ảnh theo lịch hoặc AI con được khởi chạy trong phiên này.
