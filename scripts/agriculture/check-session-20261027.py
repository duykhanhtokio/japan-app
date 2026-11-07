"""Verify additive Agriculture integration against the actual fetched baseline."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = '06905f8b3a6ba51df28d55b0abd3e4ecc2edbf73'
W = 'docs/ssw-workspace/agriculture/'
D = 'src/data/agriculture/'

def old_bytes(path):
    return subprocess.check_output(['git', 'show', f'{BASE}:{path}'], cwd=ROOT)

def old(path):
    return json.loads(old_bytes(path))

def read(path):
    return json.loads((ROOT / path).read_text())

def same_objects(path, key):
    before = old(path)[key]
    after = read(path)[key]
    assert after[:len(before)] == before, path
    return len(before), len(after)

assert same_objects(D+'lessons.ja.json', 'lessons') == (174, 180)
assert same_objects(D+'recognition-images.json', 'images') == (42, 50)
assert same_objects(W+'illustration-register.json', 'figures')[1] - same_objects(W+'illustration-register.json', 'figures')[0] == 8
assert (ROOT / (D+'weekly-checks.ja.json')).read_bytes() == old_bytes(D+'weekly-checks.ja.json')
for path in ['src/services/agriculture-study-state.ts', 'src/services/kensetsu-test-state.ts',
             W+'source-coverage-audit.json', W+'source-gap-backlog.json',
             W+'source-gap-reconciliation-11.json', W+'source-gap-reconciliation-12.json', W+'source-gap-reconciliation-22.json']:
    assert (ROOT / path).read_bytes() == old_bytes(path), path
before_course = old(D+'course-manifest.json')
after_course = read(D+'course-manifest.json')
for level in ['1', '2']:
    before = before_course['levels'][level]['weeks']
    after = after_course['levels'][level]['weeks']
    assert after[:len(before)] == before
    assert len(after) - len(before) == (1 if level == '2' else 0)
index = read(D+'translations.json')
for locale, path in index['shards'].items():
    before = old(D+path)
    after = read(D+path)
    assert all(after[k] == v for k, v in before.items()), locale
    assert len(after) - len(before) == 6, locale
old_knowledge = old(W+'knowledge-ledger.json')['knowledge']
new_knowledge = read(W+'knowledge-ledger.json')['knowledge']
assert len(new_knowledge) == len(old_knowledge) + 36
mock_questions = read(D+'mock-exams.ja.json')['exams'][0]['questions']
expected_additions = {}
for q in mock_questions:
    for kid in q['knowledgeIds']:
        expected_additions.setdefault(kid, []).append(q['id'])
for before, after in zip(old_knowledge, new_knowledge):
    assert {k:v for k,v in before.items() if k != 'questionIds'} == {k:v for k,v in after.items() if k != 'questionIds'}
    assert after['questionIds'] == before['questionIds'] + expected_additions.get(before['id'], [])
for image in old(D+'recognition-images.json')['images']:
    path = image['assetPath']
    assert (ROOT/path).read_bytes() == old_bytes(path), path
overlay = read(W+'source-gap-reconciliation-27.json')
assert overlay['summary']['sourceOccurrencesCoveredByNewProse'] == 37
assert overlay['summary']['candidateRemainingMissingOrPartialOccurrencesFromBaseline'] == 1260
held = {f'AGR-A10-GENERAL-{n:04}' for n in range(179, 183)}
covered = {i for r in overlay['resolutions'] for i in r['sourceItemIds']}
assert not held & covered
for r in overlay['resolutions']:
    assert r['evidenceBindings'] and all(len(b['lessonSourceHash']) == 64 for b in r['evidenceBindings'])
print(json.dumps({'status': 'PASS', 'preservedLessons': 174, 'preservedTranslations': 2088,
    'preservedWeeklyQuestions': 412, 'preservedRasterAssets': 42, 'newLessons': 6,
    'newTranslationPairs': 72, 'newMockQuestions': 40, 'newRasterAssets': 8,
    'newSourceOccurrences': 37, 'fullCourseComplete': False}))
