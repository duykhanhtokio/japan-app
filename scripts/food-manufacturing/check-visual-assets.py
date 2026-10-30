#!/usr/bin/env python3
"""Check shipped food figures, including LFS bytes and revision-bound captions.

This is an asset/binding check, not visual, safety or source-coverage approval.
Requires Pillow, already used by the food figure-generation workflow.
"""
import json
import pathlib
import re
import sys
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/food-manufacturing'
errors = []
lessons = {}
for path in [DATA / 'lessons.1.ja.json', DATA / 'lessons.2.ja.json',
             *sorted((DATA / 'authoring-20261029').glob('part[1-6].json'))]:
    for lesson in json.loads(path.read_text())['lessons']:
        lessons[lesson['id']] = lesson


def check(ok, message):
    if not ok:
        errors.append(message)


def binding(record, filename):
    lesson = lessons.get(record.get('lessonId'))
    label = f"{filename}: {record.get('id', record.get('lessonId'))}"
    check(lesson is not None, label + ': unknown lesson')
    if lesson is None:
        return
    if 'sourceHash' in record:
        check(record['sourceHash'] == lesson['sourceHash'], label + ': stale lesson hash')
    paragraph = record.get('captionParagraphId', record.get('paragraphId'))
    field = record.get('captionField', '')
    if field.startswith('paragraphs.'):
        paragraph = field.split('.', 1)[1]
    elif field:
        check(bool(lesson.get(field)), label + ': missing caption field')
    if paragraph:
        check(any(p['id'] == paragraph for p in lesson['paragraphs']),
              label + ': missing caption paragraph')


sources = [DATA / 'illustrations.ts', DATA / 'safety-signs.ts',
           DATA / 'management-visuals.ts',
           ROOT / 'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx']
references = set()
dimensions = {}
for path in sources:
    text = path.read_text()
    for relative in re.findall(r"require\('([^']+)'\)", text):
        asset = (path.parent / relative).resolve()
        references.add(asset)
        check(asset.is_relative_to(ROOT / 'assets/food-manufacturing'),
              f'{path.name}: asset outside food scope: {relative}')
        try:
            with Image.open(asset) as image:
                image.load()
                dimensions[asset] = image.size
        except (OSError, ValueError) as exc:
            errors.append(f'{relative}: missing, undecodable or LFS pointer: {exc}')
    # All records in these small manifests are flat object literals.
    for block in re.findall(r'\{[^{}]*\}', text):
        record = dict(re.findall(r"(\w+):'([^']*)'", block))
        if 'lessonId' not in record:
            continue
        binding(record, path.name)
        target = re.search(r"require\('([^']+)'\)", block)
        if not target:
            continue
        size = dimensions.get((path.parent / target[1]).resolve())
        if size is None:
            continue
        width = re.search(r'\bwidth:(\d+)', block)
        height = re.search(r'\bheight:(\d+)', block)
        if width and height:
            check(size == (int(width[1]), int(height[1])),
                  f'{record.get("id")}: declared image dimensions differ from bytes')
        ratio = re.search(r'\baspectRatio:(\d+)/(\d+)', block)
        if ratio:
            check(size[0] * int(ratio[2]) == size[1] * int(ratio[1]),
                  f'{record.get("id")}: declared aspect ratio differs from bytes')

signs = json.loads((DATA / 'safety-signs.json').read_text())
binding(signs, 'safety-signs.json')
sign_paths = re.findall(r"recognition/([^']+)\.webp", (DATA / 'safety-signs.ts').read_text())
check(sign_paths == [sign['id'] for sign in signs['signs']],
      'safety-signs: positional image order differs from sign labels')
for sign in signs['signs']:
    binding({**sign, 'lessonId': signs['lessonId']}, 'safety-signs.json')
for diagram in json.loads((DATA / 'diagrams.json').read_text())['diagrams']:
    for lesson_id in diagram['lessonIds']:
        check(lesson_id in lessons, f'{diagram["id"]}: unknown lesson {lesson_id}')

print(json.dumps({'status': 'FAIL' if errors else 'PASS',
                  'decodedRuntimeImages': len(references),
                  'lessonInventory': len(lessons), 'errors': errors,
                  'meaning': 'File decoding, geometry and lesson/caption bindings only; '
                             'not source, human, safety or device certification.'}, indent=2))
sys.exit(bool(errors))
