# YÊU CẦU HOÀN THIỆN KIẾN THỨC NGUỒN VÀ BIÊN SOẠN ĐỘC LẬP — JAPAN APP

## I. Mục tiêu bắt buộc

Khai thác đầy đủ kiến thức quan trọng trong tài liệu nguồn, biên soạn thành nội dung học độc lập và tích hợp vào ứng dụng.

Phải đạt đồng thời:

1. Không bỏ sót kiến thức quan trọng, điều kiện áp dụng, ngoại lệ, cảnh báo, bảng, công thức và thông tin trong hình.
2. Giải thích đúng, đủ để người học hiểu và vận dụng.
3. Tạo lời văn, cấu trúc bài, tình huống, câu hỏi và hình minh họa độc lập.
4. Có bằng chứng đối chiếu từ từng ý nguồn đến nội dung thực sự hiển thị trong app.
5. Bảo toàn ID và dữ liệu học tập hiện có.
6. Phân biệt rõ kết quả kiểm tra AI, nghiệm thu chuyên môn, kiểm tra hiển thị, thiết bị thật và thời lượng thực học.

Không dùng việc đổi từ, dịch hoặc đổi màu/bố cục hình làm bằng chứng tự động rằng nội dung đã độc lập về biểu đạt hoặc đã giải quyết bản quyền.

## II. Quy trình chung cho mọi ngành

### 1. Xác nhận nguồn và trạng thái mã nguồn

Trước khi sửa:

- Đọc hướng dẫn repository, hợp đồng biên soạn và checkpoint hiện hành của ngành.
- Kiểm tra nhánh, HEAD, remote và các thay đổi chưa commit.
- Bảo toàn công việc có sẵn.
- Lập danh mục tài liệu: tên, phiên bản, hash, tổng trang PDF, số trang in và tài liệu trùng.
- Phân biệt trang trùng hoàn toàn với trang chỉ giống phần chữ.
- Xác định nguồn nào đã truy cập được, nguồn nào thiếu hoặc không đọc được.

Không coi tên file hoặc số trang trong báo cáo cũ là bằng chứng đã đọc nội dung.

### 2. Kiểm kê toàn bộ vùng nội dung trước khi lọc

Mỗi trang phải được kiểm cả chữ và hình.

Ghi nhận:

- Tiêu đề, đoạn văn, danh sách và cảnh báo.
- Từng hàng/cột của bảng, tiêu đề bảng, đơn vị và chú thích.
- Công thức, ký hiệu, số mũ, điều kiện và ví dụ.
- Nhãn hình, bộ phận, mũi tên, trình tự, quan hệ vị trí.
- Chú thích nhỏ, ngoại lệ và tham chiếu tới trang khác.

OCR và trích xuất PDF chỉ là công cụ hỗ trợ. Những phần khó đọc phải đối chiếu ảnh trang.

Không bỏ vùng nội dung vì ít chữ, khó trích xuất hoặc chưa có bài cùng chủ đề. Nội dung chưa xử lý phải có trạng thái rõ ràng.

### 3. Phân rã thành đơn vị kiến thức

Một đơn vị kiến thức phải đủ nhỏ để xác định được điều người học cần biết hoặc làm được, nhưng vẫn giữ điều kiện cần thiết.

Phải tách riêng khi nguồn có:

- Nhiều mục đích của cùng một thiết bị.
- Nhiều bước của quy trình.
- Các trường hợp áp dụng khác nhau.
- Điều kiện, ngoại lệ hoặc giới hạn.
- Các đặc điểm phân biệt dễ nhầm.
- Các quan hệ riêng trong bảng hoặc hình.

Không tách vụn câu chữ chỉ để tăng số lượng. Không gộp nhiều năng lực khác nhau thành một dòng “đã có bài cùng chủ đề”.

### 4. Phân loại và xác định phạm vi bắt buộc

Mỗi ý phải thuộc một loại:

