from pathlib import Path
import json,re,hashlib
P=Path(__file__).parent;R=P.resolve().parents[6];D=R/'src/data/manufacturing';W={q['id']:q for c in json.load(open(D/'surface.json'))['checks'] for q in c['questions']};M={q['id']:q for e in json.load(open(D/'mocks/surface.json'))['exams'] for s in e['sections'].values() for q in s['questions']};T={};hashes={};issues=[];fields=0
for p in sorted(list(P.glob('weekly-[0-9]*.json'))+list(P.glob('mocks-[0-9]*.json'))):
 T.update(json.load(open(p))['questions']);hashes[str(p.relative_to(R))]=hashlib.sha256(p.read_bytes()).hexdigest()
num=lambda s:sorted(re.findall(r'\d+(?:\.\d+)?',s))
for id,q in {**W,**M}.items():
 if id not in T:issues.append(id+':missing');continue
 t=T[id]
 if t.get('sourceHash')!=q['sourceHash']:issues.append(id+':sourceHash')
 if t.get('translatedDirectlyFrom')!='ja' or t.get('nativeReviewed') is not False or t.get('domainReviewed') is not False:issues.append(id+':metadata')
 for a,b in [('stem','stemJa'),('options','optionsJa'),('reasons','optionReasonsJa')]:
  X=t[a] if isinstance(t[a],list) else [t[a]];Y=q[b] if isinstance(q[b],list) else [q[b]]
  if len(X)!=len(Y):issues.append(id+'/'+a+':count')
  for i,(x,y) in enumerate(zip(X,Y)):
   fields+=1
   if not isinstance(x,str) or not x.strip():issues.append(id+'/'+a+':empty')
   if re.search('[ぁ-ゖァ-ヺ一-鿿]',x):issues.append(id+'/'+a+':Japanese')
   if num(x)!=num(y):issues.append({'id':id,'field':a,'index':i,'issue':'numeric','ja':num(y),'ne':num(x)})
r={'status':'pass' if not issues else 'fail','locale':'ne','specialty':'surface','weeklyQuestions':len(set(T)&set(W)),'mockQuestions':len(set(T)&set(M)),'targetTextFieldsChecked':fields,'numericFieldsCompared':fields,'issues':issues,'payloadSha256':hashes,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'scope':'Full direct-Japanese draft fields; structural/source-binding and exact numeric-token QA. No native/domain certification. Lessons and captions owned elsewhere and left untouched.'}
(P/'questions-mocks-complete-qa.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print({k:v for k,v in r.items() if k!='payloadSha256'});assert not issues
