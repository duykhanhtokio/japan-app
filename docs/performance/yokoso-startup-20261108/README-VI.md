# Kiểm tra khởi động YOKOSO — 08/11/2026

## Kết quả và giới hạn

Đã sửa các điểm xử lý dư trong phần học JLPT/từ vựng và dịch chữ giao diện. Nhóm sửa nội dung chạy đã lưu trên `recovery/jlpt-n3-n1` tại `6f0a321accd3c5491d49a6744a10aeac2870329a`, với tree SHA đối chiếu bằng bản đã kiểm tra cục bộ.

**Chưa chứng nhận toàn app đã mở nhanh trên iPhone.** Không có Mac, Xcode, simulator, thiết bị hoặc dữ liệu AsyncStorage thực tế của người dùng trong môi trường Linux này. Không có số đo nhận bundle qua LAN/tunnel, thời điểm tương tác, FPS, giải mã ảnh/audio hay bộ nhớ native. Không suy số đo thiết bị từ các phép đo JavaScript dưới đây.

Mốc so sánh là `022966903c5c3d074645cc3523a852f56d64baed`, bản đầu phiên. Đây không phải mốc lịch sử đã được người dùng xác nhận chạy nhanh; chưa xác định được một commit duy nhất gây chậm.

## Môi trường đã kiểm tra

- Node v24.22.1, Linux; Expo 54.0.37, React Native 0.81.5, Expo Router 6.0.24.
- `ios/Podfile.properties.json`: Hermes, New Architecture bật. Không chạy Hermes native tại đây.
- `metro.config.js`: 2 worker; nén JSON bằng transformer riêng; `inlineRequires: true`.
- `app.json`: Expo Router `asyncRoutes: "development"`. CLI và Babel của phiên bản đang cài chuyển thiết lập này thành chế độ import `lazy` khi development, `sync` khi production. Vì thế có thể thấy bundling khi lần đầu mở route/module trong development. Không tắt tính năng này một cách mù quáng để dồn toàn bộ chi phí sang khởi động.
- Lịch sử xác minh: trước `1c9e24eef` chưa có thiết lập `asyncRoutes`; commit `1c9e24eef` ngày 01/11/2026 thêm giá trị `development`, và hiện vẫn giữ. Đây là thay đổi giải thích cơ chế bundling khi mở mục ở development, chưa chứng minh là nguyên nhân duy nhất của toàn bộ độ chậm.
- Không truy cập được tiến trình trên Mac nên chưa biết máy người dùng đang dùng Expo Go/development client, simulator/iPhone, LAN/tunnel hoặc có Metro trùng nhau hay không.
- Checkout kiểm tra là partial/sparse, không có toàn bộ media và các tài liệu JSON trong `docs/`. Mục thiếu trong đồ thị tĩnh có thể do phạm vi checkout, không phải chứng cứ asset bị mất trong bản app. Chưa quét được kích thước pixel toàn bộ ảnh hoặc xác minh toàn bộ LFS trên máy người dùng.

## Nguyên nhân đã xác minh và thay đổi

1. `src/data/jlpt-study-data.ts` trước sửa khởi tạo cả từ vựng và ngữ pháp ở cấp module. `vocabulary-localization.ts` kéo theo 12 gói ngôn ngữ, các map tra cứu và 293 shard ví dụ. Phép chạy module cô lập ghi nhận 319 JSON, tổng 23.678 MB nguồn, trước khi người gọi cần từ vựng.
   - Mảng học chỉ khởi tạo khi được dùng. `Array.isArray`, thứ tự, phép lặp và dữ liệu được giữ.
   - Ngữ pháp tách khỏi khởi tạo từ vựng. Tải chữ hướng dẫn từ vựng không còn kéo theo toàn kho học.
2. `vocabulary-practical-example-shards.ts` trước sửa import rồi ghép tất cả shard. Bây giờ chỉ mục ID chọn shard cần thiết. Các file nội dung gốc không bị sửa; chỉ thêm chỉ mục sinh tự động. Generator gốc cũng được nối với generator chỉ mục để lần biên tập sau không hoàn tác tối ưu.
3. Màn hình từ vựng trước sửa lọc cấp độ sau khi đã dịch/ghép toàn bộ 8.350 từ. Bây giờ chọn cấp độ trước, tái sử dụng các từ đã xử lý. Tìm kiếm toàn bộ cấp độ vẫn giữ. Trang chi tiết tra một ID và không import `jlpt-learning.ts`, vốn kéo thêm toàn bộ scenarios.
4. `src/i18n/ui-text.ts`: mỗi Text trước sửa quét 91 dòng nguồn, chuẩn hóa lại và dựng regex template nhiều lần. Đã lập chỉ mục nguồn chính xác, biên dịch trước 9 template. Thứ tự ưu tiên, khoảng trắng và tham số giữ nguyên.

Không thay nội dung học, ảnh, audio, quyền Premium, vé vàng, khóa lưu tiến độ hoặc giao diện làm đề. Chỉ thêm trace chẩn đoán có cờ bật riêng; không thêm dịch vụ mạng hay tác vụ nền.

