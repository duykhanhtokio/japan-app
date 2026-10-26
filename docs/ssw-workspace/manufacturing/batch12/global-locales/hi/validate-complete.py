from pathlib import Path
import json,hashlib,re
P=Path(__file__).parent;R=P.resolve().parents[5];D=R/'src/data/manufacturing';B=P.parents[1];issues=[];report={};fields=0;hashes={}
normal=json.load(open(B/'source-binding-normalization.json'));normal.update(json.load(open(B/'mock-source-binding-normalization.json')))
def chk(v,ref,label):
 global fields
 if not isinstance(v,str) or not v.strip():issues.append(label+':empty');return
 fields+=1
 if re.search('[ぁ-ゖァ-ヺ一-鿿]',v):issues.append(label+':Japanese fragment')
for track in ['mechanical','electrical','surface']:
 c=json.load(open(D/f'{track}.json'));L={x['id']:x for x in c['lessons']};W={q['id']:q for x in c['checks'] for q in x['questions']};M={q['id']:q for e in json.load(open(D/'mocks'/f'{track}.json'))['exams'] for s in e['sections'].values() for q in s['questions']};out={k:{} for k in ['lessons','questions','captions']}
 for p in sorted((P/track).glob('*.json')):
  if any(x in p.name for x in ['qa','checkpoint','progress']):continue
  d=json.load(open(p))
  if not isinstance(d,dict):continue
  hashes[str(p.relative_to(R))]=hashlib.sha256(p.read_bytes()).hexdigest()
  for kind in out:out[kind].update(d.get(kind,{}))
 for kind,src in [('lessons',L),('questions',{**W,**M})]:
  entries=out[kind]
  for id,q in src.items():
   if id not in entries:issues.append(id+':missing');continue
   t=entries[id]
   if t.get('sourceHash') not in [q['sourceHash'],normal.get(id,{}).get('from')]:issues.append(id+':binding')
   if t.get('translatedDirectlyFrom')!='ja' or t.get('nativeReviewed') is not False:issues.append(id+':metadata')
   if kind=='lessons':
    for a,b in [('title','titleJa'),('objective','objectiveJa'),('activity','activityJa'),('summary','summaryJa')]:chk(t.get(a),q[b],id+'/'+a)
    if len(t.get('paragraphs',[]))!=len(q['paragraphs']):issues.append(id+':paragraphcount')
    for a,b in zip(t.get('paragraphs',[]),q['paragraphs']):
     if a['id']!=b['id']:issues.append(id+':paragraphid')
     chk(a.get('title'),b['titleJa'],id+'/paragraph/title');chk(a.get('text'),b['textJa'],id+'/paragraph/text')
    if len(t.get('terms',[]))!=len(q['terms']):issues.append(id+':termscount')
    for a,b in zip(t.get('terms',[]),q['terms']):
     if a['ja']!=b['ja'] or a['reading']!=b['reading']:issues.append(id+':termidentity')
     chk(a.get('meaning'),b['meaningJa'],id+'/term')
    if len(t.get('safety',[]))!=len(q['safetyJa']):issues.append(id+':safetycount')
    for a,b in zip(t.get('safety',[]),q['safetyJa']):chk(a,b,id+'/safety')
   else:
    chk(t.get('stem'),q['stemJa'],id+'/stem')
    for a,b in [('options','optionsJa'),('reasons','optionReasonsJa')]:
     if len(t.get(a,[]))!=len(q[b]):issues.append(id+':'+a+'count')
     for x,y in zip(t.get(a,[]),q[b]):chk(x,y,id+'/'+a)
 report[track]={'lessons':len(set(out['lessons'])&set(L)),'weekly':len(set(out['questions'])&set(W)),'mocks':len(set(out['questions'])&set(M)),'captions':len(out['captions'])}
r={'locale':'hi','status':'pass' if not issues else 'fail','counts':report,'targetTextFieldsChecked':fields,'bindingAndStructureIssues':issues,'payloadSha256':hashes,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'scope':'AI structural and source-binding QA; not native/domain certification'}
(P/'complete-qa.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in r.items() if k!='payloadSha256'},ensure_ascii=False,indent=2));assert not issues
