# Nông nghiệp — ba nhóm phụ thuộc ngày học

Snapshot: `90b0a1f47295e57639b4a076d0137c8860c2ad93`. Đây là kiểm tra cơ học và đề nghị tích hợp, không đóng thêm ý nguồn trong sổ chuẩn.

1. **Ngân hàng và phiên bản:** 46 bộ tuần/427 câu, 20 đề/800 câu. ID, bốn lựa chọn/giải thích, vị trí đáp án, bài trong lịch và liên kết phiên bản đạt phạm vi kiểm tra. Các hash cũ chỉ được chấp nhận qua bảng tương thích hiện hành, không đổi hash để làm đạt. Không đọc lại ngữ nghĩa ngân hàng đã rà.
2. **Ngày và hình:** 141 lượt ngày cấp 1 và 228 lượt ngày cấp 2; tất cả có liên kết hình. 211 đường asset đều được Git theo dõi, nhưng checkout này chưa có byte của chúng; không coi đó là thiếu hình trong app. Độ dài đoạn Nhật có tính phần đọc liên quan: cấp 1 trung vị 484, nhỏ nhất 359; cấp 2 trung vị 513, nhỏ nhất 347. Không có ngày dưới nửa trung vị. Đây chỉ là sàng lọc số chữ; không suy ra thời lượng hoặc kiến thức đủ. Cả 369 lượt ngày chưa có phút học thực đo.
3. **Bản dịch, ruby và bộ đọc:** 241×12=2.892 cặp bài/ngôn ngữ đúng hash/trường bắt buộc; 30 hoạt động×12=360 cặp, ruby ghép lại đúng chữ Nhật. Không thay cho duyệt ngữ nghĩa/phát âm. Bộ đọc thân bài hiện vẫn dùng chữ Nhật thường.

Đã tìm lại đề nghị ruby từ `parallel-continuation-20261103/daily` trong checkout trước, giữ hai tệp đề nghị byte-for-byte rồi kiểm lại trên snapshot hiện tại. `reader-patch.json` chỉ rõ SHA file trước, chuỗi thay đúng một lần và hai file mới. Adapter chỉ dùng token đã tồn tại khi lesson, cấp, paragraph, toàn bộ câu chữ, hash nguồn và nguồn đáp án khớp chính xác; bỏ qua trường hợp nhiều nguồn/đoạn hoặc cách đọc xung đột. Không sinh cách đọc mới và không tuyên bố toàn thân bài đã có furigana.

Node harness đạt 29 trường hợp, gồm 11 lượt đoạn/cấp tương ứng sáu đoạn và các ca từ chối nguồn cũ, sai đoạn, nhiều nguồn/đoạn, sửa chữ, token hỏng, thiếu cách đọc, sai cấp và xung đột. React, react-test-renderer, esbuild và TypeScript không có trong runtime được cấu hình; chưa chạy component, compile, responsive hoặc thiết bị. Điều phối viên quyết định và tích hợp đề nghị; luồng này không sửa file dùng chung.

Tái chạy từ gốc repository:

```bash
node scripts/agriculture/check-current-dependencies.cjs --out docs/ssw-workspace/agriculture/continuation-20261103b/daily/current-dependencies.json
node docs/ssw-workspace/agriculture/continuation-20261103b/daily/audit.cjs
node docs/ssw-workspace/agriculture/continuation-20261103b/daily/check-contextual-reading.cjs
```

Không sửa nội dung Nhật, câu hỏi, bản dịch, tiến độ người học hay bằng chứng cũ. Chưa nghiệm thu ngữ nghĩa toàn bộ, nội dung/pixel hình, âm thanh, bản ngữ, chuyên môn, Expo, thiết bị thật hoặc thời lượng.
