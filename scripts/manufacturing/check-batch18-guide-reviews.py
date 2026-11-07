"""Require independent review receipts for all three guides and 36 targets."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[2]
STAGE = 'docs/ssw-workspace/manufacturing/batch18/'
LOCALES = {'en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(value):
    return hashlib.sha256(value).hexdigest()


def object_digest(value):
    return digest(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode())


def validate(approval=None):
    reviewed, receipts, fields = {}, {}, 0
    for specialty in ('mechanical', 'electrical', 'surface'):
        report_path = STAGE + 'review/' + specialty + '-independent.json'
        report_bytes = (ROOT / report_path).read_bytes()
        report = json.loads(report_bytes)
        receipts[report_path] = digest(report_bytes)
        for flag in ('nativeReviewed', 'domainReviewed', 'humanReviewed', 'releaseReady'):
            require(report[flag] is False, 'Unsupported independent guide review claim: ' + flag)
        if specialty == 'surface':
            require(report['independentAIReviewed'] is True
                    and report['counts']['unresolvedRequiredRepairs'] == 0, 'Surface review incomplete')
            source = report['inputSnapshots']['japanese']
            guide_path, guide_sha, guide_source = source['path'], source['sha256'], source['sourceHash']
            target_records = report['inputSnapshots']['targetPayloads']
            fields += report['counts']['totalPairedSemanticFields']
        else:
            require(report['independentAiCompared'] is True and report['approvedForScopedIntegration'] is True
                    and not report['unresolvedRequiredFindings'], specialty + ' review incomplete')
            guide_path, guide_sha, guide_source = report['guidePath'], report['guideFileSha256'], report['guideSourceHash']
            rows = report['targetPayloads']
            target_records = {r['locale']: r for r in rows}
            require(len(target_records) == len(rows), 'Duplicate reviewed target locale')
            fields += report['counts']['translatedProseFieldPairsCompared']
        require(guide_path == STAGE + specialty + '/guide.ja.json', 'Unexpected reviewed Japanese guide path')
        payload = (ROOT / guide_path).read_bytes()
        guide = json.loads(payload)
        require(digest(payload) == guide_sha and guide['sourceHash'] == guide_source
                == object_digest({k: v for k, v in guide.items() if k != 'sourceHash'}),
                'Independent Japanese guide snapshot drift: ' + specialty)
        reviewed[guide_path] = guide_sha
        require(set(target_records) == LOCALES, 'Incomplete reviewed guide locales: ' + specialty)
        for locale, row in target_records.items():
            path = STAGE + specialty + '/' + locale + '.json'
            require(row['path'] == path, 'Unexpected reviewed target path')
            payload = (ROOT / path).read_bytes()
            file_sha = row.get('sha256', row.get('payloadSha256'))
            require(digest(payload) == file_sha, 'Independent target file drift: ' + path)
            package = json.loads(payload)
            require(package['locale'] == locale and set(package['lessons']) == {guide['id']},
                    'Reviewed guide target identity drift')
            target = package['lessons'][guide['id']]
            require(row['sourceHash'] == target['sourceHash'] == guide_source
                    and row['translationObjectSha256'] == object_digest(target), 'Independent target object drift')
            reviewed[path] = file_sha
    require(len(reviewed) == 39, 'Expected 39 independently compared input files')
    if approval is not None:
        require(approval['inputs'] == approval['reviewedInputSha256'] == reviewed,
                'Approved guide input set is not the independently reviewed snapshot')
        declared = {r['path']: r['sha256'] for r in approval['reviews']}
        require(len(declared) == len(approval['reviews']) == 3 and declared == receipts,
                'Approved independent receipt set drift')
    return {'status': 'PASS', 'reviewedInputSha256': reviewed, 'reviewReceiptSha256': receipts,
            'guides': 3, 'targetPairs': 36, 'translatedProseFieldPairsCompared': fields,
            'nativeReviewed': False, 'domainReviewed': False}


if __name__ == '__main__':
    result = validate()
    print(json.dumps({k: v for k, v in result.items() if k not in ('reviewedInputSha256', 'reviewReceiptSha256')}))
