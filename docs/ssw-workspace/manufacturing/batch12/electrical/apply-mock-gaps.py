import json,hashlib,copy
from pathlib import Path
P=Path(__file__).resolve().parent
stable=lambda x:json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))
sha=lambda x:hashlib.sha256(stable(x).encode()).hexdigest()
original=json.loads((P/'backups/mocks.final-review-9b95c230.json').read_text());d=copy.deepcopy(original);ls={l['id']:l for l in json.loads((P/'gap-content.json').read_text())['lessons']};deltas=[]
for f,n,lesson,stem,why in json.loads((P/'mock-gap-retargets.json').read_text()):
 q=d['exams'][f-1]['sections']['theory']['questions'][n-1];before=copy.deepcopy(q);l=ls[f'mfg1-electrical-l{lesson:03d}'];c=q['correctIndex']
 q.update(lessonId=l['id'],lessonSourceHash=l['sourceHash'],knowledgeIds=l['knowledgeIds'],sources=l['sources'],stemJa=stem,optionReasonsJa=[why,'この文は正しい。'+why] if c==0 else ['この文は誤り。'+why,why]);q['sourceHash']=sha({k:v for k,v in q.items() if k!='sourceHash'});deltas.append({'questionId':q['id'],'previousLessonId':before['lessonId'],'newLessonId':q['lessonId'],'correctIndexPreserved':c,'beforeHash':before['sourceHash'],'afterHash':q['sourceHash']})
for e in d['exams']:e['revision']='v1-'+sha(e['sections'])[:16]
assert len({q['lessonId'] for e in d['exams'] for s in e['sections'].values() for q in s['questions']})==98
(P/'mocks.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');report={'status':'author_checked_independent_14_delta_review_pending','previousFreezeSha256':'9b95c2300010e6dd79e8785957244fa3d26e819c5c35eb0ec599c8c0a4af786f','currentSha256':hashlib.sha256((P/'mocks.json').read_bytes()).hexdigest(),'retargets':deltas,'coverageLessons':98,'allOriginal84LessonsPreserved':True,'forms01to06Unchanged':d['exams'][:6]==original['exams'][:6],'correctIndicesUnchanged':True,'nativeReviewed':False,'domainReviewed':False};(P/'mock-gap-retarget-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(report['currentSha256'])
