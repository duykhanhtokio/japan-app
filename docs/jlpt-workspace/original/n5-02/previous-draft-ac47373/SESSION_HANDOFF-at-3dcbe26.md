# Tiếp tục biên soạn JLPT — checkpoint 07/10/2026

Repository: duykhanhtokio/japan-app
Nhánh bắt buộc: recovery/jlpt-n3-n1
Đề đang làm: jpapp-n5-original-02-v1

## Trước khi làm
1. Fetch nhánh trên; kiểm tra HEAD, upstream và thay đổi chưa commit. Không ghi đè công việc có sẵn.
2. Đọc đầy đủ docs/AI_SESSION_START_HERE.md, AGENTS.md, docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_RULES.md và docs/jlpt-workspace/JLPT_LEVEL_BLUEPRINTS.md.
3. Đọc docs/jlpt-workspace/JLPT_ORIGINAL_AUTHORING_CHECKPOINT.md, src/data/jlpt-original/authoring-blueprints.json, src/data/jlpt-original/voice-casting.json và quy tắc khóa UI hiện hành.
4. Đọc master/organization/images manifest của N5 02 và docs/jlpt-workspace/original/n5-02/EDITORIAL_PROGRESS.json cùng validation.json. Mã nguồn hiện hành là căn cứ; không dựng lại từ chat.

## Đã lưu
- N5 01: dữ liệu/audio và đăng ký qua adapter hiện có; kiểm tra component web và phát audio trong trình duyệt đã ghi bằng chứng. Chưa coi là kiểm duyệt người bản ngữ hay kiểm tra native.
- N5 02: 67 câu viết, 24 câu nghe; 5 ảnh thật cùng hash; mở đầu, kiểm tra âm thanh, hướng dẫn, 4 ví dụ không tính điểm, giải ví dụ, chuyển dạng và kết thúc.
- 4 lỗi biên tập đã sửa; kiểm tra số câu, ID, quota, chuỗi đáp án, nghiệm sắp xếp và hash ảnh đạt. Khóa UI đạt 10/10.
- Ảnh N5 02 được lưu trực tiếp trong Git; .gitattributes có ngoại lệ đúng thư mục này, không phụ thuộc upload LFS còn thiếu.

## Việc kế tiếp
1. Kiểm tra dung lượng môi trường MỚI và sự hiện diện của VOICEVOX; thiếu dung lượng/engine ở phiên cũ không phải bằng chứng phiên mới cũng thiếu. Không dùng đường dẫn scratch phiên cũ như tài nguyên bền vững.
2. Nếu cần dọn: chỉ xóa cache/tệp trung gian có thể tái tạo; giữ nguồn, ảnh, audio master và thay đổi chưa lưu. Cache turn-cache N5 01 đã được dọn; có thể tái tạo.
3. Khôi phục VOICEVOX 0.25.2 miễn phí theo quyền cài công cụ miễn phí đã cấp. Không dùng API trả phí, không đưa tool/model vào bundle app. Engine từng dùng không được tìm thấy ở cuối phiên.
4. Điều chỉnh script generate-jlpt-original-audio.py để nhận đúng đề 02 thay vì đường dẫn/actor hardcode đề 01; lập phân vai từ script thực của đề 02 (dạng 4 dùng actor speaker). Giữ bốn giọng, speedScale 0.9, mono 24000 Hz.
5. N5: sau giới thiệu 2000 ms, giữa lượt 500 ms; trả lời vấn đề 1/2/3/4: 12000/12000/10000/8000 ms. Không hỏi lại nhịp đã chốt.
6. Bốn ví dụ nằm ngoài 91 câu chấm điểm. Ví dụ dạng 3 dùng khung cafe bên trái của problem-3-01.png; câu chấm điểm 1 dùng khung tàu bên phải.
7. Ghép thông báo nghỉ, nhạc độc lập đúng 60000 ms (1440000 frame), thông báo tiếp tục sau vấn đề 2 trước hướng dẫn vấn đề 3. Đo PCM và MP3 thực; không tự tuyên bố đạt 30 phút trước khi đo.
8. Đồng bộ master/QA/audio manifest/hash; tạo adapter đề 02, đăng ký catalog qua dữ liệu hiện có, audio start 0 ms. Không dùng audio đề 01 hoặc nguồn cũ để lấp thiếu.
9. Kiểm tra cấu trúc, UI lock, phát audio/resume/chấm điểm/review bằng runtime thực. Không đổi UI khóa.
10. Commit hẹp gồm checkpoint, lưu GitHub bằng kết nối GitHub nếu shell thiếu credentials; update ref có expected SHA, không force. Fetch và chạy check-work-persistence.mjs.
11. Sau khi đề 02 hoàn tất/tích hợp/lưu bền vững, tiếp tục N5 03. Không đặt cổng duyệt nháp; người dùng test khi đủ 30 đề.

## Trạng thái cần nói đúng
N5 02 runtimeIntegrated=false, audio chưa tạo, releaseReady=false. Nội dung đã lưu trong mã nguồn app không có nghĩa đề 02 đã xuất hiện như đề thi hoàn chỉnh trong app. Publisher/native/perceptual approval giữ false. Không xóa bộ đề cũ trước gate thay thế.
