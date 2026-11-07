import json,pathlib,hashlib,re
P=pathlib.Path(__file__).parent;ROOT=P.parents[4]
lessons={};questions={};mocks={}
for track in ['mechanical','electrical','surface']:
 m=json.load(open(ROOT/f'src/data/manufacturing/mocks/{track}.json'));mocks.update({q['id']:q for e in m['exams'] for z in e['sections'].values() for q in z['questions']})
 c=json.load(open(ROOT/f'src/data/manufacturing/{track}.json'));lessons.update({l['id']:l for l in c['lessons']});questions.update({q['id']:q for w in c['checks'] for q in w['questions']})
 for name in ['new-content.json','gap-content.json']:
  f=ROOT/f'docs/ssw-workspace/manufacturing/batch12/{track}/{name}'
  if f.exists():
   c=json.load(open(f))
   for l in c['lessons']:lessons.setdefault(l['id'],l)
   for w in c.get('checks',[]):
    for q in w['questions']:questions.setdefault(q['id'],q)
cjk=re.compile(r'[\u3040-\u30ff\u3400-\u9fff]')
captionSources={k:v['sourceJa'] for k,v in json.load(open(ROOT/'src/data/manufacturing/diagram-translations.json'))['locales']['en'].items()}
captionSources.update(json.load(open(ROOT/'docs/ssw-workspace/manufacturing/batch12/new-diagram-captions.json'))['captions'])
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
  mm={}
  for f in lp.glob('mocks-*.json'):
   d=json.load(open(f));assert d['locale']==locale
   for k,t in d['questions'].items():assert k not in mm;mm[k]=t
  for key,t in mm.items():
   j=mocks[key];assert t['sourceHash']==j['sourceHash'];assert t['translatedDirectlyFrom']=='ja';assert not t['nativeReviewed'] and not t['domainReviewed'];assert t['status']=='ai_translated_draft';assert len(t['options'])==len(j['optionsJa'])==len(t['reasons']);assert len(set(t['options']))==len(t['options']);assert all(isinstance(z,str) and z.strip() and not cjk.search(z) for z in [t['stem']]+t['options']+t['reasons']),key
  caps={}
  for f in lp.glob('captions-*.json'):
   d=json.load(open(f));assert d['locale']==locale
   for k,t in d['captions'].items():assert k not in caps;assert t['sourceJa']==captionSources[k];assert t['text'] and not cjk.search(t['text']);caps[k]=t
  counts[locale][track]={'lessons':len(ll),'weeklyQuestions':len(qq),'captions':len(caps),'mocks':len(mm)}
checkpoint=P/'hi-bn-checkpoint.json';d=json.load(open(checkpoint));d.update(counts);d['next']='Hindi curriculum262lessons456weekly18captions draft complete; continue1200Hindi mock items. Bangla lesson/weekly/mocks owned by specialty workers; preserve completed18Bangla captions. All flags AI draft, native/domain review pending.';d['chunkDigests']={str(f.relative_to(P)):hashlib.sha256(f.read_bytes()).hexdigest() for locale in ['hi','bn'] for f in (P/locale).rglob('*.json') if f.name!='terminology.json'};d['authorStructureAndJapaneseResidueCheck']='PASS';checkpoint.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':'PASS','counts':counts},ensure_ascii=False))
