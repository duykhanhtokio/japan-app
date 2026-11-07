# Rà bản dịch sản xuất — AI 5/6, nhóm B

Ngày: 29/10/2026. Baseline: `b5f9bb2ee49a09c14c8dfbb8f39e589e6d50a11b`.

**Đây là rà soát bằng AI, chưa phải duyệt bản ngữ hoặc chuyên môn của con người. Chưa hoàn tất rà ngữ nghĩa toàn bộ nội dung.** Không sửa dữ liệu runtime, không thay cờ chứng nhận và không dùng dịch vụ dịch công khai.

## Phạm vi đã kiểm tra thực tế

Sáu ngôn ngữ: Hindi (`hi`), Bengali (`bn`), Nepali (`ne`), Burmese (`my`), Khmer (`km`), Tagalog (`tl`).

- Quét cấu trúc đủ **94.296 cặp trường Nhật–dịch**. Trong mỗi ngôn ngữ có 262 bài chính, 12 bài bổ trợ, 456 câu kiểm tra tuần, 1.200 câu đề gốc riêng biệt, 22 chú thích hình, 8 câu bổ trợ mới và 58 nhãn/prefix giao diện. Không thiếu trường hoặc entry; hash nguồn, thứ tự ID đoạn, thứ tự từ vựng, số lựa chọn/lời giải, số lưu ý và cờ bản nháp phù hợp.
- Đọc và so nghĩa thực tế **1.059 cặp trường riêng biệt**: toàn bộ 348 trường ứng viên lệch token số; đủ 48 cặp câu hỏi–ngôn ngữ của bộ thước cặp mới (288 trường); đủ bài bổ trợ thước cặp mới ở sáu ngôn ngữ (78 trường); toàn bộ 348 nhãn/prefix giao diện; 24 trường chọn lọc của bài 3R điện. Các phạm vi có giao nhau nên tổng không cộng thẳng.
- **93.237 cặp trường chưa được đọc ngữ nghĩa trong lượt này.** Chúng vẫn chờ rà dù đã đạt kiểm tra cấu trúc. Không suy ra đã duyệt trọn 262 bài hoặc 1.200 câu đề cho từng ngôn ngữ.

## Kết quả và đề xuất

`correction-proposals.json` có **105 đề xuất theo trường**: hi39, ne33, my3, tl26, bn2, km2. Mỗi mục có đường dẫn JSON chính xác, giá trị trước/sau, bằng chứng tiếng Nhật và hash. Đã kiểm tra cả 105 giá trị `before` còn khớp byte với bản baseline hiện có. Đây là đề xuất chưa áp dụng; root tích hợp bằng lớp sửa có kiểm soát.

Năm mục ưu tiên cao:

1. HI/NE bỏ số **5** trong chỉ dẫn kích thước bán kính **R5** của một lựa chọn đề cơ khí.
2. TL rút gọn lời giải **on-delay** và **off-delay**, làm thiếu quan hệ trạng thái input → thời gian chờ → trạng thái output.
3. TL đổi **2 V/div** thành **2 V** trong lời giải oscilloscope, làm mất đơn vị theo mỗi ô chia.

Các mục còn lại chủ yếu khôi phục đơn vị, số tham chiếu, giới hạn và bước giải thích đã bị dịch quá ngắn. Sáu bản dịch định nghĩa zero của bài thước cặp và đoạn zero-reset được làm rõ rằng **đóng hai mỏ thước**, không phải tắt nguồn thiết bị. Không thêm quy trình điều chỉnh mới.

348 ứng viên số đã được đọc từng trường và phân loại trong `numeric-candidate-dispositions.json`. Khác token số không tự động là sai: tháng viết bằng tên, số viết bằng chữ, ký hiệu phần trăm tương đương hoặc cách viết công thức khác đều có thể giữ nguyên nghĩa.

**Đính chính nhận định ban đầu:** `4÷80=5%` không sai toán, vì `0.05=5%`. Đề xuất Nepali chỉ mở rộng bước giải và giữ dấu `%` của `10%`; không ghi đây là lỗi phép tính. Tương tự, R5 là chỉ dẫn kích thước bán kính trên bản vẽ, không phải tên dụng cụ.

## Bằng chứng và phần còn lại

- `structural-summary.json`: hash input và số lượng chính xác từ toàn bộ lượt quét.
- `audit-ledger.json`: 1.059 trường thực đọc, hash từng cặp và 93.237 trường chưa rà.
- `numeric-candidate-dispositions.json`: quyết định cho đủ 348 ứng viên số.
- `correction-proposals.json`: 105 đề xuất; không thay đáp án tiếng Nhật hoặc vị trí đáp án đúng.
- `scan.py`: quét cấu trúc và ứng viên số có thể chạy lại; quét tự động không được tính là đọc nghĩa.

Cần tiếp tục các trường chưa rà; kiểm chứng thuật ngữ bằng tài liệu chuẩn ngôn ngữ khi có; người bản ngữ và chuyên gia đánh giá nội dung ở đúng vai trò. `nativeReviewed`, `domainReviewed`, `humanReviewed`, `releaseReady` đều giữ `false`. Không có kết luận kiểm thử thiết bị thật trong nhiệm vụ ngôn ngữ này.
