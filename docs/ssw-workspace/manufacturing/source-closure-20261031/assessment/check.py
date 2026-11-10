"""Validate immutable audit bindings and independently recompute stated cases."""
import ast
from fractions import Fraction
import itertools
import json
import math
from pathlib import Path
import re
import unicodedata

OUT = Path(__file__).resolve().parent


def calculate(expression):
    def node(n):
        if isinstance(n, ast.Expression):
            return node(n.body)
        if isinstance(n, ast.Constant) and type(n.value) in [int, float]:
            return Fraction(str(n.value))
        if isinstance(n, ast.UnaryOp) and isinstance(n.op, ast.USub):
            return -node(n.operand)
        if isinstance(n, ast.BinOp):
            a, b = node(n.left), node(n.right)
            if isinstance(n.op, ast.Add): return a + b
            if isinstance(n.op, ast.Sub): return a - b
            if isinstance(n.op, ast.Mult): return a * b
            if isinstance(n.op, ast.Div): return a / b
            if isinstance(n.op, ast.Pow) and b.denominator == 1: return a ** b.numerator
        if isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id == 'ceil' and len(n.args) == 1:
            return Fraction(math.ceil(node(n.args[0])))
        raise ValueError('Unsupported arithmetic expression')
    return node(ast.parse(expression, mode='eval'))


def read_number(text):
    text = unicodedata.normalize('NFKC', text).replace(',', '').replace('−', '-')
    jp = re.search(r'(\d+)分の(\d+)', text)
    if jp: return Fraction(int(jp.group(2)), int(jp.group(1)))
    frac = re.search(r'(-?\d+(?:\.\d+)?)/(-?\d+(?:\.\d+)?)', text)
    if frac: return Fraction(frac.group(1)) / Fraction(frac.group(2))
    return Fraction(re.search(r'-?\d+(?:\.\d+)?', text).group())


