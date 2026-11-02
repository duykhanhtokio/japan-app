"""Self-read source102/106–108; locators are not semantic acceptance rules."""
BATCH4_RECEIPT='docs/ssw-workspace/food-manufacturing/source-v2-batch4-20261102/source-review.json'
newpacks={n:read(D/f'source-closure{n}-f8119.json')for n in[59,60,61]}
def leaf4(n,point=None):
 s=newpacks[n]['sections'if point is None else'checks'][0];ptr='/sections/0/textJa'if point is None else f'/checks/0/expectedPointsJa/{point}';v=s['textJa']if point is None else s['expectedPointsJa'][point]
 return evidence(f'src/data/food-manufacturing/source-closure{n}-f8119.json',ptr,v,'Self-read source condition and this independently written explanation/application response. Prompt explicitly requests this objective; fictional numerical assumptions are not real operating limits. No keyword/bbox acceptance or native/expert approval inferred.')
def accept4(u,n,point):
 u['before']=dict(u['after']);u['priorEvidence']={'teaching':u['teachingEvidence'],'assessment':u['assessmentEvidence']};u['teachingEvidence']=[leaf4(n)];u['assessmentEvidence']=[leaf4(n,point)];u['after']={'teaching':'present','assessment':'present'};u['status']='covered_ai';u['unresolved']=[];u['sourceReview']={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':BATCH4_RECEIPT};u['expressionReview']={'status':'independent_ai_checked','note':'Own source reading and application task; alternate numbers and diagnostic/quotation framing. Source conditions/technical terms retained; no source prose or artwork copied.'};u['batchRemediation']={'baselineCommit':'5ff58182ca8276f8104e7df57e974c16532b63bd','reviewRef':BATCH4_RECEIPT,'baselineContentStates':dict(u['before'])};return u
def unit4(slug,page,box,statement,n,point,conditions=()):
 manual(slug,page,box,statement,conditions=conditions);return accept4(units[-1],n,point)
u=next(u for u in units if u['knowledgeId']=='food-v2-line-balance-coordination');accept4(u,59,0);u.pop('potentialDuplicateOf',None)
u['scopeReconciliation']='Independently reread source102. Distinct accepted competence is rejecting local-speed-only inference and checking whole-line progress/coordination. Existing wip-quality-coordination and normal-upstream-local-delay concern accumulation/quality and diagnosis under own-process delay; those are not counted again. Original upstream status remains provenance.'
unit4('normal-clean-next-day',102,[72,87,530,146],'清掃点検で異常がないことを確認してから翌日の準備へ進む正常分岐を説明する。',59,1,conditions=['破損・未発見破片の連絡分岐と分ける。'])
add_ref('yield-total-input-formula',102,[72,493,530,679]);add_ref('yield-quality-target-range',102,[72,708,530,782])
unit4('stage-good-mass-inference',106,[72,630,530,780],'他の加工ロスや重量変化がない条件では投入重量から不良重量を引いて良品重量を推定できる。',60,1,conditions=['他の減量等が不明なら不良重量だけで断定しない。直接良品を量らない例の条件。'])
add_ref('stage-good-mass-inference',107,[72,53,530,226])
u=unit4('stage-yield-input-transfer',107,[72,202,530,299],'連続工程では前工程の良品重量を次工程の投入重量として各段階の歩留りを求める。',60,0)
u['before']={'teaching':'present','assessment':'present'};u['baselineEvidence']={'teaching':[teach('food-2-026','p2','Existing paragraph explicitly explains the intermediate denominator.')],'assessment':[question('food-2-q386','Existing stage200→180→171 task explicitly uses171/180 for stage B, with all choices/reasons read.')]};u['remediationKind']='source_mapping_of_existing_direct_content'
u=unit4('stage-yield-composition',107,[72,345,530,555],'連続工程の全体歩留りを最初の投入と最終良品で求め、段階別比率の積と照合する。',60,0,conditions=['途中の丸め値ではなく元の重量で計算する。'])
u['before']={'teaching':'present','assessment':'present'};u['baselineEvidence']={'teaching':[teach('food-2-026','p2','Existing paragraph explains multiplication and avoiding intermediate rounding.')],'assessment':[question('food-2-q268','Existing0.9×0.8 task directly checks composition; all choices/reasons read.')]};u['remediationKind']='source_mapping_of_existing_direct_content'
unit4('zero-defects-not-best-yield',107,[72,265,530,345],'不良ゼロの後工程でも規格換算出来高と投入を比べると歩留り上の優先課題が見つかる場合がある。',60,1,conditions=['不良数だけで改善不要としない。実重量と表示量や平均充填量を追加確認する。'])
add_ref('zero-defects-not-best-yield',106,[72,630,530,780]);add_ref('yield-bag-nominal-mass',107,[72,447,530,505])
unit4('rice-bases-opposite-change',107,[72,608,530,780],'配合変更では全投入重量基準と米基準の歩留りが逆方向に変わる場合があるため分母を明示して比較する。',61,0,conditions=['原料ロットと吸水率が変わる例を一般の改善保証にしない。'])
add_ref('rice-bases-opposite-change',108,[72,54,530,354])
unit4('rice-cost-assumptions',108,[72,124,530,245],'水の原価ゼロと生米原価同一という設問条件を実工場の水代や利益へ一般化しない。',61,1,conditions=['同品質・他費用除外はアプリの独自比較に明示した追加条件。'])
unit4('rice-cost-per-output',108,[72,180,530,354],'同じ米原価でも出来高が減れば製品単位重量当たりに配分する米原価が上がることを計算する。',61,1)
unit4('rice-total-yield-not-cost-verdict',108,[72,85,530,245],'全投入基準の歩留りが上がった事実だけで米原価の改善と判断しない。',61,1)
# Figure annotations refer to controlled authored models, not source artwork.
for n,stem,slugs in [(60,'original-stage-denominators',['stage-good-mass-inference','stage-yield-input-transfer','stage-yield-composition','zero-defects-not-best-yield']),(61,'original-rice-cost-bases',['rice-bases-opposite-change','rice-cost-assumptions','rice-cost-per-output','rice-total-yield-not-cost-verdict'])]:
 for slug in slugs:
  u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug);p=f'assets/food-manufacturing/source-practice{n}-f8119/{stem}.webp';s=newpacks[n]['sections'][0]
  u['imageEvidence']=[{'path':p,'sha256':sha((R/p).read_bytes()),'sha256Mode':'file','relation':'direct','semanticReviewed':True,'reviewNote':'Own controlled calculation diagram; source/figure assumptions and arithmetic checked directly. Browser image pixels/native rendering not accepted.','keyObjectiveId':u['knowledgeId'],'caption':s['titleJa'],'alt':s['textJa'],'rights':'Original app-authored controlled illustration; no source artwork copied.'}]
# Supplemental source heading/ruby/frame disposition is authored after inspecting
# the remaining object list and full rendered pages. Unread108availability stays pending.
for page,ids in[(102,[0,296,297]),(106,[0,241]),(107,[0,211])]:
 for i in ids:
  e=next(e for e in regions['ssw2']['pages'][page-1]['elements']if e['elementId']==f'food-2:p{page}:e{i:04d}')
  assert e['classification']=='pending';e.update(classification='decorative'if e['kind']=='vector'else'navigation',knowledgeIds=[],reason='Visually inspected publication footer/page-margin outline; no instructional equation, label, diagram line or caption removed.')
for p in[102,106,107]:assert not any(e['classification']=='pending'for e in regions['ssw2']['pages'][p-1]['elements']),p
# Baseline content already teaches stage formulas; record the actual baseline
# accurately instead of treating every newly mapped source unit as missing.
for slug in['stage-yield-input-transfer','stage-yield-composition']:
 u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug);u['batchRemediation']['baselineContentStates']=dict(u['before'])
