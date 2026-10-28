"""Apply the four independently compared batch17 target-language revisions.

Japanese, IDs, keys and source hashes remain canonical. Reverse mode lets older
editorial checks inspect their historical snapshot without rewriting evidence.
"""
from copy import deepcopy
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
PATCH_PATH = 'docs/ssw-workspace/manufacturing/batch17/language/proposed-locale-deltas.json'
REVIEW_PATH = 'docs/ssw-workspace/manufacturing/batch17/language-independent-review.json'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def object_digest(value):
    return digest(json.dumps(value, ensure_ascii=False, sort_keys=True,
                             separators=(',', ':')).encode())


def load_patch(*, canonical_overrides=None):
    payload = (ROOT / PATCH_PATH).read_bytes()
    patch = json.loads(payload)
    review = json.loads((ROOT / REVIEW_PATH).read_bytes())
    require(digest(payload) == review['proposedDeltaSha256'], 'Locale revision review digest drift')
    validate_patch(patch, canonical_overrides=canonical_overrides)
    return patch


def validate_patch(patch, *, canonical_overrides=None):
    require(patch['nativeReviewed'] is False and patch['domainReviewed'] is False,
            'Unsupported target revision certification')
    expected = {
        ('src/data/manufacturing/mock-translations.json', 'en', 'mfg1-mechanical-mock-03-theory-17'),
        ('src/data/manufacturing/mock-translations.json', 'vi', 'mfg1-mechanical-mock-03-theory-17'),
        ('src/data/manufacturing/mock-translations.json', 'bn', 'mfg1-mechanical-mock-03-theory-17'),
        ('src/data/manufacturing/translations/questions.vi.json', 'vi', 'mfg1-mechanical-formative-004'),
    }
    identities = [(u['file'], u['locale'], u['recordId']) for u in patch['updates']]
    require(len(identities) == len(set(identities)) == 4 and set(identities) == expected,
            'Unexpected target revision identities')
    course_path = 'src/data/manufacturing/mechanical.json'
    mock_path = 'src/data/manufacturing/mocks/mechanical.json'
    overrides = canonical_overrides or {}
    require(set(overrides) <= {course_path, mock_path}, 'Unexpected canonical override path')
    course = json.loads(overrides.get(course_path, (ROOT / course_path).read_bytes()))
    mocks = json.loads(overrides.get(mock_path, (ROOT / mock_path).read_bytes()))
    canonical = {q['id']: q for c in course['checks'] for q in c['questions']}
    canonical.update({q['id']: q for e in mocks['exams'] for s in e['sections'].values() for q in s['questions']})
    for u in patch['updates']:
        before, after = u['before'], u['after']
        expected_collection = 'locales' if u['file'].endswith('/mock-translations.json') else 'questions'
        require(u['collection'] == expected_collection, 'Unexpected target collection')
        for alias, field in (('targetPath', 'file'), ('questionId', 'recordId'), ('entryCollection', 'collection')):
            require(u.get(alias, u[field]) == u[field], 'Inconsistent target revision alias: ' + alias)
        require(before['sourceHash'] == after['sourceHash'] == u['sourceHash'], 'Target source hash changed')
        require(u['sourceHash'] == canonical[u['recordId']]['sourceHash'], 'Stale canonical target source')
        require(object_digest(before) == u['beforeObjectSha256']
                and object_digest(after) == u['afterObjectSha256'], 'Target revision object digest drift')
        require(set(before) == set(after), 'Target revision schema drift')
        changed = {k for k in before if before[k] != after[k]}
        allowed = {'options', 'reasons'} if expected_collection == 'questions' else (
            {'stem', 'reasons'} if u['locale'] == 'bn' else {'stem'})
        require(changed == allowed, 'Target revision exceeds reviewed field scope')
        require(len(before['options']) == len(after['options']) == len(after['reasons']),
                'Target alternatives/rationales changed count')
        for t in (before, after):
            require(all(isinstance(s, str) and s.strip() for s in [t['stem'], *t['options'], *t['reasons']]),
                    'Empty target revision prose')
            require(t['nativeReviewed'] is False and t['domainReviewed'] is False
                    and t['translatedDirectlyFrom'] == 'ja', 'Unsupported target provenance')


def transform_files(inputs, patch, *, forward=True, allow_prior=False, canonical_overrides=None):
    validate_patch(patch, canonical_overrides=canonical_overrides)
    outputs = dict(inputs)
    for path in sorted({u['file'] for u in patch['updates']} & set(inputs)):
        value = json.loads(inputs[path])
        for u in patch['updates']:
            if u['file'] != path:
                continue
            table = value['locales'][u['locale']] if u['collection'] == 'locales' else value[u['collection']]
            current = table[u['recordId']]
            if current not in (u['before'], u['after']):
                require(allow_prior, 'Unrecognized target revision snapshot: ' + path + '/' + u['locale'])
                continue
            table[u['recordId']] = deepcopy(u['after'] if forward else u['before'])
        outputs[path] = encoded(value)
    return outputs


def validate_current(inputs, patch):
    require({u['file'] for u in patch['updates']} <= set(inputs), 'Missing revised target file')
    expected = transform_files(inputs, patch)
    require(expected == inputs, 'Target revisions not fully integrated')


def main():
    patch = load_patch()
    inputs = {p: (ROOT / p).read_bytes() for p in {u['file'] for u in patch['updates']}}
    outputs = transform_files(inputs, patch)
    changed = []
    for path, payload in outputs.items():
        if payload != inputs[path]:
            (ROOT / path).write_bytes(payload)
            changed.append(path)
    print(json.dumps({'status': 'PASS', 'revisedTargetRecords': 4, 'changedFiles': changed,
                      'japaneseModified': False, 'nativeReviewed': False, 'domainReviewed': False}))


if __name__ == '__main__':
    main()
