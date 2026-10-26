#!/usr/bin/env python3
"""Flag assessment numeric differences for semantic review, never automatic correction."""
import collections
import json
import pathlib
import re
import unicodedata

root = pathlib.Path(__file__).resolve().parents[2]
data = root / 'src/data/food-manufacturing'
questions = {q['id']: q for e in json.loads((data / 'exams.ja.json').read_text())['exams'] for q in e['questions']}

def numbers(text):
    normalized = ''
    for char in unicodedata.normalize('NFKC', text):
        try:
            normalized += str(unicodedata.digit(char))
        except (TypeError, ValueError):
            normalized += char
    return collections.Counter(re.findall(r'\d+(?:\.\d+)?', normalized))

flags, counts = [], {}
for path in sorted((data / 'test-translations').glob('*.json')):
    pack = json.loads(path.read_text())
    counts[path.stem] = len(pack['questions'])
    for qid, target in pack['questions'].items():
        source = questions[qid]
        pairs = [('prompt', source['promptJa'], target['prompt']),
                 ('explanation', source['explanationJa'], target['explanation'])]
        pairs += [(f'option:{i}', a, b) for i, (a, b) in enumerate(zip(source['optionsJa'], target['options']))]
        pairs += [(f'optionReason:{i}', a, b) for i, (a, b) in enumerate(zip(source['optionExplanationsJa'], target['optionExplanations']))]
        for field, ja, translated in pairs:
            a, b = numbers(ja), numbers(translated)
            if a != b:
                flags.append({'locale': path.stem, 'questionId': qid, 'field': field,
                              'sourceNumbers': dict(a), 'targetNumbers': dict(b),
                              'status': 'needs_semantic_review_not_automatic_error'})
report = {'questionCounts': counts, 'numericReviewCandidates': flags,
          'meaning': 'Unicode digits normalized. Worded numbers may be correct; each candidate requires semantic review.'}
output = root / 'docs/ssw-workspace/food-manufacturing/batch-05-numeric-audit.json'
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'questionCounts': counts, 'numericCandidates': len(flags)}))
