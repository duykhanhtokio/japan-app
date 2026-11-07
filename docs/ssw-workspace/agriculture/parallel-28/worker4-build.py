"""Author-owned partial assessment packet; root owns canonical integration."""
import hashlib
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
D = ROOT / 'src/data/agriculture'
LESSONS = {l['id']: l for l in json.loads((D/'lessons.ja.json').read_text())['lessons']}
ROWS = []

def add(lesson, paras, operation, condition, why, compared, hold, stem, options):
    ROWS.append(dict(lesson=lesson, paras=paras, operation=operation, condition=condition,
                     why=why, compared=compared, hold=hold, stem=stem, options=options))

add('agr-ricework-soaking', [2,3],
    '浸種と催芽の温度例を、それぞれの作業段階へ対応させる。',
    '本文に示された種もみの例を読む。実機や品種ごとの作業指示は指定しない。',
    '既存問は吸水・芽出しの目的とハト胸の状態。ここでは二段階の温度を取り違えた記録を修正する。',
    ['agr-ricework-weekly-q03','agr-ricework-weekly-q04'],
    'AGR-H-RICEWORK-SOAKSUMの積算温度単位は使わない。AGR-H-RICEWORK-TREATの薬剤処方も問わない。',
    '種もみの学習メモで、浸種と催芽の温度例を入れ替えてしまいました。本文の例に戻した組合せはどれですか。',
    [('浸種10～15℃、催芽30～32℃。','吸水させる段階と、播種前に加温して芽出しする段階を、本文の温度例へ対応させています。'),
     ('浸種30～32℃、催芽10～15℃。','二つの作業段階へ付ける温度例が逆になっています。'),
     ('浸種も催芽も10～15℃。','本文の催芽の例には、浸種より高い30～32℃が示されています。'),
     ('浸種も催芽も30～32℃。','本文の浸種の水温例は10～15℃であり、催芽の温度へ統一しません。')])

add('agr-ricework-nursery', [4],
    '出芽後の苗が緑色になるまでの被覆段階を読み取る。',
    '本文の育苗箱を出芽後にハウスへ並べる流れ。',
    '既存問は播種前後の区別と育苗箱準備の順序。出芽後の被覆の段階は問われていない。',
    ['agr-ricework-weekly-q05','agr-ricework-weekly-q06'],
    '被覆の材質・日数・ハウス設定値を補わない。',
    '出芽した育苗箱をハウスに並べた後、本文の流れでは、どの状態になるまで被覆しますか。',
    [('苗が緑色になるまで。','本文は出芽後に箱を並べ、苗が緑色になるまで被覆する段階を示しています。'),
     ('種もみを水に浸すまで。','浸種は播種より前の準備で、出芽後のこの段階より前です。'),
     ('覆土を始めるまで。','覆土は播種直後に行い、箱を出芽させるより前の段階です。'),
     ('田植え後に分げつするまで。','田植え後の本田管理まで育苗箱の被覆を続ける流れではありません。')])

add('agr-ricework-nursery', [6],
    '稚苗と中苗の育苗期間例を区別する。',
    '資料の期間例を記録する。実際の苗の区分を日数だけで断定しない。',
    '既存問の準備順序・催芽と出芽の区別とは異なる、育苗期間例と苗区分の対応。',
    ['agr-ricework-weekly-q05','agr-ricework-weekly-q06'],
    '育苗期間は例として保持し、全品種共通の田植え日を指示しない。',
    '本文に載る育苗期間の例を、稚苗と中苗に分けて転記します。正しい対応はどれですか。',
    [('稚苗20～25日、中苗30～35日。','本文の二つの期間例を、対応する苗の区分へ記しています。苗の状態の確認は別に必要です。'),
     ('稚苗30～35日、中苗20～25日。','本文に示された二つの区分と期間の関係が逆です。'),
     ('稚苗も中苗も20～25日。','中苗の例として示された30～35日が抜けています。'),
     ('稚苗も中苗も30～35日。','稚苗の例として示された20～25日が抜けています。')])

