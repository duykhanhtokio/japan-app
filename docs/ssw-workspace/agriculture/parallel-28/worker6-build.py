"""Author packet only; root owns canonical integration and publication."""
import json, hashlib, random, collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
BASE=ROOT/'docs/ssw-workspace/agriculture'
lessons={l['id']:l for l in json.loads((ROOT/'src/data/agriculture/lessons.ja.json').read_text())['lessons']}
allocation=json.loads((BASE/'parallel-28/allocation.json').read_text())['workers']['6']
existing=[q for f in ['weekly-checks.ja.json','mock-exams.ja.json'] for e in json.loads((ROOT/'src/data/agriculture'/f).read_text())['exams'] for q in e['questions']]
rows=[]
def add(lesson,paras,operation,condition,distinction,compared,hold,stem,correct,wrong,reasons):
    rows.append(dict(lessonId=lesson,paragraphIds=[lesson+'-p'+str(i) for i in paras],operationJa=operation,conditionJa=condition,whyDistinctFromExistingJa=distinction,comparedQuestionIds=compared,sourceHoldAssessmentJa=hold,stemJa=stem,correct=correct,wrong=wrong,reasons=reasons))
add('agr-flower-work-handling',[3],
 '切り花のつぼみ収穫の目的を、出荷時の損傷リスクと結び付ける。',
 '教材の掲載例に限定し、品目・出荷条件別の適期や温度を指定しない。',
 '既存問は品質低下の症状一覧または包装工程。ここでは収穫段階を選ぶ目的を区別する。',
 ['agr-par06-flowers-q10','agr-par06-flowers-q11'],
 'AGR-H-FLOWER-WORK-HARVEST-TEMPERATUREは全品目共通の段階・数値処方のみ保留。掲載例の目的に限定する。',
 '教材にある「つぼみで収穫する」例について、出荷担当者が伝える目的として合うものはどれですか。',
 '運ぶ間に花が傷むことを考え、収穫段階を選ぶ。',
 ['等級の違いをなくすため、収穫段階をそろえる。','水分補給を不要にするため、収穫段階を選ぶ。','予冷の工程を省くため、収穫段階を早める。'],
 ['教材は輸送時の傷みを考えた例として説明しています。全品目共通の収穫指示ではありません。','収穫段階をそろえることだけで等級の違いがなくなるという説明ではありません。','つぼみ収穫を水分補給の代わりにはしていません。','収穫段階と温度管理は別の確認です。予冷省略の根拠ではありません。'])
add('agr-flower-work-handling',[5],
 '出荷調整で等級と長さを別の検査項目として扱う。','切り花の出荷調整の記録を点検する場面。',
 '既存問の包装・症状・低温管理と異なり、選別指標の独立性を扱う。',
 ['agr-par06-flowers-q10','agr-par06-flowers-q11'],
 '包装用語・化学名・共通収穫段階の保留事項を使わない。',
 '切り花を同じ長さにそろえた後、記録に「等級確認も完了」と書かれていました。教材に沿う点検はどれですか。',
 '長さの確認とは別に、品質による等級の確認を行う。',
 ['長さがそろえば、品質による等級も同じと扱う。','品質の確認が済めば、長さの記録は取り消す。','長さの確認を、包装完了の記録に置き換える。'],
 ['教材では品質の比較と長さの比較を別々の確認にします。','同じ長さであることだけでは品質も同じとは分かりません。','品質と長さはどちらも出荷調整の確認事項です。','長さをそろえることと包装の完了は別の工程です。'])
add('agr-flower-work-handling',[1],
 '収穫後も養水分と蒸散・呼吸による品質変化を確認する理由を説明する。',
 '収穫時の外観がよかった切り花について、輸送中の品質を検討する。',
 '既存問は症状の名称を挙げる操作。本候補は収穫後の物質供給・消費の過程を確認する。',
 ['agr-par06-flowers-q10'],
 'AGR-H-FLOWER-WORK-PHOTOSYNTHESISに従い、収穫後の光合成ゼロという絶対命題は使わない。',
 '収穫時に外観がよい切り花でも、輸送中の養水分の状態を確認する理由として教材に合うものはどれですか。',
 '収穫後も、蒸散や呼吸に伴って品質が変わるため。',
 ['収穫後の品質は、選別した長さだけで決まるため。','収穫後の品質変化は、包装の種類だけで決まるため。','収穫後の養水分の確認は、等級名を決めるため。'],
 ['教材は養水分の供給と、蒸散・呼吸に伴う品質変化への注意を示しています。','長さは出荷調整の一項目で、品質変化の全てを決めるものではありません。','包装の確認だけで水分や生理的な変化の確認を代替できません。','養水分の状態の確認を等級名の決定だけへ限定していません。'])
