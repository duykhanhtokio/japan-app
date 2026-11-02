# Ba cụm thực hành nối tiếp40→41→42 —02/11/2026

Nền8df77df. Đã làm nối tiếp ba cụm: đọc nguồn → xác định khoảng trống thực hành → chốt Nhật → dịch12ngôn ngữ/ruby → tích hợp đúng ngày → kiểm tra component thật → chuyển cụm kế tiếp. Không mở lại các mục màu38, sigma39 hoặc76trang trực quan đã xử lý.

Nguồn2号bản3.01/hash `a2949e7f8e5282ee163e5015baacc39b0a4aeddf8ffb9b05cb93fb93ea116e57` đã có byte thật. Đọc cả chữ và ảnh củaPDF69,70,71,72,76,77/trang in60,61,62,63,67,68. Không đưa PDF, chữ trích xuất hay ảnh trang vào mã nguồn.

| Cụm | Ngày được bổ sung | Đơn vị năng lực thực hành |
|---|---|---|
|40|food-2-017|Xử lý lần kiểm tra theo lịch chưa thực hiện; phân biệt ATP chỉ thị chất hữu cơ với bằng chứng không có vi khuẩn/hiệu quả diệt khuẩn.|
|41|food-2-019|Theo liên kết nhiều lô nguyên liệu–sản phẩm–nơi nhận; truy ngược khi hồ sơ thiếu một lô thực tế đã dùng.|
|42|food-2-016|Không dùng kết quả khối lượng để chứng minh nhãn đúng; phối hợp phát triển/sản xuất/chất lượng/kinh doanh trước khi hứa điều kiện bảo quản chưa xác minh.|

Khái niệm nền đã tồn tại trong bài học. Khoảng trống ở đây là các tình huống và bài tự giải thích cụ thể, chưa có trong44bài tự kiểm tra34/35/38/39 trước lượt này; không tuyên bố toàn bộ các chủ đề ấy từng bị bỏ sót hoặc chưa được kiểm tra bằng hình thức nào khác.

40được tích hợp và kiểm tra đạt rồi mới sang41;41đạt rồi mới sang42. Sau biên tập cuối, cả ba được kiểm tra lại trên cùng bản tích hợp. Tổng mới:3phần dạy,6bài tự kiểm tra,12ý trả lời,108cặp phần dạy/bài tập–ngôn ngữ,144ý trả lời dịch và30trường ruby. Tất cả là ứng viên AI, chưa có duyệt bản ngữ/chuyên môn.

Tình huống41dùng dữ kiện giả định độc lập: X dùngA/B, Y dùngB, Z dùngC; X đếnP/Q, Y đếnQ, Z đếnR. Validator tính đường đi để kiểm chứng A→X→P/Q và B→X/Y→P/Q, cùng chiều ngượcX→A/B; không dùng tên nhà cung cấp thay mã lô, không coi ô thiếu là bằng chứng chưa sử dụng. Không trao quyền tự quyết xuất hàng/thu hồi.

Tình huống40không đặt ngưỡngATP, lịch kiểm nghiệm hoặc phương án xử lý sản phẩm chung cho mọi nhà máy. Tình huống42không thêm quy định pháp luật hoặc điều kiện bảo quản mới. Các quyết định xử lý thực tế được đưa về quy trình và người có thẩm quyền.

`source-closure40/41/42.json` được nạp qua Reader và component bài tập thật, gắn `lessonSourceHash`;6bài có đáp án ẩn đến khi chọn mở. Giữ nguyên96ngày/ID gốc,848câu thi, revision và khóa tiến độ. Không tạo hình mới trong lượt này; các hình/ngày hiện hành được bảo toàn.

Ma trận `atomic-extension40-42.json` ghi6đơn vị nhỏ, trang nguồn, trạng thái trước/sau, đoạn dạy/hash, bài kiểm tra/hash và vị trí ý trả lời. Đây là phần mở rộng có phạm vi của sổ nguồn, không phải phép cộng cha/con để tính phần trăm251trang. Hồ sơ từng cụm là `evidence40/41/42.json`.

Kiểm tra đã thực chạy:

- `check-source-cluster.cjs 40`, rồi41, rồi42: mỗi cụm PASS26view SSR (Nhật+12ngôn ngữ ×đóng/mở),52trạng thái bài tập,2ca bài/hash sai bị loại,10trường ruby. Tổng78view/156trạng thái/6ca loại. Kiểm cả hash trong ma trận nguyên tử và mã lô của12bản dịch41.
- Kiểm đối xứng token số ở60trường dịch mỗi cụm; cụm này không có thông số số học, nên mục này chủ yếu ngăn tự thêm con số, không được hiểu là180phép tính đã kiểm chứng.
- Hồi quy `check-source38.cjs`, `check-source39.cjs`: PASS.
- `check-question-review.py`: PASS848biên nhận hiện hành,0thiếu.
- `check-daily-learning.cjs`: PASS96binding ngày/hình,76file được bảo vệ và76ca sửa byte bị từ chối.
- `git diff --check`: PASS.

SSR dùng adapter cho component dịch và trạng thái mở được tiêm chỉ trong test. Cảnh báo thiếu `expo/tsconfig.base` vẫn có; scoped bundle hoàn tất. Không suy ra đã chạy trình duyệt, Expo production, iPhone/Android thật hoặc đo thời lượng. Các cờ native/domain/device/full-source vẫnfalse. Root cần commit/push/fetch xác minh trước khi nói đã lưu bền.
