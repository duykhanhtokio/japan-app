from pathlib import Path
import json,re,hashlib
OUT=Path(__file__).parent;ROOT=OUT.parents[6]
s=json.loads((ROOT/'src/data/manufacturing/surface.json').read_text());mock=json.loads((ROOT/'src/data/manufacturing/mocks/surface.json').read_text())
ls={x['id']:x for x in s['lessons']};qs={q['id']:q for c in s['checks'] for q in c['questions']};ms={q['id']:q for e in mock['exams'] for sec in e['sections'].values() for q in sec['questions']}
lessons={};questions={};chunks=[]
for f in sorted(OUT.glob('*.json')):
 if not f.name.startswith(('lessons-','weekly-','mock-')):continue
 d=json.loads(f.read_text());lessons.update(d.get('lessons',{}));questions.update(d.get('questions',{}));chunks.append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
issues=[];fields=0
foreign=re.compile('[\u3040-\u30ff\u3400-\u9fff\u0e00-\u0e7f\u1780-\u17ff]')
def texts(values,id):
 global fields
 for value in values:
  fields+=1
  if not isinstance(value,str) or not value.strip():issues.append([id,'blank'])
  elif foreign.search(value):issues.append([id,'foreign',value])
def numbers(ja,bn,id):
 a=set(re.findall(r'\d+(?:\.\d+)?',' '.join(ja)));b=set(re.findall(r'\d+(?:\.\d+)?',' '.join(bn)))
 if a!=b:issues.append([id,'numeric-set',sorted(a-b),sorted(b-a)])
for id,l in ls.items():
 t=lessons.get(id)
 if not t:issues.append([id,'missing']);continue
 if t['sourceHash']!=l['sourceHash']:issues.append([id,'hash'])
 if [x['id'] for x in t['paragraphs']]!=[x['id'] for x in l['paragraphs']]:issues.append([id,'paragraphs'])
 if [(x['ja'],x['reading']) for x in t['terms']]!=[(x['ja'],x['reading']) for x in l['terms']]:issues.append([id,'terms'])
 if len(t['safety'])!=len(l['safetyJa']):issues.append([id,'safety'])
 if t.get('translatedDirectlyFrom')!='ja' or t.get('nativeReviewed')!=False:issues.append([id,'metadata'])
 ja=[l['titleJa'],l['objectiveJa'],l['activityJa'],l['summaryJa'],*l['safetyJa'],*[x[k] for x in l['paragraphs'] for k in ('titleJa','textJa')],*[x['meaningJa'] for x in l['terms']]]
 bn=[t['title'],t['objective'],t['activity'],t['summary'],*t['safety'],*[x[k] for x in t['paragraphs'] for k in ('title','text')],*[x['meaning'] for x in t['terms']]]
 texts(bn,id);numbers(ja,bn,id)
for id,q in {**qs,**ms}.items():
 t=questions.get(id)
 if not t:issues.append([id,'missing']);continue
 rs=t.get('reasons',t.get('optionReasons',[]))
 if t.get('sourceHash')!=q['sourceHash']:issues.append([id,'hash'])
 if len(t['options'])!=len(q['optionsJa']) or len(rs)!=len(q['optionReasonsJa']):issues.append([id,'option-shape'])
 if t.get('translatedDirectlyFrom')!='ja' or t.get('nativeReviewed')!=False:issues.append([id,'metadata'])
 bn=[t['stem'],*t['options'],*rs];texts(bn,id);numbers([q['stemJa'],*q['optionsJa'],*q['optionReasonsJa']],bn,id)
report={'locale':'bn','specialty':'surface','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'independentlyReviewed':False,'completedLessons':len(lessons),'completedWeeklyQuestions':sum(k in qs for k in questions),'completedMockQuestions':sum(k in ms for k in questions),'translatedTextFields':fields,'validation':'structural source bindings, IDs, term/readings order, all text fields nonempty, perentry draft metadata, numeric set preservation and foreign script scan','issues':issues,'chunks':chunks}
(OUT/'bn-surface-completion-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='chunks'},ensure_ascii=False,indent=2));assert not issues
