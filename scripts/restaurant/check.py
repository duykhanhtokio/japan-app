"""Restaurant structural and completeness gate. A structural pass is not editorial certification."""
from pathlib import Path
import json,re,hashlib,sys,collections
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant'
LOCALES=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']
PAGES={'rst-1-hygiene':45,'rst-1-cooking':49,'rst-1-service':50,'rst-2-hygiene':42,'rst-2-cooking':25,'rst-2-service':27,'rst-2-operations':33}
errors=[];gaps=[];metrics={};lessons=[];exams=[];questions=[]
def read(p):
 try:return json.loads(p.read_text())
 except Exception as e:errors.append(f'{p.name}: {e}');return {}
def require(ok,message):
 if not ok:errors.append(message)
def sha(x):return hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def semantic(x):
 if isinstance(x,dict):return {k:semantic(v) for k,v in x.items() if k not in ('sourceHash','revision','knowledgeIds','review','reviewStatus','furigana')}
 if isinstance(x,list):return [semantic(v) for v in x]
 return x
def content_hash(x):return sha(semantic(x))
def refs(x):
 require(bool(x.get('sourceRefs')),x['id']+': missing references')
 for r in x.get('sourceRefs',[]):
  d=r.get('documentId');ps=r.get('pdfPages',[])
  require(d in PAGES and bool(ps) and all(type(p)==int and 1<=p<=PAGES.get(d,0) for p in ps),x['id']+': invalid source page')
  require(bool(r.get('section')),x['id']+': missing source section')
for level in ('1','2'):
 for kind in ('lessons','exams'):
  p=DATA/f'{kind}.{level}.ja.json'
  if not p.exists():gaps.append(f'missing {p.name}');continue
  x=read(p);records=x.get(kind,[])
  require(x.get('schemaVersion')==1 and x.get('level')==level,p.name+': schema/level')
  for r in records:
   require(r.get('level')==level,r.get('id','?')+': level mismatch')
   require(re.fullmatch(r'rst-'+level+r'-[a-z0-9-]+',r.get('id','')) is not None,'invalid restaurant ID')
  if kind=='lessons':lessons+=records
  else:exams+=records
def ruby(text,segments,where):
 if segments is None:return
 require(isinstance(segments,list) and bool(segments) and all(isinstance(z,dict) and isinstance(z.get('text'),str) and z['text'] and ('reading' not in z or re.fullmatch('[ぁ-ゖー\\s]+',z['reading'])) for z in segments),where+': invalid ruby tokens')
 require(''.join(z.get('text','') for z in segments)==text,where+': ruby/source mismatch')
for l in lessons:
 for key,field in [('title','titleJa'),('objective','objectiveJa'),('summary','summaryJa'),('activity','activityJa')]:ruby(l[field],l.get('furigana',{}).get(key),l['id']+'/'+field)
 for para in l['paragraphs']:ruby(para['textJa'],para.get('furigana'),l['id']+'/'+para['id'])
 for key in ('titleJa','objectiveJa','summaryJa','activityJa'):
  require(isinstance(l.get(key),str) and bool(l[key].strip()),l['id']+': missing '+key)
 require(l.get('minutes')==30,l['id']+': duration')
 require(type(l.get('week'))==int and l['week']>0 and type(l.get('day'))==int and 1<=l['day']<=7,l['id']+': invalid calendar')
 require(len(l.get('paragraphs',[]))>=4,l['id']+': incomplete lesson')
 ids=[p.get('id') for p in l.get('paragraphs',[])];require(len(ids)==len(set(ids)),l['id']+': paragraph IDs')
 for p in l.get('paragraphs',[]):require(bool(p.get('titleJa')) and len(p.get('textJa',''))>=40,l['id']+': short/missing paragraph')
 require(bool(l.get('terms')),l['id']+': no terms')
 for t in l.get('terms',[]):require(bool(t.get('ja')) and bool(t.get('reading')) and not re.search('[一-龯]',t['reading']),l['id']+': term reading')
 refs(l);require(l.get('sourceHash')==content_hash(l),l['id']+': stale semantic hash')
for level in ('1','2'):
 ls=[l for l in lessons if l['level']==level];slots=[(l['week'],l['day']) for l in ls]
 require(len(slots)==len(set(slots)),level+': duplicate calendar slot')
