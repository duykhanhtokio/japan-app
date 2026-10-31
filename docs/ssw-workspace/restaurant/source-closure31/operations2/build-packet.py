import json,hashlib,collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[5]; OUT=Path(__file__).parent; DOC='rst-2-operations'
read=lambda p:json.loads(p.read_text()); sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
ledger=[u for u in read(ROOT/'docs/ssw-workspace/restaurant/knowledge-ledger.json')['units'] if any(r['documentId']==DOC for r in u['sourceRefs'])]
lessons={l['id']:l for l in read(ROOT/'src/data/restaurant/lessons.2.ja.json')['lessons']};qs={q['id']:q for e in read(ROOT/'src/data/restaurant/exams.2.ja.json')['exams'] for q in e['questions']}
lock=next(x for x in read(OUT.parent/'source-lock.json')['documents'] if x['documentId']==DOC)
packet={'shard':'operations2','documentIds':[DOC],'baseCommit':'8a0ebfe5f799847ac1fd590a3b610cb0837f7667','pdfSha256ByDocument':{DOC:lock['pdfSha256']},'pages':[],'units':[],'facts':[],'additions':[],'questions':[],'figures':[]}
notes={6:'Q/S/C each five ordered behavioral checks; service times explicitly source examples.',11:'Four linked human-hour equations plus 600000yen/120hours/480customers/60% example.',12:'Recipe component quantity/unit-price table, two recipes and cost/gross percentages.',13:'Nested denominator bars: sales100%→gross70%; gross100%→labor40%, plus chained monthly and hourly answers.',14:'Sushi unit/month standard-cost bar and opening/closing/purchase stock tables.',15:'Actual45% vs standard40% overlay and 750yen loss; percent-point and source formula notation conflict noted.',16:'Two alternative one-variable staffing/sales improvements; question supplies all starting quantities.',18:'Supplier-specific stock targets by sales band, ordering/delivery weekday calendar and holiday caveat.',22:'General annual-leave entitlement row plus legal text.',23:'All four proportional annual-leave rows and seven tenure columns.',25:'Eight service phrases embedded as raster table; OJT principles and first three training steps.',28:'Dirty hood/damper rejection image; six equipment checks. No device repair geometry inferred.',29:'Emergency numbered sequence includes document retrieval; safely reordered rather than copied.'}
for p in lock['pages']:
 i=p['pdfPage'];packet['pages'].append(dict(documentId=DOC,pdfPage=i,textSha256=p['textSha256'],textRead=True,visualRead=True,visualNotes=notes.get(i,'Rendered page visually inspected alongside extracted body text; no separate figure/table beyond page layout.'),role='content' if 5<=i<=31 else {1:'cover',2:'preface',3:'contents',4:'contents',32:'credits',33:'rights_and_use_notice'}[i]))
def uid(n):return f'{DOC}-k{n:03}' if isinstance(n,int) else f'{DOC}-{n}'
def refs(pages,section):return [dict(documentId=DOC,pdfPages=pages,section=section)]
def add(key,lesson,title,text,units,pages):
 ident='rst31-operations2-'+key;packet['additions'].append(dict(id=ident,lessonId=f'rst-2-ops-{lesson:02}',titleJa=title,textJa=text,unitIds=[uid(u) for u in units],factIds=[],sourceRefs=refs(pages,title)));return ident
