from pathlib import Path
import json,re
P=Path(__file__).resolve().parent;R=P.parents[6];MEM={};PROV={}
def add(a,b,origin):
 if a in MEM and MEM[a]!=b:return
 MEM[a]=b;PROV[a]=origin
s=json.load(open(R/'src/data/manufacturing/mechanical.json'));lt={};qt={}
for f in sorted(P.glob('root-tl-lessons*.json')):lt.update(json.load(open(f))['lessons'])
for f in sorted(P.glob('root-tl-weekly*.json')):qt.update(json.load(open(f))['questions'])
for l in s['lessons']:
 t=lt[l['id']]
 for a,b in zip(l['paragraphs'],t['paragraphs']):add(a['textJa'],b['text'],l['id']+'.'+a['id'])
 for a,b in [(l['titleJa'],t['title']),(l['objectiveJa'],t['objective']),(l['summaryJa'],t['summary'])]:add(a,b,l['id'])
for c in s['checks']:
 for q in c['questions']:
  t=qt[q['id']]
  for a,b in zip([q['stemJa']]+q['optionsJa']+q['optionReasonsJa'],[t['stem']]+t['options']+t['reasons']):add(a,b,q['id'])
# Full source-bound text only; manual mappings may include reviewed individual sentences.
for f in sorted(P.glob('root-mock-author-*.json')):
 for a,b in json.load(open(f))['exactJaTranslations'].items():add(a,b,f.name)
PREFIX={'正しい。':'Tama. ','誤り。':'Mali. ','この文を正しいとする選択は適切でない。':'Hindi angkop na piliing tama ang pahayag na ito. ','この文を誤りとする選択は適切でない。':'Hindi angkop na piliing mali ang pahayag na ito. '}
add('正しい','Tama','fixed-choice');add('誤り','Mali','fixed-choice')
def tr(a):
 if a in MEM:return MEM[a]
 for pre,out in PREFIX.items():
  if a.startswith(pre) and a[len(pre):] in MEM:return out+MEM[a[len(pre):]]
 if re.fullmatch(r'[0-9a-zA-ZΩ℃μ²³%＋－−+*/÷×=＝. :〜～°±φRSt□()\-]+',a):return a
 return None
mock=json.load(open(R/'src/data/manufacturing/mocks/mechanical.json'));out={};missing={};byform={}
for e in mock['exams']:
 for sec in e['sections'].values():
  for q in sec['questions']:
   fields=[q['stemJa']]+q['optionsJa']+q['optionReasonsJa'];ts=[tr(a) for a in fields]
   for a,b in zip(fields,ts):
    if b is None:missing.setdefault(a,[]).append(q['id'])
   if all(ts):out[q['id']]={'sourceHash':q['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','stem':ts[0],'options':ts[1:1+len(q['optionsJa'])],'reasons':ts[1+len(q['optionsJa']):]};byform[e['id']]=byform.get(e['id'],0)+1
(P/'root-mock-memory.json').write_text(json.dumps({'entries':MEM,'provenance':PROV},ensure_ascii=False,indent=2)+'\n')
(P/'root-mock-missing.json').write_text(json.dumps(missing,ensure_ascii=False,indent=2)+'\n')
(P/'root-tl-mocks.json').write_text(json.dumps({'locale':'tl','nativeReviewed':False,'domainReviewed':False,'questions':out},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'completeMockQuestions':len(out),'uniqueMissingFields':len(missing),'byForm':byform}))
