# Sản xuất source61 — ba nhóm đánh giá và sổ truy ngược hiện hành

Đã xác minh lại SHA-256 và số trang của cả ba PDF, đọc chữ và xem ảnh toàn trang cơ khí89, điện165, bề mặt103. Chỉ lưu hash và hồ sơ diễn giải; không đưa PDF, chữ nguồn hay ảnh trang vào app/Git.

Ba nhóm có ba câu mới, mỗi nhóm một câu và12bản dịch trực tiếp từ Nhật:

1. Cơ khí: phân biệt hình thức của切断線, gồm dạng một chấm và các vị trí cần tô đậm. Tái dùng câu hình cắt đang có để kiểm vai tròハッチング. Không đóng ý hình dạngハッチング: câu cũ chưa kiểm riêng nét liền so với nét đứt.
2. Điện: kiểm đúng thứ tự xác nhận an toàn rồi reset tín hiệu bằng tay theo tài liệu. Không biến thành quy trình phổ quát cho mọi thiết bị. Tái dùng câu bản vẽ trong nhánh điện để kiểm vai trò想像線 chỉ vị trí chuyển động; vị trí đánh giá ở nhánh điện được ghi rõ, không nhận rằng mọi bài kiểm cơ khí đã có câu này.
3. Bề mặt: mô hình giấyP/Q/R mới kiểm độc lập ba vai trò溶質・溶媒・溶液. Tái dùng câu kết tủa để kiểm hiện tượng tạo chất rắn khó tan. Không lấy các ion/màu đã cho sẵn trong đề để đóng kiến thức phản ứng hoặc nhận diện màu riêng.

Sổ chuẩn148ý: covered_ai113→121; thêm8ý có đánh giá trực tiếp, tổng70. Còn26ý mở và1ý loại.574trang có census; chỉ35trang có inventory ngữ nghĩa hoàn chỉnh trong phạm vi trước. Không đóng thêm cả trang, không thay đổi mẫu số: sourceCoveragePercent=null, fullyCovered=false.

Giữ nguyên ba ngân hàng bài học Nhật, các câu cũ, ID/revision và dữ liệu học tập. Ba đề bổ sung có ID/revision riêng, chỉ hiện khi đoạn Nhật gốc và đoạn hiệu lực khớp chính xác; bản dịch sai phiên bản không fallback. Tất cả kanji mới trong câu/phương án/giải thích có cách đọc. Ngữ nghĩa36cặp câu mới được tự kiểmAI, không phải duyệt bản ngữ hoặc chứng nhận toàn bộ12ngôn ngữ.

Kiểm API hiện hành đạt3câu/36cặp dịch/315ca dữ liệu sai; chấm/lưu/mở lại và từ chối revision cũ đạt. Trình Attempt thật được mount qua harness:39luồng câu–ngôn ngữ, chọn đáp án, lưu/mở lại, giải thích ẩn trước nộp và hiện sau nộp đều đạt. Helper TypeScript strict0diagnostic. Canonical contract đạt. Harness dùng các adapter RN/storage/appearance/safearea/Royal; không nhận browser pixel, Expo production hoặc thiết bị thật.

Sổ truy ngược mới kiểm262bài lõi,856đoạn hiệu lực qua API Nhật/bản dịch hiện hành và3.144cặp bài–ngôn ngữ: không thiếu cấu trúc hoặc liên kết phiên bản trong phạm vi đó. Chỉ19đoạn có ứng viên bằng chứng khớp chữ trong sổ chuẩn,837đoạn cần tiếp tục đối chiếu từng khẳng định. Đây là danh sách chờ rà, không phải837đoạn được kết luận sai hoặc không có nguồn. Không bao gồm toàn bộ supplement/câu hỏi/âm thanh.262ngày có binding hình hiện hành, nhưng các file hình ngày chưa được materialize trong checkout này nên chưa kiểm byte/hiển thị thực tế. Số ký tự và nội dung bổ trợ không chứng minh thời lượng hoặc khối lượng tương đương.

Chưa nghiệm thu chuyên môn, bản ngữ, âm thanh, thực hành, thiết bị thật hoặc thời lượng người học. Không tự nhận lưu từ xa; điều phối phải commit/push/fetch và kiểm persistence.
