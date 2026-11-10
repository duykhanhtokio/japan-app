# Quy trình sáu AI làm nhiều nhóm liên tiếp trong một phiên

Chỉ thị người dùng ngày2026-11-02, thay cho cách bàn giao sau một nhóm nhỏ.

## Nhịp thực hiện

Mỗi AI nhận một danh sách có thứ tự gồm ít nhất ba nhóm công việc độc lập, có nguồn và tiêu chí nghiệm thu cụ thể. Thực hiện nhóm1→kiểm tra phạm vi thay đổi→nhóm2→kiểm tra→nhóm3. Không dừng để hỏi tiếp tục, báo cáo cuối hoặc chờ điều phối sau nhóm đầu tiên. Đây là khối lượng giao việc, không phải bằng chứng hoàn thành.

Vướng mắc cục bộ được ghi kèm nguồn, đơn vị kiến thức và nguyên nhân; chuyển sang nhóm có đủ điều kiện. Chỉ chặn cả luồng khi có lỗi kỹ thuật chung, mất truy cập, giới hạn dịch vụ hoặc không còn đơn vị nào có thể xử lý an toàn. Không hạ tiêu chuẩn nguồn để đạt số lượng.

## Phạm vi mặc định của sáu luồng

1. Nông nghiệp: ba luồng nghiệm thu/sửa thực tế về điều kiện kỹ thuật, trùng năng lực và hình/khối lượng ngày học. Không đọc lại các ngân hàng đã rà chỉ để tăng số đếm.
2. Sản xuất: ba cụm kiến thức nguồn khác nhau; dự kiến khoảng tám câu có ý nghĩa mỗi cụm, kèm giải thích và12ngôn ngữ. Không dùng chỉ tiêu để tạo câu trùng hoặc bịa kiến thức.
3. Thực phẩm: ba cụm có nguồn, mỗi cụm có nội dung dạy và bài vận dụng thật, dịch12ngôn ngữ/furigana và liên kết đúng ngày học.
4. Nhà hàng: ba cụm năng lực còn thiếu, dự kiến khoảng tám câu mỗi cụm, furigana và12ngôn ngữ. Giữ riêng các fact không thuộc phạm vi câu hỏi.
5. Khách sạn: ba bài Nhật ổn định được hoàn thiện trọn vẹn12ngôn ngữ theo đúngrevision; không tính bản dịch cũ hoặcfallback.
6. Xây dựng/điều dưỡng: ba đơn vị bổ sung có nguồn, gồm ít nhất một đơn vị mỗi ngành, giữ hợp đồng biên soạn riêng và dữ liệu người học.

## Kiểm tra và lưu

Các nhóm cùng luồng thực hiện tuần tự; sáu luồng làm song song, không yêu cầu rà chéo nội dung giữa các AI. Mỗi AI tự kiểm nguồn, ngữ nghĩa, phiên bản và đường tích hợp của mình. Điều phối kiểm tra tập hợp tệp, phạm vi, tính nhất quán và lưu từ xa.

Tái sử dụng nguồn đã đọc và công cụ kiểm tra; chỉ kiểm lại phần thay đổi/phụ thuộc. Không chạy lặp các bộ kiểm tra không đổi. Kiểm hồi quy chung một lần cuối nếu cần. Phân biệt kiểm cấu trúc, ngữ nghĩa, render, thiết bị thật và thời lượng đo được.

Lưu từ xa các đơn vị hoàn chỉnh theo đợt hợp lý, không chờ các đơn vị bị chặn. Bảo toàn công việc chưa xong của luồng khác. Chỉ báo đã lưu sau khi đối chiếu commit/tệp và đạt WORK PERSISTENCE PASS. Không coi ba nhóm là giới hạn: khi còn thời gian và đơn vị có thể xử lý, tiếp tục danh sách đã giao; không tự mở phạm vi không được yêu cầu.

Giữ cập nhật ngắn ở ranh giới nhóm. Báo cáo cuối nêu kết quả thực tế, bằng chứng kiểm tra, commit đã xác minh và phần còn tồn; không trình bày chỉ tiêu như kết quả.
