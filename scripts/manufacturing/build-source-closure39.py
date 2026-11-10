"""Join six disjoint audit lanes without turning navigation links into coverage."""
from collections import Counter, defaultdict
import argparse
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / 'docs/ssw-workspace/manufacturing/source-closure-20261031'
LANES = ('mechanical', 'electrical', 'surface')
OBJECT_FILES = {'mechanical': 'extraction-candidates.json', 'electrical': 'objects.json', 'surface': 'object-candidates.json'}


def read(path):
    return json.loads(path.read_text())


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def collection(data):
    for key in ('objects', 'candidates', 'units'):
        if key in data:
            return data[key]
    raise AssertionError('No object collection')


def build():
    register = read(BASE / 'source-register.json')
    sources = {s['specialty']: s for s in register['sources']}
    question_doc = read(BASE / 'assessment/question-ledger.json')
    questions = {q['id']: q for q in question_doc['questions']}
    assert len(questions) == len(question_doc['questions']) == 1809
    metadata_edges = read(BASE / 'assessment/source-page-question-edges.json')['edges']
    taught_edges = read(BASE / 'assessment/reviewed-taught-bindings.json')['edges']
    page_questions = defaultdict(set)
    reviewed_authored = defaultdict(list)
    for edge in metadata_edges:
        assert edge['questionId'] in questions
        page_questions[(edge['sourceId'], edge['physicalPage'])].add(edge['questionId'])
    for edge in taught_edges:
        assert edge['questionId'] in questions
        reviewed_authored[edge['questionId']].append(edge)
    input_hashes = {}
    pages_out, units_out, source_summaries = [], [], []
    all_unit_ids = set()
    question_units = defaultdict(set)
    for lane in LANES:
        source = sources[lane]
        paths = [BASE / lane / 'page-index.json', BASE / lane / 'knowledge-units.json', BASE / lane / OBJECT_FILES[lane]]
        pages = read(paths[0])['pages']
        units = read(paths[1])['units']
        objects = collection(read(paths[2]))
        assert sorted(p['physicalPage'] for p in pages) == list(range(1, source['actualPages'] + 1))
        for path in paths:
            input_hashes[str(path.relative_to(ROOT))] = digest(path)
        object_by_page, unit_by_page = defaultdict(list), defaultdict(list)
        for obj in objects:
            assert 1 <= obj['physicalPage'] <= source['actualPages']
            object_by_page[obj['physicalPage']].append(obj)
        for unit in units:
            assert unit['id'] not in all_unit_ids, 'Duplicate semantic unit occurrence ID'
            all_unit_ids.add(unit['id'])
            assert unit['sourceId'] == source['sourceId']
            assert unit['sourceSha256'] == source['actualSha256']
            assert 1 <= unit['physicalPage'] <= source['actualPages']
            assert all(field in unit for field in ('status', 'lessonBindings', 'termBindings', 'assessmentBindings', 'exclusionReason', 'duplicateOf'))
            unit_by_page[unit['physicalPage']].append(unit)
            for edge in unit['assessmentBindings']:
                qid = edge.get('questionId')
                if qid:
                    assert qid in questions, 'Unknown question in unit binding: ' + qid
                    question_units[qid].add(unit['id'])
            units_out.append({'id': unit['id'], 'sourceId': unit['sourceId'], 'physicalPage': unit['physicalPage'], 'kind': unit['kind'], 'reviewState': unit['status'], 'sourceUnitFile': str(paths[1].relative_to(ROOT)), 'bindingPolicy': 'Read original binding review statuses; nonempty IDs are not semantic closure.', 'lessonBindings': unit['lessonBindings'], 'termBindings': unit['termBindings'], 'assessmentBindings': unit['assessmentBindings'], 'exclusionReason': unit['exclusionReason'], 'duplicateOf': unit['duplicateOf']})
        for page in pages:
            number = page['physicalPage']
            objs = object_by_page.get(number, [])
            bounded = unit_by_page.get(number, [])
            assert page.get('sourceSha256', source['actualSha256']) == source['actualSha256']
            pages_out.append({'id': f'mfg39-{lane}-p{number:03d}', 'specialty': lane, 'sourceId': source['sourceId'], 'sourceSha256': source['actualSha256'], 'physicalPage': number, 'printedPage': page.get('printedPage'), 'classification': page.get('classification', page.get('pageKind')), 'pageReceiptFile': str(paths[0].relative_to(ROOT)), 'lowText': page.get('lowText', page.get('lowTextPage', False)), 'extractionCandidateCount': len(objs), 'extractionCandidateKinds': dict(Counter(o['kind'] for o in objs)), 'extractionCandidateFile': str(paths[2].relative_to(ROOT)), 'boundedUnitOccurrenceIds': [u['id'] for u in bounded], 'boundedUnitOccurrenceCount': len(bounded), 'questionNavigationCandidateIds': sorted(page_questions[(source['sourceId'], number)]), 'sourceExercisePolicy': page.get('sourceExercisePolicy', 'Do not copy source exercise wording; map its underlying knowledge and explain any exclusion.'), 'exclusionReason': page.get('exclusionReason'), 'fullKnowledgeAtomizationComplete': False, 'allTechnicalContentSemanticallyMapped': False, 'nextAction': 'Review remaining source regions, split substantive concepts and qualifiers, bind exact authored paragraphs/terms/options, record exclusions and duplicates. Do not skip low-text figures/tables or close from page links.'})
        source_summaries.append({'specialty': lane, 'physicalPages': len(pages), 'pageClassification': dict(Counter(p.get('classification', p.get('pageKind')) for p in pages)), 'machineCandidateOccurrences': len(objects), 'candidateGranularity': 'Lane extraction method differs, especially electrical ruby fragments; not comparable knowledge counts.', 'boundedSemanticUnitOccurrences': len(units), 'pagesWithBoundedUnits': len(unit_by_page), 'fullKnowledgeClosurePages': 0})
    assert len(pages_out) == 574 and len({p['id'] for p in pages_out}) == 574
    for edge in metadata_edges:
        assert edge['sourcePageKey'] in {p['id'] for p in pages_out}
    question_index = [{'questionId': qid, 'bank': q['bank'], 'specialty': q['specialty'], 'sourceQuestionLedger': 'assessment/question-ledger.json', 'sourcePageMetadataOnly': True, 'boundedUnitCandidateIds': sorted(question_units.get(qid, set())), 'newAuthoredParagraphReviewEdges': reviewed_authored.get(qid, []), 'sourceUnitSemanticCoverageClosed': False, 'everyOptionSemanticallyReviewedAgainstSource': False} for qid, q in questions.items()]
    matrix = {'schemaVersion': 1, 'date': '2026-10-31', 'scope': 'manufacturing_ssw1', 'sources': source_summaries, 'pages': pages_out, 'semanticUnitIndex': units_out, 'questionIndex': question_index, 'laneInputSha256': input_hashes, 'semantics': {'pageInventoryComplete': True, 'machineCandidatesAreKnowledgeDenominator': False, 'unitOccurrenceCountIsExhaustive': False, 'questionNavigationIsSemanticEvidence': False, 'fullKnowledgeAtomizationComplete': False, 'wholeCurriculumComplete': False, 'releaseReady': False, 'humanReviewed': False, 'domainReviewed': False, 'nativeReviewed': False, 'physicalDeviceVerified': False}}
    summary = {'classifiedPhysicalPages': len(pages_out), 'sourceFilesWithVerifiedBytes': len(sources), 'sources': source_summaries, 'boundedSemanticUnitOccurrences': len(units_out), 'questionsInventoried': len(questions), 'sourcePageQuestionMetadataEdges': len(metadata_edges), 'newQuestionAuthoredParagraphReviewEdges': len(taught_edges), 'questionsWithNewAuthoredParagraphReview': len(reviewed_authored), 'sourceUnitQuestionNavigationCandidates': len(question_units), 'wholePageKnowledgeClosure': 0, 'sourceTraceabilityComplete': False, 'all574KnowledgeAtomizationComplete': False, 'releaseReady': False}
    return matrix, summary


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    matrix, summary = build()
    outputs = {'coverage-matrix.json': matrix, 'coverage-summary.json': summary}
    for name, value in outputs.items():
        raw = json.dumps(value, ensure_ascii=False, indent=2) + '\n'
        path = BASE / name
        if args.check:
            assert path.read_text() == raw, 'Stale shared matrix: ' + name
        else:
            path.write_text(raw)
    if not args.check:
        with (BASE / 'page-register.csv').open('w', newline='') as stream:
            fields = ['id', 'specialty', 'physicalPage', 'printedPage', 'classification', 'lowText', 'extractionCandidateCount', 'boundedUnitOccurrenceCount', 'fullKnowledgeAtomizationComplete', 'nextAction']
            writer = csv.DictWriter(stream, fieldnames=fields, extrasaction='ignore', lineterminator='\n')
            writer.writeheader()
            writer.writerows(matrix['pages'])
    print(json.dumps({'status': 'PASS', 'classifiedPhysicalPages': 574, 'boundedUnitOccurrences': len(matrix['semanticUnitIndex']), 'uniqueQuestions': len(matrix['questionIndex']), 'fullSourceKnowledgeClosed': False}))
