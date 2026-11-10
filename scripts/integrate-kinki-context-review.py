"""Validate actual all-locale receipts and reconcile Kinki ledgers mechanically."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'docs/localization-workspace/region-review/kinki-20261103'
BASELINE = '80054e5876a82872971c688b3dbbadb2d96569f0'
LOCALES = {'en','vi','id','tl','zh-CN','zh-TW','hi','bn','ne','my','th','km'}
def read(p):
    return json.loads((ROOT / p).read_text())
def digest(s):
    return hashlib.sha256(s.encode()).hexdigest()
def filehash(p):
    return hashlib.sha256((ROOT / p).read_bytes()).hexdigest()
def write(p, data):
    (ROOT / p).write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')

def main():
    global BASE, BASELINE
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true')
    parser.add_argument('--session', default='docs/localization-workspace/region-review/kinki-20261103')
    parser.add_argument('--baseline', default=BASELINE)
    parser.add_argument('--comparison-ref', help='Preserve concurrent pack edits from this verified Git ref')
    args=parser.parse_args()
    BASE=ROOT / args.session
    assert BASE.resolve().is_relative_to((ROOT/'docs/localization-workspace/region-review').resolve())
    BASELINE=args.baseline
    index=read('src/data/dialogue-content/locale-batch-index.json')
    qp='docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json'
    pp='docs/localization-workspace/region-review/plan.json'
    mp='docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'
    queue,plan,manifest=read(qp),read(pp),read(mp)
    region=next(r for r in plan['regions'] if r['regionId']=='kinki')
    pids={p['prefectureId'] for p in region['prefectures']}
    prefectures=[p for p in queue['prefectures'] if p['prefectureId'] in pids]
    members={s for p in prefectures for c in p['cities'] for k in ['sentenceTaskReviewedScenarioIds','pendingSentenceTaskScenarioIds'] for s in c[k]}
    previous={s for p in prefectures for c in p['cities'] for s in c['sentenceTaskReviewedScenarioIds']}
    complete=set(); owners={};changes={};workers=[];cache={}
    def cached(p):
        if p not in cache: cache[p]=read(p)
        return cache[p]
    for n in range(1,7):
        path=BASE/f'worker-{n}.json'
        if not path.exists(): continue
        receipt=read(path)
        if receipt.get('schemaVersion')=='context-review-compact-v1':
            receipt=json.loads(subprocess.check_output(['node','-e',
                'const {expandContextReceipt}=require("./scripts/lib/dialogue-context-receipts.cjs");process.stdout.write(JSON.stringify(expandContextReceipt(require(process.argv[1]))));',str(path)],cwd=ROOT))
        assert receipt['nativeReviewed'] is False
        assert receipt.get('wholeScenarioAll12Read') is True
        rows={}
        for row in receipt['reviews']:
            sid,locale=row['scenarioId'],row['locale']
            assert sid in members and locale in LOCALES
            assert locale not in rows.setdefault(sid,set())
            rows[sid].add(locale)
            batch=index[sid]
            assert owners.setdefault(batch,n)==n, ('Overlapping locale batch',batch)
            source=cached(f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json')['scenarios'][sid]['turns']
            target=cached(f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json')['scenarios'][sid]['turns']
            expected={(tid,k) for tid,t in source.items() for k,s in [('translation','sourceJa'),('hintTranslation','hintJa')] if t.get(s)}
            assert len(expected)==16
            assert {(f['turnId'],f['field']) for f in row['fields']}==expected
            assert len(row['fields'])==16
            for f in row['fields']:
                tid,k=f['turnId'],f['field']; sk='sourceJa' if k=='translation' else 'hintJa'
                assert source[tid][sk]==target[tid][sk]
                assert digest(source[tid][sk])==f['sourceSha256']
                assert digest(target[tid][k])==f['targetSha256'], (sid,locale,tid,k)
        for sid,ls in rows.items():
            assert ls==LOCALES and sid not in complete
            complete.add(sid)
        assert receipt['reviewedScenarios']==len(rows)
        assert receipt['reviewedFields']==len(rows)*192
        edits=receipt.get('changes',receipt.get('corrections',[]))
        for change in edits:
            sid=change['scenarioId']; assert sid in rows
            locale=change.get('locale') or change['path'].split('/')[-2]
            path=f'src/data/dialogue-content/locale-batches/{locale}/{index[sid]}.json'
            assert locale in LOCALES and change.get('path',path)==path
            assert change['field'] in {'translation','hintTranslation'}
            assert cached(path)['scenarios'][sid]['turns'][change['turnId']][change['field']]==change['after']
            changes.setdefault(path,[]).append(change)
        workers.append({'worker':n,'reviewed':len(rows),'fields':len(rows)*192,'changedFields':len(edits),'receiptSha256':filehash(BASE/f'worker-{n}.json')})
    # Reconstruct every changed pack from Git plus the exact recorded edits.
    for path,edits in changes.items():
        old=json.loads(subprocess.check_output(['git','show',BASELINE+':'+path],cwd=ROOT))
        for edit in edits:
            t=old['scenarios'][edit['scenarioId']]['turns'][edit['turnId']]
            assert t[edit['field']]==edit['before'], ('Wrong before',path)
            t[edit['field']]=edit['after']
        if args.comparison_ref:
            old=json.loads(subprocess.check_output(['git','show',args.comparison_ref+':'+path],cwd=ROOT))
            for edit in edits:
                t=old['scenarios'][edit['scenarioId']]['turns'][edit['turnId']]
                assert t[edit['field']] in (edit['before'],edit['after']), ('Concurrent field conflict',path)
                t[edit['field']]=edit['after']
        assert old==cached(path), ('Unexplained pack edit',path)
    for p in prefectures:
        for c in p['cities']:
            c['sentenceTaskReviewedScenarioIds']=list(dict.fromkeys(c['sentenceTaskReviewedScenarioIds']+[s for s in c['pendingSentenceTaskScenarioIds'] if s in complete]))
            c['pendingSentenceTaskScenarioIds']=[s for s in c['pendingSentenceTaskScenarioIds'] if s not in complete]
        p['aiSentenceTaskReviewedScenarios']=sum(len(c['sentenceTaskReviewedScenarioIds']) for c in p['cities'])
        p['pendingSentenceTaskScenarios']=p['scenarioCount']-p['aiSentenceTaskReviewedScenarios']
        p['status']=('IN_PROGRESS' if p['aiSentenceTaskReviewedScenarios'] else 'PENDING') if p['pendingSentenceTaskScenarios'] else 'AI_SENTENCE_TASK_REVIEWED'
    queue['aiSentenceTaskReviewedScenarios']=sum(p['aiSentenceTaskReviewedScenarios'] for p in queue['prefectures'])
    queue['remainingSentenceTaskScenarios']=queue['canonicalScenarios']-queue['aiSentenceTaskReviewedScenarios']
    active=next((p for p in prefectures if p['pendingSentenceTaskScenarios']),None)
    if active is None:
        by_id={p['prefectureId']:p for p in queue['prefectures']}
        active=next((by_id[pid] for pid in queue['order'] if pid in by_id and by_id[pid]['pendingSentenceTaskScenarios']),None)
    if active:
        queue['activePrefectureId']=active['prefectureId']
        queue['activePrefectureNameJa']=next(p['nameJa'] for r in plan['regions'] for p in r['prefectures'] if p['prefectureId']==active['prefectureId'])
        queue['nextScenarioId']=next(s for c in active['cities'] for s in c['pendingSentenceTaskScenarioIds'])
        queue['nextBatch']=index[queue['nextScenarioId']]
    else:
        queue.update(activePrefectureId=None,activePrefectureNameJa=None,nextScenarioId=None,nextBatch=None)
    for b in manifest['completedBatches']:
        for f in b['files']:
            if f['path'] in changes: f['sha256']=filehash(f['path'])
    plan['activeRegionId']=next((r['regionId'] for r in plan['regions'] if active and any(p['prefectureId']==active['prefectureId'] for p in r['prefectures'])),None)
    plan['fullContextReviewedScenarios']=queue['aiSentenceTaskReviewedScenarios']
    plan['remainingContextScenarios']=queue['remainingSentenceTaskScenarios']
    for r in plan['regions']:
        for p in r['prefectures']:
            p['contextReviewedScenarios']=next(q['aiSentenceTaskReviewedScenarios'] for q in queue['prefectures'] if q['prefectureId']==p['prefectureId'])
        r['contextReviewedScenarios']=sum(p['contextReviewedScenarios'] for p in r['prefectures'])
        r['remainingScenarios']=r['totalScenarios']-r['contextReviewedScenarios']
        r['status']='IN_PROGRESS' if r['remainingScenarios'] and r['contextReviewedScenarios'] else ('NOT_STARTED' if r['remainingScenarios'] else 'AI_CONTEXT_REVIEWED_NOT_NATIVE_CERTIFIED')
    report={'status':'MECHANICAL_RECEIPT_VALIDATION_PASS','region':'kinki','total':len(members),'reviewed':len(previous|complete),'remaining':len(members-(previous|complete)),'sessionReviewed':len(complete),'reviewedFields':len(complete)*192,'changedFields':sum(len(e) for e in changes.values()),'workers':workers,'nativeReviewed':False,'semanticCrossReview':False,'priorReviewedIdsPreserved':True}
    if args.write:
        for p,data in [(qp,queue),(pp,plan),(mp,manifest),(BASE/'progress.json',report)]: write(p,data)
    print(json.dumps(report))

if __name__=='__main__': main()
