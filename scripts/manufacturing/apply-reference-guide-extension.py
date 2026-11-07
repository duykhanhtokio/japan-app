"""Add reviewed SSW1 reference guides without rewriting historical snapshots.

The two historical-view helpers accept only the exact frozen base or the exact
approved extension. They do not treat an arbitrary superset as historical proof.
"""
from copy import deepcopy
from pathlib import Path
import hashlib
import json
import re
import runpy

ROOT = Path(__file__).resolve().parents[2]
STAGE = 'docs/ssw-workspace/manufacturing/batch18/integration'
SOURCE = 'src/data/manufacturing/source-guides.json'
TARGETS = 'src/data/manufacturing/source-guide-translations.json'
MANIFEST = STAGE + '/approved-extension.json'
BASE_SOURCE = STAGE + '/base-source-guides.json'
BASE_TARGETS = STAGE + '/base-source-guide-translations.json'
BASE_TARGET_SHA256 = 'df0c466eb7cea5068e4b68203976d3d6c74a75fbb39cfae32d7e5b110b98920e'
EXPECTED = {
    'mechanical': 'mfg1-mechanical-source-guide-tolerance-annotation',
    'electrical': 'mfg1-electrical-source-guide-leakage-earth',
    'surface': 'mfg1-surface-source-guide-pretreatment-jig',
}
LOCALES = ['en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl']


def require(condition, message):
    if not condition:
        raise ValueError(message)


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def object_digest(value):
    return digest(json.dumps(value, ensure_ascii=False, sort_keys=True,
                             separators=(',', ':')).encode())


def base_snapshots():
    source = (ROOT / BASE_SOURCE).read_bytes()
    targets = (ROOT / BASE_TARGETS).read_bytes()
    freeze = json.loads((ROOT / 'docs/ssw-workspace/manufacturing/batch12/source-guides/source-freeze.json').read_bytes())
    require(digest(source) == freeze['sha256'], 'Historical five-guide snapshot drift')
    require(digest(targets) == BASE_TARGET_SHA256, 'Historical sixty-translation snapshot drift')
    base = json.loads(source)
    require(len(base['guides']) == 5, 'Historical guide count drift')
    for guide in base['guides']:
        require(guide['sourceHash'] == freeze['objects'][guide['id']]
                == object_digest({k: v for k, v in guide.items() if k != 'sourceHash'}),
                'Historical source object drift: ' + guide['id'])
    return source, targets


def _input_path(relative):
    require(isinstance(relative, str) and relative.startswith('docs/ssw-workspace/manufacturing/batch18/')
            and not Path(relative).is_absolute() and '..' not in Path(relative).parts,
            'Unsafe extension input path')
    return ROOT / relative


def load_approval():
    approval = json.loads((ROOT / MANIFEST).read_bytes())
    require(approval['schemaVersion'] == 1 and approval['independentAiReview'] is True,
            'Reference extension requires exact independent AI review receipts')
    for flag in ('nativeReviewed', 'domainReviewed', 'releaseReady'):
        require(approval[flag] is False, 'Unsupported guide extension certification: ' + flag)
    require(approval['reviewedInputSha256'] == approval['inputs'], 'Reviewed extension input set drift')
    require(len(approval['inputs']) == 39 and len(approval['guides']) == 3,
            'Expected three Japanese and thirty-six target inputs')
    used = set()
    for relative, expected in approval['inputs'].items():
        require(digest(_input_path(relative).read_bytes()) == expected, 'Extension staging drift: ' + relative)
    require(approval['reviews'], 'Missing independent review receipts')
    for review in approval['reviews']:
        require(digest(_input_path(review['path']).read_bytes()) == review['sha256'],
                'Independent extension review receipt drift')
    reviewer = runpy.run_path(str(ROOT / 'scripts/manufacturing/check-batch18-guide-reviews.py'))
    reviewer['validate'](approval)
    return approval, used


def _validate_translation(guide, target, locale):
    require(target['sourceHash'] == guide['sourceHash'], 'Stale guide translation: ' + locale)
    require(target.get('translatedDirectlyFrom') == 'ja' and target.get('nativeReviewed') is False
            and target.get('domainReviewed') is False, 'Unsupported guide target provenance')
    require([p['id'] for p in target['paragraphs']] == [p['id'] for p in guide['paragraphs']],
            'Guide paragraph identity/order drift')
    require([(t['ja'], t['reading']) for t in target['terms']]
            == [(t['ja'], t['reading']) for t in guide['terms']], 'Guide glossary identity/order drift')
    require(len(target['safety']) == len(guide['safetyJa']), 'Guide safety count drift')
    pairs = [(guide[k + 'Ja'], target[k]) for k in ('title', 'objective', 'activity', 'summary')]
    for source, translated in zip(guide['paragraphs'], target['paragraphs']):
        pairs.extend([(source['titleJa'], translated['title']), (source['textJa'], translated['text'])])
    pairs.extend((a['meaningJa'], b['meaning']) for a, b in zip(guide['terms'], target['terms']))
    pairs.extend(zip(guide['safetyJa'], target['safety']))
    for source, translated in pairs:
        require(isinstance(translated, str) and translated.strip(), 'Empty guide target field')
        numbers = lambda text: set(re.findall(r'\d+(?:\.\d+)?', text))
        require(numbers(source) == numbers(translated), 'Guide target numeric drift: ' + locale + '/' + guide['id'])


