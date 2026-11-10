exec((__import__('pathlib').Path(__file__).parent/'finish-audit.py').read_text())
# Second manual clause-level pass: repeated bare topic links are replaced by exact additional anchors.
def evidence(fnum,lesson,anchor,why):
 f=next(x for x in p['facts'] if x['id']==f'rst31-operations2-f{fnum:03}');l=lessons[f'rst-2-ops-{lesson:02}'];t=next(x for x in l['paragraphs'] if x['id']==anchor)
 f['existingEvidence'].append(dict(kind='lesson_paragraph',lessonId=l['id'],paragraphId=anchor,path='src/data/restaurant/lessons.2.ja.json',field=anchor+'.textJa',textJa=t['textJa'],textSha256=sha(t['textJa']),reason=why))
def bindadd(nums,aid):
 for num in nums:
  f=next(x for x in p['facts'] if x['id']==f'rst31-operations2-f{num:03}');f['additionIds'].append(aid);f['decision']='covered_after_additions'
# Four narrow genuine residual gaps, independently explained rather than adjacent-lesson padding.
a=add('qsca-and-repeat',1,'雰囲気と心配りを再来店へ結ぶ','Qは商品の品質、Sは接客、Cは清潔、Aは業態に合う雰囲気で、照明やBGMなども客の体験に関わる。Hは相手の喜びを自分の喜びと考える心で、客にも働く仲間にも向ける。商圏や一回の支出が限られる店では、適正な価格で安定した体験を提供し、繰り返し来店してもらうことが重要である。固定客の顔や希望の席・料理を覚えて感謝を伝え、新規客にはQSC全体を整えて再来店へつなぐ。満足した客の口コミやSNSの推奨は別の新規客へ広がる可能性がある。商品は正確に説明し、追加注文を断る選択も尊重する。食事時間外のアイドルタイム割引は、来店の少ない時間への誘引を狙うが、ほかの時間からの移動や粗利益も確認する。',[2,13,14,37,45,47],[5,10,21]);bindadd([1,11,12,33,40,42],a)
a=add('staffing-service-definition',2,'サービス内容と人時指標をそろえる','人時接客数は客数を総労働時間で割る。客席まで配膳するフルサービスでは、そのサービスにも時間を使うので、同じ客数でも必要人時は変わる。ファストフード等の数値と比べる前にサービス内容をそろえ、高いほど無条件に良いと判断しない。育成で作業能力を高め、必要な接客水準を保ったまま同じ粗利益を少ない人時で生めれば、人時生産性は上がる。売上から原価を引いた粗利益からは、さらに人件費・家賃・光熱費・販売管理費などを負担する。粗利益と、それらを引いた営業利益を混同しない。率を百分率で書いた値の差はポイントで表し、差へ再び100を掛けない。',[7,9,10,15],[7,8,15]);bindadd([5,7,8,13],a)
a=add('delivery-buffer-scope',5,'配送期間と予備量の仮定を明示する','参照教材の例は月曜発注・火曜納品、木曜発注・金曜納品である。火曜受入れは火・水・木曜、金曜受入れは金・土・日・月曜の需要を見込む。予測誤差等に備えて売上計画の120％分を確保するという仮定を置き、予測精度が高ければ110％でもよいと説明している。全食材へ同じ率を機械的に掛ける規則ではない。自店では納期、使用期限、保管能力、使える在庫と確定済み入荷を確認し、対象期間と予備量の根拠を分けて記録する。',[28],[17,18]);bindadd([25],a)
a=add('training-observation',9,'独力でできるまで観察する','接客の基本の型は、手本を見た後に繰り返し実演して身につける。OJTは原則一対一で、本人が一人で基準どおり実施できるまで確認し、長い作業は区切って練習する。視線、表情、声の出し方、姿勢、手の使い方も観察対象である。OFFJTは現場を離れた集合教育で理念や知識を学び、OJTへ結び付ける。声の質・高低・抑揚をトーン、話すリズムや語尾の強弱を語調として区別し、同じ案内でもどう伝わるかを客役に説明してもらう。速さだけでなく質と安全を確認する。',[76,77,79,80],[24,25]);bindadd([69,70,73,192,193],a)
a=add('management-purpose',17,'理念と作業計画の役割をつなぐ','経営理念は、企業がどのように社会へ貢献するかという目的を明文化し、商品や人に関する判断の方向を共有するものである。標準は現場で何を実現するかを具体化し、人事考課の成果・能力・勤務行動から配置と育成課題を見つける。トレーニングプログラムでは必要技能と目標、確認方法を定める。売上計画に基づくワークスケジュールは、個人別・時間帯別の作業割当てで、訓練時間も組み込む。計画・実施・評価・修正を次の計画へ戻し、理念を額に飾るだけで終えない。',['ref05'],[30,31]);bindadd([197,202,209],a)
# Clause-specific missing supporting paragraphs; previous single paragraph was insufficient.
for num,lesson,anchor,why in [
 (1,1,'knowledge','Explicit peer-directed hospitality, individual customer consideration and QSCA phrase; source market limitation remains in original roles anchor.'),
 (2,1,'roles-and-qsc-checks','Lists manager/deputy/acting manager and time-slot role; initial knowledge anchor supplies operational duties and authority check.'),
 (4,1,'roles-and-qsc-checks','Adds teaching/training and replenishment/cleaning/maintenance basis absent from fifteen-group anchor alone.'),
 (8,2,'knowledge','Exact gross-profit-over-hours formula and person-hour definitions; additional new supplement explains training and service conditions.'),
 (10,4,'knowledge','Exact total-hours formulas, weekday/event forecasts; initial target-band paragraph alone does not contain every formula.'),
 (10,4,'scenario','Skill-based evening peak allocation and compare forecast/actual afterwards.'),
 (19,3,'procedure','Both subtraction orders explicitly compared with −3/+3point example; initial reference band supplies scope.'),
 (23,5,'knowledge','Demand from menu recipes and lead-time; native ordering exercise binds supplier-specific forecast grid.'),
 (27,5,'procedure','Specifies open packs counted exactly and two-person year-end checks; new receipt paragraph adds vendor-labelled returns.'),
 (29,5,'procedure','Explicit three-way order/delivery-note/physical goods comparison, date/time and specification checks.'),
 (30,6,'abc-set-and-repeat-customers','General70/90/100 thresholds are source examples varying by enterprise; worked classification supplies arithmetic.'),
 (31,6,'knowledge','Seasonal menu named, while existing q211 explicitly checks displacement of regular sales.'),
 (31,6,'scenario','Adds actual replacement and gross-profit/peak-load observation, not only generic ABC procedure.'),
 (32,6,'procedure','Adds gross-profit/time/waste pre/post measurements to set-efficiency causal possibility.'),
 (40,6,'abc-set-and-repeat-customers','Repeat-visit gratitude for semi-regular guests; new supplement explicitly distinguishes regular preferences and greeting.'),
 (43,12,'procedure','Exact monthly60h-over and75%night condition absent from initial knowledge paragraph alone.'),
 (44,11,'knowledge','Exact daily8/weekly40 and eligible44h conditions absent from procedure alone.'),
 (45,14,'procedure','All four proportional rows and tenure columns; knowledge covers initial/general conditions.'),
 (45,14,'mistakes','General vs proportional eligibility30h/5days/217days; initial knowledge paragraph alone insufficient.'),
 (49,8,'knowledge','Hope/job/time conditions and listening to wishes; new fair-recruitment passage supplies safe document scope.'),
 (49,8,'interview-and-first-day-plan','Explicit relationship-department approval before hiring confirmation.'),
 (67,9,'mistakes','Explicitly rejects speed-only grading; initial knowledge only names standard time.'),
 (70,9,'knowledge','Adds attitude/posture, facial expression, volume and intonation to voice rehearsal paragraph.'),
 (73,9,'mistakes','Explicit no solo assignment merely after video/verbal assent; new observation passage supplies until-independent criterion.'),
 (79,15,'knowledge','Building-wide use/occupancy and applicability; procedure supplies managerial position/qualification/filing.'),
 (120,17,'knowledge','Adds exact person-hour numerator/denominator and period distinctions to management-role paragraph.'),
 (160,11,'mistakes','Explicit daily8h not automatically extended under44h exception.'),
 (172,13,'mistakes','Explicit payment does not cure absent36agreement; knowledge only gives agreement/filing requirement.'),
 (192,9,'knowledge','Adds on-site technical learning definition to procedure one-to-one training.'),
 (194,1,'roles-and-qsc-checks','Adds realization of QSC in actual operation to all-work definition.'),
 (199,17,'procedure','Adds evaluation→training/programme/schedule usage to initial concrete assessment criteria.'),
 (206,17,'management-terms-and-trainee-roles','Adds period-based sales/control costs; q335 provides explicit annual→monthly gross-profit budgeting.')]:evidence(num,lesson,anchor,why)
