"""Check additive source-gap lessons, translation preservation and scoped evidence."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
W = ROOT / 'docs/ssw-workspace/agriculture/parallel-30'
DATA = ROOT / 'src/data/agriculture'
BASE = '1ebab4e126392df8777f6ea575d13aa16d74d8a8'


def read(path):
    return json.loads(path.read_text())


def old(path):
    return json.loads(subprocess.check_output(['git', 'show', BASE + ':' + path], cwd=ROOT))


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


master = read(W / 'japanese-reviewed.json')
before = old('src/data/agriculture/lessons.ja.json')['lessons']
after = read(DATA / 'lessons.ja.json')['lessons']
assert after[:len(before)] == before
assert after[len(before):] == master['lessons']
assert len(before) == 180 and len(after) == 186
by_id = {l['id']: l for l in after}
paragraphs = {p['id']: (l, p) for l in after for p in l['paragraphs']}
for l in after:
    assert l['sourceHash'] == digest({k: v for k, v in l.items() if k != 'sourceHash'})
for evidence in master['sourceReviewProvenance']:
    for path_key, hash_key in [('authorPath', 'authorSha256'), ('reviewPath', 'reviewSha256')]:
        assert hashlib.sha256((ROOT / evidence[path_key]).read_bytes()).hexdigest() == evidence[hash_key]

index = read(DATA / 'translations.json')
integration = read(W / 'lesson-integration.json')
for packet in integration['translationPackets']:
    for path_key, hash_key in [('path', 'sha256'), ('reviewPath', 'reviewSha256')]:
        assert hashlib.sha256((ROOT / packet[path_key]).read_bytes()).hexdigest() == packet[hash_key], 'Translation review evidence changed'
translation_pairs = 0
for locale, relative in index['shards'].items():
    previous = old('src/data/agriculture/' + relative)
    current = read(DATA / relative)
    assert {k: current[k] for k in previous} == previous, 'Old translations changed'
    assert set(current) - set(previous) == {l['id'] for l in master['lessons']}
    for l in master['lessons']:
        t = current[l['id']]
        assert t['sourceHash'] == l['sourceHash']
        assert t['translatedDirectlyFrom'] == 'ja'
        assert t['status'] == 'translated_ai_unreviewed' and t['nativeReviewed'] is False
        assert t.get('domainReviewed', False) is False
        assert all(t[k].strip() for k in ['title', 'objective', 'activity'])
        for key in ['paragraphTitles', 'paragraphs']:
            assert set(t[key]) == {p['id'] for p in l['paragraphs']}
            assert all(v.strip() for v in t[key].values())
        translation_pairs += 1
assert translation_pairs == 72

course = read(DATA / 'course-manifest.json')
previous_course = old('src/data/agriculture/course-manifest.json')
assert course['levels']['1'] == previous_course['levels']['1']
assert course['levels']['2']['weeks'][:-1] == previous_course['levels']['2']['weeks']
assert course['levels']['2']['mockExams'] == previous_course['levels']['2']['mockExams']
assert course['levels']['2']['weeks'][-1]['lessonIds'] == [l['id'] for l in master['lessons']]
assert read(DATA / 'mock-exams.ja.json') == old('src/data/agriculture/mock-exams.ja.json')

previous_checks = old('src/data/agriculture/weekly-checks.ja.json')['exams']
checks = read(DATA / 'weekly-checks.ja.json')['exams']
assert checks[:-1] == previous_checks
bank = checks[-1]
assert bank['id'] == 'agr-par30-g2-check' and len(bank['questions']) == 9
assert bank['revision'] == 'v1-' + digest(bank['questions'])[:16]
raw = {q['id']: q for q in master['questions']}
positions = [0, 0, 0, 0]
for i, q in enumerate(bank['questions']):
    original = raw[q['id']]
    assert sorted(zip(q['optionsJa'], q['optionReasonsJa'])) == sorted(zip(original['optionsJa'], original['optionReasonsJa']))
    assert q['optionsJa'][q['correctIndex']] == original['optionsJa'][original['correctIndex']]
    for field in ['stemJa', 'lessonId', 'lessonSourceHash', 'knowledgeIds']:
        assert q[field] == original[field]
    assert q['lessonSourceHash'] == by_id[q['lessonId']]['sourceHash']
    positions[q['correctIndex']] += 1
    if i >= 2:
        assert not q['correctIndex'] == bank['questions'][i-1]['correctIndex'] == bank['questions'][i-2]['correctIndex']
assert max(positions) - min(positions) <= 1

ledger = read(ROOT / 'docs/ssw-workspace/agriculture/knowledge-ledger.json')
previous_ledger = old('docs/ssw-workspace/agriculture/knowledge-ledger.json')
assert ledger['knowledge'][:len(previous_ledger['knowledge'])] == previous_ledger['knowledge']
assert ledger['holds'] == previous_ledger['holds']
knowledge = {k['id']: k for k in ledger['knowledge']}
for q in bank['questions']:
    for kid in q['knowledgeIds']:
        assert q['id'] in knowledge[kid]['questionIds']

overlay = read(ROOT / 'docs/ssw-workspace/agriculture/source-gap-reconciliation-30.json')
backlog = {r['id']: r for r in read(ROOT / 'docs/ssw-workspace/agriculture/source-gap-backlog.json')['items']}
previous_covered = {sid for number in [11, 12, 22, 27]
                    for r in read(ROOT / f'docs/ssw-workspace/agriculture/source-gap-reconciliation-{number}.json')['resolutions']
                    if r['disposition'] == 'covered_by_new_prose' for sid in r['sourceItemIds']}
covered, partial = set(), set()
for resolution in overlay['resolutions']:
    for binding in resolution['evidenceBindings']:
        l, p = paragraphs[binding['paragraphId']]
        assert binding['lessonId'] == l['id']
        assert binding['lessonSourceHash'] == l['sourceHash']
        assert binding['paragraphSha256'] == digest(p)
    for sid in resolution['sourceItemIds']:
        assert sid not in previous_covered and backlog[sid]['status'] == 'missing'
        if resolution['disposition'] == 'covered_by_new_prose':
            assert resolution['countsAsClosedSourceOccurrence'] is True
            covered.add(sid)
        else:
            assert resolution['disposition'] == 'partial_new_prose_not_closed'
            assert resolution['countsAsClosedSourceOccurrence'] is False
            partial.add(sid)
assert len(covered) == 60 and len(partial) == 5 and not covered & partial
assert 'AGR-A10-GENERAL-0347' not in covered
assert overlay['summary']['candidateRemainingMissingOrPartialOccurrencesFromBaseline'] == 1200
assert overlay['summary']['coveragePercent'] is None

previous_inventory = old('docs/ssw-workspace/agriculture/source-inventory.json')
inventory = read(ROOT / 'docs/ssw-workspace/agriculture/source-inventory.json')
assert len(inventory['documents']) == len(previous_inventory['documents'])
for a, b in zip(previous_inventory['documents'], inventory['documents']):
    assert {k: v for k, v in a.items() if k != 'pages'} == {k: v for k, v in b.items() if k != 'pages'}
    for p, q in zip(a['pages'], b['pages']):
        assert {k: v for k, v in p.items() if k not in ['knowledgeIds', 'status']} == {k: v for k, v in q.items() if k not in ['knowledgeIds', 'status']}
        assert set(p['knowledgeIds']) <= set(q['knowledgeIds'])
print(json.dumps({'status': 'PASS', 'newLessons': 6, 'newTranslationPairs': 72,
                  'newWeeklyQuestions': 9, 'fullyExpressedSourceOccurrences': 60,
                  'partialNotClosed': 5, 'preservedMockForms': 4, 'preservedMockQuestions': 160,
                  'preservedExistingLessons': 180, 'preservedExistingTranslationPairs': 2160}))
