import json,re,hashlib
from pathlib import Path
R=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');P=Path(__file__).parent
S={q['id']:q for e in json.load(open(R/'src/data/manufacturing/mocks/surface.json'))['exams'] for section in e['sections'].values() for q in section['questions']}
T={};files=[]
for f in sorted(P.glob('my-surface-mock-*.json')):
 d=json.loads(f.read_text());assert not(set(T)&set(d['questions']));T.update(d['questions']);files.append({'path':str(f.relative_to(R)),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
assert set(T)==set(S)
errors=[];nums=[];fields=0
for k,t in T.items():
 s=S[k];assert t['sourceHash']==s['sourceHash'];assert t['translatedDirectlyFrom']=='ja'and t['nativeReviewed']is False and t['domainReviewed']is False
 assert len(t['options'])==len(s['optionsJa'])and len(t['reasons'])==len(s['optionReasonsJa'])
 pairs=[(s['stemJa'],t['stem'])]+list(zip(s['optionsJa'],t['options']))+list(zip(s['optionReasonsJa'],t['reasons']))
 for a,b in pairs:
  fields+=1;assert b.strip()
  if re.search(r'[\u3040-\u30fa\u30fc-\u30ff\u4e00-\u9fff\u0e00-\u0e7f\u0900-\u09ff]',b):errors.append({'id':k,'text':b})
  diff=set(re.findall(r'\d+(?:\.\d+)?',a))-set(re.findall(r'\d+(?:\.\d+)?',b))
  if diff:nums.append({'id':k,'missing':sorted(diff),'source':a,'translation':b})
report={'locale':'my','specialty':'surface','scope':'400 mock questions only; weekly owned by another agent','mockQuestions':len(T),'translatedMockFields':fields,'errors':errors,'numericWarnings':nums,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'files':files,'semanticScope':'Full direct Japanese author translation of every stem, option and reason; no independent/native/domain certification.'}
(P/'author-mocks-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k not in ['files','numericWarnings']}));print(json.dumps(nums,ensure_ascii=False));assert not errors
