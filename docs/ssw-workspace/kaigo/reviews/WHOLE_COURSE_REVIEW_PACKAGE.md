# Rà phạm vi toàn khóa Kaigo và gói kiểm duyệt — 2026-10-07

Kết luận: **NOT_READY_FOR_INTEGRATION**. Đủ56ngày ở mức bản thảo không đồng nghĩa đủ kiến thức/kỹ thuật thi hoặc đủ điều kiện phát hành. Toàn khóa có54bài thường/270câu kiểm bài,434lượt thoại và hai đề đầu tiên60câu. Không thêm tuần9 hay đề mới trong cụm này.

## Đã sửa cụ thể

33mục đầu của `objectivesVi` trong tuần4–8 đã được đổi từ đáp án mẫu phụ thuộc câu hỏi (ví dụ “Không. ...”) thành mục tiêu quan sát được: phân biệt, mô tả, đối chiếu, báo cáo hoặc xác định phần cần kiểm. Hai mục tiêu còn lại của mỗi bài giữ nguyên. `whole-course-objective-repairs.json` lưu đủ trước/sau,ID,ngày,trường và lý do. Validator so dữ liệu với commit nền68c9642, chỉ cho phép33thay đổi này; kiến thức, thoại, văn bản, câu hỏi/đáp án, rubric, lịch và trạng thái duyệt giữ nguyên.

## Audit thực sự đã làm

