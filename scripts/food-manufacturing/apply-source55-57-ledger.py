"""Three source-first groups, using existing teaching only where scope matches.
Executed by build-coverage-ledger-v2.py after earlier accepted source groups.
"""
NEXT_RECEIPT='docs/ssw-workspace/food-manufacturing/source-v2-batch3-20261102/source-review.json'
def next_unit(slug,page,box,statement,lesson=None,paragraph=None,qids=(),gap=None,conditions=()):
 manual(slug,page,box,statement,lesson,paragraph,qids,conditions=conditions)
 u=units[-1]
 u['sourceReview']['reviewRef']=NEXT_RECEIPT
 u['before']={'teaching':'unknown','assessment':'unknown'}
 if gap:
  u['status']='partial'
  u['unresolved'].append(gap)
  # A source caveat not in the selected app evidence stays explicitly open.
  u['after']['teaching']='partial' if u['teachingEvidence'] else 'unknown'
  u['after']['assessment']='unknown'
  u['assessmentEvidence']=[]
 return u

# Group55: line coordination and the exact numerator/denominator of yield.
u=next_unit('line-balance-coordination',102,[72,220,530,437],
 '自工程の進捗だけでなく全体の滞留を確認し、前後工程と速度や応援を調整する。',qids=['food-2-q071'])
p=read(D/'source-closure54.json')['sections'][0]
u['teachingEvidence']=[evidence('src/data/food-manufacturing/source-closure54.json','/sections/0/textJa',p['textJa'],
 'Existing independent handover explicitly links WIP quality, adjacent processes, speed and support; q071 asks the action under own-process delay. No claim that local speed alone improves the whole line.')]
u['after']={'teaching':'present','assessment':'present'};u['status']='covered_ai';u['unresolved']=[]
next_unit('yield-weight-denominator',102,[72,493,530,680],
 '重量歩留りを出来高重量と投入原料重量の比として、対象をそろえて計算する。',
 'food-2-025','p1',['food-2-q400'],conditions=['重量で評価する場合。百分率表示は比率に100を掛ける。'])

# Group56: raw preparation and cooking. Do not close the purchased-input caveat
# or the evaporation mechanism from a generic quality question.
next_unit('yield-preparation-quality',103,[72,158,530,369],
 '不可食部位や不適切な部分を除く処理を省かず、歩留りと品質を両立させる。',
 'food-2-025','p2',['food-2-q072','food-2-week-05-q01'])
u=next_unit('yield-preprocessed-input-exception',103,[72,324,530,370],
 '処理済み原料を購入して使う場合は、原料処理工程の歩留り管理と区別する。',
 gap='The purchased-preprocessed-input exception is not stated in lessons025/026; no direct current assessment accepted. Add a narrowly scoped teaching/application pair without implying all receiving/quality checks are unnecessary.')
p=read(D/'source-closure55.json')
u['teachingEvidence']=[evidence('src/data/food-manufacturing/source-closure55.json','/sections/0/textJa',p['sections'][0]['textJa'],'New independent explanation limits the exception to the raw-processing step not performed in-house; receiving/quality checks are not globally waived.')]
u['assessmentEvidence']=[evidence('src/data/food-manufacturing/source-closure55.json','/checks/0',p['checks'][0],'A/B factory comparison explicitly asks both the absent processing-step yield-control scope and whether quality checks may be omitted; expected response preserves the distinction.')]
u['after']={'teaching':'present','assessment':'present'};u['status']='covered_ai';u['unresolved']=[]
next_unit('yield-cooking-evaporation',103,[72,519,530,660],
 '加熱で水分が減り重量が変わるため、所定の調理品質に合う加熱条件で歩留りを評価する。',
 'food-2-025','p1',gap='Paragraph p1 states water loss, but does not explicitly teach selecting cooking-quality conditions before yield control. q266 checks an abnormal high yield, not the evaporation/quality-setting explanation.')

# Group57: added-water denominator and interpreting high yield by quality.
next_unit('yield-added-water-over100',104,[72,38,530,220],
 '加水後の出来高を特定の乾燥原料重量で割ると100％を超えることがあり、分母を明記する。',
 'food-2-026','p3',['food-2-q307'],conditions=['全投入量を分母にした比率と特定原料に対する比率を混同しない。'])
next_unit('yield-cooking-multiplier-context',104,[72,70,530,220],
 '炊飯歩留りは生米に対する出来上がり量で、炊飯倍率とも呼び、加水増加だけを改善としない。',
 'food-2-026','p3',gap='Generic water/denominator teaching exists, but the rice-specific term and cooked-quality example need explicit teaching and assessment. Source describes over200% as a common example, not a universal target.')
next_unit('yield-high-quality-investigation',104,[72,546,530,780],
 '目標より高い歩留りも品質条件の逸脱を疑い、加熱や水分と製品品質を調べる。',
 'food-2-025','p2',['food-2-q266'])
next_unit('yield-low-target-investigation',104,[72,690,530,780],
 '目標範囲より低い歩留りではロスと製品品質を調査し、数値だけで原因を決めない。',
 'food-2-025','p3',gap='Raw-lot q306 checks a narrower cause comparison; it does not establish a general low-target yield/loss-or-product-quality assessment. Keep this distinction open.')
