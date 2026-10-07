# Hướng dẫn chính thức — Tokutei Gino 介護

Phiên bản: 2. Ngày duyệt: 2026-10-07 (Asia/Tokyo).
Trạng thái: CHỦ DỰ ÁN ĐÃ DUYỆT PHƯƠNG ÁN BIÊN SOẠN.
Repository: duykhanhtokio/japan-app. Nhánh: recovery/jlpt-n3-n1.
Đây là hợp đồng biên soạn; duyệt phương án không chứng nhận nội dung chưa được tạo, kiểm duyệt hoặc tích hợp.

## 1. Bắt buộc đọc trước mỗi phiên

1. Đọc đầy đủ docs/AI_SESSION_START_HERE.md và AGENTS.md theo thứ tự dự án.
2. Đọc toàn bộ bản này, KAIGO_AUTHORING_CHECKPOINT.md và approved-plan.json cùng thư mục.
3. Đọc quy tắc biểu đạt độc lập tại ../TOKUTEIGINO_ORIGINAL_AUTHORING_REQUIREMENTS_2026-09-25.md. Các gate riêng ngành xây dựng/thực phẩm không áp dụng máy móc cho 介護.
4. Kiểm tra nhánh, remote, HEAD, thay đổi chưa lưu, nội dung đã có; bảo toàn công việc khác.
5. Đọc lại các trang nguồn liên quan đến đơn vị sắp soạn; kiểm tra phiên bản/hash. Không dùng trí nhớ hoặc bản tóm tắt thay cho hướng dẫn đầy đủ.
6. Khi bắt đầu bộ đề mới, xác minh cấu trúc hiện hành từ MHLW/Prometric. Không mở dữ liệu JLPT để làm 介護.
7. Báo ngắn hướng dẫn đã đọc, điểm tiếp tục và đơn vị sẽ hoàn thành. Không làm lại đơn vị đã kiểm chứng.
Nếu thiếu nguồn, chỉ dừng phần phụ thuộc nguồn đó; tiếp tục công việc độc lập đã được phép.

## 2. Quyết định đã duyệt

- Giữ kiến thức và thuật ngữ; tự viết mới hội thoại, bài đọc, câu hỏi, giải thích và hình.
- Tạo đủ số NPC cho mọi vai/bối cảnh cần thiết. KHÔNG giới hạn một NPC xuyên suốt hoặc để một nhân vật đổi vai không rõ ràng.
- Lộ trình 8 tuần; mặc định 30 phút/ngày.
- Hội thoại tiếng Nhật; hỗ trợ, dịch và giải thích tiếng Việt. Tách trường ngôn ngữ, không trộn vào một câu thoại Nhật.
- Hội thoại khoảng 6–12 lượt theo mục tiêu. Không áp quy tắc 11 lượt của nhánh hội thoại khác.
- Bắt đầu bằng tình huống đã kiểm duyệt, lựa chọn tự do có giới hạn.
- Tạo một bộ thi thử kỹ năng và một bộ thi thử tiếng Nhật để kiểm duyệt trước; tổng số bộ về sau chưa chốt.
- Lưu hướng dẫn bắt buộc đọc và checkpoint vào mã nguồn.
Các quyết định này không cho phép xóa dữ liệu, đổi giao diện đã duyệt hay tự phát hành.

## 3. Nguồn chuẩn và sử dụng

Nguồn chính: 介護ー特定技能ーベトナム語.pdf, sách học bản sửa đổi thứ 2, Hiệp hội Chuyên viên chăm sóc phúc lợi Nhật Bản, tháng 3/2025, 276 trang PDF.
SHA-256: 997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54.
Bản riêng: Library libfile_30516fe27c688191907d48df8b3fb8df. Không suy rằng ID này truy cập được từ runtime app.
Tài liệu cũ 介護ー問題と答えーベトナム語.pdf là sách ôn thi quốc gia; không dùng làm nguồn chuẩn thay thế.
Không đưa PDF/OCR/ảnh/bảng/đáp án nguồn vào repo công khai hoặc bundle. Chỉ lưu metadata và bài tự biên soạn.
Dùng thuật ngữ phổ biến, sự kiện đã kiểm chứng và mục tiêu năng lực. Tự viết nghĩa Việt, ví dụ, lời thoại và câu hỏi. Không dịch sát, thay tên/tuổi/danh từ, mở rộng nguyên hội thoại hoặc sao chép trình tự đặc thù rồi gọi là tác phẩm mới.
Rà tương đồng về lời văn, tình huống và logic lựa chọn; không có phần trăm giống nào bảo đảm quyền sử dụng. Chưa rà thì ghi chưa rà.
Quét văn bản là công cụ tìm trang. Đối chiếu trực tiếp trang PDF để sửa kanji/kana/furigana; chưa công bố tổng số từ duy nhất trước khử trùng và kiểm trang.

