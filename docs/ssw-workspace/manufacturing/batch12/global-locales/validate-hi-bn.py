import json,pathlib,hashlib,re
P=pathlib.Path(__file__).parent;ROOT=P.parents[4]
lessons={};questions={}
for track in ['mechanical','electrical','surface']:
 c=json.load(open(ROOT/f'src/data/manufacturing/{track}.json'));lessons.update({l['id']:l for l in c['lessons']});questions.update({q['id']:q for w in c['checks'] for q in w['questions']})
 for name in ['new-content.json','gap-content.json']:
  f=ROOT/f'docs/ssw-workspace/manufacturing/batch12/{track}/{name}'
  if f.exists():
   c=json.load(open(f));lessons.update({l['id']:l for l in c['lessons']});questions.update({q['id']:q for w in c.get('checks',[]) for q in w['questions']})
cjk=re.compile(r'[\u3040-\u30ff\u3400-\u9fff]')
captionSources={k:v['sourceJa'] for k,v in json.load(open(ROOT/'src/data/manufacturing/diagram-translations.json'))['locales']['en'].items()}
counts={}
for locale in ['hi','bn']:
 counts[locale]={}
 for track in ['mechanical','electrical','surface']:
  lp=P/locale/track;ll={};qq={}
  for f in lp.glob('lessons-*.json'):
   d=json.load(open(f));assert d['locale']==locale
   for k,t in d['lessons'].items():assert k not in ll;ll[k]=t
  for f in lp.glob('questions-*.json'):
   d=json.load(open(f));assert d['locale']==locale
   for k,t in d['questions'].items():assert k not in qq;qq[k]=t
  for key,t in ll.items():
   j=lessons[key];assert t['sourceHash']==j['sourceHash'];assert t['translatedDirectlyFrom']=='ja';assert not t['nativeReviewed'] and not t['domainReviewed'];assert t['status']=='ai_translated_draft';assert [z['id'] for z in t['paragraphs']]==[z['id'] for z in j['paragraphs']];assert len(t['terms'])==len(j['terms']);assert len(t['safety'])==len(j['safetyJa'])
   for a,b in zip(t['terms'],j['terms']):assert a['ja']==b['ja'] and a['reading']==b['reading']
   texts=[t[k] for k in ['title','objective','activity','summary']]+t['safety']+[z[k] for z in t['paragraphs'] for k in ['title','text']]+[z['meaning'] for z in t['terms']]
   assert all(isinstance(z,str) and z.strip() and not cjk.search(z) for z in texts),key
  for key,t in qq.items():
   j=questions[key];assert t['sourceHash']==j['sourceHash'];assert t['translatedDirectlyFrom']=='ja';assert not t['nativeReviewed'] and not t['domainReviewed'];assert len(t['options'])==len(j['optionsJa'])==len(t['reasons']);assert len(set(t['options']))==len(t['options']);assert all(z and not cjk.search(z) for z in [t['stem']]+t['options']+t['reasons'])
  caps={}
  for f in lp.glob('captions-*.json'):
   d=json.load(open(f));assert d['locale']==locale
   for k,t in d['captions'].items():assert k not in caps;assert t['sourceJa']==captionSources[k];assert t['text'] and not cjk.search(t['text']);caps[k]=t
  counts[locale][track]={'lessons':len(ll),'weeklyQuestions':len(qq),'captions':len(caps),'mocks':0}
checkpoint=P/'hi-bn-checkpoint.json';d=json.load(open(checkpoint));d.update(counts);d['next']='Continuehi mechanical036–042/061–072; finishall3specialties/262lessons456weeklyquestionsandcaptions/mocksafterfinalJAfreeze; thenbn';d['chunkDigests']={str(f.relative_to(P)):hashlib.sha256(f.read_bytes()).hexdigest() for locale in ['hi','bn'] for f in (P/locale).rglob('*.json') if f.name!='terminology.json'};d['authorStructureAndJapaneseResidueCheck']='PASS';checkpoint.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':'PASS','counts':counts},ensure_ascii=False))
