"""Manual source102–106 semantic inventory; census geometry only locates what was read."""
BATCH3_RECEIPT='docs/ssw-workspace/food-manufacturing/source-v2-batch3-20261102/source-review.json'
for n in [55,56,57]:packs[n]=read(D/f'source-closure{n}.json')
def unit3(slug,page,box,statement,n,point=None,oldq=None,conditions=()):
 manual(slug,page,box,statement,conditions=conditions)
 u=units[-1];u['teachingEvidence']=[leaf(n,'teaching',note='Self-read this exact claim and its conditions; independently authored explanation, current hash-bound Japanese leaf. Supplied terminology acceptance is not inferred.')]
 u['assessmentEvidence']=[question(oldq,'Read existing question/options/answer/all reasons before reuse; directly tests this stated source competence within its conditions.')if oldq else leaf(n,'assessment',0,point,'New prompt explicitly requires this source claim/condition. Read its independently authored task and this exact expected response; numeric assumptions are fictional, not factory limits.')]
 u['after']={'teaching':'present','assessment':'present'};u['status']='covered_ai';u['unresolved']=[];u['sourceReview']={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':BATCH3_RECEIPT};u['batchRemediation']={'baselineCommit':'2ddd8cdbf676c157b3bac3b6544e58ad78bd2a3a','previousAfter':{'teaching':'unknown','assessment':'unknown'},'reviewRef':BATCH3_RECEIPT};return u
unit3('yield-total-input-formula',102,[72,470,530,680],'基本の重量歩留りを出来高重量と投入原料合計重量で計算する。',55,4,conditions=['対象工程と単位をそろえる。特定原料だけを分母にする炊飯倍率とは区別する。'])
unit3('yield-process-scope',103,[72,55,530,103],'歩留りを基本的に工程単位で管理し分子分母の対象工程をそろえる。',55,4)
for slug,statement in [('prep-vegetable-parts','野菜の皮や芯など必要な不可食部位を除く。'),('prep-fish-parts','魚の骨やヒレなど必要な不可食部位を除く。'),('prep-meat-parts','肉の筋や腱など必要な不可食部位を除く。'),('prep-unsuitable-damage','傷みなど使用に適さない原料部分を除く。')]:unit3(slug,103,[72,155,530,251],statement,55,0)
unit3('prep-quality-not-100',103,[72,248,530,306],'良質原料では不可食部分が少なく歩留りが高くなる場合も必要な除去後に100%とは限らない。',55,0)
unit3('prep-forced-yield-foreign-matter',103,[72,282,530,343],'無理に前処理歩留りを上げて骨や皮を残すと異物問題につながる。',55,oldq='food-2-q072')
unit3('prep-purchased-exception',103,[72,330,530,366],'処理済み原料を購入して対象の前処理工程がなければその工程の歩留り管理は対象外と区別する。',55,1,conditions=['その前処理工程の範囲に限定する。全工程管理不要とはしない。'])
unit3('prep-figure-input-output',103,[145,378,455,476],'前処理図の投入・処理後重量から重量減少と歩留りを読み取る。',55,4,conditions=['出典図の数値は例示。アプリでは独自の600g・480gモデルを用いる。'])
unit3('heating-evaporation-yield',103,[72,520,530,655],'加熱による水分蒸発で出来高重量と歩留りが変わることを説明する。',55,2)
unit3('heating-quality-not-max',103,[72,520,530,655],'歩留りだけを高めるために必要な加熱を省かず目標の品質条件に合わせて管理する。',55,2)
unit3('season-origin-water-quality',103,[72,707,530,782],'季節や産地による原料品質の違いに対して製品品質をそろえるため加水量を調整する場合がある。',55,3)
unit3('rice-specific-denominator',104,[72,55,530,225],'米を分母にした炊飯倍率と全投入重量による比率を区別し200%超もあり得ると説明する。',55,3,conditions=['米だけを分母にした倍率。200%を一律の工場目標や全投入歩留りにしない。'])
unit3('rice-water-softness-target',104,[72,55,530,225],'加水で炊飯倍率を上げても軟らかくなり過ぎる可能性があり製品の目標範囲を確認する。',55,3)
for slug,statement in [('loss-production-mistake','製造ミスを食品ロスの一要因として確認する。'),('loss-container-residue','容器や設備内の残渣を食品ロスとして確認する。'),('loss-defective-products','不良品の発生を食品ロスとして確認する。'),('loss-drop-leak','工程外への落下や流失を食品ロスとして確認する。'),('loss-overweight-control-precision','重量管理や設備精度の不良による過剰重量を食品ロスの要因として確認する。'),('loss-equipment-trouble','設備トラブルを食品ロスの要因として確認する。'),('loss-recurrence-prevention','食品ロスの改善を失敗やミスの再発防止につなげる。'),('loss-process-control-level','食品ロスの改善を工程管理水準の向上につなげる。'),('loss-equipment-operation-capability','食品ロスの改善を設備管理運営能力の向上につなげる。'),('loss-100-scope','食品ロスによる歩留り低下を改善して100%を目指す管理と品質条件の範囲維持を区別する。')]:unit3(slug,104,[72,365,530,540],statement,56,0)
unit3('yield-quality-target-range',104,[72,592,530,782],'必要な原料処理や加熱は品質基準を守った結果の歩留りを目標範囲で管理する。',56,1)
unit3('yield-both-extremes-investigate',104,[72,592,530,782],'歩留りは低いときだけでなく高過ぎるときも品質やロスの問題を調べる。',56,1)
unit3('prep-low-material-method-tool',105,[72,65,530,176],'前処理歩留り低下では原料品質と処理手順・器具を分けて確認する。',56,oldq='food-2-q306')
unit3('yield-high-input-water',105,[72,182,530,296],'計画外に高い歩留りでは規定原料の投入不足や過剰な加水と製品品質を確認する。',56,oldq='food-2-q345')
unit3('yield-sales-basis-mass',105,[72,360,530,780],'重量売りの歩留りを実際の出来高重量と投入重量から計算する。',57,0)
unit3('yield-bag-theoretical-count',105,[72,600,530,780],'袋数売りでは投入重量を一袋規格重量で割って理論袋数を求め実績袋数と比較する。',57,1)
unit3('yield-bag-nominal-mass',106,[72,55,530,380],'袋数と規格重量から換算した出来高を用いて袋数基準と同じ歩留りを求める。',57,2)
unit3('yield-overfill-value',106,[72,55,530,380],'袋数売りでは規格を超える実重量が同じ割合の販売価値を生むとは限らないと説明する。',57,2)
unit3('yield-sales-method-difference',106,[72,390,530,560],'同じ実重量でも製品規格や販売単位で歩留り評価が異なることを説明する。',57,2)
unit3('yield-average-fill-count',106,[72,390,530,610],'規格を守り過剰な平均充填重量を減らす管理が同じ製品重量から得る袋数に関わると説明する。',57,2)
# No automatic removal of remainder regions. Every unassigned fragment remains
# pending until separately identified on the viewed page.
for n,asset,slugs in [(55,'original-process-masses',['yield-total-input-formula','prep-figure-input-output','heating-evaporation-yield','rice-specific-denominator']),(57,'original-bag-value',['yield-sales-basis-mass','yield-bag-theoretical-count','yield-bag-nominal-mass','yield-overfill-value','yield-average-fill-count'])]:
 for slug in slugs:
  u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug);p=f'assets/food-manufacturing/source-practice{n}/{asset}.webp';u['imageEvidence']=[{'path':p,'sha256':sha((R/p).read_bytes()),'sha256Mode':'file','relation':'direct','semanticReviewed':True,'reviewNote':'Original controlled mass-bar model, independently computed and visually checked. Not source artwork; no browser/native image-pixel acceptance inferred.','keyObjectiveId':u['knowledgeId'],'caption':packs[n]['sections'][0]['titleJa'],'alt':packs[n]['sections'][0]['textJa'],'rights':'app-authored original controlled illustration; no source image copied'}]
