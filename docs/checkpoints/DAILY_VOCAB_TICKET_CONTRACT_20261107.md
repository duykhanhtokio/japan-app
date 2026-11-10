Hãy triển khai cơ chế dưới đây vào Japan App, repository `duykhanhtokio/japan-app`, nhánh `recovery/jlpt-n3-n1`. Đây là yêu cầu thực hiện mã nguồn, giao diện, lưu trạng thái và kiểm tra tích hợp, không chỉ lập kế hoạch hoặc báo cáo.

**1. Nguyên tắc làm việc và lưu kết quả**

- Đọc quy định dự án, kiểm tra nhánh, remote, checkpoint và thay đổi chưa lưu trước khi sửa.
- Giữ nguyên công việc đồng thời, dữ liệu người học, lịch sử thi, ID đề, câu hỏi, đáp án và audio.
- Hoàn thành từng nhóm nhỏ: sửa → kiểm tra → commit hẹp → đẩy GitHub → fetch và xác minh lưu thành công, rồi tiếp tục nhóm tiếp theo.
- Không dồn toàn bộ thay đổi, ảnh và bằng chứng đến cuối phiên mới lưu.
- Không sửa lại nội dung JLPT hoặc Tokutei ngoài phạm vi cơ chế này.
- Yêu cầu này cho phép sửa phần khóa quyền truy cập và trạng thái catalog cần thiết. Giữ nguyên bố cục, cách trả lời, chấm điểm và xem đáp án của màn thi đã duyệt. Nếu cần sửa file đang khóa, ghi rõ phạm vi thay đổi và cập nhật bằng chứng kiểm tra tương ứng; không thiết kế lại màn thi.

**2. Tạm khóa game/nông trại**

- Tạm khóa game/nông trại trong bản phát hành đầu; hiển thị thông báo “Đang phát triển — sẽ có trong bản cập nhật sau”.
- Chặn cả lối vào trên giao diện, điều hướng trực tiếp và khôi phục màn hình cũ. Không chỉ che nút.
- Giữ nguyên mã nguồn và dữ liệu game để tiếp tục phát triển sau.
- Bỏ khỏi tab Nhiệm vụ các yêu cầu tưới cây, thu hoạch, City, địa điểm và các điều kiện phụ thuộc game.
- Ẩn công cụ DEV FARM khỏi bản phát hành.
- Không coi các ô đất còn khung Royal là đã sửa. Ghi nhận phần này để hoàn thiện trước khi mở lại game.

**3. Tab Nhiệm vụ chỉ còn nhiệm vụ ngày**

- Tạm bỏ nhiệm vụ tuần và tháng.
- Nhiệm vụ ngày duy nhất là ghép đúng 10 từ vựng thuộc cấp JLPT người dùng chọn khi thiết lập ban đầu.
- Lấy từ kho từ vựng hiện có của app; không tự tạo kho trùng lặp.
- Nghĩa hiển thị theo ngôn ngữ người dùng.
- Ưu tiên từ chưa học; khi hết từ mới của cấp đó thì ôn từ cũ, ưu tiên từ từng ghép sai.
- Nếu người dùng đổi cấp học, áp dụng cấp mới từ nhiệm vụ ngày tiếp theo; giữ nguyên nhiệm vụ đang làm, tiến độ tích lũy, chìa khóa và vé.
- Danh sách 10 từ phải ổn định trong ngày, không thay mới khi tải lại hoặc thoát/mở app.

**4. Giao diện ghép từ như trò chơi**

Thiết kế trò ghép với bốn thành phần:

1. Kanji hoặc cách viết tiếng Nhật.
2. Cách đọc kana.
3. Nghĩa theo ngôn ngữ người dùng.
4. Nhóm/vùng ghép để kết nối các thành phần tương ứng.

Người chơi tự nhìn và chạm nối **từ ↔ cách đọc ↔ nghĩa**, cho đến khi ghép đúng toàn bộ 10 nhóm.

Yêu cầu bắt buộc:

