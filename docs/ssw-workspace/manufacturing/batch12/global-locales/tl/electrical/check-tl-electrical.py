from pathlib import Path
import json,re,hashlib
OUT=Path(__file__).parent;ROOT=OUT.parents[6]
s=json.loads((ROOT/'src/data/manufacturing/electrical.json').read_text());src={x['id']:x for x in s['lessons']};issues=[];fields=0;chunks=[]
for f in sorted(OUT.glob('lesson-*.json')):
 d=json.loads(f.read_text());assert d['locale']=='tl' and d['status']=='ai_translated_draft' and all(d[k] is False for k in ['nativeReviewed','domainReviewed','independentlyReviewed']);chunks.append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
 for id,t in d['lessons'].items():
  l=src[id];assert t['sourceHash']==l['sourceHash'] and t['translatedDirectlyFrom']=='ja' and t['nativeReviewed']==False and t['domainReviewed']==False
  assert [p['id'] for p in t['paragraphs']]==[p['id'] for p in l['paragraphs']]
  assert [(p['ja'],p['reading']) for p in t['terms']]==[(p['ja'],p['reading']) for p in l['terms']]
  assert len(t['safety'])==len(l['safetyJa'])
  a=[l['titleJa'],l['objectiveJa'],l['activityJa'],l['summaryJa'],*l['safetyJa'],*[v[k] for v in l['paragraphs'] for k in ['titleJa','textJa']],*[v['meaningJa'] for v in l['terms']]]
  b=[t['title'],t['objective'],t['activity'],t['summary'],*t['safety'],*[v[k] for v in t['paragraphs'] for k in ['title','text']],*[v['meaning'] for v in t['terms']]]
  fields+=len(b)
  na=set(re.findall(r'\d+(?:\.\d+)?',' '.join(a)));nb=set(re.findall(r'\d+(?:\.\d+)?',' '.join(b)))
  if na!=nb:issues.append([id,'numeric',sorted(na-nb),sorted(nb-na)])
  for v in b:
   if not v.strip():issues.append([id,'empty'])
   if re.search('[\u3041-\u3096\u30a1-\u30fa\u3400-\u9fff\u0980-\u09ff\uac00-\ud7af\u200b]',v):issues.append([id,'foreign',v])
qsrc={q['id']:q for c in s['checks'] for q in c['questions']};qcount=0;mockcount=0
m=json.loads((ROOT/'src/data/manufacturing/mocks/electrical.json').read_text())
for exam in m['exams']:
 for section in exam['sections'].values():
  for q in section['questions']:qsrc[q['id']]=q
for f in sorted([*OUT.glob('weekly-*.json'),*OUT.glob('mock-*.json')]):
 d=json.loads(f.read_text());assert d['locale']=='tl' and d['status']=='ai_translated_draft' and all(d[k] is False for k in ['nativeReviewed','domainReviewed','independentlyReviewed']);chunks.append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
 for id,t in d['questions'].items():
  q=qsrc[id]
  if f.name.startswith('mock-'):mockcount+=1
  else:qcount+=1
  assert t['sourceHash']==q['sourceHash'] and t['translatedDirectlyFrom']=='ja' and t['nativeReviewed']==False and t['domainReviewed']==False
  assert len(t['options'])==len(q['optionsJa'])==len(t['reasons'])
  a=[q['stemJa'],*q['optionsJa'],*q['optionReasonsJa']];b=[t['stem'],*t['options'],*t['reasons']];fields+=len(b)
  na=set(re.findall(r'\d+(?:\.\d+)?',' '.join(a)));nb=set(re.findall(r'\d+(?:\.\d+)?',' '.join(b)))
  if na!=nb:issues.append([id,'numeric',sorted(na-nb),sorted(nb-na)])
  for v in b:
   if not v.strip():issues.append([id,'empty'])
   if re.search('[\u3041-\u3096\u30a1-\u30fa\u3400-\u9fff\u0980-\u09ff\uac00-\ud7af\u200b]',v):issues.append([id,'foreign',v])
report={'locale':'tl','specialty':'electrical','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'completedLessons':len(list(OUT.glob('lesson-*.json'))),'completedWeeklyQuestions':qcount,'completedMockQuestions':mockcount,'translatedTextFields':fields,'checks':'sourcehash,paragraph IDs/order,glossary/readings/order,safety count,all text fields,numeric sets,foreign prose scan,perentry JA binding metadata','issues':issues,'chunks':chunks}
assert len(src)==98 and qcount==168 and mockcount==400 and fields==5390
(OUT/'tl-electrical-completion-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='chunks'},ensure_ascii=False,indent=2));assert not issues
