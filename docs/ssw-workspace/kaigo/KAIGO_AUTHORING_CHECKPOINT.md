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

## 2026-10-07 — Tuần 6, ngày 36–42, chỉnh trang/tắm/vệ sinh

Chủ dự án cho phép công bố `4458493` rồi tiếp tuần 6. Git thiếu credential và remote đã tiến thêm JLPT; công bố đúng 12 blob tuần 5 trên đầu nhánh hiện tại bằng kết nối GitHub ở `6212ce09`, đối chiếu từng blob với local. Không force/reset hoặc ghi đè JLPT. Xác minh bằng connector read/blob SHA; không gọi đó là script WORK PERSISTENCE PASS.

Đọc lại hướng dẫn/plan/checkpoint, source hash khớp. Đọc trang in 170–197/PDF172–199, 224–237/PDF226–239, 10/12/16/115/118; xem ảnh hai trang từ224/230. Thêm hygiene-lessons/vocabulary/response-rubrics, week-06-manifest, validator và báo cáo WEEK_06_EDITORIAL_REPORT: 7 bài, 56 lượt Nhật–Việt, 7 mô-đun, 7 bài đọc, 35 câu/140 lý do, 20 từ (19 cách đọc visual,1 AI-only), 14 cách nói, 28 rubric/28 ca đặc tả, 7 transfer. Tổng42bài/210câu, không phải bộ đề đầy đủ.

Bối cảnh riêng: tay áo cho đọc thơ; thân/nắp hộp răng giả; rèm/sàn trước tiếp nhận tắm; lời bác về móng chưa nhìn; từ chối toàn thân muốn mặt; hai hoạt động14:20/15:00; lược cá nhân chưa thấy tại một nơi. Rà từng đáp án, biến thể/ý rubric, mốc giờ/chủ thể và Nhật–Việt; sửa lời NPC quá giáo huấn, liên kết từ trước bài ôn, chủ thể hỗ trợ ngày41 và nhiễu quá xa. Không biến chưa quan sát thành không đau/bình thường, lịch/đồng ý thành đã thực hiện, chưa thấy thành mất hoặc rửa mặt thành đồng ý toàn thân.

Lịch5/5/5/10/5, 210phút chưa đo; từ mới5/4/7/4 ngày36–39, ngày40–42 dùng lại. Kiểm tải hai nhóm chủ đề và ghi chưa đo, không khẳng định vừa30phút. Sàng lọc text-layer toàn276trang theo cửa sổ60ký tự và so bối cảnh AI, không chứng nhận quyền. Rubric/28ca chưa là evaluator/runtime. Chưa đủ kỹ thuật mặc/cởi/miệng/móng/tắm/lau/vùng kín/khử khuẩn; không xóa gap hoặc tuyên bố đủ phạm vi thi. Human/domain/native/publisher/rights/runtime/release false; chưa assets/audio/app/thi đầy đủ.

Lưu bằng connector commit trên đầu nhánh hiện tại, xác minh blob từng file sau cập nhật ref; không tạo commit chỉ để chép SHA. Điểm tiếp theo sau lưu tuần6: trọn tuần7 ngày43–49, việc nhà/văn bản/thông báo/bàn giao, đọc198–203/238–243 và trang đọc tương ứng trước soạn. Không tự chốt các quyết định đề thi còn mở hoặc phát hành.

## 2026-10-07 — Tuần7, ngày43–49, việc nhà và văn bản/bàn giao

Chủ dự án yêu cầu tiếp tục sau tuần6 đã lưu qua connector22355745. Localtree ban đầu sạch, HEAD e48af84; nhánh recovery/jlpt-n3-n1, origin duykhanhtokio/japan-app. Remote tiến thêm JLPT; kiểm ba blob plan/curriculum/checkpoint trên24e5be9b khớp parentlocal. Công bố tuần mới trên HEADremote hiện tại, không force/reset hoặc ghi đè JLPT. Xác minh read/blob SHA qua connector; không coi đó là script WORK PERSISTENCE PASS.

Đọc hướng dẫn/plan/checkpoint/biểu đạt độc lập trong phiên; nguồn chuẩn khớp hash. Đọc198–203,239–243,24–25,115–118,262,266,269 và xem ảnh từ238/245/246; nhãn PDF bằng trang in+2. Thêm housework-lessons/vocabulary/response-rubrics,week-07-manifest,validator tuần7, similarity và WEEK_07_EDITORIAL_REPORT:7bài,56lượt,7mô-đun4phần,7bài đọc,35câu/140lý do,18từ mới đều kiểm cách đọc visual,14cách nói,28rubric/28ca đặc tả,7transfer. Tổng49bài/245câu kiểm bài; chưa đề đầy đủ.