## 4. Bản đồ nội dung nguồn

Các trang sau là trang IN trong sách; hồ sơ phải lưu thêm trang PDF đã kiểm, không đoán offset.

| Nhóm | Trang bắt đầu |
|---|---:|
| Tôn nghiêm, tự lập | 10 |
| Vai trò và đạo đức | 16 |
| An toàn, rủi ro | 24 |
| Tinh thần và cơ thể | 42 |
| Lão hóa, khuyết tật, sa sút trí tuệ | 68 |
| Giao tiếp cơ bản / người sử dụng / nhóm | 98 / 102 / 114 |
| Di chuyển / ăn uống / bài tiết | 120 / 144 / 152 |
| Chỉnh trang / tắm, vệ sinh / việc nhà | 170 / 186 / 198 |
| Từ cơ thể / tư thế / bệnh, triệu chứng | 204 / 206 / 207 |
| Từ di chuyển / ăn / bài tiết / chỉnh trang / tắm / việc nhà | 208 / 213 / 219 / 224 / 230 / 238 |
| Hội thoại tương ứng | 209–212 / 215–218 / 220–223 / 225–229 / 231–237 / 239–243 |
| Từ văn bản / bài đọc | 245–246 / 247–269 |

Mục lục và bảng đáp án cho thấy 29 bài hội thoại/bắt chuyện, 23 bài đọc. Đây là tham khảo mục tiêu, không phải các đề thi đầy đủ hay số bài mới đã hoàn thành.
Bài đọc gồm tình trạng người sử dụng, cách làm việc, thông báo, thực đơn, kế hoạch sự kiện, lịch công việc, báo cáo sự cố và bàn giao ca.

## 5. Tổ chức bài học

Mỗi bài liên kết: kiến thức → từ/cách nói → NPC → văn bản → ôn tập.
Trước khi viết lập hồ sơ mục tiêu, phạm vi thi, nguồn, giới hạn áp dụng, từ, hành động giao tiếp, bối cảnh và dạng kiểm tra.
Không chia kho từ/hội thoại/thi hoàn toàn rời nhau; dùng ID liên kết. Một thuật ngữ dùng nhiều bài chỉ có bản ghi chung, trừ trường hợp đa nghĩa cần phân biệt.
Kiến thức quyết định cách giao tiếp: hỏi mong muốn, xin phép, xác nhận mức hỗ trợ và báo cáo thay đổi. Không chỉ dạy tiếng Nhật mà bỏ nguyên tắc chăm sóc.

## 6. Kế hoạch 8 tuần, 30 phút/ngày

| Tuần | Trọng tâm |
|---|---|
| 1 | Tôn nghiêm, tự lập, giao tiếp, quyền riêng tư |
| 2 | Cơ thể, triệu chứng, lão hóa, khuyết tật, sa sút trí tuệ, an toàn |
| 3 | Di chuyển và báo cáo tình trạng |
| 4 | Ăn uống |
| 5 | Bài tiết |
| 6 | Chỉnh trang, tắm và vệ sinh |
| 7 | Việc nhà, văn bản, thông báo và bàn giao |
| 8 | Ôn điểm yếu, tình huống tổng hợp, thi thử |

Buổi thường: 5 phút ôn, 5 phút kiến thức, 5 phút từ/cách nói, 10 phút NPC, 5 phút kiểm tra.
Mục tiêu thiết kế: 5–8 từ mới và 2–3 cách nói có sử dụng thực tế trong bài; một tình huống NPC; 3–5 câu kiểm tra hoặc văn bản ngắn. Điều chỉnh theo độ khó, không thêm từ vô dụng để đạt chỉ tiêu.
Ngày 1–4 học mới; ngày 5 phối hợp kiến thức trong tình huống mới; ngày 6 ôn lỗi/báo cáo/văn bản; ngày 7 kiểm tra ngắn và sửa điểm yếu.
Nhắc lại đề xuất: sau 1, 3, 7, 14, 30 ngày; điều chỉnh theo kết quả. Đây là thiết kế ôn tập, không phải quy định thi.
Không chia đều trang; phân bổ theo mục tiêu và tải học. Lập ma trận đủ 56 ngày trước sản xuất toàn bộ, kiểm tra tải tuần 2 và 6, không mặc định lịch bảo đảm đỗ.
Ngày thi đầy đủ tách riêng: kỹ năng 60 phút, tiếng Nhật 30 phút. Không gọi bài rút ngắn 30 phút là đề đủ thời gian.

