"""Replay only exact frozen implementation40 shared-file revisions."""
from pathlib import Path
import argparse
import hashlib
import json
import os
import tempfile

ROOT = Path(__file__).resolve().parents[2]
SPEC = 'docs/ssw-workspace/manufacturing/implementation40/integration/manifest.json'
TARGETS = {
    'src/components/manufacturing/ManufacturingCourse.tsx',
    'src/components/manufacturing/ManufacturingMocks.tsx',
    'src/components/manufacturing/SupplementalManufacturingDiagrams.tsx',
    'src/data/manufacturing/term-editorial.ts',
}
def sha(raw):
    return hashlib.sha256(raw).hexdigest()

def predecessor(path, raw, root=ROOT):
    """Project exact revision40 bytes to their frozen predecessor for old audits."""
    spec = json.loads((root / SPEC).read_text())
    entry = next(row for row in spec['files'] if row['path'] == path)
    if sha(raw) != entry['afterSha256']:
        return raw
    before = (root / entry['beforeSnapshot']).read_bytes()
    assert sha(before) == entry['beforeSha256'], 'Implementation40 predecessor drift'
    return before

def apply(root=ROOT):
    spec = json.loads((root / SPEC).read_text())
    assert spec['revision'] == 40
    assert len(spec['files']) == 4 and {x['path'] for x in spec['files']} == TARGETS
    pending = []
    # Validate every snapshot and current revision before writing any target.
    for row in spec['files']:
        before = (root / row['beforeSnapshot']).read_bytes()
        after = (root / row['afterSnapshot']).read_bytes()
        assert sha(before) == row['beforeSha256'], 'Before snapshot drift: ' + row['path']
        assert sha(after) == row['afterSha256'], 'After snapshot drift: ' + row['path']
        accepted_before = [row['beforeSha256']]
        for extra in row.get('additionalBeforeSnapshots', []):
            precursor = (root / extra['snapshot']).read_bytes()
            assert sha(precursor) == extra['sha256'], 'Additional predecessor drift: ' + row['path']
            accepted_before.append(extra['sha256'])
        current = (root / row['path']).read_bytes()
        assert sha(current) in accepted_before + [row['afterSha256']], 'Unknown revision; preserve it: ' + row['path']
        if current != after:
            pending.append((row['path'], after))
    for relative, raw in pending:
        target = root / relative
        fd, temporary = tempfile.mkstemp(prefix='.mfg40-', dir=target.parent)
        try:
            with os.fdopen(fd, 'wb') as stream:
                stream.write(raw)
            os.replace(temporary, target)
        finally:
            Path(temporary).unlink(missing_ok=True)
    return [p for p, _ in pending]

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=ROOT)
    print(json.dumps({'status': 'PASS', 'updated': apply(parser.parse_args().root)}))
