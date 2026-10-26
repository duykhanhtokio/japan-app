import json,re,hashlib
from pathlib import Path
R=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');P=Path(__file__).parent;S={l['id']:l for l in json.load(open(R/'src/data/manufacturing/surface.json'))['lessons']};T={};files=[]
for f in sorted(P.glob('my-surface-lessons-*.json')):
 d=json.loads(f.read_text());T.update(d['lessons']);files.append({'path':str(f.relative_to(R)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
errors=[];nums=[];fields=0
for k,t in T.items():
 s=S[k];assert t['sourceHash']==s['sourceHash'];assert t['translatedDirectlyFrom']=='ja'and t['nativeReviewed']is False and t['domainReviewed']is False;assert len(t['paragraphs'])==len(s['paragraphs'])and len(t['terms'])==len(s['terms'])and len(t['safety'])==len(s['safetyJa'])
 pairs=[(s['titleJa'],t['title']),(s['objectiveJa'],t['objective']),(s['activityJa'],t['activity']),(s['summaryJa'],t['summary'])]
 for a,b in zip(s['paragraphs'],t['paragraphs']):assert a['id']==b['id'];pairs.extend([(a['titleJa'],b['title']),(a['textJa'],b['text'])])
 for a,b in zip(s['terms'],t['terms']):assert a['ja']==b['ja']and a['reading']==b['reading'];pairs.append((a['meaningJa'],b['meaning']))
 pairs.extend(zip(s['safetyJa'],t['safety']))
 for a,b in pairs:
  fields+=1;assert b.strip()
  if re.search(r'[\u3040-\u30fa\u30fc-\u30ff\u4e00-\u9fff\u0e00-\u0e7f\u0900-\u09ff]',b):errors.append(k)
  diff=set(re.findall(r'\d+(?:\.\d+)?',a))-set(re.findall(r'\d+(?:\.\d+)?',b))
  if diff:nums.append({'id':k,'missing':sorted(diff),'source':a,'translation':b})
report={'locale':'my','specialty':'surface','lessons':len(T),'translatedLessonFields':fields,'weeklyQuestions':0,'mockQuestions':0,'errors':errors,'numericWarnings':nums,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'files':files,'semanticScope':'Author read full Japanese and translated every field directly; no independent/native/domain certification.'}
(P/'author-progress-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k not in ['files','numericWarnings']}));print(json.dumps(nums,ensure_ascii=False));assert not errors
