"""Exercise real manufacturing assembly in a disposable copied snapshot.

Never runs the mutating assembler in the source checkout. Runtime outputs must
match the persisted input snapshot under different filesystem timestamps.
"""
from copy import deepcopy
from pathlib import Path
import argparse
import hashlib
import json
import os
import runpy
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[2]
DATA = 'src/data/manufacturing'
DOCS = 'docs/ssw-workspace/manufacturing'
SCRIPTS = 'scripts/manufacturing'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def snapshot(root, relative):
    return {str(p.relative_to(root)): digest(p) for p in (root / relative).rglob('*') if p.is_file()}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', type=Path, default=ROOT / DOCS / 'batch17/integration-qa.json')
    args = parser.parse_args()
    sandbox = Path(tempfile.mkdtemp(prefix='manufacturing-batch17-rebuild-'))
    for relative in (DATA, DOCS, SCRIPTS, 'src/components/manufacturing', 'assets/manufacturing/diagrams'):
        target = sandbox / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(ROOT / relative, target, copy_function=shutil.copy2)
    (sandbox / 'src/services').mkdir(parents=True)
    for path in (ROOT / 'src/services').glob('manufacturing*.ts'):
        shutil.copy2(path, sandbox / 'src/services' / path.name)
    original_runtime = snapshot(sandbox, DATA)
    original_conflict_files = {f'{DATA}/translations/{rule["locale"]}.json':
                               json.loads((sandbox / DATA / 'translations' / f'{rule["locale"]}.json').read_text())
                               for rule in json.loads((sandbox / DOCS / 'batch17/integration/translation-selection.json').read_text())['entries'].values()}
    selection_path = sandbox / DOCS / 'batch17/integration/translation-selection.json'
    selection = json.loads(selection_path.read_text())['entries']
    progress_path = sandbox / DOCS / 'progress.json'
    progress = json.loads(progress_path.read_text())
    sentinel = {'batch': '17-rebuild-regression-sentinel', 'updatedAt': '2099-01-01',
                'next': 'Keep current editorial continuation metadata.'}
    progress.update(sentinel)
    progress_path.write_text(json.dumps(progress, ensure_ascii=False, indent=2) + '\n')
    steps = []

    def execute(label, command):
        started = time.monotonic()
        result = subprocess.run(command, cwd=sandbox, capture_output=True, text=True)
        row = {'label': label, 'command': command, 'exitCode': result.returncode,
               'durationSeconds': round(time.monotonic() - started, 3)}
        if result.stderr.strip():
            row['stderr'] = result.stderr[-2000:]
        require(result.returncode == 0, f'{label} failed: {result.stderr[-2000:]}')
        # Store compact structured outputs, never entire source/translation data.
        row['results'] = [json.loads(line) for line in result.stdout.splitlines()
                          if line.startswith('{')]
        steps.append(row)

    def rebuild(label, allow_restored_json_key_order=False):
        execute(label, [sys.executable, f'{SCRIPTS}/integrate-completion.py'])
        actual = snapshot(sandbox, DATA)
        drift = [p for p in sorted(set(actual) | set(original_runtime))
                 if actual.get(p) != original_runtime.get(p)]
        if allow_restored_json_key_order:
            require(all(p in original_conflict_files and json.loads((sandbox / p).read_text()) == original_conflict_files[p]
                        for p in drift), f'{label}: runtime content drift: {drift}')
            steps[-1]['restoredJsonKeyOrderOnlyDifferences'] = drift
        else:
            require(not drift, f'{label}: runtime drift: {drift}')
        current = json.loads(progress_path.read_text())
        require(all(current[k] == v for k, v in sentinel.items()), f'{label}: progress metadata regressed')
        steps[-1]['runtimeFilesByteIdentical'] = len(actual) - len(drift)
        steps[-1]['latestProgressMetadataPreserved'] = True

    rebuild('full integration with current checkout timestamps')
    first_docs = snapshot(sandbox, DOCS)
    rebuild('second unchanged full integration')
    require(snapshot(sandbox, DOCS) == first_docs, 'Unchanged integration is not byte-idempotent')
    paths = sorted((sandbox / DOCS / 'batch12').rglob('*.json'), reverse=True)
    for i, path in enumerate(paths):
        os.utime(path, ns=((1800000000 + i) * 1000000000,) * 2)
    rebuild('full integration with reversed staging timestamp order')
    require(snapshot(sandbox, DOCS) == first_docs, 'Reversed timestamps changed generated metadata')
    for path in paths:
        os.utime(path, ns=(1800000000000000000,) * 2)
    rebuild('full integration with equal recreated-checkout timestamps')
    require(snapshot(sandbox, DOCS) == first_docs, 'Equal timestamps changed generated metadata')
    # Explicit authority must reconstruct conflicts without taking the current
    # target payload as an implicit winner.
    for rule in selection.values():
        target = sandbox / DATA / 'translations' / f'{rule["locale"]}.json'
        payload = json.loads(target.read_text())
        del payload[rule['kind']][rule['id']]
        target.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')
    rebuild('recreate seven ambiguous target records from explicit source-bound selection', allow_restored_json_key_order=True)

    module = runpy.run_path(str(sandbox / SCRIPTS / 'integrate-completion.py'))
    resolver = module['staged_translation_resolver']
    value_a = {'sourceHash': '1' * 64, 'stem': 'approved'}
    value_b = {'sourceHash': '1' * 64, 'stem': 'alternate'}
    hash_a, hash_b = module['hash_object'](value_a), module['hash_object'](value_b)
    path_a, path_b = sandbox / 'a.json', sandbox / 'b.json'
    key = 'vi:questions:fixture'
    rule = {'sourceHash': value_a['sourceHash'], 'selectedPayloadSha256': hash_a,
            'selectedPath': 'a.json', 'candidatePayloadSha256': sorted([hash_a, hash_b])}
    rejected = []
    fixtures = [
        ('unmanifested conflicting drafts', {}, [value_a, value_b]),
        ('selected staged payload missing', {key: rule}, [value_b]),
        ('unrecognized conflicting variant', {key: rule}, [value_a, {**value_b, 'stem': 'new'}]),
        ('stale canonical source selection', {key: {**rule, 'sourceHash': '0' * 64}}, [value_a, value_b]),
        ('selected source path missing', {key: {**rule, 'selectedPath': 'missing.json'}}, [value_a, value_b]),
    ]
    for label, rules, variants in fixtures:
        add, resolve, finish = resolver(deepcopy(rules))
        for value, path in zip(variants, (path_a, path_b)):
            add('vi', 'questions', 'fixture', value, path)
        try:
            resolve('vi', 'questions', {})
            finish()
        except AssertionError:
            rejected.append(label)
        else:
            raise AssertionError('Accepted ' + label)
    add, resolve, finish = resolver({key: rule})
    try:
        finish()
    except AssertionError:
        rejected.append('unused or removed conflict selection')
    else:
        raise AssertionError('Accepted unused conflict selection')
    for script in ('check-mock-content.py', 'check-editorial-patches.py',
                   'check-editorial-review-regression.py', 'check-mock-content-regression.py',
                   'check-source-review-bindings.py'):
        execute(script, [sys.executable, f'{SCRIPTS}/{script}'])
    for script in ('check-editorial-attempts.cjs', 'check-mock-state.cjs'):
        execute(script, ['node', f'{SCRIPTS}/{script}'])
    report = {'schemaVersion': 1, 'date': '2026-10-28', 'status': 'PASS',
              'snapshotBaseCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
              'scope': 'Real full frozen-draft assembly plus batch16/batch17 locale overlays in an isolated copied snapshot.',
              'isolatedSandbox': str(sandbox), 'fullIntegrationRuns': 5,
              'stagingJsonTimestampVariants': ['preserved', 'reversed', 'equal'],
              'conflictingTranslationRecordsPinned': len(selection),
              'conflictSelectorDependsOnExistingRuntime': False,
              'rejectedInvalidSelectionFixtures': rejected,
              'steps': steps, 'runtimeSha256': original_runtime,
              'sharedRuntimeModifiedByThisCheck': False,
              'nativeReviewed': False, 'domainReviewed': False, 'releaseReady': False,
              'limitations': ['No browser rendering, fullExpo/type/build, or physical/native-device test performed.',
                              'Whole-source semantic/native/domain certification is outside this integration check.',
                              'The full assembler is a mutating data tool; failure atomicity is not asserted. It is exercised only in an isolated snapshot here.']}
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'status': 'PASS', 'fullIntegrationRuns': 5,
                      'conflictingTranslationsPinned': len(selection),
                      'invalidSelectionsRejected': len(rejected), 'runtimeFiles': len(original_runtime),
                      'report': str(args.report), 'sandbox': str(sandbox)}))


if __name__ == '__main__':
    main()
