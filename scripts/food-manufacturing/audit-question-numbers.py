#!/usr/bin/env python3
"""Flag assessment numeric differences for semantic review, never automatic correction."""
import argparse
import collections
import json
import pathlib
import re
import unicodedata

root = pathlib.Path(__file__).resolve().parents[2]
data = root / 'src/data/food-manufacturing'
parts = [json.loads(path.read_text()) for path in sorted((data / 'authoring-20261029').glob('part[1-6].json'))]
exams = json.loads((data / 'exams.ja.json').read_text())['exams']
exams += [exam for part in parts for exam in part.get('exams', [])]
questions = {q['id']: q for exam in exams for q in exam['questions']}
# Mirror supplemental.ts and index.ts: later parts extend the base locale pack.
locale_questions = {
    path.stem: json.loads(path.read_text())['questions']
    for path in sorted((data / 'test-translations').glob('*.json'))
}
for part in parts:
    for locale, pack in part.get('testTranslations', {}).items():
        locale_questions.setdefault(locale, {}).update(pack['questions'])

def numbers(text):
    normalized = ''
    for char in unicodedata.normalize('NFKC', text):
        try:
            normalized += str(unicodedata.digit(char))
        except (TypeError, ValueError):
            normalized += char
    return collections.Counter(re.findall(r'\d+(?:\.\d+)?', normalized))

flags, counts = [], {}
for locale, translated_questions in sorted(locale_questions.items()):
    counts[locale] = len(translated_questions)
    for qid, target in translated_questions.items():
        source = questions[qid]
        pairs = [('prompt', source['promptJa'], target['prompt']),
                 ('explanation', source['explanationJa'], target['explanation'])]
        pairs += [(f'option:{i}', a, b) for i, (a, b) in enumerate(zip(source['optionsJa'], target['options']))]
        pairs += [(f'optionReason:{i}', a, b) for i, (a, b) in enumerate(zip(source['optionExplanationsJa'], target['optionExplanations']))]
        for field, ja, translated in pairs:
            a, b = numbers(ja), numbers(translated)
            if a != b:
                flags.append({'locale': locale, 'questionId': qid, 'field': field,
                              'sourceNumbers': dict(a), 'targetNumbers': dict(b),
                              'status': 'needs_semantic_review_not_automatic_error'})
report = {'questionCounts': counts, 'numericReviewCandidates': flags,
          'meaning': 'Unicode digits normalized. Worded numbers may be correct; each candidate requires semantic review.'}
parser = argparse.ArgumentParser()
parser.add_argument('--output', default='assessment-numeric-audit.json')
args = parser.parse_args()
if not re.fullmatch(r'[a-z0-9-]+\.json', args.output):
    parser.error('--output must be a JSON basename')
output = root / 'docs/ssw-workspace/food-manufacturing' / args.output
output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'questionCounts': counts, 'numericCandidates': len(flags)}))
