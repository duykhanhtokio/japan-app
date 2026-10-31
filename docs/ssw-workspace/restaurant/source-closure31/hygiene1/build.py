from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent
# ROOT is repository: docs/ssw-workspace/restaurant/source-closure31/hygiene1 -> parents[5]
DOC='rst-1-hygiene';BASE='8a0ebfe5f799847ac1fd590a3b610cb0837f7667'
LESSONS={x['id']:x for x in json.loads((ROOT/'src/data/restaurant/lessons.1.ja.json').read_text())['lessons']}
QUESTIONS={q['id']:q for e in json.loads((ROOT/'src/data/restaurant/exams.1.ja.json').read_text())['exams']for q in e['questions']}
UNITS=[u for u in json.loads((ROOT/'docs/ssw-workspace/restaurant/knowledge-ledger.json').read_text())['units']if any(r['documentId']==DOC for r in u['sourceRefs'])]
facts=[];additions=[];questions=[];figures=[]
def uid(x):return f'{DOC}-k{x:03}'if isinstance(x,int)else f'{DOC}-{x}'
def ref(p,section):return {'documentId':DOC,'pdfPages':p,'section':section}
def fact(name,units,p,statement,lesson=None,para=None,q=None,add=None,scope=None):
 fid='rst31-hygiene1-f-'+name;us=[uid(x)for x in units];ev=[]
 if lesson:
  lid=f'rst-1-hyg-{lesson:02}';assert lid in LESSONS
  if para:assert any(x['id']==para for x in LESSONS[lid]['paragraphs'])
  ev.append({'kind':'lesson_paragraph','lessonId':lid,'paragraphId':para,'questionId':None,'path':'src/data/restaurant/lessons.1.ja.json','field':f'/lessons/{lid}/paragraphs/{para}/textJa','reason':statement})
 qs=[]
 if q:
  for key in q.split(','):
   qid=key if key.startswith('rst-')else 'rst-1-'+key;assert qid in QUESTIONS;qs.append(qid);ev.append({'kind':'question','lessonId':None,'paragraphId':None,'questionId':qid,'path':'src/data/restaurant/exams.1.ja.json','field':f'/questions/{qid}','reason':'Tests the stated distinction/action: '+statement})
 facts.append({'id':fid,'unitIds':us,'statementJa':statement,'sourceRefs':[ref(p,name)],'existingEvidence':ev,'additionIds':['rst31-hygiene1-a-'+add]if add else [],'questionIds':qs,'visualEvidence':[],'decision':'covered_after_additions'if add else 'covered_existing'if lesson else 'reference_excluded','scopeLimits':scope or ''});return fid
# Original explanations, grouped by a real learning objective rather than filling lesson length.
def addition(name,lesson,title,text):
 additions.append({'id':'rst31-hygiene1-a-'+name,'lessonId':f'rst-1-hyg-{lesson:02}','titleJa':title,'textJa':text,'unitIds':[],'factIds':[],'sourceRefs':[]})