add('agr-ricework-field', [4],
    '田植機の条数を、一度に植える列の数として読む。',
    '移植栽培用の田植機についての名称・仕様情報。',
    '既存の株間・条間問は間隔の対応。ここでは条数という機械仕様と苗本数を区別する。',
    ['agr-2-w03-q12','agr-ricework-weekly-q08'],
    '条間・株間の不一致のある設定値や実機操作は出題しない。',
    '田植機の説明にある「条数」は、何に関する情報ですか。',
    [('一度に植える列の数。','田植機が一度の作業で植える列の数に関わる情報です。'),
     ('一株に植える苗の本数。','一株の苗本数と、一度に植える列の数は別の情報です。'),
     ('育苗箱を並べる段の数。','育苗箱の配置を表す段数ではなく、本田へ植える列に関わります。'),
     ('隣り合う列の間隔。','列と列の間隔は条間で、条数という列の数とは区別します。')])

add('agr-ricework-water', [1],
    '移植直後の入水を、苗の保護という目的へ対応させる。',
    '本文の田植え後の段階。水深や薬剤条件は指定しない。',
    '既存問は分げつの定義。ここでは移植直後の水管理の目的を判断する。',
    ['agr-ricework-weekly-q09'],
    'AGR-H-RICEWORK-HERBICIDEの薬剤条件、AGR-H-RICEWORK-MIDDRAINの詳細日程を使わない。',
    '田植え直後の入水について、本文が示している目的はどれですか。',
    [('移植した苗を保護する。','本文は、田植え後に水を入れる段階を移植した苗の保護と結び付けています。'),
     ('田面を干して中干しをする。','田面を干すには水を抜く段階が関わり、移植直後の入水の目的と異なります。'),
     ('新しい茎を増やすため、浅い水で管理する。','本文は新しい根や葉が出るようになった後の段階として説明し、移植直後の入水の目的とは分けています。'),
     ('耕うん前の乾いた田へ戻す。','本文は移植した苗を保護する入水を説明しており、移植前の乾いた田へ戻す目的ではありません。')])

add('agr-ricework-water', [2],
    '新しい根・葉の発生を、水を浅くする段階へ結び付ける。',
    '移植後の生育観察に基づく本文の段階説明。',
    '前候補は入水の保護目的。こちらは生育変化を見て次の水管理段階を選ぶ操作。分げつの語義だけは再出題しない。',
    ['agr-ricework-weekly-q09'],
    '深さ・日付・湛水期間の一律設定を問わず、本文の段階の関係だけを保持。',
    '移植した苗から新しい根や葉が出るようになりました。本文では、この後の水管理をどのように説明していますか。',
    [('浅い水で管理し、新しい茎を増やす段階へ進む。','本文は、新しい根や葉の発生と、浅い水で管理して茎を増やす段階を結び付けています。'),
     ('深い水に変え、そのまま穂が出るまで固定する。','本文のこの段階は浅い水の管理であり、その後まで水深を固定する説明ではありません。'),
     ('新しい根や葉が出た時点で水管理を終える。','本文は、その生育変化を次の管理段階へ結び付けており、管理終了とはしていません。'),
     ('浅くする判断は、根や葉を見ず経過日数だけで行う。','本文は日付だけでなく、生育の変化と水管理を結び付けています。')])

add('agr-ricework-water', [4],
    '中干しを、生育に応じて水を抜いて田面を干す仕事として識別する。',
    '概念の説明のみ。具体的な開始日・期間・深さは対象外。',
    '分げつの定義、移植直後の入水目的、浅水へ進む観察条件と異なる作業概念。',
    ['agr-ricework-weekly-q09'],
    'AGR-H-RICEWORK-MIDDRAINは詳細日程のみを保留。この問も日程・期間を指定しない。',
    '生育に応じて行う「中干し」の説明として、本文に合うものはどれですか。',
    [('田の水を抜き、田面を干す。','本文が示す中干しの仕事です。時期や期間をこの説明だけで一律には決めません。'),
     ('田植えの直後に水を入れ、苗を保護する。','これは移植直後の入水の目的で、中干しの説明ではありません。'),
     ('新しい根や葉が出た後、浅い水を入れた状態で管理する。','本文の浅い水の管理と、いったん水を抜き田面を干す中干しを分けます。'),
     ('代かきのために水を入れ、土を柔らかくする。','田植えに向けた代かきの説明で、生育に応じて田を干す中干しではありません。')])

