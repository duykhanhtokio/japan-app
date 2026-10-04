# Japan App — xử lý nền và bằng chứng runtime, 2026-10-04

Nhánh: `recovery/jlpt-n3-n1`. Đây là bản sửa tiếp theo của UI tại `8aa70a1e`, không phải chứng nhận đã hết lỗi trên iPhone native. Người dùng cho phép sửa UI bị khóa trong phạm vi nền, yêu cầu giữ ảnh và thiết kế đã duyệt, dữ liệu, chấm điểm, nghe, Credit và EXP.

UI trước sửa được chạy từ `7b24350cd88b65b4993f9b412d33f88def1a0b3f`; UI tương ứng `8aa70a1e`. Đã fetch và giữ các cập nhật hội thoại từ remote tới `71a198964de17e9dbb2b9bbf8e0efd52e3e4bb83` trong phiên này. Các source được sao lưu và băm trước sửa. Hash UI trước/sau và file mới nằm trong `../ui-workspace/backdrop-runtime-2026-10-04/source-hashes.json`.

## Nguyên nhân và cách sửa

| Vị trí | Bằng chứng / nguyên nhân | Thay đổi | Nền chính thức giữ lại |
|---|---|---|---|
| Root → navigator → các trang học | DOM app thật có một Screen toàn màn hình màu `rgb(242,242,242)`. `contentStyle: transparent` chỉ xử lý lớp trong; React Navigation Screen còn dùng màu của theme ở lớp ngoài. Ảnh trước sửa ghi trang học nền xám. | ThemeProvider giữ DefaultTheme, đổi riêng nền navigator thành trong suốt, đi cùng chủ sở hữu ảnh chính thức. | `study-light.png`; `profile-details.png` cho nhóm trang tối đã dùng ảnh này. |
| Nhật Bản và tám bản đồ vùng | `/world` có cả root `profile-details` và ảnh bản đồ đang render. Bảng phân quyền nền bỏ sót chín route; bản đồ còn dùng Image thường. | Chín route nhận quyền sở hữu cảnh; root không mount ảnh chung. Ảnh bản đồ dùng ArtworkVisibility và unmount khi route không hoạt động. | Ảnh Japan/region phone, tablet, landscape hiện có. |
| Các cảnh bị giữ trong stack | Listener blur có thể đến sau cập nhật đường dẫn. Đây là rủi ro từ luồng subscription; chưa có video native để đo thứ tự trên thiết bị. | Root đọc snapshot khóa route bằng useSyncExternalStore. Chỉ route hoạt động render scene artwork; nội dung/state của màn được giữ. Snapshot là chuỗi ổn định, tránh vòng render do trả object mới. | Ảnh cảnh hiện có của Home, farm, thế giới, đăng ký, portal. |
| Lần đầu vào trang và khi quay lại | Chuỗi compositor thật ghi chữ trước khung Royal, nền trắng trước ảnh. Theo dõi decode/request chứng minh tài nguyên preload đã giải mã nhưng bị yêu cầu lại khi vẽ. | Web vẽ tài nguyên bằng CSS ngay theo kích thước cố định, giữ tài nguyên đã decode trong cache. Native nạp ImageRef bằng API expo-image hiện cài và dùng trực tiếp tham chiếu đã chuẩn bị; dùng đúng URI Asset.localUri. | Toàn bộ source và hình học hiện có, gồm chín slice Royal. |
| Điều hướng vào cảnh | Video trung gian ghi khoảng trắng lúc vào map/game lạnh. | Chuẩn bị ảnh đích trước push/replace; giữ màn hiện tại đến khi ảnh sẵn sàng. Có token cho ý định mới và hủy khi navigation đổi, xử lý nhấn liên tiếp/Back. Cổng chuẩn bị áp dụng cho Home/tab, world/map/directory, tỉnh, thành phố, địa điểm, hội thoại, portal, đăng ký và work. Farm chuẩn bị ảnh trước đổi area. | Cùng source cảnh trước sửa; không có fade, màn che hoặc ảnh mới. |
| Hồ sơ → chi tiết → đóng | RAF app thật có một khoảng 0 nền khi ảnh chính bị tắt trước khi Modal portal mount. | Một RoyalPageBackground của hồ sơ đổi trực tiếp giữa hai source đã dùng. Modal chi tiết trong suốt, không sở hữu ảnh thứ hai. Nội dung hồ sơ thường ngừng render khi mở chi tiết. | `profile-light.png` và `profile-details.png`. |
| Nhiệm vụ | Source main có ảnh minh họa nằm trong vùng scene, root lại bỏ qua toàn trang; còn màu beige `#ddd1bc` dưới ảnh. Đây là phát hiện source, chưa chứng nhận mọi kết quả nhiệm vụ native. | Root giữ study-light xuyên suốt main/result/error, giống nền đã dùng ở kết quả. Bỏ màu beige. Ảnh scene/NPC trong nội dung được giữ. | `study-light.png` và minh họa nhiệm vụ hiện có. |
| Listening review và Explore | Listening review còn page trắng flexGrow; Explore và Collapsible còn các wrapper ThemedView mặc định tạo nền cũ. | Bỏ fill toàn trang và wrapper nền dư; giữ màu nội dung, nút, accordion, whiteboard và trạng thái cần tương phản. | Nền chung đã có của route. |
| World: dữ liệu không tồn tại | Ba nhánh empty của tỉnh/thành phố/địa điểm không có ảnh trong route vốn sở hữu cảnh. | Empty dùng RoyalPageBackground chính thức mặc định; nhánh hợp lệ giữ nguyên ảnh cảnh. | `study-light.png` cho thông báo chữ tối. |
| Bắt đầu đề N5 trên web | Bản trước thực sự crash: `Image.resolveAssetSource is not a function`, khiến app mất toàn cây render. | N1OfficialTrial dùng Asset.fromModule lấy kích thước khi API RN không có; đường native cũ giữ nguyên khi API tồn tại. | Không đổi ảnh câu hỏi, đáp án, điểm hay vị trí nghe. |

