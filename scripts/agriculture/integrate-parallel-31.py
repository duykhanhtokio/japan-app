"""Add six reviewed original equipment images; preserve learner content and old art."""
import copy
import hashlib
import json
import time
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
W = ROOT / 'docs/ssw-workspace/agriculture/parallel-31'
D = ROOT / 'src/data/agriculture'


def read(p):
    return json.loads(p.read_text())


def write(p, value):
    p.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    baseline = read(W / 'baseline-file-hashes.json')
    for path, expected in baseline['files'].items():
        assert sha(ROOT / path) == expected, 'Changed baseline: ' + path
    registry = read(D / 'recognition-images.json')
    register_path = ROOT / 'docs/ssw-workspace/agriculture/illustration-register.json'
    register = read(register_path)
    ledger_path = ROOT / 'docs/ssw-workspace/agriculture/knowledge-ledger.json'
    ledger = read(ledger_path)
    knowledge = {k['id']: k for k in ledger['knowledge']}
    progress_path = ROOT / 'docs/ssw-workspace/agriculture/progress.json'
    progress = read(progress_path)
    lesson_id = 'agr-par12-management-machine-mechanisms'
    lesson = next(l for l in read(D / 'lessons.ja.json')['lessons'] if l['id'] == lesson_id)
    component = ROOT / 'src/components/agriculture/RecognitionImages.tsx'
    source = component.read_text()
    rows, provenance, mappings = [], [], []
    stems = ['manual-shoulder-sprayer', 'powered-backpack-sprayer', 'speed-sprayer',
             'portable-brush-cutter', 'walkbehind-hammer-mower', 'ride-on-mower']
    items = ['0316', '0317', '0318', '0319', '0321', '0322']
    assert len(registry['images']) == 50
    assert not any(r['assetPath'].startswith('assets/agriculture/equipment/') for r in registry['images'])
    for i, (stem, suffix) in enumerate(zip(stems, items), 1):
        path, review_path = W / f'asset-{i}.json', W / f'review-{i}.json'
        packet, review = read(path), read(review_path)
        assert review['inputMetadataSha256'] == sha(path), 'Stale independent review'
        assert not review.get('unresolvedBlockingIssues', [])
        assert not review.get('imageIterationNeeded', review.get('iterationNeeded', review.get('needsImageIteration', False)))
        asset = copy.deepcopy(packet.get('asset', packet))
        for patch in review.get('patches', review.get('exactbeforepatches', [])):
            assert asset[patch['field']] == patch['before']
            asset[patch['field']] = patch['after']
        asset_path = 'assets/agriculture/equipment/' + stem + '-v1.png'
        image_path = ROOT / asset_path
        image_sha = sha(image_path)
        assert image_sha == review['assetSha256']
        with Image.open(image_path) as im:
            assert im.format == 'PNG'
            width, height = im.size
            assert width == height == 1254
        figure_id = asset.get('id', packet.get('assetId'))
        assert figure_id and figure_id not in {r['id'] for r in registry['images']}
        kid = f'AGR-K-PAR12-MANAGEMENT-MACHINE-MECHANISMS-{i:02}'
        pid = lesson_id + f'-p{i}'
        assert kid in next(p for p in lesson['paragraphs'] if p['id'] == pid)['knowledgeIds']
        key = 'equipment-' + stem
        row = {'id': figure_id, 'kind': 'equipment_appearance_illustration', 'assetKey': key,
               'assetPath': asset_path, 'assetSha256': image_sha, 'width': width, 'height': height,
               'lessonIds': [lesson_id], 'lessonSourceHashes': {lesson_id: lesson['sourceHash']},
               'paragraphIds': [pid], 'knowledgeIds': [kid], 'scopeLevels': ['2'],
               'titleJa': asset['titleJa'], 'altJa': asset['altJa'],
               'observationJa': asset['observationJa'], 'limitJa': asset.get('limitJa', asset.get('limitsJa')),
               'allowExpandedView': True, 'photoInventoryIds': [],
               'sourceItemIds': ['AGR-A10-SAFETY-' + suffix],
               'sources': [{'documentId': 'AGR-S2', 'pdfPage': 50, 'printedPage': 48}],
               'creation': 'original_builtin_imagegen_no_pdf_image_input',
               'sourceImagesRedistributed': False, 'independentAiReviewed': True,
               'humanReviewed': False, 'nativeReviewed': False, 'domainReviewed': False,
               'operatingSafetyApproved': False, 'nativeDeviceTested': False,
               'sourcePhotoObjectiveComplete': False, 'sourceOccurrencesClosed': 0, 'releaseReady': False}
        for field in ['titleJa', 'altJa', 'observationJa', 'limitJa']:
            if isinstance(row[field], list):
                assert all(isinstance(value, str) for value in row[field])
                row[field] = ' '.join(row[field])
            assert isinstance(row[field], str) and row[field].strip()
        rows.append(row)
        register['figures'].append({'id': figure_id, 'kind': row['kind'],
            'implementation': 'src/components/agriculture/RecognitionImages.tsx',
            'assetPath': asset_path, 'assetSha256': image_sha,
            'lessonIds': [lesson_id], 'knowledgeIds': [kid], 'scopeLevels': ['2'],
            'labelsJa': [row['titleJa']], 'sources': row['sources'],
            'creation': row['creation'], 'aiReviewed': True, 'independentAiReviewed': True,
            'humanReviewed': False, 'nativeReviewed': False, 'domainReviewed': False,
            'nativeDeviceTested': False, 'notARecognitionPhotograph': True,
            'sourcePhotoObjectiveComplete': False, 'sourceOccurrencesClosed': 0})
        assert lesson_id in knowledge[kid]['lessonIds']
        assert figure_id not in knowledge[kid]['figureIds']
        knowledge[kid]['figureIds'].append(figure_id)
        mappings.append(" '" + key + "':require('../../../" + asset_path + "'),\n")
        provenance.append({'assetId': figure_id, 'authorPath': str(path.relative_to(ROOT)),
            'authorSha256': sha(path), 'reviewPath': str(review_path.relative_to(ROOT)),
            'reviewSha256': sha(review_path), 'assetPath': asset_path, 'assetSha256': image_sha,
            'metadataPatches': review.get('patches', review.get('exactbeforepatches', [])),
            'sourceOccurrenceClosures': 0})
    registry['images'].extend(rows)
    assert len(registry['images']) == 56
    registry['recognitionComplete'] = False
    registry['sourceOccurrencesClosed'] = 0
    source = source.replace('\n};\ntype RecognitionImage', '\n' + ''.join(mappings) + '};\ntype RecognitionImage', 1)
    assert all(mapping in source for mapping in mappings)
    progress['authored']['registeredRasterFigures'] = 56
    progress['authored']['recognitionIllustrations'] = 53
    progress['figureInventory']['registeredRasterFigures'] = 56
    progress['figureInventory']['equipmentAppearanceIllustrations'] = 6
    progress['figureInventory']['sourceOccurrencesClosedByFigureOnlyBatches'] = 0
    progress['latestFigureBatch'] = 'parallel-31/manifest.json'
    progress['latestBatch'] = 'parallel-31/manifest.json'
    progress['parallelWorkers'] = {'count': 6, 'status': 'six_equipment_authors_and_independent_visual_peers_finished_pending_remote_gate', 'backgroundAuthoringRunning': False}
    progress['next']['resumePriority'] = 'Preserve186lessons/2232draftpairs/421weeklyquestions/160mocks and56rasters. Six original equipment examples are integrated; appearance does not certify operations or close source occurrences. Continue inline state/part/recognition details, 1200 missing-or-partial source occurrences, baseline301 holds, five partial goals and0347 correction. Keep16forms/640mockquestions open; compare581currentquestions and frozenqueues before authoring.'
    backup = Path('/tmp/agriculture-p31-before-' + str(int(time.time())))
    backup.mkdir()
    for relative in baseline['files']:
        target = backup / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / relative, target)
    for path, value in [(D / 'recognition-images.json', registry), (register_path, register),
                        (ledger_path, ledger), (progress_path, progress)]:
        write(path, value)
    component.write_text(source)
    write(W / 'integration-provenance.json', {'schemaVersion': 1, 'images': provenance,
          'newRuntimeRows': rows, 'staticMappingLines': mappings, 'sourceOccurrenceClosures': 0})
    print(json.dumps({'newEquipmentImages': len(rows), 'totalRasterImages': 56, 'sourceOccurrencesClosed': 0}))


if __name__ == '__main__':
    main()
