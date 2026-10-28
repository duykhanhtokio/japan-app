"""Exact batch20 layer over the independently preserved nineteen diagrams."""
from pathlib import Path
import copy, hashlib, json, re, struct

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'docs/ssw-workspace/manufacturing/batch20'
LESSON = 'mfg1-electrical-l005'
TARGETS = {'en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'}

def read(path):
    return json.loads(path.read_text())

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def object_sha(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',',':')).encode()).hexdigest()

def project_component(component):
    approval = read(STAGE / 'approved-diagram.json')
    asset = approval['asset']
    caption = read(STAGE / 'source-review.json')['captionJa']
    ratio = '"' + LESSON + '":' + str(asset['dimensions']['width']) + '/' + str(asset['dimensions']['height']) + ','
    line = "\n '" + LESSON + "':{source:require('../../../assets/manufacturing/diagrams/" + asset['png'] + "'),altJa:'" + caption + "'},"
    # Only an exact historical component or the exact one-entry addition is valid.
    baseline = read(STAGE / 'baseline-files.json')['sha256']['src/components/manufacturing/ManufacturingDiagram.tsx']
    if hashlib.sha256(component.encode()).hexdigest() == baseline:
        return component
    assert component.count(ratio) == component.count(line) == 1, 'Unknown meter component addition'
    historical = component.replace(ratio, '', 1).replace(line, '', 1)
    assert hashlib.sha256(historical.encode()).hexdigest() == baseline, 'Historical nineteen figure mappings changed'
    return historical

def extend(base_captions, base_register):
    approval = read(STAGE / 'approved-diagram.json')
    required = {'diagram-captions.json','diagram-caption-review.json','source-review.json','visual-review.json'}
    assert {str(STAGE.relative_to(ROOT) / name) for name in required} <= set(approval['sha256'])
    for relative, digest in approval['sha256'].items():
        assert sha(ROOT / relative) == digest, 'Stale meter evidence: ' + relative
    baseline = read(STAGE / 'baseline-files.json')['sha256']
    for relative, digest in baseline.items():
        if relative.startswith('assets/manufacturing/diagrams/'):
            assert sha(ROOT / relative) == digest, 'Historical diagram asset drift'
    for name, original, current in [
        ('base-diagram-translations.json','src/data/manufacturing/diagram-translations.json',base_captions),
        ('base-illustration-register.json','docs/ssw-workspace/manufacturing/illustration-register.json',base_register)]:
        assert sha(STAGE / name) == baseline[original], 'Historical meter input drift'
        assert read(STAGE / name) == current, 'Unknown historical nineteen diagram snapshot'
    source = read(STAGE / 'source-review.json')
    assert source['sourceVisualReview']['performed'] is True
    assert source['lessonBinding']['id'] == LESSON
    assert source['nativeReviewed'] is False and source['domainReviewed'] is False
    assert sha(ROOT / source['priorLedger']['path']) == source['priorLedger']['sha256']
    lesson = next(x for x in read(ROOT / 'src/data/manufacturing/electrical.json')['lessons'] if x['id'] == LESSON)
    assert lesson['sourceHash'] == source['lessonBinding']['sourceHash'], 'Meter lesson source drift'
    targets = read(STAGE / 'diagram-captions.json')
    assert targets['sourceLocale'] == 'ja' and set(targets['locales']) == TARGETS
    assert targets['nativeReviewed'] is False and targets['domainReviewed'] is False
    review = read(STAGE / 'diagram-caption-review.json')
    assert sha(ROOT / review['inputFile']) == review['inputFileSha256']
    assert sha(ROOT / review['canonicalReferenceFile']) == review['canonicalReferenceFileSha256']
    assert review['lessonId'] == LESSON and review['captionJa'] == source['captionJa']
    assert set(review['locales']) == TARGETS
    assert review['nativeReviewed'] is False and review['domainReviewed'] is False
    captions, register = copy.deepcopy(base_captions), copy.deepcopy(base_register)
    for locale in TARGETS:
        assert set(targets['locales'][locale]) == {LESSON}
        entry = targets['locales'][locale][LESSON]
        assert set(entry) == {'sourceJa','text'} and entry['sourceJa'] == source['captionJa']
        assert isinstance(entry['text'], str) and entry['text'].strip()
        receipt = review['locales'][locale]
        assert receipt['entrySha256'] == object_sha(entry)
        assert receipt['comparedDirectlyWithJapanese'] is True
        assert receipt['verdict'] == 'pass_scoped_ai_comparison' and not receipt['findings']
        assert receipt['checksPassed'] == review['checks'] and len(review['checks']) >= 8
        assert LESSON not in captions['locales'][locale]
        captions['locales'][locale][LESSON] = copy.deepcopy(entry)
    asset = approval['asset']
    assert asset['lessonIds'] == [LESSON] and asset['altJa'] == source['captionJa']
    assert asset['humanReviewed'] is False and asset['nativeDeviceReviewed'] is False
    visual = read(STAGE / 'visual-review.json')
    assert visual['status'] == 'pass'
    assert visual['nativeReviewed'] is False and visual['domainReviewed'] is False
    assert visual['lessonBinding'] == source['lessonBinding']
    assert visual['source']['sha256'] == source['source']['sha256']
    assert sha(ROOT / visual['sourceReview']['path']) == visual['sourceReview']['sha256']
    assert visual['captionJaSha256'] == hashlib.sha256(source['captionJa'].encode()).hexdigest()
    for record in visual['assets'].values():
        assert sha(ROOT / record['path']) == record['sha256'], 'Stale independent meter visual review'
    assert visual['assets']['png']['path'].endswith('/' + asset['png'])
    assert visual['assets']['svg']['path'].endswith('/' + asset['file'])
    assert len(register['assets']) == 19 and all(a['id'] != asset['id'] for a in register['assets'])
    register['assets'].append(asset)
    png = (ROOT / 'assets/manufacturing/diagrams' / asset['png']).read_bytes()
    assert png[:8] == b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II',png[16:24]) == (asset['dimensions']['width'],asset['dimensions']['height'])
    component = (ROOT / 'src/components/manufacturing/ManufacturingDiagram.tsx').read_text()
    project_component(component)
    figures = re.findall(r"'([^']+)':\{source:require\('([^']+)'\),altJa:'([^']+)'\}",component)
    assert len(figures) == len({x[0] for x in figures}) == 20
    assert {x[0] for x in figures} == set(captions['locales']['en'])
    meter = next(x for x in figures if x[0] == LESSON)
    assert meter[1].endswith('/'+asset['png']) and meter[2] == source['captionJa']
    return captions, register