Ảnh chuẩn bị nằm trong cache tài nguyên. Chỉ chủ sở hữu nền đang hoạt động đưa ảnh vào cây render. Không tạo view nền ẩn, không dùng opacity/zIndex để giấu ảnh cũ. Không có lớp wash/dimmer mới. Nền chung không phụ thuộc trạng thái bắt đầu, tiếp tục, nộp, kết quả hoặc đáp án của JLPT. Các phép đo nội dung/hotspot/câu hỏi được giữ; không có onLayout điều khiển tháo/dựng nền.

## Phạm vi và phân loại

Audit source lập chỉ mục 58 route, 307 module có thể đi tới qua import và 67 module có JSX artwork/background. Đây là chỉ mục source, không phải số component cùng mount. Danh sách đầy đủ trong `live-background-audit.json`.

28 file `.before-*`/`.backup` không phải route. Các component artwork không đi tới từ route như N5LearningJourney, N1Official201207Test, ApprovedScannedExam, AnimalWorld, WarehousePanel, NpcActor/DialogueNpcVideo được phân biệt với renderer đang hoạt động; không mô tả chúng là lớp GPU đang chạy. Không xóa nội dung lịch sử để làm đẹp thống kê.

Giữ màu chọn đáp án/đúng/sai, tiến độ, các card hoặc nút cần tương phản, whiteboard, khung Royal, NPC và minh họa. Không thay dữ liệu học, hội thoại, chấm điểm, session-storage, audio mapping, Credit/EXP hoặc điều kiện lên cấp. Dữ liệu hội thoại mới từ remote được giữ nguyên.

## Bằng chứng thực tế

Thư mục: `docs/ui-workspace/backdrop-runtime-2026-10-04`.

- `before/transitions.mp4`, `before/compositor-frames.zip`: app production Chromium thật trước sửa; nền xám, khung hiện trễ và lỗi bắt đầu N5. Không tái dựng bằng mock.
- `after/transitions.mp4`, `after/compositor-frames.zip`: toàn bộ paint mà CDP ghi được trong lượt 63 thao tác; tên và timestamp nằm trong `after/paint-frames.json`. JPG trong ZIP giữ nguyên byte từ compositor.
- `phone-final`, `tablet-final`, `desktop-final`, `small-fast`: bốn bản web production ở 430×932, 768×1024, 1366×768, 360×800. Mỗi lượt 63 thao tác: tổng 252, 753 paint CDP, 9.359 mẫu RAF. Sau bootstrap, mỗi mẫu được phân loại có đúng một ảnh nền toàn màn hình; không thấy ảnh root cũ chồng dưới cảnh hiện tại trong các lượt này. DOM chỉ là bổ sung; phải đọc cùng video/paint.
- Các thao tác gồm lần đầu/mở lại, Back, N5 文法/文字/単語/chi tiết từ, catalog/start/resume/thi/navigator/confirm/result/review/exit, map/region/prefecture/city/location/guide/dialogue, farm/chicken/shop, profile/details, 特定技能 và đổi tab web ra nền rồi trở lại. Lượt 360×800 dùng thời gian nghỉ ngắn để kiểm tra chuyển nhanh.
- `publish-final`: build cuối sau khi tích hợp remote `71a19896`, 63 thao tác nhanh ở 430×932; 167 paint, 1.181 mẫu RAF, không có pageerror, đáp án giữ đúng khi tiếp tục. Source native ImageRef chỉ được kiểm tra kiểu/API, chưa chạy native.
- Chọn đáp án thật qua radio, thoát và tiếp tục: đáp án trong localStorage được giữ trong cả bốn lượt. Kết quả được nộp qua UI. Không chèn fixture vào app. Việc nghe ở vị trí khác 0, microphone, gameplay reward và thăng cấp chưa được kiểm chứng thực tế trên native.
- `cold-routes/runtime.json`, `cold-routes/screenshots.zip`: 75 đường dẫn mở trực tiếp, gồm các cấp N1–N5 và mọi route file. 73 đường dẫn có một nền toàn màn hình và không có pageerror; hai route từ điển bị chặn trên web bởi `useSQLiteContext must be used within a <SQLiteProvider>`: provider `.web` hiện có trả children, trong khi screen vẫn gọi hook. Không sửa DB/chức năng từ điển trong phiên xử lý nền này.

