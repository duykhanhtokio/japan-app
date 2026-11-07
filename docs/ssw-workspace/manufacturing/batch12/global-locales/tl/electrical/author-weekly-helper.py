from pathlib import Path
import json
OUT=Path(__file__).parent;ROOT=OUT.parents[6]
SOURCE=json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text())['checks']
def emit(week,rows):
 qs=SOURCE[week-1]['questions'];assert len(qs)==len(rows);out={}
 for q,row in zip(qs,rows):
  a=row.split('|');assert len(a)==9,(q['id'],len(a))
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':a[0],'options':a[1:5],'reasons':a[5:]}
 d={'locale':'tl','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'status':'ai_translated_draft','questions':out}
 (OUT/f'weekly-{week:02}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
