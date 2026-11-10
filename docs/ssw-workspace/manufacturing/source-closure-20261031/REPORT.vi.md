# Đối chiếu nguồn ngành sản xuất 1号 — ngày 31/10/2026

Đã xác minh đúng ba PDF, phân loại đủ **574/574 trang** và lập một ma trận chung theo trang, đơn vị kiến thức, bài học, đoạn giải thích, thuật ngữ và câu hỏi. **Chưa thể xác nhận bao phủ đầy đủ kiến thức của toàn bộ 574 trang.** Danh mục đối tượng trích xuất bằng máy và các liên kết cùng trang không thay thế việc đọc hiểu, phân tách và kiểm tra từng nội dung.

Phạm vi chỉ gồm Tokutei sản xuất **1号**. Không thêm nội dung 2号, không sửa JLPT hoặc các ngành khác. Sáu luồng ghi vào sáu thư mục riêng; bản tổng hợp không tự nâng trạng thái từ ứng viên lên đã xác minh.

## 1. Tài liệu và từng trang

| Tài liệu | Trang vật lý | Phân loại | Đơn vị có hồ sơ đối chiếu giới hạn |
|---|---:|---|---:|
| 機械金属加工 | 169 | 1 bìa, 7 mục lục, 160 trang nội dung/bài tập, 1 cuối sách | 183 |
| 電気電子機器組立て | 198 | 1 bìa, 8 mục lục, 188 nội dung, 1 cuối sách | 39 |
| 金属表面処理 | 207 | 1 bìa, 9 mục lục, 196 nội dung, 1 cuối sách | 45 |
| **Tổng** | **574** | **Không bỏ trang vì ít chữ** | **267** |

Hash và số trang được tính lại từ chính PDF đã tải, khớp hồ sơ nguồn trước đây. Có danh mục tiêu đề/mục lục, vùng văn bản, bảng/ô, công thức hoặc đơn vị ứng viên, ảnh nhúng và cụm vector. Công thức tách nhiều dòng, chữ trong ảnh, bảng không viền và vùng vector vẫn cần diễn giải; số vùng máy tìm được không phải số kiến thức đã dạy.

Trong 267 đơn vị có hồ sơ, **107 là bằng chứng hẹp kế thừa**, **160 là so sánh mới trong phiên**. Cơ khí có 76 so sánh mới, điện 39, bề mặt 45; trong phần bề mặt có một khoảng trống dạy học cần xử lý. Đây là tập đã đọc ở phạm vi giới hạn, **không phải mẫu số đầy đủ để tính phần trăm bao phủ**. Chưa có trang nào được chứng nhận đã đóng toàn bộ đối tượng kiến thức ở mức nghiệm thu đầy đủ.

Mỗi trang có ID ổn định, hash tài liệu, số trang vật lý/trang in, phân loại, bằng chứng trích xuất, loại đối tượng, đơn vị đã ghi, liên kết câu hỏi và việc còn phải làm. Các đơn vị có tọa độ hoặc giới hạn độ chính xác của tọa độ; liên kết đoạn bài/thuật ngữ/câu hỏi ghi riêng ứng viên, kế thừa và đã đối chiếu. Bài tập nguồn không được sao chép; năng lực kiểm tra phía sau bài tập vẫn phải được đối chiếu, không bị loại bỏ cùng câu chữ.

Tệp dùng chung:

- [Ma trận trang–đơn vị–bài–thuật ngữ–câu hỏi](coverage-matrix.json).
- [Danh mục 574 trang dạng CSV](page-register.csv).
- [Danh mục tài liệu và hash](source-register.json).
- [Hàng đợi xử lý từng trang và tiêu chí đóng](completion-work-queue.json).
- [Điều kiện nghiệm thu và trạng thái riêng](acceptance.json).

PDF, OCR đầy đủ, ô bảng nguyên văn và ảnh trang nguồn chỉ được dùng trong vùng phân tích riêng, không đưa vào mã nguồn, tài nguyên hay bản đóng gói app.

## 2. Kết quả theo chuyên ngành

### Cơ khí

Rà mới 47 trang văn bản và xem hình thực tế trên 25 trang; giữ đủ 15 trang ít chữ. Lập 183 hồ sơ đơn vị, 202 lượt liên kết bài/đoạn và 80 liên kết thuật ngữ. Các liên kết câu hỏi ở luồng này vẫn là ứng viên, chưa phải xác minh từng đáp án.

