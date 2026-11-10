"""Verify asset integrity and exact teaching bindings, without certifying coverage."""
from pathlib import Path
import hashlib
import json
from PIL import Image
import importlib.util

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
DATA = ROOT / 'src/data/food-manufacturing'
read = lambda p: json.loads(p.read_text())
manifest = read(AUDIT / 'figures33.json')['figures']
lessons = {}
packs = [read(DATA / 'lessons.1.ja.json'), read(DATA / 'lessons.2.ja.json')]
packs += [read(p) for p in sorted((DATA / 'authoring-20261029').glob('part*.json'))]
for pack in packs:
    lessons.update({l['id']:l for l in pack['lessons']})
registry = (DATA / 'source-practice33.ts').read_text()
assert len(manifest) == 5 and len({f['id'] for f in manifest}) == 5
for figure in manifest:
    lesson = lessons[figure['lessonId']]
    assert figure['lessonSourceHash'] == lesson['sourceHash']
    assert any(p['id'] == figure['paragraphId'] for p in lesson['paragraphs'])
    asset = ROOT / figure['assetFile']
    assert hashlib.sha256(asset.read_bytes()).hexdigest() == figure['sha256']
    with Image.open(asset) as im:
        assert im.size == (figure['width'], figure['height'])
        im.verify()
    assert (ROOT / figure['svgFile']).is_file()
    assert figure['assetFile'] in registry and figure['lessonSourceHash'] in registry
    for locale in ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
        translations = read(DATA / 'translations' / (locale+'.json'))
        for pack in packs[2:]:
            translations.update(pack['translations'].get(locale, {}))
        translated = translations[lesson['id']]
        assert translated['sourceHash'] == lesson['sourceHash']
        assert translated['paragraphs'][figure['paragraphId']].strip()
        assert translated['paragraphTitles'][figure['paragraphId']].strip()
atomic = read(AUDIT / 'atomic-knowledge33.json')['outcomes']
assert len(atomic) == sum(len(f['atomicOutcomesJa']) for f in manifest) == 16
assert all(a['after']['assessmentSemanticClosure'] == 'pending_individual_question_binding' for a in atomic)
spec = importlib.util.spec_from_file_location('review', ROOT / 'scripts/food-manufacturing/check-question-review.py')
review = importlib.util.module_from_spec(spec)
spec.loader.exec_module(review)
result = review.validate()
result.update(decodedNewFigures=5, sourceBoundAtomicOutcomes=16,
              captionAndBodyLocaleBindings=60,
              totalNewWebpBytes=sum((ROOT / f['assetFile']).stat().st_size for f in manifest))
(AUDIT / 'figures33-validation.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result))
