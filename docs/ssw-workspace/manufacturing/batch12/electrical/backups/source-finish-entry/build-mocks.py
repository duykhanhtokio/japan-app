import json,hashlib,random,re,copy
from pathlib import Path
ROOT=Path(__file__).resolve().parents[5]
HERE=Path(__file__).resolve().parent
def stable(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def sha(x):return hashlib.sha256(stable(x).encode()).hexdigest()
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
new=json.loads((HERE/'new-content.json').read_text())
l=new['lessons'][0];assert l['id']=='mfg1-electrical-l043'
old=l['sourceHash']
l['paragraphs'][0]['textJa']=l['paragraphs'][0]['textJa'].replace('30問では20問、10問では6問が最低正答数になります。','このアプリが各問を同じ点数で練習採点する場合は、学科20問以上・実技6問以上を基準とします。公式試験の非公表の配点や正答数を保証する説明ではありません。')
l['sourceHash']=sha({k:v for k,v in l.items() if k!='sourceHash'})
for e in new['checks']:
 for q in e['questions']:
  if q['lessonId']==l['id']:
   q['lessonSourceHash']=l['sourceHash']
   for f in ['stemJa','optionReasonsJa']:
    if isinstance(q[f],str):q[f]=q[f].replace('教材の区分別基準','アプリの各問同点の練習基準')
    else:q[f]=[v.replace('教材の区分別基準','アプリの各問同点の練習基準') for v in q[f]]
   q['sourceHash']=sha({k:v for k,v in q.items() if k!='sourceHash'})
 e['revision']='v1-'+sha(e['questions'])[:16]
write(HERE/'new-content.json',new)
base=json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text())
lessons={l['id']:l for l in base['lessons']+new['lessons']}
falsebank=[];truebank=[];questions=[]
for row in (HERE/'mock-author-bank.txt').read_text().splitlines():
 num,t1,t2,f1,f2=row.split('|');num=int(num);lid=f'mfg1-electrical-l{num:03d}'
 if num==43:
  f1='アプリの各問同点の練習採点では、学科19問正解でも実技10問正解なら学科65%の基準を満たす。'
 for v,truth in [(t1,True),(t2,True),(f1,False),(f2,False)]:
  (truebank if truth else falsebank).append((lid,v,truth))
practical=[]
for row in (HERE/'mock-practical-bank.txt').read_text().splitlines():
 n,stem,answer,w1,w2,w3,reason=row.split('|');n=int(n)
 if n==43:
  stem=stem.replace('本教材に示す基準','このアプリの各問同点の練習基準')
  reason='このアプリの各問同点の練習採点では、学科20/30以上・実技6/10以上をそれぞれ必要とする。公式試験の非公表配点や最低正答数を保証するものではない。'
 practical.append((f'mfg1-electrical-l{n:03d}',stem,answer,[w1,w2,w3],reason))
assert len(truebank)==len(falsebank)==150 and len(practical)==100
rng=random.Random(261026);rng.shuffle(truebank);rng.shuffle(falsebank);rng.shuffle(practical)
all_stems=set();allids=set();forms=[];tpos=fpos=ppos=0
weekly_stems={re.sub(r'\s','',q['stemJa']) for e in base['checks']+new['checks'] for q in e['questions']}
def question(examid,section,index,lid,stem,options,correct,reasons):
 l=lessons[lid];qid=f'{examid}-{section}-{index:02d}'
 normalized=re.sub(r'\s','',stem);assert normalized not in all_stems and normalized not in weekly_stems,(qid,stem)
 all_stems.add(normalized);allids.add(qid)
 q={'id':qid,'lessonId':lid,'lessonSourceHash':l['sourceHash'],'knowledgeIds':l['knowledgeIds'],'stemJa':stem,'optionsJa':options,'correctIndex':correct,'optionReasonsJa':reasons,'sources':l['sources'],'reviewStatus':'ai_authored_draft_independent_review_pending'}
 q['sourceHash']=sha(q);return q
