"""Guarded batch06 merge of independently reviewed Japanese source packets.
Preserves all earlier lesson hashes, learner IDs, question revisions and876 drafts.
"""
import hashlib,json,pathlib,re
ROOT=pathlib.Path(__file__).resolve().parents[2];D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-06'
TITLES={'facility-structure':'施設の作物・構造・資材','facility-environment':'施設の環境と育苗','fruit-foundations':'果樹の生育と基本作業','fruit-management':'果樹の管理と収穫','flowers':'花きの分類と品質管理','terms-recognition':'農作業の用語と指示の読み方'}
def read(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def repair(packet,review):
 applied=[]
 for c in review.get('patches',[]):
  kind=c['targetType'];tid=c['targetId']
  if kind=='paragraph':target=next(p for l in packet['lessons'] for p in l['paragraphs'] if p['id']==tid)
  elif kind=='lesson':target=next(l for l in packet['lessons'] if l['id']==tid)
  elif kind=='question':target=next(q for q in packet['questions'] if q['id']==tid)
  elif kind=='diagram':target=packet['conceptDiagram'];assert target['id']==tid
  else:raise ValueError(kind)
  assert c['field'] not in ['sourceHash','lessonSourceHash','id']
  tokens=re.findall(r'[^.\[\]]+',c['field']);obj=target
  for t in tokens[:-1]:obj=obj[int(t)] if isinstance(obj,list) else obj[t]
  key=int(tokens[-1]) if isinstance(obj,list) else tokens[-1]
  assert obj[key]==c['before'],(tid,c['field']);obj[key]=c['after'];applied.append(c)
 for l in packet['lessons']:l['sourceHash']=sha({k:v for k,v in l.items() if k!='sourceHash'})
 byid={l['id']:l for l in packet['lessons']}
 for q in packet['questions']:q['lessonSourceHash']=byid[q['lessonId']]['sourceHash']
 return applied

def main():
 content=read(D/'lessons.ja.json');assert len(content['lessons'])==73,'Wrong baseline or already merged'
 baseline={l['id']:l['sourceHash'] for l in content['lessons']};course=read(D/'course-manifest.json');checks=read(D/'weekly-checks.ja.json');ledger=read(W/'knowledge-ledger.json');inv=read(W/'source-inventory.json');diff=read(W/'source-differences.json');illustrations=read(W/'illustration-register.json');index=read(D/'translations.json');translations={loc:read(D/path) for loc,path in index['shards'].items()};assert sum(map(len,translations.values()))==876
 lids=set(baseline);kids={k['id'] for k in ledger['knowledge']};qids={q['id'] for e in checks['exams'] for q in e['questions']};stems={q['stemJa'] for e in checks['exams'] for q in e['questions']};newids=[];reports=[];diagrams=[];recognition=[]
 for tag,title in TITLES.items():
  path=P/(tag+'.json');packet=read(path);rawsha=hashlib.sha256(path.read_bytes()).hexdigest();review=read(P/('review-'+tag+'.json'))
  assert review['status'] in ['complete','PASS','reviewed'];assert not review.get('unresolvedBlockingIssues',[])
  if review.get('packetSha256'):assert review['packetSha256']==rawsha,'Stale independent review '+tag
  assert review.get('nativeReviewed',False) is False and review.get('domainReviewed',False) is False
  applied=repair(packet,review);ids=[]
  for l in packet['lessons']:
   assert l['id'] not in lids;lids.add(l['id']);ids.append(l['id']);newids.append(l['id'])
   assert l['sourceHash']==sha({k:v for k,v in l.items() if k!='sourceHash'});assert len(l['paragraphs'])>=6
   assert l['humanReviewed'] is l['nativeReviewed'] is l['domainReviewed'] is False
   assert set(l['levels']) and set(l['levels'])<={'1','2'};assert l['terms'] and l['activityJa'] and l['sources']
   content['lessons'].append(l)
  for k in packet['knowledge']:assert k['id'] not in kids;kids.add(k['id']);ledger['knowledge'].append(k)
  weeks={}
  for level in ['1','2']:
   selected=[l['id'] for l in packet['lessons'] if level in l['levels']]
   for off in range(0,len(selected),6):
    n=max(w['number'] for w in course['levels'][level]['weeks'])+1;wid=f'agr-{level}-w{n:02}'
    course['levels'][level]['weeks'].append({'id':wid,'number':n,'titleJa':title,'lessonIds':selected[off:off+6]});weeks.setdefault(level,[]).append(wid)
  byid={l['id']:l for l in content['lessons']};qs=packet['questions'];assert len(qs)==16;positions=[0]*4
  levels=sorted(set.intersection(*(set(byid[q['lessonId']]['levels'])&set(q.get('levels',byid[q['lessonId']]['levels'])) for q in qs)));assert levels
  for i,q in enumerate(qs):
   assert q['id'] not in qids and q['stemJa'] not in stems;qids.add(q['id']);stems.add(q['stemJa'])
   assert len(q['optionsJa'])==len(q['optionReasonsJa'])==4 and len(set(q['optionsJa']))==4;assert all(q['optionReasonsJa']);assert 0<=q['correctIndex']<4
   positions[q['correctIndex']]+=1;assert q['lessonSourceHash']==byid[q['lessonId']]['sourceHash']
   if i>=2:assert not(q['correctIndex']==qs[i-1]['correctIndex']==qs[i-2]['correctIndex'])
  assert positions==[4]*4
  checks['exams'].append({'id':'agr-par06-'+tag+'-check','revision':'v1-'+sha(qs)[:16],'level':levels[0],'levels':levels,'kind':'weekly','weekId':weeks[levels[0]][0],'weekNumber':int(weeks[levels[0]][0].rsplit('w',1)[1]),'weekIdsByLevel':{lev:weeks[lev][0] for lev in levels},'studyWeekIdsByLevel':weeks,'titleJa':title+'の確認','officialSimulation':False,'timeLimitMinutes':None,'passThreshold':None,'questions':qs})
  for r in packet['sourceImagesChecked']:
   doc=next(d for d in inv['documents'] if d['id']==r['documentId']);assert 1<=r['pdfPage']<=doc['pdfPages'];doc['pages'][r['pdfPage']-1]['visualReview']='ai_page_image_checked_not_human_review'
  ledger['holds'].extend(packet.get('holds',[]));diff['verifiedComparisons'].extend(packet.get('comparisons',[]))
  diagram=packet.get('conceptDiagram')
  if diagram:
   assert diagram['kind'] in ['sequence','comparison'];assert diagram['titleJa'] and diagram['altJa'] and len(diagram['panels'])>=2
   for lid in diagram['lessonIds']:assert lid in ids and set(byid[lid]['levels'])<=set(diagram['scopeLevels'])
   for kid in diagram['knowledgeIds']:assert kid in kids
   diagram.update(nativeReviewed=False,domainReviewed=False,notARecognitionPhotograph=True);diagrams.append(diagram)
   illustrations['figures'].append({'id':diagram['id'],'kind':'concept_'+diagram['kind']+'_diagram','implementation':'src/components/agriculture/ConceptDiagrams.tsx','lessonIds':diagram['lessonIds'],'labelsJa':[p['titleJa'] for p in diagram['panels']],'creation':'original_native_layout_no_source_image_copy','aiReviewed':True,'domainReviewed':False,'nativeDeviceTested':False,'notARecognitionPhotograph':True})
  if packet.get('recognitionInventory'):recognition.append(packet['recognitionInventory'])
  if packet.get('colophonMetadata'):
   for colophon in packet['colophonMetadata']:
    doc=next(d for d in inv['documents'] if d['id']==colophon['documentId']);doc['colophonMetadata']=colophon
    if doc['id']=='AGR-S2':doc['edition']={'label':None,'date':colophon['publicationDateJa'],'datePrecision':'month','basis':'Japanese colophon PDF132 directly inspected; English publisher-line date conflicts','status':'Japanese_publication_month_verified_version_label_unconfirmed','englishPublisherLineDate':colophon.get('englishPublisherLineDate'),'dateDiscrepancy':colophon.get('dateDiscrepancy')}
  if packet.get('nonInstructionalExclusions'):inv.setdefault('nonInstructionalExclusions',[]).extend(packet['nonInstructionalExclusions'])
  reports.append({'worker':tag,'packetSha256':rawsha,'integratedPayloadSha256':sha(packet),'independentReview':'parallel-06/review-'+tag+'.json','newLessonIds':ids,'knowledgeUnits':len(packet['knowledge']),'weeklyQuestions':16,'appliedPatches':applied,'holds':packet.get('holds',[])})
 assert len(newids)>=40 and len(diagrams)==3
 assert all(next(l['sourceHash'] for l in content['lessons'] if l['id']==lid)==h for lid,h in baseline.items())
 for k in ledger['knowledge']:
  k['questionIds']=sorted(set(k.get('questionIds',[]))|{q['id'] for e in checks['exams'] for q in e['questions'] if k['id'] in q['knowledgeIds']})
  k['figureIds']=sorted(set(k.get('figureIds',[]))|{d['id'] for d in diagrams if k['id'] in d['knowledgeIds']})
 for doc in inv['documents']:
  for p in doc['pages']:
   p['knowledgeIds']=[k['id'] for k in ledger['knowledge'] if any(r['documentId']==doc['id'] and r['pdfPage']==p['pdfPage'] for r in k['sources'])]
   if p['knowledgeIds']:p['status']='partially_mapped_to_authored_content'
 root_review_path=P/'root-source-review.json'
 if root_review_path.exists():
  root_review=read(root_review_path)
  for row in root_review['pageImagesChecked']:
   doc=next(d for d in inv['documents'] if d['id']==row['documentId']);doc['pages'][row['pdfPage']-1]['visualReview']='ai_page_image_checked_not_human_review'
  inv.setdefault('nonInstructionalExclusions',[]).extend(root_review['nonInstructionalExclusions']);ledger['holds'].extend(root_review['holds'])
 inv['visualPagesChecked']=sum(p['visualReview']!='pending' for doc in inv['documents'] for p in doc['pages']);inv['allPageImagesAiChecked']=inv['visualPagesChecked']==237;course['revision']='v6'
 fully=sum(all(l['id'] in t and t[l['id']]['sourceHash']==l['sourceHash'] for t in translations.values()) for l in content['lessons'])
 index['authoredLessonCoverage']={'authoredLessons':len(content['lessons']),'fullyDraftTranslatedLessons':fully,'lessonLocalePairs':876,'completeForCurrentlyAuthoredLessons':False,'wholeCurriculumComplete':False}
 for p,x in [(D/'lessons.ja.json',content),(D/'course-manifest.json',course),(D/'weekly-checks.ja.json',checks),(D/'translations.json',index),(D/'diagrams.json',{'schemaVersion':1,'diagrams':diagrams}),(W/'knowledge-ledger.json',ledger),(W/'source-inventory.json',inv),(W/'source-differences.json',diff),(W/'illustration-register.json',illustrations)]:write(p,x)
 manifest={'schemaVersion':1,'status':'integrated_pending_checks','workers':reports,'newLessonIds':newids,'newTranslations':0,'counts':{'lessons':len(content['lessons']),'knowledgeUnits':len(ledger['knowledge']),'weeklyQuestions':sum(len(e['questions']) for e in checks['exams']),'lessonLocalePairs':876,'pageImagesChecked':inv['visualPagesChecked'],'conceptDiagrams':len(illustrations['figures']),'authoredLessonsMissingAll12Drafts':len(content['lessons'])-fully,'remainingAuthoredLessonLocalePairs':12*(len(content['lessons'])-fully)},'recognitionInventoryPayloads':recognition,'nativeReviewed':False,'domainReviewed':False,'courseComplete':False}
 if recognition:
  assert len(recognition)==1
  ri={'schemaVersion':1,**recognition[0],'nativeReviewed':False,'domainReviewed':False,'inventoryScope':'End-of-book photo lists only; not a complete count of every inline textbook figure'}
  if root_review_path.exists():ri['additionalInlineScopePending']='See parallel-06/root-source-review.json for six source2PDF50 equipment photos; other inline figures still require inventory/recognition mapping.'
  write(W/'recognition-inventory.json',ri)
 terms=read(P/'terms-recognition.json')
 write(W/'glossary-inventory.json',{'schemaVersion':1,**terms['glossaryInventory'],'humanReviewed':False,'domainReviewed':False})
 manifest['recognitionInventoryFiles']=['recognition-inventory.json','glossary-inventory.json']
 manifest['allPageImagesAiChecked']=inv['allPageImagesAiChecked']
 if root_review_path.exists():manifest['rootSourceReview']='parallel-06/root-source-review.json'
 manifest.pop('recognitionInventoryPayloads')
 write(W/'parallel-06-manifest.json',manifest)
 print(json.dumps({'newLessons':len(newids),'totalLessons':len(content['lessons']),'newWeeklyQuestions':96,'newConceptDiagrams':len(diagrams)}))
if __name__=='__main__':main()
