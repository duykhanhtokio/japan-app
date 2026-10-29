"""Verify exact-field annotation integrity and learner-visible kanji coverage.
Coverage is not certification of pronunciation or native/domain review.
"""
from pathlib import Path
import json,hashlib,re,collections
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/restaurant'
def sha(text):return hashlib.sha256(text.encode()).hexdigest()
def token_lists(value):
 if isinstance(value,list):
  if value and all(isinstance(t,dict) and 'text' in t for t in value):yield value
  else:
   for child in value:yield from token_lists(child)
 elif isinstance(value,dict):
  for child in value.values():yield from token_lists(child)
fields={};uncovered=[];count=0
for p in DATA.glob('*.ja.json'):
 for tokens in token_lists(json.loads(p.read_text())):
  count+=1;text=''.join(t['text'] for t in tokens);key=sha(text);fields[key]=(text,tokens)
  for t in tokens:
   if re.search('[一-龯々〆ヵヶ]',t['text']) and not t.get('reading'):uncovered.append({'file':p.name,'text':t['text']})
context=json.loads((DATA/'context-readings.json').read_text());spans=0
for key,value in context['fields'].items():
 assert key in fields,('stale field annotation',key)
 text,tokens=fields[key];assert value['textLength']==len(text)
 actual={};offset=0
 for t in tokens:actual[(offset,offset+len(t['text']))]=t;offset+=len(t['text'])
 end=0
 for item in value['spans']:
  a,b=item['start'],item['end'];assert end<=a<b<=len(text)
  assert text[a:b]==item['text'] and re.fullmatch('[ぁ-ゖー]+',item['reading'])
  assert actual.get((a,b))=={'text':item['text'],'reading':item['reading']},('annotation not emitted',key,item)
  end=b;spans+=1
assert count==7358,('unexpected canonical field scope',count)
assert not uncovered,uncovered[:10]
report={'status':'CONTEXT_ALIGNMENT_PASS','canonicalFields':count,'uncoveredFields':0,'exactFieldHashes':len(context['fields']),'uniqueAnnotationSpans':spans,'pronunciationCertified':False,'nativeReviewed':False,'domainReviewed':False,'scope':'Japanese lesson title/objective/paragraph title/text/summary/activity and question stem/options/explanation. Not all UI, Arabic-number pronunciation or external review.'}
(ROOT/'docs/ssw-workspace/restaurant/context-reading-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
