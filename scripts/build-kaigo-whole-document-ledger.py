"""Build traceability, without treating page/section links as atomic completeness."""
import json,re,html,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def read(p):return json.loads((R/p).read_text())
old=read('docs/ssw-workspace/kaigo/reviews/knowledge-depth-coverage-2026-10-08.json')
a=read('docs/ssw-workspace/kaigo/drafts/atomic-supplements-2026-10-09.json')
rt=read('src/data/kaigo/atomic-supplements.json');c=read('src/data/kaigo/content.json');v=read('docs/ssw-workspace/kaigo/drafts/source-vocabulary-inventory-2026-10-08.json')
def pages(value):
 if isinstance(value,list):return value
 result=[]
 for part in str(value).split(','):
  nums=[int(x) for x in re.findall(r'\d+',part)]
  if len(nums)==2:result+=list(range(nums[0],nums[1]+1))
  else:result+=nums
 return result
# Correct page drift in the previous section-level ledger, based on actual main PDF.
fix={'P2-C1-S12':'53-55','P2-C1-S13':'56-57','P2-C1-S14':'57-58','P2-C1-S15':'59-60','P2-C1-S16':'60-61','P2-C1-S17':'62','P2-C1-S18':'63','P2-C2-S06':'74-75','P2-C2-S07':'76,78','P2-C2-S08':'79','P2-C2-S09':'77','P2-C2-S13':'83','P2-C2-S14':'84','P2-C2-S15':'85-86','P2-C2-S16':'87'}
sections=[]
for x in old['knowledgeItems']:
 y=dict(id=x['id'],titleVi=x['sectionVi'],sourcePrintedPages=pages(fix.get(x['id'],x['sourcePrintedPages'])),baseEvidence=x['afterEvidence'],priorGrade=x['after'],status='section-linked-not-atomic-certified',humanReviewed=False)
 y['newUnitIds']=[u['id'] for u in a['units'] if set(u['sourcePrintedPages'])&set(y['sourcePrintedPages'])];sections.append(y)
unitdays={id:d['day'] for d in rt['days'] for id in d['unitIds']}
points=[dict(id=p['id'],unitId=u['id'],titleVi=u['titleVi'],sourcePrintedPages=u['sourcePrintedPages'],day=unitdays[u['id']],parentDay=u['parentDay'],explanationVi=p['explanationVi'],status='new-authored-point-mapped',mappingGranularity='unit-level source pages; not one-to-one source atom inventory',humanReviewed=False) for u in a['units'] for p in u['points']]
langs=[]
for x in old['languageItems']:
 e=x['afterEvidence'];lesson=next(l for l in c['lessons'] if l['id']==e['lessonId']);task=next(t for t in lesson['languageTasks'] if t['id']==e['taskId']);langs.append(dict(id=x['id'],sourcePrintedPages=pages(x['sourcePrintedPages']),titleVi=x['sectionVi'],day=e['day'],taskId=e['taskId'],textJa=task['textJa'],promptVi=task['promptVi'],expectedVi=task['expectedVi'],status='objective-linked-not-every-source-detail-certified'))
terms=[]
for x in v['entries']:
 matches=[t for t in c['terms'] if t['termJa']==x['termJa'] and t['readingJa']==x['readingJa']]
 if not matches:matches=[t for t in c['terms'] if t['termJa']==x['termJa']]
 ids=[t.get('id') for t in matches];lessons=[l for l in c['lessons'] if any(i in l['termIds'] for i in ids)]
 terms.append(dict(id=x['id'],sourcePrintedPages=pages(x['sourcePrintedPages']),termJa=x['termJa'],readingJa=x['readingJa'],meaningVi=x['meaningVi'],runtimeTermIds=ids,days=[l['day'] for l in lessons],status='runtime-linked' if lessons else 'runtime-mapping-missing',humanReviewed=False))
visual=list(range(10,41))+list(range(42,67))+list(range(68,96))+[47,49,51,53,54,55,56,57,58,61,63,70,79,80,82,88,90,92,125,126,127,134,135,136,137,138,139,140,141,142,145,146,147,148,156,162,163,164,165,166,167,168,169,172,173,174,175,176,177,178,179,181,182,183,184,188,191,192,193,194,195,196,197]
visual=sorted(set(visual))
pageRows=[]
for pdf in range(1,277):
 p=pdf-2;ks=[x['id'] for x in sections if p in x['sourcePrintedPages']];ls=[x['id'] for x in langs if p in x['sourcePrintedPages']];ts=[x['id'] for x in terms if p in x['sourcePrintedPages']];us=[u['id'] for u in a['units'] if p in u['sourcePrintedPages']]
 if ks or ls or ts:role='learning-page-linked'
 elif p in [9,15,41,67,96,97,119,143,185,203,244,270]:role='part-or-chapter-divider'
 elif p>=271:role='answer-sheet-resource-or-publication-information'
 elif p<9:role='cover-preface-toc-or-orientation'
 else:role='unmapped-page-requires-review'
 pageRows.append(dict(pdfPage=pdf,printedPage=p if p>0 else None,role=role,sectionIds=ks,languageIds=ls,termIds=ts,newUnitIds=us,visualSpotCheck=p in visual,allLabelsCaptionsFactsCertified=False,status='NOT_FULLY_ATOMIC_CERTIFIED'))
