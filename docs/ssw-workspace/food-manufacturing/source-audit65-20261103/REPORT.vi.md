# Thực phẩm — đối chiếu hai chiều ba cụm, 2026-11-03

Mốc trước lượt này: `f72e3e6cc`. Đã đọc lại chữ và ảnh các trang nguồn liên quan; giữ nguyên848câu thi,96bài/lịch, ID và trạng thái người học, hai ID của source62 và histogram64.

## Kết quả ba cụm

| Cụm | Nguồn → app | App → nguồn và sửa thực tế |
|---|---|---|
| Radar | Trang85 dạy so sánh nhiều đặc tính theo từng trục. Tách một ý chuẩn có câu35 hiện hữu và hình radar gốc0–5 đã tự xem; đối chiếu đúngI/IV:A cao,II/V:B cao,III:bằng3. | Nguồn không đặt quy tắc xếp hạng tổng hợp bằng diện tích. Câu hỏi/đáp án35 hiện vẫn có cảnh báo này, nên giữ nó là phần mở rộng app chưa có căn cứ bổ sung, không giả đóng ý013. Đã rà đúng ngữ nghĩa12bản dịch hiện có, không tạo câu trùng. |
| Phân bố, thời gian và nguyên nhân | Trang88 nêu hai khả năng khác nhau cho dạng đảo tách rời. Trang90 yêu cầu đọc diễn biến theo thời gian và tiêu chí kiểm soát tại nơi làm việc. Kết hợp kiến thức tâm/độ phân tán đã có ở64. | Thêm source65: một đoạn và hai câu tự kiểm,12ngôn ngữ, ruby. Tình huống A1/2/3/4/5g và B1/4/2/5/3g có cùng tần số lớp nhưng khác thứ tự; giải thích vì sao hình phân bố không bảo đảm ổn định. Câu riêng buộc nêu hai khả năng của dạng đảo và điều tra trước kết luận. Không gán chuỗi ví dụ thành quy tắc bất thường cho mọi nhà máy. Ý027/028 có căn cứ mới và đánh giá trực tiếp, được đóng hẹp ở mứcAI. |
| Xương cá và kiểm tra thiết bị | Trang91 dạy đầu mũi tên/kết quả và các nhánh yếu tố; trang125 dạy xác nhận kiểm tra đã thực hiện, bản ghi và ngày thực tế. | Sửa source48: thay mệnh đề rộng về “chứng minh nguyên nhân bằng hiện vật và bản ghi” bằng ví dụ kiểm tra thiết bị có phạm vi nguồn rõ. Bổ sung câu hỏi vị trí kết quả ở đầu mũi tên — câu cũ chưa hỏi trực tiếp năng lực007. Cập nhật12ngôn ngữ/ruby/hash, caption/alt và hình gốc: footer chỉ còn yêu cầu tách công đoạn dù cùng tên. |

Source65 có1đoạn/2câu; source48 sửa1đoạn/1câu cùng ID. Tổng **2đoạn mới hoặc sửa,3câu mới hoặc sửa,6ý đáp án,60cặp đoạn/câu–ngôn ngữ đúnghash**,16trường ruby. Đã tự kiểm thuật ngữ, các điều kiện không bảo đảm/kết luận duy nhất, ngày dự kiến so với ngày thực hiện, thứ tự số liệu và phép so sánh. Bản dịch/ruby chưa có duyệt bản ngữ hoặc âm thanh.

## Bốn compound cũ được xử lý thế nào

| ID | Trạng thái sau đối chiếu |
|---|---|
| `food-v2-legacy-qc1-013` | Vẫnpartial: so sánh từng trục được tách và có bằng chứng; cảnh báo diện tích là **nội dung app đang hiện**, còn cần căn cứ độc lập. Không gán nó thành yêu cầu nguyên văn của trang85. |
| `food-v2-legacy-qc1-027` | covered_ai: có tâm/độ phân tán ở64 và căn cứ nguyên nhân không duy nhất từ trang88, kèm câu65 riêng. |
| `food-v2-legacy-qc1-028` | covered_ai: trang90 bổ sung căn cứ về thông tin thời gian; phản ví dụ cùng tần số/khác thứ tự được kiểm bằng dữ liệu độc lập. |
| `food-v2-legacy-qc2-009` | **excluded/reference cho yêu cầu nguồn tổng hợp lịch sử**, không phảicovered_ai. Nguồn91 không đặt quy tắc chung phải chứng minh mọi giả thuyết bằng cả hiện vật và bản ghi. Câu mạnh và footer đã được sửa; các ý nguồn thật vẫn giữ ở007/008 và ý kiểm tra thiết bị mới. App nền còn lời khuyên “現物と記録で確認します”; hồ sơ giữ riêng lời khuyên đang hiện này dưới `currentAppGuidance`, trạng thái cần căn cứ bổ sung, không tính thành yêu cầu kiến thức PDF và không giả chứng nhận. |

Không xóa ID hoặc trạng tháibefore. Hồ sơ giữ nguyên bằng chứng trước, câu mạnh cũ, câu hiện tại, lý do phân loại và các ý con. Bằng chứng source48 của compound009 được hạ thànhcandidate vì bản sửa chỉ dạy ví dụ giới hạn; không giữ nhãn direct cho mệnh đề chung đã bỏ.

Sổ chuẩn hiện có **120ý:118covered_ai,1partial,1excluded/reference**. Có119ý với bằng chứng dạy/đánh giádirect.24trang có hồ sơ nhìn ảnh;7trang inventory hoàn chỉnh vẫn giữ nguyên. Mẫu số251trang vẫn mở, `sourceCoveragePercent=null`, chưa hoàn tất toàn nguồn.

## Kiểm tra và giới hạn

- PASS canonical và liên kết nguồn/vùng/ý/app; không có hash stale. Hash ảnh cũ chỉ còn trong hồ sơ trước/sau của lượt này.
- PASS component thật qua SSR cho48/65:52lượt,4trường hợp sai bài/hash bị từ chối, đáp án ẩn trước khi mở. Hồi quy46–48:78lượt và6trường hợp từ chối. SSR dùng adapter được ghi rõ; không thay cho ảnh chụp trình duyệt hoặc thiết bị thật.
- PASS bảo toàn byte12tệp nền:848câu,96bài, lịch, tiến độ, source62/64, câu radar35, histogram64 và hình quản lý47. Các ýcovered_ai cũ không bị mở lại; mọi trạng tháibefore giữ nguyên.
- Đã tự xem radar và hình xương cá; hình xương cá sửa bằng bộ dựng gốc, không đồ lại nguồn. Metadata ảnh/caption/alt/hash và các tham chiếu hiện hành đã cập nhật sau rà nội dung. Metadata trước sửa vẫn lưu trong hồ sơ.
- Rà đúng hai bài/ngày `food-2-021` và `food-2-043`: giữ lịch và revision hoàn thành; ghi riêng lượng chữ bổ sung trước/sau, hình gắn ngày và phạm vi. Chưa đo thời gian thực học; không suy phút từ số chữ hoặc nhãn dự kiến.
- **Âm thanh chưa nghiệm thu:** Reader thực phẩm và các pack đang sửa không có control phát/binding bản ghi. Kiểm hash chữ/ruby không chứng minh có ghi âm đúng revision; hồ sơ để rõ thiếu phần này.

Các kiểm tra ở mứcAI. Không tuyên bố chuyên môn, bản ngữ, thiết bị thật hay thời lượng thực học. Lưu từ xa còn do điều phối thực hiện và xác minh.
