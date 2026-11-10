# Rà soát khối lượng ngày học và ảnh —2026-10-31

**Chưa đồng đều.** Có ngày chỉ là một bổ sung/đính chính rất ngắn nhưng được xếp thành ngày riêng; nhiều ảnh nằm ở bài hoặc thẻ tài liệu khác nên không xuất hiện trong ngày học. Nhãn30phút không phải bằng chứng thời lượng đã đo.

Đã dùng6AI với6phạm vi ngành riêng, không kiểm tra nội dung chéo. Bản kiểm tra nhánh tích hợp: `recovery/jlpt-n3-n1`, commit nền `26af1feaaf66704ad5868090a885afd017c40196`. Nhà hàng và Thực phẩm được kiểm tra riêng tại commit nhánh ngành ghi trong manifest, chưa có dữ liệu/route tương ứng trên nhánh tích hợp này.

## Khối lượng hiện tại

Chỉ số ký tự là thân bài Nhật không tính khoảng trắng, tiêu đề và bản dịch; hữu ích để phát hiện chênh lệch nhưng không chứng nhận số phút hoặc độ khó. Các ngành có hoạt động, thuật ngữ và hình khác nhau nên không dùng số chữ để xếp hạng chất lượng.

| Ngành/lộ trình | Ngày học | Ký tự thân bài: nhỏ nhất / trung vị / lớn nhất |
|---|---:|---:|
| Nông nghiệp1号 | 141 | 103 /480 /1.380 |
| Nông nghiệp2号 | 228 | 116 /509,5 /1.378 |
| Sản xuất cơ khí | 91 | 274 /379 /595 |
| Sản xuất điện/điện tử | 98 | 267 /407 /638 |
| Sản xuất xử lý bề mặt | 73 | 362 /624 /1.602 |
| Xây dựng, bài riêng không cộng trùng phạm vi | 484 | 84 /688 /3.214 |
| Kaigo, không tính3ngày luyện đề | 173 | 354 /1.024 /8.287 |
| Nhà hàng1号, chỉ nhánh ngành | 59 | 360 /496 /955 |
| Nhà hàng2号, chỉ nhánh ngành | 61 | 424 /611 /1.412 |
| Thực phẩm1号, chỉ nhánh ngành | 48 | 282 /319 /529 |
| Thực phẩm2号, chỉ nhánh ngành | 48 | 301 /364,5 /1.055 |

Các ngày/bài dùng chung giữa cấp hoặc chuyên ngành không phải kiến thức mới độc lập. Không cộng các hàng thành số bài riêng của toàn app.

## Nguyên nhân và vị trí cần xử lý

- **Nông nghiệp:**9ngày1号 và14ngày2号 dưới nửa trung vị lộ trình. Bài `agr-s1-vegetable-quality-improvements` chỉ103ký tự; `agr-f40-fgs-hydroponic-claim-scope` chỉ116. Nhiều bài “đọc phạm vi và giới hạn nguồn” một đoạn đang thành một ngày. Nên gắn vào ngày nền đúng chủ đề, hoặc thêm ví dụ/hoạt động có căn cứ.
- **Sản xuất:**262ngày đều ghi30phút nhưng chưa đo. Nhiều bài cơ khí/điện ngắn hơn nhóm xử lý bề mặt.117ngày dưới400ký tự thân bài,28ngày dưới300. Các thẻ source guides/completion37/recognition38 nằm ngoài lịch ngày; không mặc nhiên cộng chúng vào khối lượng ngày. Ví dụ ngày điện tuần12/ngày4, “保全の効果・用語と記録の比較”,267ký tự thân bài; cần rà cùng hoạt động, không chỉ thân bài.
- **Xây dựng:**65/484bài dưới500ký tự; có bài thực hành một đoạn84–93ký tự trong khi học khoa trung vị1.162. `kensetsu-building-practical-week-005` có8ngày, cần rà cách phân nhóm tuần. Nhóm thực hành/tổ trưởng không được tự coi đủ tải chỉ vì dùng cùng lịch với học khoa.
- **Kaigo:**54ngày bài nền có trung vị3.805,5ký tự,103ngày bổ sung nguyên tử chỉ670; chênh lệch theo cách đóng gói rất lớn.18ngày học dưới nửa trung vị chung. Ba ngày thi chỉ có phần giới thiệu ngắn nhưng mở bài luyện riêng; không đánh đồng chúng với thiếu kiến thức ngày học.
- **Nhà hàng/Thực phẩm:**chênh lệch trong bảng là nội dung nền trên nhánh riêng. Hướng dẫn bổ sung có thể thêm nội dung; riêng Nhà hàng chưa kiểm kê hết các guide nên không tuyên bố số chữ nền là toàn bộ tải đọc thực tế.

Không tự gộp lịch trong lần rà này: gộp phải có ánh xạ giữ ID/hoàn thành/bản dịch và bài kiểm tra. Không thêm kiến thức hoặc điều kiện không có nguồn để kéo dài bài.

## Ảnh đang phủ theo ngày ra sao?

