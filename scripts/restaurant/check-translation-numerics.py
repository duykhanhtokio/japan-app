"""Numeric preservation screen for existing complete lesson translations; not semantic review."""
from pathlib import Path
import json,re,unicodedata,collections,hashlib
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant'
lessons={l['id']:l for p in DATA.glob('lessons.*.ja.json') for l in json.loads(p.read_text())['lessons']}
questions={q['id']:q for p in DATA.glob('exams.*.ja.json') for e in json.loads(p.read_text())['exams'] for q in e['questions']}
def numbers(s):
 s=''.join(str(unicodedata.digit(c)) if c.isdecimal() else c for c in unicodedata.normalize('NFKC',s))
 return collections.Counter(re.findall(r'[0-9]+(?:\.[0-9]+)?',s))
flags=[];fields=records=question_records=0
reviewPath=ROOT/'docs/ssw-workspace/restaurant/translation-numeric-adjudications.json'
reviewed=json.loads(reviewPath.read_text()).get('records',[]) if reviewPath.exists() else []
def adjudicated(locale,id,field,ja,tr):
 return any(z.get('locale')==locale and z.get('questionId')==id and z.get('field')==field and z.get('status')=='AI_reviewed_spelled_out_ordinal' and z.get('fieldSourceHash')==hashlib.sha256(ja.encode()).hexdigest() and z.get('fieldTranslationHash')==hashlib.sha256(tr.encode()).hexdigest() for z in reviewed)
acceptedOrdinalFields=0
for p in (DATA/'translations').glob('*.json'):
 x=json.loads(p.read_text())
 for key,t in x['lessons'].items():
  l=lessons.get(key)
  if not l:continue
  records+=1
  pairs=[('title',l['titleJa'],t.get('title','')),('objective',l['objectiveJa'],t.get('objective','')),('summary',l['summaryJa'],t.get('summary','')),('activity',l['activityJa'],t.get('activity',''))]
  for para in l['paragraphs']:pairs.append((para['id'],para['textJa'],t.get('paragraphs',{}).get(para['id'],'')))
  for field,ja,tr in pairs:
   fields+=1
   if numbers(ja)!=numbers(tr):flags.append({'locale':p.stem,'lessonId':key,'field':field,'sourceNumbers':dict(numbers(ja)),'translationNumbers':dict(numbers(tr)),'reason':'different numerals; inspect spelling-out/local conventions versus omission'})
 for key,t in x.get('questions',{}).items():
  q=questions.get(key)
  if not q:continue
  question_records+=1
  pairs=[('stem',q['stemJa'],t.get('stem','')),('explanation',q['explanationJa'],t.get('explanation','')),('objective',q['objectiveJa'],t.get('objective',''))]
  for i,option in enumerate(q['optionsJa']):pairs.append(('option'+str(i),option,t.get('options',[])[i] if i<len(t.get('options',[])) else ''))
  for field,ja,tr in pairs:
   fields+=1
   if numbers(ja)!=numbers(tr) and adjudicated(p.stem,key,field,ja,tr):acceptedOrdinalFields+=1;continue
   if numbers(ja)!=numbers(tr):flags.append({'locale':p.stem,'questionId':key,'field':field,'sourceNumbers':dict(numbers(ja)),'translationNumbers':dict(numbers(tr)),'reason':'different numerals; inspect spelling-out/local conventions versus omission'})
report={'status':'REVIEW_FLAGS' if flags else 'NUMERIC_SCREEN_PASS','records':records,'questionRecords':question_records,'fields':fields,'reviewedSpelledOrdinalFields':acceptedOrdinalFields,'flags':flags,'semanticTranslationCertified':False,'limits':['Numbers spelled out as words require manual review. Equal digits do not establish preserved units, signs, conditions or meaning.']}
(ROOT/'docs/ssw-workspace/restaurant/translation-numeric-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
