# Nông nghiệp — tiếp tục từ mốc 252 ý

Sáu phạm vi độc lập, tự rà nguồn, không kiểm chéo. Giữ nguyên toàn bộ252ý đã đạt,3duplicate và31hoạt động cũ.

Đã cập nhật74ý:71ý chuyển sang covered_ai và3ý giữ partial do bài đánh giá chưa đủ phạm vi. Đóng theo nhóm: lúa18, đất–phân–nước11, nhà kính18, rau–thu hoạch8, cây ăn quả16. Sổ chuẩn hiện323covered_ai,3duplicate,1.117ý candidate/partial. Mẫu số ý nguồn vẫn mở, sourceCoveragePercent=null; không báo bao phủ toàn nguồn.

Thêm2hoạt động thu hoạch/cây lấy củ ×12ngôn ngữ, có ruby và liên kết phiên bản. Hiện33hoạt động/396cặp dịch hoạt động. Giữ241bài/2.892cặp dịch bài,427câu tuần và800câu mock. Câu hỏi cũ chỉ được dùng làm bằng chứng khi tự kiểm đúng năng lực/phạm vi; không đọc lại để tăng số đếm.

Tích hợp tái sử dụng furigana từ token hiện hữu khi câu chữ, đoạn, cấp và hash khớp chính xác; trường hợp không khớp giữ chữ Nhật nguyên gốc. Đây là độ phủ có giới hạn, chưa phải furigana toàn bộ bài. Host React kiểm mã reader đã tích hợp, dữ liệu/logic lưu tiến độ thực:26luồng, bật/tắt dịch, hoàn thành, lỗi lưu/thử lại và3ca từ chối token sai phiên bản/cấp/không có cách đọc đều đạt. Fixture cho native/layout/artwork/storage được khai báo, chưa thay cho Expo/iOS/Android hoặc thiết bị thật.

Bộ kiểm sổ nguồn chuẩn, phụ thuộc hash và diff đạt.369lượt ngày có liên kết hình theo metadata, chưa kiểm pixel toàn bộ211asset, chưa đo thời lượng người học. Không thay thiết kế hoặc dữ liệu học của các ngành khác.

Ba partial mới: WATER-DECISION04/05 cần kiểm tình huống tưới theo mùa của2号; SOIL-BUILDING05 cần đánh giá quan hệ hữu cơ–vi sinh vật/mùn. GRAFT-ALIGNMENT03/GRAFT-TYPES03 và những mục nguồn có câu hỏi/hình chưa đủ được giữ mở. Giữ nguyên55quyết định biên tập cũ và35–55%.

Tiếp tục từ candidate/partial trong docs/ssw-workspace/source-coverage-v2/agriculture.json. Còn đối chiếu hai chiều đầy đủ, phân rã/kiểm kê nguồn, nội dung/đánh giá còn thiếu, ngữ nghĩa12ngôn ngữ, hình/âm thanh, nghiệm thu chuyên môn/bản ngữ, thời lượng và thiết bị. Lưu chỉ được xác nhận sau fetched exact-HEAD WORK PERSISTENCE PASS.