- Kiến thức nghề nghiệp cốt lõi.
- Điều kiện, ngoại lệ hoặc an toàn.
- Kiến thức hỗ trợ để hiểu.
- Nội dung trùng có liên kết tới ý chuẩn.
- Thông tin điều hướng/xuất bản không cần đưa vào bài học.
- Nội dung chưa rõ, mâu thuẫn hoặc bị chặn.
- Nội dung có tài sản cần xử lý quyền sử dụng.

Mọi quyết định loại hoặc gộp phải có lý do cụ thể và truy ngược được.

Không loại cảnh báo, điều kiện hoặc chú thích chỉ vì phần giải thích chính đã có.

### 5. Lập một sổ đối chiếu chuẩn của ngành

Mỗi dòng tối thiểu có:

| Trường | Yêu cầu |
|---|---|
| `knowledgeId` | ID ổn định, duy nhất |
| Nguồn | Tài liệu, phiên bản, trang PDF/trang in, vùng cụ thể |
| Kiến thức cần học | Diễn đạt ngắn gọn, độc lập |
| Điều kiện/ngoại lệ | Ghi rõ hoặc xác nhận không có |
| Mức quan trọng | Cốt lõi, an toàn, hỗ trợ, tham khảo |
| Bằng chứng dạy | ID bài, ID đoạn và câu chữ trong bài app |
| Bằng chứng đánh giá | Câu hỏi/tình huống/đọc hình/thao tác phù hợp |
| Hình | Asset, mục tiêu học, caption, alt và tình trạng quyền |
| Phiên bản | Revision/hash của nội dung đang liên kết |
| Trạng thái trước/sau | Giữ riêng, không ghi đè lịch sử |
| Phần còn thiếu | Mô tả cụ thể, không ghi chung “cần rà thêm” |

Sổ bổ sung phải liên kết với sổ chuẩn. Không tạo nhiều bảng tiến độ độc lập khiến số liệu mâu thuẫn.

### 6. Biên soạn nội dung độc lập

Từ hồ sơ kiến thức đã xác minh:

- Viết cách giải thích mới theo năng lực nghề nghiệp.
- Tổ chức bài theo kiến thức nền, thao tác và mục tiêu học của app.
- Tạo ví dụ, nhân vật, bối cảnh và dữ kiện riêng.
- Viết câu hỏi, phương án nhiễu và giải thích mới.
- Giữ đúng thuật ngữ, công thức, điều kiện và cảnh báo.
- Không chuyển nguyên trình tự đoạn, chuỗi ví dụ hoặc câu hỏi của sách thành bài app bằng cách thay từ.

Hình phải được tạo từ yêu cầu kiến thức: bộ phận cần nhận diện, quy trình, quan hệ hoặc sai sót cần hiểu. Không đồ lại hình nguồn rồi coi là hình độc lập.

Ảnh, logo và biểu trưng chính thức phải có tình trạng quyền sử dụng rõ ràng.

### 7. Kiểm tra hai chiều

**Nguồn → app:** mọi ý quan trọng phải có nơi dạy, cách đánh giá phù hợp hoặc trạng thái chưa hoàn tất cụ thể.

**App → nguồn:** mọi khẳng định nghề nghiệp phải có căn cứ và giữ đúng phạm vi áp dụng.

Câu hỏi cũ được tái sử dụng khi chứng minh kiểm đúng năng lực. Không dùng một câu chung để đóng nhiều ý không thực sự được kiểm.

Năng lực thực hành phải có hoạt động quan sát, đọc hình, lựa chọn thao tác hoặc tình huống phù hợp. Câu trắc nghiệm lý thuyết không tự chứng minh đã thành thạo thao tác thật.

### 8. Chốt Nhật, cập nhật các phần phụ thuộc

- Chốt nội dung Nhật theo từng bài hoặc cụm ổn định.
- Cập nhật revision/hash.
- Xác định chính xác bản dịch, furigana, hình, câu hỏi và âm thanh chịu ảnh hưởng.
- Dịch trực tiếp từ bản Nhật đã chốt.
- Không đổi hash để hợp thức hóa bản dịch hoặc câu hỏi chưa được đối chiếu.
- Không dùng fallback hay bản dịch cũ để tính là hoàn thành.

