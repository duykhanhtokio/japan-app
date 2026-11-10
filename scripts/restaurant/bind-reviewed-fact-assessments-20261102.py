"""Explicitly reviewed fact-to-existing-question bindings, not keyword matching.

These bindings reuse unchanged, already translated questions instead of creating
numerically substituted duplicates. Legal content is not newly certified current.
"""
from pathlib import Path
import json,hashlib,subprocess

ROOT=Path(__file__).resolve().parents[2]
DOC=ROOT/'docs/ssw-workspace/restaurant/source-closure31'
SESSION_BASELINE='ee7ac2b1434b0b049dd07de2b08d0aa5ad473dd7'
GROUPS={
 'G-existing-numerical-competencies': [
 ('rst31-operations2-f198',['rst-2-q003'],'The original question explicitly computes cost/sales×100; it assesses the denominator and ratio, not merely an adjacent management topic.'),
 ('rst31-operations2-f203',['rst-2-q213'],'With labor time held fixed, the correct option makes sales/hour rise and gross-profit/hour fall. Its explanation explicitly distinguishes the numerators.'),
 ('rst31-operations2-f204',['rst-2-q103'],'The original calculation explicitly divides guest count by total labor hours and gives guests/hour.'),
 ('rst31-operations2-f207',['rst-2-q356'],'The stem contrasts monthly gross profit per employee with gross profit per hour; correct option and explanation distinguish both denominator and period.'),
 ('rst31-operations2-f208',['rst-2-q102'],'The original calculation explicitly divides labor cost by gross profit, preserving the exact denominator competency.'),
 ],
 'H-existing-training-competencies': [
 ('rst31-operations2-f199',['rst-2-q348'],'Correct option uses specific results, ability and work behavior rather than closeness; explanation explicitly applies the evaluation to placement and training.'),
 ('rst31-operations2-f200',['rst-2-q357'],'Correct option requires concrete criteria and workplace implementation of company QSC; explanation explicitly calls these standards.'),
 ('rst31-operations2-f202',['rst-2-q349'],'Correct option and explanation require attained skills, goals/content and checking methods, rather than a schedule alone.'),
 ('rst31-operations2-f205',['rst-2-q351'],'The stem states that the measure was implemented; correct option and explanation require evaluation, correction and feedback into the next plan.'),
 ],
 'I-existing-conditional-competencies': [
 ('rst31-operations2-f156',['rst-2-week10-q02','rst-2-week10-q08','rst-2-q382'],'The three original items jointly assess ordinary overtime25%, the22:00–05:00 boundary, and ordinary overtime25%+night25%. This is a multi-item facet binding, not a claim that a single question tests all facets.'),
 ('rst31-operations2-f157',['rst-2-q369'],'The correct answer is holiday+night60%; explanation explicitly decomposes statutory holiday35% and night25%, distinguishing statutory from scheduled holidays.'),
 ('rst31-operations2-f158',['rst-2-q382'],'The correct option is50% or more and explanation explicitly adds ordinary statutory overtime25% and night25%; total pay is a distinct distractor.'),
 ('rst31-operations2-f159',['rst-2-q362'],'The stem applies to the portion above60 monthly overtime hours and night work; key75% and explanation50%+25% match both rates in the fact.'),
 ('rst31-operations2-f161',['rst-2-q379','rst-2-week10-q04','rst-2-q361'],'The three items cover the strict over6h boundary, >6h through8h requiring45min, and >8h requiring60min during work. No threshold is inferred from a same-topic link.'),
 ('rst31-cooking1-f-cut-2',['rst-1-week05-q01'],'The stem explicitly names irregular cutting; correct option keeps pieces comparable in size despite different shapes, and explanation ties this to even heating.'),
 ],
 'J-existing-hygiene-risk-competencies': [
 ('rst31-hygiene2-f008',['rst-2-q167','rst31-integration-q005'],'The first item explicitly distinguishes health checks from hand hygiene for preventing contamination even without symptoms; the second explicitly protects the food worker from infection while handling household faeces/vomit. Both facets are bound; no single-item blanket claim.'),
 ('rst31-hygiene2-f164',['rst31-integration-q003'],'The stem explicitly challenges the inference that voluntary recall removes the notification requirement; key and explanation distinguish the two actions and require checking official applicability and exceptions.'),
 ('rst31-hygiene2-f272',['rst31-hygiene2-q027','rst31-hygiene2-q032'],'The first item explicitly rejects treating display-rule scope as exemption from hygiene and requires covers/utensil hygiene for weighed food; the second specifies handwashing and clean utensils, preserving each hygiene action in this fact.'),
 ('rst31-hygiene2-f308',['rst-2-week08-q02'],'The stem proposes dropping controls for low-count causes; the correct option requires severity and the shop’s own processes, and the explanation rejects excluding hazards by ranking alone.'),
 ('rst31-hygiene2-f310',['rst-2-q033'],'The stem incorrectly claims freezing removes all hazards; key and explanation reject universal sterilisation and distinguish microbial, parasitic and chemical hazards. No guarantee that freezing kills bacteria/viruses is introduced.'),
 ('rst31-hygiene2-f311',['rst-2-q234','rst-2-q059'],'The first item tests that heating alone without post-heat growth control is insufficient; the second requires clean hands/utensils and storage at the final plating handover, explicitly explaining that later heating may not remove final-stage contamination. The combination assesses target treatment plus both growth and recontamination control.'),
 ],
}

