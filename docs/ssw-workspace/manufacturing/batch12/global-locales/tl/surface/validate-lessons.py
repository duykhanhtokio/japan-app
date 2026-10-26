from pathlib import Path
import json,re,hashlib
P=Path(__file__).parent;R=P.resolve().parents[6];S={l['id']:l for l in json.load(open(R/'src/data/manufacturing/surface.json'))['lessons']};T={};hashes={};issues=[];fields=0
for p in sorted(P.glob('lessons-[0-9]*.json')):T.update(json.load(open(p))['lessons']);hashes[str(p.relative_to(R))]=hashlib.sha256(p.read_bytes()).hexdigest()
num=lambda s:sorted(re.findall(r'\d+(?:\.\d+)?',s))
def check(t,s,id,numeric=True):
 global fields
 fields+=1
 if not isinstance(t,str) or not t.strip():issues.append(id+':empty')
 if re.search('[ぁ-ゖァ-ヺ一-鿿]',t):issues.append(id+':Japanese')
 if numeric and num(t)!=num(s):issues.append(id+':numeric')
for id,s in S.items():
 if id not in T:issues.append(id+':missing');continue
 t=T[id]
 assert t['sourceHash']==s['sourceHash'] and t['translatedDirectlyFrom']=='ja' and not t['nativeReviewed'] and not t['domainReviewed']
 assert len(t['paragraphs'])==len(s['paragraphs']) and len(t['terms'])==len(s['terms']) and len(t['safety'])==len(s['safetyJa'])
 for a,b in [('title','titleJa'),('objective','objectiveJa'),('activity','activityJa'),('summary','summaryJa')]:check(t[a],s[b],id+'/'+a,False)
 for a,b in zip(t['paragraphs'],s['paragraphs']):
  assert a['id']==b['id'];check(a['title'],b['titleJa'],id+'/title',False);check(a['text'],b['textJa'],id+'/'+a['id'])
 for a,b in zip(t['terms'],s['terms']):
  assert a['ja']==b['ja'] and a['reading']==b['reading'];check(a['meaning'],b['meaningJa'],id+'/meaning',False)
 for a,b in zip(t['safety'],s['safetyJa']):check(a,b,id+'/safety',False)
r={'status':'pass' if not issues else 'fail','locale':'tl','specialty':'surface','lessons':len(T),'targetTextFields':fields,'issues':issues,'payloadSha256':hashes,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'scope':'Full source-field structural/binding QA, exact paragraph numeric tokens; AI semantic review only, no native/domain certification'}
(P/'lessons-qa.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print({k:v for k,v in r.items() if k!='payloadSha256'});assert not issues