### 9. Khối lượng ngày học và hình minh họa

- Kiểm nội dung thực sự nằm trong lịch và mở được từ ngày học.
- Mỗi ngày học có ít nhất một hình minh họa trực tiếp mục tiêu quan trọng.
- Không tính nền trang, NPC hoặc icon trang trí thay cho hình kiến thức.
- Mỗi ngày có mục tiêu, giải thích, ví dụ và hoạt động áp dụng phù hợp.
- Đo thời lượng bằng phiên học thực tế; ghi rõ người/nhóm thử, hoạt động và điều kiện đo.
- Không suy thời gian học từ số chữ hoặc trường `estimatedMinutes`.
- Giữ mục tiêu thời gian theo hợp đồng ngành; nơi đã quy định khoảng 30 phút/ngày phải kiểm theo mục tiêu đó.

### 10. Điều kiện đóng việc và báo cáo

Một ý chỉ được đóng khi đủ bằng chứng trong phạm vi yêu cầu. Một trang chỉ được đóng khi mọi vùng nội dung đã được xử lý hoặc loại có lý do.

Chỉ báo tỷ lệ bao phủ khi danh mục ý nguồn đã được lập và rà đầy đủ. Tỷ lệ đó phải ghi rõ là bao phủ nội dung ở mức kiểm tra AI, không thay cho chứng nhận chuyên môn hay bản ngữ.

Báo riêng:

- Nguồn đã kiểm kê.
- Ý nguồn đã phân rã.
- Ý có bằng chứng dạy.
- Ý có đánh giá phù hợp.
- Ý còn thiếu hoặc bị chặn.
- Bản dịch đúng phiên bản.
- Hình đã kiểm nội dung/hiển thị.
- Âm thanh đã kiểm.
- Ngày học đã đo thời lượng.
- Thiết bị thực sự đã dùng.

Lưu các đơn vị hoàn chỉnh theo đợt, xác minh remote và persistence gate. Không đợi một mục bị chặn để trì hoãn mọi phần đã hoàn thành.

---

## III. Yêu cầu ngành Nông nghiệp — 農業

### 1. Phạm vi

Áp dụng cho toàn bộ nguồn và nội dung nông nghiệp đã tích hợp, gồm bài học, thuật ngữ, hình nhận diện, câu tuần và đề luyện tập của các cấp đang có.

Giữ các quyết định biên tập đã chốt đối với 55 mục cũ; chỉ mở lại khi có bằng chứng mới hoặc phát hiện nội dung app không thực hiện đúng quyết định.

### 2. Công việc bắt buộc

- Lập danh mục từng ý nguồn về cây trồng, đất, phân bón, nước, môi trường, thiết bị, sâu bệnh, thu hoạch, chất lượng và an toàn.
- Với quy trình canh tác, ghi đủ mục đích, điều kiện, giai đoạn, dấu hiệu quan sát, thao tác và giới hạn.
- Với thông số kỹ thuật, giữ đơn vị, điều kiện nguồn, đối tượng và phạm vi áp dụng.
- Đưa khoảng **35–55%** vào bài theo chỉ thị đã chốt; không tự tạo mẫu số hoặc công thức tưới từ thông số đó.
- Kiểm các nội dung từng dễ nhầm: tích ôn, khoai lang/khoai tây, 中干し, quản lý nước khi dùng thuốc và bảo quản hoa.
- Rà hình nhận diện theo đặc điểm phân biệt thực tế: cây, bộ phận, thiết bị, triệu chứng và trạng thái dễ nhầm.
- Đối chiếu 427 câu tuần và 800 câu mock với năng lực, đoạn dạy và phiên bản hiện hành; không đọc lại chỉ để tăng số đếm.
- Đo thời lượng từng loại ngày học, ưu tiên ngày quá ngắn hoặc chỉ có đoạn đính chính.

