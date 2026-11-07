from pathlib import Path
import json,hashlib
P=Path(__file__).parent;R=P.parents[5];MEM=json.loads((P/'exact-ja-translation-memory.json').read_text())['entries']
PREFIX={'この文を正しいとする選択は適切でない。':'ការជ្រើសថាប្រយោគនេះត្រូវមិនសមស្រប។ ','この文を誤りとする選択は適切でない。':'ការជ្រើសថាប្រយោគនេះខុសមិនសមស្រប។ ','正しい。':'ត្រូវ។ ','誤り。':'ខុស។ '}
def theory(sp,exam,start,rows):
 Q=json.loads((R/f'src/data/manufacturing/mocks/{sp}.json').read_text())['exams'][exam-1]['sections']['theory']['questions'];out={};proof=[]
 for q,(stem,body) in zip(Q[start-1:start-1+len(rows)],rows):
  rr=[]
  for r in q['optionReasonsJa']:
   pre=next(p for p in PREFIX if r.startswith(p));ja=r[len(pre):]
   if body is None:
    assert ja in MEM,('missingexactbody',q['id'],ja)
    target=MEM[ja]['translation'];proof.append({'questionId':q['id'],'sourceReasonSha256':hashlib.sha256(r.encode()).hexdigest(),'method':'exact_actual_prefix_plus_exact_complete_source_body','completeSourceMatched':True})
   elif isinstance(body,dict):target=body[ja]
   else:target=body
   rr.append(PREFIX[pre]+target)
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':['ត្រូវ','ខុស'],'reasons':rr}
 (P/sp/f'mock{exam:02d}-theory-{start:02d}-{start+len(rows)-1:02d}.json').write_text(json.dumps({'locale':'km','questions':out},ensure_ascii=False,indent=2)+'\n')
 (P/sp/f'mock{exam:02d}-theory-{start:02d}-{start+len(rows)-1:02d}-provenance-qa.json').write_text(json.dumps({'locale':'km','nativeReviewed':False,'domainReviewed':False,'exactCompleteReasonCompositions':proof},ensure_ascii=False,indent=2)+'\n')
 print(sp,exam,start,len(rows))
def practical(sp,exam,start,rows):
 Q=json.loads((R/f'src/data/manufacturing/mocks/{sp}.json').read_text())['exams'][exam-1]['sections']['practical']['questions'];out={}
 for q,a in zip(Q[start-1:start-1+len(rows)],rows):
  assert len(q['optionsJa'])==len(a[1])==len(a[2])
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':a[0],'options':a[1],'reasons':a[2]}
 (P/sp/f'mock{exam:02d}-practical-{start:02d}-{start+len(rows)-1:02d}.json').write_text(json.dumps({'locale':'km','questions':out},ensure_ascii=False,indent=2)+'\n');print(sp,exam,'practical',start,len(rows))