Đọc mục tiêu, tóm tắt kiến thức và giới hạn của54bài; đọc lại đủ4đoạn kiến thức mỗi bài tuần1–3. Đọc toàn60stem/240lựa chọn đề kỹ năng/Nhật và đoạn/hình mô tả đã có. Đối chiếu cơ cấu lớn của [tiêu chuẩn MHLW](https://www.mhlw.go.jp/content/12000000/000503362.pdf), truy cập2026-10-07. Không lấy nội dung câu thi nguồn. 28hàng ma trận gồm12nhóm có một phần,15nhóm mới giới thiệu và1nhóm chưa có bài riêng; đây là nhóm tổng hợp AI để rà, **không phải danh mục chính thức đầy đủ từng tiểu mục**. Không ghi đã audit lại sâu mọi thoại, lý do và rubric trong cả8tuần.

`whole-course-coverage-audit.json` gắn54bài và60câu với ID/path/hash. Liên kết chỉ chứng minh có dữ liệu liên quan, không chứng minh người học đã làm được hoặc kỹ thuật đã đúng. Nhật15câu đo đọc/ngôn ngữ, không dùng để bù phần chăm sóc còn thiếu trong đề kỹ năng.

| Phần | Đã có trong bản thảo | Thiếu cần xử lý |
|---|---|---|
| Nền tảng | Quyền chọn, riêng tư, vai nghề, quan sát, báo cáo | Dịch vụ/quá trình chăm sóc, phòng chống lạm dụng/hạn chế thân thể có hệ thống, sức khỏe nhân viên/cơ học cơ thể, nhiễm khuẩn, thiên tai/khẩn cấp |
| Tinh thần/cơ thể | Bộ phận, vài chức năng, lão hóa, thị giác, sa sút trí tuệ | Hệ cơ quan/nghỉ-ngủ, stress/trí nhớ đủ sâu, nhiều dạng khuyết tật và ca suy giảm chức năng |
| Giao tiếp | Hỏi lại, tiếp nhận, đồng ý, hồ sơ/bàn giao | Giao tiếp nghe/ngôn ngữ, dạng văn bản và kiểm chuyển giao đa dạng hơn |
| Di chuyển | Kế hoạch, đường đi, quyền chọn, nhận biết tư thế | Cơ chế cân bằng/trọng tâm và các kỹ thuật hỗ trợ đã kiểm chuyên môn |
| Ăn uống | Thực đơn/khay, tự ăn, giao tiếp và báo lượng | Cơ chế ăn/nuốt, tư thế/quy trình/dụng cụ và giới hạn theo tình trạng |
| Bài tiết | Kín đáo, nhu cầu, hồ sơ/nhãn | Cơ chế và biến đổi, dụng cụ/quy trình/vệ sinh được duyệt |
| Chỉnh trang/tắm | Mong muốn, chuẩn bị môi trường/đồ cá nhân, báo cáo | Cơ chế và trình tự hỗ trợ theo tình trạng; chăm sóc miệng, mặc/cởi, tắm phần/lau người |
| Việc nhà | IADL, phân loại, đọc thông báo | Kiến thức nấu/dọn/giặt và môi trường rộng hơn, không chỉ hỏi/kiểm nhãn |

Không có hàng nào được gắn “đủ” hoặc chuyên gia đã duyệt. Nhiễm khuẩn chưa có bài riêng; những câu giới hạn “không dạy thao tác” hoặc “gọi hỗ trợ theo cơ sở” không được đếm thành nội dung kỹ thuật đã học.

## Chất lượng hai form còn mở

- M01: kỹ năngq05/q29/q43 cùng trọng tâm riêng tư khi bài tiết. M02:q03/q33/q44 gần nhau về chọn áo/quyền cá nhân. Đây là chồng lấn năng lực cần quyết định biên tập, không khẳng định trùng nguyên văn hoặc mọi ca giống nhau.
- M03: kỹ năngq20/q32 và Nhậtq10/q12/q15 lặp cơ chế tách chuẩn bị/quan sát/chưa biết. Kỹ năng có giá trị nhưng hiện được dùng nhiều; cần cân đối nội dung, không bỏ nó chỉ vì lặp mục tiêu.
- D01:kỹ năngq14/q23/q26/q38 có nhiều nhiễu khác hẳn miền khái niệm. D02 ghi các câu có nhiều từ tuyệt đối/hành vi rõ ràng xấu. Cần rà lại từng lựa chọn và thử mức phân biệt; không thay đồng loạt từ “tất cả” một cách máy móc.
- `surfaceCueMetrics` ghi số câu mà đáp án đúng dài nhất duy nhất theo độ dài chữ Nhật; kỹ năng27/45câu, Nhật12/15câu; đây là tín hiệu để rà, không phải kết quả thử người học. Cân bằng vị trí1–4 không khắc phục được dấu hiệu này.
- Chưa đo60/30phút, độ khó, độ phân biệt hoặc hiệu quả học. Đủquota45/15 không chứng minh form đại diện toàn bộ phạm vi. Chưa sửa nội dung đề ở cụm audit này: sửa nhiễu cần làm đồng bộ đáp án/lý do/dịch/furigana/hình và kiểm lại trong một cụm.

## Gói đưa người kiểm duyệt

`whole-course-review-worklist.json` có114đơn vị chưa ký:54bài+60câu đề. Mỗi đơn vị ghi đường dẫn và nhiệm vụ duyệt; tên/ngày/quyết định trống, evidence rỗng. 12kiểm tra xuyên đơn vị gồm độ bao phủ, hai form,5SVG, cách đọc,quyền, tải học tuần2/6, thời lượng hai đề, resume/nộp/gateViệt/ASR/thiết bị. Chưa gửi cho người ngoài, chưa ai ký duyệt và không tự chuyển cờ.

Ưu tiên chuyên môn: xác nhận ma trận/giới hạn, bổ sung phần nhiễm khuẩn/sức khỏe nhân viên/cơ học cơ thể và các khái niệm còn thiếu; tiếp đó kỹ thuật hỗ trợ theo nguồn/đào tạo phù hợp. Bổ sung vào lịch8tuần phải tính tải và điều chỉnh từng bài, không chèn tuần9 hoặc ép thêm nội dung vào30phút. Có thể tiếp tục nghiên cứu/soạn bản nháp; đưa app cần qua gate đã chốt. Bản ngữ cần rà Nhật–Việt/tự nhiên/furigana; kiểm quyền cần so thủ công biểu đạt và hình, không dựa vào0hit.

## Bằng chứng kỹ thuật và giới hạn

`whole-course-similarity-screen.json`:12.102trường ngôn ngữ được chọn,2.830trường dài ít nhất60ký tự sau chuẩn hóa,0trường khớp cửa sổ60ký tự với text-layer276trang nguồn đúnghash. Đây là sàng lọc có giới hạn, không chứng nhận quyền, không kiểm ý/cấu trúc/hình hoặc nguồn khác. Không đưa PDF/OCR nguồn vào repo. Các màn sàng lọc tuần trước giữ như snapshot lịch sử; màn toàn khóa này có hash sau sửa mục tiêu.

`check-kaigo-course-review-package.mjs` kiểm hash/liên kết/số lượng/phạm vi sửa/trạng thái chưa duyệt. Kiểm tuần1–8 chạy lại vì dữ liệu5tuần đã đổi. Các kiểm tra này không thực thi evaluator, resume, chấm điểm, nộp bài hoặc hiển thị app. NPC chưa hình/voice;5SVGthi không phải artworkNPC. Không có UI/src/JLPT thay đổi, không có dependency mới.

Mọi human/domain/native/rights/runtime/release gate vẫn chưa đạt. Điểm tiếp tục: sửa độ bao phủ/chiều sâu và hai form theo danh sách cụ thể, chuẩn bị đánh giá chuyên môn/bản ngữ; không gọi gói chưa ký này là chứng nhận hoặc phát hành.