# Make changed new supplement wording cover stated source duties, not implicit topic similarity.
a=next(a for a in p['additions'] if a['id']=='rst31-operations2-monthly-cost-log');a['textJa']+='月次に決めた対策を日々の作業で実施し、担当が確認記録を残す。'
a=next(a for a in p['additions'] if a['id']=='rst31-operations2-fire-structure-check');a['textJa']=a['textJa'].replace('避難通路を空けるだけでなく、','消防設備、消防用水、消火活動に必要な設備の点検整備は、適切な担当と計画に従って実施する。避難通路を空けるだけでなく、')
a=next(a for a in p['additions'] if a['id']=='rst31-operations2-training-frequency');a['textJa']+='昼夜を問わず教育が届くよう、勤務時間帯ごとの参加と未参加者の補講も確認する。';bindadd([86],a['id'])
a=next(a for a in p['additions'] if a['id']=='rst31-operations2-after-evacuation');a['textJa']+='通報、客の避難誘導、従業員の役割分担という三つのマニュアルを準備する。火災・地震など災害ごとの初動を区別し、その時点の人員で連絡と安全な誘導を実行できるよう計画する。'
# Exact source-example numbers are explicitly excluded, not falsely taught by an equivalent exercise.
for n in range(163,169):
 f=next(f for f in p['facts'] if f['id']==f'rst31-operations2-f{n:03}')
 for e in f['existingEvidence']:e['kind']='equivalent_competency_only';e['reason']='Teaches independent equation/denominator competency only. It does NOT contain these exact historical source-example quantities; exact numbers are reference-excluded, not claimed as taught.'
 f['questionIds']=[]
