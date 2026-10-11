# Tuần 1 — ảnh theo đúng vị trí nội dung · 2026-10-11

Đơn vị bàn giao đã đổi theo yêu cầu chủ dự án thành **một tuần lịch hoàn chỉnh**. Tuần 1 có 73 đoạn hiển thị: ngày 1–5 mỗi ngày 10, ngày 6 có 12 và ngày 7 có 11. Giữ 40 ảnh đã có của ngày 1–4, bổ sung 33 ảnh của ngày 5–7. Tuần 1 đạt 73/73 vị trí ảnh; toàn danh mục đạt 73/866, còn 793. Không tính ảnh mở đầu dùng lại thành ảnh mới. Các tuần còn lại vẫn trong phạm vi cần làm; bước kế tiếp là tuần 2 sau khi xác minh commit trên remote.

Quy tắc v10 và approved-plan v15 lưu rõ một tuần là đơn vị hoàn tất. Có thể tạo ảnh thành các nhóm kỹ thuật nhỏ nhưng chỉ bàn giao sau khi đủ mọi đoạn của tuần, kiểm trực quan, kiểm chạy thực tế và xác minh remote. Không áp đặt đúng 10 ảnh/ngày: số lượng theo nội dung thật của từng tuần.

## Biểu đạt và vị trí

Dùng nội dung tự biên soạn sẵn của ngày 5–7 để xác định hành động, nhân vật và điều kiện trong từng cảnh. Mỗi ảnh gắn chính xác sectionId và chú thích tiếng Việt, đặt trước nội dung đoạn tương ứng trong trang đọc liên tục. Đây là bổ sung minh họa, không phải tác giả hóa thêm quy trình lâm sàng hoặc xác nhận đủ kiến thức toàn tài liệu. Không đưa ảnh/sơ đồ tài liệu nguồn vào prompt, không sao chép hình nguồn.

Ảnh 2D màu mới, tham chiếu hình do dự án tự tạo: foundation-03-autonomy-overview, infection, foundation-02-confirmed-chair; một số cảnh nhân viên dùng ảnh mới foundation-06-handoff-two-items để giữ phong cách/vai. Chỉ mã hóa WEBP quality90, giữ kích thước/tỷ lệ gốc, không cắt/đổi kích thước. Toàn bộ 33 ảnh đã xem riêng và đối chiếu lại bằng bảng ảnh. Prompt, tham chiếu, prompt sửa, kích thước và SHA256 nằm trong asset-review.json và danh mục paragraph-art-prompts.

Bốn lần sửa có mục tiêu: ảnh xem lại kế hoạch dùng sổ thay album hoa; ảnh tổng quan vệ sinh tay đổi góc nhìn để khác ảnh mở đầu; hội thoại thư viện thay người cao tuổi bằng học viên; bài ghi hạn trả thay album ảnh bằng bảng quản lý trừu tượng. Không in lời thoại/đáp án hoặc ngày hạn trả chưa xác nhận trong hình. Giờ đóng phòng, giờ kết thúc chương trình và hạn trả được phân biệt bằng chú thích. Cửa sổ bài hẹn thông khí vẫn đóng; bác tự đọc/giải ô chữ, nhân viên chỉ giúp phần đã đề nghị.

Ảnh mở đầu ngày 1–3 và 5 dùng lại ảnh tổng quan phù hợp của bài, ngày 4 giữ privacy, ngày 6 chọn infection, ngày 7 dùng ảnh họp chuẩn bị sức khỏe nhân viên. Sửa lựa chọn nguồn ảnh và chú thích trong lesson-illustrations; không thay bố cục hay thao tác UI. Những bài liên kết cùng parentDay nhận cùng lựa chọn theo chủ đề; không tuyên bố đã kiểm thiết bị cho các tuần đó.

