"""Add eight original pest appearance examples; preserve prior image contracts."""
import hashlib
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[2]
W = ROOT / 'docs/ssw-workspace/agriculture'
P = W / 'session-20261027'

def read(path):
    return json.loads(path.read_text())

def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def h(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def main():
    packet = read(P / 'pest-images.json')
    review = read(P / 'pest-images-review.json')
    assert review['authorPacketSha256'] == digest(P / 'pest-images.json')
    assert review['status'] == 'complete_self_review_not_independent'
    assert not review['unresolvedBlockingIssues']
    rows = [x['runtimeCandidate'] for x in packet['images']]
    assert len(rows) == 8
    paths = ['src/data/agriculture/recognition-images.json',
             'docs/ssw-workspace/agriculture/recognition-inventory.json',
             'docs/ssw-workspace/agriculture/illustration-register.json',
             'src/components/agriculture/RecognitionImages.tsx']
    rp, ip, fp, cp = [ROOT / p for p in paths]
    reg, inv, figures = read(rp), read(ip), read(fp)
    component = cp.read_text()
    assert len(reg['images']) == 42
    assert not {x['id'] for x in rows} & {x['id'] for x in reg['images']}
    before = dict(files={p: digest(ROOT / p) for p in paths},
                  registryImages={x['id']: h(x) for x in reg['images']},
                  oldAssetHashes={x['assetPath']: digest(ROOT / x['assetPath']) for x in reg['images']},
                  inventoryEntries={x['id']: h(x) for x in inv['entries']},
                  figures={x['id']: h(x) for x in figures['figures']})
    backup = ROOT.parent / 'pest-backups-20261027'
    for p in paths:
        target = backup / p
        target.parent.mkdir(parents=True, exist_ok=True)
        assert not target.exists()
        shutil.copy2(ROOT / p, target)
    lessons = {x['id']: x for x in read(ROOT / 'src/data/agriculture/lessons.ja.json')['lessons']}
    changed_entries = set()
    for row in rows:
        assert digest(ROOT / row['assetPath']) == row['assetSha256']
        assert row['sourceOccurrencesClosed'] == 0 and row['sourcePhotoObjectiveComplete'] is False
        for lid in row['lessonIds']:
            assert row['lessonSourceHashes'][lid] == lessons[lid]['sourceHash']
        for eid in row['photoInventoryIds']:
            e = next(x for x in inv['entries'] if x['id'] == eid)
            assert e.get('originalIllustrationAvailable') is not True
            e.update(originalIllustrationAssetId=row['id'], originalIllustrationAvailable=True,
                     sourcePhotoObjectiveComplete=False)
            changed_entries.add(eid)
        figures['figures'].append(dict(id=row['id'], kind=row['kind'],
            implementation='src/components/agriculture/RecognitionImages.tsx',
            assetPath=row['assetPath'], assetSha256=row['assetSha256'], lessonIds=row['lessonIds'],
            labelsJa=[row['titleJa']], creation=row['creation'], aiReviewed=True,
            independentAiReviewed=False, humanReviewed=False, nativeReviewed=False,
            domainReviewed=False, nativeDeviceTested=False, notARecognitionPhotograph=True,
            sourcePhotoObjectiveComplete=False))
        addition = " '" + row['assetKey'] + "':require('../../../" + row['assetPath'] + "'),\n"
        assert row['assetKey'] not in component
        assert component.count('\n};\ntype RecognitionImage=') == 1
        component = component.replace('\n};\ntype RecognitionImage=', '\n' + addition + '};\ntype RecognitionImage=', 1)
    reg['images'].extend(rows)
    inv['originalIllustrations']['count'] = sum(x.get('originalIllustrationAvailable') is True for x in inv['entries'])
    assert inv['originalIllustrations']['count'] == 48
    inv['originalIllustrations']['status'] = 'forty_eight_end_caption_rows_have_original_illustration_links_not_full_recognition_certification'
    for old in reg['images'][:42]:
        assert h(old) == before['registryImages'][old['id']]
        assert digest(ROOT / old['assetPath']) == before['oldAssetHashes'][old['assetPath']]
    for e in inv['entries']:
        if e['id'] not in changed_entries:
            assert h(e) == before['inventoryEntries'][e['id']]
    for f in figures['figures'][:-8]:
        assert h(f) == before['figures'][f['id']]
    write(rp, reg)
    write(ip, inv)
    write(fp, figures)
    cp.write_text(component)
    manifest = dict(schemaVersion=1, status='integrated_candidate_pending_scoped_browser_qa',
        newRecognitionImageIds=[x['id'] for x in rows], newRasterFigures=8, totalRasterFigures=50,
        sourcePhotoCaptionRowsWithIllustrations=48, historicalCaptionRowsTotal=48,
        fullInlineFigureInventoryComplete=False, sourceOccurrencesClosed=0, newQuestions=0,
        preservedPriorImageCount=42, baseline=before, changedInventoryEntryIds=sorted(changed_entries),
        selfReviewed=True, independentAiReviewed=False, humanReviewed=False,
        nativeReviewed=False, domainReviewed=False, releaseReady=False)
    write(P / 'pest-integration-manifest.json', manifest)
    print(json.dumps(dict(newImages=8, totalImages=50, historicalCaptionRowsLinked=48, sourceObjectivesClosed=0)))

if __name__ == '__main__':
    main()
