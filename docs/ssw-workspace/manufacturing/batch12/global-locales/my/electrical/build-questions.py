import json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6]
d=json.loads((R/'src/data/manufacturing/electrical.json').read_text());qs={q['id']:q for e in d['checks'] for q in e['questions']};bank=(R/'docs/ssw-workspace/manufacturing/batch12/electrical/gap-question-bank.txt').read_text().splitlines();out={}
for f in sorted(P.glob('question-author-week*.json')):
 wn=int(f.stem[-2:]);rows=json.loads(f.read_text());assert len(rows)==12
 for i,(stem,options,reasons) in enumerate(rows,1):
  qid=f'mfg1-electrical-weekly-{wn:02d}-q{i:02d}';q=qs[qid];old=bank[(wn-13)*12+i-1].split('|')[2:6];indices=[old.index(o) for o in q['optionsJa']]
  assert len(options)==len(reasons)==4
  out[qid]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':[options[j] for j in indices],'reasons':[reasons[j] for j in indices]}
for f in sorted(P.glob('question-direct-*.json')):
 for qid,stem,options,reasons in json.loads(f.read_text()):
  q=qs[qid]; assert len(options)==len(reasons)==len(q['optionsJa'])
  assert qid not in out
  out[qid]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
(P/'questions.json').write_text(json.dumps({'locale':'my','questions':out},ensure_ascii=False,indent=2)+'\n');print({'questions':len(out),'sha256':hashlib.sha256((P/'questions.json').read_bytes()).hexdigest()})