### 3. Biên soạn độc lập

Tạo tình huống quan sát ruộng/vườn, lựa chọn thiết bị, phân tích dấu hiệu hoặc xử lý điều kiện canh tác bằng bối cảnh riêng.

Không sao chép lịch canh tác, bảng ví dụ hay bộ ảnh của nguồn khi chưa có quyền sử dụng phù hợp.

### 4. Điều kiện nghiệm thu

- Mọi ý quan trọng có ánh xạ tới bài và hoạt động phù hợp.
- Không còn câu hỏi trỏ tới phiên bản bài không được xác nhận.
- Hình nhận diện có bằng chứng giúp phân biệt đúng đối tượng.
- Các ngày học thiếu khối lượng hoặc hình đã được xử lý.
- Có hồ sơ thời lượng thực học; không ghi hoàn thành chỉ từ thời gian dự kiến.

---

## IV. Yêu cầu ngành Sản xuất — 工業製品製造業

### 1. Phạm vi

Đối chiếu đủ ba tài liệu, tổng **574 trang**, theo từng chuyên ngành; nghiệm thu riêng mốc 33 trang cũ.

### 2. Công việc bắt buộc

- Lập danh mục từng ý của đoạn văn, bảng, công thức, ký hiệu, bản vẽ và ảnh thiết bị.
- Đối với mốc 33 trang: giữ phân loại 3 bìa, 24 mục lục, 3 cuối sách và 3 trang hướng dẫn điện; xác định riêng kiến thức trong ba trang hướng dẫn.
- Rà sâu các nhóm:
  - Đo lường, độ chính xác, sai số và dụng cụ.
  - Đường nét, kích thước, dung sai và đọc bản vẽ.
  - Vật liệu, tính chất và nhiệt luyện.
  - Gia công, cắt gọt, lắp ráp.
  - Điện, linh kiện, bảo vệ và điều kiện phục hồi.
  - Hàn, kiểm tra và khuyết tật.
  - Hóa học bề mặt, mạ và kiểm soát quá trình.
  - QC, lấy mẫu, thống kê và tính toán.
- Với mỗi công thức, kiểm đại lượng, số mũ, đơn vị, đổi đơn vị, điều kiện và giới hạn sử dụng.
- Với bảng, đối chiếu từng hàng/cột và quan hệ giữa ký hiệu với mục đích sử dụng.
- Với thiết bị, phân biệt nguyên lý, chức năng, nhận diện, thao tác và an toàn.
- Nghiệm thu 15 nhóm nhận diện theo đúng nội dung cần phân biệt.
- Xử lý các khoảng trống đã ghi về reset thủ công, bảo vệ thiết bị, chi tiết ảnh, ký hiệu và ví dụ phản ứng.
- Giữ và kiểm tích hợp các bổ sung đường nét cùng ba mô hình tính đã hoàn thiện.

### 3. Biên soạn độc lập

Tạo bản vẽ và dữ kiện riêng, bài tính đủ điều kiện, tình huống lỗi sản xuất và lựa chọn dụng cụ.

Không biến bài thành bản diễn đạt lại từng đoạn của nguồn. Không đồ lại ảnh thiết bị hoặc bố cục bảng đặc trưng để thay việc tạo hình mới.

### 4. Điều kiện nghiệm thu

- Mỗi trang có danh mục ý và quyết định xử lý đầy đủ.
- Mỗi công thức có kiểm toán số học/đơn vị độc lập.
- Mỗi bảng và hình có bằng chứng đối chiếu cụ thể.
- Mốc 33 trang có kết quả riêng, không đóng bằng nhãn “đã kiểm kê”.
- Câu thực hành kiểm được năng lực sử dụng kiến thức, không chỉ nhớ thuật ngữ.
- Giữ riêng trạng thái bao phủ nguồn, ngữ nghĩa dịch, hình, thiết bị và thời lượng.