Đã ghi bảy phát hiện truy xuất nguồn cần xử lý. Ví dụ, mô tả cũ ở hồ sơ trang 73 ghi hình đọc 18,45 mm, trong khi đối chiếu PDF xác nhận ví dụ nguồn là 30,35 mm. Không được dùng mô tả cũ này như dữ kiện nguồn; ví dụ 18,20 mm do app tự soạn là một mô hình khác. Mô tả cũ về hàn gián đoạn ở trang 107 cũng không đủ căn cứ từ trang được gán. Phân loại mặt cắt chi tiết và điều kiện cắt gọt cần nguồn bổ sung có phạm vi rõ, không tự suy ra thông số vận hành.

Nguồn bổ sung sơ cấp đã được tách riêng khỏi giáo trình. Ba nguồn bổ sung chỉ hỗ trợ những khẳng định được nêu trong hồ sơ, không hợp thức hóa toàn bộ đoạn mở rộng. Còn 113 trang nội dung chưa có đơn vị chi tiết trong tập đối chiếu hẹp này; tất cả vẫn nằm trong hàng đợi.

Xem [báo cáo cơ khí](mechanical/REPORT.vi.md), [phát hiện](mechanical/findings.json) và [các đơn vị](mechanical/knowledge-units.json).

### Điện–điện tử

Đã đối chiếu 39 đơn vị trên 24 trang với đoạn bài được chỉ đích danh; 22 đơn vị có liên kết mục tiêu câu hỏi và 21 có liên kết thuật ngữ. Có 29 trang được đọc văn bản mới, chín trang được xem hình tổng quan. Những liên kết này không chứng minh đã diễn giải hết sơ đồ hoặc mọi lựa chọn đáp án.

Trang 38 và 97 chưa có dẫn trang trực tiếp vào bài/câu hỏi; đây là bài tập nguồn. Cần kiểm tra mục tiêu học tương ứng, không kết luận tự động là thiếu toàn bộ kiến thức và cũng không sao chép bài tập để lấp chỗ trống. Phạm vi đo AC, loại cảm biến nhiệt, phương pháp cầu điện trở, bảng logic và mô hình hướng dòng/từ trường được ghi điều kiện riêng. Còn 17 đơn vị trong tập đã đối chiếu chưa có liên kết câu hỏi riêng.

Xem [báo cáo điện](electrical/README.vi.md), [đơn vị](electrical/knowledge-units.json) và [việc còn lại](electrical/remaining-work.json).

### Xử lý bề mặt — ưu tiên hoàn thiện cao nhất

Đã đối chiếu 45 đơn vị với đoạn bài cụ thể trên 24 trang; 16 có liên kết mục tiêu kiểm tra. Có 10 trang được xem phóng lớn, gồm cả hai trang ít chữ 70 và 201. Danh mục giữ 49 vùng bảng, 93 vùng công thức/đơn vị, 212 lượt ảnh và 632 cụm vector; đây là ứng viên cần diễn giải, không phải số kiến thức hoàn tất.

Phát hiện ở trang 179: cần làm rõ sự phân biệt nguy cơ khí với sương dung dịch và nguồn hỗ trợ cho đoạn dạy hiện tại. Chưa tự thêm hướng dẫn thao tác hoặc gọi đây là lỗi sách. Các điều kiện dung dịch, vật liệu nền, phép đo chiều dày, khuyết tật, ăn mòn, xả thải và hóa chất vẫn cần kiểm tra ở mức từng khẳng định, không biến số liệu cụ thể trong sách thành quy tắc chung.

Xem [báo cáo bề mặt](surface/REPORT.vi.md), [đơn vị](surface/knowledge-units.json) và [việc còn lại](surface/remaining-work.json).

## 3. Câu hỏi, đáp án và nội dung đã dạy

| Ngân hàng độc lập | Số câu |
|---|---:|
| Kiểm tra tuần lõi | 456 |
| 30 đề mô phỏng gốc | 1.200 |
| Bài bổ sung lô 37 | 80 |
| Nhận diện lô 38 | 61 |
| Thước cặp bổ sung | 8 |
| Boolean bổ sung | 4 |
| **Tổng độc lập** | **1.809** |

120 lượt lấy lại câu cho bộ tuyển chọn không tính thành câu mới. Có 900 câu hai lựa chọn và 909 câu bốn lựa chọn, tổng **5.436 phía đáp án**. Không tự thêm ba phương án nhiễu cho câu đúng/sai.

Kiểm kê cấu trúc toàn bộ: không phát hiện lỗi ID/đáp án/chỉ mục cấu trúc; các liên kết bài và trang đều phân giải được. Tuy nhiên, chỉ 12 câu đã có trường chỉ đích danh đoạn bài trong dữ liệu hiện có. Phiên này có thêm 19 cạnh đối chiếu đoạn dạy–câu hỏi cho chín câu. **5.235 cạnh trang–câu là metadata điều hướng, không phải bằng chứng rằng từng ý đúng/sai đã được dạy.**

