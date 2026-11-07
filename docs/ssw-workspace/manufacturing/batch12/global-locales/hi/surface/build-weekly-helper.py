R=P.resolve().parents[6];J=json.load(open(R/'src/data/manufacturing/surface.json'))['checks'][W-1]['questions'];r={}
assert len(D)==len(J)
for q,(s,o,z) in zip(J,D):
 assert len(o)==len(z)==4
 r[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':s,'options':o,'reasons':z}
(P/f'questions-{(W-1)*12+1:03}-{W*12:03}.json').write_text(json.dumps({'locale':'hi','questions':r},ensure_ascii=False,indent=2)+'\n')
