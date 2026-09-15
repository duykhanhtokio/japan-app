# Cài bản cập nhật Royal content groups V18.1

Bản ZIP chỉ chứa các tệp mã nguồn và tài liệu quy tắc đã sửa. Không chứa hoặc
ghi đè bộ hình nền, nhân vật, âm thanh hay `node_modules`.

```bash
cd /Users/doduykhanh/japan-app
unzip -o "$HOME/Downloads/japan-app-royal-content-groups-v18.1-code-only.zip" -d .
grep -n "royal-content-groups-v18.1" src/components/ui/RoyalPositioning.ts
npx tsc --noEmit
npx expo start --clear
```

Kết quả `grep` phải hiển thị `ROYAL_LAYOUT_VERSION`. Trong app, mỗi khung tự
giãn theo nội dung; các khung có cùng `sizingGroup` nhận chiều cao lớn nhất của
nhóm tại cùng độ rộng màn hình.

Trong ô chọn và danh sách `業種` chỉ còn tên ngành. Trong ô chọn và danh sách
`職種` chỉ còn tên nghề; toàn bộ dòng phụ `職種`/`作業` và bản dịch đã được bỏ.
