"""Register independently reviewed Shikoku receipts without semantic cross-review."""
import hashlib
import json
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'docs/localization-workspace/region-review/shikoku-20261103'
QUEUE = ROOT / 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json'
MANIFEST = ROOT / 'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'

def read(path):
    return json.loads(path.read_text())

def write(path, value):
    temporary = path.with_suffix(path.suffix + '.integrating')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)

def integrate():
    paths = sorted(BASE.glob('worker-*.json'))
    plan = read(BASE / 'continuation-plan.json')
    for path, digest in plan['preservedReceiptSha256'].items():
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == digest, ('Prior evidence changed', path)
    ownership = {w['receipt']: set(w['assignedScenarioIds']) for w in plan['workers']}
    assert sum(map(len, ownership.values())) == len(set.union(*ownership.values())), 'Worker assignments overlap'
    receipts = [read(p) for p in paths]
    for path, receipt in zip(paths, receipts):
        if path.name in ownership:
            assert set(receipt['scenarios']) <= ownership[path.name], ('Worker scope violation', path.name)
    reviewed = {s for r in receipts for s in r['scenarios']}
    original = QUEUE.read_bytes()
    queue = read(QUEUE)
    prefectures = [p for p in queue['prefectures'] if p['prefectureId'] in {'PRF-036', 'PRF-037', 'PRF-038', 'PRF-039'}]
    prior = {s for p in prefectures for c in p['cities'] for s in c['sentenceTaskReviewedScenarioIds']}
    assert prior <= reviewed, 'Existing registered evidence must be preserved'
    for prefecture in prefectures:
        for city in prefecture['cities']:
            additions = reviewed & set(city['pendingSentenceTaskScenarioIds'])
            city['sentenceTaskReviewedScenarioIds'] += sorted(additions)
            city['pendingSentenceTaskScenarioIds'] = [s for s in city['pendingSentenceTaskScenarioIds'] if s not in additions]
        prefecture['aiSentenceTaskReviewedScenarios'] = sum(len(c['sentenceTaskReviewedScenarioIds']) for c in prefecture['cities'])
        prefecture['pendingSentenceTaskScenarios'] = prefecture['scenarioCount'] - prefecture['aiSentenceTaskReviewedScenarios']
        prefecture['status'] = 'AI_SENTENCE_TASK_REVIEWED' if not prefecture['pendingSentenceTaskScenarios'] else 'IN_PROGRESS'
    queue['aiSentenceTaskReviewedScenarios'] = sum(p['aiSentenceTaskReviewedScenarios'] for p in queue['prefectures'])
    queue['remainingSentenceTaskScenarios'] = queue['canonicalScenarios'] - queue['aiSentenceTaskReviewedScenarios']
    write(QUEUE, queue)
    try:
        runpy.run_path(str(ROOT / 'scripts/check-shikoku-context-review.py'))
    except BaseException:
        QUEUE.write_bytes(original)
        raise
    changed = {c['path'] for r in receipts for c in r['changes']}
    changed.update(c['path'] for r in receipts for c in r.get('sourceChanges', []))
    index = read(ROOT / 'src/data/dialogue-content/locale-batch-index.json')
    reviewed_batches = {index[s] for s in reviewed}
    manifest = read(MANIFEST)
    for batch in manifest['completedBatches']:
        if batch['batch'] in reviewed_batches:
            source = ROOT / f"docs/localization-workspace/sources/dialogue-batch-{batch['batch']}.ja.json"
            batch['sourceSha256'] = hashlib.sha256(source.read_bytes()).hexdigest()
        for file in batch['files']:
            if file['path'] in changed:
                file['sha256'] = hashlib.sha256((ROOT / file['path']).read_bytes()).hexdigest()
    write(MANIFEST, manifest)
    total = sum(p['scenarioCount'] for p in prefectures)
    write(BASE / 'integration-qa.json', {
        'status': 'PASS', 'region': 'shikoku', 'total': total,
        'contextReviewed': len(reviewed), 'remaining': total - len(reviewed),
        'reviewedFields': len(reviewed) * 192,
        'changedFields': sum(len(r['changes']) for r in receipts),
        'nativeReviewed': False, 'semanticCrossReview': False,
        'deviceVerified': False, 'priorReviewedIdsPreserved': True,
        'sourceRevisionPaths': sorted({c['path'] for r in receipts for c in r.get('sourceChanges', [])}),
        'unresolvedSourceIssues': [issue for r in receipts for issue in r.get('sourceIssues', []) if not isinstance(issue, dict) or issue.get('status') != 'resolved'],
    })

if __name__ == '__main__':
    integrate()
