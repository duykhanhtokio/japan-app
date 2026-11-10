# Cụm sàng lọc nhanh001 — 1.000 bài

**Đã sàng lọc1.000 bài/192.000 trường ở12 ngôn ngữ. Không cộng vào448 bài đã rà ngữ cảnh đầy đủ.**

| Kết quả | Số lượng |
|---|---:|
| Bài được sàng lọc | 1.000 |
| Trường câu/gợi ý được kiểm tra | 192.000 |
| Tín hiệu nghi vấn ban đầu | 251 |
| Quyết định cũ còn hợp lệ được tái sử dụng | 251 |
| Tín hiệu mới/lỗi thời cần giao rà | 0 |
| Lỗi mới xác nhận / sửa mới | 0 / 0 |
| Mục hoãn / tràn chưa xử lý | 0 / 0 |
| Tín hiệu sau lần chạy cuối | 251 |
| Tín hiệu chưa có quyết định hợp lệ | 0 |

Các tín hiệu còn hiện không tự đồng nghĩa lỗi: độ ngắn, chữ Nhật được trích dẫn, biến thể chữ Hoa và câu giống nhau có thể hợp lệ.251 quyết định lịch sử đều khớp hash nguồn và đích hiện tại, bao gồm đủ các loại tín hiệu đang được đánh dấu. Vì không có tín hiệu mới/lỗi thời nên không khởi chạy AI để đọc lại những mục đã có quyết định hợp lệ. Không tự đánh dấu nguồn hoặc bản dịch là đã duyệt bản ngữ.

selection.json chọn đúng1.000 ID chưa được rà trong queue tại baseline3193eda36; initial/ và final/ giữ riêng số liệu trước/sau. Không thay đổi bản dịch ở cụm này. report.json và reused-decisions.json ghi quyết định được tái sử dụng và hash6 sổ xử lý nguồn.

Giới hạn: sàng lọc tự động không phát hiện mọi lỗi ngữ nghĩa. Kết quả “không còn ứng viên chưa xử lý” chỉ áp dụng251 tín hiệu của các quy tắc này; không phải chứng nhận cả1.000 bài đều dịch đúng. Tổng rà ngữ cảnh vẫn448/7.128; còn6.680 bài chưa rà ngữ cảnh đầy đủ.

## Chạy lại

```bash
python3 scripts/audit-dialogue-translation-quality.py --scenario-ids docs/localization-workspace/fast-screen-cluster-001/selection.json --out /tmp/dialogue-screen-cluster-001
```

Cụm sau chọn1.000 ID pending chưa nằm trong các selection sàng lọc đã lưu. Chỉ giao mục mới/lỗi thời cho tối đa6 nhóm độc lập, mỗi nhóm tối đa30 mục/lượt, tối đa2 lượt trong cụm; đọc ngữ cảnh lân cận khi cần, trả packet quyết định/sửa đề xuất theo từng trường. Phải ghi riêng mục hoãn và phần tràn, không tính chúng đã được chấp nhận. Chỉ áp dụng sửa đã xác minh rồi chạy lại đúng selection một lần và chốt báo cáo. Không tạo receipt cả bài hoặc chạy lại rà đầy đủ12 ngôn ngữ trong quy trình sàng lọc nhanh.
