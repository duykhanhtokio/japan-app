from pathlib import Path
import json,hashlib,re
OUT=Path(__file__).parent;ROOT=OUT.parents[6]
SRC=json.loads((ROOT/'src/data/manufacturing/mocks/surface.json').read_text())['exams']
PREFIX={'正しいと判断する。':'বক্তব্যটি সঠিক। ','誤りとするのは不適切。':'«ভুল» নির্বাচন সঙ্গত নয়। ','正しいとするのは誤り。':'«সঠিক» নির্বাচন ভুল। ','誤りと判断する。':'বক্তব্যটি ভুল। '}
def emit(n,kind,rows):
 qs=SRC[n-1]['sections'][kind]['questions'];assert len(rows)==len(qs),(n,kind,len(rows))
 out={}
 for q,row in zip(qs,rows):
  parts=row.split('|')
  if kind=='theory':
   assert len(parts)==2
   bodies=[];reasons=[]
   for s in q['optionReasonsJa']:
    found=[(ja,bn) for ja,bn in PREFIX.items() if s.startswith(ja)];assert len(found)==1
    ja,bn=found[0];bodies.append(s[len(ja):]);reasons.append(bn+parts[1])
   assert bodies[0]==bodies[1],q['id']
   stem=parts[0];options=['সঠিক','ভুল']
  else:
   assert len(parts)==9,(q['id'],len(parts));stem=parts[0];options=parts[1:5];reasons=parts[5:9]
  out[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':options,'reasons':reasons,'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft'}
 payload={'locale':'bn','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'questions':out}
 (OUT/f'mock-{n:02}-{kind}.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
 return out
if __name__=='__main__':print('Import helper; author chunks call emit explicitly')
