# Checkpoint 介護 — 2026-10-07

## Quyết định

Đọc KAIGO_AUTHORING_RULES.md đầy đủ và approved-plan.json trước tiếp tục. Chủ dự án đã duyệt phương án và yêu cầu bắt đầu. Tạo đủ NPC theo vai; không giới hạn một NPC.

## Đã thực hiện

- Hướng dẫn 521338e8 và bản thảo đầu 5acd8d06 đã nằm trên remote; xác minh từ nhánh 214107f7 (fetch và fast-forward thành công).
- drafts/curriculum-56-days.json: 56 ngày, 8 tuần. Ngày 54 thi kỹ năng 60 phút; ngày 55 thi Nhật 30 phút. Tổng 1710 phút dự kiến; không phải 56 bài đã soạn.
- drafts/npc-roster.json: 8 hồ sơ nhân vật hư cấu, gồm 3 người sử dụng, đồng nghiệp, người phụ trách, điều dưỡng, người nhà, nhân viên bếp. Chưa tạo hình/voice/runtime NPC.
- drafts/movement-vocabulary.json: chọn 16 thuật ngữ; cách đọc đối chiếu trang in 208 / PDF 210; nghĩa Việt tự biên tập. Không phải tổng từ của sách.
- drafts/movement-lessons.json: 7 bài mới cho ngày 15–21; 62 lượt hội thoại; 7 bài đọc; 27 câu kiểm tra cuối bài. Các bài về xác nhận nhu cầu, phối hợp đường đi có vật cản và báo cáo mong muốn nghỉ. Không trình bày thao tác chuyển người hoặc chẩn đoán.
- drafts/validation.json: PASS cấu trúc/ID/liên kết/đáp án/lượt thoại. AI rà biên tập, chưa duyệt chuyên môn/ngôn ngữ/quyền bằng con người.

## Chưa hoàn thành

Chưa hình/audio, NPC runtime, nội dung các ngày còn lại, bộ kỹ năng 45 câu, bộ Nhật 15 câu, tích hợp app, kiểm thiết bị, duyệt phát hành. Không đếm 27 câu ôn tập là một bộ thi đầy đủ.

## Điểm tiếp tục

1. Lưu commit bổ sung bằng bundle nếu môi trường thiếu Git credential; xác minh remote trước sản xuất đơn vị tiếp theo. Không bypass kiểm duyệt.
2. Rà khối lượng học/ma trận NPC, điều chỉnh liên kết ngày và mỗi bài trước dùng runtime. Không đặt 8 hồ sơ là số NPC cuối cùng.
3. Cụm di chuyển đã có bản thảo bảy ngày; tiếp theo rà/tạo nền tảng tuần 1 trước nối toàn chương trình, hoặc hoàn thiện cụm ăn uống sau đọc nguồn. Không gọi bảy bản thảo là bảy bài đã phát hành.
4. Cần quyết định cụ thể ngôn ngữ đề kỹ năng, furigana, cân bằng đáp án/cách tính điểm và hành vi resume trước phần phụ thuộc. Không yêu cầu duyệt lại phương án đã chốt.

## Nguồn riêng

PDF chuẩn 3/2025, 276 trang; Library libfile_30516fe27c688191907d48df8b3fb8df; hash trong approved-plan.json. Không commit PDF/OCR nguồn. Bản đồ kiểm: trang in 118→PDF120; 120→122; 128→130; 129→131; 208→210, xác định bằng trang đã trích xuất và nhãn in. Trang từ 208 đã kiểm hình; không giả nhận toàn bộ hình sách đã kiểm.

## Lưu bền

Commit local không chứng minh GitHub đã lưu. Lấy SHA từ Git; chỉ báo lưu bền sau push/fetch/remote verification. Không tạo commit chỉ để chép SHA.

## Bổ sung phiên tiếp tục

Bốn bài mới: xác nhận kế hoạch với người phụ trách (ngày17), tiếp nhận từ chối hoạt động tự chọn (ngày19), bàn giao sự việc/lựa chọn chưa xác nhận (ngày20), xác minh giờ hoạt động mâu thuẫn (ngày21). Liên kết đúng NPC/lessonId trong curriculum. Mỗi bài có blocks30phút dự kiến, không khẳng định đo thực tế. Không dạy thủ thuật di chuyển cơ thể. Nguồn đọc thêm: trang in115/PDF117 về ghi chép; 129/PDF131 về đồng ý/tự lập; 118/PDF120 về báo cáo.

PASS cấu trúc, ID/link, lượt thoại, trùng lời người học, lựa chọn/lý do; AI rà nội dung và giới hạn. Mọi human/domain/rights/runtime/release flags vẫn false. Các bài chưa có bộ đánh giá phản hồi runtime theo từng lượt; expected intents hiện ở cấp scenario, cần hoàn thiện trước tích hợp.

## Bổ sung đánh giá phản hồi theo lượt

