"""Validate and publish a source-occurrence audit without changing runtime content."""
import argparse,collections,copy,hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2];W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-10';D=ROOT/'src/data/agriculture'
SCOPES={'general-seed-audit':{'AGR-S1':(1,14),'AGR-S2':(1,19)},'soil-fertilizer-audit':{'AGR-S1':(15,28),'AGR-S2':(20,35)},'management-safety-audit':{'AGR-S1':(29,45),'AGR-S2':(36,61)},'rice-vegetable-audit':{'AGR-S1':(46,62),'AGR-S2':(62,81)},'facility-fruit-audit':{'AGR-S1':(63,90),'AGR-S2':(82,112)},'fruit-flower-terms-audit':{'AGR-S1':(91,105),'AGR-S2':(113,132)}}
def read(p):return json.loads(p.read_text())
def write(p,x):
 compact=p.name in ['source-coverage-audit.json','source-gap-backlog.json']
 p.write_text(json.dumps(x,ensure_ascii=False,indent=None if compact else 2,separators=(',',':') if compact else None)+'\n')
def compact_reports(reports):
 out=[]
 for r in reports:
  paths=[c.get('path',c.get('jsonPointer')) for c in r.get('appliedPatches',[])]
  out.append({k:v for k,v in r.items() if k in ['worker','rawPacketSha256','integratedPayloadSha256','pages','itemOccurrences','computedStatusCounts','independentReview','reviewScope']}|{'sourcePacket':'parallel-10/'+r['worker']+'.json','appliedPatchCount':len(paths),'appliedPatchesSha256':sha(r.get('appliedPatches',[])),'appliedPatchPaths':paths,'findingDetailsInSourcePacket':True})
 return out
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def patch(packet,changes):
 for c in changes:
  pointer=c.get('path',c.get('jsonPointer'));assert pointer and pointer.startswith('/') and c.get('reason',c.get('reasonJa'))
  tokens=[s.replace('~1','/').replace('~0','~') for s in pointer[1:].split('/')];obj=packet
  for t in tokens[:-1]:obj=obj[int(t)] if isinstance(obj,list) else obj[t]
  k=(len(obj) if tokens[-1]=='-' else int(tokens[-1])) if isinstance(obj,list) else tokens[-1]
  if c.get('op')=='add':
   assert c['before'] is None
   if isinstance(obj,list):assert k==len(obj);obj.append(c['after'])
   else:assert k not in obj;obj[k]=c['after']
  else:assert c.get('op','replace')=='replace' and obj[k]==c['before'],pointer;obj[k]=c['after']
def objective(item):
 return item.get('objectiveJa',item.get('learningObjectiveJa',item.get('titleJa')))
def source_hashes(packet):
 raw=packet['sourceHashes']
 if isinstance(raw,list):raw={x['documentId']:x.get('sha256',x.get('sha')) for x in raw}
 return {k:(v.get('sha256',v.get('sha')) if isinstance(v,dict) else v) for k,v in raw.items()}
