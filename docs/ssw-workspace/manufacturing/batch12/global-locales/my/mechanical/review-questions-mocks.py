import json,re,hashlib,collections
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];issues=[];counts={};fields=0
S=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());Q={q['id']:q for c in S['checks'] for q in c['questions']};M=json.loads((R/'src/data/manufacturing/mocks/mechanical.json').read_text());MS={q['id']:q for e in M['exams'] for s in e['sections'].values() for q in s['questions']}
for file,src in [('questions.json',Q),('mocks.json',MS)]:
 d=json.loads((P/file).read_text())['questions'];counts[file]=len(d)
 for id,t in d.items():
  q=src[id];assert t['sourceHash']==q['sourceHash'];assert t['translatedDirectlyFrom']=='ja' and t['nativeReviewed'] is False and t['domainReviewed'] is False;assert len(t['options'])==len(q['optionsJa']) and len(t['reasons'])==len(q['optionReasonsJa'])
  for a,b in zip([q['stemJa']]+q['optionsJa']+q['optionReasonsJa'],[t['stem']]+t['options']+t['reasons']):
   fields+=1
   if not b.strip() or re.search('[\u3040-\u30ff\u3400-\u9fff]',b):issues.append([id,'empty-or-foreign',b])
   na=set(re.findall(r'\d+(?:\.\d+)?',a));nb=set(re.findall(r'\d+(?:\.\d+)?',b))
   if na!=nb:issues.append([id,'numeric',sorted(na-nb),sorted(nb-na),a,b])
report={'counts':counts,'fields':fields,'issues':issues,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False};(P/'questions-mocks-structural-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
