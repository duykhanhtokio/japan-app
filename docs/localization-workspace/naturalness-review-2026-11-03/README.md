# Rà ngữ cảnh hội thoại — 03/11/2026

**Đã rà thêm 20 bài ở đủ 12 ngôn ngữ, chưa hoàn tất toàn bộ corpus.**
Tiến độ tăng từ 33 lên **53/7.128 bài**; còn **7.075 bài**.
Cụm Kanazawa đạt **21/21 bài** trong phạm vi câu thoại và gợi ý.

## Nội dung đã xử lý

Đã đọc trọn tình huống và đoạn hội thoại tiếng Nhật, rồi đối chiếu từng câu
và gợi ý của đủ 12 ngôn ngữ cho Kanazawa 02–21: **3.840 trường**, **99 sửa đổi**.
Năm receipt `kanazawa-02-05.json` đến `kanazawa-18-21.json` ghi hash từng
nguồn/đích đã rà cùng mọi giá trị trước/sau. Tiếng Nhật, ID, thứ tự lượt,
hình, âm thanh, giao diện và cờ chưa duyệt bản ngữ được giữ nguyên.
Chỉ đồng bộ hash manifest của các file dịch đã sửa.

Các sửa đổi gồm: góc quan sát và phạm vi lối đi; cửa sổ ngoài khung ảnh;
nhận hướng dẫn chuẩn bị xét nghiệm thay vì tự đưa hướng dẫn; liên lạc khác
với gọi điện; áo mặc dưới áo khoác khác với đồ lót; bỏ đầu cá khác với bỏ
hết xương; xưng hô trung tính cho Sato; danh tính người gửi lời cầu nguyện;
đồ ướt và túi bị rò nước; tư thế nằm khác với kết luận đang ngủ; và dùng
cùng phiên bản bản vẽ thay vì sửa hình học cho các bản giống nhau.

## Giới hạn còn mở

Receipt ghi riêng các vấn đề tiếng Nhật: lớp áo ngoài/trong rồi chuyển sang
上下; nhiệm vụ báo người tiếp quản đã đồng ý nhưng câu nói mới chỉ xác nhận
đã nhờ; và cách hiểu mệnh đề 友人だけに送るか先に聞きます. Các điểm này chưa
được coi là đã chốt nguồn. Cách xưng hô theo giới tính người chơi ở một số
ngôn ngữ còn cần chính sách profile thống nhất. Rà AI không phải duyệt bản ngữ.
Metadata, kiểm thử thiết bị và nghiệm thu phát hành nằm ngoài kết quả này.

## Kiểm tra

Ba lô 034, 035, 036 khớp nguồn/ID/role/gợi ý ở đủ 12 ngôn ngữ. Bộ kiểm tra
thực sự chạy qua loader toàn corpus, xác minh hash tất cả 10.176 trường đã
rà từ các phiên, đối chiếu queue với receipt và kiểm tra tiếp 7.128 bài còn
đủ dịch, hiragana và binding âm thanh. Các quyết định xử lý cũ vẫn không
có mục pending/stale. Khóa giao diện JLPT 10/10 giữ nguyên.

```bash
node scripts/check-dialogue-release-readiness.cjs --technical-only --out /tmp/dialogue-runtime-qa.json
```

## Điểm tiếp tục

`SC-LOC-JP-17205-01-001`, lô **460**, thành phố **Suzu (珠洲市)**.
Queue chính: `../naturalness-review-2026-10-25/prefecture-queue.json`.
Suzu, Hakui, Kahoku, Hakusan, Nomi và Nonoichi còn 48 bài tại Ishikawa.
Toàn corpus còn 7.075 bài cần rà ngữ cảnh đủ 12 ngôn ngữ.