add('agr-ricework-harvest', [1,2],
    '幼穂分化期と出穂を、穂の形成と外へ出た状態で区別する。',
    'イネの生育段階を観察して記録する場面。',
    '既存問はコンバインの機能。一般の花芽と開花の区別に対し、イネの幼穂形成と穂の抽出という具体的な二段階を対象にする。一般問題との意味重複は独立レビューを要する。',
    ['agr-ricework-weekly-q10','agr-shared-w02-q09'],
    'AGR-H-RICEWORK-PANICLEFERTの追肥日程・量は含まない。',
    'イネの記録を「幼穂分化期」と「出穂」に分けます。二つの違いを保った説明はどれですか。',
    [('幼穂分化期は小さい穂が形成される段階、出穂は育った穂が外へ出ること。','穂をつくる段階と、成長した穂が外へ出る状態を分けています。'),
     ('幼穂分化期は穂を刈る段階、出穂は穂からもみを外すこと。','刈取りと脱穀という収穫工程へ置き換えており、生育段階の区別ではありません。'),
     ('幼穂分化期は穂が外へ出る段階、出穂は穂をつくり始めること。','二つの段階に対応する内容が逆です。'),
     ('幼穂分化期も出穂も、苗から新しい茎が増えること。','茎が増える分げつの説明を、穂の生育段階へ当てはめています。')])

add('agr-ricework-processing', [5],
    '収穫後の切り株・わらを、耕うんで田の土へ埋める管理へ対応させる。',
    '本文の収穫後の田に残った植物体の管理例。',
    '既存問はもみの乾燥・もみすり・くず米の除去。田に残る切り株やわらへの管理は対象が異なる。',
    ['agr-ricework-weekly-q11','agr-ricework-weekly-q12'],
    '分解促進資材、施用量、2号のみの詳細を付け足さない。',
    '米の出荷準備とは別に、収穫後の田に残った切り株やわらを管理します。本文に示された作業はどれですか。',
    [('田を耕し、切り株やわらを土へ埋める。','本文は、収穫後の田の管理としてこの耕うんを挙げています。'),
     ('もみすり機に入れ、玄米と一緒に選別する。','もみすりはもみがらを除く工程で、田に残った切り株の管理とは異なります。'),
     ('玄米からくず米を除く調整の対象として扱う。','調整で取り除くくず米と、田に残った切り株・わらは対象が異なります。'),
     ('コンバインの脱穀だけで、田の管理も終了とする。','刈取り・脱穀後も、田に残ったものを管理する仕事が別にあります。')])

add('agr-ricework-lowcost', [2],
    '湛水直播の播種前準備を、耕起・代かきへ対応させる。',
    '本文で扱う湛水直播の準備工程。種子被覆の処方は対象外。',
    '既存の乾田直播問は播種後から入水までの水状態の順序。候補は湛水直播の播種前の田の準備であり、名称の入替えだけにしない。',
    ['agr-ricework-weekly-q13','agr-ricework-weekly-q14'],
    'AGR-H-RICEWORK-TREATの製品・種子被覆条件は問わない。',
    '本文の湛水直播で、種をまく前の田の準備として示されているものはどれですか。',
    [('耕起と代かきを行う。','本文は、耕起と代かきを行ったうえで土中や表面へ種をまく方法を説明しています。'),
     ('育苗箱の苗を田植機で植え終える。','苗を田植えする移植栽培と、種子を直接まく直播を混同しています。'),
     ('田植機の株間を広げ、植える苗の密度を下げる。','これは疎植という移植栽培の工夫で、湛水直播の播種前準備ではありません。'),
     ('乾いた田へ播種し、出芽後もしばらく畑状態に保つ。','これは本文の乾田直播の流れで、湛水直播の播種前準備とは異なります。')])

