# Hướng dẫn AI sản xuất nội dung học 建設 vào app

Ngày lập: 2026-10-11, Asia/Tokyo. Phạm vi hiện tại: hoàn thiện nội dung để học, bản dịch và ảnh minh họa mới cho 特定技能1号 và 特定技能2号. Phần thi hoàn toàn bằng tiếng Nhật sẽ thiết kế sau khi phần học hoàn thiện. Đây là hướng dẫn thực thi cho AI tiếp nối dự án, không phải báo cáo nội dung đã sản xuất hay chứng nhận tài liệu đã bao phủ đủ.

## Cập nhật mới nhất — thuật ngữ và đề lý thuyết40câu

Đọc đầu FIELD_PRACTICAL_CHECKPOINT.md:42mục bổ sung/104đoạn Nhật,12locale,42sơ đồ,104câu thực hành bổ sung và40câu lý thuyết mới. Lý thuyết chung205câu;建築140bài thực hành/192câu;土木128bài/170câu;ライフライン224/235giữ nguyên.033phụ gia dùng chung土木;034かなじめchỉ建築. Chưa đủ10×40;2号chờ. Các số dưới đây là lịch sử.

## Cập nhật mới nhất — an toàn từng nhánh

Đọc đầu FIELD_PRACTICAL_CHECKPOINT.md:40mục bổ sung/100đoạn Nhật,12locale,40sơ đồ,100câu bổ sung. 建築138mục thực hành/188câu;土木127mục/167câu.367/368/371dùng lại cho cả hai nhánh;031–032chỉ建築,012–013chỉ土木. Chưa toàn bộ nguồn/chưa đủ10×40;2号chờ. Các số dưới đây là lịch sử.

## Cập nhật mới nhất — phần thi công6k/6d

Đọc đầu FIELD_PRACTICAL_CHECKPOINT.md:36mục bổ sung/93đoạn Nhật,12locale,36sơ đồ,93câu bổ sung. 建築133mục thực hành/182câu;土木122mục/160câu. Dùng lại4bài gia công kim loại337–340cho建築;023–025dùng chung土木. Chưa hoàn tất toàn bộ nguồn/chưa đủ10×40;2号chờ. Các số cũ bên dưới là lịch sử.

## Cập nhật mới nhất — dụng cụ hoàn thiện và tạo vườn

Đọc đầu FIELD_PRACTICAL_CHECKPOINT.md:25mục bổ sung/66đoạn Nhật,12locale,25sơ đồ,66câu bổ sung. 建築121mục thực hành/159câu;土木116mục/145câu. Trong đợt013–022 chỉ015sơn dùng chung;008tạo vườn chỉ 土木. Chưa bao phủ nguồn toàn bộ/chưa đủ10×40;2号chờ. Các số cũ bên dưới là lịch sử.

## Cập nhật tiếp nối — bộ phận cốp pha/bơm/dụng cụ mộc

Đọc điểm đầu FIELD_PRACTICAL_CHECKPOINT.md: hiện14mục bổ sung/33đoạn Nhật,12locale,14sơ đồ,33câu bổ sung. 建築111mục thực hành/131câu;土木114mục/136câu. Bài012mộc chỉ thuộc 建築;009–011dùng chungciviltừnguồn5d. Các số cũ bên dưới là lịch sử. Chưa bao phủ nguồn toàn bộ;chưa đủ10×40;2号tiếp tục chờ.

## Điểm tiếp nối mới nhất — hoàn thiện phần khác biệt (2026-10-17)

Chủ dự án yêu cầu làm hết các mục còn thiếu của1号; yêu cầu này cho phép bổ sung phần học, dịch, sơ đồ và câu hỏi. Bản phát triển hiện có10mục bổ sung/19đoạn Nhật,12locale dịch,10sơ đồ vai trò và19câu hỏi bổ sung. Hai bài chung365–366 được dùng lại có giới hạn; mỗi nhánh mới có101bài gốc tái sử dụng. Thực hành 建築107mục/117câu;土木111mục/125câu. Những số9mục/16đoạn/99bài/104câu ở các đoạn lịch sử bên dưới đã được cập nhật bởi checkpoint mới.

Không coi đợt bổ sung này là đã làm hết nguồn hoặc đủ10×40cho từng phần. Đọc FIELD_PRACTICAL_CHECKPOINT.md và KD_PAGE_RECONCILIATION_REGISTER_2026-10-17.json; sổ194trang chỉ là chỉ mục điều hướng, chưa phải mẫu số kiến thức. Chuyên môn/bản ngữ/quyền/thiết bị thật vẫn chưa duyệt;2号tiếp tục chờ.

## Ưu tiên mới nhất — đối chiếu phần khác nhau và dùng lại kiến thức chung (2026-10-17)

Chủ dự án yêu cầu: chỉ lọc kiến thức khác nhau giữa các nguồn và dùng lại nội dung đã tạo cho phần chung. Không soạn lại, thay tình huống hoặc dịch lại chỉ vì kiến thức xuất hiện trong file k/d. Trước mọi đơn vị mới, kiểm PRACTICAL_SOURCE_REUSE_MATRIX_2026-10-17.json và runtime reuse-policy.json.

