"""Read-only vernier geometry, second-frame and exact historical-layer gates."""
from pathlib import Path
import json, runpy

ROOT=Path(__file__).resolve().parents[2]
STAGE=ROOT/'docs/ssw-workspace/manufacturing/batch24'
api=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-diagram-extension.py'))
layer=runpy.run_path(str(ROOT/'scripts/manufacturing/meter-diagram-extension.py'))
api['validate']()
captions,register=api['expected']()
geometry=layer['vernier_geometry']()
audit=runpy.run_path(str(ROOT/'scripts/manufacturing/build-batch22-source-index.py'))
historical=layer['historical_batch22_inputs'](audit['load_inputs'](),captions,register)
assert audit['build_index'](historical)==json.loads((ROOT/audit['OUTPUT']).read_text())
namespace=layer['extend'].__globals__
original_read,original_sha=namespace['read'],namespace['sha']
base_c=json.loads((ROOT/'docs/ssw-workspace/manufacturing/batch20/base-diagram-translations.json').read_text())
base_r=json.loads((ROOT/'docs/ssw-workspace/manufacturing/batch20/base-illustration-register.json').read_text())
rejected=[]

def invalid(name,relative=None,mutation=None,stale=None):
    def altered_read(path):
        value=original_read(path)
        if relative and path==ROOT/relative:mutation(value)
        return value
    namespace['read']=altered_read
    namespace['sha']=lambda path:'0'*64 if stale and path==ROOT/stale else original_sha(path)
    try:layer['extend'](base_c,base_r)
    except AssertionError:rejected.append(name)
    else:raise AssertionError('Invalid vernier fixture accepted: '+name)
    finally:namespace['read'],namespace['sha']=original_read,original_sha

prefix=str(STAGE.relative_to(ROOT))+'/'
for name in ['source-review.json','visual-review.json','geometry.json','diagram-captions.json','diagram-caption-review.json','component-after.tsx','base-ManufacturingDiagram.tsx']:
    invalid('stale '+name,stale=prefix+name)
for name,relative,mutation in [
 ('wrong interval count','source-review.json',lambda d:d['geometryModel'].update(intervals=10)),
 ('wrong least count','source-review.json',lambda d:d['geometryModel'].update(readingUnit=.1)),
 ('wrong coincidence index','source-review.json',lambda d:d['geometryModel'].update(coincidenceIndex=5)),
 ('paper model claimed as device','geometry.json',lambda d:d.update(paperModelOnly=False)),
 ('metadata wrong zero','geometry.json',lambda d:d['vernier'].update(zeroMm=18.25)),
 ('metadata wrong spacing','geometry.json',lambda d:d['vernier'].update(spacingPx=48)),
 ('metadata wrong reading','geometry.json',lambda d:d['reading'].update(totalMm=18.25)),
 ('metadata missing tick','geometry.json',lambda d:d['main']['ticks'].pop()),
 ('metadata duplicate tick','geometry.json',lambda d:d['main']['ticks'].__setitem__(-1,d['main']['ticks'][0])),
 ('wrong inset magnification','geometry.json',lambda d:d['inset'].update(drawingMagnificationRelativeToOverview=1)),
 ('changed source object','source-review.json',lambda d:d['objects'][0].update(summary='changed')),
 ('whole source object closure','visual-review.json',lambda d:d['facetClosure'][0].update(doesNotCertifyWholeSourceObject=False)),
 ('missing prior facet','visual-review.json',lambda d:d['facetClosure'].pop()),
 ('remaining gaps erased','visual-review.json',lambda d:d.update(explicitlyUnclosedPriorObjects=[])),
 ('native approval overclaim','visual-review.json',lambda d:d.update(nativeReviewed=True)),
 ('full source overclaim','visual-review.json',lambda d:d.update(fullSourceCertified=True)),
 ('pending independent review','visual-review.json',lambda d:d.update(status='pending')),
 ('wrong diagram alias','source-review.json',lambda d:d.update(diagramKey='mfg1-mechanical-lesson-018')),
 ('missing caption locale','diagram-captions.json',lambda d:d['locales'].pop('vi')),
 ('unreviewed caption text','diagram-captions.json',lambda d:d['locales']['vi']['mfg1-mechanical-lesson-018-reading'].update(text='changed')),
]:invalid(name,prefix+relative,mutation)

# Mutate parsed physical SVG coordinates without changing metadata. These prove
# the mathematical gate reads the actual lines rather than trusting JSON alone.
ET=namespace['ET'];original_parse=ET.fromstring
def svg_invalid(name,change):
    def changed_parse(payload):
        tree=original_parse(payload)
        if any(e.get('data-scale')=='vernier' for e in tree.iter()):change(tree)
        return tree
    ET.fromstring=changed_parse
    try:layer['vernier_geometry']()
    except AssertionError:rejected.append(name)
    else:raise AssertionError('Invalid physical SVG accepted: '+name)
    finally:ET.fromstring=original_parse

def shift(tree,role,index):
    for e in tree.iter():
        value=e.get('data-index',e.get('data-value'))
        if e.get('data-scale')==role and value==str(index):
            e.set('x1',str(float(e.get('x1'))+.5));e.set('x2',e.get('x1'));return
    raise AssertionError('Fixture target absent')
svg_invalid('physical coincidence shifted',lambda t:shift(t,'vernier',4))
svg_invalid('physical zero shifted',lambda t:shift(t,'vernier',0))
svg_invalid('physical last main tick shifted',lambda t:shift(t,'main',39))
svg_invalid('physical inset shifted',lambda t:shift(t,'inset-vernier',0))
svg_invalid('unexpected scale transform',lambda t:t.set('transform','translate(1,0)'))
component=(ROOT/'src/components/manufacturing/ManufacturingDiagram.tsx').read_text()
try:layer['project_component'](component.replace("secondary?' 2':''","secondary?' 3':''",1))
except AssertionError:rejected.append('unapproved secondary control renderer')
else:raise AssertionError('Changed renderer accepted')
assert len(register['assets'])==22 and set(captions['locales']['en'])==set(__import__('re').findall(r"'([^']+)':\{source:require\(",component))
progress=json.loads((ROOT/'docs/ssw-workspace/manufacturing/progress.json').read_text())
assert progress['createdDiagrams']==progress['usedDiagrams']==22
assert progress['translatedDiagramCaptionLocalePairs']==264
assert set(progress['diagramTranslationCoverage'].values())=={22}
print(json.dumps({'status':'PASS','diagrams':22,'captionPairs':264,'physicalSvgTicksChecked':geometry['svgTicksChecked'],
                  'readingMm':geometry['readingMm'],'uniqueCoincidenceIndex':geometry['uniqueCoincidenceIndex'],
                  'invalidFixturesRejected':len(rejected),'fixtures':rejected,'historicalBatch22IndexExact':True,
                  'primaryContactDiagramPreserved':True,'nativeReviewed':False,'domainReviewed':False,
                  'instrumentAccuracyCertified':False,'wholeCurriculumComplete':False}))