Video MP4 chuyển mã từ video Playwright thật, giữ thời gian. CDP screencast và RAF không bảo đảm bắt được mọi khung hình vật lý; kết quả chỉ áp dụng cho môi trường web và thao tác đã ghi. Browser HTML trước khi app/bootstrap sẵn sàng không phải bằng chứng splash native. Một ảnh ổn định, DOM, geometry hoặc test mocked không thay thế video/device evidence.

## Môi trường và phần chưa nghiệm thu

Đã khôi phục Git LFS cho asset đang tham chiếu, font và ảnh; export web production chạy thành công. `assets/jmdict/jmdict.db` đã materialize, 100.143.104 byte, header SQLite thật. Cài Chromium bên ngoài repository; không đổi dependency dự án.

Môi trường là Linux; không có xcrun, adb, emulator, Android SDK hay /dev/kvm. Không có iPhone/iPad hoặc simulator iOS được kết nối. Không thể khôi phục simulator iOS trên host này; Android cũng thiếu SDK/thiết bị và tăng tốc emulator. Chuẩn bị source/asset đã thực hiện, nhưng chưa thể quay app native. Bốn kích thước trên đều là web, không phải iPhone/Android/iPad native.

Chưa chứng nhận: mọi frame native khi cold start/resume/background/rapid Back; safe-area và window/screen thực tế; toàn bộ modal/reward/work/result theo trạng thái lưu; database dictionary; audio/microphone và vị trí nghe khác 0. Cần chạy cùng commit trên iPhone trước, sau đó Android/iPad. Không báo “đã sửa triệt để” hoặc “đã nghiệm thu toàn app” khi chưa có bằng chứng đó.

## Kiểm tra kỹ thuật và khóa

- Background ownership guard: 46 file / 93 fill đã loại bỏ; kiểm tra theme ngoài navigator, quyền sở hữu chín map và active-route artwork.
- JLPT navigation contract PASS; UI lock PASS 10/10 sau relock duy nhất N1OfficialTrial.
- TypeScript còn lỗi có sẵn TS2352 ở `src/services/life-content-repository.ts:41`: thiếu type của SC-HKD-HAKODATE-001. Không có lỗi mới từ source đã sửa. Không dùng kết quả TypeScript làm chứng cứ hết lóe.
- N1OfficialTrial SHA-256: `b007dce70ab8a5a5ce5160e804614f326c87b31c1c1d0f0c7324faf542629daf` → `d3b1fc178875e768cc431852323f1c59a05f67a9c788d71eb6a5e6cedf369b6c`. Lý do: lấy kích thước asset trên web khi resolveAssetSource không tồn tại, để giữ app và nền chính thức khi bắt đầu đề. Chín file khóa khác không đổi.

Các script capture dùng build Expo thật và browser thật; hướng dẫn chạy trong README của thư mục evidence. Persistence chỉ được báo PASS sau khi ref remote, tree staged và local HEAD khớp, working tree sạch.

Hai ZIP lớn lưu thành các phần `.zip.part-*` có thứ tự để đáp ứng giới hạn transport; README có lệnh ghép lại nguyên byte. Video và ZIP compositor của build cuối lưu trực tiếp.

Trước xuất bản, tích hợp fast-forward dữ liệu hội thoại tới `d9e57f1257531ca417d2e48ccbd5073b04edcca6`; không có file UI/background bị cập nhật đồng thời. Build cuối và bằng chứng vẫn ghi đúng base `71a19896` ở trên.
