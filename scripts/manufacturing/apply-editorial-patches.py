"""Apply scoped, reversible editorial revisions without rewriting frozen inputs."""
from copy import deepcopy
from pathlib import Path
import hashlib
import json
import runpy

ROOT = Path(__file__).resolve().parents[2]
PATCH_PATH = 'docs/ssw-workspace/manufacturing/batch16/mock-editorial-patches.json'
TRANSLATIONS = 'src/data/manufacturing/mock-translations.json'
FURIGANA = 'src/data/manufacturing/mock-furigana.json'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + '\n').encode()


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def object_digest(value):
    return digest(json.dumps(value, ensure_ascii=False, sort_keys=True,
                             separators=(',', ':')).encode())


def validate_patch(patch):
    require(patch['review']['independentReviewed'] is False, 'No independent revision review claimed')
    for flag in ('nativeReviewed', 'domainReviewed', 'releaseReady'):
        require(patch['review'][flag] is False, 'Unsupported revision certification: ' + flag)
    ids = [p['questionId'] for p in patch['patches']]
    require(len(ids) == len(set(ids)) == 2, 'Exactly two distinct editorial revisions required')
    allowed = {'mfg1-mechanical-mock-01-theory-01': {'stemJa', 'sourceHash'},
               'mfg1-mechanical-mock-03-theory-17': {'optionReasonsJa', 'sourceHash'}}
    require(set(ids) == set(allowed), 'Unexpected revised question IDs')
    for p in patch['patches']:
        before, after = p['before'], p['after']
        require(before['id'] == after['id'] == p['questionId'], 'Patch identity drift')
        changed = {k for k in set(before) | set(after) if before.get(k) != after.get(k)}
        require(changed == allowed[p['questionId']], 'Patch exceeds editorial scope')
        for q in (before, after):
            require(q['sourceHash'] == object_digest({k: v for k, v in q.items() if k != 'sourceHash'}),
                    'Invalid patched question digest')
        for side in ('before', 'after'):
            q = p[side]
            ruby = p['furigana'][side]
            require(ruby['sourceHash'] == q['sourceHash'], 'Furigana source drift')
            require(''.join(part['text'] for part in ruby['stem']) == q['stemJa'], 'Furigana text drift')
            require([''.join(part['text'] for part in option) for option in ruby['options']]
                    == q['optionsJa'], 'Furigana option drift')
            for t in p['translations'].values():
                require(t[side]['sourceHash'] == q['sourceHash'], 'Patch translation source drift')
                require(t[side]['nativeReviewed'] is False and t[side]['domainReviewed'] is False,
                        'Unsupported translation certification')


def source_versions(payload, patch):
    """Require an exact old/new file, and reconstruct its frozen predecessor."""
    validate_patch(patch)
    require(digest(payload) in (patch['baselineSourceSha256'], patch['revisedSourceSha256']),
            'Unrecognized mechanical mock snapshot')
    bundle = json.loads(payload)
    before, after = deepcopy(bundle), deepcopy(bundle)
    patches = {p['questionId']: p for p in patch['patches']}
    found = set()
    for old_exam, new_exam in zip(before['exams'], after['exams']):
        for name in old_exam['sections']:
            for i, question in enumerate(old_exam['sections'][name]['questions']):
                p = patches.get(question['id'])
                if p is None:
                    continue
                require(question == p['before'] or question == p['after'], 'Patched question drift')
                old_exam['sections'][name]['questions'][i] = deepcopy(p['before'])
                new_exam['sections'][name]['questions'][i] = deepcopy(p['after'])
                found.add(question['id'])
        revisions = patch['examRevisions'].get(old_exam['id'])
        if revisions:
            require(old_exam['revision'] in revisions.values(), 'Exam revision drift')
            old_exam['revision'] = revisions['before']
            new_exam['revision'] = revisions['after']
    require(found == set(patches), 'Missing editorial patch question')
    old_bytes, new_bytes = encoded(before), encoded(after)
    require(digest(old_bytes) == patch['baselineSourceSha256'], 'Frozen predecessor reconstruction drift')
    require(digest(new_bytes) == patch['revisedSourceSha256'], 'Revised snapshot reconstruction drift')
    return old_bytes, new_bytes


def compile_outputs(inputs, patch):
    source_path = patch['sourcePath']
    _, revised_source = source_versions(inputs[source_path], patch)
    translations, ruby = json.loads(inputs[TRANSLATIONS]), json.loads(inputs[FURIGANA])
    for p in patch['patches']:
        qid = p['questionId']
        require(set(p['translations']) == set(translations['locales']), 'Incomplete patch locales')
        for locale, t in p['translations'].items():
            current = translations['locales'][locale][qid]
            require(current == t['before'] or current == t['after'], 'Translation drift: ' + locale + '/' + qid)
            translations['locales'][locale][qid] = deepcopy(t['after'])
        current = ruby['questions'][qid]
        require(current == p['furigana']['before'] or current == p['furigana']['after'], 'Furigana entry drift')
        ruby['questions'][qid] = deepcopy(p['furigana']['after'])
    return {source_path: revised_source, TRANSLATIONS: encoded(translations), FURIGANA: encoded(ruby)}


def main():
    patch = json.loads((ROOT / PATCH_PATH).read_bytes())
    inputs = {p: (ROOT / p).read_bytes() for p in (patch['sourcePath'], TRANSLATIONS, FURIGANA)}
    locale = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-locale-revisions.py'))
    _, revised_source = source_versions(inputs[patch['sourcePath']], patch)
    context = {patch['sourcePath']: revised_source}
    revisions = locale['load_patch'](canonical_overrides=context)
    historical = locale['transform_files'](inputs, revisions, forward=False, allow_prior=True,
                                           canonical_overrides=context)
    outputs = locale['transform_files'](compile_outputs(historical, patch), revisions,
                                        canonical_overrides=context)
    changed = []
    for path, payload in outputs.items():
        if payload != inputs[path]:
            (ROOT / path).write_bytes(payload)
            changed.append(path)
    print(json.dumps({'status': 'PASS', 'editorialQuestionRevisions': 2,
                      'translationBindings': 24, 'changedFiles': changed,
                      'independentReviewed': False, 'releaseReady': False}))


if __name__ == '__main__':
    main()