Tình huống riêng: chọn phần gấp và quyền dừng; chia ga/chăn theo nhãn và không xử lý ngăn trên; bản thông báo hiệu lực và hạn tài liệu; bảng máy/mép khăn/lời bác ba nguồn riêng; báo bổ sung xe vướng sau báo khẩn; cuộc gọi chưa trả lời và người nhận nhiệm vụ; Megumi hỏi tư vấn sách của mẹ. Không đổi chưa kiểm thành kết luận toàn bộ, gọi thành nhận, nhận nhiệm vụ thành xong hoặc người thân muốn thành đồng ý bác.

Rà AI Nhật–Việt, nguồn theo đoạn, thời điểm/chủ thể, đáp án/140lý do và biến thể/rubric; tách ý gộp và chỉnh mốc báo16giờ. Ngày43–46 có4/4/4/6mục mới; ngày47–49dùng lại; ngày46hai từ nhận biết phân loại báo cáo, không ép nói. Giữ5/5/5/10/5phút,210phút chưa đo. Sàng lọc1341trường toàntext-layer276trang/cửa sổ60ký tự/0khớp và so tình huống AI; không chứng nhận quyền. Chưa kỹ thuật việc nhà/nấu ăn/giặt đồ nhiễm bẩn/sửa xe/điều tra sự cố, không tuyên bố đủ phạm vi thi. Human/domain/native/publisher/rights/runtime/release false; chưa assets/audio/app/evaluator/đo thời lượng.

Lưu hẹp cả cụm bằng connector và đọc lại từng blob trên nhánh trước báo lưu; không tạo commit chỉ ghi SHA. Điểm tiếp theo: tuần8 ngày50–56. Bộ kỹ năng45câu/60phút ngày54 và Nhật15câu/30phút ngày55; ngôn ngữ kỹ năng/furigana/chấm điểm/cân bằng đáp án/resume còn mở, hỏi khi làm phần phụ thuộc. Có thể làm bài ôn không phụ thuộc trước; không tự chốt hoặc phát hành.

## 2026-10-07 — Tuần8 ngày50–56,hai đề đầu tiên và lựa chọn đã chốt

Phiên tiếp tục đọc lại toànhướngdẫn/plan/checkpoint/biểuđạtđộc lập và nguồn đúngbài. Local sạch097c7db;tuần7đã xác minh remotee8bb6772. Remote1e60b9a8 có thêmJLPT;4blobplan/curriculum/checkpoint/rules khớp parentlocal. Lưu trênremote hiện tại,bảo toàn công việc song song;khôngforce/reset.

Chủ dự án chọn3phươngán trongphiên:đềkỹnăngNhật,furigana toànkanji,lưuđúngvịtrí. ĐềNhật bằngNhật;dịch/giải thíchViệt sau nộp. Đúng1,sai/bỏtrống0;cân bằng không3vịtrígiốngliêntiếp;resume giữ câu/đápán/thờigian/thứtự;nộpsớm xácnhận,chữa saunộp. Hướngdẫnphiênbản3 vàapproved-plan.version3 lưuquyếtđịnh;runtime chưa triểnkhai. Điểmthôluyệntập khôngphảitrọngsố/điểmđỗchínhthức. Quyướckỹthuật tạm dừng khi rời lượt,nộp lúc hết giờ còn cần kiểmapp.

Thêm review-lessons/response-rubrics cho5ngày50/51/52/53/56:34lượt,5mô-đun4phần,5bàiđọc,25câu,10cáchnói,17rubric/20caspec,5transfer. Ngày54kỹnăng45câu60phút10/6/4/20/5;ngày55Nhật15câu30phút5/5/5;60câu mới/240lýdo,5SVGphánđoán tựtạo. DịchViệt sau nộp đủ60câu/240lựachọn/10vănbản/5chúgiải,hợpđồngfurigana ghépđúngtext vàkhôngkanjithiếukana. Inventory572surface đãràAI ngữcảnh,chưa native. Tổng54bàithường/270câukiểmbài+60câuthi,đủ56ngày ởmức AIeditorialdraft;không gọi56bàithường. Tuần8dựkiến240phút,cảlộtrình1710,chưađo.