## 7. NPC và bối cảnh

Tạo ma trận vai × tình huống trước khi chốt số lượng nhân vật. Đủ NPC người sử dụng dịch vụ, đồng nghiệp, người phụ trách và người nhà khi tình huống cần; thêm vai chuyên môn phù hợp như y tá nếu mục tiêu thực sự cần. Mỗi NPC có ID, vai ổn định, đặc điểm giao tiếp và giới hạn trách nhiệm.
Có thể tái sử dụng NPC trong nhiều bối cảnh hợp lý; không cần một NPC mới cho mỗi câu. Không gán mọi vấn đề cho cùng một người hoặc mô tả người cao tuổi/khuyết tật theo khuôn mẫu.
Bối cảnh bao phủ phòng ở, hành lang, phòng ăn, nhà vệ sinh, khu chỉnh trang, tắm/vệ sinh, sinh hoạt/việc nhà, bàn giao và tiếp nhận người nhà theo mục tiêu.
Danh sách/tên/số NPC và hình cụ thể chưa được tạo hay duyệt; tạo hồ sơ nội dung trước hình để tránh thiếu vai và dư tài sản.

## 8. Soạn hội thoại và phản hồi

Hồ sơ mỗi scenario: vai người học/NPC, nhu cầu, điều kiện, mục tiêu kiến thức, từ, 2–3 hành động giao tiếp, thông tin phải hỏi, kết quả, câu trả lời chấp nhận và hành động cần chỉnh.
6–12 lượt tính mỗi phát ngôn của một người là một lượt. Không kéo dài để đủ số. Tình huống cần dài hơn phải giải thích hoặc tách thành hai đơn vị hợp lý.
Bao phủ: chăm sóc thường, muốn tự làm, từ chối, hỏi lại, thay đổi tình trạng, phối hợp/bàn giao. Không noun-swap hoặc lặp chuỗi đáp án.
Chế độ: có hướng dẫn → đóng vai trong phạm vi được kiểm duyệt → kiểm tra ít gợi ý. Ghi rõ người học nói với ai và cần hoàn thành gì.
Tự do có giới hạn: chấp nhận nhiều cách nói đúng ý; chỉ đáp theo tri thức/tình huống đã duyệt. Không mở thành AI tư vấn điều trị không giới hạn. Nếu thiếu dữ kiện, hỏi lại hoặc chuyển người phụ trách.
Đánh giá riêng: hiểu tình huống, hoàn thành giao tiếp, phù hợp chăm sóc, tiếng Nhật, phát âm nếu có audio. Không dùng phát âm tốt bù lỗi chăm sóc. ASR không chắc thì cho nói lại/sửa văn bản; không phạt kiến thức theo lỗi nhận dạng.
Phản hồi: điều làm được, một điểm cần sửa, câu gợi ý do dự án viết và cơ hội luyện lại. Không chỉ so khớp câu mẫu.

## 9. Ôn thi

Ba lớp: kiểm tra cuối bài; ôn chủ đề/lỗi; đề đầy đủ. Ngân hàng ôn linh hoạt nhưng đề đủ phải giữ cơ cấu.

| Bài | Thời gian | Cơ cấu |
|---|---:|---|
| Kỹ năng | 60 phút, 45 câu | Cơ bản 10; tinh thần/cơ thể 6; giao tiếp 4; hỗ trợ sinh hoạt 20; thực hành CBT 5 |
| Tiếng Nhật | 30 phút, 15 câu | Từ chuyên ngành 5; hội thoại/lời nói 5; văn bản 5 |

