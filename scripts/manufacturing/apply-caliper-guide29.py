"""Exact additive preview draft; never claims independent/native/domain review."""
from pathlib import Path
from copy import deepcopy
import hashlib,json,re,runpy,tempfile,os

ROOT=Path(__file__).resolve().parents[2]
STAGE='docs/ssw-workspace/manufacturing/batch29-caliper-integration/'
DRAFT='docs/ssw-workspace/manufacturing/batch27-caliper/'
REVIEW=STAGE+'author-comparison.json'
SOURCE='src/data/manufacturing/source-guides.json'
TARGETS='src/data/manufacturing/source-guide-translations.json'
COURSE='src/data/manufacturing/course-manifest.json'
PROGRESS='docs/ssw-workspace/manufacturing/progress.json'
GUIDE_ID='mfg1-mechanical-source-guide-caliper-increments-zero'
GUIDE_HASH='d00a9f1eadbfec6f09c473e7b0b397224d78ae914478e1414b389573e707ef3d'
REVIEW_SHA256='cf8bbb2f69e889d8b8570b62a024600956d5b0df14d8ed402b6104b434fbec12'
LOCALES=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']

def require(value,message):
 if not value:raise ValueError(message)
def digest(raw):return hashlib.sha256(raw).hexdigest()
def encoded(value):return (json.dumps(value,ensure_ascii=False,indent=2)+'\n').encode()
def object_digest(v):return digest(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())
def layer26():return runpy.run_path(str(ROOT/'scripts/manufacturing/apply-guide-extension26.py'))
def base_outputs():
 layer=layer26();return layer['compile_outputs'](layer['load_inputs']())
def load_inputs():
 paths=[REVIEW,DRAFT+'guide.ja.json',DRAFT+'author-source-review.json',DRAFT+'translation-completion-qa.json']
 paths += [DRAFT+'guide.'+loc+'.json' for loc in LOCALES]
 paths += ['src/data/manufacturing/mechanical.json','docs/ssw-workspace/manufacturing/batch22/mechanical-source-ledger.json']
 return {p:(ROOT/p).read_bytes() for p in paths}
def field_pairs(g,t):
 pairs=[(k+'Ja',k,g[k+'Ja'],t[k]) for k in ['title','objective']]
 for a,b in zip(g['paragraphs'],t['paragraphs']):
  pairs.extend((f"paragraphs[{a['id']}].{sk}",f"paragraphs[{b['id']}].{tk}",a[sk],b[tk]) for sk,tk in [('titleJa','title'),('textJa','text')])
 pairs.extend((f'terms[{i}].meaningJa',f'terms[{i}].meaning',a['meaningJa'],b['meaning']) for i,(a,b) in enumerate(zip(g['terms'],t['terms'])))
 pairs.extend((k+'Ja',k,g[k+'Ja'],t[k]) for k in ['activity','summary'])
 pairs.extend((f'safetyJa[{i}]',f'safety[{i}]',a,b) for i,(a,b) in enumerate(zip(g['safetyJa'],t['safety'])))
 return pairs