addition('taxonomy',1,'原因と予防の対応表を読む','原因を分類してから対策を選ぶ。細菌性の例は腸管出血性大腸菌、サルモネラ属菌、ブドウ球菌で、付着・増殖・生残の三つを防ぐ。ウイルス性の例はノロウイルスとE型肝炎ウイルスで、食品への付着と加熱に加え、感染した人などから厨房へ持ち込ませず、汚れた手や物を介して広げない。洗剤・殺虫剤・農薬は化学性、アニサキス・回虫は寄生虫性である。薬剤の誤使用を防ぐ管理と、寄生虫を除去・失活させる管理は交換できない。資料中の発生割合は当時の説明で、現在の統計として暗記しない。')
addition('cold-growth',2,'低温管理の数字が示すこと','資料は多くの細菌について、10℃では増殖が遅くなり、−15℃では増殖が止まる目安を示す。これは全ての微生物が死ぬという意味ではない。冷蔵10℃以下・冷凍−15℃以下という例より食品の指定が厳しければ、指定条件を採用する。保存期限も別に確認し、必要量だけを取り出す。生肉・魚・卵を扱う前後、調理開始前、トイレや鼻をかんだ後には手を洗う。同じまな板や包丁を別用途に使うときは、肉片を拭くだけで切り替えず、洗浄と消毒を終える。')
addition('e-coli',3,'腸管出血性大腸菌と肉の経路','O157やO111などは腸管出血性大腸菌の例である。資料は牛・豚などの腸をもとの存在場所として挙げ、肉への付着から生食や加熱不足につながる経路を説明している。強い毒素が関係し、腹痛、水様の下痢、血を伴う下痢が起こり得る。症状だけで原因菌を決めず、異常は受診・報告につなげる。肉を扱う担当は、生の汁を他の食品へ移さない作業と中心までの加熱を両方確認する。')
addition('campy-salmonella',3,'家畜の腸・肉・卵を分けて結ぶ','カンピロバクターでは、牛・豚・鶏などの腸から肉への汚染を考え、生や加熱不足の肉を提供しない。サルモネラ属菌もこれらの動物の腸に存在し、肉だけでなく鶏卵に付いている場合がある。卵を扱った後も手や器具を切り替える。両者が同じ食品と関係する場合でも、卵を注意対象から外したり、鮮度だけで生食の安全を決めたりしない。')
addition('cereus-staph',3,'土に由来する菌と人に由来する菌','セレウス菌は河川や土壌などに広く存在し、土が付きやすい米などの穀類、豆類、香辛料と結び付けて考える。管理が不十分なチャーハンやスパゲティも注意する例である。黄色ブドウ球菌は皮膚だけでなく、のどや傷口にも存在する。手指の傷から食品へ移す経路を防ぐため、傷を報告し、食品へ落ちない保護と担当作業を確認する。「穀類だから安全」「傷が小さいから申告不要」とは判断しない。')
addition('welch-vibrio',3,'煮込みの冷却と魚介類の洗浄','ウェルシュ菌は人・動物の腸や土壌などに存在し、酸素の少ない環境で増殖し、芽胞を作る性質がある。カレーや煮物は、加熱の後に速やかに冷却する工程も確認する。腸炎ビブリオは海水や海の泥と関係し、海水温が高い季節に魚介類への汚染へ注意する。原材料に適した真水での洗浄や加熱を行う。洗浄は寄生虫を確実に失活させる代わりではなく、危害ごとに対策を分ける。')
addition('noro',4,'二枚貝の経路と人からの経路','ノロウイルスは、汚染された二枚貝などを十分に加熱せず食べる経路と、便・おう吐物から手や設備を介する経路の両方を考える。トイレ後の手洗いを省かず、汚物を扱う作業と食品の取扱いを区別する。2021年資料の冒頭の一般的な加熱目安を、二枚貝のノロウイルス対策に流用しない。厚生労働省のQ&Aでは、汚染のおそれのある二枚貝などは中心85〜90℃で90秒以上という目安である。店が対象食品と危害に合わせて決めた方法を確認する。')
addition('cloth',8,'板・包丁と布類の処理例を区別する','資料の板・包丁・へらの例は、見える汚れを水で落とし、洗剤を泡立てて洗い、流水ですすぎ、熱湯・塩素系薬剤・70％アルコールなどの指定方法で処理し、乾燥して清潔に保管する順序である。ふきん・タオルは、洗浄とすすぎの後、可能なら沸騰水で5分以上煮沸する例、または塩素系薬剤による処理例が示される。70％という数字だけで、全ての病原体や材質に使えるとはいえない。特にノロウイルスでは方法の適合を確認し、製品表示と店舗の手順を優先する。')
addition('toilet-sequence',9,'接触面から床・道具まで確認する','調理とは別の服・靴・ゴム手袋を使い、トイレ専用の洗剤と用具を準備する。資料の順序では、レバーやドアノブなど手が触れる面を指定の塩素系薬剤で処理し、手洗い設備を洗浄する。続いて便器を専用洗剤とブラシで洗って流水ですすぎ、その後に床を洗って流す。使った用具も洗浄して乾燥・保管する。便座や手すりを確認対象から落とさず、終了後は十分に手を洗う。薬剤の混合や別用途への流用は行わず、場所に合う使用条件を確認する。')
addition('work-exclusion',10,'症状が消えたことと復帰の判断を分ける','下痢やおう吐があれば責任者に連絡し、食品を直接扱う作業に入らず、受診などの指示を受ける。古い資料の「症状が治るまで」を、治ればすぐ復帰できるという許可と読み替えない。ノロウイルスでは症状が改善しても排出が続く場合があり、復帰する作業と確認方法は責任者・医療機関等の指示に従う。手指に傷がある場合は、資料ではばんそうこうで覆い、その上から手袋を着ける例を示す。化膿などの状態は隠さず報告し、手袋をしても手洗いを行う。')
addition('hand-sites',11,'手の面と二度洗いの範囲','石けんを取ったら、手のひらと指の腹、手の甲と指の背、指の側面・間・付け根、親指と母指球、指先、手首を順に洗う。母指球は親指の付け根のふくらみであり、親指の先だけを洗って終わらない。十分な流水で洗剤を流すまでが洗浄の一組で、資料の二度洗いは石けんを取るところからすすぎまでを繰り返す。最後に清潔に乾燥し、適合する消毒を行う。アルコールだけで、石けんと流水によるノロウイルスを減らす手洗いを置き換えない。')
addition('fugu',12,'特殊な廃棄物を一般のごみと分ける','資料は、ふぐの処理で生じる管理対象の廃棄物を、鍵の付いた容器で保管する扱いを挙げる。通常の食品残さをふた付き容器へ入れることとは区別する。これは地域や資格などの取扱条件を省略して、誰でもふぐを処理できるという説明ではない。自店の許可された作業、地域の規定、責任者が決めた保管・処分方法を確認し、一般の生ごみへ混ぜない。')
addition('haccp-name',13,'HACCPの名称から管理点へ','HACCPはHazard Analysis and Critical Control Pointの略で、危害要因の分析と重要管理点を結び付ける考え方である。入荷から提供までの工程で、何が危害となり、どこを温度や時間で確認するかを整理する。資料は10〜60℃を危険温度帯として説明するが、この外なら全ての危害が消えるという境界ではない。非加熱品は低温のまま、加熱品は中心まで加熱し、冷却する品はその温度帯を速やかに通過させる。短時間なら必ず安全と決めず、食品と工程の計画で判断する。')
addition('menu-components',13,'一皿を構成する食品ごとに工程を追う','同じ皿でも工程が違うことがある。資料の献立例では、ごはん、焼き物、揚げ物、茶碗蒸しは加熱して提供する側、刺身やレタスは非加熱側である。天つゆや汁は加熱後に冷やして翌日使うなら冷却・再加熱も管理する。サラダの生のレタスと、ゆでて冷やした卵やマッシュポテトを一つの工程にまとめない。そばの薬味の生ねぎと、ゆでて冷やす麺・つゆ、カツカレーの揚げたカツと前日仕込みのカレーも別々に追う。名称だけでなく、実際に加熱・冷却したかを書き出そう。')
addition('cold-service',13,'非加熱品を待たせる場合の資料例','サラダは洗浄して盛り付け、すぐ提供しないなら洗浄済みの材料を冷蔵して提供直前に取り出す。資料は、提供まで30分以上かかる食品を10℃以下で保存する例を示す。これは30分未満なら常温で無条件に安全という意味ではない。食品の指定条件と店の計画が優先し、必要な温度管理を続ける。最後の加熱工程がないため、残った微生物を増やさない管理と清潔な器具が重要になる。')
addition('heated-examples',14,'加熱群の料理名と確認項目','資料の加熱群には、ステーキ、焼き魚、焼き鳥、ハンバーグ、天ぷら、から揚げ、ごはんがある。加熱してすぐ出す工程だけでなく、加熱後の高温保管も含む。火力、油温、時間、肉汁、弾力、外観は、中心温度の確認で妥当性を確かめた条件に沿って利用する目安である。焼き色や湯気の絵だけを、安全を証明する結果にしない。高温保管がある場合も、その工程に合う温度確認を計画へ加える。')
addition('cooling-scope',15,'冷却の参考例を現行の原典と照らす','小さい清潔な容器へ分けたり冷却機器を用いたりして、加熱後は速やかに冷却し、食品の温度と経過時間を確認する。資料には、米国の例として2時間以内に21℃以下、さらに4時間以内に5℃以下という説明がある。FDA Food Code 2022では、対象となる加熱済み食品を57℃から21℃まで2時間以内、57℃から5℃以下まで合計6時間以内とする。米国のモデル規範の条件であり、日本の全飲食店に一律適用する法律ではない。日本の大量調理施設衛生管理マニュアルは、中心を30分以内に20℃付近、又は60分以内に10℃付近へ下げるよう工夫するとしている。資料の「さらに1時間」を足して90分の許容時間にしない。開始・終了時刻を残し、店が採用した適用対象の明らかな計画で確認する。')
addition('fish-and-objects',4,'魚の下処理と異物の種類','生で食べる魚介類は、原材料に適した真水で十分に洗い、汚染するおそれのある部分やものを取り除く。アニサキスの例にはサバ、イワシ、カツオ、サケ、イカ、サンマ、アジが挙がるが、この魚種以外なら安全という一覧ではない。新鮮な魚を選んで速やかに内臓を除き、内臓は生食用として提供しない。目視だけで全てを見つけられると考えず、必要な冷凍・加熱条件も確認する。金属、硬いプラスチック、ガラス、石などは硬質異物、毛髪、紙、ビニール、虫などは軟質異物の例で、虫など不快感を与えるものは不快異物とも呼ぶ。調理中も原材料も確認し、整理整頓で混入する経路を減らす。')
addition('plan-fields',16,'一般衛生の計画欄を埋める','計画では、原材料受入れ、庫内温度、交差汚染、器具、トイレ、従業員、手洗いを別々の確認項目にする。各項目に、いつ確認し、何をどのように確かめ、問題時にどうするかを定める。例えば受入れは納品時の包装・期限などの確認と返品・交換、庫内温度は実測と基準との比較、異常原因の確認と報告を組み合わせる。記載例にある「加熱して提供」を、どんな温度逸脱品でも救済できる規則にしない。器具・トイレの再洗浄、体調不良時の食品作業の停止、汚れた服の交換、手洗い直しなど、項目と対応を正しく組み合わせる。')
addition('five-process',16,'重要管理表は五つの工程欄を区別する','三つのグループを、記入する表では五つの工程に分けられる。非加熱で冷たいまま提供、加熱して熱いまま提供、加熱後に高温保管、加熱後に冷却して再加熱、加熱後に冷却して冷たいまま提供、の五つである。刺身、焼き魚、保温するごはん、翌日のカレー、ポテトサラダなどを、実際の工程に対応する欄へ置く。メニューと確認方法を並べて書き、冷却・再加熱欄なら両方の温度確認を入れる。空欄を料理名だけで埋めず、どの工程を確認するかまで決める。')
addition('record-grid',16,'日付・項目・温度・確認者を交点で読む','実施表の一つの値は、日付と確認項目の交点に属する。冷蔵庫と冷凍庫の温度を順番と符号付きで書き、受入れや手洗いなどの良否は各項目の欄に残す。特記事項には日付・時刻・対象・発見した状態・行った対応を結び付け、再確認した値も記す。確認者は実際に確認した人を示す。教材の数値や20分後の再確認は記入例であって、どんな異常も20分待ってよいという規則ではない。将来の日付を先に良で埋めず、未確認の欄を勝手に実施済みにしない。')
addition('critical-record',16,'加熱不良の記録を工程へ戻す','重要管理の実施表でも、五つの工程欄に料理名を対応させ、その日の良否を記す。資料の記入例は、ハンバーグの内部が赤いという申し出と、担当者が急いで温度確認を省いた事実を結び付けている。単に「注意した」で終えず、対象料理の提供判断、処置、実際の再確認、担当者への指示を事実として残す。色だけで加熱不足や安全を確定せず、必要な中心温度の確認へ戻る。記録は当日の説明だけでなく、繰り返す作業ミスや計画の改善点を探す資料にもなる。')
addition('index-task',18,'索引から作業の説明へ進む','索引の「ひらがな」「漢字を含む語」「分類の備考」「掲載ページ」は別の情報である。例えば母指球は洗う部位、グリストラップは清掃計画で確認する設備、ヒスタミンは赤身魚の保存状態と結び付ける危害である。語を見つけたら本文の該当箇所へ戻り、何を確認してどう行動するかを説明する。索引のページは冊子に印刷された番号で、PDFのページ番号とは一致しない。文字の読みや単語一覧だけで、実際の衛生処置を覚えたことにはしない。')
fact('outbreak-workers',[3],[5],'体調不良と手洗い不足は作業者から食品を汚染する原因となる。',1,'outbreak-pathways','q036')
fact('outbreak-supplier',[3],[5],'仕入先の衛生管理も、入荷後の管理と別に確認する。',1,'outbreak-pathways')
fact('outbreak-heat-storage',[3],[5],'加熱不足と保存中の温度管理不備を、別の発生要因として調べる。',1,'outbreak-pathways','q010,q013')
fact('chemical-physical',[4],[5],'洗剤・殺虫剤・農薬の化学的危害と、金属・ガラス等の異物を区別する。',1,'knowledge','q121,q262')
fact('bacterial-taxonomy',[4],[5],'腸管出血性大腸菌・サルモネラ・ブドウ球菌は細菌性の原因例である。',add='taxonomy')
fact('viral-taxonomy',[4],[5],'ノロとE型肝炎はウイルス性に分類し、付けない・加熱・持込み防止・拡散防止を組み合わせる。',q='q286,q393',add='taxonomy')
fact('parasite-taxonomy',[4],[5],'アニサキスと回虫は寄生虫性で、付着を防ぎ、必要な失活処理を行う。',18,'mistakes','q341',add='taxonomy')
fact('historic-statistics',[4,43],[5,15],'資料の90％以上や従業員要因80％は時点・母集団が限定された旧資料の説明で、現在の発生率として教えない。',add='taxonomy',scope='Historical context; no current statistical assertion.')
fact('three-principles',[5],[6,7],'手指・器具の分離はつけない、温度と時間は増やさない、対象に合う加熱はやっつけるに対応する。',2,'knowledge','q124,q265,q387')
fact('handwash-timings',[5],[6],'調理前、生肉・魚・卵の前後、トイレや鼻をかんだ後に手洗いする。',11,'knowledge','q006,q029',add='cold-growth')
fact('utensil-switch',[5],[6],'生の肉魚用と非加熱品用の器具を分け、共用するなら使用ごとに洗浄・消毒する。',2,'procedure','q004,q025',add='cold-growth')
fact('growth-temperatures',[5],[6],'多くの細菌の増殖が10℃で遅く−15℃で止まる目安は、殺菌の意味ではない。',2,'mistakes','q034,q338',add='cold-growth',scope='MHLW home-food safety guidance corroborates; not all species or all foods universal.')
fact('heat-distinction',[5],[7],'肉類の中心75℃1分以上の例を、ノロ汚染の二枚貝へ一律流用しない。',14,'knowledge','q316',add='noro')
fact('e-coli-reservoir',[7],[7],'O157・O111は腸管出血性大腸菌の例で、牛豚等の腸から肉へ移る経路を考える。',q='q127',add='e-coli')
fact('e-coli-symptoms',[7],[7],'毒素に関係して腹痛・水様下痢・血便が生じ得るが、症状のみで原因を断定しない。',q='q127',add='e-coli')
fact('e-coli-route',[7],[7],'汚染された肉の生食・加熱不足が食中毒につながる。',3,'knowledge','q268',add='e-coli')
fact('campy-reservoir',[8],[7],'カンピロバクターは牛豚鶏などの腸に存在する。',add='campy-salmonella')
fact('campy-route',[8],[7],'カンピロバクターを付けた肉は生食・不十分な加熱に注意する。',q='week01-q04',add='campy-salmonella')
fact('salmonella-reservoir',[9],[7],'サルモネラ属菌は牛豚鶏等の腸に存在し、肉と鶏卵が汚染されることがある。',q='q104',add='campy-salmonella')
fact('salmonella-route',[9],[7],'サルモネラ属菌を付けた食品の生食・加熱不足の経路を防ぐ。',3,'procedure',add='campy-salmonella')
fact('cereus-habitat',[10],[8],'セレウス菌は河川や土壌に分布し、米を含む穀類・豆類・香辛料が感染源の例である。',q='q130,week01-q05',add='cereus-staph')
fact('cereus-dishes',[10],[8],'チャーハン・スパゲティも衛生管理不備による食中毒の例である。',q='q109',add='cereus-staph')
fact('staph-sites',[11],[8],'黄色ブドウ球菌は人の皮膚・のど・傷口に存在し、手指の傷からの汚染に注意する。',3,'knowledge','q040',add='cereus-staph')
fact('welch-properties',[12],[8],'ウェルシュ菌は人動物の腸・土壌等に生息し、酸素の少ない所で増殖し芽胞を作る。',q='q133',add='welch-vibrio')
fact('welch-cooling',[12],[8],'カレー・煮物では加熱後の速やかな冷却も必要である。',3,'scenario','q074,q390',add='welch-vibrio')
fact('vibrio-environment',[13],[8],'腸炎ビブリオは海水・海泥に生息し、海水温の高い季節に活動が活発になる。',q='q136',add='welch-vibrio')
fact('vibrio-control',[13],[8],'汚染された魚介の生食を避け、原材料に合う真水の洗浄と加熱を行う。',add='welch-vibrio')
fact('noro-bivalves',[14],[8],'汚染した二枚貝の加熱不足はノロの経路となり、対象に合う中心温度と時間を確認する。',4,'knowledge',add='noro')
fact('noro-faeces-vomit',[14],[8],'便・おう吐物を介するノロの経路もあり、トイレ後の手洗いを徹底する。',4,'knowledge','q139,q393',add='noro')
fact('receiving-order',[17],[10],'入荷時に発注した品名・数量と現物を照合する。',5,'procedure','q065')
fact('receiving-quality',[18],[10],'外観・におい・包装・消費期限・賞味期限・保存方法を確認する。',5,'procedure','q277,q396,week01-q07')
fact('receiving-temp',[19],[10],'冷蔵冷凍品は可能なら温度確認し、室温にいる時間を短くする。赤外線の値は中心温度と区別する。',5,'procedure','q088,q154')
fact('receiving-return',[20],[10],'不適合があれば分け、定めた返品・交換などの指示を受ける。',5,'procedure','q051')
fact('receiving-record',[21],[10],'受入れの確認結果と不適合対応を記録する。',16,'scenario','q118')
fact('histamine',[16],[10],'保存状態の悪い赤身魚・加工品にはヒスタミン危害があり、入荷後速やかに冷蔵冷凍する。',4,'knowledge','q142,q038')
fact('refrigerator-thermometer',[23],[11],'庫内温度計がなければ設け、冷蔵と冷凍でそれぞれ管理基準を決める。',6,'daily-unit-temperature-check','q111')
fact('storage-example',[22],[11],'冷蔵10℃以下・冷凍−15℃以下は資料の管理例で、食品表示等のより厳しい条件を守る。',6,'knowledge','q399')
fact('daily-check-expiry',[24],[11],'事前に時刻を定めて毎日実測し、保存品の期限も確認して期限内に使用する。',6,'procedure','q350',scope='Daily check from source; expiry cross-link knowledge paragraph.')
fact('storage-problem',[25],[11],'庫内異常時は報告し機器の復旧と食品の使用判断を分ける。',6,'scenario','q280')
fact('storage-record',[26],[11],'実測の符号・単位と異常への対応を日誌へ記入する。',6,'procedure','q160,week02-q01')
fact('contamination-definition',[27],[12],'生の肉魚の菌が汁・手・器具等から別の食品へ移り、保管と調理の両方で汚染が起こり得る。',7,'knowledge','q283,q353')
fact('storage-layout',[28],[12],'生肉魚はふた付き容器を種類別に最下段へ置き、下の食品へ汁を落とさない。',7,'storage-layout-diary','q079')
fact('storage-and-utensil-check',[29],[12],'保管配置と器具の使用・洗浄方法を予定した時期に定期点検する。',7,'storage-layout-diary')
fact('dirty-utensil-correction',[30],[12],'汚れを発見した器具は使用前に再洗浄・消毒する。',7,'procedure','q163')
fact('cross-record',[31],[12],'保管と器具の確認結果、問題と処置を記録する。',7,'storage-layout-diary')
fact('separate-utensils',[33],[13],'肉・魚など用途別に器具を分け、使用後直ちに洗浄する。',8,'utensil-verification-diary','q004')
fact('utensil-frequency',[34],[13],'店で決めた頻度で器具の洗浄状態を確認する。',8,'utensil-verification-diary')
fact('utensil-dirty',[35],[13],'汚れが残れば使用前に洗浄からやり直し、所定の処理後に確認する。',8,'utensil-verification-diary','q025')
fact('utensil-record',[36],[13],'器具の確認と是正の結果を日誌に残す。',8,'utensil-verification-diary')
fact('board-steps',[37],[13],'板・包丁・へらは粗洗い→洗剤洗い→すすぎ→適合する消毒→乾燥・清潔保管の順で扱う。',8,'procedure','q169,q289',add='cloth')
fact('board-method-examples',[37],[13],'資料の器具処理例には熱湯・塩素系剤・70％アルコールがあるが、危害と材質・製品条件に合わせる。',q='q175',add='cloth',scope='Examples, not universal virucidal equivalence; see primary verification.')
fact('cloth-method-examples',[37],[13],'布類は洗い・すすぎの後、可能なら沸騰水5分以上、又は適合する塩素系処理を行い乾燥保管する例である。',q='q087',add='cloth')
fact('chemical-container',[32],[13],'薬剤は専用容器に内容を明示し、食品と区別した定位置で誤使用を防ぐ。',8,'procedure','q172')
fact('toilet-equipment',[42],[14],'調理とは別の服靴手袋、専用の洗剤ブラシスポンジを用いる。',9,'procedure','q044,q178',add='toilet-sequence')
fact('toilet-touch-surfaces',[42],[14],'レバー・ドアノブ・便座・手すりなどの接触面を確認し、手洗い設備を洗浄する。',9,'knowledge','q082',add='toilet-sequence')
fact('toilet-order',[42],[14],'資料の例では便器を専用洗剤でこすりすすぎ、その後床を洗い流す。',q='q181',add='toilet-sequence')
fact('toilet-tools-hands',[42],[14],'使用用具を洗浄・乾燥・保管し、終了後に十分手洗いする。',9,'procedure','q184,q008',add='toilet-sequence')
fact('toilet-verify',[39],[14],'清掃実施の申告だけでなく洗浄消毒の結果を確かめる。',9,'toilet-failed-check')
fact('toilet-correct',[40],[14],'トイレの汚れが残れば再洗浄消毒と再確認を行う。',9,'toilet-failed-check')
fact('toilet-record',[41],[14],'トイレの異常・処置・再確認結果を日誌に残す。',9,'toilet-failed-check')
fact('health-frequency',[44],[15],'体調・傷・衣服・髪・装飾品は決めた頻度で確認する。',10,'hair-health-check-diary')
fact('symptoms-exclusion',[45],[15],'下痢・おう吐があれば報告し、食品を直接扱う仕事へ入らず受診等の指示を受ける。',10,'procedure','q036,q187',add='work-exclusion')
fact('return-not-automatic',[45],[15],'症状が消えてもノロ排出が続くことがあるため、復帰を本人だけで決めない。',add='work-exclusion',scope='Current MHLW norovirus Q&A; source old symptom-only wording not used as sufficient clearance.')
fact('wound-cover-glove',[46],[15],'資料は傷をばんそうこうで覆い、その上に手袋を着ける例を示し、手洗いも必要とする。',10,'mistakes','q295',add='work-exclusion')
fact('clean-clothes',[47],[15],'食品を扱う服は清潔にし、汚れた作業着を交換する。',10,'procedure','q298')
fact('clean-hair',[48],[15],'髪を清潔にし、必要なら結び食品への混入を防ぐ。',10,'hair-health-check-diary','q049,q193')
fact('no-jewellery',[49],[15],'腕時計・ネックレス・指輪・ピアスなどの装飾品を外す。',10,'procedure','q115')
fact('health-record',[50],[15],'健康・身だしなみの結果と問題の指示を実際に確認して記録する。',10,'hair-health-check-diary')
fact('asymptomatic',[43],[15],'感染していても無症状の場合があり、普段の手洗いと健康確認が必要である。',10,'mistakes','q190')
fact('handwash-check',[52],[16],'手順通りの手洗いと実施頻度を確認する。',11,'handwash-correction-diary')
fact('handwash-correct',[53],[16],'洗い忘れや不足を見つけたら直ちに洗い直して確認する。',11,'handwash-correction-diary','q113')
fact('handwash-record',[54],[16],'手洗いの確認と問題への対応を記録する。',11,'handwash-correction-diary')
fact('handwash-palm-back',[55,'ref01'],[16,29],'手のひらと指の腹、手の甲と指の背を区別して洗う。',add='hand-sites')
fact('handwash-interdigital',[55,'ref01'],[16,29],'指の側面・間・付け根、親指と母指球、指先、手首まで洗う。',11,'procedure','q196',add='hand-sites')
fact('handwash-repeat',[55,'ref01'],[16,29],'二度洗いは石けんを取ってから洗剤を流水ですすぐまでを繰り返す。',q='q366',add='hand-sites')
fact('handwash-dry',[55,'ref01'],[16,29],'すすいだ後は清潔に乾燥し適合する消毒を行い、アルコールだけで石けん流水を代替しない。',11,'mistakes','q003,q199',add='hand-sites')
fact('five-s-each',[57],[17],'整理は不要品除去、整頓は定位置、清掃は汚れ除去、清潔は維持、習慣は決めた行動の継続である。',12,'knowledge','q071,q205,q119')
fact('five-s-purposes',[57],[17],'5Sは食中毒・異物混入・労働災害の予防にもつながる。',12,'five-s-prevention-purposes')
fact('cleaning-daily',[58],[17],'資料の日常清掃例は手洗い場・シンク・作業台・レンジ周り・床掃き・排水溝である。',12,'cleaning-schedule-source-example','q208')
fact('cleaning-week-month',[58],[17,18],'毎週は庫内・ダクト・床ブラシ・グリストラップ、毎月は壁・照明・普段届かない場所という計画例である。',12,'cleaning-schedule-source-example','q031,q304')
fact('waste-food',[59],[18],'生ごみはふた付き専用容器に入れ、作業へ影響しない位置に置き、菌や害虫等を防ぐ。',12,'procedure','q211,q214')
fact('waste-fugu',[59],[18],'資料のふぐ廃棄物例は鍵付き容器であり、地域と店の規定に従う特別な管理である。',q='q307',add='fugu',scope='Source-specific example; does not assert a nationwide current legal rule or confer processing authorisation.')
fact('waste-sort',[59],[18],'可燃・不燃・プラスチック・瓶・缶・廃油等は自治体と店のルールで分別する。',12,'procedure','q217')
fact('haccp-expansion',[61],[20],'HACCPの略称は危害分析と重要管理点に対応し、入荷以降の危険工程を特定する。',add='haccp-name')
fact('group1-foods',[61,63],[20,22],'刺身・冷奴・生野菜サラダは非加熱で冷たいまま提供する例である。',13,'knowledge','q220',add='menu-components')
fact('group2-foods',[61,66,'visual024'],[20,23,24],'ステーキ・焼き魚・焼き鳥・ハンバーグ・天ぷら・から揚げ・ごはんは加熱群の例である。',q='q223',add='heated-examples')
fact('group3-foods',[61,69],[20,25],'カレー・スープ・ソース・たれ・ポテトサラダは加熱と冷却を含む群の例である。',15,'knowledge',add='menu-components')
fact('danger-band',[62],[21],'資料の10〜60℃に長時間とどまらないよう温度と時間で工程を管理する。',15,'knowledge','q372,q310',add='haccp-name')
fact('process-transitions',[62],[21],'非加熱は低温維持、加熱は温度上昇、冷却再加熱は下降と再上昇で管理点が異なる。',add='haccp-name')
fact('salad-workflow',[64],[22],'野菜を洗い、待つなら冷蔵して提供直前に取り出し盛り付ける。',13,'procedure','q058')
fact('unheated-no-kill',[65],[22],'非加熱品には最後の加熱工程がないため、洗浄後に残る菌を低温と時間で増やさない。',13,'knowledge','q229,q313')
fact('thirty-minute-example',[65],[22],'提供まで30分以上なら10℃以下で保存する資料例は、30分未満の無条件常温許可ではない。',add='cold-service')
fact('heat-cues',[67],[23],'火力・時間・色・肉汁等の目安は中心温度で先に検証し、必要な加熱を確認する。',14,'heating-cue-prevalidation','q235')
fact('heat-record-example',[67],[23],'資料例は一日の終わりに加熱結果を記録し、異常も記録する。店の追加記録要件にも従う。',14,'heating-cue-prevalidation')
fact('heat-periodic',[68],[23],'新メニュー導入時と導入後も定期的に中心温度で条件を確かめる。',14,'heating-cue-prevalidation','q235')
fact('heat-meat',[68],[23],'肉類の細菌対策例は中心75℃で1分間以上である。',14,'knowledge','q316')
fact('heat-recontamination',[68],[23],'加熱後の盛付けでも手・器具・食器からの二次汚染を防ぐ。',14,'procedure','q232,q319')
fact('cooling-method',[70],[25],'加熱後は小さな清潔容器や冷却機器を使い速やかに冷却し、中心も条件に達したか確認する。',15,'procedure','q244,q238',add='cooling-scope')
fact('cooling-heating',[70],[25],'加熱の確認は加熱群と同じく行い、冷却・再加熱の両方を確認する。',15,'procedure','q050')
fact('cooling-fda-historic',[71],[25],'資料の米国例は21℃まで2時間、その後5℃まで4時間という二段階である。',add='cooling-scope',scope='Historical source example; primary FoodCode2022 supplies57℃start,total6h,coveredfood scope.')
fact('cooling-fda-current',[71],[25],'FDA2022の対象食品は57→21℃を2時間以内、57→5℃以下を合計6時間以内とし、日本の全店共通法とはしない。',add='cooling-scope')
fact('cooling-japan-discrepancy',[71],[25],'資料の「さらに1時間」を90分許容にせず、原典の30分以内20℃付近又は60分以内10℃付近と区別する。',q='q326',add='cooling-scope')
fact('eggs-condition',[73],[26],'鶏卵は70℃1分以上等の条件と、期限内の正常な生食用卵を速やかに調理する等の例外対象を区別する。',17,'knowledge','week12-q01')
fact('liver-condition',[73],[26],'牛肝臓・豚肝臓を生食提供せず、資料例の中心75℃1分以上など適用される検証工程を守る。',17,'procedure','week12-q02')
fact('raw-seafood',[73],[26],'生食魚介は適した真水で洗浄し、汚染のおそれのあるものを除く。',add='fish-and-objects')
fact('foreign-hard-soft',[74],[26],'金属・硬いプラ・ガラス・石は硬質、毛髪・紙・ビニール・虫は軟質の資料例で、虫は不快異物とも呼ぶ。',18,'mistakes','q086,q335',add='fish-and-objects')
fact('foreign-prevention',[74],[26],'原材料と調理中の混入を点検し、整理整頓で異物経路を減らす。',1,'procedure','q084',add='fish-and-objects')
fact('anisakis-species',[74],[27],'サバ・イワシ・カツオ・サケ・イカ・サンマ・アジ等は寄生例であり、一覧外の魚種を無条件安全としない。',add='fish-and-objects')
fact('anisakis-guts',[74],[27],'新鮮な魚を選び速やかに内臓除去し、内臓を生食提供しない。',4,'procedure','q145',add='fish-and-objects')
fact('anisakis-visual',[74],[27],'目視確認は行うが、目視と内臓除去だけで全対策完了としない。',4,'procedure','q344',add='fish-and-objects')
fact('anisakis-freeze',[74],[27],'アニサキス対策の冷凍は−20℃24時間以上など食品自体が条件を満たすよう管理する。',4,'procedure','q271')
fact('anisakis-heat',[74],[27],'アニサキス対策の加熱例は70℃以上、又は60℃1分以上である。',4,'procedure','q274')
fact('record-clear-points',[76],[27],'確認内容の記録により衛生管理のポイントと実施状況を明確にする。',16,'knowledge','q080')
fact('record-proof',[77],[27],'問題時に実施した衛生管理を確かめる証拠として使い、未確認と区別する。',16,'records-evidence-explanation','q253')
fact('record-explain',[78],[27],'保健所・客への説明では実際の確認と処置の記録を示す。',16,'records-evidence-explanation')
fact('record-improve',[79],[27],'記録を振り返り業務の改善点を探す。',16,'knowledge','q253')
fact('mixed-menu-components',['ref01'],[30],'定食のごはん・焼き物・揚げ物・茶碗蒸しと、刺身・レタスを工程別に分け、翌日使うつゆ等は冷却も追う。',add='menu-components')
fact('mixed-salad',['ref01'],[30],'サラダ中の生レタスとゆで卵・マッシュポテトは加熱冷却の有無が異なる。',q='week03-q06,q226',add='menu-components')
fact('mixed-soba-curry',['ref01'],[30],'そばの生薬味・冷やした麺つゆ、カツカレーの当日揚げカツ・前日カレーも別工程で管理する。',add='menu-components')
fact('general-plan-rows',['ref02'],[31,32],'一般衛生計画は受入れ・庫温・交差汚染・器具・トイレ・従業員・手洗いの各項目で、いつ・方法・問題時対応を定める。',16,'knowledge','q247,q250',add='plan-fields')
fact('general-plan-corrections',['ref02'],[32],'返品交換・庫温異常の原因確認と報告・再洗浄・体調時の食品作業停止・手洗い直しを該当項目と結ぶ。',add='plan-fields')
fact('five-process-plan',[81,'ref02','visual037'],[33,34,37],'非加熱冷製・加熱熱提供・加熱高温保管・冷却再加熱・冷却冷製の五欄を区別する。',q='q381',add='five-process')
fact('five-menu-check',[81,'ref02','visual037'],[34,37],'刺身・焼き魚・保温ごはん・翌日カレー・ポテトサラダを該当工程と確認方法へ対応させる。',add='five-process')
fact('daily-grid',['ref03','visual035'],[35],'日付と確認項目の交点へ実施結果を記し、庫温・良否・特記事項・確認者を対応させる。',16,'procedure','q256,q332',add='record-grid')
fact('worked-temperature',['ref03','visual036'],[36],'旧記入例の庫温異常15℃→再10℃・20分後等は実測と再確認の関係を示す例で、一律の待機時間ではない。',q='q259',add='record-grid')
fact('worked-receiving-handwash',['ref03','visual036'],[36],'袋破損→交換とトイレ後の手洗い忘れの記載例を、それぞれの日付・良否・特記へ結ぶ。',add='record-grid')
fact('critical-record-grid',['ref03','visual037'],[37],'重要管理記録は五工程ごとのメニューと日別良否、日々チェック、特記、確認者を対応させる。',add='five-process')
fact('critical-record-anomaly',['ref03','visual038'],[38],'ハンバーグの申し出と温度確認省略を該当日・加熱欄・特記へ対応させ、具体的処置と再確認を残す。',q='q010',add='critical-record')
fact('index-reading',['ref04'],[39,40,41,42,43],'索引は読み・語・備考の分類・印刷頁への参照で、PDF頁と異なり、実際の作業へ本文を参照する。',18,'procedure',add='index-task')
fact('index-applied',['ref04'],[39,40,41,42,43],'母指球は洗浄部位、グリストラップは清掃設備、ヒスタミンは保存危害として作業に結び付ける。',add='index-task')
def Q(n,lesson,names,objective,stem,options,key,reasons,explanation):
 fs=[next(f for f in facts if f['id']=='rst31-hygiene1-f-'+name)for name in names];qid=f'rst31-hygiene1-q{n:03}';questions.append({'id':qid,'lessonId':f'rst-1-hyg-{lesson:02}','unitIds':sorted({u for f in fs for u in f['unitIds']}),'factIds':[f['id']for f in fs],'objectiveJa':objective,'stemJa':stem,'optionsJa':options,'correctIndex':key,'optionReasonsJa':reasons,'explanationJa':explanation,'sourceRefs':list({json.dumps(r,ensure_ascii=False):r for f in fs for r in f['sourceRefs']}.values())});
 for f in fs:f['questionIds'].append(qid)
