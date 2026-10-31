# Đối chiếu nguồn 2号: nấu ăn và phục vụ

Packet Nhật và bằng chứng đã đóng băng trong `packet.json`, chờ luồng gốc tích hợp, cân bằng vị trí đáp án và phân công dịch. Không sửa ngân hàng, runtime, ledger chung hoặc commit trong luồng này.

| Phạm vi thực kiểm | Kết quả |
|---|---:|
| Trang PDF nấu ăn / phục vụ | 25 / 27 |
| Trang đã đọc văn bản và xem hình thực tế | 52 / 52 |
| Đơn vị nguồn, gồm cả những đơn vị trước đây ghi covered | 92 / 92 |
| Sự kiện/ý nghĩa được tách và đối chiếu | 263 |
| Bổ sung Nhật độc lập, gắn bài học cụ thể | 24 |
| Câu hỏi mới, mỗi câu bốn lựa chọn và bốn giải thích riêng | 36 |
| Hình SVG kiểm soát được và PNG thực | 11 cặp, 1.704.757 byte PNG |
| Đơn vị có bằng chứng câu hỏi liên quan | 92 / 92 |

Quyết định chi tiết: 45 đơn vị có bằng chứng hiện hữu, 37 đơn vị có bổ sung đã soạn, 10 đơn vị tổng hợp chỉ nối tới các đơn vị con và các fact tường minh. Không tự nâng trạng thái cha do trùng trang hay chủ đề. Trong 263 fact có hai giá trị dẫn nhập được loại khỏi học thuộc/ra đề với lý do rõ: số thực phẩm trong bảng năm 2020 và khái số loại rau lưu thông. Mỗi fact còn lại có đoạn hiện hữu hoặc bổ sung cụ thể. Có 51 fact chưa được hỏi riêng từng ý; `assessmentEvidence` của từng đơn vị ghi rõ giới hạn. Câu hỏi đại diện không được coi là đã kiểm tra mọi ô bảng hoặc mọi thuật ngữ.

## Đã đọc và đối chiếu như thế nào

Đã đọc văn bản của toàn bộ trang, dùng bản trích khóa SHA256 và lớp chữ thân bài của PDF để tách furigana khỏi nội dung. Đã render và xem từng trang, kể cả bìa, mục lục, trang ít chữ, bảng biểu và cuối tài liệu. Các bảng ảnh ở trang PDF 16, 18, 19, 21 của tài liệu phục vụ được xem lại ở kích thước lớn. Nhật ký riêng từng trang tại `page-notes.json` và trường `pages` của packet. PDF, bản trích và ảnh render nguồn ở ngoài Git.

Đã đọc toàn bộ đoạn của 12 bài nấu ăn và 10 bài phục vụ cấp 2, hai nhóm glossary cấp 2, dữ liệu và code guide liên quan, 221 stem và đáp án đúng của câu hỏi thuộc hai chủ đề. Chỉ gắn ID câu hỏi khi nội dung hỏi đúng năng lực; đây không phải lần nghiệm thu lại độc lập toàn bộ 884 phương án nhiễu/đúng của ngân hàng hiện hữu.

Nhiều khoảng trống trong ledger cũ thực tế đã được xử lý: nguồn gốc bốn giống bò, các ví dụ rau truyền thống, giải thích và diễn tập khiếu nại, xin lỗi lần nữa lúc khách ra về. Luồng này dùng lại đoạn và guide chính xác, không viết lại một flow tương đương. Nhánh tham chiếu khẩn cấp dùng packet `operations2` đã đóng băng cùng bài `rst-2-ops-10`, `rst-2-ops-16`; liên kết crossShardFactIds, crossShardAdditionIds và crossShardQuestionIds được ghi rõ.

## Các bổ sung có nội dung thực

Đã bổ sung: thay đổi của thịt và dấu hiệu chất lượng theo loài; cá tươi, phân ba/năm phần, hướng bày cá; hướng và vị trí sơ chế cá; vệ sinh món không gia nhiệt và nhãn sản phẩm đông lạnh; điểm kiểm riêng từng thiết bị; tám dao và vật liệu nồi/dụng cụ; thống kê tai nạn có năm; các cảnh nguy hiểm và bảo vệ bốn nhóm máy; bảng kiểm theo giai đoạn ngày làm việc; động tác cây lau/squeegee; toàn bộ nhóm đối tượng của bảng vệ sinh; vật chứa gia vị và dụng cụ nhà vệ sinh; các số minh họa của bảng với điều kiện áp dụng; thông tin báo cáo khiếu nại; phân công khi khách bị bệnh; chi tiết từ vựng bếp và phục vụ.

