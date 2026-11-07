"""Bounded learner-risk checks. PASS is not whole-sector semantic acceptance."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/food-manufacturing'
LOCALES = ['en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl']

def read(path):
    return json.loads(path.read_text())

def revision(question):
    fields = {key: question[key] for key in ['promptJa', 'optionsJa', 'explanationJa', 'optionExplanationsJa']}
    value = json.dumps(fields, ensure_ascii=False, separators=(',', ':')).encode('utf-16-le')
    result = 2166136261
    for offset in range(0, len(value), 2):
        result = ((result ^ int.from_bytes(value[offset:offset + 2], 'little')) * 16777619) & 0xffffffff
    return 'fnv1a-' + format(result, 'x')

base = read(DATA / 'exams.ja.json')['exams']
extra = read(DATA / 'runtime-supplemental/exams.json')
questions = [question for exam in base + extra for question in exam['questions']]
errors = []
if len({question['id'] for question in questions}) != len(questions):
    errors.append('Duplicate runtime question ID')
for question in questions:
    qid = question['id']
    options = question['optionsJa']
    index = question['answerIndex']
    if len(options) != 4 or not isinstance(index, int) or not 0 <= index < 4:
        errors.append([qid, 'Invalid answer structure'])
        continue
    if len({''.join(option.split()) for option in options}) != 4:
        errors.append([qid, 'Identical option text'])
    if len(question['optionExplanationsJa']) != 4 or question['optionExplanationsJa'][index] != question['explanationJa']:
        errors.append([qid, 'Correct-option reason differs from explanation; inspect semantics'])

locale_counts = {}
for locale in LOCALES:
    translations = read(DATA / f'test-translations/{locale}.json')['questions']
    translations.update(read(DATA / f'runtime-supplemental/tests.{locale}.json')['questions'])
    locale_counts[locale] = 0
    for question in questions:
        translation = translations.get(question['id'])
        if not translation or translation.get('sourceHash') != revision(question):
            errors.append([locale, question['id'], 'Missing or stale translation'])
            continue
        if any(not isinstance(translation.get(key), str) or not translation[key].strip() for key in ['prompt', 'explanation']):
            errors.append([locale, question['id'], 'Empty translated prompt/explanation'])
        for key in ['options', 'optionExplanations']:
            values = translation.get(key, [])
            if len(values) != 4 or any(not isinstance(value, str) or not value.strip() for value in values):
                errors.append([locale, question['id'], 'Incomplete ' + key])
        if len(set(translation.get('options', []))) != 4:
            errors.append([locale, question['id'], 'Identical translated option text'])
        locale_counts[locale] += 1

snapshot = {}
for relative in ['exams.ja.json', 'runtime-supplemental/exams.json', 'diagrams.json']:
    snapshot[relative] = hashlib.sha256((DATA / relative).read_bytes()).hexdigest()
print(json.dumps({'questions': len(questions), 'baseQuestions': sum(len(e['questions']) for e in base),
                  'supplementalQuestions': sum(len(e['questions']) for e in extra),
                  'translationQuestionsCheckedByLocale': locale_counts, 'errors': errors,
                  'sha256': snapshot,
                  'limitation': 'Mechanical checks do not prove factual accuracy, semantic uniqueness, translation meaning or rendered-image correctness.'}, ensure_ascii=False, indent=2))
raise SystemExit(1 if errors else 0)