## Số đo trước–sau

`hotpaths.json` chứa từng mẫu, môi trường và kiểm tra bảo toàn. Mỗi dòng lấy trung vị 3 lần với module/data cache mới; compiler và OS file cache đã làm nóng. Đây là load/parse/evaluate JavaScript cô lập trên V8/Linux, dùng cùng chính sách nén JSON của dự án; không phải toàn bộ màn hình hoặc iPhone.

| Thao tác dữ liệu | Trước | Sau | JSON trước → sau |
|---|---:|---:|---:|
| Nạp module học, chưa dùng kho dữ liệu | 876.22 ms | 0.73 ms | 319 → 0 |
| Lấy ngữ pháp N5 lần đầu | 861.13 ms | 59.72 ms | 319 → 4 |
| Lấy từ vựng N5 lần đầu | 942.47 ms | 316.25 ms | 319 → 43 |
| Tra một từ lần đầu | 869.43 ms | 202.96 ms | 319 → 17 |

Cache theo cấp độ được xác minh trả đúng cùng mảng khi quay lại. Thời gian lấy lại mảng trong test dưới 0.01 ms; đây không phải thời gian mở lại màn hình.

Đối chiếu dịch giao diện: 369 chuỗi thử trên toàn bộ ngôn ngữ, bao gồm chuỗi chính xác, template, khoảng trắng, dấu câu và chuỗi không có bản dịch. Các lần đo thực hiện 11.070 lượt tra/run; xem `uiTranslation` trong JSON để lấy số thô.

### Metro: không nhận là đã sửa xong bundling

`data-bundles.json` đo bằng Metro thật, platform iOS, dev=true, không minify, **chỉ graph `jlpt-study-data.ts`**, 3 cặp trước/sau xen kẽ, cache đĩa mới cho cold và dùng lại cho warm. Phép đo gồm tạo graph/server tạm thời; không phải thời gian Metro phục vụ toàn app đang chạy. Các cache tạm của phép đo được dọn khi kết thúc.

| Chỉ số graph dữ liệu | Trước | Sau |
|---|---:|---:|
| Cold, trung vị | 5.680 s | 6.317 s |
| Warm, trung vị | 2.354 s | 2.119 s |
| JavaScript development chưa minify | 8,386,980 byte | 8,411,047 byte |

Không có bằng chứng cold bundling nhanh hơn; lần đo sau còn cao hơn. Chỉ mục/loader thêm khoảng 24 KB JS development. Tối ưu chính là **giảm dữ liệu được thực thi khi mở mục**, không phải xóa nội dung offline khỏi bundle. Không dùng số liệu này để quảng cáo mức tăng tốc bundling toàn app. Môi trường máy chủ dùng chung cũng có nhiễu CPU/I/O.

`import-graph.json` là đồ thị tĩnh các import/require literal sau xóa type, gồm cả import trì hoãn, bỏ qua nội bộ npm. Khoảng 326 MB JSON nguồn và hàng nghìn tham chiếu media cho thấy graph lớn; đó không phải bundle minify, bytecode Hermes hoặc bộ nhớ lúc startup. Có các dependency chưa materialize trong sparse checkout và có thể có đường dẫn động không phân tích được. Không coi đồ thị này là kiểm kê đầy đủ.

## Bảng đo thiết bị còn cần hoàn tất

| Mục | Mở lần đầu | Mở lại | Trạng thái |
|---|---|---|---|
| Khởi động → trang chủ dùng được | Chưa đo | Chưa đo | Cần Mac/iPhone |
| JLPT / chọn cấp độ | Chưa đo | Chưa đo | Cần thiết bị |
| Danh sách đề / mở đề | Chưa đo | Chưa đo | Cần thiết bị; catalog còn import dữ liệu nhiều đề |
| Phần nghe / audio sẵn sàng | Chưa đo | Chưa đo | Cần thiết bị và media |
| Hội thoại | Chưa đo | Chưa đo | Cần thiết bị, mạng và cache thực tế |
| Tokutei: nông nghiệp, sản xuất, thực phẩm, nhà hàng, khách sạn, xây dựng,介護 | Chưa đo | Chưa đo | Cần lần lượt từng ngành |
| Từ vựng | Chỉ đo lớp dữ liệu | Chỉ đo cache dữ liệu | Chưa đo render/scroll trên thiết bị |
| Nhiệm vụ ngày / Premium / vé vàng | Chưa đo | Chưa đo | Không thay logic; chưa kiểm thử thiết bị |
| Peak memory / ảnh / giải mã audio | Chưa đo | Chưa đo | Cần công cụ native |

Các giả thuyết chưa chứng minh trên thiết bị: thời gian tải/prefetch ảnh và splash tối đa 10 giây; catalog câu hỏi khởi tạo nhiều đề; khối dữ liệu/bản dịch từng ngành; độ trễ mạng và lưu trữ; ảnh lớn và cache native. Không sửa bố cục, giảm chất lượng hoặc thay quyền học để che các vấn đề này.

## Cách mở bản đã sửa trên Mac

