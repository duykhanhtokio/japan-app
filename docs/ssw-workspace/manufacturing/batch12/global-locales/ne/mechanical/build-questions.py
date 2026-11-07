import json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];source=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());qs={q['id']:q for c in source['checks'] for q in c['questions']};out={}
for f in sorted(P.glob('question-direct-*.json')):
 for id,stem,options,reasons in json.loads(f.read_text()):
  q=qs[id];assert len(options)==len(q['optionsJa']) and len(reasons)==len(q['optionReasonsJa'])
  out[id]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
result={'locale':P.parent.name,'questions':out};(P/'questions.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(len(out))