# Audit log specific to each source range. Every original209 record was reread, not approved via script/nonempty checks.
for f in p['facts']:
 f['clauseReview']={'reviewedByAI':True,'reviewBasis':'Manual second read of all original209 statement/anchor pairs and actual paragraph text; additions or extra anchors recorded where claims exceeded one paragraph. No native/domain certification.'}
 if f['additionIds']:f['clauseReview']['disposition']='all stated clauses require named new supplement(s), plus the listed retained paragraphs; not existing-only closure'
 elif f['decision']=='reference_excluded':f['clauseReview']['disposition']='source example acknowledged, no exact-number teaching claimed'
 elif f['existingEvidence'] and f['existingEvidence'][0].get('kind')=='native_guide_label':f['clauseReview']['disposition']='exact single behavioral label in current guide and source table'
 elif 121<=int(f['id'].rsplit('f',1)[1])<=155:f['clauseReview']['disposition']='exact tenure/row value in current annual-leave paragraph plus eligibility condition paragraphs'
 else:f['clauseReview']['disposition']='specific authored definition/formula/condition compared against listed paragraphs; assessment scope reviewed separately below'
# Question links are deliberately scoped. A parent-level/general decision is NOT proof for every clause.
for f in p['facts']:
 f['assessmentEvidence']=[{'questionId':qid,'coverage':'partial_or_representative_only','reason':'Question supports the named unit competency but does not certify every clause/table cell in this fact; do not promote to full atomic assessment coverage.'} for qid in f['questionIds']]
 f['assessmentStatus']='not_individually_assessed' if not f['questionIds'] else 'partially_or_representatively_assessed'