add('role-judgment',1,'役割と報告を一枚で照合する','時間帯責任者は、その時間のQSC維持に加え、発注・検品収納、光熱費、顧客対応、勤務時間、新人育成、欠員時の応援を調整する。担当者・判断できる範囲・店長への報告先を役割表で結び付ける。例えば欠員なら権限内の持ち場変更と応援連絡を行い、営業時間や費用の変更は自店の承認手順へ回す。役名だけを覚えず、誰が何を実行できるかを確認する。',[4],[5,6])
add('monthly-cost-log',3,'差を原因と確認へつなぐ記入例','独自の月次練習では、売上1,000,000円、標準原価300,000円、期首在庫100,000円、仕入330,000円、期末在庫110,000円とする。実際原価は320,000円である。「実際−標準」のロス額は20,000円、率の差は32％−30％＝＋2ポイントになる。管理表の一行を「＋2ポイント／過剰盛付けの疑い／計量作業を観察／担当A／翌週再確認」とし、原因は確定前に断定しない。棚卸し・検収・廃棄の記録も調べ、改善後の実績を同じ式で比べる。',[11,20,21],[8,9,12,14,15])
add('interview-check',8,'応募書類を仕事に必要な範囲で確認する','面接では提出された履歴書の職務経験・資格・勤務可能条件を本人へ確認し、写真などで応募者との取り違えを防ぐ。年少者の就業制限など業務上必要な年齢確認は、目的と方法を採用・労務担当へ照合して適切に行う。年齢だけを採否基準にしたり、適性・能力と関係のない家族や本籍の情報を求めたりしない。教材の証明書の例を、全応募者へ一律に余分な身元資料を要求する根拠にしない。',[55,56,57],[23])
add('service-phrases',9,'八つの基本語を場面へ結び付ける','来店を迎える「いらっしゃいませ」、依頼を受けた「かしこまりました」、少し待ってもらう「少々お待ちください」、待たせた後の「お待たせいたしました」を、前後の場面で区別する。作業のため客のそばへ入るときは「失礼いたします」、依頼の前置きは「恐れ入りますが」、不手際へのお詫びは「申し訳ございません」、利用への感謝は「ありがとうございました」が基本例になる。同じ言葉でも声量、抑揚、語調、表情で伝わり方が変わる。二人一組で客役と担当役を交代し、どの場面で何を伝える言葉かを説明してから実演する。',['ref03',77],[25])
add('smoke-escape',10,'煙を避ける行動を具体化する','火災を知らせ、早い通報と避難を進める。煙を避けられる経路を選び、煙の中を避難せざるを得ないときは、できるだけ姿勢を低くし、ハンカチなどで口と鼻を覆って煙を吸わないようにする。布を当てても有害ガスを無害化できると考えない。避難階段を使い、エレベーターや私物を取りに戻る行動は避ける。任意の袋を探したり顔へかぶせたりすることを一般の避難手順にしない。出口が使えるか、誘導灯が点灯しているかを日ごろから確認する。',[101,102,103],[27])
add('extinguish-principles',10,'消火の原理と実行条件を分ける','消火は、燃料を取り除く除去、酸素の供給を遮る窒息、熱を奪う冷却などの原理で整理できる。希釈は濃度を下げる考え方であり、何にでも水をかける意味ではない。消火器には燃焼反応を抑制する働きを利用するものもある。教材の窒素・二酸化炭素の説明は主に酸素濃度を下げる側として区別し、「化学的抑制」と同じ作用だと覚えない。実際の器具は適用する火災と訓練手順で選ぶ。油の火へ水をかけず、布を無条件にかぶせる実演もしない。退路を確保できず、火や煙が広がるときは消火を続けず避難する。',[98,99,100],[26,27])
add('arson-prevention',10,'放火されにくい環境と避難可能性を両立する','廊下・階段室・洗面所など目の届きにくい所に可燃物をためず、不要な物を片付ける。普段使わない物置・倉庫・空室は管理者が施錠を確認するが、人が避難に使う出口を閉鎖する意味ではない。出入者を店の手順で確認し、応援や臨時の従業員は事前に共有して不審者と取り違えない。死角は巡回や適切な監視設備で補い、トイレなどではプライバシーを侵害しない。客用と従業員用トイレの共用は一律の義務にしない。内装・装飾品は用途に必要な不燃・防炎条件を建物管理者や消防へ確認する。',[104,105,106,107,108,109,110,111],[27])
add('training-frequency',16,'年一回の記述だけで訓練を終えない','参照教材には年一回の避難訓練という説明があるが、現行の適用要件の確認に代えることはできない。飲食店など不特定多数が利用する建物で防火管理の対象となる場合、消火訓練と避難訓練は年二回以上が必要になる。管轄消防署へ対象と届出・事前通報の方法を確認し、自店と建物全体の消防計画へ日程を組み込む。通報・消火・避難を実際の時間帯の人員で分担し、消火器の適用と使い方も訓練で確認する。実施日、参加者、問題点、対策と次の確認を残す。',[89,112],[26,27])
add('fire-equipment-check',16,'六つの点検対象を安全な担当へつなぐ','教材の点検対象は、火災報知器・煙感知器の油汚れ、フード内ダンパーの油汚れ、ガスホースの劣化、湯沸かし器の種火の状態、自動洗浄機の作動、配電盤の害虫の痕跡である。ダンパーは炎がダクトへ入るのを防ぐための装置で、汚れを放置しない。種火の異常は説明書と店の連絡手順へつなぎ、ガス臭がある所でむやみに再点火しない。洗浄機は所定の点検を行い、安全装置を解除して動作させない。配電盤は通電部へ触れず、内部の点検・清掃は資格や権限を持つ担当へ依頼する。異常を見つけたら使用の安全確保、報告、修繕手配、完了確認を記録する。',[113,114,115,116,117,118,119],[28])
add('fire-structure-check',16,'設備と構造も維持する','避難通路を空けるだけでなく、防火戸・防火区画などの機能を妨げていないか、建物の消防計画と点検表に従って確かめる。扉を物で固定したり、改装で設備を覆ったりする変更は独断で行わない。法定点検や専門整備の担当、結果の報告先と修繕確認を決める。「そのほか必要な業務」は無制限に個人へ任せる意味ではなく、用途や設備に応じて計画へ具体化し、消防機関へ相談する。',[90,92,97],[26])
add('after-evacuation',16,'人命優先で初動と事後連絡を分ける','火災を周囲に知らせ、119番通報と客・従業員の避難を、現場の人員で可能な範囲で並行して進める。初期消火や熱源停止は退路と安全を確保できる担当に限り、書類や現金を取りに戻らせない。集合後は人数、けが、取り残しの情報を消防へ伝える。安全な場所から緊急連絡先へ連絡し、消防や建物管理者の情報を集め、時刻・確認した事実・行った対応を報告する。立入りや営業再開は関係する担当の確認に従い、独断で決めない。避難を遅らせない範囲で事前に必要資料を安全に保管し、持出しを優先順位にしない。',['ref04',95,120,121,122,123],[29])
# Manually selected exact lesson paragraph anchors and independently stated source facts.
rows='''2|1|roles-and-qsc-checks|商圏と一回の支出が限られる中、再来店には安定したQSCAと個別の心配りが必要で、仲間にもHを向ける。
3|1|knowledge|店舗責任者には店長等と時間帯責任者があり、後者は担当時間の運営と育成を担い、具体的権限を店長へ確認する。
4|1|+role-judgment|時間帯の管理対象はQSC、発注検収、光熱費、顧客対応、人時、応援、育成である。
5|1|qsc-complete-behavior-groups|QSCの十五の行動群を業態に合う仕様で理解して教え、清掃補充点検を基盤に現場で維持する。
7|2|store-company-cost-scope|営業利益は売上から原価・人件費・販売管理費・光熱費・施設費等を差し引き、粗利益とは異なる。
8|2|knowledge|人時は全対象者の労働時間合計、人時売上高は同期間の売上を総労働時間で割る。
9|2|knowledge|人時接客数は客数÷総労働時間であり、フルサービスではサービス内容が分母へ影響する。
10|2|store-company-cost-scope|人時生産性は粗利益÷総労働時間であり、ロス低減や育成が改善に関わる。労働分配率の分母は粗利益。
11|3|+monthly-cost-log|原価率の変化は分量・廃棄・棚卸し・検収から原因を調べ、月次の対策を日々実行する。
12|4|business-model-staffing-targets|人時接客数又は人時売上高で総労働時間を見積もり、曜日・催事・繁閑に応じ日々配置を修正する。客単価の区分は資料例。
13|6|knowledge|客数増加には固定客の再来店と新規獲得の両方があり、QSCの改善と口コミに結び付く。
14|6|worked-customer-spend|客単価は平均注文点数×平均一品価格であり、正確な商品説明と本人の選択を尊重した提案で改善する。
15|2|knowledge|粗利益＝売上高−原価であり、ここから人件費等を支払う。
16|3|knowledge|同じ売上を分母にした原価率と粗利益率の和は100％。
17|3|knowledge|個別標準原価率＝個別標準原価÷当該商品の売価×100。
18|3|knowledge|月間標準原価は各メニューの販売数と個別標準原価の積の総和、標準原価率はこれを同月売上で割る。
19|3|knowledge|実際原価は期首在庫＋当月仕入−期末在庫。実際原価率の分母は同期間売上。
20|3|procedure|実際−標準をロス額とすれば正は使用原価超過であり、呼称と差の向きを必ず明示する。
21|3|reference-cost-band|標準−実際の差異と実際−標準のロス率は逆符号。率の差はポイントで表し、資料の±0.5は参考条件。
22|2|worked-labor-cost|売上から原価、粗利益、人件費へ連鎖計算する際、人件費へ掛ける労働分配率の分母は粗利益。
23|2|worked-labor-cost|同じ期間の各金額を総実働時間で割り、人時売上高・人時生産性・人時人件費を区別する。
24|2|historical-ratio-and-shared-labor|労働分配率＝人件費÷粗利益。35～40％は資料参考値で、共通費用の範囲をそろえる。
26|5|forecast-order-checks|売上予測からメニュー数、仕込み量、食材量を逆算し、業者別発注表と納品予定を結ぶ。
27|5|knowledge|過剰在庫は品質低下と資金滞留を招き、少な過ぎれば機会損失になるため予測・使用量・期間で必要量を決める。
28|5|forecast-order-checks|発注日と納品日・休日を確認し次回納入までの期間を見込む。120％・110％は予測誤差に応じる例で固定値ではない。
29|5|inventory-close-and-receipt|実地棚卸し、集計、検品収納を連携し、実数・単位・仕様・期限・責任者を照合する。
30|5|inventory-close-and-receipt|サンプルや不良品・返品を区分し空箱を除き用具を準備する。開封品は端数まで数え、期末は二人で指差し復唱する。
31|5|inventory-close-and-receipt|集計は単位・数量・転記入力・単価・掛算合計を確認し、担当・立会・店長署名と提出期限を守る。
32|5|inventory-close-and-receipt|発注書・納品書・現物の数量品質を照合し、規格・鮮度熟成・歩留まり・日時を確認、適所へ先入先出で日付表示して収納する。
34|6|worked-abc-classification|商品を売上又は個数で降順に並べ累積構成比でABC分類する。70/90/100の区切りは事業体で変わる参考例。
35|6|procedure|季節商品の効果も同じ尺度の構成と粗利益を比べて判断し、通常品からの置換を含める。
36|6|abc-set-and-repeat-customers|セットで注文が集中すれば提供や回転を助ける可能性があるが、利益・負荷・時間で効果を測る。
37|6|knowledge|時間帯割引は食事時間外の来店誘引を狙い、需要移動と利益も確認する。
38|6|scenario|再来店用割引券は会計時に案内し、当日値引きへ取り違えないよう条件と目的を共有する。
39|6|customer-channels|ポイント制度は複数回来店を促し、割引券と合わせる場合も条件を明確にする。
40|6|customer-channels|ホームページの初回来店特典等は新規客の試用機会につながる。
41|6|customer-channels|WEB注文と宅配は来店しない客にも販売する経路で、手数料を含む利益を確認する。
42|6|customer-channels|電子決済は現金以外で払いたい客の来店選択へ関わる。
43|6|customer-channels|WEBに電話予約窓口を加えると操作が苦手な客や団体の相談へ対応できる。
45|6|mistakes|固定客の顔や好みを覚え感謝を伝えつつ、個人的来店歴を他人へ明かさない。
46|6|abc-set-and-repeat-customers|準固定客にも再来店の感謝を伝え希望に合う案内で固定化を図る。
47|6|knowledge|新規客にはQSC全体の体験を整えて再来店と推奨へつなぐ。
49|12|knowledge|法定時間外・深夜・法定休日・月60時間超を分け、重複時の最低上乗せ率を確認する。
50|11|procedure|原則一日8時間週40時間、対象小規模事業場の週44時間特例と、途中休憩・休日の条件を区別する。
51|14|knowledge|年休は勤続・出勤・勤務時間日数を条件に一般表又は比例表で判定する。
52|14|knowledge|一般表は勤続0.5年から10/11/12/14/16/18/20日。初回は6か月継続と8割出勤が条件。
53|14|mistakes|正常な運営を妨げる場合の適法な時季変更は年休そのものの拒否ではない。
54|14|mistakes|年10日以上付与される労働者は原則一年以内5日取得を確保し、本人取得分も含める。
55|8|+interview-check|面接は仕事に必要な応募情報と条件・要望を確認し、公正な選考と承認手順を守る。
56|8|+interview-check|履歴書と本人を取り違えず必要情報を確認する。教材の年齢証明例を一律の身元調査や年齢による採否基準にしない。
57|8|interview-and-first-day-plan|所定応募書式へ仕事に必要な確認事項を記録する。
58|8|knowledge|本人の希望職種と仕事に必要な条件を面接で確認する。
59|8|scenario|必要勤務時間と希望時間が違えば双方の条件と調整可能性を確認する。
60|8|interview-and-first-day-plan|出退勤と勤務ルールを説明し守れるか、相談が必要かを確認する。
61|8|knowledge|採用時は本人の要望も聞き、一方的に条件を押し付けない。
62|8|interview-and-first-day-plan|関係部署の承認が必要ならその場で採用確定と告げず連絡手順を案内する。
63|8|procedure|初日導入は基本ルール、店内案内、担当者紹介、訓練計画をつなぐ。
64|8|procedure|初日は出退勤・制服身だしなみ・手洗い等衛生と緊急連絡を説明する。
65|8|procedure|設備配置のストアツアーとスタッフ紹介で安全な勤務を支える。
66|8|procedure|部署責任者と訓練計画、質問報告先を本人へ示す。
67|8|interview-and-first-day-plan|時間と習得に合わせ挨拶・下げ物・洗い場等を手本と見守りで練習する。
69|9|knowledge|技能指導では目的・方法・道具・手順・量・質・時間を明確にする。
70|9|knowledge|目的は何のためにそのサービス又は作業を行うかを示す。
71|9|knowledge|道具は何を使用するかを指定する。
72|9|knowledge|量は作業対象の範囲を示す。
73|9|knowledge|質は仕上がりの到達水準を示す。
74|9|knowledge|時間は完了までの標準時間を示し、速さだけを評価しない。
75|9|training-stages|教育・導入・訓練・啓発の役割を分け体系的に実施する。
76|9|procedure|接客の基本の型は説明だけでなく反復の実演で体得する。
77|9|voice-and-phrase-rehearsal|態度・表情・言葉遣いを練習し、声量・トーン・語調を区別して伝達を確認する。
78|9|training-stages|OJTとOFFJTは目的と本人経験に合わせて組み、現場技能ほどOJTを重視する。
79|9|knowledge|OJTは現場で技能、OFFJTは離れた場で知識理念を学ぶ。
80|9|procedure|OJTは一対一、できるまで確認し、長い作業を区切って視線・声・姿勢・手を観察する。
81|9|procedure|導入、手本提示、本人適用、具体的フォローの四段階で進める。
82|9|training-stages|導入は質問や身近な事例で学ぶ目的と興味を持たせる。
83|9|procedure|提示は理由を説明しながら正しい手順を示す。
84|9|procedure|適用は本人に実施させ手や順序を観察する。
85|9|procedure|フォローは理解と実施の具体的到達を確認して再練習へつなぐ。
87|15|procedure|防火管理者は必要な管理監督的立場と資格を確認し、用途・規模・収容人員による適用と届出を消防へ照合する。
88|16|knowledge|自衛消防組織と各担当・代行者を明確にする。
89|16|+training-frequency|消火・通報・避難を定期訓練し対象建物の現行頻度と事前連絡を確認する。資料の年一回だけで判断しない。
90|16|+fire-structure-check|消防設備・消防用水・活動上必要な設備を計画に沿って点検整備し、専門業務は適切な担当へつなぐ。
91|16|knowledge|火気の使用や取扱いを監督する。
92|16|+fire-structure-check|避難施設に加え防火上必要な構造設備の機能を維持し、妨害や無断変更を避ける。
93|16|knowledge|収容人員を消防計画で管理する。
94|16|knowledge|全時間帯へ防火教育を実施する。
95|16|+after-evacuation|火災・地震時の通報連絡と避難誘導を安全に分担する。
96|16|knowledge|防火管理事項は消防機関と連絡調整する。
97|16|+fire-structure-check|包括的なその他必要業務は店舗の用途設備に即して消防計画へ具体化する。
98|10|+extinguish-principles|燃焼と消火の原理を区別し、教材の具体例を適用条件なしで実演しない。
99|10|knowledge|燃焼三要素は可燃物・酸素・熱源。厨房の油やダクト堆積も火源管理に関わる。
100|10|+extinguish-principles|除去・窒息・冷却・希釈と燃焼反応の抑制を区別する。窒素等による酸素低下を化学抑制と同一視しない。
101|10|+smoke-escape|煙の少ない経路を選び姿勢を低くし、口鼻を覆って早く避難する。任意の袋を一般手順にしない。
102|10|+smoke-escape|煙の有害ガスと窒息に注意し、ハンカチ等を有害ガス除去具だと思わない。
103|10|+smoke-escape|誘導灯は平時から点灯と経路を確認する。
104|10|+arson-prevention|放火防止では可燃物・無人室・出入・死角・内装を管理し避難とプライバシーを妨げない。
105|10|+arson-prevention|階段室・洗面所等の死角へ可燃物を置かない。
106|10|+arson-prevention|普段使わない物置・倉庫・空室の施錠を確認する。
107|10|+arson-prevention|出入者を管理するが、避難口の閉鎖や施錠で避難を妨げない。
108|10|+arson-prevention|応援や臨時従業員を共有して不審者と誤認しない。
109|10|+arson-prevention|トイレを含む死角は適切な運用で管理し、客従業員の共用を一律義務にしない。
110|10|+arson-prevention|巡回や適切な監視設備で死角を補う。
111|10|+arson-prevention|内装・装飾品は必要な不燃防炎条件を担当へ確認する。
112|16|+training-frequency|防火管理対象の飲食店等では消火・避難訓練年二回以上と事前連絡を確認し記録する。
113|16|+fire-equipment-check|六対象の点検を報告・安全確保・担当整備・完了確認へつなぐ。
114|16|+fire-equipment-check|火災報知器と煙感知器の油汚れを確認する。
115|16|+fire-equipment-check|ダンパーはダクトへの炎の侵入を防ぐ装置で、ひどい油汚れを放置しない。
116|16|+fire-equipment-check|ガスホースの劣化は使用安全と適切な交換へつなぐ。
117|16|+fire-equipment-check|種火異常は説明書と担当へつなぎ、危険な独断再点火をしない。
118|16|+fire-equipment-check|自動洗浄機は所定動作を確認し安全装置を解除しない。
119|16|+fire-equipment-check|配電盤内害虫痕跡は専門担当へ依頼し通電部へ触れない。
120|16|+after-evacuation|通報・誘導・従業員役割の三マニュアルを実行可能な形で準備する。
121|10|scenario|通報役は119番へ場所・火災等を伝える手順を確認する。
122|10|scenario|客を煙から離れた経路へ誘導し集合後に人数を確認する。
123|16|scenario|役割表と欠勤時代行を決め、通報と誘導が同時に動けるよう訓練する。
ref01|1|qsc-complete-behavior-groups|Q/S/C各五行動をチェックし、数値例を全業態共通仕様としない。
ref02|2|worked-labor-cost|同一数値で売上・原価・粗利益・人件費と各人時額、比率の分母を比較する。
ref03|9|+service-phrases|八つの基本接客語を場面へ割り当て声と表情も練習する。
ref04|16|+after-evacuation|緊急初動は通報避難を優先し、集合作業・情報収集・対外連絡・事後報告を安全な場所で進める。
ref05|17|management-terms-and-trainee-roles|理念・運営・基準・評価・訓練・予算・PDCA・人時指標は役割と分母・期間を分けて判断へ結ぶ。'''
for line in rows.splitlines():
 n,ln,anchor,statement=line.split('|',3);n=int(n) if n.isdigit() else n;u=next(x for x in ledger if x['id']==uid(n));lesson=f'rst-2-ops-{int(ln):02}';fid=f'rst31-operations2-f{len(packet["facts"])+1:03}';evidence=[];adds=[]
 if anchor.startswith('+'):adds=['rst31-operations2-'+anchor[1:]]
 else:
  para=next(p for p in lessons[lesson]['paragraphs'] if p['id']==anchor);evidence=[dict(kind='lesson_paragraph',lessonId=lesson,paragraphId=anchor,path='src/data/restaurant/lessons.2.ja.json',field=f'/lessons/{next(i for i,l in enumerate(lessons.values()) if l["id"]==lesson)}/paragraphs/{next(i for i,p in enumerate(lessons[lesson]["paragraphs"]) if p["id"]==anchor)}/textJa',textJa=para['textJa'],textSha256=sha(para['textJa']),reason=statement)]
 fact=dict(id=fid,unitIds=[u['id']],statementJa=statement,sourceRefs=u['sourceRefs'],existingEvidence=evidence,additionIds=adds,questionIds=[],visualEvidence=[],decision='covered_after_additions' if adds else 'covered_existing')
 packet['facts'].append(fact)
 for a in packet['additions']:
  if a['id'] in adds:a['factIds'].append(fid)
