"""Replay only exact reviewed reader/mock revisions after historical assembly."""
from pathlib import Path
import argparse, hashlib, json, os, tempfile

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = 'docs/ssw-workspace/manufacturing/batch36-continuation/runtime-extension.json'
TARGETS = {'src/components/manufacturing/ManufacturingCourse.tsx', 'src/data/manufacturing/mocks.ts'}

def sha(raw):
    return hashlib.sha256(raw).hexdigest()

def plan(root):
    spec = json.loads((root / MANIFEST).read_text())
    assert set(spec['files']) == TARGETS, 'Unexpected replay target'
    outputs = {}
    for target, item in spec['files'].items():
        snapshot = (root / item['snapshot']).resolve()
        assert snapshot.is_relative_to(root.resolve()), 'Snapshot outside repository'
        desired = snapshot.read_bytes()
        assert sha(desired) == item['sha256'], 'Reviewed snapshot changed'
        current = (root / target).read_bytes()
        assert sha(current) in item['acceptedBeforeSha256'] + [item['sha256']], 'Unknown runtime revision: ' + target
        if current != desired:
            outputs[target] = desired
    return outputs

def apply(root):
    outputs = plan(root)
    prepared = []
    try:
        # Validate all inputs and allocate all payloads before replacing any file.
        for target, raw in outputs.items():
            fd, temporary = tempfile.mkstemp(prefix='.mfg36-', dir=(root / target).parent)
            with os.fdopen(fd, 'wb') as stream:
                stream.write(raw)
            prepared.append((temporary, root / target))
        for temporary, target in prepared:
            os.replace(temporary, target)
    finally:
        for temporary, _ in prepared:
            Path(temporary).unlink(missing_ok=True)
    return list(outputs)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    print(json.dumps({'status': 'PASS', 'updated': apply(args.root)}))
