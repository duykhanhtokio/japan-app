exec((__import__('pathlib').Path(__file__).parent/'finalize-packet.py').read_text())
def associate_existing(units,ids):
 for f in p['facts']:
  if any(uid(n) in f['unitIds'] for n in units):
   for qid in ids:
    if qid not in f['questionIds']:f['questionIds'].append(qid);q=qs[qid];f['existingEvidence'].append(dict(kind='question',questionId=qid,path='src/data/restaurant/exams.2.ja.json',field='stemJa/optionsJa/correctIndex/explanationJa',stemJa=q['stemJa'],optionsJa=q['optionsJa'],correctIndex=q['correctIndex'],explanationJa=q['explanationJa'],reason='Manually selected shared exact competency, not topic-only matching.'))
associate_existing([7],['rst-2-q161']);associate_existing([13],['rst-2-q018']);associate_existing([26],['rst-2-q091','rst-2-q132','rst-2-q247']);associate_existing([29],['rst-2-q001','rst-2-q314']);associate_existing([63],['rst-2-q111','rst-2-q312']);associate_existing([67,76,81,83],['rst-2-q025']);associate_existing([78],['rst-2-q171']);associate_existing([88,95,122],['rst-2-q363','rst-2-week10-q01']);associate_existing([98],['rst-2-week07-q07']);associate_existing([113],['rst-2-week07-q01'])
# Shared authored questions may assess multiple explicitly present facets.
for q in p['questions']:
 if q['id'].endswith('q001'):
  for n in [3]:
   q['unitIds'].append(uid(n));f=next(x for x in p['facts'] if uid(n) in x['unitIds']);q['factIds'].append(f['id']);f['questionIds'].append(q['id'])
 if q['id'].endswith('q003'):
  for n in ['ref02']:
   q['unitIds'].append(uid(n));f=next(x for x in p['facts'] if uid(n) in x['unitIds']);q['factIds'].append(f['id']);f['questionIds'].append(q['id'])