Q(1,1,['viral-taxonomy'],'ウイルスを持ち込まない対策と広げない対策を区別する。','厨房への持込み防止と、厨房内で広げない対策の組合せはどれか。',['体調の申告と、汚れた手や用具からの汚染防止','冷凍庫の増設と、包装の色の統一','料理の加熱と、手洗いの省略','同じ手袋の継続使用と、盛付けの早期化'],0,['申告で感染した人等からの持込みに対応し、接触経路の管理で拡散を防ぐ。','設備数や包装色だけでは人と接触の経路を管理できない。','加熱があっても手洗いを省くと再び汚染する。','汚れた手袋の継続使用は汚染を広げる。'],'ウイルス対策は食品の加熱だけではなく、持込みと拡散の経路も管理する。')
Q(2,3,['campy-reservoir','salmonella-reservoir'],'原因菌の存在場所と卵の汚染を結び付ける。','資料の家畜由来の菌の説明に合うものはどれか。',['カンピロバクターは海水だけに存在する','サルモネラ属菌は動物の腸に存在し、鶏卵にも付く場合がある','サルモネラ属菌は手指の傷だけに存在する','カンピロバクターは食品の加熱不足と関係しない'],1,['資料は牛豚鶏等の腸を挙げ、海水だけではない。','肉と鶏卵をどちらも注意対象に含める説明である。','傷口との関連で扱う黄色ブドウ球菌と混同している。','汚染肉の生食・加熱不足は注意する経路である。'],'家畜の腸からの汚染を考え、サルモネラ属菌では鶏卵も対象に含める。')
Q(3,3,['staph-sites','cereus-habitat'],'環境由来と人由来の存在場所を分ける。','黄色ブドウ球菌の存在場所として、皮膚や傷口とともに資料が挙げるものはどれか。',['海水だけ','米の表面だけ','のど','冷凍庫の設定画面だけ'],2,['海水との関連は腸炎ビブリオの説明である。','穀類との関連はセレウス菌の説明で、存在場所を混同している。','人ののども存在場所に含め、手指・飛沫等の衛生を考える。','表示画面だけが存在場所という説明は資料にない。'],'人の皮膚・のど・傷口を区別して把握し、汚染経路を管理する。')
Q(4,3,['vibrio-environment','vibrio-control'],'腸炎ビブリオの環境と原材料管理を結ぶ。','海水温が高い季節の魚介類で、資料の腸炎ビブリオ対策に合うのはどれか。',['魚を海水につけたまま室温保管する','塩分があるので全て無菌と判断する','真水で洗えば寄生虫対策も全て終わるとする','原材料に合う真水の洗浄や加熱を行う'],3,['海水由来の菌と室温放置を管理できない。','海水にも生息する菌なので塩分を安全の証拠にできない。','洗浄はアニサキス等の失活条件の代わりにはならない。','資料の魚介類の洗浄・加熱を、危害に応じて組み合わせる。'],'腸炎ビブリオの洗浄・加熱と、寄生虫の冷凍・加熱などを混同しない。')
Q(5,8,['cloth-method-examples','board-method-examples'],'ふきんの処理例を器具の一律処理と混同しない。','資料がふきん・タオルに示す処理例はどれか。',['洗浄・すすぎ後、可能なら沸騰水で5分以上処理し清潔に乾燥・保管する','洗剤を付けたまま熱湯へ入れ、すすぎを省く','70％アルコールなら汚れた布にも全病原体対策として使える','一度すすげば湿った床へ置いても清潔である'],0,['布類についての資料例であり、材質や店の手順への適合も確認する。','洗剤を十分に流す工程を省いてはいけない。','汚れ除去と対象病原体への適合が必要で、一律の効果保証ではない。','乾燥後も清潔に保管し、再汚染を防ぐ。'],'薬剤や熱の数字だけを選ばず、対象物・順序・保管まで確認する。')
Q(6,9,['toilet-touch-surfaces','toilet-order'],'トイレの手順中の設備位置を判断する。','資料の手順で、手が触れる面を処理した後、便器の洗浄へ進む前に行うのはどれか。',['床を洗った水で食品用具をすすぐ','手洗い設備を洗浄する','専用ブラシを厨房へ返す','清掃用手袋のまま料理を盛り付ける'],1,['食品用具と汚れた床水を接触させない。','接触面、手洗い設備、便器、床という資料例の順序に合う。','トイレ専用用具は調理用と分けて保管する。','作業切替えの装備管理と手洗いが必要である。'],'便器と床だけでなく、手洗い設備や接触面も順序に含める。')
Q(7,10,['return-not-automatic'],'症状改善だけを復帰の根拠にしない。','ノロウイルスによる症状が改善した人が、すぐ食品へ直接触れる作業へ戻りたいと言った。適切なのはどれか。',['症状が消えた時刻だけで本人が決める','新しい手袋を着ければ復帰確認を省く','責任者へ相談し、医療機関等の指示に沿って作業と確認条件を決める','通常より長く加熱する約束だけで全作業へ戻る'],2,['症状後も排出が続く場合があり、それだけでは判断できない。','手袋は復帰判断の代用ではなく手洗いも必要である。','担当作業と必要な確認を責任者等の指示で判断する。','加熱しない食品や再汚染経路もあり、約束だけでは足りない。'],'症状の改善と直接食品を扱う作業への復帰を分けて確認する。')
Q(8,11,['handwash-palm-back','handwash-interdigital'],'指の腹と背・母指球の位置を区別する。','手洗いでいう母指球はどの部分か。',['指先の爪の裏だけ','手首の外側だけ','小指の先端','親指の付け根のふくらみ'],3,['指先も洗うが母指球とは異なる部位である。','手首は別に洗う部位である。','小指先端ではなく親指の基部である。','親指の付け根のふくらみを具体的に洗う。'],'親指を洗う時は先端だけでなく付け根の母指球も含める。')
Q(9,13,['thirty-minute-example'],'30分例の条件と誤った逆推論を区別する。','資料の「提供まで30分以上かかる場合は10℃以下で保存」という例の読み方はどれか。',['30分未満なら必ず常温で安全という意味ではなく、食品の条件と店の計画で低温管理する','29分なら全ての生魚を必ず室温に置いてよい','30分を過ぎたら食品表示を読まなくてよい','10℃以下なら期限を無期限にできる'],0,['一つの条件例から短時間の無条件安全を逆算しない。','食品や危害の条件を省いて常温を許可できない。','表示や店の条件も継続して守る。','低温でも保存期限は別に守る必要がある。'],'温度・時間の例は適用条件とともに読み、許可範囲を勝手に広げない。')
Q(10,13,['mixed-soba-curry'],'複合料理を材料別工程へ分ける。','当日揚げたカツと、前日に加熱・冷却し再加熱したカレーを同じ皿に盛る。分類はどれか。',['料理名が一つなので全体を非加熱にする','カツの加熱工程と、カレーの冷却・再加熱を別々に確認する','カツの焼き色だけでカレーの冷却も確認済みにする','カレーを温めれば前日の保存履歴は確認しない'],1,['料理名ではなく実際の工程を区別する。','同じ皿でも異なる工程の重要管理点を追う。','カツの見た目はカレーの冷却条件を示さない。','再加熱予定でも保存中の管理を省けない。'],'材料別の工程が合流して一皿になる場合も、それぞれを管理する。')
Q(11,15,['cooling-japan-discrepancy'],'資料と原典で冷却時間の起点を確かめる。','日本の大量調理施設向け原典の冷却例について、適切な説明はどれか。',['20℃に達してから必ず60分を追加できる','30分と60分を足した90分を全飲食店の許容時間にする','30分以内に中心20℃付近、又は60分以内に中心10℃付近という例として適用対象を確認する','表面が冷たければ時刻と中心温度を残さない'],2,['原典は単純な追加60分の許可ではない。','加算して全店共通条件にしてはいけない。','時間の起点と対象施設を確認した説明である。','実際の冷却時刻と必要な温度確認が必要である。'],'古い資料の表現だけで時間を足さず、原典と店舗計画を照合する。')
Q(12,15,['cooling-fda-current'],'FDAの二段階を合計時間で読む。','FDA Food Code 2022の対象となる加熱済み食品の冷却例に合うのはどれか。',['57℃から5℃まで、21℃に達した後さらに6時間ある','出発温度に関係なく、全ての食品を2時間放置する','日本の全飲食店へ同じ法律として適用する','57℃から21℃まで2時間以内、57℃から5℃以下まで合計6時間以内'],3,['6時間は57℃からの合計であり、21℃到達後の追加6時間ではない。','食品区分と出発条件、温度の達成が必要で、放置時間の許可ではない。','米国モデル規範の対象を日本の全店共通法に読み替えない。','二段階の温度と合計時間が対応する。'],'最初の2時間を全体の6時間に含め、条件の適用範囲も分ける。')
Q(13,4,['anisakis-guts'],'魚の内臓生食を独立した管理項目として判断する。','魚の内臓を生で提供したいという注文があった。アニサキス対策として適切なのはどれか。',['内臓を生食で提供せず、処理方法を責任者に確認する','魚が新鮮なら内臓を無条件で生提供する','酢に短時間つければ必ず生提供できる','目立つ虫を一匹取れば全ての対策が完了する'],0,['内臓の生食提供を避ける管理と適切な処理を確認する。','鮮度だけで寄生を否定できない。','通常の酢処理では確実な失活条件にならない。','見落としや筋肉内への寄生も考え、必要な処理を行う。'],'鮮度、目視、内臓処理、必要な冷凍加熱を一つの方法で代替しない。')
Q(14,16,['five-process-plan','five-menu-check'],'五工程の中で高温保管と冷却を区別する。','炊飯後、熱い状態で保管して提供するごはんを計画へ置く欄はどれか。',['非加熱で冷たいまま提供','加熱した後、高温保管','加熱後冷却し再加熱','加熱後冷却して冷たいまま提供'],1,['炊飯の加熱があり、非加熱ではない。','実際の保管工程が高温保管に当たる。','この条件では冷却・再加熱をしていない。','冷たいまま提供する工程ではない。'],'料理名が同じでも、提供までにどの工程を通るかで記録欄を選ぶ。')
Q(15,16,['daily-grid','worked-temperature'],'異常値と再測定値の記録を読み分ける。','店の冷蔵基準は10℃以下。点検で12℃、処置後の再測定で8℃だった。残す記録はどれか。',['最初の12℃を8℃へ上書きする','10℃という基準だけを実測欄へ書く','12℃と8℃の時刻、処置、確認者を残す','8℃になれば食品への影響確認も全て不要とする'],2,['発見時の異常と経過が失われる。','基準と実測を混同している。','異常・処置・再確認を対応させて追跡できる。','機器の回復と食品の使用判断は別に確認する。'],'再測定が正常でも、元の異常値を消さず経過を残す。')
Q(16,16,['critical-record-anomaly'],'申し出と工程不備を特記事項へ結ぶ。','ハンバーグの内部の色について申し出があり、担当者は温度確認を省いたと分かった。特記事項に合うのはどれか。',['お客様の感想だけを書き、対象日と料理を省く','忙しかったので記録を良へ統一する','次から注意するという一文だけを書く','対象日・料理・確認省略の事実・処置・実際の再確認と指示を結び付ける'],3,['料理と日付がないと該当工程へ戻れない。','実際の不備を隠す記録になってしまう。','当日の処置や再確認が分からない。','原因と対応を該当工程へ対応させて確認できる。'],'色だけで安全を確定せず、温度確認と具体的な処置の記録へ戻る。')
Q(17,18,['index-reading','index-applied'],'索引を作業本文への参照として使う。','索引で「グリストラップ」を見つけた後、清掃の担当者がする確認はどれか。',['本文の清掃計画へ戻り、自店の対象・頻度・安全な担当方法を確認する','索引に載るだけで清掃済みと記録する','読み方が分かれば設備へ無条件に入る','印刷ページをPDFページと必ず同じ番号として開く'],0,['語の検索を実際の確認と作業条件へつなげる。','語を見つけただけでは作業を実施していない。','設備の危険と担当範囲を確認しなければならない。','冊子の印刷頁とPDF頁は区別して参照する。'],'索引は作業確認の入口であり、実施記録や許可の代わりではない。')
Q(18,10,['health-frequency','storage-and-utensil-check','utensil-frequency','handwash-check'],'確認の頻度を決めた計画へ結び付ける。','体調、保管配置、器具、手洗いの確認を継続する方法はどれか。',['問題を見つけた時だけ全項目をまとめて記入する','確認時期を決めず経験の長い人に任せる','決めた時期・頻度で各項目を実際に確かめる','前日の確認済み印をそのままコピーする'],2,['日常の定めた確認を省く方法になっている。','具体的な時期がなく確認漏れにつながる。','各項目を計画で定めた場面に実際に確認する方法である。','前日と今日の状態が同じとは限らず、実測・実見を置き換えない。'],'確認の頻度と実施した事実を別々に管理する。')
Q(19,16,['receiving-record','cross-record','utensil-record','toilet-record','health-record','handwash-record'],'一般衛生の異常と処置を記録へ残す。','受入れ、器具、トイレ、体調、手洗いなどの確認で問題を直した時、日誌の共通の原則はどれか。',['直した項目の異常と処置を実際の確認結果として残す','全ての欄を初めから良にしておく','問題を直したら最初の異常を消す','確認していない他項目も一緒に良とする'],0,['是正した場合も最初の事実と行った処置が追える。','事前の良は実施記録ではない。','発見時の事実がなくなり経過を確認できない。','各項目の確認は別に必要である。'],'一般衛生の各項目を、確認・問題・処置の事実に基づいて記録する。')
Q(20,13,['haccp-expansion'],'HACCPの名称を危害と管理点へ結び付ける。','HACCPの考え方として名称と対応する説明はどれか。',['料理名を同じにして全品を一つの記録へまとめる','危害を分析し、工程の重要な管理点で確認する','完成品の外観だけを見て全工程の確認を省く','計画を作れば実施や記録をしなくてよい'],1,['同じ名前でも工程が異なる場合がある。','危害分析と重要管理点という名称の意味に対応する。','工程の管理を完成外観だけで代替できない。','計画に従った実施と記録が必要である。'],'略語を覚えるだけでなく、どの危害をどの工程で管理するかへつなげる。')
Q(21,9,['toilet-verify','toilet-correct'],'清掃の実施申告と結果確認を分ける。','トイレ清掃の担当者は完了と伝えたが、確認時にドアノブに汚れが残っていた。適切なのはどれか。',['完了の申告を優先し、そのまま良にする','問題箇所を再洗浄・消毒して再確認する','便器が清潔ならドアノブは確認対象から外す','厨房のふきんで一度だけ拭き、記録を省く'],1,['申告だけでは実際の汚れが解消していない。','残った汚れへ所定の是正を行い、結果を確かめる。','手指が触れる面も清掃消毒の対象である。','専用用具を守り、是正の記録も残す。'],'完了申告と結果の確認は別であり、汚れが残れば所定の処置と再確認を行う。')
Q(22,16,['record-explain'],'衛生記録を保健所や客への事実説明に使う。','ある日の衛生管理を保健所へ説明する時、適切なのはどれか。',['記録があるので事故は絶対に起きないと断言する','未確認の項目も正常だったことにする','当日の確認と異常時の処置を記録で示し、未確認事項は分ける','他の日の正常な記録を当日の記録として出す'],2,['記録の存在は事故が絶対に起きない保証ではない。','未確認を事実に変えてはいけない。','確認できる事実を根拠に説明し、不明点を明らかにする。','日付と事実の対応を失うため不適切である。'],'記録は、何をいつ実施したかを説明する証拠として用いる。')
# Explicit hierarchy comes from source headings, not broad page-overlap inference.
parents={2:[3,4],6:list(range(7,15)),16:[17,18,19,20,21],22:[23,24,25,26],27:[28,29,30,31],32:[33,34,35,36,37],38:[39,40,41,42],43:[44,45,46,47,48,49,50],51:[52,53,54,55],56:[57,58,59],63:[64,65],66:[67,68],69:[70,71],72:[73,74],75:[76,77,78,79],82:[81,'ref02','ref03','ref04','visual035','visual036','visual037','visual038'],1:[2,5,6],15:[16,22,27,32,38,43,51,56],60:list(range(61,80)),80:[81,82,'ref01','ref02','ref03','ref04','visual024','visual035','visual036','visual037','visual038']}
# Facts can be reused by source parents, with exact child/fact edges retained.
for parent,children in parents.items():
 p=uid(parent);cs={uid(x)for x in children}
 for f in facts:
  if cs.intersection(f['unitIds']) and p not in f['unitIds']:f['unitIds'].append(p)