def stable(v):return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def digest(v):return hashlib.sha256(stable(v).encode()).hexdigest()
def main():
 def baseline_read(path):
  return json.loads(subprocess.check_output(['git','show',SESSION_BASELINE+':'+path],cwd=ROOT))
 baseline=baseline_read('docs/ssw-workspace/restaurant/source-closure31/unit-crosswalk.json')['facts']
 questions={q['id']:q for level in ['1','2'] for exam in json.loads((ROOT/f'src/data/restaurant/exams.{level}.ja.json').read_text())['exams'] for q in exam['questions']}
 questions.update({qid:q for qid,q in json.loads((DOC/'canonical-ja.json').read_text())['items'].items() if q.get('kind')=='question'})
 baseline_questions={q['id']:q for level in ['1','2'] for exam in baseline_read(f'src/data/restaurant/exams.{level}.ja.json')['exams'] for q in exam['questions']}
 baseline_questions.update({qid:q for qid,q in baseline_read('docs/ssw-workspace/restaurant/source-closure31/canonical-ja.json')['items'].items() if q.get('kind')=='question'})
 p=DOC/'integration/assessment-delta.json';delta=json.loads(p.read_text())
 all_existing={(r['factId'],tuple(r['questionIds'])) for r in delta['rebindings']}
 for group,rows in GROUPS.items():
  evidence=[]
  for fid,qids,reason in rows:
   fact=baseline[fid];assert not fact.get('questionIds'),(fid,'baseline already bound')
   snapshots=[]
   for qid in qids:
    q=questions[qid]
    for field in ['stemJa','optionsJa','correctIndex','explanationJa','sourceRefs','sourceHash']:
     assert q[field]==baseline_questions[qid][field],(qid,field,'re-author binding if the original competency changes')
    snapshots.append({k:q[k] for k in ['id','stemJa','optionsJa','correctIndex','explanationJa','sourceRefs','sourceHash']})
   scope='Self-reviewed exact competency/facet binding: '+reason+' Uses committed source facts and unchanged Japanese bank; not fresh source visual, native, legal-currentness or domain acceptance.'
   binding=dict(factId=fid,questionIds=qids,scope=scope)
   if (fid,tuple(qids)) not in all_existing:delta['rebindings'].append(binding)
   evidence.append(dict(factId=fid,statementJa=fact['statementJa'],sourceRefs=fact['sourceRefs'],factSnapshotSha256=digest(fact),questions=snapshots,questionSnapshotsSha256=digest(snapshots),decision='exact_existing_competency_rebound',rationale=reason,independentSingleQuestionForEveryFacet=len(qids)==1))
  report=dict(schemaVersion=1,date='2026-11-02',status='PASS_SELF_REVIEWED_EXACT_BINDINGS',group=group,bindings=evidence,sourceVisualReview='Inherited committed fact/source-page receipts; no new PDF inspection.',nativeReviewed=False,humanReviewed=False,domainReviewed=False,currentLegalVerification=False)
  (DOC/f'integration/sequential-{group}-20261102.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
  print(group,len(rows),'exact bindings validated')
 p.write_text(json.dumps(delta,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':main()
