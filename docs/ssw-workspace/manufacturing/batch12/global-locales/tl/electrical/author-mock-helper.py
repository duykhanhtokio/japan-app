from pathlib import Path
import json
OUT=Path(__file__).parent;ROOT=OUT.parents[6]
SOURCE=json.loads((ROOT/'src/data/manufacturing/mocks/electrical.json').read_text())['exams']
PREF={'この文は正しい。':'Tama ang pahayag na ito. ','この文は誤り。':'Mali ang pahayag na ito. '}
def emit(n,section,rows):
 qs=SOURCE[n-1]['sections'][section]['questions'];assert len(rows)==len(qs);out={}
 for q,row in zip(qs,rows):
  a=row.split('|')
  if section=='theory':
   assert len(a)==2;stem,body=a;options=['Tama','Mali'];reasons=[];ja=[]
   for text in q['optionReasonsJa']:
    prefix='';rem=text
    for k,v in PREF.items():
     if text.startswith(k):prefix=v;rem=text[len(k):];break
    ja.append(rem);reasons.append(prefix+body)
   assert ja[0]==ja[1],q['id']
  else:assert len(a)==9;stem=a[0];options=a[1:5];reasons=a[5:]
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
 d={'locale':'tl','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'status':'ai_translated_draft','questions':out}
 (OUT/f'mock-{n:02}-{section}.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
