# Sản xuất source58 — ba nhóm nhận diện quá trình

Đã xác minh PDF bề mặt207trang theo hash chuẩn, đọc chữ và toànảnh7trang125/126/135/139/141/157/170. Tự xem4PNGapp: năm ký hiệu điện, quan hệ dòng/từ/lực, cây phân loại và hai tuyến mạ. Đối chiếu12câu hiện có và48lýdo lựa chọn; nội dung phù hợp các mục tiêu hẹp nên tái sử dụng, không tạo24câu trùng chỉ để đạt chỉ tiêu.

Ba nhóm thực hiện tuần tự và kiểm sổ sau mỗi nhóm:

1. **Ký hiệu điện và hướng:** năm dạng ký hiệu, cực tính pin, quy tắc vít phải với dòng hướng ra trước giấy và lực theo taytrái vớiBphải/Idòng ra trước. Tính riêng hướng lựcI×B: ra trước × phải = lên. Không dùng tayphải phátđiện để trả lời lực của độngcơ. Khép4ý ở mứcAI.
2. **Phân loại xử lý:** màngoxit của anốt hóa, hai nhánh mạướt, mànghợpchất/lớpnền sơn của hóathành và màngnhựa của sơn với vídụgỗ. Đọc cả bảng nguồn141nhưng chỉ chốt bốn facet được dạy và kiểm thật; không chốt toàn bảng, mọi cơchất, mọi chức năng hay khoảng độdày. Khép4ý ở mứcAI.
3. **Tuyến mạ:** nhận diện hai tuyến điện/nhúngnóng, khung tùychọn lớp nền/hậu xửlý, vịtrí sấy trước bể nóng và phân biệt rửa cuốn dịch với sấy loại nước. Không suy từ sơđồ ra nồngđộ/nhiệtđộ/thờigian/dòng/giấyphép thao tác hay côngthức chung cho mọi sảnphẩm. Khép4ý ở mứcAI.

Giữ nguyên124ý sổ cũ, toàn bộcore/61câu nhậndiện/cácbản dịch/ID/revision/tiếnđộ cũ.12ý mới có vùng nguồn chính xác, liên kết hai chiều, caption hiện hành, câu hỏi thật vàhashPNG. Các figure chứa nhiều mục vẫn chỉ được đánh giá đúngfacet trongsourceLocator, không đóng toànfigure. Cácspan nhỏ/ruby và vùng khôngthuộc phạmvi vẫn giữ nguyên extractionfingerprint/tọađộ/phânloại chưaxửlý.

Sổ136ý:101covered_ai,133dạy trực tiếp/50đánhgiá trực tiếp.71trang đã đọcảnh; inventoryđầyđủ vẫn34=4instructionalcovered+30excluded. Không đóng thêm trang; mẫu số nguồn mở, phầntrămnull,whole574=false. Còn3nhóm finishing chưa tự ràv2:diệntích/cáchbốtrí, dấuhiệu lỗi bề mặt và giaiđoạn/biếnđổi khi đánhbóng; ngay cả12nhóm đã rà cũng chưa đồng nghĩa đủmọifacet.

Kiểm thực thiNode24 với nativeTSstrip trên cácAPIhiện hành, không cài/thay dependency trong app:144cặp câu/36cặp caption được nạp đúngbinding;123guard dữliệu lỗi/locale/revision; chấm/lưu/mởlại và từchối attemptkhác revisionPASS.4assetđúnghashbyte. So vớibaselinec25e4e2, giữ124unitcũ và33.538elementtríchxuất khôngđổi dữliệunền; khôngsửanộidungapp. Đây là kiểmAPI/dữliệu/state, chưa chạyReact/browser/native/thiếtbịthật. Không chứngnhận đủngữnghĩa12bảndịchcũ, bảnngữ,chuyênmôn haythờilượng học.

Bằng chứng: manufacturing-source58-plan.json; ba receipt manufacturing-source58-{electrical,taxonomy,sequence}-review.json; manufacturing-source58-validation.json. NguồnPDF vàảnh trang giữriêng, không đưa vàoGit/app. Root điều phối lưuGitHub; chỉ nhận đãlưu sau xácminhremote, không nhận từlocalreceipt.
