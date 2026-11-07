"""Exact reversible reference-guide layer; all validation precedes runtime writes."""
from pathlib import Path
from copy import deepcopy
import hashlib,json,re,runpy,tempfile,os
ROOT=Path(__file__).resolve().parents[2]
STAGE='docs/ssw-workspace/manufacturing/batch26/'
SOURCE='src/data/manufacturing/source-guides.json'
TARGETS='src/data/manufacturing/source-guide-translations.json'
COURSE='src/data/manufacturing/course-manifest.json'
APPROVAL=STAGE+'integration/approved-extension.json'
LOCALES=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
EXPECTED_IDS={'mechanical': 'mfg1-mechanical-source-guide-arc-diameter-condition', 'electrical': 'mfg1-electrical-source-guide-resistance-methods', 'surface': 'mfg1-surface-source-guide-electrode-reactions'}
SPECIALTIES=['mechanical','electrical','surface']
AUTHORITIES={'docs/ssw-workspace/manufacturing/source-qa-report.json': 'cdcaad94616076c7cc3f5503cc7eeea8e78e30ae1426c84f59168996ac97b0e0', 'docs/ssw-workspace/manufacturing/knowledge-matrix.json': '66a76372f4392fb4a0bde8bf463c13667af318a55951b4f1267f9ca123f951b1', 'docs/ssw-workspace/manufacturing/batch25/mechanical-source-review.json': 'd1e8dbbaa0b09a32ae652b3a9e1a0f458864064e9fcbecccf6f92d38e2ba0736', 'docs/ssw-workspace/manufacturing/batch25/electrical-source-review.json': '41f39a7d2a10e84ef90cc87ca6cc2f072147593b5163b72fe6b4daee37d1d202', 'docs/ssw-workspace/manufacturing/batch25/surface-source-review.json': '8675002c9cb8866f601a4acd84f80c89036e3040b1b16b5c28e891563903a908'}
BASES={SOURCE:('base-source-guides.json','3a23218035bc264fc737aab35abdfffc0d4971c9f262b6ad8b35d9b22e48e393'),TARGETS:('base-source-guide-translations.json','ea901c5f14158fdc911124d1b7f87485fed85f4fa83210370771a4ac34996f10'),COURSE:('base-course-manifest.json','bb69b66745b33cd40fdf3f318996bf32cbede06fdc39c76761e0aaae5f941c0a')}
SREVIEW=STAGE+'source-independent-review.json'
TREVIEW=STAGE+'translation-independent-review.json'
SOURCE_QA='docs/ssw-workspace/manufacturing/source-qa-report.json'
MATRIX='docs/ssw-workspace/manufacturing/knowledge-matrix.json'
AUTHORITIES['docs/ssw-workspace/manufacturing/batch25/independent-source-review.json']='e1bf5f36c413a156bf2b3d7d08a5bf0d11fc08a4e0e6fd1bc5a7163d4dd20b39'
def require(v,msg):
 if not v:raise ValueError(msg)
