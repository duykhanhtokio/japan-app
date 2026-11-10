# Nhà hàng — ba nhóm sửa theo phiên bản, 03/11/2026

Mốc bảo toàn `2aa8c72ef0dc475250631f222b3e3c7d0da7e3e9`. Điều phối commit/push và xác minh từ xa; kiểm cục bộ không tự chứng minh persistence.

1. **Làm nguội:** thay bốn lý do dạng công thức ở câu `rst31-v2-r3-hyg-q001` bằng lời giải thích tương ứng bản Nhật trong cả 12 ngôn ngữ. Không sửa phương án, đáp án, Nhật hoặc sourceHash.
2. **Phân biệt công đoạn:** thay bốn lý do dạng bộ số ở `rst31-v2-r3-hyg-q003` bằng lời giải thích phân biệt món chính, sốt và đồ gia vị trong cả 12 ngôn ngữ. Tổng hai nhóm:96 trường lý do đã sửa. Hồ sơ giữ hash trước/sau và hash từng câu Nhật; chưa duyệt bản ngữ/chuyên môn.
3. **Phiếu quay lại:** xác minh PDF 店舗運営 2号 hash `6c9d1d11108cb4bc114cdf653f2c1061a7f6606dfd4933119a15bc599a98225f`, đọc chữ và ảnh trang PDF21 (trang in17), mục4(5). Bổ sung đoạn giảng độc lập về trao phiếu lúc thanh toán tại quầy và mục đích lần ghé tiếp theo, ví dụ riêng, đủ12bản dịch và hai trường furigana được căn chỉnh. Thêm câu độc lập `rst31-v2-coupon-timing-q001` kiểm trực tiếp lựa chọn thời điểm thanh toán so với nhập quán/gọi món/bắt đầu nấu; đủ12bản dịch,10trường ruby. Bảo toàn q258 cũ để kiểm nhầm giảm giá trong ngày. Hai câu cùng đoạn dạy đóng riêng năng lực `rst31-operations2-f034`:teaching/assessment=present,status=covered_ai. Không đóng cả trang hay ngành.

Sáu cờ số tiếng Việt từ r5/r6 được đọc theo ngữ cảnh và gắn receipt chính xác:dấu phẩy thập phân giữ đúng0,68/333,3/0,3/0,2; không sửa số hay đáp án.

Kiểm đạt:strict targets582canonical items/6984localized records/45072visible fields; numeric284/284cờ có receipt (kiểm binding, không tự duyệt ngữ nghĩa); core ruby7622trường căn chỉnh; bounded preservation kiểm96thay đổi,24cặp dịch mới/156trường dịch, bảo toàn toàn bộ Nhật/câu hỏi/ID cũ,12trường ruby mới; ledger contract56covered_ai,60teachingDirect/56assessmentDirect,1479ý đã biết. Còn1422ý chưa đóng (và1excluded); mẫu số nguồn vẫn mở,sourceCoveragePercent=null.

Full source31 SSR `--require-locales` PASS:1235renders,137sections,288questions,145figures,12locales; stale lesson/question rejection và bảo toàn nội dung/tiến độ PASS. Kết quả ở `source-closure31/integration-qa.json`. Không suy thiết bị thật/thời lượng từ SSR. Chưa có thiết bị thật,thời lượng thực học,người bản ngữ hoặc chuyên gia. Các nhóm còn mở gồm1422ý,hình/nhãn chính thức,うぐいす骨–ほほ骨 và nguồn chưa phân rã đủ.96trường được tự sửa có phạm vi hẹp,không thay cho nghiệm thu12ngôn ngữ toàn ngành.

Lệnh kiểm hẹp:`node scripts/restaurant/check-semantic-remediation-20261103.cjs`;`python3 scripts/restaurant/check-source31-targets.py`;`python3 scripts/restaurant/check-source31-numeric-receipts.py --require-complete`;`node scripts/source-coverage-v2/check.cjs docs/ssw-workspace/source-coverage-v2/restaurant.json`.
