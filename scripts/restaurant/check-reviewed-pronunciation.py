"""Keep the independently identified exact-context pronunciation repairs reproducible."""
from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant';WORK=ROOT/'docs/ssw-workspace/restaurant'
def lists(x):
 if isinstance(x,list):
  if x and all(isinstance(t,dict) and 'text' in t for t in x):yield x
  else:
   for v in x:yield from lists(v)
 elif isinstance(x,dict):
  for v in x.values():yield from lists(v)
fields={}
for p in DATA.glob('*.ja.json'):
 for ts in lists(json.loads(p.read_text())):
  text=''.join(t['text'] for t in ts);offset=0;tokens={}
  for t in ts:tokens[offset,offset+len(t['text'])]=t;offset+=len(t['text'])
  fields[hashlib.sha256(text.encode()).hexdigest()]=(text,tokens)
fixes=json.loads((WORK/'completion25-semantic-pronunciation-fixes.json').read_text())
for f in fixes['readingFixes']:
 text,tokens=fields[f['fieldHash']];a,b=f['start'],f['end']
 assert text[a:b]==f['surface']
 assert tokens[a,b]=={'text':f['surface'],'reading':f['afterReading']},f
vi=json.loads((DATA/'translations/vi.json').read_text())
for f in fixes['translationFixes']:
 node=vi
 for k in f['jsonPath']:node=node[k]
 assert node==f['after']
 assert vi['questions'][f['recordId']]['sourceHash']==f['sourceHash']
report={'status':'REVIEWED_REPAIRS_PASS','pronunciationRepairs':len(fixes['readingFixes']),'translationFields':len(fixes['translationFixes']),'scope':'Exact reviewed repairs only; does not certify all pronunciations/translations.','nativeReviewed':False,'domainReviewed':False}
(WORK/'completion25-pronunciation-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
