# Phân loại ba lĩnh vực công nghiệp mới: リネンサプライ、物流倉庫、資源循環

Ngày ghi nhận: 2026-09-23

## Mục đích và ranh giới

Báo cáo này lưu kết quả nghiên cứu và quyết định phân loại cho ba **産業分野** thuộc hệ thống **特定技能／育成就労**. Đây không phải là checkpoint triển khai: không bổ sung dữ liệu nghề, adapter, route hay UI.

Ba lĩnh vực này phải được quản lý tách biệt với danh mục **技能実習** cũ do OTIT tổ chức theo **職種・作業**. Sự trùng hoặc gần nhau về tên/công việc không làm cho một 産業分野 mới trở thành một 職種・作業 OTIT.

## 1. リネンサプライ

### Hiện trạng trong repo

Repo hiện có mục **クリーニング → リネンサプライ仕上げ (`7-14-1`)** trong dữ liệu nghề của hệ **技能実習** cũ. Mục này là một **職種・作業 OTIT**, không phải bản ghi của 産業分野 mới.

Vì vậy, **リネンサプライ分野** của 特定技能／育成就労 phải được phân biệt rõ với `リネンサプライ仕上げ (7-14-1)` hiện có; không được coi hai khái niệm là cùng một loại dữ liệu chỉ vì tên gọi có liên hệ.

### Phạm vi công việc

Phạm vi gồm chuỗi công việc đối với đồ vải dùng tại khách sạn, bệnh viện và các cơ sở khách hàng tương tự:

- tiếp nhận;
- phân loại;
- giặt;
- sấy;
- hoàn thiện;
- kiểm tra;
- bó/đóng kiện;
- xuất đồ vải.

### Nguồn chính thức

- Bộ Y tế, Lao động và Phúc lợi Nhật Bản (MHLW): [制度の概要（リネンサプライ分野）](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/seikatsu-eisei/linen_supply2.html)

Trang MHLW công bố riêng chế độ cho **リネンサプライ分野**, dẫn chiếu cả 特定技能 và 育成就労, đồng thời dẫn chính sách vận hành được Nội các quyết định ngày 23/01/2026. Điều này củng cố việc mô hình hóa nó như một 産業分野 mới, không phải mở rộng trực tiếp mã OTIT `7-14-1`.

## 2. 物流倉庫

### Hiện trạng trong repo

**物流倉庫** hiện chỉ xuất hiện trong dữ liệu địa điểm và kịch bản. Nó chưa tồn tại như một ngành/lĩnh vực nghề được đăng ký trong dữ liệu nghề hiện hành.

### Phạm vi công việc

Phạm vi cốt lõi gồm:

- nhập kho;
- lưu kho và quản lý hàng trong kho;
- xuất kho.

Các nghiệp vụ cụ thể có thể bao gồm giao nhận và kiểm hàng, di chuyển hàng, đưa hàng vào vị trí lưu trữ, picking và gia công lưu thông trong phạm vi công việc kho.

### Căn cứ bổ sung lĩnh vực

**物流倉庫分野** được bổ sung vào **特定産業分野** và **育成就労産業分野** theo quyết định Nội các ngày **23/01/2026**.

### Nguồn chính thức

- Bộ Đất đai, Hạ tầng, Giao thông và Du lịch Nhật Bản (MLIT): [物流倉庫分野における特定技能外国人・育成就労外国人の受入れについて](https://www.mlit.go.jp/seisakutokatsu/freight/warehousing_ssw.html)

## 3. 資源循環

### Hiện trạng trong repo

**資源循環** chưa có trong dữ liệu nghề hiện hành.

### Phạm vi công việc

Phạm vi là **廃棄物処分業（中間処理）** — xử lý trung gian chất thải — áp dụng cho cả:

- chất thải thông thường (**一般廃棄物**);
- chất thải công nghiệp (**産業廃棄物**).

### Nguồn chính thức

- Bộ Môi trường Nhật Bản: [資源循環分野における特定技能制度及び育成就労制度](https://www.env.go.jp/recycle/waste/foreigner.html)

Trang của Bộ Môi trường xác định rõ nghiệp vụ tiếp nhận là `廃棄物処分業（中間処理）` và cả 一般廃棄物 lẫn 産業廃棄物 đều thuộc phạm vi.

## Kết luận kiến trúc bắt buộc

1. Cả **リネンサプライ**, **物流倉庫** và **資源循環** đều là các **分野** thuộc **特定技能／育成就労**.
2. Không chèn trực tiếp ba lĩnh vực này vào `src/data/technical-intern-jobs.ts` hoặc danh mục OTIT **96職種／174作業**.
3. Khi triển khai, phải tạo một mô hình dữ liệu riêng cho **育成就労産業分野** (đồng thời biểu diễn quan hệ với 特定技能 khi cần), sau đó tạo ánh xạ liên hệ rõ ràng với dữ liệu hiện có. Ánh xạ chỉ biểu diễn quan hệ/tương đồng/chuyển tiếp; không được đồng nhất 産業分野 với 職種・作業 OTIT.
4. Riêng `リネンサプライ`, ánh xạ tương lai có thể liên hệ tới `クリーニング → リネンサプライ仕上げ (7-14-1)`, nhưng hai thực thể phải giữ ID, loại phân loại và nguồn pháp lý độc lập.
5. Riêng `物流倉庫`, các địa điểm/kịch bản hiện có chỉ là nội dung ngữ cảnh, không phải bằng chứng rằng lĩnh vực nghề đã được đăng ký trong catalog.
6. **Checkpoint này chưa triển khai dữ liệu hoặc UI.** Không thay đổi UI, UI Lock, catalog JLPT hay dữ liệu nghề hiện hành.
