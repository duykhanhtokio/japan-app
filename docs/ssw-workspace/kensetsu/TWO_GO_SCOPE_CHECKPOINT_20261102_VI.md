# Xây dựng2号 — nguồn và đường năng lực

Ngày2026-11-02. Hồ sơ này cập nhật tình trạng truy cập nguồn, không thay các nghiệm thu ngữ nghĩa còn mở.

Đã lấy lại và kiểm byte/hash/số trang của đủ17PDF trong `SOURCE_INTAKE_2GO_2026-10-17.json`:604trang danh nghĩa. Hai cặptext3k/text3l vàtext4k/text4l giống từng byte; còn15hash/530trang duy nhất. Vì vậy thiếu byte nguồn không còn là lý do chặn luồng này. PDF và văn bản trích xuất không nằm trong kho mã hoặc bundle app.

`TWO_GO_SOURCE_CAPABILITY_MATRIX_20261102.json` ghi từng tệp và từng trang duy nhất, dấu vết chữ/hình/vector, ứng viên bài thật theo nguồn/trang.136trang chưa có liên kết trang trực tiếp; số này gồm bìa, tài liệu đầu sách vàtext1kchưa mangsourceIdcanonical, không đồng nghĩa136trang kiến thức bị bỏ sót. Từng trang ấy cần phân loại vai trò và đối chiếu ý, không tự đóng hoặc tự tạo bài.

Riêngtext1kvàtext1lkhác hash do bìa; chữ chính có cỡ>=10pt củaPDF2–12giống nhau hoàn toàn khi trích xuất. Kết quả này giúp tránh viết lại cùng kiến thức, nhưng chưa chứng minh mọi chữ nhỏ/hình/bố cục tương đương. Không suy thêm năng lực2号từ phép so chữ.

`TWO_GO_RUNTIME_SOURCE_MATRIX_20261102.json` được tạo từ chính adapterappquaesbuild, chỉ stubimportảnh. Chín scope2号có:学科161bài/10bộ/400câu ở mỗi nhánh;実技utilities224,building163,civil152bài, mỗi nhánh10bộ/400câu;職長28bài dùng chung ba nhánh, không có bộ thi.学科/実技dùng chính object và payload câu của1号đúng nhánh; khóa hoàn thành vàIDlượt thi tách theo cấp. Số lượt ở các scope dùng chung không phải số bài/câu duy nhất.

Ma trận chuẩn hóa580bản ghi bằng chứng bài thực tế cóparagraphID/hashNhật vàquestionIDtham chiếu. Một paragraphkhông có tham chiếu câu chưa tự động có nghĩa phải thêm câu; cần xác định đó có phải năng lực độc lập cần kiểm tra hay không. Một câu có tham chiếu cũng chưa chứng minh đúng đáp án hoặc đủ chiều sâu nguồn.

Phạm vi2号hiện dựa trên quyết định dùng lại学科/実技1号và nguồn職長riêngleader131trang. Chưa có ma trận từng ý hoàn chỉnh chứng minh đủ năng lực2号, chưa được gọi các bộ xác nhận kiến thức dùng lại là đề2号chính thức. Ba hoạt động014–016đã được xử lý riêng trong checkpoint職長; lượt này không tạo nội dung trùng hoặc câu để đạt chỉ tiêu.

Tái tạo bằng `node scripts/kensetsu-authoring/check-2go-runtime-source-matrix.cjs`, rồi `python scripts/kensetsu-authoring/build-2go-source-capability-matrix.py SOURCE_DIRECTORY LEADER_PDF`. Cần dependenciesesbuild; có thể đặt `TOKUTEI_QA_MODULES` tới thư mục chứa dependencies. Kiểm cấu trúc, nguồn byte và mức dùng lại đã đạt; toàn bộ ý nguồn, chuyên môn/bản ngữ/quyền, ảnh/âm thanh,Expo/nativevà thời lượng vẫn chưa nghiệm thu. Điều phối phảicommit/push/fetchvà xác minhremotecho các tệp mới.


## Đợt 4 tự kiểm — 7d

Đọc/xem toàn 16 trang 7d; sổ canonical hiện 199 đơn vị/89 covered_ai/7 blocker, không có phần trăm vì mẫu số ý chưa đóng. 69 trang đã xem, 32 kiểm kê ý, 1 trang instructional phủ đủ. Bổ sung 4 cụm 006/009/014/016 JP+12, giữ ID/revision tiến độ; 3 hình độc lập, 288 quan sát ô số không tính thành kiến thức. Gate/guardian/host96 ca PASS; chuyên gia/native/Expo/thiết bị/thời lượng chưa nghiệm thu. Xem construction-batch4-* và construction-report.vi.md; tiếp tục 7k và phần 2号 còn mở.
