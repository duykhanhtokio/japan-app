import json,re,collections
from pathlib import Path
R=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');P=R/'docs/ssw-workspace/manufacturing/batch12/global-locales/bn/mechanical';S=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());M=json.loads((R/'src/data/manufacturing/mocks/mechanical.json').read_text());qm={q['id']:q for c in S['checks']for q in c['questions']};qm.update({q['id']:q for e in M['exams']for sec in e['sections'].values()for q in sec['questions']});issues=[];leaks=[];counts=collections.Counter()
for f in list(P.glob('bn-weekly*.json'))+list(P.glob('bn-mock[0-9][0-9].json')):
 d=json.load(open(f));assert d['locale']=='bn'and d['nativeReviewed']==False and d['domainReviewed']==False
 for id,x in d['questions'].items():
  q=qm[id];counts['mocks'if'-mock-'in id else'weekly']+=1;assert x['sourceHash']==q['sourceHash'];assert len(x['options'])==len(x['reasons'])==len(q['optionsJa']);assert x['translatedDirectlyFrom']=='ja'and x['nativeReviewed']==False and x['domainReviewed']==False and x['status']=='ai_translated_draft'
  for k,j,t in [('stem',q['stemJa'],x['stem'])]+[(key+str(i),a,b)for key,jakey in [('options','optionsJa'),('reasons','optionReasonsJa')]for i,(a,b)in enumerate(zip(q[jakey],x[key]))]:
   assert t.strip();a=re.findall(r'\d+(?:\.\d+)?',j);b=re.findall(r'\d+(?:\.\d+)?',t)
   if collections.Counter(a)!=collections.Counter(b):issues.append([f.name,id,k,a,b,j,t])
   if re.search(r'[\u3040-\u30fa\u30fc-\u30ff\u3400-\u9fff\u0E00-\u0E7F\uAC00-\uD7AF]',t):leaks.append([id,k,t])
print(dict(counts),'numeric',len(issues),'foreign',len(leaks));print(*issues,sep='\n');print(*leaks,sep='\n');(P/'bn-numeric-qa-issues.json').write_text(json.dumps({'issues':issues,'foreignFragments':leaks},ensure_ascii=False,indent=2)+'\n')
