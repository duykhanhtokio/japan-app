import json,hashlib,re,collections,unicodedata
from pathlib import Path
B=Path(__file__).resolve().parents[2];C=B.parent/'canonical-ja.service1.json';P=B/'my/service1.json';s=json.loads(C.read_text())['items'];d=json.loads(P.read_text());sha=lambda x:hashlib.sha256(x).hexdigest();assert d['canonicalSha256']==sha(C.read_bytes());assert set(s)==set(d['items']);count=0;numeric=[];jp=[]
def nums(x):return collections.Counter(re.findall(r'[-−]?\d+(?:[,.]\d+)*',unicodedata.normalize('NFKC',x)))
for k,v in s.items():
 t=d['items'][k];assert v['sourceHash']==t['sourceHash']
 if v['kind'] in ['section','reference']:pairs=[('titleJa','title'),('textJa','text')]
 elif v['kind']=='term':pairs=[('termJa','title'),('explanationJa','text')]
 elif v['kind']=='figure':pairs=[('captionJa','caption'),('altJa','alt')]
 else:
  assert len(t['options'])==len(set(t['options']))==4 and len(t['reasons'])==4
  pairs=[('stemJa','stem'),('objectiveJa','objective'),('explanationJa','explanation')]+[(f'optionsJa.{i}',f'options.{i}') for i in range(4)]+[(f'optionReasonsJa.{i}',f'reasons.{i}') for i in range(4)]
 def get(x,f):
  a=f.split('.');return x[a[0]][int(a[1])] if len(a)==2 else x[f]
 for sf,tf in pairs:
  ja,my=get(v,sf),get(t,tf);assert my.strip() and ja!=my;assert re.search(r'[\u1000-\u109f]',my),(k,tf);count+=1
  if nums(ja)!=nums(my):numeric.append(dict(id=k,field=tf,ja=ja,target=my,sourceTokens=dict(nums(ja)),targetTokens=dict(nums(my))))
  if re.search(r'[\u3040-\u30ff\u3400-\u9fff]',my):jp.append(dict(id=k,field=tf))
assert jp==[{'id':'rst31-service1-a009','field':'text'},{'id':'rst31-service1-a010','field':'text'},{'id':'rst31-service1-a014','field':'text'}],jp
r=dict(status='PASS_STRUCTURAL',locale='my',shard='service1',items=99,translatedFields=count,canonicalSha256=sha(C.read_bytes()),targetSha256=sha(P.read_bytes()),numericDifferences=numeric,retainedJapaneseLearningObjects=jp,nativeReviewed=False,domainReviewed=False)
(Path(__file__).parent/'validation.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print('PASS',count,'fields;',len(numeric),'numeric flags')
for x in numeric:print(x['id'],x['field'],x['sourceTokens'],x['targetTokens'])
