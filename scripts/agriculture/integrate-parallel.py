"""Validate and integrate the six disjoint agriculture workers.
Run once against the recorded base. Existing IDs/locale entries may never be overwritten.
Worker payloads are intermediate; canonical output and digest/decision manifest are persisted.
"""
import hashlib,json,pathlib,re
ROOT=pathlib.Path(__file__).resolve().parents[2];D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-03'
def read(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def apply_editorial(worker,tag):
 review=read(P/('review-'+tag+'.json'));applied=[];questions={q['id']:q for q in worker['questions']}
 def patch(qid,change):
  q=questions[qid];m=re.fullmatch(r'(optionsJa|optionReasonsJa)\[(\d)\]',change['field']);assert m,change
  field,index=m.group(1),int(m.group(2));assert index!=q['correctIndex'];assert q[field][index]==change['before'],change
  q[field][index]=change['after'];applied.append({'targetId':qid,**change})
 if tag=='crop-management':
  for issue in review['blockingIssues']:
   assert issue['severity']=='editorial_required_before_assessment_acceptance'
   for change in issue['proposedChanges']:patch(change['id'],change)
 elif tag=='fertilizer':
  assert not review['sourceFactBlockers']
  for issue in review['requiredChanges']:
   for change in issue['patches']:patch(issue['id'],change)
 else:
  assert not review['blockingIssues']
  for change in review['nonBlockingSuggestions']:
   if change['targetId']=='agr-water-methods-p4':
    lesson=next(l for l in worker['lessons'] if l['id']=='agr-water-methods');paragraph=next(x for x in lesson['paragraphs'] if x['id']==change['targetId']);assert paragraph['textJa']==change['before'];paragraph['textJa']=change['after'];applied.append(change)
   else:
    q=questions[change['targetId']];index=q['optionsJa'].index(change['before']['option']);assert index!=q['correctIndex'];assert q['optionReasonsJa'][index]==change['before']['reason'];q['optionsJa'][index]=change['after']['option'];q['optionReasonsJa'][index]=change['after']['reason'];applied.append(change)
 for l in worker['lessons']:l['sourceHash']=sha({k:v for k,v in l.items() if k!='sourceHash'})
 byid={l['id']:l for l in worker['lessons']}
 for q in worker['questions']:q['lessonSourceHash']=byid[q['lessonId']]['sourceHash']
 return applied
def apply_translation_editorial(worker,tag,lessons):
 name={'translations-a':'translation-a-meaning-qa','translations-b':'translation-b-meaning-qa','translations-c':'translation-c-meaning-qa'}[tag]
 review=read(P/(name+'.json'));changes=review.get('proposedCorrections',[]) if tag=='translations-a' else review.get('issues',[]) if tag=='translations-c' else []
 applied=[]
 for change in changes:
  t=worker['locales'][change['locale']][change['lessonId']];l=lessons[change['lessonId']];assert t['sourceHash']==l['sourceHash'];kind,pid=change['field'].split('.',1);assert kind=='paragraphs';assert t[kind][pid]==change['before'];source=next(p['textJa'] for p in l['paragraphs'] if p['id']==pid);assert source==change['sourceJa'];t[kind][pid]=change['after'];applied.append(change)
 return applied
def main():
 content=read(D/'lessons.ja.json');ledger=read(W/'knowledge-ledger.json');course=read(D/'course-manifest.json');checks=read(D/'weekly-checks.ja.json');translations=read(D/'translations.json');inventory=read(W/'source-inventory.json');comparisons=read(W/'source-differences.json')
 assert len(content['lessons'])==15,'Run against pre-parallel base only; do not replay a completed merge'
 lessonids={l['id'] for l in content['lessons']};knowledgeids={k['id'] for k in ledger['knowledge']};qids={q['id'] for e in checks['exams'] for q in e['questions']};stems={q['stemJa'] for e in checks['exams'] for q in e['questions']};reports=[];newlessons=[]
 for tag in ['water-soil','fertilizer','crop-management']:
  worker=read(P/(tag+'.json'));originalsha=sha(worker);repairs=apply_editorial(worker,tag);batch=worker['lessons'];added=[]
  for l in batch:
   assert l['id'] not in lessonids,l['id'];assert l['sourceHash']==sha({k:v for k,v in l.items() if k!='sourceHash'}),l['id'];assert len(l['paragraphs'])>=6
   assert l['levels'] and set(l['levels'])<={'1','2'};assert l['humanReviewed'] is l['nativeReviewed'] is l['domainReviewed'] is False
   lessonids.add(l['id']);content['lessons'].append(l);newlessons.append(l['id']);added.append(l['id'])
  for k in worker['knowledge']:
   assert k['id'] not in knowledgeids;knowledgeids.add(k['id']);ledger['knowledge'].append(k)
  weekIds={}
  for level in ['1','2']:
   selected=[l['id'] for l in batch if level in l['levels']]
   for offset in range(0,len(selected),6):
    n=max(w['number'] for w in course['levels'][level]['weeks'])+1;wid=f'agr-{level}-w{n:02}';ids=selected[offset:offset+6]
    course['levels'][level]['weeks'].append({'id':wid,'number':n,'titleJa':{'water-soil':'かん水と土づくり','fertilizer':'肥料・施肥と排水','crop-management':'作物の管理と保護'}[tag],'lessonIds':ids});weekIds.setdefault(level,[]).append(wid)
  questions=worker['questions'];assert len(questions)==16,tag
  bylesson={l['id']:l for l in content['lessons']};scope=set.intersection(*(set(bylesson[q['lessonId']]['levels']) for q in questions));assert scope,tag
  counts=[0]*4
  for i,q in enumerate(questions):
   assert q['id'] not in qids and q['stemJa'] not in stems;qids.add(q['id']);stems.add(q['stemJa']);l=bylesson[q['lessonId']];assert q['lessonSourceHash']==l['sourceHash'];assert len(q['optionsJa'])==len(q['optionReasonsJa'])==4;assert len(set(q['optionsJa']))==4
   counts[q['correctIndex']]+=1
   if i>=2:assert not(q['correctIndex']==questions[i-1]['correctIndex']==questions[i-2]['correctIndex'])
  assert counts==[4]*4
  levels=sorted(scope);n=int(weekIds[levels[0]][0].rsplit('w',1)[1]);eid=f'agr-shared-par03-{tag}'
  checks['exams'].append({'id':eid,'revision':'v1-'+sha(questions)[:16],'level':levels[0],'levels':levels,'kind':'weekly','weekId':weekIds[levels[0]][0],'weekNumber':n,'weekIdsByLevel':{l:weekIds[l][0] for l in levels},'titleJa':{'water-soil':'かん水・土づくりの確認','fertilizer':'肥料・排水の確認','crop-management':'作物管理・保護の確認'}[tag],'officialSimulation':False,'timeLimitMinutes':None,'passThreshold':None,'questions':questions,'studyWeekIdsByLevel':weekIds})
  for page in worker['sourceImagesChecked']:
   doc=next(d for d in inventory['documents'] if d['id']==page['documentId']);assert 1<=page['pdfPage']<=doc['pdfPages'];doc['pages'][page['pdfPage']-1]['visualReview']='ai_page_image_checked_not_human_review'
  ledger['holds'].extend(worker.get('holds',[]));comparisons['verifiedComparisons'].extend(worker.get('comparisons',[]));reports.append({'worker':tag,'originalPayloadSha256':originalsha,'integratedPayloadSha256':sha(worker),'editorialRepairs':repairs,'lessons':added,'questions':len(questions),'review':worker.get('review',{}),'comparisons':worker.get('comparisons',[]),'holds':worker.get('holds',[])})
 locales=set(translations['locales']);pairs=0
 for tag in ['translations-a','translations-b','translations-c']:
  worker=read(P/(tag+'.json'));originalsha=sha(worker);assert set(worker['locales'])==locales
  bylesson={l['id']:l for l in content['lessons']};repairs=apply_translation_editorial(worker,tag,bylesson);ids=set()
  for locale,entries in worker['locales'].items():
   for lid,t in entries.items():
    assert lid not in translations['locales'][locale],(locale,lid);l=bylesson[lid];assert t['sourceHash']==l['sourceHash'];expected={p['id'] for p in l['paragraphs']};assert set(t['paragraphs'])==set(t['paragraphTitles'])==expected;assert all(t['paragraphs'].values()) and all(t['paragraphTitles'].values());assert t['title'] and t['objective'] and t['activity'];assert t['status']=='translated_ai_unreviewed' and t['nativeReviewed'] is False and t['translatedDirectlyFrom']=='ja'
    translations['locales'][locale][lid]=t;ids.add(lid);pairs+=1
  reports.append({'worker':tag,'originalPayloadSha256':originalsha,'integratedPayloadSha256':sha(worker),'editorialRepairs':repairs,'lessonIds':sorted(ids),'lessonLocalePairs':sum(map(len,worker['locales'].values())),'review':worker.get('review',{})})
 assert pairs==156,pairs
 # Shard by selected locale to keep each content file and each publication bounded.
 for locale,entries in translations['locales'].items():write(D/'translations'/f'{locale}.json',entries)
 write(D/'translations.json',{'schemaVersion':2,'complete':False,'locales':sorted(locales),'shards':{l:f'translations/{l}.json' for l in sorted(locales)},'status':'translated_ai_unreviewed','nativeReviewed':False})
 for k in ledger['knowledge']:
  k['questionIds']=sorted(set(k.get('questionIds',[]))|{q['id'] for e in checks['exams'] for q in e['questions'] if k['id'] in q['knowledgeIds']})
 for doc in inventory['documents']:
  for p in doc['pages']:
   p['knowledgeIds']=[k['id'] for k in ledger['knowledge'] if any(r['documentId']==doc['id'] and r['pdfPage']==p['pdfPage'] for r in k['sources'])]
   if p['knowledgeIds']:p['status']='partially_mapped_to_authored_content'
 inventory['visualPagesChecked']=sum(p['visualReview']!='pending' for d in inventory['documents'] for p in d['pages']);course['revision']='v3'
 for path,value in [(D/'lessons.ja.json',content),(D/'course-manifest.json',course),(D/'weekly-checks.ja.json',checks),(W/'knowledge-ledger.json',ledger),(W/'source-inventory.json',inventory),(W/'source-differences.json',comparisons)]:write(path,value)
 write(W/'parallel-03-manifest.json',{'schemaVersion':1,'status':'integrated_pending_checks','workers':reports,'newLessonIds':newlessons,'newTranslations':pairs,'counts':{'lessons':len(content['lessons']),'knowledgeUnits':len(ledger['knowledge']),'weeklyQuestions':sum(len(e['questions']) for e in checks['exams']),'lessonLocalePairs':sum(len(x) for x in translations['locales'].values()),'pageImagesChecked':inventory['visualPagesChecked']},'nativeReviewed':False,'domainReviewed':False,'courseComplete':False})
 print(json.dumps({'newLessons':len(newlessons),'newTranslations':pairs,'totalLessons':len(content['lessons'])}))
if __name__=='__main__':main()
