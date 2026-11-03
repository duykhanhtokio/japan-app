"""Validate revision-bound worker evidence; --sync updates shared ledgers."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'docs/localization-workspace/region-review/hokkaido-20261103'
LOCALES = {'vi','en','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'}
QUEUE = ROOT / 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json'

def read(p):
    return json.loads(Path(p).read_text())

def write(p, data):
    Path(p).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def sha(s):
    return hashlib.sha256(s.encode()).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sync', action='store_true')
    args = parser.parse_args()
    idx = read(ROOT / 'src/data/dialogue-content/locale-batch-index.json')
    queue = read(QUEUE)
    prefecture = next(p for p in queue['prefectures'] if p['prefectureId'] == 'PRF-001')
    members = {s for c in prefecture['cities'] for key in ('sentenceTaskReviewedScenarioIds','pendingSentenceTaskScenarioIds') for s in c[key]}
    owned, complete, changed, workers = {}, set(), {}, []
    for number in range(1,7):
        assignment = read(BASE / f'assignment-{number}.json')
        assigned = {s for g in assignment['groups'] for s in g['scenarios']}
        assert assigned <= members
        for group in assignment['groups']:
            batch = group['batch']
            assert batch not in owned, ('overlapping batch', batch)
            owned[batch] = number
        receipt_path = BASE / f'worker-{number}.json'
        if not receipt_path.exists():
            workers.append({'worker':number,'reviewed':0,'pending':len(assigned)})
            continue
        receipt = read(receipt_path)
        assert receipt.get('nativeReviewed') is False
        assert receipt.get('semanticCrossReview',False) is False
        scenarios = receipt.get('scenarios',receipt.get('completedScenarioIds',[]))
        assert set(scenarios) <= assigned
        assert len(scenarios) == len(set(scenarios))
        by_scenario = {}
        for review in receipt['reviews']:
            sid, locale = review['scenarioId'],review['locale']
            assert sid in scenarios and locale in LOCALES
            assert locale not in by_scenario.setdefault(sid,set())
            by_scenario[sid].add(locale)
            batch = idx[sid]
            source = read(ROOT / f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json')['scenarios'][sid]['turns']
            target = read(ROOT / f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json')['scenarios'][sid]['turns']
            expected = {(tid,field) for tid,t in source.items() for field,sfield in [('translation','sourceJa'),('hintTranslation','hintJa')] if sfield in t}
            actual = {(f['turnId'],f['field']) for f in review['fields']}
            assert expected == actual and len(actual)==len(review['fields'])==16, (sid,locale)
            for field in review['fields']:
                tid, key = field['turnId'],field['field']
                skey = 'sourceJa' if key=='translation' else 'hintJa'
                assert source[tid][skey] == target[tid][skey]
                assert sha(source[tid][skey]) == field['sourceSha256']
                assert sha(target[tid][key]) == field['targetSha256'], (sid,locale,tid,key)
        for sid in scenarios:
            assert by_scenario[sid] == LOCALES, sid
            assert sid not in complete
            complete.add(sid)
        for change in receipt['changes']:
            path,sid,tid,key = change['path'],change['scenarioId'],change['turnId'],change['field']
            assert sid in scenarios
            assert path == f"src/data/dialogue-content/locale-batches/{change['locale']}/{idx[sid]}.json"
            assert key in ('translation','hintTranslation')
            assert read(ROOT/path)['scenarios'][sid]['turns'][tid][key] == change['after']
            changed.setdefault(path,[]).append(change)
        workers.append({'worker':number,'reviewed':len(scenarios),'pending':len(assigned)-len(scenarios),'fields':len(scenarios)*192,'changedFields':len(receipt['changes']),'receiptSha256':hashlib.sha256(receipt_path.read_bytes()).hexdigest()})
    assert sum(len(read(BASE/f'assignment-{n}.json')['groups']) for n in range(1,7)) == len(owned)
    # Every changed file must be explained exactly by its owner's receipt.
    for path, changes in changed.items():
        original = json.loads(subprocess.check_output(['git','show',f'4fa79081c934f4763e87e777c40761a4a51a5b27:{path}'],cwd=ROOT))
        for change in changes:
            turn = original['scenarios'][change['scenarioId']]['turns'][change['turnId']]
            assert turn[change['field']] == change['before']
            turn[change['field']] = change['after']
        assert original == read(ROOT/path), ('unexplained modification',path)
    previous = {s for c in prefecture['cities'] for s in c['sentenceTaskReviewedScenarioIds']}
    if args.sync:
        # Batch000 also has the historical per-scenario sentence mirror.
        for changes in changed.values():
            for change in changes:
                if idx[change['scenarioId']] != '000' or change['field'] != 'translation':
                    continue
                mirror_path=ROOT/f"src/data/dialogue-content/translations/{change['scenarioId']}.json"
                mirror=read(mirror_path)
                entry=mirror['turns'][change['turnId']]['translations']
                assert entry[change['locale']] in (change['before'],change['after'])
                entry[change['locale']]=change['after']
                write(mirror_path,mirror)
        for city in prefecture['cities']:
            new = [s for s in city['pendingSentenceTaskScenarioIds'] if s in complete]
            city['pendingSentenceTaskScenarioIds'] = [s for s in city['pendingSentenceTaskScenarioIds'] if s not in complete]
            city['sentenceTaskReviewedScenarioIds'].extend(new)
        prefecture['aiSentenceTaskReviewedScenarios'] = sum(len(c['sentenceTaskReviewedScenarioIds']) for c in prefecture['cities'])
        prefecture['pendingSentenceTaskScenarios'] = len(members)-prefecture['aiSentenceTaskReviewedScenarios']
        prefecture['status'] = 'COMPLETE' if not prefecture['pendingSentenceTaskScenarios'] else 'IN_PROGRESS'
        queue['activePrefectureId']='PRF-001'
        queue['activePrefectureNameJa']='北海道'
        queue['aiSentenceTaskReviewedScenarios']=sum(p['aiSentenceTaskReviewedScenarios'] for p in queue['prefectures'])
        queue['remainingSentenceTaskScenarios']=queue['canonicalScenarios']-queue['aiSentenceTaskReviewedScenarios']
        pending=[s for c in prefecture['cities'] for s in c['pendingSentenceTaskScenarioIds']]
        queue['nextScenarioId']=pending[0] if pending else None
        queue['nextBatch']=idx[pending[0]] if pending else None
        write(QUEUE,queue)
        progress_path=ROOT/'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'
        progress=read(progress_path)
        synced=set()
        for batch in progress['completedBatches']:
            for entry in batch['files']:
                if entry['path'] in changed:
                    entry['sha256']=hashlib.sha256((ROOT/entry['path']).read_bytes()).hexdigest()
                    synced.add(entry['path'])
        assert synced == set(changed)
        write(progress_path,progress)
        plan_path=ROOT/'docs/localization-workspace/region-review/plan.json'
        plan=read(plan_path)
        plan['activeRegionId']='hokkaido'
        plan['proposedOrder']=['hokkaido']+[r for r in plan['proposedOrder'] if r!='hokkaido']
        plan['fullContextReviewedScenarios']=queue['aiSentenceTaskReviewedScenarios']
        plan['remainingContextScenarios']=queue['remainingSentenceTaskScenarios']
        region=next(r for r in plan['regions'] if r['regionId']=='hokkaido')
        region['contextReviewedScenarios']=prefecture['aiSentenceTaskReviewedScenarios']
        region['remainingScenarios']=prefecture['pendingSentenceTaskScenarios']
        region['status']=prefecture['status']
        region['prefectures'][0]['contextReviewedScenarios']=prefecture['aiSentenceTaskReviewedScenarios']
        write(plan_path,plan)
    report={'status':'PASS','region':'hokkaido','regionTotal':len(members),'contextReviewed':len(previous|complete),'remaining':len(members-(previous|complete)),'workers':workers,'reviewedFields':len(complete)*192,'changedFields':sum(len(c) for c in changed.values()),'changedLocaleFiles':len(changed),'nativeReviewed':False,'semanticCrossReview':False,'deviceVerified':False,'priorReviewedIdsPreserved':True}
    if args.sync:
        write(BASE/'integration-qa.json',report)
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
    main()