---

## V. Yêu cầu ngành Chế biến thực phẩm — 飲食料品製造業

### 1. Phạm vi

Đối chiếu toàn bộ **251 trang**, gồm nội dung 1号/2号 đang dùng, 18 bài bổ sung, 18 mục liên kết và ngân hàng 848 câu.

### 2. Công việc bắt buộc

- Kiểm kê đầy đủ quy trình sản xuất, vệ sinh, mối nguy, kiểm soát, thiết bị, chất lượng, bảng, sơ đồ và chú thích.
- Với mỗi quy trình, ghi rõ đầu vào, bước thực hiện, mục đích, nguy cơ, điều kiện kiểm soát, cách xác nhận và xử lý khi có sai lệch.
- Đối chiếu từng ô của bảng rủi ro và từng nhánh/mũi tên của sơ đồ.
- Với biểu đồ, kiểm trục, đơn vị, chú giải, điểm dữ liệu và giới hạn suy luận.
- Giữ các bổ sung đã làm về Pareto, histogram, độ chia, đường kiểm soát/quy cách và xương cá; kiểm chúng trong quan hệ với bài nền.
- Rà 76 trang từng thiếu bằng chứng tới mức từng ý; hồ sơ đã có không tự thay cho nghiệm thu toàn bộ trang.
- Đối chiếu 848 câu với nội dung dạy và nguồn; kiểm cả đáp án đúng lẫn lý do sai của từng lựa chọn.
- Chuẩn hóa thuật ngữ theo tài liệu dịch chuẩn đã cung cấp; ghi riêng thuật ngữ chưa có chuẩn.
- Kiểm nhất quán thuật ngữ giữa bài, câu, nhãn hình và âm thanh.
- Phân biệt ký hiệu trùng nhưng khác nghĩa theo ngữ cảnh, như CL trong biểu đồ và HACCP.

### 3. Biên soạn độc lập

Tạo tình huống dây chuyền, sai lệch vệ sinh, đọc biểu đồ và phân tích nguyên nhân bằng dữ kiện riêng.

Tự dựng sơ đồ và biểu đồ từ mô hình đã xác minh; không sao chép nguyên dữ liệu minh họa, bố cục hoặc chú thích sáng tạo của nguồn.

### 4. Điều kiện nghiệm thu

- Không còn vùng bảng/hình/chú thích chưa được phân loại.
- Từng ý của 18 bài/18 liên kết có bằng chứng dạy và đánh giá.
- 848 câu có liên kết hiện hành, đủ dữ kiện và không vượt phạm vi đã dạy.
- Thuật ngữ chưa có chuẩn được ghi rõ, không tự nâng thành đã duyệt.
- Hình hiển thị đúng bài, đủ nhãn và đọc được trên màn hình thực tế.
- Có kiểm tra toàn luồng Expo, thiết bị và thời lượng; các phần chưa chạy phải để mở.

---

## VI. Yêu cầu ngành Nhà hàng — 外食業

### 1. Phạm vi

Đối chiếu 7 tài liệu, **271 trang, 639 mục/1.476 ý**, bao gồm vệ sinh, chế biến, phục vụ và vận hành cửa hàng.

### 2. Công việc bắt buộc

- Dùng sổ chuẩn hiện có, kiểm lại tính đầy đủ của danh mục từng ý trước khi tuyên bố đóng toàn nguồn.
- Xử lý **319 ý còn thiếu bằng chứng đánh giá**, theo các nhóm:
  - Vệ sinh 1号: 18.
  - Chế biến 1号: 83.
  - Phục vụ 1号: 48.
  - Vệ sinh 2号: 68.
  - Vận hành 2号: 51.
  - Chế biến–phục vụ 2号: 51.