- So sánh văn bản thân bài xuyên qua ranh giới trang; số trang, vị trí ảnh, chữ dạng khác, số mục khác và lỗi in không tự tạo ra ý kiến thức mới. Tỷ lệ giống chỉ tìm ứng viên; cần quyết định có căn cứ theo nguồn và bài thật.
- Mỗi ý chung liên kết đến ID bài/đoạn Nhật gốc, bản dịch, hình và câu hỏi đã có. Không nhân bản dữ liệu để đủ tuần/ngày. Tránh bỏ sót phần khác biệt trong trang có phần lớn văn bản chung.
- Bộ l vẫn là nguồn gốc của ライフライン・設備1号; phần chung được xác nhận trong k/d có thể dùng lại bằng ma trận giới hạn từng bài. Không gán toàn bộ thực hành l sang hai mảng khác. Giữ 2号 chờ.
- 14bài mới đã được rà:5bài trùng rút khỏi luồng học,9mục chỉ giữ16đoạn bổ sung;68đoạn lặp không còn hiển thị. Giữ dữ liệu gốc, ID và lịch sử.14câu xác nhận mới lặp mục tiêu chung được lưu lịch sử, dùng câu hỏi chung sẵn có thay thế.
- Với nội dung mới còn thiếu: dùng liên kết nếu bài lý thuyết đã giải thích đủ; chỉ bổ sung ý chưa có hoặc chưa đủ độ sâu. Không tự tuyên bố đã bao phủ toàn nguồn hay đủ10×40đề cho mỗi mảng.

## Cập nhật phạm vi có hiệu lực — chủ dự án chốt 2026-10-17

Mục này ưu tiên hơn mọi mô tả dùng chung sáu lộ trình trước đây. Hoàn thiện 1号 trước; chưa biên soạn hoặc mở nội dung 2号.

- Bảy PDF đã nhận thuộc bộ ライフライン・設備1号. File 学科1–4 được chủ dự án cho dùng chung phần lý thuyết và kiểm tra lý thuyết của cả ライフライン・設備、建築、土木 trong 1号.
- File 実技5l/6l/7l chỉ dùng thực hành và kiểm tra thực hành ライフライン・設備1号. Không dùng chung cho 建築、土木 hoặc 2号.
- Thực hành 建築1号 lấy từ bộ5k/6k/7k; 土木1号 lấy từ bộ5d/6d/7d. Phải nhận, kiểm kê và đọc byte thật trước khi soạn. Không thay bằng file l, không tự lấy bản khác trên mạng thay tài liệu đính kèm.
- Phạm vi được định tuyến từ sourceReferences theo nguồn; lịch sử applicableLevels/applicableFields trong bài cũ không còn là căn cứ dùng chung. Giữ nguyên ID bài, đoạn, bản dịch, hình và dữ liệu hoàn thành cũ.
- Đề cũ trộn 学科/実技 được giữ nguyên làm dữ liệu gốc. Khi tách theo nguồn, giữ từng câu/đáp án/lời giải; bài bị chia có ID lượt làm mới để không gán sai đáp án cũ. Không tự coi mỗi nhánh đã có đủ10đề×40câu.
- Tài liệu JAC leader.pdf mới tìm chỉ là tham khảo dự phòng2号; chưa dùng để soạn cho1号.
- Đã nhận đủ6PDF5k/6k/7k/5d/6d/7d trong cùng ngày; hồ sơ SOURCE_KD_INTAKE_2026-10-17.json ghi byte/hash/số trang và phạm vi đã đọc. Điểm tiếp nối thực hành riêng hai mảng nằm ở FIELD_PRACTICAL_CHECKPOINT.md. Không lặp yêu cầu gửi lại các tệp này.

## 1. Mục tiêu và quyết định phải giữ

Tổng hợp đầy đủ kiến thức cần học trong kho tham khảo, sau đó tự biên soạn một giáo trình mới bằng tiếng Nhật cho người lao động nước ngoài. Bản dịch theo ngôn ngữ người học đi cùng từng cụm nội dung, được mở rộng ngay trong khung của cụm đó. Toàn bộ bài giải thích, ví dụ, tình huống, bản dịch và ảnh phải do dự án tạo mới.

Giữ riêng hai cấp 特定技能1号 và 特定技能2号. Trong mỗi cấp giữ nguyên ba mảng ライフライン・設備、建築、土木. Không gộp hai cấp; không gộp ba mảng thành một khóa chung; không đổi tên thành các ngành tự suy ra. Kiến thức chung được liên kết vào từng lộ trình phù hợp, không biến thành mảng thứ tư ngang cấp.

Ưu tiên hoàn thiện phần học. Chưa soạn ngân hàng câu thi, đề thi thử, bộ đáp án, thuật toán chấm điểm hay giao diện thi trong giai đoạn này. Có thể ghi nhận mục tiêu sẽ cần đánh giá về sau để phục vụ thiết kế thi, nhưng không biến ghi chú đó thành nội dung thi hiển thị cho người học.

