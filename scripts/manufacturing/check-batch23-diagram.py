"""Read-only caliper layer gates and exact historical batch22 reconstruction."""
from pathlib import Path
import json, runpy

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT/'docs/ssw-workspace/manufacturing/batch23'
api = runpy.run_path(str(ROOT/'scripts/manufacturing/apply-diagram-extension.py'))
layer = runpy.run_path(str(ROOT/'scripts/manufacturing/meter-diagram-extension.py'))
api['validate']()
captions, register = api['expected']()
facets = layer['caliper_facets']()
audit = runpy.run_path(str(ROOT/'scripts/manufacturing/build-batch22-source-index.py'))
historical = layer['historical_batch22_inputs'](audit['load_inputs'](), captions, register)
assert audit['build_index'](historical) == json.loads((ROOT/audit['OUTPUT']).read_text()), 'Historical batch22 index drift'

namespace = layer['extend'].__globals__
original_read, original_sha = namespace['read'], namespace['sha']
base_c = json.loads((ROOT/'docs/ssw-workspace/manufacturing/batch20/base-diagram-translations.json').read_text())
base_r = json.loads((ROOT/'docs/ssw-workspace/manufacturing/batch20/base-illustration-register.json').read_text())
rejected = []

def invalid(name, relative=None, mutation=None, stale=None):
    def altered_read(path):
        value = original_read(path)
        if relative and path == ROOT/relative:
            mutation(value)
        return value
    namespace['read'] = altered_read
    namespace['sha'] = lambda path: '0'*64 if stale and path == ROOT/stale else original_sha(path)
    try:
        layer['extend'](base_c, base_r)
    except AssertionError:
        rejected.append(name)
    else:
        raise AssertionError('Invalid caliper fixture accepted: '+name)
    finally:
        namespace['read'], namespace['sha'] = original_read, original_sha

prefix = str(STAGE.relative_to(ROOT))+'/'
for name in ['source-review.json','visual-review.json','diagram-captions.json','diagram-caption-review.json','baseline-files.json']:
    invalid('stale '+name, stale=prefix+name)
invalid('pending visual review',prefix+'visual-review.json',lambda d:d.update(status='pending'))
invalid('source-object snapshot changed',prefix+'source-review.json',lambda d:d['objects'][0].update(summary='different'))
invalid('whole-object closure claim',prefix+'visual-review.json',lambda d:d['facetClosure'][0].update(doesNotCertifyWholeSourceObject=False))
invalid('component coverage inflated',prefix+'visual-review.json',lambda d:d['facetClosure'][1].update(status='fully_addressed'))
invalid('reading gaps erased',prefix+'visual-review.json',lambda d:d['explicitlyUnclosedPriorObjects'].pop())
invalid('missing target locale',prefix+'diagram-captions.json',lambda d:d['locales'].pop('vi'))
invalid('unreviewed target text',prefix+'diagram-captions.json',lambda d:d['locales']['vi']['mfg1-mechanical-lesson-018'].update(text='different'))
invalid('false native caption claim',prefix+'diagram-captions.json',lambda d:d.update(nativeReviewed=True))
invalid('false domain visual claim',prefix+'visual-review.json',lambda d:d.update(domainReviewed=True))
invalid('changed old PNG',stale='assets/manufacturing/diagrams/ohms-law.png')
invalid('changed caliper PNG',stale='assets/manufacturing/diagrams/batch23-mechanical-caliper-contacts.png')
invalid('wrong source binding',prefix+'source-review.json',lambda d:d['lessonBinding'].update(sourceHash='0'*64))
candidate = dict(historical)
candidate['src/data/manufacturing/mock-translations.json'] += b' '
try:
    audit['build_index'](candidate)
except ValueError:
    rejected.append('historical unrelated bytes cannot drift')
else:
    raise AssertionError('Historical audit weakened')
progress=json.loads((ROOT/'docs/ssw-workspace/manufacturing/progress.json').read_text())
assert progress['createdDiagrams'] == progress['usedDiagrams'] == 21
assert progress['translatedDiagramCaptionLocalePairs'] == 252
assert set(progress['diagramTranslationCoverage'].values()) == {21}
print(json.dumps({'status':'PASS','diagrams':21,'captionPairs':252,'invalidFixturesRejected':len(rejected),
                  'fixtures':rejected,'historicalBatch22IndexExact':True,'boundedFacetResolutions':len(facets['facets']),
                  'componentFacetRemainsPartial':True,'readoutFacetsRemainOpen':True,
                  'nativeReviewed':False,'domainReviewed':False,'wholeCurriculumComplete':False}))
