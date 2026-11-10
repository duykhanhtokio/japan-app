"""Assemble explicitly authored translations; never translate with a service."""
from pathlib import Path
import json,copy
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/hospitality'
source=next(l for l in json.loads((DATA/'service.json').read_text())['lessons'] if l['id']=='hotel-service-04')
for name in ['service04-locales.json','service04-locales-sea.json']:
 for locale,a in json.loads((Path(__file__).parent/name).read_text()).items():
  t=copy.deepcopy(source)
  for key in ['level','revision','knowledgeIds','estimatedMinutes','review']:t.pop(key,None)
  t.update(sourceRevision=source['revision'],status='translated_ai_unreviewed',title=a['title'])
  for o,text in zip(t['objectives'],a['objectives'],strict=True):o['text']=text
  for s,(title,body) in zip(t['sections'],a['sections'],strict=True):s.update(title=title,body=body)
  for term,text in zip(t['terms'],a['terms'],strict=True):term['meaning']=text
  t['example']={'situation':a['example'][0],'steps':a['example'][1]}
  t['practice']={'prompt':a['practice'][0],'expectedPoints':a['practice'][1]}
  for q,(prompt,choices,explanation) in zip(t['questions'],a['questions'],strict=True):
   q.update(prompt=prompt,choices=choices,explanation=explanation)
  t['illustration'].update(caption=a['caption'],alt=a['alt'])
  p=DATA/'translations'/locale/'service.json'
  d=json.loads(p.read_text()) if p.exists() else {'lessons':[]}
  d['lessons']=[l for l in d['lessons'] if l['id']!=source['id']]+[t]
  p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
  print(locale,t['id'])
