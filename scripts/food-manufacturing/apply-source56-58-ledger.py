"""Reopen historical partial evidence and close only after actual remediation."""
RECEIPT58='docs/ssw-workspace/food-manufacturing/source-v2-batch4-20261102/source-review.json'
for slug,n in [('yield-cooking-evaporation',56),('yield-cooking-multiplier-context',57),('yield-low-target-investigation',58)]:
 u=next(x for x in units if x['knowledgeId']=='food-v2-'+slug)
 u['remediationHistory']={'beforeStatus':u['status'],'beforeAfter':dict(u['after']),'beforeUnresolved':list(u['unresolved']),'baselineCommit':'ea1b43c95de1ca19b0a1385c0ddc4c1c1a335270'}
 p=read(D/f'source-closure{n}.json')
 u['teachingEvidence']=[evidence(f'src/data/food-manufacturing/source-closure{n}.json','/sections/0/textJa',p['sections'][0]['textJa'],'Original source condition is taught explicitly, including quality-first limits rather than numeric maximisation.')]
 u['assessmentEvidence']=[evidence(f'src/data/food-manufacturing/source-closure{n}.json','/checks/0',p['checks'][0],'Independent application explicitly asks the missing condition; expected response was compared with the source and current Japanese, not accepted from a same-topic question.')]
 u['after']={'teaching':'present','assessment':'present'};u['status']='covered_ai';u['unresolved']=[]
 u['sourceReview']={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RECEIPT58}
 u['expressionReview']={'status':'independent_ai_checked','note':'Own trial/product decisions and10kg→23kg rice arithmetic replace source expression/examples; no source-image tracing or paragraph paraphrase claim.'}

# Next available source105 claims were read independently, then matched to the
# exact current source-backed app paragraphs and complete questions/rationales.
for slug,box,statement,paragraph,qid in [
 ('yield-low-raw-method-input',[72,73,530,164],'原料処理歩留りが低い場合、手順・器具と原料品質を分けて分析する。','p3','food-2-q306'),
 ('yield-high-raw-underuse',[72,172,530,310],'想定以上の歩留りでは必要原料の不足が原因になり得ることを説明し、原料使用と製品品質を確認する。','p2','food-2-q345')]:
 manual(slug,105,box,statement,'food-2-025',paragraph,[qid])
 u=units[-1];u['before']={'teaching':'unknown','assessment':'unknown'}
 u['sourceReview']['reviewRef']=RECEIPT58
 u['expressionReview']['note']='Source105 reviewed directly against independent current paragraph and fictional question; conditions and all answer rationales match this narrow claim.'
