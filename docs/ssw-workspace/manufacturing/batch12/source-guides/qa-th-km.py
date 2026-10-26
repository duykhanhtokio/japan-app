from pathlib import Path
import json,re,hashlib
P=Path(__file__).parent;R=P.parents[4];src=json.loads((R/'src/data/manufacturing/source-guides.json').read_text())['guides'];issues=[];results={}
def nums(s):return sorted(re.findall(r'\d+(?:[.,]\d+)*',s))
for locale in ['th','km']:
 p=P/'locales'/f'{locale}.json';d=json.loads(p.read_text());fields=0
 assert len(d['lessons'])==5
 for s in src:
  e=d['lessons'][s['id']];assert e['sourceHash']==s['sourceHash'];assert e['translatedDirectlyFrom']=='ja'
  assert all(e[k] is False for k in ['nativeReviewed','domainReviewed','independentlyReviewed'])
  assert len(e['paragraphs'])==len(s['paragraphs']);assert len(e['terms'])==len(s['terms']);assert len(e['safety'])==len(s['safetyJa'])
  pairs=[('title',s['titleJa'],e['title']),('objective',s['objectiveJa'],e['objective']),('activity',s['activityJa'],e['activity']),('summary',s['summaryJa'],e['summary'])]
  for a,b in zip(s['paragraphs'],e['paragraphs']):
   assert a['id']==b['id'];pairs += [(a['id']+'.title',a['titleJa'],b['title']),(a['id']+'.text',a['textJa'],b['text'])]
  for a,b in zip(s['terms'],e['terms']):
   assert a['ja']==b['ja'] and a['reading']==b['reading'];pairs.append(('term.'+a['ja'],a['meaningJa'],b['meaning']))
  pairs += [('safety',a,b) for a,b in zip(s['safetyJa'],e['safety'])]
  for k,a,b in pairs:
   fields+=1
   if not b.strip():issues.append([locale,s['id'],k,'empty'])
   if nums(a)!=nums(b):issues.append([locale,s['id'],k,'numeric',nums(a),nums(b)])
   forbidden=r'[\u3040-\u30ff\u3400-\u9fff\u1000-\u109f\u0900-\u09ff]'+(r'|[\u1780-\u17ff]' if locale=='th' else r'|[\u0e00-\u0e7f]')
   if re.search(forbidden,b):issues.append([locale,s['id'],k,'foreign script'])
 results[locale]={'lessons':5,'paragraphs':sum(len(s['paragraphs']) for s in src),'terms':15,'translatedFields':fields,'payloadSha256':hashlib.sha256(p.read_bytes()).hexdigest()}
report={'results':results,'issues':issues,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False}
(P/'qa-th-km.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False));assert not issues
