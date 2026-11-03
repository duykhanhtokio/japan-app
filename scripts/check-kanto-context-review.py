"""Validate revision-bound worker evidence; --sync updates shared ledgers."""
import argparse
import hashlib
import gzip
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'docs/localization-workspace/region-review/kanto-20261103'
LOCALES = {'vi','en','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'}
QUEUE = ROOT / 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json'

def read(p):
    data = json.loads(Path(p).read_text())
    if isinstance(data, dict) and data.get('schemaVersion') == 'context-review-archive-v1':
        archive = data['archivePath']
        assert archive.startswith('docs/localization-workspace/region-review/kanto-20261103/') and '..' not in Path(archive).parts
        zipped = (ROOT / archive).read_bytes()
        assert hashlib.sha256(zipped).hexdigest() == data['archiveSha256']
        raw = gzip.decompress(zipped)
        assert hashlib.sha256(raw).hexdigest() == data['uncompressedSha256']
        data = json.loads(raw)
    if isinstance(data, dict) and data.get('reviewFieldEncoding') == 'tuple-v1':
        keys = ('turnId', 'field', 'sourceSha256', 'targetSha256')
        for row in data['reviews']:
            row['fields'] = [dict(zip(keys, f)) if isinstance(f, list) else f for f in row['fields']]
        del data['reviewFieldEncoding']
    return data

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
    prefectures = [p for p in queue['prefectures'] if p['prefectureId'] in {f'PRF-{n:03}' for n in range(8,15)}]
    prefecture = {'cities':[c for p in prefectures for c in p['cities']]}
    members = {s for c in prefecture['cities'] for key in ('sentenceTaskReviewedScenarioIds','pendingSentenceTaskScenarioIds') for s in c[key]}
    owned, complete, changed, workers = {}, set(), {}, []
    owned_scenarios_by_batch = {}
    input_amendments = []
    reviewed_by_worker = {}
    for number in range(1,7):
        assignment = read(BASE / f'assignment-{number}.json')
        assigned = {s for g in assignment['groups'] for s in g['scenarios']}
        assert assigned <= members
        for group in assignment['groups']:
            batch = group['batch']
            assert batch not in owned, ('overlapping batch', batch)
            owned[batch] = number
            owned_scenarios_by_batch[batch] = group['scenarios']
        receipt_path = BASE / f'worker-{number}.json'
        if not receipt_path.exists():
            workers.append({'worker':number,'reviewed':0,'pending':len(assigned)})
            continue
        receipt = read(receipt_path)
        assert receipt.get('nativeReviewed') is False
        assert receipt.get('semanticCrossReview',False) is False
        scenarios = receipt.get('scenarios',receipt.get('completedScenarioIds',[]))
        reviewed_by_worker[number] = set(scenarios)
        input_amendments.extend(dict(amendment, worker=number) for amendment in receipt.get('authoringInputAmendments', []))
        assert set(scenarios) <= assigned
        assert len(scenarios) == len(set(scenarios))
        notes = receipt.get('scenarioNotes', receipt.get('scenarioConclusions', receipt.get('scenarioFindings', {})))
        if isinstance(notes, list):
            notes = {row['scenarioId']: row.get('rationale', '') for row in notes}
        assert all(isinstance(notes.get(sid), str) and len(notes[sid].strip()) >= 30 for sid in scenarios), 'Missing per-scenario semantic note'
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
            assert expected == actual and len(actual)==len(review['fields']), (sid,locale)
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
            assert key in ('translation','hintTranslation','hintJa')
            assert read(ROOT/path)['scenarios'][sid]['turns'][tid][key] == change['after']
            changed.setdefault(path,[]).append(change)
        for amendment in receipt.get('sourceHintAmendments', []):
            sid, tid = amendment['scenarioId'], amendment['turnId']
            assert sid in scenarios and amendment['selfSemanticApproved'] is True
            source_path = ROOT / f'docs/localization-workspace/sources/dialogue-batch-{idx[sid]}.ja.json'
            assert read(source_path)['scenarios'][sid]['turns'][tid]['hintJa'] == amendment['afterHintJa']
            assert amendment['beforeHintJa'] != amendment['afterHintJa']
            for locale in LOCALES:
                matches = [c for c in receipt['changes'] if c['scenarioId']==sid and c['turnId']==tid and c['locale']==locale and c['field']=='hintJa']
                assert len(matches)==1 and matches[0]['before']==amendment['beforeHintJa'] and matches[0]['after']==amendment['afterHintJa']
        for amendment in receipt.get('runtimeMetadataAmendments', []):
            sid, tid, field_path = amendment['scenarioId'], amendment['turnId'], amendment['fieldPath']
            assert sid in scenarios and amendment['selfSemanticApproved'] is True
            assert field_path in ('player.requiredSemanticComponents.goal', 'player.evaluationNotes')
            expected_path = f'src/data/generated/dialogues/{sid}.json'
            assert amendment['path'] == expected_path
            data = read(ROOT / expected_path)
            turns = data if isinstance(data, list) else data.get('shared', data.get('N5'))
            current = next(turn for turn in turns if turn['id'] == tid)
            for key in field_path.split('.'):
                current = current[key]
            assert current == amendment['after'] and amendment['before'] != amendment['after']
            assert sha(amendment['before']) == amendment['beforeSha256']
            assert sha(amendment['after']) == amendment['afterSha256']
        workers.append({'worker':number,'reviewed':len(scenarios),'pending':len(assigned)-len(scenarios),'fields':len(scenarios)*192,'changedFields':len(receipt['changes']),'changedTranslationFields':sum(c['field'] in ('translation','hintTranslation') for c in receipt['changes']),'changedSourceMetadataFields':sum(c['field']=='hintJa' for c in receipt['changes']),'sourceHintAmendments':len(receipt.get('sourceHintAmendments',[])),'runtimeMetadataAmendments':len(receipt.get('runtimeMetadataAmendments',[])),'receiptSha256':hashlib.sha256(receipt_path.read_bytes()).hexdigest()})
    assert sum(len(read(BASE/f'assignment-{n}.json')['groups']) for n in range(1,7)) == len(owned)
    # Every Kanto-owned scenario in a changed file must be explained exactly.
    # Boundary batches may also contain another region's independently reviewed cases.
    baseline_hashes = read(BASE/'baseline-file-hashes.json')['files']
    for path, changes in changed.items():
        original = read(ROOT/path)
        for change in reversed(changes):
            turn = original['scenarios'][change['scenarioId']]['turns'][change['turnId']]
            assert turn[change['field']] == change['after']
            turn[change['field']] = change['before']
        batch = Path(path).stem
        scope = {'metadata': {k:v for k,v in original.items() if k != 'scenarios'},
                 'scenarios': {sid: original['scenarios'][sid] for sid in owned_scenarios_by_batch[batch]}}
        canonical = json.dumps(scope, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
        baseline_hash = baseline_hashes[path]['ownedScopeCanonicalSha256']
        assert sha(canonical) == baseline_hash, ('unexplained modification',path)
    input_log = BASE/'authoring-input-integration.json'
    if input_log.exists():
        input_amendments.extend(read(input_log)['changes'])
    if input_amendments:
        import re
        baselines = read(BASE/'authoring-input-baselines.json')['files']
        by_path = {}
        seen_inputs = set()
        for amendment in input_amendments:
            sid, worker = amendment['scenarioId'], amendment['worker']
            path, pointer = amendment['path'], amendment['jsonPointer']
            assert sid in reviewed_by_worker[worker] and amendment['selfSemanticApproved'] is True
            assert path.startswith('scripts/dialogue-authoring/') and '..' not in Path(path).parts
            assert re.fullmatch('/'+re.escape(sid)+r'/tasks/\d+/1', pointer), pointer
            assert (path,pointer) not in seen_inputs
            seen_inputs.add((path,pointer))
            assert sha(amendment['before']) == amendment['beforeSha256']
            assert sha(amendment['after']) == amendment['afterSha256']
            by_path.setdefault(path, []).append(amendment)
        for path, amendments in by_path.items():
            original = read(ROOT/path)
            for amendment in reversed(amendments):
                parts = amendment['jsonPointer'].split('/')[1:]
                value = original
                for part in parts[:-1]:
                    value = value[int(part)] if isinstance(value,list) else value[part]
                key = int(parts[-1]) if isinstance(value,list) else parts[-1]
                assert value[key] == amendment['after'], (path, amendment['jsonPointer'])
                value[key] = amendment['before']
            canonical = json.dumps(original,ensure_ascii=False,sort_keys=True,separators=(',',':'))
            assert sha(canonical) == baselines[path]['canonicalSha256'], ('unexplained authoring edit',path)
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
        for p in prefectures:
            p['aiSentenceTaskReviewedScenarios'] = sum(len(c['sentenceTaskReviewedScenarioIds']) for c in p['cities'])
            p['pendingSentenceTaskScenarios'] = sum(len(c['pendingSentenceTaskScenarioIds']) for c in p['cities'])
            p['status'] = 'COMPLETE' if not p['pendingSentenceTaskScenarios'] else 'IN_PROGRESS'
        queue['activePrefectureId']='PRF-008'
        queue['activePrefectureNameJa']='茨城県'
        queue['aiSentenceTaskReviewedScenarios']=sum(p['aiSentenceTaskReviewedScenarios'] for p in queue['prefectures'])
        queue['remainingSentenceTaskScenarios']=queue['canonicalScenarios']-queue['aiSentenceTaskReviewedScenarios']
        pending=[s for c in prefecture['cities'] for s in c['pendingSentenceTaskScenarioIds']]
        queue['nextScenarioId']=pending[0] if pending else None
        queue['nextBatch']=idx[pending[0]] if pending else None
        write(QUEUE,queue)
        progress_path=ROOT/'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'
        progress=read(progress_path)
        synced=set()
        changed_batches = {Path(path).stem for path in changed}
        for batch in progress['completedBatches']:
            if batch['batch'] in changed_batches:
                source_file = ROOT / f"docs/localization-workspace/sources/dialogue-batch-{batch['batch']}.ja.json"
                batch['sourceSha256'] = hashlib.sha256(source_file.read_bytes()).hexdigest()
            for entry in batch['files']:
                if entry['path'] in changed:
                    entry['sha256']=hashlib.sha256((ROOT/entry['path']).read_bytes()).hexdigest()
                    synced.add(entry['path'])
        assert synced == set(changed)
        write(progress_path,progress)
        plan_path=ROOT/'docs/localization-workspace/region-review/plan.json'
        plan=read(plan_path)
        plan['activeRegionId']='kanto'
        plan['proposedOrder']=['kanto']+[r for r in plan['proposedOrder'] if r!='kanto']
        plan['fullContextReviewedScenarios']=queue['aiSentenceTaskReviewedScenarios']
        plan['remainingContextScenarios']=queue['remainingSentenceTaskScenarios']
        region=next(r for r in plan['regions'] if r['regionId']=='kanto')
        region['contextReviewedScenarios']=sum(p['aiSentenceTaskReviewedScenarios'] for p in prefectures)
        region['remainingScenarios']=sum(p['pendingSentenceTaskScenarios'] for p in prefectures)
        region['status']='COMPLETE' if not region['remainingScenarios'] else 'IN_PROGRESS'
        for rp in region['prefectures']:
            rp['contextReviewedScenarios']=next(p['aiSentenceTaskReviewedScenarios'] for p in prefectures if p['prefectureId']==rp['prefectureId'])
        # Keep every region consistent with the union of retained current receipts.
        queue_prefectures = {p['prefectureId']: p for p in queue['prefectures']}
        for region_row in plan['regions']:
            for rp in region_row['prefectures']:
                rp['contextReviewedScenarios'] = queue_prefectures[rp['prefectureId']]['aiSentenceTaskReviewedScenarios']
            region_row['contextReviewedScenarios'] = sum(rp['contextReviewedScenarios'] for rp in region_row['prefectures'])
            region_row['remainingScenarios'] = region_row['totalScenarios'] - region_row['contextReviewedScenarios']
            region_row['status'] = 'COMPLETE' if not region_row['remainingScenarios'] else ('IN_PROGRESS' if region_row['contextReviewedScenarios'] else 'NOT_STARTED')
        write(plan_path,plan)
    report={'status':'PASS','region':'kanto','regionTotal':len(members),'contextReviewed':len(previous|complete),'remaining':len(members-(previous|complete)),'workers':workers,'reviewedFields':len(complete)*192,'changedFields':sum(len(c) for c in changed.values()),'changedLocaleFiles':len(changed),'changedTranslationFields':sum(w.get('changedTranslationFields',0) for w in workers),'changedSourceMetadataFields':sum(w.get('changedSourceMetadataFields',0) for w in workers),'sourceHintAmendments':sum(w.get('sourceHintAmendments',0) for w in workers),'runtimeMetadataAmendments':sum(w.get('runtimeMetadataAmendments',0) for w in workers),'authoringInputTaskAmendments':len(input_amendments),'nativeReviewed':False,'semanticCrossReview':False,'deviceVerified':False,'priorReviewedIdsPreserved':True}
    if args.sync:
        write(BASE/'integration-qa.json',report)
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
    main()
