## Mốc cập nhật sau nhập remote126c53d7

Đã hợp nhất15tệp sản xuất từremote126c53d7 và giữ toàn bộ source61/source62, ID câu/đề và dữ liệu người học của cả hai nhánh. Sổ hiện hành148ý:127covered_ai,19partial,1candidate,1excluded. Không tăng mẫu số ý nguồn.

Hậu kiểm tự phát hiện hai nghiệm thu trước quá rộng: câu gọi tênhatching chưa kiểm rõ điều kiện nétliền; câu nhận biếtkếttủa đã cho sẵn Ag⁺/Cl⁻/AgCl nên chưa kiểm phảnứng. Đã bổ sung đúnghai câu riêng với24cặpdịch vàfurigana, kiểmđúng nétmảnh–liền–đều và quan hệAg⁺+Cl⁻→AgCl; sau đó mới đónghaiý. Giữ cả hai biến thể câu antoàn/manualreset của hai nhánh, không tính là nănglực nguồn mới.

Source62 hiện4câu/48cặp dịch; source61 nhập từxa có3câu/36cặp dịch. Tổng7ID câu riêng vẫnđược giữ. Bằngchứngkiểmtrahiện hành: manufacturing-merge126-review.json, manufacturing-source62-{hatch,agcl}-review.json và cácvalidatorđã cập nhật. Các số122covered/2câumới trong phần dưới là ảnhchụp giaiđoạn trước hợp nhất, không phải tổng hiện hành.

---

# Sản xuất source61–62: ba nhóm đối chiếu hai chiều hiện hành

Baseline `f72e3e6cc36c1b407aace4b0e47a23a63ca7cdaa`. Đã đọc lại nguồn riêng bằng chữ và ảnh: cơ khí89/in81, điện165/in156, bề mặt103/in93; đối chiếu ruby của “細線=さいせん” ở cơ khí88. Điện198trang được lấy lại từ đúng tài liệu và xác minh hash `b846a05a…`; không đưa PDF, chữ trích xuất hay ảnh trang vào app/Git.

## Ba nhóm làm và kiểm tuần tự

1. **Nét bản vẽ:** khép hai ý hình dạng và vai trò hatching bằng câu hiện có `mfg1-mechanical-completion37-q0504`. Câu hỏi thực sự yêu cầu nét mảnh xếp đều và mặt cắt vật liệu; không lấy câu cùng chủ đề để đóng mọi loại nét. Bổ sung furigana hiển thị cho câu và toàn đoạn source47 đang mở trong bài080. Sửa câu dịch Indonesia bỏ thiếu điều kiện “mảnh”. Giữ nguyên câu Nhật, đáp án, hash và tiến độ cũ.
2. **Điện:** khép tổ hợp contactor–rơ le nhiệt bằng câu hiện có `mfg1-electrical-weekly-14-q03`; bổ sung đúng một câu độc lập kiểm điều kiện an toàn trước, đặt lại tín hiệu bằng tay. Không biến thành lệnh phục hồi máy thật. Sửa sáu cặp dịch câu quá rút gọn, trong đó tiếng Việt bỏ thiếu vai trò ngắt tải. Tạo một hình chức năng độc lập phân biệt đóng/ngắt tải và phát hiện quá tải, nối vào chính bài094 với caption12ngôn ngữ đúng phiên bản. Hình không phải ảnh sản phẩm hoặc sơ đồ đấu dây, vì vậy không đóng mục nhận diện ảnh thiết bị.
3. **Dung dịch–kết tủa:** khép ba ý hiện tượng kết tủa, AgCl và quan hệ Ba²⁺/SO₄²⁻ bằng hai câu thật đang có. Bổ sung một đoạn Nhật và một câu so sánh mới: hai ví dụ AgCl/BaSO₄ đều trắng, nên màu trắng không đủ định danh. Dịch mới đủ12ngôn ngữ, bổ sung furigana toàn đoạn hiệu lực chứ không chỉ câu thêm. Khép hai ý màu trắng bằng vùng nguồn cụ thể. Sửa bản Anh/Việt bỏ thiếu màu trắng ở câu cũ, viết tự nhiên lại bản Tagalog, thống nhất “sunfat” trong câu Việt đã chọn. Không tự hướng dẫn thêm hóa chất vào bể thực tế.

**Kết quả:** khép9ý đã có trong sổ, không tăng mẫu số; `covered_ai`113→122 trên148ý. Còn24partial,1candidate và1excluded. Thêm2câu,24cặp câu–ngôn ngữ,12cặp đoạn–ngôn ngữ và1hình chức năng. Tái dùng4câu cũ, bổ sung đọc cho36trường stem/option/reason của chúng. Sửa11cặp câu–ngôn ngữ cũ trong9tệp; không tái sinh các ngân hàng.

## Ngữ nghĩa, phiên bản và tích hợp