## 2. Kho nguồn và việc đọc đầu phiên

Đường dẫn do chủ dự án chỉ định:

| Cấp | Thư mục tài liệu tham khảo |
|---|---|
| 特定技能1号 | `Nội dung đưa vào app/Tokuteigino-kensetsu/01-特定技能1号` |
| 特定技能2号 | `Nội dung đưa vào app/Tokuteigino-kensetsu/02特定技能2号` |

Giữ đúng tên thư mục, kể cả việc thư mục 02 không có dấu gạch nối sau số. AI phải tìm đường dẫn tuyệt đối thực tế trên máy hoặc nguồn được kết nối; không tự giả định thư mục nằm trong repository. Nếu không truy cập được, ghi chính xác nguồn bị thiếu và chỉ dừng phần phụ thuộc nguồn đó. Không dùng tên file, mục lục hoặc bản tóm tắt làm bằng chứng đã đọc toàn bộ tài liệu.

Trước mỗi phiên, thực hiện theo thứ tự khởi động của dự án:

1. Đọc `AGENTS.md`, `docs/AI_SESSION_START_HERE.md` và các hướng dẫn liên quan đang có trên nhánh hiện tại.
2. Đọc toàn bộ hướng dẫn này cùng checkpoint 建設, bản đồ nguồn, kế hoạch học và báo cáo QA mới nhất nếu đã có.
3. Đọc `docs/ssw-workspace/TOKUTEIGINO_ORIGINAL_AUTHORING_REQUIREMENTS_2026-09-25.md`, chỉ mục nguồn và handoff xây dựng liên quan. Kiểm tra trạng thái xác minh thực tế; không dùng số lượng hoặc trạng thái B1 cũ như kết quả hiện tại.
4. Tham khảo `docs/ssw-workspace/kaigo/KAIGO_AUTHORING_RULES.md` về tổ chức học, đối chiếu kiến thức, ảnh và lưu tiến độ. Quyết định riêng của hướng dẫn 建設 và yêu cầu mới của chủ dự án được ưu tiên khi khác với Kaigo.
5. Kiểm tra repository `duykhanhtokio/japan-app`, nhánh `recovery/jlpt-n3-n1`, remote, HEAD và thay đổi chưa lưu. Đọc phần 建設 đang có trong app để tiếp nối; bảo toàn công việc của các phiên khác.
6. Đọc lại đầy đủ các trang nguồn và kiểm trực quan hình/bảng thuộc đơn vị sắp làm. Không chỉ dựa vào OCR, trí nhớ hoặc checkpoint.

Báo ngắn điểm tiếp tục, đơn vị sẽ hoàn thành và phần đang bị chặn. Không tạo lại nội dung đã đạt kiểm tra chỉ vì phiên trước đã đóng.

## 3. Cấu trúc sáu lộ trình học

| Cấp | Mảng | Nội dung của lộ trình |
|---|---|---|
| 特定技能1号 | ライフライン・設備 | Kiến thức và mục tiêu thuộc mảng này trong nguồn cấp 1号 đã xác minh |
| 特定技能1号 | 建築 | Kiến thức và mục tiêu thuộc mảng này trong nguồn cấp 1号 đã xác minh |
| 特定技能1号 | 土木 | Kiến thức và mục tiêu thuộc mảng này trong nguồn cấp 1号 đã xác minh |
| 特定技能2号 | ライフライン・設備 | Kiến thức và mục tiêu thuộc mảng này trong nguồn cấp 2号 đã xác minh |
| 特定技能2号 | 建築 | Kiến thức và mục tiêu thuộc mảng này trong nguồn cấp 2号 đã xác minh |
| 特定技能2号 | 土木 | Kiến thức và mục tiêu thuộc mảng này trong nguồn cấp 2号 đã xác minh |

Phân loại theo nội dung và phạm vi thật của tài liệu, không chỉ theo tên file. Với tài liệu chung, xác định từng ý áp dụng cho cấp/mảng nào. Một ý có thể liên kết nhiều lộ trình nhưng không tự nhân bản thành nhiều ý độc lập để tăng số lượng.

Không xây dựng 2号 bằng cách đổi nhãn của bài 1号 hoặc làm tiếng Nhật khó hơn. Phải phân tích phần kiến thức, trách nhiệm, năng lực và tình huống được nguồn 2号 thực sự yêu cầu. Các nội dung như lập kế hoạch, phối hợp hoặc quản lý chỉ đưa vào khi nguồn và phạm vi tương ứng hỗ trợ; không tự suy từ tên cấp.

Các bảng kiến thức nền, thuật ngữ và giải thích chung có thể dùng dữ liệu chung với ID ổn định. Ví dụ vận dụng cần phù hợp mảng và cấp; không lặp cùng một bài ở cả sáu lộ trình mà không có lý do sư phạm.

## 4. Kiểm kê và đối chiếu toàn bộ kiến thức