- Hiển thị đầy đủ 10 từ và các lựa chọn tương ứng **trong một màn hình, không cuộn, không chia trang, không giấu lựa chọn sang màn khác**.
- Bố trí thích ứng với kích thước thiết bị; chữ và vùng chạm phải đọc, chọn được. Không thu nhỏ chữ quá mức để ép vừa.
- Từ không có kanji dùng cách viết kana. Khi cách viết và cách đọc trùng nhau, giao diện vẫn phân biệt rõ vai trò của hai thành phần.
- Xáo trộn vị trí các lựa chọn để người chơi phải ghép thực sự.
- Có phản hồi khi chọn đúng/sai; nhóm ghép đúng được ghi nhận rõ.
- Ghép sai được thử lại không giới hạn, không mất tiến độ các nhóm đã đúng.
- Không tính hoàn thành chỉ vì mở nhiệm vụ, xem thẻ hoặc bấm “đã học”.
- Chỉ hoàn thành khi cả 10 nhóm đều đúng.
- Xử lý từ đồng nghĩa, đồng âm hoặc cách đọc trùng nhau bằng dữ liệu nhận diện rõ và kiểm tra lựa chọn hợp lệ; không tạo câu ghép có nhiều đáp án hợp lý nhưng app chỉ chấp nhận một.
- Lưu tiến độ ghép để tiếp tục được sau khi thoát app.
- Kiểm tra ảnh chụp màn hình thực tế ở các kích thước điện thoại được hỗ trợ để xác nhận đủ nội dung, không cuộn, không tràn và không bị che.

**5. Chu kỳ ngày và nhận chìa khóa**

- Mỗi tài khoản chỉ được ghi nhận hoàn thành nhiệm vụ ngày một lần.
- Học thêm hoặc chơi lại không được cộng thêm ngày hoàn thành.
- Hoàn thành đủ **7 ngày cộng dồn**, không bắt buộc liên tiếp, nhận miễn phí **1 chìa khóa**.
- Nghỉ một ngày không mất tiến độ.
- Khi nhận chìa khóa, tiêu thụ đúng 7 lượt hoàn thành đã tích lũy; phần dư phải giữ lại.
- Ghi rõ ngày đã hoàn thành và tiến độ đến chìa khóa tiếp theo.
- Dùng mốc ngày và thời gian đáng tin cậy phía máy chủ; không cho đổi giờ thiết bị hoặc đổi múi giờ để nhận thêm.
- Khi chưa thể xác minh trực tuyến, có thể giữ bài đã làm ở trạng thái chờ đồng bộ; không cấp thưởng trùng sau khi kết nối lại.
- Tách thành tích nhiệm vụ này khỏi các khoản điểm/quy đổi tiền đã có; không tự ý thay đổi cơ chế kinh tế khác.

**6. Đổi chìa khóa và thiết kế vé vàng**

- **4 chìa khóa đổi được 1 vé vàng**; tương đương 28 lần hoàn thành nhiệm vụ ngày nếu không có nguồn thưởng khác.
- Người dùng chủ động bấm đổi; trừ đúng 4 chìa khóa và cộng đúng 1 vé trong một giao dịch.
- Chìa khóa và vé chưa sử dụng không hết hạn, không chuyển giữa tài khoản.
- Không tự bổ sung nguồn cấp chìa khóa/vé khác ngoài yêu cầu này.

Trước khi tạo hình ảnh mới:

- Tìm lại thiết kế **vé vàng, giao diện nhận vé và hiệu ứng nhận vé** đã làm trước đây trong repository, lịch sử Git, tài nguyên hoặc hồ sơ thiết kế liên quan.
- Xác minh mẫu tìm được bằng file và ảnh thực tế, ghi lại đường dẫn/commit.
- Ưu tiên tái sử dụng thiết kế đã được duyệt; không tự vẽ lại theo phong cách khác.
- Nếu thực sự không tìm được mẫu sau khi kiểm tra các nguồn có thể truy cập, báo rõ phần thiếu và tiếp tục các phần độc lập. Không nhận một mẫu mới là thiết kế cũ.

Giao diện cần có số chìa khóa, số vé, tiến độ nhận chìa khóa, thao tác đổi vé và hiệu ứng nhận thưởng. Hiệu ứng chỉ phát sau khi giao dịch được xác nhận; không phát lại thành một lần nhận thưởng mới khi tải lại màn hình.

**7. Quyền truy cập JLPT của tài khoản miễn phí**

Phân biệt rõ:

- **Đề gốc:** đề lịch sử/nguồn gốc hiện có trong app.
- **Đề tự soạn:** đề do Japan App tạo.

Tài khoản miễn phí:

