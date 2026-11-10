#!/usr/bin/env python3
"""Validate authored food content without pretending pending scope is complete."""
import collections, hashlib, json, pathlib, re, unicodedata
root=pathlib.Path(__file__).resolve().parents[2]
data=root/'src/data/food-manufacturing'
parts=[json.loads(p.read_text()) for p in sorted((data/'authoring-20261029').glob('part[1-6].json'))]
errors=[]
def check(ok,message):
 if not ok: errors.append(message)
def refs(items,label):
 check(bool(items),label+': missing sources')
 for ref in items:
  doc=ref.get('document'); p=ref.get('pdfPage'); printed=ref.get('printedPage')
  check(doc in ('ssw1','ssw2'),label+': invalid source')
  check(isinstance(p,int) and 1<=p<=({'ssw1':86,'ssw2':165}.get(doc,0)),label+': invalid PDF page')
  if printed is not None: check(p==printed+({'ssw1':5,'ssw2':9}.get(doc,0)),label+': wrong page offset')
lessons=[]
for level in ('1','2'):
 path=data/f'lessons.{level}.ja.json'
 if path.exists(): lessons+=json.loads(path.read_text())['lessons']
lessons += [l for part in parts for l in part.get('lessons',[])]
ids=set(); titles=set()
for l in lessons:
 label=l['id']; check(label not in ids,label+': duplicate ID'); ids.add(label)
 check(l['titleJa'] not in titles,label+': duplicate title'); titles.add(l['titleJa'])
 for key in ('titleJa','objectiveJa','activityJa','summaryJa'): check(bool(l.get(key,'').strip()),label+': empty '+key)
 check(l.get('level') in ('1','2'),label+': invalid level')
 check(l.get('week',0)>0 and 1<=l.get('day',0)<=7,label+': invalid calendar')
 check(len(l.get('paragraphs',[]))>=2,label+': too few explanation units')
 for p in l.get('paragraphs',[]):
  check(bool(p.get('titleJa')) and len(p.get('textJa',''))>=35,label+': short/empty paragraph')
 for t in l.get('terms',[]): check(bool(t.get('ja')) and bool(t.get('reading')),label+': missing term reading')
 refs(l.get('sourceRefs'),label)
 copy={k:v for k,v in l.items() if k!='sourceHash'}
 digest=hashlib.sha256(json.dumps(copy,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
 check(l.get('sourceHash')==digest,label+': source hash mismatch')
exams=json.loads((data/'exams.ja.json').read_text())['exams'] if (data/'exams.ja.json').exists() else []
exams += [e for part in parts for e in part.get('exams',[])]
qids=set(); prompts=set(); totals=collections.Counter(); weeklyTotals=collections.Counter()
for exam in exams:
 answers=[]
 for q in exam['questions']:
  label=q['id']; check(label not in qids,label+': duplicate ID'); qids.add(label)
  prompt=re.sub(r'\s+','',q['promptJa']);check(prompt not in prompts,label+': duplicate prompt');prompts.add(prompt)
  check(len(q['optionsJa'])==4 and len(set(q['optionsJa']))==4,label+': invalid choices')
  check(q['answerIndex'] in range(4),label+': invalid answer')
  check(bool(q.get('explanationJa')) and len(q.get('optionExplanationsJa',[]))==4,label+': missing explanations')
  refs(q.get('sourceRefs'),label);answers.append(q['answerIndex']);(totals if exam.get('kind')=='mock' else weeklyTotals)[q['level']]+=1
 if exam.get('kind')=='mock':
  check(len(answers)==40,exam['id']+': mock requires40')
  check(collections.Counter(answers)=={0:10,1:10,2:10,3:10},exam['id']+': unbalanced answers')
  check(all(not(a==b==c) for a,b,c in zip(answers,answers[1:],answers[2:])),exam['id']+': answer run')
for level in ('1','2'):
 expected_weeks={l['week'] for l in lessons if l['level']==level}
 weekly=[e for e in exams if e['level']==level and e.get('kind')=='weekly']
 check({e.get('week') for e in weekly}==expected_weeks,level+': missing weekly assessment')
 check(len({e.get('week') for e in weekly})==len(weekly),level+': duplicate weekly assessment')
 check(all(len(e['questions'])==3 for e in weekly),level+': weekly assessment requires3 questions')
locales=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];translated={}
for locale in locales:
 path=data/'translations'/f'{locale}.json'; pack=json.loads(path.read_text()) if path.exists() else {}
 for part in parts: pack.update(part.get('translations',{}).get(locale,{}))
 translated[locale]=len(pack)
 for lid,t in pack.items():
  source=next((l for l in lessons if l['id']==lid),None)
  check(source is not None,locale+': unknown lesson '+lid)
  if source:
   check(t.get('sourceHash')==source['sourceHash'],locale+': stale translation '+lid)
   for key in ('title','objective','activity','summary'): check(bool(t.get(key,'').strip()),locale+': empty '+key+' '+lid)
   for para in source['paragraphs']:
    for key in ('paragraphs','paragraphTitles'): check(bool(t.get(key,{}).get(para['id'],'')),locale+': missing '+key+' '+lid)
   for term in source['terms']: check(bool(t.get('terms',{}).get(term['ja'],'')),locale+': missing term '+lid+' '+term['ja'])
   # Match Japanese letters, not the interpunct used in A・B・C mathematical labels.
   if locale in ['hi','bn','ne','my','th','km','tl']:
    values=[t.get(k,'') for k in ['title','objective','activity','summary']]+list(t.get('paragraphTitles',{}).values())+list(t.get('paragraphs',{}).values())+list(t.get('terms',{}).values())
    check(not any(re.search(r'[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]',v) for v in values),locale+': Japanese fallback in target values '+lid)
def runtime_revision(value):
 text=json.dumps(value,ensure_ascii=False,separators=(',',':')).encode('utf-16-le');h=2166136261
 for i in range(0,len(text),2):h=((h^(text[i]+256*text[i+1]))*16777619)&0xffffffff
 return f'fnv1a-{h:x}'
source_questions={q['id']:q for e in exams for q in e['questions']}
source_exams={e['id']:e for e in exams}
question_translations={}
for locale in locales:
 path=data/'test-translations'/f'{locale}.json';pack=json.loads(path.read_text()) if path.exists() else {'questions':{},'examTitles':{}}
 for part in parts:
  extra=part.get('testTranslations',{}).get(locale,{})
  pack['questions'].update(extra.get('questions',{}));pack['examTitles'].update(extra.get('examTitles',{}))
 question_translations[locale]=len(pack['questions'])
 for qid,t in pack['questions'].items():
  q=source_questions.get(qid);check(q is not None,locale+': unknown translated question '+qid)
  if q:
   check(t.get('sourceHash')==runtime_revision({k:q[k] for k in ['promptJa','optionsJa','explanationJa','optionExplanationsJa']}),locale+': stale question '+qid)
   check(bool(t.get('prompt')) and bool(t.get('explanation')),locale+': empty question text '+qid)
   check(len(t.get('options',[]))==4 and all(isinstance(x,str) and x.strip() for x in t['options']),locale+': incomplete choices '+qid)
   check(len(t.get('optionExplanations',[]))==4 and all(isinstance(x,str) and x.strip() for x in t['optionExplanations']),locale+': incomplete option reasons '+qid)
   target_values=[t['prompt'],t['explanation']]+t['options']+t['optionExplanations']
   pattern=r'[\u3041-\u3096\u30a1-\u30fa]' if locale in ['zh-CN','zh-TW'] else r'[\u3041-\u3096\u30a1-\u30fa\u4e00-\u9fff]'
   check(not any(re.search(pattern,v) for v in target_values),locale+': Japanese fallback in question translation '+qid)
   # Catch foreign letters/marks/digits; shared Indic danda punctuation is valid in Bengali.
   script_ranges={'th':r'[\u0e00-\u0e7f]','km':r'[\u1780-\u17ff]','my':r'[\u1000-\u109f]','bn':r'[\u0980-\u09ff]','hi-ne':r'[\u0900-\u097f]'}
   allowed_script='hi-ne' if locale in ['hi','ne'] else locale
   for script,foreign in script_ranges.items():
    if script!=allowed_script:check(not any(unicodedata.category(c)[0] in 'LMN' for v in target_values for c in re.findall(foreign,v)),locale+': unexpected '+script+' script in question translation '+qid)
 for eid,t in pack['examTitles'].items():
  e=source_exams.get(eid);check(e is not None,locale+': unknown translated exam '+eid)
  if e:check(t.get('sourceHash')==runtime_revision({'titleJa':e['titleJa']}) and bool(t.get('title')),locale+': stale/empty exam title '+eid)
pending={'mockQuestions':{level:max(0,400-totals[level]) for level in ('1','2')},'lessonTranslations':{locale:max(0,len(lessons)-translated[locale]) for locale in locales},'fullBodyFurigana':'pending_verified_segments','nativeDomainReview':'pending','productionDeviceValidation':'pending'}
report={'pending':pending,'scopeComplete':False,'lessons':dict(collections.Counter(l['level'] for l in lessons)),'weeklyQuestions':dict(weeklyTotals),'mockQuestions':dict(totals),'mockQuestionTarget':{'1':400,'2':400},'translationLessons':translated,'translatedQuestions':question_translations,'errors':errors,'status':'PASS' if not errors else 'FAIL','meaning':'Structural check only; not native/domain/visual certification.'}
print(json.dumps(report,ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
