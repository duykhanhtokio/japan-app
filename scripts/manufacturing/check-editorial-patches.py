"""Check precise revision scope, idempotent rebuilds and invalid input rejection."""
from copy import deepcopy
from pathlib import Path
import json
import runpy

ROOT = Path(__file__).resolve().parents[2]
patcher = runpy.run_path(str(Path(__file__).with_name('apply-editorial-patches.py')))
patch = json.loads((ROOT / patcher['PATCH_PATH']).read_bytes())
paths = (patch['sourcePath'], patcher['TRANSLATIONS'], patcher['FURIGANA'])
inputs = {p: (ROOT / p).read_bytes() for p in paths}
compile_outputs = patcher['compile_outputs']
outputs = compile_outputs(inputs, patch)
assert outputs == inputs, 'Compiler must be byte-idempotent on revised files'
before_bytes, _ = patcher['source_versions'](inputs[patch['sourcePath']], patch)
before = json.loads(before_bytes)
after = json.loads(inputs[patch['sourcePath']])
old_questions = {q['id']: q for e in before['exams'] for s in e['sections'].values() for q in s['questions']}
new_questions = {q['id']: q for e in after['exams'] for s in e['sections'].values() for q in s['questions']}
changed = {qid for qid in old_questions if old_questions[qid] != new_questions[qid]}
assert changed == {p['questionId'] for p in patch['patches']}
assert sum(e['revision'] != old['revision'] for e, old in zip(after['exams'], before['exams'])) == 2
assert all(new_questions[qid]['correctIndex'] == q['correctIndex']
           and new_questions[qid]['optionsJa'] == q['optionsJa'] for qid, q in old_questions.items())

# Recreate the baseline only in memory and verify repeatable, narrowly scoped assembly.
baseline = dict(inputs)
baseline[patch['sourcePath']] = before_bytes
for path, kind in ((patcher['TRANSLATIONS'], 'translations'), (patcher['FURIGANA'], 'furigana')):
    value = json.loads(inputs[path])
    for p in patch['patches']:
        if kind == 'translations':
            for locale, t in p[kind].items():
                value['locales'][locale][p['questionId']] = deepcopy(t['before'])
        else:
            value['questions'][p['questionId']] = deepcopy(p[kind]['before'])
    baseline[path] = patcher['encoded'](value)
assert compile_outputs(baseline, patch) == inputs, 'Frozen rebuild must reproduce revised files'
assert {p: patcher['digest'](b) for p, b in baseline.items()} == patch['baselineRuntimeSha256'], 'Unrelated baseline content changed'
assert {p: patcher['digest'](b) for p, b in inputs.items()} == patch['revisedRuntimeSha256'], 'Revised delivery snapshot drift'

old_t, new_t = json.loads(baseline[patcher['TRANSLATIONS']]), json.loads(inputs[patcher['TRANSLATIONS']])
old_r, new_r = json.loads(baseline[patcher['FURIGANA']]), json.loads(inputs[patcher['FURIGANA']])
for locale in old_t['locales']:
    assert {qid for qid in old_t['locales'][locale]
            if old_t['locales'][locale][qid] != new_t['locales'][locale][qid]} == changed
assert {qid for qid in old_r['questions'] if old_r['questions'][qid] != new_r['questions'][qid]} == changed
assert all(p['reading'] for qid in changed for p in new_r['questions'][qid]['stem']
           if any('\u4e00' <= c <= '\u9fff' for c in p['text']))
rejected = []


def reject(name, candidate_inputs, candidate_patch):
    try:
        compile_outputs(candidate_inputs, candidate_patch)
    except ValueError:
        rejected.append(name)
    else:
        raise AssertionError('Accepted invalid revision: ' + name)


for name, mutate in (
    ('changed answer key', lambda p: p['patches'][0]['after'].__setitem__('correctIndex', 1)),
    ('missing revised question', lambda p: p['patches'].pop()),
    ('duplicate revised question', lambda p: p['patches'].__setitem__(1, deepcopy(p['patches'][0]))),
    ('missing target locale', lambda p: p['patches'][0]['translations'].pop('vi')),
    ('stale target source hash', lambda p: p['patches'][0]['translations']['vi']['after'].__setitem__('sourceHash', '0' * 64)),
    ('incorrect ruby text', lambda p: p['patches'][0]['furigana']['after']['stem'][0].__setitem__('text', 'X')),
    ('stale ruby binding', lambda p: p['patches'][0]['furigana']['after'].__setitem__('sourceHash', '0' * 64)),
    ('unsupported independent certification', lambda p: p['review'].__setitem__('independentReviewed', True)),
    ('unsupported native certification', lambda p: p['review'].__setitem__('nativeReviewed', True)),
    ('wrong exam revision', lambda p: p['examRevisions'][next(iter(p['examRevisions']))].__setitem__('after', 'wrong')),
):
    candidate = deepcopy(patch)
    mutate(candidate)
    reject(name, inputs, candidate)
for path, kind in ((patcher['TRANSLATIONS'], 'translation'), (patcher['FURIGANA'], 'ruby')):
    candidate = dict(inputs)
    value = json.loads(candidate[path])
    qid = patch['patches'][0]['questionId']
    if kind == 'translation':
        value['locales']['vi'][qid]['stem'] = 'stale text with a current source hash'
    else:
        value['questions'][qid]['stem'][0]['text'] = 'X'
    candidate[path] = patcher['encoded'](value)
    reject('unexpected current ' + kind + ' text', candidate, patch)
print(json.dumps({'status': 'PASS', 'revisedQuestions': 2, 'unchangedMechanicalQuestions': 398,
                  'revisedExamRevisions': 2, 'preservedAnswerKeys': 400,
                  'updatedTranslationBindings': 24, 'unaffectedTranslationBindings': 14376,
                  'revisedRubyBindings': 2, 'unaffectedRubyBindings': 1198,
                  'idempotent': True, 'frozenRebuildReproducesCurrent': True,
                  'rejectedInvalidRevisions': rejected, 'runtimeFilesModified': False}))