Đã đọc ngữ nghĩa mới 78 câu/302 phía lựa chọn; tính lại 63 bài số học và bốn câu Boolean đạt. Việc tính đúng không tự chứng minh nguồn hỗ trợ đầy đủ cho mọi mô hình, công thức hay điều kiện tính.

Các việc cụ thể còn lại:

- Tám câu thước cặp chưa có lý do riêng cho từng lựa chọn; 21 câu nhận diện cơ khí lặp cùng một lý do cho cả bốn phương án. Đã soạn **116 bản nháp lý do riêng**, chưa tích hợp hoặc tính là đã nghiệm thu. Cần đối chiếu hình, đoạn dạy và 12 bản dịch trước khi áp dụng.
- Đã xem năm cặp gần giống giữa các ngân hàng: ba cặp lặp nhiệm vụ thực chất cần biên soạn lại; hai cặp khác số liệu cần quyết định liệu có chủ đích ôn tập. Không dùng tỷ lệ giống chuỗi để tự kết luận hoặc tự xóa câu.
- Mọi câu còn phải có liên kết đơn vị nguồn–đoạn dạy–điều kiện–từng phương án; các liên kết chỉ trùng trang hay trùng từ không được nâng thành đã xác minh.

Xem [báo cáo câu hỏi](assessment/REPORT.vi.md), [phát hiện và ID](assessment/action-findings.json), [116 bản nháp lý do](assessment/option-rationale-backlog.json).

## 4. Thuật ngữ và 12 ngôn ngữ

Đã kiểm tra cấu trúc **207.600 trường hiệu dụng**, gồm 296 bài/hướng dẫn, 1.809 câu và 42 chú thích; không có trường thiếu, sai ID hay hash trong phạm vi kiểm tra. Các hiệu đính đã tích hợp trước đây được chạy lại để tránh chẩn đoán sai từ bản ngân hàng lịch sử.

Lập bản đồ 1.077 vị trí thuật ngữ/854 cách viết Nhật, có vị trí trong bài và đề. Thứ tự rà đúng yêu cầu: Việt → Anh → Indonesia → Trung giản/phồn → Hindi/Bengali/Nepal → Myanmar/Thái/Khmer/Philippines.

Đã đối chiếu ngữ nghĩa mới **204 định nghĩa**, xác minh lại bằng hàm lấy nội dung hiệu đính đang dùng trong sản phẩm. Năm nghi vấn ở dữ liệu cũ đã được sửa từ trước; không sửa lặp. Bốn đề xuất làm rõ ngữ cảnh chưa được xác nhận là lỗi bắt buộc nên chưa áp dụng hàng loạt. **207.396 trường ngoài mẫu này chưa được tính là đã kiểm ngữ nghĩa trong phiên.**

Xem [báo cáo ngôn ngữ](language/REPORT.vi.md), [danh mục trường](language/field-review-ledger.json.gz), [bản đồ thuật ngữ](language/terminology-map.json.gz).

## 5. Hình ảnh và sửa lỗi kỹ thuật đã áp dụng

Đã kiểm kê **63 PNG độc lập, 63 SVG và 65 lượt đăng ký**. Phát hiện 29 ảnh nhận diện trong bản checkout chỉ là con trỏ Git LFS, không phải byte PNG để app hiển thị.

- Khôi phục 25 PNG đúng byte/hash đã đăng ký từ SVG và bộ dựng gốc.
- Bốn PNG không khôi phục được byte cũ đã được dựng thành **phiên bản mã hóa mới từ SVG gốc không đổi, đã xác minh hash**. Có hồ sơ trước/sau, kích thước và bộ dựng; không gọi đây là khôi phục trùng byte.
- Cập nhật đúng chín câu có liên kết tới ảnh và hash nguồn của 12 ngôn ngữ. Kiểm tra nội dung Nhật, lựa chọn, đáp án, lý do và câu chữ bản dịch giữ nguyên. Ba bộ nhận diện liên quan có revision mới; cơ chế có sẵn từ chối bản làm dở thuộc revision cũ. Tiến độ và câu hỏi lõi không bị đổi.
- Lưu đủ 29 PNG trực tiếp cùng mã nguồn, không phụ thuộc con trỏ LFS thiếu byte. Hiện đủ **63/63 PNG thật**, không có ảnh ngoài danh mục.
- Sửa lỗi chú thích đã ẩn vẫn lọt vào nhãn ảnh/nút phóng to mà trình đọc màn hình có thể đọc trước khi nộp. Chế độ học vẫn giữ chú thích. Phóng to bảo toàn ít nhất chiều rộng ảnh nguồn, tránh thu nhỏ chữ của ảnh lớn về mốc 960 px.