for e in exams:
 qs=e.get('questions',[]);require(bool(qs),e['id']+': empty exam')
 require(e.get('kind') in ('practice','weekly'),e['id']+': kind')
 if e.get('kind')=='practice':require(len(qs)==40,e['id']+': expected40 practice questions')
 positions=[]
 for q in qs:
  questions.append(q);refs(q)
  opts=q.get('optionsJa',[]);a=q.get('correctIndex')
  require(len(opts)==4 and len(set(opts))==4 and all(isinstance(o,str) and o.strip() for o in opts),q['id']+': invalid options')
  require(type(a)==int and 0<=a<4,q['id']+': answer')
  require(bool(q.get('explanationJa')) and bool(q.get('objectiveJa')) and bool(q.get('stemJa')),q['id']+': missing question content')
  require(q.get('sourceHash')==content_hash(q),q['id']+': stale semantic hash')
  ruby(q['stemJa'],q.get('furigana',{}).get('stem'),q['id']+'/stem')
  ruby(q['explanationJa'],q.get('furigana',{}).get('explanation'),q['id']+'/explanation')
  if q.get('furigana',{}).get('options'):
   require(len(q['furigana']['options'])==4,q['id']+': ruby options')
   for i,z in enumerate(q['furigana']['options']):ruby(q['optionsJa'][i],z,q['id']+'/option'+str(i))
  positions.append(a)
 if e.get('kind')=='practice':require(collections.Counter(positions)=={0:10,1:10,2:10,3:10},e['id']+': unbalanced answers')
 require(not any(positions[i]==positions[i+1]==positions[i+2] for i in range(len(positions)-2)),e['id']+': triple answer streak')
 require(e.get('sourceHash')==content_hash(e),e['id']+': stale exam hash')
for name,rs in [('lesson',lessons),('exam',exams),('question',questions)]:
 ids=[r['id'] for r in rs];require(len(ids)==len(set(ids)),name+': duplicate IDs')
# Detect exact/cosmetic duplicates; semantic reuse still requires independent review.
stems=[re.sub(r'[\d\s０-９]+','#',q.get('stemJa','')) for q in questions]
require(len(stems)==len(set(stems)),'question: duplicate/cosmetic stem')
paragraphs=[p['textJa'] for l in lessons for p in l['paragraphs']]
require(len(paragraphs)==len(set(paragraphs)),'lesson: repeated paragraph')
metrics['levels']={}
for level in ('1','2'):
 ls=[l for l in lessons if l['level']==level];es=[e for e in exams if e['level']==level];ps=[e for e in es if e['kind']=='practice'];ws=[e for e in es if e['kind']=='weekly'];weeks=sorted(set(l['week'] for l in ls))
 metrics['levels'][level]={'lessons':len(ls),'weeks':len(weeks),'practiceExams':len(ps),'practiceQuestions':sum(len(e['questions']) for e in ps),'weeklyExams':len(ws),'weeklyQuestions':sum(len(e['questions']) for e in ws)}
 if len(ps)!=10:gaps.append(f'{level}: practice {len(ps)}/10 sets')
 if {e.get('week') for e in ws}!=set(weeks):gaps.append(f'{level}: weekly checks do not cover every authored week')
 # All study topics must be present by level.
 expected={'hygiene','cooking','service'}|({'operations'} if level=='2' else set())
 if not expected.issubset({l['topic'] for l in ls}):gaps.append(f'{level}: source subject missing')
metrics['translations']={}
uiKeys=read(DATA/'ui-keys.ja.json').get('keys',[]) if (DATA/'ui-keys.ja.json').exists() else []
for locale in LOCALES:
 p=DATA/'translations'/f'{locale}.json';x=read(p) if p.exists() else {};lt=x.get('lessons',{});qt=x.get('questions',{});validL=validQ=0
 for l in lessons:
  t=lt.get(l['id'])
  if not t:continue
  complete=all(t.get(k) for k in ('title','objective','summary','activity')) and t.get('sourceHash')==l.get('sourceHash')
  complete=complete and all(t.get('paragraphTitles',{}).get(p['id']) and t.get('paragraphs',{}).get(p['id']) for p in l['paragraphs']) and all(t.get('terms',{}).get(z['ja']) for z in l['terms'])
  if complete:validL+=1
  else:gaps.append(locale+': incomplete/stale translation '+l['id'])
  require(t.get('title')!=l['titleJa'],locale+': Japanese title fallback '+l['id'])
 for q in questions:
  t=qt.get(q['id'])
  if not t:continue
  if t.get('sourceHash')==q.get('sourceHash') and all(t.get(k) for k in ('stem','explanation','objective')) and len(t.get('options',[]))==4:validQ+=1
  else:gaps.append(locale+': incomplete/stale question translation '+q['id'])
 for key in uiKeys:
  translated=x.get('ui',{}).get(key)
  if isinstance(translated,str) and translated.strip():
   require(collections.Counter(re.findall(r'\{[a-zA-Z]+\}',key))==collections.Counter(re.findall(r'\{[a-zA-Z]+\}',translated)),locale+': UI placeholders differ '+key)
 validUi=sum(isinstance(x.get('ui',{}).get(key),str) and bool(x['ui'][key].strip()) for key in uiKeys)
 metrics['translations'][locale]={'lessons':validL,'questions':validQ,'fixedUi':validUi}
 if validUi!=len(uiKeys):gaps.append(f'{locale}: fixed UI translations {validUi}/{len(uiKeys)}')
 if validL!=len(lessons) or validQ!=len(questions) or not p.exists():gaps.append(f'{locale}: translations {validL}/{len(lessons)} lessons, {validQ}/{len(questions)} questions')
