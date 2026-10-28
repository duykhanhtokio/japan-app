"""Exact reviewed diagram layers over the preserved nineteen-diagram base."""
from pathlib import Path
import copy, hashlib, json, re, struct

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'docs/ssw-workspace/manufacturing/batch20'
LESSON = 'mfg1-electrical-l005'
TARGETS = {'en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'}
LAYERS = [(STAGE, LESSON, 'electrical'),
          (ROOT / 'docs/ssw-workspace/manufacturing/batch23', 'mfg1-mechanical-lesson-018', 'mechanical')]

def read(path):
    return json.loads(path.read_text())

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def object_sha(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',',':')).encode()).hexdigest()

def project_one_component(component, stage, lesson):
    approval = read(stage / 'approved-diagram.json')
    asset = approval['asset']
    caption = read(stage / 'source-review.json')['captionJa']
    ratio = '"' + lesson + '":' + str(asset['dimensions']['width']) + '/' + str(asset['dimensions']['height']) + ','
    line = "\n '" + lesson + "':{source:require('../../../assets/manufacturing/diagrams/" + asset['png'] + "'),altJa:'" + caption + "'},"
    # Only an exact historical component or the exact one-entry addition is valid.
    baseline = read(stage / 'baseline-files.json')['sha256']['src/components/manufacturing/ManufacturingDiagram.tsx']
    if hashlib.sha256(component.encode()).hexdigest() == baseline:
        return component
    assert component.count(ratio) == component.count(line) == 1, 'Unknown meter component addition'
    historical = component.replace(ratio, '', 1).replace(line, '', 1)
    assert hashlib.sha256(historical.encode()).hexdigest() == baseline, 'Historical figure mappings changed'
    return historical

def project_component(component):
    for stage, lesson, _ in reversed(LAYERS):
        component = project_one_component(component, stage, lesson)
    return component

def extend_one(base_captions, base_register, stage, lesson_id, specialty, base_count, component):
    approval = read(stage / 'approved-diagram.json')
    required = {'diagram-captions.json','diagram-caption-review.json','source-review.json','visual-review.json'}
    assert {str(stage.relative_to(ROOT) / name) for name in required} <= set(approval['sha256'])
    for relative, digest in approval['sha256'].items():
        assert sha(ROOT / relative) == digest, 'Stale meter evidence: ' + relative
    baseline = read(stage / 'baseline-files.json')['sha256']
    for relative, digest in baseline.items():
        if relative.startswith('assets/manufacturing/diagrams/'):
            assert sha(ROOT / relative) == digest, 'Historical diagram asset drift'
    for name, original, current in [
        ('base-diagram-translations.json','src/data/manufacturing/diagram-translations.json',base_captions),
        ('base-illustration-register.json','docs/ssw-workspace/manufacturing/illustration-register.json',base_register)]:
        assert sha(stage / name) == baseline[original], 'Historical diagram input drift'
        assert read(stage / name) == current, 'Unknown historical diagram snapshot'
    source = read(stage / 'source-review.json')
    assert source['sourceVisualReview']['performed'] is True
    assert source['lessonBinding']['id'] == lesson_id
    assert source['nativeReviewed'] is False and source['domainReviewed'] is False
    assert sha(ROOT / source['priorLedger']['path']) == source['priorLedger']['sha256']
    lesson = next(x for x in read(ROOT / ('src/data/manufacturing/' + specialty + '.json'))['lessons'] if x['id'] == lesson_id)
    assert lesson['sourceHash'] == source['lessonBinding']['sourceHash'], 'Meter lesson source drift'
    targets = read(stage / 'diagram-captions.json')
    assert targets['sourceLocale'] == 'ja' and set(targets['locales']) == TARGETS
    assert targets['nativeReviewed'] is False and targets['domainReviewed'] is False
    review = read(stage / 'diagram-caption-review.json')
    assert sha(ROOT / review['inputFile']) == review['inputFileSha256']
    assert sha(ROOT / review['canonicalReferenceFile']) == review['canonicalReferenceFileSha256']
    assert review['lessonId'] == lesson_id and review['captionJa'] == source['captionJa']
    assert set(review['locales']) == TARGETS
    assert review['nativeReviewed'] is False and review['domainReviewed'] is False
    captions, register = copy.deepcopy(base_captions), copy.deepcopy(base_register)
    for locale in TARGETS:
        assert set(targets['locales'][locale]) == {lesson_id}
        entry = targets['locales'][locale][lesson_id]
        assert set(entry) == {'sourceJa','text'} and entry['sourceJa'] == source['captionJa']
        assert isinstance(entry['text'], str) and entry['text'].strip()
        receipt = review['locales'][locale]
        assert receipt['entrySha256'] == object_sha(entry)
        assert receipt['comparedDirectlyWithJapanese'] is True
        assert receipt['verdict'] == 'pass_scoped_ai_comparison' and not receipt['findings']
        assert receipt['checksPassed'] == review['checks'] and len(review['checks']) >= 8
        assert lesson_id not in captions['locales'][locale]
        captions['locales'][locale][lesson_id] = copy.deepcopy(entry)
    asset = approval['asset']
    assert asset['lessonIds'] == [lesson_id] and asset['altJa'] == source['captionJa']
    assert asset['sourceSpecialty'] == specialty
    assert asset['humanReviewed'] is False and asset['nativeDeviceReviewed'] is False
    visual = read(stage / 'visual-review.json')
    assert visual['status'] == 'pass'
    assert visual['nativeReviewed'] is False and visual['domainReviewed'] is False
    assert visual['lessonBinding'] == source['lessonBinding']
    assert visual['source']['sha256'] == source['source']['sha256']
    assert sha(ROOT / visual['sourceReview']['path']) == visual['sourceReview']['sha256']
    assert visual['captionJaSha256'] == hashlib.sha256(source['captionJa'].encode()).hexdigest()
    if stage.name == 'batch23':
        caliper_facets(source, visual)
    for record in visual['assets'].values():
        assert sha(ROOT / record['path']) == record['sha256'], 'Stale independent meter visual review'
    assert visual['assets']['png']['path'].endswith('/' + asset['png'])
    assert visual['assets']['svg']['path'].endswith('/' + asset['file'])
    assert len(register['assets']) == base_count and all(a['id'] != asset['id'] for a in register['assets'])
    register['assets'].append(asset)
    png = (ROOT / 'assets/manufacturing/diagrams' / asset['png']).read_bytes()
    assert png[:8] == b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II',png[16:24]) == (asset['dimensions']['width'],asset['dimensions']['height'])
    project_one_component(component, stage, lesson_id)
    figures = re.findall(r"'([^']+)':\{source:require\('([^']+)'\),altJa:'([^']+)'\}",component)
    assert len(figures) == len({x[0] for x in figures}) == base_count + 1
    assert {x[0] for x in figures} == set(captions['locales']['en'])
    meter = next(x for x in figures if x[0] == lesson_id)
    assert meter[1].endswith('/'+asset['png']) and meter[2] == source['captionJa']
    return captions, register

