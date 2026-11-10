"""Regression for loss of specific question objectives through topic substitution."""
from pathlib import Path
import json
import shutil
import subprocess
import sys
import tempfile

SCRIPT = Path(__file__).with_name('align-question-objectives.py')
with tempfile.TemporaryDirectory(prefix='restaurant-objective-qa-') as name:
    root = Path(name)
    scripts = root / 'scripts/restaurant'
    data = root / 'src/data/restaurant'
    reports = root / 'docs/ssw-workspace/restaurant'
    scripts.mkdir(parents=True)
    (data / 'translations').mkdir(parents=True)
    reports.mkdir(parents=True)
    shutil.copyfile(SCRIPT, scripts / SCRIPT.name)
    lessons = [{'id': 'lesson-a', 'objectiveJa': '具体的な目標A', 'sourceHash': 'lesson-a-hash'},
               {'id': 'lesson-b', 'objectiveJa': '具体的な目標B', 'sourceHash': 'lesson-b-hash'}]
    (data / 'lessons.1.ja.json').write_text(json.dumps({'lessons': lessons}))
    questions = [{'id': id, 'objectiveJa': objective, 'sourceHash': id + '-hash'} for id, objective in
                 [('qa', '具体的な目標A'), ('qb', '具体的な目標B'), ('qg', '一般的な目標')]]
    (data / 'exams.1.ja.json').write_text(json.dumps({'exams': [{'questions': questions}]}))
    shard = {'lessons': {'lesson-a': {'sourceHash': 'lesson-a-hash', 'objective': 'Specific A'},
                        'lesson-b': {'sourceHash': 'lesson-b-hash', 'objective': 'Specific B'}},
             'questions': {q['id']: {'sourceHash': q['sourceHash'], 'objective': 'Generic topic',
                                     'stem': 'Preserved prompt', 'options': ['A', 'B', 'C', 'D'],
                                     'explanation': 'Preserved explanation'} for q in questions},
             'ui': {'label': 'Preserved UI'}, 'glossary': {'term': 'Preserved glossary'}}
    target = data / 'translations/en.json'
    target.write_text(json.dumps(shard))

    def run(*args, check=True):
        return subprocess.run([sys.executable, '-B', str(scripts / SCRIPT.name), *args],
                              capture_output=True, text=True, check=check)

    before = target.read_bytes()
    run()
    assert target.read_bytes() == before, 'Dry run must not write translations'
    run('--apply')
    aligned = json.loads(target.read_text())
    assert aligned['questions']['qa']['objective'] == 'Specific A'
    assert aligned['questions']['qb']['objective'] == 'Specific B'
    assert aligned['questions']['qg']['objective'] == 'Generic topic', 'No inferred lesson match'
    expected = json.loads(json.dumps(shard))
    expected['questions']['qa']['objective'] = 'Specific A'
    expected['questions']['qb']['objective'] = 'Specific B'
    assert aligned == expected, 'Only the exact-matched objective fields may change'
    assert sum(x['changedQuestionObjectives'] for x in json.loads(run().stdout)['locales']) == 0

    stale = json.loads(json.dumps(shard))
    stale['lessons']['lesson-b']['sourceHash'] = 'old-lesson'
    target.write_text(json.dumps(stale))
    run('--apply')
    assert json.loads(target.read_text())['questions']['qb']['objective'] == 'Generic topic'
    stale['questions']['qa']['sourceHash'] = 'old-question'
    target.write_text(json.dumps(stale))
    assert run('--apply', check=False).returncode != 0, 'Never silently rebind a stale question'

print(json.dumps({'status': 'PASS', 'cases': [
    'dry run does not write', 'exact source lesson text restores specific objectives',
    'unmatched generic objective remains explicit', 'all other fields and hashes preserved',
    'second run is idempotent', 'stale lesson translation is excluded',
    'stale question translation is rejected',
], 'nativeReviewed': False}))