question(1,[2],'QSCAとホスピタリティの適用を考える','配膳ロボットで運搬が減った店で、QSCAとHの考えに合う余力の使い方はどれか。',['運搬が自動なら清掃基準をなくす','客と仲間の困り事を聞き、店の品質と接客基準を保ちながら対応する','全ての客へ同じ追加商品を断れないよう勧める','機械化した店では従業員育成をやめる'],1,['機械化は清潔の基準を不要にしない。','個別の気配りを客と仲間へ向け、基準維持と両立する。','相手の立場と選択を尊重していない。','対人対応にも必要な技能と育成がある。'],[5])
question(3,[20],'ロス額の定義と符号を読む','「実際原価−標準原価」をロス額と定めた練習で、実際48,000円、標準45,000円である。説明はどれか。',['−3,000円で、差の向きを逆にしても同じ符号','3％で、円との差はない','＋3,000円で、実際原価が標準を上回る','＋93,000円で、両方を合計する'],2,['定義された実際−標準は正になる。','金額の差は円であり率へ変換するデータもない。','48,000−45,000＝＋3,000円。','合計ではなく差を求める。'],[12,15])
question(6,[39,40,41,42],'販売経路と再来店施策の目的を分ける','再来店、新規客の試用、来店できない客、現金以外の支払いをそれぞれ支援する組合せはどれか。',['ポイント／WEB初回来店案内／WEB宅配／電子決済','電子決済／ポイント／店内座席の増設だけ／現金限定','WEB宅配／現金限定／ポイント／電話を廃止','当日だけの値引き／常連だけへの告知／店内でのみ注文／現金限定'],0,['四施策を各目的へ正しく結び付けている。','ポイントは再来店側であり、現金限定は電子決済希望に合わない。','新規試用と支払手段の目的が合わない。','来店しない客や現金以外の希望に対応していない。'],[21])
question(6,[46],'準固定客への関係づくりを選ぶ','ときどき来る客の顔を思い出した。固定客へつなぐ対応として適切なのはどれか。',['前回の私的な会話を連れの前で詳しく紹介する','来店頻度が低いので挨拶を省く','高い商品を断れないよう勧める','再来店への感謝を伝え、本人の希望に合う案内をする'],3,['個人情報と本人の気持ちに配慮していない。','関係をつくる機会を失う。','本人の選択を尊重しない。','顔を覚えた対応と希望確認で継続的な関係をつくる。'],[21])
question(8,[55,56,57],'応募資料の必要範囲を判定する','面接での履歴書確認として適切なのはどれか。',['年齢だけで採否を決め、仕事の能力を見ない','本人と書類を取り違えず、職務経験など必要事項を確認し、無関係な家族情報を求めない','全応募者へ家族の職業と本籍の証明を求める','写真があれば希望職種や勤務条件は確認しない'],1,['公正な選考の基本に合わない。','必要な本人・職務情報を確認し、目的外の背景調査を避ける。','適性・能力と関係のない情報を一律要求しない。','写真の確認は仕事の条件確認を代替しない。'],[23])
question(8,[58,60,61],'面接で職種・規則・要望を照合する','応募者が希望する職種を話した。面接者の次の確認として最も適切なのはどれか。',['職種に関係なく店の都合だけで確定する','勤務ルールの説明は採用後まで隠す','希望職種と店の仕事内容を照合し、出退勤等のルールと本人の要望を確認する','本人の要望を聞くと採用できなくなるので質問を止める'],2,['双方の認識が食い違うおそれがある。','勤務条件やルールの不明点を残す。','仕事とルールを説明し、本人の希望や相談事項も聞く。','要望確認は一方的な条件押付けを避けるために必要。'],[23])
question(8,[62],'採用確定と関係部署承認を区別する','関係部署の承認後に採用を確定する店で、面接者は採用したいと考えた。伝え方はどれか。',['即決したことにして関係部署へ後で従わせる','採否の連絡方法を示さず帰ってもらう','承認前だが確定通知だけ発行する','店の承認手順を進め、本人へ結果の連絡方法を案内する'],3,['店の承認手順を飛ばしている。','連絡方法が不明では本人が結果を確認できない。','未承認と確定通知が矛盾する。','教材の承認を要する条件と本人への説明を両立する。'],[23])
question(9,[70,71],'指導の目的と道具を区別する','清掃指導で「食品への汚染を防ぐため」と「指定のブラシを使う」を伝えた。二つの要素はどれか。',['目的と道具','質と時間','量と時間','手順と量'],0,['なぜ行うかと、何を使うかを示している。','仕上がり水準や所要時間の説明ではない。','対象範囲や所要時間の説明ではない。','作業順序や対象範囲を表していない。'],[24])
question(9,[72,73,74],'対象範囲・質・標準時間を区別する','清掃の範囲は作業台全体、仕上がりは指定の汚れ残りがない状態、標準時間は店の定める時間とした。要素の対応はどれか。',['全て道具の指定であり範囲とは関係ない','量（範囲）・質・時間を別々に示している','仕上がりは量、対象範囲は時間である','標準時間があれば質と範囲は説明不要'],1,['使う器具ではなく範囲等の条件である。','どこまで、どの水準、何時間という別の条件である。','要素の意味を入れ替えている。','速さだけでは求める作業が定まらない。'],[24])
question(9,[75,82],'育成の段階と導入の目的を読む','作業を教える前に、主任が「注文を聞き違えると誰が困るか」と問いかけた。主な狙いはどれか。',['できるかを見ずに全作業を任せる','学ぶ前に全員を評価済みにする','身近な問題から目的への関心を持たせ、学ぶ準備をつくる','繰り返し練習と実施確認を永久に省く'],2,['まだ実施能力を確認していない。','導入前の問いかけは習得評価の代わりではない。','導入の段階で意味と興味を引き出している。','導入の後も手本・練習・評価が必要。'],[24,25])
question(9,[77],'声のトーンと語調を識別する','言葉の内容は同じでも、声の高低や抑揚と、話すリズムや語尾の強弱を変えて練習した。確認する要素はどれか。',['盛り付け重量と歩留まり','客数と売上高','器具の型番と数量','トーンと語調'],3,['発声の要素ではない。','営業指標ではない。','器具の確認ではない。','声の質・高低・抑揚とリズム・語尾の表現を確かめている。'],[24])
question(16,[91,93,96,97],'防火業務を具体的な計画へ結ぶ','火気の監督、収容人員、追加設備の管理について担当が曖昧だった。最も適切な整理はどれか。',['消防機関や建物管理者と照合し、用途と設備に応じた担当・確認方法を消防計画へ具体化する','「そのほか必要な業務」とだけ書き全員の独断に任せる','忙しい時間は収容人員を確認しない','火気は調理担当だけの問題として責任者は把握しない'],0,['一般的な役割を店舗の具体的運用へ結び付ける。','包括語だけでは実行する責任と手順が不明。','混雑時も必要な管理を省けない。','火気の使用取扱いの監督も防火業務である。'],[26])
question(10,[104,105],'死角の可燃物管理を選ぶ','階段室や洗面所の裏に段ボールがたまり、人目も少ない。放火防止上の対応はどれか。',['避難時に燃えたら移す','可燃物を除き、死角の整理と確認を日常管理へ組み込む','目隠しの布を掛けて確認を止める','倉庫の鍵があれば通路の可燃物は問題にしない'],1,['火災後の対応を前提に放置しない。','可燃物と死角の管理を両方改善する。','見えなくしても危険は除けない。','施錠と可燃物の除去は別の対策。'],[27])
question(10,[108],'応援従業員の誤認を防ぐ','普段いない応援者が来る日の出入管理で、適切なのはどれか。',['知らない顔は事情を聞かず全員不審者と断定する','応援者なら身元と担当を全く確認しない','事前に担当者へ応援の予定と本人確認方法を共有し、店の手順で確かめる','出入を確認するため非常口を全て使用不能にする'],2,['正規の応援者を誤認するおそれがある。','必要な入出管理を省略しない。','既知情報と手順に基づき確認して誤認を防ぐ。','必要な避難可能性を妨げてはいけない。'],[27])
question(10,[109,110],'巡回とプライバシーを両立する','トイレ付近に死角がある。監視計画として適切なのはどれか。',['個室内を常時撮影して客へ説明しない','全店舗で客用と従業員用の共用を法律上必須とする','死角があるので点検を全て止める','プライバシーに配慮した巡回や適切な監視範囲を決める'],3,['私的空間を侵害する監視は採用しない。','教材の運用例を全店共通の義務へ変えている。','死角の存在は対策をなくす理由ではない。','安全な管理とプライバシーの両方を満たす方法を選ぶ。'],[27])
question(10,[111],'不燃と防炎の適用を確認する','飲食店のカーテンを交換する。防火管理上適切なのはどれか。',['対象建物と物品の防炎要件・表示を確認し、内装変更は必要な担当へ照合する','好きな布なら防炎表示の確認は不要','防炎品なら燃えないと保証して火源へ密着させる','すべての装飾品は同じ法的条件だと決める'],0,['建物用途と物品の適用条件を確認する。','対象物品には防炎要件がある。','防炎は絶対に燃えない意味ではない。','物品と用途の条件を分けて確認する。'],[27])
question(16,[114,118],'感知器と洗浄機の点検を適切な処置へつなぐ','感知器の油汚れと、自動洗浄機の作動異常を見つけた。適切なのはどれか。',['作動させるため安全装置を解除する','所定の安全手順で異常を報告し、適切な清掃・点検担当と完了確認を決める','感知器の外見を隠して記録だけ正常にする','洗浄機が動けば汚れた感知器の確認を止める'],1,['安全装置を外して正常と判断しない。','検出した異常を報告と是正へつなげる。','記録や外観を隠しても危険は残る。','別々の対象の異常を相殺できない。'],[28])
# References have explicit child competencies; no invented additional examination for each historical numeric value.
for u in p['units']:
 fs=[f for f in p['facts'] if f['id'] in u['factIds']]
 u['questionIds']=sorted({q for f in fs for q in f['questionIds']});u['assessmentStatus']='assessed_existing_or_new' if u['questionIds'] else 'structural_or_reference_exempt' if u['decision']=='structural_aggregate' or '-ref' in u['unitId'] else 'unassessed_explicit_gap'
 if u['assessmentStatus']=='unassessed_explicit_gap':u['remainingFactGaps'].append('Competency taught, but no exact existing/new assessment is bound; assessment remains unresolved.')