add('agr-ricework-feed', [5],
    '飼料用品種の説明にある収量・倒伏・病気への特性を整理する。',
    '資料に挙げられた品種群の傾向であり、個別品種の性能保証はしない。',
    '既存問は飼料用米とWCSの利用部位、WCSの飼料形態、WCS用の茎葉量や食味以外の評価軸。ここでは飼料用品種の栽培上の特性群を扱う。',
    ['agr-ricework-weekly-q15','agr-ricework-weekly-q16','agr-par11-riceveg-q01','agr-par11-riceveg-q02'],
    'AGR-H-RICEWORK-DETAILSを網羅したとはせず、既存の本文に明示された特性だけを使う。',
    '本文が飼料用品種に多い特徴として挙げる組合せはどれですか。',
    [('多収性、倒れにくさ、病気への抵抗性。','資料の品種群の特徴として挙げられた三つです。全品種の同一性能を保証するものではありません。'),
     ('多収性、倒れやすさ、病気への抵抗性。','収量と抵抗性の項目はありますが、倒伏については倒れにくさという説明です。'),
     ('収量の少なさ、倒れにくさ、病気への抵抗性。','倒れにくさと抵抗性を保っていても、多収性の方向が逆です。'),
     ('多収性、倒れにくさ、病気への弱さ。','病気への抵抗性を、病気への弱さへ変えてしまっています。')])

add('agr-par11-riceveg-feed-details', [4],
    '資料の販売単価と低コスト化の必要性の因果関係を説明する。',
    '本文にある資料上の理由。現在価格や金額は不明のまま保持する。',
    '既存問は低コスト化の具体策の分類。候補は生産費を抑える必要性と販売単価を関連付ける理由の理解。',
    ['agr-par11-riceveg-q04'],
    '現在価格の主張、具体的な相場、利益額、給餌量は出題しない。',
    '本文の資料が、飼料用米を低コストで生産する必要性へ結び付けている理由はどれですか。',
    [('主食用米より販売単価が安いと説明しているため。','資料は販売単価の説明を、生産費を抑える必要性へ結び付けています。現在の取引価格を示した説明ではありません。'),
     ('主食用米より販売単価が高いと説明しているため。','資料の比較の方向が逆で、低コスト化の理由を変えています。'),
     ('WCS用の茎葉の量を減らす必要があるため。','資料の専用品種の説明は茎葉が多い型であり、この販売単価の理由とは別です。'),
     ('炊飯食味の順位で販売額が決まると説明しているため。','飼料用米の評価の説明を主食用の食味評価へ置き換えています。')])

add('agr-vegwork-industrial', [3],
    'チャノキの常緑低木・複数年収穫という性質を栽培計画へ対応させる。',
    '本文のチャノキの利用期間。収穫年数の数値は指定しない。',
    '既存問は収穫部位である葉・茎。候補は植え付け後の複数年利用という生活型と作付計画。',
    ['agr-vegwork-weekly-q11'],
    '樹齢や更新年数の一律基準を追加しない。',
    '茶園の作付計画を読むとき、チャノキの性質について本文に合うものはどれですか。',
    [('常緑の低木で、一度植えると何年も収穫する。','本文はチャノキを常緑低木とし、一度植えて複数年収穫する作物として説明しています。'),
     ('常緑の低木で、一回の収穫ごとに植え直す。','常緑低木である点が合っていても、複数年の利用を一回ごとの植え直しへ変えています。'),
     ('一年草で、播種した年だけ葉を収穫する。','本文の低木という性質と、複数年利用の両方を変えています。'),
     ('落葉する低木で、葉がなくなる冬だけ収穫する。','本文の常緑という性質を落葉へ変え、記載のない収穫条件も加えています。')])

add('agr-vegwork-industrial', [4],
    '茶樹の仕立てる高さを、収穫作業の行いやすさという目的と結び付ける。',
    '本文の腰の高さほどという例。作業者共通の固定寸法は指定しない。',
    '果樹の仕立ての語義や茶の収穫部位ではなく、収穫作業に合わせた高さ管理の理由を問う。',
    ['agr-workterms-fruit-labels-p1','agr-vegwork-weekly-q11'],
    '刈り込み方法、実機操作、具体的な高さの数値は補わない。',
    '本文が、チャノキを腰の高さほどに仕立てる例を示す理由はどれですか。',
    [('収穫作業を行いやすくするため。','本文は、収穫しやすさを考えて高さを仕立てる例として説明しています。'),
     ('同じ高さにすれば、どの季節も同じ量を収穫できるため。','作業の行いやすさという目的を、収穫量の保証へ読み替える根拠はありません。'),
     ('高さをそろえることで、植え替えを毎年行うため。','本文が示す複数年の利用と、収穫作業に合う高さの管理を混同しています。'),
     ('作業者に関係なく、共通の数値を守らせるため。','腰の高さほどという例は管理しやすさの説明で、全員共通の数値を指定するものではありません。')])

