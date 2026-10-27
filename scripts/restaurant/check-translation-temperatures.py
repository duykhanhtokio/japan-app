"""Screen signed Celsius numerals; lexical unit rendering still needs language review."""
from pathlib import Path
import json,re,unicodedata,collections,hashlib
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant'
def values(text):
 text=unicodedata.normalize('NFKC',text).replace('−','-').replace('–','-')
 text=''.join(str(unicodedata.digit(c)) if c.isdecimal() else c for c in text)
 # Localized minus words directly before a numeral preserve its sign.
 text=re.sub(r'(?<!\w)(?:âm|minus|माइनस|ऋण|အနုတ်|ลบ|ដក|零下)\s*(\d)',r'-\1',text,flags=re.I)
 return collections.Counter(re.findall(r'(?<![\d.])([+-]?\d+(?:\.\d+)?)\s*°\s*C',text,flags=re.I))
# Regression cases: Celsius signs, Vietnamese tâm versus âm, and bow angles.
assert values('−20℃')==collections.Counter({'-20':1})
assert values('nhiệt độ tâm 75°C')==collections.Counter({'75':1})
assert values('âm 20°C')==collections.Counter({'-20':1})
assert values('15度、30度、45度')==collections.Counter()
assert values('85–90℃')==collections.Counter({'90':1})
lessons={l['id']:l for p in DATA.glob('lessons.*.ja.json') for l in json.loads(p.read_text())['lessons']}
questions={q['id']:q for p in DATA.glob('exams.*.ja.json') for e in json.loads(p.read_text())['exams'] for q in e['questions']}
glossary={entry['id']:entry for group in json.loads((DATA/'glossary.ja.json').read_text())['groups'] for entry in group['entries']}
flags=[];screened=0
for path in (DATA/'translations').glob('*.json'):
 x=json.loads(path.read_text())
 for kind,source in [('lessons',lessons),('questions',questions)]:
  for id,t in x.get(kind,{}).items():
   s=source.get(id)
   if not s:continue
   pairs=[('title',s['titleJa'],t.get('title','')),('objective',s['objectiveJa'],t.get('objective','')),('summary',s['summaryJa'],t.get('summary','')),('activity',s['activityJa'],t.get('activity',''))]+[(p['id'],p['textJa'],t.get('paragraphs',{}).get(p['id'],'')) for p in s['paragraphs']] if kind=='lessons' else [('stem',s['stemJa'],t.get('stem','')),('explanation',s['explanationJa'],t.get('explanation','')),('objective',s['objectiveJa'],t.get('objective',''))]+[('option'+str(i),v,t.get('options',['']*4)[i]) for i,v in enumerate(s['optionsJa'])]
   for field,ja,tr in pairs:
    a,b=values(ja),values(tr)
    if not a and not b:continue
    screened+=1
    if a!=b:flags.append({'locale':path.stem,'id':id,'field':field,'sourceSignedCelsiusValues':dict(a),'targetSignedCelsiusValues':dict(b),'sourceFieldHash':hashlib.sha256(ja.encode()).hexdigest(),'targetFieldHash':hashlib.sha256(tr.encode()).hexdigest()})
 for id,t in x.get('glossary',{}).items():
  g=glossary.get(id)
  if not g:continue
  for field,ja,tr in [('term',g['termJa'],t.get('term','')),('explanation',g.get('explanationJa',''),t.get('explanation',''))]:
   a,b=values(ja),values(tr)
   if not a and not b:continue
   screened+=1
   if a!=b:flags.append({'locale':path.stem,'glossaryId':id,'field':field,'sourceSignedCelsiusValues':dict(a),'targetSignedCelsiusValues':dict(b),'sourceFieldHash':hashlib.sha256(ja.encode()).hexdigest(),'targetFieldHash':hashlib.sha256(tr.encode()).hexdigest()})
report={'status':'CANDIDATES_REQUIRE_REVIEW' if flags else 'SIGNED_CELSIUS_SCREEN_PASS','screenedFields':screened,'flags':flags,'safetyCertified':False,'limits':['Lexical units such as degrees Celsius written without a degree symbol may generate candidates.','Equal temperature numerals do not verify signs in prose, comparison direction, minimum durations, exemptions or overall safety.']}
(ROOT/'docs/ssw-workspace/restaurant/translation-temperature-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'status':report['status'],'screenedFields':screened,'flags':len(flags)}))