Mỗi câu mới tự đủ dữ kiện bằng chữ. Không có câu dùng hình đã ghi chú đáp án làm hình quiz. Không đặt bài tính toán thiếu dữ kiện. Bộ khóa ban đầu chia đều 9/9/9/9 nhưng luồng gốc phải xáo toàn cục để bỏ chuỗi vị trí có quy luật trước khi dịch.

## Hình và sửa lỗi trong lúc tự kiểm

11 hình mới là artwork SVG độc lập, render bằng Inkscape 1.4, gắn fact/bài/nguồn và SHA256. Đã xem PNG thực. Nội dung gồm vị trí sơ chế cá, ba/năm phần cá, biểu đồ tai nạn năm 2022, mười hai cảnh nguy hiểm, bảo vệ máy, lau sàn/cửa kính, nhóm vị trí vệ sinh, quy trình vật chứa/nhà vệ sinh, tám dao, phân công 119/AED và mạng lưới lưu thông thực phẩm có hình cơ sở/đối tượng.

Tự kiểm phát hiện và sửa: đường chuyển động cây lau chưa rõ số tám; một cảnh bộ lọc cà phê ban đầu dùng hình nồi chung; hướng đầu dao so với cán; vị trí vạch cắt đầu cá; vật chứa úp ráo nước; chữ ở cảnh bộ lọc và đường nối đè nhãn của sơ đồ lưu thông. Không dùng hình hộp chữ thay cho thiết bị hay quy trình. Hình nêu nguyên lý/vị trí tương đối; không chứng nhận hình thái chính xác mọi giống cá, sản phẩm dao hay kết cấu máy. Cần chuyên gia xem thực vật/thiết bị và hướng dẫn thao tác tại chỗ; hình không thay thế đào tạo dao hoặc cứu sinh.

## Nguồn cũ, thông tin hiện hành và an toàn

`sourceErrata` ghi bảy vấn đề có thể gây hiểu sai: tươi thì ăn sống; mọi rau đông lạnh không thể dùng sau rã đông; gọi AV và đọc ngưỡng dầu; miễn trừ pháp luật chung cho nhà hàng; tám chất dị ứng là danh sách hiện nay; nếm món nghi nhiễm bẩn; chờ ý kiến người đi cùng trước yêu cầu cứu hộ khẩn cấp.

Đã kiểm nguồn sơ cấp CAA, MHLW, FDMA, MAFF, lưu URL/thời điểm/phạm vi vào `externalVerifications`. Ngày 1/4/2026 CAA thêm hạt điều vào 特定原材料; danh sách tám trong PDF 2023 được dạy đúng niên đại, tách khỏi chín hiện hành và thời kỳ chuyển tiếp. MHLW được dùng để kiểm tra nhóm máy và biện pháp bảo vệ; FDMA cho thông báo 119/AED và phản ứng/hô hấp bất thường; MAFF cho chỉ dẫn rã đông theo sản phẩm. Không tuyên bố đã có chứng nhận pháp lý hoặc y khoa toàn ngành.

## Giới hạn còn mở

- Nhật và bằng chứng đã sẵn sàng, chưa tự tuyên bố đã tích hợp vào màn hình học.
- Chưa dịch 24 bổ sung/36 câu/hình mới; root phân luồng sau khi khóa Nhật.
- Chưa kiểm browser, thiết bị thật, mọi ngôn ngữ hoặc người bản ngữ trong đợt nguồn này.
- Chưa có chuyên gia thao tác cá, dao, máy hoặc cứu sinh ký nghiệm thu.
- Không coi 92 đơn vị có câu hỏi đại diện là chứng nhận 100% mọi ý nhỏ đã được kiểm tra riêng.

Tái tạo packet từ quyết định đã tác giả viết: `python docs/ssw-workspace/restaurant/source-closure31/cooking-service2/build-packet.py`. Script kiểm ID/khóa/nguồn/trang/asset thật và tính đầy đủ; không quyết định coverage theo từ khóa hay số trang. `validation.json` là kết quả kiểm cấu trúc và ràng buộc, không thay thế rà soát nghĩa đã ghi ở từng fact.