add('agr-vegwork-industrial', [6],
    'コンニャクの適地を、平地・傾斜地という地形と排水条件を分けて読む。',
    '本文が挙げる栽培地の例。個別圃場の適否や排水工事は判定しない。',
    '既存問は種イモ・地下茎・複数年の栽培。候補は栽培地を読む際の排水条件であり、収穫部位の言換えではない。',
    ['agr-vegwork-weekly-q12'],
    'サツマイモの器官保留と無関係で、排水条件の一般数値も使わない。',
    '本文のコンニャクの栽培地の説明を保っているものはどれですか。',
    [('平地や傾斜地の例があり、排水のよさを合わせて確認する。','地形の例と、水はけがよいという条件を両方残しています。'),
     ('平地の例があり、排水の悪さを合わせて確認する。','本文が示す排水条件の方向を逆にしています。'),
     ('傾斜地の例だけがあり、平地は含まれない。','本文は平地と傾斜地を挙げており、一方へ限定する説明ではありません。'),
     ('平地か斜面かだけを記し、水はけは別の作物で確認する。','この作物の適地説明にある水はけの条件が抜けています。')])

add('agr-vegwork-seedstorage', [1],
    '野菜種子保存の温度と湿度の原則を選ぶ。',
    '本文の低温・乾燥の原則。作物別寿命や具体的な保存温度は対象外。',
    '既存問は寿命年数に条件が必要という読み方。候補は本文が明示する保存環境の二条件。',
    ['agr-vegwork-weekly-q15'],
    '年数の保証や具体的な温度・湿度設定を追加しない。',
    '野菜種子を保存する環境の原則として、本文が示す組合せはどれですか。',
    [('低温と乾燥。','本文は保存の原則を低温・乾燥と説明し、寿命年数だけで判断しないことも求めています。'),
     ('低温と多湿。','温度の方向は合っていますが、湿度は乾燥の原則と異なります。'),
     ('高温と乾燥。','乾燥は合っていますが、温度は低温の原則と異なります。'),
     ('高温と多湿。','本文に示された温度・湿度の両方の原則と異なります。')])

add('agr-vegwork-seedstorage', [4],
    'コーティング種子の球状への形状加工と覆土を区別する。',
    '本文に示された加工種子の説明。薬剤成分や播種機仕様は対象外。',
    '既存問はF1という交配由来との分類軸の違い、シードテープの配置。候補は球状に形を整える加工そのものと覆土の区別。',
    ['agr-par08-seed-graft-q03','agr-vegwork-weekly-q16'],
    'AGR-H-VEGWORK-NUMERIC-EXTENSIONSの未著作処理や製品効能を補わない。',
    '本文の「コーティング種子」に当たる説明はどれですか。',
    [('まきやすいよう、均一な球状に形を整えた種子。','本文は、種子を均一な球状へ加工する説明を示しています。'),
     ('種をまいた後、土をかけて覆った種子。','これは覆土という播種時の作業で、種子自体の形を加工する説明ではありません。'),
     ('一定間隔でテープにはさんだ種子。','これはシードテープの説明です。球状に形を整える加工とは異なります。'),
     ('二つの系統を交配した由来を示す種子。','交配由来の分類と、表面や形を加工する分類を混同しています。')])

