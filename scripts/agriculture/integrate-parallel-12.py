"""Merge independently reviewed batch12 source-gap packets; never rewrite existing lessons."""
import argparse,copy,hashlib,importlib.util,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-12'
TITLES={'general-seed':'米の種類と直播の補足','soil-fertilizer':'養分の働きと施肥方法','management-safety':'機械・電源・燃料の確認','rice-vegetable':'豆類と麦・トウモロコシの利用','facility-fruit':'施設の作物と換気条件','fruit-flower-terms':'果樹と花きの補足'}
def read(p):return json.loads(p.read_text())
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
spec=importlib.util.spec_from_file_location('batch06',ROOT/'scripts/agriculture/integrate-parallel-06.py');previous=importlib.util.module_from_spec(spec);spec.loader.exec_module(previous)
def main(dry_run=False):
 content=read(D/'lessons.ja.json');assert len(content['lessons'])==156,'Wrong baseline/already merged'
 course=read(D/'course-manifest.json');checks=read(D/'weekly-checks.ja.json');ledger=read(W/'knowledge-ledger.json');inv=read(W/'source-inventory.json');diff=read(W/'source-differences.json');index=read(D/'translations.json')
 oldknowledge=copy.deepcopy(ledger['knowledge']);old=copy.deepcopy(content['lessons']);oldchecks=copy.deepcopy(checks['exams']);oldcourse=copy.deepcopy(course)
 assert sum(len(read(D/p)) for p in index['shards'].values())==1872
 lids={l['id'] for l in old};kids={k['id'] for k in ledger['knowledge']};qids={q['id'] for e in checks['exams'] for q in e['questions']};stems={q['stemJa'] for e in checks['exams'] for q in e['questions']}
 newids=[];reports=[];resolutions=[]
 backlog={i['id']:i for i in read(W/'source-gap-backlog.json')['items']};baseline_hashes=read(P/'baseline-hashes.json');previous_overlay=read(W/'source-gap-reconciliation-11.json');previous_covered={i for r in previous_overlay['resolutions'] if r['disposition']=='covered_by_new_prose' for i in r['sourceItemIds']};assert len(previous_covered)==100
 for path,digest in baseline_hashes.items():assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==digest,('Changed baseline',path)
 for tag,title in TITLES.items():
  path=P/(tag+'.json');packet=read(path);rawsha=hashlib.sha256(path.read_bytes()).hexdigest();review=read(P/('review-'+tag+'.json'))
  assert review['status'] in ['complete','PASS','reviewed'] and review['packetSha256']==rawsha
  assert not review.get('unresolvedBlockingIssues',[])
  assert not any(review.get(f,False) for f in ['nativeReviewed','domainReviewed','humanReviewed'])
  for patch in review.get('resolutionPatches',[]):
   row=packet['sourceGapResolutions'][patch['index']];assert row[patch['field']]==patch['before'];row[patch['field']]=patch['after']
  knowledge_patches=review.get('knowledgePatches',[])+[p for p in review.get('patches',[]) if p['targetType']=='knowledge']
  for patch in knowledge_patches:
   obj=next(k for k in packet['knowledge'] if k['id']==patch['targetId']);assert obj[patch['field']]==patch['before'] and patch['reason'];obj[patch['field']]=patch['after']
  original_questions={q['id']:copy.deepcopy(q) for q in packet['questions']}
  content_review=copy.deepcopy(review);content_review['patches']=[p for p in review.get('patches',[]) if p['targetType']!='knowledge']
  patches=previous.repair(packet,content_review)
  excluded_questions=review.get('excludedQuestions',[])
  for entry in excluded_questions:assert original_questions[entry['id']]==entry['before'] and entry['reason']
  excluded_ids={entry['id'] for entry in excluded_questions};assert len(excluded_ids)==len(excluded_questions)
  packet['questions']=[q for q in packet['questions'] if q['id'] not in excluded_ids]
  for k in packet['knowledge']:k['questionIds']=sorted(q['id'] for q in packet['questions'] if k['id'] in q['knowledgeIds'])
  assert len(packet['lessons'])==2 and len(packet['knowledge'])==12
  new_byid={l['id']:l for l in packet['lessons']};new_kids={k['id']:k for k in packet['knowledge']};assert len(new_byid)==2 and len(new_kids)==12
  for lesson in packet['lessons']:
   assert len(lesson['paragraphs'])==6 and len({p['id'] for p in lesson['paragraphs']})==6
   for para in lesson['paragraphs']:
    assert para['knowledgeIds'] and set(para['knowledgeIds'])<=set(new_kids)
  for k in packet['knowledge']:
   assert k['lessonIds'] and set(k['lessonIds'])<=set(new_byid)
   for lid in k['lessonIds']:assert set(k['scopeLevels'])==set(new_byid[lid]['levels'])
   for f in ['nativeReviewed','domainReviewed','humanReviewed']:assert k[f] is False
  for l in packet['lessons']:
   assert l['id'] not in lids;lids.add(l['id']);newids.append(l['id'])
   assert l['sourceHash']==sha({k:v for k,v in l.items() if k!='sourceHash'}) and len(l['paragraphs'])>=6
   assert all(l[f] is False for f in ['humanReviewed','nativeReviewed','domainReviewed'])
   assert set(l['levels']) and set(l['levels'])<={'1','2'}
   assert l['terms'] and l['activityJa'] and l['sources']
   content['lessons'].append(l)
  for k in packet['knowledge']:
   assert k['id'] not in kids;kids.add(k['id']);ledger['knowledge'].append(k)
  weeks={}
  for level in ['1','2']:
   selected=[l['id'] for l in packet['lessons'] if level in l['levels']]
   if selected:
    n=max(w['number'] for w in course['levels'][level]['weeks'])+1;wid=f'agr-{level}-w{n:02}'
    course['levels'][level]['weeks'].append({'id':wid,'number':n,'titleJa':title,'lessonIds':selected});weeks[level]=[wid]
  byid={l['id']:l for l in content['lessons']};qs=packet['questions'];assert len(qs) in [4,8]
  groups={}
  for q in qs:
   levels=tuple(sorted(q.get('levels',byid[q['lessonId']]['levels'])))
   assert levels and set(levels)<=set(byid[q['lessonId']]['levels'])
   groups.setdefault(levels,[]).append(q)
  for levels,bankqs in groups.items():
   assert len(bankqs)%4==0;positions=[0]*4
   for i,q in enumerate(bankqs):
    assert q['id'] not in qids and q['stemJa'] not in stems;qids.add(q['id']);stems.add(q['stemJa'])
    assert len(q['optionsJa'])==len(q['optionReasonsJa'])==4 and len(set(q['optionsJa']))==4 and all(q['optionReasonsJa'])
    assert 0<=q['correctIndex']<4;positions[q['correctIndex']]+=1
    assert q['lessonSourceHash']==byid[q['lessonId']]['sourceHash']
    assert q['knowledgeIds'] and set(q['knowledgeIds'])<=set(new_kids)
    assert all(q['lessonId'] in new_kids[k]['lessonIds'] for k in q['knowledgeIds'])
    if i>=2:assert not(q['correctIndex']==bankqs[i-1]['correctIndex']==bankqs[i-2]['correctIndex'])
   assert positions==[len(bankqs)//4]*4
   suffix='-'.join(levels)
   checks['exams'].append({'id':'agr-par12-'+tag+'-'+suffix+'-check','revision':'v1-'+sha(bankqs)[:16],'level':levels[0],'levels':list(levels),'kind':'weekly','weekId':weeks[levels[0]][0],'weekNumber':int(weeks[levels[0]][0].rsplit('w',1)[1]),'weekIdsByLevel':{lev:weeks[lev][0] for lev in levels},'studyWeekIdsByLevel':{lev:weeks[lev] for lev in levels},'titleJa':title+'の確認','officialSimulation':False,'timeLimitMinutes':None,'passThreshold':None,'questions':bankqs})
  for r in packet['sourceImagesChecked']:
   doc=next(d for d in inv['documents'] if d['id']==r['documentId']);assert 1<=r['pdfPage']<=doc['pdfPages'];doc['pages'][r['pdfPage']-1]['visualReview']='ai_page_image_checked_not_human_review'
  knownholds={h['id'] for h in ledger['holds']};ledger['holds'].extend(h for h in packet.get('holds',[]) if h.get('id') and h['id'] not in knownholds);diff['verifiedComparisons'].extend(packet.get('comparisons',[]))
  excluded={}
  for entry in review.get('excludedResolutions',[]):
   assert packet['sourceGapResolutions'][entry['index']]==entry['before'] and entry['reason'];excluded[entry['index']]=entry
  for resolution_index,resolution in enumerate(packet.get('sourceGapResolutions',[])):
   if resolution_index in excluded:continue
   assert resolution['disposition'] in ['covered_by_new_prose','partially_covered'] and resolution['reasonJa']
   assert resolution['sourceItemIds'] and resolution['lessonIds'] and resolution['paragraphIds']
   assert set(resolution['lessonIds'])<=set(new_byid)
   paras={p['id'] for lid in resolution['lessonIds'] for p in new_byid[lid]['paragraphs']}
   assert set(resolution['paragraphIds'])<=paras
   for itemid in resolution['sourceItemIds']:
    item=backlog[itemid];assert item['status']=='missing' and itemid not in previous_covered
    lessons=[new_byid[lid] for lid in resolution['lessonIds']]
    missing_levels=set(item['scopeLevels'])-set.union(*(set(l['levels']) for l in lessons))
    if missing_levels:assert resolution['disposition']=='partially_covered',(tag,itemid,'course-route')
    source_refs=[r for l in lessons for r in l['sources']]
    if resolution['disposition']=='partially_covered':source_refs+=packet['sourceImagesChecked']
    assert any(r['documentId']==item['documentId'] and r['pdfPage']==item['pdfPage'] for r in source_refs),(tag,itemid,'source-page')
   bindings=[]
   for lid in resolution['lessonIds']:
    lesson=new_byid[lid]
    for para in lesson['paragraphs']:
     if para['id'] in resolution['paragraphIds']:bindings.append({'lessonId':lid,'lessonSourceHash':lesson['sourceHash'],'paragraphId':para['id'],'paragraphSha256':sha(para)})
   resolutions.append({'worker':tag,**resolution,'evidenceBindings':bindings})
  reports.append({'worker':tag,'packetSha256':rawsha,'integratedPayloadSha256':sha(packet),'independentReview':'parallel-12/review-'+tag+'.json','newLessonIds':[l['id'] for l in packet['lessons']],'knowledgeUnits':len(packet['knowledge']),'weeklyQuestions':len(packet['questions']),'excludedQuestions':excluded_questions,'appliedPatches':patches,'resolutionPatches':review.get('resolutionPatches',[]),'excludedResolutions':review.get('excludedResolutions',[]),'knowledgePatches':knowledge_patches,'localHoldNotes':packet.get('holds',[])})
 assert content['lessons'][:156]==old and checks['exams'][:len(oldchecks)]==oldchecks
 for level in ['1','2']:assert course['levels'][level]['weeks'][:len(oldcourse['levels'][level]['weeks'])]==oldcourse['levels'][level]['weeks']
 for k in ledger['knowledge']:
  k['questionIds']=sorted(set(k.get('questionIds',[]))|{q['id'] for e in checks['exams'] for q in e['questions'] if k['id'] in q['knowledgeIds']})
 for doc in inv['documents']:
  for p in doc['pages']:
   p['knowledgeIds']=[k['id'] for k in ledger['knowledge'] if any(r['documentId']==doc['id'] and r['pdfPage']==p['pdfPage'] for r in k['sources'])]
   if p['knowledgeIds']:p['status']='partially_mapped_to_authored_content'
 assert ledger['knowledge'][:len(oldknowledge)]==oldknowledge
 # Preserve holds verbatim: detailed reconciliation evidence is additive and is not blanket closure.
 ledger.setdefault('sourceGapReconciliation',[]).extend(resolutions)
 course['revision']='v12'
 index['authoredLessonCoverage']={'authoredLessons':len(content['lessons']),'fullyDraftTranslatedLessons':156,'lessonLocalePairs':1872,'completeForCurrentlyAuthoredLessons':False,'wholeCurriculumComplete':False}
 manifest={'schemaVersion':1,'status':'source_integrated_pending_translations_and_checks','workers':reports,'newLessonIds':newids,'translatedLessonIds':[],'newTranslations':0,'sourceGapResolutions':resolutions,'counts':{'lessons':len(content['lessons']),'knowledgeUnits':len(ledger['knowledge']),'weeklyQuestions':sum(len(e['questions']) for e in checks['exams']),'lessonLocalePairs':1872,'pageImagesChecked':237,'conceptDiagrams':7,'authoredLessonsMissingAll12Drafts':len(newids),'remainingAuthoredLessonLocalePairs':12*len(newids)},'preservation':{'unchangedPriorLessonObjects':156,'unchangedPriorTranslationObjects':1872,'unchangedPriorWeeklyBanks':len(oldchecks),'storedStateKeysAndRecordsModified':False},'nativeReviewed':False,'domainReviewed':False,'courseComplete':False}
 coverage={}
 for r in resolutions:
  for itemid in r['sourceItemIds']:
   assert itemid not in coverage,('Repeated resolution',itemid);coverage[itemid]=r['disposition']
 summary={'sourceOccurrencesCoveredByNewProse':sum(v=='covered_by_new_prose' for v in coverage.values()),'sourceOccurrencesPartiallyCovered':sum(v=='partially_covered' for v in coverage.values()),'baselineMissingOccurrences':1559,'baselineHeldOccurrences':301,'previouslyCoveredSourceOccurrences':100,'candidateRemainingMissingOrPartialOccurrences':1559-100-sum(v=='covered_by_new_prose' for v in coverage.values()),'uniqueKnowledgeDenominator':None,'coveragePercent':None,'recognitionAssetsCreated':0}
 overlay={'schemaVersion':1,'status':'independently_ai_reviewed_source_prose_candidate','baselineCommit':'313f15c29c31e44fe038414be61d35a690dc82d4','previousReconciliation':'source-gap-reconciliation-11.json','frozenAudit':'source-coverage-audit.json','frozenBacklog':'source-gap-backlog.json','summary':summary,'resolutions':resolutions,'nativeReviewed':False,'domainReviewed':False,'releaseReady':False}
 manifest['sourceGapReconciliation']={'file':'source-gap-reconciliation-12.json',**summary}
 ledger['latestSourceGapReconciliation']={'file':'source-gap-reconciliation-12.json','baselineAudit':'source-coverage-audit.json','previousOverlay':'source-gap-reconciliation-11.json','note':'Batch10 audit remains a historical snapshot; use additive resolution evidence for the new content, not its unchanged status counts as a current unique denominator.'}
 if not dry_run:
  write(W/'source-gap-reconciliation-12.json',overlay)
  for p,x in [(D/'lessons.ja.json',content),(D/'course-manifest.json',course),(D/'weekly-checks.ja.json',checks),(D/'translations.json',index),(W/'knowledge-ledger.json',ledger),(W/'source-inventory.json',inv),(W/'source-differences.json',diff),(W/'parallel-12-manifest.json',manifest)]:write(p,x)
 print(json.dumps({'dryRun':dry_run,'newLessons':len(newids),'newWeeklyQuestions':sum(r['weeklyQuestions'] for r in reports),'counts':manifest['counts']}))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--dry-run',action='store_true');args=parser.parse_args();main(args.dry_run)
