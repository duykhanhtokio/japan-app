# Chỉnh nhịp nghe toàn bộ 30 đề tự soạn — 03/11/2026

Người dùng phản ánh giọng nghe máy móc, tốc độ và ngắt nghỉ thiếu tự nhiên, đồng thời xác nhận cả 30 đề N5–N1 đều phải điều chỉnh. Giữ nguyên đề thật, bốn giọng đã chọn, kịch bản/câu hỏi/đáp án/ID, thứ tự lựa chọn, thời gian trả lời và nhạc nghỉ đúng 60 giây. Đây là đợt sửa chất lượng audio, không phải đổi nội dung đề.

## Đã làm thực tế

- Kiểm kê 30 bộ master/organization/audio manifest và 882 đơn vị chấm nghe. Queue gắn hash đầu vào hiện tại; dùng currentMasterSha256 khi metadata bản mở đầu ngắn đã lưu hash mới. Không đổi hash duyệt để hợp thức hóa audio.
- Thêm cấu hình **thử, chưa nghe kiểm** `src/data/jlpt-original/prosody-candidate.json`. Tách lời dẫn/hội thoại; giữ accent phrase, mora, trọng âm và dấu hỏi do engine cung cấp; chỉnh có giới hạn hệ số ngữ điệu, độ dài pause-mora và khoảng đầu/cuối bản thu. Chuyển lượt phân biệt dấu hỏi, do dự và cùng người nói. Không ngẫu nhiên hóa nhịp hoặc cắt giữa âm tiết.
- Hai họ renderer phục vụ đủ năm cấp dùng cùng helper. Cache mới ràng buộc toàn bộ profile, engine version thực tế, speaker ID, mục đích lời nói, cấp và nguyên văn; không dùng nhầm WAV cũ sau sửa giọng.
- Profile mới bắt buộc xuất **candidate** dưới `docs/jlpt-workspace/audio-prosody-candidates/`. Không được ghi đè audio hoặc manifest đang chạy. Lệnh không bật profile giữ nhánh cache/nhịp cũ. Chặn chế độ cache-only khi yêu cầu tái tổng hợp prosody.
- Batch runner có thể dựng lần lượt cả 30 đề khi có engine; kiểm hash nguồn, câu/giọng/thứ tự lựa chọn, timeline, response windows, nhạc đúng 60000 ms và giải mã PCM toàn bản. Kết quả dựng vẫn là candidate cần nghe kiểm, chưa tự cài vào app.

| Cấp | Tốc độ hội thoại thử | Tốc độ lời dẫn thử | Chuyển lượt cơ sở thử |
|---|---:|---:|---:|
| N5 |0,94|0,94|0,40 giây|
| N4 |0,96|0,95|0,36 giây|
| N3 |0,99|0,97|0,32 giây|
| N2 |1,02|0,99|0,28 giây|
| N1 |1,04|1,00|0,26 giây|

Các số trên là đề xuất AI để dựng thử sau phản hồi, **không phải thông số người dùng đã nghe/duyệt hoặc bằng chứng chất lượng tốt hơn**. Thời gian chuẩn bị 2 giây và cửa sổ trả lời theo cấu hình cấp hiện có được giữ; không thêm im lặng để bù tổng phút. Tốc độ không được dùng để ép thời lượng mục tiêu.

## Kiểm tra và blocker

Đạt 7 nhóm unittest: bảo toàn cấu trúc query, cache đổi theo mọi đầu vào, ranh giới khác nhau/đổi đơn vị đúng, chặn ghi live, từ chối query không tương thích, đủ 30 đề và nối cả hai renderer. Python compile/CLI và khóa UI JLPT 10/10 đạt. Đây là kiểm mã/metadata, không phải nghe âm thanh.

Môi trường phiên có ffmpeg nhưng không tìm thấy executable VOICEVOX trong các vị trí đã kiểm; hai cổng local 50021/50128 không có engine trả lời. Vì vậy **0/30 bản thu mới được dựng, 0/30 bản nghe mới được cài vào app**. Không sửa file âm thanh, 30 master, 30 manifest đang dùng, lịch sử đề thật, thông số phát của runner hay session người học. Không tuyên bố tự nhiên/đúng phát âm/người bản ngữ đã duyệt.

## Tiếp tục khi có máy tổng hợp giọng

Kiểm kê: `python3 scripts/prepare-jlpt-prosody-batch.py`.

Dựng thật: `python3 scripts/prepare-jlpt-prosody-batch.py --render --engine /duong/dan/thuc/den/engine/run`.

Không đưa đường dẫn ví dụ này vào lệnh chạy nếu chưa xác định executable thật. Engine chỉ dùng trên máy sản xuất audio; app/người học tiếp tục phát file đã thu sẵn, không cần cài VOICEVOX. Sau dựng, nghe và chỉnh từng câu/giọng/cách đọc, rồi cập nhật audio, duration, timeline, master metadata/manifest và adapter theo một revision nhất quán trước khi tích hợp. Chưa có bước nào trong phần này được báo hoàn thành.
