# Rà soát nội dung Kaigo tuần 1–3 — 07/10/2026

## Kết luận

**CHƯA ĐẠT để đưa vào app dưới danh nghĩa nội dung hoàn chỉnh hoặc ôn thi tương đương thi thật.** Ba tuần hiện là bản nháp luyện giao tiếp có cấu trúc. Kiểm tra cấu trúc PASS không chứng minh chất lượng chuyên môn, ngôn ngữ hay độ khó thi. Báo cáo trước đã khiến người dùng hiểu quá mức; báo cáo này thay thế kết luận chất lượng đó.

Đã đọc toàn bộ 21 bài: kiến thức, bối cảnh, từng lượt Nhật/Việt, 21 bài đọc, 69 câu hỏi gồm các lựa chọn/đáp án/giải thích, 88 lượt có tiêu chí phản hồi và mẫu/biến thể, 69 mục từ vựng trong ba tệp. Đối chiếu các nguyên tắc liên quan trong tài liệu chuẩn và chạy lại ba validator. Đây là rà soát biên tập bằng AI có bằng chứng, không phải xác nhận của chuyên gia chăm sóc hoặc người bản ngữ. Không sửa nội dung bài học trong lần rà này.

Mốc nội dung kiểm: `6468e1d77a0bb634470182e70011006f4f1b213b`. Tài liệu chuẩn: bản sửa lần hai tháng3/2025, SHA256 `997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54`. Tệp JSON cùng thư mục ghi hash của chín tệp nội dung để kiểm lại đúng phiên bản.

## Phạm vi và kết quả

| Hạng mục | Bằng chứng | Kết quả |
|---|---|---|
| Cấu trúc | 21 bài, 176 lượt, 21 bài đọc, 69 câu hỏi; ba validator PASS | Đạt kiểm tra cấu trúc |
| Ngôn ngữ trình bày | Thoại tiếng Nhật, hỗ trợ Việt; mỗi thoại8–10lượt | Đạt dạng trình bày; chưa đạt kiểm duyệt bản ngữ |
| Kiến thức | Ngày1–3 mỗi ngày1ý;18ngày còn lại mỗi ngày2ý | Chưa đủ chiều sâu bài học |
| Nhất quán dữ kiện | Lỗi ngày16,19; vấn đề phạm vi dữ kiện ngày13 | Chưa đạt |
| Hiển thị bài đọc | Hai chuỗi literal `\u3000` ở ngày18,20 | Chưa đạt |
| Từ vựng | 21+24+24 mục;16 từ di chuyển có ghi kiểm đọc trực quan nguồn,53 mục chưa có xác nhận tương đương | Đạt bản kê nháp; chưa chứng nhận toàn bộ nguồn/cách đọc |
| Phản hồi NPC | 88 lượt có mẫu và biến thể; là đặc tả, chưa chạy bộ chấm | Chưa đạt vận hành |
| 30phút/ngày | Tổng630phút được phân bổ; tất cả chưa đo thời lượng | Chưa chứng minh đủ tải học |
| Ôn thi | 69 câu kiểm tra bài, chưa có hai đề45/15câu đã duyệt | Chưa đạt mục tiêu đề thi |
| Quyền sử dụng/bản ngữ/chuyên môn | Các cờ phê duyệt vẫn false | Chưa được duyệt |

## Lỗi và điểm phải xử lý

