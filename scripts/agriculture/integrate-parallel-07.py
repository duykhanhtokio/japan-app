"""Direct translation batch07: guarded merge, independent review and numeric triage.
--screen [--pair TAG] emits only mechanical candidate keys/values, not source text.
"""
import argparse,collections,hashlib,json,pathlib,re,unicodedata
ROOT=pathlib.Path(__file__).resolve().parents[2];D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-07'
PAIRS={'en-hi':{'en','hi'},'vi-bn':{'vi','bn'},'id-ne':{'id','ne'},'zh-CN-my':{'zh-CN','my'},'zh-TW-km':{'zh-TW','km'},'tl-th':{'tl','th'}}
def read(p):return json.loads(p.read_text())
def write(p,x):p.parent.mkdir(exist_ok=True,parents=True);p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def numbers(text):
 text=unicodedata.normalize('NFKC',text)
 text=''.join(str(unicodedata.digit(c)) if c.isdigit() and unicodedata.category(c)=='Nd' else c for c in text)
 return sorted(collections.Counter(re.findall(r'\d+(?:\.\d+)?',text)).items())
def context():
 lessons={l['id']:l for l in read(D/'lessons.ja.json')['lessons']};assert len(lessons)==126
 wanted=set(read(W/'parallel-06-manifest.json')['newLessonIds']);assert len(wanted)==53
 return lessons,wanted

def numeric_candidates(packet,lessons):
 out=[];cases=0
 for locale,entries in packet['locales'].items():
  for lid,t in entries.items():
   l=lessons[lid];fields=[(f,'-',l[f+'Ja'],t[f]) for f in ['title','objective','activity']]
   fields += [(f,p['id'],p['textJa'] if f=='paragraphs' else p['titleJa'],t[f][p['id']]) for p in l['paragraphs'] for f in ['paragraphs','paragraphTitles']]
   for field,pid,source,target in fields:
    a,b=numbers(source),numbers(target)
    if a or b:
     cases+=1
     if a!=b:out.append({'caseKey':f'{locale}/{lid}/{field}/{pid}','locale':locale,'lessonId':lid,'field':field,'paragraphId':None if pid=='-' else pid,'sourceNumbers':a,'targetNumbers':b,'sourceHash':l['sourceHash'],'targetFieldSha256':hashlib.sha256(target.encode()).hexdigest()})
 return cases,out

def validate_packet(tag,packet,lessons,wanted,complete=True):
 assert set(packet['locales'])==PAIRS[tag]
 count=0
 for loc,entries in packet['locales'].items():
  assert set(entries)<=wanted
  if complete:assert set(entries)==wanted,(tag,loc,len(entries))
  for lid,t in entries.items():
   l=lessons[lid];assert t['sourceHash']==l['sourceHash'];ids={p['id'] for p in l['paragraphs']}
   assert set(t['paragraphs'])==set(t['paragraphTitles'])==ids
   assert t['status']=='translated_ai_unreviewed' and t['translatedDirectlyFrom']=='ja'
   assert t['nativeReviewed'] is t['domainReviewed'] is False
   values=[t[f] for f in ['title','objective','activity']]+list(t['paragraphs'].values())+list(t['paragraphTitles'].values())
   assert all(isinstance(v,str) and v.strip() for v in values)
   assert all(t['paragraphs'][p['id']]!=p['textJa'] for p in l['paragraphs']),'Untranslated whole paragraph'
   count+=1
 if complete:assert count==106
 return count

