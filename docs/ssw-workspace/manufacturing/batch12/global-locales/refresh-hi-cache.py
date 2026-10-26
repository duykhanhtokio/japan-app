import pathlib,json,hashlib
P=pathlib.Path(__file__).parent;R=P.resolve().parents[4];C={}
def put(j,t):
 k=hashlib.sha256(j.encode()).hexdigest()
 if k not in C:C[k]={'japanese':j,'translation':t}
 elif C[k]['translation']!=t:
  a=C[k].setdefault('equivalentVariants',[])
  if t not in a:a.append(t)
for track in ['mechanical','electrical','surface']:
 S=json.load(open(R/'src/data/manufacturing'/f'{track}.json'));L={x['id']:x for x in S['lessons']};Q={q['id']:q for c in S['checks'] for q in c['questions']}
 for f in (P/'hi'/track).glob('*.json'):
  d=json.load(open(f))
  for k,t in d.get('lessons',{}).items():
   j=L[k]
   for a,b in [('titleJa','title'),('objectiveJa','objective'),('activityJa','activity'),('summaryJa','summary')]:put(j[a],t[b])
   for a,b in zip(j['paragraphs'],t['paragraphs']):put(a['titleJa'],b['title']);put(a['textJa'],b['text'])
   for a,b in zip(j['terms'],t['terms']):put(a['meaningJa'],b['meaning'])
   for a,b in zip(j['safetyJa'],t['safety']):put(a,b)
  for k,t in d.get('questions',{}).items():
   j=Q[k];put(j['stemJa'],t['stem'])
   for a,b in zip(j['optionsJa'],t['options']):put(a,b)
   for a,b in zip(j['optionReasonsJa'],t['reasons']):put(a,b)
  for t in d.get('captions',{}).values():put(t['sourceJa'],t['text'])
(P/'hi'/'exact-ja-field-cache.json').write_text(json.dumps({'locale':'hi','cachePolicy':'Exact Japanese complete field identity only; direct author translations; no approximate or substring summary reuse','entries':C},ensure_ascii=False,indent=2)+'\n')
print('Cached',len(C),'complete Japanese fields')
