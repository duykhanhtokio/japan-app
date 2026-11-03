# Kanto — rà ngữ cảnh 12 ngôn ngữ

Phạm vi 1.681 bài, 7 tỉnh/thành (PRF-008 đến PRF-014). Sáu AI có quyền sở hữu độc lập theo lô: 281/280/280/280/280/280 bài; tổng 178 lô. Không kiểm chéo ngữ nghĩa. Mốc đầu vào `7dfefea18ca037b06798b1e03154b3f175b5eceb`; giữ nguyên bằng chứng trước đó. Kanto chưa có bài đã rà đủ ở mốc đầu vào.

Chỉ bài đã thực đọc tiếng Nhật và đủ 12 ngôn ngữ, có receipt hash từng câu/gợi ý và ghi chú riêng, mới tính rà ngữ cảnh bằng AI. Các bài chưa đọc vẫn nằm trong assignment; phân công không chứng minh hoàn tất. `worker-1.json` đến `worker-6.json` được ghi tăng dần, không thay cho chứng nhận bản ngữ, phát âm, thiết bị hoặc phát hành. Các điểm chưa rõ trong nguồn Nhật được ghi riêng, không tự sửa nguồn để che vấn đề.

Khi worker đã ngừng ghi, chạy `python scripts/check-kanto-context-review.py --sync` để kiểm chứng quyền sở hữu, độ đủ 12 ngôn ngữ, hash và mọi thay đổi, rồi đồng bộ queue/manifest. Chạy `TOKUTEI_QA_MODULES=<dependencies> node scripts/check-kanto-context-loader.cjs` để kiểm văn bản qua loader thực. Chỉ chốt vùng khi đủ 1.681 bài có bằng chứng hợp lệ.

## Checkpoint hiện tại

Đã thực đọc **188/1.681 bài × 12 ngôn ngữ**, **36.096 trường**; sửa **1.389 trường** trong **203 tệp lô dịch**. Lượt tiếp tục thêm **131 bài** so với mốc 57 bài đã xác minh trên GitHub ở `80054e5876`. Còn **1.493 bài**, vùng chưa hoàn tất. Sáu worker đã dừng tại bài hoàn chỉnh; `resume.json` ghi điểm tiếp tục riêng. Không rà lại phần có bằng chứng hợp lệ.

Có **6 điểm căn chỉnh nguồn Nhật** chưa chốt, lưu riêng trong receipt/resume; số bài đã đọc bằng AI không chứng minh nghiệm thu nguồn/bản ngữ/phát âm/thiết bị. Giữ các kết quả Hokkaido và Tohoku đồng thời đã được tích hợp.

`baseline-file-hashes.json` lưu dấu vết đầu vào và hash chuẩn của toàn bộ kịch bản Kanto được giao trong 2.136 tệp locale. Validator replay thay đổi ngược và so hash phạm vi sở hữu, kiểm cả metadata tệp; không phụ thuộc commit chỉ có trong bản clone cũ. Một lô giáp vùng có thể chứa bài của vùng khác; các bài đó được kiểm bằng receipt tương ứng, không ghi đè bằng dữ liệu Kanto.

Git trực tiếp ở môi trường này thiếu thông tin đăng nhập; kết nối GitHub đã lưu cây nội dung tương đương mốc `0ade4fc175`, sau hợp nhất công việc đồng thời. Đối với checkpoint hiện tại, chỉ xác nhận lưu bền sau fetch và `WORK PERSISTENCE PASS`; xem commit thực tế thay vì dựa vào mã commit lịch sử cục bộ.
