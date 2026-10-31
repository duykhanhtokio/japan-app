"""A single inspectable source→fact→lesson→assessment matrix, derived from reviewed evidence."""
import json,collections,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/ssw-workspace/restaurant/source-closure31'
def read(p):return json.loads(p.read_text())
def save(p,x):p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
x=read(DOC/'unit-crosswalk.json');canonical=read(DOC/'canonical-ja.json')['items'];ledger={u['id']:u for u in read(DOC.parent/'knowledge-ledger.json')['units']};lessons={l['id']:l for level in ['1','2'] for l in read(ROOT/f'src/data/restaurant/lessons.{level}.ja.json')['lessons']};questions={q['id']:q for level in ['1','2'] for e in read(ROOT/f'src/data/restaurant/exams.{level}.ja.json')['exams'] for q in e['questions']};newq={k:v for k,v in canonical.items() if v['kind']=='question'};questions.update(newq)
rows=[];unassessed=[]
for uid,u in x['units'].items():
 fs=[x['facts'][fid] for fid in u['factIds']];ls=set();add=set();qs=set();untested=[]
 for f in fs:
  for evidence in f.get('existingEvidence',[]):
   if evidence.get('lessonId'):ls.add(evidence['lessonId'])
  for aid in f.get('additionIds',[]):
   assert aid in canonical,(uid,aid);add.add(aid);ls.add(canonical[aid]['lessonId'])
  linked=f.get('questionIds',[])
  assert all(q in questions for q in linked),(uid,linked);qs.update(linked)
  if not linked:untested.append(f['id'])
 assert all(l in lessons for l in ls),(uid,ls)
 if u['decision'] not in ['structural_aggregate','reference_excluded'] and not qs:unassessed.append(uid)
 rows.append(dict(unitId=uid,titleJa=ledger[uid]['knowledgeOrSkill'],unitKind=ledger[uid]['unitKind'],sourceRefs=ledger[uid]['sourceRefs'],shard=u['shard'],decision=u['decision'],factIds=u['factIds'],lessonIds=sorted(ls),supplementIds=sorted(add),existingQuestionIds=sorted(q for q in qs if q not in newq),newQuestionIds=sorted(q for q in qs if q in newq),factsWithoutIndividualQuestion=untested,assessmentScope='Linked representative competencies only; per-fact author evidence and coverage limitations remain in unit-crosswalk.json. Structural aggregates are not independent knowledge units.',reason=u.get('reason'),remainingFactGaps=u.get('remainingFactGaps',[]),remainingImageGaps=u.get('remainingImageGaps',[])))
assert len(rows)==639 and len(x['pages'])==271
assert not unassessed,('Unit assessment gaps',unassessed)
oldstems={q['stemJa'] for q in questions.values() if q['id'] not in newq};assert not [q['id'] for q in newq.values() if q['stemJa'] in oldstems]
assert len({q['stemJa'] for q in newq.values()})==len(newq)
counts=collections.Counter(q['correctIndex'] for q in newq.values())
save(DOC/'knowledge-matrix.json',dict(schemaVersion=1,source='unit-crosswalk.json + frozen canonical lessons and assessment extension',units=rows,summary=dict(sourcePages=len(x['pages']),hierarchyUnits=len(rows),atomicFacts=len(x['facts']),nonAggregateUnits=sum(u['decision']!='structural_aggregate' for u in rows),nonAggregateUnitsWithoutCompetencyQuestion=unassessed,newQuestions=len(newq),newQuestionKeyDistribution={str(k):v for k,v in sorted(counts.items())},exactNewStemDuplicatesWithExisting=0,exactNewStemDuplicates=0),limits=dict(eachFactIndividuallyTested=False,semanticDuplicateReview='Authored per-packet review; exact stem collision test is not semantic equivalence certification.',humanReviewed=False,nativeReviewed=False,domainReviewed=False)))
print(json.dumps({'status':'PASS','units':len(rows),'facts':len(x['facts']),'unitAssessmentGaps':len(unassessed),'newQuestions':len(newq)}))