- Với từng ý, xác định câu cũ có kiểm đúng hay cần câu mới; ghi bằng chứng cụ thể.
- Câu mới phải có năng lực riêng, phương án nhiễu hợp lý và giải thích đủ.
- Nghiệm thu các bảng nhiệt độ, bảo quản, nguy cơ, nguyên liệu, thiết bị, chi phí, năng suất và quản lý.
- Kiểm tình huống phục vụ theo đối tượng khách, hoàn cảnh và mức độ cần hỗ trợ.
- Đối với 2号, bổ sung đánh giá quyết định quản lý, giám sát, phân tích nguyên nhân và cải tiến ở nơi nguồn yêu cầu.

### 3. Xử lý ba khoảng trống đặc biệt

- `うぐいす骨`/`ほほ骨`: xác minh quan hệ tham chiếu và đính chính; không tự coi hai từ là một.
- Năm biểu trưng hỗ trợ: hoàn thiện phương án nhận diện phù hợp quyền sử dụng; ý nghĩa bằng chữ hoặc liên kết không tự thay cho khả năng nhận diện hình ngoại tuyến.
- Sơ cứu: xác định rõ phần lý thuyết, hình, tài liệu chính thức và phần thực hành chưa nghiệm thu; không dùng trắc nghiệm để chứng nhận thành thạo thao tác.

### 4. Biên soạn độc lập

Tạo bối cảnh nhà hàng, khách hàng, ca làm và số liệu vận hành riêng. Viết hội thoại, quyết định và phương án xử lý mới.

Giữ nguyên các dữ liệu cũ đã kiểm; không tái sinh furigana hoặc sắp xếp lại câu cũ ngoài phạm vi cần sửa.

### 5. Điều kiện nghiệm thu

- 319 ý được xử lý bằng bằng chứng hoặc blocker cụ thể.
- Mọi ý không cần câu riêng có lý do được ghi rõ.
- Ba khoảng trống đặc biệt có kết quả riêng.
- Toàn bộ nội dung mới đủ 12 ngôn ngữ đúng phiên bản, furigana theo ngữ cảnh.
- Nghiệm thu âm thanh, luồng học/thi, hình, thời lượng và thiết bị thực tế.

---

## VII. Yêu cầu ngành Khách sạn — 宿泊分野

### 1. Phạm vi

Đối chiếu cả hai tài liệu:

- 1号: 52 trang.
- 2号: 65 trang.
- Tổng: **117 trang**.

Áp dụng cho toàn bộ 38 bài, 323 câu hiện có và mọi phần cần bổ sung.

### 2. Công việc bắt buộc

- Kiểm lại danh mục 380 ý nguồn để xác định đã bao gồm đầy đủ mọi đoạn, danh sách, bảng, hình và chú thích chưa.
- Phân biệt trang điều hướng/trang trí với trang có kiến thức; ghi lý do loại cụ thể.
- Đối chiếu các nhóm lễ tân, đặt phòng, lưu trú, phục vụ, nhà hàng, an toàn, lập kế hoạch và quản lý theo nội dung nguồn.
- Với quy trình, giữ đủ thứ tự, điều kiện, người chịu trách nhiệm, thông tin cần xác nhận và tình huống ngoại lệ.
- Với 2号, xác định năng lực giám sát, phân công, quyết định và xử lý sai lệch cần dạy riêng.
- Không dùng một tình huống tổng quát để đóng nhiều quy trình khác nhau.
- Bổ sung Nhật và câu hỏi ở nơi đối chiếu nguồn chứng minh thiếu.
- Hoàn thiện **307 cặp bài–ngôn ngữ chưa hợp lệ** để đạt 456/456 theo các revision đã chốt.
- Giữ sáu bài đã hoàn thiện đủ 12 ngôn ngữ, chỉ sửa khi có căn cứ nguồn mới.
- Rà toàn bộ furigana, thuật ngữ, hình, caption và alt.

### 3. Biên soạn độc lập

Tạo khách sạn, khách hàng, lịch đặt phòng, yêu cầu và tình huống riêng. Viết hội thoại và quy trình giải thích theo mục tiêu học của app.

