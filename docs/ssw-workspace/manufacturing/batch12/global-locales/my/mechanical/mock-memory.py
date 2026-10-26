import json,re
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[6];MEM={};provenance=[]
def add(a,b,origin):
 if a in MEM and MEM[a]!=b:return
 MEM[a]=b;provenance.append([origin,a,b])
s=json.loads((R/'src/data/manufacturing/mechanical.json').read_text());t=json.loads((P/'lessons.json').read_text())['lessons']
for l in s['lessons']:
 d=t[l['id']]
 for a,b in zip(l['paragraphs'],d['paragraphs']):
  add(a['textJa'],b['text'],l['id']+'.'+a['id'])
  aa=re.findall(r'.*?。',a['textJa']);bb=re.findall(r'.*?။',b['text'])
  if len(aa)==len(bb):
   for x,y in zip(aa,bb):add(x.strip(),y.strip(),l['id']+'.'+a['id']+'.sentence')
 for a,b in [(l['titleJa'],d['title']),(l['objectiveJa'],d['objective']),(l['summaryJa'],d['summary'])]:add(a,b,l['id'])
for spec in ['mechanical','electrical']:
 src=json.loads((R/f'src/data/manufacturing/{spec}.json').read_text());tr=json.loads((P.parent/spec/'questions.json').read_text())['questions']
 for c in src['checks']:
  for q in c['questions']:
   if q['id'] not in tr:continue
   d=tr[q['id']]
   for a,b in zip([q['stemJa']]+q['optionsJa']+q['optionReasonsJa'],[d['stem']]+d['options']+d['reasons']):add(a,b,q['id'])
# Actual Japanese verdict prefixes only: never infer from correctIndex.
PREFIX={'正しい。':'မှန်သည်။','誤り。':'မှားသည်။','この文を正しいとする選択は適切でない。':'ဤစာကြောင်းကိုမှန်ဟုရွေးခြင်းမသင့်ပါ။','この文を誤りとする選択は適切でない。':'ဤစာကြောင်းကိုမှားဟုရွေးခြင်းမသင့်ပါ။'}
add('正しい','မှန်','fixed-choice');add('誤り','မှား','fixed-choice')
def tr(a):
 if a in MEM:return MEM[a]
 for pre,out in PREFIX.items():
  if a.startswith(pre) and a[len(pre):] in MEM:return out+MEM[a[len(pre):]]
 # numbers/units alone are unchanged
 if re.fullmatch(r'[0-9a-zA-ZΩ℃μ²³%＋－−+*/÷×=＝. :〜～°±φRSt□()\-]+',a):return a
 return None
for f in sorted(P.glob('mock-author-*.json')):
 for a,b in json.loads(f.read_text())['exactJaTranslations'].items():add(a,b,f.name)
mock=json.loads((R/'src/data/manufacturing/mocks/mechanical.json').read_text());out={};missing={};coverage=[]
for e in mock['exams']:
 for sec in e['sections'].values():
  for q in sec['questions']:
   fields=[q['stemJa']]+q['optionsJa']+q['optionReasonsJa'];trs=[tr(a) for a in fields]
   for a,b in zip(fields,trs):
    if b is None:missing.setdefault(a,[]).append(q['id'])
   if all(trs):out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':trs[0],'options':trs[1:1+len(q['optionsJa'])],'reasons':trs[1+len(q['optionsJa']):]}
(P/'mock-exact-memory.json').write_text(json.dumps({'locale':'my','entries':MEM,'provenance':provenance},ensure_ascii=False,indent=2)+'\n')
(P/'mock-missing-source.json').write_text(json.dumps(missing,ensure_ascii=False,indent=2)+'\n')
(P/'mocks.json').write_text(json.dumps({'locale':'my','questions':out},ensure_ascii=False,indent=2)+'\n')
print('memory',len(MEM),'complete mock',len(out),'unique missing',len(missing),'missing occurrences',sum(map(len,missing.values())))
