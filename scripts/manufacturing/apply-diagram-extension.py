"""Replay reviewed diagram layers over exact historical inputs."""
from pathlib import Path
import copy, hashlib, json, re, struct, runpy

ROOT = Path(__file__).resolve().parents[2]
STAGE = ROOT / 'docs/ssw-workspace/manufacturing/batch19'
LESSON = 'mfg1-mechanical-lesson-048'
TARGETS = {'en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'}

def read(path):
    return json.loads(path.read_text())

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def object_sha(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',',':')).encode()).hexdigest()

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def expected(include_meter=True):
    approval = read(STAGE / 'approved-diagram.json')
    for relative, digest in approval['sha256'].items():
        assert sha(ROOT / relative) == digest, 'Stale diagram evidence: ' + relative
    baseline = read(STAGE / 'baseline-files.json')['sha256']
    for name, original in [('base-diagram-translations.json','src/data/manufacturing/diagram-translations.json'),
                           ('base-illustration-register.json','docs/ssw-workspace/manufacturing/illustration-register.json')]:
        assert sha(STAGE / name) == baseline[original], 'Historical diagram input drift'
    captions = read(STAGE / 'diagram-captions.json')
    assert captions['sourceLocale'] == 'ja'
    assert captions['nativeReviewed'] is False and captions['domainReviewed'] is False
    assert set(captions['locales']) == TARGETS, 'Exact twelve caption locales required'
    source = read(STAGE / 'source-review.json')
    assert source['sourceVisualReview']['performed'] is True
    assert source['assetVisualReview']['status'] == 'pass'
    assert all(source[key] is False for key in ['humanReviewed','nativeReviewed','domainReviewed','releaseReady'])
    review = read(STAGE / 'diagram-caption-review.json')
    assert sha(ROOT / review['inputFile']) == review['inputFileSha256']
    assert sha(ROOT / review['canonicalReferenceFile']) == review['canonicalReferenceFileSha256']
    assert review['lessonId'] == LESSON and review['captionJa'] == source['captionJa']
    assert set(review['locales']) == TARGETS
    assert review['nativeReviewed'] is False and review['domainReviewed'] is False
    assert source['lessonBinding']['id'] == LESSON
    lesson = next(x for x in read(ROOT / 'src/data/manufacturing/mechanical.json')['lessons'] if x['id'] == LESSON)
    assert lesson['sourceHash'] == source['lessonBinding']['sourceHash'], 'Lesson binding drift'
    assert sha(ROOT / source['priorLedger']['path']) == source['priorLedger']['sha256']
    base = read(STAGE / 'base-diagram-translations.json')
    for locale in TARGETS:
        entries = captions['locales'][locale]
        assert set(entries) == {LESSON}, 'Only approved lesson caption may be added'
        entry = entries[LESSON]
        assert set(entry) == {'sourceJa','text'}
        assert entry['sourceJa'] == source['captionJa']
        assert isinstance(entry['text'], str) and entry['text'].strip()
        receipt = review['locales'][locale]
        assert receipt['entrySha256'] == object_sha(entry)
        assert receipt['comparedDirectlyWithJapanese'] is True
        assert receipt['verdict'] == 'pass_scoped_ai_comparison' and not receipt['findings']
        assert receipt['checksPassed'] == review['checks'] and len(review['checks']) == 10
        assert LESSON not in base['locales'][locale]
        base['locales'][locale][LESSON] = copy.deepcopy(entry)
    register = read(STAGE / 'base-illustration-register.json')
    asset = approval['asset']
    assert asset['lessonIds'] == [LESSON]
    assert asset['humanReviewed'] is False and asset['nativeDeviceReviewed'] is False
    for record in source['assetVisualReview']['assets'].values():
        assert sha(ROOT / record['path']) == record['sha256'], 'Stale independent visual review'
    assert len(register['assets']) == 18 and all(a['id'] != asset['id'] for a in register['assets'])
    register['assets'].append(asset)
    png = (ROOT / 'assets/manufacturing/diagrams' / asset['png']).read_bytes()
    assert png[:8] == b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II', png[16:24]) == (asset['dimensions']['width'], asset['dimensions']['height'])
    component = (ROOT / 'src/components/manufacturing/ManufacturingDiagram.tsx').read_text()
    meter = runpy.run_path(str(ROOT / 'scripts/manufacturing/meter-diagram-extension.py'))
    component = meter['project_component'](component)
    figures = re.findall(r"'([^']+)':\{source:require\('([^']+)'\),altJa:'([^']+)'\}", component)
    assert len(figures) == len({x[0] for x in figures}) == 19
    assert {x[0] for x in figures} == set(base['locales']['en'])
    current = next(x for x in figures if x[0] == LESSON)
    assert current[1].endswith('/' + asset['png']) and current[2] == source['captionJa']
    historical_component = component.replace('"mfg1-mechanical-lesson-048":14/13,', '', 1)
    added_line = "\n '" + LESSON + "':{source:require('" + current[1] + "'),altJa:'" + current[2] + "'},"
    assert added_line in historical_component
    historical_component = historical_component.replace(added_line, '', 1)
    assert hashlib.sha256(historical_component.encode()).hexdigest() == baseline['src/components/manufacturing/ManufacturingDiagram.tsx'], 'Historical diagram mappings changed'
    return meter['extend'](base, register) if include_meter else (base, register)