add('agr-flower-work-coldchain',[3],
 '切り花の温度管理の目的を、エチレン発生と呼吸による消耗の抑制に対応させる。',
 '温度設定値を求めず、教材の説明する働きを比較する。',
 '既存問は予冷と一連の低温流通の範囲、または糖と抗菌剤の目的。本候補は温度管理の生理的な狙い。',
 ['agr-par06-flowers-q12','agr-par21-g5-q03'],
 'AGR-H-FLOWER-WORK-HARVEST-TEMPERATUREとCHEMICALSに従い、温度・濃度・製品処方を指定しない。',
 '教材で、切り花の温度管理の目的として説明される組合せはどれですか。',
 'エチレンの発生を抑え、呼吸による消耗を抑える。',
 ['エチレンの発生を増やし、呼吸による消耗を抑える。','エチレンの発生を抑え、呼吸による消耗を増やす。','エチレンの発生を増やし、呼吸による消耗を増やす。'],
 ['教材はこの二つを温度管理の目的として説明しています。老化が完全になくなるという保証ではありません。','消耗の方向は合いますが、エチレン発生の方向が逆です。','エチレンの方向は合いますが、呼吸による消耗の方向が逆です。','二つとも教材が説明する抑制の方向と逆です。'])
add('agr-flower-work-production',[2],
 '教材に載る切り花・鉢花・花壇苗の輸送費の比較を読む。',
 '資料内の相対比較として扱い、現在の見積額や利益を推定しない。',
 '既存問は出荷形態の列挙と費用・労力・利益の関係。本候補は輸送費という別の比較項目。',
 ['agr-par06-flowers-q06','agr-par21-g6-q01'],
 'AGR-H-FLOWER-WORK-ECONOMIC-CURRENTは現行価格保証を保留。設問は教材の掲載比較のみ。',
 '現在の見積額ではなく、教材に載る輸送費の比較を確認しています。説明に合うものはどれですか。',
 '切り花の輸送費は、鉢花や花壇苗より低いとされる。',
 ['鉢花の輸送費は、切り花や花壇苗より低いとされる。','花壇苗の輸送費は、切り花や鉢花より低いとされる。','三つの出荷形態の輸送費は、同じとされる。'],
 ['教材は切り花の輸送費が鉢花や花壇苗より低いという比較を載せています。','鉢花が他の二つより低いという比較は載せていません。','花壇苗が他の二つより低いという比較は載せていません。','教材の比較を、三つとも同じという関係へ変更しています。'])
add('agr-s27-climate-detail',[1,2],
 '日本の位置・主な気候帯・海洋性を対応させて整理する。',
 '国内各地の同一気候を保証せず、教材の国全体の背景を説明する。',
 '既存問は沖縄・北海道の南北差と冬の両側の地域差。本候補は東アジア沿岸・主に温帯・海洋性という国全体の位置付け。',
 ['agr-2-w01-q01','agr-2-w01-q03'],
 '現在の個別気象や災害予測を作らず、資料中の地理・気候の背景だけを扱う。',
 '地域ごとの違いを学ぶ前に、教材にある日本全体の背景を整理します。合う組合せはどれですか。',
 '東アジアの沿岸に位置し、主に温帯で海洋性の特徴がある。',
 ['東アジアの沿岸に位置し、主に亜熱帯で大陸性の特徴がある。','東アジアの内陸に位置し、主に温帯で大陸性の特徴がある。','東アジアの内陸に位置し、主に亜寒帯で海洋性の特徴がある。'],
 ['教材の位置・主な気候帯・海洋性という三つの説明に対応します。国内全地点が同じという意味ではありません。','沿岸という位置は合いますが、主な気候帯と海洋性の説明が異なります。','主に温帯という部分は合いますが、内陸・大陸性という組合せではありません。','内陸という位置と、主な気候帯の説明が異なります。'])