XácminhMHLW cấu trúc hiện hành,CBT vàngưỡngtổngđiểm;metadata4lựachọn/dòngcáchđọc mẫu,chưaxemảnhmẫu. Không lấy nội dungcâu gốc. NguồnPDFchuẩn hashkhớp;đọc nguồn chính theo nhóm,trangin/PDF+2. RàAI Nhật–Việt,đápán/lýdo,ýrubric/biếnthể,chủthể/thờiđiểm,nguồn theođoạn;đổi câuđịnhnghĩada trùngstem thành câu nhậnbiếtcơquan mới;chỉnh từ“phùhợp” ởcâu xâmhạitâmlý;furigana sửa đa nghĩa/ngàygiờ/sốđếm. 5SVGđược render vàxem lại,chưa domain/thiếtbị/appapproval.

Có WEEK_08_EDITORIAL_REPORT,validator tuần8,similarity/furigana/official-structure evidence. Rubric/20ca và chínhsáchthi là đặctả,chưa evaluator/resume/scoringappchạy. Mọihuman/domain/native/publisher-content/rights/runtime/releasefalse;không hình/voiceNPC,không UI/src/JLPT đổi. Đủquota khônglà đủmọichủđề/kỹthuật,độkhó/time/chứngnhậnđỗ. Coveragegap tuầntrước vẫn giữ,cần map/bổsung/duyệt trước tíchhợp.

Lưu nguyêncụm bằngconnector trênHEADremote mới nhất vàđọc lại từngblob trước báođãlưu;không gọi scriptWORKPERSISTENCEPASS hoặc committhứhai chỉghiSHA. Bước tiếp saulưubền:ràgap theo tiêu chuẩn vàchuẩnbị gói duyệt chuyênmôn/bảnngữ/quyền/hình/thờilượng cho cảlộtrình/haiđề. Chỉ tíchhợp saugate;không tự“tuần9”,mởrộngđề hoặcpháthành. Khônghỏi lại quyếtđịnh ngônngữ/furigana/chấmđiểm/resumeđãchốt.

## 2026-10-07 — Rà toàn khóa và gói duyệt chưa ký

Tuần8 đã đọc lại21/21blob trênremotec42c0a5a;local68c9642sạch. Phiên đọc lại đầy đủSTART_HERE/AGENTS/rules/plan/checkpoint/biểuđạtđộc lập;remote vẫn c42c0a5a,trackinglocal cũ6807d7f3, không coi bằng nhau. Connector kiểmbaseline6filetrước sửa vàleaseparenttrước côngbố; bảo toànJLPT,khôngforce/reset. NguồnPDFchuẩn hashkhớp;đọc lại trangconcept in10/16/24/42/98/120/144/152/170/186/198 theoPDF+2. Không tạo kiến thức kỹ thuật mới trongcụm này.

Đã sửa33mục đầuobjectivesVi tuần4–8 từđápán mẫu thành mục tiêu hành động;kiểm so local68c9642 khôngchođổi phần khác. Khôngthêm bài/câu hoặc đổicờ. Rà54mục tiêu/tóm tắtkiếnthức/giớihạn,đọc đủ4đoạn tuần1–3,toàn60stem/240lựachọn đề;khôngclaimauditlạisâu mọi đoạn/thoại/rubric8tuần. Đốichiếu tiêu chuẩnMHLW4trang vàlập28nhóm tổnghợpAI,khônggọi làfullinventorychínhthức. Gắn54bài/60câu/link/hash;ghi rõ thiếu nhiễmkhuẩn,sứckhỏenhânviên/cơhọccơthể,dịchvụ,khẩn cấp,cơchế và kỹthuật hỗtrợ. Lặp nănglực/nhiễu dễ và dấuhiệuđộdài đượcgắnIDcâu;chưa sửaform trongcụm này.

reviews/WHOLE_COURSE_REVIEW_PACKAGE.md,coverage-audit,objective-repairs,review-worklist,similarity-screen vàscripts/check-kaigo-course-review-package.mjs lưubằngchứng.114đơnvị duyệt54bài+60câu đều tên/ngày/quyếtđịnhtrống;12kiểmxuyênđơnvịpending,khônggửi ai hoặc tựký. Màn text-layer toànkhóa12.102trường/2.830dài>=60/0hit,khôngchứngnhậnquyền hoặc kiểmtrùngý/hình. Kếhoạch1710phútchưađo;mọihuman/domain/native/rights/runtime/releasefalse.

