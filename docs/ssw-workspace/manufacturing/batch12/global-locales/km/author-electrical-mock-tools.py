from pathlib import Path
import json
P=Path(__file__).parent;R=P.parents[5]
def save(exam,rows):
 Q=json.loads((R/'src/data/manufacturing/mocks/electrical.json').read_text())['exams'][exam-1]['sections']['theory']['questions'];assert len(Q)==len(rows)==30
 D={};prefix={'この文は正しい。':'ប្រយោគនេះត្រូវ។ ','この文は誤り。':'ប្រយោគនេះខុស។ '}
 for q,(stem,reason) in zip(Q,rows):
  rr=[];sourcebodies=[]
  for r in q['optionReasonsJa']:
   pre=next((p for p in prefix if r.startswith(p)),None);body=r[len(pre):]if pre else r;sourcebodies.append(body);rr.append((prefix[pre]if pre else '')+reason)
  assert sourcebodies[0]==sourcebodies[1],q['id']
  assert q['optionsJa']==['正しい','誤り']
  D[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':['ត្រូវ','ខុស'],'reasons':rr}
 (P/f'electrical/mock{exam:02d}-theory.json').write_text(json.dumps({'locale':'km','questions':D},ensure_ascii=False,indent=2)+'\n');print('Khmer electrical',exam,'theory30')
