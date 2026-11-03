# Nạp nội dung khi mở mục — 03/11/2026

Yêu cầu: không dựng trước toàn bộ nội dung học khi khởi động; chỉ nạp phần cần dùng khi người học mở mục. Thay đổi này giữ nội dung, ID, thứ tự, tiến độ và khóa UI JLPT.

## Đã triển khai

- 15 route Học, từ vựng, từ điển, bài học và Hội thoại chuyển thành vỏ nhẹ. Router khám phá route mà không đánh giá module màn học. Khi mở màn, vẽ trạng thái chờ trước rồi mới nạp. Thành công được cache; rời trước khi nạp thì hủy; lỗi có thử lại và quay về. Thân màn hình và đích import tương đối được kiểm bảo toàn nguyên nghĩa; riêng hai màn tỉnh/thành phố thay cách đếm bằng metadata tương đương, không đổi kết quả hiển thị.
- API Hội thoại không nạp JSON học khi import. Danh mục thành phố chỉ nạp catalog; số bài/số lượt dùng metadata nhỏ. Địa điểm và kịch bản dùng 32 nhóm được nạp theo yêu cầu; tra một ID không phải dựng toàn bộ kho. Giữ 814 thành phố, 7.112 địa điểm, 7.128 kịch bản, 7.553 index hiệu lực, thứ tự và đối tượng cache.
- Tokutei giữ cơ chế deferred route hiện hữu: không mở ngành thì không đánh giá module khóa ngành. Sản xuất vẫn nạp theo chuyên ngành. Không tuyên bố đã tách mọi giáo trình Tokutei tới từng ngày.

## Bằng chứng

`on-demand-content-20261103/content-validation.json`: import API nạp 0 JSON nội dung. Mẫu thành phố/địa điểm mở lần đầu nạp 1.665.051 byte JSON so với API cũ dựng 26.528.876 byte. Đây là đếm byte JSON được đánh giá trong harness, không phải đo RAM hay thời gian thiết bị.

`on-demand-content-20261103/route-validation.json`: 15 thân màn và import được bảo toàn; kiểm nạp sau khung chờ, không nạp route khác, cache khi quay lại, hủy trước nạp và thử lại sau lỗi đều đạt. Khóa JLPT 10/10 giữ nguyên. Chưa đo khởi động trên Mac/iPhone/Android, chưa xác nhận export Expo toàn app hoặc lỗi OOM trước đây đã hết.

## Dữ liệu và cập nhật

Các phần học vẫn đi kèm bản cài và dùng ngoại tuyến. Thay đổi này trì hoãn đánh giá module/nạp bộ nhớ; không phải máy chủ tải gói qua Internet và không tự giảm toàn bộ kích thước JS bundle/Metro lần đầu.

Nguồn dữ liệu Hội thoại gốc không đổi. Khi biên tập các đầu vào ghi trong `src/data/generated/life-on-demand/input-revisions.json`, chạy `npm run life:content:build`, rồi `npm run life:content:check` trước khi commit. Bộ kiểm từ chối revision nguồn lệch. Các shard là đầu ra tự sinh; không sửa trực tiếp. Bộ kiểm route dùng esbuild, TypeScript, React và react-test-renderer trong môi trường QA.
