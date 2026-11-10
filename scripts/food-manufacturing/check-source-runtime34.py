"""Check current source companions, exercises, translations and ruby bindings."""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / 'src/data/food-manufacturing'
AUDIT = ROOT / 'docs/ssw-workspace/food-manufacturing/source-closure-20261031'
read = lambda p: json.loads(p.read_text())
digest = lambda v: hashlib.sha256(json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',', ':')).encode()).hexdigest()


def main():
    lessons = {}
    for path in [DATA/'lessons.1.ja.json',DATA/'lessons.2.ja.json',*sorted((DATA/'authoring-20261029').glob('part*.json'))]:
        lessons.update({l['id']:l for l in read(path)['lessons']})
    sections = read(DATA/'source-closure34.json')['sections']
    checks = read(DATA/'source-assessment34.json')['checks']
    raw = {s['id']:s for name in ['source-teaching34.json','source-teaching34-tail.json'] for s in read(AUDIT/name)['sections']}
    source_checks = {c['id']:c for c in read(AUDIT/'assessment-link34.json')['newOpenResponseChecks']}
    fields = 0
    def ruby(text, tokens):
        nonlocal fields
        assert ''.join(t['text'] for t in tokens)==text
        assert all(t.get('reading') for t in tokens if re.search(r'[一-龯]',t['text']))
        fields += 1
    assert len(sections)==len(raw)==36 and len(checks)==len(source_checks)==20
    for s in sections:
        assert s['lessonSourceHash']==lessons[s['lessonId']]['sourceHash']
        assert s['textJa']==raw[s['id']]['textJa']+'\n\n'+raw[s['id']]['checkPromptJa']
        assert s['sourceHash']==digest({k:s[k] for k in ['titleJa','textJa']})
        ruby(s['titleJa'],s['titleRuby']);ruby(s['textJa'],s['ruby'])
        assert len(s['translations'])==12
        for t in s['translations'].values():
            assert t['sourceHash']==s['sourceHash'] and t['title'].strip() and t['text'].strip()
    for c in checks:
        assert c['lessonSourceHash']==lessons[c['lessonId']]['sourceHash']
        assert c['sourceHash']==digest({k:c[k] for k in ['titleJa','promptJa','expectedPointsJa']})
        for key in ['titleJa','promptJa','expectedPointsJa']:
            assert c[key]==source_checks[c['id']][key]
        ruby(c['titleJa'],c['titleRuby']);ruby(c['promptJa'],c['promptRuby'])
        for text,tokens in zip(c['expectedPointsJa'],c['expectedPointsRuby']):ruby(text,tokens)
        assert len(c['translations'])==12 and c['runtimeIntegrated'] is True
        for t in c['translations'].values():
            assert t['sourceHash']==c['sourceHash'] and t['title'].strip() and t['prompt'].strip()
            assert len(t['expectedPoints'])==len(c['expectedPointsJa'])
            assert all(point.strip() for point in t['expectedPoints'])
    energy = next(s for s in sections if s['id']=='food34-energy-design')
    assert any(t['text']=='角' and t.get('reading')=='かど' for t in energy['ruby'])
    result = {'status':'PASS','runtimeLessons':len(lessons),'sourceTeachingSections':len(sections),
              'sectionLocalePairs':len(sections)*12,'openResponseChecks':len(checks),
              'checkLocalePairs':len(checks)*12,'expectedPoints':sum(len(c['expectedPointsJa']) for c in checks),
              'alignedRubyFields':fields,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False}
    (AUDIT/'runtime34-validation.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result))


if __name__ == '__main__':main()
