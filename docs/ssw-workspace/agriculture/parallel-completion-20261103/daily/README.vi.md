# Nông nghiệp — kiểm tích hợp theo ba nhóm

Sổ nghiệm thu chuẩn vẫn là `docs/ssw-workspace/source-coverage-v2/agriculture.json`. Đây là báo cáo dẫn xuất, không thêm ý covered_ai và không nghiệm thu ngữ nghĩa thay cho năm phạm vi nội dung độc lập.

Chạy từ gốc repository:

```bash
node scripts/agriculture/check-current-dependencies.cjs --out docs/ssw-workspace/agriculture/parallel-completion-20261103/daily/current-dependencies.json
node scripts/agriculture/parallel-completion-daily-audit.cjs
```

## Nhóm 1 — ngân hàng câu và liên kết phiên bản

Đã kiểm cấu trúc 46 bộ câu tuần/427 câu và 20 đề mock/800 câu: ID không trùng trong từng ngân hàng, đáp án hợp lệ, đủ giải thích lựa chọn, bài tồn tại và nằm trong lịch của cấp tương ứng. Không đọc lại ngữ nghĩa ngân hàng đã rà chỉ để tăng số đếm.

12 câu tuần giữ hash cũ theo bốn hồ sơ tương thích đã được khai báo. Checker xác minh `currentSourceHash`, danh sách hash được phép và hash nội dung Nhật với cách sắp khóa đệ quy của validator hiện hữu. Đây không phải 12 câu lỗi hoặc quyền sửa hash đơn thuần. Kết quả: không có lỗi cơ học trong phạm vi này.

## Nhóm 2 — ngày học, hình và thời lượng

Có 369 lần bài xuất hiện trong lịch. Tất cả có liên kết hình kiến thức theo metadata hiện hành; 211 asset khác nhau. Chỉ 11 asset có byte cục bộ ở snapshot đầu của sparse checkout. Các đường dẫn khác được đối chiếu chỉ mục Git và báo riêng; không kết luận app thiếu hình chỉ vì chưa tải xuống checkout này. Chưa nghiệm thu độ phù hợp bằng pixel, quyền sử dụng toàn bộ hình hoặc hiển thị thiết bị.

Không có ngày nào có `measuredMinutes` thực đo trong snapshot. Không suy phút học từ số chữ hoặc từ mục tiêu 30 phút.

## Nhóm 3 — bản dịch, furigana và tích hợp reader

241 bài ×12 ngôn ngữ =2.892 cặp bài-ngôn ngữ có hash hiện hành và các trường bắt buộc; 25 hoạt động tự kiểm ×12 =300 cặp. Kiểm ruby ở các hoạt động tự kiểm xác nhận ghép lại đúng chữ Nhật và có trường đọc cho token chứa Hán tự; không phải duyệt phát âm/ngữ nghĩa bản ngữ.

Hai hoạt động mới của `agr-rice` có đủ12 ngôn ngữ, nguồn đáp án hiện hành và được chọn bởi bộ lọc `lessonId`/`level` của component thực. `AgricultureCourse.tsx` gọi component này trong reader. Đây là đối chiếu mã nguồn, chưa chạy React/device.

Phát hiện fixture kiểm thử cũ dùng `agr-rice` làm bài không có hoạt động. Sau bổ sung, giả định đó không còn đúng. `test-sentinel-patch.json` đề nghị đổi đúng một literal sang `__no_agriculture_reader_checks__`, giữ nguyên hai hoạt động và phép thử ẩn nội dung sai bài. Điều phối viên áp dụng, không thuộc quyền sửa file chung của luồng này.

Các giới hạn khác đã ghi riêng: thân đoạn bài hiện render `p.textJa` bằng Text thường; chưa chứng minh furigana cho toàn thân bài. Trình thi trong mã đã xem render `stemJa`, `optionsJa`, `optionReasonsJa`; không có bằng chứng ở kiểm này về12 ngôn ngữ của toàn bộ ngân hàng câu. Không biến2.892 bản dịch bài học thành số bản dịch câu hỏi.

React, react-test-renderer và esbuild không tìm được trong dependency runtime đã chỉ định; không cài mới. Không báo host test, thiết bị thật, âm thanh, quyền hình hoặc thời lượng đạt. Mọi cờ chấp thuận vẫn false.
