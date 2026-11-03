import json, hashlib, pathlib, collections, sys

ROOT=pathlib.Path(__file__).resolve().parents[4]
WORK=pathlib.Path(sys.argv[1]).resolve()
OUT=ROOT/'docs/localization-workspace/region-review/kyushuokinawa-20261103'
OUT.mkdir(parents=True,exist_ok=True)
def read(p): return json.loads(p.read_text())
def write(p,d):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def digest(s): return hashlib.sha256(s.encode()).hexdigest()
queuepath=ROOT/'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json'
q=read(queuepath)
index=read(ROOT/'src/data/dialogue-content/locale-batch-index.json')
locales=set(q['supportingLocales'])
owned={1:{'PRF-040'},2:{'PRF-041','PRF-042'},3:{'PRF-043'},4:{'PRF-044','PRF-045'},5:{'PRF-046'},6:{'PRF-047'}}
assigned={w:[s for p in q['prefectures'] if p['prefectureId'] in ids for c in p['cities'] for s in c['sentenceTaskReviewedScenarioIds']+c['pendingSentenceTaskScenarioIds']] for w,ids in owned.items()}
packs={}; changed=set(); allreviewed=set(); allchanges=[]
for w in range(1,7):
    rows={}; issues=[]; notes=[]
    folder=WORK/f'worker{w}'
    for f in sorted(folder.glob('*.json'),key=lambda p:p.stat().st_mtime):
        data=read(f)
        if not isinstance(data,dict) or 'reviews' not in data: continue
        issues+=data.get('sourceIssues',data.get('openIssues',data.get('unresolvedIssues',[])))
        notes+=data.get('reviewCriteria',[])
        for row in data['reviews']:
            assert row['scenarioId'] in assigned[w], ('ownership',w,row['scenarioId'])
            rows[row['scenarioId'],row['locale']]=row
    sids={sid for sid,loc in rows if {l for s,l in rows if s==sid}==locales}
    proposals=read(folder/'proposals.json')
    applied=[]
    for prop in proposals:
        if prop['scenarioId'] not in sids: continue
        path=prop['path']; assert path.startswith('src/data/dialogue-content/locale-batches/')
        if path not in packs: packs[path]=read(ROOT/path)
        turn=packs[path]['scenarios'][prop['scenarioId']]['turns'][prop['turnId']]
        assert prop['field'] in ['translation','hintTranslation']
        assert turn[prop['field']] in [prop['before'],prop['after']], ('stale proposal',prop)
        if turn[prop['field']]!=prop['after']:
            turn[prop['field']]=prop['after']; changed.add(path)
        applied.append(prop)
    validrows=[]
    for sid in sorted(sids):
        batch=index[sid]
        source=read(ROOT/f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json')['scenarios'][sid]['turns']
        for loc in sorted(locales):
            row=rows[sid,loc]; seen=set()
            path=f'src/data/dialogue-content/locale-batches/{loc}/{batch}.json'
            if path not in packs:packs[path]=read(ROOT/path)
            for field in row['fields']:
                tid=field['turnId']; kind=field['field']; seen.add((tid,kind))
                assert digest(source[tid]['hintJa' if kind=='hintTranslation' else 'sourceJa'])==field['sourceSha256']
                target=packs[path]['scenarios'][sid]['turns'][tid][kind]
                assert digest(target)==field['targetSha256'], ('receipt target',w,sid,loc,tid,kind)
            assert len(seen)==16
            row['nativeReviewed']=False
            validrows.append(row)
    receipt={'status':'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED','nativeReviewed':False,'worker':w,'scenarios':sorted(sids),'scope':'Full Japanese context and all12 sentence/task sets; no native, metadata, device or release certification.','reviewedFields':len(sids)*192,'changedFields':len(applied),'reviews':validrows,'changes':applied,'reviewCriteria':notes,'sourceIssues':issues}
    write(OUT/f'worker-{w}.json',receipt)
    allreviewed.update(sids);allchanges+=applied
for p in changed:write(ROOT/p,packs[p])
for p in q['prefectures']:
    for c in p['cities']:
        add=set(c['pendingSentenceTaskScenarioIds'])&allreviewed
        c['sentenceTaskReviewedScenarioIds']+=sorted(add)
        c['pendingSentenceTaskScenarioIds']=[s for s in c['pendingSentenceTaskScenarioIds'] if s not in add]
    p['aiSentenceTaskReviewedScenarios']=sum(len(c['sentenceTaskReviewedScenarioIds']) for c in p['cities'])
    p['pendingSentenceTaskScenarios']=p['scenarioCount']-p['aiSentenceTaskReviewedScenarios']
q['aiSentenceTaskReviewedScenarios']=sum(p['aiSentenceTaskReviewedScenarios'] for p in q['prefectures'])
q['remainingSentenceTaskScenarios']=q['canonicalScenarios']-q['aiSentenceTaskReviewedScenarios']
write(queuepath,q)
manifestpath=ROOT/'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'
manifest=read(manifestpath)
for batch in manifest['completedBatches']:
    for f in batch['files']:
        if f['path'] in changed:f['sha256']=hashlib.sha256((ROOT/f['path']).read_bytes()).hexdigest()
write(manifestpath,manifest)
report={'region':'Kyushu & Okinawa','status':'IN_PROGRESS','nativeReviewed':False,'reviewed':len(allreviewed),'total':sum(map(len,assigned.values())),'remaining':sum(map(len,assigned.values()))-len(allreviewed),'fields':len(allreviewed)*192,'repairs':len(allchanges),'workers':[{'worker':w,'assigned':len(assigned[w]),'reviewed':len(set(assigned[w])&allreviewed),'pendingScenarioIds':[s for s in assigned[w] if s not in allreviewed]} for w in range(1,7)],'baselineCommit':'1280587761a768d0199d164544989302a1218e62'}
write(OUT/'progress.json',report)
print({k:v for k,v in report.items() if k!='workers'})
