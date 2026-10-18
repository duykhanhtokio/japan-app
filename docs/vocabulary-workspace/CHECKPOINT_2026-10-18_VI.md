# Từ vựng N5–N1 — hoàn tất phạm vi đa ngôn ngữ ngày 2026-10-18

Đã tích hợp đủ 8.350 từ của kho hiện có cho toàn bộ 13 ngôn ngữ app: nguồn Nhật và 12 bộ nghĩa gồm Anh, Việt, Indonesia, Trung giản thể/phồn thể, Hindi, Bengali, Nepal, Myanmar, Thái, Khmer, Tagalog. Mỗi bộ có 8.350 nghĩa, 298 bản dịch ví dụ có câu Nhật nguồn và 311 nghĩa bổ sung cho lịch N5. Đủ mọi mục ở N5 909, N4 804, N3 1.716, N2 3.078, N1 1.843. Kiểm tra 1.796 lượt xuất hiện trong lịch N5 ở từng ngôn ngữ không còn mục báo thiếu.

Dùng ngôn ngữ từ LanguageProvider trên danh sách, chi tiết, lịch N5 và các bảng từ cũ. Nội dung đã chọn ngôn ngữ đi qua Text gốc, tránh bộ đoán hệ chữ cũ. Sửa cách ghép từ đồng âm trong lịch N5 bằng ánh xạ đã rà; vẫn giữ cách gán khóa tiến độ trước đây. Từ/biến thể cũ như cách đọc Katakana được nối với mục chuẩn bằng cả chữ Nhật và cách đọc. Tìm kiếm cập nhật khi đổi ngôn ngữ.

Giữ nguyên từng byte kho gốc, thứ tự 8.350 ID và khóa dữ liệu đã học. Lớp sửa nguồn ghi rõ 328 mục chỉnh chữ, cách đọc, nghĩa hoặc ví dụ; chỉ áp dụng khi nguồn cũ khớp. Bản dịch gắn với chữ/cách đọc/câu Nhật cụ thể. Đã bảo toàn nguyên văn đợt dịch 100 nghĩa/10 ví dụ ban đầu ở mỗi ngôn ngữ mới.

Kiểm tra dữ liệu toàn bộ và màn hình thật trên Chromium đã đạt cho 13 ngôn ngữ: danh sách, tìm kiếm, chi tiết cả năm cấp, lịch N5, đổi ngôn ngữ/tải lại, giữ trạng thái đã học của VOC0001 và n5-plan:vocabulary:8:1. Có 24 ảnh tại 320×568, 768×1024, 932×430, gồm ví dụ và nghĩa N1 dài, ghép thành sáu ảnh đã xem trực quan. Royal/nền, navigation và storage có adapter trình duyệt; chưa xác nhận trên thiết bị native hoặc Expo production. Khóa JLPT UI đạt 10/10 và không sửa tệp bị khóa. Rà nghĩa AI tập trung đạt 216 giá trị của 18 mục quan trọng × 12 bộ dịch.

Các bản dịch mới vẫn chưa được người bản ngữ duyệt. 8.052 từ không có câu ví dụ Nhật trong nguồn vẫn chưa có ví dụ; đã dịch toàn bộ 298 câu ví dụ hiện có. Nghĩa Anh bổ sung có 1.704 định nghĩa JMdict/EDRDG được ghi nguồn và giấy phép CC BY-SA 4.0 trong manifest/provenance. Không dùng API dịch hoặc phụ thuộc dịch lúc chạy.

Báo cáo đầy đủ nằm trong FULL_VOCABULARY_CHECKPOINT.md, localization-manifest.json, localization-qa-2026-10-18.json, browser-qa-2026-10-18.json và semantic-review-2026-10-18.json.

## Lịch sử đợt dịch đầu (đã được phạm vi đầy đủ ở trên thay thế)

# Từ vựng — nối ngôn ngữ và đợt dịch đầu 2026-10-18

Yêu cầu: bổ sung bản dịch và sửa cách lấy ngôn ngữ của phần単語. Đã sửa danh sách, chi tiết, danh sách từ theo bộ lọc và bộ lấy nghĩa/ví dụ của lịch họcN5. Dùng ngôn ngữ từLanguageProvider. Nghĩa Anh lấy đượcmeaningEn cũ; ví dụ Việt lấy đượcexampleVi cũ. Nhãn tìm kiếm, nghĩa, ví dụ, số lượng, nút học và thông báo thiếu có đủ13locale. Tìm kiếm bao gồm các bản dịch nghĩa đã tích hợp. Nhật giữ từ và cách đọc gốc, không hiển thị bản dịch ví dụ.

