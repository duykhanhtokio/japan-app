"""Validate batch11 source bindings and preservation against its durable baseline."""
import hashlib,json,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[2]
W=ROOT/'docs/ssw-workspace/agriculture';D=ROOT/'src/data/agriculture';BASE='a1c25940a7167cbdf2db2a4df4f317c4ff6dadbe'
def read(p):return json.loads(p.read_text())
def baseline(path):return json.loads(subprocess.check_output(['git','show',BASE+':'+str(path)],cwd=ROOT))
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
lessons=read(D/'lessons.ja.json')['lessons'];oldlessons=baseline('src/data/agriculture/lessons.ja.json')['lessons'];assert lessons[:144]==oldlessons and len(lessons)==156
ledger=read(W/'knowledge-ledger.json');oldledger=baseline('docs/ssw-workspace/agriculture/knowledge-ledger.json');assert ledger['knowledge'][:864]==oldledger['knowledge'] and ledger['holds'][:len(oldledger['holds'])]==oldledger['holds'];assert len(ledger['knowledge'])==936
checks=read(D/'weekly-checks.ja.json')['exams'];oldchecks=baseline('src/data/agriculture/weekly-checks.ja.json')['exams'];assert checks[:len(oldchecks)]==oldchecks;assert sum(len(e['questions']) for e in checks)==344
course=read(D/'course-manifest.json');oldcourse=baseline('src/data/agriculture/course-manifest.json')
for level in ['1','2']:assert course['levels'][level]['weeks'][:len(oldcourse['levels'][level]['weeks'])]==oldcourse['levels'][level]['weeks']
index=read(D/'translations.json');oldpairs=0;newpairs=0
for loc,path in index['shards'].items():
 entries=read(D/path);prior=baseline('src/data/agriculture/'+path)
 for lid,t in prior.items():assert entries[lid]==t;oldpairs+=1
 newpairs+=len(entries)-len(prior)
assert oldpairs==1728 and newpairs in [0,144]
hashes=read(W/'parallel-11/baseline-hashes.json')
for path in ['docs/ssw-workspace/agriculture/source-coverage-audit.json','docs/ssw-workspace/agriculture/source-gap-backlog.json']:
 assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==hashes[path]
diagrams=read(D/'diagrams.json')['diagrams'];old_diagrams=baseline('src/data/agriculture/diagrams.json')['diagrams'];assert diagrams[:len(old_diagrams)]==old_diagrams and len(diagrams)-len(old_diagrams) in [0,1]
register=read(W/'illustration-register.json')['figures'];old_register=baseline('docs/ssw-workspace/agriculture/illustration-register.json')['figures'];assert register[:len(old_register)]==old_register and len(register)==7
manifest=read(W/'parallel-11-manifest.json')
for worker in manifest['workers']:
 raw=W/'parallel-11'/(worker['worker']+'.json');review=read(W/worker['independentReview']);assert worker['packetSha256']==review['packetSha256']==hashlib.sha256(raw.read_bytes()).hexdigest()
for worker in manifest.get('translationIntegration',{}).get('packets',[]):
 raw=W/'parallel-11'/('translations-'+worker['pair']+'.json');review=read(W/worker['independentReview']);assert worker['rawPacketSha256']==review['packetSha256']==hashlib.sha256(raw.read_bytes()).hexdigest()
byid={l['id']:l for l in lessons};overlay=read(W/'source-gap-reconciliation-11.json');seen=set();counts={'covered_by_new_prose':0,'partially_covered':0};backlog={i['id']:i for i in read(W/'source-gap-backlog.json')['items']}
for r in overlay['resolutions']:
 assert r['evidenceBindings'] and r['disposition'] in counts
 for b in r['evidenceBindings']:
  l=byid[b['lessonId']];p=next(p for p in l['paragraphs'] if p['id']==b['paragraphId']);assert b['lessonSourceHash']==l['sourceHash'] and b['paragraphSha256']==sha(p)
 for itemid in r['sourceItemIds']:
  assert itemid not in seen and backlog[itemid]['status']=='missing';seen.add(itemid);counts[r['disposition']]+=1
assert overlay['summary']['sourceOccurrencesCoveredByNewProse']==counts['covered_by_new_prose']
assert overlay['summary']['sourceOccurrencesPartiallyCovered']==counts['partially_covered']
assert overlay['summary']['coveragePercent'] is None and overlay['summary']['uniqueKnowledgeDenominator'] is None
print(json.dumps({'status':'PASS','priorJapaneseLessonsUnchanged':144,'priorKnowledgeUnitsUnchanged':864,'priorTranslationObjectsUnchanged':oldpairs,'priorWeeklyBanksUnchanged':len(oldchecks),'newJapaneseLessons':12,'newWeeklyQuestions':48,'newWeeklyBanks':len(checks)-len(oldchecks),'newConceptDiagrams':len(diagrams)-len(old_diagrams),'newTranslationPairs':newpairs,'sourceOccurrenceResolutions':counts,'frozenBatch10SnapshotsUnchanged':True,'nativeReviewed':False,'releaseReady':False}))