- Chỉ có **1 đề gốc miễn phí duy nhất**, thuộc cấp JLPT đã chọn khi thiết lập ban đầu.
- Không phải mỗi cấp được thêm một đề miễn phí.
- Gắn quyền miễn phí với một exam ID ổn định; đổi cấp hoặc cài lại app không được cấp thêm.
- Đề miễn phí này được làm lại và xem lại bình thường, không cần vé.
- Các đề gốc khác cần vé vàng hoặc Premium.
- Toàn bộ đề app tự soạn cần Premium; vé vàng không mở được đề tự soạn.
- Hiển thị trạng thái khóa và điều kiện mở rõ ràng; giữ nguyên danh sách đề, không xóa hoặc làm mất lịch sử.

**8. Quy tắc sử dụng vé vàng — phương án A đã chốt**

- **1 vé mở 1 đề gốc được chọn trong 7 ngày tính từ thời điểm dùng vé mở đề thành công.**
- Trong 7 ngày đó, người dùng được bắt đầu, tạm dừng, tiếp tục, nộp bài và làm lại đề nhiều lần.
- Thoát app không làm mất quyền hoặc đặt lại thời hạn.
- Thời hạn là 7 × 24 giờ; không đặt lại khi thi lại, nộp bài hoặc mở lại app.
- Hiển thị thời điểm hết hạn rõ ràng.
- Khi đề đang được mở bằng vé còn hiệu lực, không trừ thêm vé để vào làm lại.
- Hết hạn, tài khoản miễn phí bị khóa giao diện làm bài của đề đó, **kể cả lượt đang làm dở chưa nộp**.
- Kiểm tra hết hạn khi vào đề, quay lại app và trong lúc màn thi đang mở. Không chỉ kiểm tra lúc bắt đầu.
- Khóa quyền làm bài không được tự nộp bài, tự chấm bài hoặc xóa câu trả lời đang lưu.
- Nếu dùng vé khác mở lại cùng đề, giữ dữ liệu dở để tiếp tục theo cơ chế phiên hiện có; người dùng vẫn có thể chọn làm lại theo hành vi app đã hỗ trợ.
- Hết hạn vẫn giữ kết quả và quyền xem lại **bài đã nộp**, gồm câu hỏi, câu trả lời đã chọn và đáp án đúng.
- Không khóa việc xem đáp án của bài đã nộp; không để lối xem lại trở thành cách chỉnh sửa/nộp lại bài.
- Giữ chính sách hiện tại về việc ẩn transcript và lời giải chi tiết.
- Không cấp đáp án của bài chưa nộp thông qua màn xem lại.
- Chỉ trừ vé khi cấp quyền thành công; xử lý bấm lặp, mất mạng hoặc lỗi giữa giao dịch mà không mất vé hay cấp quyền trùng.

**9. Premium**

- Dùng gói Premium đã chốt trước đây, mốc giá ghi nhận **3.000 yên/tháng**. Đối chiếu cấu hình sản phẩm và chính sách đã có; không tự tạo thêm giá hoặc gói khác.
- Premium đang hiệu lực mở toàn bộ đề gốc và đề app tự soạn, không cần vé.
- Không trừ vé khi người dùng đang có Premium.
- Premium không tự kéo dài thời hạn một đề đã mở bằng vé.
- Khi Premium hết hạn, quyền làm bài được tính lại từ các quyền còn hiệu lực: đề miễn phí ban đầu hoặc quyền mở bằng vé.
- Với lượt thi đã bắt đầu nhờ Premium, cho phép hoàn thành và nộp lượt đó sau khi Premium hết hạn; không cho bắt đầu lượt mới nếu không còn quyền.
- Phân biệt nguồn quyền của lượt thi để không áp dụng ngoại lệ Premium cho lượt mở bằng vé: **vé hết hạn thì bài dở bị khóa**, như mục 8.
- Giữ nguyên lịch sử và quyền xem lại bài đã nộp sau khi Premium hết hạn.
- Quyền Premium phải dựa trên trạng thái thuê bao đã xác minh, không chỉ một cờ phía thiết bị.

**10. Quan hệ với CREDIT hiện có**

- Vé vàng là quyền mở đề, không phải CREDIT và không đổi thành CREDIT.
- Đề miễn phí, đề đã mở bằng vé còn hạn và đề thuộc Premium phải vào thi được mà không bị chặn thêm bởi yêu cầu CREDIT.
- Chỉ điều chỉnh việc dùng CREDIT trong luồng thi JLPT cần thiết cho cơ chế mới; không tự ý sửa quy tắc CREDIT của các chức năng khác.
- Giữ bộ đếm số đề đã nộp riêng với bộ đếm đạt điều kiện công nhận cấp. Đề miễn phí, đề mở bằng vé và đề Premium đều có thể được tính thành tích nếu đáp ứng điều kiện hiện hành; làm lại một đề không tạo thêm một đề khác.

