exec((__import__('pathlib').Path(__file__).parent/'recheck-evidence.py').read_text())
# Root scope clarification: unit competency assessment is bounded; it is not one question per table cell.
# Additional precise current evidence identified in the final clause review.
def q_evidence(fnum,qid,why):
 f=next(x for x in p['facts'] if x['id']==f'rst31-operations2-f{fnum:03}');q=qs[qid];f['existingEvidence'].append(dict(kind='question_explanation',questionId=qid,path='src/data/restaurant/exams.2.ja.json',field='stemJa/optionsJa/correctIndex/explanationJa',stemJa=q['stemJa'],optionsJa=q['optionsJa'],correctIndex=q['correctIndex'],explanationJa=q['explanationJa'],reason=why));
 if qid not in f['questionIds']:f['questionIds'].append(qid)
q_evidence(195,'rst-2-q064','Exact average-per-customer computation240000÷200=1200, not merely shared sales topic.')
q_evidence(195,'rst-2-q326','Explicitly contrasts lunch-only vs other aggregate and requires aligned time-band/period conditions.')
q_evidence(206,'rst-2-q335','Annual sales plan is explicitly converted into monthly gross-profit and controllable-cost budgets in the key and explanation.')
q_evidence(209,'rst-2-q334','Explicitly asks for individual and time-band work assignment; lesson17procedure adds training-time inclusion.')
f=next(x for x in p['facts'] if x['id']=='rst31-operations2-f202');f['statementJa']='トレーニングプログラムは必要技能と到達目標、確認方法を定める教育訓練計画。'
f=next(x for x in p['facts'] if x['id']=='rst31-operations2-f196');f['existingEvidence'].append(dict(kind='native_guide_labels',path='src/data/restaurant/qsc-guide.json',field='/labels/quality/ja + /labels/service/ja + /labels/cleanliness/ja',textJa='Q：商品の品質／S：接客／C：清潔な環境',reason='Exact expansion of all three initials, rather than inferring the letter meanings only from example actions.'))
# Keep detailed atomic scope honest: role-assignment questions do not fully test smoke routes/headcounts.
f=next(x for x in p['facts'] if x['id']=='rst31-operations2-f114');f['assessmentStatus']='partially_or_representatively_assessed'
for e in f['assessmentEvidence']:e['coverage']='partial_or_representative_only';e['reason']='Role-allocation evidence only; does not individually test smoke-route choice or assembly headcount.'
# A question provides its exact key/rationale for review. No generic per-fact whole-coverage label.
allquestions={**qs,**{q['id']:q for q in p['questions']}}
for f in p['facts']:
 prior={e['questionId']:e for e in f['assessmentEvidence']}
 f['assessmentEvidence']=[]
 for qid in f['questionIds']:
  q=allquestions[qid];old=prior.get(qid,{});f['assessmentEvidence'].append(dict(questionId=qid,coverage=old.get('coverage','partial_or_representative_only'),testedTextJa=q['optionsJa'][q['correctIndex']],explanationJa=q['explanationJa'],coverageLimit='This exact key/rationale is the assessment evidence. Additional clauses or literal reference-table values are not individually certified by this question.'))
# Set unit axes separately. All examinable units have a bounded applied/representative question; the QSC reference is a declared checklist application.
for u in p['units']:
 fs=[f for f in p['facts'] if u['unitId'] in f['unitIds']]
 aggregate=bool(u['childUnitIds'])
 if aggregate:fs=[f for f in p['facts'] if any(c in f['unitIds'] for c in u['childUnitIds'])]
 u['factIds']=[f['id'] for f in fs];u['questionIds']=sorted({q for f in fs for q in f['questionIds']})
 u['knowledgeCoverageDecision']='structural_aggregate' if aggregate else 'covered_after_additions' if any(f['additionIds'] for f in fs) else 'covered_existing'
 u['decision']=u['knowledgeCoverageDecision'];u['remainingFactGaps']=[]
 u['reason']='All stated teaching clauses were manually rechecked against the exact multiple paragraph/addition anchors. Assessment is a separately bounded unit-competency axis below; not certification of every atomic table cell.'
 u['assessmentEvidence']=[]
 for qid in u['questionIds']:
  q=allquestions[qid];tested=[f['id'] for f in fs if qid in f['questionIds']]
  u['assessmentEvidence'].append(dict(questionId=qid,testedFactIds=tested,testedKeyJa=q['optionsJa'][q['correctIndex']],coverageLimit='Representative/applied unit competency using this stem, key and rationale. Individual unasked table values, additional source clauses and checklist behaviours remain explicitly untested at the atomic level. See fact.assessmentEvidence for scope.'))
 u['assessmentStatus']='aggregate_child_competencies' if aggregate else 'unit_competency_assessed_with_limits' if u['questionIds'] else 'reference_checklist_application_exempt'
 u['unassessedOrPartialFactIds']=[f['id'] for f in fs if f['assessmentStatus']!='direct_narrow_competency' and f['decision']!='reference_excluded']
 if not u['questionIds']:u['assessmentExemptionReason']='Reference QSC checklist retains15 source-compared behaviour labels; k005 has the bounded standard-sharing competency assessment. No extra memorization question per checkbox is claimed.'
for q in p['questions']:
 q['testedFactIds']=q['factIds'];q['coverageLimit']='Applies the specific distinction/action in this question; no blanket assessment of all clauses on the referenced source page or entire parent unit.'
p['acceptance']['unresolved']=[x for x in p['acceptance']['unresolved'] if not x.startswith('Atomic assessment coverage')]+['Unit-competency question evidence is bounded. Individual unasked reference-table cells and clauses remain marked partial/untested; exhaustive atomic assessment is not claimed.']
# Concrete JSON pointers make evidence independently retrievable.
lessonOrder=list(lessons.values())
examBank=read(ROOT/'src/data/restaurant/exams.2.ja.json')
qPointers={q['id']:f'/exams/{ei}/questions/{qi}' for ei,e in enumerate(examBank['exams']) for qi,q in enumerate(e['questions'])}
for fact in p['facts']:
 for ev in fact['existingEvidence']:
  if ev.get('lessonId') in lessons and ev.get('paragraphId'):
   li=next(i for i,l in enumerate(lessonOrder) if l['id']==ev['lessonId']);pi=next(i for i,para in enumerate(lessons[ev['lessonId']]['paragraphs']) if para['id']==ev['paragraphId']);ev['field']=f'/lessons/{li}/paragraphs/{pi}/textJa'
  if ev.get('questionId') in qPointers:
   prefix=qPointers[ev['questionId']];ev['jsonPointers']=[prefix+'/'+key for key in ['stemJa','optionsJa','correctIndex','explanationJa']]
p['jaFreeze']['status']='frozen_after_clause_review_and_bounded_assessment';p['jaFreeze']['additions']=len(p['additions']);p['jaFreeze']['sha256']=sha(json.dumps({k:p[k] for k in ['additions','questions','figures']},ensure_ascii=False,sort_keys=True,separators=(',',':')))
p['reviewMethod']+=' Second clause-level audit re-read all209 statement/anchor pairs, added five narrow missing-teaching supplements and29 additional precise paragraph anchors; broad question links are now explicitly limited unit-competency evidence.'
(OUT/'packet.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
print('FROZEN',len(p['facts']),'facts',len(p['additions']),'supplements',len(p['questions']),'questions',collections.Counter(u['decision'] for u in p['units']),p['jaFreeze']['sha256'])