# Bring ancestors in a second dependency pass for chapter aggregates.
for parent in [1,15,60,80]:
 cs={uid(x)for x in parents[parent]}
 for f in facts:
  if cs.intersection(f['unitIds']) and uid(parent)not in f['unitIds']:f['unitIds'].append(uid(parent))
# Specific question evidence assertion q084 is chemical exposure, not the hard/soft foreign-body competency.
f=next(f for f in facts if f['id'].endswith('-foreign-prevention'));f['questionIds']=[];f['existingEvidence']=[e for e in f['existingEvidence']if e.get('questionId')!='rst-1-q084']
# Addition bindings are derived only from explicitly authored fact->addition edges.
for a in additions:
 af=[f for f in facts if a['id']in f['additionIds']];assert af,a['id'];a['factIds']=[f['id']for f in af];a['unitIds']=sorted({u for f in af for u in f['unitIds']});a['sourceRefs']=list({json.dumps(r,ensure_ascii=False):r for f in af for r in f['sourceRefs']}.values())
# Controlled diagrams reviewed at their actual raster output; no source artwork copied.
def figure(name,lesson,names,caption,alt,limits):
 p=ROOT/'assets/restaurant/source31/hygiene1'/f'{name}.png';from PIL import Image
 w,h=Image.open(p).size;fs=[next(f for f in facts if f['id'].endswith('-'+x))for x in names];fid='rst31-hygiene1-fig-'+name
 figures.append({'id':fid,'lessonId':f'rst-1-hyg-{lesson:02}','factIds':[f['id']for f in fs],'assetFile':str(p.relative_to(ROOT)),'svgFile':str(p.with_suffix('.svg').relative_to(ROOT)),'width':w,'height':h,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'captionJa':caption,'altJa':alt,'sourceRefs':list({json.dumps(r,ensure_ascii=False):r for f in fs for r in f['sourceRefs']}.values()),'scopeLimits':limits,'origin':'independent_controlled_geometry_not_copied_source','aiRasterVisuallyReviewed':True,'physicalDeviceTested':False})
 for f in fs:f['visualEvidence'].append({'figureId':fid,'kind':'independent_controlled_diagram','reason':alt})
