# Sàng lọc nhanh toàn bộ 7.128 bài — 03/11/2026

Đã sàng lọc **7.128/7.128 bài**, đủ 12 ngôn ngữ, gồm **1.368.576 trường câu thoại và gợi ý**. Đây là hoàn tất sàng lọc tự động và xử lý các tín hiệu, chưa phải nghiệm thu ngữ nghĩa toàn bộ.

| Kết quả | Số lượng |
|---|---:|
| Tín hiệu trước / sau sửa | 3.099 / 3.099 |
| Quyết định cũ còn khớp nguồn, đích và loại tín hiệu | 3.037 |
| Mục mới hoặc lỗi thời giao 6 AI | 62 |
| Mục mới được chấp nhận | 61 |
| Lỗi mới xác nhận và đã sửa | 1 |
| Mục hoãn / phần tràn / ứng viên cuối chưa xử lý | 0 / 0 / 0 |
| Bài đã rà ngữ cảnh đầy đủ | 448/7.128, giữ nguyên |

## Xử lý có giới hạn

Chỉ một lượt giao việc: 11/11/10/10/10/10 trường cho 6 AI độc lập, không kiểm chéo. Mỗi nhóm đọc các trường nghi vấn và ngữ cảnh Nhật cần thiết. Không đọc lại toàn bộ 12 ngôn ngữ của từng bài và không tạo receipt toàn bài.

61 mục mới là trích dẫn tiếng Nhật hợp lệ, như nhãn triển lãm, tên sản phẩm và chữ phân biệt tên người. Không tự bỏ chữ đúng chỉ để giảm số tín hiệu.

Đã sửa một câu Indonesia tại `SC-LOC-018-09-001`, lượt 06: dùng `tidak semua` để giữ nghĩa phủ định bộ phận “không phải tất cả xương đều đã được tìm thấy”. Nhãn `推定全長` được giữ để người học nhận ra chữ trên bảng. AI phụ trách đã tự xác nhận bản sửa; `fix-receipt.json` lưu trước/sau và hash.

Bài này thuộc 448 bài đã rà trước. Receipt lịch sử được giữ nguyên; `review-amendments.json` nối đúng một trường với quyết định sửa đã xác nhận và bản dịch mới. Bộ kiểm tra từ chối đính chính thiếu bằng chứng, hash lỗi thời hoặc nội dung bị thay ngoài hồ sơ. Không tăng tổng bài rà sâu và không tuyên bố đã đọc lại toàn bài.

## Bằng chứng

`initial/` và `final/` là hai lần quét cùng toàn bộ corpus: 714 lô, 8.568 file dịch. Chỉ một file đích thay đổi. Tất cả 3.099 tín hiệu cuối đều có quyết định còn hợp lệ. Số tín hiệu thô vẫn giữ nguyên vì chữ Nhật trích dẫn, số viết bằng chữ, câu ngắn hoặc câu giống nhau không tự đồng nghĩa lỗi.

`pending-signals.json` là ảnh chụp 62 ứng viên ban đầu, không phải danh sách còn mở sau xử lý. Trạng thái cuối lấy từ `report.json` và `final-resolutions.jsonl`.

`report.json` ghi số lượng và hash. `final-resolutions.jsonl` nối từng tín hiệu cuối với bằng chứng; `adjudications.json` chứa 62 quyết định mới. Lượt sau chỉ tái sử dụng quyết định khi nguồn, đích và loại tín hiệu vẫn khớp. Không có phần tràn cần lượt thứ hai. Sau sửa, chỉ chạy lại toàn corpus một lần.

`runtime-qa.json` xác minh nguồn, ID, vai nói, manifest, loader, hiragana và binding âm thanh; xác nhận 448 bài/86.016 trường có bằng chứng hiện hành và một trường đính chính. Khóa UI JLPT 10/10 và diff-check đạt. Đây là kiểm tra kỹ thuật, không phải nghe duyệt phát âm hay kiểm thử thiết bị thật.

## Giới hạn

**Rà ngữ cảnh đầy đủ vẫn là 448 bài; 6.680 bài còn lại chưa được rà sâu.** Sàng lọc không phát hiện mọi lỗi ngữ nghĩa. Duyệt bản ngữ, thiết bị, phát âm và dịch metadata là các phạm vi riêng; chưa nghiệm thu phát hành.

Chạy bộ quét khi dữ liệu thay đổi:

```bash
python3 scripts/audit-dialogue-translation-quality.py --out /tmp/dialogue-screen-all
```

Trước khi giao việc, đối chiếu hồ sơ cũ và `adjudications.json` theo hash nguồn/đích cùng loại tín hiệu. Chỉ giao mục mới hoặc lỗi thời, tối đa hai lượt × sáu nhóm × 30 trường; phần tràn phải ghi riêng. Chỉ áp dụng lỗi đã xác nhận và kiểm tra, rồi chạy lại cùng selection một lần và chốt báo cáo.