report=dict(version=1,date='2026-10-09',canonicalSource=old['canonicalSource'],baselineCommit='49e6f67a07ed37ffd08f22f2a8442e2edcebdc50',scopeVi='Toàn 276 trang được đăng ký; liên kết cấp mục, từ, mục tiêu ngôn ngữ và ý mới. Chưa là danh mục từng ý gốc đầy đủ.',allSourceKnowledgeFullyCovered=False,originalKnowledgeCoveragePercent=None,percentageReasonVi='Chưa có mẫu số gồm mọi ý, nhãn, chú thích và dữ kiện gốc; không dùng số trang hay số thẻ làm tỷ lệ kiến thức.',counts=dict(pdfPages=276,sections=len(sections),languageObjectives=len(langs),sourceLexicalRecords=len(terms),newUnits=len(a['units']),newTeachingPoints=len(points),newCases=len(a['units']),newStudyDays=len(rt['days']),visualSpotCheckPages=len(visual)),pageRows=pageRows,sections=sections,newTeachingPoints=points,languageObjectives=langs,lexicalRecords=terms,remainingVi=['Tách và kiểm mọi nhãn/hướng mũi tên/chú thích ở các hình chưa kiểm trực quan.', 'Phân rã mọi mục gốc thành ý nhỏ và kiểm tính tương đương từng ý; liên kết cấp trang hoặc cấp mục chưa chứng minh đủ.', 'Duyệt chuyên môn và bản ngữ vẫn chưa thực hiện; kiểm bản cài native chưa chạy.'],humanReviewed=False,domainReviewed=False,releaseReady=False)
folder=R/'docs/ssw-workspace/kaigo/reviews';folder.mkdir(exist_ok=True)
(folder/'whole-document-ledger-2026-10-09.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
def h(x):return html.escape(str(x))
def table(title,cols,rows):
 return '<h2>'+h(title)+'</h2><div class="table"><table><thead><tr>'+''.join('<th>'+h(c)+'</th>' for c in cols)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+h(z)+'</td>' for z in row)+'</tr>' for row in rows)+'</tbody></table></div>'
