from pathlib import Path
import json,hashlib
r=Path(__file__).resolve().parents[1];folder=r/'docs/ssw-workspace/kaigo/reviews';c=json.loads((r/'src/data/kaigo/content.json').read_text());rt=json.loads((r/'src/data/kaigo/atomic-supplements.json').read_text());l=json.loads((folder/'whole-document-ledger-2026-10-09.json').read_text());terms={t['id']:t for t in c['terms']};ps={p['id']:p['explanationVi'] for u in rt['units'] for p in u['points']};days={i:d['day'] for d in rt['days'] for i in d['unitIds']};rows=[]
lex=[x for x in l['lexicalRecords'] if any(203<=p<=208 for p in x['sourcePrintedPages'])];assert len(lex)==110
for x in lex:
 t=terms[x['runtimeTermIds'][0]];assert t['termJa']==x['termJa'] and t['readingJa']==x['readingJa']
 for page in x['sourcePrintedPages']:
  number=int(x['id'].split('-')[-1])
  if page==204 and number>33:continue
  if page==205 and number<3:continue
  rows.append(dict(id=f'care-japanese-atom-{len(rows)+1:03}',printedPage=page,pdfPage=page+2,kind='word-label' if page==204 else 'lexical-table',sourceLexicalId=x['id'],termJa=t['termJa'],readingJa=t['readingJa'],meaningVi=t['meaningVi'],sourceGlossVi=x['meaningVi'],glossTextIdentical=t['meaningVi']==x['meaningVi'],runtimeTermId=t['id'],runtimeDays=[lesson['day'] for lesson in c['lessons'] if t['id'] in lesson['termIds']],appEquivalentVi=t['meaningVi'],visualPageChecked=True,humanReviewed=False,mappingStatus='existing-independent-gloss',qualificationVi='Đọc bảng và nhãn trực quan; không suy từ bản trích chữ thiếu font. Nghĩa đã chỉnh theo ngữ cảnh, chưa duyệt bản ngữ/chuyên môn.'))
def atom(page,kind,key,n,concepts,q=None):
 pid=f'kaigo-atomic-{key}-{n}';assert pid in ps
 for concept in concepts.split(';'):rows.append(dict(id=f'care-japanese-atom-{len(rows)+1:03}',printedPage=page,pdfPage=page+2,kind=kind,conceptVi=concept,runtimePointId=pid,runtimeDay=days['kaigo-atomic-'+key],appEquivalentVi=ps[pid],visualPageChecked=True,humanReviewed=False,mappingStatus='qualified-independent-equivalent' if q else 'independent-concept-equivalent',qualificationVi=q))
for key,n,concept in [('adl-iadl',1,'Di chuyển'),('meal-checks',1,'Ăn uống'),('toilet-environment',1,'Bài tiết'),('grooming-purpose',1,'Chỉnh trang'),('bath-environment',1,'Tắm và giữ vệ sinh'),('home-environment',1,'Việc nhà')]:atom(203,'section-navigation',key,n,concept,'Trang mở đầu là chỉ dẫn nhóm nội dung, không một bài kiến thức mới. Đoạn văn/đáp án là tổ chức tài liệu; không đưa câu nguồn vào app.')
atom(204,'eye-label-relations','body-regions',4,'Khóe trong gần mũi;Đuôi mắt phía ngoài;Trán;Cằm;Cổ;Họng')
atom(204,'hand-foot-label-relations','body-regions',5,'Cánh tay;Cổ tay;Ngón;Đầu ngón;Lòng tay;Mu tay;Cổ chân;Đầu bàn chân;Gót;Gan bàn chân')
atom(204,'trunk-label-relations','body-regions',6,'Thắt lưng khác toàn lưng;Hai tên vùng mông')
atom(205,'side-terms','body-regions',6,'Bên ảnh hưởng;Bên không ảnh hưởng;Không suy trái/phải','Không mặc định bên còn lại khỏe hoàn toàn hoặc từ患側 chỉ người liệt.')
atom(205,'health-terms','risk-observation',7,'Sức khỏe;Tình trạng cơ thể;Sắc mặt;Dấu hiệu sinh tồn','Không dùng sắc mặt thay số đo hoặc chẩn đoán.')
atom(206,'six-posture-pictures','posture-names',6,'Ngửa và mặt hướng lên;Nghiêng và mặt hướng bên;Sấp và mặt hướng xuống;Tên chuyên môn và cách nói thông thường','Hướng trong hình để nhận diện; không chỉ định tư thế cho mọi người.')
atom(206,'sitting-standing-and-actions','posture-names',7,'Ngồi mép giường;Chân thả xuống;Ngồi ghế;Đứng;Tư thế cơ thể;Đổi tư thế;Dáng và tư thế')
atom(207,'symptom-pictures-and-pairs','risk-observation',8,'Chất nôn ra;Nôn khác buồn nôn;Ra mồ hôi trong hình;Mồ hôi khác sốt;Sưng khác phù','Hình không xác định số nhiệt hoặc nguyên nhân triệu chứng.')
atom(207,'qualified-medical-glosses','risk-observation',9,'Co rút hạn chế khớp;Loét tì đè;Bệnh do nóng','Làm rõ bản Việt ngắn; không chỉ ở nằm liệt hoặc đồng nhất mọi sốc nhiệt.')
atom(207,'disease-versus-symptom-language','risk-observation',10,'Đau;Khổ sở/khó chịu;Triệu chứng;Cơn phát bệnh;Ho;Chóng mặt;Tê','Không tự chẩn đoán bằng tên bảng từ.')
atom(208,'movement-distinction','movement-devices',7,'Chuyển giữa chỗ tựa;Di chuyển chung;Ngồi dậy;Trở mình;Nằm giường;Rời giường')
atom(208,'four-device-pictures','movement-devices',8,'Máy nâng chuyển;Tấm trượt chuyển;Xe đẩy trợ sinh hoạt;Gậy trắng;Khác khung tập đi','Không chọn dụng cụ chỉ từ tên/hình; xe đẩy trợ sinh hoạt không tự thay khung tập đi.')
atom(208,'verbs-in-context','movement-devices',9,'Cài phanh;Chống gậy;Bám/vịn;Nắm;Đỡ;Lên tiếng;Hướng dẫn','Ngữ cảnh động từ cần đối tượng; không là hướng dẫn thao tác hoặc mẫu câu thi nguồn.')
out=dict(version=1,date='2026-10-10',sourceSha256='997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54',runtimeSha256=hashlib.sha256((r/'src/data/kaigo/atomic-supplements.json').read_bytes()).hexdigest(),termsRuntimeSha256=hashlib.sha256((r/'src/data/kaigo/content.json').read_bytes()).hexdigest(),scopePrintedPages=list(range(203,209)),visualPagesChecked=list(range(203,209)),visualInspectionMethod='full text and two three-page contact sheets; font-missing cells read visually',existingSourceLexicalRecords=len(lex),newVocabularyEntries=0,atoms=rows,openVisualItems=[],fullScopeAtomInventoryCertified=False,allSourceKnowledgeFullyCovered=False,wholeDocumentCoveragePercent=None,humanReviewed=False,domainReviewed=False,nativeDeviceTested=False,releaseReady=False,primaryChecks=['https://www.sg-mark.org/product/no-0075/','https://www.mhlw.go.jp/seisakunitsuite/bunya/kenkou_iryou/kenkou/nettyuu/nettyuu_taisaku/happen.html','https://www.nhs.uk/conditions/pressure-sores/'])
(folder/'care-japanese-source-atoms-2026-10-10.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print('Atoms',len(rows),'lexical',len(lex))
