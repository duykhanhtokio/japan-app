"""Rebuild the 32 style-review sheets from the exact audited Git objects.
Run inside a Japan App clone: python path/to/build_contact_sheets.py --output /tmp/kensetsu-review
Requires Pillow. Never edits app assets or fetches a different baseline.
"""
import argparse
import hashlib
import io
import json
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw

args = argparse.ArgumentParser()
args.add_argument('--output', type=Path, required=True)
opts = args.parse_args()
report = json.loads(Path(__file__).with_name('inventory.json').read_text())
opts.output.mkdir(parents=True, exist_ok=True)
all_rows = report['assets'] + report['otherPhysicalFiles']
assert len(all_rows) == report['counts']['physicalRasterFilesViewed']
seen = set()
for group in ['daily', 'weekly', 'differential', 'foreman', 'shared', 'extra']:
    rows = report['otherPhysicalFiles'] if group == 'extra' else [r for r in report['assets'] if r['group'] == group]
    for start in range(0, len(rows), 12):
        canvas = Image.new('RGB', (1800, 1200), 'white')
        draw = ImageDraw.Draw(canvas)
        for j, row in enumerate(rows[start:start + 12]):
            raw = subprocess.check_output(['git', 'show', report['baselineCommit'] + ':' + row['assetPath']])
            if hashlib.sha256(raw).hexdigest() != row['sha256']:
                raise SystemExit('Asset SHA mismatch: ' + row['assetPath'])
            picture = Image.open(io.BytesIO(raw))
            assert list(picture.size) == row['dimensions']
            picture.thumbnail((590, 260))
            x, y = j % 3 * 600, j // 3 * 300
            canvas.paste(picture, (x + (590 - picture.width) // 2, y + 32))
            draw.text((x + 5, y + 3), str(row['id']) + ' ' + Path(row['assetPath']).name, fill='black')
            seen.add(row['assetPath'])
        canvas.save(opts.output / f'{group}-{start // 12 + 1:02d}.jpg', quality=90)
assert len(seen) == len(all_rows)
print(f'Rebuilt all {len(seen)} images into {len(list(opts.output.glob("*.jpg")))} sheets. Style decisions remain human-readable review judgments in REPORT_VI.md.')
