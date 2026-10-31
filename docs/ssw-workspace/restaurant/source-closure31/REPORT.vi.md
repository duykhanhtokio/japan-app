# Nhà hàng — đối chiếu nguồn và bổ sung kiến thức, 2026-10-31

Đã đối chiếu cả bảy tài liệu Nhà hàng cấp 1 và cấp 2: đủ **271 trang**, **639 mục phân cấp**, tách thành **1.476 fact** có dẫn nguồn. Hồ sơ đọc văn bản/hình của từng trang thuộc các gói tác giả AI; phiên tích hợp kiểm tra byte nguồn, liên kết, nội dung bổ sung và rà soát chéo, không tự nhận đã thực hiện một lần đọc hình độc lập mới cho toàn bộ 271 trang.

| Hạng mục | Kết quả thực tế |
|---|---|
| Phân loại mục nguồn | 235 mục đã có nội dung; 289 mục được bổ sung; 113 mục tổng hợp cấu trúc; 2 mục blocked có lý do |
| Ma trận chung | 639 mục nối tới fact, đoạn/bài học và câu hỏi; không còn mục ngoài nhóm tổng hợp thiếu liên kết câu hỏi đại diện |
| Nội dung mới trên app | 133 đoạn giải thích, 198 câu luyện tập riêng, 145 lượt hình từ 119 tệp ảnh, 11 liên kết chính thức, 1 thuật ngữ; gắn vào 92 bài |
| Dịch thuật | 12 ngôn ngữ × 488 mục = 5.856 bản ghi; 33.096 trường nội dung đầy đủ, đúng hash và thứ tự lựa chọn |
| Số liệu bản dịch | 278 cờ biểu đạt số đã có đối chiếu ngữ cảnh theo SHA của đúng trường hiện tại; các thiếu sót thật đã sửa |
| Nội dung cũ | Giữ nguyên 120 bài, 984 câu hỏi, ngân hàng tuần/mô phỏng và dịch vụ lưu tiến độ; kiểm byte với mốc `8a0ebfe5` |

Ma trận đọc tại [knowledge-matrix.json](knowledge-matrix.json); bằng chứng fact/đoạn/câu hỏi, lý do loại trừ và khoảng trống tại [unit-crosswalk.json](unit-crosswalk.json). Chỉ mục và byte của PDF/trang được khóa trong [source-lock.json](source-lock.json). Không đưa PDF hay văn bản trích xuất nguyên trang riêng tư vào Git.

Một câu đại diện không chứng minh mọi chi tiết của mục đã được kiểm tra độc lập: còn **397 fact không có câu riêng**, được ghi rõ thay vì nâng thành tỷ lệ kiểm tra 100%. Các mục tổng hợp cũng không được đếm như kiến thức độc lập. Đối chiếu mới đã thêm tám câu cho khoảng trống đánh giá, sau đó loại q006 vì trùng năng lực tư vấn người tiêu dùng với câu có sẵn; giữ liên kết có giới hạn phạm vi tới q085 cấp 1. Bảy câu còn lại được rà đáp án đúng và ba đáp án nhiễu. Không có trùng nguyên văn thân câu mới với ngân hàng cũ; rà tương đồng ngữ nghĩa là bằng chứng AI theo gói, không phải chứng minh toán học không còn câu tương tự.

Các sửa quan trọng gồm: phân biệt dữ liệu giáo trình theo năm với quy định cập nhật; phạm vi chín dị nguyên và giai đoạn chuyển tiếp; ngưỡng làm nguội theo đúng nguồn; mẫu số của mô tả norovirus; hướng chữ ハ là V ngược; số liệu bị thiếu trong mục tiêu/đáp án nhiễu; ảnh ghép được cắt đúng ô trong câu hỏi và khi phóng to. Chú thích giảng dạy không hiện trong câu hỏi; đáp án và giải thích chỉ hiện sau nộp. Mục dữ liệu chỉ thay dẫn nguồn đã có bằng chứng so sánh tiếng Nhật trước khi gắn lại hash, xem [integration/metadata-rebindings.json](integration/metadata-rebindings.json).

Thông báo MHLW ngày 2017-11-10, 薬生食監発1110第1号, là nguồn sơ cấp độc lập để giải thích phạm vi số liệu norovirus: <https://www.mhlw.go.jp/web/t_doc?dataId=00tc4050&dataType=1&pageNo=1>. Không nhận rằng đã xác định được tập số liệu gốc của giáo trình, hoặc tỷ lệ đó đúng cho mọi cửa hàng hiện nay.

## Kiểm tra đã đạt

- Byte bảy PDF/271 trang, 639 quyết định, 924 liên kết đoạn cũ và 713 liên kết câu hỏi cũ: [evidence-qa.json](evidence-qa.json).
- Đủ mục/đủ trường/đúng phiên bản của cả 12 ngôn ngữ và dữ liệu runtime: [translation-final-validation.json](translation-final-validation.json).
- Mọi cờ số hiện tại nối được với biên bản ngữ nghĩa đúng hash: [numeric-context-final-validation.json](numeric-context-final-validation.json). Tệp `translation-number-screen.json` cố ý giữ cờ thô, không coi chuyển đổi tháng hoặc số bằng chữ tự động là lỗi.
- 1.196 lần render của thành phần thật trên JA và 12 ngôn ngữ dịch; chặn bản nguồn/bản dịch cũ; 28 trường hợp entry/route/Course; lưu–mở lại–nộp–làm lại, thử lưu khi lỗi, xác nhận trước khi lưu trữ bản ghi hỏng và giữ tiến độ cũ.
- TypeScript theo phạm vi phần bổ sung; Expo 54.0.37/RN 0.81.5 xuất bản dựng kiểm thử phần bổ sung cho iOS, Android, web, không dùng host adapter trong bản dựng Expo.
- Chromium chạy bản web production của phần bổ sung ở bốn viewport, chuyển 12 ngôn ngữ, đi qua 92 bài, lưu/tải lại/nộp bài, 0 lỗi trang. Kiểm riêng tám trường hợp cắt ảnh. Đây là trình duyệt trên máy chủ, không phải thiết bị di động thật hoặc toàn bộ app.