Lập danh mục nguồn trước khi chốt lịch học. Với từng file ghi tên, cấp, mảng, phiên bản/ngày, số trang thật, hash, ngôn ngữ, tài liệu chính hay bổ sung, tài liệu trùng phiên bản, phần đính chính và trạng thái đọc. Giữ nguồn tham khảo trong kho riêng; không đưa PDF, OCR hoặc hình nguồn vào bundle app.

Đọc mọi phần có kiến thức, gồm văn bản, thuật ngữ, chú thích, nhãn hình, mũi tên, bảng, đơn vị, điều kiện áp dụng, ngoại lệ, phụ lục và đính chính. Đăng ký cả trang không có mục tiêu học như bìa/mục lục để không nhầm chúng là phần bị bỏ sót. Ghi riêng trang PDF và trang in, không đoán số chênh lệch giữa hai loại.

Phân rã thành từng ý kiến thức có thể kiểm chứng. Một hàng trong bảng đối chiếu tối thiểu phải có:

| Trường | Yêu cầu |
|---|---|
| Mã ý kiến thức | Ổn định, không dùng số thứ tự màn hình làm ID |
| Nguồn và vị trí | Tên/phiên bản/hash, trang PDF, trang in, mục hoặc hình |
| Cấp và mảng | 1号/2号, một hoặc nhiều mảng áp dụng có căn cứ |
| Nội dung cần hiểu | Sự kiện, khái niệm hoặc năng lực; ghi điều kiện, giới hạn và đơn vị |
| Bài/cụm học mới | ID thật và vị trí trong lộ trình |
| Minh họa | Cần hay không cần; mục tiêu của hình; ID hình nếu có |
| Trạng thái | Chưa đọc, thiếu, nông, đủ phần giải thích, chờ xác minh hoặc loại khỏi phạm vi có lý do |
| Bằng chứng kiểm | Nội dung đã đối chiếu, lỗi đã sửa, người/AI kiểm và giới hạn kiểm |

“Đã có liên kết đến trang” không đồng nghĩa “đã dạy đủ kiến thức của trang”. Chỉ đánh dấu một ý đủ khi bài mới giải thích được ý đó, điều kiện áp dụng, điều cần phân biệt và cách vận dụng phù hợp. Hình chỉ được tính là hoàn tất khi nó hỗ trợ đúng ý học và đã kiểm vị trí hiển thị.

Không báo phần trăm kiến thức khi chưa có mẫu số gồm mọi ý trong phạm vi và chưa rà hết. Khi tính được, tách tỷ lệ đã phân tích nguồn, đã viết, đã dịch, đã có ảnh, đã QA và đã hiển thị trong app. Không dùng số trang, số bài hoặc số ảnh để thay thế tỷ lệ kiến thức.

## 5. Quy trình soạn mới và tính chính xác

Nguồn dùng để xác định kiến thức, thuật ngữ, mục tiêu và giới hạn áp dụng. Bài mới được tổ chức theo cách người học cần hiểu và vận dụng, không theo chuỗi câu/đoạn hoặc cách bố trí đặc thù của tài liệu.

Quy trình bắt buộc: đọc nguồn → lập bản ghi kiến thức bằng cách diễn đạt ngắn của nhóm → kiểm chứng → thiết kế mục tiêu và ví dụ mới → viết bài Nhật từ đầu → kiểm bản Nhật → dịch bản mới → thiết kế hình mới → đối chiếu nội dung hoàn chỉnh với nguồn và QA.

Không sao chép, dịch sát, đổi vài danh từ, đổi tên nhân vật hoặc giữ nguyên tình huống rồi gọi là bài mới. Không chép câu hỏi, phương án, lời giải, bảng, tranh, bố cục hình hoặc trình tự minh họa đặc thù. Bản dịch phải xuất phát từ bài Nhật mới của dự án, không từ bản dịch trong tài liệu tham khảo.

Giữ đúng thuật ngữ nghề thông dụng, ký hiệu, đơn vị và sự kiện đã xác minh. Không đổi số liệu kỹ thuật hoặc quy tắc an toàn để làm nội dung “khác nguồn”. Ví dụ tự tạo phải được gắn rõ là ví dụ, và không trái với giới hạn của kiến thức gốc.

Rà tương đồng cả lời văn, cấu trúc, tình huống, hình và cách giải thích. Lưu quyết định sửa/giữ cùng lý do. Không tự gọi một tỷ lệ giống chữ thấp là chứng nhận quyền sử dụng. Nếu chưa có nguồn đúng phiên bản để đối chiếu, ghi chưa thể kiểm.

Với khẳng định kỹ thuật, pháp lý, số liệu hoặc thao tác an toàn, đối chiếu nguồn chính thức còn hiệu lực và ghi ngày kiểm, phạm vi áp dụng. Không biến quy tắc của một thiết bị/công trình/công đoạn thành quy tắc chung. Mục chưa xác minh không dùng như chỉ dẫn đúng trong bài học. Mục trọng yếu an toàn phải đạt cổng duyệt chuyên môn theo quy tắc xây dựng của dự án trước khi phát hành; không ghi người duyệt khi thực tế chỉ có AI kiểm.

