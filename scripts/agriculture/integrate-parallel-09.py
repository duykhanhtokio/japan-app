"""Guarded direct-translation merge with frozen review bindings and numeric triage."""
import argparse,hashlib,importlib.util,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2];D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-09'
spec=importlib.util.spec_from_file_location('batch07',ROOT/'scripts/agriculture/integrate-parallel-07.py');old=importlib.util.module_from_spec(spec);spec.loader.exec_module(old)
PAIRS=old.PAIRS;read=old.read;write=old.write;sha=old.sha
def context():
 lessons={l['id']:l for l in read(D/'lessons.ja.json')['lessons']};wanted=set(read(W/'parallel-08-manifest.json')['newLessonIds']);assert len(lessons)==144 and len(wanted)==18
 return lessons,wanted
def validate(tag,packet,lessons,wanted):
 assert packet['schemaVersion']==2 and set(packet['locales'])==PAIRS[tag]
 count=0
 for loc,entries in packet['locales'].items():
  assert set(entries)==wanted
  for lid,t in entries.items():
   l=lessons[lid];assert t['sourceHash']==l['sourceHash'];ids={p['id'] for p in l['paragraphs']}
   assert set(t['paragraphs'])==set(t['paragraphTitles'])==ids
   assert t['status']=='translated_ai_unreviewed' and t['translatedDirectlyFrom']=='ja'
   assert t['nativeReviewed'] is t['domainReviewed'] is False
   values=[t[f] for f in ['title','objective','activity']]+list(t['paragraphs'].values())+list(t['paragraphTitles'].values())
   assert len(values)==15 and all(isinstance(v,str) and v.strip() for v in values)
   assert all(t['paragraphs'][p['id']]!=p['textJa'] for p in l['paragraphs'])
   count+=1
 assert count==36
def screen(tags):
 lessons,wanted=context()
 for tag in tags:
  path=P/f'translations-{tag}.json';packet=read(path);validate(tag,packet,lessons,wanted);cases,candidates=old.numeric_candidates(packet,lessons)
  write(P/f'numeric-screen-{tag}.json',{'schemaVersion':1,'pair':tag,'packetSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'lessonLocalePairs':36,'numericFieldCases':cases,'candidates':candidates,'semanticCertification':False})
  print(json.dumps({'pair':tag,'pairs':36,'numericFieldCases':cases,'candidates':len(candidates)}))
def main(dry_run=False):
 lessons,wanted=context();index=read(D/'translations.json');locales={loc:read(D/path) for loc,path in index['shards'].items()};assert sum(map(len,locales.values()))==1512,'Wrong baseline or already merged'
 previous={loc:sha(entries) for loc,entries in locales.items()};reports=[];seen=set();total_numeric=0;exceptions=[]
 for tag in PAIRS:
  path=P/f'translations-{tag}.json';packet=read(path);validate(tag,packet,lessons,wanted);raw=hashlib.sha256(path.read_bytes()).hexdigest();review=read(P/f'review-{tag}.json')
  assert review['status']=='complete' and review['packetSha256']==raw and not review.get('unresolvedBlockingIssues',[])
  assert not any(review.get(f,False) for f in ['nativeReviewed','domainReviewed','humanReviewed'])
  scope=review['scope'];assert set(scope['locales'])==PAIRS[tag] and set(scope['lessonIds'])==wanted
  assert scope['lessonLocalePairsReviewed']==36 and scope['fieldsReviewed']==540
  keys=set()
  for c in review.get('patches',[]):
   assert c['locale'] in PAIRS[tag] and c['lessonId'] in wanted and c['field'] in ['title','objective','activity','paragraphs','paragraphTitles']
   key=(c['locale'],c['lessonId'],c['field'],c.get('paragraphId'));assert key not in keys;keys.add(key)
   t=packet['locales'][c['locale']][c['lessonId']]
   if c['field'] in ['paragraphs','paragraphTitles']:obj=t[c['field']];field=c['paragraphId']
   else:obj=t;field=c['field']
   assert obj[field]==c['before'];assert c['after'].strip() and c['reason'];obj[field]=c['after']
  validate(tag,packet,lessons,wanted);cases,candidates=old.numeric_candidates(packet,lessons);total_numeric+=cases
  accepted={e['caseKey']:e for e in review.get('numericExceptions',[])}
  for c in candidates:
   assert c['caseKey'] in accepted,('Unresolved numeric candidate',c)
   e=accepted[c['caseKey']];assert e.get('reason') and e.get('disposition')=='meaning_preserved';exceptions.append({**c,'reason':e['reason'],'disposition':'independently_reviewed_meaning_preserved'})
  for loc,entries in packet['locales'].items():
   for lid,t in entries.items():assert lid not in locales[loc];seen.add((loc,lid));locales[loc][lid]=t
  reports.append({'pair':tag,'rawPacketSha256':raw,'integratedPayloadSha256':sha(packet),'pairs':36,'independentReview':f'parallel-09/review-{tag}.json','appliedPatches':review.get('patches',[]),'numericFieldCases':cases,'meaningPreservedNumericExceptions':len(candidates)})
 assert len(seen)==216 and all(set(entries)==set(lessons) for entries in locales.values())
 for loc,entries in locales.items():assert sha({lid:t for lid,t in entries.items() if (loc,lid) not in seen})==previous[loc]
 index['authoredLessonCoverage']={'authoredLessons':144,'fullyDraftTranslatedLessons':144,'lessonLocalePairs':1728,'completeForCurrentlyAuthoredLessons':True,'wholeCurriculumComplete':False}
 manifest={'schemaVersion':1,'status':'integrated_pending_runtime_checks','parallelTranslators':6,'independentReviewPackets':6,'newLessonIds':[],'translatedLessonIds':sorted(wanted),'addedLessonLocalePairs':216,'translatedLessonLocalePairs':1728,'authoredJapaneseLessons':144,'authoredLessonsWithAll12Drafts':144,'remainingAuthoredLessonLocalePairs':0,'wholeCurriculumComplete':False,'nativeReviewed':False,'domainReviewed':False,'packets':reports,'preservation':{'unchangedJapaneseLessonObjects':144,'unchangedPriorTranslationObjects':1512,'storedStateKeysAndRecordsModified':False},'numericScreen':{'fieldCases':total_numeric,'exactAfterNormalization':total_numeric-len(exceptions),'meaningPreservedExceptions':exceptions,'unresolvedCandidates':0,'semanticCertification':False}}
 if not dry_run:
  for loc,entries in locales.items():write(D/index['shards'][loc],entries)
  write(D/'translations.json',index);write(W/'parallel-09-manifest.json',manifest)
 print(json.dumps({'dryRun':dry_run,'addedLessonLocalePairs':216,'translatedLessonLocalePairs':1728}))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--dry-run',action='store_true');parser.add_argument('--screen',action='store_true');parser.add_argument('--pair',choices=list(PAIRS));args=parser.parse_args()
 if args.screen:screen([args.pair] if args.pair else PAIRS)
 else:main(args.dry_run)
