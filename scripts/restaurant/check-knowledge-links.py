"""Check restaurant subject-link integrity; this does not certify source coverage."""
from collections import Counter
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/restaurant'


def read(path):
    return json.loads(path.read_text())


def main():
    ledger = read(ROOT / 'docs/ssw-workspace/restaurant/knowledge-ledger.json')
    errors = []
    units = {}
    records = {'lessons': {}, 'questions': {}}
    levels = {}
    for unit in ledger['units']:
        if unit['id'] in units:
            errors.append(f"duplicate unit: {unit['id']}")
        units[unit['id']] = unit
    for level in ('1', '2'):
        lessons = read(DATA / f'lessons.{level}.ja.json')['lessons']
        exams = read(DATA / f'exams.{level}.ja.json')['exams']
        for kind, rows in [('lessons', lessons), ('questions', [q for e in exams for q in e['questions']])]:
            for row in rows:
                rid = row['id']
                if rid in records[kind]:
                    errors.append(f'duplicate {kind} ID: {rid}')
                records[kind][rid] = row
                levels[rid] = level
    for kind, field in [('lessons', 'lessonIds'), ('questions', 'questionIds')]:
        for rid, row in records[kind].items():
            ids = row.get('knowledgeIds', [])
            if len(ids) != len(set(ids)):
                errors.append(f'duplicate links: {rid}')
            for uid in ids:
                if uid not in units:
                    errors.append(f'dangling knowledge ID: {rid} -> {uid}')
                    continue
                unit = units[uid]
                if unit['level'] != levels[rid]:
                    errors.append(f'level mismatch: {rid} -> {uid}')
                if rid not in unit.get(field, []):
                    errors.append(f'missing reverse link: {rid} -> {uid}')
        for uid, unit in units.items():
            ids = unit.get(field, [])
            if len(ids) != len(set(ids)):
                errors.append(f'duplicate reverse links: {uid}.{field}')
            for rid in ids:
                if rid not in records[kind]:
                    errors.append(f'dangling record ID: {uid} -> {rid}')
                elif uid not in records[kind][rid].get('knowledgeIds', []):
                    errors.append(f'missing forward link: {uid} -> {rid}')
            if kind == 'lessons' and unit.get('lessonId') and unit['lessonId'] not in ids:
                errors.append(f'primary lesson missing from lessonIds: {uid}')
    actual = dict(Counter(u['coverageStatus'] for u in units.values()))
    if actual != ledger['summary']['coverageStatusCounts']:
        errors.append('coverage-status summary differs from unit records')
    result = {
        'status': 'SUBJECT_LINK_PASS' if not errors else 'FAIL',
        'units': len(units),
        'records': {kind: {
            'total': len(rows),
            'mapped': sum(bool(r.get('knowledgeIds')) for r in rows.values()),
            'unmapped': [rid for rid, row in rows.items() if not row.get('knowledgeIds')],
            'edges': sum(len(row.get('knowledgeIds', [])) for row in rows.values()),
        } for kind, rows in records.items()},
        'coverageStatusCounts': actual,
        'sourceCoverageCertified': False,
        'nativeReviewed': False,
        'domainReviewed': False,
        'errors': errors,
    }
    print(json.dumps(result, ensure_ascii=False))
    return 1 if errors else 0


if __name__ == '__main__':
    raise SystemExit(main())
