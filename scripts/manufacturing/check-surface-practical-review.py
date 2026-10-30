"""Validate the bounded AI prose-review binding and independent numeric checks.

This gate checks evidence freshness and arithmetic, not source/native certification.
It never writes runtime data or upgrades a review/release flag.
"""
from decimal import Decimal as D
from hashlib import sha256
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RECEIPT = ROOT / 'docs/ssw-workspace/manufacturing/batch35-continuation/exam-review/surface-practical-review.json'

def require(value, message):
    if not value:
        raise ValueError(message)

def digest(value):
    return sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest()

def validate():
    theory = json.loads(RECEIPT.with_name('surface-theory-review.json').read_text())
    theory_raw = (ROOT / theory['sourcePath']).read_bytes()
    require(sha256(theory_raw).hexdigest() == theory['sourceFileSha256'], 'Surface theory snapshot changed')
    theory_questions = [q for e in json.loads(theory_raw)['exams'] for q in e['sections']['theory']['questions']]
    require(len(theory_questions) == len(theory['questions']) == 300, 'Surface theory scope drift')
    for question, reviewed in zip(theory_questions, theory['questions']):
        require(question['id'] == reviewed['id'] and digest(question) == reviewed['questionSha256'], 'Surface theory review binding drift')
        require(question['correctIndex'] == reviewed['answerIndex'] and len(question['optionReasonsJa']) == reviewed['rationaleCount'] == 2, 'Surface theory answer/rationale drift')
    revised = json.loads(RECEIPT.with_name('mechanical-revision-review.json').read_text())
    mechanical = json.loads((ROOT / 'src/data/manufacturing/mocks/mechanical.json').read_text())
    mechanical_index = {q['id']:q for e in mechanical['exams'] for section in e['sections'].values() for q in section['questions']}
    require(len(revised['questions']) == 2, 'Mechanical revision review scope drift')
    for reviewed in revised['questions']:
        require(digest(mechanical_index[reviewed['id']]) == reviewed['questionSha256'], 'Mechanical revised question changed')
    for report in (theory,revised):
        for flag in ('independentReviewed', 'nativeReviewed', 'domainReviewed', 'humanReviewed', 'releaseReady'):
            require(report[flag] is False, 'Unsupported review certification: ' + flag)
    electrical = json.loads(RECEIPT.with_name('electrical-practical-review.json').read_text())
    electrical_raw = (ROOT / electrical['sourcePath']).read_bytes()
    require(sha256(electrical_raw).hexdigest() == electrical['sourceFileSha256'], 'Electrical review snapshot changed')
    electrical_questions = [q for e in json.loads(electrical_raw)['exams'] for q in e['sections']['practical']['questions']]
    require(len(electrical_questions) == len(electrical['questions']) == 100, 'Electrical scope drift')
    for question, reviewed in zip(electrical_questions, electrical['questions']):
        require(question['id'] == reviewed['id'] and digest(question) == reviewed['questionSha256'], 'Electrical review binding drift')
        require(question['correctIndex'] == reviewed['answerIndex'] and len(question['optionReasonsJa']) == reviewed['rationaleCount'] == 4, 'Electrical answer/rationale drift')
    for flag in ('independentReviewed', 'nativeReviewed', 'domainReviewed', 'humanReviewed', 'releaseReady'):
        require(electrical[flag] is False, 'Unsupported electrical certification: ' + flag)
    receipt = json.loads(RECEIPT.read_text())
    raw = (ROOT / receipt['sourcePath']).read_bytes()
    require(sha256(raw).hexdigest() == receipt['sourceFileSha256'], 'Reviewed source snapshot changed')
    bank = json.loads(raw)
    questions = [q for e in bank['exams'] for q in e['sections']['practical']['questions']]
    require(len(questions) == len(receipt['questions']) == 100, 'Review scope drift')
    require(sum(len(q['optionReasonsJa']) for q in questions) == 400, 'Rationale count drift')
    for q, item in zip(questions, receipt['questions']):
        require(q['id'] == item['id'] and digest(q) == item['questionSha256'], 'Stale question review: ' + q['id'])
        require(q['correctIndex'] == item['answerIndex'] and len(q['optionReasonsJa']) == item['rationaleCount'], 'Answer/reason binding drift')
    for flag in ('independentReviewed', 'nativeReviewed', 'domainReviewed', 'humanReviewed', 'releaseReady'):
        require(receipt[flag] is False, 'Unsupported certification: ' + flag)
    indexed = {q['id']: q for q in questions}
    checks = []
    def calculation(form, item, actual, expected, selected):
        qid = f'mfg1-surface-mock-{form:02}-practical-q{item:02}'
        require(actual == expected, 'Independent calculation failed: ' + qid)
        q = indexed[qid]
        require(q['optionsJa'][q['correctIndex']] == selected, 'Calculated correct option drift: ' + qid)
        checks.append(qid)
    calculation(1, 6, D('2.0') * D('.75'), D('1.5'), '1.5g')
    calculation(1, 7, D('90') / 1000 / (D('30') / 1000), D('3'), '3Ω')
    calculation(2, 1, (D('30') - 5) * 4, D('100'), '100g')
    calculation(2, 2, D('80') / 40, D('2'), '2.0mol/L')
    calculation(3, 5, D(12) * 6 / (12 + 6), D('4'), '4Ω')
    calculation(4, 1, (D(30) - 10) / 10, D('2'), '2')
    calculation(4, 4, D(75) / 1000, D('.075'), '0.075A')
    calculation(4, 6, D('.20') * 2, D('.40'), '0.40当量/L')
    calculation(4, 8, D('6.0') / 60 / D('.25'), D('.40'), '0.40mol/L')
    calculation(5, 3, D('1.5') * 4 * 60, D(360), '360C')
    calculation(5, 4, D(10) ** (5 - 3), D(100), 'pH5側の約100倍')
    calculation(5, 7, D(24) / 8, D(3), '3A')
    calculation(5, 9, D('.100') * D('.0150') / D('.0200'), D('.0750'), '0.0750mol/L')
    calculation(6, 2, (D(24) / (5 + 7) * 5, D(24) / (5 + 7) * 7), (D(10), D(14)), '5Ω側10V、7Ω側14V')
    calculation(6, 3, D('5.0') * 12, D(60), '60g')
    calculation(6, 5, D('6.0') / D('3.0'), D(2), 'BはAの2倍')
    calculation(7, 1, (D(20) / 500 * 100, D(5) / 250 * 100), (D(4), D(2)), '4%から2%')
    calculation(7, 8, D('.200') * D('.0080') / D('.0100'), D('.160'), '0.160mol/L')
    calculation(7, 10, D(10) / D('4.0'), D('2.5'), '2.5A/dm²')
    calculation(8, 6, D(10) ** (6 - 4), D(100), '約100倍')
    calculation(9, 6, D('14.6') - D('1.8'), D('12.8'), '12.8mL')
    calculation(10, 2, D('8.93') > D('8.9'), True, '銅の質量がわずかに大きい。')
    calculation(10, 3, D('37.7') * 10 ** 6, D(37700000), '37,700,000S/m')
    calculation(10, 5, D(8) / D('4.0'), D('2.0'), '2.0A/dm²')
    calculation(10, 6, (D(12) / 300 * 100, D(4) / 100 * 100), (D(4), D(4)), 'どちらも4%')
    require(len(checks) == len(set(checks)) == 25, 'Numeric scope drift')
    print('PASS: 502 actual question / 1404 rationale review bindings; 25 independent surface quantitative checks. Cumulative historical union is separate; certification flags remain false.')

if __name__ == '__main__':
    validate()
