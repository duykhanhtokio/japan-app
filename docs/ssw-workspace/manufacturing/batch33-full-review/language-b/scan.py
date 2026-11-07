from pathlib import Path
import json,re,unicodedata,hashlib,collections
ROOT=Path(__file__).resolve().parents[5];LOCS=['hi','bn','ne','my','km','tl'];D=ROOT/'src/data/manufacturing'
read=lambda p:json.loads((ROOT/p).read_text())
rows=[];inputs={};errors=[]
def load(p):
 inputs[p]=hashlib.sha256((ROOT/p).read_bytes()).hexdigest();return read(p)
def row(loc,kind,id,path,field,ja,target):
 rows.append(dict(locale=loc,kind=kind,id=id,path=path,field=field,ja=ja,target=target))
 if not isinstance(target,str) or not target.strip():errors.append(dict(locale=loc,kind=kind,id=id,field=field,issue='empty_or_nontext'))
def lesson(loc,kind,id,p,l,t):
 if not t:errors.append(dict(locale=loc,kind=kind,id=id,issue='missing'));return
 if t.get('sourceHash')!=l.get('sourceHash'):errors.append(dict(locale=loc,kind=kind,id=id,issue='sourceHash'))
 if t.get('translatedDirectlyFrom')!='ja' or t.get('nativeReviewed') is not False or t.get('domainReviewed') is not False:errors.append(dict(locale=loc,id=id,issue='review_or_source_locale_flags'))
 if [(x['ja'],x['reading']) for x in t['terms']]!=[(x['ja'],x['reading']) for x in l['terms']]:errors.append(dict(locale=loc,id=id,issue='glossary_order_identity'))
 for k in ['title','objective','activity','summary']:row(loc,kind,id,p,k,l[k+'Ja'],t[k])
 if [x['id'] for x in t['paragraphs']]!=[x['id'] for x in l['paragraphs']]:errors.append(dict(locale=loc,id=id,issue='paragraph_ids'))
 for i,(a,b) in enumerate(zip(l['paragraphs'],t['paragraphs'])):
  row(loc,kind,id,p,f'paragraphs/{i}/title',a['titleJa'],b['title']);row(loc,kind,id,p,f'paragraphs/{i}/text',a['textJa'],b['text'])
 for i,(a,b) in enumerate(zip(l['terms'],t['terms'])):row(loc,kind,id,p,f'terms/{i}/meaning',a['meaningJa'],b['meaning'])
 for i,(a,b) in enumerate(zip(l['safetyJa'],t['safety'])):row(loc,kind,id,p,f'safety/{i}',a,b)
 if len(l['terms'])!=len(t['terms']) or len(l['safetyJa'])!=len(t['safety']):errors.append(dict(locale=loc,id=id,issue='length'))
def question(loc,kind,id,p,q,t):
 if not t:errors.append(dict(locale=loc,kind=kind,id=id,issue='missing'));return
 if t.get('sourceHash')!=q.get('sourceHash'):errors.append(dict(locale=loc,kind=kind,id=id,issue='sourceHash'))
 if t.get('translatedDirectlyFrom')!='ja' or t.get('nativeReviewed') is not False or t.get('domainReviewed') is not False:errors.append(dict(locale=loc,id=id,issue='review_or_source_locale_flags'))
 row(loc,kind,id,p,'stem',q['stemJa'],t['stem'])
 for k,a in [('options','optionsJa'),('reasons','optionReasonsJa')]:
  if len(t[k])!=len(q[a]):errors.append(dict(locale=loc,id=id,issue=k+'_length'))
  for i,(x,y) in enumerate(zip(q[a],t[k])):row(loc,kind,id,p,f'{k}/{i}',x,y)
