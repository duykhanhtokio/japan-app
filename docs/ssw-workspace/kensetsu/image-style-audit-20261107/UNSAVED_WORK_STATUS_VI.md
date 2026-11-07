# Trạng thái tổng hợp phần chưa lưu — 2026-11-08

## Bản Mac được người dùng cung cấp

- Nhánh: `recovery/jlpt-n3-n1`.
- HEAD: `77bf2806662ab656e086e48098594461bf04b781`, ngày2026-10-30.
- Thiếu registry ảnh kỹ thuật, phần addedFigures và lời gọi studyDayForScope trong màn hình.
- Không có output LISTEN trên8081–8089 trong kết quả người dùng gửi; chưa xác định nguồn bundle của Simulator.
- Nhiều ảnh QA/asset, cấu hình, mã nguồn và thư mục ngành mới chưa lưu; chưa có bytes thực tế của các thay đổi Mac để tích hợp an toàn.

Các con số sau là số dòng trạng thái, không phải tổng tệp đệ quy trong thư mục chưa theo dõi:

- tracked configuration entries: 1
- tracked app asset entries: 5
- tracked QA/evidence image entries: 197
- tracked source entries: 2
- untracked path entries (directories may contain multiple files): 23

## Phần có đủ dữ liệu trong phiên này

- Báo cáo rà style toàn bộ366 tệp ảnh tại mốc mới, đã sửa cách diễn đạt331 tệp đăng ký so với ảnh hiển thị thực tế.
- Danh sách174 ứng viên sửa style và đường dẫn bài học suy ra từ mã mới; ghi rõ chưa xác nhận trên Mac.
- Công cụ `scripts/recovery/collect-unsaved-work.py` gom tất cả trạng thái staged, unstaged, untracked, rename và delete, kèm HEAD blob gốc để đối chiếu.
- Công cụ chỉ ghi gói sao lưu ngoài repo, không upload/commit/push, không sửa nguồn, stash/reset/checkout, cài phần mềm hay dừng tiến trình. Tệp ignored không nằm trong gói Git-visible.
- Mỗi phần gói không quá48MiB, có manifest và SHA-256; cần ghép các phần theo thứ tự trước khi mở ZIP.
- Đã kiểm tra fixture có thay đổi staged+unstaged, rename, delete, tệp nhị phân, symlink và tên chứa khoảng trắng. Ghép multipart và so từng byte đạt; Git state gốc giữ nguyên.

## Còn cần để hoàn tất lưu phần Mac và kiểm app

1. Chạy công cụ trên checkout Mac, nhận CAPTURE PASS và gửi MANIFEST.json cùng toàn bộ partNNN.
2. Đối chiếu HEAD/base, staged/working và nhánh GitHub mới. Không đẩy nguyên chồng tệp cũ đè bản mới; không đưa gói backup vào bundle app.
3. Tích hợp theo nhóm mã/dữ liệu/asset, kiểm tra rồi lưu từng nhóm lên recovery/jlpt-n3-n1 và xác minh từ remote.
4. Cập nhật checkout Mac bằng thay đổi đã đối chiếu, xác định đúng Metro/bundle, mở bài107 và kiểm ảnh thực tế.
5. Chỉ sau bước mẫu mới phân loại toàn bộ phần xây dựng theo hiển thị thực tế và dựng ảnh2.5D theo nhóm.

Chưa tuyên bố phần Mac đã được lưu hoặc Simulator đã được cập nhật.
