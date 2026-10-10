# Tiếng Nhật chăm sóc: trang 203–208

Đợt 2026-10-10 tiếp tục phần tiếng Nhật: mục mở đầu, cơ thể, tư thế, bệnh/triệu chứng và từ di chuyển. Đã đọc text và xem cả sáu trang (PDF 205–210), gồm ô từ bị thiếu do font trích xuất và các hình. Nguồn chuẩn cùng SHA256 997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54; không đưa PDF/chữ trích xuất/ảnh nguồn vào git.

## Kết quả

110 bản ghi từ đã có trong kho 369 mục; không thêm bản sao. Nhật và kana đối chiếu khớp. 16 nghĩa app không trùng chữ với nghĩa ngắn trong ledger: chẳng hạn “ngồi dậy hoặc nâng phần thân trên từ tư thế nằm” thay “ngồi dậy”; đã rà tương đương theo ngữ cảnh ở mức AI và inventory lưu đúng chữ app để kiểm runtime. Không coi sự khác chữ này là tự động sai, cũng không coi so chuỗi là duyệt chuyên môn/bản ngữ. runtimeDays mới lấy theo đúng ID từ trong bài; không dùng hợp các ngày của từ cùng tên như bằng chứng mọi ID đều xuất hiện.

Thêm 12 ý: ba về nhãn vùng cơ thể, hai về tư thế/cách gọi, bốn về từ quan sát–triệu chứng, ba về di chuyển/dụng cụ/động từ. Tổng 536 ý/87 mục/87 ca. Làm rõ khóe trong/đuôi mắt, thắt lưng/lưng, bên ảnh hưởng/không ảnh hưởng, tên chuyên môn/cách nói tư thế, buồn nôn/nôn, mồ hôi/sốt, chuyển giữa chỗ tựa/di chuyển và ngữ cảnh cài phanh/chống gậy. Các từ kỹ thuật có kana kèm theo; kho từ hiện có vẫn hiển thị trường cách đọc.

216 bản ghi nối từ/ý/nhãn/quan hệ với app. Trang 203 là chỉ dẫn nhóm nội dung; mục đoạn văn/đáp án là tổ chức sách, không bài kiến thức mới. Không tái tạo hình, câu thi/hội thoại nguồn hoặc thứ tự lựa chọn. Chưa chứng nhận mọi chi tiết toàn sách đủ, tỷ lệ toàn sách null.

## Kiểm tra thực hiện

- Append audit giữ nguyên 524 ý cũ, mọi ID/ca/lịch; content.json (369 từ, 12 đề/360 câu), daily-plan.json và KaigoCourse.tsx giữ nguyên byte.
- Validator mới: 216 bản ghi, 110 bản ghi từ, kana/nghĩa app, đúng ngày theo ID, revision và 5 đối chứng lỗi đạt. Daily plan/5 đối chứng và JLPT lock 10/10 đạt.
- RNWeb tập trung từ component thật: 32 ý ở bốn mục gồm đủ 12 mới, 110 từ/kana/nghĩa ở bài nền 8/15, 12 đề trong danh mục. Tự trả lời ẩn trước lần thử, hiện sau đối chiếu và phục hồi câu trả lời/trạng thái sau tải lại.
- HTML lọc 216 dòng; 390×844, 768×1024, 844×390 không tràn ngang, 0 pageerror; đã xem ba ảnh. Lần kiểm đầu dùng ngày 8 khi chưa chọn nhóm nền nên timeout; sửa harness theo group trong daily plan và chạy lại thành công. Không sửa app để làm kiểm tra đạt.
- Sàng 797 trường với text-layer nguồn: 0 trùng cửa sổ chuẩn hóa 60 ký tự. Chỉ sàng chữ, không chứng nhận quyền hoặc độc lập ngữ nghĩa.

Lưu ý phiên bản tự giải thích: contentRevision của bốn mục bổ sung thay đổi theo thiết kế hiện hành. Câu tự trả lời từng lưu dưới revision cũ của các mục đó không tự hiện ở revision mới; khóa cũ không bị xóa. Kiểm tải lại ở trên chứng minh lưu/tiếp tục revision mới, không chứng minh di trú câu trả lời cũ. Tiến trình bài nền và đề dùng dữ liệu/fingerprint giữ nguyên.

Runtime SHA256: `0eb0a98c9c9870ade63cdeb4c615703c0a7f5659f7e53e82b8e7c507df505e82`. Evidence và ảnh ở `../runtime-tests/2026-10-10-care-japanese/`.

## Giới hạn và bước tiếp

Kiểm bổ sung: [CPSA về シルバーカー](https://www.sg-mark.org/product/no-0075/), [MHLW về 熱中症](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000170795.html), [NHS về loét tì đè](https://www.nhs.uk/conditions/pressure-sores/). Một trang KokUSen gặp lỗi giải mã, không dùng làm bằng chứng đã đọc đầy đủ. Các liên kết chỉ hỗ trợ làm rõ thuật ngữ, không mở rộng thành chỉ định điều trị hoặc hướng dẫn thao tác.

Lịch giữ 144 ngày × 30 phút, chưa đo tải học thực tế. Human/domain/native/rights/release false; harness có expo-image shim, chưa full Expo Router hoặc thiết bị native. Điểm nguồn trang 195 và hình cũ 31/40/72 còn theo báo cáo trước. Bước tiếp là 209–212: mục tiêu đọc hiểu/nghe hiểu di chuyển, tạo ví dụ mới độc lập sau đối chiếu các bài có sẵn.
