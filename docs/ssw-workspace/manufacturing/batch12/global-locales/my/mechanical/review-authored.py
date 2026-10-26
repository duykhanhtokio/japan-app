import json,re,hashlib
from pathlib import Path
P=Path(__file__).parent;R=P.resolve().parents[6];s=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());t=json.loads((P/'lessons.json').read_text())['lessons'];issues=[];fields=0
for l in s['lessons']:
 d=t[l['id']];assert d['sourceHash']==l['sourceHash'];assert d['translatedDirectlyFrom']=='ja' and d['nativeReviewed'] is False and d['domainReviewed'] is False
 pairs=[(l['titleJa'],d['title']),(l['objectiveJa'],d['objective']),(l['activityJa'],d['activity']),(l['summaryJa'],d['summary'])]+list(zip(l['safetyJa'],d['safety']))
 assert len(l['paragraphs'])==len(d['paragraphs']) and len(l['terms'])==len(d['terms'])
 for a,b in zip(l['paragraphs'],d['paragraphs']):assert a['id']==b['id'];pairs.extend([(a['titleJa'],b['title']),(a['textJa'],b['text'])])
 for a,b in zip(l['terms'],d['terms']):assert a['ja']==b['ja'] and a['reading']==b['reading'];pairs.append((a['meaningJa'],b['meaning']))
 for a,b in pairs:
  fields+=1
  if not b.strip() or re.search('[\u3040-\u30ff\u3400-\u9fff]',b):issues.append([l['id'],'empty-or-foreign',b])
  na=set(re.findall(r'\d+(?:\.\d+)?',a));nb=set(re.findall(r'\d+(?:\.\d+)?',b))
  if na!=nb:issues.append([l['id'],'numeric',sorted(na-nb),sorted(nb-na)])
report=dict(locale='my',specialty='mechanical',lessons=len(t),fields=fields,issues=issues,nativeReviewed=False,domainReviewed=False,independentlyReviewed=False,sha256=hashlib.sha256((P/'lessons.json').read_bytes()).hexdigest());(P/'lesson-structural-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
