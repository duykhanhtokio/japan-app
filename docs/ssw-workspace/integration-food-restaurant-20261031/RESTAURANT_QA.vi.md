# Kiểm tra Nhà hàng sau tích hợp — 2026-10-31

Nguồn ngành: `8b8f47562`. Đã chạy kiểm tra trên cây tích hợp hiện tại, không chuyển nhánh và không sửa production runtime. Receipt/lệnh/log tại `restaurant-checks.json` và `restaurant-logs/`.

**Kết quả:** 12 bộ kiểm hiện có PASS sau giải quyết phụ thuộc môi trường, thêm một regression hook thực PASS. Bộ browser kiểm race state bị chặn trước khi tạo trang do Chromium `socket() failed: Operation not permitted (1)`; không ghi đè bằng chứng browser lịch sử.

| Kiểm tra | Kết quả thực chạy |
|---|---|
| Cấu trúc ngành | STRUCTURAL_PASS; 120 bài, 984 câu, 692 mục glossary; 12 locale có dữ liệu tương ứng; `complete:false` |
| Liên kết kiến thức | 639 mục: 336 covered, 264 partial, 39 structural_only; 120 bài/984 câu đều liên kết theo chủ đề |
| Furigana theo ngữ cảnh | 7.622 trường, không còn trường không phủ; không chứng nhận mọi cách đọc |
| Chữ số bản dịch | 112.452 trường, không còn flag trong phạm vi bộ lọc |
| Nhiệt độ có dấu | 396 trường, không còn flag |
| Thuật ngữ revision-bound | PASS các sửa đổi đã được ghi nhận; không chứng nhận toàn bộ ngữ nghĩa mọi locale |
| Bài tập gọi món | 28 nhãn, 12 locale, 336 nhãn dịch, 10 kiểm tra số học |
| Sửa cách đọc đã rà | 88 sửa phát âm và 6 trường dịch khớp phạm vi đã ghi nhận |
| Study state | PASS cách ly người học/cấp/revision, tiến độ đọc, hoàn thành, đáp án/vị trí, dữ liệu hỏng và chấm điểm |
| Lazy loading | PASS cấp/locale được chọn, hash bản dịch, glossary và placeholder |
| Ngày học | 120 binding, 59 họ hình, 75 ngày có đoạn đối chiếu, 900 binding locale, bảo toàn byte 18 tệp gốc so với `475625ae...` |
| Detail guides | React/RNW SSR 78 trường hợp và 130 trường hợp component bổ sung; mặc định không lộ đáp án |
| Hook race regression bổ sung | Hook `useRestaurantRecord` thực: ghi cũ đến muộn không đổi trạng thái lỗi khóa mới; lưu bản raw hỏng đúng khóa khi reset; giữ cả hai lần ghi |

Khối lượng thân bài Nhật thực hiển thị, tính cả đoạn đối chiếu: cấp 1 có 59 ngày, ít nhất/trung vị/nhiều nhất 555/680/955 ký tự; cấp 2 có 61 ngày, 610/794/1.412 ký tự. Đoạn đối chiếu không tự hoàn thành bài được trích. Đây là tải đọc theo ký tự, chưa đo 30 phút với người học.

## Phụ thuộc và lỗi môi trường đã giải quyết

`RestaurantReading` cần `src/components/world/japanese-ruby-data.ts` vốn có trong HEAD nhưng chưa materialize ở sparse checkout; chủ tích hợp đã materialize. Route sử dụng `prepareSceneRoute`, `LanguageContext`, `useUserProfile`, `RoyalPageBackground`, `StableSafeAreaView`; Course dùng `TokuteiChrome`, `StudyAppearance`, `RoyalPanels`, `AppBackdrop`; state dùng `kensetsu-test-state`. Không lấy phiên bản shared cũ từ nhánh ngành đè lên main.

Daily validator ban đầu không tìm được `react/jsx-runtime` vì esbuild build API không nhận nodePaths từ thư mục QA deps. `restaurant-esbuild-nodepath.cjs` chỉ bổ sung đường dẫn dependency từ NODE_PATH cho build; không thay source, dữ liệu, assertion hoặc component. Sau đó PASS. Cảnh báo thiếu `expo/tsconfig.base` ở môi trường QA rút gọn vẫn được ghi trong log; không tuyên bố full Expo TypeScript/build từ kiểm tra này. Detail SSR dùng React/RNW thật với storage adapter theo script; hook regression dùng React test renderer và AsyncStorage kiểm soát được, không phải browser/native.

## Tài sản và cửa nghiệm thu còn mở

Lần kiểm byte mới nhất trước khi chủ tích hợp hoàn tất khôi phục LFS: `vegetables-v1.png` có PNG thực 1.891.069 byte, SHA256 `80e34ddaeb008bda56cb8a9ce6ed9e1cd261f6f5a53f64bc0d2d4f8b3f258105`; hai tệp sau vẫn là pointer 132 byte:

- `kitchen-tools-v1.png`: cần đúng SHA256 `88fe7a626660fa44ae365ec06cecda0f933d31384752ff744e557609872c894d`, 1.687.793 byte.
- `meat-trays-v1.png`: cần đúng SHA256 `6f1f242c1ea8407c7203e3e9cd71bcf4ba474207ec10e79346191926c51f1e7d`, 1.896.599 byte.

Chủ tích hợp sở hữu việc lấy lại đúng hai object; không tạo ảnh thay thế. `restaurant-assets-at-audit.json` ghi trạng thái tại lúc kiểm, cần đối chiếu với receipt khôi phục cuối của chủ tích hợp trước khi công bố ảnh sẵn dùng.

Bảy cờ nghiệm thu toàn ngành vẫn pending: nguồn đầy đủ, an toàn, độc lập ngữ nghĩa câu hỏi, mọi furigana, mọi bản dịch, mọi hình và browser flow. 264 mục nguồn còn partial là thiếu chi tiết cụ thể; 39 mục chỉ cấu trúc. `check.py --complete` không dùng làm cổng hợp nhất vì các giới hạn này đã khai báo, nhưng cũng không tuyên bố ngành đã nghiệm thu hoàn toàn.

Không chạy lại source-overlap vì cần bảy bản trích nguồn bên ngoài Git mà môi trường tích hợp chưa có; không suy diễn chứng nhận nguyên gốc từ kiểm cấu trúc. Không chạy daily browser harness khi Chromium đã bị chặn; historical `daily-fix-20261031/browser-qa.json` giữ nguyên giá trị lịch sử (120 Reader, 16 responsive, 12 locale), không cộng thành kiểm tra browser mới. Chưa kiểm điện thoại thật, full Expo app, chuyên gia an toàn/thiết bị hoặc người bản ngữ.
