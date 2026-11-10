"""Repair collapsed topic objectives using exact, revision-bound lesson source text.

No Japanese text, question hash, answer or other translation field is changed.
Only a target objective shared across distinct Japanese objectives is a candidate.
An exact canonical lesson-objective match is mandatory; no topic inference is used.
"""
from pathlib import Path
import argparse
import collections
import json

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/restaurant'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    temporary = path.with_name(path.name + '.objective-tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--apply', action='store_true')
parser.add_argument('--locales', nargs='*')
args = parser.parse_args()
lessons = [lesson for path in DATA.glob('lessons.*.ja.json') for lesson in read(path)['lessons']]
questions = {question['id']: question for path in DATA.glob('exams.*.ja.json')
             for exam in read(path)['exams'] for question in exam['questions']}
reports = []
for path in sorted((DATA / 'translations').glob('*.json')):
    if args.locales and path.stem not in args.locales:
        continue
    shard = read(path)
    cache = {}
    for lesson in lessons:
        translation = shard.get('lessons', {}).get(lesson['id'])
        if translation and translation.get('sourceHash') == lesson['sourceHash'] and translation.get('objective'):
            assert lesson['objectiveJa'] not in cache, 'Ambiguous canonical lesson objective'
            cache[lesson['objectiveJa']] = (lesson, translation['objective'])
    grouped = collections.defaultdict(set)
    for id, target in shard.get('questions', {}).items():
        if id in questions:
            grouped[target.get('objective', '')].add(questions[id]['objectiveJa'])
    collapsed = {target for target, sources in grouped.items() if len(sources) > 1}
    changed = collections.defaultdict(list)
    for id, target in shard.get('questions', {}).items():
        source = questions.get(id)
        if not source or target.get('objective') not in collapsed:
            continue
        match = cache.get(source['objectiveJa'])
        if not match or target['objective'] == match[1]:
            continue
        assert target.get('sourceHash') == source['sourceHash'], 'Stale question translation; do not rebind'
        lesson, aligned = match
        changed[lesson['id']].append(id)
        target['objective'] = aligned
    report = {'locale': path.stem, 'exactSourceLessonCache': len(cache),
              'changedQuestionObjectives': sum(len(ids) for ids in changed.values()),
              'groups': [{'sourceLessonId': id, 'questionIds': ids} for id, ids in sorted(changed.items())],
              'applied': args.apply, 'questionHashesChanged': False,
              'otherTranslationFieldsChanged': False, 'nativeReviewed': False,
              'method': 'Exact Japanese objective equality and current lesson sourceHash; never topic substitution.'}
    if args.apply and changed:
        write(path, shard)
    reports.append(report)
if args.apply:
    write(ROOT / 'docs/ssw-workspace/restaurant/completion5-objective-alignment.json',
          {'schemaVersion': 1, 'reports': reports, 'semanticTranslationCertified': False})
print(json.dumps({'applied': args.apply, 'locales': [
    {key: report[key] for key in ('locale', 'exactSourceLessonCache', 'changedQuestionObjectives')}
    for report in reports]}, ensure_ascii=False))
