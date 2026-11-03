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

Đạt 9 nhóm unittest (bổ sung chia inference và đồng bộ metadata không đổi nội dung): bảo toàn cấu trúc query, cache đổi theo mọi đầu vào, ranh giới khác nhau/đổi đơn vị đúng, chặn ghi live, từ chối query không tương thích, đủ 30 đề và nối cả hai renderer. Python compile/CLI và khóa UI JLPT 10/10 đạt. Đây là kiểm mã/metadata, không phải nghe âm thanh.

Đã khắc phục việc thiếu engine: tải bản CPU x64 chính thức VOICEVOX 0.25.2, kiểm SHA-256 archive `bab016a966131b89bad398e7b898f8c742617dc80a7da49bf494cd07133dbc7a`, chạy executable và đối chiếu đủ speaker ID 8/118/11/21. Preflight tổng hợp thật câu mở đầu, giải mã được 11008 ms mono 24 kHz. Engine chỉ dùng sản xuất audio, người học không cần cài.

Lượt chạy bốn engine gặp ngắt kết nối local; chưa có bằng chứng đủ để khẳng định nguyên nhân OOM. Đã thêm chia inference tại pause-mora có sẵn sau khi tính accent/mora cho toàn câu; không cắt ký tự/âm tiết hay thêm khoảng đầu/cuối giữa các phần. WAV cache ghi atomically để các lượt không đọc file dở. Profile v2 gắn cấu hình chia phần vào hash cache. Batch giới hạn số job/CPU, log từng đề, theo dõi RSS/HWM và tiếp tục các đề khác khi một đề lỗi. Lượt hiện tại dùng hai job và restart sau 24 utterance mới.

Các utterance và đoạn câu nghe thật đang được dựng trong cây candidate. **Checkpoint này chưa xác nhận hoàn tất bản thu mới nào và chưa cài audio mới vào app (0/30)**. Báo cáo tiến độ local riêng: `docs/checkpoints/jlpt-prosody-20261103/actual-run.json`; không dùng trạng thái đang chạy làm bằng chứng hoàn tất. Chưa sửa master/audio manifest đang dùng hoặc file nghe runtime; không tuyên bố chất lượng tự nhiên/ngữ nghĩa/phát âm đã nghiệm thu.

## Lệnh dựng và tích hợp

`python3 scripts/prepare-jlpt-prosody-batch.py --render --engine /duong/dan/thuc/den/engine/run --jobs 2 --cpu-threads 2 --restart-every 24 --report docs/checkpoints/jlpt-prosody-20261103/actual-run.json`

Sau khi đủ 30 candidate hợp lệ, `python3 scripts/install-jlpt-prosody-batch.py` kiểm lại toàn bộ file/hash/PCM/nguồn; thêm `--install` mới thay bộ audio và đồng bộ duration/timeline/master metadata/opening bell. Installer chặn bộ thiếu đề, giữ nội dung/đáp án/ID/giọng, có backup và rollback nếu ghi lỗi; các cờ nghiệm thu con người/bản ngữ vẫn false. Đây là công cụ đã kiểm thử, **chưa phải bằng chứng đã tích hợp**. Không có cổng xin duyệt pilot; tiếp tục đủ 30 theo yêu cầu người dùng.

## Bản thu thật hoàn tất đầu tiên

N5 01: 1723416 ms; N5 02: 1652069 ms. Mỗi đề 24/24 câu, toàn bộ MP3 giải mã PCM khớp mốc, hash/giọng/kịch bản/thứ tự lựa chọn/cửa sổ trả lời và nhạc nghỉ đúng 60000 ms đạt. Bản thu candidate và manifest được lưu cùng checkpoint `completed-candidates.json`; không lưu cache WAV/engine/bản dở vào Git. Tiếp tục 28 đề còn lại; 0/30 audio mới được tích hợp runtime; chưa nghiệm thu nghe/người bản ngữ.
