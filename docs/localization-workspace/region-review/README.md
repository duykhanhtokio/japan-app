# Rà hội thoại theo region

Áp dụng yêu cầu chuyển từ phân lô rải nhiều vùng sang hoàn tất từng region. Cả6AI tập trung một region đang làm, chia nhóm thành phố/bài độc lập; không kiểm chéo ngữ nghĩa. Quyền ghi file lô dịch phải độc quyền dù một lô chứa bài của nhiều nhóm. Cân lại việc chưa đọc trong cùng vùng trước khi chuyển vùng.

Bắt đầu đóng phần Chubu còn dở, rồi Kinki; các vùng tiếp theo theo plan.json. Đây là thứ tự triển khai, không tuyên bố đã khởi chạy worker trong lượt kiểm kê. Mỗi lần tiếp tục phải tính lại số liệu từ queue chuẩn; plan.json chỉ là snapshot.

Sàng lọc nhanh đã phủ cả8vùng. Rà ngữ cảnh đủ12ngôn ngữ hiện chỉ có448 bài:Chubu439 vàKinki9. Chưa region nào hoàn tất rà sâu. Chỉ chốt vùng khi mọi bài có receipt hiện hành; vẫn phân biệt nguồn chưa rõ, bản ngữ, phát âm và thiết bị. Không làm lại các bài đã có bằng chứng hợp lệ.
