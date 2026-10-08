# 介護 — sáu đề thi thử, 2026-10-08

Chủ dự án yêu cầu nâng tổng lên6đề và áp dụng nguyên tắc đã duyệt. Kết quả:3đề kỹ năng,3đề tiếng Nhật,180câu. Thêm4đề độc lập/120câu/480giải thích lựa chọn/10hình tự tạo; giữ2đề cũ đã sửa ở revision02. Nội dung và giao diện dùng cho kiểm tra nội bộ.

| Nhóm | Số đề | Câu mỗi đề | Thời gian mỗi đề | Tổng câu |
|---|---:|---:|---:|---:|
| Kỹ năng | 3 | 45 | 60 phút | 135 |
| Tiếng Nhật | 3 | 15 | 30 phút | 45 |

## Nguyên tắc và sửa chính xác

- Mỗi đề kỹ năng giữ cơ cấu10nền tảng/6tâm–thân/4giao tiếp/20sinh hoạt/5phán đoán qua hình. Mỗi đề Nhật5từ/5hội thoại/5văn bản. Cấu trúc và thời lượng xác minh tại MHLW ngày2026-10-08: https://www.mhlw.go.jp/stf/newpage_000117702.html .
- Viết mới tình huống, đoạn đọc và lý giải từ kiến thức đã đối chiếu PDF276trang/hash997bf386; không dùng câu thi nguồn hay mẫu thay tên/danh từ làm đầu vào. Chỉ giữ sự kiện, thuật ngữ chuyên môn và kiểm định nguồn/trang. Không xuất bản PDF/OCR/hình nguồn.
- Sửa cách đọc theo ngữ cảnh:便べん,便秘べんぴ,空から/空気くうき/空腹くうふく,箱はこ,何をなにを, ngày–giờ,蝸牛かぎゅう, tư thế, chuyên ngành. Giữ mặt chữ từng token và phủkanji; chưa chứng nhận bản ngữ.
- Làm rõ xác nhận yêu cầu đã tới người nhận, phân biệt lời nói/quan sát/nguyên nhân chưa rõ, sắp thứ tự giải thích–đồng ý–hỗ trợ; bản Việt và lý giải4lựa chọn khớp sau sắp đáp án. Câu mục tiêu vệ sinh miệng và chức năng da được viết lại để tránh trùng nguyên văn câu bài học.
- Thu gọn các đáp án đúng quá dài khi có thể giữ đủ nghĩa; báo cáo chỉ số độ dài cả6đề, không xem độ dài là chứng nhận chất lượng phương án nhiễu.
- Cân bằng từng đề chênh tối đa1; toàn180câu có45đáp án đúng ở mỗi vị trí. Không3vị trí giống liên tiếp, không xáo lại khi resume.
- Các hình mới là thẻ dữ kiện/phán đoán tự vẽ, không hướng dẫn thao tác cơ thể. Sửa lỗi thiếuglyphNhật, render bằng Noto Sans JP có giấy phép trong dự án, xem trực quan cả10hình; kana trên ảnh, mô tảkanji cófurigana.

## App và dữ liệu cũ

Màn介護 có danh mục6đề dưới các bài theo tuần. Vào特定技能学習→介護 trong bảndevelopment/internal test, chọnMở đề. Bốn đề mới không thêm nhiệm vụ bắt buộc vào lịch56ngày. Hai đề cũ,54bài/270câu,8nhánh bổ sung, từ/NPC/lịch và fingerprint/lưu tiến trình không đổi; kiểm bằng hash baseline324508584c587e5e20638e120f092e6712e2ec2d.

Điểm luyện tập đúng1,sai/bỏtrống0; không quy đổi tỷ lệ đỗ chính thức. Đề Nhật tiếngNhật, dịchViệt chỉ sau nộp. Lưu câu/đáp án/thời gian riêng theo mỗi form và contentRevision, dừng khi rời bài, xác nhận nộp sớm, hết giờ tự nộp/khóa. Chỉ bảndev; chưa mởrelease.

## Kiểm tra đã thực hiện

- `check-kaigo-six-mocks.mjs`:180câu,720lý giải,15hình; đúng cơ cấu/furigana/liên kết/cân bằng;8negativecontrols bị chặn; khóa lưu riêng6đề; các phần cũ khớpbaseline.
- `check-kaigo-app-test.mjs`:79inputhash,74kiểm hành vi chấm/lưu/hết giờ/chữa bài; dữ liệu runtime không chứa source pointers.
- Kiểm chương/chiều sâu kiến thức, revision02của2đề cũ và tuần8snapshot PASS. TypeScript tập trung Kaigo PASS; không claim toànrepo. KhóaJLPT10/10 vàgitdiffwhitespace PASS.
- Chromium/RNWeb thực hiện cả6đề qua UI:180đáp án đúng, đúng45/45hoặc15/15, phục hồi câu2/đáp án/thời gian sau reload, hủy nộp không kết thúc, chữaViệt chỉ sau nộp.3kích thước393×852/768×1024/1280×800, không tràn ngang hoặcpageerror. KiểmactualKaigoCourse,session/storage,Royalcomponents/art; expo-image chuyển sangRNWebImage trongharness, chưa kiểmfullExpoRouter hoặcbinaryAndroid/iOS.
- Sàng exact30ký tự trên3187cửa sổ Nhật/giải thíchViệt:0trùng với text-layer nguồn. Đây chỉ là sàng chữ, không chứng minh độc lập ngữ nghĩa hay miễn trừ bản quyền.

## Giới hạn còn lại

Duyệt chuyên môn, bản ngữ, quyền và thử người học/native cònpending;releaseReady=false. Không tuyên bố đủ để chắc chắn đỗ hoặc tương đương đề chính thức. Lưu GitHub dùng atomic tree/commit vàlease trên nhánhrecovery/jlpt-n3-n1, đọc lại blob trước báo đã lưu; khôngforce hoặc sửaJLPT.

Để tái tạo bản xuất runtime: `node scripts/build-kaigo-test-content.mjs`, sau đó cáccheckers trên. Scriptauthor chỉ đóng gói120câu tự viết trong file, dùngfugashi/unidic-lite/cairosvg vàNotoSansJP đểfurigana/render; dictionaryreadings là ứng viên cần rà từngngữcảnh.

Remote có cập nhật đồng thời N2 exam 03: 4ee70e7e97a02652d87b62d302d9cfdf2648f56e, kế tiếp baseline 32450858. Đối chiếu 67 đường dẫn: không trùng 55 tệp Kaigo. Lưu patch Kaigo trên cây của commit mới này với lease, giữ toàn bộ cập nhật đó.
