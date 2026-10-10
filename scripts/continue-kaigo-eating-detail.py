"""Add independently expressed eating concepts; preserve existing IDs and calendar."""
import hashlib
import json
from pathlib import Path

R = Path(__file__).resolve().parents[1]
dp = R / 'docs/ssw-workspace/kaigo/drafts/atomic-supplements-2026-10-09.json'
rp = R / 'src/data/kaigo/atomic-supplements.json'
draft = json.loads(dp.read_text())
runtime = json.loads(rp.read_text())
additions = {
 'swallow-stages': [
  'Ăn đòi hỏi phối hợp nhiều việc: tới chỗ ăn, giữ tư thế, nhận ra món, điều khiển dụng cụ, đưa thức ăn vào miệng, nhai rồi nuốt. Khó khăn ở một việc không có nghĩa phải làm thay toàn bộ; xác định phần người dùng còn thực hiện được.',
  'Cảm giác đói và muốn ăn liên quan hoạt động của não. Mắt và mũi giúp nhận biết món; vị giác nhận hương vị, còn xúc giác góp phần cảm nhận kết cấu trong miệng. Nhận ra món và thích món chưa xác nhận khả năng nuốt.'
 ],
 'food-devices': [
  'Có thể phân nhóm dụng cụ theo trở ngại: cán dễ nắm và đai giữ hỗ trợ việc giữ dụng cụ; thìa hoặc nĩa cong điều chỉnh hướng đưa tới miệng; đũa có lò xo hỗ trợ thao tác gắp. Chọn sau khi xem người dùng cầm và sử dụng thực tế, không chỉ nhìn tên dụng cụ.',
  'Đĩa có thiết kế dễ xúc hỗ trợ lấy thức ăn; tấm chống trượt giữ đồ trên bàn ổn định; bát dễ cầm và cốc có tay cầm hỗ trợ giữ vật chứa. Giữ được cốc là khả năng vận động, không phải bằng chứng loại nước trong cốc phù hợp với kế hoạch nuốt.'
 ],
 'meal-checks': [
  'Quan sát bữa ăn theo diễn biến: tốc độ, tư thế, cách dùng dụng cụ, động tác nhai và nuốt, cùng mong muốn của người dùng. Điều chỉnh hỗ trợ theo thông tin thực sự thu được và kế hoạch; không coi nhịp ăn của nhân viên là nhịp người dùng phải theo.',
  'Trình bày thực đơn và hỏi mong muốn khi người dùng có thể trao đổi. Đang nhai thì chờ thời điểm phù hợp trước hỏi; người dùng muốn nghỉ hoặc kết thúc cần được tiếp nhận, không suy rằng phần ăn còn lại là yêu cầu phải tiếp tục.'
 ]}
new_ids=[]
for key, texts in additions.items():
 uid='kaigo-atomic-'+key
 du=next(u for u in draft['units'] if u['id']==uid)
 ru=next(u for u in runtime['units'] if u['id']==uid)
 for text in texts:
  matches=[p for p in du['points'] if p['explanationVi']==text]
  if matches:
   new_ids.append(matches[0]['id']); continue
  point={'id':uid+'-'+str(len(du['points'])+1),'explanationVi':text}
  du['points'].append(point); ru['points'].append(dict(point)); new_ids.append(point['id'])
 content={k:v for k,v in ru.items() if k!='contentRevision'}
 ru['contentRevision']=hashlib.sha256(json.dumps(content,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
for path, data in [(dp,draft),(rp,runtime)]:
 path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
evidence={
 'date':'2026-10-10','scopePrintedPages':list(range(144,152)),
 'sourceLibraryFileId':'libfile_30516fe27c688191907d48df8b3fb8df',
 'sourcePdfPagesRead':list(range(146,154)),
 'sourceAccess':'Library current PDF text read; page images unavailable in this call',
 'sourceBytesHashRecomputedThisSession':False,
 'newPointIds':new_ids,'newPoints':len(new_ids),
 'totalPoints':sum(len(u['points']) for u in runtime['units']),
 'units':len(runtime['units']),'calendarDays':144,
 'visualCheckedThisSession':False,'fullScopeAtomInventoryCertified':False,
 'allSourceKnowledgeFullyCovered':False,'wholeDocumentCoveragePercent':None,
 'humanReviewed':False,'domainReviewed':False,'releaseReady':False,
 'remainingVi':['Đối chiếu trực quan nhãn và mũi tên các hình trang 145–151.',
 'Lập danh mục từng ý ăn uống, nối nghĩa cụ thể thay liên kết cấp trang.',
 'Tiếp tục bài tiết 152–169 rồi chỉnh trang, vệ sinh và việc nhà.',
 'Rà tương đồng ngữ nghĩa và kiểm chuyên môn; chưa chứng nhận quyền hoặc phát hành.']}
(R/'docs/ssw-workspace/kaigo/reviews/eating-detail-2026-10-10.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(evidence,ensure_ascii=False))
