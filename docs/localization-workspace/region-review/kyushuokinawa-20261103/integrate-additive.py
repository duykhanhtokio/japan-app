"""Integrate disjoint self-reviewed drafts, preserving published receipts byte-for-byte.

Usage: python integrate-additive.py DRAFT_ROOT
Draft directories worker1..worker6 contain assigned.json, proposals.json, receipt.json.
Worker6 owns the second half of Fukuoka, so its published ownership is worker1.
This checks structure, ownership and revision bindings, not another worker's semantics.
"""
import collections
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[4]
OUT = pathlib.Path(__file__).resolve().parent
WORK = pathlib.Path(sys.argv[1]).resolve()


def read(p):
    return json.loads(p.read_text())


def write(p, data):
    temp = p.with_name(p.name + '.integrating')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    temp.replace(p)


def sha(s):
    return hashlib.sha256(s.encode()).hexdigest()


queuepath = ROOT / 'docs/localization-workspace/naturalness-review-2026-10-25/prefecture-queue.json'
q = read(queuepath)
index = read(ROOT / 'src/data/dialogue-content/locale-batch-index.json')
locales = set(q['supportingLocales'])
oldfiles = [p for p in OUT.glob('worker*.json') if re.fullmatch(r'worker-[1-6](?:-part-\d+)?\.json', p.name)]
oldhashes = {p: hashlib.sha256(p.read_bytes()).hexdigest() for p in oldfiles}
oldrows = {}
repairs = 0
for p in oldfiles:
    receipt = read(p)
    repairs += len(receipt['changes'])
    for row in receipt['reviews']:
        key = row['scenarioId'], row['locale']
        assert key not in oldrows, ('duplicate published receipt', key)
        oldrows[key] = row
owners = {sid: w for w, prfs in {1:{40}, 2:{41,42}, 3:{43}, 4:{44,45}, 5:{46}, 6:{47}}.items()
          for p in q['prefectures'] if int(p['prefectureId'][-3:]) in prfs
          for c in p['cities'] for sid in c['sentenceTaskReviewedScenarioIds'] + c['pendingSentenceTaskScenarioIds']}
