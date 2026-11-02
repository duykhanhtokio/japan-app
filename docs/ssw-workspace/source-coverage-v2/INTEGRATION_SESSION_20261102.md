# Nhánh tích hợp của lượt hoàn thiện bảy ngành

Đích lưu của phiên này: `origin/integration/ssw-completion-f8119-20261102`.
Đích hợp nhất cuối: `origin/recovery/jlpt-n3-n1`.

Nhánh phục hồi được một phiên ngoài cây sáu tác giả hiện tại cập nhật đồng thời. Cửa expected-SHA đã chặn lần xuất bản đợt Thực phẩm vào nhánh đang đổi; không force-push và không ghi đè thay đổi của phiên kia. Nhánh riêng được tạo từ `acee939e3152679797819fa4c729f6de5e47bfa2`, gồm toàn bộ công việc đã lưu trước đó và bổ sung Sản xuất56 từ nhánh phục hồi. Các tác giả chỉ sửa tệp cục bộ; điều phối giữ quyền xuất bản.

Trong checkout này, tên nhánh cục bộ vẫn là `recovery/jlpt-n3-n1`, nhưng upstream được đặt rõ thành `origin/integration/ssw-completion-f8119-20261102`. Vì vậy phải đọc upstream thực tế, không suy ra đích lưu từ tên nhánh. Đã thêm refspec riêng để fetch đúng nhánh. Cửa `check-work-persistence.mjs --paths ...` tiếp tục kiểm SHA thật được remote quảng bá và đúng các tệp hoàn chỉnh; các tệp đang làm của luồng khác được giữ.

Điều phối dùng index tạm cho từng tập tệp đã đóng băng để tính tree xuất bản. Index làm việc chính và thay đổi chưa hoàn tất không bị reset/stash/clean. Chỉ tệp có SHA đúng manifest được thêm vào tree; tree qua GitHub phải trùng tree tính từ index tạm. Khi cập nhật ref thành công mới fetch/fast-forward và kiểm persistence.

## Phạm vi đồng thời đang ghép

- `a099fa765c4d70b566af6da82b125c68c8209e34` bổ sung Nông nghiệp và Thực phẩm cùng lúc với các tác giả hiện tại. Hai tác giả phụ trách ghép cấu trúc, giữ biểu đạt/bản dịch/receipt gốc và tự dùng phạm vi nguồn họ đã đọc để tránh đếm trùng. Không coi tích hợp kỹ thuật là rà ngữ nghĩa chéo.
- Bộ Thực phẩm55 từ upstream được chuyển sang namespace `58-upstream-a099`; bộ55–57 của phiên này giữ nguyên. Các fact trùng có alias/provenance, không cộng covered mới. Bản gốc và receipt vẫn truy vết được.
- Bộ Nông nghiệp có các fact/check trùng được hợp nhất theo ID và giá trị nguồn; bổ sung khác phạm vi vẫn được giữ. Không lấy tổng hai danh mục làm số ý duy nhất.
- Các cập nhật mới hơn trên nhánh phục hồi, gồm mốc `ea1b43c95de1ca19b0a1385c0ddc4c1c1a335270`, vẫn được giữ nguyên trên nhánh đó. Phải đối chiếu và ghép ở bước tích hợp cuối, không tuyên bố đã đưa toàn bộ phần đó vào nhánh riêng.

## Trạng thái tiếp tục

Nhà hàng và Khách sạn đã gặp lỗi dịch vụ “Selected model is at capacity” trong lúc soạn lượt tiếp. Nội dung cục bộ và các packet đã xong được giữ; không báo hai tác giả đó còn chạy. Điều phối tiếp tục phần tích hợp có đủ hồ sơ, không tự bật cờ bản ngữ/chuyên môn/thiết bị/thời lượng.

Các tệp `agriculture/root-v6/source10-*` là gói tác giả của điều phối cho phạm vi riêng AGR-S1 PDF10. Ba bài tự kiểm đủ12ngôn ngữ và12mục nguồn đã tự rà, nhưng gói chỉ được tính vào sổ chuẩn sau khi gắn nguyên giá trị vào Reader, giải quyết con trỏ/hash và kiểm actual host. Những trang11–15 mà điều phối đã đọc chưa được gói này đóng.

Đây là checkpoint tích hợp và đích lưu, không phải sổ nghiệm thu thứ hai. `registry.json` và một ledger chuẩn của mỗi ngành vẫn quyết định bằng chứng kiến thức. Mọi mẫu số còn mở giữ tỷ lệ `null`; nhánh tích hợp chưa phải phát hành production hoặc hoàn tất bảy ngành.
