import json
from pathlib import Path
ROOT=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');OUT=Path(__file__).parent
M=json.load(open(ROOT/'src/data/manufacturing/mocks/surface.json'))
PREFIX={'この文は正しい。':'ဤဖော်ပြချက်မှန်သည်။ ','この文は誤り。':'ဤဖော်ပြချက်မှားသည်။ ','正しいと判断する。':'မှန်ဟုဆုံးဖြတ်ပါ။ ','誤りとするのは不適切。':'မှားဟုရွေးခြင်းမသင့်။ ','正しいとするのは誤り。':'မှန်ဟုရွေးခြင်းမှားသည်။ ','誤りと判断する。':'မှားဟုဆုံးဖြတ်ပါ။ ','正しい。':'မှန်သည်။ ','誤り。':'မှားသည်။ ','この文を誤りとする選択は適切でない。':'ဤဖော်ပြချက်ကိုမှားရွေးခြင်းမသင့်။ ','この文を正しいとする選択は適切でない。':'ဤဖော်ပြချက်ကိုမှန်ရွေးခြင်းမသင့်။ '}
def split(s):
 for a,b in PREFIX.items():
  if s.startswith(a):return b,s[len(a):]
 return '',s
def write(exam,T,P):
 E=M['exams'][exam-1];o={};assert len(T)==30 and len(P)==10
 for q,(stem,body) in zip(E['sections']['theory']['questions'],T):
  rr=[split(r)for r in q['optionReasonsJa']];assert len(set(b for p,b in rr))==1,(q['id'],rr)
  o[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':['မှန်','မှား'],'reasons':[p+body for p,b in rr]}
 for q,(stem,opts,rs) in zip(E['sections']['practical']['questions'],P):
  assert len(opts)==len(rs)==len(q['optionsJa']);o[q['id']]={'sourceHash':q['sourceHash'],'stem':stem,'options':opts,'reasons':rs}
 for t in o.values():t.update(translatedDirectlyFrom='ja',nativeReviewed=False,domainReviewed=False,status='ai_translated_draft')
 (OUT/f'my-surface-mock-{exam:02}.json').write_text(json.dumps({'locale':'my','questions':o,'nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False},ensure_ascii=False,indent=2)+'\n');print('Authored',exam,len(o))