# Explicitly identify the remaining headings/ruby and publication outlines after
# reading each page. They are retained; no font-size or keyword pruning occurs.
for page,ids,why in [
 (103,list(range(19,26)),'Raw-preparation subsection heading; its claims/illustration are separately inventoried.'),
 (103,list(range(122,129)),'Heating subsection heading; the evaporation/quality body is separately inventoried.'),
 (103,list(range(201,206)),'Added-water subsection heading; seasonal/origin conditions continue in the separately inventoried body.'),
 (104,list(range(79,84)),'Yield-management subsection heading; its two management scopes are separately inventoried.'),
 (105,[2],'Ruby fragment of the other-cases subsection heading; body claims are separately inventoried.'),
 (105,list(range(118,127)),'Worked-yield-example heading; all conditions and alternative sales bases are separately inventoried.')]:
 for i in ids:
  e=next(e for e in regions['ssw2']['pages'][page-1]['elements']if e['elementId']==f'food-2:p{page}:e{i:04d}')
  if e['classification']=='pending':e.update(classification='navigation',knowledgeIds=[],reason='Visually checked: '+why)
add_ref('heating-evaporation-yield',103,[510,513,530,525])
add_ref('loss-100-scope',104,[72,274,530,345])
add_ref('yield-quality-target-range',104,[72,560,530,586])
for page,ids in [(103,[0,255,256]),(104,[0,353]),(105,[0,246,247])]:
 for i in ids:
  e=next(e for e in regions['ssw2']['pages'][page-1]['elements']if e['elementId']==f'food-2:p{page}:e{i:04d}')
  if e['classification']=='pending':e.update(classification='decorative'if e['kind']=='vector'else'navigation',knowledgeIds=[],reason='Visually checked printed page/copyright footer or page-margin outline; not an instructional data line, symbol, label or caption.')