## 6. Cách chia cụm nội dung học

Mỗi buổi là một trang học liền mạch gồm các cụm có quan hệ rõ ràng. Một cụm tương ứng một mục tiêu hoặc một nhóm ý gắn chặt với nhau, không tương ứng máy móc với một trang PDF. Không chia mỗi câu, mỗi từ hay mỗi chú thích thành một ô riêng khiến màn hình rối.

Khung nội dung của một cụm có thể gồm:

1. Tiêu đề tiếng Nhật và mục tiêu cần hiểu.
2. Giải thích khái niệm, chức năng hoặc nguyên tắc bằng tiếng Nhật.
3. Điểm cần phân biệt, điều kiện và giới hạn áp dụng.
4. Thuật ngữ quan trọng trong ngữ cảnh, với cách đọc đã rà.
5. Một ví dụ, sơ đồ hoặc tình huống mới phù hợp nếu giúp hiểu bài.
6. Ảnh mới và chú thích tiếng Nhật khi mục tiêu cần minh họa.
7. Một phần mở rộng xem bản dịch của toàn cụm.

Không ép mọi cụm đủ bảy mục nếu gây dài hoặc lặp. Cụm đơn giản có thể ngắn; cụm kỹ thuật cần thêm giải thích để người học không hiểu sai. Các bài có hội thoại chỉ cần số lượt phù hợp mục tiêu, không tự áp 11 lượt của nhánh hội thoại khác, không bắt mỗi cụm có một NPC mới.

Phần học có thể dùng ví dụ đối chiếu và điểm cần nhớ. Giai đoạn này không chèn bài thi, đáp án đúng/sai tương tác hoặc kiểm tra bắt buộc vào giữa khung học. Nếu có cách làm sai để giải thích sự khác biệt, phải ghi rõ và kiểm an toàn; không trình bày hình sai như một quy trình nên thực hiện.

## 7. Tiếng Nhật và bản dịch theo ngôn ngữ người học

Tiếng Nhật luôn là nội dung chính hiển thị mặc định. Trong mỗi khung có nút mở/thu bản dịch, lấy ngôn ngữ từ lựa chọn của người học trong app. Không khóa nội dung hỗ trợ chỉ vào tiếng Việt; sử dụng danh sách ngôn ngữ thực tế app hỗ trợ. Không tự công bố đã đủ các bản dịch khi mới tạo một ngôn ngữ.

Khi mở bản dịch, giữ nguyên phần tiếng Nhật và hiện bản dịch ngay bên dưới trong chính khung đó. Mở khung này không tự mở tất cả khung khác. Việc mở dịch không thay trang, không làm mất vị trí cuộn và không bị tính là hoàn thành bài.

Đối chiếu bản dịch theo ID đoạn ổn định để thứ tự luôn khớp bản Nhật. Dịch cả phần giải thích, ví dụ, điều kiện, cảnh báo, chú thích và ý nghĩa nhãn hình; không chỉ dịch tiêu đề. Giữ số, đơn vị, ký hiệu, mức độ bắt buộc và ngoại lệ đúng bản Nhật đã kiểm.

Tách dữ liệu ngôn ngữ; không trộn tiếng Việt/Thái/Myanmar/Indonesia vào câu tiếng Nhật. Với thuật ngữ nên giữ chữ Nhật, bản dịch có thể ghi nghĩa kèm thuật ngữ Nhật trong ngoặc. Không tạo cách dịch khác nhau cho cùng một nghĩa ở các bài; phân biệt khi thật sự đa nghĩa.

Furigana dùng theo khả năng thành phần hiện có và phải rà cách đọc, đặc biệt thuật ngữ, từ đồng hình và tên chuyên môn. Furigana là hỗ trợ đọc, không phải bản dịch. Nhãn kỹ thuật trong hình ưu tiên tiếng Nhật; nghĩa theo ngôn ngữ người học nằm ở phần dịch để dùng chung một hình cho nhiều ngôn ngữ.

Khi đổi ngôn ngữ, tiêu đề/nút/phần dịch chuyển đúng ngôn ngữ được chọn; nội dung Nhật vẫn giữ nguyên. Bản dịch còn thiếu phải có trạng thái trung thực, không để một ngôn ngữ khác mang nhãn ngôn ngữ đã chọn. Chỉ mở cho người học phiên bản ngôn ngữ đạt yêu cầu; lỗi một ngôn ngữ không được âm thầm làm sai nội dung của ngôn ngữ khác.

## 8. Lịch học và hoàn thành bài

Kế thừa mục tiêu khoảng 30 phút/ngày của phương pháp Kaigo để lập lịch 建設, tính riêng cho từng lộ trình. Số ngày và tuần do khối lượng kiến thức, độ khó, hoạt động học và nhu cầu đọc bản dịch quyết định. Không áp cứng 8 tuần, 26 tuần, 176 ngày hay số ảnh của Kaigo cho 建設.

