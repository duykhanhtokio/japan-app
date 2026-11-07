"""Validate batch14 editorial evidence against its exact current source snapshot.

Read-only: this checks evidence identity and scope, not technical correctness.
"""
from collections import Counter
from pathlib import Path
import hashlib
import json
import runpy

ROOT = Path(__file__).resolve().parents[2]
REPORT_BASE = 'docs/ssw-workspace/manufacturing/batch14/'
AUDIT = 'docs/ssw-workspace/manufacturing/batch12/mechanical/full-source-audit.json'
PATCH_PATH = 'docs/ssw-workspace/manufacturing/batch16/mock-editorial-patches.json'
PATCHER = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-editorial-patches.py'))
LOCALE = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-locale-revisions.py'))
PRECISION = runpy.run_path(str(ROOT / 'scripts/manufacturing/apply-electrical-precision.py'))


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(payload):
    return hashlib.sha256(payload).hexdigest()


def object_digest(value):
    return digest(json.dumps(value, ensure_ascii=False, sort_keys=True,
                             separators=(',', ':')).encode())


def load_inputs(root=ROOT):
    revisions = LOCALE['load_patch']()
    paths = list(dict.fromkeys([AUDIT, PATCH_PATH, PATCHER['TRANSLATIONS'], PATCHER['FURIGANA']]
                              + [u['file'] for u in revisions['updates']]))
    for specialty in ('mechanical', 'electrical'):
        paths.extend([f'src/data/manufacturing/{specialty}.json',
                      f'src/data/manufacturing/mocks/{specialty}.json',
                      f'{REPORT_BASE}{specialty}-mock-review.json'])
    return {path: (root / path).read_bytes() for path in paths}


def unique_index(items, key, label):
    identifiers = [item[key] for item in items]
    require(len(identifiers) == len(set(identifiers)), f'{label}: duplicate IDs')
    return dict(zip(identifiers, items))


