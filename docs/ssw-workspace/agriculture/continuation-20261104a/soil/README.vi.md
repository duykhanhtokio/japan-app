# Đất, phân bón và nước — tự rà theo nguồn, 2026-11-04

Từ baseline `bfd4cdeaa5b4abced2c7de2a847f218f57a435b9`, xử lý 65 ID được giao: đề xuất 59 `covered_ai`, 6 `partial`. Không sửa trực tiếp file dùng chung; `packet.json` chờ điều phối tích hợp có bảo vệ hash.

Tám nhóm liên tiếp: dụng cụ tưới/đất; chức năng dưỡng chất và thoát nước; các hàng pH còn thiếu; máy kéo và máy công tác; đầy đủ tên phân bón; tỷ lệ sét và thử nắm đất; các điều kiện bổ sung; chỉ số nước đất và thuật ngữ.

Hai hoạt động mới có Nhật, ruby, 24 cặp dịch tự rà AI và phụ thuộc bản Nhật hiện hành. Hoạt động pH yêu cầu đủ các hàng cây trồng còn thiếu, không dùng câu so sánh hai cây để đóng toàn bảng. Hoạt động tên phân bón yêu cầu đầy đủ các tên và nhóm, không dùng câu NK/PK để đóng sáu tên hóa thành. Tên kỹ thuật trên nhãn được giữ bằng tiếng Nhật để người học đối chiếu; lời dẫn và phân loại được dịch riêng từng ngôn ngữ.

Sáu mục còn thiếu một phần được ghi chính xác trong packet: các đặc điểm và tỷ lệ của đất đen; toàn bộ kích thước luống; bốn ứng dụng máy kéo; nhận diện hình cấu trúc đất; toàn bộ ví dụ nhóm vi sinh/vật đất; kết hợp tiêu chuẩn bón theo cây với chỉ số EC. Không coi câu đánh giá một phần là đủ cho toàn bộ năng lực.

`node .../soil/check.cjs` đạt `PASS_SOIL_PACKET`: 65 ID thuộc quyền, hash trước đúng, byte của hai PDF đúng, vùng nguồn tồn tại, 134 liên kết bằng chứng kiểm hash, 2 hoạt động và 24 cặp ngôn ngữ/ruby đúng cấu trúc. Kiểm toàn sổ và tương tác sau tích hợp thuộc điều phối. Không chứng nhận chuyên môn, bản ngữ, thiết bị thật hay thời lượng học. Giữ nguyên chỉ thị 35–55%.
