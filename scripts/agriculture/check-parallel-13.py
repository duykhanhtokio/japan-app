"""Read-only batch13 recognition-asset and frozen-curriculum validation.

Run from any directory. Requires the completed registry and batch13 manifest;
never writes artifacts, updates hashes, or changes historical coverage records.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/agriculture'
WORK = ROOT / 'docs/ssw-workspace/agriculture'
BASE = 'e20fb085'
REGISTRY = DATA / 'recognition-images.json'
FALSE_FLAGS = ('humanReviewed', 'nativeReviewed', 'domainReviewed', 'releaseReady')


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def read(path):
    require(path.is_file(), f'Required record not ready: {path.relative_to(ROOT)}')
    return json.loads(path.read_text(encoding='utf-8'))


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def historical_bytes(path):
    return git('show', f'{BASE}:{path}')


def same_bytes(path):
    current = ROOT / path
    require(current.is_file(), f'Frozen file missing: {path}')
    require(current.read_bytes() == historical_bytes(path), f'Frozen bytes changed: {path}')


def false_flags(value, location):
    if isinstance(value, dict):
        for key, item in value.items():
            if key in FALSE_FLAGS or key in ('recognitionReady', 'sourceImagesRedistributed', 'sourceImageRedistributed', 'sourcePhotoObjectiveComplete', 'courseComplete', 'recognitionComplete'):
                require(item is False, f'{location}/{key} must remain false')
            false_flags(item, f'{location}/{key}')
    elif isinstance(value, list):
        for index, item in enumerate(value):
            false_flags(item, f'{location}/{index}')


def webp_dimensions(data):
    """Read actual WebP canvas dimensions without imaging dependencies."""
    require(len(data) >= 20 and data[:4] == b'RIFF' and data[8:12] == b'WEBP', 'Asset is not a RIFF WebP')
    require(int.from_bytes(data[4:8], 'little') + 8 == len(data), 'WebP RIFF size mismatch')
    offset = 12
    while offset + 8 <= len(data):
        tag = data[offset:offset + 4]
        size = int.from_bytes(data[offset + 4:offset + 8], 'little')
        body = data[offset + 8:offset + 8 + size]
        require(len(body) == size, 'Truncated WebP chunk')
        if tag == b'VP8X':
            require(len(body) >= 10, 'Truncated VP8X')
            return 1 + int.from_bytes(body[4:7], 'little'), 1 + int.from_bytes(body[7:10], 'little')
        if tag == b'VP8L':
            require(len(body) >= 5 and body[0] == 0x2f, 'Invalid VP8L header')
            bits = int.from_bytes(body[1:5], 'little')
            return (bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1
        if tag == b'VP8 ':
            require(len(body) >= 10 and body[3:6] == b'\x9d\x01\x2a', 'Invalid VP8 frame header')
            return int.from_bytes(body[6:8], 'little') & 0x3fff, int.from_bytes(body[8:10], 'little') & 0x3fff
        offset += 8 + size + (size % 2)
    raise AssertionError('No supported WebP image/canvas chunk')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--manifest', default='docs/ssw-workspace/agriculture/parallel-13-manifest.json')
    args = parser.parse_args()
    git('rev-parse', '--verify', f'{BASE}^{{commit}}')
    baseline_paths = git('ls-tree', '-r', '--name-only', BASE, 'src/data/agriculture').decode().splitlines()
    frozen_data = [path for path in baseline_paths if path.endswith('.json')]
    require('src/data/agriculture/recognition-images.json' not in frozen_data, 'Unexpected registry at baseline')
    for path in frozen_data:
        same_bytes(path)
    current_data = {str(path.relative_to(ROOT)) for path in DATA.rglob('*.json')}
    require(current_data - {'src/data/agriculture/recognition-images.json'} == set(frozen_data), 'Unexpected added/removed Agriculture JSON outside recognition registry')
    frozen_docs = [
        'knowledge-ledger.json', 'source-coverage-audit.json', 'source-gap-backlog.json',
        'source-gap-reconciliation-11.json', 'source-gap-reconciliation-12.json',
    ]
    for name in frozen_docs:
        same_bytes('docs/ssw-workspace/agriculture/' + name)
    lessons = read(DATA / 'lessons.ja.json')
    require(lessons.get('courseComplete') is False, 'Whole course must remain incomplete')
    by_lesson = {lesson['id']: lesson for lesson in lessons['lessons']}
    require(len(by_lesson) == len(lessons['lessons']) == 168, 'Expected 168 unchanged Japanese lessons')
    ledger = read(WORK / 'knowledge-ledger.json')
    require(len(ledger['knowledge']) == 1008, 'Expected 1008 unchanged knowledge units')
    translation_index = read(DATA / 'translations.json')
    pairs = sum(len(read(DATA / path)) for path in translation_index['shards'].values())
    require(pairs == 2016, 'Expected 2016 unchanged translation pairs')
    exams = read(DATA / 'weekly-checks.ja.json')['exams']
    require(sum(len(exam['questions']) for exam in exams) == 388, 'Expected 388 unchanged weekly questions')
    course = read(DATA / 'course-manifest.json')
    for key in ('complete', 'imagesComplete', 'releaseReady'):
        require(course.get(key) is False, f'Course {key} must remain false')
    inventory = read(WORK / 'recognition-inventory.json')
    prior_inventory = json.loads(historical_bytes('docs/ssw-workspace/agriculture/recognition-inventory.json'))
    require(len(inventory['entries']) == len(prior_inventory['entries']), 'RI historical row count changed')
    additions = ('originalIllustrationAssetId', 'originalIllustrationAvailable', 'sourcePhotoObjectiveComplete')
    appended_ri = {}
    for old, current in zip(prior_inventory['entries'], inventory['entries']):
        require({key: value for key, value in current.items() if key not in additions} == old, f'RI historical values changed: {old["id"]}')
        extra = set(current) - set(old)
        require(extra in (set(), set(additions)), f'RI partial/unapproved appended fields: {old["id"]}')
        if extra:
            require(current['originalIllustrationAvailable'] is True and current['sourcePhotoObjectiveComplete'] is False, f'RI original illustration availability/photo goal flags invalid: {old["id"]}')
            appended_ri[current['id']] = current['originalIllustrationAssetId']
    require(len(appended_ri) == 6, 'Expected exactly six RI illustration append bindings')
    require({key: value for key, value in inventory.items() if key != 'originalIllustrations' and key != 'entries'} == {key: value for key, value in prior_inventory.items() if key != 'entries'}, 'RI historical top-level values changed')
    require('originalIllustrations' in inventory, 'RI originalIllustrations summary required')
    false_flags(inventory, 'recognition-inventory')
    ri = {entry['id']: entry for entry in inventory['entries']}
    register = read(WORK / 'illustration-register.json')
    prior_register = json.loads(historical_bytes('docs/ssw-workspace/agriculture/illustration-register.json'))
    old_figures = prior_register['figures']
    require(register['figures'][:len(old_figures)] == old_figures and len(register['figures']) == len(old_figures) + 6, 'Prior illustration figures must remain unchanged with exactly six appended')
    appended_figures = register['figures'][len(old_figures):]
    for figure in appended_figures:
        require(figure.get('kind') == 'crop_recognition_illustration' and figure.get('notARecognitionPhotograph') is True, 'New figure kind/photo disclaimer invalid')
        for flag in ('humanReviewed', 'nativeReviewed', 'domainReviewed'):
            require(figure.get(flag) is False, f'Figure {flag} must remain false')
    require(register.get('complete') is False, 'Illustration register must remain incomplete')
    require(inventory['recognitionReady'] is False, 'Inventory recognitionReady must remain false')
    source_inventory = read(WORK / 'source-inventory.json')
    pages = {(doc['id'], page['pdfPage']): page['printedPage'] for doc in source_inventory['documents'] for page in doc['pages']}
    registry = read(REGISTRY)
    require(registry.get('schemaVersion') == 1, 'Registry schemaVersion must be 1')
    images = registry.get('images')
    require(isinstance(images, list) and len(images) == 6, 'Expected six recognition image records')
    for key in FALSE_FLAGS:
        require(registry.get(key) is False, f'Registry {key} must explicitly remain false')
    require(registry.get('recognitionComplete') is False and registry.get('sourceOccurrencesClosed') == 0, 'Registry must preserve incomplete recognition and zero source occurrence closure')
    false_flags(registry, 'registry')
    component = ROOT / 'src/components/agriculture/RecognitionImages.tsx'
    asset_imports = re.findall(r"(?m)^\s*(?:'([^']+)'|([A-Za-z_][\w-]*))\s*:\s*require\('([^']+)'\)", component.read_text())
    runtime_assets = {(quoted or plain): (component.parent / path).resolve() for quoted, plain, path in asset_imports}
    require(len(asset_imports) == len(runtime_assets) == 6, 'Expected exactly six unique static runtime image imports')
    seen = {key: set() for key in ('id', 'assetKey', 'assetPath', 'assetSha256')}
    bindings = set()
    for entry in images:
        location = entry.get('id', '<missing id>')
        for key in seen:
            value = entry.get(key)
            require(isinstance(value, str) and value.strip(), f'{location}: missing {key}')
            require(value not in seen[key], f'{location}: duplicate {key}')
            seen[key].add(value)
        require(re.fullmatch(r'[0-9a-f]{64}', entry['assetSha256']) is not None, f'{location}: invalid asset hash')
        asset = (ROOT / entry['assetPath']).resolve()
        require(asset.is_relative_to(ROOT) and asset.suffix.lower() == '.webp' and asset.is_file(), f'{location}: assetPath must name a repository WebP')
        require(runtime_assets.get(entry['assetKey']) == asset, f'{location}: runtime assetKey/path does not match registry')
        payload = asset.read_bytes()
        require(digest(payload) == entry['assetSha256'], f'{location}: actual asset hash differs')
        dimensions = webp_dimensions(payload)
        require(all(isinstance(entry.get(key), int) and not isinstance(entry[key], bool) and entry[key] > 0 for key in ('width', 'height')), f'{location}: positive dimensions required')
        require(dimensions == (entry['width'], entry['height']), f'{location}: actual dimensions differ')
        for key in ('titleJa', 'altJa', 'observationJa', 'limitJa'):
            require(isinstance(entry.get(key), str) and entry[key].strip(), f'{location}: missing {key}')
        lids = entry.get('lessonIds')
        require(isinstance(lids, list) and lids and len(set(lids)) == len(lids), f'{location}: valid lessonIds required')
        hashes = entry.get('lessonSourceHashes')
        require(isinstance(hashes, dict) and set(hashes) == set(lids), f'{location}: lessonSourceHashes must exactly map lessonIds')
        for lid in lids:
            require(lid in by_lesson and hashes[lid] == by_lesson[lid]['sourceHash'], f'{location}: stale/invalid lesson source binding {lid}')
        photo_ids = entry.get('photoInventoryIds')
        require(isinstance(photo_ids, list) and photo_ids and len(set(photo_ids)) == len(photo_ids), f'{location}: photoInventoryIds required')
        for photo_id in photo_ids:
            require(photo_id in ri, f'{location}: unknown RI binding {photo_id}')
            require(photo_id not in bindings, f'{location}: RI entry bound to multiple images {photo_id}')
            bindings.add(photo_id)
            require(appended_ri.get(photo_id) == entry['id'], f'{location}: RI appended asset binding differs')
            require(set(lids) & set(ri[photo_id]['lessonIds']), f'{location}: RI/lesson binding has no overlap {photo_id}')
        refs = entry.get('sources', [entry['source']] if 'source' in entry else [])
        require(isinstance(refs, list) and refs, f'{location}: source reference required')
        for ref in refs:
            require((ref.get('documentId'), ref.get('pdfPage')) in pages and pages[(ref['documentId'], ref['pdfPage'])] == ref.get('printedPage'), f'{location}: invalid source page')
        ref_keys = {(ref['documentId'], ref['pdfPage']) for ref in refs}
        for photo_id in photo_ids:
            source = ri[photo_id]['source']
            require((source['documentId'], source['pdfPage']) in ref_keys, f'{location}: RI source page absent from asset references')
    require({figure['id'] for figure in appended_figures} == seen['id'], 'Appended figure IDs must exactly match six registry image IDs')
    require(set(appended_ri) == bindings, 'RI appended binding set must exactly match registry')
    manifest_path = (ROOT / args.manifest).resolve()
    require(manifest_path.is_relative_to(ROOT), 'Manifest must be inside repository')
    manifest = read(manifest_path)
    false_flags(manifest, 'manifest')
    for key in FALSE_FLAGS:
        require(manifest.get(key) is False, f'Manifest {key} must explicitly remain false')
    require(manifest.get('sourceOccurrencesClosed') == 0, 'New illustrations must not close historical source occurrences')
    require(manifest.get('courseComplete') is False, 'Manifest must preserve incomplete curriculum')
    require(manifest.get('recognitionComplete') is False, 'Manifest must not certify complete recognition coverage')
    require(set(manifest.get('imageIds', [])) == seen['id'], 'Manifest imageIds differ from registry')
    require(set(manifest.get('lessonIds', [])) == {lid for image in images for lid in image['lessonIds']}, 'Manifest lessonIds differ from registry')
    require(manifest.get('newRecognitionIllustrations') == 6, 'Manifest illustration count must be six')
    for key in ('newJapaneseLessons', 'newTranslationPairs', 'newWeeklyQuestions', 'newMockQuestions'):
        require(manifest.get(key) == 0, f'Manifest {key} must be zero')
    review_evidence = manifest.get('reviewEvidence')
    require(isinstance(review_evidence, list) and len(review_evidence) == 3 and len({record['path'] for record in review_evidence}) == 3, 'Three distinct independent review evidence records required')
    for record in review_evidence:
        review_path = (ROOT / record['path']).resolve()
        require(review_path.is_relative_to(ROOT) and review_path.is_file(), 'Review evidence path invalid')
        require(digest(review_path.read_bytes()) == record['sha256'], f'Review evidence hash differs: {record["path"]}')
        require(read(review_path).get('status') == 'complete', f'Review not complete: {record["path"]}')
    print(json.dumps(dict(status='PASS',baseline=BASE,recognitionImages=6,photoInventoryBindings=len(bindings),actualWebpHashesAndDimensionsChecked=True,frozenDataJsonFiles=len(frozen_data),frozenDocumentationFiles=len(frozen_docs),priorJapaneseLessonsUnchanged=168,priorKnowledgeUnitsUnchanged=1008,priorTranslationPairsUnchanged=pairs,priorWeeklyQuestionsUnchanged=388,sourceOccurrencesClosed=0,humanReviewed=False,nativeReviewed=False,domainReviewed=False,releaseReady=False)))


if __name__ == '__main__':
    try:
        main()
    except (AssertionError, KeyError, ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