def validate(inputs):
    result = {}
    precision = PRECISION['load_patch']()
    require(PRECISION['transform_files'](inputs, precision) == inputs,
            'Electrical precision revisions not fully applied')
    inputs = PRECISION['transform_files'](inputs, precision, forward=False)
    revisions = LOCALE['load_patch']()
    LOCALE['validate_current'](inputs, revisions)
    inputs = LOCALE['transform_files'](inputs, revisions, forward=False)
    patch = json.loads(inputs[PATCH_PATH])
    for specialty in ('mechanical', 'electrical'):
        course_path = f'src/data/manufacturing/{specialty}.json'
        mock_path = f'src/data/manufacturing/mocks/{specialty}.json'
        report = json.loads(inputs[f'{REPORT_BASE}{specialty}-mock-review.json'])
        for flag in ('nativeReviewed', 'domainReviewed', 'runtimeModified'):
            require(report.get(flag) is False, f'{specialty}: unsupported {flag} claim')
        course = json.loads(inputs[course_path])
        mocks = json.loads(inputs[mock_path])
        lessons = unique_index(course['lessons'], 'id', specialty + ' lessons')
        exams = unique_index(mocks['exams'], 'id', specialty + ' exams')
        require(len(exams) == 10, f'{specialty}: expected ten exams')
        selected = []
        for exam in exams.values():
            require(exam['specialty'] == specialty, f'{specialty}: wrong specialty')
            for section, expected in (('theory', 30), ('practical', 10)):
                questions = exam['sections'][section]['questions']
                require(len(questions) == expected, f'{exam["id"]}: wrong section count')
                if specialty == 'mechanical' or section == 'practical':
                    selected.extend(questions)
        questions = unique_index(selected, 'id', specialty + ' questions')
        for q in questions.values():
            lesson = lessons.get(q['lessonId'])
            require(lesson is not None, f'{q["id"]}: missing lesson')
            require(q['lessonSourceHash'] == lesson['sourceHash'], f'{q["id"]}: stale lesson')
            require(q['sourceHash'] == object_digest({k: v for k, v in q.items()
                                                      if k != 'sourceHash'}),
                    f'{q["id"]}: invalid question hash')

        if specialty == 'mechanical':
            require(patch['sourcePath'] == mock_path, 'Unexpected editorial patch source path')
            require(digest(inputs[mock_path]) == patch['revisedSourceSha256'],
                    'Current mechanical mocks lack the recorded editorial revisions')
            historical_bytes, _ = PATCHER['source_versions'](inputs[mock_path], patch)
            bindings = unique_index(report['inputFiles'], 'path', 'mechanical inputs')
            require(set(bindings) == {course_path, mock_path, AUDIT}, 'mechanical: unexpected input set')
            snapshots = {path: entry['sha256'] for path, entry in bindings.items()}
            ids = report['reviewedQuestionIds']
            require(len(ids) == len(set(ids)), 'mechanical: duplicate reviewed question')
            require(set(ids) == set(questions), 'mechanical: incomplete review IDs')
            counts = report['counts']
            require((counts['questions'], counts['theory'], counts['practical']) == (400, 300, 100),
                    'mechanical: wrong review counts')
            require(report.get('releaseReady') is False, 'mechanical: unsupported release claim')
            for finding in report['findings']:
                require(set(finding['questionIds']) <= set(questions), 'mechanical: unknown finding question')
        else:
            snapshots = report['sourceSnapshots']
            require(set(snapshots) == {course_path, mock_path}, 'electrical: unexpected input set')
            require(report.get('humanReviewed') is False, 'electrical: unsupported human claim')
            selection = report['selection']
            require((selection['questionCount'], selection['examCount'], selection['questionsPerExam'])
                    == (100, 10, 10), 'electrical: wrong review counts')
            items = unique_index(report['items'], 'questionId', 'electrical review')
            require(set(items) == set(questions), 'electrical: incomplete practical review IDs')
            require(Counter(q['reviewStatus'] for q in questions.values())
                    == Counter({selection['reviewStatus']: 100}), 'electrical: selection status drift')
            for qid, item in items.items():
                q = questions[qid]
                require(item['questionSnapshotSha256'] == object_digest(q), f'{qid}: stale review object')
                require(item['questionSourceHash'] == q['sourceHash'], f'{qid}: stale review question hash')
                require(item['lessonId'] == q['lessonId'], f'{qid}: wrong review lesson')
                require(item['lessonSourceHash'] == q['lessonSourceHash'], f'{qid}: stale review lesson hash')
                require(item['verdict'] == 'no_required_correction_identified', f'{qid}: unresolved verdict')
            require(not report['requiredCorrections'], 'electrical: unresolved required corrections')
            for note in report['nonblockingPrecisionNotes']:
                require(note['questionId'] in questions, 'electrical: unknown precision-note question')
        for path, expected in snapshots.items():
            payload = historical_bytes if specialty == 'mechanical' and path == mock_path else inputs[path]
            require(digest(payload) == expected, f'{specialty}: stale reviewed file {path}')
        result[specialty] = {'boundQuestions': len(questions), 'boundFiles': len(snapshots)}
        if specialty == 'mechanical':
            result[specialty].update(historicalReviewedQuestions=400,
                                     unchangedCurrentReviewedQuestions=398,
                                     authorRevisedQuestions=2, revisedQuestionsIndependentlyReviewed=False)
        else:
            result[specialty].update(historicalReviewedQuestions=100,
                                     unchangedCurrentReviewedQuestions=98,
                                     separatelyReviewedStemRevisions=2,
                                     revisedFullQuestionSourceCertification=False)
    for path, expected in PATCHER['compile_outputs'](inputs, patch).items():
        require(inputs[path] == expected, 'Runtime editorial patch not fully applied: ' + path)
    return {'status': 'PASS', 'reviews': result,
            'scope': 'Exact historical batch14 evidence reconstructed before batch21 stem refinements, plus reversible batch16 author revisions; no full-source/native/domain certification.',
            'runtimeFilesModified': False, 'releaseReady': False}


if __name__ == '__main__':
    print(json.dumps(validate(load_inputs())))
