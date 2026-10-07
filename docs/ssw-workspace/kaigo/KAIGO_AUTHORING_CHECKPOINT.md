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

## Cụm tuần2 — ngày8–14

Soạn trọn7 bài: hỏi vị trí khó chịu; báo tư thế đã quan sát; điều chỉnh giao tiếp theo cá nhân; mô tả vị trí cho người khó nhìn; tiếp nhận lo lắng trong hồ sơ sa sút trí tuệ; báo nguy cơ sàn ướt; báo cáo tổng hợp.56 lượt Nhật–Việt,7 bài đọc,21 câu hỏi có lý do từng lựa chọn,24 từ bản nháp,14 cách nói,28 rubric có biến thể. NPC giữ vai cư dân/đồng nghiệp/phụ trách/điều dưỡng; không tự gán bệnh cho toàn roster.

Đã đọc nguồn kiến thức trang in24–25,42,68–70,88,93–95,108–109,118,129 và trang thuật ngữ204,206–207; nhãn trang được kiểm qua text, chưa chứng nhận trực quan cách đọc mới. Lời thoại, bài đọc/câu hỏi tự viết; không sao chép hội thoại nguồn. Một số từ là từ giao tiếp tự chọn, không tuyên bố tất cả lấy từ kho từ Nhật đã kiểm.

Giới hạn: chỉ giao tiếp và báo cáo,không chẩn đoán/thuốc/thao tác đổi tư thế/triage. Khẩn cấp không theo kịch bản hỏi dài mà gọi hỗ trợ theo cơ sở. Toàn cụm chờ domain/native/rights review; chưa hình/audio/runtime;210phút dự kiến,chưa đo. Tổng21 bài,69 câu ôn,không phải đề đầy đủ.

Sau lưu bền: tuần3 có7 bản thảo di chuyển và31 rubric từ trước; rà hoàn thiện hồ sơ toàn tuần3 theo mức cụm tuần1–2 trước tuần4. Không làm lại hội thoại đã lưu. Sau đó soạn trọn tuần4 ăn uống theo nguồn và giới hạn nuốt/an toàn.

## Cụm tuần3 — hoàn thiện hồ sơ toàn tuần

Giữ7 hội thoại đã có (ngày15–21),62 lượt,7 bài đọc,27 câu hỏi và31rubric. Bổ sung14cách nói,liên kết từ chủ động và từ nhận biết,tái sử dụng ID kho từ nền tảng. Kho movement24mục:16cách đọc đã kiểm hình nguồn từ trước,8từ giao tiếp mới chỉ AI rà. Thuật ngữ dụng cụ/tư thế chỉ nhận biết,không là dạy thao tác. Lịch210phút dự kiến,chưa đo.

week-03-manifest.json và scripts/check-kaigo-week3-draft.mjs kiểm toàn cụm,liên kết rubric,NPC,từ,ngày,đáp án/giải thích,trùng lời giữa các tuần và trạng thái kiểm duyệt. Nguồn đã đọc lại trang115/PDF117,118/PDF120,120/PDF122,129/PDF131,208/PDF210. Không đổi hội thoại để đạt số lượng.

Tổng3cụm tuần được tổ chức đầy đủ ở mức bản thảo biên tập;21bài,69câu ôn.Không có assets/runtime hoặc đề đầy đủ.Mọi domain/native/rights/release gate còn chờ. Điểm tiếp theo sau lưu bền: soạn trọn tuần4 ăn uống (ngày22–28) sau đọc nguồn,đặc biệt giới hạn kiến thức nuốt/an toàn.Ngôn ngữ/chấm điểm/furigana/resume đề vẫn chưa chốt.


## 2026-10-07 — Audit weeks 1–3 completed; quality gate NOT_READY

Full editorial audit covers21lessons,176turns,21readings,69questions,88response rubrics and69vocabulary entries. See reviews/WEEKS_01_03_CONTENT_AUDIT_2026-10-07.md and JSON evidence. Structural validators PASS; this is not quality certification. Open errors: day16 actor mismatch; day19 now/today scope; literal Unicode escapes day18/20; day13 information perspective; day11 reference frame. Knowledge depth, distractors, rubric assessment and measured30minutes remain incomplete. No lesson content changed in audit; no human/native/rights/runtime flags promoted. Do not proceed to week4 under a claim weeks1–3 are quality approved. Present repair/rebalancing decisions to user first.


## 2026-10-07 — Publisher-authorized whole-three-week revision2

User approved fixing and completing weeks1–3 before continuation, retaining30minutes/day and rebalancing knowledge/communication/review. Contract v2 documents3/8/5/9/5minute activities. Completed21distinct four-section knowledge modules,21transfer cases,105lesson questions (35perweek),88atomic response rubrics and84scenario assessment cases;176dialogue turns remain. Day12 now directly addresses resident-a; curriculum/NPC links updated.14shared concept terms added with AI reading status only.

A01–A05 repaired across relevant JA/VI/readings/questions/rubrics. Further reread corrected day10 question-command mismatch, day11 VI direction reference, and day16 scenario-policy role drift. Added bounded integrity validator and final revision report; original audit retained. One-time lesson-choice reordering is editorial practice data, not adoption of a mock/runtime answer algorithm.

Scenario assessment cases are specifications, not executed semantic-evaluator tests. Human/domain/native/rights/runtime/release flags remain false;30minute activities not measured; no images/audio/app integration or complete mocks. See reviews/WEEKS_01_03_REVISION_02_REPORT.md and revision-integrity/similarity-screen JSON. Next: obtain required reviews and timing/runtime evidence before release; do not claim publication readiness or silently proceed to week4 in this repair unit. Mock-language/furigana/scoring/resume decisions remain open. Persist and verify this complete revision before a new unit.

