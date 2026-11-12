# YOKOSO — Release Stability

Ngày cập nhật: 2026-11-12

## Đã kiểm thử thành công

- Hội thoại NPC hiển thị tiếng Nhật và furigana.
- Hội thoại người chơi hiển thị nội dung.
- Hai ô thoại có kích thước cố định.
- Nội dung dài cuộn dọc trong khung.
- Không còn lỗi mất chữ đã gặp trước đây.
- Profile Back đã điều hướng về Home.

## Cần hoàn thiện

1. Tối ưu thời gian tải màn hình và điều hướng.
2. Điều tra timeout khi chuẩn bị artwork.
3. Kiểm tra lỗi nhận dạng giọng nói bị aborted liên tục.
4. Đo và căn chính xác HUD Profile so với Home.
5. Furigana mặc định ở tất cả ngành Tokutei.
6. Đồng bộ giao diện Royal giữa các ngành.
7. Xác nhận nhạc onboarding fade-out thực tế.
8. Kiểm thử build iOS release.

## Nguyên tắc bảo vệ mã nguồn

- Không thay đổi dữ liệu bài học trong đợt tối ưu hiệu năng.
- Không xóa hoặc khôi phục hàng loạt assets Git LFS.
- Không sửa lại bố cục Hội thoại đã nghiệm thu.
- Mỗi nhóm lỗi phải có kiểm thử trước/sau.
