# Sản xuất 1号 — báo cáo 6 AI ngày 29/10/2026

Đã thực hiện lượt đối chiếu bằng **6 AI**. Tài liệu nguồn: **574/574 trang đã đọc văn bản và xem tổng quan**, trong đó **541 trang được phóng để đọc chi tiết hình/bảng/công thức**. Các trang khác đã được đọc chữ/xem toàn trang; gồm bìa, mục lục, thông tin đầu sách và kỳ thi. Ba PDF đã kiểm byte/hash đúng bản gốc được chỉ định.

Đã đọc nội dung Nhật của **262 bài chính + 12 bài bổ trợ**, so với nguồn và 22 ảnh ứng dụng. Đây là kiểm tra bằng AI; **chưa phải chứng nhận của chuyên gia/người bản ngữ là con người hoặc xác nhận thiết bị thật**. Việc đọc đủ trang không xác nhận đã dạy đủ mọi knowledge atom.

## Phân công và kết quả thực

| AI | Phạm vi | Kết quả |
|---|---|---|
| 1 | Cơ khí:169 trang | Đọc169, phóng160 trang thân, so91 bài+4 guides+8 ảnh; hỗ trợ42 lượt trang surface |
| 2 | Điện–điện tử:198 trang | Đọc198, phóng185 trang, thêm crop dày; so98 bài+2 guides+8 ảnh; hỗ trợ32 lượt trang surface |
| 3 | Xử lý bề mặt:207 trang | Đọc207, so73 bài+6 guides+6 ảnh; tự phóng186 trang, gộp trợ giúp thành196 trang thân, không đếm trùng |
| 4 | VI/EN/ID/ZH-CN/ZH-TW/TH | Đối chiếu đủ6.108 nghĩa thuật ngữ, đọc838 ứng viên số liệu và các câu rủi ro;263 đề xuất được tích hợp |
| 5 | HI/BN/NE/MY/KM/TL | Đối chiếu đủ6.108 nghĩa thuật ngữ, đọc348 ứng viên số liệu và các mục bổ trợ;158 đề xuất được tích hợp |
| 6 | Thiết bị/build và rà độc lập chọn lọc | Kiểm kê môi trường, thử Android Metro export, rà độc lập19 trường dịch nguy cơ cao và mã tích hợp; chưa có thiết bị thật |

Bảng thuật ngữ có **1.018 lần xuất hiện định nghĩa trong các bài/guides × 12 ngôn ngữ = 12.216 trường nghĩa** đã được so trực tiếp bằng AI. Thuật ngữ lặp ở bài khác được tính riêng, không phải1.018 từ nghề duy nhất. Bộ kiểm tra xác nhận đúng ID, vị trí thuật ngữ, hash Nhật, hash nghĩa dịch khi có và không thiếu/trùng trường đã đọc. Đây là glossary, chưa phải toàn bộ prose, lựa chọn và lời giải của mọi bản dịch.

## Đã sửa và tích hợp

**421 trường dịch / 288 cặp mục–ngôn ngữ**, gồm86 trường bài chính,12 trường guide,73 trường kiểm tra tuần và250 trường mock. Mỗi sửa đổi ràng buộc đúng bản Nhật và nguyên văn trước sửa. Các ngân hàng gốc, ID câu/bài, thứ tự đáp án, correctIndex, chấm điểm và khóa lưu bài không đổi.

Các sửa tiêu biểu:

- Tiếng Việt: làm rõ nhóm **ít trường hợp nhưng nghiêm trọng về an toàn**, thay cách dịch có thể hiểu là “ít nghiêm trọng”.
- Myanmar: phân biệt **số cực từ** với số trục; tiếp điểm với nút/công tắc.
- Nepali: phân biệt **dòng điện không đổi** với tĩnh điện; làm rõ tỷ lệ phần trăm, mật độ dòng và hiệu suất dòng.
- Hindi/Nepali: giữ số5 của ký hiệu bán kínhR5 trong lựa chọn.
- Filipino: giữ logic input/output của on-delay/off-delay và đơn vịV/div.
- Sáu ngôn ngữ: làm rõ “đóng hai mỏ thước cặp”, không hiểu thành tắt nguồn.
- Khôi phục mẫu số, đơn vị, điều kiện và các lời giải bị cắt cụt ở những trường đã rà.

Các bản dịch vẫn mang trạng thái AI, nativeReviewed/domainReviewed/humanReviewed=false. Lớp sửa chỉ có hiệu lực khi hash nguồn và mọi giá trị trước sửa còn khớp; nếu lệch sẽ không áp một phần. Có lớp khôi phục getter sau dựng lại nội dung; đã kiểm writer cô lập thật cho3 loader, tính lặp lại và trường hợp lỗi cấp phát. Chưa chạy lại toàn bộ assembler hoặc build phát hành.

