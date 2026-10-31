"""Reproducible source-bound structural/terminology audit; no runtime writes."""
from pathlib import Path
import collections, copy, gzip, hashlib, json, re
ROOT=Path(__file__).resolve().parents[5]
DATA=ROOT/'src/data/manufacturing'
OUT=Path(__file__).resolve().parent
LOCALES=['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
def load(p):return json.loads(p.read_text())
def sha(s):return hashlib.sha256(s.encode() if isinstance(s,str) else s).hexdigest()
def rel(p):return str(p.relative_to(ROOT))
def dump(name,v):
 text=json.dumps(v,ensure_ascii=False,separators=(',',':'))+'\n'
 if name.endswith('.gz'):(OUT/name).write_bytes(gzip.compress(text.encode(),mtime=0))
 else:(OUT/name).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
patches=load(DATA/'editorial-translations.json')['patches']+load(DATA/'safety-editorial-translations.json')['patches']
term_patch=load(DATA/'term-editorial.json')
source_inputs={}
source_documents={}
def track(p):
 source_inputs[rel(p)]=sha(p.read_bytes())
 if str(p) not in source_documents:source_documents[str(p)]=load(p)
 return source_documents[str(p)]
def find_id(value,identifier,path=''):
 if isinstance(value,dict):
  if value.get('id')==identifier:return path
  for key,child in value.items():
   result=find_id(child,identifier,path+'/'+str(key))
   if result is not None:return result
 elif isinstance(value,list):
  for i,child in enumerate(value):
   result=find_id(child,identifier,path+'/'+str(i))
   if result is not None:return result
 return None
def revised(kind,source,locale,entry):
 entry=copy.deepcopy(entry)
 ps=[p for p in patches if p['kind']==kind and p['entryId']==source['id'] and p['locale']==locale and p['sourceHash']==source['sourceHash']]
 def at(path):
  c=entry
  try:
   for k in path:c=c[k]
   return c
  except (KeyError,IndexError,TypeError):return None
 if entry.get('sourceHash')==source['sourceHash'] and all(at(p['fieldPath'])==p['before'] for p in ps):
  for p in ps:
   c=entry
   for k in p['fieldPath'][:-1]:c=c[k]
   c[p['fieldPath'][-1]]=p['after']
 return entry
lessons=[];questions=[];captions=[]
# Records carry source and exact translation-container paths, never arbitrary similarity links.
def add_lesson(bank,p,source,targets):lessons.append(dict(bank=bank,file=rel(p),sourcePath=find_id(track(p),source['id']),source=source,targets=targets))
def add_question(bank,p,source,targets):questions.append(dict(bank=bank,file=rel(p),sourcePath=find_id(track(p),source['id']),source=source,targets=targets))
coretr={loc:track(DATA/'translations'/f'{loc}.json')['lessons'] for loc in LOCALES}
coreqtr={loc:track(DATA/'translations'/f'questions.{loc}.json')['questions'] for loc in LOCALES}
mocktr=track(DATA/'mock-translations.json')['locales']
ctr={loc:track(DATA/'completion37/translations'/f'{loc}.json') for loc in LOCALES}
for specialty in ['mechanical','electrical','surface']:
 p=DATA/f'{specialty}.json';j=track(p)
 for l in j['lessons']:add_lesson('core',p,l,{loc:(revised('lesson',l,loc,coretr[loc][l['id']]),rel(DATA/'translations'/f'{loc}.json')+f"#/lessons/{l['id']}") for loc in LOCALES if l['id'] in coretr[loc]})
 for check in j['checks']:
  for q in check['questions']:add_question('weekly',p,q,{loc:(revised('weekly',q,loc,coreqtr[loc][q['id']]),rel(DATA/'translations'/f'questions.{loc}.json')+f"#/questions/{q['id']}") for loc in LOCALES if q['id'] in coreqtr[loc]})
 p=DATA/'mocks'/f'{specialty}.json';j=track(p)
 for exam in j['exams']:
  for section in exam['sections'].values():
   for q in section['questions']:add_question('mock',p,q,{loc:(revised('mock',q,loc,mocktr[loc][q['id']]),rel(DATA/'mock-translations.json')+f"#/locales/{loc}/{q['id']}") for loc in LOCALES if q['id'] in mocktr[loc]})
 p=DATA/'completion37'/f'{specialty}.json';j=track(p)
 for l in j['lessons']:add_lesson('completion37',p,l,{loc:(ctr[loc]['lessons'][l['id']],rel(DATA/'completion37/translations'/f'{loc}.json')+f"#/lessons/{l['id']}") for loc in LOCALES if l['id'] in ctr[loc]['lessons']})
 for c in j['checks']:
  for q in c['questions']:add_question('completion37',p,q,{loc:(ctr[loc]['questions'][q['id']],rel(DATA/'completion37/translations'/f'{loc}.json')+f"#/questions/{q['id']}") for loc in LOCALES if q['id'] in ctr[loc]['questions']})
gtr=track(DATA/'source-guide-translations.json')['locales'];p=DATA/'source-guides.json'
for l in track(p)['guides']:add_lesson('guide',p,l,{loc:(revised('guide',l,loc,gtr[loc][l['id']]),rel(DATA/'source-guide-translations.json')+f"#/locales/{loc}/{l['id']}") for loc in LOCALES if l['id'] in gtr[loc]})
rt={loc:track(DATA/'recognition38/locales'/f'{loc}.json')['packs'] for loc in LOCALES}
for p in [DATA/'recognition38'/f'{name}.json' for name in ['mechanical','measurement','materials','processes','finishing']]:
 j=track(p)
 for pack in j.get('packs',[]):
  captions.append(dict(bank='recognition38',id=pack['id'],file=rel(p),sourcePath=find_id(j,pack['id']),canonicalKey='captionJa',source=pack.get('captionJa',''),targets={loc:(rt[loc].get(pack['id'],{}).get('caption'),rel(DATA/'recognition38/locales'/f'{loc}.json')+f"#/packs/{pack['id']}/caption") for loc in LOCALES}))
  for q in pack['questions']:add_question('recognition38',p,q,{loc:(rt[loc][pack['id']]['questions'][q['id']],rel(DATA/'recognition38/locales'/f'{loc}.json')+f"#/packs/{pack['id']}/questions/{q['id']}") for loc in LOCALES if q['id'] in rt[loc].get(pack['id'],{}).get('questions',{})})
for file in ['boolean-practice.json','supplement-practice.json']:
 p=DATA/file;j=track(p)
 for i,q in enumerate(j['questions']):
  targets={}
  for loc in LOCALES:
   entry=j['locales'][loc]
   if isinstance(entry,list):
    val=entry[i];entry={'sourceHash':j['localeSourceHashes'][loc][i],'stem':val[0],'options':val[1],'explanation':val[2]}
   else:entry=entry.get(q['id'])
   if entry is not None:targets[loc]=(entry,rel(p)+f"#/locales/{loc}/"+(str(i) if isinstance(j['locales'][loc],list) else q['id']))
  add_question(file.removesuffix('.json'),p,q,targets)
for filename in ['diagram-translations.json','supplemental-diagram-translations.json']:
 p=DATA/filename;j=track(p)
 for identifier,value in j['locales']['vi'].items():
  captions.append(dict(bank=filename.removesuffix('.json'),id=identifier,file=rel(p),sourcePath=f'/locales/vi/{identifier}',canonicalKey='sourceJa',source=value.get('sourceJa',''),targets={loc:(j['locales'][loc].get(identifier,{}).get('text'),rel(p)+f'#/locales/{loc}/{identifier}/text') for loc in LOCALES}))
# Ensure curated mock assemblies do not count as new question identities.
assert len({r['source']['id'] for r in questions})==len(questions)
issues=[];fields=[];termmap=collections.defaultdict(lambda:dict(glossaryOccurrences=[],assessmentOccurrences=[]))
counts={loc:collections.Counter() for loc in LOCALES}
manual_reviews={}
if (OUT/'semantic-review.json').exists():
 for review in load(OUT/'semantic-review.json')['records']:manual_reviews[(review['locale'],review['targetField'])]=review
def check_field(rec,loc,canonicalpath,targetpath,source,value,kind):
 if rec['bank']=='supplement-practice':
  targetpath=targetpath.replace('/stem','/0').replace('/options','/1').replace('/explanation','/2')
 ident=rec['source']['id'] if 'source' in rec and isinstance(rec['source'],dict) else rec['id']
 status='present' if isinstance(value,str) and bool(value.strip()) else 'missing_or_empty'
 fields.append({'kind':kind,'bank':rec['bank'],'id':ident,'locale':loc,'canonicalField':(rec['file']+'#'+rec['sourcePath']+'/'+canonicalpath) if 'file' in rec else rec['bank']+'#/'+rec['id']+'/'+canonicalpath,'targetField':targetpath,'structuralStatus':status,'newSemanticReview':('manual_AI_compared_to_authored_Japanese' if (loc,targetpath) in manual_reviews and isinstance(value,str) and sha(value)==manual_reviews[(loc,targetpath)]['effectiveBeforeSha256'] else 'not_reviewed')})
 counts[loc][kind+'Fields']+=1
 if status!='present':issues.append(fields[-1])
for rec in lessons:
 l=rec['source'];sid=l['id']
 for loc in LOCALES:
  if loc not in rec['targets']:issues.append({'kind':'missing_lesson','id':sid,'locale':loc});continue
  t,path=rec['targets'][loc];counts[loc][rec['bank']+'LessonRecords']+=1
  if t.get('sourceHash')!=l['sourceHash']:issues.append({'kind':'stale_lesson_hash','id':sid,'locale':loc})
  for source,target in [('titleJa','title'),('objectiveJa','objective'),('activityJa','activity'),('summaryJa','summary')]:check_field(rec,loc,source,path+'/'+target,l.get(source),t.get(target),'lesson')
  if len(l['paragraphs'])!=len(t.get('paragraphs',[])):issues.append({'kind':'paragraph_count','id':sid,'locale':loc})
  for i,para in enumerate(l['paragraphs']):
   tp=t.get('paragraphs',[])[i] if i<len(t.get('paragraphs',[])) else {}
   if tp.get('id')!=para['id']:issues.append({'kind':'paragraph_identity','id':sid,'locale':loc,'index':i})
   for sk,tk in [('titleJa','title'),('textJa','text')]:check_field(rec,loc,f'paragraphs/{i}/{sk}',f'{path}/paragraphs/{i}/{tk}',para.get(sk),tp.get(tk),'lesson')
  for i,safety in enumerate(l.get('safetyJa',[])):check_field(rec,loc,f'safetyJa/{i}',f'{path}/safety/{i}',safety,t.get('safety',[])[i] if i<len(t.get('safety',[])) else None,'lesson')
  if len(t.get('terms',[]))!=len(l['terms']):issues.append({'kind':'term_count','id':sid,'locale':loc})
  for i,term in enumerate(l['terms']):
   tt=t.get('terms',[])[i] if i<len(t.get('terms',[])) else {}
   if tt.get('ja')!=term['ja'] or tt.get('reading')!=term['reading']:issues.append({'kind':'term_identity','id':sid,'locale':loc,'index':i})
   meaning=tt.get('meaning');raw=meaning;applied=False
   if sid==term_patch['lessonId'] and i==term_patch['termIndex'] and l['sourceHash']==term_patch['sourceHash'] and term['meaningJa']==term_patch['wording']['ja']['before'] and loc in term_patch['wording'] and meaning==term_patch['wording'][loc]['before']:
    meaning=term_patch['wording'][loc]['after'];applied=True
   check_field(rec,loc,f'terms/{i}/meaningJa',f'{path}/terms/{i}/meaning',term['meaningJa'],meaning,'term')
   if loc==LOCALES[0]:
    sourceMeaning=term_patch['wording']['ja']['after'] if applied else term['meaningJa']
    termmap[term['ja']]['glossaryOccurrences'].append({'bank':rec['bank'],'lessonId':sid,'termIndex':i,'reading':term['reading'],'meaningJa':sourceMeaning,'sourceHash':l['sourceHash'],'sources':l.get('sources',[]),'sourcesRole':'inherited_lesson_source_pages_not_atomic_term_proof','canonicalPath':rec['file']+'#'+rec['sourcePath']+f'/terms/{i}','targets':{}})
   occ=next(x for x in termmap[term['ja']]['glossaryOccurrences'] if x['lessonId']==sid and x['termIndex']==i)
   occ['targets'][loc]={'meaning':meaning,'fieldPath':f'{path}/terms/{i}/meaning','sha256':sha(meaning) if isinstance(meaning,str) else None,'runtimeTermOverlayApplied':applied}
pattern=re.compile('|'.join(map(re.escape,sorted(termmap,key=len,reverse=True))))
for rec in questions:
 q=rec['source'];sid=q['id']
 for loc in LOCALES:
  if loc not in rec['targets']:issues.append({'kind':'missing_question','id':sid,'locale':loc});continue
  t,path=rec['targets'][loc];counts[loc][rec['bank']+'QuestionRecords']+=1
  if t.get('sourceHash')!=q.get('sourceHash'):issues.append({'kind':'stale_question_hash','id':sid,'locale':loc})
  check_field(rec,loc,'stemJa',path+'/stem',q.get('stemJa'),t.get('stem'),'question')
  if 'explanationJa' in q:check_field(rec,loc,'explanationJa',path+'/explanation',q['explanationJa'],t.get('explanation'),'question')
  for source,target in [('optionsJa','options'),('optionReasonsJa','reasons')]:
   if source not in q:continue
   if len(q.get(source,[]))!=len(t.get(target,[])):issues.append({'kind':'question_array_count','id':sid,'locale':loc,'field':target})
   for i,value in enumerate(q.get(source,[])):check_field(rec,loc,f'{source}/{i}',f'{path}/{target}/{i}',value,t.get(target,[])[i] if i<len(t.get(target,[])) else None,'question')
 for key in ['stemJa','optionsJa','optionReasonsJa','explanationJa']:
  values=q.get(key,[]);values=values if isinstance(values,list) else [values]
  for i,v in enumerate(values):
   for term in set(pattern.findall(v)):
    termmap[term]['assessmentOccurrences'].append({'bank':rec['bank'],'questionId':sid,'canonicalField':rec['file']+'#'+rec['sourcePath']+'/'+key+(f'/{i}' if key not in ['stemJa','explanationJa'] else ''),'targetFields':{loc:path+'/'+({'stemJa':'0','optionsJa':'1','explanationJa':'2'} if rec['bank']=='supplement-practice' else {'stemJa':'stem','optionsJa':'options','optionReasonsJa':'reasons','explanationJa':'explanation'})[key]+(f'/{i}' if key not in ['stemJa','explanationJa'] else '') for loc,(_,path) in rec['targets'].items()},'matchingBasis':'exact_Japanese_term_occurrence_not_translation_semantic_proof'})
for rec in captions:
 for loc in LOCALES:
  value,path=rec['targets'][loc];check_field(rec,loc,rec['canonicalKey'],path,rec['source'],value,'caption')
variant_candidates=[]
for ja,entry in termmap.items():
 senses={x['meaningJa'] for x in entry['glossaryOccurrences']}
 if len(entry['glossaryOccurrences'])>1:variant_candidates.append({'termJa':ja,'occurrences':len(entry['glossaryOccurrences']),'distinctJapaneseDefinitions':len(senses),'disposition':'contextual_review_required_not_automatic_error','lessonIds':[x['lessonId'] for x in entry['glossaryOccurrences']]})
for filename in ['editorial-translations.json','safety-editorial-translations.json','term-editorial.json','editorial-translations.ts','term-editorial.ts','translations.ts','source-guides.ts','mocks.ts']:
 p=DATA/filename;source_inputs[rel(p)]=sha(p.read_bytes())
summary={'schemaVersion':1,'baselineCommit':'26af1fea','priorityLocales':LOCALES,'scope':'Current authored canonical core/guides/completion37/weekly/original mocks/recognition38/caliper/Boolean. Curated assemblies excluded as duplicate question identities. Full text field checks do not certify meaning.','lessonRecords':len(lessons),'questionRecords':len(questions),'captionRecords':len(captions),'recognitionCaptions':sum(x['bank']=='recognition38' for x in captions),'uniqueJapaneseGlossaryTerms':len(termmap),'glossaryOccurrences':sum(len(x['glossaryOccurrences']) for x in termmap.values()),'targetFieldChecks':len(fields),'structuralIssues':len(issues),'countsByLocale':{loc:dict(c) for loc,c in counts.items()},'sourceInputsSha256':source_inputs,'historicReviews':'batch33 reviewed 12216 glossary meanings and supplied421 patches; batch35 safety28 patches. Replayed here only for effective target values, not counted as new semantic reviews.','newFullProseSemanticReviewComplete':False,'nativeReviewed':False,'domainReviewed':False,'humanReviewed':False,'releaseReady':False}
dump('structural-audit.json',summary);dump('structural-issues.json',issues);dump('field-review-ledger.json.gz',fields);dump('terminology-map.json.gz',{'schemaVersion':1,'terms':dict(sorted(termmap.items())),'sameJapaneseTermVariants':variant_candidates,'policy':'Identical Japanese spellings may have context-specific senses; comparison never forces one target phrase across senses. Exact JA question matching establishes a locator only.'})
print(json.dumps({k:v for k,v in summary.items() if k not in ['sourceInputsSha256','countsByLocale']},ensure_ascii=False));print('issues',issues[:10])
