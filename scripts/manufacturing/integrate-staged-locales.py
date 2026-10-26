"""Merge only hash-bound translation payloads; never manufacture fallback translations."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/manufacturing'
DOCS = ROOT / 'docs/ssw-workspace/manufacturing'


def read(path):
    return json.loads(path.read_text())


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')


def main():
    registry = read(DATA / 'translations/manifest.json')
    courses = [read(DATA / (s + '.json')) for s in ['mechanical', 'electrical', 'surface']]
    canonical = {'lessons': {l['id']: l for c in courses for l in c['lessons']}, 'questions': {q['id']: q for c in courses for e in c['checks'] for q in e['questions']}}
    payloads = []
    for folder in ['mechanical-locales', 'electrical-locales', 'surface-locales']:
        payloads.extend(sorted((DOCS / 'batch12' / folder).glob('*.json')))
    payloads.extend(sorted((DOCS / 'batch13/locales').glob('*.json')))
    log = {'merged': {}, 'staleSkipped': [], 'conflictsKeptExisting': []}
    for locale, entry in registry['locales'].items():
        for kind, filekey, countkey, filename in [('lessons', 'file', 'lessonCount', locale + '.json'), ('questions', 'questionFile', 'questionCount', 'questions.' + locale + '.json')]:
            destination = DATA / 'translations' / filename
            result = read(destination) if destination.exists() else {'locale': locale, kind: {}}
            entries = result[kind]
            for identity, value in list(entries.items()):
                source = canonical[kind].get(identity)
                if not source or value.get('sourceHash') != source['sourceHash']:
                    log['staleSkipped'].append({'file': str(destination.relative_to(ROOT)), 'id': identity})
                    del entries[identity]
            for path in payloads:
                staged = read(path)
                if staged.get('locale') != locale or not isinstance(staged.get(kind), dict):
                    continue
                for identity, value in staged[kind].items():
                    source = canonical[kind].get(identity)
                    if not source or value.get('sourceHash') != source['sourceHash']:
                        log['staleSkipped'].append({'file': str(path.relative_to(ROOT)), 'id': identity})
                        continue
                    if identity in entries and entries[identity] != value:
                        if 'batch13/locales/' in str(path):
                            # Final, independently assembled staging supersedes earlier partials.
                            entries[identity] = value
                            continue
                        log['conflictsKeptExisting'].append({'file': str(path.relative_to(ROOT)), 'id': identity})
                        continue
                    entries[identity] = value
            if entries:
                write(destination, result)
                entry[filekey] = filename
                entry[countkey] = len(entries)
                entry['status'] = 'ai_translated_draft'
            else:
                entry[countkey] = 0
            log['merged'][locale + '/' + kind] = len(entries)
        if entry.get('file'):
            complete = entry['lessonCount'] == len(canonical['lessons']) and entry['questionCount'] == len(canonical['questions'])
            entry['scope'] = ('all' if complete else 'partial') + '_current_authored_content;full_curriculum_incomplete'
    write(DATA / 'translations/manifest.json', registry)
    captions = read(DATA / 'diagram-translations.json')
    for path in sorted((DOCS / 'batch13/locales').glob('captions.*.json')):
        payload = read(path)
        captions['locales'][payload['locale']] = payload['captions']
    write(DATA / 'diagram-translations.json', captions)
    # Static require cases preserve Metro bundling and unsupported-locale nulls.
    file = DATA / 'translations.ts'
    text = file.read_text()
    for locale, entry in registry['locales'].items():
        position = text.index('export function manufacturingQuestionTranslation')
        before, after = text[:position], text[position:]
        if entry.get('file') and "case '" + locale + "':" not in before:
            before = before.replace("switch(locale){", "switch(locale){case '" + locale + "':entries=require('./translations/" + entry['file'] + "').lessons;break;", 1)
        if entry.get('questionFile') and "case '" + locale + "':" not in after:
            after = after.replace("switch(locale){", "switch(locale){case '" + locale + "':entries=require('./translations/" + entry['questionFile'] + "').questions;break;", 1)
        text = before + after
    file.write_text(text)
    write(DOCS / 'batch13/locale-integration.json', log)
    print(json.dumps(log['merged']))


if __name__ == '__main__':
    main()
