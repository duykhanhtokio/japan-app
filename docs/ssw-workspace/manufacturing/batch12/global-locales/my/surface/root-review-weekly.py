from pathlib import Path
import json,re,hashlib
P=Path(__file__).resolve().parent;R=P.parents[6];SRC={q['id']:q for c in json.loads((R/'src/data/manufacturing/surface.json').read_text())['checks'] for q in c['questions']};out={};issues=[];fields=0
for f in sorted(P.glob('root-weekly-[0-9][0-9].json')):
 for id,t in json.loads(f.read_text())['questions'].items():
  assert id not in out;out[id]=t;q=SRC[id];assert t['sourceHash']==q['sourceHash'] and t['translatedDirectlyFrom']=='ja' and t['nativeReviewed'] is False and t['domainReviewed'] is False;assert len(t['options'])==len(q['optionsJa']) and len(t['reasons'])==len(q['optionReasonsJa'])
  for a,b in zip([q['stemJa']]+q['optionsJa']+q['optionReasonsJa'],[t['stem']]+t['options']+t['reasons']):
   fields+=1
   if not b.strip() or re.search('[\u1780-\u17ff\u0e00-\u0e7f\u0900-\u09ff\u3040-\u30ff\u3400-\u9fff]',b):issues.append([id,'foreign-or-empty',b])
   na=set(re.findall(r'\d+(?:\.\d+)?',a));nb=set(re.findall(r'\d+(?:\.\d+)?',b))
   if na!=nb:issues.append([id,'numeric',sorted(na-nb),sorted(nb-na),a,b])
(P/'questions.json').write_text(json.dumps({'locale':'my','questions':out},ensure_ascii=False,indent=2)+'\n');report={'locale':'my','specialty':'surface','weeklyQuestions':len(out),'fields':fields,'issues':issues,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False};(P/'root-weekly-structural-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
