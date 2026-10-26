import json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];source=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());translated=json.loads((P/'lessons.json').read_text())['lessons'];paragraphs={p['textJa']:t['text'] for l in source['lessons'] for p,t in zip(l['paragraphs'],translated[l['id']]['paragraphs'])};exams={e['id']:e for e in json.loads((R/'src/data/manufacturing/mocks/mechanical.json').read_text())['exams']};out={}
def entry(q,stem,options,reasons):return {'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
for f in sorted(P.glob('mock-theory-author-*.json')):
 n=int(f.stem[-2:]);qs=exams[f'mfg1-mechanical-mock-{n:02}']['sections']['theory']['questions'];rows=json.loads(f.read_text());assert len(rows)==len(qs)
 for q,row in zip(qs,rows):
  stem,base=row[:2];c=q['correctIndex'];jp=q['optionReasonsJa'][c];cp=['正しい。','誤り。'][c];assert jp.startswith(cp);jpbase=jp[len(cp):]
  if base is None:base=paragraphs[jpbase]
  reasons=[None,None];reasons[c]=['सही। ','गलत। '][c]+base
  wp=['この文を誤りとする選択は適切でない。','この文を正しいとする選択は適切でない。'][c];wrong=q['optionReasonsJa'][1-c];assert wrong.startswith(wp)
  if len(row)>2:wb=row[2]
  else:assert wrong[len(wp):]==jpbase,q['id'];wb=base
  reasons[1-c]=['यो कथन गलत भन्ने विकल्प उचित होइन। ','यो कथन सही भन्ने विकल्प उचित होइन। '][c]+wb
  out[q['id']]=entry(q,stem,['सही','गलत'],reasons)
for f in sorted(P.glob('mock-practical-author-*.json')):
 n=int(f.stem[-2:]);qs=exams[f'mfg1-mechanical-mock-{n:02}']['sections']['practical']['questions'];rows=json.loads(f.read_text());assert len(rows)==len(qs)
 for q,(stem,options,reasons) in zip(qs,rows):assert len(options)==4 and len(reasons)==4;out[q['id']]=entry(q,stem,options,reasons)
(P/'mocks.json').write_text(json.dumps({'locale':'ne','questions':out},ensure_ascii=False,indent=2)+'\n');print(len(out),hashlib.sha256((P/'mocks.json').read_bytes()).hexdigest())