def extension_outputs():
    source_bytes, target_bytes = base_snapshots()
    source, targets = json.loads(source_bytes), json.loads(target_bytes)
    approval, used = load_approval()
    existing_ids = {g['id'] for g in source['guides']}
    source_qa = json.loads((ROOT / 'docs/ssw-workspace/manufacturing/source-qa-report.json').read_bytes())
    source_info = {'mfg1-' + s['specialty'] + '-source': s for s in source_qa['sources']}
    knowledge = {k['id'] for k in json.loads((ROOT / 'docs/ssw-workspace/manufacturing/knowledge-matrix.json').read_bytes())['knowledge']}
    records = {row['specialty']: row for row in approval['guides']}
    require(set(records) == set(EXPECTED) and len(records) == len(approval['guides']), 'Unexpected guide specialties')
    for specialty, identifier in EXPECTED.items():
        record = records[specialty]
        require(record['path'] in approval['inputs'], 'Unapproved Japanese guide path')
        used.add(record['path'])
        guide = json.loads(_input_path(record['path']).read_bytes())
        require(guide['id'] == identifier and guide['specialty'] == specialty and identifier not in existing_ids,
                'Unexpected or duplicate guide identity')
        require(guide['sourceHash'] == object_digest({k: v for k, v in guide.items() if k != 'sourceHash'}),
                'Invalid new guide source hash')
        require(guide.get('nativeReviewed') is False and guide.get('domainReviewed') is False,
                'Unsupported Japanese guide certification')
        require(guide['knowledgeIds'] and set(guide['knowledgeIds']) <= knowledge, 'Unknown guide knowledge linkage')
        require(guide['sources'] and guide['paragraphs'] and guide['terms'] and guide['safetyJa'], 'Incomplete guide source/structure')
        require(len({p['id'] for p in guide['paragraphs']}) == len(guide['paragraphs']), 'Duplicate guide paragraph IDs')
        require(guide['estimatedMinutes'] > 0 and guide['durationBasis'] == 'target_with_activities_not_measured',
                'Unsupported guide duration claim')
        for reference in guide['sources']:
            info = source_info.get(reference['documentId'])
            require(info is not None and info['specialty'] == specialty, 'Cross-specialty/unknown guide source')
            require(isinstance(reference['pdfPage'], int) and 1 <= reference['pdfPage'] <= info['pdfPages']
                    and reference['pdfPage'] - reference['printedPage'] == info['printedToPhysicalOffset'],
                    'Invalid guide physical/printed page')
        require(set(record['translations']) == set(LOCALES), 'Incomplete guide locale set')
        for locale in LOCALES:
            path = record['translations'][locale]
            require(path in approval['inputs'], 'Unapproved target guide path')
            used.add(path)
            package = json.loads(_input_path(path).read_bytes())
            require(package['locale'] == locale and set(package['lessons']) == {identifier}, 'Target package identity drift')
            target = package['lessons'][identifier]
            _validate_translation(guide, target, locale)
            targets['locales'][locale][identifier] = target
        source['guides'].append(guide)
        existing_ids.add(identifier)
    require(used == set(approval['inputs']), 'Unused or duplicated extension inputs')
    require(len(source['guides']) == 8 and all(len(targets['locales'][loc]) == 8 for loc in LOCALES),
            'Guide extension coverage drift')
    return {SOURCE: encoded(source), TARGETS: encoded(targets)}


def historical_source_guides_bytes(current_bytes):
    base, _ = base_snapshots()
    if current_bytes == base:
        return base
    if current_bytes != extension_outputs()[SOURCE]:
        current_bytes=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-guide-extension26.py'))['historical_bytes'](SOURCE,current_bytes)
    require(current_bytes == extension_outputs()[SOURCE], 'Current source guides are not the exact approved extension')
    return base


def historical_source_guide_translations_bytes(current_bytes):
    _, base = base_snapshots()
    if current_bytes == base:
        return base
    if current_bytes != extension_outputs()[TARGETS]:
        current_bytes=runpy.run_path(str(ROOT/'scripts/manufacturing/apply-guide-extension26.py'))['historical_bytes'](TARGETS,current_bytes)
    require(current_bytes == extension_outputs()[TARGETS], 'Current guide targets are not the exact approved extension')
    return base


def compile_outputs(current):
    require(set(current) == {SOURCE, TARGETS}, 'Incomplete current reference-guide files')
    historical_source_guides_bytes(current[SOURCE])
    historical_source_guide_translations_bytes(current[TARGETS])
    return extension_outputs()


def main():
    current = {p: (ROOT / p).read_bytes() for p in (SOURCE, TARGETS)}
    outputs = compile_outputs(current)
    changed = []
    for path, payload in outputs.items():
        if payload != current[path]:
            (ROOT / path).write_bytes(payload)
            changed.append(path)
    coverage = {locale: 8 for locale in LOCALES}
    for relative in ('src/data/manufacturing/course-manifest.json', 'docs/ssw-workspace/manufacturing/progress.json'):
        value = json.loads((ROOT / relative).read_bytes())
        value.update(sourceReferenceGuides=8, sourceGuideExtensionStage=STAGE)
        if relative.endswith('progress.json'):
            value.update(sourceGuideTranslationCoverage=coverage, translatedSourceGuideLocalePairs=96)
        payload = encoded(value)
        if payload != (ROOT / relative).read_bytes():
            (ROOT / relative).write_bytes(payload)
            changed.append(relative)
    report = {'status': 'PASS', 'guides': 8, 'newGuides': 3, 'preservedHistoricalGuides': 5,
              'translatedGuidePairs': 96, 'newTranslationPairs': 36,
              'preservedHistoricalTranslationPairs': 60, 'coverage': coverage,
              'currentSourceSha256': digest(outputs[SOURCE]), 'currentTargetSha256': digest(outputs[TARGETS]),
              'nativeReviewed': False, 'domainReviewed': False, 'releaseReady': False}
    (ROOT / STAGE / 'integration-qa.json').write_bytes(encoded(report))
    print(json.dumps({**report, 'changedFiles': changed}))


if __name__ == '__main__':
    main()