**11. Lưu tài khoản và chống ghi nhận trùng**

Chìa khóa, vé, ngày hoàn thành nhiệm vụ, đề miễn phí ban đầu, quyền mở đề, thời điểm hết hạn và quyền thuê bao phải gắn với tài khoản, đồng bộ và phục hồi sau đăng nhập/cài lại app.

- Cấp thưởng, đổi vé và mở đề phải có giao dịch nguyên tử và mã chống xử lý trùng.
- Xử lý đồng thời trên nhiều thiết bị, bấm liên tiếp, mất mạng và khởi động lại.
- Không dùng số dư do client tự gửi làm nguồn quyết định.
- Kiểm tra hạ tầng đăng nhập/backend hiện có và tích hợp vào đó.
- Nếu thiếu cấu hình triển khai, khóa bí mật hoặc kết nối thanh toán thực, hoàn tất phần mã có thể kiểm tra, ghi rõ chặn còn lại; không giả nhận backend đã triển khai hoặc thanh toán đã hoạt động.

**12. Kiểm tra bắt buộc**

Kiểm tra tối thiểu các tình huống:

- Nhiệm vụ lấy đúng 10 từ và đúng cấp; đổi cấp không làm đổi bài trong ngày.
- Ghép đủ 10 nhóm mới hoàn thành; từ trùng nghĩa/cách đọc không làm nhiệm vụ vô nghiệm.
- Tất cả thành phần nằm trong một màn hình không cuộn, chữ và vùng chạm sử dụng được.
- Hoàn thành lại cùng ngày, đổi giờ máy, nhiều thiết bị và đồng bộ lại không cấp thêm thưởng.
- Mốc 7 ngày → 1 chìa khóa; 4 chìa → 1 vé; nhận/đổi lặp không làm sai số dư.
- Chỉ một đề miễn phí tại cấp ban đầu; đổi cấp không cấp thêm.
- Vé chỉ mở đề gốc; một vé cho phép làm lại nhiều lần trong đúng 7 ngày.
- Hết hạn giữa lúc đang làm thì khóa bài dở, giữ câu trả lời.
- Bài đã nộp vẫn xem lại được sau hết hạn.
- Premium mở cả hai loại đề; không tiêu vé; hết Premium xử lý đúng lượt đang làm và không mở lượt mới trái quyền.
- Không còn cửa vào nông trại hoặc nhiệm vụ phụ thuộc game đang bị khóa.
- Không còn CREDIT chặn chồng trong luồng thi đã có quyền.
- Quy trình thi, đáp án, lịch sử và dữ liệu cũ được bảo toàn.

Chạy các kiểm tra phù hợp của dự án, kiểm tra khóa UI và kiểm tra màn hình thực tế. Không nhận kiểm tra bằng mã là bằng chứng đã thử trên iPhone/Android.

**13. Trình tự thực hiện và báo cáo**

Thực hiện tuần tự theo nhóm có thể lưu độc lập:

1. Kiểm tra hiện trạng, tìm thiết kế vé vàng và ghi lại đặc tả đã chốt.
2. Khóa game, bỏ nhiệm vụ tuần/tháng và các nhiệm vụ phụ thuộc game.
3. Xây nhiệm vụ ghép 10 từ và lưu tiến độ ngày.
4. Tích hợp chìa khóa, đổi vé, giao diện và hiệu ứng nhận thưởng.
5. Tích hợp quyền thi miễn phí/vé/Premium và thời hạn.
6. Kiểm tra tích hợp, thiết bị và sửa các lỗi phát hiện.

Sau mỗi nhóm, lưu ngay lên GitHub và xác minh trước khi chuyển tiếp. Tiếp tục các phần độc lập khi gặp một chặn cục bộ; không dừng chỉ vì đã hoàn thành một nhóm nhỏ.

Cuối lượt báo cáo rõ:

- Phần đã thực hiện và commit đã xác minh.
- Mẫu vé vàng cũ tìm được ở đâu và đã tái sử dụng thế nào.
- Các kiểm tra đã chạy, kết quả và ảnh giao diện thực tế.
- Hạ tầng nào đã hoạt động, phần nào còn chờ triển khai/cấu hình.
- Công việc còn thiếu để phát hành.

Không tuyên bố hoàn tất khi mới có giao diện, số dư giả lập hoặc trạng thái chỉ lưu trên thiết bị.