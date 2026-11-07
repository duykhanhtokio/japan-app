import hashlib
R=P.resolve().parents[6];E=json.load(open(R/f'src/data/manufacturing/mocks/{TRACK}.json'))['exams'][EXAM-1]
C={v['japanese']:v['translation'] for v in json.load(open(P.parent/'exact-ja-field-cache.json'))['entries'].values()}
PREFIX={'正しいと判断する。':'सही मानें। ','誤りとするのは不適切。':'गलत चुनना अनुचित है। ','正しいとするのは誤り。':'सही चुनना गलत है। ','誤りと判断する。':'गलत मानें। ','この文は正しい。':'यह कथन सही है। ','この文は誤り。':'यह कथन गलत है। ','正しい。':'सही। ','誤り。':'गलत। ','この文を誤りとする選択は適切でない。':'इस कथन को गलत चुनना उचित नहीं। ','この文を正しいとする選択は適切でない。':'इस कथन को सही चुनना उचित नहीं। '}
def cached_reason(s):
 p=''
 for a,b in PREFIX.items():
  if s.startswith(a):p=b;s=s[len(a):];break
 if s in C:return p+C[s]
 a=s.split('\n')
 if all(z in C for z in a):return p+'\n'.join(C[z] for z in a)
 return None
out={}
for section,D in [('theory',T),('practical',V)]:
 Q=E['sections'][section]['questions'];assert len(D)==len(Q)
 for i,(q,z) in enumerate(zip(Q,D),1):
  if section=='theory':
   stem,manual=z;opts=['सही','गलत'];reasons=[cached_reason(s) for s in q['optionReasonsJa']]
   if manual is not None:
    reasons=manual if isinstance(manual,list) else [next((v for x,v in PREFIX.items() if s.startswith(x)),'')+manual for s in q['optionReasonsJa']]
  else:stem,opts,reasons=z
  assert all(isinstance(s,str) and s.strip() for s in [stem]+opts+reasons),(section,i)
  out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':stem,'options':opts,'reasons':reasons}
(P/f'mocks-{EXAM:02}.json').write_text(json.dumps({'locale':'hi','questions':out},ensure_ascii=False,indent=2)+'\n')
