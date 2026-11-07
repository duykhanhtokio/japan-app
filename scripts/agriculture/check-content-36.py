"""Verify one additive source-bound lesson and12 explicitly reviewed translations."""
import hashlib,json,subprocess,copy
from pathlib import Path
R=Path(__file__).resolve().parents[2];W=R/'docs/ssw-workspace/agriculture/source-next-36'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def digest(o):return hashlib.sha256(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def old(path):return subprocess.check_output(['git','show',BASE+':'+path],cwd=R)
BASE=read(W/'baseline-file-hashes.json')['baseCommit'];master=read(W/'japanese-reviewed.json');lesson=master['lessons'][0];lid=lesson['id'];assert lesson['sourceHash']==digest({k:v for k,v in lesson.items() if k!='sourceHash'})
content=read(R/'src/data/agriculture/lessons.ja.json');before=json.loads(old('src/data/agriculture/lessons.ja.json'));assert content['lessons']==before['lessons']+[lesson]
assert len(content['lessons'])==188 and len(lesson['paragraphs'])==6 and lesson['levels']==['2']
author=W/'fruit-lesson.ja.json';peer=read(W/'review-fruit-lesson-adopted.json');assert peer['authorPacketSha256']==sha(author);assert peer['author']!=peer['reviewer'];assert not peer['unresolvedBlockingIssues']
original=read(author);adopted=copy.deepcopy(original)
for patch in peer['patches']:
 p=next(p for p in adopted['lessons'][0]['paragraphs'] if p['id']==patch['paragraphId']);assert p[patch['field']]==patch['before'] and patch['before']!=patch['after'];p[patch['field']]=patch['after']
assert adopted['lessons'][0]['paragraphs']==lesson['paragraphs']
assert master['authorPacketSha256']==sha(author) and master['reviewPacketSha256']==sha(W/'review-fruit-lesson-adopted.json')
for name in ['general','soil','safety','rice','facility-fruit','flower-equipment']:
 a=W/(name+'.json');v=read(W/('review-'+name+'.json'))
 candidates=[v[k] for k in ['authorPacketSha256','reviewedPacketSha256','sourceAuthorSha256'] if k in v]
 assert sha(a) in candidates, 'unbound audit peer '+name
fields=patches=0
for pair in ['vi-id','en-hi','bn-ne','zh-CN-zh-TW','my-th','km-tl']:
 p=W/f'translations-{pair}.json';a=read(p);v=read(W/f'translation-review-{pair}.json');assert a['sourceMasterSha256']==v['sourceMasterSha256']==sha(W/'japanese-reviewed.json');assert v['authorPacketSha256']==sha(p);assert v['author']!=v['reviewer'];assert v['fieldsReviewed']==30 and v['lessonLocalePairsReviewed']==2 and not v['unresolvedBlockingIssues'];loc=copy.deepcopy(a['locales'])
 for patch in v['patches']:
  t=loc[patch['locale']][lid];field=patch['field'];obj=t[field] if field in ['paragraphs','paragraphTitles'] else t;key=patch.get('paragraphId') if field in ['paragraphs','paragraphTitles'] else field;assert obj[key]==patch['before'] and patch['before']!=patch['after'];obj[key]=patch['after'];patches+=1
 for locale,entries in loc.items():
  path='src/data/agriculture/translations/'+locale+'.json';shard=read(R/path);previous=json.loads(old(path));assert set(shard)==set(previous)|{lid};assert {k:v for k,v in shard.items() if k!=lid}==previous
  expected=entries[lid];expected['domainReviewed']=False;assert shard[lid]==expected and expected['sourceHash']==lesson['sourceHash']
  assert expected['status']=='translated_ai_unreviewed' and expected['translatedDirectlyFrom']=='ja' and not expected['nativeReviewed']
  assert set(expected['paragraphs'])==set(expected['paragraphTitles'])=={p['id'] for p in lesson['paragraphs']};fields+=15
assert fields==180
ledger=read(R/'docs/ssw-workspace/agriculture/knowledge-ledger.json');previous=json.loads(old('docs/ssw-workspace/agriculture/knowledge-ledger.json'));assert ledger['knowledge']==previous['knowledge']+master['knowledge']
course=read(R/'src/data/agriculture/course-manifest.json');prev=json.loads(old('src/data/agriculture/course-manifest.json'));assert course['levels']['1']==prev['levels']['1'];assert course['levels']['2']['weeks'][:-1]==prev['levels']['2']['weeks'];assert course['levels']['2']['weeks'][-1]['lessonIds']==[lid]
for path in ['src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/mock-exams.ja.json','src/data/agriculture/recognition-images.json','src/components/agriculture/AgricultureCourse.tsx','src/components/agriculture/RecognitionImages.tsx','src/components/agriculture/ConceptDiagrams.tsx','src/services/agriculture-study-state.ts','src/services/kensetsu-test-state.ts','docs/ssw-workspace/agriculture/source-gap-backlog.json','docs/ssw-workspace/agriculture/illustration-register.json']:
 assert (R/path).read_bytes()==old(path),'protected changed '+path
ov=read(R/'docs/ssw-workspace/agriculture/source-gap-reconciliation-36.json');ids=[sid for row in ov['resolutions'] for sid in row['sourceItemIds']];assert len(ids)==len(set(ids))==6 and set(ids)=={'AGR-A10-FACILITY-'+n for n in ['0601','0611','0612','0650','0651','0652']}
assert ov['summary']['candidateRemainingMissingOrPartialOccurrencesFromBaseline']==1184
prior={sid for n in [11,12,22,27,30,34] for row in read(R/f'docs/ssw-workspace/agriculture/source-gap-reconciliation-{n}.json')['resolutions'] if row['disposition']=='covered_by_new_prose' for sid in row['sourceItemIds']}
assert not prior & set(ids) and len(prior|set(ids))==375
for path,expected in read(W/'baseline-file-hashes.json')['files'].items():assert hashlib.sha256(old(path)).hexdigest()==expected,'baseline evidence changed '+path

for row in ov['resolutions']:
 for b in row['evidenceBindings']:
  p=next(p for p in lesson['paragraphs'] if p['id']==b['paragraphId']);assert b['paragraphSha256']==digest(p) and b['lessonSourceHash']==lesson['sourceHash']
assert all(not k[field] for k in master['knowledge'] for field in ['humanReviewed','domainReviewed','nativeReviewed'])
manifestPath=W/'manifest.json'
if manifestPath.exists():
 manifest=read(manifestPath)
 for path,expected in manifest['artifactSha256'].items():assert sha(R/path)==expected,'artifact changed '+path
 assert manifest['runtime']['japaneseLessons']==188 and manifest['sourceSummary']['candidateRemainingMissingOrPartialOccurrencesFromBaseline']==1184
print(json.dumps({'status':'PASS','newLessons':1,'newUnits':6,'reviewedTranslationFields':fields,'translationPatches':patches,'newTranslations':12,'oldLessonsPreserved':187,'oldTranslationsPreserved':2244,'sourceOccurrencesExpressed':6,'candidateRemaining':1184,'newQuestions':0,'weeklyUnchanged':421,'mocksUnchanged':160,'rastersUnchanged':62}))
