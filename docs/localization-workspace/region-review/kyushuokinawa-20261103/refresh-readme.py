import json
import pathlib

root = pathlib.Path(__file__).resolve().parent
p = json.loads((root/'progress.json').read_text())
names = ['Fukuoka', 'Saga + Nagasaki', 'Kumamoto', 'Oita + Miyazaki', 'Kagoshima', 'Okinawa']
text = '# Kyushu & Okinawa — rà ngữ cảnh đủ 12 ngôn ngữ\n\n'
state = 'đã hoàn tất rà ngữ cảnh AI đủ12ngôn ngữ' if p['remaining'] == 0 else 'chưa hoàn tất vùng'
text += f"**{p['reviewed']}/1.064 bài** có receipt/hash hợp lệ trong cây dữ liệu này. Còn **{p['remaining']} bài**; {state}. **Okinawa101/101** giữ nguyên.\n\n"
text += 'Sáu phạm vi độc lập, không kiểm chéo ngữ nghĩa. Phân công theo các tập ID không giao nhau; AI đã xong chuyển sang ID chưa rà của các phạm vi còn lại. Giữ nguyên byte receipt cũ; điều phối chỉ kiểm sở hữu, cấu trúc, guard và hash.\n\n'
text += '| Phạm vi | Đã rà/tổng | Còn |\n|---|---:|---:|\n'
for w, name in zip(p['workers'], names):
    text += f"|{name}|{w['reviewed']}/{w['assigned']}|{len(w['pendingScenarioIds'])}|\n"
text += '\nTiếp tục đúng pendingScenarioIds, trừ mọi ID có receipt đầy đủ trong staging. Trước khi chuyển nhóm mới phải xác minh GitHub bằng check-work-persistence; commit cục bộ không thay thế bằng chứng lưu từ xa. Người dùng đã cho phép đẩy các kết quả Kyushu & Okinawa tiếp theo lên duykhanhtokio/japan-app, nhánh recovery/jlpt-n3-n1.\n\n'
text += 'Check-region kiểm12×16trường/bài, hash và queue riêng vùng. Rà AI không thay cho duyệt bản ngữ, metadata, âm thanh, thiết bị hoặc nghiệm thu phát hành. Không tính sàng lọc là rà ngữ nghĩa. Khi kết thúc phiên phải dừng mọi worker, không chạy ngầm.\n'
(root/'README.md').write_text(text)
