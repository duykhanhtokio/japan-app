"""Flexible 30-minute calendar; stable learning and exam state IDs are retained."""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
base=json.loads((R/'src/data/kaigo/content.json').read_text())
atomic=json.loads((R/'src/data/kaigo/atomic-supplements.json').read_text())
days=[]
for d in base['days']:
    parts=d['plannedMinutes']//30
    assert parts>=1 and d['plannedMinutes']%30==0
    for part in range(1,parts+1):
        days.append(dict(day=len(days)+1,plannedMinutes=30,baseDay=d['day'],group=d['week'],lessonId=d['lessonId'],mockId=d['mockId'],part=part,parts=parts,titleVi=d.get('knowledgeTitleVi') or d['titleVi'],studyPlanVi=('Luyện đề 30 phút rồi trở ra để lưu lượt. Ngày tiếp theo mở lại cùng đề và tiếp tục; chỉ nộp khi đã hoàn thành hoặc muốn kết thúc. Hai ngày luyện không phải một lượt mô phỏng liên tục.' if parts>1 else '30 phút dự kiến; dừng và tiếp tục phần còn lại ở ngày kế tiếp nếu cần.')))
assert atomic['days'][0]['day']==len(days)+1
out=dict(version=1,dailyMinutes=30,maxWeeks=None,totalDays=len(days)+len(atomic['days']),plannedMinutes=(len(days)+len(atomic['days']))*30,completeSourceInventory=False,learnerTimeMeasured=False,baseDays=days,policyVi='Mỗi ngày 30 phút; số ngày tăng theo kiến thức cần học. Không giới hạn 8 tuần và chưa chốt ngày hoàn tất toàn tài liệu.')
(R/'src/data/kaigo/daily-plan.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(totalDays=out['totalDays'],dailyMinutes=30,maxWeeks=None)))
