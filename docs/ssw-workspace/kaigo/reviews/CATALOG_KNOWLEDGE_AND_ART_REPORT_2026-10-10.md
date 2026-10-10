# Báo cáo danh mục, kiến thức và minh hoạ Kaigo · 2026-10-10

Đã tổ chức lại danh mục Kaigo và tích hợp nội dung cùng minh hoạ mới trong mã app. Bản này gồm 176 buổi dự kiến × 30 phút = 5.280 phút (88 giờ kế hoạch), không phải thời gian hoàn thành đã đo trên người học.

## Kiến thức

Đã đọc chữ và kiểm hình toàn bộ 20 trang in liên tiếp 31–50 của nguồn Việt canonical SHA256 `997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54`. Đây là lượt rà sâu trên các trang từng xử lý, không phải 20 trang nguồn mới. Trang 41 là trang phân cách.

Thêm 6 đơn vị tự soạn, 18 ý giải thích, 6 tình huống kiểm tra và ngày học 171–176: lựa chọn vệ sinh tay; sức khoẻ và giới hạn nhân viên; theo dõi sau diễn tập; xác nhận cảm xúc; chuyển giao khi có vấn đề trí nhớ; ngữ cảnh đo dấu hiệu sinh tồn. Các khái niệm chính đã có; bổ sung này tăng chiều sâu thực hành, không được gọi là 18 kiến thức nguồn trước đây bị thiếu. Đối chiếu nguồn, liên kết điểm cũ và giới hạn diễn giải nằm trong [completeness-review-2026-10-10.json](completeness-review-2026-10-10.json). Kiểm chuỗi chuẩn hoá 45 ký tự không phát hiện trùng, nhưng không chứng nhận tương đương ngữ nghĩa hay quyền sử dụng.

Tổng hiện tại: 103 đơn vị kiến thức bổ sung / 585 điểm / 103 câu tự kiểm; 104 thẻ đọc; 369 thuật ngữ; 12 đề thi / 360 câu. Giữ nguyên byte của 5 tệp nội dung cũ: content, atomic-supplements, language-supplements, gap-supplements, depth-supplements. Không đổi mã bài, revision hay kho lưu đáp án cũ. Lịch tăng từ 170 lên 176 buổi; các báo cáo lịch sử 170 buổi vẫn là ảnh chụp thời điểm cũ.

## Cách học và danh mục

Có bốn mục: Học theo lịch, Ôn theo chủ đề, Thi thử, Tình huống bổ sung. Lịch 176 buổi tăng dần; mỗi trang tối đa 12 thẻ. Có 11 chủ đề với hướng dẫn ôn, tìm kiếm không phân biệt dấu tiếng Việt hoặc số ngày, trạng thái không có kết quả, giữ bộ lọc khi quay lại, và mở lại bài gần nhất sau tải lại. Tên kiến thức và tên thực hành được phân biệt trên thẻ. Bài nền liên kết đến các buổi bổ sung liên quan; bài bổ sung có đường về bài nền. JLPT UI không bị sửa.

## Minh hoạ tự sản xuất

Tạo 10 ảnh màu 2D mới bằng built-in image_gen, dùng một ảnh JLPT do dự án tự sản xuất làm tham chiếu phong cách duy nhất. Không truyền ảnh sách Kaigo, không chép hoặc vẽ lại hình nguồn. Nét mảnh, màu ấm, bóng mềm, nhân vật trưởng thành và trang phục phù hợp; không nhúng chữ. Chú thích tiếng Việt đặt riêng trong bài và nêu giới hạn khi cần. Đây là minh hoạ tình huống, không phải sơ đồ giải phẫu chính xác hoặc quy trình lâm sàng.

Các ảnh lưu tại `assets/kaigo/lessons/{choice,safety,communication,movement,meals,privacy,daily-life,handoff,infection,observation}-v1.webp`. Chuyển PNG sang WEBP quality 90, không đổi kích thước hay cắt ảnh; tổng 1.824.300 byte. Dùng lại 10 ảnh trên 173 màn học và 8 tình huống tuỳ chọn = 181 màn được minh hoạ, không phải 181 ảnh khác nhau. [Prompt đầy đủ](lesson-art-prompts-2026-10-10.json), [kích thước và SHA](lesson-art-2026-10-10.json), [phân công ảnh theo bài](catalog-art-assignments-2026-10-10.json).

## Kiểm tra

Kiểm mã và dữ liệu: PASS catalog/art/source links, daily plan, foundation depth prefix, tail gap, language249, twelve mocks; các kiểm âm được từ chối đúng. Khoá UI JLPT 10/10 PASS. Bản build React Native Web tập trung dùng component thật đã chạy kiểm browser cuối cùng: 176 ngày đúng thứ tự; hợp các chủ đề khớp lịch; 173 màn học và 8 tình huống tải đúng ảnh; 585 điểm hiển thị; 6 câu tự kiểm mới lưu, tải lại, sửa và ẩn đáp án đúng; đáp án cũ, thẻ đọc và bài thi chia buổi được khôi phục. 12 đề vẫn giữ nguyên. Không có page error, không tràn ngang trong 30 lượt ảnh × ba viewport 390×844, 768×1024, 844×390.

Đã kiểm trực quan cả 10 ảnh và 9 ảnh chụp màn hình cuối. Chữ ngoài panel đủ tương phản trên nền tối, bố cục dọc/ngang có thể cuộn và ảnh giữ tỷ lệ gốc. [Bằng chứng browser](../runtime-tests/2026-10-10-catalog-art/evidence.json). Harness được thêm charset UTF-8 trước lượt PASS cuối; các lượt lỗi trước không được tính PASS. Esbuild tập trung không chứng minh kiểm kiểu TypeScript toàn repo, Expo Router đầy đủ hay app native.

## Còn cần xác minh

Trang 31: nghĩa hai tầng chú giải và các vùng bàn tay đã rõ, nhưng ranh giới màu nhỏ không được chứng nhận hay dùng để định lượng sạch. Trang 40: nhận dạng con dấu và bật lửa có độ tin cậy thị giác cao, chưa có xác nhận chú thích tác giả; không suy thành mệnh lệnh hoặc thao tác dùng lửa. Trang 195: đã đọc nguồn Nhật; mô tả thao tác vẫn cần chuyên gia hoặc nhà xuất bản giải thích. Không tự suy diễn kéo tinh hoàn hoặc kéo bao quy đầu thành hướng dẫn.

Chưa có mẫu số toàn bộ nguyên tử kiến thức nguồn và xác nhận tương đương cho mọi chi tiết; phần trăm bao phủ để null, không công bố 100%. Human/domain/native/rights/release-ready vẫn false. Chưa kiểm iPhone/Mac, chưa đo tải học thực tế. Lượt rà sâu kế tiếp: trang in 51–70 (20 trang liên tiếp), giữ nguyên các giới hạn trên.

## Lưu mã

Patch riêng Kaigo được chuẩn bị để đưa lên nhánh `recovery/jlpt-n3-n1`, dựng trên HEAD GitHub mới nhất bằng lease và giữ các thay đổi JLPT đồng thời. Baseline quan sát: `bf83b8546f4e5f0dacee6ed2b7abe501ff20ad5f`. Lịch sử local và Git API khác nhau; không công bố WORKPERSISTENCEPASS. Nguồn PDF, OCR, ảnh sách và ảnh tham chiếu riêng không được đưa lên repo.
