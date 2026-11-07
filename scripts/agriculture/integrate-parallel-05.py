"""Integrate six disjoint direct translation cohorts; validate before any canonical write."""
import hashlib,json,pathlib,unicodedata,re
ROOT=pathlib.Path(__file__).resolve().parents[2]
D=ROOT/'src/data/agriculture';W=ROOT/'docs/ssw-workspace/agriculture';P=W/'parallel-05'
def read(p):return json.loads(p.read_text())
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def numbers(text):
 text=unicodedata.normalize('NFKC',text)
 text=''.join(str(unicodedata.digit(c)) if c.isdigit() and unicodedata.category(c)=='Nd' else c for c in text)
 return re.findall(r'\d+(?:\.\d+)?',text)
def main():
 content=read(D/'lessons.ja.json');lessons={l['id']:l for l in content['lessons']};assert len(lessons)==73
 index=read(D/'translations.json');locales={loc:read(D/path) for loc,path in index['shards'].items()}
 assert sum(map(len,locales.values()))==516,'Baseline changed or already merged'
 prior={loc:sha(entries) for loc,entries in locales.items()};reports=[];seen=set();numeric=[]
 groups={'safety':'agr-safety-','rice':'agr-ricework-','vegetable':'agr-vegwork-'}
 for tag,prefix in groups.items():
  wanted={lid for lid in lessons if lid.startswith(prefix)};assert len(wanted)==10
  for suffix,langs in [('a',{'en','vi','id','zh-CN','zh-TW','tl'}),('b',{'hi','bn','ne','my','th','km'})]:
   path=P/f'translations-{tag}-{suffix}.json';packet=read(path);assert set(packet['locales'])==langs;count=0
   original_sha=hashlib.sha256(path.read_bytes()).hexdigest()
   review=read(P/f'review-{tag}-{suffix}.json')
   if 'packetSha256' in review:assert review['packetSha256']==original_sha,'Independent review has stale packet binding'
   assert review.get('status') in ['complete','PASS','reviewed'], 'Independent review incomplete'
   patches=review.get('patches',[])
   for patch in patches:
    entry=packet['locales'][patch['locale']][patch['lessonId']]
    field=patch['field'];assert field in ['title','objective','activity','paragraphs','paragraphTitles']
    if field in ['paragraphs','paragraphTitles']:
     pid=patch['paragraphId'];assert entry[field][pid]==patch['before'];entry[field][pid]=patch['after']
    else:assert entry[field]==patch['before'];entry[field]=patch['after']
   assert not review.get('unresolvedBlockingIssues',[]), 'Unresolved independent review blocker'
   for loc,entries in packet['locales'].items():
    assert set(entries)==wanted
    for lid,t in entries.items():
     l=lessons[lid];assert lid not in locales[loc];assert (loc,lid) not in seen;seen.add((loc,lid));assert t['sourceHash']==l['sourceHash'];ids={p['id'] for p in l['paragraphs']}
     assert set(t['paragraphs'])==set(t['paragraphTitles'])==ids
     assert t['translatedDirectlyFrom']=='ja' and t['status']=='translated_ai_unreviewed'
     assert t['nativeReviewed'] is t['domainReviewed'] is False
     values=[t[k] for k in ['title','objective','activity']]+list(t['paragraphs'].values())+list(t['paragraphTitles'].values())
     assert all(isinstance(v,str) and v.strip() for v in values)
     assert all(t['paragraphs'][p['id']]!=p['textJa'] for p in l['paragraphs']),'Untranslated full paragraph'
     for p in l['paragraphs']:
      # A number screen flags candidates, not semantic correctness. Level labels can be spelled out.
      src=numbers(p['textJa']);target=numbers(t['paragraphs'][p['id']])
      if src and not(p['id'].startswith('agr-safety-') and src==['2']) and not(p['id'].startswith('agr-vegwork-') and src==['2']) and not(p['id'].startswith('agr-ricework-stages-') and src==['2']):
       numeric.append({'locale':loc,'paragraphId':p['id'],'sourceNumbers':src,'targetNumbers':target,'match':src==target})
     locales[loc][lid]=t;count+=1
   assert count==60
   reports.append({'packet':str(path.relative_to(ROOT)),'sha256':original_sha,'integratedPayloadSha256':sha(packet),'independentReview':str((P/f'review-{tag}-{suffix}.json').relative_to(ROOT)),'appliedPatches':patches,'pairs':count,'review':packet.get('review',{})})
 assert len(seen)==360
 assert all(set(entries)==set(lessons) for entries in locales.values())
 # Ensure every prior authored translation remains byte-equivalent at the object level.
 for loc,entries in locales.items():assert sha({lid:t for lid,t in entries.items() if (loc,lid) not in seen})==prior[loc]
 bad=[r for r in numeric if not r['match']]
 if bad:
  write(P/'numeric-candidates.json',{'candidates':bad});raise AssertionError('Resolve numeric candidates before integration')
 for loc,entries in locales.items():write(D/index['shards'][loc],entries)
 index['authoredLessonCoverage']={'authoredLessons':73,'fullyDraftTranslatedLessons':73,'lessonLocalePairs':876,'completeForCurrentlyAuthoredLessons':True,'wholeCurriculumComplete':False}
 write(D/'translations.json',index)
 manifest={'schemaVersion':1,'status':'integrated_pending_runtime_checks','workers':6,'addedLessonLocalePairs':360,'translatedLessonLocalePairs':876,'authoredJapaneseLessons':73,'authoredLessonsWithAll12Drafts':73,'remainingAuthoredLessonLocalePairs':0,'wholeCurriculumComplete':False,'nativeReviewed':False,'domainReviewed':False,'packets':reports,'numericScreen':{'paragraphLocaleCases':len(numeric),'mismatches':0,'semanticCertification':False}}
 write(W/'parallel-05-manifest.json',manifest)
 print(json.dumps({k:manifest[k] for k in ['status','addedLessonLocalePairs','translatedLessonLocalePairs','authoredLessonsWithAll12Drafts']}))
if __name__=='__main__':main()