| Ngành/phạm vi | Kết quả kiểm kê | Giới hạn kết luận |
|---|---|---|
| Nông nghiệp1号 |76/141ngày có raster đủ điều kiện;65thiếu |Không dùng khối chữ khái niệm thay ảnh |
| Nông nghiệp2号 |93/228ngày có raster đủ điều kiện;135thiếu |145IDbài thiếu raster ở ít nhất một cấp; không cộng thành200bài riêng |
| Sản xuất |24/262ngày có liên kết hình hợp lệ;238thiếu |Tài liệu/ảnh ngoài lịch chưa đáp ứng ảnh của ngày |
| Xây dựng |186/484bài riêng có hình;298thiếu |Đã kiểm đăng ký/tệp tồn tại, chưa duyệt lại ý nghĩa từng hình |
| Kaigo |176/176ngày có ảnh bối cảnh; chỉ4ngày có hình kỹ thuật |Chưa chứng nhận ảnh minh họa đúng trọng tâm; không kết luận172ngày bắt buộc cần hình kỹ thuật |
| Nhà hàng, nhánh riêng |7/120ngày có mapping ảnh raster của gallery |Guide chuyên biệt chưa kiểm hết, không gọi113ngày còn lại thiếu mọi hình; chưa tải byte ảnh |
| Thực phẩm, nhánh riêng |24/96ngày có mapping hình/sơ đồ;72thiếu mapping |Mapping tĩnh, chưa kiểm runtime/browser và điều kiện hash đầy đủ |

Ví dụ Kaigo: ngày77 học hệ nội tiết nhưng ảnh nhân viên trao đổi bữa ăn; chú thích hiện có cũng nói đó không phải sơ đồ nội tiết. Có ảnh không đồng nghĩa ảnh giúp hiểu kiến thức chính. Sơ đồ phù hợp có thể đáp ứng yêu cầu, không nhất thiết mọi ngày cần ảnh raster hoặc hình kỹ thuật.

Đường dẫn/byte/đăng ký của4ngành trên nhánh tích hợp đã kiểm theo extractor. Chưa mở từng trang để kiểm chứng ảnh hiện ra hay xác nhận lại chuyên môn ảnh. Các route Kaigo, Xây dựng và Sản xuất hiện có gate `__DEV__`; không coi tích hợp mã là đã phát hành công khai.

## Yêu cầu đã cập nhật

Áp dụng [quy định ngày học và ảnh](../DAILY_LEARNING_AND_IMAGE_REQUIREMENTS_VI.md) cùng [chính sách máy](../daily-learning-policy.json). Mỗi ngày học phải có ít nhất1ảnh/sơ đồ minh họa trực tiếp một mục tiêu trọng tâm, liên kết và hiển thị trong chính ngày. Ảnh trang trí/NPC/ảnh chung không tự được tính. Khi ảnh phù hợp chưa có, tạo ảnh mới; khi có rồi, liên kết đúng ngày và ghi lý do dùng lại.

Đánh giá tải học theo mục tiêu, giải thích, ví dụ, hoạt động và điều kiện thực tế. Ngày ngắn được xem để gộp hoặc bổ sung có nguồn; ngày quá dài cần chia hợp lý. Không yêu cầu các ngày bằng nhau từng chữ, không kéo dài bằng nội dung lặp.

`action-queue.json` là danh sách sàng lọc của4ngành hiện tích hợp: có thể trùng bài giữa cấp và trộn việc thêm liên kết với việc rà độ phù hợp. **972dòng không phải972ảnh mới hoặc972ngày thiếu kiến thức.** Các hàng nhánh riêng nằm trong summary của từng ngành. Đây là kết quả rà soát và yêu cầu bổ sung; chưa cân đối lại toàn bộ lịch hay tạo toàn bộ ảnh thiếu.

## Hồ sơ và khả năng tái chạy

- `agriculture/audit.json`, `manufacturing/audit.json`, `kensetsu/{rows,summary}.json`, `kaigo/audit.json`:chi tiết từng ngày/lộ trình và phương pháp.
- Các extractor4ngành đặt cùng thư mục kết quả; chạy tại repo có dependencies. Python dùng `PYTHONDONTWRITEBYTECODE=1`; Node cần `esbuild`. Chúng tái sinh snapshot ngành tương ứng, không sửa nội dung app.
- `restaurant/summary.json`:nhánh `feature/restaurant-20261026` tại `475625ae550dd60e976997d8b482aee43d80a96e`; `food/summary.json`:nhánh `feature/food-continue-20261029` tại `3a09e225d95dca6975a81152fb1a6ecf9469e04d`. Hai snapshot từ cây nhánh được ghim, không tự cập nhật theo nhánh tương lai.
- Không sửa lịch runtime, dữ liệu học, điểm, trạng thái hoàn thành, ảnh hiện có, bản dịch hay JLPT UI. Không tuyên bố đã đo thời gian, duyệt bản ngữ/chuyên môn, kiểm thiết bị thật hoặc nghiệm thu phát hành.