1. **A01 — Ngày16, `kaigo-move-02`, cần sửa trước khi duyệt.** Lượt4 player nói mình kiểm lối đi; lượt6 báo mình đã kiểm. Bài đọc lại gán cho NPC岸本職員; `move-q09` chọn 岸本職員. Đáp án đúng với bài đọc riêng, nhưng mâu thuẫn chuỗi tình huống. Phải thống nhất chủ thể ở thoại, bài đọc, lựa chọn/giải thích và rubric. Không chữa bằng đổi đáp án đơn lẻ.
2. **A02 — Ngày19, `kaigo-move-05`, lượt2/expression/rubric.** Người sử dụng nói 今は chưa muốn đi; mẫu trả lời nói 今日は. Người sử dụng vẫn muốn hỏi khả năng tham gia sau cuộc gọi. Cần giữ phạm vi bây giờ; mẫu và biến thể phải cùng ý định, bản Việt tương ứng.
3. **A03 — Ngày18/20, `reading.textJa`.** Sau13:55/14:05 là sáu ký tự literal `\u3000`, không phải khoảng trắng Unicode. Cần sửa dữ liệu hiển thị và kiểm lại văn bản sau parse JSON.
4. **A04 — Ngày13, `contextVi`.** “Chưa ai té” là dữ kiện bổ sung không được thể hiện trong cuộc kiểm tra của nhân viên; thoại và bài đọc nhấn mạnh chưa kiểm chứng tình trạng thương tích toàn bộ. Té và bị thương không đồng nghĩa, nên đây không phải mâu thuẫn logic trực tiếp; tuy nhiên bối cảnh đang cho người học biết vượt quá dữ kiện dùng để báo cáo. Cần xác định rõ góc nhìn/dữ kiện đã kiểm.
5. **A05 — Ngày11.** Vị trí “đầu bên phải quầy” chưa xác định hướng nhìn. Cần thêm mốc người nghe có thể xác định. Đây là cải thiện độ rõ, không kết luận toàn câu sai.
6. **A06 — Kiến thức quá mỏng và lặp.** Tuần3 có4 bộ nội dung kiến thức khác nhau; riêng ngày17,19,20,21 lặp nguyên cùng hai ý. Đính chính nhận xét sơ bộ trong tiến độ: không phải cả7ngày đều có hai ý giống hệt. Ngày8–12 đang dạy cách báo cáo/giao tiếp nhiều hơn kiến thức chủ đề cơ thể/lão hóa/sa sút trí tuệ. Cần bổ sung giải thích thuật ngữ, cơ chế ở mức phù hợp nguồn, đối chiếu đúng/sai, tình huống áp dụng và giới hạn.
7. **A07 — Câu hỏi.** Đã kiểm toàn bộ69câu và lý do từng lựa chọn. Chưa phát hiện thêm đáp án sai rõ trong ngữ cảnh riêng; không đồng nghĩa69câu đạt chuẩn thi. Nhiều nhiễu là hành vi hiển nhiên sai: ép tham gia, bỏ qua yêu cầu, đoán thông tin, vứt báo, không giải thích. Các câu này dùng được ở bước nhập môn nhưng chưa đo hiểu sâu hoặc phân biệt lựa chọn gần đúng. Đáp án tổng phân bố19/17/17/16 ở vị trí1/2/3/4 khá cân bằng, nhưng nhiều cụm tuần lặp dãy vị trí: cân bằng tổng không loại bỏ tính dự đoán. Không tự áp thuật toán JLPT hay đảo đáp án khi chưa chốt cách vận hành.
8. **A08 — Rubric.** Mẫu/biến thể88lượt đã đọc, nhưng nhiều `criteriaVi` chỉ là bản dịch mục tiêu đầy đủ; hint đưa lại cả câu mẫu. Chưa có các mức ý bắt buộc/ý tùy chọn, đúng một phần, xử lý câu trả lời mới hợp lệ, câu hỏi ngược và chuyển nhánh được thử. Cần thiết kế ma trận ý nghĩa và ca đánh giá, tránh bắt người dùng nói y nguyên mẫu. Ngày19 cho thấy mẫu và biến thể có thể khác phạm vi thời gian dù validator PASS.
9. **A09 — Lịch học.** Có các khối5+5+5+10+5 và nhắc ôn1/3/7/14/30ngày, nhưng chưa có lịch thực thi, hoạt động đủ chi tiết hay đo thử. Không được dùng con số210phút/tuần làm bằng chứng đã đủ nội dung. Một lần đọc8lượt không chứng minh đủ10phút NPC.
10. **A10 — NPC/bối cảnh.** Hồ sơ có8NPC, ba tuần dùng6vai; gia đình/bếp chưa xuất hiện là phù hợp phạm vi hiện tại, chưa chứng minh đủ toàn khóa. Ngày12 chủ yếu kể lại sự việc với trưởng nhóm, chưa luyện trực tiếp việc tiếp nhận cảm xúc của người sử dụng. Cần bổ sung tình huống trực tiếp khi hoàn thiện tuần2.
11. **A11 — Nguồn và tính nguyên bản.** Đối chiếu nguyên tắc: trang in10/12/16/20/24/25,68,88/93,98/102–105/108/115/118/120/129; so sánh tình huống di chuyển mới với hội thoại mẫu trang209–210. Chủ đề mới về lịch hoạt động/lối đi/cuộc gọi khác tình huống mẫu tập đi/đi vệ sinh. Việc này chưa thay thế kiểm tra tương đồng toàn tài liệu hoặc duyệt quyền sử dụng. Từ thông dụng và thuật ngữ giống nguồn không tự là sao chép; cũng không thể chứng nhận độc lập chỉ từ tên nhân vật mới. Không đưa PDF/OCR nguồn vào repo.

## Rà từng bài