for page in [103,104,105]:assert not any(e['classification']=='pending'for e in regions['ssw2']['pages'][page-1]['elements']),page
# Preserve what the baseline app already demonstrated. Newly establishing an
# exact source mapping does not mean all of its knowledge was missing before.
for slug in ['prep-forced-yield-foreign-matter','prep-low-material-method-tool','yield-high-input-water']:
 u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug);u['before']={'teaching':'present','assessment':'present'};u['baselineEvidence']={'teaching':[teach('food-2-025','p3'if slug=='prep-low-material-method-tool'else'p2','Baseline paragraph was read directly and already expresses this claim.')],'assessment':u['assessmentEvidence']};u['remediationKind']='source_mapping_of_existing_direct_content'
for slug in ['loss-container-residue','loss-defective-products','heating-quality-not-max']:
 u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug);u['before']['teaching']='present';u['baselineEvidence']={'teaching':[teach('food-2-025','p2','Baseline paragraph already teaches this narrowly stated residue/defect/required-quality claim; separate assessment source mapping was still unestablished.')]};u['remediationKind']='existing_teaching_with_new_application'
for slug in ['prep-vegetable-parts','prep-fish-parts','prep-quality-not-100','heating-evaporation-yield','yield-total-input-formula','loss-drop-leak','yield-bag-nominal-mass','yield-sales-basis-mass']:
 u=next(u for u in units if u['knowledgeId']=='food-v2-'+slug);u['before']['teaching']='partial';u['remediationKind']='condition_or_subcase_extension'
for u in units:
 if u.get('batchRemediation',{}).get('reviewRef')==BATCH3_RECEIPT:
  u['batchRemediation'].pop('previousAfter',None);u['batchRemediation'].update(previousCanonicalUnitPresent=False,baselineContentStates=dict(u['before']));u.setdefault('remediationKind','new_exact_source_inventory_and_application')
for slug in ['prep-forced-yield-foreign-matter','prep-unsuitable-damage']:
 next(u for u in units if u['knowledgeId']=='food-v2-'+slug)['importance']='safety'
