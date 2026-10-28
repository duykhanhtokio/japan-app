"""Read-only meter-layer checks, including hostile evidence/input fixtures."""
from pathlib import Path
import copy, hashlib, json, runpy

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'docs/ssw-workspace/manufacturing/batch20'
layer = runpy.run_path(str(ROOT / 'scripts/manufacturing/meter-diagram-extension.py'))
all_layers = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-diagram-extension.py'))
all_layers['validate']()
base_c = json.loads((STAGE / 'base-diagram-translations.json').read_text())
base_r = json.loads((STAGE / 'base-illustration-register.json').read_text())
namespace = layer['extend'].__globals__
original_read, original_sha = namespace['read'], namespace['sha']
rejected = []

def invalid(name, change=None, relative=None, mutation=None, stale=None):
    captions, register = copy.deepcopy(base_c), copy.deepcopy(base_r)
    if change:
        change(captions, register)
    def altered_read(path):
        value = original_read(path)
        if relative and path == ROOT / relative:
            mutation(value)
        return value
    namespace['read'] = altered_read
    namespace['sha'] = lambda path: '0'*64 if stale and path == ROOT / stale else original_sha(path)
    try:
        layer['extend'](captions, register)
    except AssertionError:
        rejected.append(name)
    else:
        raise AssertionError('Invalid meter fixture accepted: ' + name)
    finally:
        namespace['read'], namespace['sha'] = original_read, original_sha

invalid('changed historical19caption', change=lambda c,r:c['locales']['vi'].pop('mfg1-mechanical-lesson-048'))
invalid('changed historical19asset', change=lambda c,r:r['assets'][-1].update(png='unknown.png'))
invalid('unknown historical superset', change=lambda c,r:r['assets'].append(copy.deepcopy(r['assets'][-1])))
prefix = 'docs/ssw-workspace/manufacturing/batch20/'
for name in ['source-review.json','visual-review.json','diagram-captions.json','diagram-caption-review.json','baseline-files.json']:
    invalid('stale '+name, stale=prefix+name)
invalid('missing target locale', relative=prefix+'diagram-captions.json', mutation=lambda d:d['locales'].pop('vi'))
invalid('extra target locale', relative=prefix+'diagram-captions.json', mutation=lambda d:d['locales'].update(xx=d['locales']['vi']))
invalid('pending caption comparison', relative=prefix+'diagram-caption-review.json', mutation=lambda d:d['locales']['vi'].update(verdict='pending'))
invalid('pending visual review', relative=prefix+'visual-review.json', mutation=lambda d:d.update(status='pending'))
invalid('wrong visual source identity', relative=prefix+'visual-review.json', mutation=lambda d:d['source'].update(sha256='0'*64))
invalid('wrong visual caption identity', relative=prefix+'visual-review.json', mutation=lambda d:d.update(captionJaSha256='0'*64))
invalid('false native caption claim', relative=prefix+'diagram-captions.json', mutation=lambda d:d.update(nativeReviewed=True))
invalid('false domain visual claim', relative=prefix+'visual-review.json', mutation=lambda d:d.update(domainReviewed=True))
invalid('unknown lesson binding', relative=prefix+'source-review.json', mutation=lambda d:d['lessonBinding'].update(sourceHash='0'*64))
invalid('changed original historical asset bytes', stale='assets/manufacturing/diagrams/ohms-law.png')
invalid('changed new PNG bytes', stale='assets/manufacturing/diagrams/batch20-electrical-meter-connections.png')
component = (ROOT/'src/components/manufacturing/ManufacturingDiagram.tsx').read_text()
try:
    layer['project_component'](component.replace('1400/1100','1400/1000',1))
except AssertionError:
    rejected.append('changed meter aspect ratio')
else:
    raise AssertionError('Wrong aspect ratio accepted')
progress = json.loads((ROOT/'docs/ssw-workspace/manufacturing/progress.json').read_text())
assert progress['createdDiagrams'] == progress['usedDiagrams'] == 21
assert progress['translatedDiagramCaptionLocalePairs'] == 252
assert set(progress['diagramTranslationCoverage']) == layer['TARGETS']
assert set(progress['diagramTranslationCoverage'].values()) == {21}
print(json.dumps({'status':'PASS','diagrams':21,'captionPairs':252,'negativeFixtures':len(rejected),
                  'rejected':rejected,'scope':'Exact meter-layer artifact/evidence/source gates; no native/domain certification'}))
