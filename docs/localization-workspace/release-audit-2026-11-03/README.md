# Hội thoại — đối chiếu hiện trạng ngày 03/11/2026

**Trạng thái: đạt độ phủ kỹ thuật; chưa nghiệm thu toàn bộ để phát hành.**
Mã nguồn đầu phiên: `16411bae17bdf3cf3a54242f0ebbec2b62926f39`, nhánh
`recovery/jlpt-n3-n1`. Các số liệu dưới đây được chạy lại trên dữ liệu thực,
không suy ra từ báo cáo lịch sử. Con số927 bài thiếu dịch trước đây đã lỗi thời.

| Phạm vi | Bằng chứng hiện tại | Giới hạn |
|---|---|---|
| Câu thoại và gợi ý12 ngôn ngữ |7.128/7.128 bài; 714 lô; 940.896 câu dịch và 427.680 gợi ý |Không bao gồm dịch metadata/tên/tình huống/mục tiêu chưa tích hợp |
| Hiragana hai phía |78.408/78.408 lượt; 42.768 NPC + 35.640 người chơi;không thiếu cách đọc ở đoạn kanji |Độ phủ không chứng nhận đọc đúng mọi tên riêng/từ đa âm |
| Nguồn/ID/role/hash bản dịch |Toàn bộ714 lô và manifest hiện tại khớp;loader thực đạt |Không thay thế duyệt ngữ nghĩa |
| Rà ngữ cảnh đủ12 ngôn ngữ |33/7.128 bài;6.336 trường nguồn/đích có hash |Còn 7.095 bài; vẫn có vấn đề nguồn/profile ở các bài đã rà |
| Âm thanh NPC |42.768/42.768 binding; 42.158 clip ; 96 gói; 4 giọng đúng cấu hình |Không phải kết quả nghe duyệt phát âm |
| Phân phối âm thanh |1.585.851.408 byte;73,419 giờ ; 96 asset khớp size/SHA256 công bố |Release asset vẫn mang nhãn prerelease;chưa đo hiệu năng thiết bị thật |
| Tải/phát mẫu |4 clip/4 giọng:HTTP 206,đúng byte range,giải mã đúng thời lượng,có tín hiệu |Mẫu không chứng minh toàn bộ 73 giờ đã được nghe hoặc giải mã lại |
| Luồng phát mô phỏng |Seek,chuyển câu,hủy,ngắt ứng dụng,và không gọi engine khi phát pack:PASS |Chưa phải phát trên iOS/Android thật |
| Hình học khung |84 ca placement/paging:PASS;khóa giao diện JLPT 10/10:PASS |Không phải xác nhận giao diện thiết bị |
| Trình duyệt |Đã thử khởi động kiểm tra12 ngôn ngữ/3 kích thước |Chromium bị chặn socket tại startup; 0 ca thực thi,không có nghiệm thu ảnh |
| Bản ngữ/thiết bị |Chưa có bằng chứng duyệt độc lập hay nghiệm thu native |Giữ nguyên các cờ nativeReviewed:false |

## Sửa thực tế trong phiên

Rà đầy đủ 11 câu và 5 gợi ý của`SC-LOC-017-01-001` bằng12 ngôn ngữ (192 trường).
Sửa 7 trường tiếng Việt/Anh:phân biệt người bạn với người đang được nói chuyện;
hỏi chỗ đứng chờ cùng hành lý thay vì gợi ý chỗ gửi hành lý;làm rõ người được
báo chỗ gặp và hành động lấy vé khi trao hành lý. Giữ nguyên tiếng Nhật,ID,
thứ tự lượt,âm thanh và giao diện. Đồng bộ đúng 2 hash file trong manifest.
Receipt lưu từng trước/sau và hash nguồn/đích. Cách xưng hô mặc định nam của
người chơi trong tiếng Hindi/Thái vẫn được ghi riêng,chưa được chứng nhận.

Thêm kiểm tra tái sử dụng cho toàn corpus và asset âm thanh. Bộ kiểm tra âm
thanh từ chối thử nghiệm:kana lỗi thời,checksum asset sai,và thiếu lượt NPC.
Các phép kiểm tra không sinh lại 42.158 clip đã có.

Lọc tự động cuối phiên vẫn có 3.039 trường mang tín hiệu kiểm tra. Đây là tín
hiệu độ dài/chữ/số/trùng câu,không phải 3.039 lỗi dịch đã xác nhận. Bộ đối chiếu
7.388 quyết định xử lý trước đây vẫn PASS, pending 0, stale 0. Các câu không bị bộ
lọc đánh dấu vẫn chưa được coi là đã qua duyệt ngữ nghĩa toàn bộ.

## Chạy lại

```bash
node scripts/check-dialogue-release-readiness.cjs --technical-only --out /tmp/dialogue-readiness.json
node scripts/dialogue-voice/prepare.cjs /tmp/npc-voice-plan.json
python3 scripts/dialogue-voice/check-release.py --plan /tmp/npc-voice-plan.json --assets-json /path/to/fresh-release-assets.json
node scripts/dialogue-voice/factory/check-playback.cjs
```

`fresh-release-assets.json` làGET mới từGitHub release
`npc-audio-40181116462`;bỏ đối số này chỉ kiểm tra binding cục bộ,không xác
nhận mới trạng thái asset từ xa. Không lưu signed download URL vào hồ sơ.
Nếu bỏ`--technical-only`,kiểm tra readiness trả mã 2 vì nghiệm thu phát hành
vẫn chưa hoàn tất;không biếnPASS kỹ thuật thành chứng nhận bản ngữ.

## Điểm tiếp tục

Tiếp theo:`SC-LOC-017-02-001`,lô 034,thành phốKanazawa. Queue chính tại
`../naturalness-review-2026-10-25/prefecture-queue.json`. Cần tiếp tục rà
7.095 bài,đóng các vấn đề nguồn/xưng hô đã ghi,hoàn thiện dịch metadata,
duyệt bản ngữ và nghe phát âm,kiểm thử native iOS/Android cùng hiệu năng.
Phiên này không hoàn tất các bước đó và không xác nhận sẵn sàng phát hành.
