# Kaigo — chuẩn xưng hô, biên tập đa ngôn ngữ và hiển thị

Phiên bản: 1. Chủ dự án duyệt ngày 2026-10-16 (Asia/Tokyo).
Phạm vi: nội dung Nhật và mọi bản dịch Kaigo, gồm bài học, hội thoại, ví dụ, câu hỏi, lời giải, tiêu đề, chú thích ảnh và thông báo học tập.

Đọc toàn bộ hướng dẫn này và `language-style-policy.json` trước mỗi đợt soạn, dịch, chỉnh câu chữ hoặc thay cách hiển thị Kaigo. Đây là phần bắt buộc của `KAIGO_AUTHORING_RULES.md`, không phải gợi ý chỉ dành cho tuần 1.

## 1. Mẫu đã được chủ dự án duyệt

Chủ dự án xác nhận cách xưng hô trong bản Việt tuần 1 gần gũi và đúng mong muốn; yêu cầu dùng cách xử lý này nhất quán cho tiếng Việt và mọi ngôn ngữ khác từ nay về sau.

Mốc tham chiếu: commit `3bed1485c50d4a3a9d8e835fa4153737cf5f3a50`.
Bản Việt tham chiếu: `src/data/kaigo/japanese-master/translations/week-01.vi.json`.
SHA-256 tại thời điểm duyệt: `b9e8eae2dc73fffeffded85162fd2b6bbfd38df148790c86ecef7b7e92e8d38c`.
Bản hiển thị tham chiếu: `src/components/kaigo/WeeklyKaigo.tsx` trong cùng commit.

Đây là duyệt phong cách xưng hô, cách diễn đạt và nguyên tắc hiển thị. Không suy thành chứng nhận mọi kiến thức, mọi câu hỏi, mọi bản dịch hay mọi thiết bị đã được duyệt. Hash xác định mẫu tham chiếu, không khóa mọi câu chữ: được sửa lỗi và làm rõ nội dung trong phạm vi đã cho phép, có ghi thay đổi và đối chiếu lại.

## 2. Nguyên tắc chung của tất cả ngôn ngữ

- Tiếng Nhật là bản chính. Mỗi ngôn ngữ dịch trực tiếp từ bản Nhật tương ứng; không lấy tiếng Việt làm bản trung gian.
- Giọng văn thân thiện, tôn trọng người trưởng thành, rõ ràng và phù hợp môi trường chăm sóc. Gần gũi không đồng nghĩa với suồng sã, coi người được chăm sóc như trẻ nhỏ hoặc tự nhận quan hệ gia đình.
- Đọc cả tình huống trước khi dịch: xác định người nói, người nghe, vai trò, quan hệ, mục đích và thông tin đã được xác nhận. Không chọn đại từ chỉ từ một câu tách rời.
- Diễn đạt bằng câu tự nhiên của ngôn ngữ đích, đủ chủ thể, hành động và điều kiện khi cần. Các đoạn giải thích phải kết nối ý và làm rõ lý do; không biến thành chuỗi ghi chú cụt ý hoặc bản dịch từng từ.
- Giữ nguyên nội dung chuyên môn, mức độ chắc chắn, phủ định, điều kiện, thứ tự trước–sau và phạm vi đồng ý. Phân biệt rõ mong muốn, dự định, việc chưa xác nhận và việc đã hoàn thành. Không thêm chẩn đoán, hứa hẹn hay hướng dẫn mới để câu nghe trôi chảy.
- Với lời chào và công thức xã giao, chuyển đúng chức năng giao tiếp trong tình huống. Không giữ cấu trúc dịch sát gây khó hiểu; cũng không tự thêm tình tiết hoặc lời hứa chăm sóc.
- Nhất quán về nghĩa và quan hệ nhân vật; vẫn cho phép nhiều cách nói tự nhiên theo bối cảnh. Không sao chép cùng một khuôn câu cho mọi tình huống chỉ để tạo vẻ đồng bộ.

## 3. Chuẩn tiếng Việt đã duyệt

| Hoàn cảnh | Cách dùng ưu tiên |
|---|---|
| Giải thích kiến thức, mô tả chung | Dùng “người được chăm sóc”; gọi đúng “nhân viên chăm sóc”, “điều dưỡng” và các vai chuyên môn |
| Nhân viên trẻ nói với người lớn tuổi trong các cảnh như tuần 1 | Nhân viên xưng “cháu”, gọi người kia là “bác”; người lớn tuổi xưng “bác”, gọi nhân viên là “cháu” |
| Hai đồng nghiệp ngang vai, giao tiếp gần gũi như mẫu tuần 1 | Dùng “mình–bạn” nhất quán |
| Có vai vế khác, người trẻ hơn, gia đình hoặc người được chăm sóc có mong muốn riêng | Chọn cách xưng hô theo quan hệ và thông tin đã có; ghi vào hồ sơ nhân vật trước khi soạn |
| Chưa biết giới tính, tuổi hay quan hệ | Không tự bịa để chọn anh/chị/cô/chú; dùng tên, vai trò hoặc cách trung tính phù hợp |
| Từ chuyên môn | Có cách gọi ưu tiên ổn định; giải thích bằng lời thông dụng khi người học có thể chưa biết |