def compile_outputs(inputs=None,base=None):
 inputs=inputs if inputs is not None else load_inputs();base=base if base is not None else base_outputs()
 read=lambda p:json.loads(inputs[p])
 require(digest(inputs[REVIEW])==REVIEW_SHA256,'Changed29authorcomparison');review=read(REVIEW);g=read(DRAFT+'guide.ja.json');source=deepcopy(json.loads(base[SOURCE]));targets=deepcopy(json.loads(base[TARGETS]));course=deepcopy(json.loads(base[COURSE]))
 require(review['status']=='same_agent_author_comparison','Wrong29reviewmethod')
 for key in ['independentAIComparisonPerformed','nativeReviewed','domainReviewed','humanReviewed','releaseReady']:require(review[key] is False,'False29certification:'+key)
 require(review['sourceVisualReviewPerformed'] is True and review['sourcePdfPage']==72 and review['sourcePrintedPage']==64,'Wrong29sourcepage')
 require(review['sourceDocumentSha256']=='35096524ce12c830ce7765311f536b5d1d0a8bde7268e5385f90588abba04622','Wrong29document')
 expected={DRAFT+'guide.ja.json',DRAFT+'author-source-review.json',DRAFT+'translation-completion-qa.json'}|{DRAFT+'guide.'+l+'.json' for l in LOCALES}
 require(set(review['inputsSha256'])==expected,'Incomplete29inputs')
 for p,h in review['inputsSha256'].items():require(digest(inputs[p])==h,'Stale29input:'+p)
 require(g['id']==GUIDE_ID and g['specialty']=='mechanical','Wrong29identity')
 require(g['sourceHash']==GUIDE_HASH==review['guideSourceHash']==object_digest({k:v for k,v in g.items() if k!='sourceHash'}),'Stale29guide')
 require(g['reviewStatus']=='ai_authored_reference_supplement_independent_review_pending','29reviewstatusmustremainpending')
 require(g['nativeReviewed'] is False and g['domainReviewed'] is False,'Guide29certification')
 require(g['sources']==[{'documentId':'mfg1-mechanical-source','pdfPage':72,'printedPage':64}],'29sourcebounds')
 require(g['knowledgeIds']==['mfg1-mechanical-c06-s2-1'],'29knowledgebounds')
 require([p['id'] for p in g['paragraphs']]==['increments','light-gap','zero-reset'] and len(g['terms'])==2 and len(g['safetyJa'])==1,'29structure')
 require(g['durationBasis']=='target_with_activities_not_measured' and g['estimatedMinutes']==10,'29duration')
 authority=read(DRAFT+'author-source-review.json');ledger=read('docs/ssw-workspace/manufacturing/batch22/mechanical-source-ledger.json')
 require(digest(inputs[authority['priorLedgerPath']])==authority['priorLedgerSha256'],'29priorledgerdrift')
 require(authority['source']['sha256']==ledger['source']['sha256']==review['sourceDocumentSha256'],'29sourcesnapshot')
 objects={o['id']:o for p in ledger['pages'] for o in p['objects']}
 require(len(authority['priorObjects'])==4 and all(objects[o['id']]==o for o in authority['priorObjects']),'29priorobjectdrift')
 lesson=next(l for l in read('src/data/manufacturing/mechanical.json')['lessons'] if l['id']==authority['existingLessonId'])
 require(lesson['sourceHash']==authority['existingLessonSourceHash'],'29lessonbinding')
 require(len(source['guides'])==11 and GUIDE_ID not in {x['id'] for x in source['guides']},'29baseguidecount')
 rows={r['locale']:r for r in review['locales']};require(len(rows)==len(review['locales'])==12 and set(rows)==set(LOCALES),'29reviewlocales')
 fields=0
 for locale in LOCALES:
  t=read(DRAFT+'guide.'+locale+'.json');row=rows[locale]
  require(t['sourceHash']==g['sourceHash'] and t['translatedDirectlyFrom']=='ja','29targetbinding:'+locale)
  require(t['nativeReviewed'] is False and t['domainReviewed'] is False and t['status']=='ai_translated_draft','29targetprovenance')
  require([p['id'] for p in t['paragraphs']]==[p['id'] for p in g['paragraphs']],'29paragraphorder')
  require([(p['ja'],p['reading']) for p in t['terms']]==[(p['ja'],p['reading']) for p in g['terms']],'29termbinding')
  require(len(t['safety'])==len(g['safetyJa']),'29safetycount')
  pairs=field_pairs(g,t);bindings=[]
  for a,b,c,d in pairs:
   require(isinstance(d,str) and d.strip(),'29emptytarget')
   numeric_difference=set(re.findall(r'\d+(?:\.\d+)?',c))^set(re.findall(r'\d+(?:\.\d+)?',d))
   # Japanese ゼロ and a translated literal 0 are the same quantity. This
   # exception is only for zero-bearing source fields, never reading increments.
   if 'ゼロ' in c:numeric_difference.discard('0')
   require(not numeric_difference,'29numericdrift:'+locale+'/'+a)
   bindings.append({'sourceField':a,'targetField':b,'sourceTextSha256':digest(c.encode()),'targetTextSha256':digest(d.encode())})
  require(row['sourceHash']==g['sourceHash'] and row['verdict']=='author_compared_draft_pending_independent_review' and not row['requiredCorrections'],'29reviewverdict')
  require(row['fields']==bindings,'29fieldreviewdrift');fields+=len(pairs)
  require(len(targets['locales'][locale])==11,'29basetargetcount');targets['locales'][locale][GUIDE_ID]=t
 require(fields==review['translatedProseFields']==156,'29fieldcounts')
 source['guides'].append(g);course.update(sourceReferenceGuides=12,sourceGuideExtensionStage=STAGE)
 require(course['courseComplete'] is False,'29releaseclaim')
 return {SOURCE:encoded(source),TARGETS:encoded(targets),COURSE:encoded(course)}
def historical_bytes(path,raw,base=None):
 base=base if base is not None else base_outputs();require(path in base,'Unknown29historicalpath')
 outputs=compile_outputs(base=base);require(raw in (base[path],outputs[path]),'Unknown29runtime:'+path)
 return base[path]
def projected_progress(value,expected11):
 expected12=deepcopy(expected11);expected12.update(sourceReferenceGuides=12,sourceGuideExtensionStage=STAGE,sourceGuideTranslationCoverage={l:12 for l in LOCALES},translatedSourceGuideLocalePairs=144)
 strip=lambda d:{k:v for k,v in d.items() if k not in {'batch','next','updatedAt'}}
 require(strip(value)==strip(expected12),'Unknown29progress')
 result=deepcopy(expected11)
 for k in ['batch','next','updatedAt']:
  if k in value:result[k]=value[k]
 return result
def preflight():
 base=base_outputs();outputs=compile_outputs(base=base)
 for p in outputs:require((ROOT/p).read_bytes() in (base[p],outputs[p]),'Unknown29current:'+p)
 progress=layer26()['progress_preflight']((ROOT/PROGRESS).read_bytes())
 return outputs,progress
def main():
 outputs,progress=preflight();progress.update(sourceReferenceGuides=12,sourceGuideExtensionStage=STAGE,sourceGuideTranslationCoverage={l:12 for l in LOCALES},translatedSourceGuideLocalePairs=144)
 outputs[PROGRESS]=encoded(progress);changed=[]
 with tempfile.TemporaryDirectory(prefix='caliper29-',dir=ROOT) as folder:
  staged=[]
  for i,(p,raw) in enumerate(outputs.items()):
   if (ROOT/p).read_bytes()!=raw:
    target=Path(folder)/str(i);target.write_bytes(raw);staged.append((p,target));changed.append(p)
  for p,temp in staged:os.replace(temp,ROOT/p)
 print(json.dumps({'status':'PASS_PREVIEW_DRAFT','guides':12,'targetPairs':144,'changedFiles':changed,'independentAIComparisonPerformed':False,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}))
if __name__=='__main__':main()