figure('temperature-paths',13,['danger-band','process-transitions'],'工程別の温度の動きを比べる模式図。線の時間幅や頂点は基準値ではありません。','10〜60℃の帯に対し、非加熱の低温維持、加熱の上昇、冷却と再加熱の下降・上昇を並べた図。','Not a heating/cooling schedule; no universal safe duration or endpoint is specified.')
figure('general-record-worked',16,['daily-grid','worked-temperature','worked-receiving-handwash'],'日付・項目・特記を対応させる独立した架空例です。','冷蔵異常と手洗い忘れの行から、同じ日付の特記事項へ線で対応させた実施表。','Worked excerpt; complete companion general-record-monthly carries all item columns and31days.')
figure('five-process-plan',16,['five-process-plan','five-menu-check'],'三群を五つの工程欄へ展開し、料理と確認方法を記入する独立した計画例です。','五行の工程欄に冷奴、焼き魚、保温ごはん、翌日のカレー、ポテトサラダと各確認方法を並べる表。','No universal numerical limits; blank exercise row is for learner authoring.')
figure('critical-record-worked',16,['critical-record-grid','critical-record-anomaly'],'五つの工程欄と、加熱確認漏れを対応させる架空の実施例。','日別の五工程の良否と確認者があり、焼き魚の否を特記事項へ対応させる表。','Worked excerpt; complete companion critical-record-monthly supplies31days. Never used as an unsubmitted-question answer image.')
figure('general-record-monthly',16,['daily-grid','worked-temperature','worked-receiving-handwash'],'一般衛生の全項目と31日分の記入欄を持つ独立した架空の実施表。拡大して日付と欄を確認します。','受入れ、冷蔵温度、冷凍温度、交差汚染、器具、トイレ、従業員、手洗い、日々確認、確認者、特記を備え、最初の二日を例示し残りを練習用に空けた表。','Monthly practice form, zoom needed on phones; future blank not marked good. Example values do not define universal limits.')
figure('critical-record-monthly',16,['critical-record-grid','critical-record-anomaly'],'五工程と31日分の記入欄を持つ独立した架空の重要管理表。','五つの工程と日々確認・確認者・特記があり、料理の対応と初日の加熱確認漏れを示し、未確認の将来欄を空けた表。','Monthly practice form; learner completes actual correction and recheck, never fabricates missing values; zoom needed.')
def generated_figure(name,lesson,names,caption,alt,labels):
 from PIL import Image
 p=ROOT/'assets/restaurant/source31/hygiene1'/f'{name}.png';w,h=Image.open(p).size;fs=[next(f for f in facts if f['id'].endswith('-'+n))for n in names];fid='rst31-hygiene1-fig-'+name
 figures.append({'id':fid,'lessonId':f'rst-1-hyg-{lesson:02}','factIds':[f['id']for f in fs],'assetFile':str(p.relative_to(ROOT)),'svgFile':None,'width':w,'height':h,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'captionJa':caption,'altJa':alt,'sourceRefs':list({json.dumps(r,ensure_ascii=False):r for f in fs for r in f['sourceRefs']}.values()),'scopeLimits':'Independent generated illustration, actually inspected; no source image supplied, no native/domain certification. UI must display controlled step/component labels and enlarge cells, not rely on burned text or thumbnail recognition. Lesson teaching asset, not an answer-labelled exam image.','origin':'builtin_imagegen_independent_original','aiRasterVisuallyReviewed':True,'physicalDeviceTested':False,'controlledLabelsJa':labels})
 for f in fs:f['visualEvidence'].append({'figureId':fid,'kind':'original_generated_instructional_atlas','reason':alt})
