"""Verify the additive week49 bank, source bindings and unchanged earlier work."""
import copy, hashlib, json, subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[2]
W=R/'docs/ssw-workspace/agriculture/weekly-39'
def read(p): return json.loads((R/p).read_text())
def digest(o):return hashlib.sha256(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
base=read(str(W.relative_to(R)/'baseline.json'))['baseCommit']
def old(p):return json.loads(subprocess.check_output(['git','show',base+':'+p],cwd=R))
path='src/data/agriculture/weekly-checks.ja.json';bank=read(path);before=old(path)
assert bank['exams'][:-1]==before['exams']
assert {k:v for k,v in bank.items() if k!='exams'}=={k:v for k,v in before.items() if k!='exams'}
e=bank['exams'][-1];assert e==read(str(W.relative_to(R)/'questions.json'))['exam']
assert e['levels']==['2'] and e['weekIdsByLevel']=={'2':'agr-2-w49'}
assert e['officialSimulation'] is False and e['timeLimitMinutes'] is None and e['passThreshold'] is None
assert len(e['questions'])==6 and e['revision']=='v1-'+digest(e['questions'])[:16]
lessons={l['id']:l for l in read('src/data/agriculture/lessons.ja.json')['lessons']}
weekly=read('src/data/agriculture/course-manifest.json')['levels']['2']['weeks'][-1]
counts=[0]*4
for q in e['questions']:
 l=lessons[q['lessonId']];assert l['id'] in weekly['lessonIds'] and l['sourceHash']==q['lessonSourceHash']
 p=next(p for p in l['paragraphs'] if [p['id']]==q['paragraphIds']);assert p['knowledgeIds']==q['knowledgeIds']
 assert len(set(q['optionsJa']))==len(q['optionReasonsJa'])==4
 assert all(q['optionReasonsJa']) and all(q[k] is False for k in ['humanReviewed','nativeReviewed','domainReviewed'])
 counts[q['correctIndex']]+=1
assert max(counts)-min(counts)<=1
assert all(len({q['correctIndex'] for q in e['questions'][i:i+3]})>1 for i in range(4))
p='docs/ssw-workspace/agriculture/knowledge-ledger.json';ledger=read(p);expected=old(p)
byid={k['id']:k for k in expected['knowledge']}
for q in e['questions']:
 for kid in q['knowledgeIds']:byid[kid]['questionIds'].append(q['id'])
assert expected==ledger
protected=['src/data/agriculture/lessons.ja.json','src/data/agriculture/course-manifest.json','src/data/agriculture/mock-exams.ja.json','src/data/agriculture/recognition-images.json','src/components/agriculture/AgricultureCourse.tsx','src/services/agriculture-study-state.ts','docs/ssw-workspace/agriculture/source-gap-backlog.json','docs/ssw-workspace/agriculture/source-gap-reconciliation-38.json','docs/ssw-workspace/agriculture/mock-35/reviewed-question-queue.json']+[f'src/data/agriculture/translations/{loc}.json' for loc in ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']]
for p in protected:assert (R/p).read_bytes()==subprocess.check_output(['git','show',base+':'+p],cwd=R),p
prior=old('docs/ssw-workspace/agriculture/content-38/assessment-review-current.json')
review=read(str(W.relative_to(R)/'assessment-review-current.json'));assert review['decisions']==prior['decisions']
assert read('docs/ssw-workspace/agriculture/progress.json')['authored']=={**old('docs/ssw-workspace/agriculture/progress.json')['authored'],'weeklyQuestions':427}
qa=read(str(W.relative_to(R)/'browser-qa.json'));assert qa['status']=='PASS' and qa['questionCases']==6 and qa['responsiveCases']==8
for p,h in qa['guardedInputSha256'].items():assert hashlib.sha256((R/p).read_bytes()).hexdigest()==h,'QA stale: '+p
print(json.dumps({'status':'PASS','newWeeklyQuestions':6,'weeklyTotal':427,'mockQuestionsUnchanged':160,'protectedFiles':len(protected),'sourceClosures':0,'humanDomainNativeReviewed':False}))