add('agr-s27-production-2019',[1,2,3,4,5,6],
 '掲載四品目の小計を算出し、農業全体の総額と区別する。',
 '2019年・億円という同じ条件で、教材に載る四品目だけを集計する。',
 '既存問は野菜割合の指標や分母の確認。本候補は明示した部分集合の金額集計と総額の区別で、単なる割合値の置換ではない。',
 ['agr-2-w01-q06','agr-2-w01-q09'],
 '数値は2019年の掲載値に固定。現在値へ置き換えず、未掲載品目の内訳を推定しない。',
 '教材の2019年の掲載値は、野菜21,515億円、米17,484億円、果実8,399億円、花き3,264億円です。この四品目を集計した報告はどれですか。',
 '四品目の小計は50,662億円で、農業全体の総額ではない。',
 ['四品目の小計は50,662億円で、農業全体の総額である。','四品目の小計は89,387億円で、農業全体の総額と等しい。','四品目の小計は47,398億円で、四品目全てを集計している。'],
 ['21,515＋17,484＋8,399＋3,264＝50,662です。四品目は農業全体の全品目ではありません。','計算値は合いますが、四品目の小計を農業全体とする範囲の誤りです。','89,387億円は教材の農業全体の値で、掲載四品目の足し算ではありません。','47,398億円では花き3,264億円が加わっていません。'])
add('agr-s27-rice-history',[5],
 '米の歴史的消費量を一人当たり年間量という指標で読む。',
 '教材が示す1962年度約118kgと2021年度約50.8kgを比較する。',
 '既存問は産出額の割合や金額単位。本候補は人数と期間で規格化された消費量の意味を扱い、年の明示だけを再出題しない。',
 ['agr-2-w01-q06','agr-2-w01-q07'],
 '年度・約・kg・一人当たり年間を保持し、全国総量や現在の消費量へ読み替えない。',
 '教材の「1962年度は約118kg、2021年度は約50.8kg」という米消費量を比べています。両方の数値が測っているものはどれですか。',
 '一人が一年間に消費する米の量。',
 ['日本全体が一年間に消費する米の量。','一人が一か月間に消費する米の量。','国内で一年間に生産する米の総量。'],
 ['教材の指標は一人当たり年間の消費量です。','全国の総量ではなく、一人当たりにした指標です。','年間という期間を一か月へ変えています。','消費量を生産量へ変え、さらに一人当たりという条件を失っています。'])
add('agr-s27-rice-history',[1],
 '兆円と億円の混合表記を同じ金額単位へ換算する。',
 '2021年の米の掲載額「約1兆4千億円」を億円へ統一する。',
 '既存問は比較前に単位を確認する必要性。本候補は具体的な単位換算の実行であり、既存の肥料百分率計算とは算術操作が違う。',
 ['agr-2-w01-q07','agr-par03-fertilizer-q13'],
 '約と2021年の条件を保持。2019年値や現在値へ変更しない。',
 '教材の2021年の米の産出額「約1兆4千億円」を、一覧表の「億円」だけの表記に直します。対応する金額はどれですか。',
 '約14,000億円。',
 ['約1,400億円。','約4,001億円。','約140,000億円。'],
 ['1兆円は10,000億円なので、10,000＋4,000＝14,000億円です。','1兆円を億円へ直す際に、一桁小さくしています。','1兆円を1億円として足してしまっています。','正しい換算額より一桁大きくしています。'])
add('agr-s27-self-supply-2019',[3],
 '重量ベース自給率が低い品目と輸入依存の関係を説明する。',
 '2019年の小麦16％・大豆6％について、資料が述べる解釈に限定する。',
 '既存問はカロリーと重量という指標の違い。本候補は同じ重量指標内の低い自給率と輸入依存の関係を説明する。',
 ['agr-2-w01-q08'],
 '2019年の掲載説明。現在の輸入割合や相手国、各農場の自給率を補わない。',
 '教材では2019年の重量ベース自給率が小麦16％、大豆6％と示されています。この二品目について教材が結び付ける説明はどれですか。',
 '自給率が低く、輸入への依存が大きい。',
 ['自給率が低く、輸入への依存も小さい。','自給率が高く、輸入への依存が小さい。','自給率が高く、輸入への依存も大きい。'],
 ['教材はこの二品目の低い自給率と輸入依存の大きさを結び付けています。','輸入への依存の説明が教材と逆です。','自給率の評価と輸入への依存の説明がどちらも異なります。','輸入依存の部分は合いますが、掲載自給率を高いとする説明ではありません。'])
