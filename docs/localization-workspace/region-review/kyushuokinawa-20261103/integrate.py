import json,hashlib,pathlib,re,sys
ROOT=pathlib.Path(__file__).resolve().parents[4]
WORK=pathlib.Path(sys.argv[1]).resolve()
OUT=ROOT/'docs/localization-workspace/region-review/kyushuokinawa-20261103'
def read(p):return json.loads(p.read_text())
def write(p,d):
 p.parent.mkdir(parents=True,exist_ok=True);t=p.with_name(p.name+'.kyushu-tmp');t.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');t.replace(p)
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
qpath=ROOT/'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json';q=read(qpath);index=read(ROOT/'src/data/dialogue-content/locale-batch-index.json');locales=set(q['supportingLocales']);groups={1:{'PRF-040'},2:{'PRF-041','PRF-042'},3:{'PRF-043'},4:{'PRF-044','PRF-045'},5:{'PRF-046'},6:{'PRF-047'}};assigned={w:{s for p in q['prefectures'] if p['prefectureId'] in ps for c in p['cities'] for s in c['sentenceTaskReviewedScenarioIds']+c['pendingSentenceTaskScenarioIds']} for w,ps in groups.items()}
proofs=sorted((p for p in OUT.glob('worker-*.json') if re.fullmatch(r'worker-[1-9]\d*\.json',p.name)),key=lambda p:int(p.stem.split('-')[1]));rows={};corrections={};maxslot=0
for p in proofs:
 d=read(p);assert d.get('nativeReviewed') is False;maxslot=max(maxslot,int(p.stem.split('-')[1]))
 for r in d['reviews']:rows[r['scenarioId'],r['locale']]=r
 for c in d.get('changes',[]):corrections[c['path'],c['scenarioId'],c['turnId'],c['field']]=c
existing={sid for sid,l in rows};prior={s for p in q['prefectures'] if int(p['prefectureId'][-3:])>=40 for c in p['cities'] for s in c['sentenceTaskReviewedScenarioIds']};assert existing==prior,'Existing queue and receipts differ'
packs={};sources={};changed=set();newreceipts=[];newids=set()
def pack(batch,loc):
 p=f'src/data/dialogue-content/locale-batches/{loc}/{batch}.json'
 if p not in packs:packs[p]=read(ROOT/p)
 return p,packs[p]
def validate(r):
 sid,loc=r['scenarioId'],r['locale'];b=index[sid]
 if b not in sources:sources[b]=read(ROOT/f'docs/localization-workspace/sources/dialogue-batch-{b}.ja.json')
 _,target=pack(b,loc);source=sources[b]['scenarios'][sid]['turns'];seen=set()
 for f in r['fields']:
  tid,kind=f['turnId'],f['field'];assert kind in ('translation','hintTranslation');seen.add((tid,kind));assert digest(source[tid]['hintJa' if kind=='hintTranslation' else 'sourceJa'])==f['sourceSha256'];assert digest(target['scenarios'][sid]['turns'][tid][kind])==f['targetSha256'],('stale target',sid,loc,tid,kind)
 assert len(seen)==16
for r in rows.values():validate(r)
for w in range(1,7):
 staged={};notes=[];issues=[]
 for p in sorted((WORK/f'worker{w}').glob('*.json'),key=lambda p:p.stat().st_mtime):
  d=read(p)
  if not isinstance(d,dict) or 'reviews' not in d:continue
  notes+=d.get('reviewCriteria',[]);issues+=d.get('sourceIssues',d.get('openIssues',d.get('unresolvedIssues',[])))
  for r in d['reviews']:
   if r['scenarioId'] not in existing:staged[r['scenarioId'],r['locale']]=r
 ids={s for s,l in staged if {loc for sid,loc in staged if sid==s}==locales};assert ids<=assigned[w];assert not ids&newids
 props=[c for c in read(WORK/f'worker{w}'/'proposals.json') if c['scenarioId'] in ids];seen=set()
 for c in props:
  key=(c['path'],c['scenarioId'],c['turnId'],c['field']);assert key not in seen;seen.add(key);b=index[c['scenarioId']];loc=c.get('locale',c['path'].split('/')[-2]);path,data=pack(b,loc);assert path==c['path'];t=data['scenarios'][c['scenarioId']]['turns'][c['turnId']];assert t[c['field']] in (c['before'],c['after']),('concurrent unreviewed change',key)
  if t[c['field']]!=c['after']:t[c['field']]=c['after'];changed.add(path)
  corrections[key]=c
 selected=[]
 for sid in sorted(ids):
  for loc in sorted(locales):
   r=staged[sid,loc];validate(r);r['nativeReviewed']=False;selected.append(r);rows[sid,loc]=r
 if ids:
  maxslot+=1;d={'status':'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED','nativeReviewed':False,'worker':maxslot,'sourceWorker':w,'scenarios':sorted(ids),'scope':'Only newly reviewed scenarios; prior valid concurrent receipts are unchanged.','reviewedFields':len(ids)*192,'changedFields':len(props),'reviews':selected,'changes':props,'reviewCriteria':notes,'sourceIssues':issues};newreceipts.append((OUT/f'worker-{maxslot}.json',d));newids|=ids
allids={s for s,l in rows}
for sid in allids:assert {loc for s,loc in rows if s==sid}==locales
for p,d in newreceipts:write(p,d)
for p in changed:write(ROOT/p,packs[p])
for p in q['prefectures']:
 for c in p['cities']:
  full=set(c['sentenceTaskReviewedScenarioIds'])|set(c['pendingSentenceTaskScenarioIds']);take=full&allids
  if int(p['prefectureId'][-3:])>=40:c['sentenceTaskReviewedScenarioIds']=sorted(take);c['pendingSentenceTaskScenarioIds']=sorted(full-take)
 p['aiSentenceTaskReviewedScenarios']=sum(len(c['sentenceTaskReviewedScenarioIds']) for c in p['cities']);p['pendingSentenceTaskScenarios']=p['scenarioCount']-p['aiSentenceTaskReviewedScenarios']
q['aiSentenceTaskReviewedScenarios']=sum(p['aiSentenceTaskReviewedScenarios'] for p in q['prefectures']);q['remainingSentenceTaskScenarios']=q['canonicalScenarios']-q['aiSentenceTaskReviewedScenarios'];write(qpath,q)
mp=ROOT/'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json';m=read(mp)
for b in m['completedBatches']:
 for f in b['files']:
  if f['path'] in changed:f['sha256']=hashlib.sha256((ROOT/f['path']).read_bytes()).hexdigest()
write(mp,m)
report={'region':'Kyushu & Okinawa','status':'IN_PROGRESS','nativeReviewed':False,'reviewed':len(allids),'total':1064,'remaining':1064-len(allids),'fields':len(allids)*192,'repairs':len(corrections),'retainedConcurrentScenarios':len(existing),'newlyAddedScenarios':len(newids),'workers':[{'worker':w,'assigned':len(assigned[w]),'reviewed':len(assigned[w]&allids),'pendingScenarioIds':sorted(assigned[w]-allids)} for w in range(1,7)],'baselineCommit':'735b2b748a75a6dc776f1b383516b4fcc39665ee'};write(OUT/'progress.json',report);print({k:v for k,v in report.items() if k!='workers'})
