"""Bind batch17 scoped independent AI reviews to their actual source records."""
from pathlib import Path
import json
import runpy

ROOT = Path(__file__).resolve().parents[2]
STAGE = 'docs/ssw-workspace/manufacturing/batch17/'
LOCALE = runpy.run_path(str(Path(__file__).with_name('apply-locale-revisions.py')))
digest, object_digest, require = LOCALE['digest'], LOCALE['object_digest'], LOCALE['require']


def read(path):
    return json.loads((ROOT / path).read_bytes())


def index(items, field):
    result = {x[field]: x for x in items}
    require(len(result) == len(items), 'Duplicate reviewed ID')
    return result


def validate_electrical(report):
    for path, expected in report['sourceSnapshots'].items():
        require(digest((ROOT / path).read_bytes()) == expected, 'Electrical review file drift: ' + path)
    exams = read('src/data/manufacturing/mocks/electrical.json')['exams']
    questions = index([q for e in exams for q in e['sections']['theory']['questions']], 'id')
    lessons = index(read('src/data/manufacturing/electrical.json')['lessons'], 'id')
    items = index(report['items'], 'questionId')
    require(len(questions) == 300 and set(items) == set(questions), 'Incomplete electrical theory review')
    ids = report['reviewedQuestionIds']
    require(len(ids) == len(set(ids)) == 300 and set(ids) == set(questions), 'Electrical reviewed ID set drift')
    require(report['counts']['theoryQuestions'] == 300 and report['counts']['rationaleSides'] == 600,
            'Electrical review count drift')
    for qid, item in items.items():
        q = questions[qid]
        require(item['questionSourceHash'] == q['sourceHash']
                and item['questionSnapshotSha256'] == object_digest(q), 'Stale theory question: ' + qid)
        require(item['lessonId'] == q['lessonId']
                and item['lessonSourceHash'] == lessons[q['lessonId']]['sourceHash'] == q['lessonSourceHash'],
                'Stale theory lesson: ' + qid)
        require(item['rationaleSidesReviewed'] == 2
                and item['keyVerdict'] == 'no_required_correction_identified', 'Unresolved theory verdict')
    require(not report['requiredCorrections'], 'Unresolved electrical required corrections')
    for flag in ('nativeReviewed', 'domainReviewed', 'humanReviewed', 'runtimeModified', 'releaseReady'):
        require(report[flag] is False, 'Unsupported electrical review claim: ' + flag)
    return len(items)


def validate_language(report):
    patch = LOCALE['load_patch']()
    inputs = {path: (ROOT / path).read_bytes() for path in report['inputFiles']}
    LOCALE['validate_current'](inputs, patch)
    historical = LOCALE['transform_files'](inputs, patch, forward=False)
    for path, expected in report['inputFiles'].items():
        require(digest(historical[path]) == expected, 'Language review predecessor drift: ' + path)
    course = json.loads(historical['src/data/manufacturing/mechanical.json'])
    lessons = index(course['lessons'], 'id')
    weekly = index([q for c in course['checks'] for q in c['questions']], 'id')
    exams = json.loads(historical['src/data/manufacturing/mocks/mechanical.json'])['exams']
    questions = index([q for e in exams for s in e['sections'].values() for q in s['questions']], 'id')
    targets = json.loads(historical['src/data/manufacturing/mock-translations.json'])['locales']
    ruby = json.loads(historical['src/data/manufacturing/mock-furigana.json'])['questions']
    vi_lessons = json.loads(historical['src/data/manufacturing/translations/vi.json'])['lessons']
    vi_weekly = json.loads(historical['src/data/manufacturing/translations/questions.vi.json'])['questions']
    mocks = index(report['mockReviews'], 'questionId')
    require(set(mocks) == {'mfg1-mechanical-mock-01-theory-01', 'mfg1-mechanical-mock-03-theory-17'},
            'Language mock review scope drift')
    for qid, review in mocks.items():
        require(review['questionSourceHash'] == questions[qid]['sourceHash']
                and review['questionObjectSha256'] == object_digest(questions[qid])
                and review['rubyObjectSha256'] == object_digest(ruby[qid]), 'Language canonical/ruby drift')
        ts = index(review['targets'], 'locale')
        require(set(ts) == set(targets), 'Incomplete reviewed target locales')
        for locale, t in ts.items():
            require(t['sourceHash'] == questions[qid]['sourceHash']
                    and t['targetObjectSha256'] == object_digest(targets[locale][qid]),
                    'Language target predecessor drift: ' + locale + '/' + qid)
    ls = index(report['vietnameseWeek1Lessons'], 'lessonId')
    require(set(ls) == {l['id'] for l in course['lessons'][:7]}, 'Incomplete VI lesson review')
    for lid, r in ls.items():
        require(r['sourceHash'] == lessons[lid]['sourceHash']
                and r['japaneseObjectSha256'] == object_digest(lessons[lid])
                and r['targetObjectSha256'] == object_digest(vi_lessons[lid]), 'VI lesson review drift')
    ws = index(report['vietnameseWeek1Questions'], 'questionId')
    require(set(ws) == {q['id'] for q in course['checks'][0]['questions']}, 'Incomplete VI weekly review')
    for qid, r in ws.items():
        require(r['questionSourceHash'] == weekly[qid]['sourceHash']
                and r['questionObjectSha256'] == object_digest(weekly[qid])
                and r['targetObjectSha256'] == object_digest(vi_weekly[qid])
                and r['keyIndexChecked'] == weekly[qid]['correctIndex'], 'VI weekly review drift')
    require({f['id'] for f in report['findings']} == {fid for u in patch['updates'] for fid in u['findingIds']},
            'Not all scoped language findings have an integrated revision')
    for flag in ('nativeReviewed', 'domainReviewed', 'runtimeModified', 'releaseReady'):
        require(report[flag] is False, 'Unsupported language review claim: ' + flag)
    return {'mockTargetRecords': 24, 'rubyRecords': 2, 'vietnameseLessons': 7,
            'vietnameseWeeklyQuestions': 12, 'integratedTargetCorrections': 4}


def validate():
    electrical = validate_electrical(read(STAGE + 'electrical-theory-independent-review.json'))
    language = validate_language(read(STAGE + 'language-independent-review.json'))
    return {'status': 'PASS', 'independentlyReviewedElectricalTheoryQuestionsBound': electrical,
            'languageReviewBindings': language, 'nativeReviewed': False, 'domainReviewed': False,
            'scope': 'Exact scoped independent AI editorial evidence; no exhaustive source/native/domain certificate.'}


if __name__ == '__main__':
    print(json.dumps(validate()))
