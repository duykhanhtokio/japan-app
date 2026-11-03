# Nông nghiệp — lượt dài sáu phạm vi từ mốc 449 ý

Baseline đã xác minh remote: 77af4f21247007bef3bcfa502af34893821a187a, nhánh recovery/jlpt-n3-n1. Sáu luồng làm phạm vi độc lập, tự rà nội dung; điều phối kiểm tích hợp, không kiểm chéo ngữ nghĩa. Mỗi luồng nguồn thực hiện nhiều nhóm liên tiếp và tiếp tục sửa thiếu hụt thực tế sau lô đầu.

## Kết quả tích hợp

171 ý được xử lý: 167 covered_ai mới và 4 partial có lý do cụ thể. Sổ chuẩn hiện 616 covered_ai, 5 duplicate, 818 candidate và 4 partial; còn 822 ý chưa đóng. Mẫu số ý nguồn vẫn mở, sourceCoveragePercent=null; đây không phải nghiệm thu bao phủ toàn bộ nguồn.

| Phạm vi | Ý xử lý | covered_ai mới | partial |
|---|---:|---:|---:|
| Lúa/hạt giống | 29 | 26 | 3 |
| Đất/phân bón | 39 | 39 | 0 |
| Nhà kính/môi trường | 24 | 24 | 0 |
| Rau/cây đồng ruộng | 43 | 43 | 0 |
| Cây ăn quả/hoa/vật tư | 36 | 35 | 1 |

Thêm 14 hoạt động thực sự tích hợp vào trình học, 168 cặp ngôn ngữ và ruby; tổng hiện 61 hoạt động/732 cặp dịch hoạt động. Các hoạt động bổ sung kiểm mục đích ươm cây, phối hợp trồng cây thức ăn, hai điều kiện phân bón hỗn hợp, đủ mười quan hệ trong bảng đất, nhận diện/đặc điểm cây, quản lý vườn và vận chuyển. Giữ 241 ID bài, 427 câu tuần và 800 câu mock.

## Sửa sai nội dung thực tế

Nguồn và hình gốc được tự đối chiếu: đặc điểm lá mầm cây giống già là nhỏ, không phải cứng. Sửa đoạn Nhật, câu tuần, toàn bộ 12 bản dịch chịu ảnh hưởng, hoạt động/ruby và hình có nhãn sai. Hình được vẽ lại độc lập bằng generator kiểm soát được, giữ asset ID/path; không tô sửa ảnh PDF. Cập nhật 28 liên kết hash và 5 revision đề có phụ thuộc sau khi kiểm phạm vi. Không tạo compatibility cho hash cũ của nội dung đã đổi nghĩa.

Không ghi vào dữ liệu người học. ID bài/câu/đề giữ nguyên. Bài đã sửa và năm đề đổi revision phải dùng phiên bản mới theo guard hiện hành; không tuyên bố lượt làm cũ tương thích với nội dung đã sửa. 454 bản ghi covered/duplicate từ baseline giữ nguyên từng giá trị.

Điều phối sửa lỗi enum expressionReview của 29 dòng lúa theo tự rà đã thực hiện; xem rice/expression-status-repair.json. Một hoạt động rau được đồng bộ lại bản sửa ruby/dịch cuối của chủ sở hữu, giữ nguyên Nhật và nguồn; hai hash bằng chứng toàn bản ghi được nối lại với đúng phiên bản đã kiểm, xem vegetable-final-sync.json.

## Bằng chứng kiểm tra

- Sổ chuẩn PASS_REGISTRY_CONTRACT: 237 trang, 111735 vùng, 616 covered_ai; fullyCovered=false. PASS cấu trúc không thay cho nghiệm thu toàn nguồn.
- Phụ thuộc hiện hành PASS: 241 bài/2892 cặp dịch bài, 61 hoạt động/732 cặp dịch; không có lỗi phiên bản/liên kết trong phạm vi bộ kiểm.
- Hồi quy hẹp PASS: ID bài/câu/đề và 454 bản ghi đạt trước giữ nguyên; hash bài và revision ngân hàng hiện hành đúng; mock validator PASS 800 câu.
- Vệ sinh hai artifact vùng nguồn PASS: không có payload văn bản/ảnh PDF thô. Không suy chứng nhận pháp lý toàn bộ tài sản từ bộ kiểm này.
- Host component ngày học: 369 lượt ngày/633 lượt hình, 24 ca tính khung/phóng hình; registry 230 liên kết/211 asset. Đây là host fixture, không phải xem bố cục pixel trên thiết bị.
- Sau tích hợp: 14 hoạt động/336 ca tương tác đạt; đoạn ruby đã sửa/10 ca đạt; kiểm lại riêng hai lượt ngày nhà kính/tám lượt hình đạt. Xem daily/README.vi.md và JSON tương ứng.
- Các ảnh được chọn có tự kiểm byte/hash/giải mã/pixel với giới hạn rõ trong receipt. Không coi metadata đủ cho nghiệm thu nội dung tất cả ảnh.

## Còn phải làm

Ba partial lúa: ba trạng thái nảy mầm; toàn bộ công đoạn sau thu hoạch; mục đích quản lý đồng ruộng sau thu hoạch. Một partial cây ăn quả: mục đích và điều kiện dùng chất điều hòa sinh trưởng cần nội dung dạy/đánh giá cụ thể. Tiếp tục các candidate khác từ sổ chuẩn, giữ những bằng chứng đã đạt.

Chưa hoàn tất danh mục ý nguồn và đối chiếu hai chiều toàn bộ, ngữ nghĩa toàn bộ 12 ngôn ngữ, toàn bộ hình, nghiệm thu chuyên môn/bản ngữ, browser/Expo/iOS/Android/thiết bị thật và thời lượng học đo thực tế. Không thử lại lỗi Chromium đã biết mà không thay đổi điều kiện. Không đưa âm thanh thành điều kiện nghiệm thu bổ sung của Tokutei.

Mọi luồng đã ngừng ghi và không còn tiến trình do phiên để chạy ngầm. Chỉ xác nhận lưu sau push/fetch exact HEAD và WORK PERSISTENCE PASS; không coi các receipt cục bộ là lưu bền vững.