Dùng đúng checkout hiện tại của bạn. Nếu dùng đường dẫn chính cũ:

```bash
cd "$HOME/Desktop/japan-app99/japan-app"
git status --short
git branch --show-current
```

Nếu đang ở `recovery/jlpt-n3-n1` và không có thay đổi chưa lưu, cập nhật bằng:

```bash
git fetch --filter=blob:none --no-tags origin recovery/jlpt-n3-n1
git merge --ff-only origin/recovery/jlpt-n3-n1
```

Nếu có thay đổi chưa lưu hoặc khác nhánh, giữ nguyên chúng; không reset/clean/stash theo hướng dẫn này. Không cần cài lại dependency vì gói thư viện không đổi.

Nếu Metro cũ đang chạy trong terminal, dừng bằng Ctrl+C rồi khởi động **một** server:

```bash
bash scripts/performance/start-diagnostics.sh --lan
```

`--lan` dành cho iPhone cùng Wi-Fi với Mac. Có thể dùng `--localhost` cho simulator trên chính Mac. Script không ép đổi Expo Go/development client. Mở app bằng client phù hợp với native modules đã cài. Chụp/ghi lại tên thiết bị, loại client và kết nối thực tế.

Trong console tìm `YOKOSO_PERF`. Nếu terminal không hiện log, mở React Native DevTools bằng phím `j` và xem Console.

- `root_module_evaluated`: JS root bắt đầu chạy; không phải lúc chạm icon hoặc bắt đầu nhận bundle.
- `splash_hide_requested`: yêu cầu ẩn splash sau font và artwork; không phải xác nhận native đã vẽ.
- `navigation_requested` → `route_committed`: thời gian từ yêu cầu qua helper đến root nhận pathname, chưa bảo đảm nội dung đã dùng được.
- `route_next_frame`: callback animation frame tiếp theo, chưa phải phép đo first pixel hoặc interactive.
- `content_module_loaded`: promise import nội dung hoàn tất, chưa bao gồm thời gian render.
- `artwork_prepared`: lời gọi chuẩn bị artwork đã hoàn tất; không phải xác nhận ảnh đang hiển thị trên màn hình.

Lần lượt mở các mục trong bảng, quay lại rồi mở lại. Lặp 3 lần ở cùng điều kiện. Đối với khởi động, đóng hẳn app rồi mở lại; không xóa dữ liệu/tiến độ. Ghi riêng thời gian Metro báo Bundling, khi màn hình hiện nội dung và khi thao tác có phản hồi. Log chẩn đoán có thể tăng overhead; đo release cuối cùng khi tắt trace.

Sau khi có đầy đủ assets và toolchain iOS phù hợp, build Release để đo riêng trên thiết bị thật. Không suy hiệu năng release từ Expo Go hoặc `--no-dev`. Không có phiên bản release nào được dựng/gửi Apple trong phiên này.

Khi xong, Ctrl+C dừng Metro. Để chạy bình thường không ghi trace: `npx expo start`. Không dùng `--clear` làm giải pháp thường xuyên.

## Kiểm chứng và lỗi kiểm tra hiện hữu

- PASS đối chiếu tất cả 8.350 từ, 540 ngữ pháp, thứ tự từng cấp độ, alias Nhật, nghĩa planned, và cache identity.
- PASS 369 trường hợp dịch UI trên mọi locale, semantics của lazy array (lặp, length, reflection, thay đổi, freeze, retry).
- PASS typecheck có phạm vi cho các module dữ liệu mới với ambient Metro require của Expo; full `tsc --noEmit` dừng ở giới hạn heap mặc định 2 GB, nên không nhận full typecheck đã qua.
- PASS khóa JLPT: 10/10 file byte-locked và điều kiện registry giữ nguyên.
- PASS lean navigation và kiểm thử runtime trace/deferred import/cache/cancellation/retry có mock I/O. Đây không phải kiểm thử simulator.
- Lint các file app thay đổi: 0 error; 1 cảnh báo require vốn đã có trong `prepareSceneRoute.ts`.
- `check-scene-performance.cjs` gặp mock audio cũ thiếu `createAudioPlayer`; phần audio gốc không sửa trong tác vụ này. Không nhận suite đã qua.
- `check-deferred-route-loading.cjs` có so sánh thân màn `learn` với mốc lịch sử `126c53...` không khớp dù file đó không bị sửa trong phiên. Không thay baseline để làm xanh kiểm tra. Hành vi deferred hiện tại được kiểm riêng trong `scripts/performance/check-runtime-trace.cjs`.

Chạy lại bằng:

```bash
node --expose-gc scripts/performance/check-startup-hotpaths.cjs 022966903c5c3d074645cc3523a852f56d64baed
node scripts/performance/check-runtime-trace.cjs
node scripts/check-lean-navigation.cjs
node scripts/check-jlpt-approved-ui-lock.mjs
```

Phép đo Metro tốn thêm thời gian; chỉ chạy khi cần so sánh lại graph dữ liệu:

```bash
node scripts/performance/measure-data-bundle.cjs 022966903c5c3d074645cc3523a852f56d64baed
```