def validate(captions=None, register=None):
    wanted_captions, wanted_register = expected()
    captions = captions if captions is not None else read(ROOT / 'src/data/manufacturing/diagram-translations.json')
    register = register if register is not None else read(ROOT / 'docs/ssw-workspace/manufacturing/illustration-register.json')
    assert captions == wanted_captions, 'Current captions differ from approved historical-plus-one set'
    assert register == wanted_register, 'Current register differs from approved historical-plus-one set'

def preflight():
    captions, register = expected()
    current = read(ROOT / 'src/data/manufacturing/diagram-translations.json')
    # A rebuild may present the base or exact approved extension, never unknown data.
    base = read(STAGE / 'base-diagram-translations.json')
    previous = ROOT / 'docs/ssw-workspace/manufacturing/batch20'
    assert current in (base, read(previous / 'base-diagram-translations.json'), captions), 'Unknown caption snapshot; refusing overwrite'
    current_register = read(ROOT / 'docs/ssw-workspace/manufacturing/illustration-register.json')
    assert current_register in (read(STAGE / 'base-illustration-register.json'), read(previous / 'base-illustration-register.json'), register), 'Unknown register snapshot'
    progress = read(ROOT / 'docs/ssw-workspace/manufacturing/progress.json')
    assert set(progress['diagramTranslationCoverage']) == TARGETS, 'Unknown progress locales'
    assert set(progress['diagramTranslationCoverage'].values()) in ({18}, {19}, {20}), 'Unknown progress coverage'
    assert progress['createdDiagrams'] == progress['usedDiagrams'] in (18, 19, 20)
    assert progress['translatedDiagramCaptionLocalePairs'] in (216, 228, 240)
    return captions, register

def main():
    captions, register = preflight()
    write(ROOT / 'src/data/manufacturing/diagram-translations.json', captions)
    write(ROOT / 'docs/ssw-workspace/manufacturing/illustration-register.json', register)
    path = ROOT / 'docs/ssw-workspace/manufacturing/progress.json'
    progress = read(path)
    progress.update(createdDiagrams=20, usedDiagrams=20, translatedDiagramCaptionLocalePairs=240,
                    diagramTranslationCoverage={locale:20 for locale in captions['locales']})
    write(path, progress)
    validate()
    print('Manufacturing diagram extensions PASS: exact20 diagrams/240 caption pairs; historical19 preserved')

if __name__ == '__main__':
    main()