# Figures registered in a separate builder receipt after actual render inspection.
figs=[('cost-comparison',3,[11,19,20,21],'標準と実際を同じ売上の構成で比較する。','標準原価30％と実際原価32％を示す二つの積み上げ棒。差は2ポイント。',[9,14,15]),('hood-damper',16,[115],'フードとダンパーの位置関係を模式断面で確認する。','調理器の上にフードがあり、上部ダクト内にダンパーを示す模式断面。',[28]),('escape-route',10,[101,102,'ref04'],'煙を避ける経路と避難後の確認を分ける。','煙のある出口側を避け、別の開口へ向かう経路を示す独自の平面模式図。',[27,29])]
for name,lesson,units,caption,alt,pages in figs:
 png=ROOT/f'assets/restaurant/source31/operations2/{name}.png';svg=png.with_suffix('.svg');factids=[f['id'] for f in p['facts'] if any(uid(n) in f['unitIds'] for n in units)];fig=dict(id='rst31-operations2-figure-'+name,lessonId=f'rst-2-ops-{lesson:02}',factIds=factids,assetFile=str(png.relative_to(ROOT)),svgFile=str(svg.relative_to(ROOT)),width=1000,height=680,sha256=hashlib.sha256(png.read_bytes()).hexdigest(),svgSha256=hashlib.sha256(svg.read_bytes()).hexdigest(),captionJa=caption,altJa=alt,sourceRefs=refs(pages,'independent controlled explanatory diagram'),scopeLimits='Independent schematic with original geometry. Not device dimensions, repair demonstration, guarantee of safe route, or copied source artwork. Japanese desktop render actually inspected; mobile/integration acceptance remains pending.')
 p['figures'].append(fig)
 for f in p['facts']:
  if f['id'] in factids:f['visualEvidence'].append(dict(kind='new_controlled_figure',figureId=fig['id']))
