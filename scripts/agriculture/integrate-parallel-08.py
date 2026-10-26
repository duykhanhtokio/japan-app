"""Merge independently reviewed source-gap packets; never rewrite existing lessons."""
import argparse,copy,hashlib,importlib.util,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-08'
TITLES={'seed-graft':'品種と育苗の補足','soil-details':'土壌と作付けの補足','fertilizer-formulations':'肥料と剤型の読み方','management-details':'生育と収穫後管理の補足','fruit-details':'果樹の資料と観察','flower-details':'花きの資料の読み方'}
def read(p):return json.loads(p.read_text())
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
spec=importlib.util.spec_from_file_location('batch06',ROOT/'scripts/agriculture/integrate-parallel-06.py');previous=importlib.util.module_from_spec(spec);spec.loader.exec_module(previous)
def main(dry_run=False):
 content=read(D/'lessons.ja.json');assert len(content['lessons'])==126,'Wrong baseline/already merged'
 course=read(D/'course-manifest.json');checks=read(D/'weekly-checks.ja.json');ledger=read(W/'knowledge-ledger.json');inv=read(W/'source-inventory.json');diff=read(W/'source-differences.json');index=read(D/'translations.json')
 old=copy.deepcopy(content['lessons']);oldchecks=copy.deepcopy(checks['exams']);oldcourse=copy.deepcopy(course)
 assert sum(len(read(D/p)) for p in index['shards'].values())==1512
 lids={l['id'] for l in old};kids={k['id'] for k in ledger['knowledge']};qids={q['id'] for e in checks['exams'] for q in e['questions']};stems={q['stemJa'] for e in checks['exams'] for q in e['questions']}
 newids=[];reports=[];resolutions=[]
 for tag,title in TITLES.items():
  path=P/(tag+'.json');packet=read(path);rawsha=hashlib.sha256(path.read_bytes()).hexdigest();review=read(P/('review-'+tag+'.json'))
  assert review['status'] in ['complete','PASS','reviewed'] and review['packetSha256']==rawsha
  assert not review.get('unresolvedBlockingIssues',[])
  assert not any(review.get(f,False) for f in ['nativeReviewed','domainReviewed','humanReviewed'])
  patches=previous.repair(packet,review);assert 1<=len(packet['lessons'])<=3
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
  byid={l['id']:l for l in content['lessons']};qs=packet['questions'];assert len(qs)==8
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
    if i>=2:assert not(q['correctIndex']==bankqs[i-1]['correctIndex']==bankqs[i-2]['correctIndex'])
   assert positions==[len(bankqs)//4]*4
   suffix='-'.join(levels)
   checks['exams'].append({'id':'agr-par08-'+tag+'-'+suffix+'-check','revision':'v1-'+sha(bankqs)[:16],'level':levels[0],'levels':list(levels),'kind':'weekly','weekId':weeks[levels[0]][0],'weekNumber':int(weeks[levels[0]][0].rsplit('w',1)[1]),'weekIdsByLevel':{lev:weeks[lev][0] for lev in levels},'studyWeekIdsByLevel':{lev:weeks[lev] for lev in levels},'titleJa':title+'の確認','officialSimulation':False,'timeLimitMinutes':None,'passThreshold':None,'questions':bankqs})
  for r in packet['sourceImagesChecked']:
   doc=next(d for d in inv['documents'] if d['id']==r['documentId']);assert 1<=r['pdfPage']<=doc['pdfPages'];doc['pages'][r['pdfPage']-1]['visualReview']='ai_page_image_checked_not_human_review'
  ledger['holds'].extend(packet.get('holds',[]));diff['verifiedComparisons'].extend(packet.get('comparisons',[]))
  for resolution in packet.get('sourceGapResolutions',[]):resolutions.append({'worker':tag,**resolution})
  reports.append({'worker':tag,'packetSha256':rawsha,'integratedPayloadSha256':sha(packet),'independentReview':'parallel-08/review-'+tag+'.json','newLessonIds':[l['id'] for l in packet['lessons']],'knowledgeUnits':len(packet['knowledge']),'weeklyQuestions':8,'appliedPatches':patches})
 assert content['lessons'][:126]==old and checks['exams'][:len(oldchecks)]==oldchecks
 for level in ['1','2']:assert course['levels'][level]['weeks'][:len(oldcourse['levels'][level]['weeks'])]==oldcourse['levels'][level]['weeks']
 for k in ledger['knowledge']:
  k['questionIds']=sorted(set(k.get('questionIds',[]))|{q['id'] for e in checks['exams'] for q in e['questions'] if k['id'] in q['knowledgeIds']})
 for doc in inv['documents']:
  for p in doc['pages']:
   p['knowledgeIds']=[k['id'] for k in ledger['knowledge'] if any(r['documentId']==doc['id'] and r['pdfPage']==p['pdfPage'] for r in k['sources'])]
   if p['knowledgeIds']:p['status']='partially_mapped_to_authored_content'
 # Preserve holds verbatim: detailed reconciliation evidence is additive and is not blanket closure.
 ledger.setdefault('sourceGapReconciliation',[]).extend(resolutions)
 course['revision']='v8'
 index['authoredLessonCoverage']={'authoredLessons':len(content['lessons']),'fullyDraftTranslatedLessons':126,'lessonLocalePairs':1512,'completeForCurrentlyAuthoredLessons':False,'wholeCurriculumComplete':False}
 manifest={'schemaVersion':1,'status':'integrated_pending_checks','workers':reports,'newLessonIds':newids,'translatedLessonIds':[],'newTranslations':0,'sourceGapResolutions':resolutions,'counts':{'lessons':len(content['lessons']),'knowledgeUnits':len(ledger['knowledge']),'weeklyQuestions':sum(len(e['questions']) for e in checks['exams']),'lessonLocalePairs':1512,'pageImagesChecked':237,'conceptDiagrams':6,'authoredLessonsMissingAll12Drafts':len(newids),'remainingAuthoredLessonLocalePairs':12*len(newids)},'preservation':{'unchangedPriorLessonObjects':126,'unchangedPriorTranslationObjects':1512,'unchangedPriorWeeklyBanks':len(oldchecks),'storedStateKeysAndRecordsModified':False},'nativeReviewed':False,'domainReviewed':False,'courseComplete':False}
 if not dry_run:
  for p,x in [(D/'lessons.ja.json',content),(D/'course-manifest.json',course),(D/'weekly-checks.ja.json',checks),(D/'translations.json',index),(W/'knowledge-ledger.json',ledger),(W/'source-inventory.json',inv),(W/'source-differences.json',diff),(W/'parallel-08-manifest.json',manifest)]:write(p,x)
 print(json.dumps({'dryRun':dry_run,'newLessons':len(newids),'newWeeklyQuestions':48,'counts':manifest['counts']}))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--dry-run',action='store_true');args=parser.parse_args();main(args.dry_run)
