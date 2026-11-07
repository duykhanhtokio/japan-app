from pathlib import Path
import json,re
P=Path(__file__).parent;R=P.resolve().parents[6]
PREFIX={'正しいと判断する。':'सही ठहर गर्नुहोस्। ','誤りとするのは不適切。':'गलत ठहर गर्नु उपयुक्त छैन। ','正しいとするのは誤り。':'सही ठहर गर्नु गलत हो। ','誤りと判断する。':'गलत ठहर गर्नुहोस्। '}
def polish(x):
 if isinstance(x,str):
  x=re.sub(r',(?=[A-Za-z\u0900-\u097f])',', ',x)
  x=re.sub(r'(?<=[A-Za-z0-9%Ω²³⁶])(?=[\u0900-\u097f])',' ',x)
  x=re.sub(r'(?<=[\u0900-\u097f])(?=[A-Za-z0-9])',' ',x)
  return x
 if isinstance(x,list):return [polish(v) for v in x]
 if isinstance(x,tuple):return tuple(polish(v) for v in x)
 return x
def weekly(n,D):
 D=polish(D)
 Q=json.load(open(R/'src/data/manufacturing/surface.json'))['checks'][n-1]['questions'];assert len(Q)==len(D);out={}
 for q,(stem,options,reasons) in zip(Q,D):
  assert len(options)==len(q['optionsJa']) and len(reasons)==len(options)
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
 (P/f'weekly-{n:02}.json').write_text(json.dumps({'locale':'ne','questions':out},ensure_ascii=False,indent=2)+'\n')
def mock(n,T,V):
 T=polish(T);V=polish(V)
 E=json.load(open(R/'src/data/manufacturing/mocks/surface.json'))['exams'][n-1];assert len(T)==30 and len(V)==10;out={}
 for section,D in [('theory',T),('practical',V)]:
  for q,z in zip(E['sections'][section]['questions'],D):
   if section=='theory':
    stem,body=z;options=['सही','गलत'];reasons=[];bodies=[]
    for s in q['optionReasonsJa']:
     prefix=next((a for a in PREFIX if s.startswith(a)),None);assert prefix,q['id'];bodies.append(s[len(prefix):]);reasons.append(PREFIX[prefix]+body)
    assert len(set(bodies))==1,q['id']
   else:stem,options,reasons=z
   assert len(options)==len(q['optionsJa']) and len(reasons)==len(options)
   out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
 (P/f'mocks-{n:02}.json').write_text(json.dumps({'locale':'ne','questions':out},ensure_ascii=False,indent=2)+'\n')