N5LearningJourney trước đây đưa nội dung đã chọn locale quaLocalizedText lần nữa. RegexÀ–ỹ trong bộ đoán cũ bao gồm cả nhiều chữ Hindi/Bengali/Thái/Myanmar/Khmer, dẫn đến bản dịch đúng bị thay bằngTranslation pending. ComponentN5 nay dùngText gốc củaReact Native cho nội dung đã xác định ngôn ngữ. Không sửa bộ tự đoán toàn app hoặc các màn khác trong công việc này. Các tiêu đề/nội dung giáo trìnhN5 chưa được dịch riêng không vì thế trở thành đầy đủ đa ngôn ngữ.

Đã dịch trực tiếp từ từ Nhật/cách đọc và ngữ cảnh:100mụcN5 đầu theo thứ tự kho cho10locale id,zh-CN,zh-TW,hi,bn,ne,my,th,km,tl. Có9câu Nhật gốc được dịch sang11locale gồmAnh và10locale mới; một câu trùng dùng chung bản dịch chohaiID, thành10mục ví dụ. Không tự tạo câu ví dụ thay cho8.052mục còn trống. Bản dịchAI chưa được người bản ngữ duyệt.

Tệp thêm được khóa vớiID, chữ Nhật và cách đọc; ví dụ khóa với nguyên câu Nhật. Khi nguồn không khớp, bộ nạp không gắn bản dịch ấy. Kho8350bản ghi gốc giữ nguyên từng byte; ID, thứ tự và khóa tiến độ không đổi. RiêngVOC0243辛い（からい）có bản sửa nghĩa Việt ở lớp bổ sung thành“cay”, đúng cách đọc và ngữ cảnh đồ ăn; nghĩa“khổ sở” cũ thuộc cách đọcつらい. Không ghi đèJSON gốc.

Hiện có8350nghĩaViệt,6506nghĩaAnh,100nghĩa cho mỗi10locale mới;298ví dụViệt và10ví dụ cho mỗi11locale còn lại. Còn1844nghĩaAnh,8250nghĩa cho mỗi10locale mới,288bản dịch ví dụ có nguồn Nhật cho mỗi11locale ngoàiViệt; ngoài ra8052từ chưa có câu ví dụ nguồn. Nội dung thiếu hiện thông báo chuẩn bị bằng đúnglocale, không lấy từ Nhật/Việt/Anh để giả thành bản dịch đã hoàn tất. Các mục ngoài kho được giáo trìnhN5 tạo bằngIDn5-plan vẫn chưa có bản dịch mới; ngôn ngữ ngoàiViệt hiện trạng thái chờ rõ ràng.

`localization-manifest.json` ghiSHA256kho gốc, phạm vi và sửa nghĩa; `localization-qa-2026-10-18.json` ghi số lượng từbộ nạp thật. Script`check-vocabulary-localization.cjs` kiểm tra ràng buộc nguồn, bản ghi gốc và đủ dữ liệu trong đợt. Script`check-vocabulary-localization-browser.cjs` dùng màn thật,LanguageProvider thật vàservice tiến độ thật trênReact Native Web/Chromium:13locale đi qua danh sách, tìm kiếm, chi tiết vàN5; đổingônngữ và tải lại giữVOC0001đã học,khôi phục ngônngữ vàtrạngthái chờ. Baảnh tổng hợp12ảnh chụp tại320×568,768×1024,932×430 đã kiểm tra trực quan. Royal,navigation vàAsyncStorage cóadaptertrìnhduyệt; fontQA tải cho các hệ chữ cầnthiết. Chưa kiểmtraExpoproduction hoặc thiếtbịnative.10/10tệpJLPTUIđãkhóa vẫnkhớp.

Tiếp tục dịch theo cácID chưa có trong `vocabulary-meaning-localizations.json`, đối chiếu chữNhật/cách đọc; không thay số lượng bản dịch thật bằng fallback, không dùng dịch vụ dịch công cộng hoặcAPI dịch lúc chạy. Hoàn tất các nghĩa còn thiếu rồi tiếp tục ví dụ và các mục giáo trình ngoài kho. Luôn ghi số lượng thật, giữ cờ nativeReviewed:false và allTranslationsComplete:false cho đến khi đáp ứng đủ.