add('agr-s27-vegetable-origins',[2,3,4,5],
 '日本原産の範囲と日本で栽培する野菜の範囲を区別する。',
 '資料の約20種類と約160種類という二つの見出しを保つ。',
 '既存問の野菜の利用部位・科・栽培場所の区分とは異なる原産と栽培分布の関係。個別の品目名を替える分類問題は別問に作らない。',
 ['agr-1-w01-q04','agr-vegwork-weekly-q03'],
 '資料に掲載する範囲の対比のみ。全野菜一覧や現在の網羅的種類数を保証しない。',
 '教材の「日本原産は約20種類」と「日本で栽培されるのは約160種類」を整理した説明はどれですか。',
 '日本で栽培される野菜には、外国から導入された例も含まれる。',
 ['日本で栽培される約160種類は、日本原産という区分と一致する。','日本原産の約20種類だけが、日本で栽培されている。','外国から導入された野菜は、日本で栽培される範囲に入らない。'],
 ['原産という区分と、日本で栽培する範囲は同一ではなく、教材には導入例も載ります。','原産と栽培する場所という別の情報を同一視しています。','国内で栽培する範囲を原産例だけへ狭めています。','教材に載る導入例も、日本で栽培される野菜です。'])
add('agr-s27-fruit-components',[3,4],
 '教材の果実成分の四群を、果樹名や栽培技術と分けて対応させる。',
 '教材が例示する成分群を答え、他の成分が含まれないとは主張しない。',
 '既存問に果実成分の組合せはなく、栽培地域・器官・技術の名称対応とは対象知識が異なる。一群ずつの名詞置換問題へ分割しない。',
 ['agr-1-w01-q07','agr-1-w01-q08'],
 '成分量・個別果実の含有保証・食品医療効能は扱わない。',
 '教材が果樹の果実に多く含まれる成分の例として挙げる、四つの群の組合せはどれですか。',
 'ビタミン類・ポリフェノール類・食物繊維・ミネラル。',
 ['ビタミン類・ポリフェノール類・タンパク質・デンプン。','ビタミン類・脂質・食物繊維・デンプン。','ポリフェノール類・脂質・タンパク質・ミネラル。'],
 ['この四群が教材の成分例として挙げられています。個別果実の量を保証する一覧ではありません。','後半二つが教材の四群の組合せと異なります。これらを含まないという意味ではありません。','脂質とデンプンを加えた組合せは、教材が挙げる四群ではありません。','脂質とタンパク質を加えた組合せは、教材が挙げる四群ではありません。'])
add('agr-s27-fruit-components',[5],
 '果実の機能性への関心の記述と、疾病予防・治療の保証を区別する。',
 '資料の説明の強さを保ち、個別食品の健康効果を推奨・断定しない。',
 '既存問の栽培条件や統計指標とは異なり、食品の機能性についての紹介と効能保証の境界を扱う。ただし一般的な限定表現問題との横断重複は root review で確認する。',
 ['agr-par03-fertilizer-q02'],
 '食品の具体的な医療効能を新規主張しない。教材の「注目されている」の読解に限定する。',
 '教材に「果実の健康維持や病気予防などの機能性が注目されている」とあります。この説明の強さを保つ報告はどれですか。',
 '機能性への関心を紹介しており、個々の果実の効能を保証していない。',
 ['機能性が注目されているので、個々の果実の予防効果は確認済みである。','病気予防という語があるので、個々の果実に治療効果を認めている。','健康維持という語があるので、どの果実でも同じ効果があるとしている。'],
 ['関心の対象を述べた説明を、個別の効果の保証へ広げていません。','注目されているという説明は、個々の予防効果の確認済みを意味しません。','病気予防への関心を、治療効果の承認へ変えています。','資料の説明から全ての果実に同じ効果があるとは判断できません。'])