Không bài nào được đánh dấu releaseReady. “Chưa phát hiện lỗi rõ” chỉ áp dụng phần đã đọc, không chứng nhận chuyên môn.

| Ngày | Bài | Lượt / câu | Kết quả rà và việc cần làm |
|---|---|---|---|
| 1 | Chào hỏi, giới thiệu vai trò (`kaigo-foundation-01`) | 8 / 3 | Nội dung giới thiệu vai trò phù hợp mục tiêu mở đầu; thêm căn cứ vai trò/ngành nghề trang20 và giải thích giới hạn vai trò. |
| 2 | Hỏi mong muốn, xin phép (`kaigo-foundation-02`) | 10 / 3 | Xin phép và giữ đồ đúng mong muốn; cần biến thể tình huống thay vì chỉ đọc lại mẫu. |
| 3 | Tự lập và mức hỗ trợ (`kaigo-foundation-03`) | 8 / 3 | Hỗ trợ phần cần giúp phù hợp tự lập; cần giải thích tự lập thể chất/tinh thần và tự quyết. |
| 4 | Riêng tư, bảo mật (`kaigo-foundation-04`) | 8 / 3 | Giữ riêng tư, không tự báo gia đình; chỉ phù hợp trao đổi thường như giới hạn đã ghi. |
| 5 | Từ chối và thương lượng (`kaigo-foundation-05`) | 8 / 3 | Phân biệt tham gia/chụp ảnh rõ; cần tăng độ khó phương án nhiễu. |
| 6 | Nghe, hỏi lại, xác nhận (`kaigo-foundation-06`) | 8 / 3 | Phân biệt giờ mở cửa/hạn trả tốt; kiến thức chỉ hai ý, cần bài tập chuyển giao sang công việc chăm sóc. |
| 7 | Ôn tuần 1 (`kaigo-foundation-07`) | 8 / 3 | Ôn xin phép/tự lập hợp lý; chưa đánh giá khả năng áp dụng sang tình huống mới. |
| 8 | Cơ thể và vị trí khó chịu (`kaigo-week2-01`) | 8 / 3 | Bên phải/thời điểm/lời người sử dụng nhất quán; chưa dạy cấu trúc và chức năng cơ thể tương ứng. |
| 9 | Tư thế và quan sát (`kaigo-week2-02`) | 8 / 3 | Tách quan sát/lời kể/chưa xác nhận tốt; chưa giải thích hệ tư thế, tác dụng và điểm quan sát. |
| 10 | Lão hóa, khác biệt cá nhân (`kaigo-week2-03`) | 8 / 3 | Không suy từ tuổi và điều chỉnh giọng phù hợp; thiếu kiến thức biến đổi thể chất/tinh thần do lão hóa. |
| 11 | Khuyết tật và cách giao tiếp phù hợp (`kaigo-week2-04`) | 8 / 3 | Xưng tên và hỏi trước chạm phù hợp; cần xác định bên phải tính từ hướng nhìn nào và tránh đại diện một tình huống cho toàn bộ khuyết tật. |
| 12 | Sa sút trí tuệ: tiếp nhận cảm xúc (`kaigo-week2-05`) | 8 / 3 | Không tự chẩn đoán tốt; hội thoại báo cáo với trưởng nhóm, chưa luyện trực tiếp với người lo lắng; thiếu định nghĩa/triệu chứng cốt lõi/BPSD. |
| 13 | An toàn và báo cáo thay đổi (`kaigo-week2-06`) | 8 / 3 | Cần sửa phạm vi dữ kiện: context khẳng định chưa ai té; bài đọc/thoại chưa xác nhận toàn bộ tình trạng thương tích. |
| 14 | Ôn tuần 2 (`kaigo-week2-07`) | 8 / 3 | Báo mệt khác thường, không gán tuổi hợp lý; chưa kiểm tra đủ mục tiêu kiến thức tuần2. |
| 15 | Xác nhận mong muốn trước khi tới buổi sinh hoạt (`kaigo-move-01`) | 10 / 5 | Giờ14:00/còn15phút và mong muốn nhất quán; chưa đủ nội dung kỹ năng chăm sóc di chuyển. |
| 16 | Xác nhận đường đi khi gặp vật cản (`kaigo-move-02`) | 10 / 5 | Lỗi nghiêm trọng về người kiểm tra lối đi: player kiểm trong thoại, 岸本職員 kiểm trong bài đọc và đáp án move-q09. |
| 17 | Xác nhận kế hoạch khi nhận việc thay đồng nghiệp (`kaigo-move-04`) | 8 / 3 | Hai nhân viên được giới hạn theo kế hoạch riêng, hợp lý; kiến thức dùng nguyên hai ý chung, cần phân biệt mục tiêu của ngày. |
| 18 | Báo cáo khi người sử dụng muốn nghỉ (`kaigo-move-03`) | 10 / 5 | Phân biệt chưa nghe than với chưa kiểm rõ tốt; bài đọc chứa literal \u3000 cần sửa hiển thị. |
| 19 | Tìm hiểu lý do người sử dụng chưa muốn tới phòng sinh hoạt (`kaigo-move-05`) | 8 / 3 | Lượt2 và expression mở rộng 今 thành 今日; rubric có mẫu hôm nay và biến thể bây giờ, không thống nhất tiêu chí. |
| 20 | Bàn giao mong muốn và kết quả đã xác nhận (`kaigo-move-06`) | 8 / 3 | Bàn giao hạn14:30 khác với lựa chọn chưa chốt rõ; bài đọc chứa literal \u3000; kiến thức trùng ngày17/19/21. |
| 21 | Ôn tổng hợp: giờ sinh hoạt và thông tin trên bảng chưa thống nhất (`kaigo-move-07`) | 8 / 3 | Giờ14:00/14:20 phân biệt rõ, không tự đổi kế hoạch; kiến thức trùng ngày17/19/20; cần tình huống ôn mới. |

