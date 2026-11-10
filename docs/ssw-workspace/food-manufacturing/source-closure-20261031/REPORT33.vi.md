# Thực phẩm — đối chiếu câu hỏi và thực hành bổ sung

Ngày 31/10/2026. Tiếp nối checkpoint `0a0885227`. Chưa chứng nhận hoàn tất toàn ngành.

## Thay đổi đã làm

| Hạng mục | Trước | Sau đợt này | Giới hạn |
|---|---:|---:|---|
| Câu có bằng chứng AI đọc đầy đủ và đối chiếu nguồn | 26 | 116 | Còn 732/848 câu; không phải duyệt chuyên gia |
| Dẫn nguồn được sửa/bổ sung | — | 4 câu | q047: PDF19; q009 thêm19; q368 thêm14; week-01-q03 thêm18 |
| Hình/thẻ thực hành mới | — | 5 | 16 ý học nhỏ có nguồn và bài/đoạn/hash |
| Gắn bản dịch tiêu đề và thân đoạn cho hình mới | — | 60 cặp | 5 hình × 12 ngôn ngữ; chữ bên trong ảnh vẫn là Nhật |

Đã đọc câu dẫn, bốn lựa chọn, đáp án, lời giải và bốn lý do của 90 câu thêm. Nguồn đối chiếu: 1号 PDF7–8,12–23,54–60,68,70 theo phạm vi ghi trong `question-semantic33.json`. Những trang chỉ cung cấp ngữ cảnh bổ trợ không được tính thành câu đã duyệt thêm. q112 được đối chiếu bổ sung PDF55–57 về dừng an toàn và ngăn khởi động lại trước khi xử lý máy; PDF22 cung cấp yêu cầu tháo phần có thể tháo để rửa.

Không sửa nội dung Nhật, đáp án hoặc thứ tự 839 câu trong tệp gốc; chín câu bổ sung giữ nguyên. Giữ nguyên revision hiệu lực của 33 đề gốc, bao gồm bốn đề có sửa metadata nguồn, để tránh vô hiệu hóa tiến độ đã lưu. Cấu trúc và hash bản dịch của 10.176 cặp câu–ngôn ngữ đạt kiểm tra.

## Hình/thẻ thực hành

| Tệp | Bài/đoạn | Nguồn PDF | Phạm vi |
|---|---|---|---|
| garment | food-1-044/p2 | 1号27 | Kiểm tra các chi tiết trang phục và mục đích |
| head-mask-gloves | food-1-044/p3 | 1号24,28 | Tóc/mũ, độ phủ và khe hở khẩu trang, cỡ/rách/bẩn găng tay |
| chemical-ppe | food-1-012/p2 | 1号23,57 | Bảo vệ mắt/tay/thân; PPE không cho phép trộn chất tẩy clo và axit |
| ojt-cycle | food-2-004/p3 | 2号22–23 | Mục tiêu, thực hiện, quan sát và phản hồi; không chốt chỉ vì đã dự học |
| engineering-check | food-2-046/p2 | 2号131–132 | Giảm góc nhọn/khối lượng cửa, kiểm tra hiệu quả và nguy cơ còn lại |

Hình tự dựng, có SVG nguồn và WebP. Đã đọc riêng cả năm hình và trang nguồn được render. Hình OJT tổ chức lại ví dụ của bài hiện có, không gán sơ đồ bốn bước này là quy trình bắt buộc nguyên văn trong sách. Thẻ trang phục chưa thay thế bài tập nhận diện đúng/sai trên hình người mặc. Hình thiết bị không phải hướng dẫn tự cải tạo máy và không hứa loại bỏ toàn bộ nguy cơ.

Reader nay nhận hình có ràng buộc hash ở cả bài gốc và bài bổ sung; giữ nội dung, bản dịch và mở lớn. Công cụ kiểm tra mới đối chiếu hash của từng câu với bằng chứng duyệt, từ chối trạng thái duyệt không có bằng chứng hoặc bằng chứng đã cũ. Kiểm tra này không tự đánh giá đúng sai chuyên môn.

## Sổ đối chiếu và phần còn thiếu

Giữ nguyên trạng thái trước bổ sung của 381 bản ghi. Năm quyết định mới chỉ ghi phạm vi thẻ thực hành đã bổ sung, không đóng cả trang. Sổ hiện có 292 bản ghi chờ rà ngữ nghĩa, 67 phần dạy đã rà, năm phần dạy chờ hình, tám khoảng trống hình được rà trong phạm vi, năm phạm vi thẻ thực hành còn phải rà, bốn phần dạy mới còn đối chiếu tiếp.

Còn phải hoàn thành: phân rã và đối chiếu toàn bộ ý nguồn còn mở; 732 câu và từng phương án; liên kết đánh giá còn thiếu; nhận diện trực quan trang phục/PPE và các ví dụ nâng vật, thiết kế giảm nguy cơ chưa có; kiểm tra nội dung liên kết video; bản địa hóa chữ trong ảnh và xác nhận furigana; kiểm tra bản Expo, thiết bị thật và thời lượng học. Các kiểm tra Nhật bản ngữ, chuyên môn, người duyệt và phát hành vẫn chưa được chứng nhận.

Các tệp `figures33-validation.json`, `runtime33-preservation.json` và `browser33-validation.json` lưu riêng kết quả kiểm tra tương ứng; chỉ dùng báo cáo trình duyệt khi tệp kết quả thực tế đã được tạo thành công.

## Kết quả trình duyệt

Reader thực tế đạt 676 trường hợp: 13 hình cũ/mới × 13 ngôn ngữ × bốn viewport. 676 lượt kiểm tra ảnh giải mã đúng kích thước, 13 lượt mở lớn giữ bề rộng nguồn, không lỗi trang hay tràn ngang. Có adapter QA cho Royal, safe-area, backdrop và localStorage; đây chưa phải kiểm tra Expo production hoặc thiết bị thật. JLPT lock 10/10 và đối chiếu hash bằng chứng câu hỏi đều PASS.