def encoded(v):return (json.dumps(v,ensure_ascii=False,indent=2)+'\n').encode()
def digest(b):return hashlib.sha256(b).hexdigest()
def object_digest(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def safe(p):
 require(isinstance(p,str) and p.startswith(STAGE) and '..' not in Path(p).parts and not Path(p).is_absolute(),'Unsafe26inputpath');return p
def load_inputs():
 paths=[APPROVAL,SREVIEW,TREVIEW,SOURCE_QA,MATRIX]+[STAGE+s+suffix for s in SPECIALTIES for suffix in ['-guide.json','-guide-translations.json']]+[STAGE+'integration/'+v[0] for v in BASES.values()]
 paths+=list(AUTHORITIES)+['src/data/manufacturing/'+s+'.json' for s in SPECIALTIES]
 return {p:(ROOT/p).read_bytes() for p in paths}
def flags(v,label):
 for k in ['nativeReviewed','domainReviewed','releaseReady']:require(v.get(k) is False,'Unsupported26certification:'+label+'/'+k)
def compile_outputs(inputs):
 read=lambda p:json.loads(inputs[p])
 for p,h in AUTHORITIES.items():require(digest(inputs[p])==h,'Historical26authoritydrift:'+p)
 approval=read(APPROVAL);require(approval['schemaVersion']==1 and approval['batch']==26,'Approval26identity');flags(approval,'approval')
 stagepaths={STAGE+s+x for s in SPECIALTIES for x in ['-guide.json','-guide-translations.json']}
 require(set(approval['inputs'])==stagepaths,'Exact6guideinputsrequired')
 for p,h in approval['inputs'].items():require(digest(inputs[safe(p)])==h,'Stale26input:'+p)
 for p in [SREVIEW,TREVIEW,SOURCE_QA,MATRIX]:require(approval['evidenceSha256'][p]==digest(inputs[p]),'Stale26evidence:'+p)
 require(set(approval['evidenceSha256'])=={SREVIEW,TREVIEW,SOURCE_QA,MATRIX},'Exact26evidencepaths')
 base={}
 for p,(name,h) in BASES.items():
  raw=inputs[STAGE+'integration/'+name];require(digest(raw)==h,'Historical8snapshotdrift');base[p]=json.loads(raw)
 source=deepcopy(base[SOURCE]);targets=deepcopy(base[TARGETS]);course=deepcopy(base[COURSE]);require(len(source['guides'])==8,'Historical8guidecount')
 qa={s['specialty']:s for s in read(SOURCE_QA)['sources']};knowledge={k['id']:k for k in read(MATRIX)['knowledge']}
 sr=read(SREVIEW);tr=read(TREVIEW)
 require(sr['independentAIComparisonPerformed'] is True and not sr['requiredCorrections'],'Unresolved26sourcereview')
 require(tr['independentAiCompared'] is True and tr['semanticTranslationReviewPerformed'] is True and not tr['unresolvedRequiredFindings'],'Unresolved26targetreview')
 require(tr['counts']=={'guides':3,'localesPerGuide':12,'guideLocalePairs':36,'translatedProseFieldPairsCompared':468},'Target26reviewcounts')
 require(sr['evidenceFiles']=={p:h for p,h in AUTHORITIES.items() if '/batch25/' in p},'Source26historicalevidence')
 for r in [sr,tr]:flags(r,'independentreview');require(r['status']=='pass_scoped_ai_comparison','Missing26independentpass')
 guidefiles={STAGE+s+'-guide.json':approval['inputs'][STAGE+s+'-guide.json'] for s in SPECIALTIES}
 targetfiles={STAGE+s+'-guide-translations.json':approval['inputs'][STAGE+s+'-guide-translations.json'] for s in SPECIALTIES}
 require(sr['guideFiles']==tr['guideFiles']==guidefiles,'Guide review rawbindings');require(tr['translationFiles']==targetfiles,'Targetreviewrawbindings')
 source_reviews={r['guideId']:r for r in sr['guides']};require(len(source_reviews)==len(sr['guides'])==3,'Exact3sourcereviews')
 target_reviews={(r['guideId'],r['locale']):r for r in tr['items']};require(len(target_reviews)==len(tr['items'])==36,'Exact36targetreviews')
 existing={g['id'] for g in source['guides']};newids=set()
 for specialty in SPECIALTIES:
  g=read(STAGE+specialty+'-guide.json');identifier=g['id'];require(identifier==approval['guideIds'][specialty]==EXPECTED_IDS[specialty] and identifier not in existing|newids and g['specialty']==specialty,'Guide26identity');require(g.get('nativeReviewed') is False and g.get('domainReviewed') is False and g.get('releaseReady',False) is False,'Guide26certification')
  require(g['sourceHash']==object_digest({k:v for k,v in g.items() if k!='sourceHash'}),'Guide26sourcehash')
  r=source_reviews.get(identifier);require(r and r['sourceHash']==g['sourceHash'] and r['guideSha256']==object_digest(g) and r['verdict']=='pass_scoped_ai_comparison' and not r['requiredCorrections'],'Unreviewed26guide')
  require(g['knowledgeIds'] and all(k in knowledge and knowledge[k]['sourceId']=='mfg1-'+specialty+'-source' for k in g['knowledgeIds']),'Guide26knowledge')
  require({r['pdfPage'] for r in g['sources']}=={'mechanical':{97},'electrical':{151},'surface':{175,176}}[specialty],'Guide26exactpages')
  require(g['sources'] and g['paragraphs'] and g['terms'] and g['safetyJa'],'Guide26structure')
  require(len({p['id'] for p in g['paragraphs']})==len(g['paragraphs']),'Duplicate26paragraphs')
  require(g['estimatedMinutes']>0 and g['durationBasis']=='target_with_activities_not_measured','Guide26duration')
  for ref in g['sources']:
   info=qa[specialty];require(ref['documentId']=='mfg1-'+specialty+'-source' and type(ref['pdfPage']) is int and 1<=ref['pdfPage']<=info['pdfPages'] and ref['pdfPage']-ref['printedPage']==info['printedToPhysicalOffset'],'Guide26sourcepage')
  package=read(STAGE+specialty+'-guide-translations.json');basis=package['authoringBasis'];ledger_path='docs/ssw-workspace/manufacturing/batch25/'+specialty+'-source-review.json';ledger=read(ledger_path);lessons={l['id']:l for l in read('src/data/manufacturing/'+specialty+'.json')['lessons']}
  if specialty=='mechanical':
   require(basis['guideFile']==STAGE+specialty+'-guide.json' and basis['guideFileSha256']==digest(inputs[STAGE+specialty+'-guide.json']) and basis['guideSourceHash']==g['sourceHash'],'Mechanical26guidebasis')
   require(basis['sourceReviewFile']==ledger_path and basis['sourceReviewFileSha256']==digest(inputs[ledger_path]) and basis['sourceDocumentSha256']==qa[specialty]['sha256'],'Mechanical26sourcebasis')
   require(basis['sourcePhysicalPages']==[r['pdfPage'] for r in g['sources']] and lessons[basis['currentLessonId']]['sourceHash']==basis['currentLessonSourceHash'],'Mechanical26lessonbasis')
  else:
   lr=basis['sourceReview'] if specialty=='surface' else basis['ledger'];require(lr=={'path':ledger_path,'sha256':digest(inputs[ledger_path])} and basis['sourcePdfSha256']==qa[specialty]['sha256'],'Guide26sourcebasis')
   require(basis['lessonBindings'] and all(lid in lessons and lessons[lid]['sourceHash']==h for lid,h in basis['lessonBindings'].items()),'Guide26lessonbasis')
   ids=basis['sourceObjectIds'] if specialty=='surface' else basis['priorObjectIds'];require(ids and set(ids)<={o['id'] for page in ledger['pages'] for o in page['objects']},'Guide26objectbasis')
  require(set(package['locales'])==set(LOCALES),'Exact12guidelocales')
  for locale in LOCALES:
   require(set(package['locales'][locale])=={identifier},'Exactsingle26targetguide');t=package['locales'][locale][identifier];require(t['sourceHash']==g['sourceHash'],'Stale26targetsource');require(t.get('translatedDirectlyFrom')=='ja' and t.get('nativeReviewed') is False and t.get('domainReviewed') is False,'Target26provenance')
   require([p['id'] for p in t['paragraphs']]==[p['id'] for p in g['paragraphs']],'Target26paragraphorder')
   require([(p['ja'],p['reading']) for p in t['terms']]==[(p['ja'],p['reading']) for p in g['terms']],'Target26terms');require(len(t['safety'])==len(g['safetyJa']),'Target26safety')
   fields=[t[k] for k in ['title','objective','activity','summary']]+[p[k] for p in t['paragraphs'] for k in ['title','text']]+[p['meaning'] for p in t['terms']]+t['safety'];require(all(isinstance(v,str) and v.strip() for v in fields),'Empty26targetfield')
   r=target_reviews.get((identifier,locale));require(r and r['sourceHash']==g['sourceHash'] and r['targetObjectSha256']==object_digest(t) and r['verdict']=='pass_scoped_ai_comparison','Unreviewed26target')
   pairs=[(k+'Ja',k,g[k+'Ja'],t[k]) for k in ['title','objective']]
   for a,b in zip(g['paragraphs'],t['paragraphs']):
    pairs += [('paragraphs['+a['id']+'].'+sk,'paragraphs['+a['id']+'].'+tk,a[sk],b[tk]) for sk,tk in [('titleJa','title'),('textJa','text')]]
   pairs += [('terms['+str(i)+'].meaningJa','terms['+str(i)+'].meaning',a['meaningJa'],b['meaning']) for i,(a,b) in enumerate(zip(g['terms'],t['terms']))]
   pairs += [(k+'Ja',k,g[k+'Ja'],t[k]) for k in ['activity','summary']]
   pairs += [('safetyJa['+str(i)+']','safety['+str(i)+']',a,b) for i,(a,b) in enumerate(zip(g['safetyJa'],t['safety']))]
   bindings=[{'sourceField':a,'targetField':b,'sourceTextSha256':digest(c.encode()),'targetTextSha256':digest(d.encode()),'verdict':'pass_scoped_ai_comparison'} for a,b,c,d in pairs]
   require(r['fieldBindings']==bindings and r['proseFieldPairsCompared']==len(pairs),'Incomplete26fieldreview')
   for a,b,c,d in pairs:require(set(re.findall(r'\d+(?:\.\d+)?',c))==set(re.findall(r'\d+(?:\.\d+)?',d)),'Target26numericdrift:'+locale+'/'+a)
   targets['locales'][locale][identifier]=t
  source['guides'].append(g);newids.add(identifier)
 require(set(source_reviews)==newids and set(target_reviews)=={(g,l) for g in newids for l in LOCALES},'Excess26reviewrecords')
 require(len(source['guides'])==11 and all(len(targets['locales'][l])==11 for l in LOCALES),'Guide26coverage')
 course.update(sourceReferenceGuides=11,sourceGuideExtensionStage=STAGE+'integration')
 return {SOURCE:encoded(source),TARGETS:encoded(targets),COURSE:encoded(course)}
def historical_bytes(path,raw):
 require(path in BASES,'Unknown26historicalpath');inputs=load_inputs();base=inputs[STAGE+'integration/'+BASES[path][0]]
 # Check exact approved outputs even when passed a base snapshot: stale receipts fail closed.
 outputs=compile_outputs(inputs)
 if raw not in (base,outputs[path]):
  raw=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-caliper-guide29.py'))['historical_bytes'](path,raw,outputs)
 require(raw in (base,outputs[path]),'Unknown26currentbytes:'+path);return base
def preflight(current=None):
 inputs=load_inputs();outputs=compile_outputs(inputs);current=current or {p:(ROOT/p).read_bytes() for p in BASES}
 require(set(current)==set(BASES),'Incomplete26runtimefiles')
 for p in BASES:
  if current[p] not in (inputs[STAGE+'integration/'+BASES[p][0]],outputs[p]):historical_bytes(p,current[p])
 progress_preflight((ROOT/PROGRESS).read_bytes())
 return outputs
PROGRESS='docs/ssw-workspace/manufacturing/progress.json'
BASE_PROGRESS_SHA256='38870e5d241e5c0fbebfaa22ae2d8249230f7b9113d96d8f93e7bbb7d3f5f78d'
def progress_preflight(raw):
 before_raw=(ROOT/(STAGE+'integration/base-progress.json')).read_bytes();require(digest(before_raw)==BASE_PROGRESS_SHA256,'Historical26progressdrift');before=json.loads(before_raw);after=deepcopy(before);after.update(sourceReferenceGuides=11,sourceGuideExtensionStage=STAGE+'integration',sourceGuideTranslationCoverage={l:11 for l in LOCALES},translatedSourceGuideLocalePairs=132)
 current=json.loads(raw);strip=lambda d:{k:v for k,v in d.items() if k not in {'batch','next','updatedAt'}}
 if strip(current) not in (strip(before),strip(after)):
  current=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-caliper-guide29.py'))['projected_progress'](current,after)
 require(strip(current) in (strip(before),strip(after)),'Unknown26progressmetadata');return current
def main():
 outputs=preflight();progress=progress_preflight((ROOT/PROGRESS).read_bytes());progress.update(sourceReferenceGuides=11,sourceGuideExtensionStage=STAGE+'integration',sourceGuideTranslationCoverage={l:11 for l in LOCALES},translatedSourceGuideLocalePairs=132);outputs[PROGRESS]=encoded(progress);changed=[]
 # Allocate all validated payloads before replacing any runtime path.
 with tempfile.TemporaryDirectory(prefix='guide26-write-',dir=ROOT) as temp:
  staged=[]
  for i,(p,raw) in enumerate(outputs.items()):
   if (ROOT/p).read_bytes()!=raw:
    candidate=Path(temp)/str(i);candidate.write_bytes(raw);staged.append((p,candidate));changed.append(p)
  for p,candidate in staged:os.replace(candidate,ROOT/p)
 print(json.dumps({'status':'PASS','guides':11,'guidePairs':132,'changedFiles':changed}))
if __name__=='__main__':main()
