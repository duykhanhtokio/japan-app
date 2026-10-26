import json,re,hashlib
from pathlib import Path
ROOT=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');P=Path(__file__).parent
S=json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text());M=json.loads((ROOT/'src/data/manufacturing/mocks/electrical.json').read_text());less={};qs={};files=[];errs=[]
for f in sorted(P.glob('bn-electrical-*.json')):
 if 'qa' in f.name:continue
 d=json.loads(f.read_text());files.append({'path':str(f.relative_to(ROOT)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
 for k,v in d.get('lessons',{}).items():
  if k in less and less[k]!=v:errs.append('conflicting lesson '+k)
  less[k]=v
 for k,v in d.get('questions',{}).items():
  if k in qs and qs[k]!=v:errs.append('conflicting question '+k)
  qs[k]=v
SQ={q['id']:q for c in S['checks']for q in c['questions']};MQ={q['id']:q for e in M['exams']for sec in e['sections'].values()for q in sec['questions']};fieldcount=0;numberWarnings=[]
def checktext(src,tgt,where):
 global fieldcount
 fieldcount+=1
 if not isinstance(tgt,str)or not tgt.strip():errs.append('empty '+where);return
 if re.search(r'[\u3040-\u30ff\u4e00-\u9fff\u0e00-\u0e7f]',tgt.replace('・','')):errs.append('foreign '+where)
 # All source numeric literals must remain, unless a listed representation difference is reviewed below.
 ns=set(re.findall(r'\d+(?:\.\d+)?',src));nt=set(re.findall(r'\d+(?:\.\d+)?',tgt))
 if ns-nt:numberWarnings.append({'field':where,'missing':sorted(ns-nt),'source':src,'translation':tgt})
for l in S['lessons']:
 t=less.get(l['id']);assert t,l['id'];assert t['sourceHash']==l['sourceHash'];assert t['translatedDirectlyFrom']=='ja'and t['nativeReviewed']is False and t['domainReviewed']is False
 assert len(t['paragraphs'])==len(l['paragraphs'])and len(t['terms'])==len(l['terms'])and len(t['safety'])==len(l['safetyJa'])
 for a,b in [('titleJa','title'),('objectiveJa','objective'),('activityJa','activity'),('summaryJa','summary')]:checktext(l[a],t[b],l['id']+'.'+b)
 for a,b in zip(l['paragraphs'],t['paragraphs']):
  assert a['id']==b['id'];checktext(a['titleJa'],b['title'],l['id']+'.paragraphTitle');checktext(a['textJa'],b['text'],l['id']+'.'+a['id'])
 for a,b in zip(l['terms'],t['terms']):
  assert a['ja']==b['ja']and a['reading']==b['reading'];checktext(a['meaningJa'],b['meaning'],l['id']+'.term')
 for a,b in zip(l['safetyJa'],t['safety']):checktext(a,b,l['id']+'.safety')
for k,q in (SQ|MQ).items():
 t=qs.get(k);assert t,k;assert t['sourceHash']==q['sourceHash'];assert t['translatedDirectlyFrom']=='ja'and t['nativeReviewed']is False and t['domainReviewed']is False
 assert len(t['options'])==len(t['reasons'])==len(q['optionsJa'])
 checktext(q['stemJa'],t['stem'],k+'.stem')
 for a,b in zip(q['optionsJa'],t['options']):checktext(a,b,k+'.option')
 for a,b in zip(q['optionReasonsJa'],t['reasons']):checktext(a,b,k+'.reason')
assert len(less)==98 and len(set(qs)&set(SQ))==168 and len(set(qs)&set(MQ))==400
report={'locale':'bn','specialty':'electrical','lessons':len(less),'weeklyQuestions':168,'mockQuestions':400,'translatedFields':fieldcount,'errors':errs,'numericLiteralReview':numberWarnings,'files':files,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'releaseReady':False,'semanticAuthorReview':'All 168 weekly and400 mocks compared directly to complete Japanese source. Initial weekly001–096 were expanded to restore source contexts, conditions, distractor wording and reasons. Lessons preserve full paragraph/term/safety structures; sample semantic comparison plus all98 structural/numeric checks, not independent semantic certification.'}
(P/'bn-electrical-final-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'lessons':len(less),'weekly':168,'mocks':400,'fields':fieldcount,'errors':errs,'numericWarnings':len(numberWarnings)},ensure_ascii=False));
for w in numberWarnings:print(w['field'],w['missing'],w['source'],w['translation'])
assert not errs