def caliper_facets(source=None, visual=None):
    stage = LAYERS[-1][0]
    source = source if source is not None else read(stage / 'source-review.json')
    visual = visual if visual is not None else read(stage / 'visual-review.json')
    expected_ids = {'mfg1-mechanical-b22-p072-o02', 'mfg1-mechanical-b22-p072-o08', 'mfg1-mechanical-b22-p073-o03'}
    prior = read(ROOT / source['priorLedger']['path'])
    objects = {obj['id']:{**obj,'pdfPage':page['pdfPage']} for page in prior['pages'] for obj in page['objects']}
    assert len(source['objects']) == 3 and {x['id'] for x in source['objects']} == expected_ids
    assert all(x == objects[x['id']] for x in source['objects']), 'Caliper source-object snapshot drift'
    author = {x['priorObjectId']:x for x in source['facetClosure']}
    reviewed = {x['priorObjectId']:x for x in visual['facetClosure']}
    assert len(source['facetClosure']) == len(visual['facetClosure']) == 3
    assert set(author) == set(reviewed) == expected_ids
    for identifier, item in reviewed.items():
        assert item['doesNotCertifyWholeSourceObject'] is True and item['scope'].strip()
        if identifier.endswith('p072-o08'):
            assert item['status'] == 'partially_addressed' and item['remainingFacets']
        else:
            assert item['status'] == 'bounded_visual_facet_addressed'
    assert visual['explicitlyUnclosedPriorObjects'] == source['explicitlyUnclosedPriorObjects']
    assert {'mfg1-mechanical-b22-p073-o05','mfg1-mechanical-b22-p073-o08','mfg1-mechanical-b22-p073-o09'} <= set(source['explicitlyUnclosedPriorObjects'])
    return {'schemaVersion':1,'scope':'Only independently reviewed displayed contact-role facets; no historical object or whole-source closure.',
            'sourceReviewSha256':sha(stage/'source-review.json'),'visualReviewSha256':sha(stage/'visual-review.json'),
            'facets':visual['facetClosure'],'explicitlyUnclosedPriorObjects':source['explicitlyUnclosedPriorObjects'],
            'nativeReviewed':False,'domainReviewed':False,'wholeCurriculumComplete':False,'releaseReady':False}

def historical_batch22_inputs(inputs, approved_captions, approved_register):
    """Project only the exact approved addition; preserve the old audit bytes."""
    stage = LAYERS[-1][0]
    outputs = dict(inputs)
    for relative, snapshot, expected in [
        ('src/data/manufacturing/diagram-translations.json','base-diagram-translations.json',approved_captions),
        ('docs/ssw-workspace/manufacturing/illustration-register.json','base-illustration-register.json',approved_register)]:
        if relative in outputs:
            assert json.loads(outputs[relative]) in (read(stage/snapshot),expected), 'Unknown historical projection input'
            outputs[relative] = (stage/snapshot).read_bytes()
    component = 'src/components/manufacturing/ManufacturingDiagram.tsx'
    if component in outputs:
        outputs[component] = project_one_component(outputs[component].decode(),stage,LAYERS[-1][1]).encode()
    return outputs

def extend(base_captions, base_register):
    component = (ROOT / 'src/components/manufacturing/ManufacturingDiagram.tsx').read_text()
    captions, register = base_captions, base_register
    for index, (stage, lesson, specialty) in enumerate(LAYERS):
        historical_component = component
        for later_stage, later_lesson, _ in reversed(LAYERS[index + 1:]):
            historical_component = project_one_component(historical_component, later_stage, later_lesson)
        captions, register = extend_one(captions, register, stage, lesson, specialty, 19 + index, historical_component)
    return captions, register