Đã tự đọc ba ngữ cảnh đoạn dạy và bốn câu tái dùng trong12ngôn ngữ, giữ các điều kiện và thuật ngữ của đúng mục tiêu. Đã đọc hai câu mới cùng tất cả phương án/lý do và bản dịch. PASS API hiện hành:48binding bản dịch câu cũ,36binding ngữ cảnh đoạn cũ,24binding câu mới và26luồng đoạn gồm Nhật. Source49 dùng hash JSON-value cho Nhật; đoạn mới dùng hash UTF8, hai chế độ được kiểm riêng. Không đổi hash cũ để hợp thức bản dịch.

Furigana là lớp hiển thị có đối chiếu toàn câu/đoạn và sourceHash; không đổi câu chấm điểm, đáp án hay khóa lưu. Mọi từ Nhật mới được kiểm đọc, cả bốn câu tái dùng có đọc đầy đủ, đoạn080 và đoạn013 hiệu lực có đọc đầy đủ. Đây là tự kiểm AI, chưa chứng nhận phát âm bản ngữ và chưa có bằng chứng đọc hết mọi đoạn cũ của toàn ngành.

Giữ nguyên139unit ngoài chín ý được sửa; toàn bộ nội dung source59/60 được bảo toàn. Giữ33.538fingerprint/tọa độ/thông tin trích xuất bề mặt; chỉ đổi phân loại tám region tại103. Bốn tham chiếu mới cho màu AgCl được thêm; bốn vùng BaSO₄ đã có ánh xạ được xác nhận lại. Không bỏ các tham chiếu cũ. Đã giữ toàn bộ câu Nhật/đáp án/hash/bài nền cũ và mọi entry dịch câu ngoài11entry được nêu.

## Ngày học, hình và âm thanh

Đã theo lịch thực262ngày để lấy đúng ba ngày chịu ảnh hưởng và so trung vị cùng chuyên ngành:

| Ngày | Chữ Nhật thân bài + phần bổ sung nối thật | Trung vị chuyên ngành | Ảnh trọng tâm |
|---|---:|---:|---|
| Cơ khí tuần12/ngày3, bài080 |810|572|Sơ đồ nét và mặt cắt hiện có; đã tự xem PNG và đối chiếu nội dung.|
| Điện tuần14/ngày3, bài094 |974|541,5|Ảnh logic cũ chỉ phục vụ điều kiện tự giữ; bổ sung hình mới cho contactor/quá tải.|
| Bề mặt tuần2/ngày6, bài013 |1041|886|Mô hình trạng thái hòa tan/kết tủa hiện có; không coi màu hạt mô hình là màu hóa chất thật.|

Ba ngày không bị cờ dưới nửa trung vị; số chữ không phải số phút học hoặc nghiệm thu đầy đủ kiến thức. Không sắp lại lịch, đổi ID ngày hoặc đặt lại hoàn thành. Đã xác minh byte PNG/hash và đường tích hợp; chưa coi việc tự xem PNG là kiểm app trên thiết bị.

Không tìm thấy bản ghi âm được theo dõi trong `assets/manufacturing` hoặc import phát âm/âm thanh trong các component sản xuất hiện hành. Chưa có căn cứ nghiệm thu audio đúng revision, giọng hoặc phát âm. Không tạo hoặc tự tính audio là hoàn thiện từ bản dịch/furigana.

## Kiểm tra thực thi và phạm vi còn mở

- `check-source61-62.cjs`: PASS,245guard sai locale/nội dung/hash/revision, chấm/lưu/mởlại,48binding câu cũ được kiểm ở audit riêng, caption12ngôn ngữ và hash hình.
- `check-source61-62-preservation.cjs`: PASS,9ý sửa/139ý giữ, mọi câu Nhật và entry dịch ngoài phạm vi không đổi.
- `audit-source61-62.cjs`: PASS cho lịch/ngữ cảnh/ảnh/kiểm kê audio nêu trên.
- `typecheck-source61-62.cjs`: strict0diagnostic; cú pháp hai componentTSX PASS. Đây không phải whole-app typecheck.
- Canonicalcontract vàpayloadhygiene84.006region PASS. Toàn nguồn vẫn mở:83trang đã đọc ảnh,35trang inventory hoàn chỉnh, chỉ5trang kiến thức đã phủ đầy đủ ở mứcAI. Không đóng thêm trang trong đợt này.

Còn thiếu:24ý partial (nhiều loại nét, tên gọi/mục đích điện, chuyển động lưỡng kim, các thuật ngữ dung dịch/phân tích và phạm vi quy trình),1candidate nhận diện ảnh điện; đối chiếu ngữ nghĩa toàn574trang và mọi ngôn ngữ cũ; quyền/ảnh nhận diện thật, âm thanh, kiểm toàn luồng và hiệu năng Expo/iOS/Android, nghiệm thu chuyên môn/bản ngữ và đo thời lượng thực học. Không coi sơ đồ khái niệm mới là ảnh nhận diện thiết bị thật. Các chỉ số covered_ai không phải tỷ lệ nguồn vì mẫu số ý nguồn chưa đóng.

ROOT kiểm tích hợp/phát hành và tự lưu từ xa. Tệp và PASS local chưa tự chứng minh persistence.
