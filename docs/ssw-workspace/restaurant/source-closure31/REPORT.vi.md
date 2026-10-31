# Nhà hàng — tích hợp đủ sáu gói nguồn31, 2026-10-31

Đã tích hợp tiếng Nhật từ cả sáu gói vào 92 bài: 132 giải thích bổ sung, 190 câu luyện tập riêng, 144 lượt hình và 1 thuật ngữ. Giữ nguyên 120 bài/984 câu gốc, bản dịch gốc, hash hoàn thành và dịch vụ lưu tiến độ. Đây là tích hợp toàn bộ các gói đã soạn, chưa phải nghiệm thu toàn ngành.

Crosswalk có đủ639 mục phân cấp/271 trang nguồn,1475 fact theo bằng chứng tác giả từng gói. Không coi639 mục là639 kiến thức độc lập và không nhận rằng phiên tích hợp đã tự đọc lại hình của271 trang. Còn6 mục có gap, gồm sai khác vị trí nguồn「うぐいす骨」, giới hạn quyền/hình nhận diện một số biểu trưng, phạm vi thực hành cứu nghẹn và số liệu norovirus cũ chưa rõ năm/mẫu. Hai mục blocked, bốn mục ghi gap cụ thể. Không tự đóng chúng để đạt100%.

Đã rà các phần bổ sung/câu hỏi mới, kiểm byte/hash/kích thước ảnh và các gói nguồn, xem4 contact sheet86 hình mới; sửa cách cắt ảnh ghép để hình nhận diện không lộ ô khác. Thêm câu riêng về bao bì bẩn, giữ sự phân biệt giữa số liệu giáo trình, điều kiện cụ thể và yêu cầu hiện hành. Xác minh cập nhật dị ứng qua CAA và hiệu lực tiền cũ qua MOF; chi tiết integration-review.json.

Bản dịch mới được tích hợp theo từng mục đầy đủ và hash đúng. Số mục hiện có: vi=83, en=83, id=0, zh-CN=0, zh-TW=0, hi=53, bn=53, ne=0, my=0, th=30, km=0, tl=0. Còn thiếu ở cả12locale; mục cũ/sai hash không bị tự gắn lại. Nội dung tiếng Nhật đầy đủ hơn phạm vi bản dịch. Chưa hoàn thiện furigana toàn văn phần mới.

PASS:184 trường hợp React/RNW SSR, chặn nội dung/hash/bản dịch cũ; giữ ngân hàng và tiến độ;10 nhóm lưu/khôi phục; JLPT10/10. Chromium thực kiểm8 trường hợp cắt ảnh ở4viewport,0pageerror; ảnh chụp trong browser-qa. Không có fullExpo/native/thiết bị thật hoặc chứng nhận chuyên môn/bản ngữ/thời lượng30phút. Thêm nội dung có thể làm ngày dài hơn; thời lượng thực và cân đối sau bổ sung vẫn cần kiểm với người học.

Điểm tiếp tục: hoàn thiện bản dịch mới và furigana; xử lý6gap theo bằng chứng; kiểm tương tác toàn khóa/Expo/thiết bị và thời lượng. Chỉ tuyên bố lưu remote sau commit, push, fetch và xác minh.
