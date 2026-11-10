# Minh họa đủ98ngày điện–điện tử — implementation40

Đã gắn hình trọng tâm cho98/98bài lõi theo lịch14tuần×7ngày. Tạo88cặpSVG/PNG độc lập có byte thực,giữ10hình cũ khi thật sự phù hợp. MỗiPNG mới1400×900;tổngPNG mới2.34MB. 67họ hình có cấu trúc thị giác thực:thiết bị,mạch,nút nối,linh kiện,đo lường,bản vẽ,quy trình mặt cắt,phân biệt trạng thái,kiểm tra và bố trí nơi làm việc. Chủ đề gần nhau có thể dùng cùng họ hình;không tuyên bố88hình là88nguyên lý khác nhau.

`daily-bindings.json` lưu IDbài/hash nguồn,mục tiêu trọng tâm,ID/path/kích thước/hash hình,caption/alt Nhật,lý do phù hợp,nguồn/quyền và cờ kiểm tra. Caption dùng đúngsummaryJa,alt dùng đúngtitleJa hiện hành để có thể tái sử dụng bản dịch12ngôn ngữ mà không sửa nghĩa. Một hình minh họa mục tiêu trọng tâm của ngày,không tuyên bố bao phủ mọi mục tiêu phụ. Mười hình cũ córenderedByExistingComponent=true để luồng tích hợp không nhân đôi hình đang hiển thị.

Đã xem88hình mới trên4contactsheet ngoài repo và xem riêng một sốhọ kỹ thuật;đã sửa khe tiếp điểm mạch tự giữ,mặt chiếu vật thể chữL,vị trí mũi tên thước sâu,thứ tự loại màng/đồng,phân biệt hướng vật lý và một thanh thước bị cắt mép. Trìnhvalidate kiểm tra98binding/hash/kích thước,544nhãn,minfont26,bounds chữ và mép phải ảnh. Mạch tự giữ không có đường dây nối tắt qua tiếp điểm;ví dụ sóng5div×2ms/div=10ms và mã màu1kΩ±5% đã kiểm tra bằng phép tính.

Các ảnh là sơ đồ học tập độc lập,không chép PDF,không dùng ảnh ngoài và không đặt định mức vận hành giả. Không phải chứng nhận giống mọi thiết bị thật,tiêu chuẩn hiện hành hay thao tác được phép. Kiểm tra responsive trong reader/zoom và12captionthuộcluồngtíchhợp;chuyên gia/người bản ngữ/thiết bị thật vẫnfalse. Không sửa corebank,UIhay lịch trong luồng tạoảnh.

Tái lập:PYTHONDONTWRITEBYTECODE=1 python docs/ssw-workspace/manufacturing/implementation40/electrical/generate.py rồi validate.py cùng thư mục. Chỉ validate sau khi đã khảo sát pixel thực tế.
