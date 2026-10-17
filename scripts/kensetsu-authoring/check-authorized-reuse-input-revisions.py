"""Verify the narrow additive change against its immutable Git baseline."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/ssw-workspace/kensetsu'
record = json.loads((DOCS / 'AUTHORIZED_REUSE_INPUT_REVISIONS_2026-10-17.json').read_text())
old = {}
new = {}
for entry in record['files']:
    file = entry['path']
    before = subprocess.check_output(['git', 'show', record['baseCommit'] + ':' + file], cwd=ROOT)
    after = (ROOT / file).read_bytes()
    assert hashlib.sha256(before).hexdigest() == entry['beforeSha256'], file
    assert hashlib.sha256(after).hexdigest() == entry['afterSha256'], file
    old[Path(file).name] = json.loads(before)
    new[Path(file).name] = json.loads(after)

before_lesson = old['shared-session-263.json']
after_lesson = new['shared-session-263.json']
paragraphs = lambda lesson: {p['id']: p['ja'] for c in lesson['clusters'] for p in c['paragraphs']}
before_paragraphs = paragraphs(before_lesson)
after_paragraphs = paragraphs(after_lesson)
assert all(after_paragraphs[k] == v for k, v in before_paragraphs.items())
assert set(after_paragraphs) - set(before_paragraphs) == set(record['addedCanonicalParagraphs'])
assert after_lesson['revision'] == before_lesson['revision'] + 1
before_entries = old['session-263.json']['entries']
after_entries = new['session-263.json']['entries']
assert all(after_entries[k] == v for k, v in before_entries.items())
assert set(after_entries) - set(before_entries) == set(record['addedCanonicalParagraphs'])
locales = {'en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'}
for pid in record['addedCanonicalParagraphs']:
    entry = after_entries[pid]
    assert entry['sourceJa'] == after_paragraphs[pid]
    assert set(entry['translations']) == locales
    assert all(isinstance(v, str) and v.strip() for v in entry['translations'].values())

# A citation hash update must not alter any question, order, answer or exam revision.
def without_citation_hash(value):
    if isinstance(value, dict):
        return {k: without_citation_hash(v) for k, v in value.items() if k != 'lessonSha256'}
    if isinstance(value, list):
        return [without_citation_hash(v) for v in value]
    return value

updates = 0
for filename in ['review-tests.ja.json', 'field-review-tests.ja.json']:
    assert without_citation_hash(old[filename]) == without_citation_hash(new[filename])
    def check_pairs(before, after):
        global updates
        if isinstance(before, dict):
            if before.get('lessonSha256') != after.get('lessonSha256'):
                assert before['lessonFile'] == 'docs/ssw-workspace/kensetsu/shared-session-263.json'
                assert after['lessonFile'] == before['lessonFile']
                updates += 1
            for key in before:
                check_pairs(before[key], after[key])
        elif isinstance(before, list):
            for a, b in zip(before, after):
                check_pairs(a, b)
    check_pairs(old[filename], new[filename])
assert updates == record['citationHashUpdates'] == 7
policy = json.loads((ROOT / 'src/data/kensetsu/reuse-policy.json').read_text())
assert before_lesson['id'] + ':r1' in policy['preservedArchivedCompletionIds']
print('PASS_ADDITIVE_SHARED263: 8 old paragraphs and all old translations retained; 1 new paragraph/12 locales; 7 citation hashes only; question payloads/order/revisions unchanged; r1 completion archived.')