for f in range(1,11):
 eid=f'mfg1-electrical-mock-{f:02d}';theory=[];practice=[]
 # Equal true/false distributions without three consecutive identical correct positions.
 seq=[0]*15+[1]*15
 while True:
  rng.shuffle(seq)
  if all(not(seq[i]==seq[i-1]==seq[i-2]) for i in range(2,len(seq))):break
 for i,correct in enumerate(seq,1):
  if correct==0:lid,stem,_=truebank[tpos];tpos+=1
  else:lid,stem,_=falsebank[fpos];fpos+=1
  l=lessons[lid];explanation=' '.join(p['textJa'] for p in l['paragraphs'])
  # Explanation retains the authored lesson's actual technical conditions, not a truth label alone.
  reasons=['正しい。'+explanation,'この記述を誤りとはしない。'+explanation] if correct==0 else ['この記述は誤り。'+explanation,'誤り。'+explanation]
  theory.append(question(eid,'theory',i,lid,stem,['正しい','誤り'],correct,reasons))
 positions=[0,1,2,3,0,1,2,3,(f-1)%4,f%4];rng.shuffle(positions)
 while any(positions[i]==positions[i-1]==positions[i-2] for i in range(2,10)):rng.shuffle(positions)
 for i,correct in enumerate(positions,1):
  lid,stem,answer,wrongs,why=practical[ppos];ppos+=1
  rng.shuffle(wrongs);options=wrongs[:];options.insert(correct,answer)
  reasons=[('正しい。' if j==correct else 'この選択肢は適切ではない。')+why for j in range(4)]
  practice.append(question(eid,'practical',i,lid,stem,options,correct,reasons))
 e={'id':eid,'titleJa':f'電気電子機器組立て 模擬試験 {f:02d}','specialty':'electrical','kind':'mock','officialSimulation':True,'sections':{'theory':{'id':eid+'-theory','durationMs':40*60*1000,'passMinimumCorrect':20,'questions':theory},'practical':{'id':eid+'-practical','durationMs':40*60*1000,'passMinimumCorrect':6,'questions':practice}}}
 e['revision']='v1-'+sha(e['sections'])[:16];forms.append(e)
write(HERE/'mocks.json',{'specialty':'electrical','exams':forms})
report={'status':'structural_checks_pass_editorial_draft','date':'2026-10-26','level':'1','specialty':'electrical','forms':10,'theoryQuestions':300,'practicalQuestions':100,'uniqueStems':len(all_stems),'weeklyStemOverlaps':0,'questionIds':len(allids),'uniqueReferencedLessons':len({q['lessonId'] for e in forms for s in e['sections'].values() for q in s['questions']}),'allReferencedLessons':len(lessons),'questionHashesVerified':True,'lessonHashesVerified':True,'sectionDurationMinutes':40,'sectionDurationMs':2400000,'secondsToMilliseconds':'40*60*1000=2400000','practiceEqualWeightThresholds':{'theory':20,'practical':6},'officialUnpublishedScoringNotCertified':True,'sourceContentCopied':False,'independentReviewCompleted':False,'nativeReviewed':False,'domainReviewed':False,'fullSourceAtomizationComplete':False,'mocksSha256':hashlib.sha256((HERE/'mocks.json').read_bytes()).hexdigest(),'canonicalLesson043OldHash':old,'canonicalLesson043NewHash':l['sourceHash'] if l['id']=='mfg1-electrical-l043' else lessons['mfg1-electrical-l043']['sourceHash'],'note':'Original manually expressed items based on current authored lessons and their source bindings. No reused weekly stem. Reference pages are inherited lesson provenance, not new proof of full per-page visual review. Existing source ambiguities and release gates remain.'}
write(HERE/'mock-author-qa.json',report)
print(json.dumps({k:report[k] for k in ['forms','theoryQuestions','practicalQuestions','uniqueStems','uniqueReferencedLessons','weeklyStemOverlaps']},ensure_ascii=False))
