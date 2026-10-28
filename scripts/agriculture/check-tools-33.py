"""Verify six original PNGs and additive image-only integration."""
import hashlib
import json
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
W = ROOT / 'docs/ssw-workspace/agriculture/tools-33'
BASE = 'de0e5c88f24d3aaf37aed661faadbe168cc3ea45'


def read(path):
    return json.loads((ROOT / path).read_text())


def old_bytes(path):
    return subprocess.check_output(['git', 'show', BASE + ':' + path], cwd=ROOT)


def old(path):
    return json.loads(old_bytes(path))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


proof = read('docs/ssw-workspace/agriculture/tools-33/integration-provenance.json')
registry_path = 'src/data/agriculture/recognition-images.json'
registry = read(registry_path)
previous = old(registry_path)
assert registry['images'][:56] == previous['images']
assert registry['images'][56:] == proof['newRuntimeRows']
assert len(registry['images']) == 62
assert registry['sourceOccurrencesClosed'] == 0 and registry['recognitionComplete'] is False
figures_path = 'docs/ssw-workspace/agriculture/illustration-register.json'
figures, old_figures = read(figures_path)['figures'], old(figures_path)['figures']
assert figures[:len(old_figures)] == old_figures and len(figures) == 69
assert len({r['id'] for r in figures}) == len(figures)
lesson = next(l for l in read('src/data/agriculture/lessons.ja.json')['lessons']
              if l['id'] == 'agr-safety-maintenance-tools')
ledger_path = 'docs/ssw-workspace/agriculture/knowledge-ledger.json'
ledger, previous_ledger = read(ledger_path), old(ledger_path)
assert {k: v for k, v in ledger.items() if k != 'knowledge'} == {k: v for k, v in previous_ledger.items() if k != 'knowledge'}
assert len(ledger['knowledge']) == len(previous_ledger['knowledge'])
expected_links = {}
for row in registry['images'][56:]:
    expected_links.setdefault(row['knowledgeIds'][0],[]).append(row['id'])
for old_k, k in zip(previous_ledger['knowledge'], ledger['knowledge']):
    assert {a: b for a, b in old_k.items() if a != 'figureIds'} == {a: b for a, b in k.items() if a != 'figureIds'}
    assert k['figureIds'] == old_k['figureIds'] + expected_links.get(k['id'], [])
for evidence, row in zip(proof['images'], registry['images'][56:]):
    assert sha(ROOT / evidence['authorPath']) == evidence['authorSha256']
    assert sha(ROOT / evidence['reviewPath']) == evidence['reviewSha256']
    assert sha(ROOT / row['assetPath']) == row['assetSha256'] == evidence['assetSha256']
    with Image.open(ROOT / row['assetPath']) as image:
        assert image.format == 'PNG' and image.size == (row['width'], row['height']) == (1254, 1254)
    assert row['lessonSourceHashes'][lesson['id']] == lesson['sourceHash']
    assert row['scopeLevels'] == ['1','2']
    peer=read(evidence['reviewPath'])
    assert peer['decision'].startswith('accept') and peer['author'] != peer['reviewer']
    assert evidence['paragraphSha256'] == hashlib.sha256(next(p for p in lesson['paragraphs'] if p['id']==row['paragraphIds'][0])['textJa'].encode()).hexdigest()
    assert row['sourceItemIds'] and row['sources'] == [{'documentId':'AGR-S1','pdfPage':44,'printedPage':38},{'documentId':'AGR-S2','pdfPage':60,'printedPage':58}]
    assert row['sourcePhotoObjectiveComplete'] is False and row['sourceOccurrencesClosed'] == 0
    assert row['independentAiReviewed'] is True
    assert all(row[k] is False for k in ['humanReviewed', 'nativeReviewed', 'domainReviewed', 'operatingSafetyApproved', 'nativeDeviceTested', 'releaseReady'])
    assert all(isinstance(row[k], str) and row[k].strip() for k in ['titleJa', 'altJa', 'observationJa', 'limitJa'])
    attr = subprocess.check_output(['git', 'check-attr', 'filter', '--', row['assetPath']], cwd=ROOT, text=True)
    assert attr.strip().endswith(': unset'), 'PNG must not become an LFS pointer'
component_path = 'src/components/agriculture/RecognitionImages.tsx'
component = (ROOT / component_path).read_text()
for line in proof['staticMappingLines']:
    assert component.count(line) == 1
    component = component.replace(line, '', 1)
assert component.encode() == old_bytes(component_path), 'Only six static asset mappings may change'

preserved = ['src/data/agriculture/lessons.ja.json', 'src/data/agriculture/weekly-checks.ja.json',
             'src/data/agriculture/mock-exams.ja.json', 'src/data/agriculture/course-manifest.json',
             'src/data/agriculture/translations.json', 'src/data/agriculture/index.ts',
             'src/components/agriculture/AgricultureCourse.tsx', 'src/components/agriculture/ConceptDiagrams.tsx',
             'src/services/agriculture-study-state.ts', 'src/services/kensetsu-test-state.ts',
             'docs/ssw-workspace/agriculture/source-gap-backlog.json',
             'docs/ssw-workspace/agriculture/source-gap-reconciliation-30.json']
preserved += ['src/data/agriculture/' + name for name in read('src/data/agriculture/translations.json')['shards'].values()]
for path in preserved:
    assert (ROOT / path).read_bytes() == old_bytes(path), 'Protected content changed: ' + path
print(json.dumps({'status': 'PASS', 'newEquipmentImages': 6, 'totalRasters': 62,
                  'originalRasterRowsPreserved': 56, 'totalFigureRecords': 69,
                  'protectedContentFilesPreserved': len(preserved), 'sourceOccurrencesClosed': 0,
                  'nativeReviewed': False, 'domainReviewed': False}))

freeze=read('docs/ssw-workspace/agriculture/tools-33/baseline-file-hashes.json')
for path,h in freeze['files'].items():
    if path not in freeze['allowedMutableFiles']:
        assert sha(ROOT/path)==h,'Frozen baseline changed: '+path
print('TOOLS33 frozen runtime/translation/UI inputs preserved')