generated_figure('handwash-motion-atlas',11,['handwash-palm-back','handwash-interdigital','handwash-repeat','handwash-dry'],'左から右、上から下へ見る十一工程と仕上がり例。左右の手を入れ替えて洗い、石けんからすすぎまでを二度洗いします。乾燥後の消毒も石けんと流水の代わりではありません。','十二の大きな写真調イラスト。流水、石けん、手のひら、手の甲、指の間、親指、指先、手首、すすぎ、紙で乾燥、乾いた手への消毒剤、清潔な手を示す。',[{'cell':i+1,'row':i//3,'column':i%3,'labelJa':v}for i,v in enumerate(['1 流水でぬらす','2 石けんを取る','3 手のひら・指の腹を洗う','4 手の甲・指の背を洗う','5 指の間・側面・付け根を洗う','6 親指・母指球を洗う','7 指先を洗う','8 手首を洗う','9 流水ですすぐ','10 清潔に乾燥する','11 乾燥後に適合する消毒','仕上がり例（工程ではない）'])])
generated_figure('food-process-atlas',13,['mixed-menu-components','mixed-salad','mixed-soba-curry','group2-foods'],'一皿の見た目だけでは加熱・冷却の履歴や安全性は分かりません。示された工程条件と合わせ、食品ごとに管理点を確認する学習図です。','六つの献立イラスト。定食、ねぎを添えたチャーハン、レタスとポテト・ゆで卵、そばとつゆ薬味、カツカレー、焼き魚・焼き鳥・ハンバーグ・から揚げを描く。',[{'cell':i+1,'row':i//2,'column':i%2,'labelJa':v}for i,v in enumerate(['定食：ごはん・焼き物と、冷奴・レタスを分けて考える','チャーハン：加熱したごはんと生のねぎを区別','サラダ：生レタスと加熱後冷却した具を区別','そば：冷却した麺・つゆと生の薬味を区別','カツカレー：当日揚げたカツと前日仕込みのカレー','加熱群の例：焼き魚・焼き鳥・ハンバーグ・から揚げ'])])
# Precise source-page visual notes, based on actual page images and detailed reinspection.
notes={1:'Title/version2021-04-15; no content diagram.',2:'Introductory text and workplace-rule scope.',3:'Contents hierarchy.',4:'Chapter divider only.',5:'Four-row cause/control table; text read for all rows.',6:'Three principles, handwashing/work-change illustrations, clean/dirty tools, room-temperature vs refrigeration.',7:'Core-temperature/cooked-meat cartoons and three microscope photos; images illustrate organism association, not field identification.',8:'Five organism microscope images; text is needed to identify reservoirs and controls.',9:'Chapter divider.',10:'Receiving workflow and histamine inset, no unique technical picture.',11:'Fridge/freezer10/-15 storage example cartoon.',12:'Fridge storage illustration with raw-food drips and cross-contamination risk.',13:'Washing at sink illustration; separate board and cloth procedures.',14:'Textual toilet procedure; no independent image.',15:'Textual worker health and appearance; historical80% note not current statistic.',16:'Text steps and repeat-wash range; actual motion illustration referred to29.',17:'5S storage/cleaning, sink and chest-freezer pictures; clean-plan examples.',18:'Covered bin, pest attraction when uncovered, separated waste bins.',19:'Chapter divider.',20:'Three-group table and examples.',21:'Detailed image inspection:10–60℃band, low-temperature nonheated path, heating rise, cool/reheat fall/rise; temperatures not a universally sufficient kill condition.',22:'Nonheated examples sashimi and tofu under table.',23:'Heating-control table and probe/core thermometer images.',24:'Image-only grilled fish/skewers/hamburg/fried chicken; steam is illustration, not proof of safe heat.',25:'Cooling flow; curry sauce potato-salad images; separate US/Japan reference conditions.',26:'Egg/fish/liver text; hard/soft foreign-object sketches.',27:'Anisakis prevention and four reasons for records.',28:'Reference divider.',29:'Detailed eleven-step hand-motion image, with repeated steps2–9 and drying/alcohol separately.',30:'Detailed mixed-meal image: meal-set components; friedrice/raw scallion; salad rawlettuce/cooledingredients; cooledsoba/rawgarnish; katsu/curry/pickles different processes.',31:'Blank general plan, seven items each when/how/corrective-action rows.',32:'Completed general plan, circled timing selections, item-specific corrective actions; not universal salvage rule.',33:'Blank five-process important-control plan.',34:'Completed five-process plan, menus and measurement cues.',35:'Detailed270-degree rotation: blank dated rows, receiving, two temperatures, crosscontamination, utensils, toilet, health, handwash, dailycheck, notes, checker.',36:'Detailed270-degree rotation: firstfive days completed; brokenflourbag exchange, handwashforgotten,15→10℃recheck20min sourceexample; futureblank.',37:'Detailed270-degree rotation: blank fiveprocess columns, menuheader, datedgood/bad, dailycheck, notes/checker.',38:'Detailed270-degree rotation: menu/process mapping, firstday heatingbad, hamburgercolourcomplaint and skippedtemperaturecheck explanatorynote.',39:'Index reading/kanji/category/printedpage columns; not full definitions.',40:'Index continuation includes equipment and hygiene vocabulary.',41:'Index continuation includes hand sites and cleaning terms.',42:'Index continuation includes noro, histamine, bivalves and sourcepage pointers.',43:'Short final index rows for fridge/freezer/range.',44:'Acknowledgements and source-art attribution.',45:'Copyright/link/source-edit attribution and disclaimer, not hygiene competency.'}
lock=json.loads((OUT.parent/'source-lock.json').read_text());d=next(d for d in lock['documents']if d['documentId']==DOC)
roles={1:'cover',2:'scope',3:'contents',4:'divider',9:'divider',19:'divider',28:'divider',44:'acknowledgements',45:'rights_disclaimer'}
pages=[{'documentId':DOC,'pdfPage':r['pdfPage'],'textSha256':r['textSha256'],'textRead':True,'visualRead':True,'visualNotes':notes[r['pdfPage']],'role':roles.get(r['pdfPage'],'index_navigation'if r['pdfPage']>=39 else 'instructional_content')}for r in d['pages']]
# Remaining figure competencies are not closed by prose or a smaller diagram excerpt.
imagegaps={} # All feasible source visual competencies now have independent inspected artwork and controlled labels; runtime/mobile/native QA remains pending separately.
unitrows=[]
for u in UNITS:
 us=u['id'];fs=[f for f in facts if us in f['unitIds']];assert fs,us
 key=next((k for k in imagegaps if uid(k)==us),None);gaps=imagegaps.get(key,[])
 structural=u['unitKind']=='chapter'
 child=[uid(x)for x in parents.get(next((i for i in parents if uid(i)==us),None),[])]
 # Record unresolved child image gaps for aggregates rather than pretending source closure.
 inherited=[g for k,v in imagegaps.items()if uid(k)in child for g in v]
 remaining=list(dict.fromkeys(gaps+inherited))
 decision='structural_aggregate'if structural else 'blocked'if remaining else 'covered_after_additions'if any(f['additionIds']for f in fs)else 'covered_existing'
 qids=sorted({q for f in fs for q in f['questionIds']})
 unitrows.append({'unitId':us,'decision':decision,'factIds':[f['id']for f in fs],'childUnitIds':child,'reason':'Explicit child/fact aggregate; does not promote unresolved children.'if structural else 'Exact source statements compared to the cited existing fields and original additions; visual gaps remain explicit.'if remaining else 'Every recorded source competency assigned explicit fact/evidence; additions and source qualification are separately revision-bound.','remainingFactGaps':[],'remainingImageGaps':remaining,'existingQuestionIds':[q for q in qids if q in QUESTIONS],'newQuestionIds':[q for q in qids if q not in QUESTIONS],'assessmentScope':'Exact linked competencies only; not a claim that every fact has an independent test.','assessmentGap':[]if qids or structural else ['No direct exact existing/new question for this unit; teaching coverage only.']})
primary=[{'id':'mhlw-noro','url':'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuchu/kanren/yobou/040204-1.html','checkedAt':'2026-10-31','supports':'Bivalve85–90℃90s; symptomatic directfoodwork exclusion; shedding aftersymptoms; alcoholnotsoapwashsubstitute.','boundAdditionIds':['rst31-hygiene1-a-noro','rst31-hygiene1-a-work-exclusion','rst31-hygiene1-a-hand-sites']},{'id':'mhlw-mass','url':'https://www.mhlw.go.jp/web/t_doc?dataId=00tb9161&dataType=1&pageNo=1','checkedAt':'2026-10-31','supports':'Masscatering scope;30mincore~20℃ OR60mincore~10℃;cloth100℃5min.','boundAdditionIds':['rst31-hygiene1-a-cooling-scope','rst31-hygiene1-a-cloth']},{'id':'fda-2022','url':'https://www.fda.gov/files/food/published/FDA-FoodCode2022-FullDocument-01182023_0.pdf','checkedAt':'2026-10-31','supports':'3-501.14 cookedTCS cooling57→21℃2h,57→≤5℃total6h;modelcode notallJapanrestaurants.','boundAdditionIds':['rst31-hygiene1-a-cooling-scope']},{'id':'mhlw-cold','url':'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/shokuhin/syokuchu/01_00006.html','checkedAt':'2026-10-31','supports':'Homeguidance10/-15growthnotdeath,storageexampleandrawhandlinghandwashing.','boundAdditionIds':['rst31-hygiene1-a-cold-growth']},{'id':'mhlw-anisakis','url':'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000042953.html','checkedAt':'2026-10-31','supports':'No rawviscera;freshnessremovalvisualcheck;-20℃24h;70℃or60℃1min.','boundAdditionIds':['rst31-hygiene1-a-fish-and-objects']},{'id':'mhlw-utensil-example','url':'https://www.mhlw.go.jp/file/06-Seisakujouhou-11130500-Shokuhinanzenbu/0000179541.pdf','checkedAt':'2026-10-31','supports':'Board/knife70%alcoholexample;clothboiling5min;notallpathogenblanketequivalence.','boundAdditionIds':['rst31-hygiene1-a-cloth']}]
packet={'shard':'hygiene1','documentIds':[DOC],'baseCommit':BASE,'pdfSha256ByDocument':{DOC:d['pdfSha256']},'pages':pages,'units':unitrows,'facts':facts,'additions':additions,'questions':questions,'figures':figures,'primaryVerifications':primary,'sourceErrata':[{'documentId':DOC,'pdfPages':[7],'issue':'Generic75℃1min text includesbivalves; unsafe ifreadasnoro-specificcurrentguidance.','disposition':'Differentiate currentMHLW85–90℃90s fornoro-riskbivalves.','additionId':'rst31-hygiene1-a-noro'},{'documentId':DOC,'pdfPages':[15],'issue':'Symptomresolution phrase insufficientforautomaticdirectfoodworkreturn.','disposition':'CurrentMHLW guidanceandresponsibleperson/medicalinstructions retained.','additionId':'rst31-hygiene1-a-work-exclusion'},{'documentId':DOC,'pdfPages':[25],'issue':'Japanese further1h wording canlead90minsum; FDAexample lacksstarttemperature.','disposition':'Teach historicalversuscurrentprimarytext scopeexplicitly; no silentadditionoftimes.','additionId':'rst31-hygiene1-a-cooling-scope'}],'acceptance':{'aiSourceComparison':True,'humanReviewed':False,'nativeReviewed':False,'domainReviewed':False,'allAssignedUnitsDecided':len(unitrows)==91,'unresolved':[{'unitId':r['unitId'],'imageGaps':r['remainingImageGaps'],'assessmentGap':r['assessmentGap']}for r in unitrows if r['remainingImageGaps']or r['assessmentGap']],'allSourceKnowledgeClosed':True,'allAssessmentCompetenciesClosed':not any(r['assessmentGap']for r in unitrows),'physicalDeviceTested':False,'integrationPending':True}}
(OUT/'packet.json').write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n');print('PACKET',len(pages),'pages',len(unitrows),'units',len(facts),'facts',len(additions),'additions',len(questions),'Qs',len(figures),'figures');print('Assessment gaps',[(r['unitId'],r['assessmentGap'])for r in unitrows if r['assessmentGap']])