objectives=[];questions=[]
positions=[2,0,3,1,1,2,0,3,2,1,0,0,3]
for n,r in enumerate(rows,1):
 l=lessons[r['lessonId']]; ps={p['id']:p for p in l['paragraphs']}
 kids=list(dict.fromkeys(k for pid in r['paragraphIds'] for k in ps[pid]['knowledgeIds']))
 oid=f'AGR-ASSESS-P28-W6-{n:02d}'; qid=f'agr-2-m03-q{n:02d}'
 objectives.append({k:v for k,v in r.items() if k not in ['stemJa','correct','wrong','reasons']}|{'id':oid,'knowledgeIds':kids})
 options=[r['correct']]+r['wrong']; reasons=r['reasons']; order=[1,2,3]; random.Random(280600+n).shuffle(order);order.insert(positions[n-1],0)
 questions.append({'id':qid,'objectiveId':oid,'topicJa':l['chapter'],'stemJa':r['stemJa'],'optionsJa':[options[i] for i in order],'correctIndex':order.index(0),'optionReasonsJa':[reasons[i] for i in order],'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'knowledgeIds':kids,'nativeReviewed':False,'domainReviewed':False})
assert len(rows)==13 and sum([21515,17484,8399,3264])==50662
existing_ids={q['id'] for q in existing};existing_stems={q['stemJa'] for q in existing}
for o,q in zip(objectives,questions):
 assert q['stemJa'] not in existing_stems and q['id'] not in existing_ids
 assert len(set(q['optionsJa']))==4 and len(q['optionReasonsJa'])==4
 assert set(o['comparedQuestionIds'])<=existing_ids
 assert q['lessonId'] in allocation['lessonIds'] and '2' in lessons[q['lessonId']]['levels']
for i in range(2,len(questions)):
 assert not(questions[i]['correctIndex']==questions[i-1]['correctIndex']==questions[i-2]['correctIndex'])
packet={'worker':6,'level':'2','formId':'agr-2-m03','status':'candidate_pending_independent_review','completeForm':False,'objectives':objectives,'questions':questions,
 'omittedCandidates':[
 {'scope':'flower name/organ/woody-herbaceous and seasonal membership replacements','reasonJa':'既存の品目対応・季節対応問題の名前置換となるため、新規問題へ追加しない。'},
 {'scope':'primula/perennial natural versus horticultural annual life','reasonJa':'既存の本来の性質と園芸利用の区別という操作を繰り返すため除外。'},
 {'scope':'cold-chain gap and front/back chemical stages','reasonJa':'既存の予冷・コールドチェーンと前処理・後処理の問題に意味が重なる。'},
 {'scope':'2019/2021 crop amounts and shares name/number replacements','reasonJa':'歴史値を現在としない・割合の分母を確認するという既存操作を作物ごとに水増ししない。'},
 {'scope':'rice-type geography/stickiness/milling names, direct seeding merits/drawbacks','reasonJa':'既存の一般問題8問と主な操作が重なり、品種名や条件文の言換えで別問にしない。'},
 {'scope':'1886 and undated market/chemical/taxonomy/photo-based identification','reasonJa':'未解決・専門照合待ちのため採点可能な事実として使用しない。'},
 {'scope':'additional 27 questions to fill40','reasonJa':'現行21割当レッスンだけでは、既存452問と今回13候補から独立した27操作を確保していない。新しい源頁知識の追加・対照が必要。'}],
 'review':{'aiSelfReviewed':True,'independentAiReviewed':False,'humanReviewed':False,'domainReviewed':False,'nativeReviewed':False,'freshPdfVerified':False,'globalSemanticDedupComplete':False,'existingAllocatedQuestionCount':sum(q['lessonId'] in allocation['lessonIds'] for q in existing),'answerPositionCounts':dict(collections.Counter(q['correctIndex'] for q in questions)),'schemaAndSourceBindingCheck':'PASS','mathChecks':{'four2019AmountsSubtotal':50662,'oneTrillionFourThousandOkuInOku':14000},'inputFileSha256':{str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'src/data/agriculture/lessons.ja.json',ROOT/'src/data/agriculture/weekly-checks.ja.json',ROOT/'src/data/agriculture/mock-exams.ja.json',BASE/'knowledge-ledger.json']}},
 'notes':'13問の部分草稿。新しい原典知識を導入せず既存source-checked本文を根拠とする。40問完成・800問能力・専門承認・端末確認を主張しない。全候補は他workerと既存全問題への独立review後に採否を決める。特に汎用的な読解操作となる候補7/9/13は横断reviewで厳しく再検討する。'}
(BASE/'parallel-28/worker6.json').write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'questions':len(questions),'objectives':len(objectives),'positions':packet['review']['answerPositionCounts'],'completeForm':False},ensure_ascii=False))
