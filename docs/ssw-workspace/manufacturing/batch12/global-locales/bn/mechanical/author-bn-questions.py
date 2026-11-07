import json
from pathlib import Path
ROOT=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');OUT=ROOT/'docs/ssw-workspace/manufacturing/batch12/global-locales/bn/mechanical';S=json.loads((ROOT/'src/data/manufacturing/mechanical.json').read_text());QS=[q for c in S['checks']for q in c['questions']]
def saveq(start,rows):
 d={}
 for q,(stem,opts,reasons)in zip(QS[start-1:],rows):
  assert len(opts)==len(reasons)==len(q['optionsJa']);d[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'stem':stem,'options':opts,'reasons':reasons}
 (OUT/f'bn-weekly{start:03d}-{start+len(rows)-1:03d}.json').write_text(json.dumps({'locale':'bn','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'questions':d},ensure_ascii=False,indent=2)+'\n')
