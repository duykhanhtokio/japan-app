# Rà soát câu hỏi và truy xuất kiến thức — 31/10/2026

Phạm vi: Tokutei sản xuất **1号**, ba chuyên ngành. Đây là kiểm kê và hồ sơ đối chiếu; không sửa ngân hàng câu hỏi, mã chạy, bản dịch hay cách chấm điểm.

| Ngân hàng độc lập | Số câu thực đếm |
|---|---:|
| Kiểm tra tuần lõi | 456 |
| 30 đề mô phỏng tự soạn | 1.200 |
| Bổ sung completion37 | 80 |
| Nhận diện recognition38 | 61 |
| Bổ sung thước cặp | 8 |
| Bổ sung Boolean | 4 |
| **Tổng ID câu hỏi độc lập** | **1.809** |

Ba bộ tuyển chọn tham chiếu dùng lại **120 lượt chọn** từ ngân hàng hiện có; không cộng thành 120 câu mới. Có **900 câu đúng/sai (hai lựa chọn)** và **909 câu bốn lựa chọn**, tổng **5.436 phía lựa chọn**. Yêu cầu kiểm tra ba phương án nhiễu áp dụng cho câu bốn lựa chọn; không biến câu đúng/sai thành bốn phương án.

## Những kiểm tra đã thực hiện

- Kiểm kê đủ 1.809 câu: đường dẫn và JSON pointer, hash bản ghi, câu dẫn có overlay hiện hành, chỉ số đáp án, từng lựa chọn và lý do, kiến thức liên quan, bài học, thuật ngữ và trang nguồn. Tách hash của bản soạn khỏi hash PDF gốc.
- Các ID bài học và trang nguồn trong metadata đều phân giải được. Không có lỗi cấu trúc về chỉ số đáp án, số lựa chọn, số lý do hoặc ID trùng trong phạm vi kiểm tra.
- **Chỉ 12 câu có ID đoạn giải thích tường minh ngay trong dữ liệu**. 1.797 câu còn lại chỉ gắn cấp bài học; các gợi ý từ trùng thuật ngữ chưa được coi là bằng chứng ngữ nghĩa. Đã đọc và xác nhận riêng **19 liên kết đoạn–câu cho 9 câu** về thước cặp, Coulomb, tự giữ và định luật Ohm; đây là đối chiếu nội dung tự soạn, chưa chứng nhận PDF.
- Mới đọc thực sự **78 câu / 302 phía lựa chọn**: câu dẫn, tất cả lựa chọn, đáp án và mọi lý do hiện có. Không gọi việc lập danh mục 1.809 câu là đã đọc ngữ nghĩa toàn bộ.
- Tính lại độc lập **63 bài số học** bằng phân số chính xác: đổi đơn vị, đọc thước, dung sai, tỷ lệ, ứng suất, mạch lý tưởng, máy biến áp, điện lượng, nồng độ, mật độ dòng và nội suy tuyến tính của mô hình giấy. Kết quả và đơn vị của đáp án khớp.
- Kiểm lại **4 câu Boolean**, bao gồm đủ tám tổ hợp đầu vào và phản ví dụ của các đáp án nhiễu. PASS.
- Dữ kiện số cho 63 trường hợp nằm trong chính câu hỏi tự soạn. Điều này **không chứng minh** mọi công thức, giới hạn áp dụng và mô hình đã được đối chiếu đúng với đơn vị kiến thức trong PDF. Không coi giá trị bài tập là cài đặt thiết bị hay giới hạn vận hành thật.

Hồ sơ AI cũ ở `batch35-continuation/exam-review/review-union.json` ghi nhận lũy kế 1.200 câu mô phỏng và 3.000 phía lý do qua nhiều đợt. Đây là bằng chứng lịch sử riêng, không phải 1.200 câu mới đọc ở lượt này và không thay thế xác nhận từng đơn vị nguồn.

## Các việc cần sửa hoặc quyết định

### 1. Lý do đúng/sai của từng phương án: 29 câu / 116 phía

- **8 câu thước cặp** `mfg1-caliper-supplement-check-01` đến `08` có một giải thích chung, chưa có lý do riêng cho từng phương án.
- **21 câu nhận diện cơ khí** `mfg38-mechanical-q001` đến `q021` lặp cùng một lời giải ở cả bốn phía. Câu vẫn có thể chấm đúng, nhưng hồ sơ chưa giải thích sai lầm riêng của từng phương án nhiễu.
- Đã chuẩn bị **116 bản nháp lý do riêng theo từng phía** trong `option-rationale-backlog.json`, gắn exact ID, hash, chỉ số, nội dung lựa chọn và yêu cầu xác minh. **Chưa áp dụng vào app.** Các bản về hình còn cần đối chiếu đúng PNG/SVG; tất cả còn cần duyệt ngữ nghĩa, đối chiếu nguồn và cập nhật 12 ngôn ngữ theo hash mới.

### 2. Trùng hoặc gần trùng giữa tuần và đề mô phỏng

