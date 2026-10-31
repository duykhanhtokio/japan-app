"""Write candidate option-specific rationale work orders, never runtime patches."""
from pathlib import Path
import json
OUT=Path(__file__).resolve().parent
idx={q['id']:q for q in json.loads((OUT/'question-ledger.json').read_text())['questions']}
reasons={
1:['最小表示量は表示の刻みであり、実際の測定誤差がその値以内だという保証ではありません。','公差判定への適合には器具の仕様、状態、測定方法と要求公差の確認が別に必要です。','0.01 mmはこの器具の表示の最小単位を表します。測定の正確さとは区別します。','表示の細かさは清拭、動き、すき間、がたつき等の使用前確認を省く根拠ではありません。'],
2:['表示上のゼロ設定と物理的ながたつきは別です。残る異常を報告し、承認された確認手順に従います。','ボタンで表示を変えても、物理的ながたつきがなくなった証拠にはなりません。','測定値を書き直しても、がたつきという器具の状態は解消しません。','表示桁数だけでは器具の状態や公差判定への適合を保証できません。'],
3:['光にかざしてジョウ間を見る項目は、測定対象の材質判別ではありません。','製品の合格公差は図面・仕様等で確認し、ジョウ間の光だけで決めません。','ジョウ間の光を見る方法は、電池残量を確認する方法ではありません。','この項目は閉じたジョウ間のすき間を確認するものです。表示のゼロ確認とは区別します。'],
4:['外形が似たノギスでも読取単位が同じとは限りません。','持ち替えた器具に指定された目盛り構成と最小読取値を確認します。','この資料の副尺式の例から、すべての器具が0.01 mmとは判断できません。','資料中で最も細かい数値を任意に選ぶのではなく、実際の器具の仕様を使います。'],
5:['資料ではすき間確認のほか、スライダの滑らかな動きとがたつきの確認を挙げています。','販売価格は、使用前のスライダ状態の確認項目ではありません。','測定回数の順位は、器具の滑らかな動きやがたつきの確認を置き換えません。','製品の色で承認済み公差を勝手に変える項目ではありません。'],
6:['ゼロ表示を設定しても、製品公差と判定方法の確認は必要です。','ゼロボタンは表示の設定であり、測定面の汚れを物理的に除去する操作ではありません。','ゼロ表示は表示上の確認にすぎず、ジョウ間のすき間やがたつきがない証明にはなりません。','ゼロ表示を設定しても、使用器具の仕様の確認は省略できません。'],
7:['0.5 mmと2 mmは、この資料が挙げる副尺の最小読取値の組合せではありません。','この資料は副尺の例として0.1 mm、0.05 mm、0.02 mmを挙げています。全機種の共通仕様とはしません。','1 mm、0.01 mm、0.001 mmの組合せは、ここで問う資料の副尺例と一致しません。','0.01 mm、0.005 mm、0.002 mmの組合せは、ここで問う資料の副尺例と一致しません。'],
8:['紙上学習を終えたことは、実器具の調整を開始する承認にはなりません。','構造や仕様が異なる器具へ、同じ調整方法を一律に適用しません。','表示のゼロ設定だけで物理的な調整や使用前確認がすべて完了したとは判断しません。','実器具を扱う前に、指定器具の仕様、権限と承認された手順を確認します。'],
}
backlog=[]
for i,rs in reasons.items():
 q=idx[f'mfg1-caliper-supplement-check-{i:02d}']
 backlog.append({'questionId':q['id'],'recordSha256':q['recordSha256'],'issue':'shared_explanation_without_option_specific_reasons','sourcePath':q['sourcePath'],'jsonPointer':q['jsonPointer'],'lessonId':q['taughtBinding']['lessonId'],'paragraphId':q['taughtBinding']['explicitParagraphId'],'options':[{'index':o['index'],'keyedCorrect':o['keyedCorrect'],'textJa':o['textJa'],'existingReasonJa':None,'proposedReasonJa':rs[o['index']],'requiredBeforeAcceptance':['Compare exact source-guide paragraph and applicable source page.','Verify the keyed option and each distractor have distinct diagnosis.','Translate from approved Japanese into12locales with matching hashes.']} for o in q['options']],'status':'editorial_candidates_not_applied_or_domain_accepted'})
