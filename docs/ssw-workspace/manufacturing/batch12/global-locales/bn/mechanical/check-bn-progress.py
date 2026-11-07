import json,re,collections,hashlib
from pathlib import Path
root=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');out=root/'docs/ssw-workspace/manufacturing/batch12/global-locales/bn/mechanical';s=json.loads((root/'src/data/manufacturing/mechanical.json').read_text());lm={l['id']:l for l in s['lessons']};errs=[];leaks=[];alll={}
for f in out.glob('*lessons*.json'):
 for id,x in json.loads(f.read_text()).get('lessons',{}).items():
  assert id not in alll;alll[id]=x;l=lm[id];assert x['sourceHash']==l['sourceHash'];assert x['translatedDirectlyFrom']=='ja'and x['nativeReviewed']==False and x['domainReviewed']==False
  assert [p['id']for p in x['paragraphs']]==[p['id']for p in l['paragraphs']];assert [(t['ja'],t['reading'])for t in x['terms']]==[(t['ja'],t['reading'])for t in l['terms']];assert len(x['safety'])==len(l['safetyJa'])
  pairs=[('title',l['titleJa'],x['title']),('obj',l['objectiveJa'],x['objective']),('act',l['activityJa'],x['activity']),('summary',l['summaryJa'],x['summary'])]+[(a['id'],a['textJa'],b['text'])for a,b in zip(l['paragraphs'],x['paragraphs'])]+[('meaning',a['meaningJa'],b['meaning'])for a,b in zip(l['terms'],x['terms'])]+[('safety',a,b)for a,b in zip(l['safetyJa'],x['safety'])]
  for k,ja,bn in pairs:
   assert bn.strip()
   a=re.findall(r'\d+(?:\.\d+)?',ja);b=re.findall(r'\d+(?:\.\d+)?',bn)
   if collections.Counter(a)!=collections.Counter(b):errs.append([f.name,id,k,a,b,ja,bn])
   if re.search(r'[\u3040-\u30fa\u30fc-\u30ff\u3400-\u9fff\u0E00-\u0E7F\uAC00-\uD7AF]',bn):leaks.append([id,k,bn])
print('lessons',len(alll),'numeric issues',len(errs),'foreign fragments',len(leaks))
for x in errs:print('NUM',x)
for x in leaks:print('FOREIGN',x)