Lập kế hoạch toàn phạm vi trước khi sản xuất hàng loạt, nhưng được điều chỉnh lịch khi đo tải thực tế. Ước lượng thời gian phải ghi là dự kiến nếu chưa đo. Không chia đều số trang; không rút bỏ nội dung để ép một ngày dưới 30 phút. Nếu quá tải, tách thành các buổi kế tiếp với ID liên kết.

Điều hướng rõ: 建設 → chọn 1号/2号 → chọn một trong ba mảng → tuần/buổi → nội dung học. Trong lịch luôn hiện tên hoặc trọng tâm bài, không chỉ hiện “Ngày 1, Ngày 2” khiến người học không biết học gì. Có thể tiếp tục bài gần nhất và mở lại bài đã học.

Áp cách xác nhận hoàn thành của Kaigo cho phần học: nút 完了 ở cuối buổi, dùng sau khi đã xem đến cuối nội dung; chỉ ghi dấu ✓ xanh khi người học chủ động bấm. Mở bài, cuộn một đoạn hoặc mở bản dịch không tự đánh dấu. Lưu riêng theo người học, cấp, mảng và ID buổi; không để hoàn thành một bài 1号 tự hoàn thành bài 2号.

Nếu trình bày lịch tuần, ngày không có nội dung làm mờ và không bấm được; không tạo bài rỗng để lấp lịch. Giai đoạn hiện tại chưa có thi cuối tuần nên không đòi hoàn thành thi để ghi dấu tuần. Khi triển khai thi về sau, quy tắc hoàn thành học và thi phải được ghi riêng, không tự thay đổi tiến độ học đã lưu.

## 9. Thiết kế và sản xuất ảnh minh họa mới

Chốt nội dung và mục tiêu học trước khi tạo ảnh. Lập bảng từng cụm cần hình: ID cụm, ý cần làm rõ, đối tượng, vị trí, nhãn, mũi tên, chú thích, loại hình và trạng thái. Không mặc định một ảnh bìa dùng chung đã đáp ứng hình cho mọi đoạn.

Phong cách: 2D màu đồng bộ với minh họa học hiện có do dự án sáng tác. Dùng mẫu đã được duyệt để tham chiếu phong cách; không dùng hình trong tài liệu gốc làm ảnh đầu vào, tracing hoặc ảnh chỉnh màu. Tạo bố cục và cách giải thích bằng hình mới. Không pha ảnh người thật, tranh đen trắng và kiểu 3D khác vào cùng bộ nếu chưa có yêu cầu đổi phong cách.

Ưu tiên hình giúp nhận diện bộ phận, quan hệ không gian, vật liệu, dụng cụ, ký hiệu hoặc tình huống được bài học nhắc đến. Không thêm máy móc, công cụ, PPE, nhãn hoặc thao tác chỉ để hình đẹp hơn nếu làm thay đổi kiến thức. Các chi tiết kỹ thuật phải có căn cứ; không suy từ hình AI tạo.

Với sơ đồ, bản vẽ, tỷ lệ, phép tính, kích thước hoặc nhãn cần chính xác, dùng công cụ vẽ có thể kiểm soát thay vì phụ thuộc ảnh sinh tự động. Ảnh tình huống không thay thế bản vẽ kỹ thuật hay hướng dẫn thao tác. Không biến một cảnh minh họa thành chỉ dẫn thực hành chưa được kiểm duyệt.

Rà từng ảnh với bài Nhật: đúng mục tiêu, công cụ, bộ phận, vai, tư thế, hướng, số lượng, nhãn/mũi tên; không thiếu phần quan trọng. Chữ Nhật phải kiểm được, không dùng chữ sai hoặc chữ giả. Chú thích phải chỉ rõ ảnh minh họa ý nào và có bản dịch tương ứng.

Gắn hình đúng ID cụm và đúng vị trí cạnh phần giải thích. Giữ tỷ lệ gốc, không kéo giãn hoặc cắt chủ thể để lấp khung. Giới hạn kích thước hợp lý khi màn hình ngang; cho xem hình lớn với sơ đồ nhiều nhãn nếu cần. Kiểm điện thoại nhỏ/lớn, máy tính bảng, dọc/ngang, mở/thu dịch và phóng cỡ chữ: ảnh, chú thích và đoạn tiếp theo không chồng nhau, không tràn ngang.

## 10. Hồ sơ dữ liệu và tiếp nối nội dung đã có

Dùng schema hiện có của app nếu phù hợp; chỉ mở rộng phần cần cho 建設. Không sửa UI JLPT đã khóa, không thay đổi dữ liệu Kaigo hoặc các ngành khác trong công việc này.

Dữ liệu hiển thị cần ID ổn định của cấp/mảng/bài/buổi/cụm/đoạn; thứ tự; nội dung Nhật; cách đọc; bản dịch theo locale; hình/chú thích/nhãn; thời gian dự kiến và phiên bản. Lưu tiến độ bằng ID, không bằng vị trí phần tử trong danh sách.

