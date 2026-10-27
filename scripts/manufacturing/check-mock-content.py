"""Validate published mock identities, section rules and source bindings."""
from pathlib import Path
import json,hashlib,collections
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/manufacturing'
def h(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()


def validate_translations(translations, questions, expected_locales):
 """Require the complete revision-bound translation snapshot, not partial entries."""
 expected_locales=set(expected_locales)
 assert set(translations)==expected_locales, 'Mock translation locale set differs from approved scope'
 expected_ids=set(questions)
 coverage={}
 for locale,entries in translations.items():
  assert set(entries)==expected_ids, f'{locale}: missing or extra mock translation question IDs'
  for qid,t in entries.items():
   question=questions[qid]
   assert t['sourceHash']==question['sourceHash'], f'{locale}/{qid}: stale source hash'
   assert isinstance(t['stem'],str) and t['stem'].strip(), f'{locale}/{qid}: empty stem'
   assert len(t['options'])==len(question['optionsJa']), f'{locale}/{qid}: option count mismatch'
   assert len(t['reasons'])==len(question['optionsJa']), f'{locale}/{qid}: rationale count mismatch'
   assert all(isinstance(value,str) and value.strip() for value in t['options']+t['reasons']), f'{locale}/{qid}: empty option or rationale'
  coverage[locale]=len(entries)
 return coverage

ids=set();stems=set();questions={};report={}
for specialty in ['mechanical','electrical','surface']:
 lessons={l['id']:l for l in json.loads((DATA/f'{specialty}.json').read_text())['lessons']};covered=set();forms=json.loads((DATA/f'mocks/{specialty}.json').read_text())['exams'];assert len(forms)==10
 practical_positions=collections.Counter()
 for exam in forms:
  assert exam['specialty']==specialty and exam['id'] not in ids;ids.add(exam['id']);assert exam['revision']=='v1-'+h(exam['sections'])[:16]
  for section,count,minimum,choices in [('theory',30,20,2),('practical',10,6,4)]:
   s=exam['sections'][section];assert s['durationMs']==2400000 and s['passMinimumCorrect']==minimum and len(s['questions'])==count
   positions=[]
   for q in s['questions']:
    assert q['id'] not in questions and q['stemJa'] not in stems
    questions[q['id']]=q;stems.add(q['stemJa']);covered.add(q['lessonId']);assert q['lessonId'] in lessons
    assert q.get('lessonSourceHash',lessons[q['lessonId']]['sourceHash'])==lessons[q['lessonId']]['sourceHash']
    assert len(q['optionsJa'])==choices and len(q['optionReasonsJa'])==choices and all(t.strip() for t in q['optionsJa']+q['optionReasonsJa'])
    assert 0<=q['correctIndex']<choices and q['knowledgeIds'] and q['sources'];assert q['sourceHash']==h({k:v for k,v in q.items() if k!='sourceHash'})
    positions.append(q['correctIndex'])
   assert all(not(a==b==c) for a,b,c in zip(positions,positions[1:],positions[2:])),exam['id']
   if section=='theory':assert sorted(collections.Counter(positions).values())==[15,15]
   else:assert sorted(collections.Counter(positions).values())==[2,2,3,3];practical_positions.update(positions)
  assert exam['sections']['theory']['id']!=exam['sections']['practical']['id']
 assert covered==set(lessons);assert list(sorted(practical_positions.values()))==[25]*4
 report[specialty]={'exams':10,'questions':400,'coveredLessons':len(covered),'distinctStems':400}
ruby=json.loads((DATA/'mock-furigana.json').read_text());assert len(ruby['questions'])==1200 and ruby['unknownKanjiCount']==0
for qid,q in questions.items():
 r=ruby['questions'][qid];assert r['sourceHash']==q['sourceHash'];assert ''.join(p['text'] for p in r['stem'])==q['stemJa']
 assert len(r['options'])==len(q['optionsJa']),qid
 for parts,text in zip(r['options'],q['optionsJa']):assert ''.join(p['text'] for p in parts)==text
translations=json.loads((DATA/'mock-translations.json').read_text())['locales']
scope=json.loads((ROOT/'docs/ssw-workspace/manufacturing/approved-scope.json').read_text())
assert len(scope['targetLocales'])==len(set(scope['targetLocales']))==12
coverage=validate_translations(translations,questions,scope['targetLocales'])
print(json.dumps({'status':'PASS','specialties':report,'totalExams':len(ids),'totalQuestions':len(questions),'mockTranslationCoverage':coverage,'rubyExactTextAligned':True,'nativeReviewed':False}))
