"""Guard the bounded source-reader extension and preservation of existing practice.
Semantic source decisions are in explicit receipts; this checks their live bindings.
"""
from pathlib import Path
import json,re,subprocess,hashlib
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/restaurant/source-closure31';BASE='5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a'
def read(p):return json.loads(p.read_text())
x=read(D/'integration/source-v2-teaching-delta.json');assert len(x['facts'])==2 and len(x['additions'])==1
cross=read(D/'unit-crosswalk.json');matrix=read(D/'knowledge-matrix.json');c=read(D/'canonical-ja.json')['items'];ledger=read(R/'docs/ssw-workspace/source-coverage-v2/restaurant.json');units={u['knowledgeId']:u for u in ledger['knowledgeUnits']}
consumer='rst-v2-hygiene1-contamination-consumer-symptoms';response='rst-v2-hygiene1-cause-specific-response';assert {f['id']for f in x['facts']}=={consumer,response};assert len(cross['facts'])==1478
for fact in x['facts']:
 assert cross['facts'][fact['id']]['statementJa']==fact['statementJa']
 for uid in fact['unitIds']:
  assert fact['id']in cross['units'][uid]['factIds']
  assert fact['id']in next(row for row in matrix['units']if row['unitId']==uid)['factIds']
u=units[consumer];assert u['status']=='covered_ai'and u['after']=={'teaching':'present','assessment':'present'};assert units[response]['after']['teaching']=='present'
preserved=0;newquestions=[];newsections=[]
for level in ['1','2']:
 for name in ['lessons','exams']:
  rel=f'src/data/restaurant/{name}.{level}.ja.json';assert (R/rel).read_bytes()==subprocess.check_output(['git','show',BASE+':'+rel],cwd=R),(rel,'core content changed')
 rel=f'src/data/restaurant/source31/{level}.json';before=json.loads(subprocess.check_output(['git','show',BASE+':'+rel],cwd=R));after=read(R/rel);oq={q['id']:q for row in before['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])};nq={q['id']:q for row in after['lessons'].values()for q in(row.get('exam')or{}).get('questions',[])}
 assert all(nq.get(id)==q for id,q in oq.items()),'Existing source31 question revision/order/reading changed';preserved+=len(oq)
 for row in after['lessons'].values():
  newsections.extend(s for s in row['sections']if s['id']=='rst-v2-hygiene1-a-consumer-symptoms')
  newquestions.extend(q for q in(row.get('exam')or{}).get('questions',[])if q['id'].startswith('rst31-v2-hyg-'))
fields=0
for q in newquestions:
 for field,seq in [('stemJa',q['furigana']['stem']),('explanationJa',q['furigana']['explanation'])]:
  assert ''.join(s['text']for s in seq)==q[field];fields+=1
 for vals,seqs in [(q['optionsJa'],q['furigana']['options']),(q['optionReasonsJa'],q['reasonRuby'])]:
  for text,seq in zip(vals,seqs):assert ''.join(s['text']for s in seq)==text;fields+=1
 for seq in[q['furigana']['stem'],q['furigana']['explanation'],*q['furigana']['options'],*q['reasonRuby']]:assert not any(re.search('[一-龯]',s['text'])and not s.get('reading')for s in seq),'Unreviewed new question kanji'
for s in newsections:
 for field,key in [('titleJa','title'),('textJa','text')]:
  seq=s['furigana'][key];assert ''.join(z['text']for z in seq)==s[field];assert not any(re.search('[一-龯]',z['text'])and not z.get('reading')for z in seq);fields+=1
assert len(newquestions)==5 and len(newsections)==1 and preserved==255 and fields==52
for locale in ['vi','en','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl']:
 t=read(D/'translations'/locale/'source-v2-consumer-20261102.json')['items'];assert len(t)==2
 for id,v in t.items():assert v['sourceHash']==c[id]['sourceHash']
receipt={'status':'PASS','baselineCommit':BASE,'oldSource31QuestionsPreserved':preserved,'mainLessonsAndExamsUnchanged':True,'newQuestions':5,'newTeachingSections':1,'newRubyFieldsAligned':fields,'unknownNewKanjiSegments':0,'newFactsInCrosswalkAndMatrix':2,'consumerSourceAppBinding':'covered_ai','causeResponseTeachingBinding':'direct','nativeReviewed':False,'domainReviewed':False}
(R/'docs/ssw-workspace/source-coverage-v2/restaurant-delta-guard-20261102.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print(json.dumps(receipt))
