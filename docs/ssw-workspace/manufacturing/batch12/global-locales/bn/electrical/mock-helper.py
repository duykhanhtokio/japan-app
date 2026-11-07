import json
from pathlib import Path
ROOT=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');OUT=Path(__file__).parent
M=json.load(open(ROOT/'src/data/manufacturing/mocks/electrical.json'))
PREFIX={'この文は正しい。':'এই বক্তব্য সঠিক। ','この文は誤り。':'এই বক্তব্য ভুল। ','正しいと判断する。':'সঠিক বলে বিচার করুন। ','誤りとするのは不適切。':'ভুল বলা অনুপযুক্ত। ','正しいとするのは誤り。':'সঠিক বলা ভুল। ','誤りと判断する。':'ভুল বলে বিচার করুন। ','正しい。':'সঠিক। ','誤り。':'ভুল। ','この文を誤りとする選択は適切でない。':'এই বক্তব্যকে ভুল বাছা উপযুক্ত নয়। ','この文を正しいとする選択は適切でない。':'এই বক্তব্যকে সঠিক বাছা উপযুক্ত নয়। '}
def split(s):
 for a,b in PREFIX.items():
  if s.startswith(a):return b,s[len(a):]
 return '',s
def write(exam,T,P):
 E=M['exams'][exam-1];o={};assert len(T)==30 and len(P)==10
 for q,(stem,body) in zip(E['sections']['theory']['questions'],T):
  rr=[split(r)for r in q['optionReasonsJa']];assert len(set(b for p,b in rr))==1,(q['id'],rr)
  o[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':['সঠিক','ভুল'],'reasons':[p+body for p,b in rr]}
 for q,(stem,opts,rs) in zip(E['sections']['practical']['questions'],P):
  assert len(opts)==len(rs)==len(q['optionsJa']);o[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':opts,'reasons':rs}
 for t in o.values():t.update(translatedDirectlyFrom='ja',nativeReviewed=False,domainReviewed=False,status='ai_translated_draft')
 (OUT/f'bn-electrical-mock-{exam:02}.json').write_text(json.dumps({'locale':'bn','questions':o,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False},ensure_ascii=False,indent=2)+'\n');print('Authored',exam,len(o))
