"""Lossless evidence transport; run only while all six workers are frozen."""
import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'docs/localization-workspace/region-review/kanto-20261103'

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

def atomic(path, raw):
    temporary = path.with_name(path.name + '.transport.tmp')
    temporary.write_bytes(raw)
    os.replace(temporary, path)

def main():
    mode = argparse.ArgumentParser()
    mode.add_argument('mode', choices=['pack', 'expand'])
    action = mode.parse_args().mode
    changes = []
    for worker in range(1, 7):
        path = BASE / f'worker-{worker}.json'
        before = path.read_bytes()
        data = json.loads(before)
        if action == 'pack':
            if data.get('schemaVersion') == 'context-review-archive-v1':
                continue
            zipped = gzip.compress(before, compresslevel=6, mtime=0)
            assert gzip.decompress(zipped) == before
            archive = BASE / f'worker-{worker}.evidence.json.gz'
            atomic(archive, zipped)
            wrapper = {'schemaVersion': 'context-review-archive-v1', 'worker': worker,
                       'region': 'kanto', 'nativeReviewed': False, 'semanticCrossReview': False,
                       'archivePath': str(archive.relative_to(ROOT)), 'archiveSha256': digest(zipped),
                       'uncompressedSha256': digest(before), 'reviewedScenarios': len(data['scenarios'])}
            after = (json.dumps(wrapper, indent=2) + '\n').encode()
            atomic(path, after)
        else:
            if data.get('schemaVersion') != 'context-review-archive-v1':
                continue
            zipped = (ROOT / data['archivePath']).read_bytes()
            assert digest(zipped) == data['archiveSha256']
            after = gzip.decompress(zipped)
            assert digest(after) == data['uncompressedSha256']
            atomic(path, after)
        changes.append({'worker': worker, 'beforeSha256': digest(before), 'afterSha256': digest(after),
                        'beforeBytes': len(before), 'afterBytes': len(after), 'roundTripBytesEqual': True})
    if action == 'pack':
        atomic(BASE / 'receipt-transport-normalization.json',
               (json.dumps({'encoding': 'context-review-archive-v1', 'files': changes,
                            'allRoundTripEqual': True}, indent=2) + '\n').encode())
    print(json.dumps({'mode': action, 'files': len(changes), 'allRoundTripEqual': True}))

if __name__ == '__main__':
    main()