## Kết quả kiểm tra

- Toàn bộ421 trường qua các getter thực tế hiển thị đúng giá trị sửa; dữ liệu cũ/metadata bảo vệ bị từ chối; không mutate ngân hàng gốc.
- **118 luồng React Native Web** qua reader, weekly và mock, hai kích thước320×568/932×430;0 lỗi trang. Kiểm nội dung trước/sau nộp, không lộ lời giải sớm, và không tràn ngang. Thêm2 luồng riêng để xem rõ bản sửa an toàn tiếng Việt; ảnh điện thoại dọc đã kiểm bằng mắt.
- TypeScript/lint các mô-đun thay đổi đạt; lint0 lỗi/0 cảnh báo. Bộ kiểm dữ liệu, trạng thái đề,33 đề luyện và khóa UI JLPT10/10 đạt.
- Kiểm nguồn lịch sử batch25 đạt57 trường hợp từ chối; guide29 đạt14. Các snapshot cũ được tái tạo đúng byte qua các bản mở rộng được giới hạn chính xác.

RNWeb dùng các adapter đã khai báo cho Royal/storage/safe-area/ảnh trang trí và font QA Nhật. Các lượt này không chứng nhận font mọi hệ chữ hoặc native/thiết bị thật.

## Những điều vẫn chưa được xác nhận

1. **Bao phủ mọi chi tiết kiến thức:** cơ khí ghi31 trang còn thiếu chi tiết/ảnh; surface có63 trang phạm vi partial và67 trang cần qualification. Đây không phải số bài phải viết mới và không phải một tổng thiếu sót toàn ngành. Lời Nhật ở cơ khí076 cần làm rõ magnetic-flux leakage là nguyên lý của magnetic-particle testing; surface062 có đề xuất nới định nghĩa端面ハゲ; điện075 có cơ hội bổ sung công thức đối ngẫu. Các vấn đề được ghi trong ledger/report của từng nguồn, chưa tự đóng bằng số đếm trang.
2. **Toàn bộ câu và bản dịch prose:** còn câu hỏi/phương án/lời giải chưa đọc ngữ nghĩa riêng từng trường. Quét cấu trúc/hash không được tính là duyệt ngữ nghĩa hoặc duyệt bản ngữ. Chưa đối chiếu toàn bộ thuật ngữ với bảng dịch chính thức của từng ngôn ngữ.
3. **Chuyên gia và người bản ngữ:** chưa có người thực hiện xác nhận theo vai trò đó. Các AI rà kỹ thuật/ngôn ngữ không tạo chứng nhận con người.
4. **Thiết bị thật:** không có adb/Xcode/USB bridge hoặc công cụ thiết bị vật lý phù hợp trong môi trường. Android Metro export thử thực bị chặn bởi asset được Git theo dõi nhưng thiếu ở sparse checkout; kiểm kê còn phát hiện nhiều Git LFS pointers. Đây là chẩn đoán build trong môi trường hiện tại, chưa cài APK/IPA hay mở app trên điện thoại.

`device/PHYSICAL_TEST_HANDOFF.vi.md` có bước chạy development build trên Mac+iPhone hoặc máy+Android thật. Ma trận12 nhóm kiểm thử vẫn `not_run`, cần model/OS/build/commit và ảnh/log thực khi chạy. Serial/UDID giữ riêng.

## Hồ sơ chính

- `source-manifest.json`: ba hash PDF và tổng574 trang.
- `review-index.json`:574 hàng theo physical page, tách đọc chữ/xem tổng quan/phóng chi tiết/knowledge closure.
- `glossary-review-index.json`: xác minh12.216 trường nghĩa đã đọc.
- `mechanical/`, `electrical/`, `surface/`: ledger, findings, các qualification và bằng chứng trợ giúp có reviewer riêng.
- `language-a/`, `language-b/`: phạm vi đọc thực, đề xuất sửa và các vòng glossary; các tệp lô trước là lịch sử, index gộp là trạng thái đọc glossary hiện tại.
- `integration/applied-corrections.json`, `validation-summary.json`, `browser-result.json`: bản sửa đã áp và kết quả chạy.
- `device/`: kiểm kê, Android export, ma trận phần cứng và rà độc lập chọn lọc.

`wholeCurriculumComplete`, `releaseReady`, `nativeReviewed`, `domainReviewed` và `physicalDeviceVerified` tiếp tục là **false**. SSW2 nằm ngoài phạm vi. Không có tiến trình kiểm thử thiết bị thật chạy nền.