evidencePath=R/'docs/ssw-workspace/kaigo/runtime-tests/2026-10-09-atomic/browser-evidence.json'
evidence=json.loads(evidencePath.read_text()) if evidencePath.exists() else {}
foundation=json.loads((folder/'foundation-source-atoms-2026-10-09.json').read_text())
report['foundationAtomAudit']=dict(counts=foundation['counts'],scopePrintedPages=foundation['scopePrintedPages'],fullScopeAtomInventoryCertified=False)
(folder/'whole-document-ledger-2026-10-09.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
body='<h1>Đối chiếu Kaigo · toàn tài liệu đăng ký, chưa chứng nhận từng ý</h1><p>276 trang PDF · 159 mục kiến thức · 52 mục tiêu đọc hiểu · 287 bản ghi từ vựng · '+str(len(a['units']))+' thẻ / '+str(len(points))+' ý giải thích / '+str(len(a['units']))+' ca / '+str(len(rt['days']))+' buổi bổ sung.</p><p class="notice">Chưa xác định được % kiến thức gốc. Bảng bao phủ toàn bộ số trang nhưng chưa chứng minh mọi ý, nhãn hình và chú thích đã đủ. Không coi 100% số thẻ hiện trong app là 100% kiến thức tài liệu.</p><p>Nội dung mới được viết theo mục tiêu, có giải thích, ca khác, giới hạn và điểm tự kiểm. Hình nguồn và văn bản trích xuất không đưa vào app. Sàng lọc giống chữ không phải chứng nhận bản quyền; duyệt con người, chuyên môn và bản ngữ chưa hoàn thành.</p><input id="filter" placeholder="Lọc dòng theo mã, trang, từ hoặc nội dung…" aria-label="Lọc bảng">'
projectionPath=R/'docs/ssw-workspace/kaigo/runtime-tests/2026-10-09-atomic/final-projection-evidence.json'
projection=json.loads(projectionPath.read_text()) if projectionPath.exists() else {}
if projection.get('points')==len(points) and projection.get('finalRuntimeSha256')==foundation['runtimeSha256']:
 body+='<p><strong>Kiểm hiển thị bản hiện tại:</strong> '+str(projection['points'])+' ý giải thích / '+str(projection['studyPlans'])+' kế hoạch / '+str(projection['japaneseTaskTexts'])+' văn bản nhiệm vụ tiếng Nhật; không lỗi JavaScript. Chưa kiểm native.</p>'
if evidence.get('baseLessons'):
 body+='<p><strong>Kiểm giao diện trước đợt bổ sung này (351 ý):</strong> '+str(len(evidence['units']))+' thẻ / '+str(evidence['points'])+' ý mới, '+str(len(evidence['baseLessons']))+' bài nền, '+str(evidence['sourceTermRecordsLinkedAndRendered'])+' bản ghi từ được nối và hiển thị; ba kích thước màn hình, lưu sau tải lại, mở bài liên quan. Bản kiểm là React Native Web của KaigoCourse thật; chưa kiểm bản cài Android/iOS.</p>'
body+=table('Đăng ký đủ 276 trang',['Trang PDF','Trang in','Vai trò','Mục nền','Mục ngôn ngữ','Số bản ghi từ','Thẻ mới','Đã kiểm hình chọn lọc','Chứng nhận mọi ý'],[(x['pdfPage'],x['printedPage'] or '—',x['role'],', '.join(x['sectionIds']),', '.join(x['languageIds']),len(x['termIds']),', '.join(x['newUnitIds']),'Có' if x['visualSpotCheck'] else 'Chưa ghi bằng chứng','Chưa') for x in pageRows])
body+=table('159 mục kiến thức: bằng chứng nền và bổ sung',['Mã','Mục','Trang in đã hiệu chỉnh','Bài nền / bằng chứng','Thẻ mới','Trạng thái'],[(x['id'],x['titleVi'],x['sourcePrintedPages'],json.dumps(x['baseEvidence'],ensure_ascii=False),', '.join(x['newUnitIds']),'Đã nối cấp mục; chưa đủ căn cứ từng ý') for x in sections])
body+=table(str(len(points))+' ý giải thích mới: nội dung hiển thị và đường vào app',['Mã ý','Chủ đề','Trang nguồn cấp thẻ','Buổi mới','Bài nền','Giải thích mới'],[(x['id'],x['titleVi'],x['sourcePrintedPages'],x['day'],x['parentDay'],x['explanationVi']) for x in points])
body+=table('Đối chiếu ý nhỏ nền tảng · trang in 10–40 · AI biên tập, chưa chứng nhận toàn bộ',['Mã ý gốc','Trang in / PDF','Loại','Khái niệm','Mã ý app','Buổi','Biểu đạt mới trong app','Giới hạn hoặc hiệu chỉnh'],[(x['id'],str(x['printedPage'])+' / '+str(x['pdfPage']),x['kind'],x['conceptVi'],x['runtimePointId'],x['runtimeDay'],x['appEquivalentVi'],x['qualificationVi'] or 'Chưa duyệt chuyên môn/con người') for x in foundation['atoms']])
body+=table('Chi tiết hình vẫn còn mở',['Trang in','Loại','Phần cần kiểm'],[(x['printedPage'],x['kind'],x['conceptVi']) for x in foundation['openItems']])
body+=table('52 mục tiêu ngôn ngữ',['Mã','Mục tiêu','Trang','Ngày','Thẻ trong app','Văn bản mới','Câu tự kiểm','Ý đối chiếu'],[(x['id'],x['titleVi'],x['sourcePrintedPages'],x['day'],x['taskId'],x['textJa'],x['promptVi'],x['expectedVi']) for x in langs])
gaps=json.loads((folder/'body-gap-source-atoms-2026-10-09.json').read_text())
body+=table('Các ý thiếu đã bổ sung trong phần cơ thể · chưa chứng nhận toàn khối',['Mã','Trang in / PDF','Khái niệm','Mã app','Buổi','Biểu đạt mới'],[(x['id'],str(x['printedPage'])+' / '+str(x['pdfPage']),x['conceptVi'],x['runtimePointId'],x['runtimeDay'],x['appEquivalentVi']) for x in gaps['atoms']])
report['bodyGapAudit']=dict(atomCount=len(gaps['atoms']),fullScopeAtomInventoryCertified=False)
(folder/'whole-document-ledger-2026-10-09.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
bodyAtoms=read('docs/ssw-workspace/kaigo/reviews/body-source-atoms-2026-10-09.json')
body+=table('Đối chiếu phần cơ thể · trang in 42–66 · chưa chứng nhận độc lập tính đầy đủ',['Mã','Trang in / PDF','Loại','Khái niệm','Mã app','Ngày','Biểu đạt mới','Giới hạn'],[(x['id'],str(x['printedPage'])+' / '+str(x['pdfPage']),x['kind'],x['conceptVi'],x['runtimePointId'],x['runtimeDay'],x['appEquivalentVi'],x['qualificationVi'] or 'Chưa duyệt chuyên môn/con người') for x in bodyAtoms['atoms']])
aging=read('docs/ssw-workspace/kaigo/reviews/aging-source-atoms-2026-10-09.json')
report['agingAtomAudit']=dict(atomCount=len(aging['atoms']),scopePrintedPages=aging['scopePrintedPages'],openVisualItems=aging['openVisualItems'],fullScopeAtomInventoryCertified=False)
body+=table('Đối chiếu lão hóa, khuyết tật và sa sút trí tuệ · trang 68–95',['Mã','Trang in / PDF','Loại','Khái niệm','Mã app','Ngày','Biểu đạt mới','Giới hạn'],[(x['id'],str(x['printedPage'])+' / '+str(x['pdfPage']),x['kind'],x['conceptVi'],x['runtimePointId'],x['runtimeDay'],x['appEquivalentVi'],x['qualificationVi'] or 'Chưa duyệt chuyên môn/con người') for x in aging['atoms']])
body+=table('Chi tiết hình phần người cần chăm sóc còn mở',['Trang in','Phần cần kiểm'],[(x['printedPage'],x['itemVi']) for x in aging['openVisualItems']])
plan=read('src/data/kaigo/daily-plan.json')
report['bodyAtomAudit']=dict(atomCount=len(bodyAtoms['atoms']),fullScopeAtomInventoryCertified=False)
report['dailyPlan']=dict(totalDays=plan['totalDays'],dailyMinutes=30,maxWeeks=None,finalCompletionDays=None,learnerTimeMeasured=False)
calendar=[(d['day'],30,d['titleVi'],d['studyPlanVi']) for d in plan['baseDays']]+[(d['day'],30,' · '.join(u['titleVi'] for u in rt['units'] if u['id'] in d['unitIds']),d['studyPlanVi']) for d in rt['days']]
body+=table('Lịch học mở · mọi ngày 30 phút · số ngày còn tăng theo nội dung',['Ngày','Phút dự kiến','Nội dung','Phân bổ'],calendar)
(folder/'whole-document-ledger-2026-10-09.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
body+=table('287 bản ghi từ nguồn → kho từ app',['Mã','Trang','Từ','Cách đọc','Nghĩa mới','Mã app','Ngày liên quan','Trạng thái'],[(x['id'],x['sourcePrintedPages'],x['termJa'],x['readingJa'],x['meaningVi'],x['runtimeTermIds'],x['days'],x['status']) for x in terms])
body+='<h2>Phần còn phải hoàn tất</h2><ul>'+''.join('<li>'+h(x)+'</li>' for x in report['remainingVi'])+'</ul><p>Phạm vi: PDF chính 276 trang. Tài liệu bộ câu hỏi quốc gia 155 trang / 713 câu chưa được đối chiếu toàn bộ.</p>'
htmlpage='<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Đối chiếu Kaigo toàn tài liệu</title><style>body{font:16px system-ui;margin:24px;line-height:1.6;color:#18324a;background:#f5f8fb}h1{font-size:28px}.notice{background:#fff1ca;padding:16px;border-left:5px solid #ad7200}input{position:sticky;top:0;padding:12px;width:min(95%,700px);background:white;border:1px solid #59758b}.table{overflow:auto}table{border-collapse:collapse;background:white;min-width:900px;width:100%;font-size:14px}th,td{border:1px solid #ced9e2;padding:9px;text-align:left;vertical-align:top}th{background:#e0edf5}td{max-width:550px}h2{margin-top:40px}</style>'+body+'<script>document.querySelector("#filter").addEventListener("input",e=>{let q=e.target.value.toLowerCase();document.querySelectorAll("tbody tr").forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(q))})</script></html>'
(folder/'doi-chieu-kaigo-toan-tai-lieu-2026-10-09.html').write_text(htmlpage)
print(json.dumps(dict(counts=report['counts'],unmappedPages=[x['printedPage'] for x in pageRows if x['role']=='unmapped-page-requires-review'],unmappedTerms=[x['id'] for x in terms if x['status']!='runtime-linked']),ensure_ascii=False))
