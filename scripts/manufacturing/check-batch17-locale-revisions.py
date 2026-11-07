"""Independent regression checks for the four batch17 locale-only revisions.

All mutations and CLI rebuilds use memory or a temporary checkout; runtime files
in the real repository are read-only throughout this test.
"""
from copy import deepcopy
from pathlib import Path
import hashlib
import json
import runpy
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
COMPILER = ROOT / 'scripts/manufacturing/apply-locale-revisions.py'
API = runpy.run_path(str(COMPILER))
patch = API['load_patch']()
paths = sorted({u['file'] for u in patch['updates']})
inputs = {path: (ROOT / path).read_bytes() for path in paths}
rejected = []


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def file_sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def reject(name, callback):
    try:
        callback()
    except ValueError:
        rejected.append(name)
    else:
        raise AssertionError('Accepted invalid locale revision: ' + name)


def table(document, update):
    if update['collection'] == 'locales':
        return document['locales'][update['locale']]
    return document[update['collection']]


API['validate_current'](inputs, patch)
forward = API['transform_files'](inputs, patch)
require(forward == inputs, 'Current compiler invocation must be byte-idempotent')
before = API['transform_files'](inputs, patch, forward=False)
require(API['transform_files'](before, patch) == inputs,
        'Reverse then forward must reproduce every current byte')
require(API['transform_files'](before, patch, forward=False) == before,
        'Reverse transformation must also be byte-idempotent')

changed_records = []
unaffected_records = 0
for path in paths:
    old, current = json.loads(before[path]), json.loads(inputs[path])
    expected = {(u['locale'], u['recordId']) for u in patch['updates'] if u['file'] == path}
    if 'locales' in current:
        require(set(old['locales']) == set(current['locales']), 'Locale identity set changed')
        actual = set()
        for locale, entries in current['locales'].items():
            require(set(entries) == set(old['locales'][locale]), 'Question identity set changed')
            for qid, entry in entries.items():
                if entry != old['locales'][locale][qid]:
                    actual.add((locale, qid))
                else:
                    unaffected_records += 1
        require(actual == expected, 'Unexpected mock target changes')
    else:
        require(set(old['questions']) == set(current['questions']), 'Weekly identity set changed')
        actual = {('vi', qid) for qid, entry in current['questions'].items()
                  if entry != old['questions'][qid]}
        unaffected_records += len(current['questions']) - len(actual)
        require(actual == expected, 'Unexpected weekly target changes')
    changed_records.extend((path, locale, qid) for locale, qid in sorted(actual))
for u in patch['updates']:
    require(table(json.loads(before[u['file']]), u)[u['recordId']] == u['before'],
            'Reverse transformation does not produce exact recorded predecessor')
    require(table(json.loads(inputs[u['file']]), u)[u['recordId']] == u['after'],
            'Current record is not the exact independently proposed successor')

candidate = dict(inputs)
u = patch['updates'][0]
value = json.loads(candidate[u['file']])
table(value, u)[u['recordId']]['sourceHash'] = '0' * 64
candidate[u['file']] = API['encoded'](value)
reject('stale current source hash', lambda: API['transform_files'](candidate, patch))
candidate = dict(inputs)
value = json.loads(candidate[u['file']])
table(value, u)[u['recordId']]['stem'] = 'unreviewed changed target text'
candidate[u['file']] = API['encoded'](value)
reject('unrecognized current prose', lambda: API['transform_files'](candidate, patch))
candidate = dict(inputs)
del candidate[paths[0]]
reject('missing revised target file', lambda: API['validate_current'](candidate, patch))

for name, mutate in (
    ('changed alternatives count', lambda p: p['updates'][3]['after']['options'].append('extra')),
    ('changed rationale count', lambda p: p['updates'][3]['after']['reasons'].pop()),
    ('stale patch source hash', lambda p: p['updates'][0]['after'].__setitem__('sourceHash', '0' * 64)),
    ('unknown file identity', lambda p: p['updates'][0].__setitem__('file', 'unreviewed.json')),
    ('unknown locale identity', lambda p: p['updates'][0].__setitem__('locale', 'unknown')),
    ('unknown question identity', lambda p: p['updates'][0].__setitem__('recordId', 'unknown')),
    ('duplicate revision identity', lambda p: p['updates'].__setitem__(0, deepcopy(p['updates'][1]))),
    ('missing revision identity', lambda p: p['updates'].pop()),
    ('unsupported native certification', lambda p: p.__setitem__('nativeReviewed', True)),
    ('changed direct-source provenance', lambda p: p['updates'][0]['after'].__setitem__('translatedDirectlyFrom', 'en')),
    ('wrong collection', lambda p: p['updates'][0].__setitem__('collection', 'questions')),
    ('mismatched target path alias', lambda p: p['updates'][0].__setitem__('targetPath', 'unknown')),
    ('mismatched question alias', lambda p: p['updates'][0].__setitem__('questionId', 'unknown')),
    ('mismatched collection alias', lambda p: p['updates'][0].__setitem__('entryCollection', 'unknown')),
):
    changed = deepcopy(patch)
    mutate(changed)
    # Re-sign the local object digests so structural/provenance guards, rather
    # than an incidental old fingerprint, must reject these mutations.
    for entry in changed['updates']:
        entry['afterObjectSha256'] = API['object_digest'](entry['after'])
    reject(name, lambda changed=changed: API['validate_patch'](changed))

