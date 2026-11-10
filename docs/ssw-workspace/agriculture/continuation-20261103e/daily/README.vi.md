# Bộ đọc — guard cách đọc và kiểm byte hình có chọn lọc

Snapshot bắt đầu: `b06efcc97d2c526538aeceb2d6bb2eb525d2fc58`. Luồng này không rà chéo ngữ nghĩa nội dung của các luồng khác, không chạy lại browser đã có blocker và không sinh cách đọc mới.

## 1. Sửa guard ruby có bằng chứng

Phát hiện regex hiện tại chấp nhận `readingKana` chỉ có khoảng trắng cho token chứa Hán tự. Chuỗi đó không cung cấp cách đọc. `reading-guard-patch.json` thêm duy nhất kiểm tra `trim().length>0`; dữ liệu không hợp lệ trở về thân bài Nhật thường như hợp đồng selector hiện có.

Regression chứng minh năm loại chuỗi trống trước đây được chấp nhận và sau sửa bị từ chối. Root đã áp dụng bản sửa vào file dùng chung; `reading-guard-integrated-validation.json` kiểm trực tiếp selector đã tích hợp và xác nhận 16 lượt đoạn/cấp có ruby hợp lệ giữ nguyên token. Không tạo token, phát âm hoặc nội dung Nhật mới.

Không có cơ hội nối thêm ruby thân đoạn an toàn ngoài selector hiện tại: token câu trả lời tóm tắt/nhiều đoạn không được dùng như cách đọc cho nguyên đoạn; phần đọc liên quan chưa có token nguyên đoạn khớp chính xác. Hai đoạn mùa hè/mùa đông đã tự được selector hiện tại phục vụ khi đủ điều kiện.

## 2. Hình của bốn bài có phụ thuộc vừa thay đổi

Đã kiểm đúng bốn asset đang nối với các bài nước, cải tạo đất, thông gió 2号 và kế hoạch hoa. Ban đầu byte không có trong checkout hiện tại hoặc hai checkout cũ được đọc; không kết luận app thiếu hình. Root materialize đúng bốn đường PNG, sau đó hash, giải mã ảnh và kích thước khớp metadata hiện hành cho cả bốn. `focused-images.json` giữ bằng chứng riêng.

Đã mở toàn bộ bốn raster để xem pixel. `image-pixel-inspection.json` ghi phạm vi: nhãn/đường dẫn hình không bị cắt, sơ đồ tưới phân biệt nơi đưa nước, sơ đồ đất biểu diễn ba nhóm tính chất, sơ đồ nhà kính chỉ vị trí và hình hoa chỉ hỗ trợ nhận dạng ngoại hình. Không suy từ các hình đó thời điểm tưới, trình tự vận hành, thời gian sinh trưởng hoặc chi phí mới. Đây không phải kiểm layout trong reader, responsive, Expo hoặc thiết bị thật.

## 3. Kiểm hoạt động mới sau tích hợp

`activity-host-check.cjs --ids <danh-sách-ID-mới>` chỉ kiểm component thực cho đúng các hoạt động thay đổi. Kiểm nguồn/đoạn hiện hành, đáp án ẩn trước khi mở, bật/tắt đáp án, dịch đúng trường cho 12 ngôn ngữ, tái dựng đúng chữ Nhật, cách ly bài/cấp. React Native Text/View, appearance và Button là host fixture. Báo cáo sau tích hợp ghi chính xác các ID và số ca; không dùng chúng để đóng thêm ý nguồn.

Các lệnh tái lập:

```bash
node docs/ssw-workspace/agriculture/continuation-20261103e/daily/check-reading-guard.cjs
node docs/ssw-workspace/agriculture/continuation-20261103e/daily/check-focused-images.cjs --lessons agr-water-decision,agr-soil-building,agr-par12-facility-ventilation-conditions-2,agr-flower-work-production
```

Không chạy browser lại, không cài dependency, không đo thời gian người học và không nghiệm thu bản ngữ/chuyên môn. Các kết quả cũ được giữ nguyên.

### Sau tích hợp e

Đã kiểm đúng chín hoạt động mới được điều phối chỉ định, một lần, đạt 192 ca cấp/ngôn ngữ và chín phần nguồn đúng phiên bản. `activity-host-validation-e9.json` đóng băng chính xác ID và hash input. Regression guard chạy lại vì dữ liệu mới đã nối thêm: vẫn từ chối năm kiểu cách đọc trống, giữ nguyên 18 lượt đoạn/cấp có ruby hợp lệ. `reading-guard-integrated-final.json` là kết quả cuối. Không có tiến trình còn chạy.
