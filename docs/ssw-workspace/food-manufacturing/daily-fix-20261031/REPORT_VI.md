# Khắc phục tải học và hình theo ngày —2026-10-31

Nhánh `feature/food-continue-20261029`, nền `3a09e225d95dca6975a81152fb1a6ecf9469e04d`. Chỉ sửa mô-đun Thực phẩm.

- 96/96 ngày có mapping sơ đồ minh họa trọng tâm với sourceHash và paragraph ID cụ thể. 35 hình WebP nguyên bản, dựng hình học có kiểm soát, có nhãn Nhật, không dựa vào ảnh nguồn hoặc LFS pointer. Hình là mô phỏng khái niệm, không thay quy trình hay ngưỡng vận hành.
- 94 ngày bổ sung hai đoạn kiến thức và hoạt động áp dụng từ bài liên quan cùng cấp đã có trong giáo trình. Hai bài đã dài không thêm đoạn. Các bổ sung nguồn cuối khóa được liên kết trở lại ngày nền khi đúng chủ đề. Không thêm văn bản để đủ số chữ, không tự bịa điều kiện kỹ thuật.
- Thân bài duy nhất + đoạn liên quan (không cộng chú thích lặp, bản dịch hoặc hoạt động):1号 từ282/319/529 lên474/565/785ký tự (min/trung vị/max);2号 từ301/364,5/1.055 lên530/642/1.055. Không tuyên bố đã đo30phút/ngày.
- Giữ toàn bộ ID, nội dung Nhật, hash, 12bản dịch, câu hỏi/đáp án/phiên bản và khóa tiến độ hiện có. Không tự đánh dấu hoàn thành bài đồng hành. Ngày cũ và mới ánh xạ1:1; số tuần/ngày không đổi.
- Chú thích và alt dựa vào đoạn Nhật đã liên kết; khi bật dịch dùng bản dịch cùng hash. 1.128 cặp bài đồng hành/ngôn ngữ và1.152cặp chú thích/ngôn ngữ được kiểm tra. Ba nhãn UI mới có36bản dịch trực tiếp trên12ngôn ngữ. Nhãn trong hình bằng Nhật; chú thích đầy đủ có sẵn12ngôn ngữ.
- Hình hiển thị trong trang của từng ngày, có mở lớn và cuộn ngang/dọc. Không đưa toàn bộ ngành khác vào bundle; chỉ thêm35asset nhỏ cho mô-đun này. Các ảnh cũ giữ nguyên và không dùng làm bằng chứng phủ hình mới.

## Kiểm tra

`validation.json`:96binding,94bundle,35tệp giải mã đủ1200×760 vàhashmanifest,96ca từ chối hash bài chính cũ,76tệp canonical/dịch/tiến độ byte-identical. `browser-qa.json` tổng hợp:đợt đầy đủ trước khi thêm36nhãn UI dịch đã đạt96trang đọc với ảnh thực,94bundle thật và32trường hợp màn hình/ngôn ngữ. Đợt delta UI cuối đạt4bài đại diện,32trường hợp màn hình/ngôn ngữ,1ca mở lớn/cuộn và1callbackhoàn thành; không lỗi trang. Lần chạy lại toàn bộ khi nhiều kiểm tra nặng chạy đồng thời bị đóng browser; không tuyên bố đã replay đủ96trang trên phiên bản nhãn UI cuối. TypeScript phạm vi trước36nhãn UI cuối đã PASS; chạy lại bản cuối bị giới hạn bộ nhớ (1,4GBheapOOM và lượt3GBexit137), không có chẩn đoán lỗi kiểu được trả về và không coi đó là PASS. BundleactualReader vàdeltaUIcuối, state regression PASS. Ảnh điện thoại tiếng Việt đã được xem; screenshot/QA bundle nằm ngoài mã nguồn.

Browser dùng adapter rõ ràng cho Royal artwork/surface, safe-area, backdrop và localStorage. Chưa chứng nhận Expo production, thiết bị thật, chuyên môn/bản ngữ hoặc thời lượng người học. Đây là sửa nội dung đang hiển thị và minh họa, không chứng nhận toàn ngành đạt phát hành. Root phải đẩy/fetch/kiểm tra remote trước khi báo đã lưu.

## Tái tạo

`create-daily-diagrams.py` dùng font Nhật (`FOOD_DIAGRAM_FONT` khi máy không có font QA hiện hành). `check-daily-learning.cjs` kiểm cấu trúc/source/byte preservation. `check-daily-learning-browser.cjs` cầnPlaywright,sparticuz,JapaneseFont và thư mục output ngoài repo; dùng actual exported Reader, không mock nội dung bài học.

Cập nhật nghiệm thu cuối: parent chạy tuần tự TypeScript toàn phạm vi với heap4096MB, exit0/PASS. Các lần giới hạn tài nguyên trước đó được giữ trong hồ sơ; không còn blocker TypeScript cuối.