Hồ sơ biên soạn riêng cần nguồn/phiên bản/hash/trang, knowledge ID, căn cứ khẳng định, phạm vi áp dụng, trạng thái xác minh, tương đồng, chuyên môn, Nhật, từng bản dịch, ảnh, runtime và quyết định tích hợp/phát hành. Không nhúng PDF/OCR/ảnh gốc hoặc đường dẫn kho nguồn riêng vào `src`, `assets` hay màn hình người học.

Kiểm nội dung 建設 đã tồn tại trước khi thêm mới. Với bài đúng, giữ ID và tiến độ, hoàn thiện phần thiếu. Với bài thiếu/nông/sai, ghi lỗi và sửa có phiên bản. Không tự xóa toàn bộ kho cũ, không làm bản sao tên khác rồi coi đã tiếp nối. Nội dung chung liên kết nhiều nơi phải kiểm mọi nơi sau khi cập nhật.

## 11. Cổng kiểm tra và điều kiện tích hợp

| Cổng | Bằng chứng tối thiểu để đạt |
|---|---|
| Bao phủ kiến thức | Mỗi ý được nối vào cụm đủ độ sâu; phần thiếu/nông còn lại ghi rõ |
| Chính xác | Khẳng định có căn cứ, đúng cấp/mảng/điều kiện; mục an toàn đạt gate tương ứng |
| Độc lập biểu đạt | Đã đối chiếu nguồn đúng phiên bản và lưu xử lý đoạn/hình tương đồng |
| Nhật ngữ | Thuật ngữ, cách đọc, câu giải thích và tình huống tự nhiên, không mâu thuẫn |
| Bản dịch | Đủ đoạn, đúng locale, giữ đúng số/đơn vị/điều kiện và nhất quán thuật ngữ |
| Minh họa | Từng hình đúng ý, không dùng nguồn gốc, không sai nhãn/hướng/công cụ |
| Hiển thị thật | Bài đăng ký và mở được trong app; dịch/ảnh/nút hoàn thành hoạt động |
| Lưu tiến độ | Tải lại, đổi bài và đổi locale không mất hoặc gán nhầm dấu hoàn thành |
| Lưu bền | Nội dung, ảnh và báo cáo đã lưu; kiểm chứng commit thực sự có trên remote |

AI tự kiểm không thay cho người duyệt chuyên môn/bản ngữ/quyền khi gate dự án yêu cầu. Ghi từng trạng thái riêng, không tự đặt tất cả thành PASS. Kiểm trên web không được báo là đã kiểm bản cài iOS/Android. Tích hợp nội bộ không đồng nghĩa phát hành sản phẩm.

Không coi file đã viết hoặc ảnh đã sinh là hoàn thành. Một đơn vị hoàn tất phải có bài Nhật, bản dịch theo ngôn ngữ thuộc phạm vi phát hành, ảnh cần thiết, liên kết vào lộ trình, kiểm hiển thị và checkpoint xác minh lưu bền. Phần bị chặn có thể lưu nháp để tiếp nối nhưng không tính là nội dung học đã hoàn thiện cho người dùng.

## 12. Quy trình sản xuất theo đơn vị trọn vẹn

1. Kiểm kê đủ hai kho nguồn, xác định phiên bản và lập ma trận sáu lộ trình.
2. Rà nội dung app hiện có; nối các bài đã có với ma trận, đánh dấu thiếu/nông/sai/trùng.
3. Lập sơ đồ ý kiến thức và kế hoạch học dự kiến đủ toàn phạm vi. Chốt một buổi mẫu trọn vẹn để kiểm phương pháp trình bày Nhật–dịch–ảnh trước khi mở rộng.
4. Tiếp tục một tuần học hoặc một cụm chủ đề hoàn chỉnh trong một lộ trình. Đơn vị bàn giao theo kế hoạch học, không theo quota 10 ảnh hoặc một vài đoạn. Tuần đang dở phải hoàn tất phần thiếu trước, không sinh lại nội dung đã đúng.
5. Viết Nhật, kiểm, dịch, tạo hình, rà hình, nối app, kiểm hiển thị và lưu tiến độ. Có thể chia nhóm kỹ thuật nhỏ để xử lý nhưng không dùng nhóm nhỏ làm lý do bàn giao một tuần chưa hoàn thiện.
6. Sửa mọi lỗi có thể xử lý; phần chưa xác định ghi blocker theo ID và câu hỏi cụ thể. Tiếp tục phần độc lập đã được phép.
7. Lưu checkpoint, dữ liệu, ảnh và báo cáo. Commit hẹp theo quy tắc dự án, push trong phạm vi đã được chủ dự án cho phép, fetch/xác minh remote trước khi chuyển sang đơn vị kế tiếp. Bảo toàn thay đổi của phiên khác; không force-push hoặc tự reset dữ liệu người khác.
8. Khi sáu lộ trình học đã hoàn thiện theo ma trận và đạt gate cần thiết, báo cáo kết quả học trước. Sau đó mới chuyển sang thiết kế thi theo yêu cầu riêng của chủ dự án.

