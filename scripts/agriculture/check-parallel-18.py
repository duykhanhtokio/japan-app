"""Read-only batch18 figure, source binding, review and preservation checks."""
import hashlib
from collections import Counter
import json
from pathlib import Path
import re
import runpy
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
BASE = '5734e8a9889631ec599d5a165d9d5289ff4af9fe'
WORK = ROOT / 'docs/ssw-workspace/agriculture'
DATA = ROOT / 'src/data/agriculture'
# Reuse the historical read-only WebP header decoder, never its snapshot main().
webp_dimensions = runpy.run_path(str(ROOT / 'scripts/agriculture/check-parallel-13.py'))['webp_dimensions']


def read(path):
    return json.loads(Path(path).read_text())


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def prior(path):
    return git('show', f'{BASE}:{path}')


def frozen(path):
    assert (ROOT / path).read_bytes() == prior(path), f'Prior bytes changed: {path}'


def no_certification(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in ('humanReviewed', 'nativeReviewed', 'domainReviewed', 'releaseReady', 'sourcePhotoObjectiveComplete', 'sourceImagesRedistributed'):
                assert child is False, f'False review/scope flag required: {key}'
            no_certification(child)
    elif isinstance(value, list):
        for child in value:
            no_certification(child)


def scalar_values(value):
    if isinstance(value, dict):
        for child in value.values():
            yield from scalar_values(child)
    elif isinstance(value, list):
        for child in value:
            yield from scalar_values(child)
    else:
        yield value


def no_review_blockers(value):
    if isinstance(value, dict):
        for key, child in value.items():
            if key in ('unresolvedBlockingIssues', 'blockingIssues', 'blockers'):
                assert not child, f'Unresolved reviewer blockers: {child}'
            no_review_blockers(child)
    elif isinstance(value, list):
        for child in value:
            no_review_blockers(child)


def main():
    baseline_data = [p for p in git('ls-tree', '-r', '--name-only', BASE, 'src/data/agriculture').decode().splitlines() if p.endswith('.json')]
    for path in baseline_data:
        if path.endswith('.json') and not path.endswith('/recognition-images.json'):
            frozen(path)
    assert set(str(p.relative_to(ROOT)) for p in DATA.rglob('*.json')) == set(baseline_data)
    frozen_docs = ['knowledge-ledger.json', 'source-coverage-audit.json', 'source-gap-backlog.json',
                   'source-gap-reconciliation-11.json', 'source-gap-reconciliation-12.json', 'source-inventory.json']
    for name in frozen_docs:
        frozen('docs/ssw-workspace/agriculture/' + name)
    lessons = {l['id']: l for l in read(DATA / 'lessons.ja.json')['lessons']}
    assert len(lessons) == 168
    assert len(read(WORK / 'knowledge-ledger.json')['knowledge']) == 1008
    index = read(DATA / 'translations.json')
    assert sum(len(read(DATA / name)) for name in index['shards'].values()) == 2016
    assert sum(len(e['questions']) for e in read(DATA / 'weekly-checks.ja.json')['exams']) == 388
    registry = read(DATA / 'recognition-images.json')
    before = json.loads(prior('src/data/agriculture/recognition-images.json'))
    assert registry['images'][:29] == before['images'] and len(registry['images']) == 34
    for row in before['images']:
        frozen(row['assetPath'])
        if row.get('editableSvgPath'):
            frozen(row['editableSvgPath'])
    assert registry['recognitionComplete'] is False and registry['sourceOccurrencesClosed'] == 0
    no_certification(registry)
    manifest = read(WORK / 'parallel-18-manifest.json')
    no_certification(manifest)
    assert manifest['courseComplete'] is False and manifest['recognitionComplete'] is False
    assert manifest['sourceOccurrencesClosed'] == 0
    images = registry['images'][29:]
    assert [r['id'] for r in images] == manifest['newRecognitionImageIds']
    assert len({r['id'] for r in registry['images']}) == 34
    assert len({r['assetKey'] for r in registry['images']}) == 34
    assert len({r['assetPath'] for r in registry['images']}) == 34
    assert len({r['assetSha256'] for r in registry['images']}) == 34
    assert set(manifest['lessonIds']) == {lid for row in images for lid in row['lessonIds']}
    assert len(manifest['lessonIds']) == 1
    expected_kinds = dict(material_recognition_illustration=5)
    assert Counter(row['kind'] for row in images) == expected_kinds
    assert manifest['newCommonAppearanceRecognitionIllustrations'] == 5
    assert manifest['newControlledConceptDiagrams'] == 0
    audit = read(WORK / 'source-coverage-audit.json')
    items = {i['id']: i for p in audit['pages'] for i in p['items']}
    runtime = (ROOT / 'src/components/agriculture/RecognitionImages.tsx').read_text()
    static_assets = {}
    for quoted, plain, path in re.findall(r"(?:'([^']+)'|\b([\w-]+)):require\('\.\./\.\./\.\./([^']+)'\)", runtime):
        static_assets[quoted or plain] = path
    assert len(static_assets) == 34
    assert all(static_assets[r['assetKey']] == r['assetPath'] for r in registry['images'])
    added_lines = {line for line in runtime.splitlines(keepends=True) if any("/" + r['assetKey'] + "-v1.webp'" in line for r in images)}
    assert len(added_lines) == 5
    assert ''.join(line for line in runtime.splitlines(keepends=True) if line not in added_lines).encode() == prior('src/components/agriculture/RecognitionImages.tsx'), 'Only five asset imports may change runtime component'
    frozen('src/components/agriculture/AgricultureCourse.tsx')
    inventory = read(WORK / 'source-inventory.json')
    source_pages = {(d['id'], p['pdfPage']): p['printedPage'] for d in inventory['documents'] for p in d['pages']}
    source_ids = set()
    for row in images:
        assert static_assets[row['assetKey']] == row['assetPath']
        asset = ROOT / row['assetPath']
        assert asset.is_file() and sha(asset) == row['assetSha256']
        assert webp_dimensions(asset.read_bytes()) == (row['width'], row['height'])
        assert set(row['lessonIds']) == set(row['lessonSourceHashes'])
        for lesson_id in row['lessonIds']:
            assert lessons[lesson_id]['sourceHash'] == row['lessonSourceHashes'][lesson_id]
        for field in ['titleJa', 'altJa', 'observationJa', 'limitJa']:
            assert isinstance(row[field], str) and row[field].strip()
        assert isinstance(row.get('labelsJa', []), list)
        assert all(isinstance(label, str) and label.strip() for label in row.get('labelsJa', []))
        if row['kind'] in ('organ_position_diagram', 'sowing_pattern_diagram', 'soil_state_comparison_diagram'):
            assert row.get('allowExpandedView') is True
        else:
            assert not row.get('allowExpandedView', False)
        assert row['sourceItemIds'] and all(i in items for i in row['sourceItemIds'])
        source_ids.update(row['sourceItemIds'])
        refs = {(r['documentId'], r['pdfPage'], r['printedPage']) for r in row['sources']}
        assert all(source_pages[(doc, page)] == printed for doc, page, printed in refs)
        if row.get('scopeLevels'):
            assert set(map(str, row['scopeLevels'])) <= {doc[-1] for doc, _, _ in refs}
        for item_id in row['sourceItemIds']:
            assert any((r['documentId'], r['pdfPage'], r['printedPage']) in refs for r in items[item_id]['sources'])
        if row.get('editableSvgPath'):
            svg = ROOT / row['editableSvgPath']
            assert sha(svg) == row['editableSvgSha256']
            tree = ET.fromstring(svg.read_bytes())
            assert not list(tree.iter('{http://www.w3.org/2000/svg}image')), 'SVG must be independently drawn, no embedded source raster'
    for packet in manifest['authorReviewPackets']:
        author, review = ROOT / packet['authorPath'], ROOT / packet['reviewPath']
        assert sha(author) == packet['authorSha256'] and sha(review) == packet['reviewSha256']
        review_data = read(review)
        assert packet['authorSha256'] in set(v for v in scalar_values(review_data) if isinstance(v, str)), 'Review must structurally bind exact frozen author'
        assert review_data.get('status'), 'Reviewer status required'
        assert not any(term in review_data['status'].lower() for term in ('pending', 'awaiting', 'blocked', 'fail'))
        no_review_blockers(review_data)
        raw = read(author)
        no_certification(raw)
        no_certification(review_data)
        assert raw['creation'] == 'original_builtin_imagegen_no_pdf_image_input'
        provenance = raw.get('generation') or raw.get('provenance')
        assert isinstance(provenance, dict)
        assert provenance.get('exactPrompt') or provenance.get('prompt'), 'Exact original image prompt required'
        assert not provenance.get('referenceImages', []) and not provenance.get('referencedImagePaths', [])
        assert not provenance.get('numLastImagesToInclude')
        assert provenance.get('sourcePdfOrSourceImageUsedAsGenerationInput', False) is False
        original_sha = provenance.get('selectedOriginalSha256') or provenance.get('originalGenerationSha256')
        assert re.fullmatch('[a-f0-9]{64}', original_sha or ''), 'Original generated raster hash required'
        expected = {key: raw[key] for key in ('titleJa', 'altJa', 'observationJa', 'limitJa')}
        for patch in review_data.get('patches', []):
            assert patch['field'] in expected and expected[patch['field']] == patch['before']
            expected[patch['field']] = patch['after']
        current = next(row for row in images if row['id'] == raw['id'])
        assert all(current[key] == value for key, value in expected.items()), 'Unreviewed Japanese metadata mutation'
    assert source_ids == {'AGR-A10-FLOWER-' + str(n).zfill(4) for n in range(461, 466)}
    assert [r['assetKey'] for r in images] == ['pvc-cover-film', 'agripoly-film', 'nonwoven-cover', 'shade-cloth', 'insect-net']
    assert len(manifest['authorReviewPackets']) == 5
    assert all(set(r['photoInventoryIds']) == {'AGR-RI-S1-104-' + str(n)} for r, n in zip(images, range(13, 18)))
    recognition_inventory = read(WORK / 'recognition-inventory.json')
    previous_ri = json.loads(prior('docs/ssw-workspace/agriculture/recognition-inventory.json'))
    additions = {'originalIllustrationAssetId', 'originalIllustrationAvailable', 'sourcePhotoObjectiveComplete'}
    targets = {pid: row['id'] for row in images for pid in row['photoInventoryIds']}
    assert len(targets) == 5
    assert len(recognition_inventory['entries']) == len(previous_ri['entries']) == 48
    for old, current in zip(previous_ri['entries'], recognition_inventory['entries']):
        if old['id'] in targets:
            assert not additions.intersection(old)
            assert {k: v for k, v in current.items() if k not in additions} == old
            assert current['originalIllustrationAssetId'] == targets[old['id']]
            assert current['originalIllustrationAvailable'] is True and current['sourcePhotoObjectiveComplete'] is False
        else:
            assert current == old
    assert {k: v for k, v in recognition_inventory.items() if k not in ('entries', 'originalIllustrations')} == {k: v for k, v in previous_ri.items() if k not in ('entries', 'originalIllustrations')}
    assert recognition_inventory['originalIllustrations']['count'] == 28
    assert recognition_inventory['recognitionReady'] is False
    no_certification(recognition_inventory)
    register = read(WORK / 'illustration-register.json')
    old_register = json.loads(prior('docs/ssw-workspace/agriculture/illustration-register.json'))
    assert register['figures'][:len(old_register['figures'])] == old_register['figures']
    assert [r['id'] for r in register['figures'][len(old_register['figures']):]] == manifest['newRecognitionImageIds']
    assert register['complete'] is False
    print(json.dumps(dict(status='PASS', baseline=BASE, newFigures=5, priorFiguresPreserved=29,
                          actualWebpHashesAndDimensions=True, editableSvgFigures=0,
                          sourceOccurrencesReferenced=len(source_ids), sourceOccurrencesClosed=0,
                          priorJapaneseLessonsUnchanged=168, priorKnowledgeUnitsUnchanged=1008,
                          priorTranslationPairsUnchanged=2016, priorWeeklyQuestionsUnchanged=388,
                          frozenDocuments=len(frozen_docs), courseComplete=False,
                          humanReviewed=False, nativeReviewed=False, domainReviewed=False, releaseReady=False)))


if __name__ == '__main__':
    main()
