# Tokutei Gino — chỉ mục tài liệu gốc phục vụ biên soạn

Cập nhật: 2026-09-25. Đây là **chỉ mục**, không phải bản sao tài liệu gốc. Repo `duykhanhtokio/japan-app` công khai; không thêm PDF, HTML, OCR, bản dịch, đề/đáp án của bên thứ ba vào repo hoặc `assets/`, `src/`, bundle Expo.

## Kho riêng đã lưu

| Ngành | Kho / vị trí | Kiểm tra được | Chưa xác nhận |
| --- | --- | --- | --- |
| 外食業・飲食料品製造業 | `duykhanhtokio/tokuteigino-food-clean-authoring`: `checkpoint.zip` (Git LFS SHA-256 `b663b896692486029e8028863a6621a15f3b67d6951fa2f5263057d4dd7d70cf`, 1,466,438 bytes), `authoring/stage-a-handoff/`, `authoring/stage-b1/` | Checkpoint và file cấu trúc đã push; quyền tái phân phối PDF chưa xác minh; 66 mục B1: 0 verified, 56 partially_verified, 10 unresolved. | Chưa kiểm kê trực tiếp toàn bộ ZIP bằng bản nhị phân; không khẳng định tất cả PDF gốc nằm trong ZIP. |
| 建設 | `duykhanhtokio/tokuteigino-kensetsu-clean-authoring`: `stage-a-handoff/`, `stage-b1/`, `stage-b2/` | 101 mục B1: 80 verified, 19 partially_verified, 2 unresolved; 30 bài B2 không trọng yếu an toàn còn là bản nháp. | Cây repo hiện tại không có PDF JAC gốc; không có bằng chứng các PDF xây dựng đã được lưu bền ở GitHub. |

Nguồn nghiên cứu và quyền xem tại `authoring/stage-a-handoff/source-rights-map.json` (thực phẩm), `authoring/stage-b1/official-sources.json` (thực phẩm), `stage-b1/official-sources.json` (xây dựng). Đường dẫn `localPath` trong bản đồ nguồn là vị trí trên máy biên soạn, không phải đường dẫn có thể đọc từ app hay bằng chứng PDF tồn tại ở GitHub.

## Quy tắc lấy nguồn

- Người biên soạn có thể kiểm tra bản gốc hợp pháp trong kho riêng hoặc trang của chủ sở hữu; dùng thuật ngữ, khái niệm và phạm vi chủ đề để xây dựng nội dung mới theo yêu cầu tại `docs/ssw-workspace/TOKUTEIGINO_ORIGINAL_AUTHORING_REQUIREMENTS_2026-09-25.md`.
- Không tải nguồn riêng qua runtime, không thêm liên kết tải PDF gốc trong giao diện, không đồng bộ tài liệu gốc vào repo công khai.
- Khi cần khôi phục bản gốc thiếu, kiểm kê tên file, phiên bản, SHA-256, URL/chủ sở hữu, trạng thái quyền và bản lưu riêng; đối chiếu với bản đồ nguồn trước khi đánh dấu đã lưu. Chỉ đánh dấu `sourceArchived: true` khi kiểm được byte thực tế và hash.
- App chỉ được chứa bài học tự viết đã hoàn tất kiểm chứng và rà quyền. Không gắn nhãn là tài liệu/đề chính thức.
