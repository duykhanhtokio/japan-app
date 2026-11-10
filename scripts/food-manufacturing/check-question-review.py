"""Validate per-question review receipts against current canonical authoring data.

This checks evidence integrity, not semantic correctness or human approval.
"""
from pathlib import Path
import hashlib
import json
import copy

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/food-manufacturing'
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'


def read(path):
    return json.loads(path.read_text())


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                    separators=(',', ':')).encode()).hexdigest()


def validate():
    exams = read(DATA / 'exams.ja.json')['exams']
    for path in sorted((DATA / 'authoring-20261029').glob('part*.json')):
        exams += read(path).get('exams', [])
    questions = {q['id']: q for exam in exams for q in exam['questions']}
    assert len(questions) == sum(len(e['questions']) for e in exams) == 848
    audit = read(AUDIT / 'question-audit.json')
    items = {item['questionId']: item for item in audit['items']}
    assert set(items) == set(questions)
    receipts = {}
    fields = {'promptJa', 'optionsJa[0..3]', 'answerIndex', 'explanationJa',
              'optionExplanationsJa[0..3]'}
    for path in sorted(AUDIT.glob('question-semantic[0-9]*.json')):
        for receipt in read(path)['reviews']:
            qid = receipt['questionId']
            assert qid not in receipts, f'Duplicate review receipt: {qid}'
            receipts[qid] = receipt
            assert fields <= set(receipt['readFields']), f'Incomplete review fields: {qid}'
            assert receipt['contentSha256'] == digest(questions[qid]), f'Stale review: {qid}'
            assert receipt['sourceRefs'] == questions[qid]['sourceRefs'], f'Stale source: {qid}'
            assert receipt['humanReviewed'] is False and receipt['domainReviewed'] is False
            if 'originReceipt' in receipt:
                origin = receipt['originReceipt']
                original = next(r for r in read(AUDIT / origin['path'])['reviews'] if r['questionId']==qid)
                assert original['contentSha256'] == origin['contentSha256']
                reconstructed = copy.deepcopy(questions[qid])
                for correction in reversed(receipt['appliedCorrections']):
                    field = correction['field']
                    if field == 'sourceRefs':
                        assert reconstructed[field] == correction['after']
                        reconstructed[field] = correction['before']
                    elif field == 'optionExplanationsJa[2]':
                        assert reconstructed['optionExplanationsJa'][2] == correction['after']
                        reconstructed['optionExplanationsJa'][2] = correction['before']
                    else:
                        raise AssertionError('Unknown correction field: '+field)
                assert digest(reconstructed) == original['contentSha256'], f'Unreplayable correction: {qid}'
    for qid, question in questions.items():
        item = items[qid]
        assert item['contentSha256'] == digest(question), f'Stale inventory: {qid}'
        assert item['sourceRefs'] == question['sourceRefs'], f'Stale inventory source: {qid}'
        reviewed = item['stemAnswerAndAllDistractorsSourceSemanticReview'] == 'ai_scoped_rechecked_not_human_certified'
        assert reviewed == (qid in receipts), f'Unbacked review status: {qid}'
    assert audit['aiScopedSemanticallyRechecked'] == len(receipts)
    assert audit['semanticReviewRemaining'] == len(questions) - len(receipts)
    if 'aiSemanticSourceReviewComplete' in audit:
        assert audit['aiSemanticSourceReviewComplete'] == (len(receipts)==len(questions))
    assert audit['fullSemanticSourceReviewComplete'] is False
    by_exam = {exam['id']: exam for exam in exams}
    for fix in read(AUDIT / 'question-semantic33.json')['sourceReferenceCorrections']:
        assert questions[fix['questionId']]['sourceRefs'] == fix['after']
        assert by_exam[fix['examId']]['revision'] == fix['preservedExamRevision']
    return {'status': 'PASS', 'canonicalQuestions': len(questions),
            'currentAiReviewReceipts': len(receipts),
            'semanticReviewRemaining': len(questions) - len(receipts),
            'humanCertification': False, 'domainCertification': False}


if __name__ == '__main__':
    print(json.dumps(validate()))