Không tái tạo chuỗi tình huống, hội thoại hoặc cấu trúc ví dụ đặc trưng của tài liệu gốc bằng cách thay tên.

### 4. Điều kiện nghiệm thu

- 117 trang có kết quả đối chiếu đầy đủ.
- Danh mục ý nguồn có căn cứ xác nhận phạm vi, không mặc định 380 là mẫu số cuối.
- Mọi ý quan trọng có bằng chứng dạy và đánh giá.
- Đạt 456/456 cặp dịch đúng revision, không tính fallback.
- Hình, furigana, ngữ nghĩa và thời lượng được kiểm trên toàn bộ bài.
- Trình học, tiến độ, bài kiểm tra và hiển thị responsive có hồ sơ thực nghiệm.

---

## VIII. Yêu cầu ngành Xây dựng — 建設

### 1. Phạm vi

Toàn bộ nguồn đang dùng cho 1号, 2号 và 職長, theo ba lĩnh vực:

- ライフライン・設備.
- 建築.
- 土木.

Sử dụng danh mục 17 PDF đã xác minh; quản lý rõ 604 trang danh nghĩa và 530 trang duy nhất sau loại trùng byte.

### 2. Công việc bắt buộc

- Phân loại và xử lý 136 trang chưa có liên kết trực tiếp.
- Chuẩn hóa source ID/alias trước khi kết luận có thiếu nội dung.
- Chuyển chỉ mục vùng trang thành danh mục kiến thức thực tế; không coi vùng chữ/hình là ý đã nghiệm thu.
- Đối chiếu thao tác, dụng cụ, thiết bị, vật liệu, bản vẽ, trình tự, nguy cơ và biện pháp an toàn.
- Với bảng tai nạn/rủi ro, tách nguy cơ, hoàn cảnh tiếp xúc, hậu quả, biện pháp và cách xác nhận.
- Với 職長, rà quản lý công việc, người lao động, phối hợp, nhật báo, hướng dẫn và kiểm tra hiện trường theo nguồn.

### 3. Ma trận năng lực 1号 → 2号

Mỗi năng lực 2号 phải ghi rõ:

- Kiến thức 1号 có thể dùng lại.
- Yêu cầu chiều sâu hoặc trách nhiệm tăng thêm trong nguồn.
- Bài/đoạn đáp ứng phần tăng thêm.
- Tình huống đánh giá khả năng quản lý, giám sát hoặc quyết định.
- Phần chưa đủ và nội dung phải bổ sung.

Không coi tách khóa tiến độ, đổi tên cấp hoặc dùng lại bộ câu là bằng chứng đủ năng lực 2号. Không gọi bộ luyện tập do app tạo là đề chính thức.

### 4. Biên soạn độc lập

Tạo sơ đồ công trường, tình huống phối hợp, bản vẽ và nhật báo riêng. Hình phải thể hiện đúng vị trí, dụng cụ, bảo hộ và nguy cơ cần học.

Không đồ lại hình hiện trường nguồn hoặc tạo hình AI có chi tiết kỹ thuật chưa được kiểm.

### 5. Điều kiện nghiệm thu

- Có ma trận từng ý nguồn cho từng lĩnh vực/cấp.
- Mỗi năng lực 2号 có bằng chứng đáp ứng riêng.
- 136 trang chưa nối được phân loại và xử lý rõ.
- Hình, thuật ngữ, câu thực hành và an toàn được kiểm theo ngữ cảnh.
- Giữ ID, khóa tiến độ và lịch sử lượt thi giữa các cấp.
- Có bằng chứng kiểm trình học, hình và thời lượng thực tế.

---

## IX. Yêu cầu ngành Điều dưỡng — 介護

### 1. Phạm vi

Toàn bộ nguồn và lộ trình 26 tuần, gồm bài học, hội thoại, bản ghi chăm sóc, hình tình huống, thuật ngữ và 687 câu tuần.

Tuân thủ đầy đủ hợp đồng biên soạn Kaigo và hướng dẫn phong cách ngôn ngữ hiện hành.

