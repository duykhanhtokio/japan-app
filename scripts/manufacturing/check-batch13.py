"""Validate integrated original mock forms and preservation of the earlier course."""
import hashlib
import json
import subprocess
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/manufacturing'
DOCS = ROOT / 'docs/ssw-workspace/manufacturing'


def read(path):
    return json.loads(path.read_text())


def digest(value):
    raw = json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(raw.encode()).hexdigest()


def check():
    manifest = read(DATA / 'course-manifest.json')
    sources = {'mfg1-' + s['specialty'] + '-source': s for s in read(DOCS / 'source-qa-report.json')['sources']}
    knowledge = {k['id'] for k in read(DOCS / 'knowledge-matrix.json')['knowledge']}
    stems, ids, exams, items = set(), set(), [], []
    preserved_lessons, preserved_questions = 0, 0
    for specialty in ['mechanical', 'electrical', 'surface']:
        course = read(DATA / (specialty + '.json'))
        lessons = {l['id']: l for l in course['lessons']}
        baseline_path = 'src/data/manufacturing/' + specialty + '.json'
        baseline = json.loads(subprocess.check_output(['git', 'show', 'd644f639:' + baseline_path], cwd=ROOT))
        for old in baseline['lessons']:
            assert lessons[old['id']] == old, 'Earlier lesson changed: ' + old['id']
            preserved_lessons += 1
        current_checks = {c['id']: c for c in course['checks']}
        for old in baseline['checks']:
            assert current_checks[old['id']] == old, 'Earlier weekly check changed: ' + old['id']
            preserved_questions += len(old['questions'])
        weekly_stems = {''.join(q['stemJa'].split()) for c in course['checks'] for q in c['questions']}
        payload = read(DATA / 'mocks' / (specialty + '.json'))
        assert payload['specialty'] == specialty
        assert len(payload['exams']) == 10
        for exam in payload['exams']:
            assert exam['id'] not in ids
            ids.add(exam['id'])
            assert exam['specialty'] == specialty and exam['kind'] == 'mock'
            assert exam['officialSimulation'] is True
            assert exam['revision'] == 'v1-' + digest(exam['sections'])[:16], exam['id']
            assert set(exam['sections']) == {'theory', 'practical'}
            for name, count, options, minimum in [('theory', 30, 2, 20), ('practical', 10, 4, 6)]:
                section = exam['sections'][name]
                assert section['durationMs'] == 2_400_000
                assert section['passMinimumCorrect'] == minimum
                assert len(section['questions']) == count
                answers = []
                for question in section['questions']:
                    qid = question['id']
                    assert qid not in ids, qid
                    ids.add(qid)
                    stem = ''.join(question['stemJa'].split())
                    assert stem and stem not in stems, 'Duplicate mock stem: ' + qid
                    assert stem not in weekly_stems, 'Weekly stem reused: ' + qid
                    stems.add(stem)
                    assert len(question['optionsJa']) == options and len(set(question['optionsJa'])) == options
                    assert len(question['optionReasonsJa']) == options and all(question['optionReasonsJa'])
                    assert 0 <= question['correctIndex'] < options
                    answers.append(question['correctIndex'])
                    lesson = lessons[question['lessonId']]
                    assert question['lessonSourceHash'] == lesson['sourceHash'], qid
                    assert question['knowledgeIds'] and set(question['knowledgeIds']) <= knowledge
                    assert question['sources']
                    for ref in question['sources']:
                        source = sources[ref['documentId']]
                        assert ref['documentId'] == 'mfg1-' + specialty + '-source'
                        assert 1 <= ref['pdfPage'] <= source['pdfPages']
                        assert ref['pdfPage'] - ref['printedPage'] == source['printedToPhysicalOffset']
                    core = {k: v for k, v in question.items() if k != 'sourceHash'}
                    assert question['sourceHash'] == digest(core), qid
                    items.append(qid)
                counts = Counter(answers)
                assert max(counts.get(i, 0) for i in range(options)) - min(counts.get(i, 0) for i in range(options)) <= 1, section['id']
                assert all(not (answers[i] == answers[i - 1] == answers[i - 2]) for i in range(2, count)), section['id']
            exams.append(exam['id'])
    assert len(exams) == manifest['completedMockExams'] == 30
    assert len(items) == 1200
    assert preserved_lessons == 133 and preserved_questions == 228
    assert manifest['courseComplete'] is False and manifest['releaseReady'] is False
    result = {'status': 'PASS', 'scope': 'structural/content-binding validation; no native/domain certification', 'mockForms': len(exams), 'uniqueQuestions': len(items), 'theoryQuestions': 900, 'practicalQuestions': 300, 'preservedEarlierLessons': preserved_lessons, 'preservedEarlierWeeklyQuestions': preserved_questions, 'sectionDurationMs': 2400000, 'independentPassMinimumCorrect': {'theory': 20, 'practical': 6}, 'wholeCurriculumComplete': False}
    destination = DOCS / 'batch13/mock-data-qa.json'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(result))


if __name__ == '__main__':
    check()
