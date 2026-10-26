from pathlib import Path
import json,hashlib,re
P=Path(__file__).parent;R=P.resolve().parents[5];S=json.load(open(R/'src/data/manufacturing/source-guides.json'))['guides'];issues=[];counts={};hashes={}
num=lambda s:sorted(re.findall(r'\d+(?:\.\d+)?',s))
for locale in ['hi','bn']:
 p=P/f'{locale}.json';d=json.load(open(p));hashes[locale]=hashlib.sha256(p.read_bytes()).hexdigest();fields=0
 assert d['locale']==locale and len(d['lessons'])==5 and d['nativeReviewed'] is False and d['domainReviewed'] is False and d['independentlyReviewed'] is False
 for s in S:
  t=d['lessons'][s['id']];id=locale+'/'+s['id'];assert t['sourceHash']==s['sourceHash'] and t['translatedDirectlyFrom']=='ja' and t['nativeReviewed'] is False and t['domainReviewed'] is False
  assert len(t['paragraphs'])==len(s['paragraphs']) and len(t['terms'])==len(s['terms']) and len(t['safety'])==len(s['safetyJa'])
  pairs=[(t['title'],s['titleJa'],'title'),(t['objective'],s['objectiveJa'],'objective'),(t['activity'],s['activityJa'],'activity'),(t['summary'],s['summaryJa'],'summary')]
  for a,b in zip(t['paragraphs'],s['paragraphs']):
   assert a['id']==b['id'];pairs.extend([(a['title'],b['titleJa'],a['id']+'/title'),(a['text'],b['textJa'],a['id']+'/text')])
  for a,b in zip(t['terms'],s['terms']):
   assert a['ja']==b['ja'] and a['reading']==b['reading'];pairs.append((a['meaning'],b['meaningJa'],'term/'+b['ja']))
  pairs.extend((a,b,'safety') for a,b in zip(t['safety'],s['safetyJa']))
  for a,b,k in pairs:
   fields+=1
   if not a.strip():issues.append(id+'/'+k+':empty')
   if re.search('[ぁ-ゖァ-ヺ一-鿿]',a):issues.append(id+'/'+k+':Japanese fragment')
   if num(a)!=num(b):issues.append({'id':id,'field':k,'issue':'numeric','ja':num(b),'target':num(a)})
 counts[locale]={'guides':len(d['lessons']),'targetTextFieldsChecked':fields,'uiLabel':d['uiLabel']}
r={'status':'pass' if not issues else 'fail','counts':counts,'issues':issues,'payloadSha256':hashes,'canonicalGuideHashes':{s['id']:s['sourceHash'] for s in S},'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'scope':'AI structural,source-binding,exact numeric-field checks for direct-Japanese Hindi and Bangla drafts;not native/domain certification.'}
(P/'hi-bn-qa.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n');print(r);assert not issues