Không phát hiện câu dẫn trùng tuyệt đối sau chuẩn hóa; điều này không đồng nghĩa không có trùng nội dung. Đã xem năm cặp gần trùng:

| Cặp câu | Kết luận và hướng xử lý |
|---|---|
| `mfg1-electrical-formative-006` ↔ `mfg1-electrical-mock-03-practical-q01` | Cùng thước cặp 18 mm + 0,45 mm, cùng nhiệm vụ và đáp án 18,45 mm. Đề nghị thay một câu bằng nhiệm vụ khác thật sự, không chỉ đổi số hoặc tên. |
| `mfg1-electrical-weekly-04-q07` ↔ `mfg1-electrical-mock-08-practical-q02` | Cùng hỏi nguyên nhân tự giữ sau khi nhả nút khởi động. Đề nghị chuyển một câu sang theo dõi trạng thái hoặc điều kiện giải phóng giữ trong mô hình giấy. |
| `mfg1-electrical-weekly-06-q07` ↔ `mfg1-electrical-mock-09-practical-q03` | Cùng giữ điện tích/môi trường, tăng khoảng cách ba lần và hỏi tỷ lệ lực 1/9. Đề nghị thay một câu sang cách suy luận khác. |
| `mfg1-mechanical-weekly-03-q05` ↔ `mfg1-mechanical-mock-09-practical-02` | Cùng năng lực đọc micrometer nhưng số liệu khác. Quyết định đây là ôn tập có chủ đích hay cần đổi nhiệm vụ; không xóa chỉ vì độ giống chuỗi. |
| `mfg1-surface-weekly-06-q06` ↔ `mfg1-surface-mock-01-practical-q07` | Cùng V/I và đổi mV/mA nhưng dữ kiện khác. Quyết định mục tiêu củng cố hay thay bằng sai số/đơn vị/điều kiện áp dụng. |

Bộ phát hiện gần trùng chỉ xét các câu cùng bài học ở hai ngân hàng khác nhau; không tuyên bố phát hiện mọi trùng ngữ nghĩa trong 1.809 câu.

### 3. Liên kết nguồn → kiến thức → đoạn dạy → câu hỏi

`source-page-question-edges.json` chứa **5.235 cạnh trang–câu** với khóa trang `mfg39-{specialty}-pNNN`. `atomicUnitId` còn null và trạng thái còn `page_metadata_only_atomic_support_pending`: người tích hợp phải gắn đúng đơn vị nguồn rồi kiểm nội dung. Không được đổi thành “đã bao phủ” chỉ vì hai đối tượng trỏ cùng trang.

Mỗi câu còn cần chứng minh kiến thức được dạy đủ để suy ra đáp án và bác bỏ từng lựa chọn; kiểm điều kiện/đơn vị/công thức; phân biệt dữ kiện nguồn và ví dụ giấy tự tạo. Các trang bảng, hình, thang đo không được đóng bằng trích văn bản đơn thuần.

## Tái kiểm tra

```bash
python docs/ssw-workspace/manufacturing/source-closure-20261031/assessment/audit.py
python docs/ssw-workspace/manufacturing/source-closure-20261031/assessment/check.py
```

`audit.py` chỉ đọc ngân hàng và tạo sổ kiểm kê. `check.py` kiểm hash đầu vào, hash từng nhận xét đã đọc, bài tính, bảng chân trị, 116 phía nháp lý do và 19 cạnh dạy–kiểm tra. Bộ chuẩn hóa phương án giữ dấu thập phân, dấu âm/dương và toán tử; không coi `1.25 s` và `12.5 s`, hay `A+B` và `A·B`, là phương án giống nhau.

Kết quả: **PASS trong phạm vi kiểm kê và kiểm toán số học đã nêu**. Chưa nghiệm thu toàn bộ ngữ nghĩa 1.809 câu, chưa chứng nhận độ trung thành của từng câu với PDF, chưa có xác nhận chuyên gia/người bản ngữ/thiết bị. Các cờ đó giữ false.

## Cập nhật dấu vết sau thay phiên bản mã hóa PNG

Sau thay phiên bản mã hóa bốn PNG từ SVG giữ nguyên, đã tái tạo sổ câu hỏi và 5.235 cạnh trang–câu. **Đúng chín câu nhận diện đo lường** đổi hash do metadata hình; câu dẫn, các lựa chọn, đáp án, lý do và liên kết dạy học so với bản kiểm kê trước vẫn giống nhau. Cả chín câu nằm **ngoài tập 78 câu đã đọc ngữ nghĩa**, nên không chuyển nhận xét cũ sang một bản ghi hình mới và không cộng thêm lượt đọc. Số lượng vẫn 1.809 câu / 5.436 phía; kiểm tra đạt PASS. Chi tiết: `asset-revision-refresh.json`. Việc cập nhật dấu vết này không chứng nhận PNG mới tương đương trên thiết bị hoặc được chuyên gia duyệt.
