# Bộ đọc nông nghiệp — tích hợp ruby có điều kiện

Đề nghị này hoàn thiện việc nối token ruby đã có vào đúng đoạn thân bài. Hai file trong `proposed/` giữ nguyên đề nghị đã khôi phục từ phiên trước; không tạo phát âm mới. `reader-patch.json` ghi SHA trước của `AgricultureCourse.tsx`, thêm một import và thay đúng một chỗ render thân đoạn. Điều phối viên áp dụng file dùng chung.

## Ba nhóm đã kiểm

1. **Ngữ cảnh/phiên bản:** selector chỉ dùng ruby khi toàn bộ chữ Nhật, ID bài, ID đoạn, cấp, hash nguồn và một nguồn đáp án khớp. Nguồn nhiều đoạn, nhiều nguồn, token không khớp, thiếu cách đọc Hán tự hoặc cách đọc xung đột trả về chữ Nhật thường. Node harness đạt 30 ca, có bảy đoạn/12 lượt cấp dùng được. Đây là tái sử dụng dữ liệu hiện có, không chứng nhận cách đọc chuyên môn/bản ngữ.
2. **Luồng reader thật qua host fixture:** esbuild đóng gói `AgricultureCourse.tsx` với bản sửa trong bộ nhớ, dữ liệu và module state thực. React test-renderer đạt 26 lượt đi từ chọn cấp → tuần → ngày → bộ đọc → hoàn thành, gồm Nhật và 12 ngôn ngữ ở hai cấp. Kiểm bật/tắt dịch, giữ nguyên chữ Nhật, không hiện đáp án trước thao tác mở, lưu hoàn thành và lỗi ghi/lưu lại. Ba ca nguồn hash cũ, sai cấp và bài chưa có reading đều giữ chữ Nhật nguyên dạng. Chỉ thay native/layout/artwork/daily-companion hooks và AsyncStorage bằng fixture được ghi rõ trong `host-reader-validation.json`; không chứng minh ảnh/pixel, kích thước màn hình hoặc Expo/thiết bị thật. Không chạy TypeScript full-project.
3. **Lịch/hình/phụ thuộc:** 369 lượt ngày có hình liên kết; 211 đường asset được Git theo dõi. Chỉ hai asset có byte cục bộ, không suy phần còn lại là thiếu trong app. 2.892 cặp bài–ngôn ngữ và 31 hoạt động/372 cặp đúng hash/trường yêu cầu. Không có ngày dưới nửa trung vị số chữ trong cùng cấp; cả 369 lượt ngày chưa có phút học thực đo. Số chữ không thay cho nghiệm thu kiến thức/thời lượng.

Các dependency được dùng từ bộ công cụ đã cài sẵn ở scratch theo chế độ đọc; không cài mới. Tất cả tiến trình kiểm đã kết thúc. Không sửa nội dung Nhật, bản dịch, câu hỏi, bằng chứng cũ hay file dùng chung. Không đóng thêm ý nguồn chuẩn.

```bash
node docs/ssw-workspace/agriculture/continuation-20261103c/daily/check-selector.cjs
TOKUTEI_QA_MODULES=/workspace/scratch/adcba77e47ae/qa-deps/node_modules node docs/ssw-workspace/agriculture/continuation-20261103c/daily/host-reader-check.cjs
node scripts/agriculture/check-current-dependencies.cjs --out docs/ssw-workspace/agriculture/continuation-20261103c/daily/current-dependencies.json
```

`host-reader-check.cjs` kiểm đề nghị trước tích hợp; sau khi áp dụng, điều phối cần kiểm bản code đã tích hợp và hash receipt. Không chạy lại script đề nghị trên nguồn đã thay rồi diễn giải lỗi “không tìm thấy chuỗi cũ” thành lỗi bộ đọc.