glossaryPath=DATA/'glossary.ja.json'
if glossaryPath.exists():
 g=read(glossaryPath);groups=g.get('groups',[]);entryIds=[];missingDefinitions=missingReadings=0
 lessonIds={l['id'] for l in lessons}
 for group in groups:
  require(bool(group.get('id')) and bool(group.get('titleJa')),'invalid glossary group')
  require(bool(group.get('lessonIds')) and set(group['lessonIds']).issubset(lessonIds),group.get('id','?')+': glossary attachment')
  for entry in group.get('entries',[]):
   entryIds.append(entry.get('id'));require(bool(entry.get('id')) and bool(entry.get('termJa')),group['id']+': glossary entry')
   if not entry.get('explanationJa'):missingDefinitions+=1
   if not entry.get('reading'):missingReadings+=1
   elif not re.fullmatch('[ぁ-ゖー\\s（）・、]+',entry['reading']):gaps.append(str(entry['id'])+': glossary reading needs verification')
   refs(entry)
 require(len(entryIds)==len(set(entryIds)),'duplicate glossary IDs')
 links=read(DATA/'glossary-links.json')
 require(set(links.get('lessonIds',[]))=={id for group in groups for id in group['lessonIds']},'glossary links stale')
 metrics['glossary']={'groups':len(groups),'entries':len(entryIds),'missingDefinitions':missingDefinitions,'missingReadings':missingReadings}
 if missingDefinitions:gaps.append('glossary definitions incomplete')
 if missingReadings:gaps.append('glossary readings incomplete')
 for locale in LOCALES:
  translated=read(DATA/'translations'/f'{locale}.json').get('glossary',{}); valid=0
  for group in groups:
   for entry in group['entries']:
    expected=sha({k:entry[k] for k in ('termJa','reading','explanationJa')})
    require(entry.get('sourceHash')==expected,entry['id']+': stale glossary definition hash')
    t=translated.get(entry['id'])
    if t and t.get('sourceHash')==expected and t.get('term') and t.get('explanation'):valid+=1
    elif t:gaps.append(locale+': incomplete/stale glossary '+entry['id'])
  metrics['translations'][locale]['glossary']=valid
  if valid!=len(entryIds):gaps.append(f'{locale}: glossary translations {valid}/{len(entryIds)}')
metrics['paragraphs']=len(paragraphs);metrics['sourceDocumentsReferenced']=len({r['documentId'] for l in lessons for r in l['sourceRefs']})
# Completion never follows schema checks alone.
review=ROOT/'docs/ssw-workspace/restaurant/acceptance-review.json'
if not review.exists():gaps.append('independent semantic/source/safety/ruby/translation/illustration acceptance review pending')
else:
 r=read(review)
 for key in ('sourceCoverageComplete','safetyChecked','semanticQuestionUniquenessChecked','fullFuriganaChecked','allTranslationsChecked','illustrationsChecked','browserFlowChecked'):
  if r.get(key) is not True:gaps.append(key+' pending')
report={'schemaVersion':1,'status':'STRUCTURAL_FAIL' if errors else 'STRUCTURAL_PASS','complete':not errors and not gaps,'nativeReviewed':False,'domainReviewed':False,'metrics':metrics,'errors':errors,'remaining':gaps}
p=ROOT/'docs/ssw-workspace/restaurant/validation-report.json';p.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':report['status'],'complete':report['complete'],'metrics':metrics,'errors':errors[:30],'remainingCount':len(gaps)},ensure_ascii=False))
if errors or ('--complete' in sys.argv and gaps):sys.exit(1)
