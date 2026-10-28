"""Read-only exact extension/evidence gate with in-memory rejection fixtures."""
from pathlib import Path
import copy, json, runpy

ROOT = Path(__file__).resolve().parents[2]
api = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-diagram-extension.py'))
api['validate']()
captions, register = api['expected']()
lesson = api['LESSON']
fixtures = []

def reject(name, change):
    c, r = copy.deepcopy(captions), copy.deepcopy(register)
    change(c, r)
    try:
        api['validate'](c, r)
    except AssertionError:
        fixtures.append(name)
    else:
        raise AssertionError('Invalid fixture accepted: ' + name)

reject('missing locale', lambda c,r:c['locales'].pop('vi'))
reject('extra locale', lambda c,r:c['locales'].update(xx=c['locales']['vi']))
reject('missing new caption', lambda c,r:c['locales']['en'].pop(lesson))
reject('extra caption', lambda c,r:c['locales']['en'].update(unknown=c['locales']['en'][lesson]))
reject('stale Japanese caption', lambda c,r:c['locales']['vi'][lesson].update(sourceJa='stale'))
reject('blank target', lambda c,r:c['locales']['vi'][lesson].update(text=''))
reject('changed reviewed target', lambda c,r:c['locales']['vi'][lesson].update(text='different'))
reject('false native claim', lambda c,r:c.update(nativeReviewed=True))
reject('false domain claim', lambda c,r:c.update(domainReviewed=True))
old = next(k for k in captions['locales']['en'] if k != lesson)
reject('changed historical caption', lambda c,r:c['locales']['en'][old].update(text='different'))
reject('missing asset', lambda c,r:r['assets'].pop())
reject('extra asset', lambda c,r:r['assets'].append(copy.deepcopy(r['assets'][-1])))
reject('changed historical asset', lambda c,r:r['assets'][0].update(png='different.png'))
reject('wrong new lesson', lambda c,r:r['assets'][-1].update(lessonIds=['unknown']))
reject('wrong dimensions', lambda c,r:r['assets'][-1]['dimensions'].update(width=1))
reject('false human claim', lambda c,r:r['assets'][-1].update(humanReviewed=True))
namespace = api['preflight'].__globals__
original_read, original_sha = namespace['read'], namespace['sha']

def reject_input(name, relative, mutation):
    def altered_read(path):
        value = original_read(path)
        if path == ROOT / relative:
            mutation(value)
        return value
    namespace['read'] = altered_read
    try:
        api['preflight']()
    except AssertionError:
        fixtures.append(name)
    else:
        raise AssertionError('Invalid preflight accepted: ' + name)
    finally:
        namespace['read'] = original_read

reject_input('unknown current caption snapshot', 'src/data/manufacturing/diagram-translations.json',
             lambda d:d['locales']['vi'][lesson].update(text='unknown'))
reject_input('missing progress locale before writes', 'docs/ssw-workspace/manufacturing/progress.json',
             lambda d:d['diagramTranslationCoverage'].pop('vi'))
reject_input('extra progress locale before writes', 'docs/ssw-workspace/manufacturing/progress.json',
             lambda d:d['diagramTranslationCoverage'].update(xx=19))
reject_input('invalid progress count before writes', 'docs/ssw-workspace/manufacturing/progress.json',
             lambda d:d.update(createdDiagrams=999))
reject_input('unaccepted semantic receipt', 'docs/ssw-workspace/manufacturing/batch19/diagram-caption-review.json',
             lambda d:d['locales']['vi'].update(verdict='pending'))
for relative in ['diagram-captions.json', 'diagram-caption-review.json', 'source-review.json']:
    target = ROOT/'docs/ssw-workspace/manufacturing/batch19'/relative
    namespace['sha'] = lambda path, target=target: '0'*64 if path == target else original_sha(path)
    try:
        api['preflight']()
    except AssertionError:
        fixtures.append('stale evidence '+relative)
    else:
        raise AssertionError('Stale evidence accepted: '+relative)
    finally:
        namespace['sha'] = original_sha
progress = json.loads((ROOT/'docs/ssw-workspace/manufacturing/progress.json').read_text())
assert progress['createdDiagrams'] == progress['usedDiagrams'] == 21
assert progress['translatedDiagramCaptionLocalePairs'] == 252
assert set(progress['diagramTranslationCoverage']) == api['TARGETS']
assert set(progress['diagramTranslationCoverage'].values()) == {21}
print(json.dumps({'status':'PASS','diagrams':21,'captionPairs':252,'rejectedFixtures':fixtures,
                  'scope':'Exact reviewed extension and immutable historical inputs; not native/domain certification'}))
