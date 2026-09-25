# YÊU CẦU CHO AI — Biên soạn Tokutei Gino từ tư liệu gốc

Ngày: 2026-09-25. Phạm vi: 建設, 外食業, 飲食料品製造業. Đọc `docs/ssw-workspace/TOKUTEIGINO_SOURCE_INVENTORY_2026-09-25.md` và handoff B1 từng ngành trước khi làm. Tài liệu này không cấp quyền phóng tác hoặc tái phân phối nguồn của bên thứ ba.

## Mục tiêu và đầu vào

Viết giáo trình và bài học Nhật–Việt mới cho người lao động Việt Nam ở Nhật, dùng **thuật ngữ nghề, khái niệm, mục tiêu học, phạm vi kỳ thi và cách tiếp cận sư phạm ở mức ý tưởng** từ nguồn tham khảo hợp pháp. Tự chọn trình tự bài, tình huống, câu thoại, ví dụ, câu hỏi, đáp án, giải thích và bản dịch. Đối chiếu mỗi khẳng định kỹ thuật hoặc pháp lý với nguồn chính thức còn hiệu lực và giới hạn áp dụng cho ngành, cấp độ, sản phẩm, cơ sở, công đoạn.

Nguồn kiểm tra: kho gốc riêng được chỉ ở chỉ mục; Stage A/B1 của từng repo; các văn bản chính thức ghi trong `official-sources.json`; nội dung B2 tự viết chỉ là bản nháp cho đến khi duyệt. Không suy rằng một ZIP, đường dẫn `localPath`, tiêu đề, hoặc metadata đồng nghĩa có bản PDF gốc đầy đủ. Ghi rõ thiếu nguồn.

## Quy tắc độc lập về biểu đạt

1. Chỉ rút **từ chuyên ngành, sự kiện, quy tắc đã kiểm chứng và mục tiêu năng lực**. Viết lại cấu trúc bài và cách giải thích từ đầu bằng tình huống nghề mới và nhân vật mới.
2. Không sao chép hoặc dịch sát câu, đoạn, bảng, thứ tự trình bày đặc thù, đề thi, phương án trả lời, lời giải, minh họa, sơ đồ, hình, âm thanh, bản ghi OCR hoặc bản dịch từ JAC/JF/JMAC/OTAFF/Prometric hay nguồn khác. Không chỉ thay vài từ trong câu gốc. Không dùng mô hình để tái dựng nguyên bản.
3. Không đưa PDF/HTML gốc, OCR, ảnh nguồn, trường ID/hash/đường dẫn nội bộ hoặc URL tải tài liệu gốc vào `src/`, `assets/`, package và màn hình app. URL nguồn chỉ nằm trong hồ sơ biên soạn. Không tuyên bố nội dung mới là tài liệu hoặc đề thi chính thức.
4. Bảng thuật ngữ có thể chứa từ nghề thông dụng kèm nghĩa do nhóm tự biên tập. Câu ví dụ, đối thoại và lời giải phải độc lập. Dẫn nguồn cho sự kiện và quy định, không sao chép phần diễn đạt.
5. Không có tỷ lệ phần trăm giống nhau nào bảo đảm an toàn bản quyền. Trước khi tích hợp, so trùng bản nháp với bản gốc đúng phiên bản nếu có quyền truy cập, loại thuật ngữ thông dụng khi đánh giá, kiểm thủ công từng đoạn tương đồng và lưu quyết định sửa/giữ cùng lý do. Nếu không có bản gốc để đối chiếu, ghi `similarityCheck: unavailable`; không tự ghi PASS.

## Cổng kiến thức và an toàn

- **建設:** chỉ dùng mục B1 `verified`; 30 mục không trọng yếu an toàn đã có bản nháp B2 nhưng `appIntegrationReady: false`. Các mục `safetyCritical` phải được chuyên gia xây dựng/an toàn đánh giá trước khi xuất bản; 19 mục `partially_verified` cần xác minh phần áp dụng và duyệt; 2 mục `unresolved` không dùng. Không biến một tiêu chuẩn công trình cụ thể thành quy tắc áp dụng chung.
- **外食業・飲食料品製造業:** 66 mục B1, hiện 0 `verified`, 56 `partially_verified`, 10 `unresolved`. Không gọi các mục này là kiến thức đề thi đã xác minh. Trước khi soạn hướng dẫn cụ thể về vệ sinh/an toàn và giới hạn số liệu, xác minh văn bản hiện hành, sản phẩm/công đoạn/cơ sở/địa phương/cấp 1号 hay 2号, và nhận duyệt của đúng chuyên gia. Không chuyển quy định nhà máy sang nhà hàng hoặc ngược lại. Nếu chưa đủ bằng chứng, chỉ ghi ý tưởng cần nghiên cứu; không tạo bài học phát hành.
- Dịch Nhật–Việt chỉ từ **bản mới do dự án viết đã được duyệt**. Kiểm tra thuật ngữ, furigana, tính tự nhiên, đáp án; tách lời khuyên, thực hành thông thường và nghĩa vụ pháp lý.

## Hồ sơ bắt buộc cho từng bài

Ghi: `lessonId`, ngành, cấp 1号/2号, knowledge ID B1, mục tiêu, URL/tên/phiên bản/ngày truy cập nguồn chính thức, câu khẳng định được nguồn hỗ trợ, giới hạn áp dụng, bản thảo Nhật, bản dịch Việt, người soạn, người kiểm chuyên môn, người kiểm Nhật–Việt, kết quả rà quyền và so trùng, quyết định xuất bản. Theo dõi `verificationStatus`, `domainReviewed`, `languageReviewed`, `rightsReviewed`, `similarityReviewed`, `appIntegrationReady` độc lập; thiếu mục nào thì để `false`/chưa xác minh.

## Chỉ tích hợp sau khi đạt gate

Chuyển **nội dung mới đã duyệt** sang schema app; chỉ tạo dữ liệu/routes cần thiết của phần specified skills, giữ nguyên UI JLPT đã khóa. Kiểm thử hiển thị, điều hướng, đáp án, tiếng Nhật/Việt, thiết bị; kiểm tra không có tài liệu gốc trong bundle. Commit và push checkpoint lên nhánh theo quy tắc `AGENTS.md`; fetch xác nhận trạng thái remote. Không gắn `appIntegrationReady: true` hoặc nói đã phát hành trước khi đủ bằng chứng.

## Prompt thực thi ngắn cho phiên AI kế tiếp

> Đọc AGENTS.md, docs/AI_SESSION_START_HERE.md, chỉ mục nguồn và bản yêu cầu này. Kiểm tra trạng thái thực tế của ba repo trên GitHub; kiểm kê những tài liệu gốc thực sự có byte/hash, không suy đoán từ danh mục. Với mỗi mục đủ điều kiện B1, tạo bài học Nhật–Việt độc lập bằng từ vựng và kiến thức đã xác minh; không sao chép hoặc dịch sát cấu trúc/câu chữ/đề/hình của nguồn. Rà chuyên môn, quyền và tương đồng, ghi blocker chính xác, lưu checkpoint bền. Chỉ đưa bài đã qua gate vào app; không sửa JLPT UI. Tiếp tục các mục đủ điều kiện khác khi một mục bị chặn.
