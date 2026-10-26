import json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];source=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());ls={l['id']:l for l in source['lessons']};out={}
for f in sorted(P.glob('lesson-author-*.json')):
 for row in json.loads(f.read_text()):
  l=ls[row['id']];assert len(row['paragraphs'])==len(l['paragraphs']) and len(row['termMeanings'])==len(l['terms']) and len(row['safety'])==len(l['safetyJa'])
  out[l['id']]={'sourceHash':l['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':row['title'],'objective':row['objective'],'paragraphs':[{'id':p['id'],'title':tr[0],'text':tr[1]} for p,tr in zip(l['paragraphs'],row['paragraphs'])],'terms':[{'ja':t['ja'],'reading':t['reading'],'meaning':m} for t,m in zip(l['terms'],row['termMeanings'])],'activity':row['activity'],'safety':row['safety'],'summary':row['summary']}
result={'locale':'ne','lessons':out,'questions':{}};(P/'lessons.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print({'lessons':len(out),'sha256':hashlib.sha256((P/'lessons.json').read_bytes()).hexdigest()})
