"""Ensure incomplete/stale mock translations fail without touching runtime files."""
from contextlib import redirect_stdout
from copy import deepcopy
from io import StringIO
from pathlib import Path
import json
import runpy


def main():
    validator = Path(__file__).with_name('check-mock-content.py')
    with redirect_stdout(StringIO()):
        checked = runpy.run_path(str(validator))
    validate = checked['validate_translations']
    translations = checked['translations']
    questions = checked['questions']
    locales = checked['scope']['targetLocales']
    locale = locales[0]
    qid = next(iter(questions))
    cases = []

    def reject(name, mutated):
        try:
            validate(mutated, questions, locales)
        except AssertionError:
            cases.append(name)
        else:
            raise AssertionError(f'Validator accepted {name}')

    def changed_entry(field, value):
        candidate = dict(translations)
        candidate[locale] = dict(translations[locale])
        candidate[locale][qid] = deepcopy(translations[locale][qid])
        candidate[locale][qid][field] = value
        return candidate

    candidate = dict(translations)
    del candidate[locale]
    reject('missing locale', candidate)
    candidate = dict(translations)
    candidate[locale] = dict(translations[locale])
    del candidate[locale][qid]
    reject('missing question', candidate)
    candidate = dict(translations)
    candidate[locale] = {**translations[locale], 'unexpected-question': translations[locale][qid]}
    reject('extra question', candidate)
    reject('stale source hash', changed_entry('sourceHash', '0' * 64))
    reject('empty stem', changed_entry('stem', ' '))
    options = list(translations[locale][qid]['options'])
    options[0] = ' '
    reject('empty option', changed_entry('options', options))
    reasons = list(translations[locale][qid]['reasons'])
    reasons[0] = ''
    reject('empty rationale', changed_entry('reasons', reasons))
    reject('missing option', changed_entry('options', options[:-1]))
    reject('missing rationale', changed_entry('reasons', reasons[:-1]))
    print(json.dumps({'status': 'PASS', 'rejectedInvalidSnapshots': cases, 'runtimeFilesModified': False}))


if __name__ == '__main__':
    main()