packs, sources = {}, {}
newrows, newreceipts, changed = {}, [], set()
assignment_union = set()
for worker in range(1, 7):
    folder = WORK / f'worker{worker}'
    assigned = set(read(folder / 'assigned.json'))
    assert not assignment_union & assigned, 'overlapping worker assignments'
    assignment_union |= assigned
    if not assigned:
        continue
    if not (folder / 'receipt.json').exists():
        continue
    draft = read(folder / 'receipt.json')
    assert draft['nativeReviewed'] is False
    # A replacement wave may give an idle AI a disjoint part of another
    # prefecture. Published ownership follows scenario IDs, not process names.
    assigned_owners = {owners[sid] for sid in assigned}
    assert len(assigned_owners) == 1, 'each draft folder needs one canonical owner'
    published_owner = assigned_owners.pop()
    rows = {(r['scenarioId'], r['locale']): r for r in draft['reviews']}
    assert len(rows) == len(draft['reviews'])
    ids = {sid for sid, loc in rows}
    assert ids <= assigned
    assert set(draft['scenarios']) == ids
    for sid in ids:
        assert owners[sid] == published_owner
        assert {loc for s, loc in rows if s == sid} == locales
    fresh = ids - {sid for sid, loc in oldrows}
    # Already integrated draft rows must agree exactly with their published bindings.
    for key, row in rows.items():
        if key in oldrows:
            assert row['fields'] == oldrows[key]['fields'], ('published row changed', key)
    proposals = read(folder / 'proposals.json')
    assert proposals == draft['changes'], 'draft proposal/receipt mismatch'
    props = [p for p in proposals if p['scenarioId'] in fresh]
    propkeys = set()
    for prop in props:
        sid, tid, field = prop['scenarioId'], prop['turnId'], prop['field']
        path = prop['path']
        assert sid in fresh and field in ('translation', 'hintTranslation')
        assert path in {f'src/data/dialogue-content/locale-batches/{loc}/{index[sid]}.json' for loc in locales}
        key = path, sid, tid, field
        assert key not in propkeys, ('duplicate proposal', key)
        propkeys.add(key)
        if path not in packs:
            packs[path] = read(ROOT / path)
        turn = packs[path]['scenarios'][sid]['turns'][tid]
        assert turn[field] == prop['before'], ('stale proposal', key)
        assert isinstance(prop['after'], str) and prop['after'].strip()
        turn[field] = prop['after']
        changed.add(path)
    for sid in fresh:
        batch = index[sid]
        if batch not in sources:
            sources[batch] = read(ROOT / f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json')
        source = sources[batch]['scenarios'][sid]['turns']
        expected = {(tid, field) for tid, turn in source.items()
                    for field in (['translation', 'hintTranslation'] if turn.get('hintJa') else ['translation'])}
        assert len(expected) == 16
        for loc in locales:
            key = sid, loc
            row = rows[key]
            assert key not in newrows
            assert row.get('nativeReviewed', False) is False
            path = f'src/data/dialogue-content/locale-batches/{loc}/{batch}.json'
            if path not in packs:
                packs[path] = read(ROOT / path)
            target = packs[path]['scenarios'][sid]['turns']
            fields = row['fields']
            assert len(fields) == 16
            assert {(f['turnId'], f['field']) for f in fields} == expected
            for f in fields:
                tid, field = f['turnId'], f['field']
                assert sha(source[tid]['hintJa' if field == 'hintTranslation' else 'sourceJa']) == f['sourceSha256']
                assert sha(target[tid][field]) == f['targetSha256'], ('target mismatch', key, tid, field)
            newrows[key] = row
    if fresh:
        part = 1
        while (OUT / f'worker-{published_owner}-part-{part:04d}.json').exists() or any(p.name == f'worker-{published_owner}-part-{part:04d}.json' for p,d in newreceipts):
            part += 1
        receipt = dict(draft, worker=published_owner, scenarios=sorted(fresh),
                       reviews=[rows[sid, loc] for sid in sorted(fresh) for loc in sorted(locales)],
                       changes=props, reviewedFields=len(fresh)*192, changedFields=len(props),
                       storage='Additive receipt; previous receipt files retained byte-for-byte.')
        newreceipts.append((OUT / f'worker-{published_owner}-part-{part:04d}.json', receipt))
        repairs += len(props)

# No mutations occur until every selected draft has passed all checks.
reviewed = {sid for sid, loc in oldrows} | {sid for sid, loc in newrows}
for p, receipt in newreceipts:
    write(p, receipt)
for path in changed:
    write(ROOT / path, packs[path])
for p in q['prefectures']:
    for c in p['cities']:
        add = set(c['pendingSentenceTaskScenarioIds']) & reviewed
        c['sentenceTaskReviewedScenarioIds'] += sorted(add)
        c['pendingSentenceTaskScenarioIds'] = [sid for sid in c['pendingSentenceTaskScenarioIds'] if sid not in add]
    p['aiSentenceTaskReviewedScenarios'] = sum(len(c['sentenceTaskReviewedScenarioIds']) for c in p['cities'])
    p['pendingSentenceTaskScenarios'] = p['scenarioCount'] - p['aiSentenceTaskReviewedScenarios']
q['aiSentenceTaskReviewedScenarios'] = sum(p['aiSentenceTaskReviewedScenarios'] for p in q['prefectures'])
q['remainingSentenceTaskScenarios'] = q['canonicalScenarios'] - q['aiSentenceTaskReviewedScenarios']
write(queuepath, q)
manifestpath = ROOT / 'docs/localization-workspace/DIALOGUE_TRANSLATION_PROGRESS.json'
manifest = read(manifestpath)
for batch in manifest['completedBatches']:
    for f in batch['files']:
        if f['path'] in changed:
            f['sha256'] = hashlib.sha256((ROOT / f['path']).read_bytes()).hexdigest()
write(manifestpath, manifest)
progress = read(OUT / 'progress.json')
progress.update(reviewed=len(reviewed), remaining=1064-len(reviewed), fields=len(reviewed)*192, repairs=repairs)
progress['status'] = 'AI_CONTEXT_REVIEW_COMPLETE_NOT_NATIVE_CERTIFIED' if len(reviewed) == 1064 else 'IN_PROGRESS'
for w in progress['workers']:
    owned = {sid for sid, owner in owners.items() if owner == w['worker']}
    w['reviewed'] = len(owned & reviewed)
    w['pendingScenarioIds'] = [sid for sid in w['pendingScenarioIds'] if sid not in reviewed]
write(OUT / 'progress.json', progress)
assert all(hashlib.sha256(p.read_bytes()).hexdigest() == h for p, h in oldhashes.items())
print(json.dumps({'newScenarios':len(newrows)//12, 'reviewed':len(reviewed), 'remaining':1064-len(reviewed),
                  'newChanges':sum(len(d['changes']) for p,d in newreceipts), 'changedPacks':len(changed),
                  'preservedReceiptFiles':len(oldhashes)}))