Nguồn cấu trúc: https://www.mhlw.go.jp/stf/newpage_000117702.html, kiểm tra 2026-10-07. Ngưỡng từ 2026-04-01: kỹ năng 60% tổng điểm, tiếng Nhật 73% tổng điểm. Không tự suy điểm trọng số hoặc số câu đỗ khi chưa xác nhận cách chấm.
Đối chiếu mẫu chính thức về số lựa chọn, lệnh hỏi, furigana và thao tác CBT trước chốt schema. Không thêm nghe/nghỉ nhạc JLPT hay thi thực hành trực tiếp. Âm thanh luyện giao tiếp là hoạt động học riêng.
Một đáp án đúng/phù hợp nhất; đủ điều kiện; phương án nhiễu có lý do. Viết giải thích đúng và sai cho từng lựa chọn. Không lấy đáp án sách làm đáp án bài mới.
Hình thực hành phải mới, đủ dữ kiện, kiểm chuyên môn cùng câu hỏi. Bài đọc dùng văn bản mới thuộc các loại trong phạm vi.
Trong thi thử không lộ đáp án/gợi ý; chữa bài sau nộp. Điểm NPC không quy đổi thành kết quả thi.
Bộ đầu tiên gồm một bài kỹ năng và một bài tiếng Nhật, cần kiểm duyệt trước mở rộng. Ngôn ngữ bài kỹ năng, furigana, thuật toán cân bằng đáp án, cách tính điểm và hành vi resume/nộp bài chưa được chủ dự án quyết định cụ thể; trình phương án khi triển khai phần phụ thuộc.

## 10. Hồ sơ và QA

Lưu ID bài/chủ đề/mục tiêu; vocabulary ID; nguồn tên/phiên bản/hash/trang in/trang PDF; giới hạn; nội dung Nhật; nghĩa/giải thích Việt mới; NPC/scenario; expected intents/acceptable variants; câu hỏi/đáp án/lý do; trạng thái và phiên bản.
Tách AI kiểm cấu trúc/biên tập khỏi kiểm duyệt chuyên môn, ngôn ngữ, quyền, hình/audio và runtime. Không ghi humanReviewed=true khi không có người duyệt.
Cổng QA: đủ phạm vi, dữ kiện; từ/kana/furigana đúng; giao tiếp tự nhiên, kết quả hợp lý; đáp án không mơ hồ; dịch nhất quán; hình đúng; không trùng hoặc viết lại nguồn; không có PDF/OCR nguồn trong bundle.
Các nội dung thuốc, nuốt, chuyển tư thế, nhiễm khuẩn, khẩn cấp cần kiểm chứng phù hợp và ghi giới hạn. NPC không tự chẩn đoán hay ra chỉ định điều trị. Chưa đủ bằng chứng thì đánh dấu chờ duyệt, không phát hành.
Kiểm tương đồng không chứng nhận quyền pháp lý; ghi nguồn đã đối chiếu và quyết định biên tập. Không áp gate hay số liệu ngành khác cho 介護.

## 11. Quy trình và điểm tiếp tục

1. Kiểm kê nguồn riêng và bản đồ trang.
2. Lập ma trận 56 ngày, kiến thức/từ/cách nói và ma trận NPC/bối cảnh.
3. Soạn một cụm di chuyển trọn chuỗi để kiểm chứng phương pháp, sau đó các cụm theo lịch.
4. QA từng đơn vị, sửa lỗi trước đánh dấu hoàn thành; tạo bộ đề đầu tiên theo quota.
5. Chỉ tích hợp nội dung đạt gate, qua schema app đã kiểm. Không tự đổi UI hoặc xóa nội dung khác.
6. Lưu checkpoint và commit hẹp, push/fetch, kiểm chứng remote trước đơn vị tiếp theo. Không sửa hướng dẫn đã duyệt âm thầm; ghi phiên bản và thay đổi mới.
Checkpoint phải ghi hoàn thành/còn dở/blocker/bước tiếp; có/không có ảnh/audio/runtime; không tự nâng trạng thái.


## 12. Điều chỉnh đã được chủ dự án duyệt — 2026-10-07

Hoàn thiện trọn tuần1–3 và sửa lỗi báo cáo trước khi viết tuần4. Giữ8tuần,30phút/ngày; phân bổ lại buổi trong tuần1–3 thành3phút ôn,8phút kiến thức,5phút từ/cách nói,9phút giao tiếp NPC,5phút đọc/câu hỏi. Đây là phân bổ hoạt động chưa đo trên người học. Mỗi bài có giải thích khái niệm, đối chiếu case đúng/sai, bài chuyển giao,5câu kiểm tra và rubric tách ý bắt buộc. Các ngày5–7 dùng lại từ, không đặt chỉ tiêu từ mới. Thay đổi này thay phân bổ cũ5/5/5/10/5 cho ba tuần được sửa; không tự đổi các ngày thi đủ thời gian. Duyệt sửa không thay kiểm chuyên môn, bản ngữ, quyền hoặc runtime.