changed = deepcopy(patch)
entry = changed['updates'][0]
entry['sourceHash'] = entry['before']['sourceHash'] = entry['after']['sourceHash'] = '0' * 64
entry['beforeObjectSha256'] = API['object_digest'](entry['before'])
entry['afterObjectSha256'] = API['object_digest'](entry['after'])
reject('coherently rehashed stale canonical source', lambda: API['validate_patch'](changed))

changed = deepcopy(patch)
changed['updates'][0]['after']['stem'] += ' tampered'
reject('tampered proposal object fingerprint', lambda: API['validate_patch'](changed))

# Exercise load_patch's actual file-level review binding in an isolated root.
with tempfile.TemporaryDirectory(prefix='mfg17-locale-evidence-') as temp:
    sandbox = Path(temp)
    globals_ = API['load_patch'].__globals__
    original_root = globals_['ROOT']
    try:
        globals_['ROOT'] = sandbox
        for relative in (API['PATCH_PATH'], API['REVIEW_PATH'],
                         'src/data/manufacturing/mechanical.json',
                         'src/data/manufacturing/mocks/mechanical.json'):
            destination = sandbox / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / relative, destination)
        API['load_patch']()
        staged = sandbox / API['PATCH_PATH']
        staged.write_bytes(staged.read_bytes() + b' ')
        reject('tampered reviewed proposal file fingerprint', API['load_patch'])
        shutil.copyfile(ROOT / API['PATCH_PATH'], staged)
        review_path = sandbox / API['REVIEW_PATH']
        review = json.loads(review_path.read_bytes())
        review['proposedDeltaSha256'] = '0' * 64
        review_path.write_bytes(API['encoded'](review))
        reject('tampered review expected fingerprint', API['load_patch'])
    finally:
        globals_['ROOT'] = original_root

# Run the real batch16 CLI wrapper in a temporary minimal checkout. It must
# reverse batch17 mock deltas, apply batch16, then restore all batch17 deltas.
wrapper = 'scripts/manufacturing/apply-editorial-patches.py'
patch16_api = runpy.run_path(str(ROOT / wrapper))
patch16 = json.loads((ROOT / patch16_api['PATCH_PATH']).read_bytes())
runtime_paths = set(paths) | {patch16['sourcePath'], patch16_api['FURIGANA']}
real_before = {path: file_sha(ROOT / path) for path in runtime_paths}
with tempfile.TemporaryDirectory(prefix='mfg17-rebuild-') as temp:
    sandbox = Path(temp)
    copy_paths = runtime_paths | {wrapper, 'scripts/manufacturing/apply-locale-revisions.py',
                                 API['PATCH_PATH'], API['REVIEW_PATH'], patch16_api['PATCH_PATH'],
                                 'src/data/manufacturing/mechanical.json'}
    for relative in copy_paths:
        destination = sandbox / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / relative, destination)
    sandbox_before = {path: file_sha(sandbox / path) for path in runtime_paths}
    completed = subprocess.run([sys.executable, str(sandbox / wrapper)],
                               check=True, capture_output=True, text=True)
    result = json.loads(completed.stdout)
    require(result['changedFiles'] == [], 'Batch16 wrapper rewrote current locale fixes')
    require({path: file_sha(sandbox / path) for path in runtime_paths} == sandbox_before,
            'Batch16 wrapper did not preserve every current runtime file')
    # Recreate the exact pre16 mechanical source plus pre16 affected target/ruby
    # objects, and the pre17 weekly target, only in this temporary checkout.
    source_before, _ = patch16_api['source_versions']((ROOT / patch16['sourcePath']).read_bytes(), patch16)
    (sandbox / patch16['sourcePath']).write_bytes(source_before)
    mock_targets = json.loads(before[patch16_api['TRANSLATIONS']])
    ruby = json.loads((ROOT / patch16_api['FURIGANA']).read_bytes())
    for revision in patch16['patches']:
        for locale, target in revision['translations'].items():
            mock_targets['locales'][locale][revision['questionId']] = deepcopy(target['before'])
        ruby['questions'][revision['questionId']] = deepcopy(revision['furigana']['before'])
    (sandbox / patch16_api['TRANSLATIONS']).write_bytes(API['encoded'](mock_targets))
    (sandbox / patch16_api['FURIGANA']).write_bytes(API['encoded'](ruby))
    weekly_path = 'src/data/manufacturing/translations/questions.vi.json'
    (sandbox / weekly_path).write_bytes(before[weekly_path])
    subprocess.run([sys.executable, str(sandbox / wrapper)],
                   check=True, capture_output=True, text=True)
    # The integrator's following locale step restores the weekly revision too.
    subprocess.run([sys.executable, str(sandbox / 'scripts/manufacturing/apply-locale-revisions.py')],
                   check=True, capture_output=True, text=True)
    require({path: file_sha(sandbox / path) for path in runtime_paths} == sandbox_before,
            'Frozen16 baseline through16/17 CLI chain did not reproduce current bytes')
require({path: file_sha(ROOT / path) for path in runtime_paths} == real_before,
        'Regression checks modified real runtime files')

print(json.dumps({'status': 'PASS', 'exactRevisedTargetRecords': len(changed_records),
                  'unchangedOtherTargetRecords': unaffected_records,
                  'forwardByteIdempotent': True, 'reverseByteIdempotent': True,
                  'reverseForwardExact': True, 'batch16CliPreservesAllFourFixes': True,
                  'frozen16Then17CliReproducesCurrent': True,
                  'rejectedInvalidRevisions': rejected, 'negativeChecks': len(rejected),
                  'realRuntimeFilesModified': False,
                  'scope': 'Source-bound revision compiler and isolated CLI rebuild; no native/domain/runtime UI certification.'}))
