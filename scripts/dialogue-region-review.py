#!/usr/bin/env python3
"""Bounded extraction and explicit AI-read attestations for region review.

Hashing is mechanical evidence only. `record` requires the worker to have actually
read Japanese context and all twelve target sets; it never infers semantic review.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SESSION = ROOT / 'docs/localization-workspace/region-review/chubu/session-001'
LOCALES = ['en', 'vi', 'id', 'tl', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km']


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def digest(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def atomic(path, data):
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    temporary.replace(path)


def metadata(ids):
    found = {}
    for name in ['src/data/generated/scenarios.json', 'src/data/dialogue-content/scenario-overrides.json',
                 'src/data/dialogue-content/independent-city-overrides.json']:
        for row in read(ROOT / name):
            if row['id'] in ids:
                found[row['id']] = {k: row.get(k) for k in ['name', 'situation', 'learningObjective',
                                                          'playerGoal', 'npcGoal', 'description', 'locationId']}
    assert set(found) == set(ids), 'Missing scenario context'
    return found


def fields(source):
    result = []
    for tid, turn in source['turns'].items():
        result.append((tid, 'translation', turn['sourceJa']))
        if turn.get('hintJa'):
            result.append((tid, 'hintTranslation', turn['hintJa']))
    assert len(result) == 16
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['status', 'context', 'targets', 'record'])
    parser.add_argument('worker', type=int, choices=range(1, 7))
    parser.add_argument('--ids', nargs='+')
    parser.add_argument('--locales', default=','.join(LOCALES))
    parser.add_argument('--input')
    args = parser.parse_args()
    plan = read(SESSION / 'assignment.json')
    owner = next(w for w in plan['workers'] if w['worker'] == args.worker)
    index = read(ROOT / 'src/data/dialogue-content/locale-batch-index.json')
    completed = set()
    parts = sorted(SESSION.glob(f'worker{args.worker}-part[0-9][0-9][0-9][0-9].json'))
    for file in parts:
        for entry in read(file)['entries']:
            assert entry['scenarioId'] not in completed, 'Duplicate completed scenario'
            completed.add(entry['scenarioId'])
    remaining = [sid for sid in owner['scenarioIds'] if sid not in completed]
    if args.command == 'status':
        print(json.dumps({'worker': args.worker, 'assigned': len(owner['scenarioIds']), 'completed': len(completed),
                          'remaining': len(remaining), 'nextIds': remaining[:4], 'parts': len(parts)}))
        return
    source_cache, pack_cache = {}, {}

    def source(sid):
        batch = index[sid]
        if batch not in source_cache:
            source_cache[batch] = read(ROOT / f'docs/localization-workspace/sources/dialogue-batch-{batch}.ja.json')
        return source_cache[batch]['scenarios'][sid]

    def pack(sid, locale):
        batch = index[sid]
        assert locale in LOCALES and plan['batchOwners'][batch] == args.worker
        relative = f'src/data/dialogue-content/locale-batches/{locale}/{batch}.json'
        if relative not in pack_cache:
            pack_cache[relative] = read(ROOT / relative)
        assert pack_cache[relative]['nativeReviewed'] is False
        return relative, pack_cache[relative]

    if args.command in ['context', 'targets']:
        ids = args.ids or remaining[:2]
        assert ids and len(ids) == len(set(ids)) and set(ids) <= set(remaining), 'Unowned/already reviewed selection'
        if args.command == 'context':
            meta = metadata(ids)
            output = [{'scenarioId': sid, 'metadata': meta[sid], 'japanese':
                       [{'turn': n, 'speaker': t['speaker'], 'ja': t['sourceJa'],
                         **({'hint': t['hintJa']} if t.get('hintJa') else {})}
                        for n, t in enumerate(source(sid)['turns'].values(), 1)]} for sid in ids]
        else:
            locales = args.locales.split(',')
            assert set(locales) <= set(LOCALES) and len(locales) == len(set(locales))
            output = []
            for sid in ids:
                targets = {}
                for locale in locales:
                    _, data = pack(sid, locale)
                    targets[locale] = [str(n) + ': ' + data['scenarios'][sid]['turns'][tid]['translation'] +
                                       (' | Hint: ' + data['scenarios'][sid]['turns'][tid]['hintTranslation']
                                        if t.get('hintJa') else '')
                                       for n, (tid, t) in enumerate(source(sid)['turns'].items(), 1)]
                output.append({'scenarioId': sid, 'targets': targets})
        print(json.dumps(output, ensure_ascii=False, separators=(',', ':')))
        return
    intent = SESSION / f'worker{args.worker}-intent.json'
    assert not intent.exists() or read(intent)['status'] != 'PREPARED', 'Preserve prepared intent; coordinator recovery required before another record'
    payload = read(Path(args.input))
    cases = payload['scenarios']
    ids = [case['scenarioId'] for case in cases]
    assert ids and len(ids) == len(set(ids)) and set(ids) <= set(remaining), 'Duplicate/unowned/completed record'
    for case in cases:
        assert case.get('contextRead') is True and set(case['reviewedLocales']) == set(LOCALES)
        assert len(case['reviewedLocales']) == 12 and len(case['reviewNotes'].strip()) >= 30
    changes, dirty, fix_keys = [], set(), set()
    for fix in payload.get('fixes', []):
        sid, locale, field = fix['scenarioId'], fix['locale'], fix['field']
        assert sid in ids and field in ['translation', 'hintTranslation']
        if 'turn' in fix:
            assert isinstance(fix['turn'], int) and 1 <= fix['turn'] <= 11, 'Invalid turn number'
        tid = list(source(sid)['turns'])[fix['turn'] - 1] if 'turn' in fix else fix['turnId']
        assert tid in source(sid)['turns'] and (field != 'hintTranslation' or source(sid)['turns'][tid].get('hintJa'))
        relative, data = pack(sid, locale)
        key = (sid, locale, tid, field)
        assert key not in fix_keys and len(fix['reason'].strip()) >= 20
        fix_keys.add(key)
        actual = data['scenarios'][sid]['turns'][tid]
        assert actual[field] == fix['before'], 'Stale before value'
        assert isinstance(fix['after'], str) and fix['after'].strip() and fix['after'] != fix['before']
        actual[field] = fix['after']
        changes.append({**fix, 'path': relative, 'turnId': tid})
        dirty.add(relative)
    meta, entries = metadata(ids), []
    for case in cases:
        sid = case['scenarioId']
        order = fields(source(sid))
        targets = {}
        for locale in LOCALES:
            _, data = pack(sid, locale)
            for tid, _, _ in order:
                assert data['scenarios'][sid]['turns'][tid]['sourceJa'] == source(sid)['turns'][tid]['sourceJa']
                assert data['scenarios'][sid]['turns'][tid]['speaker'] == source(sid)['turns'][tid]['speaker']
            targets[locale] = [digest(data['scenarios'][sid]['turns'][tid][field]) for tid, field, _ in order]
        entries.append({'scenarioId': sid, 'batch': index[sid], 'sourceSha256': [digest(ja) for _, _, ja in order],
                        'targetSha256': targets, 'contextSha256': digest(json.dumps(meta[sid], ensure_ascii=False, sort_keys=True, separators=(',', ':'))),
                        'reviewNotes': case['reviewNotes'], 'sourceIssues': case.get('sourceIssues', [])})
    receipt = {'schemaVersion': 'context-review-compact-v1', 'worker': args.worker,
               'baselineCommit': plan['baselineCommit'], 'assignmentPath': str((SESSION / 'assignment.json').relative_to(ROOT)),
               'assignmentSha256': hashlib.sha256((SESSION / 'assignment.json').read_bytes()).hexdigest(),
               'nativeReviewed': False, 'wholeScenarioAll12Read': True, 'entries': entries, 'changes': changes,
               'reviewedScenarios': len(ids), 'reviewedFields': len(ids) * 192,
               'scope': 'AI Japanese context and all12 sentence/task sets; native/source/device approval separate.'}
    part_path = SESSION / f'worker{args.worker}-part{len(parts) + 1:04d}.json'
    assert not part_path.exists()
    atomic(intent, {'status': 'PREPARED', 'partPath': str(part_path.relative_to(ROOT)), 'receipt': receipt})
    for relative in dirty:
        temporary = (ROOT / relative).with_suffix('.json.tmp')
        temporary.write_text(json.dumps(pack_cache[relative], ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        temporary.replace(ROOT / relative)
    atomic(part_path, receipt)
    atomic(intent, {'status': 'APPLIED', 'partPath': str(part_path.relative_to(ROOT))})
    print(json.dumps({'status': 'RECORDED_AI_READ_ATTESTATION_NOT_NATIVE_CERTIFICATION', 'worker': args.worker,
                      'newScenarios': len(ids), 'completed': len(completed) + len(ids),
                      'remaining': len(owner['scenarioIds']) - len(completed) - len(ids),
                      'changedFields': len(changes), 'partPath': str(part_path.relative_to(ROOT))}))


if __name__ == '__main__':
    main()
