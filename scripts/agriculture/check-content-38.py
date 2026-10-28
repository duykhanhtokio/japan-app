"""Verify six additive source lessons and their reviewed direct JA translations."""
import copy,hashlib,json,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[2];W=R/'docs/ssw-workspace/agriculture/content-38'
def read(p):return json.loads(p.read_text())
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def digest(o):return hashlib.sha256(json.dumps(o,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
BASE=read(W/'baseline-file-hashes.json')['baseCommit']
def old(p):return subprocess.check_output(['git','show',BASE+':'+p],cwd=R)
m=read(W/'japanese-reviewed.json');lessons=m['lessons'];ids={l['id'] for l in lessons};byid={l['id']:l for l in lessons}
assert len(ids)==6 and len(m['knowledge'])==36
for entry in m['sourcePackets']:
 a=W/entry['path'];v=W/entry['reviewPath'];assert sha(a)==entry['sha256'] and sha(v)==entry['reviewSha256'];peer=read(v);assert peer['authorPacketSha256']==sha(a) and not peer.get('unresolvedBlockingIssues',[])
 assert peer['author']!=peer['reviewer']
 d=copy.deepcopy(read(a))
 for patch in peer.get('patches',[]):
  l=next(l for l in d['lessons'] if l['id']==patch['lessonId']);p=next(p for p in l['paragraphs'] if p['id']==patch['paragraphId']);assert p[patch['field']]==patch['before'] and patch['before']!=patch['after'];p[patch['field']]=patch['after']
 for l in d['lessons']:assert l['paragraphs']==byid[l['id']]['paragraphs']
for l in lessons:
 assert l['sourceHash']==digest({k:v for k,v in l.items() if k!='sourceHash'}) and len(l['paragraphs'])==6 and l['levels']==['2']
 assert all(not l[f] for f in ['humanReviewed','nativeReviewed','domainReviewed'])
p='src/data/agriculture/lessons.ja.json';before=json.loads(old(p));content=read(R/p);assert content['lessons']==before['lessons']+lessons and len(content['lessons'])==195
fields=patches=0
for pair in ['vi-id','en-hi','bn-ne','zh-CN-zh-TW','my-th','km-tl']:
 p=W/f'translations-{pair}.json';a=read(p);v=read(W/f'translation-review-{pair}.json');assert a['sourceMasterSha256']==v['sourceMasterSha256']==sha(W/'japanese-reviewed.json');assert v['authorPacketSha256']==sha(p) and v['author']!=v['reviewer'];assert v['fieldsReviewed']==180 and v['lessonLocalePairsReviewed']==12 and not v['unresolvedBlockingIssues'];loc=copy.deepcopy(a['locales'])
 for patch in v['patches']:
  t=loc[patch['locale']][patch['lessonId']];f=patch['field'];o=t[f] if f in ['paragraphs','paragraphTitles'] else t;k=patch.get('paragraphId') if f in ['paragraphs','paragraphTitles'] else f;assert o[k]==patch['before'] and patch['before']!=patch['after'] and patch['reason'];o[k]=patch['after'];patches+=1
 for locale,entries in loc.items():
  p='src/data/agriculture/translations/'+locale+'.json';shard=read(R/p);prev=json.loads(old(p));assert set(entries)==ids and set(shard)==set(prev)|ids and {k:v for k,v in shard.items() if k not in ids}==prev
  for lid,t in entries.items():
   t['domainReviewed']=False;assert shard[lid]==t and t['sourceHash']==byid[lid]['sourceHash'];assert t['status']=='translated_ai_unreviewed' and t['translatedDirectlyFrom']=='ja' and not t['nativeReviewed'] and not t['domainReviewed'];assert set(t['paragraphs'])==set(t['paragraphTitles'])=={p['id'] for p in byid[lid]['paragraphs']};assert all(t[f].strip() for f in ['title','objective','activity']);assert all(v.strip() for f in ['paragraphs','paragraphTitles'] for v in t[f].values());fields+=15
assert fields==1080
p='docs/ssw-workspace/agriculture/knowledge-ledger.json';ledger=read(R/p);prev=json.loads(old(p));assert ledger['knowledge']==prev['knowledge']+m['knowledge'] and ledger['holds']==prev['holds']
p='src/data/agriculture/course-manifest.json';course=read(R/p);prev=json.loads(old(p));assert course['levels']['1']==prev['levels']['1'];assert course['levels']['2']['weeks'][:-1]==prev['levels']['2']['weeks'];assert course['levels']['2']['weeks'][-1]['lessonIds']==[l['id'] for l in lessons]
for p in ['src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/mock-exams.ja.json','src/data/agriculture/recognition-images.json','src/components/agriculture/AgricultureCourse.tsx','src/components/agriculture/RecognitionImages.tsx','src/components/agriculture/ConceptDiagrams.tsx','src/services/agriculture-study-state.ts','src/services/kensetsu-test-state.ts','docs/ssw-workspace/agriculture/source-gap-backlog.json','docs/ssw-workspace/agriculture/illustration-register.json','docs/ssw-workspace/agriculture/mock-35/reviewed-question-queue.json']:
 assert (R/p).read_bytes()==old(p),'protected changed '+p
ov=read(R/'docs/ssw-workspace/agriculture/source-gap-reconciliation-38.json');new=[i for row in ov['resolutions'] for i in row['sourceItemIds']];assert len(new)==len(set(new))==73
backlog={i['id']:i for i in read(R/'docs/ssw-workspace/agriculture/source-gap-backlog.json')['items']};assert all(backlog[i]['status']=='missing' and backlog[i]['documentId']=='AGR-S2' for i in new)
prior={i for n in [11,12,22,27,30,34,36,37] for row in read(R/f'docs/ssw-workspace/agriculture/source-gap-reconciliation-{n}.json')['resolutions'] if row['disposition']=='covered_by_new_prose' for i in row['sourceItemIds']};assert not prior&set(new) and len(prior|set(new))==455;assert ov['summary']['candidateRemainingMissingOrPartialOccurrencesFromBaseline']==1104
assert 'AGR-A10-SAFETY-0292' not in new and any(h.get('sourceItemId')=='AGR-A10-SAFETY-0292' and not h['countsAsClosedSourceOccurrence'] for h in ov['heldNewSourceClaims'])
for row in ov['resolutions']:
 for b in row['evidenceBindings']:
  l=byid[b['lessonId']];p=next(p for p in l['paragraphs'] if p['id']==b['paragraphId']);assert b['paragraphSha256']==digest(p) and b['lessonSourceHash']==l['sourceHash']
for p,h in read(W/'baseline-file-hashes.json')['files'].items():assert hashlib.sha256(old(p)).hexdigest()==h
checkpoint='docs/ssw-workspace/agriculture/CHECKPOINT.md';assert (R/checkpoint).read_bytes().endswith(old(checkpoint)) and hashlib.sha256(old(checkpoint)).hexdigest()==read(W/'checkpoint-before.json')['sha256']
if (W/'completion-summary.json').exists():
 summary=read(W/'completion-summary.json');assert summary['japaneseLessons']==195 and summary['translationPairs']==2340 and summary['candidateMissingOrPartialSourceOccurrences']==1104 and not summary['releaseReady']
 for p,h in summary['inputSha256'].items():assert sha(R/p)==h
if (W/'manifest.json').exists():
 for p,h in read(W/'manifest.json')['artifactSha256'].items():assert sha(R/p)==h,'artifact changed '+p
print(json.dumps({'status':'PASS','newLessons':6,'newUnits':36,'newTranslations':72,'reviewedTranslationFields':fields,'translationPatches':patches,'oldLessonsPreserved':189,'oldTranslationsPreserved':2268,'sourceOccurrencesExpressed':73,'candidateRemaining':1104,'newQuestions':0,'weeklyUnchanged':421,'mocksUnchanged':160,'rastersUnchanged':62}))