## 2026-10-07 — Tuần4, nguyên cụm ăn uống ngày22–28

Chủ dự án yêu cầu tiếp tục sau cụm sửa tuần1–3 đã lưu bền. Phiên mới đọc lại hướng dẫn/plan/checkpoint/biểu đạt độc lập, kiểmHEADremote7c58d7b3 và nguồn chuẩn khớphash. Không lặp hoặc đổi nội dung tuần1–3.

Thêm eating-lessons/vocabulary/response-rubrics.json và week-04-manifest.json:7bài,56lượt,7mô-đun4phần,7bài đọc,35câu với lý do đủ4lựa chọn,14cách nói,28rubric ý nghĩa nguyên tử,28ca phản hồi biên tập,7case chuyển giao.20từ chọn mới;11cách đọc kiểm trực quan nguồn213–214/PDF215–216,9AIonly. ID từ chung dùng lại, không tạo bản ghi trùng.

Tình huống khác nhau: hiểu thực đơn; nhãn khay/dạng chưa rõ; tự ăn/chỉnh bát; mô tả khay theo hướng bác/nhiệt độ; muốn nghỉ; báo đã ăn và dữ kiện chưa kiểm; bảng chung/kế hoạch riêng khác nhau. NPC giữ vai, nhân viên bếp được dùng đúng vai. Không chỉ định kết cấu, làm sánh, đút ăn/tư thế hoặc chẩn đoán. Ngày26 chỉ nói sau ngừng nhai; ngày27 không biến chưa kiểm thành không uống; ngày28phân côngKawasekiểm/người họcbáobếp.

Giữ5/5/5/10/5phút của tuần4 trong ma trận; điều chỉnh3/8/5/9/5được ghi duyệt cho sửa ba tuần trước, không tự áp rộng.210phút chưa đo. Ngày26–28dùng lại từ, không ép thêm mới. Cập nhật liên kết đủ7ngày và production28bài/140câu; không tính là bộ thi đầy đủ.

Rà AI từng nhóm nội dung/đáp án/rubric/biến thể; sửa nguồn dẫn, tiêu chí gộp và7phương án sai quá xa chủ đề. Có validator tuần4 và báo cáo WEEK_04_EDITORIAL_REPORT.md, evidence similarity711trường/cửa sổ60ký tự/0trườngkhớp. Sàng lọc và so tình huống AI không chứng nhận quyền. Bộ chấm ngữ nghĩa chưa chạy; human/domain/native/publisher/rights/runtime/releaseflagsfalse. Không hình/audio/app/mock/đo tải học.

Sau khi commit hẹp,push/fetch vàWORK PERSISTENCE PASS: tiếp tục trọn tuần5 ngày29–35, đọc lại nguồn bài tiết152–169 và từ/hội thoại219–223. Giữ các lựa chọn đề thi còn mở; chỉ hỏi khi làm phần phụ thuộc. Đạt bản thảo đã rà AI, chưa đạt gatepháthành; không tự nâng trạng thái.

## 2026-10-07 — Tuần5, nguyên cụm bài tiết ngày29–35

Phiên mới đọc hướng dẫn/plan/checkpoint/biểuđạtđộclập, fetch/fastforwardHEAD2f1d7331 vàWORKPERSISTENCEPASStrướcsoạn. Không lặp hoặc sửa nội dung tuần1–4. Nguồn chuẩn khớphash; đọc152–169/PDF154–171,219–223/PDF221–225,16/115/118vàkiểmhìnhtừ219.

Thêm excretion-lessons/vocabulary/response-rubrics.json,week-05-manifest.json và validator tuần5:7bài,56lượt,7bàiđọc,35câu với lý do4phương án,20từ mới (12cáchđọc visual,8AIonly),14cáchnói,28rubric tách ý,28ca phản hồi đặc tả,7casechuyểngiao. Liên kết đủ ngày29–35,NPCvaiổnđịnh; tổng35bài/175câu ôn, không là đềđầyđủ. Phânbổ5/5/5/10/5,210phút chưađo; ngày33–35ônlại.

Tìnhhuống: nhu cầu nói kín; quan sát/cáchgọi chưa chốt; báo lo09:10 với ca09:00; đồ chuẩn bị khác kế hoạch; quầnướt nguyênnhânchưabiết; nhầmngày trongphiếu; nhu cầu hỗtrợ chưa xác nhận thực hiện. RàAInguồn/đápán/biếnthể/diễnbiến,vàtách ýrubric. Không hứa bỏquan sát chỉ vì có nút; không tựghi失禁,便秘,khôngbàitiếthoặchỗtrợxong khi chưa đủ dữkiện.

Validator tuần1–5PASS; báo cáoWEEK_05_EDITORIAL_REPORT.md và similarity415trường/cửasổ60ký tự/0trườngtrùng. Sànglọc khôngchứngnhậnquyền. Chưa thao tác chuyểnngười/dụngcụ/thaytã/vệsinh/kiểmsoátnhiễmkhuẩn: ghi coveragegap,khôngtuyênbốđủtoànphạmvi. Human/domain/native/publisher/rights/runtime/releasefalse; chưaassets/audio/thiđầyđủ/đothờilượng/bộchấmnghĩa.

Sau commit hẹp,push/fetch/WORKPERSISTENCEPASS: tiếp trọn tuần6 ngày36–42 về chỉnhtrang,tắm,vệsinh; đọc170–197,224–237 vàkiểmtảihọc/giớihạnkỹthuật. Không phát hành bảnthảo hoặc tựchốtcáclựachọnđềthicònmở.
