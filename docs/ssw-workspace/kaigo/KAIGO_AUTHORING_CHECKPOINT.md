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
