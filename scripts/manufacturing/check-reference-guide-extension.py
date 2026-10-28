"""Verify extension preservation and rejection gates in a small isolated copy."""
from copy import deepcopy
from pathlib import Path
import argparse
import hashlib
import json
import runpy
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', type=Path, default=ROOT / 'docs/ssw-workspace/manufacturing/batch18/integration/extension-regression-qa.json')
    args = parser.parse_args()
    helper_path = 'scripts/manufacturing/apply-reference-guide-extension.py'
    helper = runpy.run_path(str(ROOT / helper_path))
    approval = json.loads((ROOT / helper['MANIFEST']).read_bytes())
    paths = set(approval['inputs']) | {r['path'] for r in approval['reviews']} | {
        helper_path, 'scripts/manufacturing/check-batch18-guide-reviews.py',
        helper['BASE_SOURCE'], helper['BASE_TARGETS'], helper['MANIFEST'], helper['SOURCE'], helper['TARGETS'],
        'docs/ssw-workspace/manufacturing/batch12/source-guides/source-freeze.json',
        'docs/ssw-workspace/manufacturing/source-qa-report.json',
        'docs/ssw-workspace/manufacturing/knowledge-matrix.json',
    }
    isolated = Path(tempfile.mkdtemp(prefix='reference-guide-extension-'))
    for relative in paths:
        target = isolated / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / relative, target)
    m = runpy.run_path(str(isolated / helper_path))
    outputs = m['extension_outputs']()
    current = {p: (isolated / p).read_bytes() for p in (m['SOURCE'], m['TARGETS'])}
    assert outputs == current, 'Current runtime is not exact approved extension'
    assert m['compile_outputs'](current) == current, 'Extension compiler must be byte-idempotent'
    base_source, base_targets = m['base_snapshots']()
    assert m['historical_source_guides_bytes'](current[m['SOURCE']]) == base_source
    assert m['historical_source_guide_translations_bytes'](current[m['TARGETS']]) == base_targets
    for source in (base_source, current[m['SOURCE']]):
        for targets in (base_targets, current[m['TARGETS']]):
            assert m['compile_outputs']({m['SOURCE']: source, m['TARGETS']: targets}) == current
    old, full = json.loads(base_source), json.loads(current[m['SOURCE']])
    old_targets, full_targets = json.loads(base_targets), json.loads(current[m['TARGETS']])
    assert full['guides'][:5] == old['guides']
    for locale, entries in old_targets['locales'].items():
        assert {identifier: full_targets['locales'][locale][identifier] for identifier in entries} == entries
    rejected = []

    def reject(label, action):
        try:
            action()
        except ValueError:
            rejected.append(label)
        else:
            raise AssertionError('Accepted invalid guide extension: ' + label)

    def bad_runtime(path, mutate):
        candidate = dict(current)
        value = json.loads(candidate[path])
        mutate(value)
        candidate[path] = m['encoded'](value)
        m['compile_outputs'](candidate)

    reject('edited frozen Japanese guide', lambda: bad_runtime(m['SOURCE'], lambda v: v['guides'][0].__setitem__('titleJa', 'drift')))
    reject('missing added Japanese guide', lambda: bad_runtime(m['SOURCE'], lambda v: v['guides'].pop()))
    reject('extra unapproved Japanese guide', lambda: bad_runtime(m['SOURCE'], lambda v: v['guides'].append(deepcopy(v['guides'][-1]))))
    reject('stale added guide hash', lambda: bad_runtime(m['SOURCE'], lambda v: v['guides'][-1].__setitem__('sourceHash', '0' * 64)))
    old_id = old['guides'][0]['id']
    new_id = full['guides'][-1]['id']
    reject('edited historical target text', lambda: bad_runtime(m['TARGETS'], lambda v: v['locales']['vi'][old_id].__setitem__('title', 'drift')))
    reject('stale added target source', lambda: bad_runtime(m['TARGETS'], lambda v: v['locales']['vi'][new_id].__setitem__('sourceHash', '0' * 64)))
    reject('missing target locale', lambda: bad_runtime(m['TARGETS'], lambda v: v['locales'].pop('vi')))
    reject('extra unapproved target locale', lambda: bad_runtime(m['TARGETS'], lambda v: v['locales'].__setitem__('xx', {})))

    def changed_file(relative, mutate, reapprove_file=False):
        file = isolated / relative
        before, manifest_before = file.read_bytes(), (isolated / m['MANIFEST']).read_bytes()
        try:
            value = json.loads(before)
            mutate(value)
            file.write_bytes(m['encoded'](value))
            if reapprove_file:
                declared = json.loads(manifest_before)
                declared['inputs'][relative] = m['digest'](file.read_bytes())
                declared['reviewedInputSha256'][relative] = declared['inputs'][relative]
                (isolated / m['MANIFEST']).write_bytes(m['encoded'](declared))
            m['extension_outputs']()
        finally:
            file.write_bytes(before)
            (isolated / m['MANIFEST']).write_bytes(manifest_before)

    target_path = approval['guides'][0]['translations']['vi']
    target_id = m['EXPECTED'][approval['guides'][0]['specialty']]
    mutate_target = lambda v: v['lessons'][target_id].__setitem__('title', 'unreviewed text')
    reject('stale staged target digest', lambda: changed_file(target_path, mutate_target))
    reject('self-declared replacement without matching independent review', lambda: changed_file(target_path, mutate_target, True))
    reject('missing approved input', lambda: changed_file(m['MANIFEST'], lambda v: v['inputs'].pop(target_path)))
    reject('unsupported native certification', lambda: changed_file(m['MANIFEST'], lambda v: v.__setitem__('nativeReviewed', True)))
    reject('no independent review receipts', lambda: changed_file(m['MANIFEST'], lambda v: v.__setitem__('reviews', [])))
    reject('historical target snapshot tampering', lambda: changed_file(m['BASE_TARGETS'], lambda v: v['locales']['vi'][old_id].__setitem__('title', 'drift')))
    guide = full['guides'][-1]
    target = full_targets['locales']['vi'][guide['id']]
    malformed = deepcopy(target)
    malformed['paragraphs'][0]['text'] += ' 999999'
    reject('numeric translation drift', lambda: m['_validate_translation'](guide, malformed, 'vi'))
    malformed = deepcopy(target)
    malformed['terms'][0]['reading'] = 'drift'
    reject('Japanese glossary reading drift', lambda: m['_validate_translation'](guide, malformed, 'vi'))
    malformed = deepcopy(target)
    malformed['paragraphs'].reverse()
    reject('paragraph identity/order drift', lambda: m['_validate_translation'](guide, malformed, 'vi'))
    assert m['extension_outputs']() == current, 'Fixture cleanup did not restore approved inputs'
    report = {'schemaVersion': 1, 'date': '2026-10-28', 'status': 'PASS',
              'historicalGuidesPreserved': 5, 'historicalTargetPairsPreserved': 60,
              'addedGuides': 3, 'addedTargetPairs': 36, 'currentGuides': 8, 'currentTargetPairs': 96,
              'baseAndExtensionRecoveryCombinations': 4, 'byteIdempotent': True,
              'rejectedInvalidExtensions': rejected, 'isolatedCopy': str(isolated),
              'sharedRuntimeModified': False, 'nativeReviewed': False, 'domainReviewed': False,
              'releaseReady': False, 'implementationSha256': {p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest()
                                                             for p in (helper_path, 'scripts/manufacturing/check-reference-guide-extension.py')}}
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_bytes(m['encoded'](report))
    print(json.dumps({'status': 'PASS', 'guides': 8, 'targetPairs': 96,
                      'invalidExtensionsRejected': len(rejected), 'report': str(args.report)}))


if __name__ == '__main__':
    main()