# Exact narrow facts with direct calculations/conditions/actions; manually selected, not topic-wide promotion.
full={6:['rst-2-q101','rst-2-q110'],14:['rst-2-q003'],17:['rst-2-q094','rst-2-q113'],18:['rst31-operations2-q017'],20:['rst31-operations2-q003'],21:['rst31-operations2-q003'],22:['rst-2-q102'],35:['rst31-operations2-q018'],36:['rst31-operations2-q018'],37:['rst31-operations2-q018'],38:['rst31-operations2-q018'],39:['rst-2-q085'],41:['rst31-operations2-q019'],46:['rst-2-q387'],47:['rst-2-q384'],48:['rst-2-q383'],50:['rst31-operations2-q020'],51:['rst31-operations2-q020'],52:['rst31-operations2-q021'],53:['rst-2-q100'],54:['rst31-operations2-q021'],55:['rst31-operations2-q021'],56:['rst31-operations2-q022'],63:['rst31-operations2-q023'],64:['rst31-operations2-q023'],65:['rst31-operations2-q024'],66:['rst31-operations2-q024'],67:['rst31-operations2-q024'],76:['rst-2-q025'],77:['rst-2-q292'],78:['rst-2-q074'],79:['rst-2-q368','rst-2-q389'],80:['rst-2-q363'],83:['rst31-operations2-q027'],85:['rst31-operations2-q027'],88:['rst31-operations2-q027'],89:['rst31-operations2-q027'],94:['rst31-operations2-q010'],97:['rst31-operations2-q028'],98:['rst31-operations2-q011'],99:['rst31-operations2-q011'],100:['rst31-operations2-q029'],101:['rst31-operations2-q030'],102:['rst31-operations2-q030'],103:['rst31-operations2-q031'],104:['rst31-operations2-q012'],106:['rst31-operations2-q032'],107:['rst31-operations2-q013'],109:['rst31-operations2-q014'],110:['rst31-operations2-q032'],111:['rst31-operations2-q014'],114:['rst-2-q363'],115:['rst-2-q363']}
# Do not assert a full match merely because a question shares a fact ID; apply only explicit list and present questions.
for n,qids in full.items():
 f=next(x for x in p['facts'] if x['id']==f'rst31-operations2-f{n:03}')
 # For shared compound cases retain partial unless every clause is actually in the stem/key/reason.
 for qid in qids:
  if qid not in f['questionIds']:continue
  for e in f['assessmentEvidence']:
   if e['questionId']==qid:e['coverage']='direct_narrow_competency';e['reason']='Manual review found the stem/key and specific rationale explicitly assess this fact’s narrow distinction/action/formula; full paragraph/source coverage is not inferred.'
 f['assessmentStatus']='direct_narrow_competency' if any(e['coverage']=='direct_narrow_competency' for e in f['assessmentEvidence']) else f['assessmentStatus']
for u in p['units']:
 fs=[f for f in p['facts'] if u['unitId'] in f['unitIds']]
 if u['decision']=='structural_aggregate':fs=[f for f in p['facts'] if any(c in f['unitIds'] for c in u['childUnitIds'])]
 u['factIds']=[f['id'] for f in fs];u['questionIds']=sorted({q for f in fs for q in f['questionIds']})
 if any(f['additionIds'] for f in fs) and u['decision']!='structural_aggregate':u['decision']='covered_after_additions'
 # Full assessment cannot be claimed for composite facts or every table cell.
 unresolved=[f['id'] for f in fs if f['assessmentStatus']!='direct_narrow_competency' and f['decision']!='reference_excluded']
 u['assessmentStatus']='partial_explicit_atomic_gaps' if unresolved else 'direct_narrow_competencies_assessed'
 u['unassessedOrPartialFactIds']=unresolved
 if unresolved:u['remainingFactGaps']=['Assessment remains partial for atomic facts: '+', '.join(unresolved)+'. Existing/new broad or representative questions are retained as partial evidence, not full closure.']
 u['knowledgeCoverageDecision']=u['decision']
 if unresolved and u['decision']!='structural_aggregate':u['decision']='blocked';u['reason']='Teaching is source-compared and additions authored, but precise atomic assessment gaps remain explicit; no blanket full-coverage promotion.'
for a in p['additions']:a['factIds']=[f['id'] for f in p['facts'] if a['id'] in f['additionIds']]
p['acceptance']['unresolved']=[x for x in p['acceptance']['unresolved'] if ': assessment gap' not in x]+['Atomic assessment coverage is partial; see each unit.unassessedOrPartialFactIds. Knowledge teaching and assessment closure are separate.']
p['jaFreeze']['status']='revised_clause_evidence_and_assessment_scope_pending_parent_review';p['jaFreeze']['additions']=len(p['additions']);p['jaFreeze']['sha256']=sha(json.dumps({k:p[k] for k in ['additions','questions','figures']},ensure_ascii=False,sort_keys=True,separators=(',',':')))
(OUT/'packet.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
print('REVIEWED',len(p['facts']),'facts;',len(p['additions']),'supplements;',collections.Counter(u['decision'] for u in p['units']),p['jaFreeze']['sha256'])
