"""Preserve the source-audit quiz accessibility repair after historical assembly."""
from pathlib import Path
import argparse
import hashlib
import json
import runpy
import os
import tempfile

ROOT = Path(__file__).resolve().parents[2]
SPEC = 'docs/ssw-workspace/manufacturing/source-closure-20261031/quiz-accessibility-revision.json'
TARGET = 'src/components/manufacturing/SupplementalManufacturingDiagrams.tsx'
REPLACEMENTS = [
    ('zoomWidth=Math.max(960,width)', 'zoomWidth=Math.max(960,width,item.width)'),
    ("const label=target??item.captionJa,", "const label=hideCaption?'設問の図':target??item.captionJa,"),
    ('accessibilityLabel={`${manufacturingUi(language,key)} · ${item.captionJa.split(\'。\')[0]}`}', 'accessibilityLabel={hideCaption?manufacturingUi(language,key):`${manufacturingUi(language,key)} · ${item.captionJa.split(\'。\')[0]}`}'),
]


def apply(root=ROOT):
    spec = json.loads((root / SPEC).read_text())
    assert spec['path'] == TARGET, 'Unexpected repair target'
    path = root / TARGET
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    historical = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-implementation40.py'))['predecessor'](TARGET, raw, root)
    if historical != raw:
        assert hashlib.sha256(historical).hexdigest() == spec['afterSha256'], 'Implementation40 predecessor is not repaired39'
        return []
    if digest == spec['afterSha256']:
        return []
    assert digest == spec['beforeSha256'], 'Unknown component revision; preserve it'
    text = raw.decode()
    for old, new in REPLACEMENTS:
        assert text.count(old) == 1, 'Expected exactly one repair site'
        text = text.replace(old, new)
    revised = text.encode()
    assert hashlib.sha256(revised).hexdigest() == spec['afterSha256'], 'Repair snapshot mismatch'
    fd, temporary = tempfile.mkstemp(prefix='.mfg39-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as stream:
            stream.write(revised)
        os.replace(temporary, path)
    finally:
        Path(temporary).unlink(missing_ok=True)
    return [TARGET]


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=ROOT)
    args = parser.parse_args()
    print(json.dumps({'status': 'PASS', 'updated': apply(args.root)}))