add('agr-workterms-seed-sequence', [2],
    '塩水選を、比重によって不良種子を除く選別の例として理解する。',
    '用語欄の選種の目的・方法例。塩水濃度や調製法は問わない。',
    '既存問は種子予措の総称、浸種の吸水、消毒対象。選種に使う比重という判別原理は未出題。',
    ['agr-par06-terms-recognition-q04','agr-par06-terms-recognition-q05','agr-par06-terms-recognition-q06'],
    'AGR-H-WORKTERMS-SEED-GLOSSARYを尊重し、濃度・温度・作業日数を一切指定しない。',
    '用語欄の「選種」で例示される塩水選は、何を利用して不良な種子を除きますか。',
    [('種子の比重の違い。','用語欄は、比重で選別する塩水選を選種の例として挙げています。'),
     ('種子を球状へ加工した後の形の違い。','形状加工の説明と、塩水中で比重によって選別する説明は異なります。'),
     ('種子の表面にある色の違いだけ。','本文の例は外観の色だけでなく、比重による選別です。'),
     ('テープにはさんだ種子の間隔。','シードテープの配置に関する情報で、選種の判別原理ではありません。')])

add('agr-workterms-seed-sequence', [5],
    '種子予措の四段階を、本文にある並びで整理する。',
    '本文の学習用の段階整理。全種子への一律な現場工程指示にはしない。',
    '既存問は総称の範囲と個別段階の目的。候補は選種・消毒・浸種・催芽という四段階の順序を保つ連絡記録。',
    ['agr-par06-terms-recognition-q04','agr-ricework-weekly-q03'],
    '用語説明から濃度・時間・全作物共通の処方を推定しない。',
    '本文に示された種子予措の各段階を、同じ並びで書き出したものはどれですか。',
    [('選種、消毒、浸種、催芽。','本文はこの並びで、種子予措に含まれる段階を示しています。'),
     ('催芽、消毒、浸種、選種。','本文で最後に置かれる催芽と、最初に置かれる選種が入れ替わっています。'),
     ('選種、浸種、催芽、消毒。','消毒を、本文の並びの最後へ移しています。'),
     ('消毒、選種、催芽、浸種。','選種と消毒、浸種と催芽のそれぞれの順が本文の並びと異なります。')])

add('agr-vegwork-leafy', [4],
    'レタスの花芽分化の温度方向を、涼しい条件での葉の生育と分ける。',
    '本文のレタスの例。温度の数値や地域共通の栽培日程は問わない。',
    '既存のダイコンの低温による花芽分化を、レタスへ作物名だけ替えて転用しないための異なる生理条件の比較。単なる低温問題の名称置換ではない。',
    ['agr-vegwork-weekly-q07','agr-shared-w02-q12'],
    '作物別温度表の未確認数値を使わず、本文が明記する高温との関係だけを問う。',
    'レタスについて、本文が花芽分化と結び付けている温度条件はどれですか。',
    [('高温。','本文はレタスで高温による花芽分化を説明しています。涼しい条件で葉を育てる話と分けて読みます。'),
     ('低温が続くこと。','他の作物の低温の説明を、そのままレタスの掲載条件へ移しています。'),
     ('温度は関係せず、種子の形だけで決まること。','本文が示す高温との関係を落とし、種子の形へ置き換えています。'),
     ('収穫後の冷却だけを行うこと。','生育中の花芽分化と、収穫後の品質管理の温度を混同しています。')])


