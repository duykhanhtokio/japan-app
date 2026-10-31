"""Append complete, disjoint author packets without changing existing exams."""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(path):
    return json.loads(path.read_text())


def write(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


bank_path = ROOT / 'src/data/agriculture/mock-exams.ja.json'
manifest_path = ROOT / 'src/data/agriculture/course-manifest.json'
ledger_path = ROOT / 'docs/ssw-workspace/agriculture/knowledge-ledger.json'
bank, manifest, ledger = map(read, [bank_path, manifest_path, ledger_path])
existing = {exam['id']: digest(exam) for exam in bank['exams']}
knowledge = {row['id']: row for row in ledger['knowledge']}
lessons = {row['id']: row for row in read(ROOT / 'src/data/agriculture/lessons.ja.json')['lessons']}
new_ids = []
for argument in sys.argv[1:]:
    packet = read(Path(argument))
    exams = packet if isinstance(packet, list) else packet['exams']
    for exam in exams:
        assert exam['id'] not in existing and exam['id'] not in new_ids, exam['id']
        assert len(exam['questions']) == 40, exam['id']
        assert exam['level'] in ['1', '2']
        exam.setdefault('levels', [exam['level']])
        assert exam['levels'] == [exam['level']]
        assert exam['revision'] == 'v1-' + digest(exam['questions'])[:16]
        for question in exam['questions']:
            lesson = lessons[question['lessonId']]
            assert question['lessonSourceHash'] == lesson['sourceHash'], question['id']
            assert exam['level'] in lesson['levels'], question['id']
            for kid in question['knowledgeIds']:
                row = knowledge[kid]
                assert lesson['id'] in row['lessonIds']
                if question['id'] not in row['questionIds']:
                    row['questionIds'].append(question['id'])
        bank['exams'].append(exam)
        new_ids.append(exam['id'])
assert all(digest(next(e for e in bank['exams'] if e['id'] == key)) == value
           for key, value in existing.items())
for level in ['1', '2']:
    exams = [exam for exam in bank['exams'] if exam['level'] == level]
    assert len(exams) <= 10
    manifest['levels'][level]['mockExams'] = [exam['id'] for exam in exams]
bank['complete'] = all(sum(exam['level'] == level for exam in bank['exams']) == 10
                       for level in ['1', '2'])
for path, data in [(bank_path, bank), (manifest_path, manifest), (ledger_path, ledger)]:
    write(path, data)
print(json.dumps({'status': 'PASS', 'newForms': len(new_ids), 'newQuestions': len(new_ids) * 40,
                  'totalForms': len(bank['exams']), 'complete': bank['complete'],
                  'existingExamsPreserved': len(existing)}))
