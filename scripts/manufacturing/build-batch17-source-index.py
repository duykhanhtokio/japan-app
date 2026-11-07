"""Index newly detailed source-object evidence, without certifying source closure."""
from collections import Counter
from pathlib import Path
import hashlib
import json
import runpy
import sys

ROOT = Path(__file__).resolve().parents[2]
STAGE = 'docs/ssw-workspace/manufacturing/batch17/'
OUTPUT = STAGE + 'source-object-index.json'
INPUT_KEYS = {'mechanical': 'comparisonInputsSha256', 'electrical': 'inputSha256', 'surface': 'inputSnapshots'}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def read(path):
    return json.loads((ROOT / path).read_bytes())


def build_index():
    sources = {s['specialty']: s for s in read('docs/ssw-workspace/manufacturing/source-qa-report.json')['sources']}
    knowledge = {k['id']: k for k in read('docs/ssw-workspace/manufacturing/knowledge-matrix.json')['knowledge']}
    records, summaries, report_hashes = [], {}, {}
    all_ids = set()
    for specialty in ('mechanical', 'electrical', 'surface'):
        path = STAGE + specialty + '-source-review.json'
        payload = (ROOT / path).read_bytes()
        report = json.loads(payload)
        source, registered = report['source'], sources[specialty]
        document_id = 'mfg1-' + specialty + '-source'
        require(source['documentId'] == document_id and source['sha256'] == registered['sha256'],
                specialty + ': unregistered source identity')
        for flag in ('nativeReviewed', 'domainReviewed', 'releaseReady'):
            require(report[flag] is False, specialty + ': unsupported certification')
        for key in ('fullKnowledgeAtomizationComplete', 'fullSourceObjectAtomizationComplete',
                    'fullSourceSemanticReviewComplete', 'wholeCurriculumComplete'):
            require(report.get(key, False) is False, specialty + ': unsupported whole-source claim')
        for relative, expected in report[INPUT_KEYS[specialty]].items():
            require(not Path(relative).is_absolute() and '..' not in Path(relative).parts, 'Unsafe evidence path')
            compared = (ROOT / relative).read_bytes()
            if relative == 'src/data/manufacturing/source-guides.json':
                extension = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-reference-guide-extension.py'))
                compared = extension['historical_source_guides_bytes'](compared)
            require(digest(compared) == expected, specialty + ': stale comparison input ' + relative)
        lessons = {l['id']: l for l in read(f'src/data/manufacturing/{specialty}.json')['lessons']}
        pages, objects, statuses = set(), [], Counter()
        for page in report['pages']:
            physical, printed = page['pdfPage'], page['printedPage']
            require(isinstance(physical, int) and 1 <= physical <= registered['pdfPages']
                    and physical - printed == registered['printedToPhysicalOffset'], specialty + ': invalid page identity')
            require(physical not in pages and page['priorEvidenceStatus'], specialty + ': duplicate/unqualified page')
            pages.add(physical)
            require(page['objects'], specialty + ': empty page ledger')
            for obj in page['objects']:
                identifier = obj['id']
                require(identifier not in all_ids, 'Duplicate semantic object: ' + identifier)
                all_ids.add(identifier)
                require(obj['type'] and obj['summary'] and obj['coverageStatus'], 'Incomplete object: ' + identifier)
                require(obj['knowledgeIds'] and all(k in knowledge and knowledge[k]['sourceId'] == document_id
                                                   for k in obj['knowledgeIds']), 'Unknown knowledge link: ' + identifier)
                require(all(lid in lessons for lid in obj['lessonIds']), 'Unknown lesson link: ' + identifier)
                bindings = obj.get('lessonBindings', obj.get('lessonSourceHashes', {}))
                for lid, expected in bindings.items():
                    require(lid in obj['lessonIds'] and lessons[lid]['sourceHash'] == expected,
                            'Stale object lesson binding: ' + identifier)
                require(obj.get('sourceSha256', source['sha256']) == source['sha256'], 'Object source drift')
                box = obj.get('bboxNormalized')
                if box is not None:
                    require(len(box) == 4 and all(isinstance(v, (int, float)) and 0 <= v <= 1 for v in box)
                            and box[0] < box[2] and box[1] < box[3], 'Invalid approximate region: ' + identifier)
                statuses[obj['coverageStatus']] += 1
                records.append({'id': identifier, 'specialty': specialty, 'documentId': document_id,
                                'sourceSha256': source['sha256'], 'pdfPage': physical, 'printedPage': printed,
                                'type': obj['type'], 'coverageStatus': obj['coverageStatus'],
                                'knowledgeIds': obj['knowledgeIds'],
                                'lessonSourceHashes': {lid: lessons[lid]['sourceHash'] for lid in obj['lessonIds']},
                                'reportPath': path, 'priorEvidenceStatus': page['priorEvidenceStatus']})
                objects.append(identifier)
        report_hashes[path] = digest(payload)
        summaries[specialty] = {'reviewedPhysicalPages': sorted(pages), 'pageReviewOccurrences': len(pages),
                                'objectOccurrences': len(objects), 'coverageStatusCounts': dict(sorted(statuses.items()))}
    require({k: v['objectOccurrences'] for k, v in summaries.items()}
            == {'mechanical': 69, 'electrical': 30, 'surface': 42}, 'Batch17 ledger object set drift')
    return {'schemaVersion': 1, 'batch': 17, 'date': '2026-10-28', 'scopeLevel': '1',
            'sourceReviewReportSha256': report_hashes, 'specialties': summaries,
            'totalPageReviewOccurrences': sum(s['pageReviewOccurrences'] for s in summaries.values()),
            'totalDetailedObjectOccurrences': len(records), 'globallyNewPreviouslyUnseenPages': None,
            'newnessQualification': 'Granular source-to-lesson review occurrences. Mechanical/surface are rereads; electrical adds evidence relative to one earlier audit only. No global unique-new-page or complete-atomization claim.',
            'objects': records, 'fullKnowledgeAtomizationComplete': False,
            'wholeCurriculumComplete': False, 'nativeReviewed': False, 'domainReviewed': False, 'releaseReady': False}


def main():
    result = build_index()
    if sys.argv[1:] == ['--write']:
        (ROOT / OUTPUT).write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    else:
        require(not sys.argv[1:], 'Usage: build-batch17-source-index.py [--write]')
        require(read(OUTPUT) == result, 'Source-object index drift; rebuild only after reviewing evidence changes')
    print(json.dumps({'status': 'PASS', 'detailedObjectOccurrences': len(result['objects']),
                      'pageReviewOccurrences': result['totalPageReviewOccurrences'],
                      'fullKnowledgeAtomizationComplete': False}))


if __name__ == '__main__':
    main()