Điểm giới hạn vệ sinh tay/giảm tải đã đối chiếu nguồn chính thức để tránh hình gợi thực hành sai: [CDC — Hand Hygiene](https://www.cdc.gov/clean-hands/hcp/clinical-safety/index.html) và [OSHA — Safe Patient Handling](https://www.osha.gov/healthcare/safe-patient-handling). Chỉ minh họa điểm nhận biết: tay trần sau găng, rửa và làm khô khác chà tay, dụng cụ/nhân lực/kế hoạch trước hỗ trợ. Giỏ nhẹ và giường trống không phải hướng dẫn nâng người; các hình không mô tả đầy đủ kỹ thuật, lựa chọn lâm sàng hoặc danh mục vật tư thảm họa.

## Kiểm tra thực thi

- WeeklyKaigo + RoyalPanels thật chạy trong harness RNWeb với shim expo-image qua RNWebImage, font và ảnh nút Back của dự án đã kiểm hash LFS. Ba viewport: 390×844, 768×1024, 844×390.
- 73 ảnh đoạn × 3 viewport = 219 lượt giải mã và kiểm kích thước/tỷ lệ; số ảnh đúng cho từng ngày; chú thích đúng; không tràn ngang; ảnh ngang trong giới hạn chiều cao màn hình; 0 pageErrors; không input/textarea trong bài.
- Kiểm đủ bảy chú thích ảnh mở đầu ở cả ba viewport, ảnh mở đầu ngày 5 không còn chú thích cảnh lựa chọn vẽ/nghe âm thanh. 27 ảnh chụp: 21 tổng quan ngày + 6 đoạn hội thoại/chiều sâu trên màn hình 390. Đã xem ảnh chụp sau thay lựa chọn ảnh mở đầu.
- Calendar validator PASS: 26 tuần / 182 ô / 176 ngày / 6 ô trống / 687 câu hỏi / 866 đoạn; bảy JSON runtime gốc giữ hash. JLPT UI lock PASS 10/10. Không đổi trạng thái hoàn thành, ID/revision, câu hỏi, lịch, tiến độ hoặc lượt thi.
- Lần tích hợp ban đầu gặp metadata ảnh cũ thiếu captionVi; sửa bộ tạo manifest để lấy chú thích đang dùng trong registry, giữ nguyên 40 metadata cũ. Chỉ evidence cuối cùng sau sửa nguồn ảnh mở đầu là bằng chứng nghiệm thu. Cảnh báo thiếu expo/tsconfig.base thuộc harness riêng; không tuyên bố full-repo TypeScript PASS.

Bằng chứng: runtime-tests/2026-10-11-week1-art/executed-browser-check.mjs, evidence.json, asset-review.json và 27 screenshot. Chưa thử native iPhone/iPad/Android, chưa chạy toàn ExpoRouter. humanReviewed/domainReviewed/rightsReviewed/releaseReady vẫn false; không có kết quả đo khả năng ghi nhớ người học. Toàn bộ ảnh còn lại chưa hoàn tất, fullParagraphArtComplete=false.

## 33 ảnh bổ sung

| Ngày | Section ID | Ý chú thích |
|---|---|---|
| 5 | `kaigo-foundation-05-summary` | Mong muốn của người sử dụng là đầu vào cho kế hoạch; nhóm chăm sóc cùng trao đổi và xem lại hỗ trợ. |
| 5 | `kaigo-foundation-05-knowledge-0` | Thăm viếng tại nhà, dịch vụ trong ngày và nội trú khác nhau ở nơi sống và cách nhận hỗ trợ. |
| 5 | `kaigo-foundation-05-knowledge-1` | Sau thực hiện, nhóm cùng người sử dụng xem lại kết quả để điều chỉnh kế hoạch phù hợp. |
| 5 | `kaigo-foundation-05-knowledge-2` | Đến phòng đọc chưa đủ; cần hỏi trải nghiệm tham gia có đúng mong muốn của bác không. |
| 5 | `kaigo-foundation-05-knowledge-3` | Bác Onodera muốn trồng hoa nhưng không muốn xuất hiện trong ảnh; cách tham gia còn cần xác nhận. |
| 5 | `kaigo-foundation-05-words` | Chậu cây, máy ảnh chưa dùng và trao đổi kế hoạch giúp nhớ tham gia, chụp ảnh, lựa chọn và xác nhận. |
| 5 | `kaigo-foundation-05-dialogue` | Nhân viên tiếp nhận mong muốn tham gia và không chụp ảnh, xin phép hỏi người phụ trách; chưa hứa phương án. |
| 5 | `kaigo-foundation-05-transfer-legacy` | Muốn làm thủ công và đồng ý chụp là hai việc; nhân viên cần kiểm điều kiện tổ chức. |
| 5 | `kaigo-foundation-05-reading` | Ghi mong muốn tham gia, giới hạn chụp ảnh và việc đang chờ xác nhận; quyết định cuối cùng chưa chốt. |
| 5 | `kaigo-language-transfer-259` | Hạn đăng ký tài liệu và quyền xem trưng bày là hai điều khác nhau; không đăng ký tài liệu vẫn được xem. |
| 6 | `kaigo-foundation-06-summary` | Vệ sinh tay và chuẩn bị phù hợp giúp hạn chế lan truyền; ảnh chỉ minh họa một điểm kiểm. |
| 6 | `kaigo-foundation-06-knowledge-0` | Tay và đồ vật có thể là mắt xích truyền nhiễm; vệ sinh tay giúp ngắt đường tiếp xúc. |
| 6 | `kaigo-foundation-06-knowledge-1` | Đồ bảo hộ được chọn theo nguy cơ; mang găng không thay thế vệ sinh tay. |
| 6 | `kaigo-foundation-06-knowledge-2` | Khi có bẩn nhìn thấy cần rửa với nước và xà phòng; xả và làm khô là phần của việc rửa. |
| 6 | `kaigo-foundation-06-knowledge-3` | Đồng nghiệp bàn giao hai việc; người học đề nghị nói riêng từng việc chưa nghe rõ. |
| 6 | `kaigo-depth-01` | Đồ sạch và đồ đã dùng cần tách rõ; găng đã dùng không được chạm hộp khăn sạch. |
| 6 | `kaigo-depth-02` | Rửa rồi làm khô khác với chà tay bằng chế phẩm đến khô; không lau chế phẩm đi sớm. |
| 6 | `kaigo-foundation-06-words` | Sách, thời điểm mở phòng và việc kiểm hạn giúp nhớ các từ trong phần truyền đạt hai việc. |
| 6 | `kaigo-foundation-06-dialogue` | Hai bên xác nhận giờ mở phòng sách riêng với việc chưa biết hạn trả; Kishimoto sẽ kiểm và báo. |
| 6 | `kaigo-foundation-06-transfer-legacy` | Giờ được dùng phòng không tự thành giờ kết thúc chương trình; cần kiểm mốc còn thiếu. |
| 6 | `kaigo-foundation-06-reading` | Ghi riêng phòng sách mở đến 15 giờ, hôm nay chưa phải trả và hạn trả đang được kiểm. |
| 6 | `kaigo-language-transfer-234` | Trong bài đọc hư cấu: đóng hộp rồi viết tên; đây không phải quy trình chăm sóc. |
| 7 | `kaigo-foundation-07-summary` | Nhân viên trao đổi sức khỏe, giới hạn hỗ trợ và chuẩn bị trước khi làm việc. |
| 7 | `kaigo-foundation-07-knowledge-0` | Đưa công việc gần thân giúp giảm tải; hình dùng vật nhẹ để minh họa nguyên lý, không dạy nâng người. |
| 7 | `kaigo-foundation-07-knowledge-1` | Chọn dụng cụ, nhân lực và kỹ thuật đã được huấn luyện theo kế hoạch; không tự nhấc người. |
| 7 | `kaigo-foundation-07-knowledge-2` | Nghỉ ngơi và trao đổi căng thẳng đi cùng chuẩn bị lối thoát, vật dụng và phân công. |
| 7 | `kaigo-foundation-07-knowledge-3` | Bác Hasebe chọn đọc sách trong phòng; nhân viên hỏi phần bác muốn được giúp. |
| 7 | `kaigo-depth-03` | Giảm tải bắt đầu từ điều kiện công việc, dụng cụ và nhân lực; không coi tư thế đúng là đủ để tự nâng người. |
| 7 | `kaigo-foundation-07-words` | Sách, dấu trang xanh và trao đổi với người phụ trách gắn từ mới với yêu cầu của bác. |
| 7 | `kaigo-foundation-07-dialogue` | Nhân viên chỉ giúp tìm trang có dấu xanh; bác Hasebe giữ phần tự đọc. |
| 7 | `kaigo-foundation-07-transfer-legacy` | Bác tự giải ô chữ; nhân viên chỉ lấy bút và báo vắng trong phạm vi cần thiết. |
| 7 | `kaigo-foundation-07-reading` | Sau khi được giúp mở trang, bác tự đọc trong yên tĩnh; nhân viên giữ hỗ trợ đúng phần. |
| 7 | `kaigo-language-transfer-241` | Hiện bác muốn nghỉ; nhân viên hẹn trao đổi việc thông khí vào chiều, cửa sổ chưa được mở. |

## Lưu bền vững

Commit chỉ gồm tài sản/mapping/quy tắc/bằng chứng/checkpoint Kaigo tuần 1. Các thay đổi JLPT đồng thời được giữ bằng fetch/fast-forward, không đưa lại vào thay đổi Kaigo. Dùng GitHub connector với expected-head lease, sau đó fetch và yêu cầu WORK PERSISTENCE PASS trước thông báo hoàn tất. Không tạo commit phụ chỉ để ghi SHA. Nguồn rà sâu lần hai 51–70 và vướng mắc chuyên môn trang195 vẫn là công việc riêng sau tiến trình ảnh.
