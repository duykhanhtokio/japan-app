import json,hashlib
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];locale=P.parent.name
d=json.loads((R/'src/data/manufacturing/mocks/electrical.json').read_text());exams={e['id']:e for e in d['exams']};out={}
labels={'ne':['सही','गलत'],'my':['မှန်','မှား']};prefix={'ne':['यो कथन सही हो। ','यो कथन गलत हो। '],'my':['ဤစာသည်မှန်သည်။ ','ဤစာသည်မှားသည်။ ']}
for f in sorted(P.glob('mock-theory-author-*.json')):
 n=int(f.stem[-2:]);e=exams[f'mfg1-electrical-mock-{n:02}'];rows=json.loads(f.read_text());assert len(rows)==30
 for q,(stem,base) in zip(e['sections']['theory']['questions'],rows):
  c=q['correctIndex'];assert q['optionsJa']==['正しい','誤り'];assert q['optionReasonsJa'][1-c]==('この文は正しい。' if c==0 else 'この文は誤り。')+q['optionReasonsJa'][c]
  reasons=[base,base];reasons[1-c]=prefix[locale][c]+base
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':labels[locale],'reasons':reasons}
for f in sorted(P.glob('mock-practical-author-*.json')):
 n=int(f.stem[-2:]);e=exams[f'mfg1-electrical-mock-{n:02}'];rows=json.loads(f.read_text());assert len(rows)==10
 for q,(stem,options,reasons) in zip(e['sections']['practical']['questions'],rows):
  assert len(options)==len(reasons)==4
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':options,'reasons':reasons}
f=P/'mocks.json';f.write_text(json.dumps({'locale':locale,'questions':out},ensure_ascii=False,indent=2)+'\n');print({'questions':len(out),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