“Bác–cháu” là chuẩn cho loại tình huống người lớn tuổi đã duyệt, không phải phép thay thế bắt buộc cho mọi 利用者 và mọi nhân viên. Nếu nhân vật muốn được gọi bằng tên, họ hoặc một cách cụ thể, phải giữ đúng mong muốn đó. Không biến kính ngữ さん thành một quan hệ họ hàng cố định. Khi cách gọi tiếng Nhật chính là nội dung đang học, có thể giữ dạng như “Haruko-san” và giải thích bằng tiếng Việt.

Trong một hội thoại và những bài dùng lại cùng quan hệ nhân vật, không đổi tùy hứng giữa “tôi–bạn”, “em–ông”, “cháu–bác”. Một thay đổi có lý do phải gắn với thay đổi người nghe, vai trò hoặc yêu cầu của nhân vật, rồi ghi rõ trong hồ sơ.

Ví dụ tham chiếu:

- Hỏi đúng phần cần giúp: “Bác cho cháu biết phần nào bác muốn tự viết, phần nào cần cháu giúp được không?”
- Xin phép rõ việc sẽ làm: “Cháu chuyển hai thứ sang đó rồi lau bàn được không ạ?”
- Đồng nghiệp xác nhận thông tin: “Vậy hạn trả vẫn chưa rõ. Mình sẽ nói riêng hai ý…”
- Trong cảnh lần đầu giới thiệu đã duyệt, よろしくお願いします được chuyển tự nhiên thành “Cháu rất vui được làm quen với bác ạ.” Đây là xử lý theo tình huống, không phải bản dịch duy nhất cho cụm này ở mọi nơi.

## 4. Áp dụng cho từng ngôn ngữ khác

Phạm vi hiện tại: Nhật, Việt, Anh, Indonesia, Trung giản thể, Trung phồn thể, Hindi, Bengali, Nepal, Myanmar, Thái, Khmer và Tagalog. Nếu app bổ sung ngôn ngữ, cùng chuẩn này tiếp tục áp dụng.

Mỗi ngôn ngữ cần một hồ sơ biên tập dùng chung, ghi ít nhất:

1. Cách xưng hô với người được chăm sóc, đồng nghiệp, người phụ trách, nhân viên y tế và người nhà; điều kiện thay đổi cách gọi.
2. Cách xử lý tên, danh xưng và thông tin tuổi/giới tính còn thiếu.
3. Mức lịch sự, giọng văn giải thích và cách chuyển lời chào, xin phép, cảm ơn, từ chối.
4. Thuật ngữ ưu tiên theo ID/khái niệm, nghĩa và trường hợp được dùng cách khác.
5. Cách đặt tiêu đề, dấu câu và font phù hợp hệ chữ.
6. Mẫu đã dùng, phiên bản và trạng thái rà ngôn ngữ.

Dùng mẫu tiếng Việt để hiểu mức gần gũi và tôn trọng, không sao chép máy móc đại từ hay quan hệ “bác–cháu” sang các ngôn ngữ khác. Ngôn ngữ có cách biểu đạt khoảng cách, giới tính, tuổi hoặc lịch sự riêng thì chọn cách tự nhiên của ngôn ngữ đó và duy trì ổn định.

Đọc hồ sơ hiện có trước khi viết. Khi chưa có hồ sơ, lập hồ sơ cho chính ngôn ngữ đang xử lý trong phạm vi công việc được giao, rồi dùng nhất quán; không cần hỏi lại các lựa chọn biên tập thông thường. Ghi chính xác mục chưa chắc hoặc chưa được người thông thạo kiểm tra. Không tuyên bố các hồ sơ/bản dịch ngôn ngữ khác đã được duyệt chỉ vì phong cách Việt được chủ dự án chấp nhận.

## 5. Thuật ngữ và quan hệ nhân vật phải có điểm tham chiếu chung

Một khái niệm có một cách gọi ưu tiên trong mỗi ngôn ngữ. Bảng thuật ngữ dùng chung phải gắn với ID/khái niệm Nhật; không tạo những bản định nghĩa khác nhau theo tuần. Nếu từ có nhiều nghĩa, ghi rõ ngữ cảnh thay vì ép tất cả vào một nghĩa.

Hồ sơ nhân vật/quan hệ lưu cách gọi đã chọn theo từng ngôn ngữ và đối tượng giao tiếp. Khi tái sử dụng nhân vật, đối chiếu hồ sơ đó. Không suy giới tính từ tên hoặc coi mọi người lớn tuổi là cùng một kiểu nhân vật.

Bản Việt tuần 1 là mẫu đối chiếu hiện có cho 25 định nghĩa và cách xưng hô đã được biên tập. Tái sử dụng định nghĩa/cách gọi đã phù hợp; câu ví dụ và tình huống vẫn phải độc lập, đúng mục tiêu bài.

## 6. Chuẩn hiển thị xuyên suốt Kaigo

