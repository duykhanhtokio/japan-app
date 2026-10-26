import json,re,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];SRC=json.loads((R/'src/data/manufacturing/surface.json').read_text())
def save(week,rows):
 qs=SRC['checks'][week-1]['questions'];assert len(rows)==len(qs)==12;out={}
 for q,(stem,options,reasons) in zip(qs,rows):
  assert len(options)==len(q['optionsJa']) and len(reasons)==len(q['optionReasonsJa'])
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
 (P/f'root-weekly-{week:02}.json').write_text(json.dumps({'locale':'my','questions':out},ensure_ascii=False,indent=2)+'\n');print('week',week,len(out))