def screen(tags):
 lessons,wanted=context()
 for tag in tags:
  path=P/f'translations-{tag}.json';packet=read(path);count=validate_packet(tag,packet,lessons,wanted,True);cases,candidates=numeric_candidates(packet,lessons)
  report={'schemaVersion':1,'pair':tag,'packetFile':str(path.relative_to(ROOT)),'packetSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'lessonLocalePairs':count,'numericFieldCases':cases,'candidates':candidates,'semanticCertification':False}
  write(P/f'numeric-screen-{tag}.json',report);print(json.dumps({'pair':tag,'pairs':count,'numericFieldCases':cases,'candidates':len(candidates)}))

def main():
 if (P/'canonical-source-corrections.json').exists():
  raise RuntimeError('PAUSED: staged canonical correction is not implemented; follow parallel-07/RESUME.md before enabling merge')
 lessons,wanted=context();index=read(D/'translations.json');locales={loc:read(D/path) for loc,path in index['shards'].items()};assert sum(map(len,locales.values()))==876,'Already merged or wrong baseline'
 previous={loc:sha(entries) for loc,entries in locales.items()};reports=[];seen=set();total_numeric=0;exceptions=[]
 for tag in PAIRS:
  path=P/f'translations-{tag}.json';packet=read(path);validate_packet(tag,packet,lessons,wanted);original=hashlib.sha256(path.read_bytes()).hexdigest();review=read(P/f'review-{tag}.json')
  assert review['status']=='complete' and review['packetSha256']==original;assert not review.get('unresolvedBlockingIssues',[])
  assert review.get('nativeReviewed',False) is False and review.get('domainReviewed',False) is False
  patches=review.get('patches',[])
  for c in patches:
   t=packet['locales'][c['locale']][c['lessonId']];field=c['field'];assert field in ['title','objective','activity','paragraphs','paragraphTitles']
   if field in ['paragraphs','paragraphTitles']:
    pid=c['paragraphId'];assert t[field][pid]==c['before'];t[field][pid]=c['after']
   else:assert t[field]==c['before'];t[field]=c['after']
  validate_packet(tag,packet,lessons,wanted);cases,candidates=numeric_candidates(packet,lessons);total_numeric+=cases
  accepted={e['caseKey']:e for e in review.get('numericExceptions',[])}
  for c in candidates:
   assert c['caseKey'] in accepted,('Unresolved numeric candidate',c)
   e=accepted[c['caseKey']];assert e.get('reason') and e.get('disposition')=='meaning_preserved';exceptions.append({**c,'reason':e['reason'],'disposition':'independently_reviewed_meaning_preserved'})
  for loc,entries in packet['locales'].items():
   for lid,t in entries.items():
    assert lid not in locales[loc] and (loc,lid) not in seen;seen.add((loc,lid));locales[loc][lid]=t
  reports.append({'pair':tag,'rawPacketSha256':original,'integratedPayloadSha256':sha(packet),'pairs':106,'independentReview':f'parallel-07/review-{tag}.json','appliedPatches':patches,'numericFieldCases':cases,'meaningPreservedNumericExceptions':len(candidates)})
 assert len(seen)==636
 assert all(set(entries)==set(lessons) for entries in locales.values())
 for loc,entries in locales.items():assert sha({lid:t for lid,t in entries.items() if (loc,lid) not in seen})==previous[loc]
 for loc,entries in locales.items():write(D/index['shards'][loc],entries)
 index['authoredLessonCoverage']={'authoredLessons':126,'fullyDraftTranslatedLessons':126,'lessonLocalePairs':1512,'completeForCurrentlyAuthoredLessons':True,'wholeCurriculumComplete':False};write(D/'translations.json',index)
 manifest={'schemaVersion':1,'status':'integrated_pending_runtime_checks','parallelTranslators':6,'independentReviewPackets':6,'newLessonIds':[],'translatedLessonIds':sorted(wanted),'addedLessonLocalePairs':636,'translatedLessonLocalePairs':1512,'authoredJapaneseLessons':126,'authoredLessonsWithAll12Drafts':126,'remainingAuthoredLessonLocalePairs':0,'wholeCurriculumComplete':False,'nativeReviewed':False,'domainReviewed':False,'packets':reports,'numericScreen':{'fieldCases':total_numeric,'exactAfterNormalization':total_numeric-len(exceptions),'meaningPreservedExceptions':exceptions,'unresolvedCandidates':0,'semanticCertification':False}}
 write(W/'parallel-07-manifest.json',manifest);print(json.dumps({k:manifest[k] for k in ['status','addedLessonLocalePairs','translatedLessonLocalePairs','authoredLessonsWithAll12Drafts']}))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--screen',action='store_true');parser.add_argument('--pair',choices=list(PAIRS));args=parser.parse_args()
 if args.screen:screen([args.pair] if args.pair else PAIRS)
 else:main()
