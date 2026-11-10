#!/usr/bin/env python3
"""Merge the four bounded authoring shards after all160 items in each are validated.

Does not replace an existing exam whose content differs. Source-page overlap is
not a certification of semantic accuracy or complete knowledge coverage.
"""
import collections,json,pathlib,re,hashlib,random,copy,sys
root=pathlib.Path(__file__).resolve().parents[2];data=root/'src/data/food-manufacturing'
canonical=data/'exams.ja.json';doc=json.loads(canonical.read_text());existing={e['id']:e for e in doc['exams']}
units={u['id'] for u in json.loads((root/'docs/ssw-workspace/food-manufacturing/source-map.json').read_text())['units']}
names=['exams.1.03-06.ja.json','exams.1.07-10.ja.json','exams.2.03-06.ja.json','exams.2.07-10.ja.json'];new=[];inputs={}
for name in names:
 path=data/name;raw=path.read_bytes();part=json.loads(raw);assert len(part['exams'])==4,name+': incomplete form set'
 assert sum(len(e['questions']) for e in part['exams'])==160,name+': requires160'
 inputs[name]=hashlib.sha256(raw).hexdigest();new.extend(part['exams'])
# Mix the two independently authored domain pools into broad practice forms.
# Keep the four previously integrated forms and their saved-session revisions intact.
assembled=[];blueprints={};origin={q['id']:e['id'] for e in new for q in e['questions']}
for level in ('1','2'):
 rng=random.Random(20261026+int(level));groups=collections.defaultdict(list)
 for e in new:
  if e['level']==level:
   for q in e['questions']:
    matched=re.search(r'-c(\d+)',q['knowledgeId']);groups[matched.group(1) if matched else 'appendix'].append(q)
 bins=[[] for _ in range(8)];chapter_counts=[collections.Counter() for _ in bins]
 for chapter,questions in sorted(groups.items(),key=lambda pair:(len(pair[1]),pair[0])):
  rng.shuffle(questions)
  for q in questions:
   available=[i for i in range(8) if len(bins[i])<40];rng.shuffle(available)
   i=min(available,key=lambda j:(chapter_counts[j][chapter],len(bins[j])))
   bins[i].append(copy.deepcopy(q));chapter_counts[i][chapter]+=1
 for i,questions in enumerate(bins):
  assert len(questions)==40
  if level=='2':assert set(chapter_counts[i])=={'01','02','03','04','05','06'},chapter_counts[i]
  rng.shuffle(questions)
  for attempt in range(1000):
   answers=[a for a in range(4) for _ in range(10)];rng.shuffle(answers)
   if all(not(a==b==c) for a,b,c in zip(answers,answers[1:],answers[2:])):break
  else:raise AssertionError('cannot build balanced answer sequence')
  for q,correct in zip(questions,answers):
   pairs=list(zip(q['optionsJa'],q['optionExplanationsJa']));right=pairs.pop(q['answerIndex']);rng.shuffle(pairs);pairs.insert(correct,right)
   q['optionsJa']=[x[0] for x in pairs];q['optionExplanationsJa']=[x[1] for x in pairs];q['answerIndex']=correct
  eid=f'food-{level}-mock-{i+3:02}'
  e={'id':eid,'level':level,'kind':'mock','titleJa':f'特定技能{level}号・模擬試験{i+3:02}','questions':questions,'status':'authored_ai_unreviewed','officialExamEquivalent':False,'assemblyPolicy':'chapter_stratified_original_question_pools_v1'}
  blueprints[eid]=dict(sorted(chapter_counts[i].items()));assembled.append(e)
for e in assembled:
 if e['id'] in existing:assert e==existing[e['id']],e['id']+': existing data differs; preserve and review'
 else:existing[e['id']]=e
doc['exams']=sorted(existing.values(),key=lambda e:(e['level'],0 if e['kind']=='mock' else 1,e['id']))
qids=set();prompts=set();examids=set();counts=collections.Counter()
for e in doc['exams']:
 assert e['id'] not in examids,e['id'];examids.add(e['id']);answers=[]
 for q in e['questions']:
  assert q['id'] not in qids,q['id']+': duplicate ID';qids.add(q['id'])
  normalized=re.sub(r'[\s。、，,.「」？?（）()]+','',q['promptJa']);assert normalized not in prompts,q['id']+': duplicate prompt';prompts.add(normalized)
  assert q['level']==e['level'] and q['knowledgeId'] in units,q['id']+': level/source unit'
  assert len(q['optionsJa'])==4 and len(set(q['optionsJa']))==4,q['id']+': choices'
  assert len(q['optionExplanationsJa'])==4 and all(isinstance(t,str) and t.strip() for t in q['optionExplanationsJa']),q['id']+': reasons'
  assert q['explanationJa'].strip() and q['answerIndex'] in range(4),q['id']+': answer'
  assert q['sourceRefs'],q['id']+': sources'
  for r in q['sourceRefs']:
   offset,limit={'ssw1':(5,86),'ssw2':(9,165)}[r['document']]
   assert r['pdfPage']==r['printedPage']+offset and 1<=r['pdfPage']<=limit,q['id']+': source page'
  answers.append(q['answerIndex'])
 if e['kind']=='mock':
  assert len(answers)==40 and collections.Counter(answers)=={0:10,1:10,2:10,3:10},e['id']+': answer balance'
  assert all(not(a==b==c) for a,b,c in zip(answers,answers[1:],answers[2:])),e['id']+': repeated answer run'
  counts[e['level']]+=40
assert counts=={'1':400,'2':400},counts
if '--check-only' not in sys.argv:canonical.write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
report={'status':'PASS','inputSha256':inputs,'newFormChapterCounts':blueprints,'authoredSourceForms':origin,'mockQuestionsByLevel':dict(counts),'assessmentQuestions':len(qids),'examCount':len(doc['exams']),'semanticExpertReviewed':False,'nativeReviewed':False,'meaning':'Exact duplicate, structural and page-reference validation; not semantic certification.'}
if '--check-only' not in sys.argv:(root/'docs/ssw-workspace/food-manufacturing/batch-02-integration.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('authoredSourceForms','inputSha256')},ensure_ascii=False))
