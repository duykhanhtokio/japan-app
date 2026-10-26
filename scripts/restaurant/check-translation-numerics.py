"""Numeric preservation screen for existing complete lesson translations; not semantic review."""
from pathlib import Path
import json,re,unicodedata,collections
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant'
lessons={l['id']:l for p in DATA.glob('lessons.*.ja.json') for l in json.loads(p.read_text())['lessons']}
def numbers(s):
 s=''.join(str(unicodedata.digit(c)) if c.isdecimal() else c for c in unicodedata.normalize('NFKC',s))
 return collections.Counter(re.findall(r'[0-9]+(?:\.[0-9]+)?',s))
flags=[];fields=records=0
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
report={'status':'REVIEW_FLAGS' if flags else 'NUMERIC_SCREEN_PASS','records':records,'fields':fields,'flags':flags,'semanticTranslationCertified':False,'limits':['Numbers spelled out as words require manual review. Equal digits do not establish preserved units, signs, conditions or meaning.']}
(ROOT/'docs/ssw-workspace/restaurant/translation-numeric-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