Checkpoint phải ghi: nhánh/commit xác minh; cấp và mảng đang làm; tuần/buổi/cụm đã hoàn tất; phạm vi nguồn đã đọc; ý còn thiếu/nông; ngôn ngữ dịch đã đạt/chưa đạt; hình đã tạo/đã gắn/đã kiểm; kết quả runtime; giới hạn kiểm duyệt; blocker; bước tiếp theo. Giữ checkpoint đủ cụ thể để AI khác tiếp tục mà không làm lại từ đầu.

## 13. Phần thi dành cho giai đoạn sau

Yêu cầu đã chốt là phần thi hoàn toàn bằng tiếng Nhật. Không hiển thị dịch hoặc gợi ý trong lúc làm bài. Nội dung học có bản dịch không làm thay đổi yêu cầu này.

Chưa tự chốt số đề, số câu, thời gian, ngưỡng đỗ, furigana trong thi, cách chấm hoặc cấu trúc đề ở bước sản xuất phần học. Khi bắt đầu giai đoạn thi, xác minh cấu trúc hiện hành từ nguồn chính thức cho đúng cấp và mảng, rồi thiết kế nội dung thi mới dựa trên ma trận kiến thức đã hoàn thiện. Không sao chép quy mô thi Kaigo hoặc JLPT sang 建設.

## 14. Khi phải hỏi lại và khi có thể tự tiếp tục

Phải hỏi khi cách đọc hình/nhãn/thuật ngữ làm thay đổi kiến thức; nguồn mâu thuẫn chưa xác định được phiên bản; không rõ một ý thuộc cấp/mảng nào; yêu cầu mới ảnh hưởng quy tắc đã duyệt; hoặc không đủ dữ kiện để tạo một thao tác/ảnh chính xác. Nêu file, trang, ID, điểm chưa hiểu và phương án cụ thể. Không hỏi chung “có tiếp tục không”, không đoán cho nhanh.

Có thể tự xử lý việc phân đoạn, điều chỉnh buổi quá tải, sửa lỗi chữ, gắn ảnh đúng ID, cải thiện khoảng cách và mở/thu bản dịch trong phạm vi đã được yêu cầu. Không cần dừng phần độc lập chỉ vì một cụm đang chờ trả lời. Tuyệt đối không tự lấp kiến thức thiếu bằng nội dung không có căn cứ.

## 15. Mẫu lệnh cho AI kế tiếp

> Tiếp tục sản xuất phần học 建設 cho japan-app trên nhánh recovery/jlpt-n3-n1. Đọc quy tắc khởi động dự án, toàn bộ hướng dẫn này, quy tắc biên soạn Tokutei Gino độc lập và checkpoint 建設 mới nhất. Xác minh nguồn thật trong Nội dung đưa vào app/Tokuteigino-kensetsu/01-特定技能1号 và 02特定技能2号. Giữ riêng hai cấp và ba mảng ライフライン・設備、建築、土木. Rà nội dung đã có trước khi thêm; lập đối chiếu từng ý, kể cả chú thích và dữ kiện trong hình. Tự soạn bài Nhật mới, dịch từ bài mới theo ngôn ngữ người học, tạo ảnh 2D màu mới đúng kỹ thuật và gắn đúng từng cụm học. Tiếng Nhật hiện mặc định; bản dịch mở ngay trong từng khung, không chia mỗi câu thành một ô. Lập lịch khoảng 30 phút/ngày với số tuần theo khối lượng thật. Chưa sản xuất phần thi. Hoàn tất trọn đơn vị học đang dở, kiểm nguồn–nội dung–dịch–hình–app–tiến độ, lưu và xác minh remote trong phạm vi đã cho phép trước khi chuyển đơn vị. Chỗ không hiểu phải hỏi cụ thể, không tự suy và không báo hoàn thành khi chưa kiểm.

## 16. Tài liệu dự án đã dùng để điều chỉnh hướng dẫn

- [Hướng dẫn Kaigo phiên bản 10](https://github.com/duykhanhtokio/japan-app/blob/recovery/jlpt-n3-n1/docs/ssw-workspace/kaigo/KAIGO_AUTHORING_RULES.md): kế thừa tổ chức học, đối chiếu từng ý, hiển thị liền mạch, hoàn thành chủ động, ảnh theo tuần và kiểm lưu bền. Không kế thừa lịch/số đề hay nội dung chuyên môn chăm sóc.
- [Quy tắc biên soạn Tokutei Gino độc lập](https://github.com/duykhanhtokio/japan-app/blob/recovery/jlpt-n3-n1/docs/ssw-workspace/TOKUTEIGINO_ORIGINAL_AUTHORING_REQUIREMENTS_2026-09-25.md): kế thừa việc dùng nguồn để kiểm kiến thức, tự viết biểu đạt mới, gate xây dựng và tách trạng thái QA.

Đường dẫn hai kho 建設 trong hướng dẫn là đường dẫn chủ dự án cung cấp; việc kiểm kê byte, số tài liệu, phiên bản và tổng ý kiến thức phải do phiên sản xuất thực hiện khi truy cập được nguồn. Không có số lượng bài, tuần, ảnh hoặc tỷ lệ bao phủ 建設 nào được suy ra từ tài liệu Kaigo.
