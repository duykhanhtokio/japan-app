exec((__import__('pathlib').Path(__file__).parent/'build-helper.py').read_text())
PREFIX={'正しいと判断する。':'Tamang piliin ang tama. ','誤りとするのは不適切。':'Hindi angkop piliin ang mali. ','正しいとするのは誤り。':'Maling piliin ang tama. ','誤りと判断する。':'Tamang piliin ang mali. '}
def mock(n,T,V):
 E=json.load(open(R/'src/data/manufacturing/mocks/surface.json'))['exams'][n-1];out={};T=polish(T);V=polish(V)
 assert len(T)==30 and len(V)==10
 for section,D in [('theory',T),('practical',V)]:
  for q,z in zip(E['sections'][section]['questions'],D):
   if section=='theory':
    stem,reason=z;options=['Tama','Mali'];reasons=[];bodies=[]
    for s in q['optionReasonsJa']:
     a=next((a for a in PREFIX if s.startswith(a)),None);assert a,q['id'];bodies.append(s[len(a):]);reasons.append(PREFIX[a]+reason)
    assert len(set(bodies))==1,q['id']
   else:stem,options,reasons=z
   assert len(options)==len(q['optionsJa']) and len(reasons)==len(options)
   out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
 (P/f'mocks-{n:02}.json').write_text(json.dumps({'locale':'tl','questions':out},ensure_ascii=False,indent=2)+'\n')