### 2. Công việc bắt buộc

- Lập danh mục ý nguồn độc lập với danh mục 5.378 đoạn đã viết trong app.
- Đối chiếu nguồn về giao tiếp, quan sát, sinh hoạt, hỗ trợ chăm sóc, ghi chép, báo cáo, an toàn và các nhóm kiến thức khác thực sự có trong nguồn.
- Với mỗi thao tác/tình huống, giữ đủ mục đích, điều kiện, trình tự, quan sát, dấu hiệu cần dừng và cách báo cáo theo nguồn.
- Phân biệt nội dung giáo dục với chỉ dẫn vượt phạm vi tài liệu hoặc năng lực người học.
- Xử lý bộ câu tuần 3–4 có hash Nhật chưa khớp:
  - Đối chiếu nội dung và đáp án với master hiện tại.
  - Sửa nội dung nếu cần.
  - Chỉ cập nhật liên kết phiên bản sau khi xác nhận.
  - Không đổi hash đơn thuần để làm kiểm tra đạt.
- Rà 666 bản ghi tóm tắt; bổ sung bằng chứng cụ thể hoặc giữ trạng thái chưa đủ.
- Kiểm từng ý quan trọng với bài đánh giá tuần, không dừng ở liên kết cùng section.
- Rà hội thoại theo vai người nói/người nghe, cách xưng hô, mức lịch sự và bối cảnh chăm sóc.
- Kiểm bản ghi chăm sóc có đủ thông tin và phân biệt quan sát với suy đoán.
- Nghiệm thu hình tình huống, furigana, thuật ngữ và bản dịch.

### 3. Biên soạn độc lập

Tạo nhân vật, tình huống và hội thoại mới từ nguyên tắc đã xác minh. Không sao chép trường hợp bệnh nhân, hội thoại, ví dụ ghi chép hoặc hình tư thế của nguồn.

Các tình huống mới không được tự thêm chẩn đoán, xử trí hoặc khẳng định an toàn không có căn cứ.

### 4. Điều kiện nghiệm thu

- Tuần 3–4 được xử lý đúng nội dung và phiên bản.
- Danh mục ý nguồn đầy đủ, tách rõ với số đoạn app.
- Mọi ý quan trọng có bài dạy và hình thức đánh giá phù hợp.
- 666 bản ghi tóm tắt có kết quả xử lý cụ thể.
- Hội thoại, bản ghi, hình và ngôn ngữ đạt kiểm tra trong phạm vi được xác nhận.
- Kiểm chức năng 26 tuần không được dùng thay cho nghiệm thu chuyên môn chăm sóc.
- Có hồ sơ thời lượng, hiển thị và thiết bị thực tế.

---

## X. Hồ sơ bàn giao bắt buộc của mỗi ngành

Mỗi ngành phải bàn giao:

1. Danh mục nguồn và phiên bản.
2. Danh mục vùng nội dung từng trang.
3. Sổ đơn vị kiến thức chuẩn.
4. Ma trận nguồn → bài → đánh giá → hình.
5. Danh sách nội dung đã loại/gộp và lý do.
6. Danh sách thiếu, mâu thuẫn và blocker.
7. Nội dung Nhật và lịch sử phiên bản.
8. Bản dịch, furigana, hình và âm thanh chịu ảnh hưởng.
9. Hồ sơ kiểm tính độc lập của biểu đạt và quyền sử dụng tài sản.
10. Kết quả kiểm cấu trúc, ngữ nghĩa, hiển thị, tiến độ, thiết bị và thời lượng, ghi riêng từng mức.
11. Commit đã lưu và kết quả xác minh remote.

Báo cáo cuối phải nêu cụ thể số ý đã đóng, số ý còn mở và bằng chứng của từng loại. Không kết luận hoàn thành toàn ngành từ số trang đã kiểm kê, số bài, số câu, số tệp hoặc một bộ kiểm tra cấu trúc đạt.