"""Eating concepts mapped to independently authored explanations, not a transcript."""
import json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1]
rt=json.loads((R/'src/data/kaigo/atomic-supplements.json').read_text())
points={p['id']:p['explanationVi'] for u in rt['units'] for p in u['points']}
days={i:d['day'] for d in rt['days'] for i in d['unitIds']}
rows=[]
def atoms(page,kind,key,n,concepts,qualification=None):
 pid=f'kaigo-atomic-{key}-{n}';assert pid in points
 for concept in concepts.split(';'):
  rows.append(dict(id=f'eating-atom-{len(rows)+1:03}',printedPage=page,pdfPage=page+2,kind=kind,conceptVi=concept.strip(),runtimePointId=pid,runtimeDay=days['kaigo-atomic-'+key],appEquivalentVi=points[pid],visualPageChecked=True,qualificationVi=qualification,humanReviewed=False))
atoms(144,'prose','swallow-stages',7,'Dinh dưỡng;Duy trì hoạt động;Duy trì sự sống')
atoms(144,'prose','swallow-stages',4,'Niềm vui;Nhịp sinh hoạt;Kết nối xã hội')
atoms(144,'prose','swallow-stages',5,'Tới chỗ ăn;Tư thế;Nhìn món;Đũa;Muỗng;Đưa vào miệng;Nhai;Nuốt;Nhiều chức năng phối hợp')
atoms(144,'prose','swallow-stages',6,'Não và đói;Muốn ăn;Thị giác;Khứu giác;Vị giác;Xúc giác')
atoms(145,'table-and-figure','swallow-stages',1,'Nhận biết;Màu;Hình dạng;Mùi;Nước bọt')
atoms(145,'table-and-figure','swallow-stages',2,'Chuẩn bị miệng;Nhai;Trộn nước bọt;Khối thức ăn;Chặng miệng;Lưỡi;Hướng từ miệng tới hầu')
atoms(145,'table-and-figure','swallow-stages',3,'Chặng hầu;Phản xạ nuốt;Qua hầu;Chặng thực quản;Tới dạ dày')
atoms(145,'anatomy-callout','swallow-stages',8,'Nắp thanh quản;Bảo vệ khí quản','Bảo vệ đường thở là phối hợp, không chỉ một nắp đóng.')
atoms(145,'definition-callout','swallow-stages',4,'Khó ở bất kỳ chặng;Ảnh hưởng an toàn')
atoms(146,'care-prose','meal-checks',1,'Sở thích;Hạn chế do bệnh;Dị ứng')
atoms(146,'texture-list','food-devices',1,'Cắt nhỏ;Dạng nhuyễn;Làm mềm giữ hình;Dạng lỏng','Không chuyển nghĩa sách thành tự chọn kết cấu hoặc mặc định lỏng an toàn.')
atoms(146,'temperature-prose','food-devices',5,'Món nóng;Món lạnh;Nhiệt thưởng thức','Kiểm nhiệt tiếp xúc; không gây bỏng.')
atoms(146,'posture-figure','food-devices',9,'Ngồi sâu;Chân tựa;Thân hơi trước;Vị trí cằm;Ngửa cằm nguy cơ','Tư thế nuốt phải phù hợp đánh giá cá nhân, không ép cằm mọi người.')
atoms(147,'bed-figure-and-prose','food-devices',8,'Nâng đầu giường;Thân được nâng đỡ;Giảm kéo trượt sau nâng','Không chỉ dẫn người chưa đào tạo tự nhấc người.')
atoms(147,'bed-figure-callout','food-devices',3,'Nghiêng khi phù hợp;Bên khỏe ở dưới;Gối hỗ trợ đầu','Mẫu minh họa không là chỉ định chỉ từ tên bệnh.')
atoms(148,'device-label','food-devices',4,'Muỗng dễ cầm;Nĩa dễ cầm;Muỗng cong;Nĩa cong;Đũa có lò xo;Đai giữ thìa;Đĩa dễ xúc;Thảm chống trượt;Bát dễ cầm;Cốc có tay cầm')
atoms(148,'device-function','food-devices',6,'Giữ dụng cụ;Hướng đưa;Gắp')
atoms(148,'device-function','food-devices',7,'Lấy thức ăn;Ổn định trên bàn;Giữ vật chứa')
atoms(149,'numbered-prose-and-figure','meal-checks',1,'Sức khỏe;Giải thích;Đồng ý;Tay sạch;Tới bàn;Ghế;Khay nhìn được;Tay thuận;Phía khỏe;Kiểm hạn chế và dị ứng')
atoms(150,'numbered-prose','meal-checks',7,'Thực đơn;Thời điểm trao đổi')
atoms(150,'figure-callout','meal-checks',2,'Làm ẩm miệng;Trà;Canh','Không cho chất lỏng loãng để tự thử nuốt.')
atoms(150,'prose-and-callout','meal-checks',6,'Theo tốc độ người dùng;Quan sát;Động tác nhai;Động tác nuốt;Tư thế')
atoms(150,'quantity-and-position-callout','meal-checks',8,'Lượng mỗi miếng;Vị trí nhân viên;Ngồi ngang tầm;Đứng có thể buộc ngửa đầu','Không ấn định số ml hoặc tự chọn tư thế trị liệu.')
atoms(150,'figure-arrow-and-prose','meal-checks',3,'Góc miệng bên khỏe;Chờ miếng trước;Không hỏi khi nhai;Rút thìa ngang;Tránh kéo đầu ngửa')
atoms(151,'numbered-prose','meal-checks',4,'Xác nhận kết thúc;Thức ăn lưu trong miệng;Vệ sinh miệng;Súc;Chải răng;Răng giả;Ngồi sau ăn;Khoảng 30 phút','Thời gian và phương án theo kế hoạch, không bảo đảm phòng mọi viêm phổi.')
atoms(151,'care-prose','meal-checks',6,'Tốc độ;Tư thế;Động tác;Nhai;Nuốt')
atoms(151,'care-prose','meal-checks',7,'Mong muốn người dùng')
atoms(151,'clock-labels-and-rays','meal-checks',9,'12 giờ;1 giờ;2 giờ;3 giờ;4 giờ;5 giờ;6 giờ;7 giờ;8 giờ;9 giờ;10 giờ;11 giờ;Mốc từ phía người dùng;Đồ gần ở hướng 6 giờ','Dạy hệ tọa độ; không tái tạo khay/đồ/ví dụ gốc.')
atoms(151,'care-prose','meal-checks',5,'Nhiệt nóng lạnh;Gia vị;Giải thích cho người khó nhìn')
out=dict(version=1,date='2026-10-10',sourceSha256='997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54',sourceBytesHashRecomputed=True,runtimeSha256=hashlib.sha256((R/'src/data/kaigo/atomic-supplements.json').read_bytes()).hexdigest(),scopePrintedPages=list(range(144,152)),visualPagesChecked=list(range(144,152)),atoms=rows,openVisualItems=[],fullScopeAtomInventoryCertified=False,allSourceKnowledgeFullyCovered=False,wholeDocumentCoveragePercent=None,humanReviewed=False,domainReviewed=False,releaseReady=False,primaryChecks=['https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/','https://www.nidcd.nih.gov/sites/default/files/Documents/health/voice/NIDCD-Dysphagia.pdf'])
(R/'docs/ssw-workspace/kaigo/reviews/eating-source-atoms-2026-10-10.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(atoms=len(rows),pages=8,fullScopeAtomInventoryCertified=False)))
