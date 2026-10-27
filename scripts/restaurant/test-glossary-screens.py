"""Regression: glossary definitions participate in numeric and signed-Celsius QA."""
from pathlib import Path
import json
import shutil
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent

with tempfile.TemporaryDirectory(prefix='restaurant-glossary-screen-') as name:
    root = Path(name)
    scripts = root / 'scripts/restaurant'
    data = root / 'src/data/restaurant'
    reports = root / 'docs/ssw-workspace/restaurant'
    scripts.mkdir(parents=True)
    (data / 'translations').mkdir(parents=True)
    reports.mkdir(parents=True)
    for filename in ('check-translation-numerics.py', 'check-translation-temperatures.py'):
        shutil.copyfile(HERE / filename, scripts / filename)
    source = {'groups': [{'entries': [
        {'id': 'core', 'termJa': '加熱', 'explanationJa': '75℃で1分。'},
        {'id': 'cold', 'termJa': '冷凍', 'explanationJa': '−20℃。'},
    ]}]}
    (data / 'glossary.ja.json').write_text(json.dumps(source, ensure_ascii=False))
    target = {'lessons': {}, 'questions': {}, 'glossary': {
        'core': {'term': 'Heating', 'explanation': '75°C for 1 minute.'},
        'cold': {'term': 'Freezing', 'explanation': '−20°C.'},
    }}

    def screen(script, report):
        (data / 'translations/en.json').write_text(json.dumps(target, ensure_ascii=False))
        subprocess.run([sys.executable, '-B', str(scripts / script)], check=True, capture_output=True)
        return json.loads((reports / report).read_text())

    numeric = ('check-translation-numerics.py', 'translation-numeric-screen.json')
    temperature = ('check-translation-temperatures.py', 'translation-temperature-screen.json')
    baseline = screen(*numeric)
    assert baseline['glossaryRecords'] == 2 and not baseline['flags']
    assert not screen(*temperature)['flags']
    target['glossary']['core']['explanation'] = '74°C for 1 minute.'
    assert any(f.get('glossaryId') == 'core' for f in screen(*numeric)['flags'])
    target['glossary']['core']['explanation'] = '75°C for 1 minute.'
    target['glossary']['cold']['explanation'] = '20°C.'
    assert not screen(*numeric)['flags'], 'A sign error alone preserves the digit counter.'
    assert any(f.get('glossaryId') == 'cold' for f in screen(*temperature)['flags'])

print(json.dumps({'status': 'PASS', 'cases': [
    'matching glossary numerals and Celsius signs accepted',
    'changed glossary numeral produces a glossary-ID flag',
    'lost minus sign detected independently of matching digits',
], 'semanticTranslationCertified': False}))