core={s:load(f'src/data/manufacturing/{s}.json') for s in ['mechanical','electrical','surface']}
guides=load('src/data/manufacturing/source-guides.json')['guides'];gt=load('src/data/manufacturing/source-guide-translations.json')['locales']
mocks={s:load(f'src/data/manufacturing/mocks/{s}.json') for s in core};mt=load('src/data/manufacturing/mock-translations.json')['locales'];captions=load('src/data/manufacturing/diagram-translations.json')['locales'];supp=load('src/data/manufacturing/supplement-practice.json')
for loc in LOCS:
 p=f'src/data/manufacturing/translations/{loc}.json';tl=load(p)['lessons'];qp=f'src/data/manufacturing/translations/questions.{loc}.json';tq=load(qp)['questions']
 for course in core.values():
  for l in course['lessons']:lesson(loc,'lesson',l['id'],p,l,tl.get(l['id']))
  for e in course['checks']:
   for q in e['questions']:question(loc,'weekly',q['id'],qp,q,tq.get(q['id']))
 for g in guides:lesson(loc,'guide',g['id'],'src/data/manufacturing/source-guide-translations.json',g,gt[loc].get(g['id']))
 seen=set()
 for m in mocks.values():
  for e in m['exams']:
   for section in e['sections'].values():
    for q in section['questions']:
     if q['id'] not in seen:seen.add(q['id']);question(loc,'mock',q['id'],'src/data/manufacturing/mock-translations.json',q,mt[loc].get(q['id']))
 for id,c in captions[loc].items():row(loc,'caption',id,'src/data/manufacturing/diagram-translations.json','text',c['sourceJa'],c['text'])
 for p in ['src/data/manufacturing/ui-translations.json','src/data/manufacturing/mock-ui-translations.json']:
  ui=load(p)['locales']
  for key,x in ui['ja'].items():row(loc,'ui',key,p,key,x,ui[loc][key])
 row(loc,'ui','sourceGuideLabel','src/data/manufacturing/source-guide-translations.json',f'uiLabels/{loc}',load('src/data/manufacturing/source-guide-translations.json')['uiLabels']['ja'],load('src/data/manufacturing/source-guide-translations.json')['uiLabels'][loc])
 for j,ja in enumerate(['正解です。','この選択肢は適切ではありません。']):row(loc,'ui','supplementReasonPrefix'+str(j),'src/data/manufacturing/supplement-practice.json',f'reasonPrefixes/{loc}/{j}',ja,supp['reasonPrefixes'][loc][j])
 for i,q in enumerate(supp['questions']):
  x=supp['locales'][loc][i];row(loc,'supplement',q['id'],'src/data/manufacturing/supplement-practice.json',f'locales/{loc}/{i}/0',q['stemJa'],x[0]);row(loc,'supplement',q['id'],'src/data/manufacturing/supplement-practice.json',f'locales/{loc}/{i}/2',q['explanationJa'],x[2])
  for j,(a,b) in enumerate(zip(q['optionsJa'],x[1])):row(loc,'supplement',q['id'],'src/data/manufacturing/supplement-practice.json',f'locales/{loc}/{i}/1/{j}',a,b)
def nums(t):
 t=unicodedata.normalize('NFKC',t);t=''.join(str(unicodedata.digit(c)) if c.isdigit() else c for c in t)
 return collections.Counter(re.findall(r'\d+(?:\.\d+)?',t))
flags=[]
for r in rows:
 if nums(r['ja'])!=nums(r['target']):flags.append({**r,'sourceNumbers':dict(nums(r['ja'])),'targetNumbers':dict(nums(r['target']))})
Path('/tmp/mfg33-language-b/all-fields.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
Path('/tmp/mfg33-language-b/number-flags.json').write_text(json.dumps(flags,ensure_ascii=False,indent=2))
summary={'locales':LOCS,'fieldsScanned':len(rows),'entriesByLocaleKind':{loc:{kind:len({(r['path'],r['id']) for r in rows if r['locale']==loc and r['kind']==kind}) for kind in sorted({r['kind'] for r in rows})} for loc in LOCS},'structuralErrors':errors,'numericCandidateFields':len(flags),'inputsSha256':inputs}
Path('/tmp/mfg33-language-b/structural-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in summary.items() if k!='inputsSha256'},ensure_ascii=False))