Kiểm tra liên kết/chống dữ liệu sai 488 trường hợp đạt; 793 trường hợp SSR thành phần nhận diện đạt. Hồi quy thực thi thành phần xác nhận không còn lọt chú thích ẩn và chú thích học được giữ. SSR dùng adapter được công khai trong hồ sơ, không thay thế tải ảnh/thao tác trên trình duyệt hoặc điện thoại thật.

Trình duyệt trong môi trường hiện tại bị chặn tạo Unix socket trước khi mở trang. Không ghi PASS giả cho màn hình điện thoại, VoiceOver/TalkBack hay thiết bị thật. Các gói native của phiên trước là bằng chứng lịch sử; không dùng chúng để chứng nhận phiên bản vừa sửa.

Xem [báo cáo hình/kỹ thuật](visual-technical/REPORT.vi.md), [danh sách từng ảnh](visual-technical/image-by-image-checklist.csv), [hồ sơ bốn phiên bản ảnh](asset-revision-applied.json).

### Điều kiện ảnh theo ngày học vừa được cập nhật

Chính sách ngày 31/10 yêu cầu ít nhất một hình phù hợp mục tiêu chính của **mỗi ngày học thực tế**. Hồ sơ lịch ngày trên nhánh mới nhất ghi nhận 262 ngày lõi: 24 ngày có liên kết hình, **238 ngày chưa có liên kết** (cơ khí 83, điện 88, bề mặt 67). Đây là khoảng trống liên kết theo ngày, không đồng nghĩa phải tạo 238 ảnh mới. Có thể dùng hình hiện có nếu thực sự phù hợp rồi kiểm tra trong trang học của ngày đó. 63 ảnh trong kho hoặc các thẻ nhận diện bổ sung chưa xếp vào ngày không tự chứng minh đã đạt yêu cầu. Thời lượng 30 phút hiện là mục tiêu, không phải số phút đã đo trên người học.

Xem chính sách [khối lượng và ảnh theo ngày](../../DAILY_LEARNING_AND_IMAGE_REQUIREMENTS_VI.md) và [hồ sơ lịch sản xuất](../../daily-learning-audit-20261031/manufacturing/audit.json). Phần này được thêm vào hàng đợi, chưa tự đánh dấu đạt.

## 6. Hướng hoàn thiện và điều kiện đóng

1. **Ưu tiên bề mặt**, tiếp đến các chi tiết cơ khí/điện có thiếu bằng chứng: đọc từng vùng chưa xử lý, tách khẳng định và điều kiện, dùng nguồn bổ sung sơ cấp có phạm vi riêng khi giáo trình không đủ. Không suy rằng tên mục TOC hoặc một bài cùng trang đã bao phủ hết.
2. Hoàn thiện liên kết từng đơn vị với đúng đoạn, thuật ngữ và từng đáp án; giải quyết 29 câu lý do yếu, ba cặp lặp nhiệm vụ và các bài tính chưa có nguồn/mô hình đủ rõ. Mọi thay đổi phải cập nhật bản dịch và revision liên quan.
3. Đi hết danh mục ngữ nghĩa theo thứ tự ngôn ngữ đã yêu cầu; đồng nhất theo nghĩa trong ngữ cảnh, không ép một cách dịch cho mọi nghĩa của cùng từ Nhật.
4. Nghiệm thu 63 ảnh bằng thiết bị và dụng cụ thực: thang đo/đơn vị, dụng cụ gần giống nhau, điện thoại đứng/ngang/phông lớn, trợ năng, chọn/nộp/chấm/lưu/khôi phục và không lộ đáp án.
5. Chỉ chốt hoàn thiện toàn ngành khi các đơn vị trọng yếu đã có bằng chứng dạy phù hợp, mọi mục chưa dùng có lý do, mọi khẳng định chuyên môn truy xuất được, và có xác nhận thật của chuyên gia/người bản ngữ/thiết bị. AI không cung cấp thay các xác nhận này.

Hàng đợi giữ đủ 574 trang, kèm ưu tiên và điều kiện đóng. Các cờ `wholeCurriculumComplete`, `fullKnowledgeAtomizationComplete`, `releaseReady`, `domainReviewed`, `nativeReviewed`, `humanReviewed`, `physicalDeviceVerified` tiếp tục **false**. Không đưa phần trăm bao phủ khi chưa biết đầy đủ mẫu số kiến thức. Không có tiến trình chạy ngầm được ngụ ý sau khi kết thúc phiên.