# Explicit child references on aggregates; source subsection facts above retain their own exact anchors.
chapters={1:range(2,6),6:range(7,25),25:range(26,33),33:range(34,44),44:range(45,48),48:range(49,68),68:range(69,86),86:range(87,124)}
for u in ledger:
 n=int(u['id'].rsplit('k',1)[1]) if '-k' in u['id'] else None
 facts=[f['id'] for f in packet['facts'] if u['id'] in f['unitIds']]
 if n in chapters:
  children=[uid(c) for c in chapters[n]];facts=[f['id'] for f in packet['facts'] if any(c in f['unitIds'] for c in children)];decision='structural_aggregate';reason='Navigation chapter only; explicit child units and fact references below carry individual decisions.'
 else:children=[];decision='covered_after_additions' if any(f['additionIds'] for f in packet['facts'] if f['id'] in facts) else 'covered_existing';reason='Independently compared source body/visual and exact authored paragraph or separately identified addition; no coverage inferred solely from heading or page range.'
 packet['units'].append(dict(unitId=u['id'],decision=decision,factIds=facts,childUnitIds=children,reason=reason,remainingFactGaps=[],remainingImageGaps=[]))
assert len(packet['units'])==128 and all(u['factIds'] for u in packet['units'])
# Insert further atomized table facts, exercises and source conflict receipt below.
print('WORK',len(packet['facts']),len(packet['additions']))
