"""Executed by the canonical builder after historical provenance import.
All acceptance decisions below are authored semantic comparisons, never matches
produced by the census coordinates or a topic-keyword classifier.
"""
BATCH_RECEIPT='docs/ssw-workspace/food-manufacturing/source-v2-batch2-20261102/source-review.json'
packs={n:read(D/f'source-closure{n}.json')for n in [47,49,51,52,53,54]}
def leaf(n,kind,index=0,point=None,note=''):
 x=packs[n]['sections' if kind=='teaching' else 'checks'][index]
 pointer=f'/sections/{index}/textJa' if kind=='teaching' else (f'/checks/{index}/expectedPointsJa/{point}' if point is not None else f'/checks/{index}')
 value=x['textJa'] if kind=='teaching' else (x['expectedPointsJa'][point]if point is not None else x)
 return evidence(f'src/data/food-manufacturing/source-closure{n}.json',pointer,value,note)
def accept(slug,t,a,why):
 u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug)
 u['batchRemediation']={'baselineCommit':'d38397e7569b136777ba2c219ab0df56d9c4eee1','previousAfter':dict(u['after']),'reviewRef':BATCH_RECEIPT,'semanticComparison':why}
 u['priorEvidence']={'teaching':u['teachingEvidence'],'assessment':u['assessmentEvidence']}
 u['teachingEvidence']=[leaf(t,'teaching',note=why)]
 if isinstance(a,tuple):u['assessmentEvidence']=[leaf(a[0],'assessment',a[1],a[2],why)]
 else:u['assessmentEvidence']=[question(a,why)]
 u['after']={'teaching':'present','assessment':'present'};u['status']='covered_ai';u['unresolved']=[]
 u['sourceReview']={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':BATCH_RECEIPT}
for slug,point in [('single-limit',0),('alternating-fourteen',1),('two-of-three',2),('four-of-five',3),('central-fifteen',4),('noncentral-eight',5)]:
 accept(slug,49,(51,0,point),'Read source93 diagram/caption including count and consecutive window; teaching49 states it, original sequence '+str(point)+' in check51 independently requires its recognition. The exercise near-bands are explicitly hypothetical, not universal factory thresholds.')
accept('chart-setting-authority',51,(51,0,6),'Source92 generally assigns line setting to the management department using product characteristics; teaching and expected response explicitly preserve department/product/criteria scope.')
for slug,point in [('chart-central-variance',0),('chart-mixed-populations',1),('chart-limit-action',2)]:
 accept(slug,51,(51,1,point),'Source92 use-case read as hypothesis/action, not proven cause: action-check explicitly asks for the matching investigation or prescribed correction and rejects shape-only certainty.')
for slug,point in [('labor-cost',0),('material-cost',0),('energy-cost',0),('company-plan-components',1),('company-factory-line',1),('leader-plan-implementation',1),('qcd-cost-delivery',2),('production-environment',2),('progress-delivery',2)]:
 accept(slug,52,(52,0,point),'Source95/96 condition read independently. New prompt asks classification, extra plan components/responsibility or delivery/environment scope; selected response explicitly answers this particular claim. q301/q275 broad candidates were not upgraded.')
for slug,point in [('output-alternative-measures',0),('reciprocal-scope',0),('standard-time-sum',1),('standard-throughput',1),('progress-chart-axes',2),('above-below-plan',2),('management-tradeoff-role',5)]:
 accept(slug,53,(53,0,point),'Source96–100 formula/diagram/role directly read. Fictional data change numbers and context; prompt requires this unit and selected response preserves denominator, units, sum, graph labels or decision authority specifically.')
# The day/month question does not yet require the month distinction explicitly.
# Keep that existing unit partial until a direct assessment is available.
for slug,point in [('pre-run-equipment',0),('chart-versus-checklist',1),('delay-upstream',1),('delay-material-lot',1),('delay-equipment',1),('delay-worker-condition',1),('end-run-records',2)]:
 accept(slug,54,(54,0,point),'Read source100–102 start/run/end scope. The new handover asks this equipment/diagnosis/recording requirement explicitly; answer enumerates its conditions and roles. Earlier patrol/wording questions remain historical candidate evidence.')
# Newly enumerated exact claims are not inferred from old source page totals.
new=[('normal-upstream-local-delay',101,[72,540,530,684],'前工程の供給が正常でも自工程が遅れると仕掛品が滞留し品質へ悪影響を与え得ると説明する。',54,(54,0,1)),
 ('chart-line-legend',93,[84,165,530,627],'管理図のCL・UCL・LCLをそれぞれ中心線・上方限界・下方限界として区別する。',47,(47,0,0)),
 ('no-cash-cost',95,[72,399,530,485],'製造現場で現金を支払わなくても資源使用の費用は発生すると説明する。',52,(52,0,0)),
 ('end-share-next-work',102,[72,54,530,91],'終業時の課題と改善点を前後工程の職長・作業者と共有し次の作業に活用する。',54,(54,0,2)),
 ('damage-notify-supervisor',102,[72,89,530,194],'清掃時点検で設備・備品の破損を確認したら直ちに上司へ連絡する。',54,(54,0,3)),
 ('missing-fragment-qa',102,[72,143,530,194],'破片が未発見なら製品混入の可能性を検討して品質保証部門へ連絡する。',54,(54,0,3))]
for slug,page,box,statement,t,a in new:
 manual(slug,page,box,statement)
 accept(slug,t,a,'New source-first claim self-read in exact source elements; frozen teaching and explicit application response checked. No whole-page or expert acceptance is inferred.')
for slug,t,a in [('cost-planned-range',52,(52,0,2)),('cost-unit-reduction',53,(53,0,0)),('person-day-month',53,(53,0,4)),('late-material-plan-review',54,(54,0,0))]:
 accept(slug,t,a,'Follow-up self-review first rejected answer-only evidence, then explicitly added the condition to the frozen Japanese prompt and all twelve direct translations. The response now tests this requested planned-cost/resource-cost/day-month/late-material condition.')

# Complete source93 region disposition was checked visually, not inferred from
# the fact that the eight rectangles had content or from having eight examples.
page=regions['ssw2']['pages'][92];scopeid='food-v2-chart-workplace-criteria'
header_ids=[f'food-2:p93:e{i:04d}'for i in range(1,15)]
for e in page['elements']:
 if e['elementId']in header_ids:
  e['classification']='knowledge';e['knowledgeIds']=[scopeid]
 elif e['elementId']in [f'food-2:p93:e{i:04d}'for i in range(15,20)]:
  e['classification']='navigation';e['knowledgeIds']=[];e['reason']='Visually checked figure number/title, identifying the control-chart figure; no additional instructional claim.'
 elif e['elementId']=='food-2:p93:e0000':
  e['classification']='navigation';e['knowledgeIds']=[];e['reason']='Visually checked printed page84 and copyright footer; publication/navigation metadata only.'
 elif e['elementId']in ['food-2:p93:e0137','food-2:p93:e0262','food-2:p93:e0263']:
  e['classification']='decorative';e['knowledgeIds']=[];e['reason']='Visually checked page/figure frame or footer outline; no data line, symbol, label or caption removed.'
assert not any(e['classification']=='pending'for e in page['elements'])
u=next(x for x in units if x['knowledgeId']==scopeid)
ref=next((r for r in u['sourceRefs']if r['pdfPage']==93),None)
if ref is None:u['sourceRefs'].append({'sourceId':'food-2','pdfPage':93,'elementIds':header_ids})
else:ref['elementIds']=sorted(set(ref['elementIds']+header_ids))
# The printed progress diagram on99 and the continued worked labour example
# were read separately from the prose descriptions on98/100.
def add_ref(slug,page,box):
 u=next(x for x in units if x['knowledgeId']=='food-v2-'+slug);els=exact_elements(page,box)
 for e in els:e['classification']='knowledge';e['knowledgeIds']=sorted(set(e['knowledgeIds']+[u['knowledgeId']]))
 ref=next((r for r in u['sourceRefs']if r['sourceId']=='food-2'and r['pdfPage']==page),None)
 if ref:ref['elementIds']=sorted(set(ref['elementIds']+[e['elementId']for e in els]))
 else:u['sourceRefs'].append({'sourceId':'food-2','pdfPage':page,'elementIds':[e['elementId']for e in els]})
add_ref('progress-chart-axes',99,[140,145,465,370])
add_ref('labor-output-per-mh',99,[72,735,530,785])
add_ref('line-standard-ratio',99,[170,606,200,624])
for page,ids in [(99,[0,202,203]),(101,[0,354,355,356])]:
 for i in ids:
  e=next((e for e in regions['ssw2']['pages'][page-1]['elements']if e['elementId']==f'food-2:p{page}:e{i:04d}'),None)
  if e and e['classification']=='pending':
   e['classification']='decorative'if e['kind']=='vector'else'navigation';e['knowledgeIds']=[];e['reason']='Visually checked footer/copyright or page-margin outline; no instructional labels, formula marks or data lines.'
# PDF100 equation e prints MH on both ratio operands although surrounding
# prose uses kg/MH. Preserve the issue, never copy the dimensional typo.
u=next(x for x in units if x['knowledgeId']=='food-v2-labor-output-per-mh')
u['sourceNotes']=['PDF100 equation e labels its compared values MH; surrounding explanation identifies productivity kg/MH. App independently compares identical productivity units. This printed-label discrepancy is retained in the source-review receipt; page100 is not marked semantically complete.']
# Reciprocal reconciliation removes only authored annotation links; source
# coordinates/content hashes remain untouched.
for u in units:
 for ref in u['sourceRefs']:
  if ref['sourceId']=='food-2':
   actual={e['elementId']for e in regions['ssw2']['pages'][ref['pdfPage']-1]['elements']if u['knowledgeId']in e['knowledgeIds']}
   ref['elementIds']=sorted(set(ref['elementIds'])&actual)

# Exact controlled app assets, separate from the private source diagrams.
for slug,n,asset in [(slug,51,'six-original-series')for slug in ['single-limit','alternating-fourteen','two-of-three','four-of-five','central-fifteen','noncentral-eight']]+[(slug,53,'original-progress')for slug in ['progress-chart-axes','above-below-plan','standard-throughput']]:
 u=next(x for x in units if x['knowledgeId']=='food-v2-'+slug);path=f'assets/food-manufacturing/source-practice{n}/{asset}.webp'
 u['imageEvidence']=[{'path':path,'sha256':sha((R/path).read_bytes()),'sha256Mode':'file','relation':'direct','semanticReviewed':True,'reviewNote':'Original controlled numeric model, not source artwork. Source/app claim, count, units, line/point relationships and caption binding self-checked; actual browser/native pixel rendering remains unverified.','keyObjectiveId':u['knowledgeId'],'caption':packs[n]['sections'][0]['titleJa'],'alt':packs[n]['sections'][0]['textJa'],'captionPath':f'src/data/food-manufacturing/source-closure{n}.json#/sections/0/textJa','rights':'app-authored original controlled illustration; no source image copied'}]
