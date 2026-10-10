"""Housework factual traceability; source expression and assets remain private."""
import json, hashlib
from pathlib import Path
R = Path(__file__).resolve().parents[1]
rt = json.loads((R/'src/data/kaigo/atomic-supplements.json').read_text())
points = {p['id']:p['explanationVi'] for u in rt['units'] for p in u['points']}
days = {i:d['day'] for d in rt['days'] for i in d['unitIds']}
rows = []
def atoms(page, kind, key, n, concepts, qualification=None):
    pid = f'kaigo-atomic-{key}-{n}'
    assert pid in points
    for concept in concepts.split(';'):
        rows.append(dict(id=f'housework-atom-{len(rows)+1:03}', printedPage=page,
            pdfPage=page+2, kind=kind, conceptVi=concept, runtimePointId=pid,
            runtimeDay=days['kaigo-atomic-'+key], appEquivalentVi=points[pid],
            visualPageChecked=True, qualificationVi=qualification,
            mappingStatus='qualified-independent-equivalent' if qualification else 'independent-concept-equivalent',
            humanReviewed=False))
atoms(198,'meaning-and-examples','adl-iadl',4,'IADL là hoạt động tổ chức đời sống;Nấu ăn;Dọn nhà;Giặt;Sắp quần áo;Mua sắm;Duy trì cuộc sống;Thói quen riêng;Yêu cầu riêng')
atoms(198,'five-picture-labels','adl-iadl',4,'Nấu ăn trong hình;Dọn nhà trong hình;Quản lý tiền;Gọi điện thoại;Đi tàu')
atoms(198,'individual-ability','adl-iadl',3,'Đánh giá phần tự làm;Hỗ trợ đúng phần','Không suy mất quyền quyết định từ hạn chế vận động.')
atoms(199,'cooking-purpose','home-environment',6,'Duy trì sự sống;Dinh dưỡng;Dễ ăn;Chế biến và sử dụng thực phẩm','Nấu không tự bảo đảm hấp thu; không tự sửa chế độ điều trị.')
atoms(199,'cooking-sequence','home-environment',1,'Chọn thực đơn;Chuẩn bị nguyên liệu;Chế biến;Bày món;Phục vụ;Dọn sau ăn')
atoms(199,'health-and-diet','home-environment',6,'Tình trạng cơ thể;Bệnh;Dị ứng;Chọn món;Chọn nguyên liệu;Chọn cách làm','Theo kế hoạch đã xác nhận; không dùng sở thích để bỏ yêu cầu an toàn.')
atoms(199,'three-cooking-pictures','home-environment',1,'Chuẩn bị thực phẩm;Cắt và chế biến;Bày và phục vụ','Hình minh họa các công việc, không chỉ định thao tác dao hoặc thực đơn cho mọi người.')
atoms(199,'culture-and-caption','home-environment',7,'Quốc gia;Vùng;Thói quen ăn;Cách nêm;Sở thích;Món theo dịp lễ;Nguyên liệu theo mùa;Osechi;Bữa năm mới Nhật','Osechi là ví dụ văn hóa, không bắt buộc hoặc mặc nhiên phù hợp bệnh/dị ứng.')
atoms(200,'cleaning-purpose','home-environment',8,'Rác;Bụi;Vết bẩn;Sạch;An toàn;Dễ chịu')
atoms(200,'belongings-and-consent','home-environment',8,'Đồ dùng của người sử dụng;Giá trị không rõ với nhân viên;Hỏi chủ đồ;Đồng ý sắp lại;Đồng ý bỏ đồ')
atoms(200,'cleaning-picture-relation','home-environment',8,'Người dùng ngồi xe lăn;Người dùng trao đổi lựa chọn;Nhân viên cầm đồ để trao đổi','Không suy đồng ý từ một cử chỉ vẽ hoặc suy đồ được cầm là rác.')
atoms(201,'laundry-purpose','home-environment',9,'Quần áo;Đồ dùng ngủ;Giữ sạch;Chuẩn bị dùng lại','Sạch hỗ trợ sức khỏe, không hứa loại mọi nguy cơ bệnh.')
atoms(201,'material','home-environment',4,'Chất liệu;Nhãn và phương pháp phù hợp')
atoms(201,'contamination','home-environment',10,'Phân;Chất nôn;Máu;Nguy cơ nhiễm;Xử lý riêng phù hợp','Nguồn nêu người mắc nhiễm; phòng ngừa khi xử lý đồ bẩn không chờ chẩn đoán. Không tự chọn hóa chất/nhiệt từ nguồn hoặc hình.')
atoms(201,'two-laundry-pictures','home-environment',9,'Giặt tay trong hình;Phơi trong hình;Giặt và làm khô là hai phần','Không bắt mọi đồ giặt tay hoặc xem phơi tự khử khuẩn.')
atoms(202,'environment-purpose','home-environment',11,'Thoải mái;Phòng sự cố;Riêng tư;An toàn;Yên tâm;Tình trạng tinh thần;Tình trạng cơ thể')
atoms(202,'access-and-equipment','home-environment',11,'Hành lang;Cầu thang;Chống trượt;Tay vịn;Phòng tắm;Nhà vệ sinh;Tiếp cận dễ dùng;Dụng cụ hỗ trợ phù hợp;Mở khả năng hoạt động')
atoms(202,'room-conditions','home-environment',5,'Nhiệt độ phòng;Độ ẩm;Thông khí')
atoms(202,'trip-picture','home-environment',11,'Mép thảm;Thảm trên đường đi;Người vấp;Nguy cơ ngã','Đọc quan hệ bàn chân–mép thảm; không suy nguyên nhân duy nhất của mọi lần ngã hoặc xem thảm chống trượt luôn an toàn.')
out=dict(version=1,date='2026-10-10',sourceSha256='997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54',sourceBytesHashRecomputed=True,runtimeSha256=hashlib.sha256((R/'src/data/kaigo/atomic-supplements.json').read_bytes()).hexdigest(),scopePrintedPages=list(range(198,203)),visualPagesChecked=list(range(198,203)),visualInspectionMethod='full text layer and five-page contact sheet; all illustrations and labels viewed',atoms=rows,openVisualItems=[],openClinicalInterpretations=[],fullScopeAtomInventoryCertified=False,allSourceKnowledgeFullyCovered=False,wholeDocumentCoveragePercent=None,humanReviewed=False,domainReviewed=False,nativeDeviceTested=False,releaseReady=False,primaryChecks=['https://www.cdc.gov/infection-control/hcp/environmental-control/laundry-bedding.html','https://www.guysandstthomas.nhs.uk/health-information/falls/staying-safe-home'])
(R/'docs/ssw-workspace/kaigo/reviews/housework-source-atoms-2026-10-10.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(atoms=len(rows),pages=5)))
