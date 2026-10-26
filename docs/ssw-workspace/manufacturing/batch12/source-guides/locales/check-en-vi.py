from pathlib import Path
import json,re,hashlib
OUT=Path(__file__).parent;ROOT=OUT.parents[5];src=json.loads((ROOT/'src/data/manufacturing/source-guides.json').read_text());issues=[];reports=[]
for locale in ['en','vi']:
 p=OUT/f'{locale}.json';d=json.loads(p.read_text());fields=0
 assert d['locale']==locale and all(d[k] is False for k in ['nativeReviewed','domainReviewed','independentlyReviewed'])
 assert set(d['lessons'])=={s['id'] for s in src['guides']}
 for s in src['guides']:
  t=d['lessons'][s['id']];assert t['sourceHash']==s['sourceHash'] and t['translatedDirectlyFrom']=='ja' and not t['nativeReviewed'] and not t['domainReviewed']
  assert [x['id'] for x in t['paragraphs']]==[x['id'] for x in s['paragraphs']]
  assert [(x['ja'],x['reading']) for x in t['terms']]==[(x['ja'],x['reading']) for x in s['terms']]
  assert len(t['safety'])==len(s['safetyJa'])
  a=[s['titleJa'],s['objectiveJa'],s['activityJa'],s['summaryJa'],*s['safetyJa'],*[v[k] for v in s['paragraphs'] for k in ['titleJa','textJa']],*[v['meaningJa'] for v in s['terms']]]
  b=[t['title'],t['objective'],t['activity'],t['summary'],*t['safety'],*[v[k] for v in t['paragraphs'] for k in ['title','text']],*[v['meaning'] for v in t['terms']]]
  assert len(a)==len(b);fields+=len(b)
  for v in b:assert isinstance(v,str) and v.strip()
  na=set(re.findall(r'\d+(?:\.\d+)?',' '.join(a)));nb=set(re.findall(r'\d+(?:\.\d+)?',' '.join(b)))
  if na!=nb:issues.append([locale,s['id'],'numeric',sorted(na-nb),sorted(nb-na)])
 reports.append({'locale':locale,'lessons':len(d['lessons']),'translatedFields':fields,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
report={'status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'checks':['full field counts','nonempty text','paragraph IDs/order','glossary JA/readings/order','safety counts','current sourceHash','direct JA binding','numeric sets','six source-specific SG values and 4°C manually checked','dated examination eligibility and all final purpose/fairness/monitoring/agency clauses manually checked'],'locales':reports,'issues':issues}
(OUT/'en-vi-completion-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2));assert not issues
