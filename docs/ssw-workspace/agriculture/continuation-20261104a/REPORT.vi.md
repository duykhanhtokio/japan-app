# Nông nghiệp — sáu phạm vi ngày 04/11/2026

Baseline `bfd4cdeaa5b4abced2c7de2a847f218f57a435b9`, nhánh recovery/jlpt-n3-n1, đã xác minh WORK PERSISTENCE PASS trước sửa. Sáu luồng tự rà phạm vi riêng; điều phối kiểm tích hợp, không kiểm chéo ngữ nghĩa.

## Kết quả sổ chuẩn

342 ý xử lý: 323 covered_ai mới và 19 partial. Sổ chuẩn hiện **939 covered_ai, 480 candidate, 19 partial, 5 duplicate**; còn **499 ý chưa đóng**. Bốn partial từ baseline đã đóng. Mẫu số nguồn vẫn mở, sourceCoveragePercent=null, fullyCovered=false.

| Phạm vi | Xử lý | covered_ai mới | partial | Hoạt động mới |
|---|---:|---:|---:|---:|
| Lúa/hạt giống | 49 | 43 | 6 | 2 |
| Đất/phân/nước | 65 | 59 | 6 | 2 |
| Nhà kính/môi trường | 54 | 50 | 4 | 2 |
| Rau/kiến thức chung/sâu bệnh/an toàn | 96 | 96 | 0 | 1 |
| Cây ăn quả/hoa | 78 | 75 | 3 | 1 |

Thêm 8 hoạt động thực sự tích hợp, 96 cặp dịch từ Nhật và ruby. Tổng 69 hoạt động/828 cặp dịch. Nội dung mới: đọc hình ba trạng thái nảy mầm; mục đích quản lý ruộng sau thu hoạch; năm nhóm pH cây trồng; tên phân bón; nhân giống dâu tây; môi trường trên/dưới đất; mục đích che phủ nảy mầm; điều kiện và mục đích dùng chất điều hòa sinh trưởng. Dùng lại hình nảy mầm độc lập đã có, giữ giới hạn không dùng làm thước đo.

## Kiểm tra

- PASS_REGISTRY_CONTRACT: 237 trang, 111735 vùng, 939 covered_ai. 164 trang có vùng rà trực quan; chỉ 4 trang semanticInventory complete_ai. Không suy bao phủ kiến thức từ số trang/vùng.
- PASS_CURRENT_DEPENDENCIES: 241 bài/2892 cặp dịch bài; 69 hoạt động/828 cặp dịch; 369 lượt ngày không thiếu liên kết hình trong cấu trúc lịch. Sparse checkout chỉ có byte 8/211 asset; chưa nghiệm thu hình toàn bộ.
- PASS_NARROW_INTEGRATION_INVARIANTS: 621 bản ghi đạt/trùng và 61 hoạt động từ baseline giữ nguyên. Bảy tệp lõi giữ nguyên byte: bài, 427 câu tuần, 800 câu mock, lịch, hỗ trợ ngày học, registry hình, contextual-reading.cjs. Không sửa dữ liệu người học.
- 8 hoạt động mới: **180 ca host tương tác đạt**, 10 phần nguồn hiện hành; dịch tường minh, ruby, bật/tắt đáp án, cách ly bài/cấp. Không phải browser/thiết bị thật.
- Ngày/hình: 9 ca bảo vệ phiên bản/cấp; 18 ca khung/phóng; 3 hình kiểm byte/hash/giải mã và pixel. Hình nảy mầm kiểm riêng 2 lượt ngày/4 image node.
- Global check phát hiện và chủ sở hữu sửa metadata imageEvidence và cấp hoạt động môi trường. Hoạt động này chỉ thuộc cấp 2, lịch agr-2-w53. Kết quả 192 ca trước sửa bị thay thế bởi 180 ca trên dữ liệu cuối; xem owner-repairs.json và daily/README.vi.md.

## Điểm tiếp tục

Dùng duy nhất docs/ssw-workspace/source-coverage-v2/agriculture.json làm sổ chuẩn. assignments.json là phạm vi lượt này; packet/receipt là lịch sử đã tích hợp, không cộng thành tiến độ thứ hai. 19 partial có unresolved cụ thể, 480 candidate tiếp tục từ nguồn và bằng chứng hiện hành.

Các thiếu hụt gồm điều kiện vùng/giai đoạn lúa và thuốc; đặc điểm đất đen, kích thước luống, bốn công dụng máy kéo, nhận diện kết cấu đất, danh mục vi sinh vật và tiêu chuẩn phân/EC; tiểu mục môi trường nhà kính; ba dòng lily, dạng cành anh đào và điều kiện nước đất “やや少なめ”. Không tự đóng bằng câu hỏi chỉ cùng chủ đề. Tiếp tục kiểm kê ý nguồn và đối chiếu hai chiều.

Chưa nghiệm thu toàn bộ ngữ nghĩa 12 ngôn ngữ/hình, chuyên môn/bản ngữ, Expo/iOS/Android/thiết bị thật, hiệu năng phát hành và thời lượng thực học. durationMeasuredDays=0; không suy thời gian từ số chữ/estimatedMinutes. Host/geometry không thay cho xem pixel trên thiết bị.

Chỉ xác nhận lưu sau commit hẹp, push/fetch exact HEAD và WORK PERSISTENCE PASS. Không để tiến trình chạy sau khi kết thúc; không phân phối PDF/ảnh trang nguồn.