Remote trước chỉnh sửa đã kiểm chứng PASS tại 24bceaa0, chứa cụm di chuyển bảy ngày. Thêm drafts/movement-response-rubrics.json: 31 lượt người học của 7 bài, mỗi lượt có tiêu chí nghĩa Việt, câu mẫu và biến thể Nhật, gợi ý sửa, liên kết prompt/next turn. Không so khớp chuỗi tuyệt đối; không tự chuyển lượt khi thiếu ý hoặc có hành động không phù hợp. ASR không chắc thì yêu cầu nói lại/sửa văn bản.

Đây là đặc tả biên tập, chưa có bộ phân loại/chấm điểm thực thi. Chưa kiểm tiếng nói/runtime hoặc duyệt chuyên môn/ngôn ngữ/quyền bằng con người. Đặc tả cần được kiểm duyệt cùng bài trước tích hợp. Điểm tiếp theo sau lưu bền: soạn nền tảng tuần 1 theo nguồn, rồi cụm ăn uống; quyết định đề thi chưa chốt vẫn giữ nguyên.

## Nền tảng ngày 1–3

Thêm 3 bản thảo: giới thiệu đúng vai trò và cách xưng hô; xin phép lau bàn/chuyển đồ cá nhân; hỗ trợ đọc địa chỉ để người sử dụng tự viết thiệp. 26 lượt Nhật–Việt, 3 bài đọc mới, 9 câu kiểm tra kèm lý do từng lựa chọn. Liên kết ngày1–3 và 16 mục từ mới tự chọn; cách đọc chỉ AI rà, chưa kiểm trực quan kho từ Nhật nguồn hoặc người bản ngữ. Tổng hiện10 bài,36 câu ôn; chưa có bộ đề đầy đủ.

Nguồn kiến thức đã đọc trang in10,12,13,102,103 (PDF12,14,15,104,105), hash khớp bản chuẩn. Không dùng hội thoại ví dụ nguồn để viết lại. Chưa duyệt chuyên môn/ngôn ngữ/quyền, chưa hình/audio/runtime; thời lượng30phút là kế hoạch. Tiếp sau lưu bền: ngày4–7 (riêng tư, từ chối, hỏi lại, ôn tuần); đọc nguồn liên quan trước soạn.

Lưu trực tiếp bằng kết nối GitHub; không yêu cầu tải bundle khi kết nối ghi hoạt động. Bản đánh giá31 lượt đã lưu trên remote40f2324c; SHA nội dung mới lấy từ Git sau công bố, không tạo commit chỉ để ghi SHA.

## Nền tảng ngày4–7 — tuần1 đã đủ bản thảo

Thêm bốn tình huống mới: giữ kín chuyện gia đình; từ chối chụp ảnh nhưng muốn tham gia; hỏi lại hai việc bàn giao; lựa chọn đọc sách và hỗ trợ đúng phần cần. 32 lượt,4 bài đọc,12 câu hỏi có lý do từng lựa chọn. Ngày4–7 liên kết với bài/NPC; ngày5–7 dùng lại từ, không ép thêm từ mới. Nguồn đọc trang in16/PDF18,104/PDF106,105/PDF107.

Tổng nền tảng7 bài,58 lượt,7 bài đọc,21 câu. Tổng cùng di chuyển14 bài,48 câu ôn. Vẫn là bản nháp AI, chưa chứng nhận chuyên môn/ngôn ngữ/quyền, chưa assets/runtime/thi đầy đủ. Ngày4–7 có đích nghĩa từng lượt; chưa là bộ chấm tự do thực thi. Cần bổ sung từ/cách nói ngày4 và biến thể phản hồi của toàn tuần trước tích hợp.

Điểm tiếp theo sau lưu bền: hoàn thiện hồ sơ từ/cách nói và phản hồi tuần1, sau đó soạn tuần2 hoặc cụm ăn uống sau đọc nguồn. Các lựa chọn thi chưa chốt vẫn giữ nguyên.

## Cụm tuần1 — hồ sơ biên tập đầy đủ, chờ kiểm duyệt

Theo chỉ đạo mới: làm theo cụm tuần, không chia thành các lượt vài bài. Đã hoàn thiện hồ sơ cho cả7 bài tuần1:58 lượt,7 bài đọc,21 câu kiểm tra,21 mục từ bản nháp (5 mục thêm cho ngày4),14 cách nói,29 rubric lượt người học có biến thể và phản hồi sửa. Lịch210phút là dự kiến; mỗi ngày đủ blocks30phút, ngày5–7 ôn lại từ, không ép học mới.

week-01-manifest.json ghi phạm vi cụm và gate; scripts/check-kaigo-week1-draft.mjs kiểm toàn cụm, có thể chạy lại. Không tăng trạng thái thành nội dung phát hành: cách đọc mới vẫn AI rà; domain/native/rights/runtime/release chưa được duyệt. Rubric là đặc tả ý nghĩa, không phải bộ chấm chạy trong app. Chưa đo thời lượng hoặc có assets.

Điểm tiếp theo sau lưu bền: soạn trọn tuần2 (ngày8–14) gồm kiến thức/từ/cách nói,NPC,bài đọc,câu hỏi,rubric,QA trong một cụm. Đọc nguồn riêng của từng chủ đề trước viết; không áp quy tắc11lượt hoặc nghe JLPT. Các quyết định đề thi còn chưa chốt phải trình khi tới phần phụ thuộc.