# Existing visual guides genuinely present; source image artifacts are not copied into repository.
for units,path,component in [([5,'ref01'],'src/data/restaurant/qsc-guide.json','src/components/restaurant/RestaurantQscGuide.tsx'),([22,23,24,'ref02'],'src/data/restaurant/detail-guides.json','src/components/restaurant/RestaurantDetailGuides.tsx'),([26,28],'src/data/restaurant/ordering-exercise.json','src/components/restaurant/RestaurantOrderingExercise.tsx')]:
 for f in p['facts']:
  if any(uid(n) in f['unitIds'] for n in units):f['visualEvidence'].append(dict(kind='existing_independent_native_guide',path=path,componentPath=component,dataAndComponentRead=True,browserVerified=False))
for f in p['facts']:
 if f['statementJa'].startswith(('図の売上100','資料2500','寿司例','寿司図','標準原価は原料単価')):
  f['decision']='reference_excluded';f['referenceExclusionReason']='Exact third-party worked-example numbers are not separately memorization targets or republished tables; required equation, denominator, units and loss competency are taught/tested with independent examples in the same units.'
# No assessment claims for all15Q old matching neighbours: actual attached sources remain traceable.
p['acceptance']['unresolved'] += [u['unitId']+': assessment gap' for u in p['units'] if u['assessmentStatus']=='unassessed_explicit_gap']
(OUT/'packet.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n')
print('FINAL',len(p['facts']),'facts',len(p['additions']),'additions',len(p['questions']),'questions',len(p['figures']),'figures',collections.Counter(u['assessmentStatus'] for u in p['units']))