Bước tiếp: xử lý độbao phủ/chiềusâu vànhiễu hai form tronglịch8tuần, kiểmnguồn/chuyênmôn/bảnngữ/tải học;không tựtuần9/đềmới/tíchhợpchưagate. Tiếp tục nghiêncứu/soạnnháp đãđượcphép;khôngđánhđồngkýnháp/validatorPASSvớiđạtchuyênmôn. Lưu hẹpconnector vàđọcSHA từngblobtrênnhánh trước báođãlưu;khôngclaimWORKPERSISTENCEscriptPASS.

## 2026-10-07 — Hai đề đầu tiên, bản thảo sửa đổi 2

Baseline remote audit e5384a6282c129b89cf85b47881c8c46350f4a50; local 96858bc giữ đúng nội dung cụm audit. Tracking local cũ không được coi là HEAD remote. Phiên tiếp tục đọc đủ hướng dẫn/plan/checkpoint/biểu đạt độc lập; kiểm SHA nguồn và đoạn text-layer phụ thuộc, đọc lại phần bị cắt. Kiểm riêng MHLW bản hướng dẫn nhiễm khuẩn thứ ba, trang in 28/PDF30, về vệ sinh tay sau tháo găng. Không dùng câu hỏi gốc hoặc công bố PDF nguồn.

Rà AI cả60câu; sửa thân/lựa chọn57câu:42kỹ năng và15Nhật. Ba câu kỹ năng q15/q16/q22 giữ nội dung; sửa furigana 一時的 ở q15. Giữ ID, thứ tự, correctIndex, điểm1/0, thời gian/quota và chính sách đã chốt. q03 chuyển sang đánh giá quá trình, q05 vệ sinh tay, q33 chức năng quần áo, q40 giặt theo chất liệu/ký hiệu. Nhiễu q07/q14/q23/q26/q38 cùng nhóm khái niệm; Nhật q10 đọc thứ tự, q14 thực đơn dự kiến tự soạn, q15 phân công. Giảm cụm năng lực lặp, chưa xóa mọi lặp hoặc đo độ phân biệt.

Dài nhất duy nhất từ27/45và12/15 còn10/45và5/15; ngắn nhất duy nhất4/45và4/15, cũng được kiểm để tránh dấu hiệu đoán mới. Không đổi khóa đáp án để đạt số này. Đối chiếu60câu/240lựa chọn/240lý do Nhật–Việt; sửa 食器 thành đồ đựng và các lý do còn theo nhiễu cũ. Furigana inventory638surface đã ràAI ngữ cảnh, khóa cụm ngày29tháng10/一時的/使用後 và tên người; chưa native approval.

reviews/MOCK_REVISION_02_REPORT.md, mock-revision-02-changes.json và scripts/check-kaigo-mock-revision-02.mjs lưu phạm vi sửa, trước/sau/hash và baseline chính sách.30hash nội dung giữ nguyên gồm bài học và5SVG; không claim render lại hình. Validator tuần8, sửa đề2 và gói review toàn khóa PASS ở mức cấu trúc/hash/liên kết/giới hạn duyệt; diff whitespace kiểm trước commit. Ma trận/screen khóa snapshot mới:12.162trường/2.890dài>=60/0khớp60ký tự; không kiểm trùng ý/hình/quyền. Toàn khóa vẫn54bài/270kiểm bài+60câu đề,114đơn vị chưa ký; không thêm bài hoặc đề.

Human/domain/native/publisher/rights/runtime/release false. Đặc tả resume cần khóa version/snapshot trước tích hợp; chưa app thực thi và chưa đo60/30phút hoặc tổng1710phút. Không đổi UI/src/JLPT. Lưu hẹp lên HEAD remote mới nhất bằng connector với lease, đọc SHA từng blob trên nhánh trước báo đã lưu; không gọi đó là WORKPERSISTENCE script PASS.

Bước tiếp: xử lý khoảng trống kiến thức/chiều sâu ưu tiên trong lịch8tuần, kiểm nguồn/chuyên môn/bản ngữ/tải học. Một câu mới về quá trình hoặc vệ sinh tay không thay bài học/chuyển giao; nhiễm khuẩn, sức khỏe nhân viên, dịch vụ/khẩn cấp và kỹ thuật hỗ trợ vẫn chưa đủ. Không tự tuần9/đề mới/tích hợp/phát hành; không hỏi lại những quyết định đã chốt.
