exec((__import__('pathlib').Path(__file__).parent/'build-helper.py').read_text())
def weekly(week,D):
 C=json.load(open(R/'src/data/manufacturing/surface.json'))['checks'][week-1];assert len(D)==len(C['questions']);out={}
 for q,z in zip(C['questions'],polish(D)):
  stem,options,reasons=z;assert len(options)==len(q['optionsJa']) and len(reasons)==len(options)
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
 (P/f'weekly-{week:02}.json').write_text(json.dumps({'locale':'tl','questions':out},ensure_ascii=False,indent=2)+'\n')
