"""Validate revision-bound terminology corrections, not native fluency certification."""
import argparse
from collections import Counter, defaultdict
import hashlib
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / 'docs/ssw-workspace/restaurant'
DATA = ROOT / 'src/data/restaurant'


def read(path):
    return json.loads(path.read_text())


def sha(text):
    return hashlib.sha256(text.encode()).hexdigest()


def value_at(obj, keys):
    for key in keys:
        obj = obj[int(key) if isinstance(obj, list) else key]
    return obj


def validate(authority, corrections, translations, canonical):
    errors = []
    seen = set()
    counts = defaultdict(Counter)
    references = {r['file']: r for r in authority['references']}
    for locale, standards in authority['standards'].items():
        if locale not in authority['priorityLocales']:
            errors.append(f'unapproved locale: {locale}')
        for index, standard in enumerate(standards):
            ref = references.get(standard['referenceFile'])
            if not ref or not 1 <= standard['pdfPage'] <= ref['pages']:
                errors.append(f'invalid reference: {locale}:{index}')
            elif standard['referenceSha256'] != ref['sha256']:
                errors.append(f'reference revision mismatch: {locale}:{index}')
    for change in corrections['changes']:
        locale, section, rid = change['locale'], change['section'], change['id']
        key = (locale, section, rid, tuple(change['path']))
        if key in seen:
            errors.append(f'duplicate correction: {key}')
        seen.add(key)
        if locale not in authority['priorityLocales'] or section not in canonical:
            errors.append(f'out-of-scope correction: {key}')
            continue
        try:
            record = translations[locale][section][rid]
            actual = value_at(record, change['path'])
            if actual != change['after'] or sha(actual) != change['afterSha256']:
                errors.append(f'target changed; re-review required: {key}')
            if record['sourceHash'] != change['canonicalSourceHash'] or canonical[section][rid]['sourceHash'] != change['canonicalSourceHash']:
                errors.append(f'source revision changed; re-review required: {key}')
            indexes = change['appliedStandardIndexes']
            if not indexes or any(not 0 <= i < len(authority['standards'][locale]) for i in indexes):
                errors.append(f'invalid standard indexes: {key}')
            numbers = lambda s: re.findall(r'\d+(?:[.,]\d+)*', unicodedata.normalize('NFKC', s))
            if numbers(change['before']) != numbers(change['after']):
                errors.append(f'numeric tokens changed: {key}')
            counts[locale][section] += 1
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            errors.append(f'invalid correction {key}: {exc}')
    if {loc: dict(c) for loc, c in counts.items()} != corrections['counts']:
        errors.append('correction-count summary mismatch')
    for locale, data in translations.items():
        for rid, question in data['questions'].items():
            options = [re.sub(r'\s+', ' ', x.strip()).casefold() for x in question['options']]
            if len(options) != 4 or len(set(options)) != 4:
                errors.append(f'duplicate/missing options: {locale}:{rid}')
    return {
        'status': 'TERM_STANDARD_PASS' if not errors else 'FAIL',
        'changedFields': len(corrections['changes']),
        'standards': sum(map(len, authority['standards'].values())),
        'priorityLocales': authority['priorityLocales'],
        'deferredLocales': authority['deferredLocales'],
        'counts': {loc: dict(c) for loc, c in counts.items()},
        'errors': errors,
        'nativeReviewed': False,
        'domainReviewed': False,
        'scope': 'Integrity of explicitly reviewed fields and reference revisions; not exhaustive all-language semantic certification.',
    }


def load_inputs():
    authority = read(DOCS / 'terminology-authority.json')
    corrections = read(DOCS / 'terminology-corrections.json')
    translations = {loc: read(DATA / 'translations' / f'{loc}.json') for loc in authority['priorityLocales']}
    canonical = {'lessons': {}, 'questions': {}, 'glossary': {}}
    for level in ('1', '2'):
        for lesson in read(DATA / f'lessons.{level}.ja.json')['lessons']:
            canonical['lessons'][lesson['id']] = lesson
        for exam in read(DATA / f'exams.{level}.ja.json')['exams']:
            for question in exam['questions']:
                canonical['questions'][question['id']] = question
    for group in read(DATA / 'glossary.ja.json')['groups']:
        for entry in group['entries']:
            canonical['glossary'][entry['id']] = entry
    return authority, corrections, translations, canonical


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    result = validate(*load_inputs())
    if args.report:
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result, ensure_ascii=False))
    return int(bool(result['errors']))


if __name__ == '__main__':
    raise SystemExit(main())
