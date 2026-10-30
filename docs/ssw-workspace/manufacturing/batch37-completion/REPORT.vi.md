# Sản xuất1号 — lô37 tập trung sáu AI, ngày31/10/2026

Chỉ xử lý Tokutei sản xuất1号 trên recovery/jlpt-n3-n1, tiếp tục từ0032fb4aa67aade9af1fa8fbf562cdde919d524c. Ban đầu ba AI phụ trách trọn chuyên ngành,hai AI dịch và một AI tích hợp. Khi Nhật ngữ ổn định, chuyển tác giả sang dịch để cả năm AI sản xuất ngôn ngữ song song; AI tích hợp giữ mã nguồn và kiểm tra theo đợt. Không làm ngành khác hoặc2号.

## Đã tích hợp

-22 bài bổ sung: cơ khí8,điện6,bề mặt8;22 bài kiểm tra riêng với80 câu mới:32/24/24. Các bài xuất hiện trong danh sách bài tham khảo bổ sung của từng chuyên ngành; bài kiểm tra dùng bộ điều khiển tuần hiện có. Không thêm vào30 đề mô phỏng để thổi số lượng đề.
-Đủ12 ngôn ngữ cho toàn bộ phần mới:264 cặp bài–ngôn ngữ và960 cặp câu–ngôn ngữ. Mọi tiêu đề,mục tiêu,đoạn,thuật ngữ,hoạt động,cảnh báo,tổng kết,lựa chọn và giải thích đều có bản dịch. Nhật là nguồn chuẩn; không tự thay ngôn ngữ khác khi thiếu hoặc lệch hash.
-7 bảng hình SVG/PNG độc lập:4 cơ khí về đo lường,bản vẽ,đặc trưng và chi tiết máy;3 bề mặt vềQC,dụng cụ và ăn mòn/cấu trúc màng.9 liên kết bài dùng đúng hash và phần tổng kết đã dịch làm chú thích. Tổng34 tệp hình độc lập gồm27 trước đây+7 mới; không coi9 liên kết là9 hình mới.
-Giữ nguyên262 bài lõi,456 câu tuần lõi,8 câu thước cặp,4 câu Boolean,30 đề gốc+3 bộ tuyển chọn và12 hướng dẫn cũ. Tổng phần luyện bổ sung mới là80 câu; ngân hàng cũ và khóa tiến độ không bị thay.

## Kiến thức và phạm vi nguồn

Cơ khí bổ sung nhómQC/ghi chép,biến thể dụng cụ/V-block,thước cặp/độ cứng,đường nét/hình chiếu/mặt cắt,lắp ghép/chỉ dẫn,mối hàn/vật liệu và chi tiết máy. Điện bổ sung chọn máy hiện sóng,LCR,nhiệt điện đôi,photodiode,ba phươngHall,phương pháp đo điện trở và điều kiện sai số. Bề mặt bổ sung phương pháp thử/vết lõm,phân tích/vật liệu/điện tích,dụng cụ/chỉ thị,đánh bóng,QC,phạm vi an toàn/môi trường và phân biệt điều kiện ăn mòn/điện cực/sơn.

Dùng PDF có SHA đã xác minh và hồ sơ từng trang sẵn có; không khởi động lại công việc nguồn đã được kiểm. Không đưa PDF/ảnh trang nguồn vào app hoặc repository,không sao chép bài tập/hình nguồn. Ví dụ số liệuQC và hình học mới là mô hình học trên giấy,không phải giới hạn chấp nhận hay hướng dẫn vận hành thật. Trang điện151 không trình bày đủ cấu tạo/cân bằng cầu nên không tự gán kiến thức đó cho nguồn. Các hạn chế thành phần hóa chất,vật liệu,công đoạn và tiêu chuẩn vẫn được giữ.

## Kiểm tra

-Main manufacturing gate PASS,bao gồm đầy đủ22 bài/22 check/80 câu mới,264/960 cặp dịch,hash và nguồn,giữ66 tệp lõi đã ghi hash,tiến độ/đáp án/chấm điểm và từ chối dữ liệu cũ. Nội dung cũ không đổi.
-SSR component thật PASS:104 trường hợp hình cũ,192 lựa chọnBoolean và208 trường hợp hình mới; đúng bật/tắt bản dịch và ẩn hình khi phiên bản bài lệch. Adapter appearance/safearea/image được khai báo. Đây không phải bố cục trình duyệt,tải ảnh thực,tương tác zoom hoặc chứng nhận thiết bị native.
-TypeScript phần helper và component hình mới PASS;reader TSX biên dịch cú pháp PASS. ESLint các TS/TSX thay đổi PASS0 lỗi/0 cảnh báo;JLPT UI khóa10/10 PASS;git diff --check PASS. Không chạy lại fullExpo/fullappTypeScript hoặc fullassembler trong lô này.
-Hook reader mới có snapshot chính xác,khôi phục từ bản trước,lặp không đổi và từ chối byte không nhận dạng trước ghi. Các generator hình đã lưu cùngSVG nguồn. Các mảnh dịch bàn giao trùng chỉ được xóa sau khi xác nhận toàn bộ80 câu/ngôn ngữ đã có nguyên vẹn trong tệp chuẩn.

## Chưa hoàn tất toàn ngành

Register hữu hạn remaining-required-work.json hiện có15 nhóm sản phẩm cần làm tiếp,không phải15 bài mới. Các nhóm ghi trang nguồn,mục tiêu nhận diện còn thiếu,bài liên quan và loại hình/bài kiểm tra cần bổ sung; đã loại trùngQC/ký hiệu và phần đã có trong7 bảng mới. Cơ khí còn14 dòng minh họa thuộc8 nhóm; bề mặt còn26 dòng minh họa sau12 phần được bổ sung có phạm vi giới hạn. Số dòng không đồng nghĩa số hình/bài còn thiếu.

Phạm vi bảng/ví dụ/quy trình riêng của nguồn và các điều kiện chưa đủ bằng chứng được tách riêng,không suy rằng mọi ảnh PDF phải được sao chép hoặc mọi giới hạn nguồn đều là một bài còn thiếu. Kiểm kê toàn bộ đối tượng kiến thức574 trang chưa được chứng nhận đầy đủ. Nghiệm thu chuyên môn/bản ngữ,Expo/native và thiết bị thật vẫn riêng biệt. wholeCurriculumComplete/releaseReady/nativeReviewed/domainReviewed/humanReviewed/physicalDeviceVerified đều false. Không có tiến trình chạy ngầm sau khi chốt phiên.