num_reasons={
10:['スリーブの0.5 mmを落とすと14.23 mmになります。','スリーブ14.5 mmにシンブル23×0.01 mmを加えると14.73 mmです。','14.5と23を数字列としてつなげず、単位をそろえて加えます。','図のスリーブを15 mmと読んだ場合の値であり、基準線を図と再照合します。'],
11:['正の差を負として引くと19.88 mmになります。','差12目盛りを0.012 mmとしており、図の0.01 mm/目盛りと一致しません。','20.00＋12×0.01＝20.12 mmです。','基準値だけで答え、指示された12目盛りの差を加えていません。'],
12:['負の差を正として足した値です。図の符号の指定と区別します。','10.090 mmは指定された5×0.002 mmという差と一致しません。','0.100 mmを引いた値であり、5×0.002＝0.010 mmを引く条件ではありません。','10.000−5×0.002＝9.990 mmです。'],
13:['この図では＋指示は基準より小さい内径を示すため、25.000−12×0.001＝24.988 mmです。','＋指示をそのまま内径への加算に使い、この図で指定された対応を逆にしています。','12目盛りを0.120 mmとしており、0.001 mm/目盛りを使っていません。','指示された12目盛りの差を無視して基準値だけを答えています。'],
14:['Bは反対側へ抜ける穴で、底のあるAとは違います。','Aには途中に底があり、反対側へ抜けない穴です。','AとBをまとめると、底のある穴と貫通穴を区別できません。','該当なしではなく、図のAに底が示されています。'],
15:['Aは途中に底があり、反対側へ抜けません。','AとBをまとめると、非貫通のAまで含めてしまいます。','Bは反対側へ開口し、貫通しています。','該当なしではなく、図のBが反対側へ抜けます。'],
16:['⌀6の6は穴の直径であり、深さ寸法ではありません。','16は板厚であり、穴Aの底までの深さではありません。','7は図がAの深さとして指定した9 mmと一致しません。','穴Aの深さとして示された寸法は9 mmです。'],
17:['図の方式ではBの基本記号が基線の上にあり、矢の反対側を示します。','AとBの記号位置を比較し、この資料の矢側・反対側の対応を区別します。','矢側と反対側を一律に両方とせず、記号位置に対応する側を選びます。','Cの折れた矢の指定と、Bの基線に対する基本記号位置の指定を混同しません。'],
18:['図Cの折れた矢の先は左部材の開先を示していません。','折れた矢の先は右部材の開先へ届き、この部材を指定します。','この図の指定を両部材へ広げず、矢の先が示す部材を特定します。','折れた矢による指定があるため、指定なしとは判断しません。'],
19:['90 mmは20 mmの赤区間3本の和ではありません。区間と空きを分けて数えます。','始点間ピッチ35 mmを3本分足した105 mmは、赤区間の合計ではありません。','赤区間の長さ20 mmを3本分足し、20×3＝60 mmです。','45 mmは赤区間20 mmの3本分とは一致しません。'],
20:['20 mmは赤区間の長さであり、隣の区間までの空きではありません。','35 mmは始点間ピッチであり、赤区間の長さを含んでいます。','ピッチと区間長を足すのではなく、空きはピッチから区間長を引きます。','始点間ピッチ35 mmから区間長20 mmを引き、空きは15 mmです。'],
21:['同じ始点どうしの間隔として図が示す値は35 mmです。','15 mmは隣接する赤区間の空きであり、始点間ピッチではありません。','20 mmは赤区間自体の長さであり、始点間ピッチではありません。','60 mmは赤区間3本の合計であり、隣接始点間のピッチではありません。'],
}
for i in range(1,22):
 q=idx[f'mfg38-mechanical-q{i:03d}'];correct=q['options'][q['correctIndex']]['textJa']
 sides=[]
 for o in q['options']:
  if i<=7:
   got=o['textJa'].split('/');expected=correct.split('/')
   wrong=[f'{n+1}番目は{a}ではなく{b}' for n,(a,b) in enumerate(zip(got,expected)) if a!=b]
   draft=('指定順のパネルは'+correct+'です。' if o['keyedCorrect'] else '指定順との対応が違います。'+'、'.join(wrong)+'です。')
   todo='For each mismatched tuple position, name the sign meaning of the chosen panel and expected panel using the actual figure; the tuple comparison alone is not visual acceptance.'
  elif i==8:
   draft=['においを確かめるため顔を近付けると曝露のおそれがあります。識別はラベル・SDS等で行います。','危害表示は危険情報であり、すべての作業の許可を与えるものではありません。','危険表示を外しても危険はなくならず、必要な情報を失います。','図Bは腐食性に関わる模型です。ラベル・SDSと指定の取扱条件を確認します。'][o['index']];todo='Check the graphic is the declared corrosion model and the warning does not imply universal PPE or operation permission.'
  elif i==9:
   draft=['津波向け避難先の模型なので、指定された避難先とそこまでの経路を確認します。','表示はあらゆる建物の津波安全性を保証するものではありません。','避難先表示は注意区域へ自由に入る許可ではありません。','AEDの場所と津波避難の必要性は別の判断です。'][o['index']];todo='Confirm E in the actual drawing and retain jurisdiction/site-specific evacuation limits.'
  else:draft=num_reasons[i][o['index']];todo='Reopen the exact bound PNG/SVG, verify scale/arrow/units/symbols, then confirm the misconception diagnosis. Authored declared values are not proof of figure fidelity.'
  sides.append({'index':o['index'],'keyedCorrect':o['keyedCorrect'],'textJa':o['textJa'],'existingReasonJa':o['reasonJa'],'proposedReasonJa':draft,'requiredFigureReview':todo})
 backlog.append({'questionId':q['id'],'recordSha256':q['recordSha256'],'issue':'same_reason_repeated_on_every_option','sourcePath':q['sourcePath'],'jsonPointer':q['jsonPointer'],'lessonId':q['taughtBinding']['lessonId'],'options':sides,'status':'editorial_candidates_not_applied_figure_source_domain_pending'})
assert len(backlog)==29 and sum(len(q['options']) for q in backlog)==116
(OUT/'option-rationale-backlog.json').write_text(json.dumps({'date':'2026-10-31','questionCount':29,'optionSides':116,'status':'candidate_work_orders_not_runtime_changes','publicationRequirements':['Source and figure comparison','Correct-side plus every distractor semantic review','12locale explicit translations and source hashes','No pre-submission answer leakage'],'questions':backlog},ensure_ascii=False,indent=2)+'\n')
print('Candidate rationale workorders',len(backlog),'option sides',116)