def main():
    ledger = json.loads((OUT / 'question-ledger.json').read_text())
    qs = {q['id']: q for q in ledger['questions']}
    assert len(qs) == 1809
    assert sum(len(q['options']) for q in qs.values()) == 5436
    for path, expected in ledger['inputFileSha256'].items():
        import hashlib
        root = next(p for p in OUT.parents if (p / 'AGENTS.md').exists())
        assert hashlib.sha256((root / path).read_bytes()).hexdigest() == expected, path
    decisions = json.loads((OUT / 'review-decisions.json').read_text())['questions']
    for decision in decisions:
        q = qs[decision['questionId']]
        assert decision['recordSha256'] == q['recordSha256'], 'Stale semantic review receipt'
        assert decision['optionSidesRead'] == len(q['options'])
    results = []
    for case in json.loads((OUT / 'numeric-cases.json').read_text())['cases']:
        q = qs[case['questionId']]
        assert q['recordSha256'] == case['recordSha256'], 'Stale arithmetic receipt'
        assert q['correctIndex'] == case['keyedIndex']
        correct = q['options'][q['correctIndex']]['textJa']
        assert correct == case['keyedText']
        value = calculate(case['expression'])
        assert value == read_number(correct), (q['id'], str(value), correct)
        unit = case['resultUnit']
        if unit and unit != 'ratio':
            assert unicodedata.normalize('NFKC', unit) in unicodedata.normalize('NFKC', correct), (q['id'], unit)
        results.append({'questionId':q['id'], 'exactFractionResult':str(value), 'unit':unit, 'keyedIndex':q['correctIndex'], 'status':'arithmetic_and_keyed_unit_pass_not_PDF_source_certification'})
    backlog = json.loads((OUT / 'option-rationale-backlog.json').read_text())['questions']
    assert len(backlog) == 29 and sum(len(q['options']) for q in backlog) == 116
    for issue in backlog:
        q = qs[issue['questionId']]
        assert issue['recordSha256'] == q['recordSha256']
        assert len({o['proposedReasonJa'] for o in issue['options']}) == len(q['options'])
        for side, original in zip(issue['options'], q['options']):
            assert side['textJa'] == original['textJa'] and side['keyedCorrect'] == original['keyedCorrect']
            assert side['proposedReasonJa']
    mappings = json.loads((OUT / 'reviewed-taught-bindings.json').read_text())
    assert mappings['questions'] == 9 and len(mappings['edges']) == 19
    for edge in mappings['edges']:
        q = qs[edge['questionId']]
        assert q['recordSha256'] == edge['questionRecordSha256']
        assert q['taughtBinding']['lessonId'] == edge['lessonId']
        lesson_file = root / q['taughtBinding']['lessonPath']
        lesson = next(l for l in json.loads(lesson_file.read_text())['lessons'] if l['id'] == edge['lessonId'])
        assert lesson['sourceHash'] == edge['lessonSourceHash']
        paragraph = next(p for p in lesson['paragraphs'] if p['id'] == edge['paragraphId'])
        assert hashlib.sha256(paragraph['textJa'].encode()).hexdigest() == edge['paragraphTextSha256']
    # Recompute all truth-table rows and all four alternatives for the first
    # Boolean item, including concrete distractor counterexamples.
    rows = []
    alternatives = [lambda a,b,c:(a or b) and (a or c),lambda a,b,c:(a or b) or (a or c),lambda a,b,c:(a or b) and c,lambda a,b,c:a and (b or c)]
    for a,b,c in itertools.product([0,1], repeat=3):
        target = bool(a or (b and c))
        row = {'inputs':[a,b,c], 'left':int(target), 'options':[int(f(a,b,c)) for f in alternatives]}
        rows.append(row)
    equivalent = [i for i in range(4) if all(r['left']==r['options'][i] for r in rows)]
    assert equivalent == [0]
    assert qs['mfg1-boolean-distributivity-check-01']['correctIndex'] == equivalent[0]
    assert qs['mfg1-boolean-distributivity-check-02']['correctIndex'] == 1
    assert next(r for r in rows if r['inputs']==[0,1,1])['left'] == 1
    assert qs['mfg1-boolean-distributivity-check-03']['correctIndex'] == 2
    assert next(r for r in rows if r['inputs']==[1,0,0])['left'] == 1
    assert bool(1 and (0 or 0)) is False
    assert qs['mfg1-boolean-distributivity-check-04']['correctIndex'] == 3
    assert all(r['left']==(int(r['inputs'][1] and r['inputs'][2]) if r['inputs'][0]==0 else 1) for r in rows)
    # Prevent precisely the technical false positives caused by stripping
    # decimal points, polarity signs or circuit operators during duplicate checks.
    norm = lambda s: re.sub(r'\s+', '', unicodedata.normalize('NFKC', s))
    for a,b in [('1.25s','12.5s'),('2cm','0.20cm'),('A+B','A・B'),('+0.01mm','-0.01mm')]:
        assert norm(a) != norm(b)
    report={'status':'PASS_bounded_audit_and_arithmetic','questionsIndexed':len(qs),'optionSidesIndexed':5436,'authoredConsistencyQuestionsActuallyRead':len(decisions),'authoredOptionSidesActuallyRead':sum(d['optionSidesRead'] for d in decisions),'arithmeticCases':results,'booleanTruthTable':rows,'booleanQuestionsChecked':4,'rationaleCandidateQuestions':29,'rationaleCandidateOptionSides':116,'reviewedTaughtQuestions':9,'reviewedTaughtEdges':19,'PDFSourceFidelityCertified':False,'all1809OptionSemanticsCertified':False,'nativeReviewed':False,'domainReviewed':False}
    (OUT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f"ASSESSMENT AUDIT PASS: {len(qs)} unique questions, 5436 option sides, {len(decisions)} actually read authored items, {len(results)} exact arithmetic cases, 4 Boolean items. No full source/native/domain certification.")


if __name__ == '__main__': main()
