"""Read-only batch15 figure, source binding, review and preservation checks."""
import hashlib
from collections import Counter
import json
from pathlib import Path
import re
import runpy
import subprocess
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
BASE = '9da71777329996c93f6afbe0d4b47713fc0e3a77'
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
                   'source-gap-reconciliation-11.json', 'source-gap-reconciliation-12.json']
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
    assert registry['images'][:12] == before['images'] and len(registry['images']) == 18
    for row in before['images']:
        frozen(row['assetPath'])
        if row.get('editableSvgPath'):
            frozen(row['editableSvgPath'])
    assert registry['recognitionComplete'] is False and registry['sourceOccurrencesClosed'] == 0
    no_certification(registry)
    manifest = read(WORK / 'parallel-15-manifest.json')
    no_certification(manifest)
    assert manifest['courseComplete'] is False and manifest['recognitionComplete'] is False
    assert manifest['sourceOccurrencesClosed'] == 0
    images = registry['images'][12:]
    assert [r['id'] for r in images] == manifest['newRecognitionImageIds']
    assert len({r['id'] for r in registry['images']}) == 18
    assert len({r['assetKey'] for r in registry['images']}) == 18
    assert len({r['assetPath'] for r in registry['images']}) == 18
    assert len({r['assetSha256'] for r in registry['images']}) == 18
    assert set(manifest['lessonIds']) == {lid for row in images for lid in row['lessonIds']}
    assert len(manifest['lessonIds']) == 2
    expected_kinds = dict(crop_recognition_illustration=6)
    assert Counter(row['kind'] for row in images) == expected_kinds
    assert manifest['newCommonAppearanceRecognitionIllustrations'] == 6
    assert manifest['newControlledConceptDiagrams'] == 0
    audit = read(WORK / 'source-coverage-audit.json')
    items = {i['id']: i for p in audit['pages'] for i in p['items']}
    runtime = (ROOT / 'src/components/agriculture/RecognitionImages.tsx').read_text()
    static_assets = {}
    for quoted, plain, path in re.findall(r"(?:'([^']+)'|\b([\w-]+)):require\('\.\./\.\./\.\./([^']+)'\)", runtime):
        static_assets[quoted or plain] = path
    assert len(static_assets) == 18
    assert all(static_assets[r['assetKey']] == r['assetPath'] for r in registry['images'])
    added_lines = {line for line in runtime.splitlines(keepends=True) if any("/" + r['assetKey'] + "-v1.webp'" in line for r in images)}
    assert len(added_lines) == 6
    assert ''.join(line for line in runtime.splitlines(keepends=True) if line not in added_lines).encode() == prior('src/components/agriculture/RecognitionImages.tsx'), 'Only six asset imports may change runtime component'
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
        no_review_blockers(review_data)
    assert len(source_ids) == 6
    recognition_inventory = read(WORK / 'recognition-inventory.json')
    previous_ri = json.loads(prior('docs/ssw-workspace/agriculture/recognition-inventory.json'))
    additions = {'originalIllustrationAssetId', 'originalIllustrationAvailable', 'sourcePhotoObjectiveComplete'}
    targets = {pid: row['id'] for row in images for pid in row['photoInventoryIds']}
    assert len(targets) == 6
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
    assert recognition_inventory['originalIllustrations']['count'] == 12
    assert recognition_inventory['recognitionReady'] is False
    no_certification(recognition_inventory)
    register = read(WORK / 'illustration-register.json')
    old_register = json.loads(prior('docs/ssw-workspace/agriculture/illustration-register.json'))
    assert register['figures'][:len(old_register['figures'])] == old_register['figures']
    assert [r['id'] for r in register['figures'][len(old_register['figures']):]] == manifest['newRecognitionImageIds']
    assert register['complete'] is False
    print(json.dumps(dict(status='PASS', baseline=BASE, newFigures=6, priorFiguresPreserved=12,
                          actualWebpHashesAndDimensions=True, editableSvgFigures=0,
                          sourceOccurrencesReferenced=len(source_ids), sourceOccurrencesClosed=0,
                          priorJapaneseLessonsUnchanged=168, priorKnowledgeUnitsUnchanged=1008,
                          priorTranslationPairsUnchanged=2016, priorWeeklyQuestionsUnchanged=388,
                          frozenDocuments=len(frozen_docs), courseComplete=False,
                          humanReviewed=False, nativeReviewed=False, domainReviewed=False, releaseReady=False)))


if __name__ == '__main__':
    main()
