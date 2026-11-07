from pathlib import Path
import json,re,hashlib,subprocess
P=Path(__file__).parent;R=P.resolve().parents[6];D=R/'src/data/manufacturing';C=json.load(open(D/'surface.json'));W={q['id']:q for c in C['checks'] for q in c['questions']};M={q['id']:q for e in json.load(open(D/'mocks/surface.json'))['exams'] for s in e['sections'].values() for q in s['questions']};T={};hashes={};issues=[];fields=0
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
   if num(x)!=num(y):issues.append(id+'/'+a+str(i)+':numbers')
subprocess.run(['python',str(P/'validate-lessons.py')],check=True)
L=json.load(open(P/'lessons-qa.json'));hashes.update(L['payloadSha256'])
r={'status':'pass' if not issues else 'fail','locale':'tl','specialty':'surface','lessons':L['lessons'],'weeklyQuestions':len(set(T)&set(W)),'mockQuestions':len(set(T)&set(M)),'targetTextFieldsChecked':fields+L['targetTextFields'],'questionNumericFieldsCompared':fields,'issues':issues,'payloadSha256':hashes,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'scope':'AI full-field semantic drafting and structural/source-binding QA; exact numeric tokens for every question field and every lesson paragraph. No native/domain certification. Captions owned elsewhere and left untouched.'}
(P/'complete-qa.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print({k:v for k,v in r.items() if k!='payloadSha256'});assert not issues