def main(dry_run=False):
 inv=read(W/'source-inventory.json');docs={d['id']:d for d in inv['documents']};lessons={l['id']:l for l in read(D/'lessons.ja.json')['lessons']};ledger=read(W/'knowledge-ledger.json');knowledge={k['id']:k for k in ledger['knowledge']}
 assert len(lessons)==144 and len(knowledge)==864
 paragraph_ids={p['id'] for l in lessons.values() for p in l['paragraphs']}
 def check_evidence(e):
  if isinstance(e,list):
   for row in e:check_evidence(row)
  elif isinstance(e,dict):
   if e.get('lessonId'):
    lesson=lessons[e['lessonId']]
    if e.get('sourceHash'):assert e['sourceHash']==lesson['sourceHash']
    allowed={p['id'] for p in lesson['paragraphs']}|{'titleJa','objectiveJa','activityJa','terms'}
    if e.get('paragraphId'):assert e['paragraphId'] in allowed
    for pid in e.get('paragraphIds',[]):assert pid in allowed
   for pid in e.get('canonicalParagraphIds',[]):assert pid in paragraph_ids
 statuses=collections.Counter();kinds=collections.Counter();seen_pages=set();seen_items=set();pages=[];reports=[];links=[];gaps=[]
 for tag,scope in SCOPES.items():
  path=P/(tag+'.json');raw=hashlib.sha256(path.read_bytes()).hexdigest();packet=read(path);review=read(P/('review-'+tag+'.json'))
  assert review['status'] in ['complete','PASS','reviewed'] and review['packetSha256']==raw
  assert not review.get('unresolvedBlockingIssues',[])
  assert not any(review.get(f,False) for f in ['humanReviewed','domainReviewed','nativeReviewed'])
  changes=review.get('patches',review.get('corrections',[]));patch(packet,changes)
  assert packet['schemaVersion']==1 and not any(packet.get(f,False) for f in ['humanReviewed','domainReviewed','nativeReviewed'])
  for doc,digest in source_hashes(packet).items():assert doc in docs and digest==docs[doc]['sha256']
  assert set(source_hashes(packet))==set(docs)
  expected={(doc,n) for doc,(a,b) in scope.items() for n in range(a,b+1)};actual=set();item_count=0
  for page in packet['pages']:
   doc=page['documentId'];n=page['pdfPage'];key=(doc,n);assert key in expected and key not in actual and key not in seen_pages;actual.add(key);seen_pages.add(key)
   assert page['printedPage']==docs[doc]['pages'][n-1]['printedPage'] and page['visualChecked'] is True and page['pageRole']
   assert isinstance(page['items'],list) and page['items'],'Every page needs an explicit instructional/admin disposition'
   for item in page['items']:
    assert item['id'] not in seen_items;seen_items.add(item['id']);item_count+=1
    assert item['status'] in ['authored','missing','hold','excluded'] and objective(item)
    assert item.get('kind') and item.get('reasonJa',item.get('reason',item.get('evidence')))
    existing=item.get('existingLessonIds',[]);units=item.get('existingKnowledgeIds',item.get('knowledgeIds',[]))
    assert all(lid in lessons for lid in existing) and all(kid in knowledge for kid in units)
    if item['status']=='authored':
     assert existing,'Authored must link actual lesson prose'
     required=set(item.get('scopeLevels') or [doc[-1]])
     available=set().union(*(set(lessons[lid]['levels']) for lid in existing))
     assert required<=available,('Authored prose missing in required course route',item['id'],sorted(required-available))
    for ref in item.get('sources',[]):assert ref['documentId'] in docs and 1<=ref['pdfPage']<=docs[ref['documentId']]['pdfPages']
    check_evidence(item.get('evidence'));statuses[item['status']]+=1;kinds[item['kind']]+=1
    if item['status'] in ['missing','hold']:
     gaps.append({'id':item['id'],'documentId':doc,'pdfPage':n,'printedPage':page['printedPage'],'kind':item['kind'],'objectiveJa':objective(item),'status':item['status'],'conditionsJa':item.get('conditionsJa',item.get('conditions',[])),'sources':item.get('sources',[{'documentId':doc,'pdfPage':n,'printedPage':page['printedPage']}]),'scopeLevels':item.get('scopeLevels') or [doc[-1]],'evidence':item.get('evidence'),'existingLessonIds':existing,'existingKnowledgeIds':units,'holdIds':item.get('holdIds',[]),'reasonJa':item.get('reasonJa',item.get('reason',item.get('evidence'))),'sourcePacket':f'parallel-10/{tag}.json'})
   pages.append({'auditPacket':f'parallel-10/{tag}.json',**page})
  assert actual==expected,(tag,len(actual),len(expected))
  for link in packet.get('crossSourceLinks',[]):
   normalized=copy.deepcopy(link)
   if not normalized.get('itemIds'):
    normalized['itemIds']=list(dict.fromkeys(normalized.get('itemIdsFromPage1',[])+normalized.get('itemIdsFromPage2',[])))
    normalized['itemReferenceMode']='page_group_context_only_not_all_items_equivalent'
   links.append(normalized)
  reports.append({'worker':tag,'rawPacketSha256':raw,'integratedPayloadSha256':sha(packet),'pages':len(actual),'itemOccurrences':item_count,'computedStatusCounts':dict(collections.Counter(i['status'] for page in packet['pages'] for i in page['items'])),'independentReview':f'parallel-10/review-{tag}.json','reviewScope':review.get('scope',review.get('reviewScope',review.get('reviewCoverage'))),'appliedPatches':changes,'summary':packet.get('summary'),'sourceDifferences':packet.get('sourceDifferences',packet.get('crossSourceDifferences',[])),'localHoldDefinitions':packet.get('localHoldDefinitions',packet.get('newLocalHolds',packet.get('newHoldCandidates',[]))),'missingAssessableObjectives':packet.get('missingAssessableObjectives',[]),'nextSourceGaps':packet.get('nextSourceGaps',packet.get('exactNextGaps',packet.get('preciseNextGaps',[])))})
 root_corrections=[]
 correction_path=P/'root-source-corrections.json'
 if correction_path.exists():
  record=read(correction_path)
  assert record['status']=='root_independently_image_verified_pending_integration'
  for c in record['corrections']:
   h=next(h for h in ledger['holds'] if h['id']==c['targetHoldId'])
   assert h['topic']==c['previousTopic'] and h['reason']==c['previousReason'] and h['blocks']==c['previousBlocks']
   assert c['retainPriorHistory'] and c['retainCurrentRegistrationProductConditionsHold'] and c['runtimeContentChanged'] is False
   assert c['source']['sha256']==docs[c['source']['documentId']]['sha256'] and c['verifiedShortReadingJa']=='効果が登録されている薬剤'
   h.setdefault('interpretationHistory',[]).append({'topic':h['topic'],'reason':h['reason'],'blocks':h['blocks'],'status':'prior_ai_source_reading_error_corrected_in_batch10'})
   h['topic']='登録文の読取訂正と現在の製品条件の確認'
   h['reason']='Original PDF49 image rechecked: the clause refers to registered effects and is consistent with the following unregistered-product prohibition. Prior negative-word reading was an AI audit error. Current registration and product-specific/legal use conditions still require separate authoritative verification.'
   h['blocks']='current registration and product-specific/legal use conditions only; prior printed-contradiction claim withdrawn'
   h['status']='historical_reading_corrected_current_conditions_still_held';h['sourceReadingCorrection']='parallel-10/root-source-corrections.json#'+c['id']
   root_corrections.append(c)
 expected_all={(d,n) for d in docs for n in range(1,docs[d]['pdfPages']+1)};assert seen_pages==expected_all and len(seen_pages)==237
 for link in links:
  assert link.get('itemIds') and all(i in seen_items for i in link['itemIds'])
 pages.sort(key=lambda p:(p['documentId'],p['pdfPage']))
 summary={'pages':237,'sourceItemOccurrences':sum(statuses.values()),'statusCounts':dict(statuses),'kindCounts':dict(kinds),'crossSourceRelationCounts':dict(collections.Counter(l.get('relationship',l.get('relation','unspecified')) for l in links)),'uniqueKnowledgeDenominator':None,'uniqueAssessableObjectiveCount':None,'coveragePercent':None,'sourceOccurrenceCountIsNotUniqueKnowledgeCount':True,'enoughDistinctObjectivesFor800QuestionsCertified':False}
 report_refs=compact_reports(reports)
 audit={'schemaVersion':1,'status':'ai_candidate_page_item_audit_independently_checked_with_scoped_semantic_limits','baselineCommit':'31abbf8d3d08c6e23d50da1bb854b788de9ce08c','sourceHashes':{d:docs[d]['sha256'] for d in docs},'lessonSourceHashes':{lid:l['sourceHash'] for lid,l in lessons.items()},'knowledgeUnitsSha256':sha(ledger['knowledge']),'summary':summary,'workers':report_refs,'sourceReadingCorrections':root_corrections,'pages':pages,'crossSourceLinks':links,'limits':['Page inventory and source occurrences are not a certified exhaustive unique knowledge denominator','Authored links are AI prose-mapping judgments; semantic peer rechecks may be targeted as recorded','Do not count these records as800independent questions','Runtime lessons/translations/questions/UI and stored state are unchanged'],'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False,'courseComplete':False}
 backlog={'schemaVersion':1,'status':'source_gap_occurrences_requiring_dedup_and_authoring_or_verification','summary':summary,'items':gaps,'workerFindings':[{'worker':r['worker'],'localHoldDefinitions':r['localHoldDefinitions'],'sourceDifferences':r['sourceDifferences'],'missingAssessableObjectives':r['missingAssessableObjectives'],'nextSourceGaps':r['nextSourceGaps']} for r in reports],'priorityPolicy':['Reconcile explicit source contradictions and qualifiers before activating the disputed fact','Author genuinely missing safe concepts/tables in source order; do not repeat existing lessons','Produce original recognition assets for visual tasks','Confirm distinct assessable objectives and source bindings before mock authoring'],'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}
 manifest={'schemaVersion':1,'status':'audit_integrated_pending_validation','workers':report_refs,'summary':summary,'auditFile':'source-coverage-audit.json','backlogFile':'source-gap-backlog.json','sourceReadingCorrections':root_corrections,'newRuntimeLessons':0,'newRuntimeQuestions':0,'newTranslations':0,'preservedRuntimeLessons':144,'preservedTranslationPairs':1728,'preservedWeeklyQuestions':296,'nativeReviewed':False,'domainReviewed':False,'courseComplete':False}
 if not dry_run:
  write(W/'source-coverage-audit.json',audit);write(W/'source-gap-backlog.json',backlog);write(W/'parallel-10-manifest.json',manifest)
  ledger['latestSourceCoverageAudit']={'file':'source-coverage-audit.json','backlog':'source-gap-backlog.json','summary':summary,'nativeReviewed':False,'domainReviewed':False};write(W/'knowledge-ledger.json',ledger)
  page_map={(p['documentId'],p['pdfPage']):p for p in pages}
  for doc in inv['documents']:
   for page in doc['pages']:
    record=page_map[(doc['id'],page['pdfPage'])];page['atomicAudit']={'file':'source-coverage-audit.json','itemIds':[i['id'] for i in record['items']],'statusCounts':dict(collections.Counter(i['status'] for i in record['items'])),'humanReviewed':False,'domainReviewed':False}
  write(W/'source-inventory.json',inv)
 print(json.dumps({'dryRun':dry_run,'pages':237,'sourceItemOccurrences':sum(statuses.values()),'statusCounts':dict(statuses),'backlogOccurrences':len(gaps),'coveragePercent':None,'uniqueAssessableObjectiveCount':None},ensure_ascii=False))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--dry-run',action='store_true');args=parser.parse_args();main(args.dry_run)
