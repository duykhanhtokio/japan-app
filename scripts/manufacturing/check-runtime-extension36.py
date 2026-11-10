"""Exercise real replay logic in isolated snapshots, including zero-write rejection."""
from pathlib import Path
import json, runpy, tempfile

ROOT = Path(__file__).resolve().parents[2]
LAYER = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-runtime-extension36.py'))
manifest_path = LAYER['MANIFEST']
manifest = json.loads((ROOT / manifest_path).read_text())
with tempfile.TemporaryDirectory(prefix='mfg36-replay-') as temporary:
    root = Path(temporary)
    (root / manifest_path).parent.mkdir(parents=True)
    (root / manifest_path).write_bytes((ROOT / manifest_path).read_bytes())
    for target, item in manifest['files'].items():
        for name in [target, item['snapshot']]:
            (root / name).parent.mkdir(parents=True, exist_ok=True)
        (root / target).write_bytes((ROOT / item['fixtureBeforeSnapshot']).read_bytes())
        (root / item['snapshot']).write_bytes((ROOT / item['snapshot']).read_bytes())
    assert set(LAYER['apply'](root)) == set(manifest['files'])
    for target, item in manifest['files'].items():
        assert (root / target).read_bytes() == (ROOT / item['snapshot']).read_bytes()
    assert LAYER['apply'](root) == []
    for target, item in manifest['files'].items():
        (root / target).write_bytes((ROOT / item['fixtureBeforeSnapshot']).read_bytes())
    bad = next(iter(manifest['files']))
    (root / bad).write_bytes((root / bad).read_bytes() + b'unknown revision')
    before = {target: (root / target).read_bytes() for target in manifest['files']}
    try:
        LAYER['apply'](root)
    except AssertionError:
        pass
    else:
        raise AssertionError('Unknown runtime accepted')
    assert before == {target: (root / target).read_bytes() for target in manifest['files']}
print(json.dumps({'status': 'PASS', 'replayedFiles': 2, 'idempotent': True, 'unknownRevisionRejectedBeforeWrites': True, 'fullAssemblerRun': False}))