def main():
    assert len(ROWS) == 20
    existing = {q['id']: q for f in ['weekly-checks.ja.json','mock-exams.ja.json']
                for e in json.loads((D/f).read_text())['exams'] for q in e['questions']}
    objectives = []
    questions = []
    positions = list(range(4)) * 5
    rng = random.Random(2026102804)
    while True:
        rng.shuffle(positions)
        if all(not positions[i] == positions[i-1] == positions[i-2] for i in range(2,len(positions))):
            break
    for i, row in enumerate(ROWS, 1):
        lesson = LESSONS[row['lesson']]
        assert '1' in lesson['levels']
        ps = [next(p for p in lesson['paragraphs'] if p['id'] == row['lesson']+'-p'+str(n)) for n in row['paras']]
        kids = list(dict.fromkeys(k for p in ps for k in p['knowledgeIds']))
        oid = f'AGR-ASSESS-P28-W4-{i:02}'
        # One prose paragraph reference had been supplied for a comparison;
        # comparison IDs must refer only to actual existing questions.
        compared = [q for q in row['compared'] if q in existing]
        objectives.append(dict(id=oid,lessonId=lesson['id'],paragraphIds=[p['id'] for p in ps],
            knowledgeIds=kids,operationJa=row['operation'],conditionJa=row['condition'],
            whyDistinctFromExistingJa=row['why'],comparedQuestionIds=compared,
            sourceHoldAssessmentJa=row['hold'],sourcePages=lesson['sources'],
            lessonSourceHash=lesson['sourceHash'],status='candidate_requires_independent_semantic_review'))
        right = row['options'][0]
        other = row['options'][1:]
        rng.shuffle(other)
        pos = positions[i-1]
        options = other[:pos]+[right]+other[pos:]
        questions.append(dict(id=f'agr-1-m04-q{i:02}',objectiveId=oid,topicJa=lesson['chapter'],
            stemJa=row['stem'],optionsJa=[x[0] for x in options],correctIndex=pos,
            optionReasonsJa=[x[1] for x in options],lessonId=lesson['id'],
            lessonSourceHash=lesson['sourceHash'],knowledgeIds=kids,
            nativeReviewed=False,domainReviewed=False))
    report = dict(worker=4,level='1',formId='agr-1-m04',status='partial_candidate_pending_independent_review',
        objectives=objectives,questions=questions,
        omittedCandidates=[
            dict(group='rice_structure_and_postharvest_processing',reasonJa='胚・胚乳・もみがら、刈取りと脱穀、もみすりと調整は既存問で対象済み。語句や順番だけ変えて再出題しない。'),
            dict(group='crop_family_and_utilization_lists',reasonJa='既存のウリ科・ジャガイモの分類・利用器官一覧問題に対し、作物名だけを別の科へ入れ替える追加は採用しない。'),
            dict(group='generic_qualifier_only_questions',reasonJa='全ての品種に共通しない、例を現在値や固定値へ広げない、という一般的な注意だけの問題を新しい農作業能力として増やさない。'),
            dict(group='wcs_yellow_ripeness',reasonJa='黄熟期という名称の追加だけでは既存の完熟前収穫問から独立した収穫段階判断と確定できないため今回除外。'),
            dict(group='weather_damage_names',reasonJa='冷害・干害を既存で採点済み。風水害へ名前だけ替えた同型分類問は追加しない。'),
            dict(group='held_source_specific_rules',reasonJa='中干しの詳細日程、除草剤の湛水条件、積算温度の単位、種子消毒の製品処方、サツマイモの器官差、ホウレンソウ科名は出題しない。'),
            dict(group='outside_level1',reasonJa='配分31レッスン中、agr-ricework-stages、agr-vegwork-tubers-2、agr-par12-riceveg-legume-uses、agr-par12-riceveg-grain-purpose、agr-par22-vegetablesは1号範囲外として不使用。')],
        review=dict(authorAiSelfReview=True,independentAiReviewed=False,nativeReviewed=False,
                    domainReviewed=False,humanReviewed=False,sourceProseRechecked=True,
                    originalPdfPagesReverified=False,globalSemanticDedupComplete=False,
                    completeFortyQuestionForm=False,questionCount=20,correctPositionCounts=[5,5,5,5],
                    remainingToForty=20),
        notes=dict(baseCommit='fb9d21c1bd4fa8ff9a5e8054b9c689afce06c7ce',
                   allocatedLessons=31,level1EligibleLessons=26,
                   blocker='Twenty additional independent level1 objectives were not certified within this allocation after removing already-assessed meanings, generic qualification checks and source-held claims. Do not pad or integrate this partial as a40-question form.',
                   currentSourceInputs={f:hashlib.sha256((D/f).read_bytes()).hexdigest() for f in ['lessons.ja.json','weekly-checks.ja.json','mock-exams.ja.json']},
                   possibleReviewOverlaps=['panicle differentiation vs general flower-bud formation','rice water protection vs growth-stage shallow-water management','flooded direct-seeding preparation vs existing dry direct-seeding water sequence','storage environment vs existing seed-longevity condition interpretation'],
                   officialSimulation=False,timeLimitMinutes=None,passThreshold=None))
    out = ROOT/'docs/ssw-workspace/agriculture/parallel-28/worker4.json'
    assert not out.exists(), 'Do not overwrite an existing packet'
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'worker':4,'questions':len(questions),'objectives':len(objectives),'completeForm':False}))


if __name__ == '__main__':
    main()