## Cách hoàn thiện để xét đạt lại

Thứ nhất, sửa A01–A05 đồng bộ ở các tệp liên quan, kiểm tra lại chủ thể/thời gian/góc nhìn và đối chiếu đáp án. Thứ hai, hoàn thiện trọn tuần1,2,3 với kiến thức có mục tiêu riêng, hoạt động luyện cụ thể và câu hỏi có nhiễu đáng tin; không chỉ kéo dài văn bản cho đủ phút. Thứ ba, bổ sung rubric theo ý nghĩa và thử câu trả lời đúng một phần, biến thể hợp lệ, suy đoán, sai vai, ASR không chắc và câu hỏi ngược. Thứ tư, đối chiếu đủ mục tiêu đã chọn của từng tuần với trang nguồn; nguồn chung cho nhiều bài chưa phải bảng truy xuất từng mệnh đề. Thứ năm, mới trình chuyên gia chăm sóc/bản ngữ và duyệt quyền; kiểm thử thời lượng/runtime trước khi bật cờ sẵn sàng.

Phần kiến thức tuần3 đang giới hạn giao tiếp, chưa dạy thao tác chuyển người; không tự biến hội thoại thành hướng dẫn thao tác. Cần thống nhất cách phân bổ kiến thức kỹ năng theo khóa trước khi bổ sung phần này. Chưa đánh giá tuần4–8 vì chưa có nội dung hoàn chỉnh để rà.

## Những việc cần người dùng quyết định

- Có duyệt sửa đồng bộ lỗi A01–A05 và hoàn thiện chiều sâu ba tuần trước khi viết tuần4 không? Khuyến nghị hoàn thiện ba tuần trước.
- Có giữ30phút/ngày và chuyển bớt tình huống giao tiếp lặp thành bài kiến thức/case ôn thi không? Khuyến nghị giữ thời lượng đã duyệt, cân đối lại hoạt động; chưa tự đổi lịch8tuần.
- Ai/đơn vị nào thực hiện duyệt chuyên môn và tiếng Nhật cuối cùng? AI không tự đặt các cờ humanReviewed/nativeLanguageReviewed thành true.
- Trước khi soạn hai đề mẫu: chốt ngôn ngữ phần kỹ năng, furigana, cách hiển thị đáp án/giải thích, tính điểm và tiếp tục bài. Các lựa chọn chưa duyệt được giữ mở; không áp quy tắc JLPT.

## Kiểm chứng và giới hạn

Đã chạy `node scripts/check-kaigo-week1-draft.mjs`, `check-kaigo-week2-draft.mjs`, `check-kaigo-week3-draft.mjs`: lần lượt PASS7/58/29/21,7/56/28/21,7/62/31/27 (bài/lượt/rubric/câu). Kiểm tra này đã bỏ sót A01–A03 vì chỉ kiểm cấu trúc và liên kết; cần giữ tên kết quả là cấu trúc PASS.

Rà soát biên tập phạm vi ba tuần đã hoàn tất; các lỗi và thiếu hụt đang mở, không phải đã sửa. Không có kiểm thử audio, hoạt động NPC thật, chấm lời nói hoặc đo người học. Không có xác nhận chuyên gia/bản ngữ/quyền xuất bản. Kết luận cuối cùng giữ **CHƯA ĐẠT**.