Chi tiết và fingerprint đầu vào: [technical-final-validation.json](technical-final-validation.json). Thời gian chuyển bài và bộ nhớ trong `expo-qa/browser/report.json` chỉ là phép đo môi trường Chromium/loopback hiện tại, không suy ra hiệu năng điện thoại.

## Giới hạn kiểm thử toàn app và số đo thực

Đã thử xuất **toàn app** bằng entry Expo Router: lần ba nền tảng đồng thời và lần tách iOS đều bị tiến trình dừng với **SIGKILL/exit137**, trước khi export hoàn tất. Không nhận rằng đã xác định chắc nguyên nhân hệ thống hoặc đã sửa lỗi bundling toàn app. Đã phục hồi22594 tệp tracked còn thiếu từ clone có sẵn, chỉ chấp nhận byte khớp Git/LFS và không ghi đè tệp hiện có. Xem `acceptance/full-application-export.json` và hai log. Export phần bổ sung đạt không thay thế kết quả này.

Bản web Expo cuối của phần bổ sung: mở đầu2124ms trên Chromium máy chủ; chuyển92bài có trung vị56ms, lớn nhất154ms; heap ở lần lấy mẫu cuối148MB. Môi trường loopback/gzip, không phải số đo điện thoại. Ảnh12ngôn ngữ và4viewport cùng báo cáo tại `acceptance/expo-web/`. Bộ quan sát long-task chỉ bao phủ navigation hiện tại sau lần tải lại, không chứng nhận toàn phiên không giật.

Không có xcrun/iPhone Simulator, adb/Android Emulator hoặc thiết bị kết nối trong môi trường này. Chưa đo30phút bằng người học. Đã tạo hồ sơ trống cho120ngày và quy trình nghiệm thu tại `acceptance/learning-duration-observations.json` và `acceptance/device-and-duration-protocol.vi.md`; không điền số phút giả từ độ dài văn bản hay tốc độ chạy test.

## Ba điểm nguồn/hình/thực hành chưa thể nghiệm thu đóng

1. **`rst-1-cooking-ref01`:** vị trí mục `うぐいす骨` trong chỉ mục không khớp phần `ほほ骨`; chưa có xác nhận đính chính từ bên xuất bản. Đã bổ sung ngữ cảnh thuật ngữ bằng nguồn độc lập, không khẳng định hai từ là một.
2. **`rst-1-service-k021`:** năm biểu trưng hỗ trợ có điều kiện xin phép/báo cáo/quyền sử dụng. Ý nghĩa và liên kết chính thức được đưa vào bài; không tự nhúng ngoại tuyến các hình chưa đủ điều kiện, không gửi yêu cầu ra ngoài.
3. **`rst-1-service-k065`:** có phần lý thuyết, sơ đồ nguyên gốc và liên kết phương pháp chính thức; chưa xác nhận thực hành sơ cứu hoặc chứng nhận video/quy trình ngoại tuyến.

Còn cần chuyên gia nghề, người bản ngữ và thiết bị thật nghiệm thu. Chưa chứng nhận mọi cách đọc furigana theo ngữ cảnh hoặc thời lượng học thực tế; ứng viên đọc không rõ được để trống. Kiểm kê lượng văn bản từng ngày tại [daily-workload-after-supplements.json](daily-workload-after-supplements.json) không quy đổi giả thành số phút. Không dùng trạng thái `PASS` của compiler để tuyên bố toàn ngành đã nghiệm thu 100%.

## Lặp lại kiểm tra

Trong checkout có các phụ thuộc Python/Pillow, Expo/React/esbuild, React test renderer và Chromium tương ứng:

```sh
python scripts/restaurant/build-source31.py --available-translations --require-complete-locales
python scripts/restaurant/build-source31-matrix.py
python scripts/restaurant/check-source31-evidence.py
python scripts/restaurant/check-source31-targets.py
python scripts/restaurant/check-source31-translation-numbers.py
python scripts/restaurant/check-source31-numeric-receipts.py --require-complete
node scripts/restaurant/check-source31.cjs --require-locales
node scripts/restaurant/check-source31-attempt.cjs
tsc -p scripts/restaurant/tsconfig-source31.json
```

`check-source31-evidence.py` cần PDF/trích xuất nguồn khớp `source-lock.json`; đường dẫn nguồn riêng tư hiện tại được khai báo trong script. Các kiểm thử Expo dùng `RESTAURANT_EXPO_DEPS` và `RESTAURANT_EXPO_QA_DIR` ngoài repo; Chromium có thể cấu hình qua `CHROMIUM_EXECUTABLE_PATH`. Không chạy lại export đóng băng hay script tác giả để thay bản dịch đã duyệt một cách mặc định. Toàn bộ chuẩn nghiệm thu con người vẫn được giữ `false`.
