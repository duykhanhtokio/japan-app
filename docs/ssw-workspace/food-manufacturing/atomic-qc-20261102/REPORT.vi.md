# Thực phẩm — đối chiếu nguyên tử và vá khoảng trống QC43–45

Ngày02/11/2026. Nền mã nguồn `ee7ac2b1`, nhánh `recovery/jlpt-n3-n1`.

Đã phục hồi PDF2号 đúng bản3.01, kiểm SHA-256 `a2949e7f8e5282ee163e5015baacc39b0a4aeddf8ffb9b05cb93fb93ea116e57`, đọc chữ và hình của PDF83–88/trang in74–79. Không đưa PDF, chữ trích nguồn hay ảnh trang nguồn vào repository.

## Đối chiếu và phần đã sửa

`matrix.json` phân rã35đơn vị ở ba nhóm83–85,86–87,88: đoạn văn, công thức, trục, chú giải, hình và các mệnh đề phụ.78liên kết trường/câu được ràng buộc bằng hash;7hình cũ có byteWebP thật. Trạng thái trước sửa được giữ nguyên:28mục có ánh xạ AI đã kiểm,4mục mới đủ một phần,2mục thiếu,1mục có dạy/hình nhưng chưa chứng minh bài đọc từng điểm. Đây là các đơn vị được liệt kê ở mức chi tiết này, không phải lời chứng nhận không còn bất kỳ ý nhỏ nào khác.

`remediation43-45.json` đóng bằng ứng viên AI7khoảng trống nêu trên, giữ trạng thái trước/sau riêng:

|Nhóm sửa|Bài thật|Nội dung có nguồn và bài áp dụng|
|---|---|---|
|43|food-2-021|Hai trục, chiều dài cột, thứ tự nhóm không bắt buộc giảm dần, phân biệt Pareto, giải thích trục/đơn vị cho người đọc; đọc các điểm tuần2/3 của hình gấp khúc hiện có và giữ thứ tự thời gian.|
|44|food-2-043|Nhiều nhóm có trung bình khác nhau có thể tạo dạng bàn; không loại trừ trộn nhóm chỉ vì hình phẳng, phân tầng dữ liệu gốc.|
|45|food-2-043|Dạng đảo tách rời có thể liên quan sai phương pháp đo bên cạnh trộn nhóm; kiểm phương pháp/đơn vị/hồ sơ thay vì khẳng định một nguyên nhân.|

Tổng thêm3đoạn dạy,4bài tự kiểm tra không chấm điểm,8ý đáp án,84cặp phần dạy/bài tập–ngôn ngữ và96ý đáp án dịch. Có22trường ruby ghép đúng chữ; đọc `台型` là `だいけい` theo ruby nguồn, không suy máy móc thành `だいがた`. Ba hìnhWebP độc lập1400×900 được dựng bằng công cụ kiểm soát; hình cột giữX4/Y9/Z2, hình nhóm có dữ liệu cộng kiểm được, hình đảo chỉ đặt giả thuyết. Trục/chú thích Nhật và giải thích nhãn tương ứng nằm trong12bản dịch. Hình thời gian cũ được tái sử dụng đúng bài, không tạo lại.

Bổ sung đi qua Reader, component bài tự kiểm tra và thư viện hình thật, ràng buộc `lessonSourceHash`/`sourceHash`. Caption/hình có chặn sai revision, mở phóng to theo cơ chế sẵn có. Giữ96ngày,848câu thi, revision bài gốc và khóa tiến độ. Không chỉnh lịch hoặc suy thời gian học từ số chữ.

## Kiểm tra đã chạy

- `python3 scripts/food-manufacturing/audit-qc-atomic.py --check`: PASS35mục/78bằng chứng/7hình; phát hiện lệch hash trường hiện hành.
- `NODE_PATH="$PWD/node_modules" node scripts/food-manufacturing/check-source43-45.cjs`: PASS84cặp dịch/96ý dịch/22trường ruby; component thật104view SSR gồm trạng thái đóng/mở,8ca bài/hash sai bị từ chối; đáp án chỉ xuất hiện sau mở. Kiểm7liên kết sửa trước/sau, phép trừ9−4=5 theo các giá trị được đọc, và tổng từng lớp của3nhóm hình44. SSR sử dụng adapter dịch/RN-web và trạng thái mở được tiêm riêng trong test.
- `python3 scripts/food-manufacturing/check-question-review.py`: PASS848biên nhận hiện hành,0thiếu; không suy thành chứng nhận chuyên môn.
- `node scripts/food-manufacturing/check-daily-learning.cjs`: PASS96binding ngày/hình,76file bảo toàn,18snapshot đính chính lịch sử,76ca sửa byte bị từ chối. Lần đầu thiếu treeGit của baseline do clone nông; đã fetch đúng commit `3a09e225d95dca6975a81152fb1a6ecf9469e04d` và chạy lại đạt, không nới validator.
- Biến đổi cú phápTSX của3component Reader đã sửa: PASS. Các component dạy/câu được bundle và render trong phép kiểm SSR phía trên.
- `git diff --check` trong phạm vi thực phẩm: PASS.

Đã xem trực quan3hình mới ở độ phân giải tổng hợp; đây là kiểm artwork, không phải kiểm hình trong trình duyệt/Expo/điện thoại.

## Phần chưa nghiệm thu

Chưa hoàn tất phân rã toàn bộ251trang. Không biến35mục mới thành phần trăm bao phủ toàn ngành, không cộng chúng với mục cha/con ở sổ cũ để tuyên bố hoàn thành. Chưa chứng nhận toàn bộ thuật ngữ12ngôn ngữ, phát âm, bản ngữ/chuyên môn, Expo production, thiết bị thật hay thời lượng thực học. Nội dung mới và bản dịch vẫn `authored_ai_unreviewed`.

Điều phối cần commit/push/fetch và xác minh đúng commit trước khi tuyên bố đã lưu từ xa. Báo cáo này tự nó không phải bằng chứng persistence.