- Tiếng Nhật hiển thị trước. Chỉ hiện bản dịch sau thao tác mở dịch, theo đúng ngôn ngữ người học đã chọn.
- Khi mở dịch, mỗi đoạn Nhật đi ngay trước đoạn dịch tương ứng. Giữ đúng thứ tự đề mục, lượt thoại và đoạn; không gom hết tiếng Nhật một nơi rồi đẩy toàn bộ bản dịch xuống cuối.
- Tiêu đề, nội dung, chú thích ảnh và thông báo dùng cùng hồ sơ ngôn ngữ; không tự xen một ngôn ngữ khác vì thiếu bản dịch. Trong phần từ vựng, được giữ thuật ngữ Nhật để phục vụ học tập và gắn nghĩa rõ ràng.
- Bản dịch gắn phiên bản của bản Nhật. Khi Nhật đổi, bản dịch chưa cập nhật không được hiện như bản đã đối chiếu. Khi đã có bản mới, không chèn thêm bản cũ cạnh bản mới.
- Giữ hệ thống Royal, cấu trúc trang và thành phần hiển thị đã được duyệt. Dùng chung các thành phần và màu ngày/đêm của `StudyAppearance.tsx`; không tự đặt màu, kiểu khung, font, độ đậm hay giãn dòng khác theo tuần hoặc theo người soạn.
- Bản dịch phải dễ đọc với chế độ sáng/tối hiện có. Chọn font dự phòng phù hợp hệ chữ khi cần, giữ tinh thần thiết kế và kiểm dấu, cách nối chữ, xuống dòng; không ép một font thiếu ký tự lên mọi ngôn ngữ. Không cắt mất chữ, lượt thoại hoặc nội dung để vừa khung.
- Không chèn lặp các nhãn kỹ thuật giữa từng đoạn. Trạng thái cần biết được trình bày gọn, nhất quán như mẫu đã duyệt. Không đưa hash, đường dẫn nội bộ hay nhật ký QA vào bài học.

Mẫu tham chiếu hiển thị là tuần 1 trong commit đã nêu. Quy tắc này hướng dẫn các lần triển khai sau, không cho phép tự thiết kế lại màn hình đã duyệt. Cải thiện nội dung và sửa lỗi trong phạm vi được giao vẫn được thực hiện bình thường.

## 7. Rà trước khi lưu một đơn vị

Đọc bản dịch như một người học từ đầu đến cuối, sau khi đã đối chiếu nghĩa theo đoạn Nhật. Rà riêng:

- Người nói/nghe và đại từ có đúng, ổn định, tôn trọng không?
- Đoạn văn có tròn ý, nối ý và nghe tự nhiên khi đọc thành tiếng không?
- Thuật ngữ, tên và danh xưng có khớp mẫu/hồ sơ chung không?
- Điều kiện, phủ định, mốc thời gian, vai chuyên môn và mức chắc chắn có được giữ nguyên không?
- Có còn đoạn tóm tắt cụt ý, lời dịch từng từ hoặc bản cũ xen lẫn không?
- Tiêu đề và chú thích có cùng giọng văn với phần bài học không?
- Cặp đoạn Nhật–dịch, nút hiện/ẩn, ngôn ngữ được chọn, font và chế độ sáng/tối có đúng không?

Đếm trường và kiểm tự động chỉ hỗ trợ tìm lỗi; không chứng minh bản dịch tự nhiên hoặc đúng chuyên môn. Ghi riêng kiểm AI, phản hồi chủ dự án, duyệt ngôn ngữ, chuyên môn và thiết bị.

## 8. Duy trì qua các phiên

Mỗi đợt ghi phiên bản hướng dẫn/hồ sơ đã dùng, ngôn ngữ, phạm vi bài, mẫu đã đối chiếu và mọi quyết định đổi thuật ngữ/xưng hô. Nếu phát hiện cách gọi sai, sửa hồ sơ chung và xác định các bài bị ảnh hưởng; không sửa một bài rồi để phần còn lại dùng chuẩn khác mà không ghi việc cần đồng bộ.

Không tự đổi chuẩn phong cách đã được chủ dự án duyệt theo sở thích của phiên AI mới. Điều chỉnh chính sách phải có lý do và được ghi phiên bản; chỉ hỏi chủ dự án khi có thay đổi thực sự ngoài phạm vi đã được giao. Không yêu cầu duyệt lại việc sửa lỗi thông thường hoặc việc tiếp tục áp dụng chính sách đã chốt.


## 9. Thứ tự sản xuất hiện tại — cập nhật chủ dự án 2026-10-16

Ưu tiên hoàn thiện và kiểm tra toàn bộ bản Nhật trước; tạm hoãn soạn bản dịch mới cho đến khi xong phạm vi Nhật toàn khóa.6AI soạn các tuần độc lập, điều phối tích hợp và xác minh từng đợt. Phong cách, thuật ngữ và hiển thị đã duyệt tiếp tục áp dụng. Giữ bản dịch đã có và kiểm ràng buộc phiên bản; thiếu bản dịch thì báo đang chuẩn bị, không hiển thị bản Việt cũ như bản đã đối chiếu. Quyết định này thay lịch dịch theo từng tuần, không thay chuẩn chất lượng hay ý nghĩa các cờ duyệt.
